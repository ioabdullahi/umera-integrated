//Google maps
google.load('visualization', '1.0', {'packages':['corechart']});


//UPDATE REPORT BUTTON
jQuery('#generate_button').unbind('click');
jQuery('#generate_button').on('click' , function(){
    	
	"use strict";
	
    	jQuery('.spinner').show().addClass('is-active');
        
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
    
            data: {
                action: 'wp_rankie_generate_report',
                site: jQuery('#site').val(),
                group: jQuery('#group').val(),
                type: jQuery('#type').val(),
                year: jQuery('#year').val(),
                month: jQuery('#month').val()
                
            },
            
            success:function(data){
            jQuery('.spinner').hide();
            
             var res = jQuery.parseJSON(data);
             jQuery('#report_title').html(res[3]);
             var data = google.visualization.arrayToDataTable(res[0]);

			                  // Set chart options
			                  var options = {	
			                		  			title: res[3]  ,
			                                    width: jQuery('.report_map').width() - 10 , height: 190,
			                          vAxis: { direction:1, viewWindowMode:"pretty"}};

			                  // Instantiate and draw our chart, passing in some options.
			                  var chart = new google.visualization.LineChart(document.getElementById('report_map'));
			                  chart.draw(data, options);
			                  
			                  
			                  //add tables 
			                  jQuery('#rankie-report_tables').empty();
			                  jQuery('#rankie-report_tables').html(res[1]);
			                  
			                  //draw the pie 
			                  
			                  var data = google.visualization.arrayToDataTable(res[2][0]);

			                  // Create and draw the visualization.
			                  new google.visualization.PieChart(document.getElementById('report_pie')).
			                      draw(data, {title: res[3] + " vs Outranking"});

			                  var data = google.visualization.arrayToDataTable(res[2][1]);

			                  // Create and draw the visualization.
			                  new google.visualization.PieChart(document.getElementById('report_pie_2')).
			                      draw(data, {title: res[3] + " summary"});

             
            
            }
        
        });
        
        return false;
    }

);

//Download button
jQuery('#rankie-download_button').on('click' ,function(){
	
	 
	var element = document.getElementById('rankie-report_wrap');
	var opt = {
	  margin:       0.5,
	  filename:     jQuery('#report_title').html() + '.pdf' ,
	  image:        { type: 'jpeg', quality: 0.98 },
	  html2canvas:  { scale: 2 },
	  jsPDF:        { unit: 'in', orientation: 'landscape' }
	};

	// New Promise-based usage:
	html2pdf().set(opt).from(element).save();

	 
	
	return false;
});

//report head adjustment
jQuery('#type').change(function(){
	
	"use strict";
	
    jQuery('.dte'  ).hide();
    jQuery('.' + jQuery(this).val() ).show();
});


function updateChildMonths(){
	
	"use strict";
    
    jQuery('.year_month').hide();
    jQuery('.' + jQuery('#year').val()).show();

}

jQuery('#year').change(function(){
	
	"use strict";
    
    updateChildMonths();

});


jQuery(document).ready(function(){
	
	"use strict";
	updateChildMonths();
});