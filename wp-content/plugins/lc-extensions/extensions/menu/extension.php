<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

function lcproext_menu_init() {

	// Register a new feature:
	LC_Extensions_Core::register_extension(
		array(
			'id' => 'menu',
			'rank' => 15,
			'title' => 'Mega Menu',
			'details' => 'https://livecomposerplugin.com/downloads/mega-menu/?utm_source=lcproext&utm_medium=extensions-list&utm_campaign=mega-menu',
			'description' => 'Adds Mega Menu module with advanced and fully customizable design options. Now you can create multicolumn menus with custom icons and responsive mobile menu.',
		)
	);

	/**
	 * Then, check if this extension is active.
	 * Don't load any plugin data if the extension is disabled.
	 */
	if ( LC_Extensions_Core::is_extension_active( 'menu' ) ) :


		if ( ! class_exists( 'LC_MenuPro' ) && class_exists( 'DSLC_Module' )  ) {

			if ( version_compare( DS_LIVE_COMPOSER_VER, '1.3', '>=' ) ) {

				/**
				 * Main LC_MenuPro Class.
				 *
				 * @since 1.0
				 */
				class LC_MenuPro {

					/**
					 * Construct
					 */
					public function __construct() {

						$this->setup_constants();
						$this->includes();

						add_action( 'wp_enqueue_scripts', array( $this, 'load_scripts' ) );
						add_action( 'admin_enqueue_scripts', array( $this, 'load_admin_scripts' ) );
						add_action( 'wp_enqueue_scripts', array( $this, 'load_styles' ) );
						add_action( 'admin_enqueue_scripts', array( $this, 'load_admin_styles' ) );
						add_action( 'wp_footer', array( $this, 'footer_code' ) );
					}

					/**
					 * Output icon-fonts css files on menu editing admin screen.
					 *
					 * @return void
					 */
					function icon_files_in_admin( $admin_screens ) {
						$admin_screens[] = 'nav-menus';
						// ↑↑↑ output icon font css on Menu Editing admin screen.

						return $admin_screens;
					}

					/**
					 * Setup plugin constants.
					 *
					 * @access private
					 * @since 1.0
					 * @return void
					 */
					private function setup_constants() {

						// Plugin version.
						if ( ! defined( 'LCMENUPRO_VERSION' ) ) {
							define( 'LCMENUPRO_VERSION', '1.3.2' );
						}

						// Plugin Folder Path.
						if ( ! defined( 'LC_MenuPro_PLUGIN_DIR' ) ) {

							define( 'LC_MenuPro_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
						}

						// Plugin Folder URL.

						if ( ! defined( 'LCMENUPRO_PLUGIN_URL' ) ) {
							define( 'LCMENUPRO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
						}

						// Plugin Root File.
						if ( ! defined( 'LC_MenuPro_PLUGIN_FILE' ) ) {

							define( 'LC_MenuPro_PLUGIN_FILE', __FILE__ );
						}
					}

					/**
					 * Loads additional php files.
					 *
					 * @access public
					 * @since 1.0
					 * @return void
					 */
					public function includes() {
						include( dirname( __FILE__ ) . '/includes/module.php' );
					}

					/**
					 * Load Scripts styles on front end
					 *
					 * @access public
					 * @return void
					 */
					public function load_scripts() {
						wp_enqueue_script(
							'lcmenupro-js', // handle
							LCMENUPRO_PLUGIN_URL . 'js/main.js',
							array( 'jquery' ), // deps
							LCMENUPRO_VERSION,  // ver
							true        // In_footer.
						);
					}

					/**
					 * Load Scripts styles on back end
					 *
					 * @access public
					 * @return void
					 */
					public function load_admin_scripts() {
						$screen_data = get_current_screen();
						$screen = $screen_data->base;

						// Loads scripts only on Admin > Appearance > Menus page.
						if ( 'nav-menus' === $screen ) {
							wp_enqueue_script( 'jquery-ui-core' );
							wp_enqueue_script( 'jquery-ui-dialog' );

							wp_enqueue_script(
								'lcmenupro-admin-js', // handle
								LCMENUPRO_PLUGIN_URL . 'js/admin.js',
								array( 'jquery', 'jquery-ui-dialog' ), // deps
								LCMENUPRO_VERSION,  // ver
								true        // In_footer.
							);
						}

						// Loads scripts on Live Composer editing screen.
						// Needed for dslc_show_dropdown function.
						if ( 'toplevel_page_livecomposer_editor' === $screen ) {
							wp_enqueue_script(
								'lcmenupro-admin-js', // handle
								LCMENUPRO_PLUGIN_URL . 'js/admin.js',
								array( 'jquery' ), // deps
								LCMENUPRO_VERSION,  // ver
								true        // In_footer.
							);
						}
					}

					/**
					 * Load CSS styles on back end
					 *
					 * @access public
					 * @return void
					 */
					public function load_admin_styles() {
						$screen_data = get_current_screen();
						$screen = $screen_data->base;

						// Loads scripts only on Admin > Appearance > Menus page.
						if ( 'nav-menus' === $screen ) {
							wp_enqueue_style(
								'lcmenupro-css',
								LCMENUPRO_PLUGIN_URL . 'css/admin.css',
								false
							);
						}

						if ( 'toplevel_page_livecomposer_editor' === $screen ) {
							wp_enqueue_style(
								'lcmenupro-css',
								LCMENUPRO_PLUGIN_URL . 'css/editing-admin-screen.css',
								false
							);
						}
					}

					/**
					 * Load CSS styles on front end
					 *
					 * @access public
					 * @return void
					 */
					public function load_styles() {
						wp_enqueue_style(
							'lcmenupro-css',
							LCMENUPRO_PLUGIN_URL . 'css/main.css',
							false
						);
					}

					public function footer_code() {
						?>
						<svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<defs>
								<symbol id="icon-menu" viewBox="0 0 24 24">
									<path d="M21 11h-18c-0.55 0-1 0.45-1 1s0.45 1 1 1h18c0.55 0 1-0.45 1-1s-0.45-1-1-1z"></path>
									<path d="M3 7h18c0.55 0 1-0.45 1-1s-0.45-1-1-1h-18c-0.55 0-1 0.45-1 1s0.45 1 1 1z"></path>
									<path d="M21 17h-18c-0.55 0-1 0.45-1 1s0.45 1 1 1h18c0.55 0 1-0.45 1-1s-0.45-1-1-1z"></path>
								</symbol>

								<symbol id="icon-x" viewBox="0 0 24 24">
									<path d="M13.413 12l5.294-5.294c0.387-0.387 0.387-1.025 0-1.413s-1.025-0.387-1.413 0l-5.294 5.294-5.294-5.294c-0.387-0.387-1.025-0.387-1.413 0s-0.387 1.025 0 1.413l5.294 5.294-5.294 5.294c-0.387 0.387-0.387 1.025 0 1.413 0.194 0.194 0.45 0.294 0.706 0.294s0.513-0.1 0.706-0.294l5.294-5.294 5.294 5.294c0.194 0.194 0.45 0.294 0.706 0.294s0.513-0.1 0.706-0.294c0.387-0.387 0.387-1.025 0-1.413l-5.294-5.294z"></path>
								</symbol>
							</defs>
						</svg>
						<?php
					}
				}

				$lcmenupro = new LC_MenuPro();
			} else {

				/**
				 * Admin Notice
				 */
				function lcmenupro_notice_lc_version() {
				?>
				<div class="notice notice-error">
					<p><?php printf( __( 'The "Live Composer - Menu Pro" add-on requires Live Composer version 1.3+. %sContact our support team%s if you need a previous version.', 'lcmenupro' ), '<a target="_blank" href="https://livecomposerplugin.com/support/">', '</a>' ); ?></p>
				</div>
				<?php }
				add_action( 'admin_notices', 'lcmenupro_notice_lc_version' );
			}

		} else {
			/**
			 * Admin Notice
			 */
			function lcmenupro_inactive_notice() {
			?>
			<div class="error">
				<p><?php printf( __( '%sCan\'t activate Menu Pro extension for Live Composer.%s %sLive Composer%s plugins should be active.', 'lcmenupro' ), '<strong>', '</strong>', '<a target="_blank" href="https://wordpress.org/plugins/live-composer-page-builder/">', '</a>' ); ?></p>
			</div>
			<?php }
			add_action( 'admin_notices', 'lcmenupro_inactive_notice' );

		} // End if class_exists check.
	
	endif; // If is_extension_active.

}

lcproext_menu_init();

/* 
function prefix_nav_description( $item_output, $item, $depth, $args ) {
	if ( ! empty( $item->description ) ) {
		$item_output = str_replace( '">' . $args->link_before . $item->title, '">' . $args->link_before . '<span class="menu-item-description">' . $item->description . '</span>' . $item->title, $item_output );
	}

	return $item_output;
}
// add_filter( 'walker_nav_menu_start_el', 'prefix_nav_description', 10, 4 ); */

/**
 * Then, check if this extension is active.
 * Don't load any plugin data if the extension is disabled.
 */
if ( LC_Extensions_Core::is_extension_active( 'menu' ) ) :

	function lcextpro_nav_menu_item_args( $args, $item, $depth ) {

		if ( ! empty( $item->description ) ) {
			$prefix = '<span class="menu-item-description">';
			$suffix = '</span>';
			$args->link_after = $prefix . $item->description . $suffix;
		} else {
			$args->link_after = ''; // For some reason this line is required.
		}

		return $args;
	}
	add_filter( 'nav_menu_item_args', 'lcextpro_nav_menu_item_args', 10, 3 );

	function lcextpro_enable_icons_on_nav_menu( $admin_screens ) {

		$admin_screens[] = 'nav-menus';

		return $admin_screens;
	}
	add_filter( 'dslc_icons_admin_screens', 'lcextpro_enable_icons_on_nav_menu', 10, 1 );

	/**
	 * Functions filters $controls_without_toggle array to determine what
	 * controls in the module options need no on/off toggle.
	 * In this case we disable toggle for 'Mobile Menu Preview' button.
	 */
	function lcextpro_controls_without_toggle_func( $controls_without_toggle ) {

		$controls_without_toggle[] = 'css_toggle_menu_preview';
		$controls_without_toggle[] = 'css_mobile_toggle_show_on';
		$controls_without_toggle[] = 'css_fullmenu_show_on';
		return $controls_without_toggle;

	} add_filter( 'dslc_controls_without_toggle', 'lcextpro_controls_without_toggle_func', 10, 1 );

endif; // If is_extension_active.
