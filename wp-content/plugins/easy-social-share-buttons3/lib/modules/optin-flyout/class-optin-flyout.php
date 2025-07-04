<?php
/**
 * Opt-in fly out display forms
 * 
 * @package EasySocialShareButtons
 * @since 5.0
 * @version 2.0
 * @author appscreo
 */

if (! defined ( 'ESSB3_OFOF_PLUGIN_ROOT' )) {
	define ( 'ESSB3_OFOF_PLUGIN_ROOT', ESSB3_PLUGIN_ROOT . 'lib/modules/optin-flyout/' );
}

if (! defined ( 'ESSB3_OFOF_PLUGIN_URL' )) {
	define ( 'ESSB3_OFOF_PLUGIN_URL', ESSB3_PLUGIN_URL . '/lib/modules/optin-flyout/' );
}

if (! defined ( 'ESSB3_OFOF_PLUGIN_BASE_NAME' )) {
	define ( 'ESSB3_OFOF_PLUGIN_BASE_NAME', plugin_basename ( __FILE__ ) );
}

if (! defined ( 'ESSB3_OFOF_OPTIONS_NAME' )) {
	define ( 'ESSB3_OFOF_OPTIONS_NAME', 'essb3-ofof' );
}

global $essb3ofof_options;

class ESSBOptinFlyout {
	private static $_instance;
	private $version = "2.0";
	
	function __construct() {
		
		global $essb3ofof_options;
		
		$essb3ofof_options = get_option ( ESSB3_OFOF_OPTIONS_NAME );		
		
		$demo_mode = isset($_REQUEST['optin_flyout']) ? $_REQUEST['optin_flyout'] : '';
		if ($demo_mode == 'true') {
			$essb3ofof_options['ofof_time'] = 'true';
			$essb3ofof_options['ofof_scroll'] = 'true';
			$essb3ofof_options['ofof_exit'] = 'true';
		}
		
		if ($this->option_bool_value ( 'ofof_time' ) || $this->option_bool_value ( 'ofof_scroll' ) || $this->option_bool_value ( 'ofof_exit' )) {
			add_action ( 'wp_footer', array (&$this, 'draw_forms' ), 99 );		
		}
	
	}
	
	function is_deactivated_on() {
		global $essb3ofof_options;
		
		if (is_admin ()) {
			return true;
		}
		
		if (is_search() || is_feed()) {
			return true;
		}
		
		$is_deactivated = false;
		$exclude_from = isset ( $essb3ofof_options ['ofof_exclude'] ) ? $essb3ofof_options ['ofof_exclude'] : '';
		if (! empty ( $exclude_from )) {
			$excule_from = explode ( ',', $exclude_from );
			
			$excule_from = array_map ( 'trim', $excule_from );
			if (in_array ( get_the_ID (), $excule_from, false )) {
				$is_deactivated = true;
			}
		}
		
		if ($this->option_bool_value('of_deactivate_homepage')) {
			if (is_home() || is_front_page()) {
				$is_deactivated = true;
			}
		}
		
		$posttypes = $this->option_value('posttypes');
		if (!is_array($posttypes)) {
		    $posttypes = array();
		}
		
		if (!empty($posttypes)) {
		    if (!is_singular($posttypes)) {
		        $is_deactivated = true;
		    }
		}
		
		
		return $is_deactivated;
	}
	
	
	public function option_value($param) {
		global $essb3ofof_options;
		
		$value = isset ( $essb3ofof_options [$param] ) ? $essb3ofof_options [$param] : '';
		
		return $value;
	}
	
