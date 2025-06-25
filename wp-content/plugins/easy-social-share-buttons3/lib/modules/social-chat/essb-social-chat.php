<?php 

class ESSB_Social_Chat_Floating_Button {
    
    public static $application_names = array(
        '' => 'WhatsApp', 
        'whatsapp' => 'WhatsApp', 
        'viber' => 'Viber', 
        'email' => 'Email', 
        'phone' => 'Phone',
        'messenger' => 'Facebook Messenger',
        'telegram' => 'Telegram'
    );
    
    public static function init() {
        
        if (essb_option_bool_value('click2chat_activate')) {
            add_action('wp_enqueue_scripts', array(__CLASS__, 'register_assets'), 1 );
            add_action('wp_footer', array(__CLASS__, 'render_chat'));
        }
        
    }
    
    /**
     * Do an extensive check for the automatic floating chat button display
     * @return boolean
     */
    private static function can_run() {        
        if (is_admin() || is_feed()) {
            return false;
        }
        
        $is_deactivated = false;
        $exclude_from = essb_option_value('click2chat_exclude');
        if (! empty ( $exclude_from )) {
            $excule_from = explode ( ',', $exclude_from );
            
            $excule_from = array_map ( 'trim', $excule_from );
            if (in_array ( get_the_ID (), $excule_from, false )) {
                $is_deactivated = true;
            }
        }
        
        if (essb_option_bool_value('click2chat_deactivate_homepage')) {
            if (is_home() || is_front_page()) {
                $is_deactivated = true;
            }
        }
        
        if (essb_option_value('click2chat_posttypes')) {
            $posttypes = essb_option_value('click2chat_posttypes');
            if (!is_array($posttypes)) {
                $posttypes = array();
            }
            
            if (!is_singular($posttypes)) {
                $is_deactivated = true;
            }            
        }
        
        // deactivate display of the functions
        if ($is_deactivated) {
            return false;
        }
        
        return true;        
    }
    
    public static function register_assets() {
        if (self::can_run()) {
            /**
             * Register main static assets
             */
            if (class_exists('ESSB_Module_Assets')) {
                if (!ESSB_Module_Assets::is_registered('click2chat-css')) {
                    ESSB_Module_Assets::load_css_resource('click2chat-css', ESSB_Module_Assets::get_modules_base_folder() . 'click-to-chat' . ESSB_Module_Assets::is_optimized('css') . '.css', 'css');
                    ESSB_Module_Assets::load_js_resource('click2chat-js', ESSB_Module_Assets::get_modules_base_folder() . 'click-to-chat' . ESSB_Module_Assets::is_optimized('js') . '.js', 'js');
                }
            }
            
            /**
             * Register dynamic assets
             */      
            
            $custom_color_variables = '';
            
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_color', '--color');
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_bgcolor', '--background');
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_color_hover', '--color-hover');
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_bgcolor_hover', '--background-hover');
            
            if (!empty($custom_color_variables)) {
                essb_resource_builder()->add_css('.essb-c2c-floating-variables { ' . $custom_color_variables . '}', 'click2chat-floating-user', 'footer');
            }
        }
    }
    
    public static function render_chat() {
        if (self::can_run()) {
            
            essb_depend_load_class('ESSB_Social_Chat_Draw', 'lib/modules/social-chat/essb-social-chat-draw.php');
            
            
            $button_settings = array();
            
            $button_settings['location'] = essb_option_value('click2chat_location');
            $button_settings['design'] = essb_option_value('click2chat_design');
            $button_settings['size'] = essb_option_value('click2chat_size');
            $button_settings['text'] = essb_option_value('click2chat_text');
            $button_settings['description'] = essb_option_value('click2chat_subtitle');
            $button_settings['icon'] = essb_option_value('click2chat_icon');
            $button_settings['additional_classes'] = array('essb-c2c-floating-variables');
            $button_settings['mode'] = 'floating';
            
            $window_settings = array();
            $window_settings['location'] = essb_option_value('click2chat_location');
            $window_settings['title'] = essb_option_value('click2chat_welcome_text');
            $window_settings['subtitle'] = essb_option_value('click2chat_welcome_desc');
            $window_settings['show_profile_icon'] = essb_option_value('click2chat_operators_profile');
            $window_settings['additional_classes'] = array('essb-c2c-floating-variables');
            $window_settings['mode'] = 'floating';
            
            echo ESSB_Social_Chat_Draw::generate_chat_button($button_settings);
            echo ESSB_Social_Chat_Draw::generate_chat_window($window_settings, self::get_operators());
        }
    }
    
    private static function get_operators() {
        $list = array();
        
        for ($i = 1; $i <= 6; $i++) {            
            $operator = 'click2chat_operator'.$i.'_';
            
            if (essb_option_bool_value($operator.'active')) {
                $name = essb_option_value($operator.'name');
                $title = essb_option_value($operator.'title');
                $number = essb_option_value($operator.'number');
                $app = essb_option_value($operator.'app');
                $image = essb_option_value($operator.'image');
                $text = essb_option_value($operator.'text');
                
                if (empty($app)) { $app = 'whatsapp'; }
                
                $list[] = array(
                    'name' => $name,
                    'title' => $title,
                    'number' => $number,
                    'app' => $app,
                    'app_name' => self::$application_names[$app],
                    'image' => $image,
                    'default_text' => $text
                );
            }
        }
        
        return $list;
    }
    
    private static function generate_floating_button($settings = array()) {
        $size = isset($settings['size']) ? $settings['size'] : '';
        $location = isset($settings['location']) ? $settings['location'] : '';
        $design = isset($settings['design']) ? $settings['design'] : '';
    }
    
    private static function generate_stylesheet_color_variable($option_id, $css_variable_id) {
        
        $r = '';
        
        $value = essb_option_value($option_id);
        
        if (!empty($value) && !empty($css_variable_id)) {
            $r = $css_variable_id . ':' . $value . ';';
        }

        return $r;
    }
    
}
