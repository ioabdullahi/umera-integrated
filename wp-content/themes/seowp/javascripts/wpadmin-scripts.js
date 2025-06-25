/*
 * Theme back-end JavaScript
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * Custom JavaScript used to improve/extend some bundled plugins UI,
 * run actions for theme installation wizard
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 *
 * -------------------------------------------------------------------
 *
 * Send your ideas on code improvement or new hook requests using
 * contact form on https://themeforest.net/user/blueastralthemes
 */

(function ($) {
	"use strict";

	jQuery(document).ready(function ($) {

		// Helper function to get the value from URL Parameter
		var QueryString = function () {
			// This function is anonymous, is executed immediately and
			// the return value is assigned to QueryString!
			var query_string = {};
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = pair[1];
				// If second entry with this name
				} else if (typeof query_string[pair[0]] === "string") {
				var arr = [ query_string[pair[0]], pair[1] ];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
				} else {
				query_string[pair[0]].push(pair[1]);
				}
			}
				return query_string;
		} ();

		/**
		 * ----------------------------------------------------------------------
		 * LiveComposer Settings Page
		 * Warning to use only letters and numbers in the sidebar name
		 */

		// if current admin screens is Live Composer > Widgets Module
		if ( $("body").hasClass('live-composer_page_dslc_plugin_options_widgets_m') ) {
			$(".dslca-plugin-opts-list-wrap .dslca-plugin-opts-list-add-hook").on('click', function(event) {
				// event.preventDefault();
				/* Act on the event */
				$(this).before(
					"<p style=' width: 300px; margin-bottom: 20px; font-size: 13px; color: #CF522A;'> Only letters, numbers and spaces may be used in sidebar names. </p>"
				);
			});

		}

		// On Live Composer settings page
		// hide "Archives Settings" and "Tutorials" tabs
		$("a[href='?page=dslc_plugin_options_tuts'] ").hide();


		/**
		 * ----------------------------------------------------------------------
		 * Hide unwanted metaboxes on the post editing screen.
		 */

		if ( $("body").hasClass('wp-admin') ) {
			// Hide Mega Main Options metabox
			$(".postbox#mm_general").hide();

			// For pages only
			if ( $("body").hasClass('post-type-page') ) {
				// Hide discussion metabox
				$(".postbox#commentstatusdiv").hide();
			}
		}


		/**
		 * ----------------------------------------------------------------------
		 * Update menus screen if Mega Menu not initialized
		 * (to solve bug when mega menu breaks on the first edit )
		 */

		if ( $("body").hasClass('nav-menus-php') ) {
			// If "Demo Mega Menu (Header)" selected
			if ( $(".manage-menus select#menu option[selected='selected']").text().indexOf("Demo Mega Menu (Header)") != -1 ) {
				if ( $("#menu-management .menu-item .background_image_type").length == 0 ) {
					location.reload(true);
				}
			}
		}

		/**
		 * Move 'Theme config' and 'Theme update' admin menu items to the top.
		 */

		var menuItemThemeUpdate = $('#menu-appearance li a[href="themes.php?page=seowp-theme-update"]').closest('li');
		$('#menu-appearance li.wp-first-item').after(menuItemThemeUpdate);
		$(menuItemThemeUpdate).find('a').append(' <span class="dashicons dashicons-warning theme-update-menu-icon"></span>');

		var menuItemThemeInstall = $('#menu-appearance li a[href="themes.php?page=seowp-theme-install"]').closest('li');
		$('#menu-appearance li.wp-first-item').after(menuItemThemeInstall);
		$(menuItemThemeInstall).find('a').append(' <span class="dashicons dashicons-warning theme-update-menu-icon"></span>');

		/**
		 * Notice about LC Google Maps, CPT Support, Menu Pro
		 */

		if ( jQuery('body').hasClass('plugins-php') && jQuery("tr[data-slug='live-composer-premium-extensions'] ").hasClass('active') ) {
			var message;

			message = '<tr class="plugin-update-tr inactive">';
				message += '<td colspan="3" class="plugin-update colspanchange">';
					message += '<div class="notice inline notice-warning notice-alt">';
						message += '<p>';
							message += 'You can safely delete this plugin as it’s already included in Live Composer Extensions package.'
						message += '</p>';
					message += '</div>';
					message += '</td>';
			message += '</tr>';

			if ( jQuery( "tr[data-slug='live-composer-google-maps-module']" ) ) {
				jQuery( "tr[data-slug='live-composer-google-maps-module'] th, tr[data-slug='live-composer-google-maps-module'] td" ).css("box-shadow", "none");
				jQuery( "tr[data-slug='live-composer-google-maps-module']" ).after( message );
			}

			if ( jQuery( "tr[data-slug='live-composer-menu-pro']" ) ) {
				jQuery( "tr[data-slug='live-composer-menu-pro'] th, tr[data-slug='live-composer-menu-pro'] td" ).css("box-shadow", "none");
				jQuery( "tr[data-slug='live-composer-menu-pro']" ).after( message );
			}

			if ( jQuery( "tr[data-slug='live-composer-templates-for-cpt']" ) ) {
				jQuery( "tr[data-slug='live-composer-templates-for-cpt'] th, tr[data-slug='live-composer-templates-for-cpt'] td" ).css("box-shadow", "none");
				jQuery( "tr[data-slug='live-composer-templates-for-cpt']" ).after( message );
			}
		}

		var notices = document.querySelectorAll('.is-dismissible.lbmn-notice');

		if ( notices.length ) {
			notices.forEach( element => {
				var buttonDismiss = element.querySelector('.notice-dismiss');
				var nonce = element.dataset.nonce;
				var notice = element.dataset.notice;
				buttonDismiss.addEventListener( 'click', function ( event ) {
					var request = new XMLHttpRequest();
					request.open('POST', wp.ajax.settings.url, true);
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

					request.onload = function () {
						if (this.status >= 200 && this.status < 400) {
							// If successful
							// this.response
						} else {
							// If fail
							// this.response
						}
					};
					request.onerror = function() {
						// Connection error
					};

					request.send(
						'action=lbmn_dismiss_notice' +
						'&wpnonce=' + nonce +
						'&notice_id=' + notice
					);
				} )
			});
		}
		wp.codeEditor.initialize($('#seowp_header_code'), cm_settings);
		wp.codeEditor.initialize($('#seowp_body_code'), cm_settings);
		wp.codeEditor.initialize($('#seowp_footer_code'), cm_settings);

	}); // document.ready


})(jQuery);