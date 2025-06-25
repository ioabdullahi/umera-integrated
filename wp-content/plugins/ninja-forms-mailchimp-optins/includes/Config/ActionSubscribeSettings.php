<?php if ( ! defined( 'ABSPATH' ) ) exit;

return array(
	'mailchimp_to' => array(
		'name' => 'mailchimp_to',
		'type' => 'textbox',
		'group' => 'primary',
		'label' => __( 'Email Address (required)', 'ninja-forms-mailchimp-optins' ),
		'placeholder' => __( 'Choose email a field', 'ninja-forms-mailchimp-optins' ),
		'help' => __( 'This email address will be sent to MailChimp.', 'ninja-forms-mailchimp-optins' ),
		'value' => '',
		'width' => 'full',
		'use_merge_tags' => TRUE,
	),
	'mailchimp_action' => array(
		'name' => 'mailchimp_action',
		'type' => 'select',
		'label' => __( 'MailChimp Action', 'ninja-forms-mailchimp-optins' ),
		'group' => 'primary',
		'width' => 'full',
		'options' => array(
			array( 'value' => 'subscribe', 'label' => __( 'Subscribe', 'ninja-forms-mailchimp-optins' ) ),
			array( 'value' => 'unsubscribe', 'label' => __( 'Unsubscribe', 'ninja-forms-mailchimp-optins' ) ),
		),
		'value' => 'subscribe'
	),
	'mailchimp_double_optin' => array(
		'name' => 'mailchimp_double_optin',
		'type' => 'toggle',
		'label' => __( 'Double Optin', 'ninja-forms-mailchimp-optins' ),
		'group' => 'primary',
		'deps' => array(
			'mailchimp_action' => 'subscribe',
		),
	),
	'mailchimp_send_language' => array(
		'name' => 'mailchimp_send_language',
		'type' => 'toggle',
		'label' => __( 'Send User\'s Language Data', 'ninja-forms-mailchimp-optins' ),
		'group' => 'primary',
		'deps' => array(
			'mailchimp_action' => 'subscribe',
		),
	),
	'mailchimp_send_ip' => array(
		'name' => 'mailchimp_send_ip',
		'type' => 'toggle',
		'label' => __( 'Send User\'s IP', 'ninja-forms-mailchimp-optins' ),
		'group' => 'primary',
		'deps' => array(
			'mailchimp_action' => 'subscribe',
		),
	)
);
