<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_contact_forms_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'contact-forms',
			'rank' => 50,
			'title' => 'Contact Forms Integration',
			'details' => 'https://livecomposerplugin.com/downloads/contact-forms/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=contact-forms',
			'description' => 'Creates modules for third-party contact form plugins. Drag and drop contact form module on the page instead of dealing with shortcodes.',
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'contact-forms' ) ) :

		define( 'LCPROEXT_CONTACT_FORMS_URL', plugin_dir_url( __FILE__ ) );
		define( 'LCPROEXT_CONTACT_FORMS_ABS', dirname( __FILE__ ) );
		define( 'LCPROEXT_CONTACT_FORMS_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );

		// Check if active SEOWP theme.
		// SEOWP uses old version of the Ninja Forms module id (module name).
		// Besides that, both legacy and current modules are identical.
		if ( ! function_exists( 'lbmn_setup' ) ) {
			include LCPROEXT_CONTACT_FORMS_ABS . '/inc/ninja-forms/module.php';
		} else {
			include LCPROEXT_CONTACT_FORMS_ABS . '/inc/ninja-forms-legacy/module.php';
		}

		include LCPROEXT_CONTACT_FORMS_ABS . '/inc/contact-form-7/module.php';

		if ( class_exists('RGForms') ) {
			include LCPROEXT_CONTACT_FORMS_ABS . '/inc/gravity-forms/module.php';
		}

	endif; // If is_extension_active.
}

lcproext_contact_forms_init();