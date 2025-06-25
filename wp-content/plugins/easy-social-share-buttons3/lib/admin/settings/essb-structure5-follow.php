<?php

/**
 * Social Followers Counter
 *
 * @package EasySocialShareButtons
 * @since 3.0
 */

if (class_exists('ESSBControlCenter')) {
	if (!essb_option_bool_value('deactivate_module_followers')) {
		if (essb_options_bool_value('fanscounter_active')) {
			ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-1', esc_html__('Settings', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-2', esc_html__('Networks', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-3', esc_html__('Floating Sidebar', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-5', esc_html__('Content Bar', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-4', esc_html__('Custom Layout Builder', 'essb'));

			if (!essb_option_bool_value('deactivate_custombuttons')) {
				ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-6', esc_html__('Custom Buttons', 'essb'));
			}
		} else {
			ESSBControlCenter::register_sidebar_section_menu('follow', 'follow-1', esc_html__('Settings', 'essb'));
		}
	}

	if (!essb_option_bool_value('deactivate_module_profiles')) {
		if (essb_option_bool_value('profiles_widget')) {
			ESSBControlCenter::register_sidebar_section_menu('profiles', 'profiles-1', esc_html__('Settings', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('profiles', 'profiles-2', esc_html__('Networks', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('profiles', 'profiles-3', esc_html__('Floating Sidebar', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('profiles', 'profiles-4', esc_html__('Content Bar', 'essb'));

			if (!essb_option_bool_value('deactivate_custombuttons')) {
				ESSBControlCenter::register_sidebar_section_menu('profiles', 'profiles-5', esc_html__('Custom Buttons', 'essb'));
			}
		} else {
			ESSBControlCenter::register_sidebar_section_menu('profiles', 'profiles-1', esc_html__('Settings', 'essb'));
		}
	}

	if (!essb_option_bool_value('deactivate_module_natives')) {
		if (essb_option_bool_value('native_active')) {
			ESSBControlCenter::register_sidebar_section_menu('natives', 'native-1', esc_html__('Networks', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('natives', 'native-2', esc_html__('Skinned Buttons', 'essb'));
			ESSBControlCenter::register_sidebar_section_menu('natives', 'native-3', esc_html__('Privacy Buttons', 'essb'));
		} else {
			ESSBControlCenter::register_sidebar_section_menu('natives', 'native-1', esc_html__('Settings', 'essb'));
		}
	}

	if (!essb_option_bool_value('deactivate_module_clicktochat')) {
		ESSBControlCenter::register_sidebar_section_menu('chat', 'clicktochat', esc_html__('Click to Chat Floating Button', 'essb'));
		ESSBControlCenter::register_sidebar_section_menu('chat', 'clicktochat-woo', esc_html__('Click to Chat WooCommerce Button', 'essb'));
		ESSBControlCenter::register_sidebar_section_menu('chat', 'clicktochat-manual', esc_html__('Click to Chat Manual Button', 'essb'));
	}
	
	if (!essb_option_bool_value('deactivate_module_skypechat')) {
		ESSBControlCenter::register_sidebar_section_menu('chat', 'skypechat', esc_html__('Skype Live Chat', 'essb'));
	}
}

if (!essb_option_bool_value('deactivate_module_followers')) {
	ESSBOptionsStructureHelper::menu_item('display', 'follow', esc_html__('Social Followers Counter', 'essb'), ' ti-heart', 'activate_first', 'follow-1');
	ESSBOptionsStructureHelper::submenu_item('follow', 'follow-1', esc_html__('Settings', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('follow', 'follow-2', esc_html__('Social Networks', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('follow', 'follow-3', esc_html__('Follow Me Sidebar', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('follow', 'follow-5', esc_html__('Follow Me Content Bar', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('follow', 'follow-4', esc_html__('Custom Layout Builder', 'essb'));
}

if (!essb_option_bool_value('deactivate_module_profiles')) {
	ESSBOptionsStructureHelper::menu_item('display', 'profiles', esc_html__('Social Profiles', 'essb'), ' ti-user', 'activate_first', 'profiles-1');
	ESSBOptionsStructureHelper::submenu_item('profiles', 'profiles-1', esc_html__('Settings', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('profiles', 'profiles-2', esc_html__('Social Networks', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('profiles', 'profiles-3', esc_html__('Profile Links as Sidebar', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('profiles', 'profiles-4', esc_html__('Profile Links Below Content', 'essb'));
}

if (!essb_option_bool_value('deactivate_module_natives')) {
	ESSBOptionsStructureHelper::menu_item('display', 'native', esc_html__('Like, Follow & Subscribe', 'essb'), ' ti-thumb-up', 'activate_first', 'native-1');
	ESSBOptionsStructureHelper::submenu_item('natives', 'native-1', esc_html__('Social Networks', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('natives', 'native-2', esc_html__('Skinned buttons', 'essb'));
	ESSBOptionsStructureHelper::submenu_item('natives', 'native-3', esc_html__('Social Privacy', 'essb'));
}

if (!essb_option_bool_value('deactivate_module_clicktochat')) {
	ESSBOptionsStructureHelper::menu_item('chat', 'clicktochat', esc_html__('Click To Chat (Floating Button)', 'essb'), 'ti-facebook');

	ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_activate', esc_html__('Enable Click to Chat floating button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'), '', '', 'true');

	if (essb_option_bool_value('click2chat_activate')) {

		essb_heading_with_related_section_open('chat', 'clicktochat', esc_html__('Appearance', 'essb'), '<i class="fa fa-sitemap"></i>');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_posttypes', esc_html__('Post types', 'essb'), esc_html__('Choose post types or leave blank to show on the entire website', 'essb'), ESSB_Plugin_Loader::supported_post_types(false, false), '', '', 'true');
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_deactivate_homepage', esc_html__('Deactivate display on homepage', 'essb'), esc_html__('Exclude display of function on home page of your site.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_exclude', esc_html__('Exclude display on', 'essb'), esc_html__('Exclude appearance on posts/pages with these IDs. Comma separated: "11, 15, 125".', 'essb'), '');
		essb_heading_with_related_section_close('chat', 'clicktochat');

		essb_heading_with_related_section_open('chat', 'clicktochat', esc_html__('Button Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_text', esc_html__('Text', 'essb'), esc_html__('Enter your custom text that will appear on the chat start button', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_subtitle', esc_html__('Additional text', 'essb'), esc_html__('Additional text appearing below the button text (smaller size)', 'essb'));
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat', 'click2chat_bgcolor', esc_html__('Background color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat', 'click2chat_color', esc_html__('Text color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat', 'click2chat_bgcolor_hover', esc_html__('Hover background color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat', 'click2chat_color_hover', esc_html__('Hover text color', 'essb'), '');
		$select_values = array(
			'whatsapp' => array('title' => 'WhatsApp Icon', 'content' => '<i class="essb_icon_whatsapp"></i>'),
			'comments' => array('title' => 'Chat Icon', 'content' => '<i class="essb_icon_comments"></i>'),
			'comment-o' => array('title' => 'Chat Icon', 'content' => '<i class="essb_icon_comment-o"></i>'),
			'messenger' => array('title' => 'Facebook Messenger Icon', 'content' => '<i class="essb_icon_messenger"></i>'),
			'telegram' => array('title' => 'Telegram Icon', 'content' => '<i class="essb_icon_telegram"></i>'),
			'viber' => array('title' => 'Viber Icon', 'content' => '<i class="essb_icon_viber"></i>')
		);
		ESSBOptionsStructureHelper::field_toggle('chat', 'clicktochat', 'click2chat_icon', esc_html__('Icon', 'essb'), '', $select_values);
		$more_options = array("right" => "Bottom Right", "left" => "Bottom Left");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_location', esc_html__('Location', 'essb'), '', $more_options);
		$more_options = array("rounded" => "Rounded corners", "round" => "Round", 'square' => 'Square');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_design', esc_html__('Shape', 'essb'), '', $more_options);
		$more_options = array("" => "Default", "s" => "Small", 'm' => 'Medium', 'l' => 'Large', 'xl' => 'Extra large');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_size', esc_html__('Size', 'essb'), '', $more_options);
		essb_heading_with_related_section_close('chat', 'clicktochat');

		essb_heading_with_related_section_open('chat', 'clicktochat', esc_html__('Window Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_welcome_text', esc_html__('Welcome title', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_welcome_desc', esc_html__('Welcome subtitle', 'essb'), '');
		$more_options = array("" => "Yes", "false" => "No");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operators_profile', esc_html__('Display profile photos (where available)', 'essb'), '', $more_options);
		essb_heading_with_related_section_close('chat', 'clicktochat');

		essb_heading_with_related_section_open('chat', 'clicktochat', esc_html__('Operators', 'essb'), '<i class="fa fa-users"></i>', '', true);

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat', esc_html__('Operator #1', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_operator1_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator1_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator1_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_operator1_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator1_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operator1_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat', 'click2chat_operator1_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator1_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat', esc_html__('Operator #2', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_operator2_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator2_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator2_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_operator2_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator2_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operator2_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat', 'click2chat_operator2_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator2_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat', esc_html__('Operator #3', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_operator3_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator3_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator3_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_operator3_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator3_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operator3_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat', 'click2chat_operator3_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator3_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat', esc_html__('Operator #4', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_operator4_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator4_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator4_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_operator4_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator4_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operator4_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat', 'click2chat_operator4_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator4_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat', esc_html__('Operator #5', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_operator5_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator5_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator5_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_operator5_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator5_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operator5_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat', 'click2chat_operator5_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator5_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat', esc_html__('Operator #6', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat', 'click2chat_operator6_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator6_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator6_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_operator6_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator6_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat', 'click2chat_operator6_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat', 'click2chat_operator6_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat', 'click2chat_operator6_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat');

		essb_heading_with_related_section_close('chat', 'clicktochat');
	}

	ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_activate', esc_html__('Enable Click to Chat WooCommerce button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'), '', '', 'true');

	if (essb_option_bool_value('click2chat_woo_activate')) {

		essb_heading_with_related_section_open('chat', 'clicktochat-woo', esc_html__('Button Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_text', esc_html__('Text', 'essb'), esc_html__('Enter your custom text that will appear on the chat start button', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_subtitle', esc_html__('Additional text', 'essb'), esc_html__('Additional text appearing below the button text (smaller size)', 'essb'));
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-woo', 'click2chat_woo_bgcolor', esc_html__('Background color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-woo', 'click2chat_woo_color', esc_html__('Text color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-woo', 'click2chat_woo_bgcolor_hover', esc_html__('Hover background color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-woo', 'click2chat_woo_color_hover', esc_html__('Hover text color', 'essb'), '');
		$select_values = array(
			'whatsapp' => array('title' => 'WhatsApp Icon', 'content' => '<i class="essb_icon_whatsapp"></i>'),
			'comments' => array('title' => 'Chat Icon', 'content' => '<i class="essb_icon_comments"></i>'),
			'comment-o' => array('title' => 'Chat Icon', 'content' => '<i class="essb_icon_comment-o"></i>'),
			'messenger' => array('title' => 'Facebook Messenger Icon', 'content' => '<i class="essb_icon_messenger"></i>'),
			'telegram' => array('title' => 'Telegram Icon', 'content' => '<i class="essb_icon_telegram"></i>'),
			'viber' => array('title' => 'Viber Icon', 'content' => '<i class="essb_icon_viber"></i>')
		);
		ESSBOptionsStructureHelper::field_toggle('chat', 'clicktochat-woo', 'click2chat_woo_icon', esc_html__('Icon', 'essb'), '', $select_values);
		$more_options = array("rounded" => "Rounded corners", "round" => "Round", 'square' => 'Square');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_design', esc_html__('Shape', 'essb'), '', $more_options);
		$more_options = array("" => "Default", "s" => "Small", 'm' => 'Medium', 'l' => 'Large', 'xl' => 'Extra large');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_size', esc_html__('Size', 'essb'), '', $more_options);
		essb_heading_with_related_section_close('chat', 'clicktochat-woo');

		essb_heading_with_related_section_open('chat', 'clicktochat-woo', esc_html__('Window Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_welcome_text', esc_html__('Welcome title', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_welcome_desc', esc_html__('Welcome subtitle', 'essb'), '');
		$more_options = array("" => "Yes", "false" => "No");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operators_profile', esc_html__('Display profile photos (where available)', 'essb'), '', $more_options);
		essb_heading_with_related_section_close('chat', 'clicktochat-woo');

		essb_heading_with_related_section_open('chat', 'clicktochat-woo', esc_html__('Operators', 'essb'), '<i class="fa fa-users"></i>', '', true);

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-woo', esc_html__('Operator #1', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_operator1_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator1_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator1_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_woo_operator1_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator1_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operator1_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-woo', 'click2chat_woo_operator1_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator1_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-woo');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-woo', esc_html__('Operator #2', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_operator2_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator2_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator2_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_woo_operator2_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator2_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operator2_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-woo', 'click2chat_woo_operator2_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator2_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-woo');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-woo', esc_html__('Operator #3', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_operator3_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator3_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator3_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_woo_operator3_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator3_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operator3_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-woo', 'click2chat_woo_operator3_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator3_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-woo');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-woo', esc_html__('Operator #4', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_operator4_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator4_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator4_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_woo_operator4_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator4_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operator4_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-woo', 'click2chat_woo_operator4_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator4_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-woo');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-woo', esc_html__('Operator #5', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_operator5_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator5_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator5_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_woo_operator5_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator5_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operator5_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-woo', 'click2chat_woo_operator5_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator5_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-woo');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-woo', esc_html__('Operator #6', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-woo', 'click2chat_woo_operator6_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator6_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator6_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_woo_operator6_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator6_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-woo', 'click2chat_woo_operator6_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-woo', 'click2chat_woo_operator6_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-woo', 'click2chat_woo_operator6_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-woo');

		essb_heading_with_related_section_close('chat', 'clicktochat-woo');
	}


	ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_activate', esc_html__('Enable Click to Chat Manual button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'), '', '', 'true');

	if (essb_option_bool_value('click2chat_manual_activate')) {
		ESSBOptionsStructureHelper::hint('chat', 'clicktochat-manual', '', 'To display the click to chat button you should place the following shortcode <code>[essb-click2chat]</code>', '', 'glowhelp');

		essb_heading_with_related_section_open('chat', 'clicktochat-manual', esc_html__('Button Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_text', esc_html__('Text', 'essb'), esc_html__('Enter your custom text that will appear on the chat start button', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_subtitle', esc_html__('Additional text', 'essb'), esc_html__('Additional text appearing below the button text (smaller size)', 'essb'));
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-manual', 'click2chat_manual_bgcolor', esc_html__('Background color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-manual', 'click2chat_manual_color', esc_html__('Text color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-manual', 'click2chat_manual_bgcolor_hover', esc_html__('Hover background color', 'essb'), '');
		ESSBOptionsStructureHelper::field_color('chat', 'clicktochat-manual', 'click2chat_manual_color_hover', esc_html__('Hover text color', 'essb'), '');
		$select_values = array(
			'whatsapp' => array('title' => 'WhatsApp Icon', 'content' => '<i class="essb_icon_whatsapp"></i>'),
			'comments' => array('title' => 'Chat Icon', 'content' => '<i class="essb_icon_comments"></i>'),
			'comment-o' => array('title' => 'Chat Icon', 'content' => '<i class="essb_icon_comment-o"></i>'),
			'messenger' => array('title' => 'Facebook Messenger Icon', 'content' => '<i class="essb_icon_messenger"></i>'),
			'telegram' => array('title' => 'Telegram Icon', 'content' => '<i class="essb_icon_telegram"></i>'),
			'viber' => array('title' => 'Viber Icon', 'content' => '<i class="essb_icon_viber"></i>')
		);
		ESSBOptionsStructureHelper::field_toggle('chat', 'clicktochat-manual', 'click2chat_manual_icon', esc_html__('Icon', 'essb'), '', $select_values);
		$more_options = array("rounded" => "Rounded corners", "round" => "Round", 'square' => 'Square');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_design', esc_html__('Shape', 'essb'), '', $more_options);
		$more_options = array("" => "Default", "s" => "Small", 'm' => 'Medium', 'l' => 'Large', 'xl' => 'Extra large');
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_size', esc_html__('Size', 'essb'), '', $more_options);
		essb_heading_with_related_section_close('chat', 'clicktochat-manual');

		essb_heading_with_related_section_open('chat', 'clicktochat-manual', esc_html__('Window Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_welcome_text', esc_html__('Welcome title', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_welcome_desc', esc_html__('Welcome subtitle', 'essb'), '');
		$more_options = array("" => "Yes", "false" => "No");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operators_profile', esc_html__('Display profile photos (where available)', 'essb'), '', $more_options);
		essb_heading_with_related_section_close('chat', 'clicktochat-manual');

		essb_heading_with_related_section_open('chat', 'clicktochat-manual', esc_html__('Operators', 'essb'), '<i class="fa fa-users"></i>', '', true);

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-manual', esc_html__('Operator #1', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_operator1_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator1_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator1_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_manual_operator1_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator1_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operator1_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-manual', 'click2chat_manual_operator1_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator1_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-manual');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-manual', esc_html__('Operator #2', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_operator2_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator2_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator2_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_manual_operator2_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator2_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operator2_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-manual', 'click2chat_manual_operator2_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator2_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-manual');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-manual', esc_html__('Operator #3', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_operator3_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator3_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator3_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_manual_operator3_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator3_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operator3_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-manual', 'click2chat_manual_operator3_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator3_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-manual');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-manual', esc_html__('Operator #4', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_operator4_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator4_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator4_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_manual_operator4_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator4_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operator4_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-manual', 'click2chat_manual_operator4_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator4_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-manual');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-manual', esc_html__('Operator #5', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_operator5_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator5_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator5_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_manual_operator5_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator5_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operator5_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-manual', 'click2chat_manual_operator5_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator5_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-manual');

		ESSBOptionsStructureHelper::panel_start('chat', 'clicktochat-manual', esc_html__('Operator #6', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('chat', 'clicktochat-manual', 'click2chat_manual_operator6_active', esc_html__('Enable operator', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator6_name', esc_html('Name', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator6_title', esc_html__('Title', 'essb'), '');
		ESSBControlCenter::set_description_inline('click2chat_manual_operator6_number');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator6_number', esc_html__('Contact data', 'essb'), esc_html__('Enter the contact data for the application you selected above. For WhatsApp, Viber, and Phone, enter the phone number (for example: +10000000000). For the email, enter an email address (for example: user@company.com).  For Facebook Messenger and Telegram, enter the profile link (for example: https://m.me/yourprofile or https://t.me/yourprofile).', 'essb'), '');
		$more_options = array("" => "WhatsApp", "viber" => "Viber", "email" => "Email", "phone" => "Phone", "messenger" => "Facebook Messenger", "telegram" => "Telegram");
		ESSBOptionsStructureHelper::field_select('chat', 'clicktochat-manual', 'click2chat_manual_operator6_app', esc_html__('Application', 'essb'), '', $more_options);
		ESSBOptionsStructureHelper::field_image('chat', 'clicktochat-manual', 'click2chat_manual_operator6_image', esc_html__('Profile image', 'essb'), '', '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'clicktochat-manual', 'click2chat_manual_operator6_text', esc_html__('Preset message (only for WhatsApp and Email)', 'essb'), esc_html__('This text will pre-populate the chat field. You can use [title] and [url] as variables to set the current page title and URL.', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('chat', 'clicktochat-manual');

		essb_heading_with_related_section_close('chat', 'clicktochat-manual');	}
}

if (!essb_option_bool_value('deactivate_module_skypechat')) {
	ESSBOptionsStructureHelper::menu_item('chat', 'skypechat', esc_html__('Skype Live Chat', 'essb'), 'ti-facebook');

	if (!ESSBActivationManager::isActivated()) {
		if (!ESSBActivationManager::isThemeIntegrated()) {
			ESSBOptionsStructureHelper::hint('chat', 'skypechat', esc_html__('Activate Plugin To Use This Feature', 'essb'), 'Hello! Please <a href="admin.php?page=essb_redirect_update&tab=update">activate your copy</a> of Easy Social Share Buttons for WordPress to unlock and use this feature.', 'fa24 fa fa-lock', 'glow');
		}
		else {
			ESSBOptionsStructureHelper::hint('chat', 'skypechat', esc_html__('Direct Customer Benefit ', 'essb'), sprintf(esc_html__('Access to one click ready made styles install is benefit for direct plugin customers. <a href="%s" target="_blank"><b>See all direct customer benefits</b></a>', 'essb'), ESSBActivationManager::getBenefitURL()), 'fa24 fa fa-lock', 'glow');
		}

	}
	else {
		ESSBOptionsStructureHelper::panel_start('chat', 'skypechat', esc_html__('Enable display of Skype Live Chat', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'skype_active', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));

		essb_heading_with_related_section_open('chat', 'skypechat', esc_html__('Appearance', 'essb'), '<i class="fa fa-sitemap"></i>');
		ESSBOptionsStructureHelper::field_select('chat', 'skypechat', 'skype_posttypes', esc_html__('Post types', 'essb'), esc_html__('Choose post types or leave blank to show on the entire website', 'essb'), ESSB_Plugin_Loader::supported_post_types(false, false), '', '', 'true');		
		ESSBOptionsStructureHelper::field_switch('chat', 'skypechat', 'skype_deactivate_homepage', esc_html__('Deactivate display on homepage', 'essb'), esc_html__('Exclude display of function on home page of your site.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'skypechat', 'skype_exclude', esc_html__('Exclude display on', 'essb'), esc_html__('Exclude appearance on posts/pages with these IDs. Comma separated: "11, 15, 125".', 'essb'), '');
		essb_heading_with_related_section_close('chat', 'skypechat');
		
		essb_heading_with_related_section_open('chat', 'skypechat', esc_html__('Settings', 'essb'), '<i class="fa fa-cog"></i>', '', true);
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'skypechat', 'skype_user', esc_html__('Your Skype UserID', 'essb'), esc_html__('Enter your user ID to start a chat with your visitors.', 'essb'));
		ESSBOptionsStructureHelper::field_select('chat', 'skypechat', 'skype_type', esc_html__('Chat Button Style', 'essb'), esc_html__('Choose the initial chat style.', 'essb'), array('bubble' => 'Chat Bubble', 'rounded' => 'Rounded Button With Text'));	
		ESSBOptionsStructureHelper::field_textbox_stretched('chat', 'skypechat', 'skype_text', esc_html__('Custom chat button text', 'essb'), esc_html__('The custom chat button text will appear only if you select a rounded button style.', 'essb'));
		essb_heading_with_related_section_close('chat', 'skypechat');
		ESSBOptionsStructureHelper::panel_end('chat', 'skypechat');
	}
}

if (!essb_option_bool_value('deactivate_module_natives')) {
	// native buttons
	if (essb_option_bool_value('native_active')) {
		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('Activate usage of native like, follow and subscribe buttons', 'essb'), esc_html__('Native social buttons are great way to encourage more like, shares and follows as they are easy recognizable by users. Usage of them may affect site loading speed because they add additional calls and code to page load once they are initialized. Use them with caution.', 'essb'), 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'native_active', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));
		ESSBOptionsStructureHelper::field_section_start_full_panels('natives', 'native-1');
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'otherbuttons_sameline', esc_html__('Display on same line', 'essb'), esc_html__('Activate this option to display native buttons on same line with the share buttons.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'allow_native_mobile', esc_html__('Allow display of native buttons on mobile devices', 'essb'), esc_html__('The native buttons are set off by default on mobile devices because they may affect speed of mobile site version. If you wish to use them on mobile devices set this option to <b>Yes</b>.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'allnative_counters', esc_html__('Activate native buttons counter', 'essb'), esc_html__('Activate this option to display counters for native buttons.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_section_end_full_panels('natives', 'native-1');
		ESSBOptionsStructureHelper::field_simplesort('natives', 'native-1', 'native_order', esc_html__('Drag and Drop change position of display', 'essb'), esc_html__('Change order of native button display', 'essb'), essb_default_native_buttons());

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('Facebook button', 'essb'), esc_html__('Include Facebook native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_section_start_full_panels('natives', 'native-1');
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'facebook_like_button', esc_html__('Include Facebook Like/Follow Button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'facebook_like_button_share', esc_html__('Include also Facebook Share Button', 'essb'), esc_html__('Since latest Facebook API changes like button makes only Like action. If you wish to allow users share we can recommend to activate this option too.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'facebook_like_button_api', esc_html__('My site already uses Facebook Api', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch_panel('natives', 'native-1', 'facebook_like_button_api_async', esc_html__('Load Facebook API asynchronous', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_panel('natives', 'native-1', 'facebook_like_button_width', esc_html__('Set custom width of Facebook like button to fix problem with not rendering correct. Value must be number without px in it.', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_panel('natives', 'native-1', 'facebook_like_button_height', esc_html__('Set custom height of Facebook like button to fix problem with not rendering correct. Value must be number without px in it.', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_panel('natives', 'native-1', 'facebook_like_button_margin_top', esc_html__('Set custom margin-top (to move up use negative value) of Facebook like button to fix problem with not rendering correct. Value must be number without px in it.', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_panel('natives', 'native-1', 'facebook_like_button_lang', esc_html__('Custom language code for you native Facebook button', 'essb'), esc_html__('If you wish to change your native Facebook button language code from English you need to enter here your own code like es_ES. Full list of code can be found here: <a href="https://www.facebook.com/translations/FacebookLocales.xml" target="_blank">https://www.facebook.com/translations/FacebookLocales.xml</a>', 'essb'));
		ESSBOptionsStructureHelper::field_section_end_full_panels('natives', 'native-1');
		$listOfOptions = array("like" => "Like page", "follow" => "Profile follow");

		ESSBOptionsStructureHelper::field_select('natives', 'native-1', 'facebook_like_type', esc_html__('Button type', 'essb'), esc_html__('Choose button type you wish to use.', 'essb'), $listOfOptions);
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'facebook_follow_profile', esc_html__('Facebook Follow Profile Page URL', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'custom_url_like_address', esc_html__('Custom Facebook like button address', 'essb'), esc_html__('Provide custom address in case you wish likes to be added to that page - example fan page. Otherwise likes will be counted to page where button is displayed.', 'essb'));
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('X (formerly Twitter) button', 'essb'), esc_html__('Include X (formerly Twitter) native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_switch('natives', 'native-1', 'twitterfollow', esc_html__('Twitter Tweet/Follow Button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		$listOfOptions = array("follow" => "Follow user", "tweet" => "Tweet");
		ESSBOptionsStructureHelper::field_select('natives', 'native-1', 'twitter_tweet', esc_html__('Button type', 'essb'), esc_html__('Choose button type you wish to use.', 'essb'), $listOfOptions);
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'twitterfollowuser', esc_html__('Twitter Follow User', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('YouTube button', 'essb'), esc_html__('Include YouTube native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_switch('natives', 'native-1', 'youtubesub', esc_html__('YouTube channel subscribe button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'youtubechannel', esc_html__('Channel ID', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('Pinterest button', 'essb'), esc_html__('Include Pinterest native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_switch('natives', 'native-1', 'pinterestfollow', esc_html__('Include Pinterest Pin/Follow Button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		$listOfOptions = array("follow" => "Profile follow", "pin" => "Pin button");
		ESSBOptionsStructureHelper::field_select('natives', 'native-1', 'pinterest_native_type', esc_html__('Button type', 'essb'), esc_html__('Choose button type you wish to use.', 'essb'), $listOfOptions);
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'pinterestfollow_disp', esc_html__('Text on button when follow type is selected', 'essb'), '');
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'pinterestfollow_url', esc_html__('Profile url when follow type is selected', 'essb'), esc_html__('Provide your Pinterest URL as it is seen at the browser, for example https://www.pinterest.com/appscreo.', 'essb'));
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('LinkedIn button', 'essb'), esc_html__('Include LinkedIn native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_switch('natives', 'native-1', 'linkedin_follow', esc_html__('Include LinkedIn button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'linkedin_follow_id', esc_html__('Company ID', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('ManagedWP button', 'essb'), esc_html__('Include ManagedWP native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_switch('natives', 'native-1', 'managedwp_button', esc_html__('Include ManagedWP.org Upvote Button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-1', esc_html__('VKontankte (vk.com) button', 'essb'), esc_html__('Include VKontankte (vk.com) native button in your site', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
		ESSBOptionsStructureHelper::field_switch('natives', 'native-1', 'vklike', esc_html__('Include VK.com Like Button', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-1', 'vklikeappid', esc_html__('VKontakte (vk.com) Application ID', 'essb'), esc_html__('If you don\'t have application id for your site you need to generate one on VKontakte (vk.com) Dev Site. To do this visit this page http://vk.com/dev.php?method=Like and follow instructions on page', 'essb'));
		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_end('natives', 'native-1');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-2', esc_html__('Activate usage of skinned native buttons', 'essb'), esc_html__('This option will hide
				native buttons inside nice flat style boxes and show them on
				hover.', 'essb'), 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'skin_native', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));

		$skin_list = array("flat" => "Flat", "metro" => "Metro");
		ESSBOptionsStructureHelper::field_select('natives', 'native-2', 'skin_native_skin', esc_html__('Native buttons skin', 'essb'), esc_html__('Choose skin for native buttons. It will be applied only when option above is activated.', 'essb'), $skin_list);

		foreach (essb_default_native_buttons() as $network) {
			ESSBOptionsStructureHelper::panel_start('natives', 'native-2', ESSBOptionsStructureHelper::capitalize($network), esc_html__('Skinned settings for that social network', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));

			ESSBOptionsStructureHelper::field_color('natives', 'native-2', 'skinned_' . $network . '_color', esc_html__('Skinned button color replace', 'essb'), '');
			ESSBOptionsStructureHelper::field_color('natives', 'native-2', 'skinned_' . $network . '_hovercolor', esc_html__('Skinned button hover color replace', 'essb'), '');
			ESSBOptionsStructureHelper::field_color('natives', 'native-2', 'skinned_' . $network . '_textcolor', esc_html__('Skinned button text color replace', 'essb'), '');
			ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-2', 'skinned_' . $network . '_text', esc_html__('Skinned button text replace', 'essb'), '');
			ESSBOptionsStructureHelper::field_textbox('natives', 'native-2', 'skinned_' . $network . '_width', esc_html__('Skinned button width replace', 'essb'), '', '', 'input60', 'fa-arrows-h', 'right');
			ESSBOptionsStructureHelper::panel_end('natives', 'native-2');
		}
		ESSBOptionsStructureHelper::panel_end('natives', 'native-2');

		ESSBOptionsStructureHelper::panel_start('natives', 'native-3', esc_html__('Activate social privacy native buttons', 'essb'), esc_html__('When used in social privacy mode native buttons will not load until user click and request their activation. Usage in this mode is great way to avoid delay of load when you use natives and also this is the only way to use them in countries where native buttons should be used in two-click mode', 'essb'), 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'native_privacy_active', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));
		foreach (essb_default_native_buttons() as $network) {
			ESSBOptionsStructureHelper::panel_start('natives', 'native-3', ESSBOptionsStructureHelper::capitalize($network), esc_html__('Privacy settings for that social network', 'essb'), 'fa21 fa fa-cogs', array("mode" => "toggle", "state" => "closed"));
			ESSBOptionsStructureHelper::field_textbox_stretched('natives', 'native-3', 'skinned_' . $network . '_privacy_text', esc_html__('Privacy button text replace', 'essb'), '');
			ESSBOptionsStructureHelper::field_textbox('natives', 'native-3', 'skinned_' . $network . '_privacy_width', esc_html__('Privacy button width replace', 'essb'), '', '', 'input60', 'fa-arrows-h', 'right');
			ESSBOptionsStructureHelper::panel_end('natives', 'native-3');
		}
		ESSBOptionsStructureHelper::panel_end('natives', 'native-3');
	} else {
		ESSBOptionsStructureHelper::field_component('natives', 'native-1', 'essb5_advanced_natives_activate_options', 'false');
	}
}

// Followers Counter
if (!essb_option_bool_value('deactivate_module_followers')) {
	ESSBOptionsStructureHelper::help('follow', 'follow-1', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/social-followers-counter-general-setup/', 'Adding Followers\' Counter on Your Site' => 'https://docs.socialsharingplugin.com/knowledgebase/adding-social-followers-counter-on-your-site/'));

	if (essb_option_bool_value('fanscounter_active')) {
		ESSBOptionsStructureHelper::panel_start('follow', 'follow-1', esc_html__('Enable Social Followers Counter', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'fanscounter_active', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-1', 'fanscounter_widget_deactivate', esc_html__('I will not use Followers Counter widget', 'essb'), esc_html__('Deactivate the sidebar widget for followers\' counter only. Recommended if you don\'t plan to use it for performance improvement.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-1', 'essb3fans_update', esc_html__('Data update period', 'essb'), '', ESSBSocialFollowersCounterHelper::available_cache_periods());
		ESSBOptionsStructureHelper::field_select('follow', 'follow-1', 'essb3fans_format', esc_html__('Number format', 'essb'), '', ESSBSocialFollowersCounterHelper::available_number_formats());
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-1', 'follow_alt_text', esc_html__('Include alternative text to the profile links', 'essb'), esc_html__('Recommended if you optimize your website for accessibility. It will add an alternative text showing the name of the social network.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-1', 'follow_rel_me', esc_html__('Add rel="me" instead of rel="nofollow" to the buttons', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));

		ESSBOptionsStructureHelper::field_switch('follow', 'follow-1', 'fanscounter_clear_on_save', esc_html__('Clear stored values on settings update', 'essb') . essb_generate_expert_badge(), esc_html__('This will remove all stored followers\' counter values when you save plugin settings. ', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-1', 'fanscounter_disable_cache', esc_html__('Disable values\' protection', 'essb') . essb_generate_expert_badge(), esc_html__('The plugin does not store the followers\' value if it is lower than the last one. Enabling this option will disable this protection.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-1', 'followers_log_update', esc_html__('Log counter update requests', 'essb') . essb_generate_expert_badge(), esc_html__('Save information for the last 99 requests for a counter update. That helps to detect potential configuration or connection problems.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));

		ESSBOptionsStructureHelper::field_heading('follow', 'follow-1', 'heading7', esc_html__('Social Networks', 'essb'), '', 'pb0', '<i class="ti-widget-alt"></i>');
		ESSBOptionsStructureHelper::holder_start('follow', 'follow-1', 'essb-related-heading7', '');

		ESSBOptionsStructureHelper::field_checkbox_list_sortable('follow', 'follow-1', 'essb3fans_networks', esc_html__('Select and order the social networks you will use on your website', 'essb'), '', ESSBSocialFollowersCounterHelper::available_social_networks(false));

		ESSBOptionsStructureHelper::holder_end('follow', 'follow-1');

		ESSBOptionsStructureHelper::panel_end('follow', 'follow-1');
		if (essb_option_bool_value('followers_log_update')) {
			ESSBOptionsStructureHelper::field_component('follow', 'follow-1', 'essb_followers_update_log_viewer', 'false');
		}

		ESSBOptionsStructureHelper::help('follow', 'follow-2', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/social-followers-counter-general-setup/#Additional_Network_Settings'));
		essb3_draw_fanscounter_settings('follow', 'follow-2');

		ESSBOptionsStructureHelper::help('follow', 'follow-3', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/adding-social-followers-counter-as-a-floating-sidebar/'));
		ESSBOptionsStructureHelper::panel_start('follow', 'follow-3', esc_html__('Enable Floating Sidebar', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'fanscounter_sidebar', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));
		$defaults = ESSBSocialFollowersCounterHelper::default_instance_settings();
		$followers_default_options = ESSBSocialFollowersCounterHelper::default_options_structure(true, $defaults);
		ESSBOptionsStructureHelper::field_select('follow', 'follow-3', 'essb3fans_sidebar_template', esc_html__('Template', 'essb'), esc_html__('Choose template that you will use on followers sidebar', 'essb'), $followers_default_options['template']['values']);
		ESSBOptionsStructureHelper::field_select('follow', 'follow-3', 'essb3fans_sidebar_animation', esc_html__('Apply animation', 'essb'), esc_html__('Animation is a great way to grab visitors attention', 'essb'), $followers_default_options['animation']['values']);
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-3', 'essb3fans_sidebar_nospace', esc_html__('Without space between buttons', 'essb'), esc_html__('Activate this option to connect follower buttons and remove tiny space between them.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-3', 'essb3fans_sidebar_orientation', esc_html__('Choose button layout style', 'essb'), esc_html__('Buttons can be horizontal or vertical. Choose the style that fits best into selected networks and site', 'essb'), array("h" => esc_html__("Horizontal", "essb"), "v" => esc_html__("Vertical", "essb")));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-3', 'essb3fans_sidebar_position', esc_html__('Choose position on screen', 'essb'), esc_html__('Choose position where you wish to appear sidebar display', 'essb'), array("left" => esc_html__("Left", "essb"), "right" => esc_html__("Right", "essb")));
		ESSBOptionsStructureHelper::field_textbox('follow', 'follow-3', 'essb3fans_sidebar_width', esc_html__('Customize width of button', 'essb'), esc_html__('We choose default optimal width that fits in almost all sites. In some cases based on text you may need to shrink or extend button. Use this field to enter custom width (example: 100)', 'essb'), '', 'input60', 'fa-arrows-h', 'right');

		ESSBOptionsStructureHelper::field_switch('follow', 'follow-3', 'essb3fans_sidebar_total', esc_html__('Display the total followers', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));

		essb_create_exclude_display_on('follow', 'follow-3', 'followers_sidebar');

		ESSBOptionsStructureHelper::panel_end('follow', 'follow-3');

		// Custom Layout Builder
		ESSBOptionsStructureHelper::help('follow', 'follow-4', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/creating-a-custom-layout-for-social-followers-counter/'));
		ESSBOptionsStructureHelper::panel_start('follow', 'follow-4', esc_html__('Create Custom Followers Counter Layout', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'fanscounter_layout', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));

		ESSBOptionsStructureHelper::panel_start('follow', 'follow-4', esc_html__('Header Cover Box', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-4', 'essb3fans_coverbox_show', esc_html__('Display cover box above networks', 'essb'), esc_html__('Set Yes to display the configured cover box.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-4', 'essb3fans_coverbox_style', esc_html__('Main style', 'essb'), esc_html__('Main style choose the accent color that will be used to draw texts', 'essb'), array('' => 'Light', 'dark' => 'Dark'));
		ESSBOptionsStructureHelper::field_color('follow', 'follow-4', 'essb3fans_coverbox_bg', esc_html__('Custom background color', 'essb'), esc_html__('Setup custom background color that will appear in the cover box.', 'essb'), '', 'true');

		ESSBOptionsStructureHelper::field_image('follow', 'follow-4', 'essb3fans_coverbox_profile', esc_html__('Profile image', 'essb'), esc_html__('Optional you can set a custom profile image that will appear', 'essb'), '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('follow', 'follow-4', 'essb3fans_coverbox_title', esc_html__('Title', 'essb'), esc_html__('Set own personalized title (shortcodes supported). Use [easy-total-followers] if you wish to display total number of followers in text', 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched('follow', 'follow-4', 'essb3fans_coverbox_desc', esc_html__('Description text', 'essb'), esc_html__('Appearing in smaller text below title (shortcodes supported). Use [easy-total-followers] if you wish to display total number of followers in text', 'essb'));

		ESSBOptionsStructureHelper::panel_end('follow', 'follow-4');

		//
		ESSBOptionsStructureHelper::field_select('follow', 'follow-4', 'essb3fans_layout_cols', esc_html__('Columns', 'essb'), esc_html__('Choose the number of columns that will be used for custom layout.', 'essb'), array('2' => '2 Columns', '3' => '3 Columns', '4' => '4 Columns', '5' => '5 Columns', '6' => '6 Columns'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-4', 'essb3fans_layout_total', esc_html__('Display total number of followers', 'essb'), esc_html__('Change option if you wish to make the total value appear.', 'essb'), array('' => 'Do not display total number block', 'top' => 'Block above networks', 'bottom' => 'Block below networks'));
		ESSBOptionsStructureHelper::hint('follow', 'follow-4', '', esc_html__('The custom layout will display social networks that you activate from global plugin settings along with their order. In the block size setup you will see netowrks appearing in the deafult order from settings.', 'essb'), 'fa21 ti-ruler-pencil', 'glowhint');

		$network_list = ESSBSocialFollowersCounterHelper::available_social_networks(false);
		foreach ($network_list as $key => $network) {
			ESSBOptionsStructureHelper::field_select_panel('follow', 'follow-4', 'essb3fans_layout_cols_' . $key, $network, '', array('' => 'Default column size from layout', '2' => '2 Columns', '3' => '3 Columns', '4' => '4 Columns', '5' => '5 Columns', '6' => '6 Columns'));
		}

		ESSBOptionsStructureHelper::panel_end('follow', 'follow-4');

		// Follow me bar
		ESSBOptionsStructureHelper::help('follow', 'follow-5', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/social-followers-showing-as-an-automatic-content-bar/'));
		ESSBOptionsStructureHelper::panel_start('follow', 'follow-5', esc_html__('Enable Post Content Bar', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'fanscounter_postbar', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));
		ESSBOptionsStructureHelper::hint('follow', 'follow-5', '', esc_html__('Display followers counter as a profile bar below the content of Posts only. If needed bar can be displayed manually with the shortcode [followme-bar].', 'essb'), '', 'glowhint');
		ESSBOptionsStructureHelper::panel_start('follow', 'follow-5', esc_html__('Content Above Buttons', 'essb'), '', '', array("mode" => "toggle", "state" => "closed", "css_class" => "essb-auto-open"));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-5', 'essb3fans_profile_c_show', esc_html__('Display cover box above networks', 'essb'), esc_html__('Set Yes to display the configured cover box.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-5', 'essb3fans_profile_c_style', esc_html__('Main style', 'essb'), esc_html__('Main style choose the accent color that will be used to draw texts', 'essb'), array('' => 'Light', 'dark' => 'Dark'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-5', 'essb3fans_profile_c_align', esc_html__('Align', 'essb'), esc_html__('Choose text and image alignment inside the cover box', 'essb'), array('' => 'Center (default)', 'left' => 'Left', 'right' => 'Right'));
		ESSBOptionsStructureHelper::field_color('follow', 'follow-5', 'essb3fans_profile_c_bg', esc_html__('Custom background color', 'essb'), esc_html__('Setup custom background color that will appear in the cover box.', 'essb'), '', 'true');
		ESSBOptionsStructureHelper::field_image('follow', 'follow-5', 'essb3fans_profile_c_profile', esc_html__('Profile image', 'essb'), esc_html__('Optional you can set a custom profile image that will appear', 'essb'), '', 'vertical1');
		ESSBOptionsStructureHelper::field_textbox_stretched('follow', 'follow-5', 'essb3fans_profile_c_title', esc_html__('Title', 'essb'), esc_html__('Set own personalized title (shortcodes supported). Use [easy-total-followers] if you wish to display total number of followers in text', 'essb'));
		ESSBOptionsStructureHelper::field_textarea('follow', 'follow-5', 'essb3fans_profile_c_desc', esc_html__('Description text', 'essb'), esc_html__('Appearing in smaller text below title (shortcodes supported). Use [easy-total-followers] if you wish to display total number of followers in text', 'essb'));
		ESSBOptionsStructureHelper::panel_end('follow', 'follow-5');

		ESSBOptionsStructureHelper::field_select('follow', 'follow-5', 'essb3fans_profile_cols', esc_html__('Columns', 'essb'), esc_html__('Choose the number of columns that will be used for custom layout.', 'essb'), array('' => 'Automatic', '2' => '2 Columns', '3' => '3 Columns', '4' => '4 Columns', '5' => '5 Columns', '6' => '6 Columns'));
		ESSBOptionsStructureHelper::field_select('follow', 'follow-5', 'essb3fans_profile_template', esc_html__('Template', 'essb'), esc_html__('Choose template that you will use on followers sidebar', 'essb'), $followers_default_options['template']['values']);
		ESSBOptionsStructureHelper::field_select('follow', 'follow-5', 'essb3fans_profile_animation', esc_html__('Apply animation', 'essb'), esc_html__('Animation is a great way to grab visitors attention', 'essb'), $followers_default_options['animation']['values']);
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-5', 'essb3fans_profile_nospace', esc_html__('Without space between buttons', 'essb'), esc_html__('Activate this option to connect follower buttons and remove tiny space between them.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-5', 'essb3fans_profile_notext', esc_html__('Without Follow Text', 'essb'), esc_html__('Set to Yes in case you need to remove the followers text below numbers.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('follow', 'follow-5', 'essb3fans_profile_nonumber', esc_html__('Without Follow Values', 'essb'), esc_html__('Set to Yes if you need to remove the number of followers (for example use it just as profile buttons).', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));

		ESSBOptionsStructureHelper::panel_end('follow', 'follow-5');

		if (!essb_option_bool_value('deactivate_custombuttons')) {
			ESSBOptionsStructureHelper::help('follow', 'follow-6', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/how-to-add-a-custom-button-in-the-network-list/'));
			essb_heading_with_related_section_open('follow', 'follow-6', esc_html__('Custom Follow Button', 'essb'), '<i class="ti-share"></i>');
			ESSBOptionsStructureHelper::field_switch('follow', 'follow-6', 'customprofilebuttons_enable', esc_html__('Enable custom follow buttons', 'essb'), esc_html__('You need to set this to Yes to see your custom network button in the list of social networks.', 'essb'), '', '', '', '', '', 'true');

			if (essb_option_bool_value('customprofilebuttons_enable')) {
				if (!ESSBActivationManager::isActivated()) {
					ESSBOptionsStructureHelper::hint('follow', 'follow-6', 'Unlock network import/export function', 'The custom networks support the import and export of a custom network button. The function can be used only if the plugin is fully activated with a direct purchase code. The function allows you to migrate custom buttons from one site to another. You can also use it to import networks from our HUB.', '', 'glowhint');
				}

				ESSBOptionsStructureHelper::field_component('follow', 'follow-6', 'essb_create_customfollowbuttons', 'true');
			}
			essb_heading_with_related_section_close('follow', 'follow-6');
		}
	} else {
		ESSBOptionsStructureHelper::field_component('follow', 'follow-1', 'essb5_advanced_followers_activate_options', 'false');
	}
}

// Profiles
if (!essb_option_bool_value('deactivate_module_profiles')) {
	ESSBOptionsStructureHelper::help('profiles', 'profiles-1', '', '', array('Help With Setup of Social Profiles' => 'https://docs.socialsharingplugin.com/knowledgebase/social-profile-links-general-setup/', 'Adding Social Profile Links' => 'https://docs.socialsharingplugin.com/knowledgebase/how-to-add-social-profile-links-on-your-site/'));

	if (essb_option_bool_value('profiles_widget')) {
		ESSBOptionsStructureHelper::panel_start('profiles', 'profiles-1', esc_html__('Enable Social Profile Links', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'profiles_widget', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));

		ESSBOptionsStructureHelper::field_checkbox_list_sortable('profiles', 'profiles-1', 'profile_networks', esc_html__('Select and order the social networks you will use on your website', 'essb'), esc_html__('Enable and order the global social profiles you will use on your site. Later you can automatically use them in shortcodes, widgets or automated displays. There are also shortcode & widgets that you can use to add other profiles (not listed in the settings).', 'essb'), ESSBSocialProfilesHelper::available_social_networks());
		ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-1', 'profiles_alt_text', esc_html__('Include alternative text to the profile links', 'essb'), esc_html__('Recommended if you optimize your website for accessibility. It will add an alternative text of all social profile links showing the name of the social network.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-1', 'profiles_rel_me', esc_html__('Add rel="me" instead of rel="nofollow" to the buttons', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::panel_end('profiles', 'profiles-1');

		ESSBOptionsStructureHelper::field_component('profiles', 'profiles-1', 'essb_profiles_shortcode_generator', 'false');


		ESSBOptionsStructureHelper::help('profiles', 'profiles-2', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/social-profile-links-general-setup/'));
		essb_prepare_social_profiles_fields('profiles', 'profiles-2');

		ESSBOptionsStructureHelper::help('profiles', 'profiles-3', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/how-to-add-social-profile-links-on-your-site/#Adding_Profile_Buttons_as_Floating_Sidebar'));

		ESSBOptionsStructureHelper::panel_start('profiles', 'profiles-3', esc_html__('Enable floating sidebar', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'profiles_display', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));

		$listOfOptions = array("left" => esc_html__("Left", "essb"), "right" => esc_html__("Right", "essb"), "topleft" => esc_html__("Top left", "essb"), "topright" => esc_html__("Top right", "essb"), "bottomleft" => esc_html__("Bottom left", "essb"), "bottomright" => esc_html__("Bottom right", "essb"));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-3', 'profiles_display_position', esc_html__('Floating sidebar position', 'essb'), '', $listOfOptions);
		ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-3', 'profiles_nospace', esc_html__('Remove spacing between buttons', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-3', 'profiles_template', esc_html__('Buttons template', 'essb'), '', ESSBSocialProfilesHelper::available_templates());
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-3', 'profiles_size', esc_html__('Button size', 'essb'), '', ESSBSocialProfilesHelper::available_sizes());
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-3', 'profiles_animation', esc_html__('Animation', 'essb'), '', ESSBSocialProfilesHelper::available_animations());

		essb_create_exclude_display_on('profiles', 'profiles-3', 'profiles_sidebar');

		ESSBOptionsStructureHelper::panel_end('profiles', 'profiles-3');

		ESSBOptionsStructureHelper::help('profiles', 'profiles-4', '', '', array('Help With Settings' => 'https://docs.socialsharingplugin.com/knowledgebase/how-to-add-social-profile-links-on-your-site/#Adding_Profile_Buttons_Automatically_Below_Content_of_Posts'));
		ESSBOptionsStructureHelper::panel_start('profiles', 'profiles-4', esc_html__('Enable display below post content', 'essb'), '', 'fa21 fa fa-cogs', array("mode" => "switch", 'switch_id' => 'profiles_post_display', 'switch_on' => esc_html__('Yes', 'essb'), 'switch_off' => esc_html__('No', 'essb')));

		ESSBOptionsStructureHelper::hint('profiles', 'profiles-4', '', esc_html__('The option will add automatically the profile bar you configure below the content of Posts only. You are able to add the bar manually anywhere inside code using the shortcode [profile-bar]. The shortcode will work no matter if the automatic showing bar is active or not (but you need at least to activate for the basic settings configured).', 'essb'), 'fa21 ti-ruler-pencil', 'glowhint');
		$listOfOptions = array("left" => esc_html__("Left", "essb"), "right" => esc_html__("Right", "essb"), "center" => esc_html__("Center", "essb"));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_align', esc_html__('Align content', 'essb'), esc_html__('Choose how the profile buttons and custom content (if used) will be aligned.', 'essb'), $listOfOptions);
		$listOfOptions = array("above" => esc_html__("Above Profile Buttons", "essb"), "left" => esc_html__("Along With Profile Buttons (on the same line)", "essb"));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_content_pos', esc_html__('Custom content position', 'essb'), esc_html__('Choose where the custom content will appear.', 'essb'), $listOfOptions);
		ESSBOptionsStructureHelper::field_wpeditor('profiles', 'profiles-4', 'profiles_post_content', esc_html__('Custom content', 'essb'), esc_html__('Set custom content appearing above profile buttons. If you does not wish such content simply leave it blank', 'essb'), 'htmlmixed');

		$listOfOptions = array(
			'' => 'Default',
			'full' => 'Fluid',
			'1' => '1 column',
			'2' => '2 columns',
			'3' => '3 columns',
			'4' => '4 columns',
			'5' => '5 columns',
			'6' => '6 columns'
		);
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_width', esc_html__('Profile buttons width', 'essb'), esc_html__('The fluid full width is not recommended if you are using a large amount of share buttons. There may not be enough space to show all buttons at same time.', 'essb'), $listOfOptions);
		$listOfOptions = array("left" => esc_html__("Left", "essb"), "right" => esc_html__("Right", "essb"), "center" => esc_html__("Center", "essb"));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_buttons_align', esc_html__('Align profile buttons', 'essb'), esc_html__('Choose how the profile buttons and custom content (if used) will be aligned.', 'essb'), $listOfOptions);
		ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-4', 'profiles_post_show_text', esc_html__('Show CTA texts', 'essb'), esc_html__('Set to Yes to make the buttons has icon and text filled inside settings', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-4', 'profiles_post_show_number', esc_html__('Show numbers', 'essb'), '', '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-4', 'profiles_post_nospace', esc_html__('Remove spacing between buttons', 'essb'), esc_html__('Activate this option to remove default space between share buttons.', 'essb'), '', esc_html__('Yes', 'essb'), esc_html__('No', 'essb'));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_template', esc_html__('Choose template that you will use for sidebar', 'essb'), esc_html__('Template assigned here will be used for sidebar and also for default template for widget and shortcodes if you use such. Each widget or shortcode includes options to personalize it.', 'essb'), ESSBSocialProfilesHelper::available_templates());
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_animation', esc_html__('Choose animation that you will use for sidebar', 'essb'), esc_html__('Animation assigned here will be used for sidebar and also for default template for widget and shortcodes if you use such. Each widget or shortcode includes options to personalize it.', 'essb'), ESSBSocialProfilesHelper::available_animations());
		$listOfOptions = array("" => esc_html__("Default", "essb"), "small" => esc_html__("Small", "essb"), "medium" => esc_html__("Medium", "essb"), "large" => esc_html__("Large", "essb"), "xlarge" => esc_html__("Extra Large", "essb"));
		ESSBOptionsStructureHelper::field_select('profiles', 'profiles-4', 'profiles_post_size', esc_html__('Profile buttons size', 'essb'), '', $listOfOptions);

		ESSBOptionsStructureHelper::field_component('profiles', 'profiles-4', 'essb_profiles_content_bar_hint', 'false');

		ESSBOptionsStructureHelper::panel_end('profiles', 'profiles-4');

		if (!essb_option_bool_value('deactivate_custombuttons')) {
			essb_heading_with_related_section_open('profiles', 'profiles-5', esc_html__('Custom Follow Button', 'essb'), '<i class="ti-share"></i>');
			ESSBOptionsStructureHelper::field_switch('profiles', 'profiles-5', 'customprofilebuttons_enable', esc_html__('Enable custom follow buttons', 'essb'), esc_html__('You need to set this to Yes to see your custom network button in the list of social networks.', 'essb'), '', '', '', '', '', 'true');

			if (essb_option_bool_value('customprofilebuttons_enable')) {
				if (!ESSBActivationManager::isActivated()) {
					ESSBOptionsStructureHelper::hint('profiles', 'profiles-5', 'Unlock network import/export function', 'The custom networks support the import and export of a custom network button. The function can be used only if the plugin is fully activated with a direct purchase code. The function allows you to migrate custom buttons from one site to another. You can also use it to import networks from our HUB.', '', 'glowhint');
				}
				ESSBOptionsStructureHelper::field_component('profiles', 'profiles-5', 'essb_create_customfollowbuttons', 'true');
			}
			essb_heading_with_related_section_close('profiles', 'profiles-5');
		}
	} else {
		ESSBOptionsStructureHelper::field_component('profiles', 'profiles-1', 'essb5_advanced_profiles_activate_options', 'false');
	}
}

function essb3_draw_fanscounter_settings($tab_id, $menu_id)
{
	$setting_fields = ESSBSocialFollowersCounterHelper::options_structure();
	$network_list = ESSBSocialFollowersCounterHelper::available_social_networks();

	/**
	 * Load the SVG icons if not present
	 */
	if (!class_exists('ESSB_SVG_Icons')) {
		include_once(ESSB3_CLASS_PATH . 'assets/class-svg-icons.php');
	}

	$networks_same_authentication = array();

	foreach ($network_list as $network => $title) {

		if (ESSBSocialFollowersCounterHelper::is_deprecated_network($network)) {
			continue;
		}

		$display_key = $network;
		if ($display_key == 'twitter') {
			$display_key = 'twitter-x';
		}

		ESSBOptionsStructureHelper::holder_start($tab_id, $menu_id, 'essb-followers-panel essb-followers-' . $network, 'essb-followers-' . $network);
		ESSBOptionsStructureHelper::panel_start($tab_id, $menu_id, $title, '', 'fa21 essbfc-icon essbfc-icon-' . $network, array("mode" => "toggle", "state" => "closed", 'svg_icon' => ESSB_SVG_Icons::get_icon($display_key == 'total' ? 'total_followers' : $display_key)));

		$default_options_key = $network;
		$is_extended_key = false;

		if (strpos($default_options_key, '_') !== false && $default_options_key != 'wp_posts' && $default_options_key != 'wp_comments' && $default_options_key != 'wp_users' && $default_options_key != 'subscribe_form') {
			$key_array = explode('_', $default_options_key);
			$default_options_key = $key_array[0];
			$is_extended_key = true;
		}

		$single_network_options = isset($setting_fields[$default_options_key]) ? $setting_fields[$default_options_key] : array();

		foreach ($single_network_options as $field => $options) {
			$field_id = "essb3fans_" . $network . "_" . $field;

			$field_type = isset($options['type']) ? $options['type'] : 'textbox';
			$field_text = isset($options['text']) ? $options['text'] : '';
			$field_description = isset($options['description']) ? $options['description'] : '';
			$field_values = isset($options['values']) ? $options['values'] : array();

			$is_authfield = isset($options['authfield']) ? $options['authfield'] : false;

			if ($is_extended_key && $is_authfield) {
				if (isset($networks_same_authentication[$default_options_key])) {
					continue;
				}
			}

			if ($field_type == "textbox") {
				ESSBOptionsStructureHelper::field_textbox_stretched($tab_id, $menu_id, $field_id, $field_text, $field_description);
				ESSBControlCenter::set_description_inline($field_id);
			}
			if ($field_type == "select") {
				ESSBOptionsStructureHelper::field_select($tab_id, $menu_id, $field_id, $field_text, $field_description, $field_values);
				ESSBControlCenter::set_description_inline($field_id);
			}
		}

		ESSBOptionsStructureHelper::panel_end($tab_id, $menu_id);
		ESSBOptionsStructureHelper::holder_end($tab_id, $menu_id);
	}
}

function essb_prepare_social_profiles_fields($tab_id, $menu_id)
{
	/**
	 * Load the SVG icons if not present
	 */
	if (!class_exists('ESSB_SVG_Icons')) {
		include_once(ESSB3_CLASS_PATH . 'assets/class-svg-icons.php');
	}

	foreach (essb_available_social_profiles() as $key => $text) {

		$display_key = $key;

		if (ESSBSocialFollowersCounterHelper::is_deprecated_network($key)) {
			continue;
		}

		if ($display_key == 'instgram') {
			$display_key = 'instagram';
		}

		if ($display_key == 'twitter') {
			$display_key = 'twitter-x';
		}


		ESSBOptionsStructureHelper::holder_start($tab_id, $menu_id, 'essb-profiles-panel essb-profiles-' . $display_key, 'essb-profiles-' . $display_key);
		ESSBOptionsStructureHelper::panel_start($tab_id, $menu_id, $text, '', 'fa21 essbfc-icon essbfc-icon-' . $display_key, array("mode" => "toggle", "state" => "closed", 'svg_icon' => ESSB_SVG_Icons::get_icon($display_key)));

		if ($key == 'subscribe_form') {
			ESSBOptionsStructureHelper::field_select($tab_id, $menu_id, 'profile_' . $key, esc_html__('Form design', 'essb'), '', essb_optin_designs());
		} else {
			ESSBOptionsStructureHelper::field_textbox_stretched($tab_id, $menu_id, 'profile_' . $key, esc_html__('Full address to profile', 'essb'), esc_html__('Enter address to your profile in social network', 'essb'));
		}
		ESSBOptionsStructureHelper::field_textbox_stretched($tab_id, $menu_id, 'profile_text_' . $key, esc_html__('Display text with icon', 'essb'), esc_html__('Enter custom text that will be displayed with link to your social profile. Example: Follow us on ' . $text, 'essb'));
		ESSBOptionsStructureHelper::field_textbox_stretched($tab_id, $menu_id, 'profile_count_' . $key, esc_html__('Display followers\' value (manually input the number or add a custom text)', 'essb'), '');
		ESSBOptionsStructureHelper::panel_end($tab_id, $menu_id);

		ESSBOptionsStructureHelper::holder_end($tab_id, $menu_id);
	}
}

function essb5_advanced_followers_activate_options()
{
	echo essb5_generate_code_advanced_activate_panel(
		esc_html__('Enable Social Followers Counter', 'essb'),
		esc_html__('Automatically show the number of followers for 30+ social networks with shortcode, widget, floating sidebar, content bar, page builder elements, etc. The correct display of followers requires activation of required access token and keys to receive the values.', 'essb'),
		'fanscounter_active',
		'',
		esc_html__('Enable', 'essb'),
		'fa fa-check',
		'ti-heart ao-lightblue-icon'
	);
}

function essb5_advanced_profiles_activate_options()
{
	echo essb5_generate_code_advanced_activate_panel(
		esc_html__('Enable Social Profile Links', 'essb'),
		esc_html__('Add a link to your social profiles with shortcode, widget, floating bar, content bar, etc.', 'essb'),
		'profiles_widget',
		'',
		esc_html__('Enable', 'essb'),
		'fa fa-check',
		'ti-id-badge ao-lightblue-icon'
	);
}

function essb5_advanced_natives_activate_options()
{
	echo essb5_generate_code_advanced_activate_panel(
		esc_html__('Enable Native Social Buttons', 'essb'),
		esc_html__('Use selected native social buttons along with your share buttons', 'essb'),
		'native_active',
		'',
		esc_html__('Enable', 'essb'),
		'fa fa-check',
		'ti-thumb-up ao-lightblue-icon'
	);
}


/**
 * Creating custom buttons code
 */

function essb_create_customfollowbuttons($options = array())
{

	echo '<div class="essb-flex-grid-r">';
	echo '<a href="#" class="ao-new-subscribe-design ao-new-followcustom-button" data-title="' . esc_html__('New Custom Button', 'essb') . '"><span class="essb_icon fa fa-plus-square"></span><span>' . esc_html__('Create new custom button', 'essb') . '</span></a>';

	if (ESSBActivationManager::isActivated()) {
		echo '<a href="#" class="ao-new-subscribe-design ao-import-followcustom-button" data-title="' . esc_html__('Import Custom Button', 'essb') . '"><span class="essb_icon fa fa-cloud-upload"></span><span>' . esc_html__('Import', 'essb') . '</span></a>';
	}
	echo '<a href="#" class="ao-new-subscribe-design ao-deleteall-followcustom-button" data-title="' . esc_html__('Delete All', 'essb') . '"><span class="essb_icon fa fa-close"></span><span>' . esc_html__('Remove All', 'essb') . '</span></a>';

	echo '<a href="https://socialsharingplugin.com/library/?mode=profile" target="_blank" class="ao-new-subscribe-design ao-hub-followcustom-button" data-title="' . esc_html__('Go to HUB', 'essb') . '"><span class="essb_icon fa fa-database"></span><span>' . esc_html__('Get more networks', 'essb') . '</span></a>';

	echo '</div>';

	if (! function_exists('essb_get_custom_profile_buttons')) {
		include_once(ESSB3_PLUGIN_ROOT . 'lib/admin/helpers/customprofilebuttons-helper.php');
	}

	$user_buttons = essb_get_custom_profile_buttons();
	echo '<div class="essb-custom-button-list">';
	foreach ($user_buttons as $id => $data) {
		$name = isset($data['name']) ? $data['name'] : 'Untitled Button';
		$icon = isset($data['icon']) ? $data['icon'] : '';
		$bgcolor = isset($data['accent_color']) ? $data['accent_color'] : '';
		$iconcolor = '#fff';

		if ($icon != '') {
			$icon = base64_decode($icon);
		}

		$description = '';

		if ($icon != '') {
			$description = '<div class="icon custom-network-' . $id . '">' . stripslashes($icon) . '</div>';

			if ($bgcolor != '' || $iconcolor != '') {
				$description .= '<style>';
				if ($bgcolor != '') {
					$description .= '.custom-network-' . $id . ' {background-color: ' . esc_attr($bgcolor) . ';}';
				}

				if ($iconcolor != '') {
					$description .= '.custom-network-' . $id . ' svg path {fill: ' . esc_attr($iconcolor) . '!important;}';
				}
				$description .= '</style>';
			}
		}

		$custom_buttons = '<a href="#" class="essb-btn tile-config ao-new-followcustom-button" data-network="' . $id . '" data-title="Manage Existing Button"><i class="fa fa-cog"></i>' . esc_html__('Edit', 'essb') . '</a>';
		$custom_buttons .= '<a href="#" class="essb-btn tile-deactivate ao-remove-followcustom-button" data-network="' . $id . '" data-title="Remove Existing Button"><i class="fa fa-close"></i>' . esc_html__('Remove', 'essb') . '</a>';
		if (ESSBActivationManager::isActivated()) {
			$custom_buttons .= '<a href="#" class="essb-btn tile-general ao-export-followcustom-button" data-network="' . $id . '" data-title="Export Existing Button"><i class="fa fa-cloud-download"></i>' . esc_html__('Export', 'essb') . '</a>';
		}

		$options_load = array();
		$options_load['title'] = $name;
		$options_load['description'] = $description;
		$options_load['button_center'] = 'true';
		$options_load['tag'] = $id;
		$options_load['custom_buttons'] = $custom_buttons;

		essb5_advanced_options_small_settings_tile(array('element_options' => $options_load));
	}
	echo '</div>';
}

function essb_followers_update_log_viewer()
{
	echo essb5_generate_code_advanced_settings_panel(
		esc_html__('Update Log', 'essb') . essb_generate_expert_badge(),
		'Trace the counter update. The log shows the last request and values from the followers\' counter update.',
		'followers-update-log',
		'',
		esc_html__('View', 'essb'),
		'ti-server',
		'no',
		'1000',
		'',
		'',
		esc_html__('Update Log', 'essb'),
		false
	);
}

function essb_profiles_shortcode_generator()
{
	echo essb5_generate_code_advanced_settings_panel(
		esc_html__('Generate Social Pofiles Shortcode [easy-profiles]', 'essb'),
		esc_html__('Generate social profiles shortcode which you can use to add profile links anywhere on the website. Each shortcode can have a separate list of social networks (and profiles).', 'essb'),
		'easy-profiles-shortcode',
		'ao-shortcode',
		esc_html__('Generate', 'essb'),
		'fa fa-code',
		'no',
		'500',
		'',
		'ti-share',
		esc_html__('[easy-profiles] Code Generation', 'essb'),
		true
	);
}

function essb_profiles_content_bar_hint()
{
	echo '<div class="essb-options-hint essb-options-hint-glowhint">';
	echo '<div class="essb-options-hint-desc">';
	echo '<p>You can use the following custom CSS selectors to do additional style changes. We recommend adding the code in Style Settings -> Additional CSS, but you can also do that in your favorite plugin.</p>';
	echo '<ul>';
	echo '<li><code>.essb-profiles-post</code> - this is the main class of the element</li>
<li><code>.essb-profiles-post .user-content</code> - this is the class of the element where user content is shown</li>
<li><code>.essb-profiles-post .user-buttons</code> - this is the class of the element where buttons are shown</li>';
	echo '</ul>';
	echo '</div>';
	echo '</div>';
}
