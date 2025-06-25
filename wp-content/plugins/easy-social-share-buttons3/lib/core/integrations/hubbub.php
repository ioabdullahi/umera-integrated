<?php

if (!function_exists('essb_hubbub_custom_data')) {
    /**
     * Read previous set data in Social Snap plugin
     *
     * @return string[]|NULL[]|unknown[]
     */
    function essb_hubbub_custom_data() {
        
        global $post;
        
        $result = array('og_title' => '', 'og_description' => '', 'og_image' => '', 'custom_tweet' => '', 'pin_image' => '', 'pin_description' => '' );
        
        if (isset($post)) {
            
            $share_options = essb_dpsp_maybe_convert_post_meta_to_json( $post->ID, 'dpsp_share_options', true );
                      
            
            $swp_og_description = ( ! empty( $share_options['custom_description'] ) ? $share_options['custom_description'] : '' );
            if ($swp_og_description != '') {
                $result['og_description'] = $swp_og_description;
            }
            
            $swp_og_image = isset($share_options['custom_image']) && isset($share_options['custom_image']['id']) ? $share_options['custom_image']['id'] : '';
            if ($swp_og_image != '') {
                $result['og_image'] = wp_get_attachment_url($swp_og_image);
            }
            
            $swp_og_title = ( ! empty( $share_options['custom_title'] ) ? $share_options['custom_title'] : '' );
            if ($swp_og_title != '') {
                $result['og_title'] = $swp_og_title;
            }
            
            $swp_pinterest_image = isset($share_options['custom_image_pinterest']) && isset($share_options['custom_image_pinterest']['id']) ? $share_options['custom_image_pinterest']['id'] : '';
            if ($swp_pinterest_image != '') {
                $result['pin_image'] = wp_get_attachment_url($swp_pinterest_image);
            }
                        
        }
        
        return $result;
    }
    
    function essb_dpsp_maybe_convert_post_meta_to_json( $id, $key ) {
        if ( empty( $id ) || empty( $key ) ) {
            return false;
        }
        
        // Check for JSON encoded key first,
        // if not present, assume the old PHP serialized key exists
        $value = get_post_meta( $id, $key . '_json', true );
        $value = ( empty( $value ) || !$value ) ? get_post_meta( $id, $key, true ) : $value;
        
        // If the value is an array it means it was serialized and has not yet
        // been converted to JSON. Any other data format can be left as-is.
        if ( is_array( $value ) || is_object( $value ) ) {
            // Convert the data to JSON, store it, and return.
            $json_encoded_value = json_encode( $value, JSON_UNESCAPED_UNICODE );
            
            update_post_meta( $id, $key . '_json', $json_encoded_value ); // Append _json to create new key
            
            $value = json_decode( $json_encoded_value, true, 5 );
        } else {
            // If this is JSON, decode it before returning.
            $decoded = json_decode( $value, true, 5 );
            
            if ( json_last_error() === JSON_ERROR_NONE ) {
                $value = $decoded;
            }
        }
        
        return $value;
    }
    
}