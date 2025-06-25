<?php
if (function_exists('essb_advancedopts_settings_group')) {
	essb_advancedopts_settings_group('essb_options');
}

function ao_generate_feature_badge($text = '', $type = '')
{
	$badge_class = 'essb-ui-badge essb-ui-badge-sm essb-ui-badge-outline' . ($type != '' ? ' essb-ui-badge-' . $type : '');
	return '<span class="' . $badge_class . '">' . $text . '</span>';
}

function ao_generate_feature_group_panel_no_icon($title = '', $desc = '', $field = '', $deactivate_mode = false)
{
	$state = '';
	$field_value = essb_option_bool_value($field);
	$deactivation_tag = $deactivate_mode ? 'deactivation' : '';
	$value = '';

	if ($deactivate_mode) {
		if (!$field_value) {
			$state = 'active';
			$value = '';
		} else {
			$state = '';
			$value = 'true';
		}
	} else {
		if (!$field_value) {
			$state = '';
			$value = '';
		} else {
			$state = 'active';
			$value = 'true';
		}
	}

?>
	<div class="essb-ui-card-content essb-activate-additional-feature <?php echo esc_attr($state); ?> essb-activate-additional-feature-<?php echo $field; ?>" data-type="<?php echo esc_attr($deactivation_tag); ?>">
		<input type="hidden" name="essb_options[<?php echo esc_attr($field); ?>]" id="essb_<?php echo esc_attr($field); ?>" class="feature-value" value="<?php echo esc_attr($value); ?>" />

		<div class="essb-ui-flex essb-ui-flex100 essb-ui-align-center essb-ui-justify-between essb-ui-gap-4">

			<div class="essb-ui-flex essb-ui-align-center essb-ui-gap-4">

				<div class="essb-ui-flex essb-ui-flex-col essb-ui-gap-1.5">
					<div class="essb-ui-font-semibold essb-ui-line-height-sm essb-ui-text-lg essb-ui-flex essb-ui-align-center essb-ui-gap-1.5"><?php echo $title; ?></div>
					<?php if ($desc != '') { ?>
						<div class=" essb-ui-line-height-base"><?php echo $desc; ?></div>
					<?php } ?>

				</div>
			</div>

			<div class="essb-ui-flex essb-ui-align-center essb-ui-gap-2.5">
				<span class="essb-ui-badge essb-ui-badge-sm essb-ui-badge-outline essb-activation-status-notactive">Not active</span>
				<span class="essb-ui-badge essb-ui-badge-sm essb-ui-badge-primary essb-activation-status-active">Active</span>
				<span class="essb-ui-switch essb-ui-switch-xl">
					<input class="essb-ui-switch-check" data-field="<?php echo $field; ?>" id="essb_ui_switch_<?php echo $field; ?>" type="checkbox" value="1" <?php if ($state == 'active') { ?>checked="checked" <?php } ?>>
				</span>
			</div>
		</div>

	</div>

<?php
}


