<?php

/**
 * Enable performance version of the share buttons
 *
 * @since 9.5
 * @author appscreo
 * @package EasySocialShareButtons
 *
 */

add_filter('essb_avaliable_counter_positions', 'essb_slim_avaliable_counter_positions');

function essb_slim_avaliable_counter_positions($counters = array()) {
    
    if (isset($counters['left'])) {
        unset($counters['left']);
    }
    
    if (isset($counters['right'])) {
        unset($counters['right']);
    }
    
    if (isset($counters['leftm'])) {
        unset($counters['leftm']);
    }
    
    if (isset($counters['rightm'])) {
        unset($counters['rightm']);
    }
    
    if (isset($counters['topm'])) {
        unset($counters['topm']);
    }
    
    if (isset($counters['top'])) {
        unset($counters['top']);
    }
    
    if (isset($counters['topn'])) {
        unset($counters['topn']);
    }
    
    if (isset($counters['insidehover'])) {
        unset($counters['insidehover']);
    }
    
    return $counters;
}


add_filter('essb_avaiable_total_counter_position', 'essb_slim_avaiable_total_counter_position');

function essb_slim_avaiable_total_counter_position($counters = array()) {
    
    if (isset($counters['left'])) {
        unset($counters['left']);
    }
    
    if (isset($counters['right'])) {
        unset($counters['right']);
    }
    
    if (isset($counters['after'])) {
        unset($counters['after']);
    }
    
    if (isset($counters['before'])) {
        unset($counters['before']);
    }
    
    return $counters;
}

add_filter('essb_available_more_button_commands', 'essb_slim_styles_available_more_button_commands');

function essb_slim_styles_available_more_button_commands($commands = array()) {
    
    if (isset($commands['5'])) {
        unset($commands['5']);
    }
    
    if (isset($commands['4'])) {
        unset($commands['4']);
    }
    
    if (isset($commands['1'])) {
        unset($commands['1']);
    }
    
    return $commands;
}


add_filter('essb4_templates', 'essb_slim_styles_templates');

