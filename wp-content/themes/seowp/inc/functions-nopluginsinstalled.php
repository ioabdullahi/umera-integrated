<?php
/**
 * Functions called from theme when not all required
 * plugins installed to provide a basic theme functionality
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

function lbmn_thumbnail_escaped() {
	global $post;
	// Process function only when Live Composer plugin is disabled
	if ( defined( 'DS_LIVE_COMPOSER_URL' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && LBMN_THEME_CONFUGRATED ) {
		return;
	}

	$output = '';
	if ( ! is_single() ) {
		$posthumb_url = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' );

		if ( is_array( $posthumb_url ) && $posthumb_url[0] ) {
			$posthumb_url = $posthumb_url[0];
		} else {
			$posthumb_url = get_template_directory_uri() . '/design/images/no-thumbnail.png';
		}

		$output = '<div class="post-thumb" style="background-image: url(' . esc_url_raw( $posthumb_url ) . ');"></div>';
	}

	return $output;
}


function lbmn_posttitle_escaped() {
	global $post;

	// Process function only when Live Composer plugin is disabled
	if ( defined( 'DS_LIVE_COMPOSER_URL' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && LBMN_THEME_CONFUGRATED ) {
		return;
	}

	$output = '';
	if ( is_singular() ) {
		if ( empty( $post->post_password ) || ! post_password_required() ) {
			// ✅ Already escaped in WordPress Core.
			echo the_title( '<h1 class="entry-title">', '</h1>', false );
		}
	} else {
		// ✅ Already escaped in WordPress Core.
		echo the_title( '<h1 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h1>', false );
	}
}


function lbmn_postdate_escaped() {
	global $post;

	// Process function only when Live Composer plugin is disabled
	if ( defined( 'DS_LIVE_COMPOSER_URL' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && LBMN_THEME_CONFUGRATED ) {
		return;
	}

	if ( ! is_page() && ( empty( $post->post_password ) || ! post_password_required() )   ) {
		// ✅ Already escaped in WordPress Core.
		return '<div class="blog-post-meta-date">' . get_the_date( 'F j, Y' ) . '</div>';
	} else {
		return '';
	}

}

/**
 * Output site logo.
 *
 * @return void
 */
function lbmn_logo_escaped() {
	// Process function only when Mega Main Menu plugin is disabled.
	if ( class_exists( 'mega_main_init' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && LBMN_THEME_CONFUGRATED ) {
		return;
	}

	if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) {
		the_custom_logo();
	} else {
		echo '<h2 class="no-logo"><a href="/">' . esc_html( get_bloginfo( 'name' ) ) . '</a></h2>';
	}
}

function lbmn_pagination_escaped() {
	// Process function only when Mega Main Menu plugin is disabled
	if ( class_exists( 'mega_main_init' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && LBMN_THEME_CONFUGRATED ) {
		return;
	}

	global $wp_query;

	$output = '';
	if ( $wp_query->max_num_pages > 1 && ( is_home() || is_archive() || is_search() ) ) {
		$output .= '<div class="pagination">';
		if ( get_next_posts_link() ) {
			$output .= '<div class="nav-previous">' . get_next_posts_link( '<span class="meta-nav">&larr;</span> ' . esc_html__( 'Older posts', 'seowp' ) ) . '</div>';
		}

		if ( get_previous_posts_link() ) {
			$output .= '<div class="nav-next">' . get_previous_posts_link( esc_html__( 'Newer posts', 'seowp' ) . ' <span class="meta-nav">&rarr;</span>' ) . '</div>';
		}
		$output .= '</div>';
	}

	return $output;
}

/**
 * Backup function to show very basic default footer if no LC installed.
 *
 * @return void
 */
function lbmn_footer_default_escaped() {
	// Process function only when Live Composer plugin is disabled.
	if ( defined( 'DS_LIVE_COMPOSER_URL' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && LBMN_THEME_CONFUGRATED ) {
		return;
	}

	echo '<div class="site-footer"><div class="site-footer-inner">';
	lbmn_logo_escaped();
	if ( has_nav_menu( 'header-menu' ) ) {
		// If 'header-menu' location has a menu assigned.
		echo wp_nav_menu( array(
			'theme_location'  => 'header-menu',
			'container_class' => 'footer-menu',
			'echo'            => false,
		) );
	} else {
		if ( current_user_can( 'install_themes' ) ) {
			echo '<div class="no-menu-set">';
			esc_attr_e( 'Set Menu', 'seowp' );
			echo '</div>';
		}
	}
	echo '</div>';

	if ( is_active_sidebar( 'footer-widgets' ) ) : ?>
	<aside class="widget-area" role="complementary" aria-label="<?php esc_attr_e( 'Footer', 'seowp' ); ?>">
		<?php
			if ( is_active_sidebar( 'footer-widgets' ) ) {
				?>
					<div class="footer-widgets">
						<?php dynamic_sidebar( 'footer-widgets' ); ?>
					</div>
				<?php
			}
		?>
	</aside><!-- .widget-area -->
	<?php endif;
	echo '</div>';

}

if ( ! defined( 'DS_LIVE_COMPOSER_URL' ) && defined( 'LBMN_THEME_CONFUGRATED' ) && ! LBMN_THEME_CONFUGRATED ) {
	// Change default excerpt length.
	function lbmn_excerpt_length( $length ) {
		return 40;
	}

	add_filter( 'excerpt_length', 'lbmn_excerpt_length', 999 );
}

function lbmn_render_header_mmm() {

	// Get data from theme customizer.
	$header_switch = get_theme_mod( 'lbmn_headertop_switch', 1 );
	// Prepare custom header classes
	$custom_header_classes = '';

	// Add special class if Mega Main Menu plugin is disabled
	if ( ! class_exists( 'mega_main_init' ) || ! LBMN_THEME_CONFUGRATED || DS_LIVE_COMPOSER_ACTIVE ) {
		$custom_header_classes .= 'mega_main_menu-disabled';
	}

	if ( $header_switch || isset( $wp_customize ) ) {
		?>
		<header class="site-header <?php echo esc_attr( $custom_header_classes ); ?>" data-stateonload='<?php echo esc_attr( $header_switch ); ?>' role="banner">
			<?php
			// Show header only if LC isn't active
			if ( lbmn_livecomposer_editing_mode() ) {
				esc_attr_e( 'The header is disabled when editing the page.', 'seowp' );
			} else {
				// Add special class if Mega Main Menu plugin is disabled
				if ( ! class_exists( 'mega_main_init' ) || ! LBMN_THEME_CONFUGRATED || DS_LIVE_COMPOSER_ACTIVE ) {
					?><div class="default-header-content"><?php
				}

				// Add logo if Mega Main Menu plugin is disabled
				// NOTE: normally logo displayed by Mega Main Menu.
				lbmn_logo_escaped();

				/**
				 * ----------------------------------------------------------------------
				 * Site header with Mega Menu
				 * menu location 'header-menu' with Mega Main Menu inside
				 */
				// Disable menu for editing mode in Live Composer.
				if ( has_nav_menu( 'header-menu' ) ) {
					// If 'header-menu' location has a menu assigned.
					wp_nav_menu( array(
						'theme_location'  => 'header-menu',
						'container_class' => 'header-top-menu',
					) );
				}

				// Add special class if Mega Main Menu plugin is disabled
				if ( ! class_exists( 'mega_main_init' ) || ! LBMN_THEME_CONFUGRATED || DS_LIVE_COMPOSER_ACTIVE ) {
					?></div> <!-- default-header-content --><?php
				}
			}
			?>
		</header><!-- #masthead -->
		<?php
	}
}
