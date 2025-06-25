<?php
if (function_exists('essb_advancedopts_settings_group')) {
	essb_advancedopts_settings_group('essb_options');
}

essb_advanced_options_relation('activate_networks_manage', 'switch', array('functions_networks'));

essb_advancedopts_section_open('ao-small-values');

$all_networks = essb_available_social_networks(true);
$networks_source = array();
foreach ($all_networks as $network_id => $data) {
	$networks_source[$network_id] = isset($data['name']) ? $data['name'] : $network_id;
}

essb5_draw_switch_option('activate_networks_manage', esc_html__('Setup personalized list of available social networks', 'essb'), '');

essb5_draw_select_option('functions_networks', esc_html__('Social networks', 'essb'), '', $networks_source, '', '', 'true');


essb_advancedopts_section_close();



