<?php if ( ! defined( 'ABSPATH' ) ) exit;

/*
 * Plugin Name: Ninja Forms - Paypal Standard
 * Plugin URI: https://webholics.org
 * Description: Paypal Standard Gateway for Ninja Forms lets you create forms integrated with paypal payment gateway. You can create custom order form and take payments using Paypal standard account.
 * Version: 30.5
 * Author: Webholics
 * Author URI: https://webholics.org
 * Text Domain: ninja-forms-paypal-standard
 *
 * Copyright 2017 Aman Saini.
 */

 /**
	 * Class WH_NF_PaypalStandard
	 */
	final class WH_NF_PaypalStandard {
		const VERSION = '3.5';
		const SLUG    = 'paypal-standard';
		const NAME    = 'Paypal Standard';
		const AUTHOR  = 'Webholics';
		const PREFIX  = 'WH_NF_PaypalStandard';

		/**
		 *
		 *
		 * @var WH_NF_PaypalStandard
		 * @since 3.0
		 */
		private static $instance;

		/**
		 * Plugin Directory
		 *
		 * @since 3.0
		 * @var string $dir
		 */
		public static $dir = '';

		/**
		 * Plugin URL
		 *
		 * @since 3.0
		 * @var string $url
		 */
		public static $url = '';

		/**
		 * Main Plugin Instance
		 *
		 * Insures that only one instance of a plugin class exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @since 3.0
		 * @static
		 * @static var array $instance
		 * @return WH_NF_PaypalStandard Highlander Instance
		 */
		public static function instance() {

			if ( !isset( self::$instance ) && !( self::$instance instanceof WH_NF_PaypalStandard ) ) {
				self::$instance = new WH_NF_PaypalStandard();

				self::$dir = plugin_dir_path( __FILE__ );

				self::$url = plugin_dir_url( __FILE__ );

				/*
				 * Register our autoloader
				 */
				spl_autoload_register( array( self::$instance, 'autoloader' ) );
			}

			return self::$instance;
		}

		public function __construct() {

			add_action( 'parse_request', array( $this, "process_ipn" ) );

			//Add payment metabox to submission page
			add_action( 'add_meta_boxes', array( $this, 'payment_status_meta_box' ) );


			add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ), 50 );

			/*
			 * Optional. If your extension collects a payment (ie Strip, PayPal, etc)...
			 */
			add_filter( 'ninja_forms_register_payment_gateways', array( $this, 'register_payment_gateways' ) );

			 add_filter('nf_react_table_extra_value_keys', array($this, 'addMetabox'));
		}

		public function admin_scripts() {

			wp_enqueue_script( 'paypalstandard', self::$url.'includes/Assets/js/paypalstandard.js', array( 'jquery' ), false, true );

		}

		/**
		* Add a metabox constructor to the react.js submissions page
		*
		* @param array $metaboxHandlers
		* @return array
		*/
		public function addMetabox(array $metaboxHandlers): array
		{
			$metaboxHandlers['paypal-standard'] = 'WH_NF_PaypalStandard_Admin_Metabox';
			return $metaboxHandlers;
		}


		/**
		 * Optional. If your extension collects a payment (ie Strip, PayPal, etc)...
		 */
		public function register_payment_gateways( $payment_gateways ) {
			$payment_gateways[ 'paypal-standard' ] = new WH_NF_PaypalStandard_PaymentGateways_PaypalStandard(); // includes/PaymentGateways/PaypalStandard.php

			return $payment_gateways;
		}

		/*
		 * Optional methods for convenience.
		 */

		public function autoloader( $class_name ) {
			if ( class_exists( $class_name ) ) return;
				//	echo $class_name.'<br/>';
			if ( false === strpos( $class_name, self::PREFIX ) ) return;

			$class_name = str_replace( self::PREFIX, '', $class_name );

			$classes_dir = realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
			$class_file = str_replace( '_', DIRECTORY_SEPARATOR, $class_name ) . '.php';

			if ( file_exists( $classes_dir . $class_file ) ) {
				require_once $classes_dir . $class_file;
			}
			//die;
		}

		/**
		 * Template
		 *
		 * @param string  $file_name
		 * @param array   $data
		 */
		public static function template( $file_name = '', array $data = array() ) {
			if ( ! $file_name ) return;

			extract( $data );

			include self::$dir . 'includes/Templates/' . $file_name;
		}

		/**
		 * Config
		 *
		 * @param unknown $file_name
		 * @return mixed
		 */
		public static function config( $file_name ) {
			return include self::$dir . 'includes/Config/' . $file_name . '.php';
		}


		public static function process_ipn( $wp ) {

			// if ( !self::is_ninjaform_installed() )
			//     return;

			//Ignore requests that are not IPN
			if ( self::get( 'page' ) != "nf_paypal_standard_ipn" )
				return;

			//Send request to paypal and verify it has not been spoofed
			if ( !self::verify_paypal_ipn() ) {

				return;
			}

			//Valid IPN requests must have a custom field
			$custom = self::post( "custom" );
			if ( empty( $custom ) ) {

				return;
			}

			//Getting submission associated with this IPN message (sub id is sent in the "custom" field)
			list( $sub_id, $hash ) = explode( "|", $custom );

			$hash_matches = wp_hash( $sub_id ) == $hash;
			//Validates that Sub Id wasn't tampered with
			if ( !self::post( "test_ipn" ) && !$hash_matches ) {
				return;
			}

			// Update payment status
			if ( self::post( "payment_status" )=='Completed' ) {
				update_post_meta( $sub_id, 'paypal_standard_payment_status', 'Paid' );
				update_post_meta( $sub_id, 'paypal_standard_transaction_id',  self::post( "txn_id" ) );
				update_post_meta( $sub_id, 'paypal_standard_payment_amount',  self::post( "mc_gross" ).' '. self::post( "mc_currency" ) );
				do_action( 'nf_paypal_standard_payment_success', $_POST );
			}


		}


		private static function verify_paypal_ipn() {

			//read the post from PayPal system and add 'cmd'
			$req = 'cmd=_notify-validate';
			foreach ( $_POST as $key => $value ) {
				$value = urlencode( stripslashes( $value ) );
				$req .= "&$key=$value";
			}
			$url = self::post( "test_ipn" ) ? 'https://www.sandbox.paypal.com/cgi-bin/webscr/' : 'https://www.paypal.com/cgi-bin/webscr/';

			//Post back to PayPal system to validate
			$request = new WP_Http();
			$response = $request->post( $url, array( "sslverify" => false, "ssl" => true, "body" => $req, "timeout"=>20 ) );

			return !is_wp_error( $response ) && $response["body"] == "VERIFIED";
		}

		public static function get( $name, $array=null ) {
			if ( !$array )
				$array = $_GET;

			if ( isset( $array[$name] ) )
				return $array[$name];

			return "";
		}


		public static function post( $name ) {
			if ( isset( $_POST[$name] ) )
				return $_POST[$name];

			return "";
		}


		/**
		 * Add payment box to submission page for Ninja Forms
		 *
		 * @author Aman Saini
		 * @since  1.0
		 */
		function payment_status_meta_box( $post_type ) {


			if ( $post_type=='nf_sub' ) {
				add_meta_box(
					'nf_paypal_standard_box'
					, __( 'Paypal Standard', 'ninja_forms' )
					, array( $this, 'render_payment_meta_box_content' )
					, $post_type
					, 'side'
					, 'low'
				);
			}

		}

		/**
		 * Displays the payment status in the submission detail page in admin
		 *
		 * @author Aman Saini
		 * @since  1.0
		 * @return [type] [description]
		 */
		function render_payment_meta_box_content( $post ) {

			do_action( 'nf_paypal_standard_before_payment_metabox' );

			$paypal_payment_status= get_post_meta( $post->ID, 'paypal_standard_payment_status', true );

			// backward compatibility
			$payment_status= get_post_meta( $post->ID, 'payment_standard_status', true );

			$transaction_id= get_post_meta( $post->ID, 'paypal_standard_transaction_id', true );
			$payment_amount= get_post_meta( $post->ID, 'paypal_standard_payment_amount', true );
			if ( ! $payment_status && ! $paypal_payment_status ) {
				$paypal_payment_status ='Not Paid';
			} elseif ( $payment_status ) {
				$paypal_payment_status = $payment_status;
			}
			echo '<p> ';
			_e( 'Payment Status : ', 'ninja_forms' );
			echo $paypal_payment_status.'</p>';

			if ( $transaction_id ) {
				echo '<p>';
				_e( 'Transaction ID : ', 'ninja_forms' );
				echo $transaction_id.'</p>';
			}
			if ( $payment_amount ) {
				echo '<p> ';
				_e( 'Amount : ', 'ninja_forms' );
				echo $payment_amount.'</p>';
			}


			do_action( 'nf_paypal_standard_after_payment_metabox' );

		}

	}

	/**
	 * The main function responsible for returning The Highlander Plugin
	 * Instance to functions everywhere.
	 *
	 * Use this function like you would a global variable, except without needing
	 * to declare the global.
	 *
	 * @since 3.0
	 * @return {class} Highlander Instance
	 */
	function WH_NF_PaypalStandard() {
		return WH_NF_PaypalStandard::instance();
	}

	WH_NF_PaypalStandard();
