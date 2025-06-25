<?php 

class ESSB_SEO_Plugin_Integrations_SMO {
    
    private $meta_details = null;
    
    private $seo_plugin_found = false;
    
    public static $instance;
    
    public function __construct() {
        if (!is_admin()) {
            
            /**
             * Current social media sharing details
             * @var ESSB_SEO_Plugin_Integrations_SMO $meta_details
             */
            $this->meta_details = ESSB_FrontMetaDetails::get_instance();
            
            add_action('template_redirect', array($this, 'check_for_integrations'), 1);
        }
    }
    
    public static function get_instance() {
        if ( ! ( self::$instance instanceof self ) ) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    public function check_for_integrations() {
        if (!$this->opengraph_active()) {
            if(defined('WPSEO_VERSION')) {
                $this->yoastseo_integration();
            }
            
            if(defined('AIOSEO_VERSION')) {
                $this->allinoneseo_integration();
            }
            
            if(defined('RANK_MATH_VERSION')) {
                $this->rankmath_integration();
            }
        }
    }
    
    public function seo_plugin_found() {
        return $this->seo_plugin_found;
    }
    
    private function opengraph_active() {
        $deactivate_trigger = false;
        
        if (essb_is_module_deactivated_on('sso') || essb_is_plugin_deactivated_on()) {
            $deactivate_trigger = true;
        }
        
        $deactivate_trigger = apply_filters('essb_deactivate_opengraph', $deactivate_trigger);
        
        return $deactivate_trigger;
    }
    
    private function rankmath_integration() {
        $this->seo_plugin_found = true;
        
        $current_social_title = $this->meta_details->title();
        $current_social_description = $this->meta_details->description();
        $current_social_image = $this->meta_details->image();
        
        //facebook title
        add_filter("rank_math/opengraph/facebook/og_title", function($content) use ($current_social_title) {
            return !empty($current_social_title) ? $current_social_title : $content;
        });
            
        //facebook description
        add_filter("rank_math/opengraph/facebook/og_description", function($content) use ($current_social_description) {
            return !empty($current_social_description) ? $current_social_description : $content;
        });
                
        //remove original image tags
        if(!empty($current_social_image)) {
            add_filter('rank_math/opengraph/facebook/og_image', '__return_false');
            add_filter('rank_math/opengraph/facebook/og_image_secure_url', '__return_false');
            add_filter('rank_math/opengraph/facebook/og_image_width', '__return_false');
            add_filter('rank_math/opengraph/facebook/og_image_height', '__return_false');
            add_filter('rank_math/opengraph/facebook/og_image_alt', '__return_false');
            add_filter('rank_math/opengraph/facebook/og_image_type', '__return_false');
            add_filter('rank_math/opengraph/twitter/twitter_image', '__return_false');
        }
        
        //twitter title
        add_filter("rank_math/opengraph/twitter/twitter_title", function($content) use ($current_social_title) {
            return !empty($current_social_title) ? $current_social_title : $content;
        });
            
            //twitter description
            add_filter("rank_math/opengraph/twitter/twitter_description", function($content) use ($current_social_description) {
                return !empty($current_social_description) ? $current_social_description : $content;
            });
    }
    
    private function allinoneseo_integration() {
        $this->seo_plugin_found = true;
        
        $current_social_title = $this->meta_details->title();
        $current_social_description = $this->meta_details->description();
        $current_social_image = $this->meta_details->image();
        
        add_filter('aioseo_facebook_tags', function($meta) use ($current_social_title, $current_social_description, $current_social_image) {
            
            //og title
            if(isset($meta['og:title']) || !empty($current_social_title)) {
                $meta['og:title']  = !empty($current_social_title) ? $current_social_title : $meta['og:title'];
            }
            
            //og description
            if(isset($meta['og:description']) || !empty($current_social_description)) {
                $meta['og:description'] = !empty($current_social_description) ? $current_social_description : $meta['og:description'];
            }
            
            //remove original image tags
            if(!empty($current_social_image)) {
                unset($meta['og:image'], $meta['og:image:secure_url'], $meta['og:image:width'], $meta['og:image:height']);
            }
            
            return $meta;
        }, 10, 1);
        
        add_filter('aioseo_twitter_tags', function($meta) use($current_social_title, $current_social_description, $current_social_image) {
                
                //twitter title
                if(isset($meta['twitter:title']) || !empty($details['social_title'])) {
                    $meta['twitter:title'] = !empty($current_social_title) ? $current_social_title : $meta['twitter:title'];
                }
                
                //twitter description
                if(isset($meta['twitter:description']) || !empty($details['social_description'])) {
                    $meta['twitter:description'] = !empty($current_social_description) ? $current_social_description : $meta['twitter:description'];
                }
                
                //remove original image tag
                if($current_social_image) {
                    unset($meta['twitter:image']);
                }
                
                return $meta;
            }, 10, 1);
    }
    
    private function yoastseo_integration() {
        $this->seo_plugin_found = true;
        
        $current_social_title = $this->meta_details->title();
        $current_social_description = $this->meta_details->description();
        $current_social_image = $this->meta_details->image();
        
        add_filter('wpseo_opengraph_title', function($title) use ($current_social_title) {
            return !empty($current_social_title) ? $current_social_title : $title;
        }, 10, 1);
            
            //replace description
        add_filter('wpseo_opengraph_desc', function($description) use ($current_social_description) {
            return !empty($current_social_description) ? $current_social_description : $description;
        }, 10, 1);
                
        //remove original image tags
        if(!empty($current_social_image)) {
                    
            //depcrecated
            add_filter('wpseo_opengraph_image', '__return_false');
                    
            //current
            add_filter('wpseo_twitter_image', '__return_false');
            add_filter('wpseo_frontend_presenter_classes', function($filter) {
                if(($key = array_search('Yoast\WP\SEO\Presenters\Open_Graph\Image_Presenter', $filter)) !== false) {
                    unset($filter[$key]);
                }
                return $filter;
            });
        }
        
        add_filter('wpseo_twitter_title', function($title) use ($current_social_title) {
            return !empty($current_social_title) ? $current_social_title : $title;
        }, 10, 1);
            
            
        add_filter('wpseo_twitter_description', function($description) use ($current_social_description) {
            return !empty($current_social_description) ? $current_social_description : $description;
        }, 10, 1);
    }
}