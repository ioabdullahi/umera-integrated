<?php
/**
 * Master Slider plugin integration
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * In this file we integrate MasterSlider with our theme:
 *    – Disable automatic plugin updates
 *    – Create a function for demo sliders import
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 *
 * -------------------------------------------------------------------
 *
 * Send your ideas on code improvement or new hook requests using
 * contact form on https://themeforest.net/user/blueastralthemes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly


// Check if MasterSlider AND Live Composer plugins are active
if ( defined( 'MSWP_AVERTA_VERSION' ) && defined( 'DS_LIVE_COMPOSER_URL' ) ) {
	// Disabling the auto-update feature.
	add_filter( 'masterslider_disable_auto_update', '__return_true' );

	/**
	 * ----------------------------------------------------------------------
	 * Add MASTER SLIDER module on LC list of modules
	 */

	add_action( 'dslc_hook_register_modules', 'lbmn_register_module_master_slider' );
	function lbmn_register_module_master_slider() {
		return dslc_register_module( 'LBMN_MasterSlider' );
	}

	class LBMN_MasterSlider extends DSLC_Module {

		var $module_id;
		var $module_title;
		var $module_icon;
		var $module_category;

		function __construct() {
			$this->module_id       = 'LBMN_MasterSlider';
			$this->module_title    = esc_attr__( 'Master Slider', 'seowp' );
			$this->module_icon     = 'picture';
			$this->module_category = 'Extensions';

			if ( ! wp_script_is( 'masterslider-core', 'registered' ) ) {
				if ( class_exists( 'MSP_Frontend_Assets' ) ) {
					$msp_fa = new MSP_Frontend_Assets();
					wp_register_script(
						'masterslider-core',
						$msp_fa->assets_dir . '/js/masterslider.min.js',
						array( 'jquery', 'jquery-easing' ),
						$msp_fa->version,
						true
					);

					wp_enqueue_script( 'masterslider-core' );
				} else {
					return false;
				}
			}
		}

		function options() {
			// Get sliders.
			global $wpdb;
			$table_name     = $wpdb->prefix . 'masterslider_sliders';
			$sliders        = $wpdb->get_results( "SELECT ID, title FROM {$table_name}" );
			$slider_choices = array();

			$slider_choices[] = array(
				'label' => esc_attr__( '-- Select --', 'seowp' ),
				'value' => 'not_set',
			);

			if ( ! empty( $sliders ) ) {
				foreach ( $sliders as $slider ) {
					$slider_choices[] = array(
						'label' => $slider->title,
						'value' => $slider->ID,
					);
				}
			}

			$dslc_options = array(
				array(
					'label'   => esc_attr__( 'Master Slider', 'seowp' ),
					'id'      => 'masterslider_id',
					'std'     => 'not_set',
					'type'    => 'select',
					'choices' => $slider_choices,
				),
			);

			$dslc_options = array_merge( $dslc_options, $this->shared_options( 'animation_options' ) );
			$dslc_options = array_merge( $dslc_options, $this->presets_options() );

			return apply_filters( 'dslc_module_options', $dslc_options, $this->module_id );
		}

		function output( $options ) {
			global $dslc_active;

			$dslc_is_admin = ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) ? true : false;
			$this->module_start( $options );

			if ( ! isset( $options['masterslider_id'] ) || $options['masterslider_id'] == 'not_set' ) {
				if ( $dslc_is_admin ) :
					?>
					<div class="dslc-notification dslc-red"><?php esc_attr_e( 'Click the cog icon on the right of this box to choose which slider to show.', 'seowp' ); ?>
					<span class="dslca-module-edit-hook dslc-icon dslc-icon-cog"></span></span></div><?php
				endif;
			} else {
				echo do_shortcode( '[masterslider id="' . esc_attr( $options['masterslider_id'] ) . '"]' );
			}

			$this->module_end( $options );
		}
	}
} //defined('MSWP_AVERTA_VERSION')
