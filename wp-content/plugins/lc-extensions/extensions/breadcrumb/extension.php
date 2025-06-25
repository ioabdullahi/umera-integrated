<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_breadcrumb_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'breadcrumb',
			'rank' => 70,
			'title' => 'Breadcrumb',
			'details' => 'https://livecomposerplugin.com/downloads/breadcrumb/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=breadcrumb',
			'description' => 'Display breadcrumb navigation links in your WordPress site with this new module.',	
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'breadcrumb' ) ) :

		define( 'LC_BREADCRUMB_URL', plugin_dir_url( __FILE__ ) );
		define( 'LC_BREADCRUMB_ABS', dirname( __FILE__ ) );
		define( 'LC_BREADCRUMB_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );

		include LC_BREADCRUMB_ABS . '/inc/functions.php';
		include LC_BREADCRUMB_ABS . '/inc/module.php';

	endif; // If is_extension_active.
}

lcproext_breadcrumb_init();

