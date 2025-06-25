<?php
/**
 * Functions called on theme initialization
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * – Enqueue scripts and styles for the front-end
 * – Enqueue scripts and styles to load in WP admin area
 * – Register off-canvas mobile menu widgetized area
 * – Set the content width based on the theme's design
 * – Change default image compression value
 * – Clean WordPress Admin Bar from unwanted premium plugin links
 * – Disable the emoji's
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
 * -----------------------------------------------------------------------------
 * Enqueue scripts and styles
 */

function lbmn_scripts() {
	$theme_dir = get_template_directory_uri();
	// JavaScript files output (the ones we don't minify).
	wp_register_script(
		'lbmn-modernizr',
		$theme_dir . '/javascripts/custom.modernizr.js',
		false,
		filemtime( get_template_directory() . '/javascripts/custom.modernizr.js' ),
		true
	);
	wp_enqueue_script( 'lbmn-modernizr' );

	wp_enqueue_script(
		'jquery-formalize',
		$theme_dir . '/javascripts/jquery.formalize.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/javascripts/jquery.formalize.js' ),
		true
	);

	wp_enqueue_script(
		'jquery-cookie',
		$theme_dir . '/javascripts/jquery.cookie.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/javascripts/jquery.cookie.js' ),
		true
	);

	wp_enqueue_script(
		'jquery-fitvids',
		$theme_dir . '/javascripts/jquery.fitvids.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/javascripts/jquery.fitvids.js' ),
		true
	);

	$theme_js_dependences = array( 'jquery', 'jquery-formalize', 'jquery-cookie', 'jquery-fitvids' );

	if ( lbmn_updated_from_first_generation() ) {
		// If Mega Main Menu plugin is active it's code need to be loaded befor our theme js
		if ( class_exists( 'mega_main_init' ) ) {
			$theme_js_dependences[] = 'mmm_menu_functions';
		}
	}

	wp_enqueue_script(
		'lbmn-custom-js',
		$theme_dir . '/javascripts/scripts.js',
		$theme_js_dependences,
		filemtime( get_template_directory() . '/javascripts/scripts.js' ),
		true
	);

	// Send data Off Canvas Mobile Menu to JS.
	$customizer_mobile_menu['mobile_menu'] = get_theme_mod( 'lbmn_advanced_off_canvas_mobile_menu', 1 );
	wp_localize_script( 'lbmn-custom-js', 'customizerOffCanvasMobileMenu', $customizer_mobile_menu );

	// Theme main css style.
	wp_enqueue_style(
		'lbmn-style',
		get_stylesheet_uri(),
		false,
		filemtime( get_template_directory() . '/style.css' )
	);
	wp_add_inline_style( 'lbmn-style', lbmn_preloader_styles_escaped() ); // Page preloader.
	wp_add_inline_style( 'lbmn-style', lbmn_customized_css_cache_escaped() ); // Customizer settings.

	// fixed issue: https://github.com/BlueAstralOrg/SEOWP/issues/171
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' ); // Required by the theme check!
	}

	/**
	 * ----------------------------------------------------------------------
	 * Special styles used when not all required plugins installed
	 */

	if ( ! defined( 'DS_LIVE_COMPOSER_URL' ) || ! get_option( LBMN_THEME_NAME . '_basic_config_done' ) ) {
		wp_enqueue_style(
			'lbmn-livecomposer-alternative-style',
			$theme_dir . '/design/nopluginscss/nolivecomposeractive.css',
			false,
			filemtime( get_template_directory() . '/design/nopluginscss/nolivecomposeractive.css' )
		);
	}

	if ( ! class_exists( 'mega_main_init' ) || ! get_option( LBMN_THEME_NAME . '_basic_config_done' ) ) {
		wp_enqueue_style(
			'lbmn-megamainmenu-alternative-style',
			$theme_dir . '/design/nopluginscss/nomegamenuactive.css',
			false,
			filemtime( get_template_directory() . '/design/nopluginscss/nomegamenuactive.css' )
		);
	}

	$my_default_lang = apply_filters( 'wpml_default_language', null );
	$my_current_lang = apply_filters( 'wpml_current_language', null );

	if ( $my_default_lang != $my_current_lang ) {
		$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

		if ( ! empty( $languages ) ) {
			foreach ( $languages as $l ) {
				$my_default_lang = apply_filters( 'wpml_default_language', null );

				if ( $my_default_lang != $l['language_code'] ) {
					$lang = $l['language_code'];

					if ( $my_current_lang == $lang ) {
						lbmn_google_fonts( $lang );
					}
				}
			}
		}
	} else {
		lbmn_google_fonts();
	}
}
add_action( 'wp_enqueue_scripts', 'lbmn_scripts', 100, 1 ); // dflt prrty is 20


