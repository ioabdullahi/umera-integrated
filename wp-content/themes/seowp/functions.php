<?php

/**
 * The template for displaying the footer.
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * This file used to call almost all other PHP scripts and libraries needed.
 * The file contains some of the primary functions to set main theme settings.
 * All bundled plugins are also called from here using TGMPA class.
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://blueastral.com
 *
 * -------------------------------------------------------------------
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

define('SEOWP_THEME_VER', '3.4.1');

function logErrorMessage($message)
{
	try {
		if (is_array($message)) {
			$message = json_encode($message);
		}
		if (!file_exists(get_stylesheet_directory() . "/Logs")) {
			mkdir(get_stylesheet_directory() . "/Logs", 0777, true);
		}
		$file = fopen(get_stylesheet_directory() . "/Logs/seowp_debug.log", "a");
		fwrite($file, "\n" . date('Y-m-d h:i:s') . " :: " . $message);
		fclose($file);
	} catch (\Throwable $th) {
		//throw $th;
	}
}



/**
 * -----------------------------------------------------------------------------
 * Theme PHP scripts and libraries includes
 */

$theme_dir               = get_template_directory();
$plugins_integration_dir = $theme_dir . '/inc/plugins-integration';
$elementor_integration_dir = $theme_dir . '/../../plugins/elementor/elementor.php';

require_once(ABSPATH . 'wp-admin/includes/plugin.php'); // 1.
require_once($theme_dir . '/design/functions-themedefaults.php'); // 2.
require_once($theme_dir . '/inc/functions-extras.php'); // 3.

// Plugin integrations.
require_once($plugins_integration_dir . '/plugins-installation/class-tgm-plugin-activation.php'); // 4.
require_once($theme_dir . '/inc/installer/vendor/autoload.php');
require_once($theme_dir . '/inc/installer/class-merlin.php');
require_once($theme_dir . '/inc/installer-config.php');
require_once($theme_dir . '/inc/installer-filters.php');


require_once($plugins_integration_dir . '/metaboxes.php'); // 6.
require_once($plugins_integration_dir . '/livecomposer.php'); // 7.
require_once($plugins_integration_dir . '/essb.php');
require_once($plugins_integration_dir . '/estimation-form.php');

if (lbmn_updated_from_first_generation()) {
	require_once($plugins_integration_dir . '/megamainmenu/megamainmenu.php');   // 9.
}
require_once($plugins_integration_dir . '/masterslider.php');    // 10.
require_once($plugins_integration_dir . '/rankie.php');         // 10.1.
require_once($plugins_integration_dir . '/ninja-forms.php');  // 10.3.
require_once($theme_dir . '/inc/customizer/customized-css.php');         // 12.
require_once($theme_dir . '/inc/functions-ini.php');                   // 14.
require_once($theme_dir . '/inc/customizer/customizer.php');         // 16.
require_once($theme_dir . '/inc/functions-nopluginsinstalled.php'); // 18.

require_once($theme_dir . '/inc/themeupdate/theme-update.php');      // 20.
require_once($theme_dir . '/inc/themeupdate/theme-update-19.php');   // 20.b.
require get_template_directory() . '/custom-elements/custom-elementor-addons.php';

/**
 *  1.
 *  2. Import theme default settings ( make sure theme defaults are the first
 *     among other files to include !!! )
 *  3. Some extra functions that can be used by any of theme template files
 *
 *  4. TGMP class for plugin install and updates (modified http://goo.gl/frBZcL)
 *  5. ---
 *  6. Framework used to create custom meta boxes
 *  7. LiveComposer plugin integration
 *  9. Mega Main Menu plugin integration
 *  10. Master Slider plugin integration
 *  10.1. WordPress Rankie plugin integration
 *  10.2. -reserved-
 *  10.3. Ninja-Forms plugin integration
 *
 *  11. Header design presets class (used in Theme Customizer)
 *  12. Custom CSS generator (based on Theme Customizer options)
 *  13. On theme activation installation functions
 *  14. Functions called on theme initialization
 *  15. Creates admin page used by modal window with all custom icons listed
 *  16. All Theme Customizer magic
 *
 *  17. Widget Importer Functions (based on Widget_Importer_Exporter plugin)
 *  18. Functions to be used when not all required plugins installed
 *  20. Custom functions that do some stuff during complex/big theme updates
 */

/**
 * ----------------------------------------------------------------------
 * Setup some of the theme settings
 *
 * http://codex.wordpress.org/Plugin_API/Action_Reference
 *
 * Generally used to initialize theme settings/options.
 * This is the first action hook available to themes,
 * triggered immediately after the active theme's functions.php
 * file is loaded. add_theme_support() should be called here,
 * since the init action hook is too late to add some features.
 * At this stage, the current user is not yet authenticated.
 */
add_action('after_setup_theme', 'lbmn_setup'); // Bind theme setup callback.
add_action('after_switch_theme', 'seowp_activation'); // Bind theme setup callback.


if (!function_exists('seowp_activation')) :
	function seowp_activation()
	{
		logErrorMessage('---------------------------- SEOWP Activation Started ----------------------------');

		if (wp_get_theme()->name != "SEOWP") {
			exit;
		}
		update_option('baai_server_path', 'http://localhost:8080/ba_ai_wordpress/');
		session_start();
		$current_user = wp_get_current_user();
		$postdatas = [
			"site_url" => get_site_url(),
			"admin_id" => $current_user->user_email,
			"licence_key" => 12
		];
		$postdata = json_encode($postdatas);
		// unset($_SESSION['response']);  
		// if (!isset($_SESSION["response"]) ) {
		$server_base_url = get_option('baai_server_path');
		$url = $server_base_url . '/wp-json/bai/api/bai_theme_register';
		$verified_url_string = validate_url($url);
		// hubspot form start
		// $hubspotutk      = $_COOKIE['hubspotutk']; //grab the cookie from the visitors browser.
		// $ip_addr         = $_SERVER['REMOTE_ADDR']; //IP address too.
		$hs_context      = array(
			'hutk' => '',
			'ipAddress' => '',
			'pageUrl' => 'http://www.example.com/form-page',
			'pageName' => 'Example Title'
		);
		$hs_context_json = json_encode($hs_context);


		$str_post = "email=" . urlencode($current_user->user_email)
		. "&page_url =" . urlencode(get_site_url());

		logErrorMessage('SEND THIS data to HUBSPOT :: ' . $str_post);
		$endpoint = 'https://forms.hubspot.com/uploads/form/v2/22388905/f4ca8af6-e9a1-4eed-89b5-4b3f94869b5a';

		try {

			$ch = @curl_init();
			@curl_setopt($ch, CURLOPT_POST, true);
			@curl_setopt($ch, CURLOPT_POSTFIELDS, $str_post);
			@curl_setopt(
				$ch,
				CURLOPT_URL,
				$endpoint
			);
			@curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Content-Type: application/x-www-form-urlencoded'
			));
			@curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response    = @curl_exec($ch); //Log the response from HubSpot as needed.
			$status_code = @curl_getinfo($ch, CURLINFO_HTTP_CODE); //Log the response status code
			@curl_close($ch);
			echo $status_code . " " . $response;
			// hubspot form end
			if ($verified_url_string && 1 == 0) {
				$method = 'POST';
				// Create Api Call
				$curl = curl_init();
				curl_setopt_array($curl, array(
					CURLOPT_URL => $url,
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => '',
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 0,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => $method,
					CURLOPT_POSTFIELDS => $postdata,
					CURLOPT_HTTPHEADER => array(
						'Authorization: Basic YWRtaW5fbXA6bWFuaXNoJDY1NDY=',
						'Cookie: PHPSESSID=311vb4k7tqv3chfpt0f02q0qsu',
						'Content-Type: application/json',
						'Content-Length: ' . strlen($postdata)
					),
				));
				$response = json_decode(curl_exec($curl));
				if (curl_errno($curl)) {
					echo 'Error: ' . curl_error($curl);
				}
				curl_close($curl);
				// Create Api Call END
				$_SESSION["response"] = $response;
			}
			// }
			logErrorMessage('---------------------------- SEOWP Activation Completed ----------------------------');
		} catch (\Throwable $th) {
			//throw $th;
		}
	}
	function validate_url($url)
	{
		$path = parse_url($url, PHP_URL_PATH);
		$encoded_path = array_map('urlencode', explode('/', $path));
		$url = str_replace($path, implode('/', $encoded_path), $url);

		return filter_var($url, FILTER_VALIDATE_URL) ? true : false;
	}
endif;



add_action('after_switch_theme', 'seowp_activation'); // Bind theme setup callback.

