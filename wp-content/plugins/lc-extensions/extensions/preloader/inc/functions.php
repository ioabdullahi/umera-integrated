<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Preloader
 */

function lcproext_preloader_options() {

	global $dslc_plugin_options;

	$dslc_plugin_options['dslc_plugin_options_preloader'] = array(
		'title' => __( 'Preloader', 'lcproext' ),
		'options' => array(
			'lc_preloader_engine' => array(

				'section' => 'dslc_plugin_options_preloader',
				'label' => __( 'Basic Preloader', 'lcproext' ),
				'std' => 'enabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => 'Enabled',
						'value' => 'enabled',
					),
					array(
						'label' => 'Disabled',
						'value' => 'disabled',
					),
				),
			),
			'lc_preloader_type' => array(

				'section' => 'dslc_plugin_options_preloader',
				'label' => __( 'Select Preloader', 'lcproext' ),
				'std' => 'spinner',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => 'None',
						'value' => 'none',
					),
					array(
						'label' => 'Spinner',
						'value' => 'spinner',
					),
					array(
						'label' => 'Eclipse',
						'value' => 'eclipse',
					),
					array(
						'label' => 'Spin',
						'value' => 'spin',
					),
					array(
						'label' => 'Dual Ring',
						'value' => 'dual-ring',
					),
					array(
						'label' => 'Pacman',
						'value' => 'pacman',
					),
				),
			),
		),
	);

} add_action( 'init', 'lcproext_preloader_options', 10 );

/**
 * Custom body classes
 */
function lcproext_body_classes( $classes ) {

	global $dslc_active;

	if ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
		$dslc_is_admin = true;
	} else {
		$dslc_is_admin = false;
	}

	if ( ! $dslc_active ) {
		$lc_preloader_engine = dslc_get_option( 'lc_preloader_engine', 'dslc_plugin_options_preloader' );

		// Enable Page Preloading Effect.
		if ( 'enabled' === $lc_preloader_engine ) {
			$classes[] = 'lcext-body';
		}
	}

	return $classes;
}
add_filter( 'body_class', 'lcproext_body_classes' );

/**
 * Add JavaScript
 */
function lcpreloader_script() {

	global $dslc_active;

	if ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
		$dslc_is_admin = true;
	} else {
		$dslc_is_admin = false;
	}

	if ( ! $dslc_active ) {
		$lc_preloader_engine = dslc_get_option( 'lc_preloader_engine', 'dslc_plugin_options_preloader' );
		$lc_preloader_type = dslc_get_option( 'lc_preloader_type', 'dslc_plugin_options_preloader' );

		// Enable Page Preloading Effect.
		if ( ( 'enabled' === $lc_preloader_engine ) && ( 'none' !== $lc_preloader_type ) ) {
			wp_enqueue_style( 'lcproext-preloader', LC_PRELOADER_URL . 'css/main.css' );
			wp_enqueue_script( 'lcproext-preloader', LC_PRELOADER_URL . 'js/main.js', false );

			// Localize the script with new data
			$localized_array = lcext_localized_script();
			wp_localize_script( 'lcproext-preloader', 'lcext_preloader', $localized_array );
		}
	}
}
add_action( 'wp_enqueue_scripts', 'lcpreloader_script' );

function lcext_localized_script(){
	$lcext_preloader = dslc_get_option( 'lc_preloader_type', 'dslc_plugin_options_preloader' );
	return $lcext_preloader;
}