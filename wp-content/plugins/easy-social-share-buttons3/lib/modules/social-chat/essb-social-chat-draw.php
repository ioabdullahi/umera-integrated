<?php

class ESSB_Social_Chat_Draw {
    
    /**
     * Generating out code for a social chat 
     * @param array $settings
     * @return string
     */
    public static function generate_chat_button($settings = array()) {
        $size = isset($settings['size']) ? $settings['size'] : '';
        $location = isset($settings['location']) ? $settings['location'] : '';
        $design = isset($settings['design']) ? $settings['design'] : '';
        $text = isset($settings['text']) ? $settings['text'] : '';
        $subtitle = isset($settings['description']) ? $settings['description'] : '';
        $icon = isset($settings['icon']) ? $settings['icon'] : '';
        $mode = isset($settings['mode']) ? $settings['mode'] : '';
        $additional_classes = isset($settings['additional_classes']) ? $settings['additional_classes'] : '';
        
        $classes = array();
        $classes[] = 'essb-c2c-b';
        if (!empty($size)) { $classes[] = 'essb-c2c-b-size-' . $size; }
        if (!empty($location)) { $classes[] = 'essb-c2c-b-location-' . $location; }
        if (!empty($design)) { $classes[] = 'essb-c2c-b-design-' . $design; }
        if (!empty($mode)) { $classes[] = 'essb-c2c-b-mode-' . $mode; }
        
        if (!empty($additional_classes)) {
            foreach ($additional_classes as $add_class) {
                $classes[] = $add_class;
            }
        }
        
        $output = '';
        
        $output .= '<div class="' . implode(' ', $classes) . '" data-mode="'.$mode.'">';
        
        if (!empty($icon)) {
            $output .= '<div class="essb-c2c-b-icon">' . essb_svg_replace_font_icon($icon) . '</div>';
        }
        
        if (!empty($text)) {
            $output .= '<div class="essb-c2c-b-text">';
            $output .= '<div class="text">' . $text . '</div>';
            
            if (!empty($subtitle)) {
                $output .= '<div class="subtitle">' . $subtitle . '</div>';
            }
            
            $output .= '</div>';
        }
        
        $output .= '</div>';
        
        return $output;
    }
    
    public static function generate_chat_window($settings = array(), $operators = array()) {
        $title = isset($settings['title']) ? $settings['title'] : '';
        $subtitle = isset($settings['subtitle']) ? $settings['subtitle'] : '';
        $show_profile_icon = isset($settings['show_profile_icon']) ? $settings['show_profile_icon'] : '';
        $additional_classes = isset($settings['additional_classes']) ? $settings['additional_classes'] : '';
        $location = isset($settings['location']) ? $settings['location'] : '';
        $mode = isset($settings['mode']) ? $settings['mode'] : '';
        
        $classes = array();
        $classes[] = 'essb-c2c-w';
        $classes[] = 'essb-c2c-w-mode-'.$mode;
        if (!empty($location)) { $classes[] = 'essb-c2c-w-location-' . $location; }
        
        if (!empty($additional_classes)) {
            foreach ($additional_classes as $add_class) {
                $classes[] = $add_class;
            }
        }
        
        $output = '';        
        
        $output .= '<div class="' . implode(' ', $classes) . '" data-mode="'.$mode.'">';
        $output .= '<div class="essb-c2c-w-header">';
        
        $output .= '<div class="essb-c2c-w-header-close" data-mode="' . $mode . '">';
        $output .= essb_svg_icon('close');
        $output .= '</div>';
        
        $output .= '<div class="essb-c2c-w-header-text">';
        if (!empty($title)) { $output .= '<div class="title">' . $title . '</div>'; }
        if (!empty($subtitle)) { $output .= '<div class="subtitle">' . $subtitle . '</div>'; }
        $output .= '</div>';
        $output .= '<div class="essb-c2c-w-header-close">';
        $output .= '</div>';
        $output .= '</div>'; // essb-c2c-w-header
        $output .= '<div class="essb-c2c-w-content">';
        
        // generate the operators
        foreach ($operators as $operator) {
            $output .= '<div class="essb-c2c-o essb-c2c-o-app-'.$operator['app'].'" data-number="'.$operator['number'].'" data-app="'.$operator['app'].'" data-text="'.$operator['default_text'].'">';
            
            if ($operator['image'] != '') {
                $output .= '<div class="essb-c2c-o-photo">';
                $output .= '<img src="' . $operator['image'] . '"/>';
                $output .= '</div>';
            }

            
            $output .= '<div class="essb-c2c-o-data">';
            $output .= '<div class="name">'.$operator['name'].'</div>';
            $output .= '<div class="title">'.$operator['title'].'</div>';
            $output .= '</div>';

            $output .= '<div class="essb-c2c-o-app essb-c2c-o-app-icon-'.$operator['app'].'">';
            $output .= essb_svg_icon($operator['app']);
            $output .= '</div>';
            
            $output .= '</div>'; // essb-c2c-o
        }
        
        $output .= '</div>'; // essb-c2c-w-content
        $output .= '</div>';
        
        return $output;
    }
}
