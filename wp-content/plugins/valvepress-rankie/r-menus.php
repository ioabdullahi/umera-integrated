<?php
/**
 * Menus of the plugin
 */
 
add_action('admin_menu', 'ranker_control_menu');

function ranker_control_menu() {

	$capability = 'administrator';
	
	if (current_user_can('editor')){
		$capability = 'editor';
	}elseif (current_user_can('author')){
		$capability = 'author';
	}	
	
	
	 
	add_menu_page( 'WP Rankie', 'WP Rankie', $capability, 'wp_rankie', 'rankie_dashboard_fn', 'dashicons-chart-area', 77777788877777 );
	
	$dashboardSlug=add_submenu_page( 'wp_rankie',  'Wordpress Rankie','Dashboard', $capability, 'wp_rankie', 'rankie_dashboard_fn' );
	
	$reportsSlug = add_submenu_page( 'wp_rankie', 'Wordpress Rankie Reports', 'Reports', $capability, 'wp_rankie_reports', 'rankie_reports_fn' );
	$researchSlug = add_submenu_page( 'wp_rankie', 'Wordpress Rankie Keyword Research', 'Research', $capability, 'rankie_research', 'rankie_research' );
	
	$settingsSlug = add_submenu_page( 'wp_rankie', 'Wordpress Rankie Settings', 'Settings', 'administrator', 'wp_rankie_settings', 'rankie_settings_fn' );
	
	$logSlug = add_submenu_page( 'wp_rankie', 'Wordpress Rankie Log', 'Log', 'administrator', 'wp_rankie_log', 'rankie_log' );
	
	
	
	add_action('admin_head-'.$dashboardSlug, 'rankie_admin_head_dashboard');
	add_action('admin_head-'.$settingsSlug, 'rankie_admin_head_settings');
	add_action('admin_head-'.$reportsSlug , 'rankie_admin_head_reports');
	add_action('admin_head-'.$researchSlug , 'rankie_admin_head_research');
	 

}

// Dashboard styles & scripts
function rankie_admin_head_dashboard(){
	
	//data tables
	wp_enqueue_script('wp-rankie-data-tables',plugins_url( '/js/jquery.dataTables.min.js' , __FILE__ ));
	
	//google fucken chart
	wp_enqueue_script('wp-rankie-google-jsapi','https://www.google.com/jsapi');
	
	//ui dialog
	wp_enqueue_style ( 'wp-jquery-ui-dialog' );
	wp_enqueue_script ( 'jquery-ui-dialog' );
	
	//dashboard style
	wp_enqueue_style('wp-rankie-dashboard-css',plugins_url( '/css/dashboard.css' , __FILE__ ));
	
	//dashboard
	wp_enqueue_script('wp-rankie-dashboard',plugins_url( '/js/dashboard.js?v=1.1' , __FILE__ ));
	
}

// Settings page styles and scripts
function rankie_admin_head_settings(){
	
	wp_enqueue_script('wp-rankie-settings',plugins_url( '/js/settings.js' , __FILE__ ));
	wp_enqueue_script('wp-rankie-research-settings',plugins_url( '/js/options.js' , __FILE__ ));
}
 
// Reports page styles and scripts
function rankie_admin_head_reports(){
	
	//google fucken chart
	wp_enqueue_script('wp-rankie-google-jsapi','https://www.google.com/jsapi');
	
	wp_enqueue_script('wp-rankie-reports',plugins_url( '/js/reports.js?v=1.1' , __FILE__ ) );
	
	
	wp_enqueue_script('wp-rankie-html2pdf',plugins_url( '/js/html2pdf.bundle.js' , __FILE__ ));
	
	wp_enqueue_style('wp-rankie-dashboard-css',plugins_url( '/css/dashboard.css' , __FILE__ ));

}

// Reports page styles and scripts
function rankie_admin_head_research(){

	//ui dialog
	wp_enqueue_style ( 'wp-jquery-ui-dialog' );
	wp_enqueue_script ( 'jquery-ui-dialog' );
	
	
	wp_enqueue_script('wp-rankie-gcomplete',plugins_url( '/js/jquery.gcomplete.0.1.2.js' , __FILE__ ));
	wp_enqueue_script('wp-rankie-main',plugins_url( '/js/main.js' , __FILE__ ));

	wp_enqueue_style('wp-rankie-dashboard-css',plugins_url( '/css/dashboard.css' , __FILE__ ));

}
