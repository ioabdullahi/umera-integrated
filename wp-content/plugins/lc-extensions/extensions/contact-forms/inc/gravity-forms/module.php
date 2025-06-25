<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Gravity Forms
 */

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	exit;
}

/**
 * Register Module
 */
function lcextpro_graviti_forms_init_module() {
	return dslc_register_module( 'LCPROEXT_GravityForms' );
}
add_action( 'dslc_hook_register_modules', 'lcextpro_graviti_forms_init_module' );

/**
 * Module Class
 */
class LCPROEXT_GravityForms extends DSLC_Module {

    /**
	 * Unique module id
	 *
	 * @var string
	 */
	var $module_id;

	/**
	 * Module label to show in the page builder
	 *
	 * @var string
	 */
	var $module_title;

	/**
	 * Module icon name (FontAwesome)
	 *
	 * @var string
	 */
	var $module_icon;

	/**
	 * Section in the modules panel that includes this module
	 * Live Composer Extensions should use 'Extensions'
	 *
	 * @var string
	 */
	var $module_category;

    /**
	 * Construct
	 */
    function __construct() {

        $this->module_id = 'LCPROEXT_GravityForms';
        $this->module_title = __( 'Gravity Forms', 'lcproext' );
        $this->module_icon = 'envelope';
        $this->module_category = 'Extensions';

    }

