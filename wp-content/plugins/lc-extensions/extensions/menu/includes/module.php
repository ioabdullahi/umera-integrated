<?php

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	exit;
}

/**
 * Register Module
 */
add_action( 'dslc_hook_register_modules', 'lcmenupro_init_module' );

function lcmenupro_init_module() {
	return dslc_register_module( 'DSLC_Menu_Pro' );
}

class DSLC_Menu_Pro extends DSLC_Module {

	var $module_id;
	var $module_title;
	var $module_icon;
	var $module_category;

	function __construct() {
		$this->module_id       = 'DSLC_Menu_Pro';
		$this->module_title    = __( 'Mega Menu', 'lcproext' );
		$this->module_icon     = 'map-signs';
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

		$locs = get_registered_nav_menus();

		$loc_choices = array();
		$loc_choices[] = array(
			'label' => __( 'Choose Navigation', 'lcproext' ),
			'value' => 'not_set',
		);

		if ( ! empty( $locs ) ) {
			foreach ( $locs as $loc_id => $loc_label ) {
				$loc_choices[] = array(
					'label' => $loc_label,
					'value' => $loc_id,
				);
			}
		} else {
			$loc_choices[] = array(
				'label' => __( 'You have no menu locations (areas) set.', 'lcproext' ),
				'value' => 'not_set',
			);
		}

		$sidebars_choices = array();
		$sidebars_choices[] = array(
			'label' => __( 'Choose sidebar', 'live-composer-page-builder' ),
			'value' => 'not_set',
		);

		foreach ( $GLOBALS['wp_registered_sidebars'] as $sidebar ) {
			$sidebars_choices[] = array(
				'label' => $sidebar['name'],
				'value' => $sidebar['id'],
			);
		}

		$str_tab_menu_block = __( 'General', 'lcproext' );
		$str_tab_menu_item  = __( 'Menu Item', 'lcproext' );
		$str_tab_menu_icon  = __( 'Menu Item Icon', 'lcproext' );

		$str_tab_submenu_block = __( 'Submenu Block', 'lcproext' );
		$str_tab_submenu_item  = __( 'Submenu Item', 'lcproext' );
		$str_tab_submenu_icon = __( 'Submenu Item Icon', 'lcproext' );

		$str_tab_submenu_column = __( 'Submenu Columns', 'lcproext' );
		$str_tab_submenu_column_item = __( 'Item In Columns', 'lcproext' );
		$str_tab_submenu_item_title = __( 'Title', 'lcproext' );
		$str_tab_submenu_item_description = __( 'Description', 'lcproext' );
		$str_tab_submenu_item_special = __( 'Special Text', 'lcproext' );

		$str_tab_mobile_menu  = __( 'Mobile Menu', 'lcproext' );
		$str_tab_mobile_menu_toggle  = __( 'Hamburger Icon', 'lcproext' );

		$str_tab_mobile_menu_widgets = __( 'Mobile Menu Widgets', 'lcproext' );

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
				'label' => __( 'Navigation', 'lcproext' ),
				'id' => 'location',
				'std' => 'not_set',
				'type' => 'select',
				'choices' => $loc_choices,
				'help' => __( 'Menu locations from the theme will be shown here. <br />You can <a href="/wp-admin/admin.php?page=dslc_plugin_options#navigation" target="_blank" class="dslca-link">create new menu location</a>.', 'lcproext' ),
			),

			array(
				'label' => __( 'Mobile Navigation', 'lcproext' ),
				'id' => 'location_mobile',
				'std' => 'not_set',
				'type' => 'select',
				'choices' => $loc_choices,
				'help' => __( 'Menu locations from the theme will be shown here. <br />You can <a href="/wp-admin/admin.php?page=dslc_plugin_options#navigation" target="_blank" class="dslca-link">create new menu location</a>.', 'lcproext' ),
			),

			array(
				'label' => __( 'Mobile Menu Widgets	', 'lcproext' ),
				'id' => 'mobile-off-canvas-widget',
				'std' => 'not_set',
				'type' => 'select',
				'choices' => $sidebars_choices,
				'help' => __( 'You can register sidebars for this module in <br>WP Admin > Live Composer > Widgets Module.', 'lcproext' ),
			),

			array(
				'label' => __( 'Mobile Menu Logo', 'lcproext' ),
				'id' => 'mobile_logo',
				'std' => '',
				'type' => 'image',
			),

			/**
			 * Styling
			 */

