<?php
class ESSBSocialProfilesHelper {
    
    public static function get_stylesheet_url() {
        /**
         * Loading Module Assets
         */
        if (!class_exists('ESSBSocialFollowersCounterAssets')) {
            // include visual draw class
            include_once (ESSB3_PLUGIN_ROOT . 'lib/modules/social-followers-counter/essb-social-followers-counter-assets.php');
        }
        return ESSBSocialFollowersCounterAssets::core_stylesheet();
    }
	
	public static function get_active_networks() {
		$network_list = essb_option_value('profile_networks');
	
		return $network_list;
	}
	
	public static function get_active_networks_order() {
		$network_order = essb_option_value('profile_networks_order');
	
		$network_order = self::simplify_order_list($network_order);
	
		return $network_order;
	}
	
	public static function simplify_order_list($order) {
		$result = array();
		
		if (!is_array($order)) {
			$order = array();
		}
		
		foreach ($order as $network) {
			$network_details = explode('|', $network);
			$result[] = $network_details[0];
		}
	
		return $result;
	}
	
	public static function get_text_of_buttons() {
		$networks = self::available_social_networks();
		
		$names = array();
		foreach ($networks as $key => $name) {
			$has_text = essb_option_value('profile_text_'.$key);
			$names[$key] = $has_text;
		}
		
		return $names;
	}

	public static function get_count_of_buttons() {
	    $networks = self::available_social_networks();
	    
	    $names = array();
	    foreach ($networks as $key => $name) {
	        $has_text = essb_option_value('profile_count_'.$key);
	        $names[$key] = $has_text;
	    }
	    
	    return $names;
	}
	
	/**
	 * @since 6.3
	 * Google+ removed as of service shut down
	 */
	public static function available_social_networks() {
		$socials = array ();

		$socials['facebook'] = 'Facebook';
		$socials['twitter'] = 'X (formerly Twitter)';
		$socials['pinterest'] = 'Pinterest';
		$socials['linkedin'] = 'LinkedIn';
		$socials['github'] = 'GitHub';
		$socials['vimeo'] = 'Vimeo';
		$socials['dribbble'] = 'Dribbble';
		$socials['envato'] = 'Envato';
		$socials['soundcloud'] = 'SoundCloud';
		$socials['behance'] = 'Behance';
		$socials['foursquare'] = 'Foursquare';
		$socials['mailchimp'] = 'MailChimp';
		$socials['delicious'] = 'Delicious';
		$socials['instgram'] = 'Instagram';
		$socials['youtube'] = 'YouTube';
		$socials['vk'] = 'VK';
		$socials['rss'] = 'RSS';
		$socials['tumblr'] = 'Tumblr';
		$socials['slideshare'] = 'SlideShare';
		$socials['500px'] = '500px';
		$socials['flickr'] = 'Flickr';
		$socials['wp_posts'] = 'WordPress Posts';
		$socials['wp_comments'] = 'WordPress Comments';
		$socials['wp_users'] = 'WordPress Users';
		$socials['steamcommunity'] = 'Steam';
		$socials['weheartit'] = 'WeHeartit';
		$socials['feedly'] = 'Feedly';
		$socials['love'] = 'Love Counter';
		$socials['mailpoet'] = 'MailPoet';
		$socials['mymail'] = 'myMail / Mailster';
		$socials['spotify'] = 'Spotify';
		$socials['twitch'] = 'Twitch';
		$socials['mailerlite'] = 'MailerLite';
		
		// networks added in version 5
		$socials['itunes'] = 'iTunes';
		$socials['deviantart'] = 'Deviantart';
		$socials['paypal'] = 'PayPal';
		$socials['whatsapp'] = 'WhatsApp';
		$socials['tripadvisor'] = 'Tripadvisor';
		$socials['snapchat'] = 'Snapchat';
		$socials['telegram'] = 'Telegram';
		$socials['xing'] = 'Xing'; // version 6.2.3
		$socials['medium'] = 'Medium'; // version 6.2.3
		$socials['tiktok'] = 'TikTok'; // version 6.2.3
		$socials['mixer'] = 'Mixer'; // version 6.2.3
		$socials['patreon'] = 'Patreon'; // version 6.2.3
		$socials['ok'] = 'Odnoklassniki';
		
		$socials['subscribe_form'] = 'Subscribe Form'; // version 7.1
		
		$socials['periscope'] = 'Periscope';		
		
		if (has_filter('essb4_follower_networks')) {
			$socials = apply_filters('essb4_follower_networks', $socials);
		}
		
		return $socials;
	}
	
	public static function available_templates() {
		$templates = array(
		    'color' => 'Color icons', 
		    'roundcolor' => 'Round Color Icons', 
		    'outlinecolor' => 'Outline Color Icons', 
		    'grey' => 'Grey icons', 
		    'roundgrey' => 'Round Grey Icons', 
		    'outlinegrey' => 'Outline Grey Icons', 
		    'light' => 'Light Icons', 
		    'roundlight' => 'Round Light Icons', 
		    'outlinelight' => 'Outline Light Icons', 
		    'metro' => 'Metro', 
		    'flat' => 'Flat', 
		    'dark' => 'Dark', 
		    'tinycolor' => 'Tiny Color', 
		    'tinygrey' => 'Tiny Grey', 
		    'tinylight' => 'Tiny Light', 
		    'tinymodern' => 'Tiny Modern', 
		    'modern' => "Modern", 
		    'modernlight' => "Modern Light",
		    'modernoutline' => "Modern Outline",
		    "metro essbfc-template-fancy" => "Metro Fancy",
		    "metro essbfc-template-bold" => "Metro Bold",
		    'metrooutline' => 'Framed',
		    'gradient' => 'Gradient',
		    'minimal' => 'Minimal'
		);
		
		return $templates;
	}
	
	public static function available_alignments() {
		$alignments = array('left' => 'Left', 'center' => 'Center', 'right' => 'Right');
		
		return $alignments;
	}
	
	public static function available_sizes() {
		$sizes = array('' => 'Default', 'small' => 'Small', 'medium' => 'Medium', 'large' => 'Large', 'xlarge' => 'Extra Large', 'xxlarge' => 'Extra Extra Large');
		
		return $sizes;
	}
	
	public static function available_animations() {
		$animations = array('' => 'Without animation', 'pulse' => "Pulse", "down" => "Down", "up" => "Up", "pulse-grow" => "Pulse Grow", "pop" => "Pop", "wobble-horizontal" => "Wobble Horizontal", "wobble-vertical" => "Wobble Vertical", "buzz-out" => "Buzz Out");
		
		return $animations;
	}
}

if (!function_exists('essb_update_available_profile_networks_in_settings')) {
	add_filter('essb4_profile_networks_update_list', 'essb_update_available_profile_networks_in_settings');

	function essb_update_available_profile_networks_in_settings($list_of_networks) {
		$current_networks = essb_available_social_profiles();
		$all_networks = array();
		foreach ($current_networks as $network => $network_name) {
			$key = $network.'|'.$network_name;

			if (!in_array($key, $list_of_networks)) {
				$list_of_networks[] = $key;
			}

			$all_networks[] = $key;
		}

		return $list_of_networks;

	}
}