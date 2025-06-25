<?php
 
function rankie_create_table() {
	
	global $wpdb;
	$prefix=$wpdb->prefix ;
	
	// update options prefix from wp_rankie to rankie 
	if ($prefix != 'wp_' &&  rankie_table_exists ( "wp_rankie_log" )) {
		
		//delete new tables
		if ( rankie_table_exists ( "{$prefix}rankie_log" )) {
			//new tables exist lets delete
			$querys = "DROP TABLE {$prefix}rankie_changes;DROP TABLE {$prefix}rankie_log;DROP TABLE {$prefix}rankie_ranks;DROP TABLE {$prefix}rankie_keywords;";
		
			// executing quiries
			$que = explode ( ';', $querys );
			foreach ( $que as $query ) {
				if (trim ( $query ) != '') {
					$wpdb->query ( $query );
				}
			}
		
		}
		
		//adapt old tables exist 
		$querys = "ALTER TABLE wp_rankie_changes	
  RENAME TO {$prefix}rankie_changes	;
 
ALTER TABLE wp_rankie_keywords RENAME TO {$prefix}rankie_keywords; 

ALTER TABLE wp_rankie_log	
  RENAME TO {$prefix}rankie_log;
 
ALTER TABLE wp_rankie_ranks	
  RENAME TO {$prefix}rankie_ranks; ";
		
		// executing quiries
		$que = explode ( ';', $querys );
		foreach ( $que as $query ) {
			if (trim ( $query ) != '') {
				$wpdb->query ( $query );
			}
		}
		
		
	}
	
	// comments table
	if (! rankie_table_exists ( "{$prefix}rankie_log" )) {
		
		$querys = "CREATE TABLE IF NOT EXISTS `{$prefix}rankie_changes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id` int(11) NOT NULL,
  `rank_change` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)   DEFAULT CHARSET=latin1 AUTO_INCREMENT=161 ;

CREATE TABLE IF NOT EXISTS `{$prefix}rankie_keywords` (
  `keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(300) NOT NULL,
  `keyword_rank` int(11) NOT NULL DEFAULT '0',
  `keyword_site` varchar(300) NOT NULL,
  `keyword_type` varchar(20) NOT NULL DEFAULT 'Manual',
  `keyword_group` varchar(50) NOT NULL DEFAULT '-',
  `date_updated` varchar(50) NOT NULL,
  PRIMARY KEY (`keyword_id`)
)   DEFAULT CHARSET=latin1 AUTO_INCREMENT=368 ;

CREATE TABLE IF NOT EXISTS `{$prefix}rankie_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(50) NOT NULL,
  `data` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)   DEFAULT CHARSET=latin1 AUTO_INCREMENT=55 ;

CREATE TABLE IF NOT EXISTS `{$prefix}rankie_ranks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rank_link` varchar(300) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`)
)   DEFAULT CHARSET=latin1 AUTO_INCREMENT=536 ;
	";
		// executing quiries
		$que = explode ( ';', $querys );
		foreach ( $que as $query ) {
			if (trim ( $query ) != '') {
				$wpdb->query ( $query );
			}
		}
	}//first version 
	
	//add last_try in the new version
	$current_table_version =get_option('wp_rankie_table_version', 1 );
	
	if( $current_table_version < 2 ){
		$query="ALTER TABLE `{$prefix}rankie_keywords` ADD `last_try` INT NOT NULL DEFAULT '1401036392';";
		$wpdb->query ( $query );
	}
	
	
	if( $current_table_version < 3 ){
		$query="ALTER TABLE {$prefix}rankie_keywords CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;";
		$wpdb->query ( $query );
		
		$query="ALTER TABLE {$prefix}rankie_ranks CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;";
		$wpdb->query ( $query );
	}

	
	if( $current_table_version < 4 ){
		
		$query="ALTER TABLE `{$prefix}rankie_keywords` ADD `last_checked_page` INT NOT NULL DEFAULT '0';";
		$wpdb->query ( $query );
		update_option('wp_rankie_table_version',4);
	}
	
	
	 
}
function rankie_table_exists($table) {
	global $wpdb;
	$rows = $wpdb->get_row ( 'show tables like "' . $table . '"', ARRAY_N );
	
	if( ! isset($rows)) return false;
	
	return (count ( $rows ) > 0);
}

function rankie_check_table_version(){
	
	$current_table_version =get_option('wp_rankie_table_version', 1 );
	
	if($current_table_version < 4){
		
		rankie_create_table();
		
		echo '<div class="updated">
		        <p>Database tables for Rankie updated successfully.</p>
		    </div>';
	}
	
}