			array(
				'label' => __( 'Items – Align', 'lcproext' ),
				'id' => 'css_main_align',
				'std' => 'flex-end',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Left', 'lcproext' ),
						'value' => 'flex-start',
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'value' => 'flex-end',
					),
					array(
						'label' => __( 'Center', 'lcproext' ),
						'value' => 'center',
					),
					array(
						'label' => __( 'Space Between', 'lcproext' ),
						'value' => 'space-between',
					),
					/*array(
						'label' => __( 'Space Around', 'lcproext' ),
						'value' => 'space-around',
					),*/
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenupro-navigation',
				'affect_on_change_rule' => 'justify-content',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
			array(
				'label' => __( 'Background', 'lcproext' ),
				'id' => 'css_main_bg_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
				array(
					'label' => __( 'BG Color', 'lcproext' ),
					'id' => 'css_main_bg_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'BG Image', 'lcproext' ),
					'id' => 'css_main_bg_img',
					'std' => '',
					'type' => 'image',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'background-image',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'BG Image Repeat', 'lcproext' ),
					'id' => 'css_main_bg_img_repeat',
					'std' => 'repeat',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Repeat', 'lcproext' ),
							'value' => 'repeat',
						),
						array(
							'label' => __( 'Repeat Horizontal', 'lcproext' ),
							'value' => 'repeat-x',
						),
						array(
							'label' => __( 'Repeat Vertical', 'lcproext' ),
							'value' => 'repeat-y',
						),
						array(
							'label' => __( 'Do NOT Repeat', 'lcproext' ),
							'value' => 'no-repeat',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'background-repeat',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'BG Image Attachment', 'lcproext' ),
					'id' => 'css_main_bg_img_attch',
					'std' => 'scroll',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Scroll', 'lcproext' ),
							'value' => 'scroll',
						),
						array(
							'label' => __( 'Fixed', 'lcproext' ),
							'value' => 'fixed',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'background-attachment',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'BG Image Position', 'lcproext' ),
					'id' => 'css_main_bg_img_pos',
					'std' => 'top left',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Top Left', 'lcproext' ),
							'value' => 'left top',
						),
						array(
							'label' => __( 'Top Right', 'lcproext' ),
							'value' => 'right top',
						),
						array(
							'label' => __( 'Top Center', 'lcproext' ),
							'value' => 'Center Top',
						),
						array(
							'label' => __( 'Center Left', 'lcproext' ),
							'value' => 'left center',
						),
						array(
							'label' => __( 'Center Right', 'lcproext' ),
							'value' => 'right center',
						),
						array(
							'label' => __( 'Center', 'lcproext' ),
							'value' => 'center center',
						),
						array(
							'label' => __( 'Bottom Left', 'lcproext' ),
							'value' => 'left bottom',
						),
						array(
							'label' => __( 'Bottom Right', 'lcproext' ),
							'value' => 'right bottom',
						),
						array(
							'label' => __( 'Bottom Center', 'lcproext' ),
							'value' => 'center bottom',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'background-position',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'BG Image Size', 'lcproext' ),
					'id' => 'bg_image_size',
					'std' => 'auto',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'background-size',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Original', 'lcproext' ),
							'value' => 'auto',
						),
						array(
							'label' => __( 'Cover', 'lcproext' ),
							'value' => 'cover',
						),
						array(
							'label' => __( 'Contain', 'lcproext' ),
							'value' => 'contain',
						),
					),
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
			array(
				'label' => __( 'Background', 'lcproext' ),
				'id' => 'css_main_bg_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_main_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
				array(
					'label' => __( 'Border Color', 'lcproext' ),
					'id' => 'css_main_border_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'Border Width', 'lcproext' ),
					'id' => 'css_main_border_width',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_main_border_trbl',
					'std' => 'top right bottom left',
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
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
				),
				array(
					'label' => __( 'Border Radius - Top', 'lcproext' ),
					'id' => 'css_main_border_radius_top',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Border Radius - Bottom', 'lcproext' ),
					'id' => 'css_main_border_radius_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_main_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
			array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_main_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_margin_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_margin_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_margin_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_margin_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
			array(
				'id' => 'css_main_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_main_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_main_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_main_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_main_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_main_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_menu_block,
					'ext' => 'px',
				),
			array(
				'id' => 'css_main_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
			),
			array(
				'label' => __( 'Minimum Height', 'lcproext' ),
				'id' => 'css_min_height',
				'onlypositive' => true, // Value can't be negative.
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenupro-inner',
				'affect_on_change_rule' => 'min-height',
				'section' => 'styling',
				'tab' => $str_tab_menu_block,
				'ext' => 'px',
				'increment' => 5,
			),

			/**
			 * Styling - Item
			 */

			array(
				'label' => __( 'Spacing (sides)', 'lcproext' ),
				'id' => 'css_item_spacing',
				'std' => '1',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.menu > li',
				'affect_on_change_rule' => 'margin-left,margin-right',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => $str_tab_menu_item,
			),
			array(
				'label' => __( 'Link Color', 'lcproext' ),
				'id' => 'css_item_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_item_color',
					'std' => 'rgba(0,0,0,0.9)',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner li a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Color - Hover', 'lcproext' ),
					'id' => 'css_item_color_hover',
					'std' => '#1f9be8',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner li a:hover, .lcmenupro-inner li:hover a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Color - Active', 'lcproext' ),
					'id' => 'css_item_color_active',
					'std' => '#1f9be8',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => 'li.current-menu-item a, li.current-menu-ancestor a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
			array(
				'label' => __( 'Link Color', 'lcproext' ),
				'id' => 'css_item_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),

			array(
				'label' => __( 'Background', 'lcproext' ),
				'id' => 'css_item_bg_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
				array(
					'label' => __( 'BG Color', 'lcproext' ),
					'id' => 'css_item_bg_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'BG Color - Hover', 'lcproext' ),
					'id' => 'css_item_bg_color_hover',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:hover',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'BG Color - Active', 'lcproext' ),
					'id' => 'css_item_bg_color_active',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.current-menu-item',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
			array(
				'id' => 'css_item_bg_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),

			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_item_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_item_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '16',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_item_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '24',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > a',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_item_font_weight',
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
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_item_font_family',
					'std' => 'Roboto',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > a, .lcmenupro-mobile-menu a',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_item_text_transform',
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
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Letter Spacing', 'lcproext' ),
					'id' => 'css_item_letter_spacing',
					'max' => 30,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_item_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_item_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_item_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					// 'affect_on_change_el' => '.menu > li > a',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_item_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					// 'affect_on_change_el' => '.menu > li > a',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_item_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					// 'affect_on_change_el' => '.menu > li > a',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_item_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					// 'affect_on_change_el' => '.menu > li > a',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
			array(
				'id' => 'css_item_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),

			array(
				'label' => __( 'Chevron (Dropdown Arrow Icon)', 'lcproext' ),
				'id' => 'css_item_chevron_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
				array(
					'label' => __( 'Enable/Disable', 'lcproext' ),
					'id' => 'css_item_chevron_display',
					'std' => 'none',
					'type' => 'select',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-navigation-arrow',
					'affect_on_change_rule' => 'display',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'choices' => array(
						array(
							'label' => __( 'Enabled', 'lcproext' ),
							'value' => 'inline-block',
						),
						array(
							'label' => __( 'Disabled', 'lcproext' ),
							'value' => 'none',
						),
					),
				),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_item_chevron_color',
					'std' => '#555555',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-navigation-arrow',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Size', 'lcproext' ),
					'id' => 'css_item_chevron_size',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-navigation-arrow',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Margin Left', 'lcproext' ),
					'id' => 'css_item_chevron_spacing',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-navigation-arrow',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Margin Right', 'lcproext' ),
					'id' => 'css_item_chevron_spacing_right',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.dslc-navigation-arrow',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
					'ext' => 'px',
				),
			array(
				'label' => __( 'Chevron (Dropdown Arrow Icon)', 'lcproext' ),
				'id' => 'css_item_chevron_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),

			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_item_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),
				array(
					'label' => __( 'Border Color', 'lcproext' ),
					'id' => 'css_item_border_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Border Color - Hover', 'lcproext' ),
					'id' => 'css_item_border_color_hover',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:hover',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Border Color - Active', 'lcproext' ),
					'id' => 'css_item_border_color_active',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.current-menu-item',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Border Width', 'lcproext' ),
					'id' => 'css_item_border_width',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_item_border_trbl',
					'std' => 'top right bottom left',
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
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Border Radius - Top', 'lcproext' ),
					'id' => 'css_item_border_radius_top',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_menu_item,
				),
				array(
					'label' => __( 'Border Radius - Bottom', 'lcproext' ),
					'id' => 'css_item_border_radius_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_menu_item,
				),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_item_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_item,
			),

			/**
			 * Icon
			 */

			array(
				'label' => __( 'Icon Size', 'lcproext' ),
				'id' => 'css_icon_size',
				'onlypositive' => true, // Value can't be negative.
				'std' => '17',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
				'affect_on_change_rule' => 'font-size, width, height',
				'section' => 'styling',
				'tab' => $str_tab_menu_icon,
				'min' => 1,
				'max' => 50,
				'ext' => 'px',
			),

			array(
				'label' => __( 'Color', 'lcproext' ),
				'id' => 'css_icon_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_icon,
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_icon_color',
					'std' => '#909497',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_menu_icon,
				),
				array(
					'label' => __( 'Color - Hover', 'lcproext' ),
					'id' => 'css_icon_color_hover',
					'std' => '#56aee3',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:hover::before, .menu-item[class*=' dslc-icon-']:hover::before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_menu_icon,
				),
			array(
				'label' => __( 'Color', 'lcproext' ),
				'id' => 'css_icon_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_icon,
			),

			array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_icon_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_menu_icon,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_icon_margin_top',
					// 'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_menu_icon,
					'max' => 20,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_icon_margin_right',
					// 'onlypositive' => true, // Value can't be negative.
					'max' => 20,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_menu_icon,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_icon_margin_bottom',
					// 'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_menu_icon,
					'max' => 20,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_icon_margin_left',
					// 'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_menu_icon,
					'max' => 20,
					'ext' => 'px',
				),
			array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_icon_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_menu_icon,
			),

			/**
			 * Subnav
			 */

			array(
				'label' => __( 'Dropdown Preview', 'lcproext' ),
				'label_alt' => __( 'Show Dropdown', 'lcproext' ),
				'help' => __( 'Click multiple times on the button to change between dropdown.' ),
				'id' => 'css_toggle_dropdown',
				'std' => '',
				'type' => 'button',
				'refresh_on_change' => false,
				'advanced_action' => 'dslc_show_dropdown()',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
			array(
				'label' => __( 'Dropdown Direction', 'lcproext' ),
				'id' => 'css_subnav_position',
				'std' => 'left',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Left', 'lcproext' ),
						'value' => 'left',
					),
					array(
						'label' => __( 'Center', 'lcproext' ),
						'value' => 'center',
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'value' => 'right',
					),
					array(
						'label' => __( 'Full Width', 'lcproext' ),
						'value' => 'full-width',
					),
				),
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
/* @todo: needs more work.
			array(
				'label' => __( 'Align', 'lcproext' ),
				'id' => 'css_subnav_align',
				'std' => 'left',
				'type' => 'text_align',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.menu ul.sub-menu',
				'affect_on_change_rule' => 'text-align',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
*/

