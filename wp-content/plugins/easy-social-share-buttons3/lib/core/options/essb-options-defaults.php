<?php

global $essb_avaiable_button_style;
global $essb_available_button_positions, $essb_avaliable_content_positions;

global $essb_available_button_positions_mobile, $essb_avaliable_content_positions_mobile, $essb_avaiable_total_counter_position_mobile,
	$essb_available_social_profiles;



if (!function_exists('essb_default_native_buttons')) {
	function essb_default_native_buttons()
	{
		$essb_default_native_buttons = array();
		$essb_default_native_buttons[] = 'facebook';
		$essb_default_native_buttons[] = 'twitter';
		$essb_default_native_buttons[] = 'linkedin';
		$essb_default_native_buttons[] = 'pinterest';
		$essb_default_native_buttons[] = 'youtube';
		$essb_default_native_buttons[] = 'managewp';
		$essb_default_native_buttons[] = 'vk';

		return $essb_default_native_buttons;
	}
}

if (!function_exists('essb_available_tempaltes')) {
	/**
	 * Bridge to deprecated function essb_available_templates removed
	 * from version 4.0
	 * 
	 * @param boolean $add_default_options
	 * @author appscreo
	 * @since 4.2
	 */
	function essb_available_tempaltes($add_default_options = false)
	{
		return essb_available_tempaltes4($add_default_options);
	}
}

if (!function_exists('essb_available_tempaltes4')) {
	function essb_available_tempaltes4($add_default_option = false)
	{
		$essb_available_tempaltes = array();
		if ($add_default_option) {
			$essb_available_tempaltes[''] = esc_html__('Default template from settings', 'essb');
		}
		$essb_available_tempaltes['6'] = 'Metro (Retina)';
		$essb_available_tempaltes['7'] = 'Big (Retina)';
		$essb_available_tempaltes['8'] = 'Light (Retina)';
		$essb_available_tempaltes['9'] = 'Flat (Retina)';
		$essb_available_tempaltes['10'] = 'Tiny (Retina)';
		$essb_available_tempaltes['11'] = 'Round (Retina)';
		$essb_available_tempaltes['12'] = 'Modern (Retina)';
		$essb_available_tempaltes['13'] = 'Circles (Retina)';
		$essb_available_tempaltes['14'] = 'Blocks (Retina)';
		$essb_available_tempaltes['15'] = 'Dark (Retina)';
		$essb_available_tempaltes['16'] = 'Grey Circles (Retina)';
		$essb_available_tempaltes['17'] = 'Grey Blocks (Retina)';
		$essb_available_tempaltes['18'] = 'Clear (Retina)';
		$essb_available_tempaltes['19'] = 'Copy (Retina)';
		$essb_available_tempaltes['20'] = 'Dimmed (Retina)';
		$essb_available_tempaltes['21'] = 'Grey (Retina)';
		$essb_available_tempaltes['22'] = 'Default 3.0 (Retina)';
		$essb_available_tempaltes['23'] = 'Jumbo (Retina)';
		$essb_available_tempaltes['24'] = 'Jumbo Rounded (Retina)';
		$essb_available_tempaltes['25'] = 'Fancy (Retina)';
		$essb_available_tempaltes['26'] = 'Deluxe (Retina)';
		$essb_available_tempaltes['27'] = 'Modern Slim (Retina)';
		$essb_available_tempaltes['28'] = 'Bold (Retina)';
		$essb_available_tempaltes['29'] = 'Fancy Bold (Retina)';
		$essb_available_tempaltes['30'] = 'Retro (Retina)';
		$essb_available_tempaltes['31'] = 'Metro Bold (Retina)';

		$essb_available_tempaltes['32'] = 'Default 4.0 (Retina)';
		$essb_available_tempaltes['33'] = 'Clear Rounded (Retina)';
		$essb_available_tempaltes['34'] = 'Grey Fill (Retina)';
		$essb_available_tempaltes['35'] = 'White Fill (Retina)';
		$essb_available_tempaltes['36'] = 'White (Retina)';
		$essb_available_tempaltes['37'] = 'Grey Round (Retina)';
		$essb_available_tempaltes['38'] = 'Color Leafs (Retina)';
		$essb_available_tempaltes['39'] = 'Grey Leafs (Retina)';
		$essb_available_tempaltes['40'] = 'Color Circles Outline (Retina)';
		$essb_available_tempaltes['41'] = 'Color Blocks Outline (Retina)';
		$essb_available_tempaltes['42'] = 'Grey Circles Outline (Retina)';
		$essb_available_tempaltes['43'] = 'Grey Blocks Outline (Retina)';
		$essb_available_tempaltes['44'] = 'Dark Outline (Retina)';
		$essb_available_tempaltes['45'] = 'Dark Round Outline (Retina)';
		$essb_available_tempaltes['46'] = 'Classic (Retina)';
		$essb_available_tempaltes['47'] = 'Classic Round (Retina)';
		$essb_available_tempaltes['48'] = 'Classic Fancy (Retina)';
		$essb_available_tempaltes['49'] = 'Color Circles (Retina)';
		$essb_available_tempaltes['50'] = 'Massive (Retina)';

		$essb_available_tempaltes['51'] = 'Cut Off (Retina)';
		$essb_available_tempaltes['52'] = 'Color Cut Off (Retina)';
		$essb_available_tempaltes['53'] = 'Modern Light (Retina)';
		$essb_available_tempaltes['54'] = 'Tiny Color Circles Light (Retina)';
		$essb_available_tempaltes['55'] = 'Lollipop (Retina)';
		$essb_available_tempaltes['56'] = 'Rainbow (Retina)';
		$essb_available_tempaltes['57'] = 'Flow (Retina)';
		$essb_available_tempaltes['58'] = 'Flow Jump (Retina)';
		$essb_available_tempaltes['59'] = 'Glow (Retina)';

		if (has_filter('essb4_templates')) {
			$essb_available_tempaltes = apply_filters('essb4_templates', $essb_available_tempaltes);
		}

		return $essb_available_tempaltes;
	}
}



