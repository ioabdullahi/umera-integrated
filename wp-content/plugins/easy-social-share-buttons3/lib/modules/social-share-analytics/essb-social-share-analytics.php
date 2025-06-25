<?php

class ESSBSocialShareAnalytics {
	
	private static $instance = null;
	
	public static function instance() {
	
		if ( null == self::$instance ) {
			self::$instance = new self;
		}
	
		return self::$instance;
	
	} // end get_instance;
	
	function __construct() {
		add_action ( 'wp_ajax_nopriv_essb_stat_log', array ($this, 'log_click' ) );
		add_action ( 'wp_ajax_essb_stat_log', array ($this, 'log_click' ) );		
		
		add_filter( 'essb_extend_ajax_options', function($settings) {
		    $settings['internal_stats'] = true;
		    
		    return $settings;
		});
	}
	
	public function log_click() {
		global $wpdb, $blog_id;
		
		$post_id = isset($_POST["post_id"]) ? $_POST["post_id"] : '';
		$service_id = isset($_POST["service"]) ? $_POST["service"] : '';
		$template = isset($_POST['template']) ? $_POST['template'] : '';
		$mobile = isset($_POST['mobile']) ? $_POST['mobile'] : '';
		$position = isset($_POST['position']) ? $_POST['position'] : '';
		$button_style = isset($_POST['button']) ? $_POST['button'] : '';
		$counters = isset($_POST['counter']) ? $_POST['counter'] : '';
		
		$rows_affected = $wpdb->insert ( $wpdb->prefix.ESSB3_TRACKER_TABLE, 
				array ('essb_blog_id' => sanitize_text_field($blog_id), 
						'essb_post_id' => sanitize_text_field($post_id), 
						'essb_service' => sanitize_text_field($service_id),
						'essb_mobile' => sanitize_text_field($mobile),
						'essb_position' => sanitize_text_field($position),
						'essb_template' => sanitize_text_field($template),
						'essb_button' => sanitize_text_field($button_style) ) );
		sleep ( 1 );
		die ( json_encode ( array ("success" => 'Log handled' ) ) );
		
	}
		
}

?>
