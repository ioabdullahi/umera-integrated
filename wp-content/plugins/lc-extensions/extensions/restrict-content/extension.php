<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_restrict_content_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'restrict-content',
			'rank' => 55,
			'title' => 'Restrict Content',
			'details' => 'https://livecomposerplugin.com/downloads/restrict-content/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=restrict-content',
			'description' => 'This extension add full support for Restrict Content plugin. Lock away your exclusive content. Give access to valued members.',
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'restrict-content' ) ) :

		define( 'LCPROEXT_RESTRICT_CONTENT_URL', plugin_dir_url( __FILE__ ) );
		define( 'LCPROEXT_RESTRICT_CONTENT_ABS', dirname( __FILE__ ) );
		define( 'LCPROEXT_RESTRICT_CONTENT_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );

		include LCPROEXT_RESTRICT_CONTENT_ABS . '/inc/module.php';

	endif; // If is_extension_active.
}

lcproext_restrict_content_init();