if (!function_exists('essb_available_social_networks')) {
	function essb_available_social_networks($always_show_all = false)
	{
		return ESSB_Share_Networks_Helper::get($always_show_all);
	}
}

if (!function_exists('essb_is_active_social_network')) {
	function essb_is_active_social_network($network)
	{
		return ESSB_Share_Networks_Helper::is_active($network);
	}
}

if (!function_exists('essb_update_available_share_networks_in_settings')) {
	add_filter('essb4_social_networks_update_list', 'essb_update_available_share_networks_in_settings');

	function essb_update_available_share_networks_in_settings($list_of_networks)
	{
		$current_networks = essb_available_social_networks();
		$all_networks = array();
		foreach ($current_networks as $network => $details) {
			$network_name = isset($details['name']) ? $details['name'] : $network;
			$key = $network . '|' . $network_name;

			if (!in_array($key, $list_of_networks)) {
				$list_of_networks[] = $key;
			}

			$all_networks[] = $key;
		}

		return $list_of_networks;
	}
}

if (!function_exists('essb_update_available_share_networks_in_order')) {
	add_filter('essb4_social_networks_update_order', 'essb_update_available_share_networks_in_order');

	function essb_update_available_share_networks_in_order($list_of_networks)
	{
		$current_networks = essb_available_social_networks();

		$all_networks = array();

		foreach ($current_networks as $network => $details) {
			if (!in_array($network, $list_of_networks)) {
				$list_of_networks[] = $network;
			}

			$all_networks[] = $network;
		}

		return $list_of_networks;
	}
}


