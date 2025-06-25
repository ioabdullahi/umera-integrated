<?php
/**
 * Available filters for extending Merlin WP.
 *
 * @package   Merlin WP
 * @version   @@pkg.version
 * @link      https://merlinwp.com/
 * @author    Rich Tabor, from ThemeBeans.com & the team at ProteusThemes.com
 * @copyright Copyright (c) 2018, Merlin WP of Inventionn LLC
 * @license   Licensed GPLv3 for Open Source Use
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Disable automatic redirect to Merlin if theme updated not just installed.
 *
 * @return void
 */
function lbmn_disable_merlin_redirect() {
	if ( get_option( LBMN_THEME_NAME . '_democontent_imported' ) ) {
		delete_transient( 'seowp_merlin_redirect' );
	}
}
add_action( 'merlin_before_redirect', 'lbmn_disable_merlin_redirect', 10 );

/**
 * Filter the home page title from your demo content.
 * If your demo's home page title is "Home", you don't need this.
 *
 * @param string $output Home page title.
 */
function lbmn_merlin_content_home_page_title( $output ) {
	return LBMN_HOME_TITLE;
}
add_filter( 'merlin_content_home_page_title', 'lbmn_merlin_content_home_page_title' );

/**
 * Fill default data into the import set to resolve errors from the importer.
 *
 * @param array $data Data item being imported.
 * @param array $meta See import script.
 * @param array $comments See import script.
 * @param array $terms See import script.
 * @return array
 */
function lbmn_wxrimporter_preprocess_post( $data, $meta, $comments, $terms ) {

	if ( ! isset( $data['post_id'] ) ) {
		$data['post_id'] = rand( 9999 , 99999 );
	}

	if ( ! isset( $data['post_content'] ) ) {
		$data['post_content'] = '';
	}

	if ( ! isset( $data['guid'] ) ) {
		$data['guid'] = 'https://example.com/' . $data['post_id'];
	}

	if ( ! isset( $data['post_date'] ) ) {
		$data['post_date'] = '2012-12-12 12:12:12';
	}

	if ( ! isset( $data['is_sticky'] ) ) {
		$data['is_sticky'] = 0;
	}

	return $data;
}
add_filter( 'wxr_importer.pre_process.post', 'lbmn_wxrimporter_preprocess_post', 20, 4 );


/**
 * Add additional 'Plugins Integration' step into the Merlin importer.
 *
 * @param object $merlin Instance of the Merlin Class.
 * @return void
 */
function lbmn_plugins_integration( $merlin ) {
	$header = esc_attr__( 'Plugins Integration', 'seowp' );
	$paragraph = esc_attr__( 'Installed plugins need to be configured to work with the theme. This step is required.', 'seowp' );
	?>

	<div class="merlin__content--transition">
		<?php echo wp_kses(
			$merlin->svg( array( 'icon' => 'plugins' ) ),
			$merlin->svg_allowed_html()
		); ?>
		<svg class="icon icon--checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
			<circle class="icon--checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="icon--checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
		</svg>
		<h1><?php echo esc_html( $header ); ?></h1>
		<p><?php echo esc_html( $paragraph ); ?></p>
		<ul class="merlin__drawer merlin__drawer--import-content js-merlin-drawer-import-content">
			<li class="merlin__drawer--import-content__list-item status status--Pending" data-content="config-set">
				<input type="checkbox" name="default_content[config-set]" class="checkbox checkbox-content" id="default_content_content" value="1" checked="">
				<label for="default_content_content">
					<i></i><span><?php esc_attr_e( 'Content', 'seowp' ); ?></span>
				</label>
			</li>
		</ul>
	</div>
	<footer class="merlin__content__footer">
		<a href="<?php echo esc_url( wp_get_referer() && ! strpos( wp_get_referer(), 'update.php' ) ? wp_get_referer() : esc_url( admin_url( '/' ) ) ); ?>" class="merlin__button merlin__button--skip"><?php esc_html_e( 'No', 'seowp' ); ?></a>
		<a href="<?php echo esc_url( $merlin->step_next_link() ); ?>" class="merlin__button merlin__button--next button-next" data-callback="install_content">
			<span class="merlin__button--loading__text"><?php esc_attr_e( 'Proceed', 'seowp' ); ?></span>

			<div class="merlin__progress-bar">
				<span class="js-merlin-progress-bar"></span>
			</div>

			<span class="js-merlin-progress-bar-percentage">0%</span>
		</a>
		<?php wp_nonce_field( 'merlin' ); ?>
	</footer>

<?php
	$merlin->logger->debug( esc_attr__( 'The plugin integration step has been displayed', 'seowp' ) );
}

