<?php
/**
 * Click to Chat Module for Easy Social Share Buttons for WordPress
 *
 * @package EasySocialShareButtons
 * @author appscreo
 * @version 1.0
 * @since 5.6
 */

essb_depend_load_class('ESSB_Social_Chat_Floating_Button', 'lib/modules/social-chat/essb-social-chat.php');
ESSB_Social_Chat_Floating_Button::init();

essb_depend_load_class('ESSB_Social_Chat_WooCommerce_Button', 'lib/modules/social-chat/essb-social-chat-woocommerce.php');
ESSB_Social_Chat_WooCommerce_Button::init();

essb_depend_load_class('ESSB_Social_Chat_Manual_Button', 'lib/modules/social-chat/essb-social-chat-manual.php');
ESSB_Social_Chat_Manual_Button::init();