if (!function_exists('essb_avaliable_counter_positions')) {
	function essb_avaliable_counter_positions()
	{
		$essb_avaliable_counter_positions = array();
		$essb_avaliable_counter_positions['hidden'] = 'Without single button counter';
		$essb_avaliable_counter_positions['left'] = 'Left';
		$essb_avaliable_counter_positions['right'] = 'Right';
		$essb_avaliable_counter_positions['inside'] = 'Inside button instead of network name';
		$essb_avaliable_counter_positions['insidem'] = 'Inside button instead of network name (mini)';
		$essb_avaliable_counter_positions['insidename'] = 'Inside button after network name';
		$essb_avaliable_counter_positions['insidenamem'] = 'Inside button after network name (mini)';
		$essb_avaliable_counter_positions['insidebeforename'] = 'Inside button before network name';
		$essb_avaliable_counter_positions['insidebeforenamem'] = 'Inside button before network name (mini)';
		$essb_avaliable_counter_positions['leftm'] = 'Left Modern';
		$essb_avaliable_counter_positions['rightm'] = 'Right Modern';
		$essb_avaliable_counter_positions['topm'] = 'Top Mini';
		$essb_avaliable_counter_positions['top'] = 'Top Modern';
		$essb_avaliable_counter_positions['bottom'] = 'Bottom';
		$essb_avaliable_counter_positions['topn'] = 'Top';
		$essb_avaliable_counter_positions['insidehover'] = 'Inside button and appear when you hover button over the network name';

		if (has_filter('essb_avaliable_counter_positions')) {
			$essb_avaliable_counter_positions = apply_filters('essb_avaliable_counter_positions', $essb_avaliable_counter_positions);
		}

		return $essb_avaliable_counter_positions;
	}
}

if (!function_exists('essb_avaiable_total_counter_position')) {
	function essb_avaiable_total_counter_position()
	{
		$essb_avaiable_total_counter_position = array();
		$essb_avaiable_total_counter_position['right'] = 'Right';
		$essb_avaiable_total_counter_position['left'] = 'Left';
		$essb_avaiable_total_counter_position['rightbig'] = 'Right Big Number (with option for custom text)';
		$essb_avaiable_total_counter_position['leftbig'] = 'Left Big Number (with option for custom text)';
		$essb_avaiable_total_counter_position['rightbigicon'] = 'Right Big Number with icon (with option for custom text)';
		$essb_avaiable_total_counter_position['leftbigicon'] = 'Left Big Number with icon (with option for custom text)';
		$essb_avaiable_total_counter_position['before'] = 'Before social share buttons';
		$essb_avaiable_total_counter_position['after'] = 'After social share buttons';
		$essb_avaiable_total_counter_position['hidden'] = 'This will hide the total counter and make only button counters be visible';

		if (has_filter('essb_avaiable_total_counter_position')) {
			$essb_avaiable_total_counter_position = apply_filters('essb_avaiable_total_counter_position', $essb_avaiable_total_counter_position);
		}

		return $essb_avaiable_total_counter_position;
	}
}

if (!function_exists('essb_avaiable_button_style')) {
	function essb_avaiable_button_style()
	{
		$essb_avaiable_button_style = array();
		$essb_avaiable_button_style['button'] = 'Display as share button with icon and network name';
		$essb_avaiable_button_style['button_name'] = 'Display as share button with network name and without icon';
		$essb_avaiable_button_style['icon'] = 'Display share buttons only as icon without network names';
		$essb_avaiable_button_style['icon_hover'] = 'Display share buttons as icon with network name appear when button is pointed';
		$essb_avaiable_button_style['vertical'] = 'Display icon above network name (vertical buttons)';

		if (has_filter('essb_avaiable_button_style')) {
			$essb_avaiable_button_style = apply_filters('essb_avaiable_button_style', $essb_avaiable_button_style);
		}

		return $essb_avaiable_button_style;
	}
}

