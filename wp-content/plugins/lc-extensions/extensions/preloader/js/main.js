(function ($) {

	var preloader = lcext_preloader;

	jQuery(document).ready(function() {

		jQuery('body').prepend('<div class="lcext-page-loader"></div>');

		var block = '';

		if ( preloader != "" ) {
			switch (preloader){
				case "spinner":
					block += '<div class="lcext-loader lds-css"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
					break;
				case "eclipse":
					block += '<div class="lcext-loader lds-css ng-scope"><div class="lds-eclipse"><div></div></div>';
					break;
				case "spin":
					block += '<div class="lcext-loader lds-css ng-scope"><div class="lds-spin" ><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>';
					break;
				case "dual-ring":
					block += '<div class="lcext-loader lds-css ng-scope"><div class="lds-dual-ring"><div></div></div>';
					break;
				case "pacman":
					block += '<div class="lcext-loader lds-css ng-scope"><div class="lds-pacman"><div><div></div><div></div><div></div></div><div><div></div><div></div></div></div>';
					break;
			}

			jQuery('.lcext-page-loader').prepend(block);
		}

	});

	jQuery(window).load(function(){
	
		fade_away();
		
		function fade_away(){
			jQuery('.lcext-page-loader').delay(1000).fadeOut("flow");
			jQuery('body').removeClass('lcext-body');
		}
		
	});

	
})(jQuery);