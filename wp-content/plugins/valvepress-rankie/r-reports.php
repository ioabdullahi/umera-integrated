<div class="wrap">

<h2>
	Ranking Reports 
</h2>

<div class="rankie-report_head" >
	  
	<select id="site" name="site" >
		<option  value="all">Show All Sites</option>
		<?php 

					//get disnct groups 
					global $wpdb;
					$query="SELECT distinct keyword_site  FROM {$wpdb->prefix}rankie_keywords ";
					$sites=$wpdb->get_results($query);
					
					foreach ($sites as $row){
						echo '<option  value="'. $row->keyword_site .'"  >'. $row->keyword_site .'</option>'; 
					}
					
		?> 		
	</select>
	
 	<select id="group"  name="group" >
		<option  value="all">Show All Groups</option>
		<?php 
				//get disnct groups
				global $wpdb;
				$query="SELECT distinct keyword_group  FROM {$wpdb->prefix}rankie_keywords ";
				$groups=$wpdb->get_results($query);
					
				foreach ($groups as $row){
					echo '<option  value="'. $row->keyword_group .'"  >'. $row->keyword_group .'</option>';
				}
			?>
	</select>
	
	<label>
		
	</label>
	<select id="type"  name="type" >
	
		<option  value="day" >By month</option>
		<option  value="month" >By year</option>
		<option  value="year" >All years</option>
		
	</select>
	
	<label class="dte day month" >
		Year
	</label>
	<select class="dte day month" id="year" name="year" >
		
		<?php 
			
			global $wpdb;
			$query = "SELECT distinct ( year(`date`) ) as year FROM `{$wpdb->prefix}rankie_changes` WHERE 1";
			
			$years=$wpdb->get_results($query);
			
			if(count($years)== 0 )  {
				$query ="select year(CURDATE()) as year";
				$years=$wpdb->get_results($query);
			}

			$months_opts = '';
			foreach ($years as $row){
				echo '<option  value="'. $row->year .'"  >'. $row->year .'</option>';
				
				//get months for this keyword
				$query = "SELECT distinct ( month(`date`) ) as month FROM `{$wpdb->prefix}rankie_changes` WHERE year(`date`) = '{$row->year}' order by month DESC";
				$months=$wpdb->get_results($query);
				
				if(count($months) == 0 ){
					$query = "SELECT   month(CURDATE())  as month   ";
					$months=$wpdb->get_results($query);
	
				}
				
				foreach ($months as $month){
					$months_opts .= '<option class=" year_month '.$row->year.'"  value="'. $month->month .'" >'. $month->month .'</option>' ;
				}
				 
			}
			
		?>
		
	</select>

	<label  class="dte day" >
		Month
	</label>
	<select class="dte day" id="month" name="month" >
		<?php echo $months_opts ;?>
	</select>
	
	<input id="generate_button" type="submit" value="Generate Report" class="button" name=""> <button title="Download generated report as a PDF" id="rankie-download_button" class="button"><div class="dashicons dashicons-download"></div></button>  <div class="spin_wrap"><span class="spinner" style="display: none;"></span></div>
	
	
</div> 


<div  id="rankie-report_wrap">

	<h3 style="margin-top:10px" id="report_title"></h2>
	
	<hr>
 	
	<div id="report_map" class="report_map"></div>
	
	<div style="position: relative;width:100%">
	 
	 <div  id="rankie-report_tables" class="rankie-report_tables"></div>
	
	 <div id="rankie-pie_holder">
	 	<div  id="report_pie" class="report_pie" ></div>
	 	<div  id="report_pie_2" class="report_pie_2" ></div>
	 </div>
	 
	 
	 
	 
	 
	</div>
	
	<div id="live_ranking"></div>

</div>

</div>