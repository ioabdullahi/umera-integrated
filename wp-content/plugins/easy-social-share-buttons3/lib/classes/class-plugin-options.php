<?php

/**
 * Core plugin settings
 * 
 * @author appscreo
 * @package EasySocialShareButtons
 * @since 7.1
 */
class ESSB_Plugin_Options {

    /**
     * Plugin settings are protected
     * 
     * @var array
     */
    private static $core_options = array ();

    
    /**
     * Other plugin module options
     * 
     * @var array
     */
    private static $module_options = array ();

    /**
     * Loading the core plugin options
     */
    public static function load() {
        self::$core_options = get_option(ESSB3_OPTIONS_NAME);
        
        // Prevent getting in an error if options are missing
        if (! is_array(self::$core_options)) {
            self::$core_options = array ();
        }
        
        // Backward compatibility
        self::compatibility_depracated_plugin_options();
        
        // Conflicting options check
        self::compatibility_conflict_options();

        self::options_automation();
        
        // Adjustments over options for demo mode features
        self::adjust_demo_mode_options();
                
        // New after loading options event
        if (has_filter('essb_after_options_load')) {
            self::$core_options = apply_filters('essb_after_options_load', self::$core_options);
        }             
        
        add_action('template_redirect', array(__CLASS__, 'on_template_redirect'));
    }
    
    /**
     * Trigger filter over the plugin settings. Plugin options for security reason will remain protected
     * 
     * @param string $filter
     */
    public static function trigger_options_filter($filter = '') {
        if (has_filter($filter)) {
            self::$core_options = apply_filters($filter, self::$core_options);
        }
    }
    
    /**
     * Read all options for plugin or module
     * 
     * @param string $module
     * @return array|array|mixed
     */
    public static function read_all($module = '') {
        if ($module == '') {
            return self::$core_options;
        }
        else {
            return isset(self::$module_options[$module]) ? self::$module_options[$module] : array();
        }
    }

    
    /**
     * Loading additional options
     * 
     * @param string $module
     * @param string $option_name
     * @param string $validate_array
     */
    public static function load_module_options($module = '', $option_name = '', $validate_array = true) {
        self::$module_options[$module] = get_option($option_name);
        
        if ($validate_array && ! is_array(self::$module_options[$module])) {
            self::$module_options[$module] = array ();
        }
    }

    
    /**
     * Get option value
     * 
     * @param string $param
     * @param array|null $options
     * @return string
     */
    public static function get($param = '', $options = null) {
        if (! $options || ! is_array($options)) {
            $options = self::$core_options;
        }
        
        return isset($options[$param]) ? $options[$param] : '';
    }
    
    
    /**
     * Get numeric options value
     * 
     * @param string $param
     * @param array|null $options
     * @return number (zero if not set or not a number)
     */
    public static function get_number($param = '', $options = null) {
        if (! $options || ! is_array($options)) {
            $options = self::$core_options;
        }
        
        return isset($options[$param]) ? (is_numeric ($options[$param]) ? $options[$param] : 0) : 0;
    }
    
    
    /**
     * Update option value
     * 
     * @param string $param
     * @param string $value
     */
    public static function set($param, $value = '') {
        self::$core_options[$param] = $value;
    }

    
    /**
     * Get boolean option value state
     * 
     * @param string $param
     * @param array|null $options
     * @return boolean
     */
    public static function is($param = '', $options = null) {
        if (! $options || ! is_array($options)) {
            $options = self::$core_options;
        }
        
        $value = isset($options[$param]) ? $options[$param] : 'false';
        
        return $value == 'true' ? true : false;
    }
    
    /**
     * Do additional checks after all WordPress conditions are loaded. 
     * Usually used to deactivate components via the menu.
     * 
     * @since 8.0
     */
    public static function on_template_redirect() {
        /**
         * Pinterest Pro
         */
        if (self::is('pinterest_images')) {
            if (ESSB_Plugin_Loader::is_module_deactivated('pinpro')) {
                 self::set('pinterest_images', 'false');
            }
            
            if (ESSB_Plugin_Loader::is_module_deactivated('pinpro_follow')) {
                self::set('pinpro_follow_box', 'false');
            }
        }
    }
    
    /**
     * Automatic correction of deprecated plugin options
     */
    private static function compatibility_depracated_plugin_options() {
        
        // @since 7.1 - the automatic mobile switch is removed because there is an automatic mobile setup menu
        if (isset(self::$core_options['activate_automatic_mobile'])) {
            unset (self::$core_options['activate_automatic_mobile']);
        }
        
        // @since 8.0 - optimization_level does not have level3 value anymore -> switch to level2
        if (isset(self::$core_options['optimization_level'])) {
            if (self::$core_options['optimization_level'] == 'level3') {
                self::$core_options['optimization_level'] = 'level2';
            }
        }
    }
    
    /**
     * Check for conflicting options and disable them inside settings
     */
    private static function compatibility_conflict_options() {
        
        /**
         * Disable display of excerpt when the method is set to "except" and the option is set to "true"
         */
        if (isset(self::$core_options['deactivate_method_except']) && self::$core_options['deactivate_method_except'] == 'true') {
            self::$core_options['display_excerpt'] = 'false';	
        }

        /**
         * Disable internal cache when pre-compiled is used
         */
        if (isset(self::$core_options['precompiled_resources']) && self::$core_options['precompiled_resources'] == 'true') {
            if (isset(self::$core_options['essb_cache_runtime'])) {
                unset (self::$core_options['essb_cache_runtime']);
            }
            
            if (isset(self::$core_options['essb_cache'])) {
                unset (self::$core_options['essb_cache']);
            }
            
            if (isset(self::$core_options['essb_cache_static'])) {
                unset (self::$core_options['essb_cache_static']);
            }
            
            if (isset(self::$core_options['essb_cache_static_js'])) {
                unset (self::$core_options['essb_cache_static_js']);
            }
        }

        /**
         * @since 10.3 Counter disabled
         */
        if (self::is('deactivate_share_counters')) {
            self::$core_options['social_proof_enable'] = 'false';
            self::$core_options['deactivate_ansp'] = 'true';
            self::$core_options['counter_recover_active'] = 'false';
            self::$core_options['deactivate_ssr'] = 'true';
            self::$core_options['deactivate_postcount'] = 'true';
            self::$core_options['deactivate_column_shares'] = 'true';
            self::$core_options['activate_fake'] = 'false';
            self::$core_options['deactivate_fakecounters'] = 'true';
        }        
        
        /**
         * Automating Elementor integration
         */
        if (defined('ELEMENTOR_VERSION')) {
            self::$core_options['using_elementor'] = 'true';
        }
        
    }

    private static function options_automation() {
        if (isset(self::$core_options['opengraph_tags']) && self::$core_options['opengraph_tags'] == 'true') {
            self::$core_options['twitter_card'] = 'true';
            self::$core_options['twitter_card_type'] = 'summaryimage';
            self::$core_options['twitter_card_user'] = isset(self::$core_options['twitteruser']) ? self::$core_options['twitteruser'] : '';
        }
        else {
            self::$core_options['twitter_card'] = 'false';
        }
    }
    
    /**
     * Preconfigure options to activate specific functions of the plugin based on query parameters
     */
    private static function adjust_demo_mode_options() {
        $pinpro_follow_demo = isset($_REQUEST['pinpro_follow_demo']) ? $_REQUEST['pinpro_follow_demo'] : '';
        if (!empty($pinpro_follow_demo) && $pinpro_follow_demo == 'true') {
            self::set('pinpro_follow_box', 'true');
            self::set('pinpro_follow_box_demo_mode', 'true');
        }
    }
}