/**
 * Theme JavaScript used in front-end
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 */

/**
 * ----------------------------------------------------------------------
 * Skip link focus code snippet from _s theme
 */

 var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	  is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	  is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

 if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
	var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
	window[ eventMethod ]( 'hashchange', function() {
		var element = document.getElementById( location.hash.substring( 1 ) );

		if ( element ) {
			if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) )
				element.tabIndex = -1;

			element.focus();
		}
	}, false );
 }

// setInterval(function(){ alert("Hello"); }, 3000);

(function ($) {
	"use strict";

	/**
	* ----------------------------------------------------------------------
	* Pseudo Preloader
	*/
	var clickedURL = '';


	// Page enter
	jQuery(document).ready(function ($) {
		hidePagePreloader();

		// the counter below required to hide preloader on cached in browser pages
		// when users click "Back" browsers button this counter hides preloader
		// as jQuery(document).ready do not fire again
		var hidePreloaderInterval = self.setInterval(function(){ hidePagePreloader(); }, 4000);
	});

	// $(window).load(hidePagePreloader());

	function hidePagePreloader() {
		if ( $('body').hasClass('pseudo-preloader') ) {
			$('html').addClass('content-loaded');
		}

		$("a").on( "click", function() {
		  clickedURL = $(this).attr("href");
		});
	}

	jQuery(document).ready(function ($) {

		/**
		 * ----------------------------------------------------------------------
		 * Notification panel close
		 */

		// get panel cookie id
		var panelHash = $('.notification-panel').data('uniquehash');

		// check if we have cookie with this id  or  we are in the customizer preview window
		if ( ($.cookie(panelHash) !== 'closed') && (! $('body').hasClass('in-wp-customizer'))  ) {
			$('.notification-panel').slideDown();
		}
		if ( $('body').hasClass('in-wp-customizer') ) {
			$('.notification-panel').show();
		}

		// if notification panel close button clicked
		$('.notification-panel__close').on('click', function(e){
			$('.notification-panel').slideUp();
			// generate unique panel id and set it as cookie if panel closed
			$.cookie($('.notification-panel').data('uniquehash'), 'closed', { expires: 7, path: '/' });
		});


		/**
		* ----------------------------------------------------------------------
		* Other
		*/

		// Style form buttons
		$('input[type=submit]').addClass('button'); // style all standard form buttons appropriately

		// Close help message popup.
		$('.close-help-popup').on('click', function(event) {
			event.preventDefault();
			$(this).parents('.message-popup').hide();
		});

		// Make videos responsive.
		$('.site-content, .site-footer').fitVids( {
			ignore: '.wp-block-embed__wrapper > *',
		} );

		/**
		* ----------------------------------------------------------------------
		* Mailchimp for WP and Newsletter Sign-up widget
		* show submit button only when some data for the email textfield has beed set
		*/

		$('.mc4wp-form [type=submit], .nsu-form [type=submit]').hide();
		$('.mc4wp-form [type=email], .nsu-form [type=email], .mc4wp-form [type=text], .nsu-form [type=text]').keyup(function() {
			if( validateEmail($(this).val()) ){
				$('.mc4wp-form [type=submit], .nsu-form [type=submit]').show();
			} else {
				$('.mc4wp-form [type=submit], .nsu-form [type=submit]').hide();
			}
		});

		function validateEmail(email) {
			if (!email) return false;
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			return emailReg.test( email );
		}

		/**
		* ----------------------------------------------------------------------
		* Easy Modal Plugin Integration
		*/

		$('.modal').each(function(index, el) {
			var modal = $(this);
			modal.addClass('theme-lumberman');
			modal.find('.title').wrapInner('<h3></h3>');
		});

		/**
		 * ----------------------------------------------------------------------
		 * Easy social buttons (full width template)
		 */

		$('.social-icons-fullwidth .essb_links_list').css('width', 'auto');

		/**
		 * ----------------------------------------------------------------------
		 * Mega Main Menu
		 * Mobile Offcanvas menu toggle
		 */
		if ( customizerOffCanvasMobileMenu.mobile_menu == 1 ) {
			$('.header-menu .mobile_toggle').unbind();
			// if clicked on <a class="mobile_toggle"> toggle offcanvas panel
			// by adding/removing class from closest .off-canvas-wrap element
			$('.header-menu .mobile_toggle').on('click', function(event) {
				event.preventDefault();
				$(this).closest(".off-canvas-wrap").toggleClass("move-left");
			});

			$('.exit-off-canvas').on('click', function(event) {
				event.preventDefault();
				$(".off-canvas-wrap").removeClass("move-right").removeClass("move-left");
			})
		}

		/**
		* ----------------------------------------------------------------------
		* Make page 100% screen height if there is no content created yet
		* and put "Activate Editor" button in the center
		*/
		var contentHeight = $('.admin-bar .site-main').outerHeight();
		if ( contentHeight < 1 ) {
			var screenHeight = $(window).height();
			var cointainerHeight = $('#global-container').outerHeight();
			var newContentHeight = screenHeight - cointainerHeight;
			if ( newContentHeight < 0 ) {
				newContentHeight = 160;
			}

			$('#content').css('min-height', newContentHeight + 'px');


			$('.dslca-activate-composer-hook').clone().appendTo('#content .entry-content');

			$('body:not(.single-lbmn_footer) #content .entry-content .dslca-activate-composer-hook').css({
				'position': 'absolute',
				'bottom': '50%',
				'right': '50%',
				'margin-right':'-80px',
				'margin-bottom':'-30px',
				'padding':'20px',
				'letter-spacing':'2px'
			});
		}

		/**
		* ----------------------------------------------------------------------
		* Hide "Activate Editor" button in Theme Customizer
		*/

		if ( $("body").hasClass('in-wp-customizer') ) {
			$('.dslca-activate-composer-hook').hide();
		}

		/**
		 * ----------------------------------------------------------------------
		 * Live Composer search form improvements
		 */

		// Add form class on text input focus
		$(".nav_search_box form input[type=text]").on("focus", function(e) {
				$(this).parent("form").addClass('search_form_focused');
		});

		$(".nav_search_box form input[type=text]").on("blur", function(e) {
				$(this).parent("form").removeClass('search_form_focused');
		});

		/**
		* ----------------------------------------------------------------------
		* Live Composer
		* Reset control value to theme default
		*/

		if ( $('body').hasClass('dslca-enabled') ) {
		// Run the code below if Live Composer is in active mode

			// When module controls initiated add "Reset to default" buttton
			// to the controls that can be reset
			$(document).on('click', '.dslca-module-edit-hook', function() {
				$('.dslca-options-filter-hook').on('click', function() {
					var resetButtonHTML = '<span class="button-reset">Reset to default</span>';
					$( '.dslca-module-edit-option-font, '+

						'.dslca-module-edit-option-css_main_font_size, '+
						'.dslca-module-edit-option-css_h1_font_size, '+
						'.dslca-module-edit-option-css_h2_font_size, '+
						'.dslca-module-edit-option-css_h3_font_size, '+
						'.dslca-module-edit-option-css_h4_font_size, '+
						'.dslca-module-edit-option-css_h5_font_size, '+
						'.dslca-module-edit-option-css_h6_font_size, '+

						'.dslca-module-edit-option-css_main_font_weight, '+
						'.dslca-module-edit-option-css_h1_font_weight, '+
						'.dslca-module-edit-option-css_h2_font_weight, '+
						'.dslca-module-edit-option-css_h3_font_weight, '+
						'.dslca-module-edit-option-css_h4_font_weight, '+
						'.dslca-module-edit-option-css_h5_font_weight, '+
						'.dslca-module-edit-option-css_h6_font_weight, '+

						'.dslca-module-edit-option-css_main_line_height, '+
						'.dslca-module-edit-option-css_h1_line_height, '+
						'.dslca-module-edit-option-css_h2_line_height, '+
						'.dslca-module-edit-option-css_h3_line_height, '+
						'.dslca-module-edit-option-css_h4_line_height, '+
						'.dslca-module-edit-option-css_h5_line_height, '+
						'.dslca-module-edit-option-css_h6_line_height, '+

						// '.dslca-module-edit-option-css_main_margin_bottom, '+
						'.dslca-module-edit-option-css_h1_margin_bottom, '+
						'.dslca-module-edit-option-css_h2_margin_bottom, '+
						'.dslca-module-edit-option-css_h3_margin_bottom, '+
						'.dslca-module-edit-option-css_h4_margin_bottom, '+
						'.dslca-module-edit-option-css_h5_margin_bottom, '+
						'.dslca-module-edit-option-css_h6_margin_bottom, '+

						'.dslca-module-edit-option-css_link_color, '+
						'.dslca-module-edit-option-css_link_color_hover, '+
						'.dslca-module-edit-option-css_main_color, '+
						'.dslca-module-edit-option-css_h1_color, '+
						'.dslca-module-edit-option-css_h2_color, '+
						'.dslca-module-edit-option-css_h3_color, '+
						'.dslca-module-edit-option-css_h4_color, '+
						'.dslca-module-edit-option-css_h5_color, '+
						'.dslca-module-edit-option-css_h6_color'
						).each(function(index, el) {
							if ( $(this).find('.button-reset').length == 0 ) {
								$(this).find('.dslca-module-edit-label').append(resetButtonHTML);
							}
					});


					// Add font loading spinner
					$('.dslca-module-edit-option-font').each(function(index, el) {
						$(this).append('<span class="dslc-icon-refresh dslc-icon-spin"></span>');
					});
				});
			});

			// dslcAllFontsArray is array of all fonts defined in /ds-live-composer/js/main.js
			// to make possible to use default theme font defined in Theme Customizer
			// we add 'inherit' option
			// dslcAllFontsArray.push('');
			// dslcRegularFontsArray.push('');

			// Control reset functionality
			$(document).on('click', '.dslca-module-edit-options-wrapper .button-reset', function(event) {
				var moduleBlock = $(this).closest('.dslca-module-edit-option');
				$(moduleBlock).find('input').val('').change();
				$(moduleBlock).find('.dslca-module-edit-field-font-suggest').text('');
				$(moduleBlock).find('.ui-slider-handle').css('left','0');
				$(moduleBlock).find('.sp-preview-inner').addClass('sp-clear-display').css('background-color','transparent');
			});

		}


		/**
		 * ----------------------------------------------------------------------
		 * Soft-scroll to the hash-tag
		 * https://css-tricks.com/snippets/jquery/smooth-scrolling/#comment-197181
		 */

		$('a[href*="\\#"]:not([href="\\#"],[href*="\\#respond"],[href^="\\#tab-"])').on( 'click', function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
				|| location.hostname == this.hostname) {

				var target = $(this.hash);

				// Scroll to the very top
				if (this.hash == '#top') {
					$('html,body').animate({
						scrollTop: 0
					}, 600);

					return false;
				}

				// Scroll to the anchor
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top - 70
					}, 1000);

					return false;
				}
			}
		});
	}); // document.ready
})(jQuery);
