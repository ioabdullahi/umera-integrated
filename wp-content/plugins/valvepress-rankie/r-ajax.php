<?php

//ADD KEYWORDS
add_action( 'wp_ajax_wp_rankie_add_keywords', 'rankie_add_keywords_callback' );
function rankie_add_keywords_callback(){

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}

	global $wpdb;
	$keywords=$_POST['keywords'];
	$site = $_POST['site'];
	$group = $_POST['group'];
	$now = time();
	$keywords_arr = explode("\n", $keywords);
	$keywords_arr = array_filter($keywords_arr);
	
	 
	
	$addedArray=array();
	$newItem=array();
	if(count($keywords_arr) > 0){
		foreach ($keywords_arr as $newkeyword){
			if(trim($newkeyword) != ''){
				//insert this keyword 
				$query="insert into {$wpdb->prefix}rankie_keywords(keyword,keyword_site,keyword_type,keyword_group,date_updated	) values ('$newkeyword','$site','Manual','$group','1396170942')";
				
				$wpdb->query($query);
				$lastid = $wpdb->insert_id;
				$newItem['id'] = $lastid ;
				$newItem['keyword']=$newkeyword ;
				
				
				$addedArray[] = $newItem;
			
			}
			
			
		}
		
		
	}
	
	echo json_encode($addedArray);
	
 	die();
	
}

//DELETE RECORD
add_action( 'wp_ajax_wp_rankie_delete_keywords', 'rankie_delete_keywords_callback' );
function rankie_delete_keywords_callback(){

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}

	global  $wpdb;
	$ids = $_POST['ids'];
	
	$ids_arr = explode(',', $ids);
	$ids_arr = array_filter($ids_arr);
	
	foreach ($ids_arr as $id){
		echo 'deleting '.$id;
		
		$query="delete from {$wpdb->prefix}rankie_keywords where keyword_id=$id";
		$wpdb->query($query);
	}
	
}

//UPDATE RANK VIA AJAX GOOGLE :wp_rankie_update_rank
add_action( 'wp_ajax_wp_rankie_update_rank', 'rankie_update_rank_callback' );
function rankie_update_rank_callback(){

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}

	rankie_update_rank($_POST['itm'],$_POST['rank'],$_POST['url']);
	die();
}

//GET RANK TABLE
add_action( 'wp_ajax_wp_rankie_get_rank', 'rankie_get_rank_callback' );
function rankie_get_rank_callback(){

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}
	
	global  $wpdb;
	$wp_rankie_records_num= trim(get_option('wp_rankie_records_num' , '9'));
	if(is_numeric($wp_rankie_records_num) && $wp_rankie_records_num > 0){
		//correct
	}else{
		$wp_rankie_records_num = 9;
	}
	
	
	$id = $_POST['itm'];

	//verify id is numeric
	if(!is_numeric($id)){
		echo 'Error: ID is not numeric';
		die();
	}
	
	
	$query="SELECT * FROM {$wpdb->prefix}rankie_ranks where keyword_id = $id order by date DESC limit $wp_rankie_records_num ";
	$rows=$wpdb->get_results($query);
	
	$ranks=array(array('Rank','Rank'));
	$ranks2=array(array('Rank','Rank'));
	
	$rows=array_reverse($rows);
	$i = 0;
	foreach($rows as $row){
		if($row->rank != 0 ){
		 
			if($i < 9){
				$newRank = array(  date('m-d', strtotime( $row->date ) ) , (int) $row->rank );
				$ranks[]=$newRank;
			}
			
			$newRank2 = array(  $row->date , (int) $row->rank ,$row->rank_link);	
			$ranks2[]=$newRank2;
		} 
		$i++;
	}
	
	 
	
	if(@count($newRank) == 0 ) {
		$newRank =array(0,0);
		$ranks[]=$newRank;
	}
	
	print_r (json_encode( array( $ranks , array_reverse($ranks2) ) ));
	die();
}

//FETCH RANK wp_rankie_fetch_rank
add_action( 'wp_ajax_wp_rankie_fetch_rank', 'rankie_fetch_rank_callback' );
function rankie_fetch_rank_callback(){

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}
 	
	global $wp_rankie_last_log;
	
	//set disable time for cron because UI update is working 
	$disable_until = time() + 8 * 60 ; // now + 8 minutes
	update_option('wp_rankie_disabled_till',$disable_until);
	
	$itemId=$_POST['itm'];
	$ranking=rankie_fetch_rank($itemId);
	
	//last log message inject
	$ranking['lastLog'] =$wp_rankie_last_log; 
	
	print_r(json_encode($ranking) );
	die();
	
}

//GENERATE REPORT
add_action( 'wp_ajax_wp_rankie_generate_report', 'rankie_generate_report_callback' );
function rankie_generate_report_callback(){

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}
	
	$report=rankie_generate_report($_POST);
	
	print_r(json_encode($report));
	
 	die();

}

//UPDATE GROUP
add_action( 'wp_ajax_wp_rankie_change_keywords', 'rankie_change_keywords_callback' );

function rankie_change_keywords_callback() {

	//verify if logged in and if user is administrator
	if ( !is_user_logged_in() || !current_user_can('administrator') ) {
		
		echo 'You are not allowed to do this.';
		die();
	}
	
	global  $wpdb;
	$ids = $_POST['ids'];
	$group = ($_POST['group']);
	$ids_arr = explode(',', $ids);
	 
	
	foreach ($ids_arr as $id){
	 	
		$query="update {$wpdb->prefix}rankie_keywords set keyword_group = '$group' where keyword_id=$id";
		$wpdb->query($query);
	}
	
 die();
}

add_action( 'wp_ajax_send_test_mail', 'rankie_send_test_mail' );

function rankie_send_test_mail() {

		//verify if logged in and if user is administrator
		if ( !is_user_logged_in() || !current_user_can('administrator') ) {
			
			echo 'You are not allowed to do this.';
			die();
		}

		rankie_do_this_daily();
		
		echo ' Trigged sending a report to:'. $_POST['mail'];
		
	die();
}


