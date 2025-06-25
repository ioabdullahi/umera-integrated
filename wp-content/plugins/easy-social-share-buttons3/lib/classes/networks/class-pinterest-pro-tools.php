<?php
/**
 * Specific function related to the work of Pinterest Pro. Loading conditionally javascript code related to them.
 * 
 * @package EasySocialShareButtons
 * @author appscreo
 * @since 10.1
 */
class ESSB_Pinterest_Pro_Tools {
    
    /**
     * Initialize
     */
    public static function init() {        
        add_action ( 'wp_enqueue_scripts', array ('ESSB_Pinterest_Pro_Tools', 'initialize_modules' ), 1 );
    }
    
    /**
     * Initalize spscific modules
     */
    public static function initialize_modules() {
        self::initialize_advanced_disable_pin();
        
        if (is_singular() && essb_pin_selected_images_only()) {
            add_action('essb_inline_js_queue', array(__CLASS__, 'generate_pin_selected_only_code'));
        }
        
        // Pinterest description
        if (is_singular()) {
            add_action('essb_inline_js_queue', array(__CLASS__, 'initialize_pinterest_description'));
            add_filter('the_content', array(__CLASS__, 'content_marker'), 999);
            add_filter('the_content', array(__CLASS__, 'pinterest_hidden_images'), 999);
        }
    }

    public static function initialize_advanced_disable_pin () {
        if (essb_option_bool_value('deactivate_module_pinterestpro') || !essb_option_bool_value('pinpro_advanced_disable')) {
            return;
        }       
        
        add_action('essb_inline_js_queue', array(__CLASS__, 'generate_advanced_disable_pin_code'));
       
    }
    
    public static function generate_advanced_disable_pin_code($buffer) {
        $pin_disable_options = array ();
        $pin_disable_options['min_width'] = essb_sanitize_option_value('pinpro_advanced_minwidth');
        $pin_disable_options['min_height'] = essb_sanitize_option_value('pinpro_advanced_minheight');
        $pin_disable_options['hideon'] = essb_sanitize_option_value('pinpro_advanced_hideon');
        $pin_disable_options['files'] = array();
        
        $exclude_by_files = essb_option_value('pinpro_advanced_files');
        
        if (!empty($exclude_by_files)) {
            $pin_disable_options['files'] = explode( "\n", $exclude_by_files );
            $pin_disable_options['files'] = array_map( 'trim', $pin_disable_options['files'] );
            $pin_disable_options['files'] = array_filter($pin_disable_options['files']);
            $pin_disable_options['files'] = array_unique($pin_disable_options['files']);
        }
        
        echo 'window.essbPinAdvancedDisable = essbPinAdvancedDisable = ' . json_encode($pin_disable_options) . ';';
        echo 'document.addEventListener("DOMContentLoaded",function(){"undefined"!=typeof essbPinAdvancedDisable&&(essbPinAdvancedDisable.min_width||essbPinAdvancedDisable.min_height||essbPinAdvancedDisable.hideon||0!=essbPinAdvancedDisable.files.length)&&(essbPinAdvancedDisable.hideon&&document.querySelectorAll(essbPinAdvancedDisable.hideon).forEach(t=>{t.setAttribute("nopin","nopin"),t.setAttribute("data-pin-nopin","true"),t.classList.add("no_pin"),t.classList.add("essb_no_pin"),t.setAttribute("data-pin-no-hover","true")}),(Number(essbPinAdvancedDisable.min_height||0)>0||Number(essbPinAdvancedDisable.min_width||0)>0)&&document.querySelectorAll("img").forEach(t=>{(t.outerWidth()<Number(essbPinImages.min_width||0)||t.outerHeight()<Number(essbPinImages.min_height||0))&&(t.setAttribute("nopin","nopin"),t.setAttribute("data-pin-nopin","true"),t.classList.add("no_pin"),t.classList.add("essb_no_pin"),t.setAttribute("data-pin-no-hover","true"))}),essbPinAdvancedDisable.files.length>0&&document.querySelectorAll("img").forEach(t=>{let e=(t.getAttribute("src")||"").toLowerCase(),i=!1;for(let n of essbPinAdvancedDisable.files)if(e.indexOf(n.toLowerCase())>-1){i=!0;break}i&&(t.setAttribute("nopin","nopin"),t.setAttribute("data-pin-nopin","true"),t.classList.add("no_pin"),t.classList.add("essb_no_pin"),t.setAttribute("data-pin-no-hover","true"))}))});';
    }
    