function essb_slim_styles_templates($templates = array()) {
    
    if (isset($templates['58'])) {
        unset($templates['58']);
    }
    
    if (isset($templates['57'])) {
        unset($templates['57']);
    }
    
    if (isset($templates['56'])) {
        unset($templates['56']);
    }
    
    if (isset($templates['55'])) {
        unset($templates['55']);
    }
    
    if (isset($templates['54'])) {
        unset($templates['54']);
    }
    
    if (isset($templates['53'])) {
        unset($templates['53']);
    }
    
    if (isset($templates['52'])) {
        unset($templates['52']);
    }
    
    if (isset($templates['51'])) {
        unset($templates['51']);
    }
    
    if (isset($templates['50'])) {
        unset($templates['50']);
    }
    
    
    if (isset($templates['49'])) {
        unset($templates['49']);
    }
    
    
    if (isset($templates['48'])) {
        unset($templates['48']);
    }
    
    if (isset($templates['47'])) {
        unset($templates['47']);
    }
    
    if (isset($templates['46'])) {
        unset($templates['46']);
    }
    
    if (isset($templates['45'])) {
        unset($templates['45']);
    }
    
    if (isset($templates['44'])) {
        unset($templates['44']);
    }
    
    if (isset($templates['43'])) {
        unset($templates['43']);
    }
    
    if (isset($templates['42'])) {
        unset($templates['42']);
    }
    
    if (isset($templates['41'])) {
        unset($templates['41']);
    }
    
    if (isset($templates['40'])) {
        unset($templates['40']);
    }
    
    if (isset($templates['39'])) {
        unset($templates['39']);
    }
    
    if (isset($templates['38'])) {
        unset($templates['38']);
    }
    
    if (isset($templates['37'])) {
        unset($templates['37']);
    }
    
    if (isset($templates['36'])) {
        unset($templates['36']);
    }
    
    if (isset($templates['35'])) {
        unset($templates['35']);
    }
    
    if (isset($templates['34'])) {
        unset($templates['34']);
    }
    
    if (isset($templates['33'])) {
        unset($templates['33']);
    }
    
    if (isset($templates['32'])) {
        unset($templates['32']);
    }
    
    if (isset($templates['31'])) {
        unset($templates['31']);
    }
    
    if (isset($templates['30'])) {
        unset($templates['30']);
    }
    
    if (isset($templates['29'])) {
        unset($templates['29']);
    }
    
    if (isset($templates['27'])) {
        unset($templates['27']);
    }
    
    if (isset($templates['26'])) {
        unset($templates['26']);
    }
    
    if (isset($templates['25'])) {
        unset($templates['25']);
    }
    
    if (isset($templates['24'])) {
        unset($templates['24']);
    }
    
    if (isset($templates['23'])) {
        unset($templates['23']);
    }
    
    if (isset($templates['22'])) {
        unset($templates['22']);
    }
    
    if (isset($templates['21'])) {
        unset($templates['21']);
    }
    
    if (isset($templates['20'])) {
        unset($templates['20']);
    }
    
    if (isset($templates['19'])) {
        unset($templates['19']);
    }
    
    if (isset($templates['18'])) {
        unset($templates['18']);
    }
    
    if (isset($templates['17'])) {
        unset($templates['17']);
    }
    
    if (isset($templates['16'])) {
        unset($templates['16']);
    }
    
    if (isset($templates['14'])) {
        unset($templates['14']);
    }
    
    if (isset($templates['13'])) {
        unset($templates['13']);
    }
    
    if (isset($templates['12'])) {
        unset($templates['12']);
    }
    
    
    if (isset($templates['11'])) {
        unset($templates['11']);
    }
    
    if (isset($templates['10'])) {
        unset($templates['10']);
    }
    
    if (isset($templates['8'])) {
        unset($templates['8']);
    }
    
    if (isset($templates['7'])) {
        unset($templates['7']);
    }
    
    return $templates;
}

add_filter('essb4_social_networks', 'essb_slim_essb4_social_networks');

function essb_slim_essb4_social_networks($networks = array()) {
    
    $supported_networks = array('twitter', 'facebook', 'linkedin', 'pinterest', 'buffer', 'reddit', 'pocket',
        'hackernews', 'mail', 'print', 'sms', 'copy', 'messenger', 'line', 'whatsapp', 'tumblr', 'vk', 'xing',
        'flipboard', 'telegram', 'mix', 'yummly', 'subscribe', 'viber', 'more'
    );
    
    $return_networks = array();
    
    foreach ($supported_networks as $key) {
        if (isset($networks[$key])) {
            $return_networks[$key] = $networks[$key];
        }
    }
    
    return $return_networks;
}

add_filter('essb_positions_mobile_only', function($methods) {    
    if (isset($methods['sharebar'])) {
        unset($methods['sharebar']);
    }
    
    if (isset($methods['sharepoint'])) {
        unset($methods['sharepoint']);
    }
    
    return $methods;
});

add_filter('essb_available_button_positions', function($methods) {
    $allowed_methods = array('sidebar');
    $return_methods = array();
    
    foreach ($allowed_methods as $method_id) {
        if (isset($methods[$method_id])) {
            $return_methods[$method_id] = $methods[$method_id];
        }
    }
    
    return $return_methods;
});

add_filter('essb_available_content_positions', function($methods) {
    $allowed_methods = array('content_top', 'content_bottom', 'content_both');
    $return_methods = array();
        
    foreach ($allowed_methods as $method_id) {
        if (isset($methods[$method_id])) {
            $return_methods[$method_id] = $methods[$method_id];
        }
    }
        
    return $return_methods;
});

