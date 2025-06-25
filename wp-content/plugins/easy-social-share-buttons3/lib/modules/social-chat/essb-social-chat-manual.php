<?php 

class ESSB_Social_Chat_Manual_Button {
    
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
        
        if (essb_option_bool_value('click2chat_manual_activate')) {
            add_action('wp_enqueue_scripts', array(__CLASS__, 'register_assets'), 1 );
            add_shortcode('essb-click2chat', array(__CLASS__, 'render_chat'));
        }
        
    }
    
    
    public static function register_assets() {
        if (class_exists('ESSB_Module_Assets')) {
            if (!ESSB_Module_Assets::is_registered('click2chat-css')) {
                ESSB_Module_Assets::load_css_resource('click2chat-css', ESSB_Module_Assets::get_modules_base_folder() . 'click-to-chat' . ESSB_Module_Assets::is_optimized('css') . '.css', 'css');
                ESSB_Module_Assets::load_js_resource('click2chat-js', ESSB_Module_Assets::get_modules_base_folder() . 'click-to-chat' . ESSB_Module_Assets::is_optimized('js') . '.js', 'js');
            }
        }
            
            
            $custom_color_variables = '';
            
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_manual_color', '--color');
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_manual_bgcolor', '--background');
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_manual_color_hover', '--color-hover');
            $custom_color_variables .= self::generate_stylesheet_color_variable('click2chat_manual_bgcolor_hover', '--background-hover');
            
            if (!empty($custom_color_variables)) {
                essb_resource_builder()->add_css('.essb-c2c-manual-variables { ' . $custom_color_variables . '}', 'click2chat-manual-user', 'footer');
            }
    }
    
    public static function render_chat() {
            
        essb_depend_load_class('ESSB_Social_Chat_Draw', 'lib/modules/social-chat/essb-social-chat-draw.php');
            
            
        $button_settings = array();
            
        $button_settings['design'] = essb_option_value('click2chat_manual_design');
        $button_settings['size'] = essb_option_value('click2chat_manual_size');
        $button_settings['text'] = essb_option_value('click2chat_manual_text');
        $button_settings['subtitle'] = essb_option_value('click2chat_manual_subtitle');
        $button_settings['icon'] = essb_option_value('click2chat_manual_icon');
        $button_settings['additional_classes'] = array('essb-c2c-manual-variables');
        $button_settings['mode'] = 'manual';
            
        $window_settings = array();
        $window_settings['location'] = essb_option_value('click2chat_manual_location');
        $window_settings['title'] = essb_option_value('click2chat_manual_welcome_text');
        $window_settings['subtitle'] = essb_option_value('click2chat_manual_welcome_desc');
        $window_settings['show_profile_icon'] = essb_option_value('click2chat_manual_operators_profile');
        $window_settings['additional_classes'] = array('essb-c2c-manual-variables');
        $window_settings['mode'] = 'manual';
            
        $output = '';
        $output .= '<div class="essb-c2c-inline-container">';
        $output .= ESSB_Social_Chat_Draw::generate_chat_button($button_settings);
        $output .= '</div>';
        $output .= ESSB_Social_Chat_Draw::generate_chat_window($window_settings, self::get_operators());
        
        return $output;
    }
    
    private static function get_operators() {
        $list = array();
        
        for ($i = 1; $i <= 6; $i++) {            
            $operator = 'click2chat_manual_operator'.$i.'_';
            
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
    
    private static function generate_stylesheet_color_variable($option_id, $css_variable_id) {
        
        $r = '';
        
        $value = essb_option_value($option_id);
        
        if (!empty($value) && !empty($css_variable_id)) {
            $r = $css_variable_id . ':' . $value . ';';
        }

        return $r;
    }
    
}