<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_headroom_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'headroom',
			'rank' => 75,
			'title' => 'Autohide header',
			'details' => 'https://livecomposerplugin.com/downloads/autohide-header/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=autohide-header',
			'description' => 'Extend the header functionality with this feature. The header is hidden on page scroll with a smooth animation.',				
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'headroom' ) ) :

		define( 'LC_HEADROOM_URL', plugin_dir_url( __FILE__ ) );
		define( 'LC_HEADROOM_ABS', dirname( __FILE__ ) );
		define( 'LC_HEADROOM_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );

		include LC_HEADROOM_ABS . '/inc/functions.php';

	endif; // If is_extension_active.
}

lcproext_headroom_init();