    /**
	 * Options
	 */
    function options() {

        $dslc_options = array(

            /**
             * Functionality
             */

            array(
                'label' => __( 'Show On', 'lcproext' ),
                'id' => 'css_show_on',
                'std' => 'desktop tablet phone',
                'type' => 'checkbox',
                'choices' => array(
                    array(
                        'label' => __( 'Desktop', 'lcproext' ),
                        'value' => 'desktop'
                    ),
                    array(
                        'label' => __( 'Tablet', 'lcproext' ),
                        'value' => 'tablet'
                    ),
                    array(
                        'label' => __( 'Phone', 'lcproext' ),
                        'value' => 'phone'
                    ),
                ),
            ),
            array(
                'label' => __( 'Select Form', 'lcproext' ),
                'id' => 'form_id',
                //'std' => $this->first_gravity_form_id(),
                'std' => 'not_set',
                'type' => 'select',
                'choices' => $this->get_gravity_form_options(),
            ),
            array(
                'label' => __( 'Display form title', 'gravityforms'  ),
                'id' => 'showtitle',
                'std' => 0,
                'type' => 'select',
                'choices' =>  array(
                    array(
                        'label' => __( 'No', 'lcproext' ),
                        'value' => 0
                    ),
                    array(
                        'label' => __( 'Yes', 'lcproext' ),
                        'value' => 1
                    ),
                ),
            ),
            array(
                'label' => __( 'Display form description', 'gravityforms'  ),
                'id' => 'showdescription',
                'std' => 0,
                'type' => 'select',
                'choices' =>  array(
                    array(
                        'label' => __( 'No', 'lcproext' ),
                        'value' => 0
                    ),
                    array(
                        'label' => __( 'Yes', 'lcproext' ),
                        'value' => 1
                    ),
                ),
            ),
            array(
                'label' => __( 'Enable AJAX', 'gravityforms'  ),
                'id' => 'ajax',
                'std' => 0,
                'type' => 'select',
                'choices' =>  array(
                    array(
                        'label' => __( 'No', 'lcproext' ),
                        'value' => 0
                    ),
                    array(
                        'label' => __( 'Yes', 'lcproext' ),
                        'value' => 1
                    ),
                ),
                'tab' => 'advanced',
            ),
            array(
                'label' => __( 'Disable script output', 'gravityforms'  ),
                'id' => 'disable_scripts',
                'std' => 0,
                'type' => 'select',
                'choices' =>  array(
                    array(
                        'label' => __( 'No', 'lcproext' ),
                        'value' => 0
                    ),
                    array(
                        'label' => __( 'Yes', 'lcproext' ),
                        'value' => 1
                    ),
                ),
                'tab' => 'advanced',
            ),
            array(
                'label' => __( 'Tab Index Start', 'gravityforms'  ),
                'id' => 'tabindex',
                'type' => 'text',
                'tab' => 'advanced',
            ),

            /**
             * General
             */

            array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_margin_group',
				'type' => 'group',
				'action' => 'open',
                'section' => 'styling',
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_margin_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'margin-top',
                    'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_margin_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'margin-right',
                    'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_margin_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'margin-bottom',
                    'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_margin_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
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
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_padding_group',
				'type' => 'group',
				'action' => 'open',
                'section' => 'styling',
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_padding_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'padding-top',
                    'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_padding_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'padding-right',
                    'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_padding_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'padding-bottom',
                    'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_padding_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.gform_body',
					'affect_on_change_rule' => 'padding-left',
                    'section' => 'styling',
					'ext' => 'px',
				),
			array(
				'id' => 'css_padding_group',
				'type' => 'group',
				'action' => 'close',
                'section' => 'styling',
			),

            /**
             * Field Styling
             */

            array(
                'label' => __( 'Background Color', 'lcproext' ),
                'id' => 'css_gf_field_bcolor',
                'std' => '',
                'type' => 'color',
                'refresh_on_change' => false,
                'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                'affect_on_change_rule' => 'background',
                'section' => 'styling',
                'tab' => __( 'Field Styling', 'lcproext' ),
            ),
            array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_gf_field_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Field Styling', 'lcproext' ),
			),
                array(
                    'label' => __( 'Font Color', 'lcproext' ),
                    'id' => 'css_gf_field_color',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea,.ginput_container option,.ginput_container li label',
                    'affect_on_change_rule' => 'color',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Font Size', 'lcproext' ),
                    'id' => 'css_gf_field_font_size',
                    'std' => '20',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'font-size',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Font Weight', 'lcproext' ),
                    'id' => 'css_gf_field_font_weight',
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
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'font-weight',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                    'ext' => '',
                ),
                array(
                    'label' => __( 'Font Family', 'lcproext' ),
                    'id' => 'css_gf_field_font_family',
                    'std' => 'Lato',
                    'type' => 'font',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'font-family',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Line Height', 'lcproext' ),
                    'id' => 'css_gf_field_line_height',
                    'std' => '14',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'line-height',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Text Transform', 'lcproext' ),
                    'id' => 'css_gf_field_transform',
                    'std' => 'none',
                    'type' => 'select',
                    'choices' => array(
                        array(
                            'label' => __( 'None', 'lcproext' ),
                            'value' => 'none'
                        ),
                        array(
                            'label' => __( 'Capitalize', 'lcproext' ),
                            'value' => 'capitalize'
                        ),
                        array(
                            'label' => __( 'Uppercase', 'lcproext' ),
                            'value' => 'uppercase'
                        ),
                        array(
                            'label' => __( 'Lowercase', 'lcproext' ),
                            'value' => 'lowercase'
                        ),
                    ),
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'text-transform',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                ),
            array(
                'label' => __( 'Font', 'lcproext' ),
                'id' => 'css_gf_field_font_group',
                'type' => 'group',
                'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Field Styling', 'lcproext' ),
            ),
            array(
                'label' => __( 'Border', 'lcproext' ),
                'id' => 'css_gf_field_border_group',
                'type' => 'group',
                'action' => 'open',
                'section' => 'styling',
                'tab' => __( 'Field Styling', 'lcproext' ),
            ),
                array(
                    'label' => __( 'Border radius', 'lcproext' ),
                    'id' => 'css_gf_field_border_radius',
                    'std' => '0',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'border-radius',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Border width', 'lcproext' ),
                    'id' => 'css_gf_field_border_w',
                    'std' => '1',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'border-width',
                    'section' => 'styling',
                    'ext' => 'px',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Border Color', 'lcproext' ),
                    'id' => 'css_gf_field_border_w',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.ginput_container input, .ginput_container textarea',
                    'affect_on_change_rule' => 'border-color',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
                ),
            array(
                'label' => __( 'Border', 'lcproext' ),
                'id' => 'css_gf_field_border_group',
                'type' => 'group',
                'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Field Styling', 'lcproext' ),
            ),
            array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_gf_field_padding_group',
				'type' => 'group',
				'action' => 'open',
                'section' => 'styling',
                'tab' => __( 'Field Styling', 'lcproext' ),
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_gf_field_padding_t',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.ginput_container',
					'affect_on_change_rule' => 'padding-top',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_gf_field_padding_r',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.ginput_container',
					'affect_on_change_rule' => 'padding-right',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_gf_field_padding_b',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.ginput_container',
					'affect_on_change_rule' => 'padding-bottom',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_gf_field_padding_l',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.ginput_container',
					'affect_on_change_rule' => 'padding-left',
                    'section' => 'styling',
                    'tab' => __( 'Field Styling', 'lcproext' ),
					'ext' => 'px',
				),
			array(
				'id' => 'css_gf_field_padding_group',
				'type' => 'group',
				'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Field Styling', 'lcproext' ),
			),

            /**
             * Field Labels Typography
             */

            array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_gf_field_label_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Field Labels Typography', 'lcproext' ),
			),
                array(
                    'label' => __( 'Color', 'lcproext' ),
                    'id' => 'css_gf_field_label_color',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_label',
                    'affect_on_change_rule' => 'color',
                    'section' => 'styling',
                    'tab' => __( 'Field Labels Typography', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Font Size', 'lcproext' ),
                    'id' => 'css_gf_field_label_font_size',
                    'std' => '20',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_label',
                    'affect_on_change_rule' => 'font-size',
                    'section' => 'styling',
                    'tab' => __( 'Field Labels Typography', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Font Weight', 'lcproext' ),
                    'id' => 'css_gf_field_label_font_weight',
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
                    'affect_on_change_el' => '.gfield_label',
                    'affect_on_change_rule' => 'font-weight',
                    'section' => 'styling',
                    'tab' => __( 'Field Labels Typography', 'lcproext' ),
                    'ext' => '',
                ),
                array(
                    'label' => __( 'Font Family', 'lcproext' ),
                    'id' => 'css_gf_field_label_font_family',
                    'std' => 'Lato',
                    'type' => 'font',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_label',
                    'affect_on_change_rule' => 'font-family',
                    'section' => 'styling',
                    'tab' => __( 'Field Labels Typography', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Line Height', 'lcproext' ),
                    'id' => 'css_gf_field_label_line_height',
                    'std' => '14',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_label',
                    'affect_on_change_rule' => 'line-height',
                    'section' => 'styling',
                    'tab' => __( 'Field Labels Typography', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Text Transform', 'lcproext' ),
                    'id' => 'css_gf_field_label_transform',
                    'std' => 'none',
                    'type' => 'select',
                    'choices' => array(
                        array(
                            'label' => __( 'None', 'lcproext' ),
                            'value' => 'none'
                        ),
                        array(
                            'label' => __( 'Capitalize', 'lcproext' ),
                            'value' => 'capitalize'
                        ),
                        array(
                            'label' => __( 'Uppercase', 'lcproext' ),
                            'value' => 'uppercase'
                        ),
                        array(
                            'label' => __( 'Lowercase', 'lcproext' ),
                            'value' => 'lowercase'
                        ),
                    ),
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_label',
                    'affect_on_change_rule' => 'text-transform',
                    'section' => 'styling',
                    'tab' => __( 'Field Labels Typography', 'lcproext' ),
                ),
            array(
                'label' => __( 'Font', 'lcproext' ),
                'id' => 'css_gf_field_label_font_group',
                'type' => 'group',
                'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Field Labels Typography', 'lcproext' ),
            ),

            /**
             * Field Description Typography
             */

            array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_gf_description_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Field Description Typography', 'lcproext' ),
			),
                array(
                    'label' => __( 'Color', 'lcproext' ),
                    'id' => 'css_gf_description_color',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_description',
                    'affect_on_change_rule' => 'color',
                    'section' => 'styling',
                    'tab' => __( 'Field Description Typography', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Font Size', 'lcproext' ),
                    'id' => 'css_gf_description_font_size',
                    'std' => '20',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_description',
                    'affect_on_change_rule' => 'font-size',
                    'section' => 'styling',
                    'tab' => __( 'Field Description Typography', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Font Weight', 'lcproext' ),
                    'id' => 'css_gf_description_font_weight',
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
                    'affect_on_change_el' => '.gfield_description',
                    'affect_on_change_rule' => 'font-weight',
                    'section' => 'styling',
                    'tab' => __( 'Field Description Typography', 'lcproext' ),
                    'ext' => '',
                ),
                array(
                    'label' => __( 'Font Family', 'lcproext' ),
                    'id' => 'css_gf_description_font_family',
                    'std' => 'Lato',
                    'type' => 'font',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_description',
                    'affect_on_change_rule' => 'font-family',
                    'section' => 'styling',
                    'tab' => __( 'Field Description Typography', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Line Height', 'lcproext' ),
                    'id' => 'css_gf_description_line_height',
                    'std' => '14',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_description',
                    'affect_on_change_rule' => 'line-height',
                    'section' => 'styling',
                    'tab' => __( 'Field Description Typography', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Text Transform', 'lcproext' ),
                    'id' => 'css_gf_description_transform',
                    'std' => 'none',
                    'type' => 'select',
                    'choices' => array(
                        array(
                            'label' => __( 'None', 'lcproext' ),
                            'value' => 'none'
                        ),
                        array(
                            'label' => __( 'Capitalize', 'lcproext' ),
                            'value' => 'capitalize'
                        ),
                        array(
                            'label' => __( 'Uppercase', 'lcproext' ),
                            'value' => 'uppercase'
                        ),
                        array(
                            'label' => __( 'Lowercase', 'lcproext' ),
                            'value' => 'lowercase'
                        ),
                    ),
                    'refresh_on_change' => false,
                    'affect_on_change_el' => '.gfield_description',
                    'affect_on_change_rule' => 'text-transform',
                    'section' => 'styling',
                    'tab' => __( 'Field Description Typography', 'lcproext' ),
                ),
            array(
                'label' => __( 'Font', 'lcproext' ),
                'id' => 'css_gf_description_font_group',
                'type' => 'group',
                'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Field Description Typography', 'lcproext' ),
            ),

            /**
             * Button
             */

            array(
                'label' => __( 'Align', 'lcproext' ),
                'id' => 'css_text_align',
                'std' => 'left',
                'type' => 'text_align',
                'refresh_on_change' => false,
                'affect_on_change_el' => '.gform_footer',
                'affect_on_change_rule' => 'text-align',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
            array(
                'label' => __( 'Background Color', 'lcproext' ),
                'id' => 'css_gf_button_bcolor',
                'std' => '',
                'type' => 'color',
                'refresh_on_change' => false,
                'affect_on_change_el' => 'input[type=submit]',
                'affect_on_change_rule' => 'background',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
            array(
                'label' => __( 'Background Color - Hover', 'lcproext' ),
                'id' => 'css_gf_button_bcolorh',
                'std' => '',
                'type' => 'color',
                'refresh_on_change' => false,
                'affect_on_change_el' => 'input[type=submit]:hover',
                'affect_on_change_rule' => 'background',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
            array(
                'label' => __( 'Font', 'lcproext' ),
                'id' => 'css_gf_button_font_group',
                'type' => 'group',
                'action' => 'open',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
                array(
                    'label' => __( 'Font Color', 'lcproext' ),
                    'id' => 'css_gf_button_color',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'color',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Font Color - Hover', 'lcproext' ),
                    'id' => 'css_gf_button_colorh',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]:hover',
                    'affect_on_change_rule' => 'color',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Font Size', 'lcproext' ),
                    'id' => 'css_gf_button_font_size',
                    'std' => '20',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'font-size',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Font Weight', 'lcproext' ),
                    'id' => 'css_gf_button_font_weight',
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
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'font-weight',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                    'ext' => '',
                ),
                array(
                    'label' => __( 'Font Family', 'lcproext' ),
                    'id' => 'css_gf_button_font_family',
                    'std' => 'Lato',
                    'type' => 'font',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'font-family',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Line Height', 'lcproext' ),
                    'id' => 'css_gf_button_line_height',
                    'std' => '14',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'line-height',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Text Transform', 'lcproext' ),
                    'id' => 'css_gf_button_transform',
                    'std' => 'none',
                    'type' => 'select',
                    'choices' => array(
                        array(
                            'label' => __( 'None', 'lcproext' ),
                            'value' => 'none'
                        ),
                        array(
                            'label' => __( 'Capitalize', 'lcproext' ),
                            'value' => 'capitalize'
                        ),
                        array(
                            'label' => __( 'Uppercase', 'lcproext' ),
                            'value' => 'uppercase'
                        ),
                        array(
                            'label' => __( 'Lowercase', 'lcproext' ),
                            'value' => 'lowercase'
                        ),
                    ),
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'text-transform',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
            array(
                'label' => __( 'Font', 'lcproext' ),
                'id' => 'css_gf_button_font_group',
                'type' => 'group',
                'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
            array(
                'label' => __( 'Border', 'lcproext' ),
                'id' => 'css_gf_button_border_group',
                'type' => 'group',
                'action' => 'open',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
                array(
                    'label' => __( 'Border radius', 'lcproext' ),
                    'id' => 'css_gf_button_border_radius',
                    'std' => '0',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'border-radius',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                    'ext' => 'px'
                ),
                array(
                    'label' => __( 'Border', 'lcproext' ),
                    'id' => 'css_gf_button_border',
                    'std' => 'none',
                    'type' => 'select',
                    'choices' => array(
                        array(
                            'label' => __( 'None', 'lcproext' ),
                            'value' => 'none'
                        ),
                        array(
                            'label' => __( 'Solid', 'lcproext' ),
                            'value' => 'solid'
                        ),

                    ),
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'border',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Border width', 'lcproext' ),
                    'id' => 'css_gf_button_border_w',
                    'std' => '1',
                    'type' => 'slider',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'border-width',
                    'section' => 'styling',
                    'ext' => 'px',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Border Color', 'lcproext' ),
                    'id' => 'css_gf_button_border_w',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]',
                    'affect_on_change_rule' => 'border-top-color,border-bottom-color,border-left-color,border-right-color,',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
                array(
                    'label' => __( 'Border Color - Hover', 'lcproext' ),
                    'id' => 'css_gf_button_border_wh',
                    'std' => '',
                    'type' => 'color',
                    'refresh_on_change' => false,
                    'affect_on_change_el' => 'input[type=submit]:hover',
                    'affect_on_change_rule' => 'border-color',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
                ),
            array(
                'label' => __( 'Border', 'lcproext' ),
                'id' => 'css_gf_button_border_group',
                'type' => 'group',
                'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
            ),
            array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_gf_button_margin_group',
				'type' => 'group',
				'action' => 'open',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_gf_button_margin_top',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'margin-top',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_gf_button_margin_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'margin-right',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_gf_button_margin_bottom',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'margin-bottom',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_gf_button_margin_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'margin-left',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
			array(
				'id' => 'css_gf_button_margin_group',
				'type' => 'group',
				'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
			),
			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_gf_button_padding_group',
				'type' => 'group',
				'action' => 'open',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_gf_button_padding_top',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'padding-top',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_gf_button_padding_right',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'padding-right',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_gf_button_padding_bottom',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'padding-bottom',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_gf_button_padding_left',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'input[type=submit]',
					'affect_on_change_rule' => 'padding-left',
                    'section' => 'styling',
                    'tab' => __( 'Button', 'lcproext' ),
					'ext' => 'px',
				),
			array(
				'id' => 'css_gf_button_padding_group',
				'type' => 'group',
				'action' => 'close',
                'section' => 'styling',
                'tab' => __( 'Button', 'lcproext' ),
			),
        );


        return apply_filters( 'dslc_module_options', $dslc_options, $this->module_id );

    }

    /**
	 * Output the module render
	 *
	 * @param  array $options All the plugin options.
	 * @return void
	 */
    function output( $options ) {

        global $dslc_active;

        if ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
            $dslc_is_admin = true;
        } else {
            $dslc_is_admin = false;
        }

        $this->module_start( $options );

        if ( ! isset( $options['form_id'] ) || 'not_set' == $options['form_id'] ) {
			echo '<div class="dslc-notification dslc-red dslca-module-edit-hook">' . __( 'Click here to choose the form.', 'lcproext' ) . '<span class="dslca-module-edit-hook dslc-icon dslc-icon-cog"></span></div>';
		} else {
			$tabindex = is_numeric( $options['tabindex'] ) ? $options['tabindex'] : 1;

            // Creating form
            $form = RGFormsModel::get_form_meta( $options['form_id'] );

            if ( empty( $options['disable_scripts'] ) && ! is_admin() ) {
                //RGForms::print_form_scripts( $form, $options['ajax'] );
            }

            $form_markup = RGForms::get_form( $options['form_id'], $options['showtitle'], $options['showdescription'], false, null, $options['ajax'], $tabindex );

            // Display form
            echo $form_markup;
		}

        $this->module_end( $options );
    }

    /**
     * Form options
     */
    function get_gravity_form_options(){
        $forms = RGFormsModel::get_forms( 1, 'title' );
        $choices = array();
		$choices[] = array(
			'label' => __( '-- Select --', 'lcproext' ),
			'value' => 'not_set',
		);

        foreach ( $forms as $form ) {
            $choices[] = array(
                'label' => esc_html( $form->title ),
                'value' => absint( $form->id )
            );
        }

        return $choices;
    }

    /**
     * Form ID
     */
    function first_gravity_form_id(){
        $forms = RGFormsModel::get_forms( 1, 'title' );
        $choices = array();

        foreach ( $forms as $form ) {
            $choices[] = absint( $form->id );
        }

        return $choices[0];
    }

}