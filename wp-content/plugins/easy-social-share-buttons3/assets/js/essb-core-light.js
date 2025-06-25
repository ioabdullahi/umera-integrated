/**
 * Easy Social Share Buttons for WordPress Core Javascript
 *
 * @package EasySocialShareButtons
 * @author appscreo
 * @since 5.0
 */

/**
 * jQuery function extension package for Easy Social Share Buttons
 */
jQuery(document).ready(function($){
	"use strict";
	
	jQuery.fn.essb_toggle_more = function(){
		return this.each(function(){
			$(this).removeClass('essb_after_more');
			$(this).addClass('essb_before_less');
		});
	};

	jQuery.fn.essb_toggle_less = function(){
		return this.each(function(){
			$(this).addClass('essb_after_more');
			$(this).removeClass('essb_before_less');
		});
	};

	jQuery.fn.extend({
		center: function () {
			return this.each(function() {
				var top = (jQuery(window).height() - jQuery(this).outerHeight()) / 2;
				var left = (jQuery(window).width() - jQuery(this).outerWidth()) / 2;
				jQuery(this).css({position:'fixed', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
			});
		}
	});

});


( function( $ ) {
	"use strict";
	
	/**
	 * Easy Social Share Buttons for WordPress
	 *
	 * @package EasySocialShareButtons
	 * @since 5.0
	 * @author appscreo
	 */
	var essb = window.essb = {};

	var debounce = function( func, wait ) {
		var timeout, args, context, timestamp;
		return function() {
			context = this;
			args = [].slice.call( arguments, 0 );
			timestamp = new Date();
			var later = function() {
				var last = ( new Date() ) - timestamp;
				if ( last < wait ) {
					timeout = setTimeout( later, wait - last );
				} else {
					timeout = null;
					func.apply( context, args );
				}
			};
			if ( ! timeout ) {
				timeout = setTimeout( later, wait );
			}
		};
	};

	var isElementInViewport = function (el) {

	    //special bonus for those using jQuery
	    if (typeof jQuery === "function" && el instanceof jQuery) {
	        el = el[0];
	    }

	    var rect = el.getBoundingClientRect();

	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	    );
	};
	
	var isVisibleSelector = function(selector) {
		var top_of_element = $(selector).offset().top;
	    var bottom_of_element = $(selector).offset().top + $(selector).outerHeight();
	    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
	    var top_of_screen = $(window).scrollTop();

	    if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
	        return true;
	    } else {
	        return false;
	    }
	};

	essb.add_event = function(eventID, user_function) {
		if (!essb.events) essb.events = {};
		essb.events[eventID] = user_function;
	};

	essb.trigger = function(eventID, options) {
		if (!essb.events) return;
		if (essb.events[eventID]) essb.events[eventID](options);
	};

	essb.window = function (url, service, instance, trackingOnly) {
		var element = $('.essb_'+instance),
			instance_post_id = $(element).attr('data-essb-postid') || '',
			instance_position = $(element).attr('data-essb-position') || '',
			wnd,
			isMobile = $(window).width() <= 1024 ? true : false,
			keyWin = 'essb_share_window' + (isMobile) + '-' + (Date.now()).toString();

		var w = (service == 'twitter') ? '500' : '800',
			h = (service == 'twitter') ? '300' : '500',
			left = (screen.width/2)-(Number(w)/2),
			top = (screen.height/2)-(Number(h)/2);

		if (typeof essbShareWindowURLFilter != 'undefined') 
			url = essbShareWindowURLFilter(service, url, instance_post_id, instance_position);

		if (!trackingOnly)
			wnd = window.open( url, keyWin, "height="+(service == 'twitter' ? '500' : '500')+",width="+(service == 'twitter' ? '500' : '800')+",resizable=1,scrollbars=yes,top="+top+",left="+left );


		if (typeof(essb_settings) != "undefined") {
			if (essb_settings.essb3_stats) {
				essb.handleInternalStats(service, instance_post_id, instance);
			}

			if (essb_settings.essb3_ga)
				essb_ga_tracking(service, url, instance_position);
			
			if (essb_settings.essb3_ga_ntg && typeof(gtag) != 'undefined') {
				gtag('event', 'social share', {
				    'event_category': 'NTG social',
				    'event_label': service,
				    'non_interaction' : false
				});
			}

		}

		if (typeof(essb_settings) != 'undefined') {
			if (typeof(essb_settings.stop_postcount) == 'undefined') essb_self_postcount(service, instance_post_id);
		}

		if (typeof(essb_abtesting_logger) != "undefined")
			essb_abtesting_logger(service, instance_post_id, instance);

		if (typeof(essb_conversion_tracking) != 'undefined')
			essb_conversion_tracking(service, instance_post_id, instance);

		if (!trackingOnly)
			var pollTimer = window.setInterval(function() {
				if (wnd.closed !== false) {
					window.clearInterval(pollTimer);
					essb_smart_onclose_events(service, instance_post_id);

					if (instance_position == 'booster' && typeof(essb_booster_close_from_action) != 'undefined')
						essb_booster_close_from_action();
				}
			}, 200);

	};

	essb.share_window = function(url, custom_position, service) {
		var w = '800', h = '500', left = (screen.width/2)-(Number(w)/2), top = (screen.height/2)-(Number(h)/2);
		wnd = window.open( url, "essb_share_window", "height="+'500'+",width="+'800'+",resizable=1,scrollbars=yes,top="+top+",left="+left );

		if (typeof(essb_settings) != "undefined") {
			if (essb_settings.essb3_stats) {
				essb.handleLogInternalStats(service, essb_settings["post_id"] || '', custom_position);
			}

			if (essb_settings.essb3_ga)
				essb_ga_tracking(service, url, custom_position);
			
			if (essb_settings.essb3_ga_ntg && gtag) {
				gtag('event', 'social share', {
				    'event_category': 'NTG social',
				    'event_label': service,
				    'non_interaction' : false
				});
			}
		}
	};

	essb.fbmessenger = function(app_id, url, saltKey) {
		var isMobile = $(window).width() <= 1024 ? true : false,
			cmd = '';

		if (isMobile) cmd = 'fb-messenger://share/?link=' + url;
		else cmd = 'https://www.facebook.com/dialog/send?app_id='+app_id+'&link='+url+'&redirect_uri=https://facebook.com';
		if (isMobile) {
			window.open(cmd, "_self");
			essb.tracking_only('', 'messenger', saltKey, true);
		}
		else {
			essb.window(cmd, 'messenger', saltKey);
		}

		return false;
	};

	essb.whatsapp = function(url, saltKey) {
		var isMobile = $(window).width() <= 1024 ? true : false,
			cmd = '';

		if (isMobile) cmd = 'whatsapp://send?text=' + url;
		else cmd = 'https://web.whatsapp.com/send?text=' + url;
		if (isMobile) {
			window.open(cmd, "_self");
			essb.tracking_only('', 'whatsapp', saltKey, true);
		}
		else {
			essb.window(cmd, 'whatsapp', saltKey);
		}

		return false;
	};
	
	essb.sms = function(url, saltKey) {
		var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
			cmd = 'sms:' + (iOS ? '&' : '?') + 'body=' + url;
		window.open(cmd, "_self");
		essb.tracking_only('', 'sms', saltKey, true);
		
		return false;
	};

	essb.tracking_only = function(url, service, instance, afterShare) {
		if (url == '')
			url = document.URL;

		essb.window(url, service, instance, true);

		var element = $('.essb_'+instance),
			instance_position = $(element).attr('data-essb-position') || '';

		if (afterShare) {			
			setTimeout(function() {			
				var instance_post_id = $('.essb_'+instance).attr('data-essb-postid') || '';
				essb_smart_onclose_events(service, instance_post_id);
	
				if (instance_position == 'booster' && typeof(essb_booster_close_from_action) != 'undefined')
					essb_booster_close_from_action();
			}, 1500);
		}
	};

	essb.pinterest_picker = function(instance) {
		essb.tracking_only('', 'pinterest', instance);
		var e=document.createElement('script');
		e.setAttribute('type','text/javascript');
		e.setAttribute('charset','UTF-8');
		e.setAttribute('src','//assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);
		document.body.appendChild(e);
	};

	essb.print = function (instance) {
		essb.tracking_only('', 'print', instance);
		window.print();
	};

	essb.setCookie = function(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	};

	essb.getCookie = function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	};


	essb.toggle_more = function(unique_id) {
		if (essb['is_morebutton_clicked']) {
			essb.toggle_less(unique_id);
			return;
		}
		$('.essb_'+unique_id+' .essb_after_more').essb_toggle_more();

		var moreButton = $('.essb_'+unique_id).find('.essb_link_more');
		if (typeof(moreButton) != "undefined") {
			moreButton.hide();
			moreButton.addClass('essb_hide_more_sidebar');
		}

		moreButton = $('.essb_'+unique_id).find('.essb_link_more_dots');
		if (typeof(moreButton) != "undefined") {
			moreButton.hide();
			moreButton.addClass('essb_hide_more_sidebar');
		}

		essb['is_morebutton_clicked'] = true;
	};

	essb.toggle_less = function(unique_id) {
		essb['is_morebutton_clicked'] = false;
		$('.essb_'+unique_id+' .essb_before_less').essb_toggle_less();

		var moreButton = $('.essb_'+unique_id).find('.essb_link_more');
		if (typeof(moreButton) != "undefined") {
			moreButton.show();
			moreButton.removeClass('essb_hide_more_sidebar');
		}

		moreButton = $('.essb_'+unique_id).find('.essb_link_more_dots');
		if (typeof(moreButton) != "undefined") {
			moreButton.show();
			moreButton.removeClass('essb_hide_more_sidebar');
		}
	};

	essb.toggle_more_popup = function(unique_id) {
		if (essb['essb_morepopup_opened']) {
			essb.toggle_less_popup(unique_id);
			return;
		}
		if ($(".essb_morepopup_"+unique_id).hasClass("essb_morepopup_inline")) {
			essb.toggle_more_inline(unique_id);
			return;
		}

		var is_from_mobilebutton = false, height_of_mobile_bar = 0, parentDraw = $(".essb_morepopup_"+unique_id);
		if ($(parentDraw).hasClass('essb_morepopup_sharebottom')) {
			is_from_mobilebutton = true;
			height_of_mobile_bar = $(".essb-mobile-sharebottom").outerHeight();
		}

		var win_width = $( window ).width(), win_height = $(window).height(),
			base_width = !is_from_mobilebutton ? 660 : 550,
			height_correction = is_from_mobilebutton ? 10 : 80;

		if (win_width < base_width) base_width = win_width - 30;

		var element_class = ".essb_morepopup_"+unique_id,
			element_class_shadow = ".essb_morepopup_shadow_"+unique_id,
			alignToBottom = $(element_class).hasClass("essb_morepopup_sharebottom") ? true : false;

		if ($(element_class).hasClass("essb_morepopup_modern") && !is_from_mobilebutton) height_correction = 100;

		$(element_class).css( { width: base_width+'px'});

		var element_content_class = ".essb_morepopup_content_"+unique_id;
		var popup_height = $(element_class).outerHeight();
		if (popup_height > (win_height - 30)) {
			var additional_correction = 0;
			if (is_from_mobilebutton) {
				$(element_class).css( { top: '5px'});
				additional_correction += 5;
			}
			$(element_class).css( { height: (win_height - height_of_mobile_bar - height_correction - additional_correction)+'px'});
			$(element_content_class).css( { height: (win_height - height_of_mobile_bar - additional_correction - (height_correction+50))+'px', "overflowY" :"auto"});
		}
		if (is_from_mobilebutton)
			$(element_class_shadow).css( { height: (win_height - (is_from_mobilebutton ? height_of_mobile_bar : 0))+'px'});
		
		if (!alignToBottom)
			$(element_class).center();
		else {
			var left = ($(window).width() - $(element_class).outerWidth()) / 2;
			$(element_class).css( { left: left+"px", position:'fixed', margin:0, bottom: (height_of_mobile_bar + height_correction) + "px" });
		}
		$(element_class).fadeIn(400);
		$(element_class_shadow).fadeIn(200);
		essb['essb_morepopup_opened'] = true;
	};

	essb.toggle_less_popup = function(unique_id) {
		$(".essb_morepopup_"+unique_id).fadeOut(200);
		$(".essb_morepopup_shadow_"+unique_id).fadeOut(200);
		essb['essb_morepopup_opened'] = false;
	};


	essb.subscribe_popup_close = function(key) {
		$('.essb-subscribe-form-' + key).fadeOut(400);
		$('.essb-subscribe-form-overlay-' + key).fadeOut(400);
	};

	essb.toggle_subscribe = function(key) {
		// subsribe container do not exist
		if (!$('.essb-subscribe-form-' + key).length) return;

		if (!essb['essb_subscribe_opened'])
			essb['essb_subscribe_opened'] = {};

		var asPopup = $('.essb-subscribe-form-' + key).attr("data-popup") || "";

		// it is not popup (in content methods is asPopup == "")
		if (asPopup != '1') {
			if ($('.essb-subscribe-form-' + key).hasClass("essb-subscribe-opened")) {
				$('.essb-subscribe-form-' + key).slideUp('fast');
				$('.essb-subscribe-form-' + key).removeClass("essb-subscribe-opened");
			}
			else {
				$('.essb-subscribe-form-' + key).slideDown('fast');
				$('.essb-subscribe-form-' + key).addClass("essb-subscribe-opened");

				if (!essb['essb_subscribe_opened'][key]) {
					essb['essb_subscribe_opened'][key] = key;
					essb.tracking_only('', 'subscribe', key, true);
				}
			}
		}
		else {
			var win_width = $( window ).width();
			var doc_height = $('document').height();

			var base_width = 600;

			if (win_width < base_width) { base_width = win_width - 40; }


			$('.essb-subscribe-form-' + key).css( { width: base_width+'px'});
			$('.essb-subscribe-form-' + key).center();

			$('.essb-subscribe-form-' + key).fadeIn(400);
			$('.essb-subscribe-form-overlay-' + key).fadeIn(200);

		}

	};

	essb.is_after_comment = function() {
		var addr = window.location.href;

		return addr.indexOf('#comment') > -1 ? true : false;
	};
	
	essb.copy_link_direct = function(currentLocation) {
		
		if (!$('#essb_copy_link_field').length) {
			var output = [];
			output.push('<div style="display: none;"><input type="text" id="essb_copy_link_field" style="width: 100%;padding: 5px 10px;font-size: 15px;background: #f5f6f7;border: 1px solid #ccc;font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif;" /></div>');
			output.push('<div id="essb_copy_link_message" style="background: rgba(0,0,0,0.7); color: #fff; z-index: 1100; position: fixed; padding: 15px 25px; font-size: 13px; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif;">');
			output.push(essb_settings.translate_copy_message2 ? essb_settings.translate_copy_message2 : 'Copied to clipboard.');
			output.push('</div>');
			$('body').append(output.join(''));
		}
		
		$('#essb_copy_link_field').val(currentLocation);
		$('#essb_copy_link_field').focus();
		$('#essb_copy_link_field').select();
		
		setTimeout(function() {
			var copyText = document.querySelector("#essb_copy_link_field");
			try {
				copyText.value = currentLocation;
				copyText.focus();
				copyText.select();
				copyText.setSelectionRange(0, 99999); /*For mobile devices*/
				document.execCommand("copy");
				navigator.clipboard.writeText(copyText.value);
				$('#essb_copy_link_message').center();
				$('#essb_copy_link_message').fadeIn(300);
				setTimeout(function() {
					$('#essb_copy_link_message').fadeOut();
				}, 2000);
			}
			catch (e) {
				console.log('Error link copy to clipboard!');
			}
		}, 100);
	};
	
	essb.copy_link = function(instance_id, user_href) {
		var currentLocation = window.location.href, win_width = $( window ).width();
				
		if (instance_id && $('.essb_' + instance_id).length) {
			var instance_url = $('.essb_' + instance_id).data('essb-url') || '';
			if (instance_url != '') currentLocation = instance_url;
		}
		
		if (user_href && user_href != '') currentLocation = user_href;
		
		if (essb_settings && essb_settings.copybutton_direct) {
			essb.copy_link_direct(currentLocation);
			return;
		}
		
		if (!$('.essb-copylink-window').length) {
			var output = [];
			output.push('<div class="essb_morepopup essb-copylink-window" style="z-index: 1301;">');
			output.push('<div class="essb_morepopup_header"> <span>&nbsp;</span> <a href="#" class="essb_morepopup_close"><svg style="width: 24px; height: 24px; padding: 5px;" height="32" viewBox="0 0 32 32" width="32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M32,25.7c0,0.7-0.3,1.3-0.8,1.8l-3.7,3.7c-0.5,0.5-1.1,0.8-1.9,0.8c-0.7,0-1.3-0.3-1.8-0.8L16,23.3l-7.9,7.9C7.6,31.7,7,32,6.3,32c-0.8,0-1.4-0.3-1.9-0.8l-3.7-3.7C0.3,27.1,0,26.4,0,25.7c0-0.8,0.3-1.3,0.8-1.9L8.7,16L0.8,8C0.3,7.6,0,6.9,0,6.3c0-0.8,0.3-1.3,0.8-1.9l3.7-3.6C4.9,0.2,5.6,0,6.3,0C7,0,7.6,0.2,8.1,0.8L16,8.7l7.9-7.9C24.4,0.2,25,0,25.7,0c0.8,0,1.4,0.2,1.9,0.8l3.7,3.6C31.7,4.9,32,5.5,32,6.3c0,0.7-0.3,1.3-0.8,1.8L23.3,16l7.9,7.9C31.7,24.4,32,25,32,25.7z"/></svg></a> </div>');
			output.push('<div class="essb_morepopup_content">');
			output.push('<div class="essb_copy_internal" style="display: flex; align-items: center;">');
			output.push('<div style="width: calc(100% - 50px); padding: 5px;"><input type="text" id="essb_copy_link_field" style="width: 100%;padding: 5px 10px;font-size: 15px;background: #f5f6f7;border: 1px solid #ccc;font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif;" /></div>');
			output.push('<div style="width:50px;text-align: center;"><a href="#" class="essb-copy-link" title="'+ (essb_settings.translate_copy_message1 ? essb_settings.translate_copy_message1 : 'Press to copy the link')+'" style="color:#5867dd;background:#fff;padding:10px;text-decoration: none;"><svg style="width: 24px; height: 24px; fill: currentColor;" class="essb-svg-icon" aria-hidden="true" role="img" focusable="false" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M25.313 28v-18.688h-14.625v18.688h14.625zM25.313 6.688c1.438 0 2.688 1.188 2.688 2.625v18.688c0 1.438-1.25 2.688-2.688 2.688h-14.625c-1.438 0-2.688-1.25-2.688-2.688v-18.688c0-1.438 1.25-2.625 2.688-2.625h14.625zM21.313 1.313v2.688h-16v18.688h-2.625v-18.688c0-1.438 1.188-2.688 2.625-2.688h16z"></path></svg></a></div>');
			output.push('</div>');
			output.push('<div class="essb-copy-message" style="font-size: 13px; font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif;"></div>');
			output.push('</div>');
			output.push('</div>');
			
			output.push('<div class="essb_morepopup_shadow essb-copylink-shadow" style="z-index: 1300;"></div>');
			$('body').append(output.join(''));
			
			$('.essb-copylink-window .essb_morepopup_close').on('click', function(e) {
				e.preventDefault();
				
				$('.essb-copylink-window').fadeOut(300);
				$('.essb-copylink-shadow').fadeOut(200);
			});
			
			$('.essb-copylink-window .essb-copy-link').on('click', function(e) {
				e.preventDefault();
				var copyText = document.querySelector("#essb_copy_link_field");
				try {
					copyText.select();
					copyText.setSelectionRange(0, 99999); /*For mobile devices*/
					document.execCommand("copy");
					navigator.clipboard.writeText(copyText.value);
					$('.essb-copylink-window .essb_morepopup_header span').html(essb_settings.translate_copy_message2 ? essb_settings.translate_copy_message2 : 'Copied to clipboard.');
					setTimeout(function() {
						$('.essb-copylink-window .essb_morepopup_header span').html('&nbsp;');
					}, 2000);
				}
				catch (e) {
					$('.essb-copylink-window .essb_morepopup_header span').html(essb_settings.translate_copy_message3 ? essb_settings.translate_copy_message3 : 'Please use Ctrl/Cmd+C to copy the URL.');
					setTimeout(function() {
						$('.essb-copylink-window .essb_morepopup_header span').html('&nbsp;');
					}, 2000);
				}
			});
		}
		
		$('.essb-copy-message').html('');
		$('.essb-copylink-window').css({'width': (win_width > 600 ? 600 : win_width - 50) + 'px'});
		$('.essb-copylink-window').center();
		$('.essb-copylink-window').fadeIn(300);
		$('.essb-copylink-shadow').fadeIn(200);
		
		$('#essb_copy_link_field').val(currentLocation);
		$('#essb_copy_link_field').focus();
		$('#essb_copy_link_field').select();
	};


	essb.responsiveEventsCanRun = function(element) {
		var hideOnMobile = $(element).hasClass('essb_mobile_hidden'),
			hideOnDesktop = $(element).hasClass('essb_desktop_hidden'),
			hideOnTablet = $(element).hasClass('essb_tablet_hidden'),
			windowWidth = $(window).width(),
			canRun = true;

		if (windowWidth <= 768 && hideOnMobile) canRun = false;
		if (windowWidth > 768 && windowWidth <= 1100 && hideOnTablet) canRun = false;
		if (windowWidth > 1100 && hideOnDesktop) canRun = false;
		
		if (!$(element).length) canRun = false;

		return canRun;
	};
	
	essb.handleInternalStats = function(service, postID, instance) {
		let element = document.querySelector('.essb_' + instance);
		if (element) {
			let instance_postion = element.getAttribute('data-essb-position') || '',
				instance_template = element.getAttribute('data-essb-template') || '',
				instance_button = element.getAttribute('data-essb-button-style') || '',
				instance_counters = element.classList.contains('essb_counters'),
				instance_nostats = element.classList.contains('essb_nostats');
			
			if (instance_nostats) return;
			
			essb.logInternalStats(service, postID, instance_postion, instance_template, instance_button, instance_counters);
		}
	}
	
	essb.handleLogInternalStats = function(service, postId, position) {
		essb.logInternalStats(service, postId, position, position, position, false);
	}
	
	essb.logInternalStats = function(service, postId, position, template, senderButton, usingCounters) {
		let instanceIsMobile = false;
		
		if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent) )
			instanceIsMobile = true;
		
		if (typeof(essb_settings) != "undefined") {
			fetch(essb_settings.ajax_url, {
				method: 'POST',
			    headers: {
			    	'Content-Type': 'application/x-www-form-urlencoded',                 
			        'Accept': '*/*' 
			    },            
			    body: new URLSearchParams({
			    	'action': 'essb_stat_log',
			    	'post_id': postId,
			    	'service': service,
			    	'template': template,
			    	'mobile': instanceIsMobile,
			    	'position': position,
			    	'button': senderButton,
			    	'counter': usingCounters,
			    	'nonce': essb_settings.essb3_nonce
			    })
			}).then(response => response.text())
		    .then(data => console.log(data));
		}
		else {
			console.log('[error] essb.logInternalStats: Missing configuration data')
		}
	};

	window.essb = essb;
	
	/**
	 * Incore Specific Functions & Events
	 */
	
	var essb_int_value = function(value) {
		value = parseInt(value);
		
		if (isNaN(value) || !isFinite(value)) value = 0;
		return value;
	}

	var essb_self_postcount = function (service, countID) {
		if (typeof(essb_settings) != "undefined") {
			countID = String(countID);

			$.post(essb_settings.ajax_url, {
				'action': 'essb_self_postcount',
				'post_id': countID,
				'service': service,
				'nonce': essb_settings.essb3_nonce
			}, function (data) { },'json');
		}
	};

	var essb_smart_onclose_events = function (service, postID) {	
		// 7.0 - trigger only on selected networks (when such are present)
		if (essb_settings && essb_settings['aftershare_networks']) {
			var workingNetworks = essb_settings['aftershare_networks'] != '' ? essb_settings['aftershare_networks'].split(',') : [];
			if (workingNetworks.indexOf(service) == -1) return;
		}
		else {
		// 6.0.3 - adding email & mail as also ignoring options
			if (service == "subscribe" || service == "comments" || service == 'email' || service == 'mail') return;
		}
		
		if (service == "subscribe" || service == "comments" || service == 'email' || service == 'mail') return;
		
		if (typeof (essbasc_popup_show) == 'function')
				essbasc_popup_show();

		if (typeof essb_acs_code == 'function')
			essb_acs_code(service, postID);

		if ($('.essb-aftershare-subscribe-form').length) {
			var key = $('.essb-aftershare-subscribe-form').data('salt') || '';
			if (key != '') essb.toggle_subscribe(key);
		}
	};


	var essb_ga_tracking = function(service, url, position) {
		var essb_ga_type = essb_settings.essb3_ga_mode;

		if ( 'ga' in window && window.ga !== undefined && typeof window.ga === 'function' ) {
			if (essb_ga_type == "extended")
				ga('send', 'event', 'social', service + ' ' + position, url);

			else
				ga('send', 'event', 'social', service, url);

		}

		if (essb_ga_type == "layers" && typeof(dataLayer) != "undefined") {
			dataLayer.push({
			  'service': service,
			  'position': position,
			  'url': url,
			  'event': 'social'
			});
		}
	};
	

	/** 
	 * After Share Events functions
	 */
	var essbasc_popup_show = window.essbasc_popup_show = function() {
		if (!$('.essbasc-popup').length) return;
		if (essb.getCookie('essb_aftershare')) return; // cookie already set for visible events
		
		var cookie_len = (typeof(essbasc_cookie_live) != "undefined") ? essbasc_cookie_live : 7;
		if (parseInt(cookie_len) == 0) { cookie_len = 7; }
		
		var win_width = $( window ).width(), base_width = 800, 
			userwidth = $('.essbasc-popup').attr("data-popup-width") || '',
			singleShow = $('.essbasc-popup').attr("data-single") || '';
		
		if (Number(userwidth) && Number(userwidth) > 0) base_width = userwidth;
		if (win_width < base_width) base_width = win_width - 60; 	
		
		$(".essbasc-popup").css( { width: base_width+'px'});
		$(".essbasc-popup").center();
		$(".essbasc-popup").fadeIn(300);		
		$(".essbasc-popup-shadow").fadeIn(100);
		
		if (singleShow == 'true') essb.setCookie('essb_aftershare', "yes", cookie_len);
	};
	
	var essbasc_popup_close = window.essbasc_popup_close = function () {		
		$(".essbasc-popup").fadeOut(200);		
		$(".essbasc-popup-shadow").fadeOut(100);
	};	

	$(document).ready(function(){

		/**
		 * Mobile Share Bar
		 */

		var mobileHideOnScroll = false;
		var mobileHideTriggerPercent = 90;
		var mobileAppearOnScroll = false;
		var mobileAppearOnScrollPercent = 0;
		var mobileAdBarConnected = false;

		var essb_mobile_sharebuttons_onscroll = function() {

			var current_pos = $(window).scrollTop();
			var height = $(document).height() - $(window).height();
			var percentage = current_pos / height * 100;

			var isVisible = true;
			if (mobileAppearOnScroll && !mobileHideOnScroll) {
				if (percentage < mobileAppearOnScrollPercent) isVisible = false;
			}
			if (mobileHideOnScroll && !mobileAppearOnScroll) {
				if (percentage > mobileHideTriggerPercent) isVisible = false;
			}
			if (mobileAppearOnScroll && mobileHideOnScroll) {
				if (percentage > mobileHideTriggerPercent || percentage < mobileAppearOnScrollPercent) isVisible = false;

			}

			if (!isVisible) {
				if (!$('.essb-mobile-sharebottom').hasClass("essb-mobile-break")) {
					$('.essb-mobile-sharebottom').addClass("essb-mobile-break");
					$('.essb-mobile-sharebottom').fadeOut(400);
				}

				if ($('.essb-adholder-bottom').length && mobileAdBarConnected) {
					if (!$('.essb-adholder-bottom').hasClass("essb-mobile-break")) {
						$('.essb-adholder-bottom').addClass("essb-mobile-break");
						$('.essb-adholder-bottom').fadeOut(400);
					}
				}

			} else {
				if ($('.essb-mobile-sharebottom').hasClass("essb-mobile-break")) {
					$('.essb-mobile-sharebottom').removeClass("essb-mobile-break");
					$('.essb-mobile-sharebottom').fadeIn(400);
				}

				if ($('.essb-adholder-bottom').length && mobileAdBarConnected) {
					if ($('.essb-adholder-bottom').hasClass("essb-mobile-break")) {
						$('.essb-adholder-bottom').removeClass("essb-mobile-break");
						$('.essb-adholder-bottom').fadeIn(400);
					}
				}
			}
		};

		if ($('.essb-mobile-sharebottom').length) {

			var hide_on_end = $('.essb-mobile-sharebottom').attr('data-hideend');
			var hide_on_end_user = $('.essb-mobile-sharebottom').attr('data-hideend-percent');
			var appear_on_scroll = $('.essb-mobile-sharebottom').attr('data-show-percent') || '';
			var check_responsive = $('.essb-mobile-sharebottom').attr('data-responsive') || '';

			if (Number(appear_on_scroll)) {
				mobileAppearOnScroll = true;
			    mobileAppearOnScrollPercent = Number(appear_on_scroll);
			}

			if (hide_on_end == 'true') mobileHideOnScroll = true;

			var instance_mobile = false;
			if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent) ) {
				instance_mobile = true;
			}

			if ($('.essb-adholder-bottom').length) {
				$adbar_connected = $('.essb-adholder-bottom').attr('data-connected') || '';
				if ($adbar_connected == 'true') mobileAdBarConnected = true;
			}

			if (mobileHideOnScroll || mobileAppearOnScroll) {
				if (parseInt(hide_on_end_user) > 0)
					mobileHideTriggerPercent = parseInt(hide_on_end_user);

				if (check_responsive == '' || (check_responsive == 'true' && instance_mobile))
					$(window).on('scroll', debounce(essb_mobile_sharebuttons_onscroll, 1));

			}
		}



		/**
		 * Display Methods: Sidebar
		 */

		// Sidebar animation reveal on load
		if ($('.essb_sidebar_transition').length) {
			$('.essb_sidebar_transition').each(function() {

				if (!essb.responsiveEventsCanRun($(this))) return;
				
				if ($(this).hasClass('essb_sidebar_transition_slide'))
					$(this).toggleClass('essb_sidebar_transition_slide');
	
				if ($(this).hasClass('essb_sidebar_transition_fade'))
					$(this).toggleClass('essb_sidebar_transition_fade');
		

			});
		}
		
		/**
		 * Reposition sidebar at the middle of page
		 */
		if ($('.essb_sidebar_location_middle').length) {
			var essbSidebarRepositionMiddle = function() {
				var heightOfSidebar = $('.essb_sidebar_location_middle').outerHeight(),
					winHeight = $(window).height(), top = 0;
				

				if (heightOfSidebar > winHeight) top = 0;
				else {
					top = Math.round((winHeight - heightOfSidebar) / 2);
				}				
				$('.essb_sidebar_location_middle').css({'top': top + 'px', 'opacity': '1'});
			};
			
			essbSidebarRepositionMiddle();
			$(window).on('resize', debounce(essbSidebarRepositionMiddle, 1));
		}

		// Sidebar close button
		$(".essb_link_sidebar-close a").each(function() {
			$(this).on('click', function(event) {
				event.preventDefault();
				var links_list = $(this).parent().parent().get(0);

				if (!$(links_list).length) return;

				$(links_list).find(".essb_item").each(function(){
					if (!$(this).hasClass("essb_link_sidebar-close"))
						$(this).toggleClass("essb-sidebar-closed-item");
					else
						$(this).toggleClass("essb-sidebar-closed-clicked");
				});

			});
		});

		var essb_sidebar_onscroll = function () {
			var current_pos = $(window).scrollTop();
			var height = $(document).height()-$(window).height();
			var percentage = current_pos/height*100;


			var element;
			if ($(".essb_displayed_sidebar").length)
				element = $(".essb_displayed_sidebar");

			if ($(".essb_displayed_sidebar_right").length)
				element = $(".essb_displayed_sidebar_right");


			if (!element || typeof(element) == "undefined") return;
			
			var value_disappear = essb_int_value($(element).data('sidebar-disappear-pos') || '');
			var value_appear = essb_int_value($(element).data('sidebar-appear-pos') || '');
			var value_appear_unit = $(element).data('sidebar-appear-unit') || '';
			var value_contenthidden = $(element).data('sidebar-contenthidden') || '';
			if (value_appear_unit == 'px') percentage = current_pos;
			
			var visibleByDisplayCond = true;
			
			if (value_appear > 0 || value_disappear > 0) {
				visibleByDisplayCond = false;
				if (value_appear && percentage >= value_appear) visibleByDisplayCond = true;
				if (value_disappear && percentage <= value_disappear) visibleByDisplayCond = true;
			}
			
			// Hiding share buttons when content is visible
			if (value_contenthidden == 'yes' && ($('.essb_displayed_top').length || $('.essb_displayed_bottom').length)) {
				
				if (($('.essb_displayed_top').length && isVisibleSelector($('.essb_displayed_top'))) ||
						($('.essb_displayed_bottom').length && isVisibleSelector($('.essb_displayed_bottom'))))
					element.fadeOut(100);
				else {
					if (visibleByDisplayCond) element.fadeIn(100);
				}
			}
			
			if (value_appear > 0 && value_disappear == 0) {
				if (percentage >= value_appear && !element.hasClass("active-sidebar")) {
					element.fadeIn(100);
					element.addClass("active-sidebar");
					return;
				}

				if (percentage < value_appear && element.hasClass("active-sidebar")) {
					element.fadeOut(100);
					element.removeClass("active-sidebar");
					return;
				}
			}

			if (value_disappear > 0 && value_appear == 0) {
				if (percentage >= value_disappear && !element.hasClass("hidden-sidebar")) {
					element.fadeOut(100);
					element.addClass("hidden-sidebar");
					return;
				}

				if (percentage < value_disappear && element.hasClass("hidden-sidebar")) {
					element.fadeIn(100);
					element.removeClass("hidden-sidebar");
					return;
				}
			}

			if (value_appear > 0 && value_disappear > 0) {
				if (percentage >= value_appear && percentage < value_disappear && !element.hasClass("active-sidebar")) {
					element.fadeIn(100);
					element.addClass("active-sidebar");
					return;
				}

				if ((percentage < value_appear || percentage >= value_disappear) && element.hasClass("active-sidebar")) {
					element.fadeOut(100);
					element.removeClass("active-sidebar");
					return;
				}
			}
		};

		if (essb.responsiveEventsCanRun($('.essb_displayed_sidebar'))) {
			var essbSidebarContentHidden = $('.essb_displayed_sidebar').data('sidebar-contenthidden') || '',
				essbSidebarAppearPos = $('.essb_displayed_sidebar').data('sidebar-appear-pos') || '',
				essbSidebarDisappearPos = $('.essb_displayed_sidebar').data('sidebar-disappear-pos') || '';
	 		if (essbSidebarAppearPos != '' || essbSidebarDisappearPos != '' || essbSidebarContentHidden == 'yes') {
				if ($( window ).width() > 800) {
					$(window).on('scroll', debounce(essb_sidebar_onscroll, 1));
					essb_sidebar_onscroll();
				}
			}
		}

	
				
		/** 
		 * Reveal the social followers counter that comes with a transition effect
		 */
		if ($('.essbfc-container-sidebar').length) {
			$(".essbfc-container-sidebar").each(function() {
				if ($(this).hasClass("essbfc-container-sidebar-transition")) {
					$(this).removeClass("essbfc-container-sidebar-transition");
				}
			});
		}
		
	});


} )( jQuery );
