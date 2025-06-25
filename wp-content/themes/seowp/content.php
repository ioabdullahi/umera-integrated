<?php
/**
 * The template for displaying all pages.
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * This is the template that displays all pages by default.
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
	exit; // Exit if accessed directly.
} ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php
	// The functions below called only if Live Composer isn't active
	// otherwise LiveComposer outputs everything for us.
	echo lbmn_thumbnail_escaped();
	echo lbmn_posttitle_escaped();
	echo lbmn_postdate_escaped(); ?>
	<div class="entry-content">
		<?php
		if ( is_singular() ) {
			global $post;
			$the_post_id = $post->ID;
			// Get live composer code for the current post/page.
			$livecomposer_code = get_post_meta( $the_post_id, 'dslc_code', true );
			// Get the template ID set for the post ( returns false if not set ).
			$template  = get_post_meta( $the_post_id, 'dslc_post_template', true );
			$post_type = get_post_type( $the_post_id );

			// if there is not dslc_code set yet
			// if it's not a post powered by LC template
			// if Live Composer editing mode isn't active.
			if ( ( empty( $livecomposer_code ) && empty( $template ) && LBMN_THEME_CONFUGRATED )
					&& ! ( defined( 'DS_LIVE_COMPOSER_ACTIVE' ) && DS_LIVE_COMPOSER_ACTIVE )
					&& ( 'post' !== $post_type  ) ) {
				// Output the page content in standard 'boxed' design.
				echo '<div class="dslc-code-empty-title dslc-clearfix">';
				// ✅ Already escaped in WordPress Core.
				echo the_title( '<h1 class="entry-title dslc-modules-section-wrapper">', '</h1>', false );
				echo '</div>';
				echo '<div class="dslc-code-empty-content dslc-modules-section-wrapper dslc-clearfix">';
				the_content();
				echo '</div>';
			} else {
				the_content();
			}

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'seowp' ),
				'after'  => '</div>',
			) );

		} else {
			// Called only if Live Composer isn't active.
			echo '<div class="dslc-code-empty-content dslc-modules-section-wrapper dslc-clearfix">';
			the_excerpt();
			echo '</div>';
		} // End if().
		?>
	</div><!-- .entry-content -->
</article><!-- #post-## -->

<?php

if ( empty( $post->post_password ) || ! post_password_required() ) {
	//All the comment forms and threads outputted by LiveComposer
	comments_template( '/comments.php' );
}