function ao_generate_feature_panel($title = '', $desc = '', $icon = '', $field = '', $deactivate_mode = false, $link_url = '', $link_text = '')
{
	$state = '';
	$field_value = essb_option_bool_value($field);
	$deactivation_tag = $deactivate_mode ? 'deactivation' : '';
	$value = '';

	if ($deactivate_mode) {
		if (!$field_value) {
			$state = 'active';
			$value = '';
		} else {
			$state = '';
			$value = 'true';
		}
	} else {
		if (!$field_value) {
			$state = '';
			$value = '';
		} else {
			$state = 'active';
			$value = 'true';
		}
	}

	if (empty($link_text)) {
		$link_text = esc_html__('Learn more', 'essb');
	}

?>
	<div class="essb-ui-card essb-ui-mb3 essb-activate-additional-feature <?php echo esc_attr($state); ?> essb-activate-additional-feature-<?php echo $field; ?>" data-type="<?php echo esc_attr($deactivation_tag); ?>">
		<input type="hidden" name="essb_options[<?php echo esc_attr($field); ?>]" id="essb_<?php echo esc_attr($field); ?>" class="feature-value" value="<?php echo esc_attr($value); ?>" />
		<div class="essb-ui-card-content">

			<div class="essb-ui-flex essb-ui-flex100 essb-ui-align-center essb-ui-justify-between essb-ui-gap-4">

				<div class="essb-ui-flex essb-ui-align-center essb-ui-gap-4">

					<div class="essb-ui-icon-frame64">
						<svg class="essb-ui-svg-frame essb-ui-svg-frame-grey" fill="none" height="48" viewBox="0 0 44 48" width="44" xmlns="http://www.w3.org/2000/svg">
							<path d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506 
			18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937 
			39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z" fill="">
							</path>
							<path d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506 
			18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937 
			39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z" stroke="">
							</path>
						</svg>
						<i class="essb-ui-svg-icon essb-ui-svg-dark-icon">
							<?php echo essb_ui_get_svg_icon($icon); ?>
						</i>
					</div>

					<div class="essb-ui-flex essb-ui-flex-col essb-ui-gap-1.5">
						<div class="essb-ui-font-semibold essb-ui-line-height-sm essb-ui-text-lg essb-ui-flex essb-ui-align-center essb-ui-gap-1.5"><?php echo $title; ?></div>
						<div class="essb-ui-line-height-base"><?php echo $desc; ?></div>
						<?php
						if (!empty($link_url)) {
							echo '<div class="essb-ui-line-height-base"><a class="essb-ui-btn essb-ui-btn-link" href="' . esc_url($link_url) . '" target="_blank">' . $link_text . '</a></div>';
						}
						?>
					</div>
				</div>

				<div class="essb-ui-flex essb-ui-align-center essb-ui-gap-2.5">
					<span class="essb-ui-badge essb-ui-badge-sm essb-ui-badge-outline essb-activation-status-notactive">Not active</span>
					<span class="essb-ui-badge essb-ui-badge-sm essb-ui-badge-primary essb-activation-status-active">Active</span>
					<span class="essb-ui-switch essb-ui-switch-xl">
						<input class="essb-ui-switch-check" data-field="<?php echo $field; ?>" id="essb_ui_switch_<?php echo $field; ?>" type="checkbox" value="1" <?php if ($state == 'active') { ?>checked="checked" <?php } ?>>
					</span>
				</div>
			</div>

		</div>
	</div>
<?php
}


function ao_generate_feature_block($title = '', $desc = '', $icon = '', $field = '', $deactivate_mode = false)
{

	$state = '';
	$field_value = essb_option_bool_value($field);
	$deactivation_tag = $deactivate_mode ? 'deactivation' : '';
	$value = '';

	if ($deactivate_mode) {
		if (!$field_value) {
			$state = 'active';
			$value = '';
		} else {
			$state = '';
			$value = 'true';
		}
	} else {
		if (!$field_value) {
			$state = '';
			$value = '';
		} else {
			$state = 'active';
			$value = 'true';
		}
	}

?>
	<div class="single-feature <?php echo esc_attr($state); ?>" data-type="<?php echo esc_attr($deactivation_tag); ?>">
		<input type="hidden" name="essb_options[<?php echo esc_attr($field); ?>]" id="essb_<?php echo esc_attr($field); ?>" class="feature-value" value="<?php echo esc_attr($value); ?>" />
		<div class="header"><span class="tag tag-active">Active</span><span class="tag tag-notactive">Not Active</span></div>
		<i class="feature-icon <?php echo esc_attr($icon); ?>"></i>
		<h3><?php echo $title; ?></h3>
		<div class="desc"><?php echo $desc; ?></div>
		<div class="buttons">
			<a href="#" class="activate-btn feature-btn essb-btn"><i class="fa fa-check"></i>Activate</a><a href="#" class="deactivate-btn feature-btn essb-btn"><i class="fa fa-close"></i>Deactivate</a>
		</div>
	</div>
<?php
}