if (!function_exists('essb_avaliable_content_positions')) {
	function essb_avaliable_content_positions()
	{
		$essb_avaliable_content_positions = array();
		$essb_avaliable_content_positions['content_top'] = array('image' => 'assets/images/display-positions-02.png', 'label' => 'Content top');
		$essb_avaliable_content_positions['content_bottom'] = array('image' => 'assets/images/display-positions-03.png', 'label' => 'Content bottom');
		$essb_avaliable_content_positions['content_both'] = array('image' => 'assets/images/display-positions-04.png', 'label' => 'Content top and bottom');
		if (!essb_options_bool_value('deactivate_method_float')) {
			$essb_avaliable_content_positions['content_float'] = array('image' => 'assets/images/display-positions-05.png', 'label' => 'Float from content top');
			$essb_avaliable_content_positions['content_floatboth'] = array('image' => 'assets/images/display-positions-06.png', 'label' => 'Float from content top and bottom');
		}

		if (!essb_option_bool_value('deactivate_method_native')) {
			$essb_avaliable_content_positions['content_nativeshare'] = array('image' => 'assets/images/display-positions-07.png', 'label' => 'Native social buttons top, share buttons bottom');
			$essb_avaliable_content_positions['content_sharenative'] = array('image' => 'assets/images/display-positions-08.png', 'label' => 'Share buttons top, native buttons bottom');
		}
		$essb_avaliable_content_positions['content_manual'] = array('image' => 'assets/images/display-positions-09.png', 'label' => 'Manual display with shortcode only');

		if (has_filter('essb4_content_positions')) {
			$essb_avaliable_content_positions = apply_filters('essb4_content_positions', $essb_avaliable_content_positions);
		}			
		
		return $essb_avaliable_content_positions;
	}
}

if (!function_exists('essb_available_button_positions')) {
	function essb_available_button_positions()
	{
		$essb_available_button_positions = array();
		if (!essb_options_bool_value('deactivate_method_sidebar')) {
			$essb_available_button_positions['sidebar'] = array('image' => 'assets/images/display-positions-10.png', 'label' => 'Sidebar');
		}
		if (!essb_options_bool_value('deactivate_method_popup')) {
			$essb_available_button_positions['popup'] = array('image' => 'assets/images/display-positions-11.png', 'label' => 'Pop up');
		}
		if (!essb_options_bool_value('deactivate_method_flyin')) {
			$essb_available_button_positions['flyin'] = array('image' => 'assets/images/display-positions-12.png', 'label' => 'Fly in');
		}
		if (!essb_options_bool_value('deactivate_method_postfloat')) {
			$essb_available_button_positions['postfloat'] = array('image' => 'assets/images/display-positions-13.png', 'label' => 'Post vertical float');
		}
		if (!essb_options_bool_value('deactivate_method_topbar')) {
			$essb_available_button_positions['topbar'] = array('image' => 'assets/images/display-positions-14.png', 'label' => 'Top bar');
		}
		if (!essb_options_bool_value('deactivate_method_bottombar')) {
			$essb_available_button_positions['bottombar'] = array('image' => 'assets/images/display-positions-15.png', 'label' => 'Bottom bar');
		}

		if (!essb_option_bool_value('deactivate_method_image')) {
			$essb_available_button_positions['onmedia'] = array('image' => 'assets/images/display-positions-16.png', 'label' => 'On media');
		}

		if (!essb_options_bool_value('deactivate_method_heroshare')) {
			$essb_available_button_positions['heroshare'] = array('image' => 'assets/images/display-positions-22.png', 'label' => 'Full screen hero share');
		}
		if (!essb_options_bool_value('deactivate_method_postbar')) {
			$essb_available_button_positions['postbar'] = array('image' => 'assets/images/display-positions-23.png', 'label' => 'Post share bar');
		}
		if (!essb_options_bool_value('deactivate_method_point')) {
			$essb_available_button_positions['point'] = array('image' => 'assets/images/display-positions-24.png', 'label' => 'Share Point (Advanced Version)');
		}

		if (!essb_options_bool_value('deactivate_method_booster')) {
			$essb_available_button_positions['booster'] = array('image' => 'assets/images/display-positions-24.png', 'label' => 'Share Booster');
		}

		$essb_available_button_positions['widget'] = array('image' => 'assets/images/display-positions-25.png', 'label' => 'Widget');

		if (has_filter('essb4_button_positions')) {
			$essb_available_button_positions = apply_filters('essb4_button_positions', $essb_available_button_positions);
		}


		return $essb_available_button_positions;
	}
}

