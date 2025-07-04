<?php
/**
 * Functions used to integrate Mega Main Menu plugin with our theme
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * To make sure all theme customization options are available
 * to a theme user from the Theme Customizer we make possible
 * to manipulate MegaMainMenu settings via changing menu settings
 * in Theme Customizer.
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

if ( class_exists( 'mega_main_init' ) ) {

	/**
	 * ----------------------------------------------------------------------
	 * And some additional styling classes into mega menu container.
	 */

	add_filter( 'mmm_container_class', 'mmm_container_class_extend', 11, 2 );
	function mmm_container_class_extend( $value = '', $predefined_classes ) {
		// $args = (array)$args;
		$styling_classes = '';

		// If we processing 'header-menu' mega menu.
		if ( in_array( 'header-menu', $predefined_classes ) ) {

			// Add logo position css class.
			switch ( get_theme_mod( 'lbmn_logo_placement', LBMN_LOGO_PLACEMENT_DEFAULT ) ) {
				case 'top-left':
					$styling_classes .= ' logoplacement-top-left';
					break;
				case 'top-right':
					$styling_classes .= ' logoplacement-top-right';
					break;
				case 'top-center':
					$styling_classes .= ' logoplacement-top-center';
					break;
				case 'bottom-left':
					$styling_classes .= ' logoplacement-bottom-left';
					break;
				case 'bottom-right':
					$styling_classes .= ' logoplacement-bottom-right';
					break;
			}

			// Add search field shadow-type css class
			switch ( get_theme_mod( 'lbmn_searchblock_shadow', LBMN_SEARCHBLOCK_SHADOW_DEFAULT ) ) {
				case 'inside':
					$styling_classes .= ' search-shadow-inside';
					break;
				case 'outside':
					$styling_classes .= ' search-shadow-outside';
					break;
			}
		}

		// If we processing 'topbar' mega menu
		if ( in_array( 'topbar', $predefined_classes ) ) {
			// Add topbar visibility class to make it hide/show instantly in ThemeCustomizer
			if ( ! get_theme_mod( 'lbmn_topbar_switch', 1 ) ) {
				$styling_classes .= ' disabled';
			}
		}

		return $styling_classes;
	}

	/**
	 * ----------------------------------------------------------------------
	 * Integration with theme customizer
	 */

	// Update Mega Main Menu settings on each Theme Customizer save
	add_action( 'customize_register', 'lbmn_mainmegamenu_customizer_integration' );
	function lbmn_mainmegamenu_customizer_integration() {
		global $mega_main_menu;
		$mainmegamenu_options = get_option( $mega_main_menu->constant['MM_OPTIONS_DB_NAME'], array() ); // get array of Main Mega Menu options
		$lbmn_themeoptions    = get_option( 'lbmn_theme_options' ); // get array of our theme options

		// Update Main Mega Menu options with values from Theme Customizer
		// Header section top

		// Disable needless Main Mega Menu options
		$mainmegamenu_options['topbar_menu_first_level_link_bg']        = '';
		$mainmegamenu_options['topbar_menu_bg_gradient']['color1']      = $mainmegamenu_options['topbar_menu_bg_gradient']['color2'] = '';
		$mainmegamenu_options['topbar_menu_dropdown_link_bg']['color1'] = $mainmegamenu_options['topbar_menu_dropdown_link_bg']['color2'] = '';


		// Menu > Top bar
		$mainmegamenu_options['topbar_first_level_item_height'] = str_replace( 'px', '', get_theme_mod( 'lbmn_topbar_height', LBMN_TOPBAR_HEIGHT_DEFAULT ) );

		$mainmegamenu_options['topbar_menu_first_level_link_color']       = get_theme_mod( 'lbmn_topbar_linkcolor', LBMN_TOPBAR_LINKCOLOR_DEFAULT );
		$mainmegamenu_options['topbar_menu_first_level_link_color_hover'] = get_theme_mod( 'lbmn_topbar_linkhovercolor', LBMN_TOPBAR_LINKHOVERCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_first_level_link_bg_hover']['color1'] = $mainmegamenu_options['topbar_menu_first_level_link_bg_hover']['color2'] = get_theme_mod( 'lbmn_topbar_linkhoverbackgroundcolor', LBMN_TOPBAR_LINKHOVERBGCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_first_level_link_font']['font_family'] = ''; // we set custom fonts manualy in customized-css.php
		$mainmegamenu_options['topbar_menu_first_level_link_font']['font_weight'] = get_theme_mod( 'lbmn_topbar_firstlevelitems_fontweight', LBMN_TOPBAR_FIRSTLEVELITEMS_FONTWEIGHT_DEFAULT );
		$mainmegamenu_options['topbar_menu_first_level_link_font']['font_size']   = str_replace( 'px', '', get_theme_mod( 'lbmn_topbar_firstlevelitems_fontsize', LBMN_TOPBAR_FIRSTLEVELITEMS_FONTSIZE_DEFAULT ) );

		$mainmegamenu_options['topbar_first_level_item_align']     = get_theme_mod( 'lbmn_topbar_firstlevelitems_align', LBMN_TOPBAR_FIRSTLEVELITEMS_ALIGN_DEFAULT );
		$mainmegamenu_options['topbar_first_level_icons_position'] = get_theme_mod( 'lbmn_topbar_firstlevelitems_iconposition', LBMN_TOPBAR_FIRSTLEVELITEMS_ICONPOSITION_DEFAULT );
		$mainmegamenu_options['topbar_menu_first_level_icon_font'] = str_replace( 'px', '', get_theme_mod( 'lbmn_topbar_firstlevelitems_iconsize', LBMN_TOPBAR_FIRSTLEVELITEMS_ICONSIZE_DEFAULT ) );
		$mainmegamenu_options['topbar_first_level_separator']      = get_theme_mod( 'lbmn_topbar_firstlevelitems_separator', 'smooth' );


		// Menu > First Level Items
		$mainmegamenu_options['header-menu_menu_first_level_link_color'] = get_theme_mod( 'lbmn_megamenu_linkcolor', LBMN_HEADERTOP_LINKCOLOR_DEFAULT );

		$mainmegamenu_options['header-menu_menu_first_level_link_color_hover']        = get_theme_mod( 'lbmn_megamenu_linkhovercolor', LBMN_HEADERTOP_LINKHOVERCOLOR_DEFAULT );
		$mainmegamenu_options['header-menu_menu_first_level_link_bg_hover']['color1'] = $mainmegamenu_options['header-menu_menu_first_level_link_bg_hover']['color2'] = get_theme_mod( 'lbmn_megamenu_linkhoverbackgroundcolor', LBMN_MEGAMENU_LINKHOVERBACKGROUNDCOLOR_DEFAULT );

		$mainmegamenu_options['header-menu_menu_first_level_link_font']['font_family'] = ''; // we set custom fonts manualy in customized-css.php
		$mainmegamenu_options['header-menu_menu_first_level_link_font']['font_weight'] = get_theme_mod( 'lbmn_megamenu_firstlevelitems_fontweight', LBMN_MEGAMENU_FIRSTLEVELITEMS_FONTWEIGHT_DEFAULT );
		$mainmegamenu_options['header-menu_menu_first_level_link_font']['font_size']   = str_replace( 'px', '', get_theme_mod( 'lbmn_megamenu_firstlevelitems_fontsize', LBMN_MEGAMENU_FIRSTLEVELITEMS_FONTSIZE_DEFAULT ) );

		$mainmegamenu_options['header-menu_first_level_item_align']     = get_theme_mod( 'lbmn_megamenu_firstlevelitems_align', LBMN_MEGAMENU_FIRSTLEVELITEMS_ALIGN_DEFAULT );
		$mainmegamenu_options['header-menu_first_level_icons_position'] = get_theme_mod( 'lbmn_megamenu_firstlevelitems_iconposition', LBMN_MEGAMENU_FIRSTLEVELITEMS_ICONPOSITION_DEFAULT );
		$mainmegamenu_options['header-menu_menu_first_level_icon_font'] = str_replace( 'px', '', get_theme_mod( 'lbmn_megamenu_firstlevelitems_iconsize', LBMN_MEGAMENU_FIRSTLEVELITEMS_ICONSIZE_DEFAULT ) );
		$mainmegamenu_options['header-menu_first_level_separator']      = get_theme_mod( 'lbmn_megamenu_firstlevelitems_separator', 'smooth' );


		// Menu > Dropdown
		// The settings for dropdowns are common for topbar and header-menu

		$mainmegamenu_options['topbar_menu_dropdown_plain_text_color'] = $mainmegamenu_options['header-menu_menu_dropdown_plain_text_color'] = get_theme_mod( 'lbmn_megamenu_dropdown_textcolor', LBMN_MEGAMENU_DROPDOWN_TEXTCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_link_color'] = $mainmegamenu_options['header-menu_menu_dropdown_link_color'] = get_theme_mod( 'lbmn_megamenu_dropdown_linkcolor', LBMN_MEGAMENU_DROPDOWN_LINKCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_link_color_hover'] = $mainmegamenu_options['header-menu_menu_dropdown_link_color_hover'] = get_theme_mod( 'lbmn_megamenu_dropdown_linkhovercolor', LBMN_MEGAMENU_DROPDOWN_LINKHOVERCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_link_bg_hover']['color1'] = $mainmegamenu_options['topbar_menu_dropdown_link_bg_hover']['color2'] = $mainmegamenu_options['header-menu_menu_dropdown_link_bg_hover']['color1'] = $mainmegamenu_options['header-menu_menu_dropdown_link_bg_hover']['color2'] = get_theme_mod( 'lbmn_megamenu_dropdown_linkhoverbackgroundcolor', LBMN_MEGAMENU_DROPDOWN_LINKHOVERBACKGROUNDCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_wrapper_gradient']['color1'] = $mainmegamenu_options['topbar_menu_dropdown_wrapper_gradient']['color2'] = $mainmegamenu_options['header-menu_menu_dropdown_wrapper_gradient']['color1'] = $mainmegamenu_options['header-menu_menu_dropdown_wrapper_gradient']['color2'] = get_theme_mod( 'lbmn_megamenu_dropdown_background', LBMN_MEGAMENU_DROPDOWN_BACKGROUND_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_icon_font'] = $mainmegamenu_options['header-menu_menu_dropdown_icon_font'] = get_theme_mod( 'lbmn_megamenu_dropdown_iconsize', LBMN_MEGAMENU_DROPDOWN_ICONSIZE_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_link_border_color'] = $mainmegamenu_options['header-menu_menu_dropdown_link_border_color'] = get_theme_mod( 'lbmn_megamenu_dropdown_menuitemsdividercolor', LBMN_MEGAMENU_DROPDOWN_MENUITEMSDIVIDERCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_dropdown_link_font']['font_family'] = $mainmegamenu_options['header-menu_menu_dropdown_link_font']['font_family'] = ''; // we set custom fonts manualy in customized-css.php

		$mainmegamenu_options['topbar_menu_dropdown_link_font']['font_size'] = $mainmegamenu_options['header-menu_menu_dropdown_link_font']['font_size'] = str_replace( 'px', '', get_theme_mod( 'lbmn_megamenu_dropdown_fontsize', LBMN_MEGAMENU_DROPDOWN_FONTSIZE_DEFAULT ) );

		$mainmegamenu_options['topbar_menu_dropdown_link_font']['font_weight'] = $mainmegamenu_options['header-menu_menu_dropdown_link_font']['font_weight'] = get_theme_mod( 'lbmn_megamenu_dropdown_fontweight', LBMN_MEGAMENU_DROPDOWN_FONTWEIGHT_DEFAULT );

		$mainmegamenu_options['header-menu_dropdowns_animation'] = $mainmegamenu_options['topbar_dropdowns_animation'] = get_theme_mod( 'lbmn_megamenu_dropdown_animation', LBMN_MEGAMENU_DROPDOWN_ANIMATION_DEFAULT );

		$mainmegamenu_options['header-menu_corners_rounding'] = $mainmegamenu_options['topbar_corners_rounding'] = get_theme_mod( 'lbmn_megamenu_dropdownradius', LBMN_MEGAMENU_DROPDOWNRADIUS_DEFAULT );

		// WPML switcher
		if ( get_theme_mod( 'lbmn_megamenu_wpml_switcher', 0 ) == '1' ) {
			$mainmegamenu_options['topbar_included_components']['1'] = 'wpml_switcher';
		} else {
			unset( $mainmegamenu_options['topbar_included_components']['1'] );
		}

		// Mobile Menu Label
		$mainmegamenu_options['header-menu_mobile_label'] = get_theme_mod( 'lbmn_megamenu_mobile_label', $mainmegamenu_options['header-menu_mobile_label'] );


		// Other options

		// If no logo yet set
		if ( ! isset( $lbmn_themeoptions['lbmn_logo_image'] ) ) {
			$lbmn_themeoptions['lbmn_logo_image'] = LBMN_LOGO_IMAGE_DEFAULT;
		}

		// Enable logo as feature for 'header-menu'
		if ( ! in_array( 'company_logo', $mainmegamenu_options['header-menu_included_components'] ) ) {
			$mainmegamenu_options['header-menu_included_components'][] = 'company_logo';
		}

		$mainmegamenu_options['logo_src']                            = $lbmn_themeoptions['lbmn_logo_image'];
		$mainmegamenu_options['logo_height']                         = get_theme_mod( 'lbmn_logo_height', LBMN_LOGO_IMAGE_HEIGHT_DEFAULT );
		$mainmegamenu_options['header-menu_first_level_item_height'] = str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_menu_height', LBMN_HEADERTOP_MENUHEIGHT_DEFAULT ) );
		$mainmegamenu_options['header-menu_mobile_minimized']        = $mainmegamenu_options['topbar_mobile_minimized'] = $mainmegamenu_options['responsive_styles'] = array( '1' => 'true' );


		if ( get_theme_mod( 'lbmn_headertop_stick', 0 ) == '1' ) {
			$mainmegamenu_options['header-menu_sticky_status']['1'] = 'true';
		} else {
			unset( $mainmegamenu_options['header-menu_sticky_status']['1'] );
		}

		$mainmegamenu_options['header-menu_first_level_item_height_sticky'] = str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_stick_height', LBMN_HEADERTOP_STICK_DEFAULT ) );
		$mainmegamenu_options['header-menu_sticky_offset']                  = str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_stickyoffset', LBMN_HEADERTOP_STICKYOFFSET_DEFAULT ) );


		// Search
		$mainmegamenu_options['topbar_menu_search_bg'] = $mainmegamenu_options['header-menu_menu_search_bg'] = get_theme_mod( 'lbmn_searchblock_inputbackgroundcolor', LBMN_SEARCHBLOCK_INPUTBACKGROUNDCOLOR_DEFAULT );

		$mainmegamenu_options['topbar_menu_search_color'] = $mainmegamenu_options['header-menu_menu_search_color'] = get_theme_mod( 'lbmn_searchblock_textandiconcolor', LBMN_SEARCHBLOCK_TEXTANDICONCOLOR_DEFAULT );


		if ( get_theme_mod( 'lbmn_searchblock_switch', 1 ) ) {
			// Check if search box is already among components to display
			if ( ! in_array( 'search_box', $mainmegamenu_options['header-menu_included_components'] ) ) {
				$mainmegamenu_options['header-menu_included_components'][] = 'search_box';
			}
		} else {
			foreach ( $mainmegamenu_options['header-menu_included_components'] as $key => $value ) {
				if ( $value == 'search_box' ) {
					unset( $mainmegamenu_options['header-menu_included_components'][ $key ] );
				}
			}
		}

		// Disable needless Main Mega Menu options
		$mainmegamenu_options['topbar_first_level_item_height_sticky'] = ''; // top bar is hidden on scroll
		$mainmegamenu_options['topbar_first_level_button_height']      = ''; // we do not use menu items as buttons for a moment
		$mainmegamenu_options['topbar_menu_bg_image']                  = '';

		$mainmegamenu_options['header-menu_menu_first_level_link_bg']        = '';
		$mainmegamenu_options['header-menu_first_level_button_height']       = ''; // we do not use menu items as buttons for a moment
		$mainmegamenu_options['header-menu_menu_bg_image']                   = '';
		$mainmegamenu_options['header-menu_menu_bg_gradient']['color1']      = $mainmegamenu_options['header-menu_menu_bg_gradient']['color2'] = '';
		$mainmegamenu_options['header-menu_menu_dropdown_link_bg']['color1'] = $mainmegamenu_options['header-menu_menu_dropdown_link_bg']['color2'] = '';
		$mainmegamenu_options['set_of_google_fonts']                         = array(); //'0'


		// Disable some mega menu features to reduce
		// the number of problmems with max_input_vars
		if ( ! get_theme_mod( 'lbmn_menu_restriction_set', 0 ) ) {
			$mainmegamenu_options['submenu_drops_side'] = $mainmegamenu_options['disable_link'] = $mainmegamenu_options['disable_text'] = $mainmegamenu_options['item_visibility'] = $mainmegamenu_options['is_checkbox'] = array(
				'is_checkbox',
				'disable',
			);

			set_theme_mod( 'lbmn_menu_restriction_set', 1 );
		}


		// if( ! $mainmegamenu_options['responsive_resolution'] ) {
		//  	$mainmegamenu_options['responsive_resolution'] = '1024';
		// }

		// Change Responsive menu breakpoint to affect iPads
		if ( ! isset( $mainmegamenu_options['responsive_resolution'] ) ) {
			$mainmegamenu_options['responsive_resolution'] = '1025';
		} elseif ( $mainmegamenu_options['responsive_resolution'] == '1024' ) {
			$mainmegamenu_options['responsive_resolution'] = '1025';
		}

		if ( isset( $mainmegamenu_options['topbar_included_components'] ) && is_array( $mainmegamenu_options['topbar_included_components'] ) ) {
			// Disable logo and search for top bar
			$mainmegamenu_options['topbar_included_components'] = array_diff( $mainmegamenu_options['topbar_included_components'], array(
				'company_logo',
				'search_box',
			) );
		}

		if ( isset( $mainmegamenu_options['topbar_sticky_status'] ) && is_array( $mainmegamenu_options['topbar_sticky_status'] ) ) {
			// Disable sticky option for tob bar
			$mainmegamenu_options['topbar_sticky_status'] = array_diff( $mainmegamenu_options['topbar_sticky_status'], array( 'true' ) );
		}

		if ( is_array( $mainmegamenu_options['topbar_mobile_minimized'] ) ) {
			// Disable responsiveness for tob bar
			$mainmegamenu_options['topbar_mobile_minimized'] = array_diff( $mainmegamenu_options['topbar_mobile_minimized'], array( 'true' ) );
		}

		// Set last modified mega menu settings to current time to initiate dynamic css regeneration
		$mainmegamenu_options['last_modified'] = time() + 20;
		update_option( $mega_main_menu->constant['MM_OPTIONS_DB_NAME'], $mainmegamenu_options ); // update options in the database
	}


	/**
	 * ----------------------------------------------------------------------
	 * Initiate Mega Main Menu settings update.
	 */

	// Update Mega Main Menu settings with values from Theme Customizer
	// and on each MMM settings visit.
	add_action( 'current_screen', 'lbmn_override_mmm_settings' );
	function lbmn_override_mmm_settings( $current_screen ) {
		// If 'Apperance > Mega Main Menu' screen visited.
		if ( $current_screen->id == 'toplevel_page_mega_main_menu_options' ) {
			lbmn_mainmegamenu_customizer_integration();
		}
	}

	/**
	 * ----------------------------------------------------------------------
	 * Make sure menu-locations 'topbar' and 'header-menu' are always
	 * activated for Mega Main Menu. Make this check on every theme switch
	 * and every menu locations page visit
	 */

	// Run function on every theme activation
	// http://codex.wordpress.org/Plugin_API/Action_Reference/after_switch_theme
	add_action( 'after_switch_theme', 'lbmn_activate_mainmegamenu_locations' );
	add_action( 'after_menu_locations_table', 'lbmn_activate_mainmegamenu_locations' );
	function lbmn_activate_mainmegamenu_locations() {
		// get array of Main Mega Menu options
		global $mega_main_menu;
		$mainmegamenu_options = get_option( $mega_main_menu->constant['MM_OPTIONS_DB_NAME'], array() );

		$mega_menu_locations = array();

		if ( isset( $mainmegamenu_options['mega_menu_locations'] ) ) {
			$mega_menu_locations = $mainmegamenu_options['mega_menu_locations'];
		}

		if ( ! in_array( 'topbar', $mega_menu_locations ) ) {
			$mainmegamenu_options['mega_menu_locations'][] = 'topbar';
			// update options in the database
			update_option( $mega_main_menu->constant['MM_OPTIONS_DB_NAME'], $mainmegamenu_options );
		}

		if ( ! in_array( 'header-menu', $mega_menu_locations ) ) {
			$mainmegamenu_options['mega_menu_locations'][] = 'header-menu';
			// update options in the database
			update_option( $mega_main_menu->constant['MM_OPTIONS_DB_NAME'], $mainmegamenu_options );
		}
	}

	/**
	 * ----------------------------------------------------------------------
	 * Extend dynamic styles for Mega Main Menu
	 */
	add_filter( 'mmm_skin_extend', 'mmm_skin_extend_css' );
	function mmm_skin_extend_css() {
		global $mega_main_menu;

		// Topbar colors
		$topbar_bgcolor = get_theme_mod( 'lbmn_topbar_backgroundcolor', LBMN_TOPBAR_BACKGROUNDCOLOR_DEFAULT );
		$topbar_height  = intval( str_replace( 'px', '', get_theme_mod( 'lbmn_topbar_height', LBMN_TOPBAR_HEIGHT_DEFAULT ) ) );

		// Header colors
		$headertop_bgcolor           = get_theme_mod( 'lbmn_headertop_backgroundcolor', LBMN_HEADERTOP_BACKGROUNDCOLOR_DEFAULT );
		$headertop_sticky_bgcolor    = get_theme_mod( 'lbmn_headertop_stick_backgroundcolor', LBMN_HEADERTOP_STICK_BACKGROUNDCOLOR_DEFAULT );
		$headertop_linkcolor         = get_theme_mod( 'lbmn_headertop_linkcolor', LBMN_HEADERTOP_LINKCOLOR_DEFAULT );
		$headertop_linkcolor_hover   = get_theme_mod( 'lbmn_headertop_linkhovercolor', LBMN_HEADERTOP_LINKHOVERCOLOR_DEFAULT );
		$headertop_textcolor         = get_theme_mod( 'lbmn_headertop_textcolor', LBMN_HEADERTOP_TEXTCOLOR_DEFAULT );
		$headertop_fontstyling_left  = get_theme_mod( 'lbmn_headertop_fontstyling_left' );
		$headertop_fontstyling_right = get_theme_mod( 'lbmn_headertop_fontstyling_right' );

		$headertop_height     = intval( str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_height', LBMN_HEADERTOP_HEIGHT_DEFAULT ) ) );
		$headertop_menuheight = intval( str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_menu_height', LBMN_HEADERTOP_MENUHEIGHT_DEFAULT ) ) );

		// Logo related settings
		$lbmn_theme_option   = get_option( 'lbmn_theme_options' ); // array
		$header_logo         = $lbmn_theme_option['lbmn_logo_image'];
		$lbmn_logo_placement = get_option( 'lbmn_logo_placement', LBMN_LOGO_PLACEMENT_DEFAULT );


		$styles = '/* Dynamically extended styles */ ';

		/**
		 * ----------------------------------------------------------------------
		 * Top Bar
		 */

		// Topbar background color
		$styles .= '.topbar .menu_holder:before {';
		$styles .= 'background-color: ' . esc_attr( $topbar_bgcolor ) . ';';
		$styles .= '}';

		// Topbar dividers opacity
		$topbar_items_separator_opacity = get_theme_mod( 'lbmn_topbar_firstlevelitems_separator_opacity', LBMN_TOPBAR_FIRSTLEVELITEMS_SEPARATOR_OPACITY_DEFAULT );

		$styles .= '#mega_main_menu.direction-horizontal.topbar > .menu_holder > .menu_inner > ul > li > .item_link:before, #mega_main_menu.direction-horizontal.topbar > .menu_holder > .menu_inner > ul > li.nav_search_box:before {';
		$styles .= 'opacity: ' . esc_attr( $topbar_items_separator_opacity );
		$styles .= '}';

		$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

		if ( ! empty( $languages ) ) {
			foreach ( $languages as $l ) {
				$my_default_lang = apply_filters( 'wpml_default_language', null );

				if ( $my_default_lang != $l['language_code'] ) {
					$lang = $l['language_code'];
					// Topbar custom fonts
					$megamenu_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_topbar_firstlevelitems_font', LBMN_TOPBAR_FIRSTLEVELITEMS_FONT_DEFAULT ), $lang );

					$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' #mega_main_menu.topbar > .menu_holder > .menu_inner > .nav_logo > .mobile_toggle > .mobile_button, ';
					$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li > .item_link, ';
					$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li > .item_link .link_text, ';
					$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li .post_details > .post_title, ';
					$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li .post_details > .post_title > .item_link';
					$styles .= '{';
					$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_font['font_family'] ) ) . ';';
					$styles .= '}';
				}
			}
		}

		// Topbar custom fonts.
		$megamenu_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_topbar_firstlevelitems_font', LBMN_TOPBAR_FIRSTLEVELITEMS_FONT_DEFAULT ) );

		$styles .= '#mega_main_menu.topbar > .menu_holder > .menu_inner > .nav_logo > .mobile_toggle > .mobile_button, ';
		$styles .= '#mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li > .item_link, ';
		$styles .= '#mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li > .item_link .link_text, ';
		$styles .= '#mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li .post_details > .post_title, ';
		$styles .= '#mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li .post_details > .post_title > .item_link';
		$styles .= '{';
		$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_font['font_family'] ) ) . ';';
		$styles .= '}';

		// Regular text color and hover color.
		$styles .= '
			body #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li > span.item_link,
			body #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li > span.item_link *,
			body #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li:hover > span.item_link * {
				color:' . esc_attr( get_theme_mod( 'lbmn_topbar_textlinescolor', LBMN_TOPBAR_TEXTCOLOR_DEFAULT ) ) . ';
			}';

		$styles .= '.topbar .menu_holder {
			min-height:' . esc_attr( $topbar_height ) . 'px;';
		$styles .= '}';

		// No border radius to first-level items of the top bar menu.
		$styles .= '
			body #global-container #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li:last-child > .item_link,
			body #global-container #mega_main_menu.topbar > .menu_holder > .menu_inner > ul > li:first-child > .item_link {
				border-radius: 0;
			}';

		/**
		 * ----------------------------------------------------------------------
		 * Header Menu area.
		 */

		// Header background color.
		$styles .= '
			.header-menu .menu_holder:before {
				background-color:' . esc_attr( $headertop_bgcolor ) . ';
			}

			.header-menu .menu_holder.sticky_container:before {
				background-color:' . esc_attr( $headertop_sticky_bgcolor ) . ';
			}
			';

		// Mega Menu dividers opacity.
		$headertop_items_separator_opacity = get_theme_mod( 'lbmn_megamenu_firstlevelitems_separator_opacity', LBMN_MEGAMENU_FIRSTLEVELITEMS_SEPARATOR_OPACITY_DEFAULT );

		$styles .= '#mega_main_menu.direction-horizontal.header-menu > .menu_holder > .menu_inner > ul > li > .item_link:before, #mega_main_menu.direction-horizontal.header-menu > .menu_holder > .menu_inner > ul > li.nav_search_box:before {';
		$styles .= 'opacity:' . esc_attr( $headertop_items_separator_opacity );
		$styles .= '}';

		// First level menu items radius.
		$styles .= 'body #global-container #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link,
						body #global-container #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li:hover > .item_link ';
		$styles .= '{';
		$styles .= 'border-radius:' . esc_attr( get_theme_mod( 'lbmn_megamenu_linkhoverborderradius', LBMN_HEADERTOP_LINKHOVERBORDERRADIUS_DEFAULT ) ) . 'px;';
		$styles .= '}';

		$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

		if ( ! empty( $languages ) ) {
			foreach ( $languages as $l ) {
				$my_default_lang = apply_filters( 'wpml_default_language', null );

				if ( $my_default_lang != $l['language_code'] ) {
					$lang = $l['language_code'];

					$megamenu_font          = lbmn_output_css_webfont( get_theme_mod( 'lbmn_megamenu_firstlevelitems_font', LBMN_MEGAMENU_FIRSTLEVELITEMS_FONT_DEFAULT ), $lang );
					$megamenu_dropdown_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_megamenu_dropdown_font', LBMN_MEGAMENU_DROPDOWN_FONT_DEFAULT ), $lang );

					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > .nav_logo > .mobile_toggle > .mobile_button, ';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link, ';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link .link_text, ';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li .post_details > .post_title, ';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li .post_details > .post_title > .item_link';
					$styles .= '{';
					$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_font['font_family'] ) ) . ';';
					$styles .= '}';

					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu li .mega_dropdown > li > .item_link,';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu ul li .mega_dropdown > li > .item_link .link_text,';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu ul li .mega_dropdown,';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li.nav_search_box *, ';
					$styles .= '.current_language_' . $l['language_code'] . ' #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li .post_details > .post_description ';
					$styles .= '{';
					$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_dropdown_font['font_family'] ) ) . ';';
					$styles .= '}';

					$styles .= '.current_language_' . $l['language_code'] . ' .header-menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .field:focus {';
					$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_dropdown_font['font_family'] ) ) . ';';
					$styles .= '}';
				}
			}
		}

		// Mega Menu custom fonts.
		$megamenu_font          = lbmn_output_css_webfont( get_theme_mod( 'lbmn_megamenu_firstlevelitems_font', LBMN_MEGAMENU_FIRSTLEVELITEMS_FONT_DEFAULT ) );
		$megamenu_dropdown_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_megamenu_dropdown_font', LBMN_MEGAMENU_DROPDOWN_FONT_DEFAULT ) );

		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > .nav_logo > .mobile_toggle > .mobile_button, ';
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link, ';
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link .link_text, ';
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li .post_details > .post_title, ';
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li .post_details > .post_title > .item_link';
		$styles .= '{';
		$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_font['font_family'] ) ) . ';';
		$styles .= '}';

		$styles .= '#mega_main_menu.header-menu li .mega_dropdown > li > .item_link,';
		$styles .= '#mega_main_menu.header-menu ul li .mega_dropdown > li > .item_link .link_text,';
		$styles .= '#mega_main_menu.header-menu ul li .mega_dropdown,';
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li.nav_search_box *, ';
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li .post_details > .post_description ';
		$styles .= '{';
		$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_dropdown_font['font_family'] ) ) . ';';
		$styles .= '}';

		$styles .= '.header-menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .field:focus {';
		$styles .= 'font-family:' . wp_kses_data( str_replace( '+', ' ', $megamenu_dropdown_font['font_family'] ) ) . ';';
		$styles .= 'font-weight:' . esc_attr( get_theme_mod( 'lbmn_megamenu_dropdown_fontweight', '400' ) ) . ';';
		$styles .= 'font-size:' . esc_attr( get_theme_mod( 'lbmn_megamenu_dropdown_fontsize', '14px' ) ) . ';';
		$styles .= '}';

		$styles .= ' #mega_main_menu > .menu_holder > .menu_inner > ul > li.default_dropdown .mega_dropdown > li > .item_link {
			padding:10px 14px;
		}';

		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link:after {';
		$styles .= 'opacity:' . esc_attr( get_theme_mod( 'lbmn_megamenu_dropdown_markeropacity', LBMN_MEGAMENU_DROPDOWN_MARKEROPACITY_DEFAULT ) ) . ';';
		$styles .= '}';

		// Never make icon blod.
		$styles .= '#mega_main_menu > .menu_holder > .menu_inner > ul > li > .item_link.with_icon i {';
		$styles .= 'font-weight:normal!important;';
		$styles .= '}';

		// Search block settigns (header).
		$header_search_inputwidth = get_theme_mod( 'lbmn_searchblock_inputfieldwidth', LBMN_SEARCHBLOCK_INPUTFIELDWIDTH_DEFAULT );
		$styles .= '#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .field:focus';
		$styles .= '{';
		$styles .= 'max-width:' . esc_attr( $header_search_inputwidth ) . 'px;';
		$styles .= 'width:' . esc_attr( $header_search_inputwidth ) . 'px;';
		$styles .= '}';

		$styles .= '#mega_main_menu.header-menu ul .nav_search_box #mega_main_menu_searchform:before ';
		$styles .= '{';
		$styles .= 'border-radius:' . esc_attr( str_replace( 'px', '', get_theme_mod( 'lbmn_searchblock_inputfieldradius', LBMN_SEARCHBLOCK_INPUTFIELDRADIUS_DEFAULT ) ) ) . 'px;';
		$styles .= '}';

		$styles .= '.header-menu li.nav_search_box > #mega_main_menu_searchform:before ';
		$styles .= '{';
		$styles .= 'background-color:' . esc_attr( get_theme_mod( 'lbmn_searchblock_inputbackgroundcolor', LBMN_SEARCHBLOCK_INPUTBACKGROUNDCOLOR_DEFAULT ) ) . ';';
		$styles .= '}';


		$styles .= '
			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform {
				margin-top: -18px;
			}

			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .icosearch,
			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .submit,
			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .field {
				margin: 5px 0;
			}

			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .field {
				padding-left: 18px;
			   padding-right: 18px;
			}

			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .icosearch,
			#mega_main_menu > .menu_holder > .menu_inner > ul > li.nav_search_box #mega_main_menu_searchform .submit {
				width: 36px;
			}

		';

		// fix separators to work with overflow.
		$styles .= 'body #mega_main_menu.header-menu.direction-horizontal > .menu_holder > .menu_inner > ul > li > .item_link:before';
		$styles .= '{';
		$styles .= 'left: 0;';
		$styles .= '}';

		// first level menu items margin.
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link {
			margin-right:' . esc_attr( str_replace( 'px', '', get_theme_mod( 'lbmn_megamenu_firstlevelitems_spacing', LBMN_MEGAMENU_FIRSTLEVELITEMS_SPACING_DEFAULT ) ) ) . 'px;
		}';

		// No margin for the last item.
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li:last-child > .item_link {
			margin-right:0px!important;
		}';

		// Regular text color.
		$styles .= '
		body #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > span.item_link,
		body #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > span.item_link *,
		body #mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li:hover > span.item_link * {
			color:' . esc_attr( get_theme_mod( 'lbmn_megamenu_textlinescolor', LBMN_HEADERTOP_TEXTCOLOR_DEFAULT ) ) . ';
		}';


		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li > .item_link {';
		$styles .= 'padding-left:' . esc_attr( get_theme_mod( 'lbmn_megamenu_firstlevelitems_innerspacing', LBMN_MEGAMENU_FIRSTLEVELITEMS_INNERSPACING_DEFAULT ) ) . 'px;';
		$styles .= 'padding-right:' . esc_attr( get_theme_mod( 'lbmn_megamenu_firstlevelitems_innerspacing', LBMN_MEGAMENU_FIRSTLEVELITEMS_INNERSPACING_DEFAULT ) ) . 'px;';
		$styles .= '}';

		// disable custom inner padding for custom styled menu elements (CTA buttons, etc)
		$styles .= '#mega_main_menu.header-menu > .menu_holder > .menu_inner > ul > li[class*=additional_style_] > .item_link {
			padding-left:15px;
			padding-right:15px;
			margin-left: 10px;
			margin-right: 10px;
		}';

		if ( $headertop_height ) {

			$styles .= '

			.header-overlay .site-header {
				margin-bottom:-' . esc_attr( $headertop_height ) . 'px;
			}

			.header-overlay .site-content .dslc-content > .dslc-modules-section:first-child .dslc-modules-section-wrapper {
				margin-top:' . esc_attr( $headertop_height ) . 'px;
			}

			';


			// IF LOGO IS ON THE SAME LINE WITH MENU
			$styles .= '.header-menu .menu_holder {
				min-height:' . esc_attr( $headertop_height ) . 'px;';
			if ( $headertop_menuheight ) {
				if ( ( $headertop_height - $headertop_menuheight ) > 0 ) {
					$styles .= 'padding-top:' . esc_attr( ( $headertop_height - $headertop_menuheight ) / 2 ) . 'px;';
				} else {
					$styles .= 'padding-top:0px;';
				}
			}
			$styles .= '}';

			$styles .= '.header-menu .nav_logo {
				min-height:' . esc_attr( $headertop_height ) . 'px;';
			if ( $headertop_menuheight ) {
				if ( ( $headertop_height - $headertop_menuheight ) > 0 ) {
					$styles .= 'margin-top: -' . esc_attr( ( $headertop_height - $headertop_menuheight ) / 2 ) . 'px;';
				} else {
					$styles .= 'margin-top:0px;';
				}
			}
			$styles .= '}';

			$styles .= '.header-menu .sticky_container .nav_logo, .header-menu .menu_holder.sticky_container {
				min-height:0px; margin-top:0;';
			$styles .= '}';

			$styles .= '.header-menu .nav_logo .logo_link {
				min-height:' . esc_attr( $headertop_height ) . 'px;
				line-height:' . esc_attr( $headertop_height ) . 'px;
			}';


			// Override height for sticky headers
			$headertop_height_sticky = str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_stick_height', LBMN_HEADERTOP_STICK_DEFAULT ) );

			$styles .= '#mega_main_menu.header-menu .sticky_container {';
			$styles .= 'padding-top:0px;';
			$styles .= '}';

			$styles .= '#mega_main_menu.header-menu .sticky_container .nav_logo {';
			$styles .= 'margin-top:0px;';
			$styles .= '}';

			$styles .= '#mega_main_menu.header-menu .sticky_container {'; //.menu_holder.sticky_container
			$styles .= 'min-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= '}';

			$styles .= '#mega_main_menu.header-menu .sticky_container .nav_logo {';
			$styles .= 'min-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= '}';

			$styles .= '#mega_main_menu.header-menu .sticky_container .nav_logo .logo_link {';
			$styles .= 'min-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= 'line-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= '}';

			// Sticky vertical padding
			$headertop_sticky_padding = str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_sticky_padding', LBMN_HEADERTOP_STICKY_PADDING_DEFAULT ) );
			$styles .= '#mega_main_menu.header-menu .sticky_container {';
			$styles .= 'padding-top:' . esc_attr( $headertop_sticky_padding ) . 'px;';
			$styles .= 'padding-bottom:' . esc_attr( $headertop_sticky_padding ) . 'px;';
			$styles .= '}';


			// Override height of mobile headers
			$styles .= ' @media (max-width: 767px) { /* DO NOT CHANGE THIS LINE (See = Specific Options -> Responsive Resolution) */';
			$styles .= '#mega_main_menu.header-menu.mobile_minimized-enable .menu_holder {';
			$styles .= 'min-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= 'padding-top:0px;';
			$styles .= '}';

			$styles .= '#mega_main_menu.header-menu.mobile_minimized-enable .nav_logo {';
			$styles .= 'min-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= 'margin-top:0px;';
			$styles .= '}';

			$styles .= '#mega_main_menu.header-menu.mobile_minimized-enable .nav_logo .logo_link {';
			$styles .= 'min-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= 'line-height:' . esc_attr( $headertop_height_sticky ) . 'px;';
			$styles .= '}';

			// Sticky vertical padding
			$styles .= '#mega_main_menu.header-menu.mobile_minimized-enable .menu_holder {';
			$styles .= 'padding-top:' . esc_attr( $headertop_sticky_padding ) . 'px;';
			$styles .= 'padding-bottom:' . esc_attr( $headertop_sticky_padding ) . 'px;';
			$styles .= '}';

			$styles .= '}';


			// IF LOGO IS ABOVE MENU
			$styles .= '.header-menu.logoplacement-top-left .nav_logo,
			.header-menu.logoplacement-top-center .nav_logo,
			.header-menu.logoplacement-top-right .nav_logo {';
			$styles .= 'min-height:' . esc_attr( ( $headertop_height - $headertop_menuheight ) ) . 'px;';
			$styles .= '}';

			$styles .= '.header-menu.logoplacement-top-left .nav_logo .logo_link,
			.header-menu.logoplacement-top-center .nav_logo .logo_link,
			.header-menu.logoplacement-top-right .nav_logo .logo_link {';
			$styles .= 'min-height:' . esc_attr( ( $headertop_height - $headertop_menuheight ) ) . 'px;';
			$styles .= 'line-height:' . esc_attr( ( $headertop_height - $headertop_menuheight ) ) . 'px;';
			$styles .= '}';

		}

		/**
		 * ----------------------------------------------------------------------
		 * Disable hover for non linked items.
		 */

		$styles .= '
			#mega_main_menu.mega_main_menu > .menu_holder > .menu_inner > ul > li > span.item_link:hover {
				background-color:inherit;
			}';

		/**
		 * ----------------------------------------------------------------------
		 * Header logo.
		 */

		// If custom logo margin-top is set.
		if ( get_theme_mod( 'lbmn_logo_margin_top' ) ) {
			$custom_logo_margin_top = floatval( get_theme_mod( 'lbmn_logo_margin_top' ) );
			if ( $custom_logo_margin_top != 0 ) {
				$styles .= '#mega_main_menu .nav_logo .logo_link {margin-top:' . esc_attr( $custom_logo_margin_top ) . 'px;}';
			}
		}

		// If custom logo margin-left is set.
		if ( get_theme_mod( 'lbmn_logo_margin_left' ) ) {
			$custom_logo_margin_left = floatval( get_theme_mod( 'lbmn_logo_margin_left' ) );
			if ( $custom_logo_margin_left != 0 ) {
				$styles .= '#mega_main_menu .nav_logo .logo_link {margin-left:' . esc_attr( $custom_logo_margin_left ) . 'px;}';
			}
		}

		// If custom logo margin-right is set.
		if ( get_theme_mod( 'lbmn_logo_margin_right' ) ) {
			$custom_logo_margin_right = floatval( get_theme_mod( 'lbmn_logo_margin_right' ) );
			if ( $custom_logo_margin_right != 0 ) {
				$styles .= '#mega_main_menu .nav_logo .logo_link {margin-right:' . esc_attr( $custom_logo_margin_right ) . 'px;}';
			}
		}


		// Fix menu dropdown arrows >
		$styles .= 'body #mega_main_menu li.default_dropdown > .mega_dropdown > li.drop_to_right > .item_link:before {
			content: "\\e834";
			right: 4px;
			font-family: iconfont;
			font-size: 12px;
		}';

		// Center header to the grid borders
		GLOBAL $content_width;
		$styles .= '.header-menu .menu_inner {
			max-width:1200px;
			margin-left:auto;
			margin-right:auto;
		}';

		$styles .= '
		@media (max-width: 767px) { /* DO NOT CHANGE THIS LINE (See = Specific Options -> Responsive Resolution) */
			#mega_main_menu.topbar
			{
				display:none;
			}

			.notification-panel {
				text-align: left;
			}

			.notification-panel__message {
				font-size: 90%;
			}

			.calltoaction-area {
				text-align: left;
			}

			.calltoaction-area__message {
				font-size: 70%;
			}

			/* Hide top bar for mobiles. */
			.topbar {
				display: none;
			}

			/* Make mobile logo not biger that 70%. */
			.header-menu .logo_link {
				max-width: 70%;
			}
		}

		';

		return $styles;
	}

} // If mega main menu plugin is active.
