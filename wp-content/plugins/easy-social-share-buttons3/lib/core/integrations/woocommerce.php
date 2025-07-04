<?php
/**
 * WooCommerce integration functions
 * 
 * @package   EasySocialShareButtons
 * @author    AppsCreo
 * @link      http://appscreo.com/
 * @copyright 2016 AppsCreo
 * @since 4.2
 *
 */

if (!function_exists('essb_woocommerce_integration')) {
	function essb_woocommerce_integration() {
		global $essb_options;
		
		essb_depend_load_function('essb_check_applicability_module', 'lib/core/extenders/essb-core-extender-check-applicability-module.php');
		
		if (essb_check_applicability_module('woocommerce', $essb_options, essb_option_value('display_exclude_from'))) {
		    /**
		     * @since 8.6 Changing the key from 'woocommerce' to 'woocommerce_content'
		     */
			printf('%1$s<div class="essb_clear"></div>', essb_core()->generate_share_buttons('woocommerce_content', 'share', array('only_share' => false, 'post_type' => 'woocommerce')));
		}
	}	
}

if (!function_exists('essb_woocommerce_activate')) {
	function essb_woocommerce_activate() {
	    /**
	     * @since 10.0 Disable WooCommerce content display methods on a mobile device
	     */
	    if (essb_is_advanced_mobile() && essb_option_bool_value('mobile_disable_woocommerce_integrations')) {
	        if (essb_is_mobile()) {
	            return;
	        }
	    }
	    
	    
		if (essb_option_bool_value('woocommece_share')) {
			add_action ( 'woocommerce_share', 'essb_woocommerce_integration' );
		}
		if (essb_option_bool_value('woocommerce_after_add_to_cart_form')) {
			add_action ( 'woocommerce_after_add_to_cart_form', 'essb_woocommerce_integration' );
		}
		if (essb_option_bool_value('woocommece_beforeprod')) {
			add_action ( 'woocommerce_before_single_product', 'essb_woocommerce_integration' );
		}
		if (essb_option_bool_value('woocommece_afterprod')) {
			add_action ( 'woocommerce_after_single_product', 'essb_woocommerce_integration' );
		}
	}
}
