<?php
/**
 * Generate CSS code for the different sizes of the share buttons
 *
 * @package EasySocialShareButtons
 * @author appscreo
 * @since 9.9
 */
class ESSB_Share_Button_Size_Styles {
    
    public static function register_size_code($desktop = '', $mobile = '') {
        
    }
    
    public static function generate_size_code_inline($desktop = '', $mobile = '') {
        return ESSB_Dynamic_CSS_Builder::output_inline_code('share-buttons-sizes-' . $desktop . '-' . $mobile, self::generate_size_code($desktop, $mobile), true);
    }
    
    public static function generate_size_code($desktop = '', $mobile = '') {
        $output = '';
        
        if (!empty($desktop)) {
            switch ($desktop) {
                case 'xs':
                    $output .= self::generate_size_xs();
                    break;
                case 's':
                    $output .= self::generate_size_s();
                    break;
                case 'm':
                    $output .= self::generate_size_m();
                    break;
                case 'l':
                    $output .= self::generate_size_l();
                    break;
                case 'xl':
                    $output .= self::generate_size_xl();
                    break;
                case 'xxl':
                    $output .= self::generate_size_xxl();
                    break;
                    
            }
        }
        
        if (!empty($mobile)) {
            switch ($mobile) {
                case 'xs':
                    $output .= self::generate_size_mobile_xs();
                    break;
                case 's':
                    $output .= self::generate_size_mobile_s();
                    break;
                case 'm':
                    $output .= self::generate_size_mobile_m();
                    break;
                case 'l':
                    $output .= self::generate_size_mobile_l();
                    break;
                case 'xl':
                    $output .= self::generate_size_mobile_xl();
                    break;
                case 'xxl':
                    $output .= self::generate_size_mobile_xxl();
                    break;
                    
            }
        }
        
        return $output;
    }
    
    public static function generate_size_xs() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-xs')) {
            
            $output .= '.essb_links.essb_size_xs .essb_link_svg_icon svg { height: 14px; width: auto; }
.essb_links.essb_size_xs .essb_icon { width: 24px !important; height: 24px !important; }
.essb_links.essb_size_xs .essb_icon:before { font-size: 14px !important; top: 5px !important; left: 5px !important; }
.essb_links.essb_size_xs li a .essb_network_name { font-size: 11px !important; text-transform: uppercase !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xs .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big { font-size: 14px !important; line-height: 14px !important;}
.essb_links.essb_size_xs .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 10px !important; line-height: 10px !important; margin-top: 1px !important; }
.essb_links.essb_size_xs .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 14px !important; line-height: 25px !important; }
';
            
            ESSB_Runtime_Cache::set('share-button-size-xs');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_mobile_xs() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-xs-mobile')) {
            
            $output .= '@media (max-width: 768px) { 
.essb_links.essb_size_xs_mobile .essb_link_svg_icon svg { height: 14px; width: auto; }
.essb_links.essb_size_xs_mobile .essb_icon { width: 24px !important; height: 24px !important; }
.essb_links.v .essb_icon:before { font-size: 14px !important; top: 5px !important; left: 5px !important; }
.essb_links.essb_size_xs_mobile li a .essb_network_name { font-size: 11px !important; text-transform: uppercase !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xs_mobile .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big { font-size: 14px !important; line-height: 14px !important;}
.essb_links.essb_size_xs_mobile .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xs_mobile .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 10px !important; line-height: 10px !important; margin-top: 1px !important; }
.essb_links.essb_size_xs_mobile .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xs_mobile .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 14px !important; line-height: 25px !important; }
}';
            
            ESSB_Runtime_Cache::set('share-button-size-xs-mobile');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_s() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-s')) {
            
            $output .= '.essb_links.essb_size_s .essb_link_svg_icon svg { height: 16px; width: auto; }
.essb_links.essb_size_s .essb_icon { width: 30px !important; height: 30px !important; }
.essb_links.essb_size_s .essb_icon:before { font-size: 16px !important; top: 7px !important; left: 7px !important; }
.essb_links.essb_size_s li a .essb_network_name { font-size: 12px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_s .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_s .essb_totalcount_item .essb_t_r_big { font-size: 16px !important; line-height: 16px !important;}
.essb_links.essb_size_s .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_s .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 9px !important; line-height: 9px !important; margin-top: 1px !important; }
.essb_links.essb_size_s .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_s .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 16px !important; line-height: 26px !important; }

';
            
            ESSB_Runtime_Cache::set('share-button-size-s');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_mobile_s() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-s-mobile')) {
            
            $output .= '@media (max-width: 768px) {
.essb_links.essb_size_s_mobile .essb_link_svg_icon svg { height: 16px; width: auto; }
.essb_links.essb_size_s_mobile .essb_icon { width: 30px !important; height: 30px !important; }
.essb_links.essb_size_s_mobile .essb_icon:before { font-size: 16px !important; top: 7px !important; left: 7px !important; }
.essb_links.essb_size_s_mobile li a .essb_network_name { font-size: 12px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_s_mobile .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_s_mobile .essb_totalcount_item .essb_t_r_big { font-size: 16px !important; line-height: 16px !important;}
.essb_links.essb_size_s_mobile .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_s_mobile .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 9px !important; line-height: 9px !important; margin-top: 1px !important; }
.essb_links.essb_size_s_mobile .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_s_mobile .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 16px !important; line-height: 26px !important; }
}    
';
            
            ESSB_Runtime_Cache::set('share-button-size-s-mobile');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_m() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-m')) {
            
            $output .= '.essb_links.essb_size_m .essb_link_svg_icon svg { height: 18px; width: auto; }
