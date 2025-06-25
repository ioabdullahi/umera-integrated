<?php

/**
 * Social Share Optimization Tags Setup Interface
 *
 * @version 4.0
 * @since 5.9
 * @package EasySocialShareButtons
 * @author appscreo
 */

function essb_sso_metabox_interface_facebook($post_id)
{
	$custom = get_post_custom($post_id);

	// post share optimizations
	$essb_post_og_desc = isset($custom["essb_post_og_desc"]) ? $custom["essb_post_og_desc"][0] : "";
	$essb_post_og_title = isset($custom["essb_post_og_title"]) ? $custom["essb_post_og_title"][0] : "";
	$essb_post_og_image = isset($custom["essb_post_og_image"]) ? $custom["essb_post_og_image"][0] : "";
	$essb_post_og_image1 = isset($custom["essb_post_og_image1"]) ? $custom["essb_post_og_image1"][0] : "";
	$essb_post_og_image2 = isset($custom["essb_post_og_image2"]) ? $custom["essb_post_og_image2"][0] : "";
	$essb_post_og_image3 = isset($custom["essb_post_og_image3"]) ? $custom["essb_post_og_image3"][0] : "";
	$essb_post_og_image4 = isset($custom["essb_post_og_image4"]) ? $custom["essb_post_og_image4"][0] : "";
	$essb_post_og_url = isset($custom["essb_post_og_url"]) ? $custom["essb_post_og_url"][0] : "";


	$essb_post_og_desc = stripslashes($essb_post_og_desc);
	$essb_post_og_title = stripslashes($essb_post_og_title);
	$essb_post_og_video = isset($custom["essb_post_og_video"]) ? $custom["essb_post_og_video"][0] : "";
	$essb_post_og_video_w = isset($custom["essb_post_og_video_w"]) ? $custom["essb_post_og_video_w"][0] : "";
	$essb_post_og_video_h = isset($custom["essb_post_og_video_h"]) ? $custom["essb_post_og_video_h"][0] : "";
	$essb_post_og_author = isset($custom['essb_post_og_author']) ? $custom['essb_post_og_author'][0] : '';
	$essb_post_og_author = stripslashes($essb_post_og_author);

	essb_depend_load_class('ESSB_FrontMetaDetails', 'lib/modules/social-share-optimization/class-metadetails.php');
	$sso_data = ESSB_FrontMetaDetails::get_instance();

	$show_preview_image_class = essb_option_bool_value('sso_external_images') ? 'media-visible' : '';

	ESSBOptionsFramework::draw_options_row_start_full('inner-row-small');
	ESSBOptionsFramework::draw_help(esc_html__('Optimize your social share message on all social networks', 'essb'), esc_html__('Social Sharing Optimization is important for each site. Without using it you have no control over shared information on social networks. We highly recommend to activate it (Facebook sharing tags are used on almost all social networks so they are the minimal required).', 'essb'), '', array('buttons' => array('How to customize shared information' => 'https://docs.socialsharingplugin.com/knowledgebase/how-to-customize-personalize-shared-information-on-social-networks/', 'I see wrong share information' => 'https://docs.socialsharingplugin.com/knowledgebase/facebook-is-showing-the-wrong-image-title-or-description/', 'Test & Fix Facebook Showing Wrong Information' => 'https://docs.socialsharingplugin.com/knowledgebase/how-to-test-and-fix-facebook-sharing-wrong-information-using-facebook-open-graph-debugger/')));
	ESSBOptionsFramework::draw_options_row_end();
?>

	<div class="essb-flex-grid-r">
		<div class="essb-flex-grid-c c12">
			<strong class="essb-title">Social Sharing Preview</strong>
			<br />
			<span class="label">The recommended image size used for sharing is 1,200 x 630 pixels or image with an aspect ratio of 1.91:1.
				<?php if (!essb_option_bool_value('sso_deactivate_analyzer')) { ?>
					<br/>
					<strong>Analyzing image size and selection will run on the save of the post.</strong>
				<?php } ?>
			</span>
		</div>
	</div>
	<div class="essb-flex-grid-r">
		<div class="essb-flex-grid-c c12">

			<div class="sso-preview <?php echo esc_attr($show_preview_image_class); ?>">
				<?php
				ESSBOptionsFramework::draw_fileselect_image_field('essb_post_og_image', 'essb_metabox', $essb_post_og_image, '', '', $sso_data->single_image($post_id));

				if (essb_option_bool_value('sso_external_images')) {
					echo '<div class="label">';
					esc_html_e('Custom image URL for Social Media Optimization. The field will have value in the case of custom image selection. The field will remain blank if the default image is used.', 'essb');
					echo '</div>';
				}

				?>
				<div class="sso-content-holder">
					<div class="sso-title carret-mark "><?php echo esc_html($sso_data->single_title($post_id)); ?></div>
					<div class="sso-description carret-mark "><?php echo esc_html($sso_data->single_description($post_id)); ?></div>
					<div style="display: none;">
						<div class="sso-title-original carret-mark "><?php echo esc_html($sso_data->single_title($post_id)); ?></div>
						<div class="sso-description-original carret-mark "><?php echo esc_html($sso_data->single_description($post_id)); ?></div>
					</div>
				</div>
			</div>

		</div>
	</div>
	<?php if (!essb_option_bool_value('sso_deactivate_analyzer')) { ?>

		<?php

		$featured_image = get_the_post_thumbnail_url($post_id, 'full');

		if ($essb_post_og_image != '') {
			$image_data = getimagesize($essb_post_og_image);

			echo '<script type="text/javascript">var ssoSavedImage = window.ssoSavedImage = ' . json_encode($image_data) . '; var ssoSavedImageExists = window.ssoSavedImageExists = true;</script>';
		} else {
			echo '<script type="text/javascript">var ssoSavedImage = window.ssoSavedImage = {};</script>';
		}

		if ($featured_image != '') {
			$image_data = getimagesize($featured_image);

			echo '<script type="text/javascript">var ssoFeaturedImage = window.ssoFeaturedImage = ' . json_encode($image_data) . '; var ssoSavedFeaturedImageExists = window.ssoSavedFeaturedImageExists = true;</script>';
		} else {
			echo '<script type="text/javascript">var ssoFeaturedImage = window.ssoFeaturedImage = {};</script>';
		}


		?>
		<div class="essb-flex-grid-r" style="margin-left: -240px; position: absolute; width: 220px;">
			<div class="essb-flex-grid-c c12">
				<div id="sso-calculated-score"></div>
			</div>
		</div>
	<?php } ?>

	<?php

	ESSBOptionsFramework::draw_options_row_start(esc_html__('Social Media Title', 'essb'), '');
	ESSBOptionsFramework::draw_input_field('essb_post_og_title', true, 'essb_metabox', $essb_post_og_title);
	ESSBOptionsFramework::draw_options_row_end();

	ESSBOptionsFramework::draw_options_row_start(esc_html__('Social Media Description', 'essb'), '');
	ESSBOptionsFramework::draw_textarea_field('essb_post_og_desc', 'essb_metabox', $essb_post_og_desc);
	ESSBOptionsFramework::draw_options_row_end();

	if (essb_options_bool_value('sso_advanced_tags')) {
		ESSBOptionsFramework::draw_options_row_start(esc_html__('Facebook Author Profile URL', 'essb'), '');
		ESSBOptionsFramework::draw_input_field('essb_post_og_author', true, 'essb_metabox', $essb_post_og_author);
		ESSBOptionsFramework::draw_options_row_end();

		ESSBOptionsFramework::draw_options_row_start(esc_html__('Customize Open Graph URL', 'essb') . essb_generate_expert_badge(), esc_html__('Important! This field is needed only if you made a change in your URL structure and you need to customize og:url tag to preserve shares you have. Do not fill here anything unless you are completely sure you need it - not proper usage will lead to loose of your current social shares and comments.', 'essb'));
		ESSBOptionsFramework::draw_input_field('essb_post_og_url', true, 'essb_metabox', $essb_post_og_url);
		ESSBOptionsFramework::draw_options_row_end();
	}


	if (essb_option_bool_value('sso_multipleimages')) {
		ESSBOptionsFramework::draw_heading(esc_html__('Additional Facebook Images', 'essb'), '5');

		ESSBOptionsFramework::draw_title(esc_html__('Additional Social Media Image #1', 'essb'), esc_html__('Add an image that is optimized for maximum exposure on most social networks.<span class="essb-inner-recommend">We recommend 1200px by 628px</span>', 'essb'), 'inner-row');
		ESSBOptionsFramework::draw_options_row_start_full('inner-row-small');
		ESSBOptionsFramework::draw_fileselect_field('essb_post_og_image1', 'essb_metabox', $essb_post_og_image1);
		ESSBOptionsFramework::draw_options_row_end();

		ESSBOptionsFramework::draw_title(esc_html__('Additional Social Media Image #2', 'essb'), esc_html__('Add an image that is optimized for maximum exposure on most social networks.<span class="essb-inner-recommend">We recommend 1200px by 628px</span>', 'essb'), 'inner-row');
		ESSBOptionsFramework::draw_options_row_start_full('inner-row-small');
		ESSBOptionsFramework::draw_fileselect_field('essb_post_og_image2', 'essb_metabox', $essb_post_og_image2);
		ESSBOptionsFramework::draw_options_row_end();

		ESSBOptionsFramework::draw_title(esc_html__('Additional Social Media Image #3', 'essb'), esc_html__('Add an image that is optimized for maximum exposure on most social networks.<span class="essb-inner-recommend">We recommend 1200px by 628px</span>', 'essb'), 'inner-row');
		ESSBOptionsFramework::draw_options_row_start_full('inner-row-small');
		ESSBOptionsFramework::draw_fileselect_field('essb_post_og_image3', 'essb_metabox', $essb_post_og_image3);
		ESSBOptionsFramework::draw_options_row_end();

		ESSBOptionsFramework::draw_title(esc_html__('Additional Social Media Image #4', 'essb'), esc_html__('Add an image that is optimized for maximum exposure on most social networks.<span class="essb-inner-recommend">We recommend 1200px by 628px</span>', 'essb'), 'inner-row');
		ESSBOptionsFramework::draw_options_row_start_full('inner-row-small');
		ESSBOptionsFramework::draw_fileselect_field('essb_post_og_image4', 'essb_metabox', $essb_post_og_image4);
		ESSBOptionsFramework::draw_options_row_end();
	}


	?>
<?php
}