if (!function_exists('essb_available_button_positions_mobile')) {
	function essb_available_button_positions_mobile()
	{
		$essb_available_button_positions_mobile = array();
		if (!essb_options_bool_value('deactivate_method_sidebar')) {
			$essb_available_button_positions_mobile['sidebar'] = array('image' => 'assets/images/display-positions-10.png', 'label' => 'Sidebar');
		}
		if (!essb_options_bool_value('deactivate_method_topbar')) {
			$essb_available_button_positions_mobile['topbar'] = array('image' => 'assets/images/display-positions-14.png', 'label' => 'Top bar');
		}
		if (!essb_options_bool_value('deactivate_method_bottombar')) {
			$essb_available_button_positions_mobile['bottombar'] = array('image' => 'assets/images/display-positions-15.png', 'label' => 'Bottom bar');
		}
		$essb_available_button_positions_mobile['sharebottom'] = array('image' => 'assets/images/display-positions-17.png', 'label' => 'Share buttons bar (Mobile Only Display Method)');
		$essb_available_button_positions_mobile['sharebar'] = array('image' => 'assets/images/display-positions-18.png', 'label' => 'Share bar (Mobile Only Display Method)');
		$essb_available_button_positions_mobile['sharepoint'] = array('image' => 'assets/images/display-positions-19.png', 'label' => 'Share point (Mobile Only Display Method)');
		if (!essb_options_bool_value('deactivate_method_point')) {
			$essb_available_button_positions_mobile['point'] = array('image' => 'assets/images/display-positions-24.png', 'label' => 'Share Point (Advanced Version)');
		}
		$essb_available_button_positions_mobile['widget'] = array('image' => 'assets/images/display-positions-25.png', 'label' => 'Widget');

		if (has_filter('essb4_button_positions_mobile')) {
			$essb_available_button_positions_mobile = apply_filters('essb4_button_positions_mobile', $essb_available_button_positions_mobile);
		}


		return $essb_available_button_positions_mobile;
	}
}

if (!function_exists('essb_available_social_profiles')) {
	function essb_available_social_profiles()
	{
		return ESSBSocialProfilesHelper::available_social_networks();
	}
}