/**
 * Set the theme slug.
 *
 * @param string $slug Slug to filter.
 * @return string
 */
function lbmn_merlin_slug( $slug ) {
	return 'seowp';
}
add_filter( 'merlin_slug', 'lbmn_merlin_slug', 10, 1 );

/**
 * With Live Composer no need to use and push child theme creation.
 *
 * @param array  $steps Demo content installation steps.
 * @param object $merlin Class instance.
 * @return array
 */
function lbmn_remove_child_theme_generator( $steps, $merlin ) {
	// Disable Child Theme Configurator.
	unset( $steps['child'] );
	// Plugins integration step.
	$plugins_step = array_search( 'plugins', array_keys( $steps ) );
	$steps = array_merge( array_slice( $steps, 0, $plugins_step + 1, true ),
		array(
			'integration' => array(),
		),
	array_slice( $steps, $plugins_step + 1, null, true ) );

	$steps['integration'] = array(
		'name' => esc_html__( 'Integration', 'seowp' ),
		'view' => 'lbmn_plugins_integration',
	);

	return $steps;
}
add_filter( 'seowp_merlin_steps', 'lbmn_remove_child_theme_generator', 10, 2 );


function lbmn_extend_import_sets( $content, $merlin, $import_files, $selected_import_index ) {


	$content['config-set'] = array(
		'title'            => esc_attr__( 'Required Templates', 'seowp' ),
		'description'      => esc_attr__( 'Demo content data.', 'seowp' ),
		'pending'          => esc_attr__( 'Pending', 'seowp' ),
		'installing'       => esc_attr__( 'Installing', 'seowp' ),
		'success'          => esc_attr__( 'Success', 'seowp' ),
		'checked'          => $merlin->is_possible_upgrade() ? 0 : 1,
		'install_callback' => array( $merlin->importer, 'import' ),
		'data'             => $import_files['config-set'],
	);

	return $content;
}
add_filter( 'merlin_get_base_content', 'lbmn_extend_import_sets', 10, 4);



