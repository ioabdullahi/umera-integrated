<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_openstreetmap_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'openstreetmap',
			'rank' => 60,
			'title' => 'Open Street Map',
			'details' => 'https://livecomposerplugin.com/downloads/open-street-map/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=open-street-map',
			'description' => 'Fast and easy way to display an Open Street Maps map on your Live Composer powered website. The extension adds a new module.',				
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'openstreetmap' ) ) :

		define( 'LC_OPENSTREETMAP_URL', plugin_dir_url( __FILE__ ) );
		define( 'LC_OPENSTREETMAP_ABS', dirname( __FILE__ ) );

		include LC_OPENSTREETMAP_ABS . '/inc/functions.php';
		include LC_OPENSTREETMAP_ABS . '/inc/module.php';

		/**
		 * Add CSS
		 */
		function lcopensreetmap_style() {
			wp_enqueue_style( 'lc-opensstreetmap', LC_OPENSTREETMAP_URL . 'css/leaflet.css' );
			wp_enqueue_script( 'lc-opensstreetmap-js', LC_OPENSTREETMAP_URL . 'js/leaflet.js', false );
		}
		add_action( 'wp_enqueue_scripts', 'lcopensreetmap_style' );

	endif; // If is_extension_active.
}

lcproext_openstreetmap_init();

