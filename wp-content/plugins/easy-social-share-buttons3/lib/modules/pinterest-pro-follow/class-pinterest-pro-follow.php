<?php

class ESSB_Pinterest_Pro_Follow {
    
    public static $instance;
    
    public function __construct() {
        add_action('wp_footer', array($this, 'generate_follow_box'));
    }
    
    public static function get_instance() {
        if ( ! ( self::$instance instanceof self ) ) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    public function generate_follow_box() {
        $follow_box_title = essb_sanitize_option_value('pinpro_followbox_title');
        $follow_box_desc = essb_sanitize_option_value('pinpro_followbox_desc');
        $follow_box_url = essb_sanitize_option_value('pinpro_followbox_url');
        $follow_box_url_text = essb_sanitize_option_value('pinpro_followbox_url_text');
        $follow_box_header_overlay = essb_sanitize_option_value('pinpro_followbox_header_overlay');
        
        $pinpro_followbox_button_bg = essb_sanitize_option_value('pinpro_followbox_button_bg');
        $pinpro_followbox_button_text = essb_sanitize_option_value('pinpro_followbox_button_text');
        
        $pinpro_followbox_display = essb_sanitize_option_value('pinpro_followbox_display');
        $pinpro_followbox_display_timeout = essb_sanitize_option_value('pinpro_followbox_display_timeout');
        
        $custom_styles = '';
        $custom_class = '';
        
        if (!empty($pinpro_followbox_button_bg) || !empty($pinpro_followbox_button_text)) {
            $custom_class = 'essb-pinterest-follow-box-user';
            $custom_styles .= '.essb-pinterest-follow-box-user { ';
            
            if (!empty($pinpro_followbox_button_bg)) { $custom_styles .= '--button-bg: '. esc_attr($pinpro_followbox_button_bg) . ';'; }
            if (!empty($pinpro_followbox_button_text)) { $custom_styles .= '--button-text: '. esc_attr($pinpro_followbox_button_text) . ';'; }
            
            $custom_styles .= '}';
        }
        
        if (empty($follow_box_header_overlay)) {
            $follow_box_header_overlay = 'light';
        }
        
        $follow_box_header_image = essb_option_value('pinpro_followbox_header');
        if (empty($follow_box_header_image)) {
            $follow_box_header_image = ESSB3_PLUGIN_URL . '/assets/images/pinterest-follow-default-header.jpg';
        }

        $follow_box_logo = essb_option_value('pinpro_followbox_logo');
        if (empty($follow_box_logo)) {
            $follow_box_logo = ESSB3_PLUGIN_URL . '/assets/images/pinterest-follow-default-logo.png';
        }
        
        if (empty($follow_box_url_text)) {
            $follow_box_url_text = esc_html__('Follow on', 'essb');
        }
        
        $output = '';
        
        if (!empty($custom_styles)) { 
            $output .= '<style>' . self::minify_advanced($custom_styles) . '</style>';
        }
        
        if (essb_option_bool_value('pinpro_follow_box_demo_mode')) {
            $pinpro_followbox_display_timeout = '-1';
        }

        
        $output .= '<div class="essb-pinterest-follow-box-container" data-trigger="'.esc_attr($pinpro_followbox_display).'" data-timeout="'.esc_attr($pinpro_followbox_display_timeout).'">';
        $output .= '<div class="essb-pinterest-follow-box '.esc_attr($custom_class).'">';
        
        $output .= '<div class="essb-pinterest-follow-box-header essb-pinterest-follow-box-header-'.esc_attr($follow_box_header_overlay).'" style="background-image: url('.esc_url($follow_box_header_image).');">';
        
        $output .= '<div class="essb-pinterest-follow-box-header__close">'.essb_svg_icon('close').'</div>';
        $output .= '<div class="essb-pinterest-follow-box-header__logo" style="background-image: url('.esc_url($follow_box_logo).');"></div>';
        
        $output .= '</div>'; // header
        
        $output .= '<div class="essb-pinterest-follow-box-content">';
        
        if (!empty($follow_box_title)) {
            $output .= '<div class="essb-pinterest-follow-box-content__title">' . $follow_box_title . '</div>';
        }
        
        if (!empty($follow_box_desc)) {
            $output .= '<div class="essb-pinterest-follow-box-content__desc">' . $follow_box_desc . '</div>';
        }

        $output .= '<div class="essb-pinterest-follow-box-content__action">';
        $output .= '<a href="' . ($follow_box_url != '' ? esc_url($follow_box_url) : '#') . '" class="essb-pinterest-follow-box-content__action_btn">';
        $output .= '<span>' . $follow_box_url_text . '</span>' . essb_svg_icon('pinterest');
        $output .= '</a>';
        $output .= '</div>';
        
        $output .= '</div>'; // content
        
        $output .= '</div>'; // essb-pinterest-follow-box
        $output .= '</div>'; // container
        
        $output .= '<script>setTimeout(function e(){document.querySelector(".essb-pinterest-follow-box-header__close")&&(document.querySelector(".essb-pinterest-follow-box-header__close").onclick=function(e){e.preventDefault(),document.querySelector(".essb-pinterest-follow-box-container").classList.remove("active")})},10),window.essbDisplayPinterestFollowBox=essbDisplayPinterestFollowBox=function(){let e=document.querySelector(".essb-pinterest-follow-box-container").getAttribute("data-timeout")||"";!("-1"!=e&&essb&&void 0!==essb.getCookie&&essb.getCookie("pinterest_follow_box"))&&(isNaN(e=""!=e?Number(e):30)&&(e=30),document.querySelector(".essb-pinterest-follow-box-container").classList.add("active"),"-1"!=e&&essb.setCookie("pinterest_follow_box","yes",e))};</script>';
        
        echo $output;
    }
    
    
    private function minify_advanced($css = '') {
        // Normalize whitespace
        $css = preg_replace( '/\s+/', ' ', $css );
        
        // Remove spaces before and after comment
        $css = preg_replace( '/(\s+)(\/\*(.*?)\*\/)(\s+)/', '$2', $css );
        
        // Remove comment blocks, everything between /* and */, unless
        // preserved with /*! ... */ or /** ... */
        $css = preg_replace( '~/\*(?![\!|\*])(.*?)\*/~', '', $css );
        
        // Remove ; before }
        $css = preg_replace( '/;(?=\s*})/', '', $css );
        
        // Remove space after , : ; { } */ >
        $css = preg_replace( '/(,|:|;|\{|}|\*\/|>) /', '$1', $css );
        
        // Remove space before , ; { } ( ) >
        $css = preg_replace( '/ (,|;|\{|}|\(|\)|>)/', '$1', $css );
        
        // Strips leading 0 on decimal values (converts 0.5px into .5px)
        $css = preg_replace( '/(:| )0\.([0-9]+)(%|em|ex|px|in|cm|mm|pt|pc)/i', '${1}.${2}${3}', $css );
        
        // Strips units if value is 0 (converts 0px to 0)
        $css = preg_replace( '/(:| )(\.?)0(%|em|ex|px|in|cm|mm|pt|pc)/i', '${1}0', $css );
        
        // Converts all zeros value into short-hand
        $css = preg_replace( '/0 0 0 0/', '0', $css );
        
        // Shortern 6-character hex color codes to 3-character where possible
        $css = preg_replace( '/#([a-f0-9])\\1([a-f0-9])\\2([a-f0-9])\\3/i', '#\1\2\3', $css );
        
        return trim( $css );
    }
}


ESSB_Pinterest_Pro_Follow::get_instance();