add_filter('essb_after_draw_buttons_container', 'essb_light_mode_after_share_buttons_container', 10, 2);
function essb_light_mode_after_share_buttons_container($share, $style) {
    $r = '';
    
    if (isset($style['button_width']) && !empty($style['button_width'])) {
        $r .= '<style type="text/css">
.essb_links.essb_width_columns_4 li {
	width: 25%;
}

.essb_links.essb_width_columns_5 li {
	width: 20%;
}

.essb_links.essb_width_columns_6 li {
	width: 16.6666%;
}

.essb_links.essb_width_columns_7 li {
	width: 14.285%;
}

.essb_links.essb_width_columns_8 li {
	width: 12.5%;
}

.essb_links.essb_width_columns_9 li {
	width: 11.1111%;
}

.essb_links.essb_width_columns_10 li {
	width: 10%;
}

.essb_links.essb_width_columns_3 li {
	width: 33.3333%;
}

.essb_links.essb_width_columns_2 li {
	width: 50%;
}

.essb_links.essb_width_columns_1 li {
	width: 100%;
}

.essb_links.essb_width_columns_4 li a,
.essb_links.essb_width_columns_5 li a,
.essb_links.essb_width_columns_3 li a,
.essb_links.essb_width_columns_2 li a,
.essb_links.essb_width_columns_1 li a {
	width: 98%;
}

.essb_links.essb_width_columns_6 li a,
.essb_links.essb_width_columns_7 li a,
.essb_links.essb_width_columns_8 li a,
.essb_links.essb_width_columns_9 li a,
.essb_links.essb_width_columns_10 li a {
	width: 96%;
}

.essb_nospace li a {
	margin-right: 0px !important;
	margin-bottom: 0px !important;
}

.essb_links.essb_nospace.essb_width_columns_1 li a,
.essb_links.essb_nospace.essb_width_columns_2 li a,
.essb_links.essb_nospace.essb_width_columns_3 li a,
.essb_links.essb_nospace.essb_width_columns_4 li a,
.essb_links.essb_nospace.essb_width_columns_5 li a,
.essb_links.essb_nospace.essb_width_columns_6 li a,
.essb_links.essb_nospace.essb_width_columns_7 li a,
.essb_links.essb_nospace.essb_width_columns_8 li a,
.essb_links.essb_nospace.essb_width_columns_9 li a,
.essb_links.essb_nospace.essb_width_columns_10 li a {
	width: 100%;
}

.essb_links.essb_width_flex ul {
	display: flex;
	flex-direction: row;
	-webkit-flex-direction: row;
	align-items: stretch;
	-webkit-align-items: stretch;
}

.essb_links.essb_width_flex li {
	flex: 1;
	-webkit-flex: 1;
	transition: flex 100ms ease-in-out;
}

.essb_links.essb_width_flex li:not(.essb_totalcount_item):hover {
	flex: 1.3;
	-webkit-flex: 1.3;
}
.essb_links.essb_width_flex li:not(.essb_totalcount_item) {
	margin-right: 8px !important;
}

.essb_links.essb_width_flex li:last-of-type { margin-right: 0 !important; }

.essb_links.essb_width_flex li a {
	width: 100%;
	white-space: nowrap !important;
}

.essb_links.essb_width_flex.essb_nospace li a {
	width: 100% !important;
}

.essb_links.essb_width_flex li.essb_link_more,.essb_links.essb_width_flex li.essb_link_more_dots,
.essb_links.essb_width_flex li.essb_link_less,.essb_links.essb_width_flex li.essb_totalcount_item {
	width: inherit;
}

.essb_links.essb_width_flex li.essb_link_less,.essb_links.essb_width_flex li.essb_totalcount_item {
	margin: auto 0 !important;
	flex: none !important;
	-webkit-flex: none !important;
}

.essb_links.essb_width_flex li.essb_totalcount_item .essb_totalcount.essb_t_r_big,
.essb_links.essb_width_flex li.essb_totalcount_item .essb_totalcount.essb_t_l_big {
	margin-right: 0;
	margin-left: 0;
	padding: 0 10px;
}

.essb_links.essb_fixed {
	position: fixed;
	top: 0;
	background: #fff;
	display: block;
	padding-top: 10px;
	padding-bottom: 10px;
	padding-right: 10px;
	z-index: 2000;
}
</style>

';
    }
    
    if (isset($style['button_size']) && !empty($style['button_size'])) {
        $r .= '<style type="text/css">
/** Button Size Control **/
.essb_links.essb_size_xs .essb_icon { width: 24px !important; height: 24px !important; }
.essb_links.essb_size_xs .essb_icon:before { font-size: 14px !important; top: 5px !important; left: 5px !important; }
.essb_links.essb_size_xs li a .essb_network_name { font-size: 11px !important; text-transform: uppercase !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xs .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big { font-size: 14px !important; line-height: 14px !important;}
.essb_links.essb_size_xs .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 10px !important; line-height: 10px !important; margin-top: 1px !important; }
.essb_links.essb_size_xs .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xs .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 14px !important; line-height: 25px !important; }

.essb_links.essb_size_s .essb_icon { width: 30px !important; height: 30px !important; }
.essb_links.essb_size_s .essb_icon:before { font-size: 16px !important; top: 7px !important; left: 7px !important; }
.essb_links.essb_size_s li a .essb_network_name { font-size: 12px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_s .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_s .essb_totalcount_item .essb_t_r_big { font-size: 16px !important; line-height: 16px !important;}
.essb_links.essb_size_s .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_s .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 9px !important; line-height: 9px !important; margin-top: 1px !important; }
.essb_links.essb_size_s .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_s .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 16px !important; line-height: 26px !important; }