?>
<div class="features-container">
	<div class="navigation">
		<div class="navigation-menu">
			<a href="#" data-tab="sharing">Share Features <span class="small-tag essb-ui-badge essb-ui-badge-sm essb-ui-badge-primary">5/10</span></a>
			<a href="#" data-tab="display" <?php if (essb_option_value('css_mode') == 'light') { ?> style="display: none;" <?php } ?>>Share Display Methods <span class="small-tag essb-ui-badge essb-ui-badge-sm essb-ui-badge-primary">2/12</span></a>
			<a href="#" data-tab="social">Social Features <span class="small-tag essb-ui-badge essb-ui-badge-sm essb-ui-badge-primary">2/12</span></a>
			<a href="#" data-tab="advanced">Advanced Features <span class="small-tag essb-ui-badge essb-ui-badge-sm essb-ui-badge-primary">2/12</span></a>
			<a href="#" data-tab="addons">Add-Ons</a>
		</div>
	</div>
	<div class="content">
		<div class="content-tab tab-sharing">
			<div class="features-manage essb-ui-flex essb-ui-flex-col essb-ui-pt4 essb-ui-pb4">
				<?php
				ao_generate_feature_panel(
					esc_html__('Pinterest Pro', 'essb'),
					esc_html__('The Pinterest Pro feature in Easy Social Share Buttons adds hover-activated "Pin" buttons to images, allowing customization of positioning, text, and size criteria. It supports lazy-loaded images, page builders, grid-based sharing, hidden image sharing, and a Pinterest follow box.', 'essb'),
					'pinterest',
					'deactivate_module_pinterestpro',
					true,
					'https://socialsharingplugin.com/pinterest-pro-image-hover-pins/'
				);
				ao_generate_feature_panel(esc_html__('Sharable Quotes', 'essb'), esc_html__('Effortlessly boost X (formerly Twitter) shares with beautifully designed click-to-share quotes—no coding needed', 'essb'), 'twitter_x', 'deactivate_ctt', true, 'https://socialsharingplugin.com/click-to-tweet/');
				ao_generate_feature_panel(esc_html__('WooCommerce', 'essb'), esc_html__('Unlock additional WooCommerce display methods and seamless integrations to maximize your store\'s social sharing potential.', 'essb'), 'cart', 'deactivate_method_woocommerce', true, 'https://socialsharingplugin.com/woocommerce-social-sharing/');
				ao_generate_feature_panel(esc_html__('Share Optimizations', 'essb'), esc_html__('Add social share optimization tags for precise control over shared content.', 'essb'), 'share_optimization', 'deactivate_module_shareoptimize', true);
				ao_generate_feature_panel(esc_html__('Share Counters', 'essb'), esc_html__('Include functions to update and display the share counters. When turned off, it will also disable additional functions that use share values, such as Fake Share Counters, Avoid Negative Social Proof, Share Counter Recovery, etc', 'essb'), 'numbers', 'deactivate_share_counters', true);
				ao_generate_feature_panel(esc_html__('Internal Share Counters', 'essb'), esc_html__('The internal share counters are stored locally in the database and generated with each click on a share button. You can use those internal counters for all social networks that do not have API for reading shares. You can also converge the networks with API to track shares locally in the database.', 'essb'), 'database_reload', 'deactivate_postcount', true);
				ao_generate_feature_panel(esc_html__('Avoid Negative Social Proof', 'essb'), esc_html__('Hide social share counters until they reach a specified number of shares.', 'essb'), 'shield', 'deactivate_ansp', true);
				ao_generate_feature_panel(esc_html__('Social Shares Recovery', 'essb'), esc_html__('Recover number of shares from specific URL changes', 'essb'), 'data_recovery', 'deactivate_ssr', true);
				ao_generate_feature_panel(esc_html__('Fake Share Counters', 'essb'), esc_html__('Fake share counters let you boost numbers with a multiplier. Additionally, you can set custom values as internal counters across all networks.', 'essb'), 'fake_counter', 'deactivate_fakecounters', true);
				ao_generate_feature_panel(esc_html__('Expert Share Counter Options', 'essb') . ao_generate_feature_badge('Expert', 'info'), esc_html__('Include expert level share counter update options for fine-tuning of the values and the update process.', 'essb'), 'options', 'deactivate_expertcounters', true);
				ao_generate_feature_panel(esc_html__('After Share Actions', 'essb'), esc_html__('Enhance user engagement by implementing after-share actions with Easy Social Share Buttons for WordPress. This feature allows you to present native social follow buttons, subscription forms, or custom messages immediately after a user shares your content, encouraging further interaction and fostering a deeper connection with your audience.', 'essb'), 'share_events', 'deactivate_module_aftershare', true, 'https://socialsharingplugin.com/after-share-actions-for-share-buttons/?aftershare=follow');
				ao_generate_feature_panel(esc_html__('Plugin Analytics', 'essb'), esc_html__('Track social sharing performance with privacy-safe analytics for WordPress. Gain real-time insights to optimize buttons and forms effortlessly, enhancing engagement while respecting user privacy.', 'essb'), 'analytics', 'deactivate_module_analytics', true, 'https://socialsharingplugin.com/social-sharing/advanced-privacy-safe-analytics-for-wordpress-share-buttons/');
				ao_generate_feature_panel(esc_html__('Google Analytics Tracking', 'essb'), esc_html__('Generate UTM tracking code to the outgoing shared URLs or track events of sharing in Google Analytics.', 'essb'), 'google_analytics', 'deactivate_module_google_analytics', true);
				ao_generate_feature_panel(esc_html__('Short URL', 'essb'), esc_html__('Generate short URLs for sharing on social networks', 'essb'), 'short_url', 'deactivate_module_shorturl', true);
				ao_generate_feature_panel(esc_html__('Affiliate & Point Integration', 'essb'), esc_html__('Integrate plugin work with myCred, AffiliateWP, SliceWP', 'essb'), 'affiliate', 'deactivate_module_affiliate', true);
				ao_generate_feature_panel(esc_html__('Message Before Buttons', 'essb'), esc_html__('Add a custom message before or above share buttons "ex: Share this"', 'essb'), 'custom_share', 'deactivate_module_message', true);
				ao_generate_feature_panel(esc_html__('Custom Share', 'essb'), esc_html__('Custom share feature makes possible to change the share URL that plugin will use', 'essb'), 'custom_share', 'deactivate_module_customshare', true);
				ao_generate_feature_panel(esc_html__('Social Metrics Lite', 'essb'), esc_html__('Log the official share values into a dashboard to see the most popular posts', 'essb'), 'dashboard', 'deactivate_module_metrics', true);
				ao_generate_feature_panel(esc_html__('Style Library', 'essb'), esc_html__('Save and reuse again already configured styles and network list. Saved in the library you can also move the style to a new site. Try also one of 40+ already configured styles if you wonder how to start.', 'essb'), 'brush', 'deactivate_stylelibrary', true);
				?>
			</div>

		</div>
		<div class="content-tab tab-display">
			<div class="features-manage essb-ui-flex essb-ui-flex-col essb-ui-pt4 essb-ui-pb4">
				<div class="essb-ui-card essb-ui-card-group">
					<?php
					ao_generate_feature_group_panel_no_icon(esc_html__('Sidebar', 'essb'), '', 'deactivate_method_sidebar', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Float From Above The Content', 'essb'), '', 'deactivate_method_float', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Post Vertical Float', 'essb'), '', 'deactivate_method_postfloat', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Top Bar', 'essb'), '', 'deactivate_method_topbar', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Bottom Bar', 'essb'), '', 'deactivate_method_bottombar', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Pop Up', 'essb'), '', 'deactivate_method_popup', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Fly In', 'essb'), '', 'deactivate_method_flyin', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Hero Share', 'essb'), '', 'deactivate_method_heroshare', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Post Bar', 'essb'), '', 'deactivate_method_postbar', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Point', 'essb'), '', 'deactivate_method_point', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('On Media', 'essb'), '', 'deactivate_method_image', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Native Buttons', 'essb'), '', 'deactivate_method_native', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Follow Me Bar', 'essb'), '', 'deactivate_method_followme', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Corner Share', 'essb'), '', 'deactivate_method_corner', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Share Booster', 'essb'), '', 'deactivate_method_booster', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Share Button', 'essb'), '', 'deactivate_method_sharebutton', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Excerpt', 'essb'), '', 'deactivate_method_except', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Widget', 'essb'), '', 'deactivate_method_widget', true);
					ao_generate_feature_group_panel_no_icon(esc_html__('Advanced Mobile Options', 'essb'), '', 'deactivate_method_advanced_mobile', true);
					?>
				</div>
			</div>


		</div>
		<div class="content-tab tab-social">
			<div class="features-manage essb-ui-flex essb-ui-flex-col essb-ui-pt4 essb-ui-pb4">
				<?php
				ao_generate_feature_panel(esc_html__('Social Followers Counter', 'essb'), esc_html__('Show the number of followers for 30+ social networks', 'essb'), 'heart', 'deactivate_module_followers', true, 'https://socialsharingplugin.com/social-followers-counter/');
				ao_generate_feature_panel(esc_html__('Social Profile Links', 'essb'), esc_html__('Add plain buttons for your social profiles with shortcode, widget or sidebar', 'essb'), 'user_heart', 'deactivate_module_profiles', true, 'https://socialsharingplugin.com/social-profiles/');
				ao_generate_feature_panel(esc_html__('Native Social Buttons', 'essb'), esc_html__('Use selected native social buttons along with your share buttons', 'essb'), 'like', 'deactivate_module_natives', true);
				ao_generate_feature_panel(esc_html__('Subscribe Forms', 'essb'), esc_html__('Add easy to use subscribe to mail list forms', 'essb'), 'mail', 'deactivate_module_subscribe', true, 'https://socialsharingplugin.com/grow-your-mailing-list-subscribers/');			
		                ao_generate_feature_block(esc_html__('Skype Live Chat', 'essb'), esc_html__('Connect with your visitors using Skype live chat', 'essb'), 'fa fa-skype', 'deactivate_module_skypechat', true);
		                ao_generate_feature_panel(esc_html__('Click 2 Chat', 'essb'), esc_html__('Add click to chat feature for WhatsApp and Viber', 'essb'), 'chat', 'deactivate_module_clicktochat', true, 'https://socialsharingplugin.com/social-chat/');
				ao_generate_feature_panel(esc_html__('Instagram Feed', 'essb'), esc_html__('Enable generation of Instagram feed on site', 'essb'), 'instagram', 'deactivate_module_instagram', true, 'https://socialsharingplugin.com/instagram-feed-grow-your-instagram-followers/');
				ao_generate_feature_panel(esc_html__('Social Proof Notifications Lite', 'essb'), esc_html__('Enable display of share counter social proof notification messages', 'essb'), 'notification', 'deactivate_module_proofnotifications', true, 'https://socialsharingplugin.com/social-proof-notifications/?demo=824');

				?>
			</div>
		</div>
		<div class="content-tab tab-advanced">
			<div class="features-manage essb-ui-flex essb-ui-flex-col essb-ui-pt4 essb-ui-pb4">
				<?php
				ao_generate_feature_panel(esc_html__('Functions Translate', 'essb'), esc_html__('Allow to translate preset plugin texts on your language', 'essb'), 'translate', 'deactivate_module_translate', true);
				ao_generate_feature_panel(esc_html__('Custom Network Buttons', 'essb'), esc_html__('Enable the function to add custom network buttons in the sharing or following.', 'essb'), 'buttons', 'deactivate_custombuttons', true);
				ao_generate_feature_panel(esc_html__('Custom Display/Positions', 'essb'), esc_html__('The custom display/positions makes possible to create a custom position inside plugin. This position you can show with shortcode of functional call anywhere on site.', 'essb'), 'content', 'deactivate_custompositions', true);
				ao_generate_feature_panel(esc_html__('Conversion Tracking', 'essb'), esc_html__('Enable the tracking of share or subscribe conversions', 'essb'), 'dashboard', 'deactivate_module_conversions', true);
				ao_generate_feature_panel(esc_html__('Automatic Mobile Setup', 'essb'), esc_html__('Activate automatic responsive mobile setup of share buttons', 'essb'), 'mobile', 'activate_mobile_auto');
				ao_generate_feature_panel(esc_html__('Integrations With Plugins', 'essb'), esc_html__('Additional integrations available with BuddyPress, bbPress and etc.', 'essb'), 'plugin', 'deactivate_method_integrations', true);
				ao_generate_feature_panel(esc_html__('Settings by Post Type', 'essb'), esc_html__('Allow additional settings for different post types', 'essb'), 'check_list', 'deactivate_settings_post_type', true);

				ao_generate_feature_panel(esc_html__('Internal Share Counters', 'essb'), esc_html__('The internal share counter option allows to change the generated counters on site and track them internally for all networks.', 'essb'), 'content_numbers', 'activate_fake');
				ao_generate_feature_panel(esc_html__('Hooks Integration', 'essb'), esc_html__('Easy assign share buttons to theme or plugin actions/filters. You can also use it to create a custom display methods.', 'essb'), 'slider', 'activate_hooks');
				ao_generate_feature_panel(esc_html__('Minimal Share Counters', 'essb'), esc_html__('Set a minimal share value that will be shown till the official value become greater', 'essb'), 'order_number', 'activate_minimal');

				?>
			</div>
		</div>

		<div class="content-tab tab-addons">
			<div class="addons-container essb-ui-pt4 essb-ui-pb4">
				<?php
				if (!class_exists('ESSBAddonsHelper')) {
					include_once(ESSB3_PLUGIN_ROOT . 'lib/admin/addons/essb-addons-helper4.php');
				}

				if (! function_exists('get_plugins')) {
					require_once wp_normalize_path(ABSPATH . 'wp-admin/includes/plugin.php');
				}

				$current_addon_list = ESSBAddonsHelper::get_instance()->get_addons();
				$current_plugin_list = essb_get_site_plugins();

				foreach ($current_addon_list as $key => $data) {
					$price = isset($data['price']) ? $data['price'] : '';
					$is_free = ($price == 'free' || $price == 'Free' || $price == 'FREE');

					if ($is_free) {
						$url_install = wp_nonce_url(
							add_query_arg(
								array(
									'plugin'           => urlencode($key),
									'essb-tgmpa-install' => 'install-plugin',
								),
								admin_url('admin.php?page=essb_redirect_addons')
							),
							'essb-tgmpa-install',
							'essb-tgmpa-nonce'
						);


						$url_command = $url_install;
						$command_text = 'Install';
						$command_class = 'button-primary';

						$not_compatible = false;

						$requires = isset($data['requires']) ? $data['requires'] : '';

						if (!empty($requires)) {
							if (version_compare(ESSB3_VERSION, $data['requires']) < 0) {
								$not_compatible = true;
							}
						}

						if (isset($current_plugin_list[$key])) {
							$addon_slug = $current_plugin_list[$key]['path'];
							$url_activate = wp_nonce_url("plugins.php?action=activate&plugin={$addon_slug}", "activate-plugin_{$addon_slug}");
							$url_deactivate = wp_nonce_url("plugins.php?action=deactivate&plugin={$addon_slug}", "deactivate-plugin_{$addon_slug}");

							$url_command = $current_plugin_list[$key]['active'] ? $url_deactivate : $url_activate;
							$command_text = $current_plugin_list[$key]['active'] ? 'Deactivate' : 'Activate';
							$command_class = $current_plugin_list[$key]['active'] ? 'button-deactivate' : 'button-activate';
						}


						echo '<div class="features-addon essb-ui-card essb-ui-mb3">';
						echo '<div class="features-addon-image"><img src="' . esc_url(ESSB3_PLUGIN_URL . '/assets/images/' . $data['icon'] . '.svg') . '"/></div>';
						echo '<div class="features-addon-data">';
						echo '<div class="details">';
						echo '<div class="title">' . $data['name'] . '</div>';
						echo '<div class="desc">' . $data['description'] . '</div>';

						if ($not_compatible) {
							echo '<div class="not-compatible">This add-on requires version ' . $data['requires'] . '</div>';
						}

						if (!ESSBActivationManager::isActivated()) {
							echo '<span class="not-activated">' . ESSBAdminActivate::activateToUnlock(esc_html__('Activate plugin to download', 'essb')) . '</span>';
						}
						echo '</div>'; // details
						if (ESSBActivationManager::isActivated()) {

							if (!$not_compatible) {
								echo '<div class="commands">';
								echo '<a class="button ' . esc_attr($command_class) . '" href="' . esc_url($url_command) . '">' . $command_text . '</a>';
								echo '</div>';
							}
						}
						echo '</div>'; // features-addon-data
						echo '</div>';
					}
				}

				?>
			</div>
		</div>
	</div>

</div>


<div class="features-deactivate">
	<?php




	?>
</div>