.essb_links.essb_size_m .essb_icon { width: 36px !important; height: 36px !important; }
.essb_links.essb_size_m .essb_icon:before { font-size: 18px !important; top: 9px !important; left: 9px !important; }
.essb_links.essb_size_m li a .essb_network_name { font-size: 13px !important; font-weight: 400 !important; line-height: 12px !important; }
';
            
            ESSB_Runtime_Cache::set('share-button-size-m');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_mobile_m() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-m-mobile')) {
            
            $output .= '@media (max-width: 768px) {
.essb_links.essb_size_m_mobile .essb_link_svg_icon svg { height: 18px; width: auto; }
.essb_links.essb_size_m_mobile .essb_icon { width: 36px !important; height: 36px !important; }
.essb_links.essb_size_m_mobile .essb_icon:before { font-size: 18px !important; top: 9px !important; left: 9px !important; }
.essb_links.essb_size_m_mobile li a .essb_network_name { font-size: 13px !important; font-weight: 400 !important; line-height: 12px !important; }
}';
            
            ESSB_Runtime_Cache::set('share-button-size-m-mobile');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_l() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-l')) {
            
            $output .= '.essb_links.essb_size_l .essb_link_svg_icon svg { height: 20px; width: auto; }
.essb_links.essb_size_l .essb_icon { width: 42px !important; height: 42px !important; }
.essb_links.essb_size_l .essb_icon:before { font-size: 20px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_l li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
';
            
            ESSB_Runtime_Cache::set('share-button-size-l');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_mobile_l() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-l-mobile')) {
            
            $output .= '@media (max-width: 768px) {
.essb_links.essb_size_l_mobile .essb_link_svg_icon svg { height: 20px; width: auto; }
.essb_links.essb_size_l_mobile .essb_icon { width: 42px !important; height: 42px !important; }
.essb_links.essb_size_l_mobile .essb_icon:before { font-size: 20px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_l_mobile li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
}';
            
            ESSB_Runtime_Cache::set('share-button-size-l-mobile');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_xl() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-xl')) {
            
            $output .= '.essb_links.essb_size_xl .essb_link_svg_icon svg { height: 24px; width: auto; }
.essb_links.essb_size_xl .essb_icon { width: 46px !important; height: 46px !important; }
.essb_links.essb_size_xl .essb_icon:before { font-size: 24px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_xl li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xl .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xl .essb_totalcount_item .essb_t_r_big { font-size: 21px !important; line-height: 21px !important;}
.essb_links.essb_size_xl .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xl .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 11px !important; line-height: 11px !important; margin-top: 2px !important; }
.essb_links.essb_size_xl .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xl .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 21px !important; line-height: 34px !important; }
';
            
            ESSB_Runtime_Cache::set('share-button-size-xl');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_mobile_xl() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-xl-mobile')) {
            
            $output .= '@media (max-width: 768px) {
.essb_links.essb_size_xl_mobile .essb_link_svg_icon svg { height: 24px; width: auto; }
.essb_links.essb_size_xl_mobile .essb_icon { width: 46px !important; height: 46px !important; }
.essb_links.essb_size_xl_mobile .essb_icon:before { font-size: 24px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_xl_mobile li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xl_mobile .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xl_mobile .essb_totalcount_item .essb_t_r_big { font-size: 21px !important; line-height: 21px !important;}
.essb_links.essb_size_xl_mobile .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xl_mobile .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 11px !important; line-height: 11px !important; margin-top: 2px !important; }
.essb_links.essb_size_xl_mobile .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xl_mobile .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 21px !important; line-height: 34px !important; }
}';
            
            ESSB_Runtime_Cache::set('share-button-size-xl-mobile');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_xxl() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-xxl')) {
            
            $output .= '.essb_links.essb_size_xxl .essb_link_svg_icon svg { height: 28px; width: auto; }
.essb_links.essb_size_xxl .essb_icon { width: 50px !important; height: 50px !important; }
.essb_links.essb_size_xxl .essb_icon:before { font-size: 28px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_xxl li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xxl .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xxl .essb_totalcount_item .essb_t_r_big { font-size: 24px !important; line-height: 24px !important;}
.essb_links.essb_size_xxl .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xxl .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 12px !important; line-height: 12px !important; margin-top: 2px !important; }
.essb_links.essb_size_xxl .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xxl .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 24px !important; line-height: 38px !important; }
';
            
            ESSB_Runtime_Cache::set('share-button-size-xxl');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function generate_size_mobile_xxl() {
        $output = '';
        
        if (!ESSB_Runtime_Cache::is('share-button-size-xxl-mobile')) {
            
            $output .= '@media (max-width: 768px) {
.essb_links.essb_size_xxl_mobile .essb_link_svg_icon svg { height: 28px; width: auto; }
.essb_links.essb_size_xxl_mobile .essb_icon { width: 50px !important; height: 50px !important; }
.essb_links.essb_size_xxl_mobile .essb_icon:before { font-size: 28px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_xxl_mobile li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xxl_mobile .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xxl_mobile .essb_totalcount_item .essb_t_r_big { font-size: 24px !important; line-height: 24px !important;}
.essb_links.essb_size_xxl_mobile .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xxl_mobile .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 12px !important; line-height: 12px !important; margin-top: 2px !important; }
.essb_links.essb_size_xxl_mobile .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xxl_mobile .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 24px !important; line-height: 38px !important; }
}';
            
            ESSB_Runtime_Cache::set('share-button-size-xxl-mobile');
        }
        
        if (!empty($output)) {
            $output = self::minify_advanced($output);
        }
        
        return $output;
    }
    
    public static function minify_advanced($css = '') {
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