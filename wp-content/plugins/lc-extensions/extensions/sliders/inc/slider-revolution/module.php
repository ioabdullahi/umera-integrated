<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Slider Revolution
 */

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	exit;
}

/**
 * Module Class
 */
class LCPROEXT_SliderRevolution extends DSLC_Module {

	/**
	 * Unique module id
	 *
	 * @var string
	 */
	var $module_id;

	/**
	 * Module label to show in the page builder
	 *
	 * @var string
	 */
	var $module_title;

	/**
	 * Module icon name (FontAwesome)
	 *
	 * @var string
	 */
	var $module_icon;

	/**
	 * Section in the modules panel that includes this module
	 * Live Composer Extensions should use 'Extensions'
	 *
	 * @var string
	 */
	var $module_category;

	function __construct() {

		$this->module_id = 'LCPROEXT_SliderRevolution';
		$this->module_title = __( 'Slider (Revolution)', 'lcproext' );
		$this->module_icon = 'picture';
		$this->module_category = 'Extensions';

	}

	/**
	 * Module options.
	 * Function build array with all the module functionality and styling options.
	 * Based on this array Live Composer builds module settings panel.
	 * – Every array inside $dslc_options means one option = one control.
	 * – Every option should have unique (for this module) id.
	 * – Options divides on "Functionality" and "Styling".
	 * – Styling options start with css_XXXXXXX
	 * – Responsive options start with css_res_t_ (Tablet) or css_res_p_ (Phone)
	 * – Options can be hidden.
	 * – Options can have a default value.
	 * – Options can request refresh from server on change or do live refresh via CSS.
	 *
	 * @return array All the module options in array.
	 */
	function options() {

		// Check if we have this module options already calculated
		// and cached in WP Object Cache.
		$cached_dslc_options = wp_cache_get( 'dslc_options_' . $this->module_id, 'dslc_modules' );
		if ( $cached_dslc_options ) {
			return apply_filters( 'dslc_module_options', $cached_dslc_options, $this->module_id );
		}

		// Get Rev Sliders
		global $wpdb;
		$table_name = $wpdb->prefix . 'revslider_sliders';
		$sliders = $wpdb->get_results( "SELECT id, title, alias FROM $table_name" );
		$slider_choices = array();

		$slider_choices[] = array(
			'label' => __( '-- Select --', 'lcproext' ),
			'value' => 'not_set',
		);

		if ( ! empty( $sliders ) ) {

			foreach ( $sliders as $slider ) {
				$slider_choices[] = array(
					'label' => $slider->title,
					'value' => $slider->alias,
				);
			}
		}

		$dslc_options = array(
			array(
				'label' => __( 'Show On', 'lcproext' ),
				'id' => 'css_show_on',
				'std' => 'desktop tablet phone',
				'type' => 'checkbox',
				'choices' => array(
					array(
						'label' => __( 'Desktop', 'lcproext' ),
						'value' => 'desktop',
					),
					array(
						'label' => __( 'Tablet', 'lcproext' ),
						'value' => 'tablet',
					),
					array(
						'label' => __( 'Phone', 'lcproext' ),
						'value' => 'phone',
					),
				),
			),
			array(
				'label' => __( 'Revolution Slider', 'lcproext' ),
				'id' => 'slider',
				'std' => 'not_set',
				'type' => 'select',
				'choices' => $slider_choices,
			),
		);

		$dslc_options = array_merge( $dslc_options, $this->shared_options( 'animation_options', array(
			'hover_opts' => false,
		) ) );
		$dslc_options = array_merge( $dslc_options, $this->presets_options() );

		// Cache calculated array in WP Object Cache.
		wp_cache_add( 'dslc_options_' . $this->module_id, $dslc_options, 'dslc_modules' );

		return apply_filters( 'dslc_module_options', $dslc_options, $this->module_id );

	}
	/**
	 * Module HTML output.
	 *
	 * @param  array $options Module options to fill the module template.
	 * @return void
	 */
	function output( $options ) {

		global $dslc_active;

		if ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
			$dslc_is_admin = true;
		} else { $dslc_is_admin = false;
		}

		/* Module output stars here */

		if ( ! isset( $options['slider'] ) || $options['slider'] == 'not_set' ) {

			if ( $dslc_is_admin ) :
				?><div class="dslc-notification dslc-red"><?php _e( 'Click the cog icon on the right of this box to choose which slider to show.', 'lcproext' ); ?> <span class="dslca-module-edit-hook dslc-icon dslc-icon-cog"></span></span></div><?php
		endif;

		} else {

			echo '[rev_slider ' . $options['slider'] . ']';

		}
	}
}

/**
 * Register Module
 */
function lcsliderrevoludtion_init_module() {
	return dslc_register_module( 'LCPROEXT_SliderRevolution' );
}
add_action( 'dslc_hook_register_modules', 'lcsliderrevoludtion_init_module' );
