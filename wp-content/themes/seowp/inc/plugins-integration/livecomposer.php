<?php
/**
 * Live Composer plugin integration
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * Live Composer is a backbone of our theme. We use all its features
 * to maximize customization and flexibility of our theme.
 *
 * In this file we extend some of the Live Composer aspects:
 *    – Disable LC Templates for 'dslc_projects' content type
 *    – Alter LiveComposer Default Modules Styling
 *    – Custom shortcodes specially used to extend LC functionality
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 *
 * -------------------------------------------------------------------
 *
 * Send your ideas on code improvement or new hook requests using
 * contact form on https://themeforest.net/user/blueastralthemes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly


function lbmn_deregister_lc_fontawesome() {
	if ( defined( 'DS_LIVE_COMPOSER_URL' ) && ! DS_LIVE_COMPOSER_ACTIVE ) {
		// Deregister Font-Awesome css added by LC
		wp_dequeue_style( 'dslc-font-awesome' );
	}
}

add_action( 'wp_enqueue_scripts', 'lbmn_deregister_lc_fontawesome', 100, 1 );


// Check if Live Composer is active
if ( defined( 'DS_LIVE_COMPOSER_URL' ) ) {
	// Include Custom Footer template support
	require( get_template_directory() . '/inc/plugins-integration/livecomposer-header-footer.php' );

	// More icons for Live Composer
	require( get_template_directory() . '/inc/plugins-integration/livecomposer-icons.php' );

	/**
	 * ----------------------------------------------------------------------
	 * Make Live Composer to output custom CSS in the footer by default
	 */

	add_action( 'init', 'lbmn_output_lc_css_in_footer' );
	function lbmn_output_lc_css_in_footer() {
		$options              = get_option( 'dslc_plugin_options' );

		$dynamic_css_location = false;

		if ( isset( $options['lc_css_position'] ) ) {
			$dynamic_css_location = $options['lc_css_position'];
		}

		if ( ! $dynamic_css_location ) {
			$options['lc_css_position'] = 'body';
			update_option( 'dslc_plugin_options', $options );
		}
	}


	/**
	 * ----------------------------------------------------------------------
	 * Remove default templates from Templates > Load
	 * Add new templates
	 */
	add_action( 'init', 'remove_and_add_dslc_var_templates', 9 );
	function remove_and_add_dslc_var_templates() {
		global $dslc_var_templates;

		// $dslc_var_templates = array();
		// Remove default LC page templates
		if ( ! empty( $dslc_var_templates ) ) {

			unset( $dslc_var_templates['dslc-blog-ex-1'] );
			unset( $dslc_var_templates['dslc-blog-ex-2'] );
			unset( $dslc_var_templates['dslc-blog-ex-3'] );
			unset( $dslc_var_templates['dslc-projects-ex-1'] );
			unset( $dslc_var_templates['dslc-projects-ex-2'] );
			unset( $dslc_var_templates['dslc-partners-ex-1'] );
			unset( $dslc_var_templates['dslc-products-ex-1'] );
			unset( $dslc_var_templates['dslc-products-ex-2'] );
			unset( $dslc_var_templates['dslc-staff-ex-1'] );
			unset( $dslc_var_templates['dslc-staff-ex-2'] );

		}
	}

	/**
	 * ----------------------------------------------------------------------
	 * Remove 'dslc_projects' type from $dslc_post_types to disable
	 * LC templates for it. We want users to be able to create
	 * complex layouts for each Project/Case Study
	 */
	if ( ! function_exists( 'disable_lc_post_templates' ) ) :
		add_action( 'init', 'disable_lc_post_templates', 9 );
		function disable_lc_post_templates() {
			global $dslc_var_templates_pt;
			unset( $dslc_var_templates_pt['dslc_projects'] );
		}
	endif; // disable_lc_post_templates

	/**
	 * ----------------------------------------------------------------------
	 * Alter LiveComposer Default Modules Styling
	 * http://livecomposerplugin.com/docs/tuts/building-a-theme-defaults.html
	 */
	add_filter( 'dslc_module_options', 'lbmn_alter_lc_defaults', 10, 2 );
	function lbmn_alter_lc_defaults( $options, $id ) {

		// The array that will hold new defaults
		$new_defaults = array();


		$theme_ver_log = get_option( 'lbmn_theme_updates_log' );

		if ( is_array( $theme_ver_log ) && in_array( '1.0.1', $theme_ver_log ) ) {
			// Do not apply new default styles for users updated theme from V.1
			// to not break their live website layouts.

			/**
			 * --------------------------------------------
			 * Text module
			 */

			if ( $id == 'DSLC_Text_Simple' || $id == 'DSLC_Html' ) {
				$new_defaults = array(
					'css_custom'           => 'enabled',
					'css_margin_bottom'    => '30',
					'css_main_font_size'   => '17',
					'css_main_font_weight' => '300',
					'css_main_font_family' => '',
					'css_main_line_height' => '27',
					'css_h1_font_size'     => '66',
					'css_h1_font_weight'   => '200',
					'css_h1_font_family'   => '',
					'css_h1_line_height'   => '70',
					'css_h1_margin_bottom' => '30',
					'css_h2_font_size'     => '50',
					'css_h2_font_weight'   => '200',
					'css_h2_font_family'   => '',
					'css_h2_line_height'   => '55',
					'css_h2_margin_bottom' => '24',
					'css_h3_font_size'     => '42',
					'css_h3_font_weight'   => '200',
					'css_h3_font_family'   => '',
					'css_h3_line_height'   => '48',
					'css_h3_margin_bottom' => '25',
					'css_h4_font_size'     => '30',
					'css_h4_font_weight'   => '300',
					'css_h4_font_family'   => '',
					'css_h4_line_height'   => '38',
					'css_h4_margin_bottom' => '20',
					'css_h5_font_size'     => '24',
					'css_h5_font_weight'   => '300',
					'css_h5_font_family'   => '',
					'css_h5_line_height'   => '33',
					'css_h5_margin_bottom' => '20',

					'css_h6_font_size'            => '',
					'css_h6_font_family'          => '',
					'css_h6_font_weight'          => '',
					'css_h6_line_height'          => '',
					'css_h6_margin_bottom'        => '',
					'css_h6_padding_vertical'     => '',
					'css_h6_padding_horizontal'   => '',
					'css_h6_text_align'           => '',
					'css_h6_border_color'         => '',
					'css_h6_border_width'         => '',
					'css_h6_border_trbl'          => '',
					'css_h6_border_radius_top'    => '',
					'css_h6_border_radius_bottom' => '',

					'css_blockquote_font_family' => '',
					'css_button_font_family'     => '',
					'css_button_font_family'     => '',

					'css_res_t'                   => 'enabled',
					'css_res_t_margin_bottom'     => '39',
					'css_res_t_main_font_size'    => '16',
					'css_res_t_main_line_height'  => '26',
					'css_res_t_h2_font_size'      => '40',
					'css_res_t_h2_line_height'    => '46',
					'css_res_t_h2_margin_bottom'  => '0',
					'css_res_t_h3_font_size'      => '24',
					'css_res_t_h3_line_height'    => '26',
					'css_res_t_h3_margin_bottom'  => '30',
					'css_res_p'                   => 'enabled',
					'css_res_ph_main_font_size'   => '14',
					'css_res_ph_main_line_height' => '21',
					'css_res_ph_h2_font_size'     => '34',
					'css_res_ph_h2_line_height'   => '32',
					'css_res_p_h2_margin_bottom'  => '10',
					'css_res_ph_h3_font_size'     => '18',
					'css_res_ph_h3_line_height'   => '24',
					'css_res_p_h3_margin_bottom'  => '20',
				);
			}

			/**
			 * --------------------------------------------
			 * Title module
			 */
			if ( $id == 'DSLC_TP_Title' ) {
				$new_defaults = array(
					'css_font_size'   => '50',
					'css_font_weight' => '200',
					'css_font_family' => '',
					'css_line_height' => '55',
				);
			}

			/**
			 * --------------------------------------------
			 * Meta module
			 */
			if ( $id == 'DSLC_TP_Meta' ) {
				$new_defaults = array(
					'tp_elements'     => 'date author category tags comments ',
					'format'          => 'vertical',
					'color'           => 'rgb(97, 103, 108)',
					'font_size'       => '15',
					'css_font_weight' => '300',
					'css_font_family' => '',
					'css_line_height' => '22',
				);
			}

			/**
			 * --------------------------------------------
			 * Accordion module
			 */
			if ( $id == 'DSLC_Accordion' ) {
				$new_defaults = array(
					'css_title_font_family'   => '',
					'css_content_font_family' => '',
				);
			}

			/**
			 * --------------------------------------------
			 * Blog module
			 */
			if ( $id == 'DSLC_Blog' ) {
				$new_defaults = array(
					'css_title_font_family'             => '',
					'css_excerpt_font_family'           => '',
					'css_button_font_family'            => '',
					'css_main_heading_font_family'      => '',
					'css_main_heading_link_font_family' => '',
				);
			}

		} else {
			// Apply new module styling rules since V.1.1

			/**
			 * --------------------------------------------
			 * Text module
			 */
			if ( $id == 'DSLC_Text_Simple' || $id == 'DSLC_Html' || $id == 'DSLC_TP_Content' ) {
				$new_defaults = array(
					'css_main_font_size'   => '',
					'css_main_font_family' => '',
					'css_main_font_weight' => '',
					'css_main_line_height' => '',

					'css_h1_font_size'     => '',
					'css_h1_font_family'   => '',
					'css_h1_font_weight'   => '',
					'css_h1_line_height'   => '',
					'css_h1_margin_bottom' => '',

					'css_h2_font_size'     => '',
					'css_h2_font_family'   => '',
					'css_h2_font_weight'   => '',
					'css_h2_line_height'   => '',
					'css_h2_margin_bottom' => '',

					'css_h3_font_size'     => '',
					'css_h3_font_family'   => '',
					'css_h3_font_weight'   => '',
					'css_h3_line_height'   => '',
					'css_h3_margin_bottom' => '',

					'css_h4_font_size'     => '',
					'css_h4_font_family'   => '',
					'css_h4_font_weight'   => '',
					'css_h4_line_height'   => '',
					'css_h4_margin_bottom' => '',

					'css_h5_font_size'     => '',
					'css_h5_font_family'   => '',
					'css_h5_font_weight'   => '',
					'css_h5_line_height'   => '',
					'css_h5_margin_bottom' => '',

					'css_h6_font_size'     => '',
					'css_h6_font_family'   => '',
					'css_h6_font_weight'   => '',
					'css_h6_line_height'   => '',
					'css_h6_margin_bottom' => '',

					'css_blockquote_font_family' => '',
					'css_button_font_family'     => '',
					'css_button_font_family'     => '',

					'css_li_font_family'      => '',
					'css_li_font_size'        => '',
					'css_li_font_weight'      => '',
					'css_li_line_height'      => '',
					'css_ul_margin_bottom'    => '',
					'css_ul_margin_left'      => '',
					'css_ul_li_margin_bottom' => '',

					'css_inputs_font_family' => '',
					'css_inputs_font_size'   => '',
					'css_inputs_font_weight' => '',
					'css_inputs_line_height' => '',
				);
			}


			/**
			 * --------------------------------------------
			 * Button module
			 */
			if ( $id == 'DSLC_Button' ) {
				$new_defaults = array(
					'button_text'            => 'Click to edit',
					'button_url'             => '#',
					'button_icon_id' 			 => 'ext-arrow-right6',
					'css_bg_color'           => 'transparent',
					'css_border_color'       => 'rgb(226, 223, 223)',
					'css_border_color_hover' => 'rgb(75, 123, 194)',
					'css_border_width'       => '1',
					'css_border_radius'      => '4',

					'css_margin_bottom' => '50', // '15',

					'css_padding_vertical'   => '14',
					'css_padding_horizontal' => '18',

					'css_button_color'       => 'rgb(42, 160, 239)',
					'css_button_color_hover' => 'rgb(255, 255, 255)',
					'css_button_font_size'   => '17',
					'css_button_font_weight' => '300',
					'css_button_font_family' => '',

					'css_icon_margin' => '10',

					'css_res_p_padding_vertical'   => '',
					'css_res_p_padding_horizontal' => '',
					'css_res_p_button_font_size'   => '',
					'css_res_p_icon_margin'        => '',

					'css_res_t_margin_bottom'      => '',
					'css_res_t_padding_vertical'   => '',
					'css_res_t_padding_horizontal' => '',
					'css_res_t_button_font_size'   => '',
					'css_res_t_icon_margin'        => '',
				);
			}

			/**
			 * --------------------------------------------
			 * Info Box module
			 */
			if ( $id == 'DSLC_Info_Box' ) {
				$new_defaults = array(
					'elements'               => 'icon title content button ',
					'text_align'             => 'left',
					'css_margin_bottom'      => '50',
					'css_icon_bg_color'      => 'transparent',
					'css_icon_border_color'  => 'rgba(89, 175, 226, 0.3)',
					'css_icon_border_width'  => '1',
					'css_icon_color'         => 'rgb(89, 175, 226)',
					'css_icon_border_radius' => '28',
					'icon_id'                => 'ext-loader',
					'css_icon_margin_right'  => '25',
					'icon_position'          => 'aside',
					'css_icon_wrapper_width' => '72',
					'css_icon_width'         => '28',


					'title'                 => 'Click to edit this heading',
					'css_title_color'       => '',
					'css_title_font_size'   => '27',
					'css_title_font_weight' => '300',
					'css_title_font_family' => '',
					'css_title_line_height' => '30',
					'css_title_margin'      => '20',

					'content'                 => '<p>This is just placeholder text. To change it move your mouse this block and click "Edit Content" label.</p>',
					'css_content_font_weight' => '',
					'css_content_font_family' => '',
					'css_content_line_height' => '22',
					'css_content_margin'      => '20',

					'button_title'                  => 'Click to edit',
					'css_button_bg_color'           => 'rgba(0, 0, 0, 0)',
					'css_button_bg_color_hover'     => 'rgb(75, 123, 194)',
					'css_button_color'              => '',
					'css_button_icon_color'         => '',
					'css_button_border_width'       => '1',
					'css_button_border_color'       => 'rgb(226, 223, 223)',
					'css_button_border_color_hover' => 'rgb(75, 123, 194)',
					'css_button_font_size'          => '13',
					'css_button_font_weight'        => '400',
					'css_button_font_family'        => '',
					'css_button_margin_top'         => '20',
					'css_button_margin_right'       => '12',
					'button_icon_id'                => 'ext-arrow-right6',

					'button_2_title'                  => 'Click to edit',
					'css_button_2_bg_color'           => 'rgba(0, 0, 0, 0)',
					'css_button_2_bg_color_hover'     => 'rgb(75, 123, 194)',
					'css_button_2_color'              => '',
					'css_button_2_icon_color'         => '',
					'css_button_2_border_width'       => '1',
					'css_button_2_border_color'       => 'rgb(226, 223, 223)',
					'css_button_2_border_color_hover' => 'rgb(75, 123, 194)',
					'css_button_2_font_size'          => '13',
					'css_button_2_font_weight'        => '400',
					'css_button_2_font_family'        => '',
					'css_button_2_margin_top'         => '20',
					'css_button_2_margin_right'       => '12',
					'button_2_icon_id'                => 'ext-arrow-right6',

					'css_res_t'                           => 'disabled',
					'css_res_t_margin_bottom'             => '',
					'css_res_t_icon_margin_right'         => '20',
					'css_res_t_icon_wrapper_width'        => '50',
					'css_res_t_icon_width'                => '21',
					'css_res_t_title_font_size'           => '21',
					'css_res_t_title_line_height'         => '27',
					'css_res_t_title_margin'              => '18',
					'css_res_t_content_font_size'         => '',
					'css_res_t_content_line_height'       => '',
					'css_res_t_content_margin'            => '20',
					'css_res_t_button_font_size'          => '',
					'css_res_t_button_padding_vertical'   => '',
					'css_res_t_button_padding_horizontal' => '',
					'css_res_t_button_icon_margin'        => '10',

					'css_res_p'                           => 'disabled',
					'css_res_p_margin_bottom'             => '',
					'css_res_p_icon_margin_top'           => '-2',
					'css_res_p_icon_margin_right'         => '20',
					'css_res_p_icon_wrapper_width'        => '60',
					'css_res_p_icon_width'                => '24',
					'css_res_p_title_font_size'           => '23',
					'css_res_p_title_line_height'         => '27',
					'css_res_p_title_margin'              => '16',
					'css_res_p_content_margin'            => '20',
					'css_res_p_button_font_size'          => '',
					'css_res_p_button_padding_vertical'   => '',
					'css_res_p_button_padding_horizontal' => '',
					'css_res_p_button_icon_margin'        => '10',

				);
			}

			if ( $id == 'DSLC_Image' ) {
				$new_defaults = array(
					'css_ct_font_size'   => '14',
					'css_ct_font_weight' => '300',
					'css_ct_font_family' => '',
				);
			}


			if ( $id == 'DSLC_Icon' ) {
				$new_defaults = array(
					'icon_id'   => 'ext-circle-check',
				);
			}

			/**
			 * --------------------------------------------
			 * Title module
			 */
			if ( $id == 'DSLC_TP_Title' ) {
				$new_defaults = array(
					'css_font_size'   => '50',
					'css_font_weight' => '200',
					'css_font_family' => '',
					'css_line_height' => '55',
				);
			}

			/**
			 * --------------------------------------------
			 * Meta module
			 */
			if ( $id == 'DSLC_TP_Meta' ) {
				$new_defaults = array(
					'tp_elements'     => 'date author category tags comments ',
					'format'          => 'vertical',
					'color'           => 'rgb(97, 103, 108)',
					'font_size'       => '15',
					'css_font_weight' => '300',
					'css_font_family' => '',
					'css_line_height' => '22',
				);
			}

			/**
			 * --------------------------------------------
			 * Accordion module
			 */
			if ( $id == 'DSLC_Accordion' ) {
				$new_defaults = array(
					'css_title_font_family'   => '',
					'css_content_font_family' => '',
				);
			}

			/**
			 * --------------------------------------------
			 * Blog module
			 */
			if ( $id == 'DSLC_Blog' ) {
				$new_defaults = array(
					'css_title_font_family'             => '',
					'css_excerpt_font_family'           => '',
					'css_button_font_family'            => '',
					'css_main_heading_font_family'      => '',
					'css_main_heading_link_font_family' => '',
				);
			}

			/**
			 * ----------------------------------------------------------------------
			 * Partners Module
			 */

			if ( $id == 'DSLC_Partners' ) {
				$new_defaults = array(
					'elements' => 'main_heading filters ',

					'css_thumbnail_margin_bottom'    => '20',
					'css_thumbnail_padding_vertical' => '0',
					'thumb_resize_width'             => '',
					'css_title_color'                => '',
					'css_title_font_size'            => '21',
					'css_title_font_weight'          => '300',
					'css_title_font_family'          => '',
					'css_title_line_height'          => '27',
					'css_excerpt_color'              => '',
					'css_excerpt_font_size'          => '14',
					'css_excerpt_font_weight'        => '300',
					'css_excerpt_font_family'        => '',

					'main_heading_title'      => 'Click to edit this heading',
					'main_heading_link_title' => 'View all partners',

					'css_main_heading_font_size'   => '27',
					'css_main_heading_font_weight' => '300',
					'css_main_heading_font_family' => '',
					'css_main_heading_line_height' => '38',

					'css_main_heading_link_font_size'   => '16',
					'css_main_heading_link_font_weight' => '300',
					'css_main_heading_link_font_family' => '',
					'css_main_heading_sep_color'        => 'rgba(79, 79, 79, 0.25)',
					'css_heading_margin_bottom'         => '50',

					'css_filter_border_color'       => 'rgba(130, 129, 129, 0.11)',
					'css_filter_font_size'          => '14',
					'css_filter_font_weight'        => '400',
					'css_filter_font_family'        => '',
					'css_filter_padding_horizontal' => '16',
					'css_filter_position'           => 'right',
					'css_filter_margin_bottom'      => '50',

					'css_arrows_bg_color'           => 'transparent',
					'css_arrows_border_color'       => 'rgba(170, 170, 170, 0.28)',
					'css_arrows_border_color_hover' => 'rgb(88, 144, 229)',
					'css_arrows_border_width'       => '1',
					'css_arrows_color'              => 'rgba(196, 196, 196, 0.68)',
					'css_arrows_size'               => '40',
					'css_arrows_arrow_size'         => '11',

					'css_circles_color'        => 'rgba(185, 185, 185, 0.17)',
					'css_circles_color_active' => 'rgba(153, 153, 153, 0.78)',
					'css_circles_margin_top'   => '0',
					'css_circles_size'         => '8',
					'css_circles_spacing'      => '10',

					'css_res_p_thumbnail_padding_vertical'  => '10',
					'css_res_p_title_font_size'             => '21',
					'css_res_p_title_line_height'           => '27',
					'css_res_p_excerpt_font_size'           => '',
					'css_res_p_main_heading_font_size'      => '23',
					'css_res_p_main_heading_line_height'    => '27',
					'css_res_p_main_heading_link_font_size' => '16',
					'css_res_p_heading_margin_bottom'       => '0',
					'css_res_p_filter_font_size'            => '',

					'css_pag_align'                   => 'center',
					'css_pag_border_color'            => 'rgba(170, 170, 170, 0.28)',
					'css_pag_item_font_size'          => '14',
					'css_pag_item_font_weight'        => '400',
					'css_pag_item_font_family'        => '',
					'css_pag_item_padding_vertical'   => '14',
					'css_pag_item_padding_horizontal' => '16',
					'css_pag_item_spacing'            => '14',
				);
			}

			/**
			 * ----------------------------------------------------------------------
			 * Testimonials Module
			 */

			if ( $id == 'DSLC_Testimonials' ) {
				$new_defaults = array(
					'type'     => 'carousel',
					'elements' => 'main_heading filters ',

					'amount'  => '3',
					'columns' => '12',
					'order'   => 'ASC',

					'css_main_bg_color'           => 'transparent',
					'css_main_padding_vertical'   => '0',
					'css_main_padding_horizontal' => '0',

					'css_quote_border_color'   => 'transparent',
					'css_quote_border_width'   => '0',
					'css_quote_color'          => '',
					'css_quote_font_size'      => '20',
					'css_quote_font_weight'    => '300',
					'css_quote_line_height'    => '30',
					'css_quote_margin'         => '0',
					'css_quote_padding_bottom' => '0',

					'author_pos'              => 'outside right',
					'css_author_margin_left'  => '30',
					'css_avatar_bg_color'     => 'rgba(24, 24, 25, 0.05)',
					'css_avatar_border_color' => 'rgba(0, 0, 0, 0.06)',
					'css_avatar_border_width' => '1',
					'css_avatar_padding'      => '6',
					'css_avatar_size'         => '90',

					'css_name_color'           => '',
					'css_name_font_size'       => '24',
					'css_name_font_weight'     => '300',
					'css_name_margin_bottom'   => '6',
					'css_name_margin_top'      => '20',
					'css_position_color'       => '',
					'css_position_font_size'   => '16',
					'css_position_font_weight' => '300',


					'css_thumbnail_margin_bottom'    => '20',
					'css_thumbnail_padding_vertical' => '0',
					'thumb_resize_width'             => '',
					'css_title_color'                => '',
					'css_title_font_size'            => '21',
					'css_title_font_weight'          => '300',
					'css_title_font_family'          => '',
					'css_title_line_height'          => '27',
					'css_excerpt_color'              => '',
					'css_excerpt_font_size'          => '14',
					'css_excerpt_font_weight'        => '300',
					'css_excerpt_font_family'        => '',

					'css_quote_font_family'    => '',
					'css_name_font_family'     => '',
					'css_position_font_family' => '',

					'main_heading_title'      => 'Click to edit this heading',
					'main_heading_link_title' => 'View all testimonials',

					'css_main_heading_font_size'   => '27',
					'css_main_heading_font_weight' => '300',
					'css_main_heading_font_family' => '',
					'css_main_heading_line_height' => '38',

					'css_main_heading_link_font_size'   => '16',
					'css_main_heading_link_font_weight' => '300',
					'css_main_heading_link_font_family' => '',
					'css_main_heading_sep_color'        => 'rgba(79, 79, 79, 0.25)',
					'css_heading_margin_bottom'         => '50',

					'css_filter_border_color'       => 'rgba(130, 129, 129, 0.11)',
					'css_filter_font_size'          => '14',
					'css_filter_font_weight'        => '400',
					'css_filter_font_family'        => '',
					'css_filter_padding_horizontal' => '16',
					'css_filter_position'           => 'right',
					'css_filter_margin_bottom'      => '50',

					'css_arrows_bg_color'           => 'transparent',
					'css_arrows_border_color'       => 'rgba(170, 170, 170, 0.28)',
					'css_arrows_border_color_hover' => 'rgb(88, 144, 229)',
					'css_arrows_border_width'       => '1',
					'css_arrows_color'              => 'rgba(196, 196, 196, 0.68)',
					'css_arrows_size'               => '40',
					'css_arrows_arrow_size'         => '11',

					'css_circles_color'        => 'rgba(185, 185, 185, 0.17)',
					'css_circles_color_active' => 'rgba(153, 153, 153, 0.78)',
					'css_circles_margin_top'   => '0',
					'css_circles_size'         => '8',
					'css_circles_spacing'      => '10',

					'css_pag_align'                   => 'center',
					'css_pag_border_color'            => 'rgba(170, 170, 170, 0.28)',
					'css_pag_item_font_size'          => '14',
					'css_pag_item_font_weight'        => '400',
					'css_pag_item_font_family'        => '',
					'css_pag_item_padding_vertical'   => '14',
					'css_pag_item_padding_horizontal' => '16',
					'css_pag_item_spacing'            => '14',

					'css_res_p_thumbnail_padding_vertical'  => '10',
					'css_res_p_title_font_size'             => '21',
					'css_res_p_title_line_height'           => '27',
					'css_res_p_excerpt_font_size'           => '',
					'css_res_p_main_heading_font_size'      => '23',
					'css_res_p_main_heading_line_height'    => '27',
					'css_res_p_main_heading_link_font_size' => '16',
					'css_res_p_heading_margin_bottom'       => '0',
					'css_res_p_filter_font_size'            => '',

					'css_res_p_main_padding_vertical'   => '0',
					'css_res_p_main_padding_horizontal' => '0',
					'css_res_p_quote_margin'            => '0',
					'css_res_p_author_margin_bottom'    => '30',
					'css_res_p_author_margin_right'     => '0',

					'css_res_p_avatar_padding'                => '4',
					'css_res_p_name_font_size'                => '19',
					'css_res_p_name_margin_bottom'            => '4',
					'css_res_p_position_font_size'            => '14',
					'css_res_p_main_heading_link_padding_ver' => '15',
				);
			}

			/**
			 * ----------------------------------------------------------------------
			 * Projects Modules
			 */

			if ( $id == 'DSLC_Projects' ) {
				$new_defaults = array(
					'type'          => 'carousel',
					'orientation'   => 'vertical',
					'elements'      => '',
					'amount'        => '6',
					'columns'       => '4',
					'post_elements' => 'thumbnail title excerpt button ',

					'css_thumbnail_border_radius_top' => '0',
					'thumb_resize_height'             => '260',
					'thumb_resize_width'              => '120',
					'thumb_width'                     => '100',
					'css_main_text_align'             => 'left',

					'main_heading_title'      => 'Click to edit this heading',
					'main_heading_link_title' => 'View all projects',

					'css_main_heading_font_size'   => '27',
					'css_main_heading_font_weight' => '300',
					'css_main_heading_font_family' => '',
					'css_main_heading_line_height' => '38',

					'css_main_heading_link_font_size'   => '16',
					'css_main_heading_link_font_weight' => '300',
					'css_main_heading_link_font_family' => '',
					'css_main_heading_sep_color'        => 'rgba(79, 79, 79, 0.25)',
					'css_heading_margin_bottom'         => '50',

					'css_filter_border_color'       => 'rgba(130, 129, 129, 0.11)',
					'css_filter_font_size'          => '14',
					'css_filter_font_weight'        => '400',
					'css_filter_font_family'        => '',
					'css_filter_padding_horizontal' => '16',
					'css_filter_position'           => 'right',
					'css_filter_margin_bottom'      => '50',

					'css_arrows_bg_color'           => 'transparent',
					'css_arrows_border_color'       => 'rgba(170, 170, 170, 0.28)',
					'css_arrows_border_color_hover' => 'rgb(88, 144, 229)',
					'css_arrows_border_width'       => '1',
					'css_arrows_color'              => 'rgba(196, 196, 196, 0.68)',
					'css_arrows_size'               => '40',
					'css_arrows_arrow_size'         => '11',

					'css_circles_color'        => 'rgba(185, 185, 185, 0.17)',
					'css_circles_color_active' => 'rgba(153, 153, 153, 0.78)',
					'css_circles_margin_top'   => '0',
					'css_circles_size'         => '8',
					'css_circles_spacing'      => '10',

					'css_pag_align'                   => 'center',
					'css_pag_border_color'            => 'rgba(170, 170, 170, 0.28)',
					'css_pag_item_font_size'          => '14',
					'css_pag_item_font_weight'        => '400',
					'css_pag_item_font_family'        => '',
					'css_pag_item_padding_vertical'   => '14',
					'css_pag_item_padding_horizontal' => '16',
					'css_pag_item_spacing'            => '14',

					'css_title_color'       => '',
					'css_title_font_size'   => '21',
					'css_title_font_weight' => '300',
					'css_title_font_family' => '',
					'css_title_line_height' => '27',

					'css_cats_color'         => 'rgb(171, 171, 171)',
					'css_cats_font_size'     => '12',
					'css_cats_font_weight'   => '300',
					'css_cats_font_family'   => '',
					'css_cats_margin-bottom' => '8',

					'carousel_elements'             => 'circles ',
					'css_main_border_width'         => '0',
					'css_main_border_radius_bottom' => '0',
					'css_main_padding_vertical'     => '30',
					'css_main_padding_horizontal'   => '40',
					'css_main_text_align'           => 'center',

					'css_excerpt_border_width' => '0',
					'css_excerpt_font_weight'  => '300',
					'css_excerpt_font_family'  => '',
					'css_excerpt_padding'      => '0',

					'button_text'                   => 'View Project',
					'css_button_bg_color'           => 'transparent',
					'css_button_border_width'       => '1',
					'css_button_border_color'       => 'rgb(226, 223, 223)',
					'css_button_border_color_hover' => 'rgb(71, 124, 204)',
					'css_button_color'              => '',
					'css_button_color_hover'        => 'rgb(216, 113, 113)',
					'css_button_font_size'          => '14',
					'css_button_font_weight'        => '300',
					'css_button_font_family'        => '',
					'css_button_padding_vertical'   => '12',

					'css_res_p_title_font_size'             => '21',
					'css_res_p_title_line_height'           => '27',
					'css_res_p_excerpt_font_size'           => '',
					'css_res_p_main_heading_font_size'      => '23',
					'css_res_p_main_heading_line_height'    => '27',
					'css_res_p_main_heading_link_font_size' => '16',
					'css_res_p_heading_margin_bottom'       => '0',
					'css_res_p_filter_font_size'            => '',

					'css_res_t_title_font_size'             => '21',
					'css_res_t_title_line_height'           => '27',
					'css_res_t_excerpt_font_size'           => '',
					'css_res_t_main_heading_font_size'      => '23',
					'css_res_t_main_heading_line_height'    => '27',
					'css_res_t_main_heading_link_font_size' => '16',
					'css_res_t_heading_margin_bottom'       => '0',
					'css_res_t_filter_font_size'            => '',


					'css_res_t_button_font_size'          => '',
					'css_res_t_button_padding_vertical'   => '',
					'css_res_t_button_padding_horizontal' => '',
					'css_res_t_button_icon_margin'        => '10',
				);
			}

			/**
			 * ----------------------------------------------------------------------
			 * Posts Module
			 */

			if ( $id == 'DSLC_Posts' ) {
				$new_defaults = array(
					'type'          => 'carousel',
					'orientation'   => 'vertical',
					'elements'      => 'main_heading',
					'amount'        => '6',
					'columns'       => '4',
					'post_elements' => 'thumbnail title excerpt button ',

					'css_thumb_border_radius_top' => '0',
					'css_main_text_align'         => 'left',
					'thumb_width'                 => '100',
					'thumb_margin'                => '25',
					'thumb_resize_height'         => '255',
					'thumb_resize_width_manual'   => '400',
					'thumb_resize_width'          => '384',

					'main_heading_title'      => 'Click to edit this heading',
					'main_heading_link_title' => 'View all projects',

					'css_main_heading_font_size'   => '27',
					'css_main_heading_font_weight' => '300',
					'css_main_heading_font_family' => '',
					'css_main_heading_line_height' => '38',

					'css_main_heading_link_font_size'   => '16',
					'css_main_heading_link_font_weight' => '300',
					'css_main_heading_link_font_family' => '',
					'css_main_heading_sep_color'        => 'rgba(79, 79, 79, 0.25)',
					'css_heading_margin_bottom'         => '50',

					'css_filter_border_color'       => 'rgba(130, 129, 129, 0.11)',
					'css_filter_font_size'          => '14',
					'css_filter_font_weight'        => '400',
					'css_filter_font_family'        => '',
					'css_filter_padding_horizontal' => '16',
					'css_filter_position'           => 'right',
					'css_filter_margin_bottom'      => '50',

					'css_arrows_bg_color'           => 'transparent',
					'css_arrows_border_color'       => 'rgba(170, 170, 170, 0.28)',
					'css_arrows_border_color_hover' => 'rgb(88, 144, 229)',
					'css_arrows_border_width'       => '1',
					'css_arrows_color'              => 'rgba(196, 196, 196, 0.68)',
					'css_arrows_size'               => '40',
					'css_arrows_arrow_size'         => '11',

					'css_circles_color'        => 'rgba(185, 185, 185, 0.17)',
					'css_circles_color_active' => 'rgba(153, 153, 153, 0.78)',
					'css_circles_margin_top'   => '0',
					'css_circles_size'         => '8',
					'css_circles_spacing'      => '10',

					'css_pag_align'                   => 'center',
					'css_pag_border_color'            => 'rgba(170, 170, 170, 0.28)',
					'css_pag_item_font_size'          => '14',
					'css_pag_item_font_weight'        => '400',
					'css_pag_item_font_family'        => '',
					'css_pag_item_padding_vertical'   => '14',
					'css_pag_item_padding_horizontal' => '16',
					'css_pag_item_spacing'            => '14',


					'css_title_color'       => '',
					'title_font_size'       => '24',
					'css_title_font_weight' => '300',
					'css_title_font_family' => '',
					'title_line_height'     => '27',

					'css_excerpt_border_width' => '0',
					'css_excerpt_font_weight'  => '300',
					'css_excerpt_font_family'  => '',
					'css_excerpt_padding'      => '0',

					'css_excerpt_border_width' => '0',

					'css_excerpt_font_size'   => '14',
					'css_excerpt_font_weight' => '300',
					'excerpt_length'          => '16',
					'css_excerpt_color'       => '',


					'carousel_elements'             => 'arrows circles ',
					'css_main_border_width'         => '0',
					'css_main_border_radius_bottom' => '0',
					'css_main_padding_vertical'     => '0',
					'css_main_padding_horizontal'   => '0',
					'css_main_text_align'           => 'left',

					'css_meta_border_width'     => '0',
					'css_meta_border_trbl'      => 'bottom ',
					'css_meta_font_family'      => '',
					'css_meta_link_color'       => '',
					'css_meta_link_color_hover' => '',


					'button_text'                   => 'View Project',
					'css_button_bg_color'           => 'transparent',
					'css_button_border_width'       => '1',
					'css_button_border_color'       => 'rgb(226, 223, 223)',
					'css_button_border_color_hover' => 'rgb(71, 124, 204)',
					'css_button_color'              => '',
					'css_button_color_hover'        => 'rgb(255, 255, 255)',
					'css_button_font_size'          => '14',
					'css_button_font_weight'        => '300',
					'css_button_font_family'        => '',
					'css_button_padding_vertical'   => '12',

					'css_res_p_title_font_size'             => '21',
					'css_res_p_title_line_height'           => '27',
					'css_res_p_excerpt_font_size'           => '',
					'css_res_p_main_heading_font_size'      => '23',
					'css_res_p_main_heading_line_height'    => '27',
					'css_res_p_main_heading_link_font_size' => '16',
					'css_res_p_heading_margin_bottom'       => '0',
					'css_res_p_filter_font_size'            => '',

					'css_res_t_title_font_size'             => '21',
					'css_res_t_title_line_height'           => '27',
					'css_res_t_excerpt_font_size'           => '',
					'css_res_t_main_heading_font_size'      => '23',
					'css_res_t_main_heading_line_height'    => '27',
					'css_res_t_main_heading_link_font_size' => '16',
					'css_res_t_heading_margin_bottom'       => '0',
					'css_res_t_filter_font_size'            => '',

					'css_res_p_thumb_margin'            => '14',
					'css_res_p_main_padding_vertical'   => '0',
					'css_res_p_main_padding_horizontal' => '0',


					'css_res_t_button_font_size'          => '',
					'css_res_t_button_padding_vertical'   => '',
					'css_res_t_button_padding_horizontal' => '',
					'css_res_t_button_icon_margin'        => '10',
				);
			}

		} // else in_array('1.0.1')

		// Call the function that alters the defaults and return
		return dslc_set_defaults( $new_defaults, $options );
	}

	function lbmn_activate_pro_modules() {

		/* if ( 'themes' !== $current_screen->id ) {
			return;
		} */

		$plugin_data   = get_option( 'lcextpro', false );
		$plugin_status = array(
			'extensions' => array(
				'cptsupport' => array(
					'active' => true,
				),
				'googlemaps' => array(
					'active' => true,
				),
				'openstreetmap' => array(
					'active' => true,
				),
				'menu' => array(
					'active' => true,
				),
				'contact-forms' => array(
					'active' => true,
				),
			),
		);

		update_option( 'lcextpro', $plugin_status );
	}

	add_action( 'current_screen', 'lbmn_activate_pro_extensions' );
	function lbmn_activate_pro_extensions( $current_screen ) {
		if ( ( 'plugins' === $current_screen->id || 'ninja-forms' === $current_screen->id ) && current_user_can( 'install_plugins' ) ) {
			if ( ! get_option( 'lc-extensions-migrated', false ) ) {
				lbmn_activate_pro_modules();
				update_option( 'lc-extensions-migrated', true );
			}
		}
	}

	add_filter( "dslc_license_block_variants", 'lbmn_license_block_variants', 10, 2 );
	function lbmn_license_block_variants($license_block_variants) {
		$license_block_variants["invalid"]['text_header'] = __( 'Live Composer Page Builder Powers SEOWP' );
		$license_block_variants["invalid"]['text_body'] = __( 'The three modules showing as "Active" below come FREE with your purchase of the SEOWP theme and <strong><em>do not require a license key</em></strong> to use. To utilize the rest of the Premium Extensions Pack (the other 14 modules showing as inactive), please <a href="https://livecomposerplugin.com/your-account/license/">purchase a premium license here</a>.' );
		return $license_block_variants;
	}

} //if ( defined( 'DS_LIVE_COMPOSER_URL' ) )

/**
 * Remove the Woo products module from LC ( https://github.com/BlueAstralOrg/SEOWP/issues/89 )
 *
 * @param array $dslc_var_modules All modules.
 */
function lbmn_filter_disabled_modules( $dslc_var_modules ) {

	unset( $dslc_var_modules['DSLC_WooCommerce_Products'] );

	return $dslc_var_modules;

} add_filter( 'dslc_filter_modules', 'lbmn_filter_disabled_modules', 10 );