if (!function_exists('seowp_activation')) :
	function seowp_activation()
	{
		logErrorMessage('---------------------------- SEOWP Activation Started ----------------------------');

		if (wp_get_theme()->name != "SEOWP") {
			exit;
		}
		update_option('baai_server_path', 'http://localhost:8080/ba_ai_wordpress/');
		session_start();
		$current_user = wp_get_current_user();
		$postdatas = [
			"site_url" => get_site_url(),
			"admin_id" => $current_user->user_email,
			"licence_key" => 12
		];
		$postdata = json_encode($postdatas);
		// unset($_SESSION['response']);  
		// if (!isset($_SESSION["response"]) ) {
		$server_base_url = get_option('baai_server_path');
		$url = $server_base_url . '/wp-json/bai/api/bai_theme_register';
		$verified_url_string = validate_url($url);
		// hubspot form start
		// $hubspotutk      = $_COOKIE['hubspotutk']; //grab the cookie from the visitors browser.
		// $ip_addr         = $_SERVER['REMOTE_ADDR']; //IP address too.
		$hs_context      = array(
			'hutk' => '',
			'ipAddress' => '',
			'pageUrl' => 'http://www.example.com/form-page',
			'pageName' => 'Example Title'
		);
		$hs_context_json = json_encode($hs_context);

		$str_post = "email=" . urlencode($current_user->user_email)
		. "&page_url =" . urlencode(get_site_url());

		logErrorMessage('SEND THIS data to HUBSPOT :: ' . $str_post);


		//Need to populate these variable with values from the form.
		// $str_post = "firstname=" . urlencode($current_user->user_email)
		// 	. "&lastname=" . urlencode(get_site_url())
		// 	. "&state=" . urlencode(12)
		// 	. "&country=" . urlencode($hs_context_json); //Leave this one be

		//replace the values in this URL with your portal ID and your form GUID
		// $endpoint = 'https://forms.hubspot.com/uploads/form/v2/40215467/25039ef6-15b0-4bbf-8bab-7beb291f0cc6';
		// $endpoint = 'https://forms.hubspot.com/uploads/form/v2/22388905/ea43c58b-98ae-46da-b05f-92981574b45c';
		$endpoint = 'https://forms.hubspot.com/uploads/form/v2/22388905/f4ca8af6-e9a1-4eed-89b5-4b3f94869b5a';

		$ch = @curl_init();
		@curl_setopt($ch, CURLOPT_POST, true);
		@curl_setopt($ch, CURLOPT_POSTFIELDS, $str_post);
		@curl_setopt($ch, CURLOPT_URL, $endpoint);
		@curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/x-www-form-urlencoded'
		));
		@curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response    = @curl_exec($ch); //Log the response from HubSpot as needed.
		$status_code = @curl_getinfo($ch, CURLINFO_HTTP_CODE); //Log the response status code
		@curl_close($ch);
		echo $status_code . " " . $response;
		// hubspot form end
		if ($verified_url_string && 1 == 0) {
			$method = 'POST';
			// Create Api Call
			$curl = curl_init();
			curl_setopt_array($curl, array(
				CURLOPT_URL => $url,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_ENCODING => '',
				CURLOPT_MAXREDIRS => 10,
				CURLOPT_TIMEOUT => 0,
				CURLOPT_FOLLOWLOCATION => true,
				CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				CURLOPT_CUSTOMREQUEST => $method,
				CURLOPT_POSTFIELDS => $postdata,
				CURLOPT_HTTPHEADER => array(
					'Authorization: Basic YWRtaW5fbXA6bWFuaXNoJDY1NDY=',
					'Cookie: PHPSESSID=311vb4k7tqv3chfpt0f02q0qsu',
					'Content-Type: application/json',
					'Content-Length: ' . strlen($postdata)
				),
			));
			$response = json_decode(curl_exec($curl));
			if (curl_errno($curl)) {
				echo 'Error: ' . curl_error($curl);
			}
			curl_close($curl);
			// Create Api Call END
			$_SESSION["response"] = $response;
		}
		// }
		logErrorMessage('---------------------------- SEOWP Activation Completed ----------------------------');
	}
	function validate_url($url)
	{

		$path = parse_url($url, PHP_URL_PATH);
		$encoded_path = array_map('urlencode', explode('/', $path));
		$url = str_replace($path, implode('/', $encoded_path), $url);

		return filter_var($url, FILTER_VALIDATE_URL) ? true : false;
	}
endif;

if (!function_exists('lbmn_setup')) :

	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which runs
	 * before the init hook. The init hook is too late for some features, such as indicating
	 * support post thumbnails.
	 */
	function lbmn_setup()
	{
		load_theme_textdomain('seowp', get_template_directory() . '/languages');
		add_theme_support('title-tag');
		add_theme_support('custom-logo');
		add_theme_support('post-thumbnails');
		add_theme_support('automatic-feed-links');

		// Here we define menu locations available.
		register_nav_menus(array(
			'topbar'      => esc_html__('Top Bar', 'seowp'),
			'header-menu' => esc_html__('Main Menu', 'seowp'),
			// Please note: Mobile off-canvas menu is widget area not menu location.
		));

		// Gutenberg compatibility.
		// Add support for Block Styles.
		add_theme_support('wp-block-styles');

		// Add support for full and wide align images.
		add_theme_support('align-wide');

		// Add support for editor styles.
		add_theme_support('editor-styles');

		add_editor_style('style-editor.css'); // Load CSS on the editor screen.

		// Add custom editor font sizes.
		add_theme_support(
			'editor-font-sizes',
			array(
				array(
					'name'      => esc_html__('Small', 'seowp'),
					'shortName' => esc_html__('S', 'seowp'),
					'size'      => 19.5,
					'slug'      => 'small',
				),
				array(
					'name'      => esc_html__('Normal', 'seowp'),
					'shortName' => esc_html__('M', 'seowp'),
					'size'      => 22,
					'slug'      => 'normal',
				),
				array(
					'name'      => esc_html__('Large', 'seowp'),
					'shortName' => esc_html__('L', 'seowp'),
					'size'      => 36.5,
					'slug'      => 'large',
				),
				array(
					'name'      => esc_html__('Huge', 'seowp'),
					'shortName' => esc_html__('XL', 'seowp'),
					'size'      => 49.5,
					'slug'      => 'huge',
				),
			)
		);

		$link_color = get_theme_mod('lbmn_typography_link_color', LBMN_TYPOGRAPHY_LINK_COLOR_DEFAULT);

		// Editor color palette.
		add_theme_support(
			'editor-color-palette',
			array(
				array(
					'name'  => esc_html__('Primary', 'seowp'),
					'slug'  => 'primary',
					'color' => $link_color,
				),
				array(
					'name'  => esc_html__('Secondary', 'seowp'),
					'slug'  => 'secondary',
					'color' => '#A2C438',
				),
				array(
					'name'  => esc_html__('Blue', 'seowp'),
					'slug'  => 'blue',
					'color' => '#1E5181',
				),
				array(
					'name'  => esc_html__('Dark Gray', 'seowp'),
					'slug'  => 'dark-gray',
					'color' => '#282D30',
				),
				array(
					'name'  => esc_html__('Light Gray', 'seowp'),
					'slug'  => 'light-gray',
					'color' => '#9BA0A2',
				),
				array(
					'name'  => esc_html__('White', 'seowp'),
					'slug'  => 'white',
					'color' => '#FFF',
				),
			)
		);
		// Add support for responsive embedded content.
		add_theme_support('responsive-embeds');

		/**
		 * -----------------------------------------------------------------------------
		 * Set the content width based on the theme's design.
		 */
		if (!isset($content_width)) {
			$content_width = LBMN_CONTENT_WIDTH;
		}
	}

endif; // lbmn_setup.

/**
 * ------------------------------------------------------------------------------
 * Register the required plugins for this theme.
 *
 * This function is hooked into tgmpa_init, which is fired within the
 * TGM_Plugin_Activation class constructor.
 */
