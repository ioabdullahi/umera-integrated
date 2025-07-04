<?php

/**
 * Global Plugin Setup
 *
 * @package   EasySocialShareButtons
 * @author    AppsCreo
 * @link      http://appscreo.com/
 * @copyright 2016 AppsCreo
 * @since 3.4.1
 *
 */

class ESSBGlobalSettings {
	
	public static $legacy_class = false;
	public static $counter_total_text = '';
	public static $counter_total_text_shares = '';
	public static $counter_total_text_share = '';
	public static $counter_total_icon = '';
	public static $button_counter_hidden_till = '';
	public static $mycred_group = "";
	public static $mycred_points = "";
	public static $more_button_icon = "";
	public static $comments_address = "";
	public static $use_rel_me = false;
	public static $use_rel_noopener = false;
	public static $essb_encode_text = false;
	public static $essb_encode_url = false;
	public static $essb_encode_text_plus = false;
	public static $print_use_printfriendly = false;
	public static $pinterest_sniff_disable = false;
	public static $fbmessengerapp = "";
	public static $twitter_message_optimize = false;
	public static $sidebar_pos = "";	
	
	public static $mobile_networks_active = false;
	public static $mobile_networks = array();
	public static $mobile_networks_order_active = false;
	public static $mobile_networks_order = array();
		
	public static $telegram_alternative = false;
	
	public static $cache_runtime = false;
	
	public static $subscribe_function = "";
	public static $subscribe_link = "";
	public static $subscribe_content = "";
	
	public static $use_minified_css = false;
	public static $use_minified_js = false;
	
	public static $cached_counters_cache_mode = false;
	public static $user_sort = "";
	
	public static $vkontakte_fullshare = false;
	
	public static $internal_cache = array();
	
	public static $url_deactivate_share_running = false;
	public static $url_deactivate_share = array();
	
	public static $url_deactivate_full_running = false;
	public static $url_deactivate_full = array();
	
	/**
	 * load
	 * 
	 * Load global plugin settings for single call use
	 * 
	 * @param array $options
	 * @since 3.4.1
	 */
	public static function load($options = array()) {
		self::$counter_total_text = essb_options_value( 'counter_total_text' );
		if (empty(self::$counter_total_text)) {
			self::$counter_total_text = esc_html__('Total', 'essb');
		}
		
		self::$counter_total_text_shares = essb_option_value('activate_total_counter_text');
		if (empty(self::$counter_total_text_shares)) {
			self::$counter_total_text_shares = esc_html__('shares', 'essb');
		}
		
		self::$counter_total_text_share = essb_option_value('activate_total_counter_text_singular');
		if (empty(self::$counter_total_text_share)) {
			self::$counter_total_text_share = esc_html__('share', 'essb');
		}
		
		self::$counter_total_icon = essb_option_value('activate_total_counter_icon');
		if (empty(self::$counter_total_icon)) {
			self::$counter_total_icon = 'share-tiny';
		}
		
		self::$button_counter_hidden_till = essb_options_value( 'button_counter_hidden_till' );
		self::$mycred_group = essb_options_value( 'mycred_group', 'mycred_default' );
		self::$mycred_points = essb_options_value( 'mycred_points', '1' );
		self::$more_button_icon = essb_options_value( 'more_button_icon' );
		self::$comments_address = essb_options_value( 'comments_address' );
		if (empty(self::$comments_address)) {
			self::$comments_address = '#comments';
		}
		self::$use_rel_me = essb_options_bool_value( 'use_rel_me' );
		self::$use_rel_noopener = essb_options_bool_value( 'use_rel_noopener' );
		self::$essb_encode_text = essb_options_bool_value( 'essb_encode_text' );
		self::$essb_encode_url = essb_options_bool_value( 'essb_encode_url' );
		self::$essb_encode_text_plus = essb_options_bool_value( 'essb_encode_text_plus' );
		self::$print_use_printfriendly = essb_options_bool_value( 'print_use_printfriendly' );
		self::$pinterest_sniff_disable = essb_options_bool_value( 'pinterest_sniff_disable' );
		self::$twitter_message_optimize = essb_options_bool_value( 'twitter_message_optimize' );
		self::$sidebar_pos = essb_option_value('sidebar_pos');
		
		self::$fbmessengerapp = essb_option_value('fbmessengerapp');
		
		self::$telegram_alternative = essb_options_bool_value('telegram_alternative');
		
		// @since 3.5 - runtime cache via WordPress functions
		self::$cache_runtime = essb_options_bool_value('essb_cache_runtime');
		
		$personalized_networks = essb_get_active_social_networks_by_position('mobile');
		$personalized_network_order = essb_get_order_of_social_networks_by_position('mobile');
		
		// added in @since 3.4.2
		if (is_array($personalized_networks) && count($personalized_networks) > 0) {
			self::$mobile_networks = $personalized_networks;
			self::$mobile_networks_active = true;
		}
		
		if (is_array($personalized_network_order) && count($personalized_network_order) > 0) {
			self::$mobile_networks_order = $personalized_network_order;
			self::$mobile_networks_order_active = true;
		}
		
		self::$subscribe_function = essb_options_value( 'subscribe_function' );
		self::$subscribe_link = essb_options_value( 'subscribe_link' );
		self::$subscribe_content = stripslashes(essb_options_value( 'subscribe_content' ));
		
		self::$use_minified_css = essb_options_bool_value('use_minified_css');
		self::$use_minified_js = essb_options_bool_value('use_minified_js');
		
		// demo mode subscribe function
		if (isset($_REQUEST['essb_subscribe']) && ESSB3_DEMO_MODE) {
			self::$subscribe_function = $_REQUEST['essb_subscribe'];
		}
		
		self::$cached_counters_cache_mode = essb_options_bool_value('cache_counter_refresh_cache');
		self::$user_sort = essb_option_value('user_sort');
		
		/**
		 * Setup global option to deactivate plugin features based on specific URL
		 */
		$url_deactivate_share = essb_option_value('url_deactivate_share');
		if (!empty($url_deactivate_share)) {
			self::$url_deactivate_share = explode( "\n", $url_deactivate_share );
			self::$url_deactivate_share = array_map( 'trim', self::$url_deactivate_share );
			self::$url_deactivate_share = array_map( 'esc_url', self::$url_deactivate_share );
			self::$url_deactivate_share = array_filter(self::$url_deactivate_share);
			self::$url_deactivate_share = array_unique(self::$url_deactivate_share);
			self::$url_deactivate_share_running = true;
		}
		
		$url_deactivate_full = essb_option_value('url_deactivate_full');
		if (!empty($url_deactivate_full)) {
			self::$url_deactivate_full = explode( "\n", $url_deactivate_full );
			self::$url_deactivate_full = array_map( 'trim', self::$url_deactivate_full );
			self::$url_deactivate_full = array_map( 'esc_url', self::$url_deactivate_full );
			self::$url_deactivate_full = array_filter(self::$url_deactivate_full);
			self::$url_deactivate_full = array_unique(self::$url_deactivate_full);
			self::$url_deactivate_full_running = true;
		}
	}
	
}