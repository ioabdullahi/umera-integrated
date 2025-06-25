<?php

/**
 * ESSB_Share_Networks_Helper
 * @since 10.2
 */
class ESSB_Share_Networks_Helper
{

    // @since 10.3 Skype added
    private static $deprecated_list = ['del', 'yummly', 'mwp', 'stumbleupon', 'google', 'skype'];
    
    /**
     * List of all available in the plugin share networks
     *
     * @param  bool $always_show_all
     * @return array
     */
    public static function get($always_show_all = false)
    {
        $essb_available_social_networks = [
            'facebook' => ['name' => 'Facebook', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'facebook_like' => ['name' => 'Like', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'twitter' => ['name' => 'Twitter', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'pinterest' => ['name' => 'Pinterest', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'linkedin' => ['name' => 'LinkedIn', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'digg' => ['name' => 'Digg', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'del' => ['name' => 'Del', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'tumblr' => ['name' => 'Tumblr', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'vk' => ['name' => 'VKontakte', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'print' => ['name' => 'Print', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'mail' => ['name' => 'Email', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'flattr' => ['name' => 'Flattr', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'reddit' => ['name' => 'Reddit', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'buffer' => ['name' => 'Buffer', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'love' => ['name' => 'Love This', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'weibo' => ['name' => 'Weibo', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'pocket' => ['name' => 'Pocket', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'xing' => ['name' => 'Xing', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'ok' => ['name' => 'Odnoklassniki', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'more' => ['name' => 'More Button', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'whatsapp' => ['name' => 'WhatsApp', 'type' => 'buildin', 'supports' => 'mobile'],
            'meneame' => ['name' => 'Meneame', 'type' => 'buildin', 'supports' => 'desktop,mobile'],
            'blogger' => ['name' => 'Blogger', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'amazon' => ['name' => 'Amazon', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'yahoomail' => ['name' => 'Yahoo Mail', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'gmail' => ['name' => 'Gmail', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'aol' => ['name' => 'AOL', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'newsvine' => ['name' => 'Newsvine', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'hackernews' => ['name' => 'HackerNews', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'evernote' => ['name' => 'Evernote', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'myspace' => ['name' => 'MySpace', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'mailru' => ['name' => 'Mail.ru', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'viadeo' => ['name' => 'Viadeo', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'line' => ['name' => 'Line', 'type' => 'buildin', 'supports' => 'mobile,retina templates only'],
            'flipboard' => ['name' => 'Flipboard', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'comments' => ['name' => 'Comments', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'yummly' => ['name' => 'Yummly', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'sms' => ['name' => 'SMS', 'type' => 'buildin', 'supports' => 'mobile,retina templates only'],
            'viber' => ['name' => 'Viber', 'type' => 'buildin', 'supports' => 'mobile,retina templates only'],
            'telegram' => ['name' => 'Telegram', 'type' => 'buildin', 'supports' => 'mobile,retina templates only'],
            'subscribe' => ['name' => 'Subscribe', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'skype' => ['name' => 'Skype', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'messenger' => ['name' => 'Facebook Messenger', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'kakaotalk' => ['name' => 'Kakao', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'share' => ['name' => 'Share', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'livejournal' => ['name' => 'LiveJournal', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'yammer' => ['name' => 'Yammer', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'meetedgar' => ['name' => 'Edgar', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'fintel' => ['name' => 'Fintel', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'mix' => ['name' => 'Mix', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'instapaper' => ['name' => 'Instapaper', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only'],
            'copy' => ['name' => 'Copy Link', 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only']
        ];

        if (has_filter('essb4_social_networks')) {
            $essb_available_social_networks = apply_filters('essb4_social_networks', $essb_available_social_networks);
        }

        /**
         * @since 8.9
         * Allows easy to register or deregister social networks from the plugin
         */
        if (has_filter('essb_available_social_share_networks')) {
            $essb_available_social_networks = apply_filters('essb_available_social_share_networks', $essb_available_social_networks);
        }

        /**
         * @since 8.6
         */
        if (has_filter('essb_additional_social_networks')) {
            $essb_available_social_networks = apply_filters('essb_additional_social_networks', $essb_available_social_networks);
        }

        if (!$always_show_all && has_filter('essb_manage_networks')) {
            $essb_available_social_networks = apply_filters('essb_manage_networks', $essb_available_social_networks);
        }

        // Remove deprecated social networks
        $essb_available_social_networks = self::remove_deprecated_social_networks($essb_available_social_networks);

        return $essb_available_social_networks;
    }
    
    /**
     * remove_deprecated_social_networks
     *
     * @param  array $networks_list
     * @return array
     */
    public static function remove_deprecated_social_networks($networks_list = []){
        $output = [];

        foreach ($networks_list as $key => $data) {
            if (!in_array($key, self::$deprecated_list)) {
                $output[$key] = $data;
            }
        }

        return $output;
    }
    
    /**
     * Check if the social network is deprecated and won't need to run.
     *
     * @param  string $network Plugin network key   
     * @return bool
     */
    public static function is_deprecated($network = '') {
        return in_array($network, self::$deprecated_list);
    }

    public static function is_active($network = '') {
        $all_networks = self::get();

        return isset($all_networks[$network]) ? true : false;
    }
}