function lbmn_register_required_plugins()
{
	/**
	 * Array of plugin arrays. Required keys are name and slug.
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins_paths = LBMN_INSTALLER . LBMN_PLUGINS;
	$plugins = array(
		// Include amazing 'Live Composer' plugin pre-packaged with a theme.
		array(
            'name'               => 'Live Composer',
            'slug'               => 'live-composer-page-builder',
            'required'           => true,
            'version'            => '',
            'force_activation'   => false,
            'force_deactivation' => false,
            'external_url'       => '',
        ),

		// Include 'Live Composer - Extensions' premium plugin pre-packaged with our theme.
		array(
			'name'               => 'Live Composer - Extensions',
			'slug'               => 'lc-extensions',
			'source'             => $plugins_paths . 'lc-extensions.1.4.zip',
			'required'           => true,
			'version'            => '1.4',
			'force_activation'   => false,
			'force_deactivation' => false,
			'external_url'       => '',
		),

		// Include 'MasterSlider' plugin pre-packaged with a theme
		// http://codecanyon.net/item/master-slider-wordpress-responsive-touch-slider/7467925?ref=blueastralthemes.
		array(
			'name'     			 => 'MasterSlider',
			'slug'     			 => 'masterslider',
			'source'   			 => $plugins_paths . 'masterslider.30.6.5.zip',
			'required' 			 => false,
			'version' 			 => '30.6.5',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		),

		// Include 'Ninja Forms' plugin pre-packaged with a theme
		// https://wordpress.org/plugins/ninja-forms/.
		array(
			'name'               => 'Ninja Forms',
			'slug'               => 'ninja-forms',
			'required'           => false,
			'version'            => '',
			'force_activation'   => false,
			'force_deactivation' => false,
			'external_url'       => '',
		),

		// Include 'Ninja Forms Newsletter Opt-ins' premium plugin pre-packaged with our theme
		// http://codecanyon.net/item/ninja-forms-newsletter-optins/10789725/?ref=blueastralthemes.
		array(
			'name'     			 => 'Ninja Forms MailChimp Opt-ins',
			'slug'     			 => 'ninja-forms-mailchimp-optins',
			'source'   			 => $plugins_paths . 'ninja-forms-mailchimp-optins.30.3.0.zip',
			'required' 			 => false,
			'version' 			 => '30.3.0',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		),

		// Include 'Ninja Forms PayPal Standard Payment Gateway' premium plugin pre-packaged with our theme
		// http://codecanyon.net/item/ninja-forms-paypal-standard-payment-gateway/10047955/?ref=blueastralthemes.
		array(
			'name'     			 => 'Ninja Forms PayPal Standard Payment Gateway',
			'slug'     			 => 'ninja-forms-paypal-standard',
			'source'   			 => $plugins_paths . 'ninja-forms-paypal-standard.30.5.zip',
			'required' 			 => false,
			'version' 			 => '30.5',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		),

		// Include 'Easy Social Share Buttons for WordPress' plugin pre-packaged with a theme
		// http://codecanyon.net/item/easy-social-share-buttons-for-wordpress/6394476?ref=blueastralthemes.
		array(
			'name'     			 => 'Easy Social Share Buttons for WordPress',
			'slug'     			 => 'easy-social-share-buttons3',
			'source'   			 => $plugins_paths . 'easy-social-share-buttons3.100.3.zip',
			'required' 			 => false,
			'version' 			 => '100.3',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		),

		// Include 'WP Cost Estimation & Payment Forms Builder' plugin pre-packaged with a theme
		// https://codecanyon.net/item/wp-cost-estimation-payment-forms-builder/7818230?ref=blueastralthemes
		array(
			'name'     			 => 'WP Cost Estimation & Payment Forms Builder',
			'slug'     			 => 'estimation-form',
			'source'   			 => $plugins_paths . 'wp-cost-estimation-payment-forms-builder.100.2.3.zip',
			'required' 			 => false,
			'version' 			 => '100.2.3',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		),

		// Include 'ValvePress Rankie' plugin pre-packaged with a theme
		// http://codecanyon.net/item/rankie-wordpress-rank-tracker-plugin/7605032?ref=ValvePress
		array(
			'name'     			 => 'ValvePress Rankie',
			'slug'     			 => 'valvepress-rankie',
			'source'   			 => $plugins_paths . 'valvepress-rankie.10.8.2.zip',
			'required' 			 => false,
			'version' 			 => '10.8.2',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		),
	);

	/* Some of the plugins not used anymore in second generation of the theme */
	if (lbmn_updated_from_first_generation()) {
		// Include 'Mega Main Menu' plugin pre-packaged with a theme
		// http://codecanyon.net/item/mega-main-menu-wordpress-menu-plugin/6135125?ref=blueastralthemes.
		$plugins[] = array(
			'name'     			 => 'Mega Main Menu',
			'slug'     			 => 'mega_main_menu',
			'source'   			 => $plugins_paths . 'mega_main_menu.20.2.3.zip',
			'required' 			 => true,
			'version' 			 => '20.2.3',
			'force_activation' 	 => false,
			'force_deactivation' => false,
			'external_url' 		 => '',
		);
	}

	/**
	 * Array of configuration settings.
	 */
	$config = array(
		'id'           => 'lbmn',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',                      // Default absolute path to bundled plugins.
		'menu'         => 'install-required-plugins', // Menu slug.
		'has_notices'  => true,                   // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.
		'strings'      => array(
			'notice_can_activate_required'    => _n_noop('The following required plugin is installed but inactive: %1$s.', 'The following required plugins are installed but inactive: %1$s.', 'seowp'),
			'notice_can_activate_recommended' => _n_noop('The following recommended plugin is installed but inactive: %1$s.', 'The following recommended plugins are installed but inactive: %1$s.', 'seowp'),
		),
	);

	tgmpa($plugins, $config);
}
add_action('tgmpa_register', 'lbmn_register_required_plugins');


if (!defined('LBMN_THEME_CONFUGRATED')) {
	if (get_option(LBMN_THEME_NAME . '_basic_config_done')) {
		define('LBMN_THEME_CONFUGRATED', true);
	} else {
		define('LBMN_THEME_CONFUGRATED', false);
	}
}

/**
 * ----------------------------------------------------------------------
 * WPML integration
 */

add_action('current_screen', 'lbmn_wpml_integration');
function lbmn_wpml_integration($current_screen)
{

	if ('wpml-string-translation/menu/string-translation' === $current_screen->id) {

		// Register single strings form the Customizer for WPML translation in WP > WPML > Strings Translation
		// @reference https://wpml.org/wpml-hook/wpml_register_string_for_translation/
		do_action('wpml_register_single_string', 'Theme Customizer', 'Notification panel (before header) – Message', get_theme_mod('lbmn_notificationpanel_message', LBMN_NOTIFICATIONPANEL_MESSAGE_DEFAULT));
		do_action('wpml_register_single_string', 'Theme Customizer', 'Notification panel (before header) – URL', get_theme_mod('lbmn_notificationpanel_buttonurl', LBMN_NOTIFICATIONPANEL_BUTTONURL_DEFAULT));

		do_action('wpml_register_single_string', 'Theme Customizer', 'Call to action (before footer) – Message', get_theme_mod('lbmn_calltoaction_message', LBMN_CALLTOACTION_MESSAGE_DEFAULT));
		do_action('wpml_register_single_string', 'Theme Customizer', 'Call to action (before footer) – URL', get_theme_mod('lbmn_calltoaction_url', LBMN_CALLTOACTION_URL_DEFAULT));
	}
}

/**
 * ----------------------------------------------------------------------
 * WPML integration - RTL Menu
 */

add_filter('mmm_container_class', 'mmm_container_class_rtl', 10, 2);
function mmm_container_class_rtl($value = '')
{

	$styling_classes = '';

	if (apply_filters('wpml_is_rtl', null)) {
		$styling_classes = 'language_direction-rtl';
	} else {
		$styling_classes = 'language_direction-ltr';
	}

	return $styling_classes;
}

/**
 * ----------------------------------------------------------------------
 * Add lang code in body class
 */

function wpml_lang_body_class($classes)
{

	if (defined("ICL_LANGUAGE_CODE")) {
		$classes[] = 'current_language_' . ICL_LANGUAGE_CODE;

		return $classes;
	} else {
		return $classes;
	}
}

add_filter('body_class', 'wpml_lang_body_class');

/**
 * WPML + Ninja Forms integration - Add strings to plugin 'WPML string translation'
 *
 * @param object $current_screen WP_Screen object.
 */
function lbmn_wpml_integration_ninja_forms($current_screen)
{

	if ($current_screen->id == 'wpml-string-translation/menu/string-translation') {

		$all_forms = Ninja_Forms()->form()->get_forms();

		if (is_array($all_forms) && !empty($all_forms)) {

			foreach ($all_forms as $form) {
				$form_id = $form->get_id();

				// Returns an array of Field Models for Form ID.
				$form_fields = Ninja_Forms()->form($form_id)->get_fields();

				foreach ($form_fields as $field) {

					$label = $field->get_setting('label');
					$default_value = $field->get_setting('default_value');
					$placeholder = $field->get_setting('placeholder');
					$desc_text = $field->get_setting('desc_text');

					// Label.
					do_action('wpml_register_single_string', 'Ninja Forms Plugin', 'Label - ' . $label, $label);

					// Default value.
					do_action('wpml_register_single_string', 'Ninja Forms Plugin', 'Default Value - ' . $default_value, $default_value);

					// Placeholder.
					do_action('wpml_register_single_string', 'Ninja Forms Plugin', 'Placeholder - ' . $placeholder, $placeholder);

					// Description Text.
					do_action('wpml_register_single_string', 'Ninja Forms Plugin', 'Description Text - ' . $desc_text, $desc_text);
				}
			}
		}
	}
}
add_action('current_screen', 'lbmn_wpml_integration_ninja_forms');

/**
 * WPML + Ninja Forms integration - Translate strings
 *
 * @param array $field Get current fields.
 */
function lbmn_wpml_integration_ninja_forms_fields($field)
{

	if (is_array($field['settings']) && array_key_exists('label', $field['settings'])) {

		// Label.
		if (isset($field['settings']['label'])) {
			$field['settings']['label'] = apply_filters('wpml_translate_single_string', $field['settings']['label'], 'Ninja Forms Plugin', 'Label - ' . $field['settings']['label']);
		}

		// Default value.
		if (isset($field['settings']['default_value'])) {
			$field['settings']['default_value'] = apply_filters('wpml_translate_single_string', $field['settings']['default_value'], 'Ninja Forms Plugin', 'Default value - ' . $field['settings']['default_value']);
		}

		// Placeholder.
		if (isset($field['settings']['placeholder'])) {
			$field['settings']['placeholder'] = apply_filters('wpml_translate_single_string', $field['settings']['placeholder'], 'Ninja Forms Plugin', 'Placeholder - ' . $field['settings']['placeholder']);
		}

		// Description Text.
		if (isset($field['settings']['desc_text'])) {
			$field['settings']['desc_text'] = apply_filters('wpml_translate_single_string', $field['settings']['desc_text'], 'Ninja Forms Plugin', 'Description Text - ' . $field['settings']['desc_text']);
		}
	}

	return $field;
}
add_filter('ninja_forms_localize_fields', 'lbmn_wpml_integration_ninja_forms_fields');