    public static function initialize_pinterest_description() {
        $post = essb_get_global_post();
        if($post) {
            $pinterest_description = get_post_meta( $post->ID, 'essb_post_pin_desc', true);
            
            if ($pinterest_description != '') {
                echo 'document.addEventListener("DOMContentLoaded",function(){let t="",e=!1;document.querySelector(".essb-pinterest-pro-content-marker")?(t=".essb-pinterest-pro-content-marker",e=!0):t=document.querySelector(".post img")?".post img":".single-post img",document.querySelectorAll(t).forEach(t=>{e?t.parentNode.querySelectorAll("img").forEach(t=>{""==(t.getAttribute("data-pin-description")||"")&&t.setAttribute("data-pin-description","'.esc_attr($pinterest_description).'")}):""==(t.getAttribute("data-pin-description")||"")&&t.setAttribute("data-pin-description","'.esc_attr($pinterest_description).'")})});';
            }
        }
    }
    
    public static function content_marker($content) {
        global $wp_current_filter;
        
        //bail if the_content is being requested by something else
        if(!empty($wp_current_filter) && is_array($wp_current_filter)) {
            if(count(array_intersect($wp_current_filter, apply_filters('essb_pinterest_pro_excluded_filters', array('wp_head', 'get_the_excerpt', 'widget_text_content', 'p3_content_end')))) > 0) {
                return $content;
            }
            
            //nested the_content hook
            $filter_counts = array_count_values($wp_current_filter);
            if(!empty($filter_counts['the_content']) && $filter_counts['the_content'] > 1) {
                return $content;
            }
        }
        
        
        $deactivate_trigger = false;
        $deactivate_trigger = apply_filters('essb_disable_pinterest_pro_content_marker', $deactivate_trigger);
        
        if ($deactivate_trigger) {
            return $content;
        }
        else {
            return $content . '<div class="essb-pinterest-pro-content-marker" style="display: none !important;"></div>';
        }
    }
    
    public static function pinterest_hidden_images($content) {
        global $wp_current_filter;
        
        //bail if the_content is being requested by something else
        if(!empty($wp_current_filter) && is_array($wp_current_filter)) {
            if(count(array_intersect($wp_current_filter, apply_filters('essb_pinterest_pro_excluded_filters', array('wp_head', 'get_the_excerpt', 'widget_text_content', 'p3_content_end')))) > 0) {
                return $content;
            }
            
            //nested the_content hook
            $filter_counts = array_count_values($wp_current_filter);
            if(!empty($filter_counts['the_content']) && $filter_counts['the_content'] > 1) {
                return $content;
            }
        }
        
        $post = essb_get_global_post();
        
        if ($post && class_exists('ESSB_Post_Meta')) {
            $pinterest_hidden = essb_get_post_meta($post->ID, 'pinterest_hidden');
            $output = '';
            
            if (!empty($pinterest_hidden)) {
                $pinterest_hidden = unserialize($pinterest_hidden);
                $pinterest_hidden = apply_filters('essb_pinterest_hidden_images', $pinterest_hidden);
                
                foreach ($pinterest_hidden as $single_image) {
                    $output .= '<img class="essb-pinterest-hidden-image no-lazy" src="' . $single_image . '" data-pin-media="' . $single_image . '" alt="Pinterest Hidden Image">';
                }
            }
            
            if (!empty($output)) {
                $output = '<div class="essb-pinterest-hidden-image-container" style="display: none !important;">' . $output . '</div>';
                $content = $output . $content;
            }
        }
        
        return $content;
    }
    
    public static function generate_pin_selected_only_code() {
        $post = essb_get_global_post();
        
        if ($post && class_exists('ESSB_Post_Meta')) {
            $pinterest_hidden = essb_get_post_meta($post->ID, 'pinterest_hidden');
            
            if (!empty($pinterest_hidden)) {
                $pinterest_hidden = unserialize($pinterest_hidden);
                $pinterest_hidden = apply_filters('essb_pinterest_hidden_images', $pinterest_hidden);
                
                $images = array();
                
                foreach ($pinterest_hidden as $single_image) {
                    $file_name = basename(parse_url($single_image, PHP_URL_PATH));
                    $images[] = $file_name;
                }
                
                if (!empty($images)) {
                    $output = 'document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll("img:not(.essb-pinterest-hidden-image)").forEach(t=>{t.setAttribute("nopin","nopin"),t.setAttribute("data-pin-nopin","true"),t.classList.add("no_pin"),t.classList.add("essb_no_pin"),t.setAttribute("data-pin-no-hover","true")}),document.querySelectorAll(".essb-pinterest-hidden-image").forEach(t=>{t.setAttribute("data-pin-me-only","true")})});';
                    echo $output;
                }
            }
        }
    }
}

ESSB_Pinterest_Pro_Tools::init();