/*
			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_subnav_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
				array(
					'label' => __( 'Padding Top', 'lcproext' ),
					'id' => 'css_subnav_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Padding Right', 'lcproext' ),
					'id' => 'css_subnav_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Padding Bottom', 'lcproext' ),
					'id' => 'css_subnav_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Padding Left', 'lcproext' ),
					'id' => 'css_subnav_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
					'ext' => 'px',
				),
			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_subnav_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
*/
			array(
				'label' => __( 'Background', 'lcproext' ),
				'id' => 'css_subnav_bg_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
				array(
					'label' => __( 'BG Color', 'lcproext' ),
					'id' => 'css_subnav_bg_color',
					'std' => '#fff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu, .menu > li:not(.menu-type-columns) ul.sub-menu',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'BG Image', 'lcproext' ),
					'id' => 'css_subnav_bg_img',
					'std' => '',
					'type' => 'image',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu',
					'affect_on_change_rule' => 'background-image',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'BG Image Repeat', 'lcproext' ),
					'id' => 'css_subnav_bg_img_repeat',
					'std' => 'repeat',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Repeat', 'lcproext' ),
							'value' => 'repeat',
						),
						array(
							'label' => __( 'Repeat Horizontal', 'lcproext' ),
							'value' => 'repeat-x',
						),
						array(
							'label' => __( 'Repeat Vertical', 'lcproext' ),
							'value' => 'repeat-y',
						),
						array(
							'label' => __( 'Do NOT Repeat', 'lcproext' ),
							'value' => 'no-repeat',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu',
					'affect_on_change_rule' => 'background-repeat',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'BG Image Attachment', 'lcproext' ),
					'id' => 'css_subnav_bg_img_attch',
					'std' => 'scroll',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Scroll', 'lcproext' ),
							'value' => 'scroll',
						),
						array(
							'label' => __( 'Fixed', 'lcproext' ),
							'value' => 'fixed',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu',
					'affect_on_change_rule' => 'background-attachment',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'BG Image Position', 'lcproext' ),
					'id' => 'css_subnav_bg_img_pos',
					'std' => 'top left',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Top Left', 'lcproext' ),
							'value' => 'left top',
						),
						array(
							'label' => __( 'Top Right', 'lcproext' ),
							'value' => 'right top',
						),
						array(
							'label' => __( 'Top Center', 'lcproext' ),
							'value' => 'Center Top',
						),
						array(
							'label' => __( 'Center Left', 'lcproext' ),
							'value' => 'left center',
						),
						array(
							'label' => __( 'Center Right', 'lcproext' ),
							'value' => 'right center',
						),
						array(
							'label' => __( 'Center', 'lcproext' ),
							'value' => 'center center',
						),
						array(
							'label' => __( 'Bottom Left', 'lcproext' ),
							'value' => 'left bottom',
						),
						array(
							'label' => __( 'Bottom Right', 'lcproext' ),
							'value' => 'right bottom',
						),
						array(
							'label' => __( 'Bottom Center', 'lcproext' ),
							'value' => 'center bottom',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu',
					'affect_on_change_rule' => 'background-position',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
			array(
				'label' => __( 'Background', 'lcproext' ),
				'id' => 'css_subnav_bg_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),

			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_subnav_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),
				array(
					'label' => __( 'Border Color', 'lcproext' ),
					'id' => 'css_subnav_border_color',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu, .menu > li:not(.menu-type-columns) ul.sub-menu',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'Border Width', 'lcproext' ),
					'id' => 'css_subnav_border_width',
					'onlypositive' => true, // Value can't be negative.
					'max' => 10,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu, .menu > li:not(.menu-type-columns) ul.sub-menu',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_subnav_border_trbl',
					'std' => 'top right bottom left',
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
					'affect_on_change_el' => '.menu > li > ul.sub-menu, .menu > li:not(.menu-type-columns) ul.sub-menu',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'Border Radius - Top', 'lcproext' ),
					'id' => 'css_subnav_border_radius_top',
					'onlypositive' => true, // Value can't be negative.
					'std' => '4',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu, .menu > li:not(.menu-type-columns) ul.sub-menu',
					'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_block,
				),
				array(
					'label' => __( 'Border Radius - Bottom', 'lcproext' ),
					'id' => 'css_subnav_border_radius_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '4',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li > ul.sub-menu, .menu > li:not(.menu-type-columns) ul.sub-menu',
					'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_block,
				),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_subnav_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_block,
			),

			/**
			 * Styling - Submenu > Item
			 */
			array(
				'label' => __( 'Text Colors', 'lcproext' ),
				'id' => 'css_subnav_item_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),
				array(
					'label' => __( 'Normal', 'lcproext' ),
					'id' => 'css_subnav_item_color',
					'std' => '#909497',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) .sub-menu li > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Hover', 'lcproext' ),
					'id' => 'css_subnav_item_color_hover',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) .sub-menu li:hover > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Active', 'lcproext' ),
					'id' => 'css_subnav_item_color_active',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) .sub-menu li.current-menu-item > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
			array(
				'label' => __( 'Text Colors', 'lcproext' ),
				'id' => 'css_subnav_item_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),


			array(
				'label' => __( 'Background Colors', 'lcproext' ),
				'id' => 'css_subnav_item_bg_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),
				array(
					'label' => __( 'Normal', 'lcproext' ),
					'id' => 'css_subnav_item_bg_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					//'affect_on_change_el' => '.menu ul li:not(.menu-item-has-children):not(.lcmenu-additional-info)',
					// .menu > li:not(.menu-type-columns)
					// '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a'
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li:not(.lcmenu-additional-info)',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Hover', 'lcproext' ),
					'id' => 'css_subnav_item_bg_color_hover',
					'std' => '#56aee3',
					'type' => 'color',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.menu ul li:not(.menu-item-has-children):not(.lcmenu-additional-info):hover',
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li:not(.lcmenu-additional-info):hover',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Active', 'lcproext' ),
					'id' => 'css_subnav_item_bg_color_active',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.menu ul li:not(.menu-item-has-children):not(.lcmenu-additional-info).current-menu-item',
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li:not(.lcmenu-additional-info).current-menu-item',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
			array(
				'label' => __( 'Background Colors', 'lcproext' ),
				'id' => 'css_subnav_item_bg_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),


			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_subnav_item_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_subnav_item_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '6',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_subnav_item_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_subnav_item_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '6',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_subnav_item_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
				),
			array(
				'id' => 'css_subnav_item_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),


			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_item_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_subnav_item_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '15',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_subnav_item_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '21',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_subnav_item_font_weight',
					'std' => '300',
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
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_subnav_item_font_family',
					'std' => 'Roboto',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Letter Spacing', 'lcproext' ),
					'id' => 'css_subnav_item_letter_spacing',
					'max' => 30,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_subnav_item_text_transform',
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
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_item_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),

			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_subnav_item_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),
				array(
					'label' => __( 'Border Color', 'lcproext' ),
					'id' => 'css_subnav_item_border_color',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Border Color - Hover', 'lcproext' ),
					'id' => 'css_subnav_item_border_color_hover',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li:hover',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Border Color - Active', 'lcproext' ),
					'id' => 'css_subnav_item_border_color_active',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li.current-menu-item',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Border Width', 'lcproext' ),
					'id' => 'css_subnav_item_border_width',
					'onlypositive' => true, // Value can't be negative.
					'max' => 10,
					'std' => '1',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_subnav_item_border_trbl',
					'std' => 'bottom',
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
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Border Radius - Top', 'lcproext' ),
					'id' => 'css_subnav_item_border_radius_top',
					'onlypositive' => true, // Value can't be negative.
					'std' => '2',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_item,
				),
				array(
					'label' => __( 'Border Radius - Bottom', 'lcproext' ),
					'id' => 'css_subnav_item_border_radius_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '2',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
					'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_item,
				),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_subnav_item_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item,
			),

			/**
			 * SubMenu > Icon
			 */

			array(
				'label' => __( 'Icon Size', 'lcproext' ),
				'id' => 'css_subnav_icon_size',
				'onlypositive' => true, // Value can't be negative.
				'std' => '17',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:before, .sub-menu .menu-item[class*=' dslc-icon-']:before",
				'affect_on_change_rule' => 'font-size, width, height',
				'section' => 'styling',
				'tab' => $str_tab_submenu_icon,
				'min' => 1,
				'max' => 50,
				'ext' => 'px',
			),

			array(
				'label' => __( 'Color', 'lcproext' ),
				'id' => 'css_subnav_icon_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_icon,
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_subnav_icon_color',
					'std' => '#909497',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:before, .sub-menu .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_icon,
				),
				array(
					'label' => __( 'Color - Hover', 'lcproext' ),
					'id' => 'css_subnav_icon_color_hover',
					'std' => '#56aee3',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:hover::before, .sub-menu .menu-item[class*=' dslc-icon-']:hover::before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_icon,
				),
			array(
				'label' => '',
				'id' => 'css_subnav_icon_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_icon,
			),

			array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_subnav_icon_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_icon,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_subnav_icon_margin_top',
					// 'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:before, .sub-menu .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_icon,
					'max' => 20,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_subnav_icon_margin_right',
					// 'onlypositive' => true, // Value can't be negative.
					'max' => 20,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:before, .sub-menu .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_icon,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_subnav_icon_margin_bottom',
					// 'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:before, .sub-menu .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_icon,
					'max' => 20,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_subnav_icon_margin_left',
					// 'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".sub-menu .menu-item[class^='dslc-icon-']:before, .sub-menu .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_icon,
					'max' => 20,
					'ext' => 'px',
				),
			array(
				'id' => 'css_subnav_icon_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_icon,
			),

			/**
			 * Styling - Submenu With Columns
			 */
			array(
				'label' => __( 'Dropdown Padding', 'lcproext' ),
				'id' => 'css_subnav_column_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_subnav_column_panel_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 30,
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_subnav_column_panel_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 30,
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_subnav_column_panel_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column,
					'max' => 30,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_subnav_column_panel_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column,
					'max' => 30,
					'ext' => 'px',
				),
			array(
				'id' => 'css_subnav_column_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column,
			),

			array(
				'label' => __( 'Columns Spacing', 'lcproext' ),
				'id' => 'css_subnav_column_spacing',
				'onlypositive' => true, // Value can't be negative.
				'max' => 30,
				'std' => '16',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.menu > li.menu-type-columns > .sub-menu > .menu-item-has-children',
				'affect_on_change_rule' => 'margin-right',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column,
				'ext' => 'px',
			),

			/**
			 * Styling - Submenu Columns Item
			 */
			array(
				'label' => __( 'Text Colors', 'lcproext' ),
				'id' => 'css_subnav_column_item_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),
				array(
					'label' => __( 'Normal', 'lcproext' ),
					'id' => 'css_subnav_column_item_color',
					'std' => '#909497',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .sub-menu li:not(.menu-item-has-children) > a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Hover', 'lcproext' ),
					'id' => 'css_subnav_column_item_color_hover',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .sub-menu li:not(.menu-item-has-children):hover > a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children:hover > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Active', 'lcproext' ),
					'id' => 'css_subnav_column_item_color_active',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .sub-menu li:not(.menu-item-has-children).current-menu-item > a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children.current-menu-item > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
			array(
				'label' => __( 'Text Colors', 'lcproext' ),
				'id' => 'css_subnav_column_item_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),

			array(
				'label' => __( 'Icon Colors', 'lcproext' ),
				'id' => 'css_subnav_column_item_icon_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),
				array(
					'label' => __( 'Normal', 'lcproext' ),
					'id' => 'css_subnav_column_item_icon_color',
					'std' => '#909497',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu > li.menu-type-columns .sub-menu .sub-menu li[class^='dslc-icon-']:not(.menu-item-has-children):before, .menu > li.menu-type-columns .sub-menu .sub-menu li[class*=' dslc-icon-']:not(.menu-item-has-children):before, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li[class^='dslc-icon-'].menu-item-has-children:before, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li[class*=' dslc-icon-'].menu-item-has-children:before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Hover', 'lcproext' ),
					'id' => 'css_subnav_column_item_icon_color_hover',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu > li.menu-type-columns .sub-menu .sub-menu li[class^='dslc-icon-']:not(.menu-item-has-children):hover:before, .menu > li.menu-type-columns .sub-menu .sub-menu li[class*=' dslc-icon-']:not(.menu-item-has-children):hover:before, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li[class^='dslc-icon-'].menu-item-has-children:hover:before, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li[class*=' dslc-icon-'].menu-item-has-children:hover:before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Active', 'lcproext' ),
					'id' => 'css_subnav_column_item_icon_color_active',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".menu > li.menu-type-columns .sub-menu .sub-menu li.current-menu-item[class^='dslc-icon-']:not(.menu-item-has-children):before, .menu > li.menu-type-columns .sub-menu .sub-menu li[class*=' dslc-icon-']:not(.menu-item-has-children):before, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.current-menu-item[class^='dslc-icon-'].menu-item-has-children:before, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.current-menu-item[class*=' dslc-icon-'].menu-item-has-children:before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
			array(
				'label' => '',
				'id' => 'css_subnav_column_item_icon_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),


			array(
				'label' => __( 'Background Colors', 'lcproext' ),
				'id' => 'css_subnav_column_item_bg_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),
				array(
					'label' => __( 'Normal', 'lcproext' ),
					'id' => 'css_subnav_column_item_bg_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					//'affect_on_change_el' => '.menu ul li:not(.menu-item-has-children):not(.lcmenu-additional-info)',
					// .menu > li:not(.menu-type-columns)
					// '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a'
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .sub-menu li:not(.lcmenu-additional-info)',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Hover', 'lcproext' ),
					'id' => 'css_subnav_column_item_bg_color_hover',
					'std' => '#56aee3',
					'type' => 'color',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.menu ul li:not(.menu-item-has-children):not(.lcmenu-additional-info):hover',
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .sub-menu li:not(.lcmenu-additional-info):hover',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Active', 'lcproext' ),
					'id' => 'css_subnav_column_item_bg_color_active',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.menu ul li:not(.menu-item-has-children):not(.lcmenu-additional-info).current-menu-item',
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .sub-menu li:not(.lcmenu-additional-info).current-menu-item',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
			array(
				'label' => __( 'Background Colors', 'lcproext' ),
				'id' => 'css_subnav_column_item_bg_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),


			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_subnav_column_item_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_subnav_column_item_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '6',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li:not(.menu-item-has-children), .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_subnav_column_item_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li:not(.menu-item-has-children), .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_subnav_column_item_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '6',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li:not(.menu-item-has-children), .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_subnav_column_item_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li:not(.menu-item-has-children), .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
				),
			array(
				'id' => 'css_subnav_column_item_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),


			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_column_item_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_subnav_column_item_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '15',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_subnav_column_item_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '21',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_subnav_column_item_font_weight',
					'std' => '300',
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
					'affect_on_change_el' => '.menu > li.menu-type-columns li a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_subnav_column_item_font_family',
					'std' => 'Roboto',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Letter Spacing', 'lcproext' ),
					'id' => 'css_subnav_column_item_letter_spacing',
					'max' => 30,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_subnav_column_item_text_transform',
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
					'affect_on_change_el' => '.menu > li.menu-type-columns li a, .menu > li.menu-type-columns ul.sub-menu li.menu-item-has-children ul.sub-menu li.menu-item-has-children > a',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_column_item_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),


			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_subnav_column_item_border_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),
				array(
					'label' => __( 'Border Color', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_color',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Border Color - Hover', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_color_hover',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li:hover',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Border Color - Active', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_color_active',
					'std' => '#ededed',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li.current-menu-item',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Border Width', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_width',
					'onlypositive' => true, // Value can't be negative.
					'max' => 10,
					'std' => '1',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Borders', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_trbl',
					'std' => 'bottom',
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
					'affect_on_change_el' => '.menu > li.menu-type-columns li',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Border Radius - Top', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_radius_top',
					'onlypositive' => true, // Value can't be negative.
					'std' => '2',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li',
					'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_column_item,
				),
				array(
					'label' => __( 'Border Radius - Bottom', 'lcproext' ),
					'id' => 'css_subnav_column_item_border_radius_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '2',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns li',
					'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
					'section' => 'styling',
					'ext' => 'px',
					'tab' => $str_tab_submenu_column_item,
				),
			array(
				'label' => __( 'Border', 'lcproext' ),
				'id' => 'css_subnav_column_item_border_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_column_item,
			),

			/**
			 * Subnav Item - Title
			 */

			array(
				'label' => __( 'Color', 'lcproext' ),
				'id' => 'css_subnav_item_title_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_title,
			),
				array(
					'label' => __( 'Normal', 'lcproext' ),
					'id' => 'css_subnav_item_title_color',
					'std' => '#000000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
				),
				array(
					'label' => __( 'Hover', 'lcproext' ),
					'id' => 'css_subnav_item_title_color_hover',
					'std' => '#000000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a:hover',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
				),
			array(
				'label' => __( 'Color', 'lcproext' ),
				'id' => 'css_subnav_item_title_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_title,
			),


			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_item_title_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_title,
			),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_subnav_item_title_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '15',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_subnav_item_title_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_subnav_item_title_font_weight',
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
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_subnav_item_title_font_family',
					'std' => 'Roboto',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_subnav_item_title_text_transform',
					'std' => 'uppercase',
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
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
				),
				array(
					'label' => __( 'Letter Spacing', 'lcproext' ),
					'id' => 'css_subnav_item_title_letter_spacing',
					'max' => 30,
					'std' => '1',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_item_title_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_title,
			),

			array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_subnav_item_title_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_title,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_subnav_item_title_margin_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_subnav_item_title_margin_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_subnav_item_title_margin_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '15',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_subnav_item_title_margin_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li.menu-type-columns .sub-menu .menu-item-has-children > a',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_title,
					'ext' => 'px',
				),
			array(
				'id' => 'css_subnav_item_title_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_title,
			),


			/**
			 * Subnav Item - Description
			 */

			array(
				'label' => __( 'Color', 'lcproext' ),
				'id' => 'css_subnav_item_description_color',
				'std' => '#b9b6b6',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
				'affect_on_change_rule' => 'color',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_description,
			),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_item_description_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_description,
			),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_subnav_item_description_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '12',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_subnav_item_description_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '16',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_subnav_item_description_font_weight',
					'std' => '300',
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
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_subnav_item_description_font_family',
					'std' => 'Roboto',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_subnav_item_description_text_transform',
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
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
				),
				array(
					'label' => __( 'Letter Spacing', 'lcproext' ),
					'id' => 'css_subnav_item_description_letter_spacing',
					'max' => 30,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
			array(
				'label' => __( 'Font', 'lcproext' ),
				'id' => 'css_subnav_item_description_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_description,
			),
			array(
				'label' => __( 'Margin', 'lcproext' ),
				'id' => 'css_subnav_item_description_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_description,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_subnav_item_description_margin_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '3',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_subnav_item_description_margin_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_subnav_item_description_margin_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_subnav_item_description_margin_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu-item-has-children .menu-item-description',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_description,
					'ext' => 'px',
				),
			array(
				'id' => 'css_subnav_item_description_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_description,
			),

			/**
			 * Additional Information
			 */

			array(
				'label' => __( 'Colors', 'lcproext' ),
				'id' => 'css_additional_info_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
				array(
					'label' => __( 'Title - Color', 'lcproext' ),
					'id' => 'css_additional_info_title_color',
					'std' => '#555555',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
				),
				array(
					'label' => __( 'Description - Color', 'lcproext' ),
					'id' => 'css_additional_info_description_color',
					'std' => '#555555',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
				),
			array(
				'label' => '',
				'id' => 'css_additional_info_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),

			array(
				'label' => __( 'Title - Font', 'lcproext' ),
				'id' => 'css_additional_info_title_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
				array(
					'label' => __( 'Font Size', 'lcproext' ),
					'id' => 'css_additional_info_title_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '14',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Line Height', 'lcproext' ),
					'id' => 'css_additional_info_title_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '22',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Weight', 'lcproext' ),
					'id' => 'css_additional_info_title_font_weight',
					'std' => '700',
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
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => '',
				),
				array(
					'label' => __( 'Font Family', 'lcproext' ),
					'id' => 'css_additional_info_title_font_family',
					'std' => 'Montserrat',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
				),
				array(
					'label' => __( 'Text Transform', 'lcproext' ),
					'id' => 'css_additional_info_title_text_transform',
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
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
				),
				array(
					'label' => __( 'Letter Spacing', 'lcproext' ),
					'id' => 'css_additional_info_title_letter_spacing',
					'max' => 30,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
			array(
				'label' => __( 'Title - Font', 'lcproext' ),
				'id' => 'css_additional_info_title_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
			array(
				'label' => __( 'Description - Font', 'lcproext' ),
				'id' => 'css_additional_info_description_font_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
				array(
					'label' => __( 'Description - Font Size', 'lcproext' ),
					'id' => 'css_additional_info_description_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '14',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Description - Line Height', 'lcproext' ),
					'id' => 'css_additional_info_description_line_height',
					'onlypositive' => true, // Value can't be negative.
					'std' => '22',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'line-height',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Description - Font Weight', 'lcproext' ),
					'id' => 'css_additional_info_description_font_weight',
					'std' => '700',
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
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'font-weight',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => '',
				),
				array(
					'label' => __( 'Description - Font Family', 'lcproext' ),
					'id' => 'css_additional_info_description_font_family',
					'std' => 'Montserrat',
					'type' => 'font',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'font-family',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
				),
				array(
					'label' => __( 'Description - Text Transform', 'lcproext' ),
					'id' => 'css_additional_info_description_text_transform',
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
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'text-transform',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
				),
				array(
					'label' => __( 'Description - Letter Spacing', 'lcproext' ),
					'id' => 'css_additional_info_description_letter_spacing',
					'max' => 30,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'letter-spacing',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
					'min' => -50,
					'max' => 50,
				),
			array(
				'label' => __( 'Description - Font', 'lcproext' ),
				'id' => 'css_additional_info_description_font_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
			array(
				'label' => __( 'Description - Margin', 'lcproext' ),
				'id' => 'css_additional_info_description_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_additional_info_description_margin_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_additional_info_description_margin_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_additional_info_description_margin_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_additional_info_description_margin_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenu-additional-info .menu-item-description',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
			array(
				'id' => 'css_additional_info_description_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),

			array(
				'label' => __( 'Padding', 'lcproext' ),
				'id' => 'css_additional_info_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_additional_info_padding_top',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'padding-top',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_additional_info_padding_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 600,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'padding-right',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_additional_info_padding_bottom',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_additional_info_padding_left',
					'onlypositive' => true, // Value can't be negative.
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu .sub-menu .lcmenu-additional-info > a',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_submenu_item_special,
					'ext' => 'px',
				),
			array(
				'label' => __( 'Description - Margin', 'lcproext' ),
				'id' => 'css_additional_info_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_submenu_item_special,
			),

			/**
			 * Mobile Menu
			 */

			array(
				'label' => __( 'Mobile Menu Preview', 'lcproext' ),
				'label_alt' => __( 'Show Mobile Menu', 'lcproext' ),
				'id' => 'css_toggle_menu_preview',
				'std' => '',
				'type' => 'button',
				'refresh_on_change' => false,
				'advanced_action' => 'dslc_show_menu()',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Colors', 'lcproext' ),
				'id' => 'css_mobile_menu_colors_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Content Overlay', 'lcproext' ),
					'id' => 'css_mobile_menu_overlay_bg_color',
					'std' => 'rgba(0,0,0,0.63)',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-site-overlay',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Menu Background', 'lcproext' ),
					'id' => 'css_mobile_menu_bg_color',
					'std' => '#000',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-inner',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
			array(
				'label' => '',
				'id' => 'css_mobile_menu_colors_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Menu Panel - Padding', 'lcproext' ),
				'id' => 'css_mobile_menu_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Vertical', 'lcproext' ),
					'id' => 'css_mobile_menu_padding_top',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu',
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-inner',
					'affect_on_change_rule' => 'padding-top, padding-bottom',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Horizontal', 'lcproext' ),
					'id' => 'css_mobile_menu_padding_left',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu',
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-inner',
					'affect_on_change_rule' => 'padding-left, padding-right',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
			array(
				'id' => 'css_mobile_menu_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Mobile Logo', 'lcproext' ),
				'id' => 'css_mobile_menu_logo_padding_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Size', 'lcproext' ),
					'id' => 'css_mobile_menu_logo_width',
					'onlypositive' => true, // Value can't be negative.
					'std' => '100',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenu-mobile-logo img',
					'affect_on_change_rule' => 'width',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'min' => 1,
					'max' => 1000,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Spacing – Top', 'lcproext' ),
					'id' => 'css_mobile_menu_logo_padding_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenu-mobile-logo',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Spacing – Bottom', 'lcproext' ),
					'id' => 'css_mobile_menu_logo_padding_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenu-mobile-logo',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
			array(
				'label' => '',
				'id' => 'css_mobile_menu_logo_padding_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Close Icon', 'lcproext' ),
				'id' => 'css_mobile_menu_icon_close_color_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Size', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_close_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenu-mobile-close-hook .lcmenupro-icon',
					'affect_on_change_rule' => 'height, width',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'min' => 1,
					'max' => 50,
					'ext' => 'px',
				),

				array(
					'label' => __( 'Padding', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_close_padding',
					'onlypositive' => true, // Value can't be negative.
					'std' => '4',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenu-mobile-close-hook .lcmenupro-icon',
					'affect_on_change_rule' => 'padding',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'min' => 1,
					'max' => 50,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Background Color', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_close_bg_color',
					'std' => 'rgba(94,94,94,0.22)',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-inner .lcmenu-mobile-close-hook',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Icon Color', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_close_color',
					'std' => '#605c5c',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenu-mobile-close-hook .lcmenupro-icon',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
			array(
				'id' => 'css_mobile_menu_icon_close_color_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Menu Item Icon', 'lcproext' ),
				'id' => 'css_mobile_menu_icon_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Size', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '17',
					'type' => 'slider',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => ".menu-item[class^='dslc-icon-']:before, .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_el' => ".lcmenupro-mobile-navigation .menu-item[class^='dslc-icon-']:before, .lcmenupro-mobile-navigation .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'font-size, width, height',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'min' => 1,
					'max' => 50,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_color',
					'std' => '#fff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".lcmenupro-mobile-navigation .menu-item[class^='dslc-icon-']:before, .lcmenupro-mobile-navigation .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Color: Hover', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_color_hover',
					'std' => '#fff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".lcmenupro-mobile-navigation .menu-item[class^='dslc-icon-']:hover::before, .lcmenupro-mobile-navigation .menu-item[class*=' dslc-icon-']:hover::before",
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Spacing – Right', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_margin_right',
					'onlypositive' => true, // Value can't be negative.
					'max' => 40,
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".lcmenupro-mobile-navigation .menu-item[class^='dslc-icon-']:before, .lcmenupro-mobile-navigation .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-right',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Spacing – Left', 'lcproext' ),
					'id' => 'css_mobile_menu_icon_margin_left',
					'onlypositive' => true, // Value can't be negative.
					'max' => 40,
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => ".lcmenupro-mobile-navigation .menu-item[class^='dslc-icon-']:before, .lcmenupro-mobile-navigation .menu-item[class*=' dslc-icon-']:before",
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
			array(
				'id' => 'css_mobile_menu_icon_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Menu Item', 'lcproext' ),
				'id' => 'css_mobile_menu_item_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_mobile_menu_color',
					'std' => '#fff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu a',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Color: Active', 'lcproext' ),
					'id' => 'css_mobile_menu_color_active',
					'std' => '#e0e0e0',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu a:active',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Margin Bottom', 'lcproext' ),
					'id' => 'css_mobile_menu_subnav_item_padding_left',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu',
					'affect_on_change_el' => '.lcmenupro-mobile-menu > .menu-item',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Size – Main Items', 'lcproext' ),
					'id' => 'css_mobile_menu_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '18',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu a',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Font Size – Subnav Items', 'lcproext' ),
					'id' => 'css_mobile_menu_subnav_item_font_size',
					'onlypositive' => true, // Value can't be negative.
					'std' => '13',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu ul.sub-menu li a',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Subnav Items – Spacing Left', 'lcproext' ),
					'id' => 'css_mobile_menu_subnav_item_padding_left',
					'std' => '20',
					'type' => 'slider',
					'refresh_on_change' => false,
					// 'affect_on_change_el' => '.lcmenupro-mobile-navigation .lcmenupro-mobile-menu',
					'affect_on_change_el' => '.lcmenupro-mobile-menu .sub-menu',
					'affect_on_change_rule' => 'padding-left',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
			array(
				'id' => 'css_mobile_menu_item_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			array(
				'label' => __( 'Chevron (Dropdown Arrow Icon)', 'lcproext' ),
				'id' => 'css_mobile_menu_chevron_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),
				array(
					'label' => __( 'Color', 'lcproext' ),
					'id' => 'css_mobile_menu_chevron_color',
					'std' => '#ffffff',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-menu .dslc-navigation-arrow',
					'affect_on_change_rule' => 'color',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),
				array(
					'label' => __( 'Size', 'lcproext' ),
					'id' => 'css_mobile_menu_chevron_size',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-menu .dslc-navigation-arrow',
					'affect_on_change_rule' => 'font-size',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
				array(
					'label' => __( 'Margin Left', 'lcproext' ),
					'id' => 'css_mobile_menu_chevron_spacing',
					'std' => '10',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-mobile-menu .dslc-navigation-arrow',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
					'ext' => 'px',
				),
			array(
				'label' => __( 'Chevron (Dropdown Arrow Icon)', 'lcproext' ),
				'id' => 'css_mobile_menu_chevron_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'styling',
				'tab' => $str_tab_mobile_menu,
			),

			// ============================================================

				array(
					'label' => __( 'Visibility', 'lcproext' ),
					'id' => 'css_mobile_show_ongroup',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_toggle,
				),
					array(
						'id' => 'css_fullmenu_show_on',
						'std' => 'desktop',
						'label' => __( 'Show Full Menu On', 'lcproext' ),
						'type' => 'checkbox',
						'choices' => array(
							array(
								'label' => 'Desktop',
								'value' => 'desktop',
							),
							array(
								'label' => 'Tablet',
								'value' => 'tablet',
							),
							array(
								'label' => 'Phone',
								'value' => 'phone',
							),
						),
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
					),

					array(
						'id' => 'css_mobile_toggle_show_on',
						'std' => '',
						'label' => __( 'Show Mobile Icon On', 'lcproext' ),
						'type' => 'checkbox',
						'choices' => array(
							array(
								'label' => 'Desktop',
								'value' => 'desktop',
							),
							array(
								'label' => 'Tablet',
								'value' => 'tablet',
							),
							array(
								'label' => 'Phone',
								'value' => 'phone',
							),
						),
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
					),
				array(
					'id' => 'css_mobile_show_ongroup',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_toggle,
				),


				/* RESPONSIVE *********************************************** */

				/* Phone */

				array(
					'label' => __( 'Responsive Styling', 'lcproext' ),
					'id' => 'css_res_p',
					'std' => 'disabled',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Disabled', 'lcproext' ),
							'value' => 'disabled',
						),
						array(
							'label' => __( 'Enabled', 'lcproext' ),
							'value' => 'enabled',
						),
					),
					'section' => 'responsive',
					'tab' => __( 'Phone', 'lcproext' ),
				),


					array(
						'label' => __( 'Spacing (sides)', 'lcproext' ),
						'id' => 'css_res_p_fullmenu_item_spacing',
						'std' => '1',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li',
						'affect_on_change_rule' => 'margin-left,margin-right',
						'section' => 'responsive',
						'ext' => 'px',
						'tab' => __( 'Phone', 'lcproext' ),
					),

					array(
						'label' => __( 'Main Item – Typography', 'lcproext' ),
						'id' => 'css_res_p_fullmenu_font_start',
						'type' => 'group',
						'action' => 'open',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),

						array(
							'label' => __( 'Font Size', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_font_size',
							'onlypositive' => true, // Value can't be negative.
							'std' => '16',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li',
							'affect_on_change_rule' => 'font-size',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Line Height', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_line_height',
							'onlypositive' => true, // Value can't be negative.
							'std' => '24',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li > a',
							'affect_on_change_rule' => 'line-height',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Icon Size', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_icon_size',
							'onlypositive' => true, // Value can't be negative.
							'std' => '17',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => ".menu.dslc-res-full-menu .menu-item[class^='dslc-icon-']:before, .menu.dslc-res-full-menu .menu-item[class*=' dslc-icon-']:before",
							'affect_on_change_rule' => 'font-size, width, height',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'min' => 1,
							'max' => 50,
							'ext' => 'px',
						),

					array(
						'id' => 'css_res_p_fullmenu_font_end',
						'type' => 'group',
						'action' => 'close',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),


					array(
						'label' => __( 'Main Item – Padding', 'lcproext' ),
						'id' => 'css_res_p_fullmenu_padding_group_start',
						'type' => 'group',
						'action' => 'open',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),
						array(
							'label' => __( 'Top', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_padding_top',
							'onlypositive' => true, // Value can't be negative.
							'max' => 600,
							'std' => '10',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li',
							'affect_on_change_rule' => 'padding-top',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Right', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_padding_right',
							'onlypositive' => true, // Value can't be negative.
							'max' => 600,
							'std' => '10',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li',
							'affect_on_change_rule' => 'padding-right',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Bottom', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_padding_bottom',
							'onlypositive' => true, // Value can't be negative.
							'std' => '10',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li',
							'affect_on_change_rule' => 'padding-bottom',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Left', 'lcproext' ),
							'id' => 'css_res_p_fullmenu_padding_left',
							'onlypositive' => true, // Value can't be negative.
							'std' => '10',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li',
							'affect_on_change_rule' => 'padding-left',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
					array(
						'id' => 'css_res_p_fullmenu_padding_group_end',
						'type' => 'group',
						'action' => 'close',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),

					array(
						'label' => __( 'Submenu Item – Typography', 'lcproext' ),
						'id' => 'css_res_p_submenu_item_show_ongroup',
						'type' => 'group',
						'action' => 'open',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),
						array(
							'label' => __( 'Font Size', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_font_size',
							'onlypositive' => true, // Value can't be negative.
							'std' => '15',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
							'affect_on_change_rule' => 'font-size',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Line Height', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_line_height',
							'onlypositive' => true, // Value can't be negative.
							'std' => '21',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
							'affect_on_change_rule' => 'line-height',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Icon Size', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_icon_size',
							'onlypositive' => true, // Value can't be negative.
							'std' => '17',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => ".menu.dslc-res-full-menu .sub-menu .menu-item[class^='dslc-icon-']:before, .menu.dslc-res-full-menu .sub-menu .menu-item[class*=' dslc-icon-']:before",
							'affect_on_change_rule' => 'font-size, width, height',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'min' => 1,
							'max' => 50,
							'ext' => 'px',
						),

					array(
						'id' => 'css_res_p_submenu_item_show_ongroup',
						'type' => 'group',
						'action' => 'close',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),

					array(
						'label' => __( 'Submenu Item – Padding', 'lcproext' ),
						'id' => 'css_res_p_subnav_item_padding_group',
						'type' => 'group',
						'action' => 'open',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),
						array(
							'label' => __( 'Top', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_padding_top',
							'onlypositive' => true, // Value can't be negative.
							'max' => 600,
							'std' => '6',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li a',
							'affect_on_change_rule' => 'padding-top',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Right', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_padding_right',
							'onlypositive' => true, // Value can't be negative.
							'max' => 600,
							'std' => '10',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
							'affect_on_change_rule' => 'padding-right',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Bottom', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_padding_bottom',
							'onlypositive' => true, // Value can't be negative.
							'std' => '6',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
							'affect_on_change_rule' => 'padding-bottom',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Left', 'lcproext' ),
							'id' => 'css_res_p_subnav_item_padding_left',
							'onlypositive' => true, // Value can't be negative.
							'std' => '10',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.menu > li:not(.menu-type-columns) li',
							'affect_on_change_rule' => 'padding-left',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
					array(
						'id' => 'css_res_p_subnav_item_padding_group',
						'type' => 'group',
						'action' => 'close',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),

					array(
						'label' => __( 'Mobile Menu Icon – Margin', 'lcproext' ),
						'id' => 'css_res_p_toggle_icon_margin_group',
						'type' => 'group',
						'action' => 'open',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),
						array(
							'label' => __( 'Top', 'lcproext' ),
							'id' => 'css_res_p_toggle_icon_margin_top',
							'std' => '0',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.lcmenu-mobile-hook',
							'affect_on_change_rule' => 'margin-top',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Right', 'lcproext' ),
							'id' => 'css_res_p_toggle_icon_margin_right',
							'std' => '0',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.lcmenu-mobile-hook',
							'affect_on_change_rule' => 'margin-right',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Bottom', 'lcproext' ),
							'id' => 'css_res_p_toggle_icon_margin_bottom',
							'std' => '0',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.lcmenu-mobile-hook',
							'affect_on_change_rule' => 'margin-bottom',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),
						array(
							'label' => __( 'Left', 'lcproext' ),
							'id' => 'css_res_p_toggle_icon_margin_left',
							'std' => '0',
							'type' => 'slider',
							'refresh_on_change' => false,
							'affect_on_change_el' => '.lcmenu-mobile-hook',
							'affect_on_change_rule' => 'margin-left',
							'section' => 'responsive',
							'tab' => __( 'Phone', 'lcproext' ),
							'ext' => 'px',
						),

					array(
						'id' => 'css_res_p_toggle_icon_margin_group',
						'type' => 'group',
						'action' => 'close',
						'section' => 'responsive',
						'tab' => __( 'Phone', 'lcproext' ),
					),


				/* Tablet */

				array(
					'label' => __( 'Responsive Styling', 'lcproext' ),
					'id' => 'css_res_t',
					'std' => 'disabled',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Disabled', 'lcproext' ),
							'value' => 'disabled',
						),
						array(
							'label' => __( 'Enabled', 'lcproext' ),
							'value' => 'enabled',
						),
					),
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
				),



				array(
					'label' => __( 'Spacing (sides)', 'lcproext' ),
					'id' => 'css_res_t_fullmenu_item_spacing',
					'std' => '1',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.menu > li',
					'affect_on_change_rule' => 'margin-left,margin-right',
					'section' => 'responsive',
					'ext' => 'px',
					'tab' => __( 'Tablet', 'lcproext' ),
				),

				array(
					'label' => __( 'Typography', 'lcproext' ),
					'id' => 'css_res_t_fullmenu_font_start',
					'type' => 'group',
					'action' => 'open',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
				),

					array(
						'label' => __( 'Font Size', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_font_size',
						'onlypositive' => true, // Value can't be negative.
						'std' => '16',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li',
						'affect_on_change_rule' => 'font-size',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Line Height', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_line_height',
						'onlypositive' => true, // Value can't be negative.
						'std' => '24',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li > a',
						'affect_on_change_rule' => 'line-height',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Icon Size', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_icon_size',
						'onlypositive' => true, // Value can't be negative.
						'std' => '17',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => ".menu.dslc-res-full-menu .menu-item[class^='dslc-icon-']:before, .menu.dslc-res-full-menu .menu-item[class*=' dslc-icon-']:before",
						'affect_on_change_rule' => 'font-size, width, height',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'min' => 1,
						'max' => 50,
						'ext' => 'px',
					),

				array(
					'id' => 'css_res_t_fullmenu_font_end',
					'type' => 'group',
					'action' => 'close',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
				),

				array(
					'label' => __( 'Padding', 'lcproext' ),
					'id' => 'css_res_t_fullmenu_padding_group_start',
					'type' => 'group',
					'action' => 'open',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
				),
					array(
						'label' => __( 'Top', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_padding_top',
						'onlypositive' => true, // Value can't be negative.
						'max' => 600,
						'std' => '10',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li',
						'affect_on_change_rule' => 'padding-top',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_padding_right',
						'onlypositive' => true, // Value can't be negative.
						'max' => 600,
						'std' => '10',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li',
						'affect_on_change_rule' => 'padding-right',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Bottom', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_padding_bottom',
						'onlypositive' => true, // Value can't be negative.
						'std' => '10',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li',
						'affect_on_change_rule' => 'padding-bottom',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Left', 'lcproext' ),
						'id' => 'css_res_t_fullmenu_padding_left',
						'onlypositive' => true, // Value can't be negative.
						'std' => '10',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.menu > li',
						'affect_on_change_rule' => 'padding-left',
						'section' => 'responsive',
						'tab' => __( 'Tablet', 'lcproext' ),
						'ext' => 'px',
					),
				array(
					'id' => 'css_res_t_fullmenu_padding_group_end',
					'type' => 'group',
					'action' => 'close',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
				),

				array(
					'label' => __( 'Icon', 'lcproext' ),
					'id' => 'css_menu_toggle_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_toggle,
				),
					array(
						'label' => __( 'Icon Size', 'lcproext' ),
						'id' => 'css_menu_toggle_icon_width',
						'onlypositive' => true, // Value can't be negative.
						'std' => '24',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lcmenu-mobile-hook',
						'affect_on_change_rule' => 'width, height',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
						'min' => 1,
						'max' => 80,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Color', 'lcproext' ),
						'id' => 'css_menu_toggle_icon_color',
						'std' => 'rgba(10,10,10,0.49)',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lcmenu-mobile-hook',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
					),
					array(
						'label' => __( 'Color: Hover', 'lcproext' ),
						'id' => 'css_menu_toggle_icon_color_hover',
						'std' => 'rgba(10,10,10,0.49)',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lcmenu-mobile-hook:hover',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
					),

				array(
					'id' => 'css_menu_toggle_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu,
				),

				array(
					'label' => __( 'Margin', 'lcproext' ),
					'id' => 'css_menu_toggle_icon_margin_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_toggle,
				),
					array(
						'label' => __( 'Top', 'lcproext' ),
						'id' => 'css_menu_toggle_icon_margin_top',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lcmenu-mobile-hook',
						'affect_on_change_rule' => 'margin-top',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'id' => 'css_menu_toggle_icon_margin_right',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lcmenu-mobile-hook',
						'affect_on_change_rule' => 'margin-right',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Left', 'lcproext' ),
						'id' => 'css_menu_toggle_icon_margin_left',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lcmenu-mobile-hook',
						'affect_on_change_rule' => 'margin-left',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_toggle,
						'ext' => 'px',
					),
				array(
					'label' => __( 'Menu Toggle Icon - Margin', 'lcproext' ),
					'id' => 'css_menu_toggle_icon_margin_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_toggle,
				),

				/**
				 * Mobile Off-Canvas widget
				 */

				array(
					'label' => __( 'Widget', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),
					array(
						'label' => __( 'BG Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_bg_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'background-color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_border_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'border-color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Width', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_border_width',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'border-width',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Borders', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_border_trbl',
						'std' => 'top right bottom left',
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
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'border-style',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Radius - Top', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_border_radius_top',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Radius - Bottom', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_border_radius_bottom',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Padding Vertical', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_padding_vertical',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Padding Horizontal', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_padding_horizontal',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-wrap',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Spacing', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_margin_bottom',
						'std' => '30',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
				array(
					'label' => __( 'Widget', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),

				array(
					'label' => __( 'Title', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_title_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),
					array(
						'label' => __( 'Border Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_border_color',
						'std' => '#e5e5e5',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'border-bottom-color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Width', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_border_width',
						'onlypositive' => true, // Value can't be negative.
						'max' => 10,
						'std' => '1',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'border-bottom-width',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_color',
						'std' => '#222222',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Font Size', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_font_size',
						'onlypositive' => true, // Value can't be negative.
						'std' => '15',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'font-size',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Font Weight', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_font_weight',
						'std' => '600',
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
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'font-weight',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => '',
					),
					array(
						'label' => __( 'Font Family', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_font_family',
						'std' => 'Open Sans',
						'type' => 'font',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'font-family',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Letter Spacing', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_letter_spacing',
						'max' => 30,
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'letter-spacing',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
						'min' => -50,
						'max' => 50,
					),
					array(
						'label' => __( 'Line Height', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_line_height',
						'onlypositive' => true, // Value can't be negative.
						'std' => '15',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'line-height',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Margin Bottom', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_margin',
						'std' => '10',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Padding Bottom', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_padding',
						'std' => '10',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'padding-bottom',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Text Align', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_text_align',
						'std' => 'left',
						'type' => 'text_align',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'text-align',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Text Transform', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_text_transform',
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
						'affect_on_change_el' => '.dslc-widget-title',
						'affect_on_change_rule' => 'text-transform',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
				array(
					'label' => __( 'Title', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_title_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),

				array(
					'label' => __( 'Title Inner', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_title_inner_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),
					array(
						'label' => __( 'BG Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_bg_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'background-color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_border_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'border-color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Width', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_border_width',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'border-width',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Borders', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_border_trbl',
						'std' => 'top right bottom left',
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
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'border-style',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Radius - Top', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_border_radius_top',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Border Radius - Bottom', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_border_radius_bottom',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Padding Vertical', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_padding_vertical',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Padding Horizontal', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_title_inner_padding_horizontal',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget-title-inner',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'styling',
						'ext' => 'px',
						'tab' => $str_tab_mobile_menu_widgets,
					),
				array(
					'label' => __( 'Title Inner', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_title_inner_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),

				array(
					'label' => __( 'Content', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_content_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),
					array(
						'label' => __( 'Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Font Size', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_font_size',
						'onlypositive' => true, // Value can't be negative.
						'std' => '13',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'font-size',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Font Weight', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_font_weight',
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
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'font-weight',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => '',
					),
					array(
						'label' => __( 'Font Family', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_font_family',
						'std' => 'Open Sans',
						'type' => 'font',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'font-family',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Line Height', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_line_height',
						'onlypositive' => true, // Value can't be negative.
						'std' => '22',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'line-height',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => 'px',
					),
					array(
						'label' => __( 'Link - Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_link_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget a',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Link - Hover - Color', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_link_color_hover',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget a:hover',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
					array(
						'label' => __( 'Link - Font Weight', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_link_font_weight',
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
						'affect_on_change_el' => '.dslc-widget a',
						'affect_on_change_rule' => 'font-weight',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
						'ext' => '',
					),
					array(
						'label' => __( 'Text Align', 'lcproext' ),
						'id' => 'css_mobile_off_canvas_widget_content_text_align',
						'std' => 'left',
						'type' => 'text_align',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.dslc-widget',
						'affect_on_change_rule' => 'text-align',
						'section' => 'styling',
						'tab' => $str_tab_mobile_menu_widgets,
					),
				array(
					'label' => __( 'Content', 'lcproext' ),
					'id' => 'css_mobile_off_canvas_widget_content_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => $str_tab_mobile_menu_widgets,
				),
			);

			/**
			 * Responsive Tablet
			 */
/*
			array(
				'label' => __( 'Responsive Styling', 'lcproext' ),
				'id' => 'css_res_t',
				'std' => 'disabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Disabled', 'lcproext' ),
						'value' => 'disabled',
					),
					array(
						'label' => __( 'Enabled', 'lcproext' ),
						'value' => 'enabled',
					),
				),
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Preview', 'lcproext' ),
				'label_alt' => __( 'Show Menu', 'lcproext' ),
				'id' => 'css_toggle_menu',
				'std' => '',
				'type' => 'button',
				'refresh_on_change' => false,
				'advanced_action' => 'dslc_show_menu()',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Toggle Icon - Color', 'lcproext' ),
				'id' => 'css_res_t_menu_toggle_icon_color',
				'std' => '#555',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenupro-icon',
				'affect_on_change_rule' => 'color',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Toggle Icon - Align', 'lcproext' ),
				'id' => 'css_res_t_menu_toggle_icon_align',
				'std' => 'center',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Left', 'lcproext' ),
						'value' => 'flex-start',
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'value' => 'flex-end',
					),
					array(
						'label' => __( 'Center', 'lcproext' ),
						'value' => 'center',
					),
					array(
						'label' => __( 'Space Between', 'lcproext' ),
						'value' => 'space-between',
					),
					array(
						'label' => __( 'Space Around', 'lcproext' ),
						'value' => 'space-around',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenupro-inner',
				'affect_on_change_rule' => 'justify-content',
				'tab' => __( 'Tablet', 'lcproext' ),
				'section' => 'responsive',
			),
			array(
				'label' => __( 'Menu Toggle Icon - Margin', 'lcproext' ),
				'id' => 'css_res_t_menu_toggle_icon_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_res_t_menu_toggle_icon_margin_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_res_t_menu_toggle_icon_margin_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_res_t_menu_toggle_icon_margin_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_res_t_menu_toggle_icon_margin_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'responsive',
					'tab' => __( 'Tablet', 'lcproext' ),
					'ext' => 'px',
				),
			array(
				'label' => __( 'Menu Toggle Icon - Margin', 'lcproext' ),
				'id' => 'css_res_t_menu_toggle_icon_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Toggle Icon - Width', 'lcproext' ),
				'id' => 'css_res_t_menu_toggle_icon_width',
				'onlypositive' => true, // Value can't be negative.
				'std' => '40',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenu-mobile-hook',
				'affect_on_change_rule' => 'width',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
				'min' => 1,
				'max' => 500,
				'ext' => 'px',
			),
			array(
				'label' => __( 'Menu Toggle Icon - Height', 'lcproext' ),
				'id' => 'css_res_t_menu_toggle_icon_height',
				'onlypositive' => true, // Value can't be negative.
				'std' => '40',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenu-mobile-hook',
				'affect_on_change_rule' => 'height',
				'section' => 'responsive',
				'tab' => __( 'Tablet', 'lcproext' ),
				'min' => 1,
				'max' => 500,
				'ext' => 'px',
			),
*/
			/**
			 * Responsive Phone
			 */
/*
			array(
				'label' => __( 'Responsive Styling', 'lcproext' ),
				'id' => 'css_res_p',
				'std' => 'disabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Disabled', 'lcproext' ),
						'value' => 'disabled',
					),
					array(
						'label' => __( 'Enabled', 'lcproext' ),
						'value' => 'enabled',
					),
				),
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Preview', 'lcproext' ),
				'label_alt' => __( 'Show Menu', 'lcproext' ),
				'id' => 'css_toggle_menu',
				'std' => '',
				'type' => 'button',
				'refresh_on_change' => false,
				'advanced_action' => 'dslc_show_menu()',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Toggle Icon - Color', 'lcproext' ),
				'id' => 'css_res_p_menu_toggle_icon_color',
				'std' => '#555',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenupro-icon',
				'affect_on_change_rule' => 'color',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Toggle Icon - Align', 'lcproext' ),
				'id' => 'css_res_p_menu_toggle_icon_align',
				'std' => 'center',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Left', 'lcproext' ),
						'value' => 'flex-start',
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'value' => 'flex-end',
					),
					array(
						'label' => __( 'Center', 'lcproext' ),
						'value' => 'center',
					),
					array(
						'label' => __( 'Space Between', 'lcproext' ),
						'value' => 'space-between',
					),
					array(
						'label' => __( 'Space Around', 'lcproext' ),
						'value' => 'space-around',
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenupro-inner',
				'affect_on_change_rule' => 'justify-content',
				'tab' => __( 'Phone', 'lcproext' ),
				'section' => 'responsive',
			),
			array(
				'label' => __( 'Menu Toggle Icon - Margin', 'lcproext' ),
				'id' => 'css_res_p_menu_toggle_icon_margin_group',
				'type' => 'group',
				'action' => 'open',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
			),
				array(
					'label' => __( 'Top', 'lcproext' ),
					'id' => 'css_res_p_menu_toggle_icon_margin_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-top',
					'section' => 'responsive',
					'tab' => __( 'Phone', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Right', 'lcproext' ),
					'id' => 'css_res_p_menu_toggle_icon_margin_right',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-right',
					'section' => 'responsive',
					'tab' => __( 'Phone', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Bottom', 'lcproext' ),
					'id' => 'css_res_p_menu_toggle_icon_margin_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'responsive',
					'tab' => __( 'Phone', 'lcproext' ),
					'ext' => 'px',
				),
				array(
					'label' => __( 'Left', 'lcproext' ),
					'id' => 'css_res_p_menu_toggle_icon_margin_left',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '.lcmenupro-inner',
					'affect_on_change_rule' => 'margin-left',
					'section' => 'responsive',
					'tab' => __( 'Phone', 'lcproext' ),
					'ext' => 'px',
				),
			array(
				'label' => __( 'Menu Toggle Icon - Margin', 'lcproext' ),
				'id' => 'css_res_p_menu_toggle_icon_margin_group',
				'type' => 'group',
				'action' => 'close',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
			),
			array(
				'label' => __( 'Menu Toggle Icon - Width', 'lcproext' ),
				'id' => 'css_res_p_menu_toggle_icon_width',
				'onlypositive' => true, // Value can't be negative.
				'std' => '40',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenu-mobile-hook',
				'affect_on_change_rule' => 'width',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
				'min' => 1,
				'max' => 500,
				'ext' => 'px',
			),
			array(
				'label' => __( 'Menu Toggle Icon - Height', 'lcproext' ),
				'id' => 'css_res_p_menu_toggle_icon_height',
				'onlypositive' => true, // Value can't be negative.
				'std' => '40',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.lcmenu-mobile-hook',
				'affect_on_change_rule' => 'height',
				'section' => 'responsive',
				'tab' => __( 'Phone', 'lcproext' ),
				'min' => 1,
				'max' => 500,
				'ext' => 'px',
			),
		);
*/

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

		$the_image = false;
		$image_alt = '';
		$image_title = '';

		if ( isset( $options['mobile_logo'] ) && ! empty( $options['mobile_logo'] ) ) {
			$the_image = $options['mobile_logo'];

			if ( ! empty( $options['resize_width'] ) || ! empty( $options['resize_height'] ) ) {

				$resize = true;
				$resize_width = false;
				$resize_height = false;

				if ( ! empty( $options['resize_width'] ) ) {
					$resize_width = $options['resize_width'];
				}

				if ( ! empty ( $options['resize_height'] ) ) {
					$resize_height = $options['resize_height'];
				}

				$the_image = dslc_aq_resize( $options['mobile_logo'], $resize_width, $resize_height, true );

			}
		}

		/* Module output starts here */

		global $dslc_active;

		if ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
			$dslc_is_admin = true;
		} else {
			$dslc_is_admin = false;
		}

		if ( 'not_set' === $options['location'] ) {
			if ( $dslc_is_admin ) {
				?><div class="dslc-notification dslc-red"><?php esc_attr_e( 'Edit the module and choose which location to show.', 'lcproext' ); ?> <span class="dslca-refresh-module-hook dslc-icon dslc-icon-refresh"></span></span></div><?php
			}
		} elseif ( ! has_nav_menu( $options['location'] ) && ! stristr( $options['location'], '___' ) ) {
			if ( $dslc_is_admin ) {
				?><div class="dslc-notification dslc-red"><?php esc_attr_e( 'The chosen location does not have a menu assigned.', 'lcproext' ); ?> <span class="dslca-refresh-module-hook dslc-icon dslc-icon-refresh"></span></span></div><?php
			}
		} else {

			/* Full Menu Visibility Classes */
			$full_menu_classes = '';

			$css_fullmenu_show_on = '';

			if ( isset( $options['css_fullmenu_show_on'] ) ) {
				$css_fullmenu_show_on = $options['css_fullmenu_show_on'];
			}

			// if ( isset( $options['css_fullmenu_show_on'] )
				// && ! empty( $options['css_fullmenu_show_on'] ) ) {

				if ( false === stripos( $css_fullmenu_show_on, 'desktop' ) ) {
					$full_menu_classes .= 'dslc-hide-on-desktop ';
				}

				if ( false === stripos( $css_fullmenu_show_on, 'tablet' ) ) {
					$full_menu_classes .= 'dslc-hide-on-tablet ';
				}

				if ( false === stripos( $css_fullmenu_show_on, 'phone' ) ) {
					$full_menu_classes .= 'dslc-hide-on-phone ';
				}
			// }

			/*else {
				$full_menu_classes = 'dslc-hide-on-tablet dslc-hide-on-phone ';
			}*/

			/* Responsive Toggle Icon Visibility Classes */
			$toggle_responsive_classes = '';
			$css_mobile_toggle_show_on = '';

			if ( isset( $options['css_mobile_toggle_show_on'] ) ) {
				$css_mobile_toggle_show_on = $options['css_mobile_toggle_show_on'];
			}

			// if ( isset( $options['css_mobile_toggle_show_on'] ) ) {

				if ( false === stripos( $css_mobile_toggle_show_on, 'desktop' ) ) {
					$toggle_responsive_classes .= 'dslc-hide-on-desktop ';
				}

				if ( false === stripos( $css_mobile_toggle_show_on, 'tablet' ) ) {
					$toggle_responsive_classes .= 'dslc-hide-on-tablet ';
				}

				if ( false === stripos( $css_mobile_toggle_show_on, 'phone' ) ) {
					$toggle_responsive_classes .= 'dslc-hide-on-phone ';
				}

			// }

			/*else {
				$toggle_responsive_classes = 'dslc-hide-on-desktop ';
			}*/

			?>
			<!-- <div class="lcmenu-pro"> -->
				<div class="lcmenupro-navigation lcmenupro-sub-position-<?php echo esc_attr( $options['css_subnav_position'] ); ?>">
					<div class="lcmenupro-inner">
					<!-- $full_menu_classes -->
						[dslc_nav_render_menu theme_location="<?php echo $options['location']; ?>" menu_class="menu <?php echo $full_menu_classes; ?>" ]
						<?php
						// Moved into the shortcode to make LC caching working properly.
						// wp_nav_menu( array( 'theme_location' => $options['location'], 'menu_class' => 'menu dslc-hide-on-tablet dslc-hide-on-phone' ) );

						// echo '<svg class="lcmenupro-icon lcmenu-mobile-hook ' . $toggle_responsive_classes . '"><use xlink:href="#icon-menu"></use></svg>';
						?>
					</div>
					<?php
						echo '<svg class="lcmenupro-icon lcmenu-mobile-hook ' . $toggle_responsive_classes . '"><use xlink:href="#icon-menu"></use></svg>';
					?>
				</div>
			<!-- </div> -->

			<div class="lcmenupro-site-overlay"></div>

			<div class="lcmenupro-mobile-navigation">
				<div class="lcmenupro-mobile-inner">
					<div class="lcmenu-mobile-close-hook">
						<svg class="lcmenupro-icon"><use xlink:href="#icon-x"></use></svg>
					</div>
					<?php if ( $the_image ) : ?>
						<?php
							if ( ! empty( $options['image_alt'] ) ) {
								$image_alt = $options['image_alt'];
							}

							if ( ! empty( $options['image_title'] ) ) {
								$image_title = $options['image_title'];
							}
						?>
						<div class="lcmenu-mobile-logo">
							<img src="<?php echo esc_attr( $the_image ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" title="<?php echo esc_attr( $image_title ); ?>" />
						</div>
					<?php endif; ?>
					[dslc_nav_render_menu theme_location="<?php echo $options['location_mobile']; ?>" menu_class="lcmenupro-mobile-menu" ]
					<?php
						// Moved into the shortcode to make LC caching working properly.
						// wp_nav_menu( array( 'theme_location' => $options['location_mobile'], 'menu_class' => 'lcmenupro-mobile-menu' ) );
					?>
					<?php
						if ( 'not_set' !== $options['mobile-off-canvas-widget'] ) {
							dynamic_sidebar( $options['mobile-off-canvas-widget'] );
						}
					?>
				</div>
			</div>
			<?php
		} // End if().
	} // End function().
} // End class.
