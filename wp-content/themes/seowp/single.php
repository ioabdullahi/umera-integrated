<?php
/**
 * The template for displaying blog posts and custom post types pages.
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * This is the template that displays standard WordPress posts and
 * all custom post type pages. By default our theme includes
 * the next custom types:
 *    – Projects     > dslc_projects
 *    – Galleries    > dslc_galleries
 *    – Staff        > dslc_staff
 *    – Downloads    > dslc_downloads
 *    – Testimonials > dslc_testimonials
 *    – Partners     > dslc_partners
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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

global $post;

get_header();
?>
	<div id="content" class="site-content" role="main">
		<?php
		while ( have_posts() ) {
			the_post();
			get_template_part( 'content' );
		}
		if ( ! defined( 'DS_LIVE_COMPOSER_URL' ) && empty( $post->post_password ) ) {
			// Normally tags displayed by LiveComposer
			the_tags( '<div class="post-tags">', ',', '</div>' );
		}
		?>
	</div><!-- #content -->
<?php

if ( empty( $post->post_password ) || ! post_password_required() ) {
	//All the comment forms and threads outputted by LiveComposer
	comments_template( '/comments.php' );
}

get_footer();
