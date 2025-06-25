<?php 
/*
Plugin Name:ValvePress Rankie
Plugin URI: http://codecanyon.net/item/rankie-wordpress-rank-tracker-plugin/7605032?ref=ValvePress
Description: Track ranks for your desired keywords on Google and update them daily & generate reports
Version: 10.8.2
Author: ValvePress 
Author URI: http://codecanyon.net/user/ValvePress/portfolio?ref=ValvePress
*/

/*  Copyright 2014-2022  Wordpress Rankie   (email : sweetheatmn@gmail.com) */

  
	// UPDATES
	$rankie_licenseactive=get_option('wp_rankie_license_active','');
	
	if(trim($rankie_licenseactive) != ''){
	
		//fire checks
		require_once 'plugin-updates/plugin-update-checker.php';
		$rankie_UpdateChecker = Puc_v4_Factory::buildUpdateChecker(
				'https://deandev.com/upgrades/meta/wp-rankie.json',
				__FILE__,
				'valvepress-rankie'
		);
	
		//append keys to the download url
		$rankie_UpdateChecker->addResultFilter('rankie_addResultFilter');
		function rankie_addResultFilter($info){
				
			$wp_rankie_license = get_option('wp_rankie_license','');
	
			if(isset($info->download_url)){
				$info->download_url = $info->download_url . '&key='.$wp_rankie_license;
			}
			return $info;
		}
	}

 

//generic functions 
require_once 'r-functions.php';

//log
require_once 'r-log.php';

//Menus
require_once 'r-menus.php';

//Dashboard page
require_once 'r-dashboard.php';

//Settings page
function rankie_settings_fn(){
	require_once 'r-settings.php';	
}

//Ajax 
require_once 'r-ajax.php';

//Reports page
function rankie_reports_fn(){
	require_once 'r-reports.php';
}

//catch new words hook
require_once 'r-catch.php';  

//internal cron schedule
require_once 'r-schedule.php';

//internal cron schedule
require_once 'r-schedule-report.php';

//research page 
require_once 'r-research.php';

//license notice
require_once 'r-license.php';

//plugin tables
register_activation_hook( __FILE__, 'rankie_create_table' );
require_once 'r-tables.php';

//support widget
require_once 'widget.php';
 
?>
