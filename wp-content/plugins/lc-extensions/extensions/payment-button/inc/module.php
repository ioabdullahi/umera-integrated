<?php

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	exit;
}
/**
 * Register Module
 */
add_action( 'dslc_hook_register_modules', 'lcpaymentbutton_init_module' );

function lcpaymentbutton_init_module() {
	return dslc_register_module( 'DSLC_Payment_Button' );
}


class DSLC_Payment_Button extends DSLC_Module {

	public $module_id;
	public $module_title;
	public $module_icon;
	public $module_category;

	function __construct() {
		$this->module_id = 'DSLC_Payment_Button';
		$this->module_title = __( 'Payment Button', 'live-composer-page-builder' );
		$this->module_icon = 'dollar';
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

		// Custom classes fix
		if ( ! empty( $_POST['button_class'] ) ) {

			$_POST['custom_class'] = $_POST['button_class'];
			$_POST['button_class'] = '';
		}

		$dslc_options = array(

			array(
				'label' => __( 'Show On', 'live-composer-page-builder' ),
				'id' => 'css_show_on',
				'std' => 'desktop tablet phone',
				'type' => 'checkbox',
				'choices' => array(
					array(
						'label' => __( 'Desktop', 'live-composer-page-builder' ),
						'value' => 'desktop',
					),
					array(
						'label' => __( 'Tablet', 'live-composer-page-builder' ),
						'value' => 'tablet',
					),
					array(
						'label' => __( 'Phone', 'live-composer-page-builder' ),
						'value' => 'phone',
					),
				),
			),

			/* array(
				'label' => __( 'Payment Method', 'live-composer-page-builder' ),
				'id' => 'payment_method',
				'std' => 'stripe_checkout',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Stripe Checkout', 'live-composer-page-builder' ),
						'value' => 'stripe_checkout',
					),
					array(
						'label' => __( 'Custom URL', 'live-composer-page-builder' ),
						'value' => 'url',
					),
				),
			), */

			array(
				'label' => __( 'Stripe Checkout – required', 'live-composer-page-builder' ),
				'id' => 'stripe_settings',
				'type' => 'group',
				'action' => 'open',
			),

				array(
					'label' => __( 'Stripe Publishable API', 'live-composer-page-builder' ),
					'help' => __( 'Your API keys are available in the Stripe Dashboard', 'live-composer-page-builder' ),
					'id' => 'stripe_api',
					'std' => '',
					'type' => 'text',
				),

				array(
					'label' => __( 'Product SKU or plan ID', 'live-composer-page-builder' ),
					'help' => __( 'Single SKU or the next format for multiply items:<br><b>sku : quantity; sku : quantity; sku : quantity</b>', 'live-composer-page-builder' ),
					'id' => 'stripe_sku',
					'std' => '',
					'type' => 'textarea',
				),

			array(
				'id' => 'stripe_settings',
				'type' => 'group',
				'action' => 'close',
			),


			array(
				'label' => __( 'After The Payment – required', 'live-composer-page-builder' ),
				'id' => 'after_payment_settings',
				'type' => 'group',
				'action' => 'open',
			),

				array(
					'label' => __( 'Success URL', 'live-composer-page-builder' ),
					'help' => __( 'When your customer successfully completes their payment, they are redirected to the success URL.', 'live-composer-page-builder' ),
					'id' => 'success_url',
					'std' => home_url() . '/success/',
					'type' => 'text',
				),

				array(
					'label' => __( 'Cancel URL', 'live-composer-page-builder' ),
					'help' => __( 'When your customer cancels the payment, they are redirected to the cancel URL.', 'live-composer-page-builder' ),
					'id' => 'cancel_url',
					'std' => home_url() . '/canceled/',
					'type' => 'text',
				),

			array(
				'id' => 'after_payment_settings',
				'type' => 'group',
				'action' => 'close',
			),

			// ============================================================

			array(
				'label' => __( 'Custom Classes', 'live-composer-page-builder' ),
				'id' => 'button_class',
				'std' => '',
				'type' => 'text',
				'visibility' => 'hidden',
			),

			/**
			 * Styling
			 */

			array(
				'label' => __( 'Button Text', 'live-composer-page-builder' ),
				'id' => 'button_text',
				'std' => 'Buy Now',
				'type' => 'text',
				'visibility' => 'hidden',
			),
			/* array(
				'label' => __( 'URL', 'live-composer-page-builder' ),
				'id' => 'button_url',
				'std' => '#',
				'type' => 'text',
			),
			 */
			array(
				'id' => 'link_nofollow',
				'std' => '',
				'type' => 'checkbox',
				'help' => __( 'Nofollow tells search engines to not follow this specific link', 'live-composer-page-builder' ),
				'choices' => array(
					array(
						'label' => __( 'Nofollow', 'live-composer-page-builder' ),
						'value' => 'nofollow',
					),
				),
			),

			array(
				'label' => __( 'Align', 'live-composer-page-builder' ),
				'id' => 'css_align',
				'std' => 'left',
				'type' => 'text_align',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'text-align',
				'section' => 'styling',
			),

			array(
				'label' => __( 'Background', 'live-composer-page-builder' ),
				'id' => 'css_bg_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
			),
				array(
					'label' => __( 'Color', 'live-composer-page-builder' ),
					'id' => 'css_bg_color',
					'std' => '#5890e5',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Color - Hover', 'live-composer-page-builder' ),
					'id' => 'css_bg_color_hover',
					'std' => '#4b7bc2',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a:hover',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
				),

				array(
					'label' => __( 'Effect', 'live-composer-page-builder' ),
					'id' => 'css_bg_effect',
					'std' => 'none',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'None', 'live-composer-page-builder' ),
							'value' => 'none',
						),
						array(
							'label' => __( 'Gradient', 'live-composer-page-builder' ),
							'value' => 'gradient',
						),
					),
					'refresh_on_change' => true,
					// 'affect_on_change_el' => '.dslc-button a',
					// 'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'dependent_controls' => array(
						'gradient' => 'css_bg_effect_direction, css_bg_effect_color, css_bg_effect_intensity',
					),
				),

				array(
					'label' => __( 'Color Mode', 'live-composer-page-builder' ),
					'id' => 'css_bg_effect_color',
					'std' => 'lighten',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Lighten', 'live-composer-page-builder' ),
							'value' => 'lighten',
						),
						array(
							'label' => __( 'Darken', 'live-composer-page-builder' ),
							'value' => 'darken',
						),
					),
					'refresh_on_change' => true,
					// 'affect_on_change_el' => '.dslc-button a',
					// 'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
				),

				array(
					'label' => __( 'Direction', 'live-composer-page-builder' ),
					'id' => 'css_bg_effect_direction',
					'std' => 'top-right',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => '⬆️',
							'value' => 'top',
						),
						array(
							'label' => '↗️',
							'value' => 'top-right',
						),
						array(
							'label' => '➡️',
							'value' => 'right',
						),
						array(
							'label' => '↘️',
							'value' => 'bottom-right',
						),
						array(
							'label' => '⬇️',
							'value' => 'bottom',
						),
						array(
							'label' => '↙️',
							'value' => 'bottom-left',
						),
						array(
							'label' => '⬅️',
							'value' => 'left',
						),
						array(
							'label' => '↖️',
							'value' => 'top-left',
						),
					),
					'refresh_on_change' => true,
					// 'affect_on_change_el' => '.dslc-button a',
					// 'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
				),

				array(
					'label' => __( 'Intensity', 'live-composer-page-builder' ),
					'id' => 'css_bg_effect_intensity',
					'onlypositive' => true, // Value can't be negative.
					'max' => 1,
					'std' => 1,
					'increment' => 0.05,
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a:before',
					'affect_on_change_rule' => 'opacity',
					'section' => 'styling',
				),

			array(
				'id' => 'css_bg_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),

			array(
				'label' => __( 'Border', 'live-composer-page-builder' ),
				'id' => 'css_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
			),

				array(
					'label' => __( 'Color', 'live-composer-page-builder' ),
					'id' => 'css_border_color',
					'std' => '#000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Color - Hover', 'live-composer-page-builder' ),
					'id' => 'css_border_color_hover',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a:hover',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Width', 'live-composer-page-builder' ),
					'id' => 'css_border_width',
					'onlypositive' => true, // Value can't be negative.
					'max' => 10,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Borders', 'live-composer-page-builder' ),
					'id' => 'css_border_trbl',
					'std' => 'top right bottom left',
					'type' => 'checkbox',
					'choices' => array(
						array(
							'label' => __( 'Top', 'live-composer-page-builder' ),
							'value' => 'top',
						),
						array(
							'label' => __( 'Right', 'live-composer-page-builder' ),
							'value' => 'right',
						),
						array(
							'label' => __( 'Bottom', 'live-composer-page-builder' ),
							'value' => 'bottom',
						),
						array(
							'label' => __( 'Left', 'live-composer-page-builder' ),
							'value' => 'left',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Radius', 'live-composer-page-builder' ),
					'id' => 'css_border_radius',
					'onlypositive' => true, // Value can't be negative.
					'std' => '3',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button a',
					'affect_on_change_rule' => 'border-radius',
					'section' => 'styling',
					'ext' => 'px',
				),

			array(
				'id' => 'css_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),

			array(
				'label' => __( 'Margin', 'live-composer-page-builder' ),
				'id' => 'css_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
			),
				array(
					'label' => __( 'Top', 'live-composer-page-builder' ),
					'id' => 'css_margin_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'live-composer-page-builder' ),
					'id' => 'css_margin_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'live-composer-page-builder' ),
					'id' => 'css_margin_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'live-composer-page-builder' ),
					'id' => 'css_margin_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-button',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'ext' => 'px',
				),
			array(
				'id' => 'css_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),

			array(
				'label' => __( 'Minimum Height', 'live-composer-page-builder' ),
				'id' => 'css_min_height',
				'onlypositive' => true, // Value can't be negative.
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'min-height',
				'section' => 'styling',
				'ext' => 'px',
				// 'min' => 0,
				// 'max' => 2000,
				// 'increment' => 5,
			),
			array(
				'label' => __( 'Padding Vertical', 'live-composer-page-builder' ),
				'id' => 'css_padding_vertical',
				'onlypositive' => true, // Value can't be negative.
				'max' => 50,
				'std' => '12',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'padding-top,padding-bottom',
				'section' => 'styling',
				'ext' => 'px',
			),
			array(
				'label' => __( 'Padding Horizontal', 'live-composer-page-builder' ),
				'id' => 'css_padding_horizontal',
				'onlypositive' => true, // Value can't be negative.
				'std' => '12',
				'max' => 50,
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'padding-left,padding-right',
				'section' => 'styling',
				'ext' => 'px',
			),
			array(
				'label' => __( 'Width', 'live-composer-page-builder' ),
				'id' => 'css_width',
				'std' => 'inline-block',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Automatic', 'live-composer-page-builder' ),
						'value' => 'inline-block',
					),
					array(
						'label' => __( 'Full Width', 'live-composer-page-builder' ),
						'value' => 'block',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'display',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Box Shadow', 'live-composer-page-builder' ),
				'id' => 'css_box_shadow',
				'std' => '',
				'type' => 'box_shadow',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'box-shadow',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Box Shadow - Hover', 'live-composer-page-builder' ),
				'id' => 'css_box_shadow_hover',
				'std' => '',
				'type' => 'box_shadow',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a:hover',
				'affect_on_change_rule' => 'box-shadow',
				'section' => 'styling',
			),

			/**
			 * Typography
			 */

			array(
				'label' => __( 'Color', 'live-composer-page-builder' ),
				'id' => 'css_button_color',
				'std' => '#ffffff',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'color',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Color - Hover', 'live-composer-page-builder' ),
				'id' => 'css_button_color_hover',
				'std' => '#ffffff',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a:hover',
				'affect_on_change_rule' => 'color',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Font Size', 'live-composer-page-builder' ),
				'id' => 'css_button_font_size',
				'onlypositive' => true, // Value can't be negative.
				'max' => 50,
				'std' => '11',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'font-size',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Font Style', 'live-composer-page-builder' ),
				'id' => 'css_button_font_style',
				'std' => 'normal',
				'type' => 'select',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'font-style',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
				'choices' => array(
					array(
						'label' => __( 'Normal', 'live-composer-page-builder' ),
						'value' => 'normal',
					),
					array(
						'label' => __( 'Italic', 'live-composer-page-builder' ),
						'value' => 'italic',
					),
				),
			),
			array(
				'label' => __( 'Font Weight', 'live-composer-page-builder' ),
				'id' => 'css_button_font_weight',
				'std' => '800',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => '100 - Thin',
						'value' => '100',
					),
					array(
						'label' => '200 - Extra Light',
						'value' => '200',
					),
					array(
						'label' => '300 - Light',
						'value' => '300',
					),
					array(
						'label' => '400 - Normal',
						'value' => '400',
					),
					array(
						'label' => '500 - Medium',
						'value' => '500',
					),
					array(
						'label' => '600 - Semi Bold',
						'value' => '600',
					),
					array(
						'label' => '700 - Bold',
						'value' => '700',
					),
					array(
						'label' => '800 - Extra Bold',
						'value' => '800',
					),
					array(
						'label' => '900 - Black',
						'value' => '900',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'font-weight',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
				'ext' => '',
			),
			array(
				'label' => __( 'Font Family', 'live-composer-page-builder' ),
				'id' => 'css_button_font_family',
				'std' => 'Lato',
				'type' => 'font',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'font-family',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Text Transform', 'live-composer-page-builder' ),
				'id' => 'css_button_text_transform',
				'std' => 'none',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'None', 'live-composer-page-builder' ),
						'value' => 'none',
					),
					array(
						'label' => __( 'Capitalize', 'live-composer-page-builder' ),
						'value' => 'capitalize',
					),
					array(
						'label' => __( 'Uppercase', 'live-composer-page-builder' ),
						'value' => 'uppercase',
					),
					array(
						'label' => __( 'Lowercase', 'live-composer-page-builder' ),
						'value' => 'lowercase',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'text-transform',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Letter Spacing', 'live-composer-page-builder' ),
				'id' => 'css_button_letter_spacing',
				'max' => 30,
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'letter-spacing',
				'section' => 'styling',
				'tab' => __( 'Typography', 'live-composer-page-builder' ),
				'ext' => 'px',
				'min' => -50,
				'max' => 50,
			),

			/**
			 * Icon
			 */

			array(
				'label' => __( 'Enable/Disable', 'live-composer-page-builder' ),
				'id' => 'button_state',
				'std' => 'enabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Disabled', 'live-composer-page-builder' ),
						'value' => 'disabled',
					),
					array(
						'label' => __( 'Enabled', 'live-composer-page-builder' ),
						'value' => 'enabled',
					),
				),
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
				'dependent_controls' => array(
					'enabled' => 'icon_pos, button_icon_id, css_icon_color, css_icon_color_hover, css_icon_margin, css_icon_margin_left, show_icon, button_inline_svg, css_button_icon_size_svg',
				),
			),
			array(
				'label' => __( 'Position', 'live-composer-page-builder' ),
				'id' => 'icon_pos',
				'std' => 'left',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Left', 'live-composer-page-builder' ),
						'value' => 'left',
					),
					array(
						'label' => __( 'Right', 'live-composer-page-builder' ),
						'value' => 'right',
					),
				),
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Show Icon', 'live-composer-page-builder' ),
				'id' => 'show_icon',
				'std' => 'font',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Font', 'live-composer-page-builder' ),
						'value' => 'font',
					),
					array(
						'label' => __( 'SVG', 'live-composer-page-builder' ),
						'value' => 'svg',
					),
				),
				'help' => __( 'Select type of icon.', 'live-composer-page-builder' ),
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Icon', 'live-composer-page-builder' ),
				'id' => 'button_icon_id',
				'std' => 'dollar',
				'type' => 'icon',
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Inline SVG', 'live-composer-page-builder' ),
				'id' => 'button_inline_svg',
				'std' => '',
				'type' => 'textarea',
				'section' => 'styling',
				'help' => __( 'Paste your SVG code.', 'live-composer-page-builder' ),
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Size ( SVG )', 'live-composer-page-builder' ),
				'id' => 'css_button_icon_size_svg',
				'std' => '11',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a svg',
				'affect_on_change_rule' => 'width, height',
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Color', 'live-composer-page-builder' ),
				'id' => 'css_icon_color',
				'std' => '#ffffff',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a .dslc-icon, .dslc-button a svg',
				'affect_on_change_rule' => 'color, fill',
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Color - Hover', 'live-composer-page-builder' ),
				'id' => 'css_icon_color_hover',
				'std' => '#ffffff',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a:hover .dslc-icon, .dslc-button:hover a svg',
				'affect_on_change_rule' => 'color, fill',
				'section' => 'styling',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Margin Right', 'live-composer-page-builder' ),
				'id' => 'css_icon_margin',
				'std' => '5',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a .dslc-icon, .dslc-button a svg',
				'affect_on_change_rule' => 'margin-right',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Margin Left', 'live-composer-page-builder' ),
				'id' => 'css_icon_margin_left',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a .dslc-icon, .dslc-button a svg',
				'affect_on_change_rule' => 'margin-left',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Icon', 'live-composer-page-builder' ),
			),

			/**
			 * Wrapper
			 */

			array(
				'label' => __( 'BG Color', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_bg_color',
				'std' => '',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'background-color',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'BG Image', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_bg_img',
				'std' => '',
				'type' => 'image',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'background-image',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'BG Image Repeat', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_bg_img_repeat',
				'std' => 'repeat',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Repeat', 'live-composer-page-builder' ),
						'value' => 'repeat',
					),
					array(
						'label' => __( 'Repeat Horizontal', 'live-composer-page-builder' ),
						'value' => 'repeat-x',
					),
					array(
						'label' => __( 'Repeat Vertical', 'live-composer-page-builder' ),
						'value' => 'repeat-y',
					),
					array(
						'label' => __( 'Do NOT Repeat', 'live-composer-page-builder' ),
						'value' => 'no-repeat',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'background-repeat',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'BG Image Attachment', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_bg_img_attch',
				'std' => 'scroll',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Scroll', 'live-composer-page-builder' ),
						'value' => 'scroll',
					),
					array(
						'label' => __( 'Fixed', 'live-composer-page-builder' ),
						'value' => 'fixed',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'background-attachment',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'BG Image Position', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_bg_img_pos',
				'std' => 'top left',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Top Left', 'live-composer-page-builder' ),
						'value' => 'left top',
					),
					array(
						'label' => __( 'Top Right', 'live-composer-page-builder' ),
						'value' => 'right top',
					),
					array(
						'label' => __( 'Top Center', 'live-composer-page-builder' ),
						'value' => 'Center Top',
					),
					array(
						'label' => __( 'Center Left', 'live-composer-page-builder' ),
						'value' => 'left center',
					),
					array(
						'label' => __( 'Center Right', 'live-composer-page-builder' ),
						'value' => 'right center',
					),
					array(
						'label' => __( 'Center', 'live-composer-page-builder' ),
						'value' => 'center center',
					),
					array(
						'label' => __( 'Bottom Left', 'live-composer-page-builder' ),
						'value' => 'left bottom',
					),
					array(
						'label' => __( 'Bottom Right', 'live-composer-page-builder' ),
						'value' => 'right bottom',
					),
					array(
						'label' => __( 'Bottom Center', 'live-composer-page-builder' ),
						'value' => 'center bottom',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'background-position',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Border Color', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_border_color',
				'std' => '',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'border-color',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Border Width', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_border_width',
				'onlypositive' => true, // Value can't be negative.
				'max' => 10,
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'border-width',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Borders', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_border_trbl',
				'std' => 'top right bottom left',
				'type' => 'checkbox',
				'choices' => array(
					array(
						'label' => __( 'Top', 'live-composer-page-builder' ),
						'value' => 'top',
					),
					array(
						'label' => __( 'Right', 'live-composer-page-builder' ),
						'value' => 'right',
					),
					array(
						'label' => __( 'Bottom', 'live-composer-page-builder' ),
						'value' => 'bottom',
					),
					array(
						'label' => __( 'Left', 'live-composer-page-builder' ),
						'value' => 'left',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'border-style',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Border Radius - Top', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_border_radius_top',
				'onlypositive' => true, // Value can't be negative.
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Border Radius - Bottom', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_border_radius_bottom',
				'onlypositive' => true, // Value can't be negative.
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Padding Vertical', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_padding_vertical',
				'onlypositive' => true, // Value can't be negative.
				'max' => 600,
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'padding-top,padding-bottom',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Padding Horizontal', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_padding_horizontal',
				'onlypositive' => true, // Value can't be negative.
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'padding-left,padding-right',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Box Shadow', 'live-composer-page-builder' ),
				'id' => 'css_wrapper_box_shadow',
				'std' => '',
				'type' => 'box_shadow',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'box-shadow',
				'section' => 'styling',
				'tab' => __( 'Wrapper', 'live-composer-page-builder' ),
			),

			/**
			 * Responsive Tablet
			 */

			array(
				'label' => __( 'Responsive Styling', 'live-composer-page-builder' ),
				'id' => 'css_res_t',
				'std' => 'disabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Disabled', 'live-composer-page-builder' ),
						'value' => 'disabled',
					),
					array(
						'label' => __( 'Enabled', 'live-composer-page-builder' ),
						'value' => 'enabled',
					),
				),
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Margin Bottom', 'live-composer-page-builder' ),
				'id' => 'css_res_t_margin_bottom',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'margin-bottom',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Padding Vertical', 'live-composer-page-builder' ),
				'id' => 'css_res_t_padding_vertical',
				'onlypositive' => true, // Value can't be negative.
				'max' => 600,
				'std' => '12',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'padding-top,padding-bottom',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Padding Horizontal', 'live-composer-page-builder' ),
				'id' => 'css_res_t_padding_horizontal',
				'onlypositive' => true, // Value can't be negative.
				'std' => '12',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'padding-left,padding-right',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Font Size', 'live-composer-page-builder' ),
				'id' => 'css_res_t_button_font_size',
				'onlypositive' => true, // Value can't be negative.
				'std' => '11',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'font-size',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Icon Size ( SVG )', 'live-composer-page-builder' ),
				'id' => 'css_res_t_button_icon_size_svg',
				'std' => '11',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a svg',
				'affect_on_change_rule' => 'width, height',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Icon - Margin Right', 'live-composer-page-builder' ),
				'id' => 'css_res_t_icon_margin',
				'std' => '5',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a .dslc-icon, .dslc-button a svg',
				'affect_on_change_rule' => 'margin-right',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Align', 'live-composer-page-builder' ),
				'id' => 'css_res_t_align',
				'std' => 'left',
				'type' => 'text_align',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'text-align',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'live-composer-page-builder' ),
			),

			/**
			 * Responsive Phone
			 */

			array(
				'label' => __( 'Responsive Styling', 'live-composer-page-builder' ),
				'id' => 'css_res_p',
				'std' => 'disabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Disabled', 'live-composer-page-builder' ),
						'value' => 'disabled',
					),
					array(
						'label' => __( 'Enabled', 'live-composer-page-builder' ),
						'value' => 'enabled',
					),
				),
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
			),
			array(
				'label' => __( 'Margin Bottom', 'live-composer-page-builder' ),
				'id' => 'css_res_p_margin_bottom',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'margin-bottom',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Padding Vertical', 'live-composer-page-builder' ),
				'id' => 'css_res_p_padding_vertical',
				'onlypositive' => true, // Value can't be negative.
				'max' => 600,
				'std' => '12',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'padding-top,padding-bottom',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Padding Horizontal', 'live-composer-page-builder' ),
				'id' => 'css_res_p_padding_horizontal',
				'onlypositive' => true, // Value can't be negative.
				'std' => '12',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'padding-left,padding-right',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Font Size', 'live-composer-page-builder' ),
				'id' => 'css_res_p_button_font_size',
				'onlypositive' => true, // Value can't be negative.
				'std' => '11',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a',
				'affect_on_change_rule' => 'font-size',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Icon Size ( SVG )', 'live-composer-page-builder' ),
				'id' => 'css_res_p_button_icon_size_svg',
				'std' => '11',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a svg',
				'affect_on_change_rule' => 'width, height',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Icon - Margin Right', 'live-composer-page-builder' ),
				'id' => 'css_res_p_icon_margin',
				'std' => '5',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button a .dslc-icon, .dslc-button a svg',
				'affect_on_change_rule' => 'margin-right',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
				'ext' => 'px',
			),
			array(
				'label' => __( 'Align', 'live-composer-page-builder' ),
				'id' => 'css_res_ph_align',
				'std' => 'left',
				'type' => 'text_align',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.dslc-button',
				'affect_on_change_rule' => 'text-align',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'live-composer-page-builder' ),
			),
		);

		$dslc_options = array_merge( $dslc_options, $this->shared_options( 'animation_options', array(
			'hover_opts' => false,
		) ) );
		$dslc_options = array_merge( $dslc_options, $this->presets_options() );

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
		} else {
			$dslc_is_admin = false;
		}

		/* Module output starts here */
		$anchor_append = '';
		$button_id = '';

		if ( isset( $options['module_instance_id'] ) && $options['module_instance_id'] !== '' ) {
			$button_id = 'pay_' . $options['module_instance_id'];
		}

		$classes = $options['button_class'] . ' ' . $options['custom_class'];

		if ( isset( $options['css_bg_effect'] ) && $options['css_bg_effect'] !== 'none' ) {
			$effect_class = '';

			if ( 'gradient' === $options['css_bg_effect'] ) {
				$effect_class = 'gradient-';
				$css_bg_effect_color = '';
				if ( empty( $options['css_bg_effect_color'] ) ) {
					$css_bg_effect_color = 'lighten';
				} else {
					$css_bg_effect_color =  $options['css_bg_effect_color'];
				}
				$effect_class .= $css_bg_effect_color . '-';

				$css_bg_effect_direction = '';
				if ( empty( $options['css_bg_effect_direction'] ) ) {
					$css_bg_effect_direction = 'top-right';
				} else {
					$css_bg_effect_direction =  $options['css_bg_effect_direction'];
				}
				$effect_class .= $css_bg_effect_direction;
			}
			$classes = $classes . ' ' . $effect_class;
		} ?>

		<div class="dslc-button">
				<a href="#" <?php echo $anchor_append;
				if ( $options['link_nofollow'] ) { echo 'rel="nofollow"';} ?> class="<?php echo trim( esc_attr( $classes ) ); ?>"  id="<?php echo esc_attr( $button_id  ); ?>">
					<?php if ( $options['button_state'] == 'enabled' && $options['icon_pos'] == 'left' ) : ?>
						<?php if ( 'svg' == $options['show_icon'] ) : ?>
							<?php echo stripslashes( $options['button_inline_svg'] ); ?>
						<?php else : ?>
							<span class="dslc-icon dslc-icon-<?php echo $options['button_icon_id']; ?>"></span>
						<?php endif; ?>
					<?php endif; ?>
					<?php if ( $dslc_is_admin ) : ?>
						<span class="dslca-editable-content" data-id="button_text"  data-type="simple" contenteditable="true"><?php echo stripslashes( $options['button_text'] ); ?></span>
					<?php else : ?>
						<span><?php echo stripslashes( $options['button_text'] ); ?></span>
					<?php endif; ?>
					<?php if ( $options['button_state'] == 'enabled' && $options['icon_pos'] == 'right' ) : ?>
						<?php if ( 'svg' == $options['show_icon'] ) : ?>
							<?php echo stripslashes( $options['button_inline_svg'] ); ?>
						<?php else : ?>
							<span class="dslc-icon dslc-icon-<?php echo $options['button_icon_id']; ?>"></span>
						<?php endif; ?>
					<?php endif; ?>
				</a>
		</div><!-- .dslc-button -->

		<?php if ( $dslc_is_admin ) :
			/* We output this button code for clean html export only */ ?>
			<div style="display: none;"<?php if ( $dslc_is_admin ) { echo ' data-exportable-content';} ?>>
				<a href="#" id="<?php echo esc_attr( $button_id  ); ?>" <?php if ( $options['link_nofollow'] ) { echo 'rel="nofollow"';} ?>>
						<?php echo stripslashes( $options['button_text'] ); ?>
				</a>
			</div><!-- .dslc-button -->
		<?php endif; ?>

		<?php
		// Stripe checkout script.
		$this->lbmn_stripe_payment_checkout_script( $options );

		/* Module End */
		$this->module_end( $options );
	}

	/**
	 * Stripe Checkout Payment
	 */
	function lbmn_stripe_payment_checkout_script( $options ) {
		// $payment_method 	= isset( $options['payment_method'] ) ? $options['payment_method'] : false;
		$payment_method 	= 'stripe_checkout';
		$stripe_api 		= isset( $options['stripe_api'] ) ? $options['stripe_api'] : false;
		$module_instance_id	= isset( $options['module_instance_id'] ) ? $options['module_instance_id'] : false;
		$success_url 		= isset( $options['success_url'] ) ? $options['success_url'] : false;
		$cancel_url 		= isset( $options['cancel_url'] ) ? $options['cancel_url'] : false;
		$stripe_sku 		= isset( $options['stripe_sku'] ) ? $options['stripe_sku'] : false;
		$stripe_skus_raw 	= array();
		$stripe_skus 		= array();
		$items_formated 	= '';

		// Break composed single line SKU into formated Stripe format array.
		// Do we have multiply SKUs encoded in a string by ';' separator.
		if ( stristr( $stripe_sku, ';' ) ) {
			$stripe_skus_raw = explode( ';', $stripe_sku );
		} else {
			$stripe_skus_raw[] = $stripe_sku;
		}

		// Go through each SKU.
		foreach ( $stripe_skus_raw as $sku_raw ) {
			$stripe_sku_and_quantity = array();
			if ( strlen( $sku_raw ) ) {
				// Do we have quantity encoded in a string by ':' delimeter.
				// Otherwise set quantity as one.
				if ( stristr( $sku_raw, ':' ) ) {
					$stripe_sku_and_quantity = explode( ':', $sku_raw );
					$stripe_skus[ $stripe_sku_and_quantity[0] ] = $stripe_sku_and_quantity[1];
				} else {
					$stripe_skus[ $sku_raw ] = 1;
				}
			}
		}

		// Put Skrill formated string together.
		foreach ( $stripe_skus as $sku => $quantity ) {
			$items_formated .= '{ sku: "' .  $sku . '", quantity:' . $quantity . ' },';
		}

		// Remove the traling ',' character.
		$items_formated = substr( $items_formated, 0, -1);

		/**
		 * Include Stripe script calls on the page.
		 * Only if all the required data available for the request.
		 *
		 * Stripe API key example: pk_test_jG9s3XMdSjZF9Kdm5g59zlYd
		 * Product id example: sku_DjQJN2HJ1kkvI3
		 */
		if ( 'stripe_checkout' === $payment_method &&
			$module_instance_id && $stripe_api && $success_url && $cancel_url && $stripe_sku
				) :?>
			<script type="text/javascript">
				// Don't call Stripe from parent iframe in an editing mode.
				if ( "undefined" !== typeof( window.Stripe ) ) {
					var stripecheckoutapi_<?php echo esc_attr( $module_instance_id ); ?> = window.Stripe('<?php echo esc_attr( $stripe_api ); ?>');

					var payButton = document.querySelector('#<?php echo esc_attr( 'pay_' . $module_instance_id );  ?>');
					payButton.addEventListener('click', function(e) {
						e.preventDefault();
						stripecheckoutapi_<?php echo esc_attr( $module_instance_id ); ?>.redirectToCheckout({
							items: [ <?php echo $items_formated; ?> ], // Items example: [{sku: 'sku_DjQJN2HJ1kkvI3', quantity: 1}],
							successUrl: '<?php echo esc_attr( $success_url ); ?>',
							cancelUrl: '<?php echo esc_attr( $cancel_url ); ?>',
						})
						.then(function(result) {
							if (result.error) {
								console.log( "STRIPE PAYMENT ERROR:" );
								console.log( result.error.message );
							}
						})
						.catch(function(error) {
							console.log( "STRIPE PAYMENT ERROR:" );
							console.log( error );
						});
					});
				}
			</script>
		<?php endif;
	}
}