/**
 * Enqueue block editor JavaScript and CSS
 */
function lbmn_editor_scripts() {
	lbmn_google_fonts();
}
// Hook scripts function into block editor hook
add_action( 'enqueue_block_editor_assets', 'lbmn_editor_scripts' );

/**
 * Enqueue Customizer settings into the block editor.
 */
function lbmn_editor_customizer_styles() {
	// Register Customizer styles within the editor to use for inline additions.
	wp_register_style(
		'seowp-editor-customizer-styles',
		false,
		SEOWP_THEME_VER,
		'all'
	);
	// Enqueue the Customizer style.
	wp_enqueue_style( 'seowp-editor-customizer-styles' );
	// Add custom colors to the editor.
	wp_add_inline_style( 'seowp-editor-customizer-styles', lbmn_customized_css( true ) );
}
add_action( 'enqueue_block_editor_assets', 'lbmn_editor_customizer_styles' );

function lbmn_gutenberg_styles() {
	// Gutenberg styles. Both front-end and back-end.
	wp_enqueue_style(
		'lbmn-gutenberg',
		get_template_directory_uri() . '/gutenberg.css',
		false,
		filemtime( get_template_directory() . '/gutenberg.css' )
	);
}
add_action( 'enqueue_block_assets', 'lbmn_gutenberg_styles' );


/**
 * ----------------------------------------------------------------------
 * Special styles for page preloader to be printent in <head> to make sure
 * it shows properly before any other content
 */
function lbmn_preloader_styles_escaped() {
	$preloader_css = '';
	$path_to_preloader_image = get_template_directory_uri() . '/images/preloader.gif';

	/**
	 * z-index: 1000 because we have a problem with module 'Navigation' ( modules.css 1962 and 1981 )
	 */
	$preloader_css .= '
			.pseudo-preloader .global-container { z-index: 100; position: relative; }
			.pseudo-preloader .global-wrapper:before {
				position: absolute; content: ""; left: 0; top: 0; width: 100%; height: 100%;
				position: fixed; height: 100vh;
				-webkit-transition: all 0.3s;
				-webkit-transition-delay: 0.2s;
				-moz-transition: all 0.3s 0.2s;
				-o-transition: all 0.3s 0.2s;
				transition: all 0.3s 0.2s;
				z-index: 999999; background: #fff; }

			.pseudo-preloader .global-wrapper:after {
				width: 80px;
				height: 80px;
				content: "";';
	$preloader_css .= '		background: transparent url("' . esc_url( $path_to_preloader_image ) . '") no-repeat;';
	$preloader_css .= '		background-size: 80px 80px;
				position: fixed; display: block; left: 50%; top: 50vh; margin-left: -40px; z-index: 1000000;

				-webkit-transition: all 0.4s;
				-webkit-transition-delay: 0.4s;

				-moz-transition: all 0.4s 0.4s;
				-o-transition: all 0.4s 0.4s;
				transition: all 0.4s 0.4s;
			}

			html.content-loaded .global-wrapper:before,
			html.content-loaded .global-wrapper:after {
				opacity: 0; z-index: -1; color: rgba(0, 0, 0, 0);
				-webkit-transition: all 0.2s;
				-moz-transition: all 0.2s;
				-o-transition: all 0.2s;
				transition: all 0.2s; }
		';

	return $preloader_css;
}


/**
 * -----------------------------------------------------------------------------
 * Scripts to load in WP admin area
 */

function lbmn_adminscripts() {
	$theme_dir = get_template_directory_uri();

	// Some admin elements improvements.
	wp_enqueue_style(
		'lbmn-adminstyles',
		$theme_dir . '/adminstyle.css',
		array(),
		filemtime( get_template_directory() . '/adminstyle.css' )
	);

	// Scripts used here and there in the WP admin area.
	wp_enqueue_script(
		'lbmn-wpadmin-js',
		$theme_dir . '/javascripts/wpadmin-scripts.js',
		array(
			'jquery',
			'jquery-effects-core',
			'jquery-effects-bounce',
		),
		filemtime( get_template_directory() . '/javascripts/wpadmin-scripts.js' ),
		true
	);

	wp_enqueue_script(
		'lbmn-wpadmin-mmm-js',
		$theme_dir . '/inc/plugins-integration/megamainmenu/megamainmenu-wpadmin.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/inc/plugins-integration/megamainmenu/megamainmenu-wpadmin.js' ),
		true
	);
}

