<?php

// Report all PHP errors (see changelog)
error_reporting(E_ALL);

// Same as error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);

// wp-load
require_once('../../../wp-load.php');

// set last external cron trigger 
update_option('wp_rankie_last_external_cron', time());

// report external cron 
rankie_log_new('External cron', 'cron file got trigged externally now');

rankie_update_rank_function_wrap();