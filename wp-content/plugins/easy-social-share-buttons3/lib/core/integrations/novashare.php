<?php 

if (!function_exists('essb_novashare_custom_data')) {
    function essb_novashare_custom_data() {
        
        global $post;
        
        $result = array('og_title' => '', 'og_description' => '', 'og_image' => '', 'custom_tweet' => '', 'pin_image' => '', 'pin_description' => '' );
        
        if (isset($post) && essb_novashare_table_exists()) {
            global $wpdb;
            
            $novashare_data = maybe_unserialize($wpdb->get_var($wpdb->prepare("SELECT meta_value FROM {$wpdb->prefix}novashare_meta WHERE post_id = %d AND meta_key = 'details'", $post->ID)));            
                        
            $swp_og_description = isset($novashare_data['social_description']) ? $novashare_data['social_description'] : '';
            if ($swp_og_description != '') {
                $result['og_description'] = $swp_og_description;
            }
            
            $swp_og_image = isset($novashare_data['social_image']) ? $novashare_data['social_image'] : '';
            if ($swp_og_image != '') {
                $result['og_image'] = wp_get_attachment_url($swp_og_image, 'full');
            }
            
            $swp_og_title = isset($novashare_data['social_title']) ? $novashare_data['social_title'] : '';
            if ($swp_og_title != '') {
                $result['og_title'] = $swp_og_title;
            }
            
            $swp_pinterest_image = isset($novashare_data['pinterest_image']) ? $novashare_data['pinterest_image'] : '';
            if ($swp_pinterest_image != '') {
                $result['pin_image'] = wp_get_attachment_url($swp_pinterest_image, 'full');
            }
                        
        }
        
        return $result;
    }
    
    function essb_novashare_table_exists() {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
        $table_exists = $wpdb->get_var( "SHOW TABLES LIKE '{$wpdb->prefix}novashare_meta'" );
        if ( is_wp_error( $table_exists ) || is_null( $table_exists ) ) {
            return false;
        }
        
        return true;
    }
    
}