add_action( 'admin_enqueue_scripts', 'lbmn_adminscripts' );

/**
 * ----------------------------------------------------------------------
 * Register off-canvas mobile menu widgetized area
 */

function lbmn_widgets_init() {
	register_sidebar( array(
		'name'          => esc_attr__( 'Mobile: Off-canvas Panel', 'seowp' ),
		'id'            => 'mobile-offcanvas',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="widget-title"><span>',
		'after_title'   => '</span></h3>',
	) );

	// Footer Widgets for disabled Live Composer mode.
	if ( ! LBMN_THEME_CONFUGRATED ) {
		register_sidebar( array(
			'name'          => esc_attr__( 'Footer Widgets', 'seowp' ),
			'id'            => 'footer-widgets',
			'before_widget' => '<aside id="%1$s" class="widget %2$s">',
			'after_widget'  => '</aside>',
			'before_title'  => '<h3 class="widget-title"><span>',
			'after_title'   => '</span></h3>',
		) );
	}
}
add_action( 'widgets_init', 'lbmn_widgets_init' );

/**
 * -----------------------------------------------------------------------------
 * Change default image compression value
 * Everything below 95% looks terribly bad
 */
add_filter( 'jpeg_quality', 'lbmn_change_image_quality' );
function lbmn_change_image_quality( $arg ) {
	return 95;
}

/**
 * ----------------------------------------------------------------------
 * Add support for SVG file uploads
 * http://www.trickspanda.com/2014/01/add-svg-upload-support-wordpress/
 */
add_filter( 'upload_mimes', 'lbmn_mime_types' );
function lbmn_mime_types( $mimes ) {
	$mimes['svg'] = 'image/svg+xml';

	return $mimes;
}

/**
 * ----------------------------------------------------------------------
 * Clean WordPress Admin Bar from unwanted premium plugin links
 */
function lbmn_admin_bar() {
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu( 'essb' ); // Easy Social Share buttons.

	if ( lbmn_updated_from_first_generation() ) {
		$wp_admin_bar->remove_menu( 'mega_main_menu_options' ); // Mega Main Menu.
	}
}

add_action( 'wp_before_admin_bar_render', 'lbmn_admin_bar' );

/**
 * ----------------------------------------------------------------------
 * Timeout for the page preloader
 *
 * Disable the Page Preloader after 5 sec to make sure page shows
 * even with JS errors
 */

function lbmn_hide_preloader() {
	?>
	<script type="text/javascript">
		function lbmn_passedFiveSeconds() {
			var el_html = document.getElementsByTagName( 'html' );
			if ( (typeof el_html.className !== 'undefined') && (el_html.className.indexOf( 'content-loaded' ) === -1) ) {
				el_html.className += ' content-loaded';
			}
		}
		setTimeout( lbmn_passedFiveSeconds, 5000 );
	</script>
	<?php
}

add_action( 'wp_head', 'lbmn_hide_preloader', 99 );

/**
 * --------------------------------------------------------------------------
 * Google Web Fonts
 * Compose links to the Google Fonts used to be included in the <head>
 */

if ( ! function_exists( 'lbmn_google_fonts' ) ) {
	function lbmn_google_fonts( $wpml_lang = '' ) {
		wp_enqueue_style(
			'lbmn-google-fonts' . $wpml_lang,
			esc_url( lbmn_google_fonts_url( $wpml_lang ) ),
			false,
			SEOWP_THEME_VER
		);
	}
} // End if().