if (!function_exists('essb_available_animations')) {
	function essb_available_animations($add_default = false)
	{
		$animations = array();
		$animations[''] = 'No animations';
		$animations['essb_button_animation_legacy1'] = 'Pop out';
		$animations['essb_button_animation_legacy2'] = 'Zoom out';
		$animations['essb_button_animation_legacy3'] = 'Flip';
		$animations['essb_button_animation_legacy4'] = 'Pop right';
		$animations['essb_button_animation_legacy5'] = 'Pop left';
		$animations['essb_button_animation_legacy6'] = 'Pop horizontal';

		$animations['essb_icon_animation1'] = 'Icon animation 1: Slide from right';
		$animations['essb_icon_animation2'] = 'Icon animation 2: Pop in';
		$animations['essb_icon_animation3'] = 'Icon animation 3: Fade in';
		$animations['essb_icon_animation4'] = 'Icon animation 4: Jump';
		$animations['essb_icon_animation5'] = 'Icon animation 5: Swing';
		$animations['essb_icon_animation6'] = 'Icon animation 6: Tada';
		$animations['essb_icon_animation7'] = 'Icon animation 7: Fade in from right';
		$animations['essb_icon_animation8'] = 'Icon animation 8: Fade in from left';
		$animations['essb_icon_animation9'] = 'Icon animation 9: Fade in from top';
		$animations['essb_icon_animation10'] = 'Icon animation 10: Fade in from bottom';
		$animations['essb_icon_animation11'] = 'Icon animation 11: Flash';
		$animations['essb_icon_animation12'] = 'Icon animation 12: Shake';
		$animations['essb_icon_animation13'] = 'Icon animation 13: Rubber band';
		$animations['essb_icon_animation14'] = 'Icon animation 14: Wooble';

		$animations['essb_button_animation1'] = 'Button animation 1: Slide from right';
		$animations['essb_button_animation2'] = 'Button animation 2: Pop in';
		$animations['essb_button_animation3'] = 'Button animation 3: Fade in';
		$animations['essb_button_animation4'] = 'Button animation 4: Jump';
		$animations['essb_button_animation5'] = 'Button animation 5: Swing';
		$animations['essb_button_animation6'] = 'Button animation 6: Tada';
		$animations['essb_button_animation7'] = 'Button animation 7: Fade in from right';
		$animations['essb_button_animation8'] = 'Button animation 8: Fade in from left';
		$animations['essb_button_animation9'] = 'Button animation 9: Fade in from top';
		$animations['essb_button_animation10'] = 'Button animation 10: Fade in from bottom';
		$animations['essb_button_animation11'] = 'Button animation 11: Flash';
		$animations['essb_button_animation12'] = 'Button animation 12: Shake';
		$animations['essb_button_animation13'] = 'Button animation 13: Rubber band';
		$animations['essb_button_animation14'] = 'Button animation 14: Wooble';

		return $animations;
	}
}

if (! function_exists('essb_cached_counters_update')) {
	function essb_cached_counters_update()
	{
		$periods = array();
		$periods[1] = 'Updated on 1 Minute';
		$periods[5] = 'Updated on 5 Minutes';
		$periods[10] = 'Updated on 10 Minutes';
		$periods[15] = 'Updated on 15 Minutes';
		$periods[30] = 'Updated on 30 Minutes';
		$periods[45] = 'Updated on 45 Minutes';
		$periods[60] = 'Updated on 1 Hour';
		$periods[120] = 'Updated on 2 Hours';
		$periods[180] = 'Updated on 3 Hours';
		$periods[240] = 'Updated on 4 Hours';
		$periods[300] = 'Updated on 5 Hours';
		$periods[360] = 'Updated on 6 Hours';
		$periods[540] = 'Updated on 9 Hours';
		$periods[720] = 'Updated on 12 Hours';
		$periods[1080] = 'Updated on 18 Hours';
		$periods[1440] = 'Updated on 1 Day';
		$periods[4320] = 'Updated on 3 Days';
		$periods[7200] = 'Updated on 5 Days';
		$periods[10800] = 'Updated on 7 Days';

		return $periods;
	}
}

if (! function_exists('essb_optin_designs')) {
	function essb_optin_designs()
	{
		$periods = array();
		$periods['design1'] = 'Design #1';
		$periods['design2'] = 'Design #2';
		$periods['design3'] = 'Design #3';
		$periods['design4'] = 'Design #4';
		$periods['design5'] = 'Design #5';
		$periods['design6'] = 'Design #6';
		$periods['design7'] = 'Design #7';
		$periods['design8'] = 'Design #8';
		$periods['design9'] = 'Design #9';

		/**
		 * Loading the form designer functios that are required to work and deal
		 * with load save and update. But load only if we have not done than in the past.
		 */
		if (! function_exists('essb5_get_form_designs')) {
			include_once(ESSB3_PLUGIN_ROOT . 'lib/admin/helpers/formdesigner-helper.php');
		}

		$user_designs = essb5_get_form_designs();
		$count = 0;
		foreach ($user_designs as $design) {
			$name = isset($design['name']) ? $design['name'] : 'Untitled Design';

			$periods['userdesign-' . $count] = $name;
			$count++;
		}

		return $periods;
	}
}