	public function option_bool_value($param) {
		global $essb3ofof_options;
		
		$value = isset ( $essb3ofof_options [$param] ) ? $essb3ofof_options [$param] : '';
		
		if ($value == 'true') {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Get static instance of class
	 *
	 * @return ESSB_Manager
	 */
	public static function getInstance() {
		if (! (self::$_instance instanceof self)) {
			self::$_instance = new self ();
		}
		
		return self::$_instance;
	}
	
	/**
	 * Cloning disabled
	 */
	public function __clone() {
	}
	
	/**
	 * Serialization disabled
	 */
	public function __sleep() {
	}
	
	/**
	 * De-serialization disabled
	 */
	public function __wakeup() {
	}
	
	public function draw_forms() {
		
		if (essb_is_plugin_deactivated_on ()) {
			return;
		}
		
		if ($this->is_deactivated_on()) {
			return;
		}
		
		$ofof_single = $this->option_bool_value ( 'ofof_single' );
		$ofof_creditlink = false;
		
		if ($this->option_bool_value ( 'ofof_time' )) {
			$ofof_time_delay = $this->option_value ( 'ofof_time_delay' );
			$of_time_design = $this->option_value ( 'of_time_design' );
			$of_time_bgcolor = $this->option_value ( 'of_time_bgcolor' );
			
			if ($ofof_time_delay != '') {
				$callback = ' data-delay="' . esc_attr($ofof_time_delay) . '" data-single="' . esc_attr($ofof_single) . '"';
				$this->draw_form_code ( 'time', $of_time_design, $of_time_bgcolor, $callback, $ofof_creditlink );
			}
		}
		
		if ($this->option_bool_value ( 'ofof_scroll' )) {
			$ofof_scroll_percent = $this->option_value ( 'ofof_scroll_percent' );
			$of_scroll_design = $this->option_value ( 'of_scroll_design' );
			$of_scroll_bgcolor = $this->option_value ( 'of_scroll_bgcolor' );
			
			if ($ofof_scroll_percent != '') {
				$callback = ' data-scroll="' . esc_attr($ofof_scroll_percent) . '" data-single="' . esc_attr($ofof_single) . '"';
				$this->draw_form_code ( 'scroll', $of_scroll_design, $of_scroll_bgcolor, $callback, $ofof_creditlink );
			}
		}
		
		if ($this->option_bool_value ( 'ofof_exit' )) {
			$of_exit_design = $this->option_value ( 'of_exit_design' );
			$of_exit_bgcolor = $this->option_value ( 'of_exit_bgcolor' );
			$callback = ' data-exit="1" data-single="' . esc_attr($ofof_single) . '"';
			$this->draw_form_code ( 'exit', $of_exit_design, $of_exit_bgcolor, $callback, $ofof_creditlink );
		
		}
	}
	
	public function draw_form_code($event = '', $design = '', $overlay_color = '', $event_fire = '', $credit_link = false) {
		$output = '';
		
		/**
		 * @since 7.3.1
		 */
		$ofof_deactivate_mobile = $this->option_bool_value('ofof_deactivate_mobile');
		if (!$ofof_deactivate_mobile && essb_option_bool_value('subscribe_css_deactivate_mobile')) {
		    $ofof_deactivate_mobile = true;
		}
				
		$close_type = $this->option_value ( 'of_' . $event . '_close' );
		$close_color = $this->option_value ( 'of_' . $event . '_closecolor' );
		$close_text = $this->option_value ( 'of_' . $event . '_closetext' );
		
		$position = $this->option_value ( 'ofof_position' );
		
		$css_color = '';
		if ($close_color != '') {
			$css_color = ' style="color:' . esc_attr($close_color) . '!important;"';
		}
		
		if ($close_type == '') {
			$close_type = 'icon';
		}
		
		if ($close_text == '') {
			$close_text = esc_html__( "No thanks. I don't want.", 'essb' );
		}
		
		$output .= '<div class="essb-optinflyout essb-optinflyout-' . esc_attr($position) . ' essb-optinflyout-' . esc_attr($event) . ($ofof_deactivate_mobile ? ' essb-subscribe-mobile-hidden' : '') . '" ' . $event_fire . ' ' . ($overlay_color != '' ? ' style="background-color:' . esc_attr($overlay_color) . '!important;"' : '') . '>';
		
		if ($close_type == 'icon') {
		    $output .= '<div class="essb-optinflyout-close essb-optinflyout-closeicon" ' . $css_color . '>'.essb_svg_replace_font_icon('close').'</div>';
		}
		
		$output .= do_shortcode ( '[easy-subscribe design="' . $design . '" mode="mailchimp" conversion="flyout-'.$event.'"]' );
		if ($close_type != 'icon') {
			$output .= '<div class="essb-optinflyout-close essb-optinflyout-closetext" ' . esc_attr($css_color) . '>' . $close_text . '</div>';
		}
		if ($credit_link) {
			$output .= '<div class="promo">Powered by <a href="http://go.appscreo.com/essb" target="_blank">Best Social Sharing Plugin for WordPress</a> Easy Social Share Buttons</div>';
		}
		
		$output .= '</div>';
		
		echo $output;
	}
}

/**
 * main code *
 */
global $essb_ofof;
function essb_optin_flyout() {
	global $essb_ofof;
	
	if (! isset ( $essb_ofof )) {
		$essb_ofof = ESSBOptinFlyout::getInstance ();
	}
}

add_action ( 'init', 'essb_optin_flyout', 9 );