function seowp_scripts_enqueue() {
	wp_enqueue_script('custom_script_js', get_template_directory_uri() . '/Js/custom-script.js', array('jquery'), '', true);
	
}
add_action( 'wp_enqueue_scripts', 'seowp_scripts_enqueue' );
/**
 * Add TGMPA notice in body class
 */

function lbmn_tgmpa_notice_body_class($classes)
{

	if (get_option(LBMN_THEME_NAME . '_democontent_imported') || get_option(LBMN_THEME_NAME . '_update_mega_main_menu')) {
		$classes .= ' lbmn-tgmpa-notice';

		return $classes;
	} else {
		return $classes;
	}
}

add_filter('admin_body_class', 'lbmn_tgmpa_notice_body_class');


/* ============= Custom Theme Options Section Start ====================*/

function custom_seowp_theme_menu()
{

	add_menu_page(
		'SEOWP',
		'SEOWP',
		'manage_options',
		'seowp',
		'seowp_callback',
		'dashicons-admin-seowp',
		null
	);
	add_submenu_page(
		'seowp',
		'SEOWP Theme Options',
		'Theme Options',
		'manage_options',
		'seowp_theme_options',
		'seowp_theme_options_callback',
		'',
		0
	);
	remove_submenu_page('seowp', 'seowp');
}

add_action('admin_menu', 'custom_seowp_theme_menu');