if ( ! function_exists( 'lbmn_google_fonts_url' ) ) {
	function lbmn_google_fonts_url( $wpml_lang = '' ) {
		$output = '';

		if ( '' !== $wpml_lang ) {
			$wpml_lang = '_' . $wpml_lang;
		}

		$googlefonts_toload          = array();
		$googlefonts_weights         = lbmn_get_goolefonts();
		$googlefonts_toload_prepared = '';
		$first_font                  = true;

		for ( $i = 1; $i < 5; $i++ ) {
			// If use google font check box is selected.
			if ( get_theme_mod( 'lbmn_font_preset_usegooglefont_' . $i . $wpml_lang, 1 ) ) {
				// If GoogleFont name is set use it.
				if ( get_theme_mod( 'lbmn_font_preset_googlefont_' . $i . $wpml_lang, '' ) ) {
					$prefix = '';
					if ( ! $first_font ) {
						$prefix = '|';
					}

					$googlefonts_toload[ $i ] = $prefix . get_theme_mod( 'lbmn_font_preset_googlefont_' . $i . $wpml_lang, '' );

					// If no GoogleFont name set use the default one for this preset
				} else {
					$prefix = '';
					if ( ! $first_font ) {
						$prefix = '|';
					}

					$googlefonts_toload[ $i ] = $prefix . get_theme_mod( 'lbmn_font_preset_googlefont_' . $i . $wpml_lang, constant( 'LBMN_FONT_PRESET_GOOGLEFONT_' . $i . '_DEFAULT' ) );
				}

				// If font set, attach it's weights
				if ( $googlefonts_toload[ $i ] ) {

					str_replace( ' ', '+', $googlefonts_toload[ $i ] );

					$first_weight = true;
					foreach ( $googlefonts_weights[ $googlefonts_toload[ $i ] ] as $weight ) {

						// filter our italic fonts for speed optimization
						if ( ! stristr( $weight, 'italic' ) ) {

							if ( $first_weight ) {
								$googlefonts_toload[ $i ] .= ':';
							}

							$googlefonts_toload[ $i ] .= $weight . ',';
						}

						$first_weight = false;
					}

					if ( substr( $googlefonts_toload[ $i ], -1 ) == ',' ) {

						$googlefonts_toload[ $i ] = substr_replace( $googlefonts_toload[ $i ], '', -1 );
						// remove last character ',' in a string

					}
				}
			} // End if().
		} // End if().

		foreach ( $googlefonts_toload as $google_font ) {
			if ( '' !== $google_font ) {
				$googlefonts_toload_prepared .= $google_font . '|';
			}
		}

		if ( $googlefonts_toload_prepared ) {
			$googlefonts_toload_prepared = substr_replace( $googlefonts_toload_prepared, '', -1 );
			// remove last character '|' in a string
			$googlefonts_url = '//fonts.googleapis.com/css?family=' . $googlefonts_toload_prepared;
			$googlefonts_ext = '&subset=latin';

			if ( get_theme_mod( 'lbmn_font_characterset_latinextended', 0 ) ) {
				$googlefonts_ext .= ',latin-ext';
			}

			if ( get_theme_mod( 'lbmn_font_characterset_cyrillic', 0 ) ) {
				$googlefonts_ext .= ',cyrillic';
			}

			if ( get_theme_mod( 'lbmn_font_characterset_cyrillicextended', 0 ) ) {
				$googlefonts_ext .= ',cyrillic-ext';
			}

			if ( get_theme_mod( 'lbmn_font_characterset_greek', 0 ) ) {
				$googlefonts_ext .= ',greek';
			}

			if ( get_theme_mod( 'lbmn_font_characterset_greekextended', 0 ) ) {
				$googlefonts_ext .= ',greek-ext';
			}

			if ( get_theme_mod( 'lbmn_font_characterset_vietnamese', 0 ) ) {
				$googlefonts_ext .= ',vietnamese';
			}

			$output = $googlefonts_url . $googlefonts_ext;

		}

		return $output;

	}
} // End if().
