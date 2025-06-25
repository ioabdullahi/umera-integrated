<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_preloader_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'preloader',
			'rank' => 65,
			'title' => 'Preloader',
			'details' => 'https://livecomposerplugin.com/downloads/preloader/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=preloader',
			'description' => 'Add a responsive preloader to your website, fully customizable, compatible with all major browsers.',				
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'preloader' ) ) :

		define( 'LC_PRELOADER_URL', plugin_dir_url( __FILE__ ) );
		define( 'LC_PRELOADER_ABS', dirname( __FILE__ ) );
		define( 'LC_PRELOADER_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );

		include LC_PRELOADER_ABS . '/inc/functions.php';

	endif; // If is_extension_active.
}

lcproext_preloader_init();

