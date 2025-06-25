<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_paymentbutton_init() {
	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'payment-button',
			'rank' => 60,
			'title' => 'Payment Button',
			'details' => 'https://livecomposerplugin.com/downloads/paymnet-button/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=payment-button',
			'description' => 'Fast and easy way to send clients to the Stripe payment page. The extension adds a new module.',
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'payment-button' ) ) {
		include dirname( __FILE__ ) . '/inc/module.php';
		add_action( 'wp_enqueue_scripts', 'lcproext_paymentbutton_scripts' );
	}
}

function lcproext_paymentbutton_scripts() {
	wp_enqueue_script( 'lcproext-pay-js', 'https://js.stripe.com/v3/' );
}

// Add Stripe script.
// Stripe requires their script on every page https://stripe.com/docs/web/setup#setup
// add_action( 'wp_enqueue_scripts', 'lcproext_paymentbutton_scripts' );
// add_action( 'wp_enqueue_scripts', 'lcproext_paymentbutton_scripts', array(), LC_Extensions_Core::get_version(), false  );

lcproext_paymentbutton_init();