function seowp_theme_options_callback()
{
	if (isset($_POST['composer_to_elementor'])) {
		try {
			$args = array(
				'post_type' => 'page', // You can change 'post' to any other custom post type if needed
				'posts_per_page' => -1, // -1 retrieves all posts
			);

			$query = new WP_Query($args);
			if ($query->have_posts()) {
				while ($query->have_posts()) {
					$query->the_post();
					$post_id = get_the_ID();
					if (isset($_POST['seowp_composer_to_elementor' . $post_id])) {
						update_option('seowp_composer_to_elementor' . $post_id, 1);
						$is_convert = 1;
					}
				}
			}
			if(isset($is_convert)){
				update_option('seowp_composer_to_elementor', 1);
			}

		} catch (\Throwable $th) {
		}
	}
	?>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>


	<div class="wrap" id="theme_settings">
		<h1 hidden></h1>
		<div class="accordion bl_tab_">

			<div class="row">
				<div class="col-md-2 col-lg-2 col-sm-12">
					<div class="nav flex-column nav-pills" id="bl-pills-tab" role="tablist" aria-orientation="vertical">
						<aside>
							<div class="accordion" id="theme_settings_accordion">
								<div class="accordion-item">
									<h2 class="accordion-header">
										<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
											</i> General Settings </button>
									</h2>
									<div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#theme_settings_accordion">
										<div class="accordion-body">
											<button class="nav-link active" id="bl-pills-2-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-2" type="button" role="tab" aria-controls="bl-pills-2" aria-selected="false">Back to Top</button>
											<button class="nav-link " id="bl-pills-1-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-1" type="button" role="tab" aria-controls="bl-pills-1" aria-selected="true">Breadcrumbs</button>


										</div>
									</div>
								</div>
								<div class="accordion-item">
									<h2 class="accordion-header">
										<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
											</i> Integration </button>
									</h2>
									<div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#theme_settings_accordion">
										<div class="accordion-body">
											<button class="nav-link collapsed" aria-expanded="false" id="bl-pills-4-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-4" type="button" role="tab" aria-controls="bl-pills-4" aria-selected="false">Custom Js Code</button>



										</div>
									</div>
								</div>
								<div class="accordion-item">
									<h2 class="accordion-header">
										<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
											</i> Elementor </button>
									</h2>
									<div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#theme_settings_accordion">
										<div class="accordion-body">
											<button class="nav-link collapsed" aria-expanded="false" id="bl-pills-5-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-5" type="button" role="tab" aria-controls="bl-pills-5" aria-selected="false">Import Elementor Template</button>
											<button class="nav-link collapsed" aria-expanded="false" id="bl-pills-6-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-6" type="button" role="tab" aria-controls="bl-pills-6" aria-selected="false">Convert Live Composer Pages to Elementor</button>


										</div>
									</div>
								</div>
									<div class="accordion-item">

									<h2 class="accordion-header">
										<button class="nav-link collapsed" aria-expanded="false" id="bl-pills-7-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-7" type="button" role="tab" aria-controls="bl-pills-7" aria-selected="false">
										Logs
										</button>
									</h2>
								</div>
								<!-- <div class="accordion-item">

									<h2 class="">
										<button class="nav-link collapsed" aria-expanded="false" id="bl-pills-4-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-4" type="button" role="tab" aria-controls="bl-pills-4" aria-selected="false">
											Integration
										</button>
									</h2>
								</div> -->
								<div class="accordion-item">

									<h2 class="accordion-header">
										<button class="nav-link collapsed" aria-expanded="false" id="bl-pills-3-tab" data-bs-toggle="pill" data-bs-target="#bl-pills-3" type="button" role="tab" aria-controls="bl-pills-3" aria-selected="false">
											Support
										</button>
									</h2>
								</div>

							</div>
						</aside>
					</div>
				</div>
				<div class="col-md-10 col-lg-10 col-sm-12">
					<div class="card p-lg-4 p-3 m-0">
						<div class="tab-content m-0" id="bl-pills-tabContent">
							<div class="tab-pane fade " id="bl-pills-1" role="tabpanel" aria-labelledby="bl-pills-1-tab">
								<form method="post" >
									<input type="hidden" name="reset" value="1">
									<div class="show_hide_label">
										<div><label for="seowp_dslc_breadcrumb_show">Show Breadcrumbs on your website</label></div>
										<div class="onoff" id="onoff2">
											<input name="seowp_dslc_breadcrumb_show" type="checkbox" value="1" id="seowp_dslc_breadcrumb_show" <?php echo (get_option('seowp_dslc_breadcrumb_show') === "on") ? "checked" : ""; ?>>
											<label for="seowp_dslc_breadcrumb_show"> </label>
										</div>
									</div>

									<div class="bl_list_">
										<ul class="template_listing breadcrumb_listing" id="template_list">
											<?php
											$args = array(
												'public'   => true,
												'show_in_menu' => true, // Set to true if you also want to include built-in post types like 'post' and 'page'.
											);

											$post_types = get_post_types($args, 'names');
											asort($post_types);
											foreach ($post_types as $key => $item) {
											?>
												<li>
													<label class="all new">
														<input class="seowp_breadcrumb_post" name="<?= 'seowp_dslc_' . $key ?>" <?= (get_option('seowp_dslc_' . $key) == 1) ? "checked" : ""; ?> type="checkbox"><?= $item ?>
													</label>
												</li>

											<?php } ?>


										</ul>
										<label class="bread_all">
											<input class="Select All"  id="apply_alll" name="seowp_dslc_bread_all" <?= (get_option('seowp_dslc_bread_all') == 1) ? "checked" : "" ?> type="checkbox">Apply to all
										</label>
									</div>
									<button type="submit" class="btn bttn">Save</button>
								</form>
							</div>
							<div class="tab-pane fade show active" id="bl-pills-2" role="tabpanel" aria-labelledby="bl-pills-2-tab">
								
							<form method="post">
									
									<input type="hidden" value="1" name="seowp_back_top_top_enable_form">
									<div class="show_hide_label">
										<div><label for="back_top_top_enable">Show Back To Top button on your website</label></div>
										<div class="onoff">
											
											<input type="checkbox" id="back_top_top_enable"  onchange="toggleInputField()" name="back_top_top_enable" <?php if (get_option('seowp_back_top_top_enable') && get_option('seowp_back_top_top_enable') == "on") {
																															echo "checked";
																														} ?>>
											<label for="back_top_top_enable"></label>
											
										</div>
									</div>

									<?php  
                                    if(get_option('back_to_top_right')==''){
                                        echo '<style>:root{--btt-bottom:20px;--btt-right:20px;--btt-mv-bottom:50px;--btt-mv-right:20px;}</style>';    
                                                                }                            
                                    if(isset($_POST['back_to_top_submit'])){

                                         if (isset($_POST['mv_back_to_top_bottom'])) {
                                             update_option('mv_back_to_top_bottom',$_POST['mv_back_to_top_bottom']);
											}



                                                if (isset($_POST['back_to_top_bottom'])) {
                                                    update_option('back_to_top_bottom',$_POST['back_to_top_bottom']);}

                                             if (isset($_POST['back_to_top_right'])) {
                                                update_option('back_to_top_right',$_POST['back_to_top_right']);}

                                                if (isset($_POST['mv_back_to_top_right'])) {
                                                    update_option('mv_back_to_top_right',$_POST['mv_back_to_top_right']);}
                                    }?>
                                    <div id='btt_icon_position'>
                                        <div class="row my-3">
                                            <div class="col-md-12 m">
                                            <h6>Desktop</h6>

                                            </div>
                                            <div class="col-md-3 col-6">
                                                <label class="form-label" for="back_to_top_bottom">From bottom in (px)</label>
                                                <input class="form-control" type="number" name="back_to_top_bottom" id="back_to_top_bottom" value="<?php echo get_option('back_to_top_bottom'); ?>" required>
                                            </div>
                                            <div class="col-md-3 col-6 ">
                                                <label class="form-label" for="back_to_top_right">From right in (px)</label>
                                                <input class="form-control" type="number" name="back_to_top_right" id="back_to_top_right" value="<?php echo get_option('back_to_top_right'); ?>" required>
                                            </div>
                                        </div>

                                        <div class="row my-3">
                                            <div class="col-md-12 mt-3">
                                            <h6> Mobile</h6>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <label class="form-label" for="mv_back_to_top_bottom">From bottom in (px)</label>
                                                <input class="form-control" type="number" name="mv_back_to_top_bottom" id="mv_back_to_top_bottom" value="<?php echo get_option('mv_back_to_top_bottom'); ?>" required>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <label class="form-label" for="mv_back_to_top_right">From right in (px) </label>
                                                <input class="form-control" type="number" name="mv_back_to_top_right" id="mv_back_to_top_right" value="<?php echo get_option('mv_back_to_top_right'); ?>" required>
                                            </div>
                                        </div>

                                    </div>

                                    <input type="submit" name="back_to_top_submit" id="submit" class="button button-primary" value="Save Changes">
                                </form>



                            </div>

                            <script>

								const checkbox = document.getElementById('back_top_top_enable');
                                const inputContainer = document.getElementById('btt_icon_position');
                                function toggleInputField() {
                                    if (checkbox.checked) {
                                        inputContainer.style.display = 'block';
                                    } else {
                                        inputContainer.style.display = 'none';
                                    }
                                }
								jQuery(document).ready(function($) {
									if (checkbox.checked) {
                                        inputContainer.style.display = 'block';
                                    } else {
                                        inputContainer.style.display = 'none';
                                    }
								});
                            </script>
							<div class="tab-pane fade" id="bl-pills-3" name ="seowp_support" role="tabpanel" aria-labelledby="bl-pills-3-tab">
								<div>
									<a href="https://support.seowptheme.com/" target="blank">Click here</a> to access our Knowledge Base.
								</div>
							</div>
							<div class="tab-pane fade" id="bl-pills-7" role="tabpanel" aria-labelledby="bl-pills-7-tab">
							<div style="padding: 25px 0px;">
					<b style="font-size: 1.2rem;">Debug Logs</b>
					<a style="
    background: #2271b1;
    color: #fff;
	margin-left: 1rem;
    text-transform: uppercase;
    text-decoration: none;
    padding: 9px 17px;
    display: inline-block;
" href="<?= home_url() . "/" . str_replace(ABSPATH, "", get_stylesheet_directory()) . "/Logs/seowp_debug.log" ?>" download="">Download</a>

				</div>
							</div>
							<div class="tab-pane fade" id="bl-pills-4" role="tabpanel" aria-labelledby="bl-pills-4-tab">
								<form method="post" action="options.php">
									
								<input type="hidden" name="custom_js_code">
									<?php

									settings_fields('seowp_theme_option_group');
									do_settings_sections('seowp_theme_options');
									submit_button();
									?>

								</form>
							</div>


							<div class="tab-pane fade" id="bl-pills-5" role="tabpanel" aria-labelledby="bl-pills-5-tab">
								<div>
								<form method="post">
								<div class="list_wrap" style="display: block;">
									<ul class="template_listing temptates_listing">
										<?php
										$json_data =  file_get_contents(get_template_directory() . "/design/demo-content/templates/index.json");
										$array = json_decode($json_data, 1);
										for ($x = 0; $x < count($array['templates']); $x++) {
											if (!empty(get_option('update_selected_import_data_info')) && get_option('update_selected_import_data_info') == 1) {
												if ($array['templates'][$x]['template_type'] == "flat") {
										?>
													<li>
														<label class="new">
														<input type="checkbox" name="selected_template[]" value="<?= $array['templates'][$x]['template_file'] ?>"> <?= str_replace('_',' ',$array['templates'][$x]['template_name']) ?>
														</label>
													</li>

												<?php
												}
											} else {
												if ($array['templates'][$x]['template_type'] == "fresh") {

												?>
													<li>
														<label class="new">
														<input type="checkbox" name="selected_template[]" value="<?= $array['templates'][$x]['template_file'] ?>"> <?= str_replace('_',' ',$array['templates'][$x]['template_name']) ?>
														</label>
													</li>
										<?php }
											}
										} ?>

										
									</ul>
									<div>
											<label class="all new">
												<input class="all_import" name="Import-element" id= "" type="checkbox">Import ALL Templates
											</label>
									</div>
								</div>
								<button type="submit" class="bttn" onclick="return confirm('Are you sure? You want to Import Template');">Import</button>
							</form>
								</div>
							</div>


							<div class="tab-pane fade" id="bl-pills-6" role="tabpanel" aria-labelledby="bl-pills-6-tab">
								<div>
								<?php 
								if (isset($_POST['composer_to_elementor'])) {
									try {
										$args = array(
											'post_type' => 'page', // You can change 'post' to any other custom post type if needed
											'posts_per_page' => -1, // -1 retrieves all posts
										);

										$query = new WP_Query($args);
										if ($query->have_posts()) {
											while ($query->have_posts()) {
												$query->the_post();
												$post_id = get_the_ID();
												if (isset($_POST['seowp_composer_to_elementor' . $post_id])) {
													update_option('seowp_composer_to_elementor' . $post_id, 1);
													$is_convert = 1;
												}
											}
										}
										if(isset($is_convert)){
											update_option('seowp_composer_to_elementor', 1);
										}

									} catch (\Throwable $th) {
									}
								}
							?>
							<form method="post">
								<input type="hidden" name="composer_to_elementor" value="1">
									<ul class="template_listing" >
										<?php
										$args = array(
											'post_type' => 'page', // You can change 'post' to any other custom post type if needed
											'posts_per_page' => -1, // -1 retrieves all posts
										);

										$query = new WP_Query($args);
										if ($query->have_posts()) {
											while ($query->have_posts()) {
												$query->the_post();
												$post_id = get_the_ID();
												if(!get_post_meta($post_id, 'is_duplicate', true)){
										?>
												<li class="<?= (get_post_meta($post_id, '_dslc_livecomposer_id', true))?'already_existe':""; ?>">
													<label class=" new">
														<input class="seowp_breadcrumb_post" name="<?= 'seowp_composer_to_elementor' . $post_id ?>" <?= (get_post_meta($post_id, '_dslc_livecomposer_id', true))?'checked disabled':""; ?> <?= (get_option('seowp_composer_to_elementor' . $post_id) == 1) ? "checked disabled" : ""; ?> type="checkbox"> &nbsp<?= the_title() ?>
													</label>
												</li>
										<?php
												}
											}
										} else {
											echo 'No posts found';
										}
										wp_reset_postdata();
										?>
									</ul> 
								<button type="submit" onclick="return confirm('Are you sure? You want to convert Composer to Elementor');"  class="bttn"> Convert </button>
							</form>
								</div>
							</div>


						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
	</div>

	
	<style>
		label.bread_all {
			color: #000;
			text-transform: uppercase;
			font-weight: 600;
			margin: 8px 4px;
		}

		label.new {
			border: 1px solid #777;
			display: inline-block;
			width: 300px;
			padding: 17px 17px;
			margin-top: 10px;
			cursor: pointer;
		}

		label.all.new {
			background: #2271b1;
			color: #fff;
			font-weight: 500;
			text-transform: uppercase;
		}

		.show_hide_label {
			display: flex;
			flex-flow: column;
			max-width: 335px;
		}

		.show_hide_label label {
			/* margin-top: 1rem; */
			margin-bottom: .75em;
		}

		select#seowp_dslc_breadcrumb_show {
			padding: 10px;
		}
	</style>
	
	<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script>
	<script>
		// on off js
		$(document).ready(function() {
			if ($('#onoff2 input').is(':checked')) {
				$('.bl_tab_ .bl_list_').fadeIn('slow');
			} else {
				$('.bl_tab_ .bl_list_').fadeOut('slow');
			}
		});

		document.getElementsByClassName('seowp_dslc_bread_all').onclick = function() {
			var checkboxes = document.getElementsByName('option[]');
			for (var checkbox of checkboxes) {
				checkbox.checked = this.checked;
			}
		};

		$(document).ready(function() {
			$('#onoff2 input').change(function() {

				if ($(this).is(':checked')) {
					$('.bl_tab_ .bl_list_').fadeIn('slow');
				} else {
					$('.bl_tab_ .bl_list_').fadeOut('slow');
				}
			});

			<?php 
				if (isset($_POST) && isset($_POST['seowp_back_top_top_enable_form'])) {
					$current_target = 'bl-pills-2-tab';
				}
				if (isset($_POST) && isset($_POST['reset'])) {
					$current_target = 'bl-pills-1-tab';
				}
				
				if (isset($_POST) && isset($_POST['custom_js_code'])) {
					$current_target = 'bl-pills-4-tab';
				}
				if (isset($_POST) && isset($_POST['selected_template'])) {
					$current_target = 'bl-pills-5-tab';
				}
				if (isset($_POST) && isset($_POST['composer_to_elementor'])) {
					$current_target = 'bl-pills-6-tab';
				}



				echo  "jQuery('#$current_target').click()";
			
			?>

		});
	
	</script>
	<script>
		$(document).ready(function() {
			$('.all_import').click(function() {
				if ($(this).is(':checked')) {
					$('.temptates_listing input').attr('checked', true);
				} else {
					$('.temptates_listing input').attr('checked', false);
				}
			});
			$('#apply_alll').click(function() {
				if ($(this).is(':checked')) {
					$('.breadcrumb_listing input').attr('checked', true);
				} else {
					$('.breadcrumb_listing input').attr('checked', false);
				}
			});
			$('.tab-a').click(function() {
				$(".setting-tab").removeClass('tab-active');
				$(".setting-tab[data-id='" + $(this).attr('data-id') + "']").addClass("tab-active");
				$(".tab-a").removeClass('active-a');
				$(this).parent().find(".tab-a").addClass('active-a');
			});
		});

		// on off js
		$(document).ready(function() {
			$('.onoff input').change(function() {

				if ($(this).is(':checked')) {
					$('.tab_ .list_wrap').fadeIn('slow');
				} else {
					$('.tab_ .list_wrap').fadeOut('slow');
				}
			});
		});
	</script>
