<?php
/**
 * Customized CSS code generator
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * This file defines the functions responsible for style injection
 * with custom colors/fonts settings in the header
 *
 * To optimize WP speed we use Transients API caching provided by WP.
 * Idea and basic implementation by @link https://github.com/aristath used in his
 * open-source theme @link https://github.com/aristath/lbmn
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

/**
 * ----------------------------------------------------------------------
 * Generate customized CSS output
 */

function lbmn_customized_css( $gutenberg = false ) {
	$styles            = '';
	$lbmn_themeoptions = get_option( 'lbmn_theme_options' ); // Get array of our theme options.

	// Front-end CSS path variation.
	$body_or_editorcontainer = 'body ';
	$body_or_editorwrapper = 'body ';
	$empy_or_editorwrapper = '';

	// Gutenberg CSS path variation.
	if ( $gutenberg ) {
		$body = '.block-editor__container ';
		$body_or_editorwrapper = 'div.editor-styles-wrapper ';
		$empy_or_editorwrapper = 'div.editor-styles-wrapper, ';
	}
	/**
	 * ----------------------------------------------------------------------
	 * Background
	 */

	$page_background = get_theme_mod(
		'lbmn_page_background_color',
		LBMN_PAGEBACKGROUNDCOLOR_DEFAULT
	);

	$content_background = get_theme_mod(
		'lbmn_content_background_color',
		LBMN_CONTENT_BACKGROUND_COLOR_DEFAULT
	);

	if ( $gutenberg ) {
		$styles .= '.block-editor__container {background-color:' . esc_attr( $content_background ) . ';}';
	} else {
		$styles .= 'body, .global-wrapper {background-color:' . esc_attr( $content_background ) . ';}';
	}
	$styles .= 'body.boxed-page-layout {background-color:' . esc_attr( $page_background ) . ';}';

	$lbmn_page_background_image            = is_array($lbmn_themeoptions) ? $lbmn_themeoptions['lbmn_page_background_image'] : null;
	$lbmn_page_background_image_opacity    = get_theme_mod( 'lbmn_page_background_image_opacity' );
	$lbmn_page_background_image_repeat     = get_theme_mod( 'lbmn_page_background_image_repeat' );
	$lbmn_page_background_image_position   = get_theme_mod( 'lbmn_page_background_image_position' );
	$lbmn_page_background_image_attachment = get_theme_mod( 'lbmn_page_background_image_attachment' );
	$lbmn_page_background_image_size       = get_theme_mod( 'lbmn_page_background_image_size' );

	if ( $lbmn_page_background_image ) {
		$styles .= 'body.boxed-page-layout:before {background-image:url(' . esc_url( $lbmn_page_background_image ) . ');}';
	}

	if ( isset( $lbmn_page_background_image_opacity ) ) {
		$styles .= 'body.boxed-page-layout:before {opacity:' . esc_attr( $lbmn_page_background_image_opacity ) . ';}';
	}

	if ( $lbmn_page_background_image_repeat ) {
		$styles .= 'body.boxed-page-layout:before {background-repeat:' . esc_attr( $lbmn_page_background_image_repeat ) . ';}';
	}

	if ( $lbmn_page_background_image_position ) {
		$styles .= 'body.boxed-page-layout:before {background-position:' . esc_attr( $lbmn_page_background_image_position ) . ';}';
	}

	if ( $lbmn_page_background_image_attachment ) {
		$styles .= 'body.boxed-page-layout:before {background-attachment:' . esc_attr( $lbmn_page_background_image_attachment ) . ';}';
	}

	if ( $lbmn_page_background_image_size ) {
		$styles .= 'body.boxed-page-layout:before {background-size:' . esc_attr( $lbmn_page_background_image_size ) . ';}';
	}

	/**
	 * ----------------------------------------------------------------------
	 * Notification panel
	 */
	$notificationpanel_height         = intval( str_replace( 'px', '', get_theme_mod( 'lbmn_notificationpanel_height', LBMN_NOTIFICATIONPANEL_HEIGHT_DEFAULT ) ) );
	$notificationpanel_bgcolor        = get_theme_mod( 'lbmn_notificationpanel_backgroundcolor', LBMN_NOTIFICATIONPANEL_BACKGROUNDCOLOR_DEFAULT );
	$notificationpanel_txtcolor       = get_theme_mod( 'lbmn_notificationpanel_textcolor', LBMN_NOTIFICATIONPANEL_TXTCOLOR_DEFAULT );
	$notificationpanel_bgcolor_hover  = get_theme_mod( 'lbmn_notificationpanel_backgroundcolor_hover', LBMN_NOTIFICATIONPANEL_BACKGROUNDCOLOR_HOVER_DEFAULT );
	$notificationpanel_txtcolor_hover = get_theme_mod( 'lbmn_notificationpanel_textcolor_hover', LBMN_NOTIFICATIONPANEL_TXTCOLOR_HOVER_DEFAULT );

	$styles .= '.notification-panel {';
	$styles .= 'background-color:' . esc_attr( $notificationpanel_bgcolor ) . ';';
	$styles .= '}';
	$styles .= '.notification-panel, .notification-panel * { color:' . esc_attr( $notificationpanel_txtcolor ) . ';}';

	$styles .= '.notification-panel:before {';
	$styles .= 'min-height: ' . esc_attr( $notificationpanel_height ) . 'px;';
	$styles .= '}';

	$styles .= '.notification-panel:hover {';
	$styles .= 'background-color:' . esc_attr( $notificationpanel_bgcolor_hover ) . ';';
	$styles .= '}';
	$styles .= '.notification-panel:hover, .notification-panel:hover * {color:' . esc_attr( $notificationpanel_txtcolor_hover ) . ';}';

	/**
	 * ----------------------------------------------------------------------
	 * Typography
	 */
	$link_color       = get_theme_mod( 'lbmn_typography_link_color', LBMN_TYPOGRAPHY_LINK_COLOR_DEFAULT );
	$link_color_hover = get_theme_mod( 'lbmn_typography_link_hover_color', LBMN_TYPOGRAPHY_LINK_HOVER_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper a {';
	} else {
		$styles .= 'a {';
	}
	$styles .= 'color: ' . esc_attr( $link_color ) . ';';
	$styles .= '}';

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper a:hover {';
	} else {
		$styles .= 'a:hover {';
	}
	$styles .= 'color: ' . esc_attr( $link_color_hover ) . ';';
	$styles .= '}';

	// Buttons color in Gutenberg.
	$styles .= 'div.editor-styles-wrapper .wp-block-button:not(.is-style-outline) .wp-block-button__link:not(.has-background),';
	$styles .= '.entry-content .wp-block-button:not(.is-style-outline) .wp-block-button__link:not(.has-background) {';
	$styles .= 'background-color: ' . esc_attr( $link_color ) . ';';
	$styles .= '}';


	$styles .= '.has-primary-background-color {';
	$styles .= 'background-color: ' . esc_attr( $link_color ) . ';';
	$styles .= '}';

	// has-secondary-background-color

	$styles .= '.wp-block-button.is-style-outline .wp-block-button__link:not(.has-text-color) {';
	$styles .= 'color: ' . esc_attr( $link_color ) . ';';
	$styles .= '}';

	$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

	if ( ! empty( $languages ) ) {
		foreach ( $languages as $l ) {
			$my_default_lang = apply_filters( 'wpml_default_language', null );

			if ( $my_default_lang != $l['language_code'] ) {
				$lang = $l['language_code'];

				//body
				$typography_p_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_p_font', LBMN_TYPOGRAPHY_P_FONT_DEFAULT ), $lang );
				$typography_p_font = str_replace( '+', ' ', $typography_p_font['font_family'] );

				$styles .= 'body.current_language_' . esc_attr( $l['language_code'] ) . '{';
				$styles .= 'font-family: ' . wp_kses_data( $typography_p_font ) . ';';
				$styles .= '}';

				//h1
				$typography_h1_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h1_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ), $lang );
				$typography_h1_font = str_replace( '+', ' ', $typography_h1_font['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' h1 {';
				$styles .= 'font-family: ' . wp_kses_data( $typography_h1_font ) . ';';
				$styles .= '}';

				//h2
				$typography_h2_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h2_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ), $lang );
				$typography_h2_font = str_replace( '+', ' ', $typography_h2_font['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' h2 {';
				$styles .= 'font-family: ' . wp_kses_data( $typography_h2_font ) . ';';
				$styles .= '}';

				//h3
				$typography_h3_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h3_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ), $lang );
				$typography_h3_font = str_replace( '+', ' ', $typography_h3_font['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' h3 {';
				$styles .= 'font-family: ' . wp_kses_data( $typography_h3_font ) . ';';
				$styles .= '}';

				//h4
				$typography_h4_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h4_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ), $lang );
				$typography_h4_font = str_replace( '+', ' ', $typography_h4_font['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' h4 {';
				$styles .= 'font-family: ' . wp_kses_data( $typography_h4_font ) . ';';
				$styles .= '}';

				//h5
				$typography_h5_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h5_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ), $lang );
				$typography_h5_font = str_replace( '+', ' ', $typography_h5_font['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' h5 {';
				$styles .= 'font-family: ' . wp_kses_data( $typography_h5_font ) . ';';
				$styles .= '}';

				//h6
				$typography_h6_font = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h6_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ), $lang );
				$typography_h6_font = str_replace( '+', ' ', $typography_h6_font['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' h6 {';
				$styles .= 'font-family: ' . wp_kses_data( $typography_h6_font ) . ';';
				$styles .= '}';

				// Call to action
				$calltoaction_fontfamily = lbmn_output_css_webfont( get_theme_mod( 'lbmn_calltoaction_font', LBMN_CALLTOACTION_FONT_DEFAULT ), $lang );
				$calltoaction_fontfamily = str_replace( '+', ' ', $calltoaction_fontfamily['font_family'] );

				$styles .= '.current_language_' . esc_attr( $l['language_code'] ) . ' .calltoaction-area__content {';
				$styles .= 'font-family: ' . wp_kses_data( $calltoaction_fontfamily ) . ';';
				$styles .= '}';

				// Call to action
				$calltoaction_fontfamily = lbmn_output_css_webfont( get_theme_mod( 'lbmn_calltoaction_font', LBMN_CALLTOACTION_FONT_DEFAULT ), $lang );
				$calltoaction_fontfamily = str_replace( '+', ' ', $calltoaction_fontfamily['font_family'] );

				$styles .= '.current_language_' . $l['language_code'] . ' .calltoaction-area__content {';
				$styles .= 'font-family:' . wp_kses_data( $calltoaction_fontfamily ) . ';';
				$styles .= '}';

			}
		}
	}

	$typography_p_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_p_font', LBMN_TYPOGRAPHY_P_FONT_DEFAULT ) );
	$typography_p_font         = str_replace( '+', ' ', $typography_p_font['font_family'] );
	$typography_p_fontsize     = get_theme_mod( 'lbmn_typography_p_fontsize', LBMN_TYPOGRAPHY_P_FONTSIZE_DEFAULT );
	$typography_p_fontweight   = get_theme_mod( 'lbmn_typography_p_fontweight', LBMN_TYPOGRAPHY_P_FONTWEIGHT_DEFAULT );
	$typography_p_lineheight   = get_theme_mod( 'lbmn_typography_p_lineheight', LBMN_TYPOGRAPHY_P_LINEHEIGHT_DEFAULT );
	$typography_p_marginbottom = get_theme_mod( 'lbmn_typography_p_marginbottom', LBMN_TYPOGRAPHY_P_MARGINBOTTOM_DEFAULT );
	$typography_p_color        = get_theme_mod( 'lbmn_typography_p_color', LBMN_TYPOGRAPHY_P_COLOR_DEFAULT );


	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper {';
	} else {
		$styles .= 'body, body .dslc-module-front {';
	}

	$styles .= '
		font-family: ' . wp_kses_data( $typography_p_font ) . ';
		line-height: ' . esc_attr( $typography_p_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_p_fontweight ) . ';
		color: ' . esc_attr( $typography_p_color ) . ';
	}

	.site {
		font-size: ' . esc_attr( $typography_p_fontsize ) . 'px;
	}';

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper p {';
	} else {
		$styles .= 'p {';
	}
	$styles .= 'margin-bottom: ' . esc_attr( $typography_p_marginbottom ) . 'px;}';

	/**
	 * ------------------------------
	 */

	$typography_h1_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h1_font', LBMN_TYPOGRAPHY_H1_FONT_DEFAULT ) );
	$typography_h1_font         = str_replace( '+', ' ', $typography_h1_font['font_family'] );
	$typography_h1_fontsize     = get_theme_mod( 'lbmn_typography_h1_fontsize', LBMN_TYPOGRAPHY_H1_FONTSIZE_DEFAULT );
	$typography_h1_fontweight   = get_theme_mod( 'lbmn_typography_h1_fontweight', LBMN_TYPOGRAPHY_H1_FONTWEIGHT_DEFAULT );
	$typography_h1_lineheight   = get_theme_mod( 'lbmn_typography_h1_lineheight', LBMN_TYPOGRAPHY_H1_LINEHEIGHT_DEFAULT );
	$typography_h1_marginbottom = get_theme_mod( 'lbmn_typography_h1_marginbottom', LBMN_TYPOGRAPHY_H1_MARGINBOTTOM_DEFAULT );
	$typography_h1_color        = get_theme_mod( 'lbmn_typography_h1_color', LBMN_TYPOGRAPHY_H1_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper h1, .editor-post-title, .editor-post-title__block .editor-post-title__input {';
	} else {
		$styles .= 'h1 {';
	}
	$styles .= '
		font-family: ' . wp_kses_data( $typography_h1_font ) . ';
		font-size: ' . esc_attr( $typography_h1_fontsize ) . 'px;
		line-height: ' . esc_attr( $typography_h1_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_h1_fontweight ) . ';
		margin-bottom: ' . esc_attr( $typography_h1_marginbottom ) . 'px;
		color: ' . esc_attr( $typography_h1_color ) . ';
	}';

	/**
	 * ------------------------------
	 */

	$typography_h2_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h2_font', LBMN_TYPOGRAPHY_H2_FONT_DEFAULT ) );
	$typography_h2_font         = str_replace( '+', ' ', $typography_h2_font['font_family'] );
	$typography_h2_fontsize     = get_theme_mod( 'lbmn_typography_h2_fontsize', LBMN_TYPOGRAPHY_H2_FONTSIZE_DEFAULT );
	$typography_h2_fontweight   = get_theme_mod( 'lbmn_typography_h2_fontweight', LBMN_TYPOGRAPHY_H2_FONTWEIGHT_DEFAULT );
	$typography_h2_lineheight   = get_theme_mod( 'lbmn_typography_h2_lineheight', LBMN_TYPOGRAPHY_H2_LINEHEIGHT_DEFAULT );
	$typography_h2_marginbottom = get_theme_mod( 'lbmn_typography_h2_marginbottom', LBMN_TYPOGRAPHY_H2_MARGINBOTTOM_DEFAULT );
	$typography_h2_color        = get_theme_mod( 'lbmn_typography_h2_color', LBMN_TYPOGRAPHY_H2_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper h2 {';
	} else {
		$styles .= 'h2 {';
	}
	$styles .= '
		font-family: ' . wp_kses_data( $typography_h2_font ) . ';
		font-size: ' . esc_attr( $typography_h2_fontsize ) . 'px;
		line-height: ' . esc_attr( $typography_h2_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_h2_fontweight ) . ';
		margin-bottom: ' . esc_attr( $typography_h2_marginbottom ) . 'px;
		color: ' . esc_attr( $typography_h2_color ) . ';
	}';

	/**
	 * ------------------------------
	 */

	$typography_h3_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h3_font', LBMN_TYPOGRAPHY_H3_FONT_DEFAULT ) );
	$typography_h3_font         = str_replace( '+', ' ', $typography_h3_font['font_family'] );
	$typography_h3_fontsize     = get_theme_mod( 'lbmn_typography_h3_fontsize', LBMN_TYPOGRAPHY_H3_FONTSIZE_DEFAULT );
	$typography_h3_fontweight   = get_theme_mod( 'lbmn_typography_h3_fontweight', LBMN_TYPOGRAPHY_H3_FONTWEIGHT_DEFAULT );
	$typography_h3_lineheight   = get_theme_mod( 'lbmn_typography_h3_lineheight', LBMN_TYPOGRAPHY_H3_LINEHEIGHT_DEFAULT );
	$typography_h3_marginbottom = get_theme_mod( 'lbmn_typography_h3_marginbottom', LBMN_TYPOGRAPHY_H3_MARGINBOTTOM_DEFAULT );
	$typography_h3_color        = get_theme_mod( 'lbmn_typography_h3_color', LBMN_TYPOGRAPHY_H3_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper h3 {';
	} else {
		$styles .= 'h3 {';
	}
	$styles .= '
		font-family: ' . wp_kses_data( $typography_h3_font ) . ';
		font-size: ' . esc_attr( $typography_h3_fontsize ) . 'px;
		line-height: ' . esc_attr( $typography_h3_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_h3_fontweight ) . ';
		margin-bottom: ' . esc_attr( $typography_h3_marginbottom ) . 'px;
		color: ' . esc_attr( $typography_h3_color ) . ';
	}';

	/**
	 * ------------------------------
	 */

	$typography_h4_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h4_font', LBMN_TYPOGRAPHY_H4_FONT_DEFAULT ) );
	$typography_h4_font         = str_replace( '+', ' ', $typography_h4_font['font_family'] );
	$typography_h4_fontsize     = get_theme_mod( 'lbmn_typography_h4_fontsize', LBMN_TYPOGRAPHY_H4_FONTSIZE_DEFAULT );
	$typography_h4_fontweight   = get_theme_mod( 'lbmn_typography_h4_fontweight', LBMN_TYPOGRAPHY_H4_FONTWEIGHT_DEFAULT );
	$typography_h4_lineheight   = get_theme_mod( 'lbmn_typography_h4_lineheight', LBMN_TYPOGRAPHY_H4_LINEHEIGHT_DEFAULT );
	$typography_h4_marginbottom = get_theme_mod( 'lbmn_typography_h4_marginbottom', LBMN_TYPOGRAPHY_H4_MARGINBOTTOM_DEFAULT );
	$typography_h4_color        = get_theme_mod( 'lbmn_typography_h4_color', LBMN_TYPOGRAPHY_H4_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper h4 {';
	} else {
		$styles .= 'h4 {';
	}
	$styles .= '
		font-family: ' . wp_kses_data( $typography_h4_font ) . ';
		font-size: ' . esc_attr( $typography_h4_fontsize ) . 'px;
		line-height: ' . esc_attr( $typography_h4_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_h4_fontweight ) . ';
		margin-bottom: ' . esc_attr( $typography_h4_marginbottom ) . 'px;
		color: ' . esc_attr( $typography_h4_color ) . ';
	}';

	/**
	 * ------------------------------
	 */

	$typography_h5_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h5_font', LBMN_TYPOGRAPHY_H5_FONT_DEFAULT ) );
	$typography_h5_font         = str_replace( '+', ' ', $typography_h5_font['font_family'] );
	$typography_h5_fontsize     = get_theme_mod( 'lbmn_typography_h5_fontsize', LBMN_TYPOGRAPHY_H5_FONTSIZE_DEFAULT );
	$typography_h5_fontweight   = get_theme_mod( 'lbmn_typography_h5_fontweight', LBMN_TYPOGRAPHY_H5_FONTWEIGHT_DEFAULT );
	$typography_h5_lineheight   = get_theme_mod( 'lbmn_typography_h5_lineheight', LBMN_TYPOGRAPHY_H5_LINEHEIGHT_DEFAULT );
	$typography_h5_marginbottom = get_theme_mod( 'lbmn_typography_h5_marginbottom', LBMN_TYPOGRAPHY_H5_MARGINBOTTOM_DEFAULT );
	$typography_h5_color        = get_theme_mod( 'lbmn_typography_h5_color', LBMN_TYPOGRAPHY_H5_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper h5 {';
	} else {
		$styles .= 'h5 {';
	}
	$styles .= '
		font-family: ' . wp_kses_data( $typography_h5_font ) . ';
		font-size: ' . esc_attr( $typography_h5_fontsize ) . 'px;
		line-height: ' . esc_attr( $typography_h5_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_h5_fontweight ) . ';
		margin-bottom: ' . esc_attr( $typography_h5_marginbottom ) . 'px;
		color: ' . esc_attr( $typography_h5_color ) . ';
	}';

	/**
	 * ------------------------------
	 */

	$typography_h6_font         = lbmn_output_css_webfont( get_theme_mod( 'lbmn_typography_h6_font', LBMN_TYPOGRAPHY_H6_FONT_DEFAULT ) );
	$typography_h6_font         = str_replace( '+', ' ', $typography_h6_font['font_family'] );
	$typography_h6_fontsize     = get_theme_mod( 'lbmn_typography_h6_fontsize', LBMN_TYPOGRAPHY_H6_FONTSIZE_DEFAULT );
	$typography_h6_fontweight   = get_theme_mod( 'lbmn_typography_h6_fontweight', LBMN_TYPOGRAPHY_H6_FONTWEIGHT_DEFAULT );
	$typography_h6_lineheight   = get_theme_mod( 'lbmn_typography_h6_lineheight', LBMN_TYPOGRAPHY_H6_LINEHEIGHT_DEFAULT );
	$typography_h6_marginbottom = get_theme_mod( 'lbmn_typography_h6_marginbottom', LBMN_TYPOGRAPHY_H6_MARGINBOTTOM_DEFAULT );
	$typography_h6_color        = get_theme_mod( 'lbmn_typography_h6_color', LBMN_TYPOGRAPHY_H6_COLOR_DEFAULT );

	if ( $gutenberg ) {
		$styles .= 'div.editor-styles-wrapper h6 {';
	} else {
		$styles .= 'h6 {';
	}
	$styles .= '
		font-family: ' . wp_kses_data( $typography_h6_font ) . ';
		font-size: ' . esc_attr( $typography_h6_fontsize ) . 'px;
		line-height: ' . esc_attr( $typography_h6_lineheight ) . 'px;
		font-weight: ' . esc_attr( $typography_h6_fontweight ) . ';
		margin-bottom: ' . esc_attr( $typography_h6_marginbottom ) . 'px;
		color: ' . esc_attr( $typography_h6_color ) . ';
	}';

	/**
	 * ----------------------------------------------------------------------
	 * Call to action panel
	 */
	$calltoaction_height         = intval( str_replace( 'px', '', get_theme_mod( 'lbmn_calltoaction_height', LBMN_CALLTOACTION_HEIGHT_DEFAULT ) ) );
	$calltoaction_bgcolor        = get_theme_mod( 'lbmn_calltoaction_backgroundcolor', LBMN_CALLTOACTION_BACKGROUNDCOLOR_DEFAULT );
	$calltoaction_txtcolor       = get_theme_mod( 'lbmn_calltoaction_textcolor', LBMN_CALLTOACTION_TXTCOLOR_DEFAULT );
	$calltoaction_bgcolor_hover  = get_theme_mod( 'lbmn_calltoaction_backgroundcolor_hover', LBMN_CALLTOACTION_BACKGROUNDCOLOR_HOVER_DEFAULT );
	$calltoaction_txtcolor_hover = get_theme_mod( 'lbmn_calltoaction_textcolor_hover', LBMN_CALLTOACTION_TXTCOLOR_HOVER_DEFAULT );

	$calltoaction_fontfamily = lbmn_output_css_webfont( get_theme_mod( 'lbmn_calltoaction_font', LBMN_CALLTOACTION_FONT_DEFAULT ) );
	$calltoaction_fontfamily = str_replace( '+', ' ', $calltoaction_fontfamily['font_family'] );
	$calltoaction_fontsize   = get_theme_mod( 'lbmn_calltoaction_fontsize', LBMN_CALLTOACTION_FONTSIZE_DEFAULT );
	$calltoaction_fontweight = get_theme_mod( 'lbmn_calltoaction_fontweight', LBMN_CALLTOACTION_FONTWEIGHT_DEFAULT );

	$styles .= '
	.calltoaction-area {
		background-color: ' . esc_attr( $calltoaction_bgcolor ) . ';
		height: ' . esc_attr( $calltoaction_height ) . 'px;
		line-height: ' . esc_attr( $calltoaction_height ) . 'px;
	}';

	$styles .= '.calltoaction-area, .calltoaction-area * {color: ' . esc_attr( $calltoaction_txtcolor ) . ';}';

	$styles .= '
	.calltoaction-area:hover {
		background-color: ' . esc_attr( $calltoaction_bgcolor_hover ) . ';
	}
	.calltoaction-area:hover, .calltoaction-area:hover * { color: ' . esc_attr( $calltoaction_txtcolor_hover ) . '; }';

	// Call to action area custom fonts.
	$styles .= '
	.calltoaction-area__content {
		font-family:' . wp_kses_data( $calltoaction_fontfamily) . ';
		font-weight:' . esc_attr( $calltoaction_fontweight) . ';
		font-size:' . esc_attr( $calltoaction_fontsize) . 'px;
	}';

	/**
	 * ----------------------------------------------------------------------
	 * Form Elements
	 */
	// Form normal.
	$styles .= '
	input[type="text"], input[type="password"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="week"], input[type="email"], input[type="number"], input[type="search"], input[type="tel"], input[type="time"], input[type="url"], textarea {
		background:' . esc_attr( $content_background ) . ';
	}';

	/**
	 * ----------------------------------------------------------------------
	 * Minimize generated styles
	 */
	// Remove space after colons.
	$styles = str_replace( ': ', ':', $styles );
	// Remove whitespace.
	$styles = str_replace( array( "\r\n", "\r", "\n", "\t", '  ', '   ', '    ' ), '', $styles );

	return $styles;
}

/**
 * Set cache for 24 hours
 */
function lbmn_customized_css_cache_escaped() {
	$data = get_transient( 'lbmn_customized_css' );
	// $css = '';

	if ( false === $data ) {
		$data = lbmn_customized_css();
		set_transient( 'lbmn_customized_css', $data, 3600 * 24 );
	}

	/*
	⚠️ See: https://github.com/WordPress/WordPress/blob/d2ccaacedfefa87c489a832b8e2b90a0a83b6be8/wp-includes/theme.php#L1704
	⚠️ See link above. WordPress team use the same approach.
	Also see second paragraph on this page: https://codex.wordpress.org/Function_Reference/wp_add_inline_style
	 */
	return strip_tags( $data );  // ⚠️ Note that esc_html() cannot be used here.
}

/**
 * Reset cache when in customizer
 */
function lbmn_customized_css_cache_reset() {
	delete_transient( 'lbmn_customized_css' );
}

add_action( 'customize_preview_init', 'lbmn_customized_css_cache_reset' );
