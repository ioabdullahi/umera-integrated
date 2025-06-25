<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Open Street Map
 */

/**
 * Register Module
 */
add_action( 'dslc_hook_register_modules', 'lcbreadcrumb_init_module' );

function lcbreadcrumb_init_module() {
    return dslc_register_module( 'Breadcrumb' );
}

/**
 * Module Class
 */
class Breadcrumb extends DSLC_Module {

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

        $this->module_id = 'Breadcrumb';
        $this->module_title = __( 'Breadcrumb', 'lcproext' );
        $this->module_icon = 'chevron-right';
        $this->module_category = 'Extensions';

    }

    /**
     * Options
     */
    function options() {

        $options = array(
            array(
				'label' => __( 'Show On', 'lcproext' ),
				'id' => 'css_show_on',
				'std' => 'desktop tablet phone',
				'type' => 'checkbox',
				'choices' => array(
					array(
						'label' => __( 'Desktop', 'lcproext' ),
						'value' => 'desktop',
					),
					array(
						'label' => __( 'Tablet', 'lcproext' ),
						'value' => 'tablet',
					),
					array(
						'label' => __( 'Phone', 'lcproext' ),
						'value' => 'phone',
					),
				),
			),
			array(
				'label' => __( 'BG Color', 'lcproext' ),
				'id' => 'css_bg_color',
				'std' => '',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.breadcrumbs',
				'affect_on_change_rule' => 'background-color',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_border_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Width', 'lcproext' ),
					'id' => 'css_border_width',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_border_trbl',
					'std' => '',
					'type' => 'checkbox',
					'choices' => array(
						array(
							'label' => __( 'Top', 'lcproext' ),
							'value' => 'top',
						),
						array(
							'label' => __( 'Right', 'lcproext' ),
							'value' => 'right',
						),
						array(
							'label' => __( 'Bottom', 'lcproext' ),
							'value' => 'bottom',
						),
						array(
							'label' => __( 'Left', 'lcproext' ),
							'value' => 'left',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Radius Top - Left', 'lcproext' ),
					'id' => 'css_border_radius_top_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-top-left-radius',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Radius Top - Right', 'lcproext' ),
					'id' => 'css_border_radius_top_right',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Radius Bottom - Left', 'lcproext' ),
					'id' => 'css_border_radius_bottom_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-bottom-left-radius',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Radius Bottom - Right', 'lcproext' ),
					'id' => 'css_border_radius_bottom_right',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'border-bottom-right-radius',
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
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_margin_top',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_margin_right',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_margin_bottom',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_margin_left',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
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
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_padding_right',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_padding_bottom',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_padding_left',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs',
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
			 * Typography
			 */

			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_typography_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Typography', 'lcproext' ),
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_typography_border_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Color: Hover', 'lcproext' ),
					'id' => 'css_typography_border_color_hover',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item:hover',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Color - Current', 'lcproext' ),
					'id' => 'css_typography_border_color_current',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Color - Current: Hover', 'lcproext' ),
					'id' => 'css_typography_border_color_current_hover',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item_current:hover',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Width', 'lcproext' ),
					'id' => 'css_typography_border_width',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_typography_border_trbl',
					'std' => '',
					'type' => 'checkbox',
					'choices' => array(
						array(
							'label' => __( 'Top', 'lcproext' ),
							'value' => 'top',
						),
						array(
							'label' => __( 'Right', 'lcproext' ),
							'value' => 'right',
						),
						array(
							'label' => __( 'Bottom', 'lcproext' ),
							'value' => 'bottom',
						),
						array(
							'label' => __( 'Left', 'lcproext' ),
							'value' => 'left',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Radius Top - Left', 'lcproext' ),
					'id' => 'css_typography_border_radius_top_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-top-left-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Radius Top - Right', 'lcproext' ),
					'id' => 'css_typography_border_radius_top_right',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Radius Bottom - Left', 'lcproext' ),
					'id' => 'css_typography_border_radius_bottom_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-bottom-left-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Radius Bottom - Right', 'lcproext' ),
					'id' => 'css_typography_border_radius_bottom_right',
					'onlypositive' => true, // Value can't be negative.
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'border-bottom-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
			array(
				'id' => 'css_typography_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Typography', 'lcproext' ),
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_color',
					'std' => '#000000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item_current',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '15',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_font_weight',
					'std' => '400',
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
					'affect_on_change_el' => '.breadcrumbs span.item_current',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_font_family',
					'std' => 'Open Sans',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_text_transform',
					'std' => 'none',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'None', 'lcproext' ),
							'value' => 'none',
						),
						array(
							'label' => __( 'Capitalize', 'lcproext' ),
							'value' => 'capitalize',
						),
						array(
							'label' => __( 'Uppercase', 'lcproext' ),
							'value' => 'uppercase',
						),
						array(
							'label' => __( 'Lowercase', 'lcproext' ),
							'value' => 'lowercase',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.item, .breadcrumbs span.item_current',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
			array(
				'id' => 'css_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Font - Link', 'lcproext' ),
				'id' => 'css_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Typography', 'lcproext' ),
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_link_color',
					'std' => '#000000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Color: Hover', 'lcproext' ),
					'id' => 'css_link_color_hover',
					'std' => '#a0a0a0',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs a:hover',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_link_font_weight',
					'std' => '400',
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
					'affect_on_change_el' => '.breadcrumbs a',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
					'ext' => '',
				),
			array(
				'id' => 'css_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_typography_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Typography', 'lcproext' ),
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_typography_padding_top',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_typography_padding_right',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_typography_padding_bottom',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_typography_padding_left',
					'std' => '',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => __( 'Typography', 'lcproext' ),
				),
			array(
				'id' => 'css_typography_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Font Separator', 'lcproext' ),
				'id' => 'css_font_separator_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => __( 'Typography', 'lcproext' ),
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_separator_color',
					'std' => '#000000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.sep',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
				),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_separator_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '15',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.breadcrumbs span.sep',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css__separator_font_weight',
					'std' => '400',
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
					'affect_on_change_el' => '.breadcrumbs span.sep',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => __( 'Typography', 'lcproext' ),
					'ext' => '',
				),
			array(
				'id' => 'css_font_separator_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
			),
			array(
				'label' => __( 'Text Align', 'lcproext' ),
				'id' => 'css_text_align',
				'std' => 'left',
				'type' => 'text_align',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.breadcrumbs',
				'affect_on_change_rule' => 'text-align',
				'section' => 'styling',
				'tab' => __( 'Typography', 'lcproext' ),
			),
        );

        $options = array_merge( $options, $this->shared_options( 'animation_options' ) );
        $options = array_merge( $options, $this->presets_options() );

        return apply_filters( 'dslc_module_options', $options, $this->module_id );

    }

    /**
     * Output the module render
     *
     * @param  array $options All the plugin options.
     * @return void
     */
    function output( $options ) {

        /* Module Start */
        $this->module_start( $options );

        global $dslc_active;

		if ( $dslc_active ) {
		?>
			<div class="breadcrumbs">
				<span class="item"><a href="#" class="home"><span>Home</span></a></span>
				<span class="sep">/</span>
				<span class="item_current">Single Page</span>
			</div>
		<?php
		} else {
            dslc_display_breadcrumb();
		}

        /* Module End */
        $this->module_end( $options );

    }
}