<?php
}



function custom_gtag_settings_section()
{

	// I created variables to make the things clearer
	$page_slug = 'seowp_theme_options';
	$option_group = 'seowp_theme_option_group';

	add_settings_section('custom_section_id', '', '', $page_slug);

	$args = array('type' => 'string', 'default' => NULL);

	register_setting($option_group, 'seowp_header_code_enable');
	register_setting($option_group, 'seowp_body_code_enable');
	register_setting($option_group, 'is_element_templates_imported');

	register_setting($option_group, 'seowp_footer_code_enable');
	register_setting($option_group, 'seowp_header_code', $args);
	register_setting($option_group, 'seowp_body_code', $args);
	register_setting($option_group, 'seowp_footer_code', $args);

	add_settings_field('seowp_header_code_enable', 'Enable header code', 'seowp_header_checkbox', $page_slug, 'custom_section_id');


	add_settings_field(
		'seowp_body_code_enable',
		'Enable body code',
		'seowp_body_checkbox', // function to print the field
		$page_slug,
		'custom_section_id' // section ID
	);

	// add_settings_field(
	// 	'is_element_templates_imported',
	// 	'Enable Template Import automatically',
	// 	'seowp_template_checkbox', // function to print the field
	// 	$page_slug,
	// 	'custom_section_id' // section ID
	// );

	add_settings_field(
		'seowp_footer_code_enable',
		'Enable footer code',
		'seowp_footer_checkbox', // function to print the field
		$page_slug,
		'custom_section_id' // section ID
	);


	add_settings_field(
		'seowp_header_code',
		'Add code to the  &lt;head&#62; section of all pages',
		'seowp_header_code_html_callback',
		$page_slug,
		'custom_section_id',
		array(
			'label_for' => 'seowp_header_code',
			'class' => 'hello', // for <tr> element
			'name' => 'seowp_header_code' // pass any custom parameters
		)
	);


	add_settings_field(
		'seowp_body_code',
		'Add code to the  &lt;body&#62; section of all pages',
		'seowp_body_code_html_callback',
		$page_slug,
		'custom_section_id',
		array(
			'label_for' => 'seowp_body_code',
			'class' => 'hello', // for <tr> element
			'name' => 'seowp_body_code' // pass any custom parameters
		)
	);



	add_settings_field(
		'seowp_footer_code',
		'Add code to the  &lt;footer&#62; section of all pages',
		'seowp_footer_code_html_callback',
		$page_slug,
		'custom_section_id',
		array(
			'label_for' => 'seowp_footer_code',
			'class' => 'hello', // for <tr> element
			'name' => 'seowp_footer_code' // pass any custom parameters
		)
	);
}

add_action('admin_init', 'custom_gtag_settings_section');


function seowp_header_checkbox($args)
{
	$id = "header-code";
	$name = "seowp_header_code_enable";
	$value = get_option('seowp_header_code_enable');
	seowp_switch_checkbox($id, $name, $value);
}

function seowp_body_checkbox($args)
{
	//$value = get_option( 'seowp_body_code_enable' );

	$id = "body-code";
	$name = "seowp_body_code_enable";
	$value = get_option('seowp_body_code_enable');
	seowp_switch_checkbox($id, $name, $value);
}

function seowp_footer_checkbox($args)
{
	$id = "footer-code";
	$name = "seowp_footer_code_enable";
	$value = get_option('seowp_footer_code_enable');
	seowp_switch_checkbox($id, $name, $value);
}

function seowp_switch_checkbox($id, $name, $value)
{
	//var_dump($value);
	// $value = get_option( 'seowp_header_code_enable' );
?>
	<div class="onoff">
		<input type="checkbox" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>" <?php echo ($value == 'on' ? 'checked' : ''); ?> />

		<label for="<?php echo esc_attr($id); ?>">
		</label>
	</div>
	<?php
}



// custom callback function to print field HTML
function seowp_header_code_html_callback($args)
{

	$content = get_option('seowp_header_code');
	$custom_editor_id = "seowp_header_code";
	$custom_editor_name = "seowp_header_code";
	$settings =   array(
		// Disable autop if the current post has blocks in it.
		'wpautop'             => false,
		'media_buttons'       => false,
		'default_editor'      => '',
		'drag_drop_upload'    => false,
		'textarea_name'       => $custom_editor_name,
		'textarea_rows'       => 5,
		'tabindex'            => '',
		'tabfocus_elements'   => ':prev,:next',
		'editor_css'          => '',
		'editor_class'        => '',
		'teeny'               => false,
		'_content_editor_dfw' => false,
		'quicktags'           => false,
	);
	wp_editor($content, $custom_editor_id, $settings);
}

// custom callback function to print field HTML
function seowp_body_code_html_callback($args)
{
	$content = get_option('seowp_body_code');
	$custom_editor_id = "seowp_body_code";
	$custom_editor_name = "seowp_body_code";
	$settings =   array(
		// Disable autop if the current post has blocks in it.
		'wpautop'             => false,
		'media_buttons'       => false,
		'default_editor'      => '',
		'drag_drop_upload'    => false,
		'textarea_name'       => $custom_editor_name,
		'textarea_rows'       => 5,
		'tabindex'            => '',
		'tabfocus_elements'   => ':prev,:next',
		'editor_css'          => '',
		'editor_class'        => '',
		'teeny'               => false,
		'_content_editor_dfw' => false,
		'quicktags'           => false,
	);
	wp_editor($content, $custom_editor_id, $settings);
}

// custom callback function to print field HTML
function seowp_footer_code_html_callback($args)
{
	$content = get_option('seowp_footer_code');
	$custom_editor_id = "seowp_footer_code";
	$custom_editor_name = "seowp_footer_code";
	$settings =   array(
		// Disable autop if the current post has blocks in it.
		'wpautop'             => false,
		'media_buttons'       => false,
		'default_editor'      => '',
		'drag_drop_upload'    => false,
		'textarea_name'       => $custom_editor_name,
		'textarea_rows'       => 5,
		'tabindex'            => '',
		'tabfocus_elements'   => ':prev,:next',
		'editor_css'          => '',
		'editor_class'        => '',
		'teeny'               => false,
		'_content_editor_dfw' => false,
		'quicktags'           => false,
	);
	wp_editor($content, $custom_editor_id, $settings);
}



function Seowp_notice()
{

	if (
		isset($_GET['page'])
		&& 'seowp_theme_options' == $_GET['page']
		&& isset($_GET['settings-updated'])
		&& true == $_GET['settings-updated']
	) {
	?>
		<div class="notice notice-success is-dismissible">
			<p>
				<strong>Changes saved successfully.</strong>
			</p>
		</div>
<?php
	}
}
add_action('admin_notices', 'Seowp_notice');


function seowp_callback()
{
	echo "";
}

add_action('admin_enqueue_scripts', 'codemirror_enqueue_scripts');

function codemirror_enqueue_scripts($hook)
{
	$cm_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'text/css'));
	wp_localize_script('jquery', 'cm_settings', $cm_settings);

	wp_enqueue_script('wp-theme-plugin-editor');
	wp_enqueue_style('wp-codemirror');
}

/* ============= Custom Theme Options Section End ====================*/
function testimonial()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/testimonial');

	return ob_get_clean();
}
add_shortcode('testimonial', 'testimonial');

function testimonial_102_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/testimonial102_html');

	return ob_get_clean();
}
add_shortcode('testimonial_102', 'testimonial_102_function');



function issue_sohrt_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/issue_html');

	return ob_get_clean();
}
add_shortcode('issue_sohrt', 'issue_sohrt_function');

function project_short_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/project_html');

	return ob_get_clean();
}
add_shortcode('project_101', 'project_short_function');
function project102_short_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/project102_html');

	return ob_get_clean();
}
add_shortcode('project_102', 'project102_short_function');
function blog_short_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/blog_html');

	return ob_get_clean();
}
add_shortcode('blog', 'blog_short_function');
function book_blog_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/book_blog_html');

	return ob_get_clean();
}
add_shortcode('book_blog', 'book_blog_function');
function staff_function()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/staff_html');

	return ob_get_clean();
}
add_shortcode('staff', 'staff_function');

function testimonials_lg_slider()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/testimonials_lg_slider');

	return ob_get_clean();
}
add_shortcode('testimonials_lg_slider', 'testimonials_lg_slider');

function testimonials_sm_slider()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/testimonials_sm_slider');

	return ob_get_clean();
}
add_shortcode('testimonials_sm_slider', 'testimonials_sm_slider');

