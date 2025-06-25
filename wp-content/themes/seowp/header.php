<?php
/**
 * The template for displaying the website header.
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 * Outputs all head of the page including notifications and site header
 *    – <head> section
 *    – Warning messages for the website admin
 *    – Notification panel
 *    – Top Bar (menu location: 'topbar' )
 *    – Site header with Mega Menu
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
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5.0, user-scalable=yes">
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<?php 
	$seowp_header_code_enable=get_option( 'seowp_header_code_enable' );
	$seowp_header_code=get_option( 'seowp_header_code' );
	if($seowp_header_code_enable == 'on'){
		echo  html_entity_decode($seowp_header_code);
	}
	?>

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php 
	$seowp_body_code_enable=get_option( 'seowp_body_code_enable');
	$seowp_body_code=get_option( 'seowp_body_code');
	if($seowp_body_code_enable == 'on'){
		echo  html_entity_decode($seowp_body_code);
	}
?>

<?php if(get_option('seowp_back_top_top_enable') && get_option('seowp_back_top_top_enable') == "on" ){ ?>
<!-- Back to top -->
<div id="back-to-top" title="Go to top">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/>
</svg>
</div>
<?php }?>
<?php wp_body_open(); ?>
<div class="off-canvas-wrap">
	<div class="site global-container inner-wrap" id="global-container">
		<div class="global-wrapper">
			<?php
			do_action( 'before' );

			/**
			 * Output Live Composer powered headers only when:
			 * – Live Composer installed
			 * – Theme Configuration (basic header/footer import) completed.
			 * In all other cases output simplified version of the header.
			 */
			if ( function_exists('lbmn_livecomposer_installed') && lbmn_livecomposer_installed() && LBMN_THEME_CONFUGRATED ) {
				if ( function_exists( 'dslc_hf_get_header' ) ) {
					// ✅ Live Composer plugin function. Escaped by the plugin.
					echo dslc_hf_get_header();
				}
			} else {
				// Prepare custom header classes.
				$custom_header_classes = '';
				$custom_header_classes .= 'mega_main_menu-disabled';
				?>
				<header class="site-header <?php echo esc_attr( $custom_header_classes ); ?>" role="banner">
				<?php
				// Show header only if LC isn't active
				if ( defined('DS_LIVE_COMPOSER_ACTIVE') && DS_LIVE_COMPOSER_ACTIVE ) {
					esc_attr_e( 'The header is disabled when editing the page.', 'seowp' );
				} else {
					?><div class="default-topbar"><?php
					echo '<p class="tagline">' . esc_html( get_bloginfo( 'description' ) ) . '</p>';
					// Disable menu for editing mode in Live Composer.
					if ( has_nav_menu( 'topbar' ) ) {
						// If 'header-menu' location has a menu assigned.
						wp_nav_menu( array(
							'theme_location' => 'topbar',
							'container_class' => 'topbar-menu',
						) );
					} else {
						if ( current_user_can( 'install_themes' ) ) {
							echo '<div class="no-menu-set">';
							esc_attr_e( 'Set Menu', 'seowp' );
							echo '</div>';
						}
					}?>
					</div>
					<div class="default-header-content"><?php
					// Add logo if Mega Main Menu plugin is disabled
					// NOTE: logo displayed by Mega Main Menu.
					echo lbmn_logo_escaped();

					/**
					 * ----------------------------------------------------------------------
					 * Site header with Mega Menu
					 * menu location 'header-menu' with Mega Main Menu inside
					 */

					// Disable menu for editing mode in Live Composer.
					if ( has_nav_menu( 'header-menu' ) ) {
						// If 'header-menu' location has a menu assigned.
						wp_nav_menu( array(
							'theme_location' => 'header-menu',
							'container_class' => 'header-top-menu',
						) );
					} else {
						if ( current_user_can( 'install_themes' ) ) {
							echo '<div class="no-menu-set">';
							esc_attr_e( 'Set Menu', 'seowp' );
							echo '</div>';
						}
					}
					?></div><!-- default-header-content --><?php
				}
				?></header><!-- #masthead --><?php
			} ?>
			
			<div class="site-main">
				<div class="breadscrum ">
					<?php if (function_exists('check_breadcrumb')) check_breadcrumb();   ?>
				</div>
			
	