.essb_links.essb_size_m .essb_icon { width: 36px !important; height: 36px !important; }
.essb_links.essb_size_m .essb_icon:before { font-size: 18px !important; top: 9px !important; left: 9px !important; }
.essb_links.essb_size_m li a .essb_network_name { font-size: 13px !important; font-weight: 400 !important; line-height: 12px !important; }

.essb_links.essb_size_l .essb_icon { width: 42px !important; height: 42px !important; }
.essb_links.essb_size_l .essb_icon:before { font-size: 20px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_l li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }

.essb_links.essb_size_xl .essb_icon { width: 46px !important; height: 46px !important; }
.essb_links.essb_size_xl .essb_icon:before { font-size: 24px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_xl li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xl .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xl .essb_totalcount_item .essb_t_r_big { font-size: 21px !important; line-height: 21px !important;}
.essb_links.essb_size_xl .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xl .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 11px !important; line-height: 11px !important; margin-top: 2px !important; }
.essb_links.essb_size_xl .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xl .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 21px !important; line-height: 34px !important; }


.essb_links.essb_size_xxl .essb_icon { width: 50px !important; height: 50px !important; }
.essb_links.essb_size_xxl .essb_icon:before { font-size: 28px !important; top: 11px !important; left: 11px !important; }
.essb_links.essb_size_xxl li a .essb_network_name { font-size: 14px !important; font-weight: 400 !important; line-height: 12px !important; }
.essb_links.essb_size_xxl .essb_totalcount_item .essb_t_l_big, .essb_links.essb_size_xxl .essb_totalcount_item .essb_t_r_big { font-size: 24px !important; line-height: 24px !important;}
.essb_links.essb_size_xxl .essb_totalcount_item .essb_t_l_big .essb_t_nb_after, .essb_links.essb_size_xxl .essb_totalcount_item .essb_t_r_big .essb_t_nb_after { font-size: 12px !important; line-height: 12px !important; margin-top: 2px !important; }
.essb_links.essb_size_xxl .essb_totalcount_item .essb_t_l_big.essb_total_icon:before, .essb_links.essb_size_xxl .essb_totalcount_item .essb_t_r_big.essb_total_icon:before { font-size: 24px !important; line-height: 38px !important; }
</style>
';
    }
    
    return $r;
}