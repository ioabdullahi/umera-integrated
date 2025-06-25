<?php
if (!function_exists('essb_get_shortcode_options_sharable_quote')) {
	function essb_get_shortcode_options_sharable_quote() {
		$r = array();

		$r['tweet'] = array('type' => 'textarea', 'title' => esc_html__('Message', 'essb'));
		$r['user'] = array('type' => 'text', 'title' => esc_html__('Username to mention', 'essb'), 'description' => esc_html__('Username without the @ symbol. Leave blank to use the username from the global settings.', 'essb'));
		$r['hashtags'] = array('type' => 'text', 'title' => esc_html__('Hashtags', 'essb'), 'description' => esc_html__('In this field the hashtags list is added without the # symbol and separated with comma. Example: hashtag1,hashtag2. Leave blank to use the hashtags from the global settings', 'essb'));
		$r['url'] = array('type' => 'text', 'title' => esc_html__('Share URL', 'essb'), 'description' => esc_html__('Optional value if you didn\'t enable automatically URL adding in the Click to Share settings. You can also use it to overwrite the default URL.', 'essb'));
		$r['template'] = array('type' => 'select', 'title' => esc_html__('Template', 'essb'),
				'options' => array(
						'' => esc_html__('Default from settings', 'essb'),
						'light' => esc_html__('Light', 'essb'),
						'dark' => esc_html__('Dark', 'essb'),
						'qlite' => esc_html__('Quote', 'essb'),
						'modern' => esc_html__('Modern', 'essb'),
						'x' => esc_html__('X', 'essb'),
						'user' => esc_html__('User', 'essb')
				));		
		
		
		$r['via'] = array('type' => 'select', 'title' => esc_html__('Don\'t include username', 'essb'),
				'options' => array('' => 'Default', 'no' => esc_html__('No', 'essb'), 'yes' => esc_html__('Yes', 'essb')));
		$r['usehashtags'] = array('type' => 'select', 'title' => esc_html__('Don\'t include hashtags', 'essb'),
				'options' => array('' => 'Default', 'no' => esc_html__('No', 'essb'), 'yes' => esc_html__('Yes', 'essb')));
		
		return $r;
	}
}