function lbmn_extend_import_files( $import_files, $merlin ) {

	$import_files['config-set'] = array(
		// remote_file
		// local_file
		array(
			'title' => esc_attr__( 'Basic Menu', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-basicmenu.xml',
		),
		array(
			'title' => esc_attr__( 'Top-Bar Menu', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-topbar.xml',
		),
		array(
			'title' => esc_attr__( 'Mega Main Menu', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/demo-content/seowp-mainmenu.xml',
		),
		array(
			'title' => esc_attr__( 'Default Footers', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-footer-default.xml',
		),
		array(
			'title' => esc_attr__( 'Default Headers', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-header-default.xml',
		),
		array(
			'title' => esc_attr__( 'Headers – Layout 1', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-header-variation-1.xml',
		),
		array(
			'title' => esc_attr__( 'Headers – Layout 2', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-header-variation-2.xml',
		),
		array(
			'title' => esc_attr__( 'Templates', 'seowp' ),
			'file_path'  => trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-templates.xml',
		),
	);

	return $import_files;
}
add_filter( 'merlin_get_import_files_paths', 'lbmn_extend_import_files', 10, 2 );

function lbmn_set_main_menu() {
	// Assign 'Demo Mega Menu' to the 'Header Menu' location.
	$menu_object = wp_get_nav_menu_object( 'mega-main-menu' );
	$menu_object_id = $menu_object->term_id;

	$locations = get_nav_menu_locations();
	$locations['header-menu'] = $menu_object_id;
	set_theme_mod( 'nav_menu_locations', $locations );
}

function lbmn_content_file_imported( $data, $logs ) {

	// Create top-bar menu once it's demo items imported.
	if ( stristr( $data, 'basic-config/seowp-topbar.xml' ) ) {
		// Assign 'Demo Mega Menu' to the 'Header Menu' location.
		$menu_object    = wp_get_nav_menu_object( 'top-bar-menu' );
		$menu_object_id = $menu_object->term_id;

		$locations  = get_nav_menu_locations();
		$locations['topbar'] = $menu_object_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}

	// Create basic menu once it's demo items imported.
	if ( stristr( $data, 'basic-config/seowp-basicmenu.xml' ) ) {
		// Assign 'Demo Mega Menu' to the 'Header Menu' location.
		$menu_object    = wp_get_nav_menu_object( 'basic-main-menu' );
		$menu_object_id = $menu_object->term_id;

		$locations = get_nav_menu_locations();
		$locations['header-menu'] = $menu_object_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}

	// Actions after 'Flat' content imported.
	if ( stristr( $data, 'flat/content.xml' ) ) {
		// Assign imported menu to the main location.
		lbmn_set_main_menu();

		// Import MasterSlider plugin data.
		lbmn_masterslider_import();

		// Update footer - simplified post_meta 'dslc_hf_type'.
		$footer_design_default = get_page_by_path( 'footer-basic', OBJECT, 'dslc_hf' );
		update_post_meta( $footer_design_default->ID, 'dslc_hf_type', 'regular' );
	}

	// Actions after 'Fresh' content imported.
	// Create main menu once it's demo items imported.
	if ( stristr( $data, 'fresh/content.xml' ) ) {
		// Assign imported menu to the main location.
		lbmn_set_main_menu();

		// Update footer - simplified post_meta 'dslc_hf_type'.
		$footer_design_default = get_page_by_path( 'footer-basic', OBJECT, 'dslc_hf' );
		update_post_meta( $footer_design_default->ID, 'dslc_hf_type', 'regular' );

		$header_design_default = get_page_by_path( 'header-default', OBJECT, 'dslc_hf' );
		update_post_meta( $header_design_default->ID, 'dslc_hf_type', 'regular' );

	}
}
add_action( 'merlin_content_file_imported', 'lbmn_content_file_imported', 10, 2 );

function lbmn_config_after_plugins_installed( $imported_content_type ) {

	if ( 'config-set' === $imported_content_type ) {
		// Update theme option '_basic_config_done'.
		update_option( LBMN_THEME_NAME . '_basic_config_done', true );
		if ( ! defined( 'LBMN_THEME_CONFUGRATED' ) ) {
			define( 'LBMN_THEME_CONFUGRATED', true );
		}

		// Set default theme logo.
		if ( ! has_custom_logo() ) {
			$logo_url = get_template_directory_uri() . '/design/images/seo-wordpress-theme-logo-horizontal.png';
			$logo_post_id = 0;
			$log_desc = esc_attr__( 'Logo', 'seowp' );

			$logo_id = media_sideload_image( $logo_url, $logo_post_id, $log_desc, 'id' );
			set_theme_mod( 'custom_logo', $logo_id );
		}

		// Update theme option '_basic_config_done'.
		update_option( LBMN_THEME_NAME . '_democontent_imported', true );

		// Set Custom Teplate configs.
		lbmn_update_cpt();

		// Create widget areas in Live Composer.
		update_option( 'dslc_plugin_options', array(
			'sidebars' => 'Sidebar,404 Page Widgets,Comment Form Area,',
		) );

		// Then run LiveComposer function that creates sidebars dynamically.
		dslc_sidebars();

		lbmn_activate_pro_modules();

		// Regenerate Custom CSS
		lbmn_customized_css_cache_reset(); // Refresh custom css without printig css (false).

		dslc_refresh_template_ids();
	}
}
add_action( 'merlin_content_set_imported', 'lbmn_config_after_plugins_installed', 10, 2 );

/* function lbmn_config_after_full_demo_imported( $imported_content_type ) {
	// content // config-set // widgets // after_import
	if ( 'after_import' === $imported_content_type ) {
		// Update footer - simplified post_meta 'dslc_hf_type'.
		$footer_design_default = get_page_by_path( 'footer-basic', OBJECT, 'dslc_hf' );
		update_post_meta( $footer_design_default->ID, 'dslc_hf_type', 'regular' );

		$footer_design_default = get_page_by_path( 'header-default', OBJECT, 'dslc_hf' );
		update_post_meta( $footer_design_default->ID, 'dslc_hf_type', 'regular' );
	}
}
add_action( 'merlin_content_set_imported', 'lbmn_config_after_full_demo_imported', 10, 2 );
 */
function lbmn_before_content_import_setup() {
	// Live Composer has links to images hard-coded, so before importing
	// media we need to check that the Settings > Media >
	// 'Organize my uploads into month- and year-based folders' unchecked
	// as on demo server. After import is done we set back original state
	// of this setting.
	$setting_original_useyearmonthfolders = get_option( 'uploads_use_yearmonth_folders' );
	update_option( 'uploads_use_yearmonth_folders_backup', $setting_original_useyearmonthfolders );
	update_option( 'uploads_use_yearmonth_folders', 0 );

	if ( get_option( 'permalink_structure' ) != '/%postname%/' ) {
		lbmn_fix_permalinks();
	}
}
add_action( 'import_start', 'lbmn_before_content_import_setup' );

/**
 * ----------------------------------------------------------------------
 * AJAX action - fix permalinks.
 */
function lbmn_fix_permalinks() {
	// Check access permissions.
	if ( ! current_user_can( 'install_themes' ) ) {
		wp_die( 'You do not have rights to do this' );
	}

	update_option( 'permalink_structure', '/%postname%/' );
	flush_rewrite_rules();
}


function lbmn_after_content_import_setup() {
	// Assign imported menu to the main location (Second time to make sure users have it).
	lbmn_set_main_menu();
	// Set 'Organize my uploads into month- and year-based folders' setting
	// to its original state.
	$setting_original_useyearmonthfolders = get_option( 'uploads_use_yearmonth_folders_backup', 0);
	update_option( 'uploads_use_yearmonth_folders', $setting_original_useyearmonthfolders );
}
add_action( 'import_end', 'lbmn_after_content_import_setup' );


/**
 * Define the demo import files (local files).
 *
 * You have to use the same filter as in above example,
 * but with a slightly different array keys: local_*.
 * The values have to be absolute paths (not URLs) to your import files.
 * To use local import files, that reside in your theme folder,
 * please use the below code.
 * Note: make sure your import files are readable!
 */
function prefix_merlin_local_import_files() {
	return array(
		array(
			'import_file_name' 	=> esc_attr__( 'Fresh', 'seowp' ),
			// 'local_import_file'	=> trailingslashit( get_template_directory() ) . 'design/basic-config/seowp-templates.xml',
			'local_import_file' => trailingslashit( get_template_directory() ) . 'design/demo-content/fresh/content.xml',
			'local_import_widget_file'     => trailingslashit( get_template_directory() ) . 'design/demo-content/fresh/seowp-widgets.wei',
			'local_import_customizer_file' => trailingslashit( get_template_directory() ) . 'design/demo-content/fresh/customizer.dat',
			'import_preview_image_url'     => 'https://themeforest.img.customer.envatousercontent.com/files/258163886/01_thumb.__large_preview.jpg',
			'import_notice'                => esc_attr__( 'After you import this demo, you will have to setup the slider separately.', 'seowp' ),
			'preview_url'                  => 'https://www.seowptheme.com/',
		),
		array(
			'import_file_name' 	=> esc_attr__( 'Flat', 'seowp' ),
			'local_import_file'	=> trailingslashit( get_template_directory() ) . 'design/demo-content/flat/content.xml',
			'local_import_widget_file'     => trailingslashit( get_template_directory() ) . 'design/demo-content/flat/seowp-widgets.wei',
			// 'local_import_customizer_file' => trailingslashit( get_template_directory() ) . 'merlin/customizer.dat',
			'import_preview_image_url'     => 'https://themeforest.img.customer.envatousercontent.com/files/258163886/01_thumb.__large_preview.jpg',
			'import_notice'                => esc_attr__( 'After you import this demo, you will have to setup the slider separately.', 'seowp' ),
			'preview_url'                  => 'https://www.seowptheme.com/',
		),
	);
}
add_filter( 'merlin_import_files', 'prefix_merlin_local_import_files' );

/**
 * Execute custom code after the whole import has finished.
 */
function lbmn_merlin_after_import_setup() {
	// Import Demo Ninja Forms.
	lbmn_ninjaforms_import();

	// Regenerate Custom CSS.
	lbmn_customized_css_cache_reset(); // refresh custom css without printig css (false).
}
add_action( 'merlin_after_all_import', 'lbmn_merlin_after_import_setup' );

// Import pre-designed MasterSlider Slides.
function lbmn_masterslider_import() {

	// http://support.averta.net/envato/support/ticket/regenerate-custom-css-programatically/#post-16478
	// Check if MasterSlider is active.
	if ( defined( 'MSWP_AVERTA_VERSION' ) ) {

		include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/classes/class-msp-importer.php' );

		$current_sliders         = get_masterslider_names( 'title-id' );
		$slider_already_imported = false;

		foreach ( $current_sliders as $slider => $slider_id ) {
			if ( stristr( $slider, 'Flat Design Style' ) ) {
				$slider_already_imported = true;
			}
		}

		if ( ! $slider_already_imported ) {
			global $ms_importer;
			if ( is_null( $ms_importer ) ) {
				$ms_importer = new MSP_Importer();
			}

			// * @return bool   true on success and false on failure
			/* ✅ Read JSON with slides import via file_get_contents. ➡️ WP_Filesystem isn't for that. See: https://wordpress.stackexchange.com/a/166172 */
			$slider_import_state = $ms_importer->import_data( file_get_contents(
				trailingslashit( get_template_directory() ) . 'design/demo-content/plugin-masterslider.json'
			) );
		}

		// Force Master Slider Custom CSS regeneration.
		include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/msp-admin-functions.php' );

		if ( function_exists( 'msp_save_custom_styles' ) ) {
			msp_update_preset_css(); // Presets re-generation.
			msp_save_custom_styles(); // Save sliders custom css.
		}
	}
}

function lbmn_custom_text_after_merlin_headers( $step_id ) {
	if ( 'welcome' === $step_id ) {
		echo '<h4>' . esc_attr__( 'Let\'s activate your theme!', 'seowp' ) . '</h4>';
	}
}


function lbmn_custom_text_after_merlin_paragraph( $step_id, $secondary_condition = false ) {
	if ( 'welcome' === $step_id && ! $secondary_condition ) {
		// $secondary_condition in this casee = already installed.
		echo '<p class="theme-installer-important-text add-spacing">' . esc_attr__( 'Theme won\'t work to the full potential until this process completed.', 'seowp' ) . '</p>';
	}

	if ( 'content' === $step_id && ! $secondary_condition ) {
		// $secondary_condition in this casee = already installed.
		echo '<p class="theme-installer-important-text add-spacing">' . esc_html__( 'It can take 5 minutes or so.', 'seowp' ) . '</p>';
		echo '<p style="margin-top: 20px; font-weight: bold;">' . esc_html__( 'Choose design to import:', 'seowp' ) . '</p>';
	}
}
add_action( 'merlin_step_after_paragraph', 'lbmn_custom_text_after_merlin_paragraph', 10 );

/**
 * ----------------------------------------------------------------------
 * Ninja Forms Importer
 */
function lbmn_ninjaforms_import() {
	$import_path = get_template_directory() . '/design/demo-content/plugin-ninja-forms/';

	// Import demo forms for Ninja Forms Plugin
	if ( class_exists( 'Ninja_Forms' ) && $handle = opendir( $import_path ) ) {
		while ( false !== ( $entry = readdir( $handle ) ) ) {
			if ( $entry != "." && $entry != ".." ) {
				$form_id = rand( 8000, 9000 );
				/* ✅ Read JSON with form import settings via file_get_contents. ➡️ WP_Filesystem isn't for that. See: https://wordpress.stackexchange.com/a/166172 */
				Ninja_Forms()->form()->import_form( file_get_contents( $import_path . $entry ), TRUE, $form_id, TRUE );
			}
		}
		closedir( $handle );
	}
}

/**
 * ----------------------------------------------------------------------
 * In some situations after theme switch WordPress forgets menus
 * that were assigned to menu locations.
 *
 * The next code saves [menu id > location] pairs before the theme
 * switch and redeclare it back when our theme is active again.
 */
function lbmn_save_menu_locations( $current_screen ) {
	// If Apperance > Menu screen visited.
	if ( 'nav-menus' === $current_screen->id ) {
		// Remember menus assigned to our locations.
		$locations = get_nav_menu_locations();
		update_option( LBMN_THEME_NAME . '_menuid_topbar', $locations['topbar'] );
		update_option( LBMN_THEME_NAME . '_menuid_header', $locations['header-menu'] );
	}
}
add_action( 'current_screen', 'lbmn_save_menu_locations' );



function lbmn_reset_installer( $current_screen ) {
	// If Apperance > Menu screen visited.
	if ( 'themes' === $current_screen->id && current_user_can( 'install_themes' ) ) {
		// Reset quick theme installer steps
		if ( isset( $_GET['reset_quicksetup'] ) ) {
			delete_option( 'merlin_' . LBMN_THEME_NAME . '_completed' );
			update_option( 'lbmn_force_reset', true );
		}
	}
}
add_action( 'current_screen', 'lbmn_reset_installer' );




function lbmn_redeclare_menu_locations() {

	// Check if 'header' locaiton has no menu assigned.
	$menuid_header = get_option( LBMN_THEME_NAME . '_menuid_header' );
	if ( ! has_nav_menu( 'header-menu' ) && isset( $menuid_header ) ) {
		// Attach saved before menu id to 'topbar' location.
		$locations                = get_nav_menu_locations();
		$locations['header-menu'] = $menuid_header;
		set_theme_mod( 'nav_menu_locations', $locations );
	}

	// Check if 'topbar' locaiton has no menu assigned.
	$menuid_topbar = get_option( LBMN_THEME_NAME . '_menuid_topbar' );
	if ( ! has_nav_menu( 'topbar' ) && isset( $menuid_topbar ) ) {
		// Attach saved before menu id to 'topbar' location.
		$locations           = get_nav_menu_locations();
		$locations['topbar'] = $menuid_topbar;
		set_theme_mod( 'nav_menu_locations', $locations );
	}
}
add_action( 'after_switch_theme', 'lbmn_redeclare_menu_locations' );

/**
 * Custom WP Admin Help panel elements.
 *
 * @return void
 */
function lbmn_themeinstaller_add_help() {
	// Prepare button hide/show theme setup panel.
	if ( ! get_option( LBMN_THEME_NAME . '_hide_quicksetup' ) ) {
		$action_button = '<a href="' . esc_url( add_query_arg( 'hide_quicksetup', 'true', esc_url( admin_url( 'themes.php' ) ) ) ) . '">' . esc_attr__( 'Hide' , 'seowp' ) . '</a>';
	} else {
		$action_button = '<a href="' . esc_url( add_query_arg( 'show_quicksetup', 'true', esc_url( admin_url( 'themes.php' ) ) ) ) . '">' . esc_attr__( 'Show' , 'seowp' ) . '</a>';
	}

	$screen = get_current_screen();
	$help_tab_content = '<p><strong>Quick theme installer:</strong> <ul><li>' . $action_button . ' theme setup options panel</li>' . '<li><a href="' . esc_url( add_query_arg( 'reset_quicksetup', 'true', admin_url( 'themes.php' ) ) ) . '">Reset</a> completed quick theme installer steps</a></li>' . '</ul></p>' . '<p><strong>Get help:</strong> <ul><li><a href="https://support.seowptheme.com/" target="_blank">Online theme documentation</a></li>' . '<li><a href="http://themeforest.net/item/seo-wp-social-media-and-digital-marketing-agency/8012838/support" target="_blank">One to one support</a></li></p>';
	// Add filter to make it possible to add more elements on our help panel.
	$help_tab_content = apply_filters( 'lbmn_theme_help_tab_content', $help_tab_content );

	$screen->add_help_tab( array(
		'id'      => 'my-plugin-default',
		'title'   => esc_attr__( 'SEOWP Theme', 'seowp' ),
		'content' => $help_tab_content,
	) );
}
add_action( 'load-themes.php', 'lbmn_themeinstaller_add_help' );

/**
 * Update CPT for Projects when to install the theme
 */
function lbmn_update_cpt() {
	if ( ! get_option( 'dslc_custom_options_templatesforcpt', false ) ) {
		$default_cpt_settings = array(
			'lc_tpl_for_cpt_page' => 'unique',
			'lc_tpl_for_cpt_post' => 'lc_templates',
			'lc_tpl_for_cpt_dslc_downloads' => 'lc_templates',
			'lc_tpl_for_cpt_dslc_galleries' => 'lc_templates',
			'lc_tpl_for_cpt_dslc_partners' => 'lc_templates',
			'lc_tpl_for_cpt_dslc_projects' => 'unique',
			'lc_tpl_for_cpt_dslc_staff' => 'lc_templates',
			'lc_tpl_for_cpt_dslc_testimonials' => 'lc_templates',
		);

		update_option( 'dslc_custom_options_templatesforcpt', $default_cpt_settings );
	}
}


if ( ! function_exists( 'lbmn_themeinstall_notification' ) ) {
	function lbmn_themeinstall_notification() {

		$screen = get_current_screen();
		$wizzard_status = get_option( 'merlin_' . LBMN_THEME_NAME . '_completed' );
		$demo_imported = get_option( LBMN_THEME_NAME . '_democontent_imported' );
		$force_reset = get_option( 'lbmn_force_reset' );

		$notice_id = 'install';
		$notice_dismissed = get_option( LBMN_THEME_NAME . '_' . $notice_id . '_notice_dismissed', false );

		if ( 'appearance_page_install-required-plugins' !== $screen->id
				&& ! $notice_dismissed && current_user_can( 'install_plugins' ) ) {
			if ( $force_reset || ! $demo_imported && ! $wizzard_status ) {
		?>
			<div class="update-nag lbmn-themeupdate-notification notice notice-info is-dismissible lbmn-notice"
				<?php echo 'data-nonce="' . esc_attr( wp_create_nonce( 'lbmn_' . $notice_id . '_notice_nonce' ) ) . '" '; ?>
				<?php echo 'data-notice="' . esc_attr( $notice_id ) . '" '; ?>>
				<span class="dashicons dashicons-admin-generic"></span>
				<div>
					<h3><?php esc_html_e( 'Let\'s activate your theme...', 'seowp' ); ?></h3>
					<p><?php esc_html_e( 'We need to install required premium plugins and configure the theme.', 'seowp' ); ?><br />
					<span class="theme-installer-important-text"><?php esc_html_e( 'Theme will not work to the full potential until you complete this process.', 'seowp' ); ?></span></p>
				</div>
				<a class="button button-primary button-hero"
					href="<?php echo esc_url(
						add_query_arg(
							array(
								'page' => 'configurator',
							),
							admin_url( 'themes.php' )
						)
					); ?>"><?php esc_attr_e( 'Start Now', 'seowp' ); ?></a>
			</div>
		<?php
			}
		}
	}
}
add_action( 'admin_notices', 'lbmn_themeinstall_notification' );