function blog_horizontal()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/blog_horizontal');

	return ob_get_clean();
}
add_shortcode('blog_horizontal', 'blog_horizontal');
function testimoial_center()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/testimoial_center');

	return ob_get_clean();
}
add_shortcode('testimoial_center', 'testimoial_center');
function flat_customblog_hcard()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/flat_customblog_hcard');

	return ob_get_clean();
}
add_shortcode('flat_customblog_hcard', 'flat_customblog_hcard');

function flat_customblog_vcard()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/flat_customblog_vcard');

	return ob_get_clean();
}
add_shortcode('flat_customblog_vcard', 'flat_customblog_vcard');



function flat_horizontal_blog()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/flat_horizontal_blog');

	return ob_get_clean();
}
add_shortcode('flat_horizontal_blog', 'flat_horizontal_blog');

function flat_descriptive_blog()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/flat_descriptive_blog');

	return ob_get_clean();
}
add_shortcode('flat_descriptive_blog', 'flat_descriptive_blog');

function flat_blog_blocks()
{


	ob_start();

	// include template with the arguments (The $args parameter was added in v5.5.0)
	get_template_part('custom-elements/template/flat_blog_blocks');

	return ob_get_clean();
}
add_shortcode('flat_blog_blocks', 'flat_blog_blocks');






add_action('elementor/init', 'initElementor');
add_action('init', 'import_elementor_templates');

function initElementor()
{
	update_option('is_element_init_SEOWP', 1);
}

function replaceElementorVariablesInJson($file_name, $jsonFilePath)
{
	$jsonData = file_get_contents($jsonFilePath);
	$data = json_decode($jsonData, true);
	$string = json_encode($data, JSON_PRETTY_PRINT);
	$forms = Ninja_Forms()->form()->get_forms();
	foreach ($forms as $form) {
		$form_name 	= $form->get_setting('title');
		$form_id 	= $form->get_id();
		$string = str_replace("##" . $form_name . "##", $form_id, $string);
	}
	$root_path = LBMN_INSTALLER . LBMN_PLUGINS;
	$string = str_replace("##base_theme_directory##", $root_path, $string);
	file_put_contents($jsonFilePath, $string);
	return 1;
}



function import_elementor_templates()
{

	if (!is_plugin_active('elementor/elementor.php')) {
		update_option('is_element_init_SEOWP', 0);
		update_option('is_element_templates_imported', 0);
	}
	if (get_option('is_element_init_SEOWP') == '1') {
		ini_set('max_execution_time', 0);

		if (!empty(get_option('selected_import_items')) || get_option('is_element_templates_imported') == '1' || get_option('is_element_templates_imported2') == 1 || get_option('is_element_templates_imported3') == 1 || get_option('is_element_templates_imported4') == 1) {
			if (get_option('elementor_unfiltered_files_upload') == 1) {
				update_option('cutsom_elementor_unfiltered_files_upload', 1);
			} else {
				update_option('cutsom_elementor_unfiltered_files_upload', 0);
			}
			update_option('elementor_unfiltered_files_upload', 1);
			// update_option('is_element_templates_imported', 0);

			if (get_option('is_element_templates_imported') == 1) {
				$json_data =  file_get_contents(get_template_directory() . "/design/demo-content/templates/index1.json");
				update_option('is_element_templates_imported', 0);
			} elseif (get_option('is_element_templates_imported2') == 1) {
				$json_data =  file_get_contents(get_template_directory() . "/design/demo-content/templates/index2.json");
				update_option('is_element_templates_imported2', 0);
			} elseif (get_option('is_element_templates_imported3') == 1) {
				$json_data =  file_get_contents(get_template_directory() . "/design/demo-content/templates/index3.json");
				update_option('is_element_templates_imported3', 0);
			} elseif (get_option('is_element_templates_imported4') == 1) {
				$json_data =  file_get_contents(get_template_directory() . "/design/demo-content/templates/index4.json");
				update_option('is_element_templates_imported4', 0);
			} else {
				$json_data =  file_get_contents(get_template_directory() . "/design/demo-content/templates/index.json");
			}
			$array = json_decode($json_data, 1);
			$fresh = $flat = [];



			for ($x = 0; $x < count($array['templates']); $x++) {
				if (empty(get_option('selected_import_items'))) {   // manually selecte
					if ($array['templates'][$x]['template_type'] == "fresh" && get_option('update_selected_import_data_info') != 1) {
						array_push($fresh, $array['templates'][$x]['template_file']);
					}
					if ($array['templates'][$x]['template_type'] != "fresh" && get_option('update_selected_import_data_info') == 1) {
						array_push($flat, $array['templates'][$x]['template_file']);
					}
				} else {
					if (in_array($array['templates'][$x]['template_file'], json_decode(get_option('selected_import_items')))) { // it pass only those template those are selected by user
						if ($array['templates'][$x]['template_type'] == "fresh" && get_option('update_selected_import_data_info') != 1) {
							array_push($fresh, $array['templates'][$x]['template_file']);
						}
						if ($array['templates'][$x]['template_type'] != "fresh" && get_option('update_selected_import_data_info') == 1) {
							array_push($flat, $array['templates'][$x]['template_file']);
						}
					}
				}
			}

			if (!empty(get_option('selected_import_items')) && (!empty($fresh) || !empty($flat))) {
				update_option('selected_import_items', "");
			}

			// we got frssh and flat here 


			// update_selected_import_data_info     ::   show the slected type FLAT OR  
			// core is_element_templates_imported   ::    start import_elementor_templates Function 
			//selected_import_items   				::     manually selected item in array formate

			if (get_option('update_selected_import_data_info') == 1) { // flat marlin
				foreach ($flat as $key => $item) {
					$internal_chanage = replaceElementorVariablesInJson($item, get_template_directory() . "/design/demo-content/templates/" . $item);

					if ($internal_chanage) {
						$fileContent = file_get_contents(get_template_directory() . "/design/demo-content/templates/" . $item);
						\Elementor\Plugin::instance()->templates_manager->import_template(
							[
								'fileData' => base64_encode($fileContent),
								'fileName' => $item,
							]
						);
						update_option('is_element_templates_imported', 0);
					}
				}
			} else {
				foreach ($fresh as $key => $item) {
					// update_option('is_element_templates_imported', 0);


					$internal_chanage = replaceElementorVariablesInJson($item, get_template_directory() . "/design/demo-content/templates/" . $item);
					// update_option('is_element_templates_imported', 0);
					if ($internal_chanage) {
						$fileContent = file_get_contents(get_template_directory() . "/design/demo-content/templates/" . $item);
						\Elementor\Plugin::instance()->templates_manager->import_template(
							[
								'fileData' => base64_encode($fileContent),
								'fileName' => $item,
							]
						);
						update_option('is_element_templates_imported', 0);
					}
				}
			}
			if (get_option('cutsom_elementor_unfiltered_files_upload') == 1) {
				update_option('elementor_unfiltered_files_upload', 1);
			} elseif (get_option('cutsom_elementor_unfiltered_files_upload') == 0) {
				update_option('elementor_unfiltered_files_upload', 0);
			}
		}
	}
}


function enqueue_style()
{
	if (get_option('update_selected_import_data_info') == 1) {
		// flat
		wp_enqueue_style('custom-style', get_stylesheet_directory_uri() . '/css/flat-style.css', array(), '1.0', 'all');
	} else {
		// fresh
		wp_enqueue_style('custom-style', get_stylesheet_directory_uri() . '/css/fresh-style.css', array(), '1.0', 'all');
	}
}
add_action('wp_enqueue_scripts', 'enqueue_style');



function handle_post__request()
{
	if (isset($_POST) && isset($_POST['seowp_back_top_top_enable_form'])) {

		

		if (!empty($_POST['back_top_top_enable'])) {
			update_option('seowp_back_top_top_enable', $_POST['back_top_top_enable']);
		} else {
			update_option('seowp_back_top_top_enable', 0);
		}
	}
	if (isset($_POST) &&  isset($_POST['reset'])) {
		try {
			$args = array(
				'public'   => true,
				'show_in_menu' => true, // Set to true if you also want to include built-in post types like 'post' and 'page'.
			);
			$post_types = get_post_types($args, 'names');
			foreach ($post_types as $t_key => $t_item) {
				update_option('seowp_dslc_' . $t_key, 0);
			}

			update_option('seowp_dslc_bread_all', 0);
			foreach ($post_types as $t_key => $t_item) {
				if (isset($_POST['seowp_dslc_' . $t_key])) {
					update_option('seowp_dslc_' . $t_key, 1);
				}
			}
			if (isset($_POST['seowp_dslc_bread_all'])) {
				update_option('seowp_dslc_bread_all', 1);
			}
			if (isset($_POST['seowp_dslc_breadcrumb_show'])) {
				update_option('seowp_dslc_breadcrumb_show', 'on');
			} else {
				update_option('seowp_dslc_breadcrumb_show', 'off');
			}
		} catch (\Throwable $th) {
		}
	}
}
add_action('admin_init', 'handle_post__request');

function check_breadcrumb()
{
	if (get_option('seowp_dslc_breadcrumb_show') == 'on') {
		if (is_single()) {
			$post_type = get_post_type();
			if (get_option('seowp_dslc_' . $post_type) == 1) {
				$already_set = 1;
				if (function_exists('custom_breadcrumbs')) custom_breadcrumbs();
			}
		} elseif (is_page()) {
			if (get_option('seowp_dslc_page') == 1) {
				$already_set = 1;
				if (function_exists('custom_breadcrumbs')) custom_breadcrumbs();
			}
		}
		if (get_option('seowp_dslc_bread_all') == 1 && !isset($already_set)) {
			if (function_exists('custom_breadcrumbs')) custom_breadcrumbs();
		}
	}
}
 
