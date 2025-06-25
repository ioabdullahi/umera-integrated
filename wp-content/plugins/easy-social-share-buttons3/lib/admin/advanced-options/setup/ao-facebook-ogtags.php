<?php
if (function_exists('essb_advancedopts_settings_group')) {
	essb_advancedopts_settings_group('essb_options');
}

essb_advanced_options_relation('sso_advanced_tags', 'switch', array('opengraph_tags_fbpage', 'opengraph_tags_fbadmins', 'opengraph_tags_fbapp', 'opengraph_tags_fbauthor'));

essb_advancedopts_section_open('ao-small-values');


essb5_draw_heading( esc_html__('Advanced', 'essb'), '6');
essb5_draw_field_group_open();
essb5_draw_switch_option('sso_advanced_tags', esc_html__('Enable advanced Facebook tag fields', 'essb'), '');
essb5_draw_input_option('opengraph_tags_fbpage', esc_html__('Facebook Page URL', 'essb'), '', true);
essb5_draw_input_option('opengraph_tags_fbadmins', esc_html__('Facebook Admins', 'essb'), esc_html__('Enter IDs of Facebook Users that are admins of current page.', 'essb'), true);
essb5_draw_input_option('opengraph_tags_fbapp', esc_html__('Facebook Application ID', 'essb'), esc_html__('Enter ID of Facebook Application to be able to use Facebook Insights', 'essb'), true);
essb5_draw_input_option('opengraph_tags_fbauthor', esc_html__('Facebook Author Profile', 'essb'), '', true);

essb5_draw_field_group_close();

essb5_draw_heading( esc_html__('Images', 'essb'), '6');
essb5_draw_field_group_open();
essb5_draw_switch_option('sso_external_images', esc_html__('Allow external images', 'essb'), esc_html__('Include a text field where you can provide the image URL. By default, the plugin allows only the usage of images located in the WordPress media library.', 'essb'));
essb5_draw_switch_option('sso_multipleimages', esc_html__('Allow multiple images', 'essb'), esc_html__('Add fields for up to 5 additional images you can select for social media sharing.', 'essb'));
essb5_draw_switch_option('sso_gifimages', esc_html__('GIF images support', 'essb'), esc_html__('Set Yes if you have featured image animated GIF images (not required for static GIF images).', 'essb'));
essb5_draw_field_group_close();
essb5_draw_heading( esc_html__('WooCommerce', 'essb'), '6');
essb5_draw_field_group_open();
essb5_draw_switch_option('sso_deactivate_woogallery', esc_html__('Deactivate gallery integration', 'essb'), esc_html__('Don\'t include in the social media tags the gallery images.', 'essb'));
essb5_draw_switch_option('sso_deactivate_woocommerce', esc_html__('Deactivate product tags', 'essb'), esc_html__('Don\'t create product-specific tags - price, availability, promotion, etc. Enabling the option won\'t prevent your products from sharing - they just will have the regular tags like a post or page (not like a product).', 'essb'));
essb5_draw_field_group_close();
essb5_draw_heading( esc_html__('Expert', 'essb'), '6');
essb5_draw_field_group_open();
essb5_draw_switch_option('sso_httpshttp', esc_html__('Use http version of page in social tags', 'essb'), esc_html__('If you recently move from http to https and realize that shares are gone please activate this option and check are they back.', 'essb'));
essb5_draw_switch_option('sso_apply_the_content', esc_html__('Extract full content when generating description', 'essb'), esc_html__('If you see shortcodes in your description activate this option to extract as full rendered content. Warning! Activation of this option may affect work of other plugins or may lead to missing share buttons. If you notice something that is not OK with site immediately deactivate it.', 'essb'));
essb5_draw_field_group_close();

essb_advancedopts_section_close();