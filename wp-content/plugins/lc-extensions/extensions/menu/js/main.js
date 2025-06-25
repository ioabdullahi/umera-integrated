"use strict";



jQuery(document).ready(function($){



	jQuery('.lcmenu-mobile-hook, .lcmenupro-site-overlay, .lcmenu-mobile-close-hook').on('click', function(event){

		var mobileNavigation = $(this).closest(".dslc-module-front").eq(0).find('.lcmenupro-mobile-navigation');

		var siteOverlay = $(this).closest(".dslc-module-front").eq(0).find('.lcmenupro-site-overlay');



		if ( mobileNavigation.hasClass('open') ) {

			mobileNavigation.removeClass('open');

			siteOverlay.hide();

		} else {

			mobileNavigation.addClass('open');

			siteOverlay.show();

		}

	});



	/* Calculate left offset for the full-width dropdowns on page load.*/

	jQuery('.lcmenupro-navigation .menu-width-full').each(function(index, el) {

		setLeftMenuOffset(el);

	});



	/* Calculate left offset for the full-width dropdowns on hover.*/

	jQuery('.lcmenupro-navigation .menu-width-full').on('hover', function(event) {

		event.preventDefault();

		// @todo: cache it somehow?

		if ( jQuery(event.target).hasClass('menu-width-full') ) {

			setLeftMenuOffset(event.target);

		}

	});



	/* Fix issues: https://github.com/lumbermandesigns/lc-extensions/issues/6 */

	jQuery('.lcmenupro-mobile-navigation .lcmenupro-mobile-menu li a[href|="#"]:not([href="#"])').on('click', function(event){

		var mobileNavigation = jQuery('.lcmenupro-mobile-navigation');

		var siteOverlay = jQuery('.lcmenupro-site-overlay');



		if ( mobileNavigation.hasClass('open') ) {

		    mobileNavigation.removeClass('open');

		    siteOverlay.hide();

		} else {

		    mobileNavigation.addClass('open');

		    siteOverlay.show();

		}

	});



	/*

	 * TODO: We add z-index because we have a problem with subitem.

	 * We need to use z-index. Find a resolve how to use only CSS but not JS.

	 */

	jQuery( ".lcmenupro-navigation .menu > li.menu-item-has-children" ).mouseenter(function() {

		jQuery(this).closest(".dslc-sticky-row").css("z-index", "5");

	}).mouseleave(function() {

		jQuery(this).closest(".dslc-sticky-row").css("z-index", "");

	});



	setResFullMenuClass();



	jQuery(window).resize(function() {

        setResFullMenuClass();

	});



	/* Calculate left offset for the full-width dropdowns on hover.*/

	jQuery('.menu-width-full').on('hover', function(event) {

		event.preventDefault();

		// @todo: cache it somehow?

		if ( jQuery(event.target).hasClass('menu-width-full') ) {

			setLeftMenuOffset(event.target);

		}

	});



	// Add dropdown icon on page render.

	addMenuDropdownIcons ();



	try {

		// try/catch because 

		//     a) ThemeForest puts the site in a frame

		//     b) LC uses iframes

		//     c) there is no better way to accommodate both then a simple try/catch.

		//        i.e. LC requires parent.location.href and TF errors simply by touching parent.location.href



		// Add dropdown icon on every page code update (in editing mode).

		parent.document.addEventListener( 'pageCodeUpdated', function ( customEvent ) {

			addMenuDropdownIcons ()

		});

	} catch (error) {

		if(console && console.error) {

			console.error(error);

		}		

	}

});



/* Add custom chevron icon next to the elements with children */

function addMenuDropdownIcons () {

	var menuItems = document.querySelectorAll( '.menu > li.menu-item-has-children > a, .lcmenupro-mobile-menu li.menu-item-has-children > a' );



	for (var i = 0, len = menuItems.length; i < len; i++) {

		menuItems[i].insertAdjacentHTML('afterend', '<span class="dslc-navigation-arrow dslc-icon dslc-icon-chevron-down"></span>');

		menuItems[i].parentElement.className += " menu-with-arrow";

	}

}



function setLeftMenuOffset (element) {

	// Fix error: Can't get getBoundingClientRect property of undefined.

	if ( element === undefined ) {

		return;

	}



	var parentItemRect = element.getBoundingClientRect();

	var parentSection = jQuery(element).closest('.dslc-modules-section-wrapper')[0];

	var parentSectionRect = parentSection.getBoundingClientRect();

	var offset = parseInt(parentItemRect.left) - parseInt(parentSectionRect.left);



	jQuery(element).children('.sub-menu').first().css('left', '-' + offset + 'px');

}



function setResFullMenuClass() {

	if ( jQuery("body").hasClass("dslc-res-phone") || jQuery("body").hasClass("dslc-res-tablet") ) {

		jQuery(".lcmenupro-navigation ul.menu").addClass('dslc-res-full-menu');

	} else {

		jQuery(".lcmenupro-navigation ul.menu").removeClass('dslc-res-full-menu');

	}

}