add_action( 'admin_enqueue_scripts', 'load_admin_style' );
function load_admin_style() {
    wp_enqueue_style( 'theme_settings_css', get_template_directory_uri() . '/css/theme_settings.css', false, '1.0.0' );

}
// / Breadcrumb function




// Hook to add the custom menu page


function custom_breadcrumbs()
{
	// Home page link
	echo '<a href="' . home_url('/') . '">' . __('Home', 'text_domain') . '</a> <span class="separator">/</span> ';

	// Check if on a singular post or page
	if (is_singular()) {
		global $post;

		// Get the category for the post
		$categories = get_the_category($post->ID);

		if ($categories) {
			$category = $categories[0]; // Use the first category
			echo '<a href="' . get_category_link($category->term_id) . '">' . esc_html($category->name) . '</a> <span class="separator">/</span> ';
		}

		// Display the post title
		echo '<span class="current">' . get_the_title() . '</span>';
	} elseif (is_category()) {
		// Display the current category
		echo '<span class="current">' . single_cat_title('', false) . '</span>';
	} elseif (is_tag()) {
		// Display the current tag
		echo '<span class="current">' . single_tag_title('', false) . '</span>';
	} elseif (is_archive()) {
		// Display the current archive
		echo '<span class="current">' . get_the_archive_title() . '</span>';
	} elseif (is_search()) {
		// Display the search term
		echo '<span class="current">' . __('Search results for: ', 'text_domain') . get_search_query() . '</span>';
	} elseif (is_404()) {
		// Display 404 message
		echo '<span class="current">' . __('404 Not Found', 'text_domain') . '</span>';
	}
}

add_action('before_delete_post', 'get_post_id_before_deletion');
function get_post_id_before_deletion($post_id)
{
	// ini_set('memory_limit', '256M');
	$associated_post = get_post_meta($post_id, '_dslc_livecomposer_id', true);
	if ($associated_post && get_post($associated_post)) {
		delete_post_meta($associated_post, 'is_duplicate');
	}
	$associated_parent_post = get_post_meta($post_id, '_dslc_elementor_id', true);
	if ($associated_parent_post && get_post($associated_parent_post)) {
		delete_post_meta($associated_parent_post, '_dslc_livecomposer_id');
	}
}

/**
 
 * @method: seowp_dslc_filter_content()
 * @description: RETURN HTML OF COMPOSER CODE ASSOCIATED WITH POST id   
 * */
function seowp_dslc_filter_content($curr_id)
{
	// $curr_id = 60576;
	$composer_wrapper_before = '';
	$composer_wrapper_after = '';
	$composer_header = ''; // HTML for LC header.
	$composer_footer = ''; // HTML for LC footer.
	$composer_prepend = ''; // HTML to output before LC content.
	$composer_content = ''; // HTML for LC content.
	$composer_append = ''; // HTML to ouput after LC content.
	$composer_code = dslc_get_code($curr_id);
	$composer_content = dslc_render_content($composer_code);
	if (dslc_is_editor_active() || !defined('DS_LIVE_COMPOSER_HF_AUTO') || DS_LIVE_COMPOSER_HF_AUTO) {
		$composer_wrapper_before = '<div id="dslc-content" class="dslc-content dslc-clearfix">';
		$composer_wrapper_after = '</div>';
	}
	if (!is_singular('dslc_hf') && (!defined('DS_LIVE_COMPOSER_HF_AUTO') || DS_LIVE_COMPOSER_HF_AUTO)) {
		$composer_header = dslc_hf_get_header();
		$composer_footer = dslc_hf_get_footer();
	}
	if (dslc_is_editor_active('access')) {
		$composer_prepend = '';
	}
	if (dslc_is_editor_active('access')) {
	$composer_append = '<div class="dslca-add-modules-section">
					<a href="#" class="dslca-add-modules-section-hook"><span class="dslca-icon dslc-icon-align-justify"></span>' . __('Add Modules Row', 'live-composer-page-builder') . '</a>
					<a href="#" class="dslca-import-modules-section-hook"><span class="dslca-icon dslc-icon-download-alt"></span>' . __('Import', 'live-composer-page-builder') . '</a>
				</div>';
	}
	if (dslc_is_editor_active('access')) {
		$composer_append .= '<div id="dslc-section-dividers">' . dslc_section_dividers('all', '', 'code') . '</div>';
	}
	$content_before = '';
	$dslc_content_before = apply_filters('dslc_content_before', $content_before);
	$content_after = '';
	$dslc_content_after = apply_filters('dslc_content_after', $content_after);
	if (is_singular() && has_post_thumbnail($curr_id)) {
		// Hidden input holding value of the URL of the featured image of the shown post ( used by rows for BG image )
		$composer_append .= '<input type="hidden" id="dslca-post-data-thumb" value="' . apply_filters('dslc_row_bg_featured_image', wp_get_attachment_url(get_post_thumbnail_id($curr_id))) . '" />';
	}
	if (dslc_is_editor_active('access')) {
		$composer_wrapper_after .= '<div class="lc-scroll-top-area"></div><div class="lc-scroll-bottom-area"></div>';
	}
	$rendered_page = $dslc_content_before . $composer_wrapper_before . do_action('dslc_output_prepend') . $composer_header . '<div id="dslc-main">' . $composer_prepend . $composer_content . '</div>' . $composer_append . $composer_footer . do_action('dslc_output_append') . $composer_wrapper_after . $dslc_content_after;
	return $rendered_page;
}
add_action('init', 'convertComposerToElementor');

/**

 * @method: convertComposerToElementor()
 * @description: Convert composer code into elemntor   
 * */
function convertComposerToElementor() {
    if (get_option('seowp_composer_to_elementor') != 1) {
        return; // Exit early if the option is not set to 1
    }

    global $wpdb;

    $args = array(
        'post_type'      => 'page',
        'posts_per_page' => -1,
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            $cache_id = get_the_ID();
         

            if (get_option('seowp_composer_to_elementor' . $cache_id) == 1) {
                delete_option('seowp_composer_to_elementor' . $cache_id);
				$rendered_page = seowp_dslc_filter_content($cache_id);
                $wpdb->update(
                    $wpdb->prefix . 'posts',
                    array('post_content' => $rendered_page),
                    array('ID' => $cache_id),
                    array('%s'),
                    array('%d')
                );

                if (!get_post_meta($cache_id, 'is_duplicate', true) && !get_post_meta($cache_id, '_dslc_livecomposer_id', true)) {
                    $new_post_id = duplicate_post($cache_id);
                    update_post_meta($cache_id, '_dslc_livecomposer_id', $new_post_id);
                }
            }
           
        }
        wp_reset_postdata(); // Reset post data to the main query
    }
    delete_option('seowp_composer_to_elementor');
}


/**
 
 * @method: duplicate_post()
 * @description: WordPress Function for Duplicating Posts with Meta Data
 * */
function duplicate_post($post_id) {
    // Check if the post exists
    $original_post = get_post($post_id);

    if (!$original_post && !get_post_meta($post_id, 'is_duplicate', true)) {
        return;
    }

    $current_user = wp_get_current_user();
    $new_post_author = $current_user->ID;

    $new_post_args = array(
        'post_title'   => $original_post->post_title . ' (LiveComposer)',
        'post_content' => '',
        'post_status'  => $original_post->post_status,
        'post_type'    => $original_post->post_type,
        'post_author'  => $new_post_author,
    );

    $new_post_id = wp_insert_post($new_post_args);

    if (!is_wp_error($new_post_id)) {
        update_post_meta($new_post_id, '_dslc_elementor_id', $post_id);
        update_post_meta($new_post_id, 'is_duplicate', 1);

        // Duplicate post meta data
        $post_meta_keys = get_post_custom_keys($post_id);

        if (!empty($post_meta_keys)) {
            foreach ($post_meta_keys as $meta_key) {
                $meta_values = get_post_custom_values($meta_key, $post_id);
                foreach ($meta_values as $meta_value) {
                    $meta_value = maybe_unserialize($meta_value);
                    update_post_meta($new_post_id, $meta_key, wp_slash($meta_value));
                }
            }
        }
    }

    return $new_post_id;
}
function seowp_request_handle(){
	if (isset($_POST['selected_template'])) {
	   update_option('selected_import_items', json_encode($_POST['selected_template']));
	   update_option('is_element_templates_imported', 1);
	   import_elementor_templates();
   } 
}
add_action('init', 'seowp_request_handle');
function load_global_css_assets(){
	$bottom=get_option('back_to_top_bottom');   
	 $right=get_option('back_to_top_right');
	 $mv_bottom=get_option('mv_back_to_top_bottom');
	 $mv_right=get_option('mv_back_to_top_right');


	  echo '<style>:root{--btt-bottom:'.$bottom.'px; --btt-right:'.$right.'px; --btt-mv-bottom: '.$mv_bottom.'px; --btt-mv-right:'.$mv_right.'px;}</style>';
	}
	add_action( 'wp_head','load_global_css_assets');