function essb_sso_metabox_interface_twitter($post_id)
{
	$custom = get_post_custom($post_id);

	$essb_post_twitter_desc = isset($custom["essb_post_twitter_desc"]) ? $custom["essb_post_twitter_desc"][0] : "";
	$essb_post_twitter_title = isset($custom["essb_post_twitter_title"]) ? $custom["essb_post_twitter_title"][0] : "";
	$essb_post_twitter_image = isset($custom["essb_post_twitter_image"]) ? $custom["essb_post_twitter_image"][0] : "";
	$essb_post_twitter_desc = stripslashes($essb_post_twitter_desc);
	$essb_post_twitter_title = stripslashes($essb_post_twitter_title);

	essb_depend_load_class('ESSB_FrontMetaDetails', 'lib/modules/social-share-optimization/class-metadetails.php');
	$sso_data = ESSB_FrontMetaDetails::get_instance();



	$preview_title = $essb_post_twitter_title != '' ? $essb_post_twitter_title : $sso_data->single_title($post_id);
	$preview_desc = $essb_post_twitter_desc != '' ? $essb_post_twitter_desc : $sso_data->single_description($post_id);;

	ESSBOptionsFramework::draw_heading(esc_html__('X Social Card Data', 'essb'), '7', '', '', '', essb_svg_icon('twitter_x'));

	ESSBOptionsFramework::draw_options_row_start(esc_html__('Image', 'essb'), '');
	ESSBOptionsFramework::draw_fileselect_field('essb_post_twitter_image', 'essb_metabox', $essb_post_twitter_image);
	ESSBOptionsFramework::draw_options_row_end();

	ESSBOptionsFramework::draw_options_row_start(esc_html__('Title', 'essb'), '');
	ESSBOptionsFramework::draw_input_field('essb_post_twitter_title', true, 'essb_metabox', $essb_post_twitter_title);
	ESSBOptionsFramework::draw_options_row_end();

	ESSBOptionsFramework::draw_options_row_start(esc_html__('Description', 'essb'), '');
	ESSBOptionsFramework::draw_textarea_field('essb_post_twitter_desc', 'essb_metabox', $essb_post_twitter_desc);
	ESSBOptionsFramework::draw_options_row_end();

}
