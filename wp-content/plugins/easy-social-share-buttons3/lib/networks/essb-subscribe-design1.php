<?php
if (!function_exists('essb_subscribe_form_design1')) {
	function essb_subscribe_form_design1($salt, $is_widget = false, $position = '') {
		global $essb_options;
		
		$subscribe_mc_namefield = essb_object_bool_value($essb_options, 'subscribe_mc_namefield');
		
		// demo mode using name field
		$demo_mode_name = isset($_REQUEST['usename']) ? $_REQUEST['usename'] : '';
		if ($demo_mode_name == 'true') {
			$subscribe_mc_namefield = true;
		}
		
		$default_texts = array(
				"title" => esc_html__('Join our list', 'essb'),
				"text" => esc_html__('Subscribe to our mailing list and get interesting stuff and updates to your email inbox.', 'essb'),
				"email" => esc_html__('Enter your email here', 'essb'),
				"name" => esc_html__('Enter your name here', 'essb'),
				"button" => esc_html__('Sign Up Now', 'essb'),
				"footer" => esc_html__('We respect your privacy and take protecting it seriously', 'essb'),
				"success" => esc_html__('Thank you for subscribing.', 'essb'),
				"error" => esc_html__('Something went wrong.', 'essb')
				);
		
		$subscribe_mc_title = essb_object_value($essb_options, 'subscribe_mc_title');
		$subscribe_mc_text = essb_object_value($essb_options, 'subscribe_mc_text');
		$subscribe_mc_email = essb_object_value($essb_options, 'subscribe_mc_email');
		$subscribe_mc_name = essb_object_value($essb_options, 'subscribe_mc_name');
		$subscribe_mc_button = essb_object_value($essb_options, 'subscribe_mc_button');
		$subscribe_mc_footer = essb_object_value($essb_options, 'subscribe_mc_footer');
		$subscribe_mc_success = essb_object_value($essb_options, 'subscribe_mc_success');
		$subscribe_mc_error = essb_object_value($essb_options, 'subscribe_mc_error');
		
		$subscribe_mc_title = stripslashes($subscribe_mc_title);
		$subscribe_mc_text = stripslashes($subscribe_mc_text);
		$subscribe_mc_email = stripslashes($subscribe_mc_email);
		$subscribe_mc_name = stripslashes($subscribe_mc_name);
		$subscribe_mc_button = stripslashes($subscribe_mc_button);
		$subscribe_mc_footer = stripslashes($subscribe_mc_footer);
		$subscribe_mc_success = stripslashes($subscribe_mc_success);
		$subscribe_mc_error = stripslashes($subscribe_mc_error);		
		
		if (empty($subscribe_mc_title)) $subscribe_mc_title = $default_texts['title'];
		if (empty($subscribe_mc_text)) $subscribe_mc_text = $default_texts['text'];
		if (empty($subscribe_mc_email)) $subscribe_mc_email = $default_texts['email'];
		if (empty($subscribe_mc_name)) $subscribe_mc_name = $default_texts['name'];
		if (empty($subscribe_mc_button)) $subscribe_mc_button = $default_texts['button'];
		if (empty($subscribe_mc_footer)) $subscribe_mc_footer = $default_texts['footer'];
		if (empty($subscribe_mc_success)) $subscribe_mc_success = $default_texts['success'];
		if (empty($subscribe_mc_error)) $subscribe_mc_error = $default_texts['error'];
		
		$subscribe_mc_title = do_shortcode($subscribe_mc_title);
		$subscribe_mc_text = do_shortcode($subscribe_mc_text);
		$subscribe_mc_footer = do_shortcode($subscribe_mc_footer);
		
		global $wp;
		$current_url = add_query_arg( $wp->query_string, '', home_url( $wp->request ) );
		
		$secure_nonce = wp_create_nonce('essb3_subscribe_nonce');
		$current_url = add_query_arg('essb3_subscribe_nonce', $secure_nonce, $current_url);
		
		$output = '<div class="essb-subscribe-form-content essb-subscribe-from-design1'.($is_widget ? " essb-subscribe-form-inwidget" :"").'" data-position="'.esc_attr($position).'" data-design="design1">';
		$output .= '<h4 class="essb-subscribe-form-content-title">'.wp_kses($subscribe_mc_title, ESSBNetworks_Subscribe::safe_html_tags()).'</h4>';
		$output .= '<p class="essb-subscribe-form-content-text">'.wp_kses($subscribe_mc_text, ESSBNetworks_Subscribe::safe_html_tags()).'</p>';
		
		// generating form output
		$output .= '<form action="'.esc_url(add_query_arg('essb-malchimp-signup', '1', $current_url)).'" method="post" class="essb-subscribe-from-content-form" id="essb-subscribe-from-content-form-mailchimp">';
		
		if ($subscribe_mc_namefield) {
			$output .= '<input class="essb-subscribe-form-content-name-field" type="text" value="" placeholder="'.esc_attr($subscribe_mc_name).'" name="mailchimp_name">';				
		}
		
		$output .= ESSBNetworks_Subscribe::generate_custom_fields();
		
		$output .= '<input class="essb-subscribe-form-content-email-field" type="text" value="" placeholder="'.esc_attr($subscribe_mc_email).'" name="mailchimp_email">';
		
		$output .= ESSBNetworks_Subscribe::generate_if_needed_agree_check();
		
		$output .= '<input class="submit" name="submit" type="submit" value="'.esc_attr($subscribe_mc_button).'" onclick="essb_ajax_subscribe(\''.$salt.'\', event);">';
		$output .= '</form>';

		$output .= '<div class="essb-subscribe-loader">
  <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
  <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
    <animateTransform attributeType="xml"
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="0.6s"
      repeatCount="indefinite"/>
    </path>
  </svg>
</div>';
		
		$output .= '<p class="essb-subscribe-form-content-success essb-subscribe-form-result-message">'.wp_kses($subscribe_mc_success, ESSBNetworks_Subscribe::safe_html_tags()).'</p>';
		$output .= '<p class="essb-subscribe-form-content-error essb-subscribe-form-result-message">'.ESSBNetworks_Subscribe::sanitize_html($subscribe_mc_error).'</p>';
		
		$output .= '<div class="clear"></div>';
		$output .= '<p class="essb-subscribe-form-content-footer">'.ESSBNetworks_Subscribe::sanitize_html($subscribe_mc_footer).'</p>';
		
		$output .= '</div>';
		
		return $output;
	}
}