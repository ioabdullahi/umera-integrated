<?php
/**
 * ----------------------------------------------------------------------
 * WordPress Easy Social Share Buttons plugin integration
 */

if ( class_exists( 'ESSB_Manager' ) ) {

	add_action( 'admin_init', 'lbmn_essb_disable_post_editing_metabox' );

	if ( ! function_exists( 'lbmn_essb_disable_post_editing_metabox' ) ) {
		/**
		 * Disable Easy Social Share button meta box on the post editing screen.
		 * It takes too much space and will confuse new theme users.
		 */
		function lbmn_essb_disable_post_editing_metabox() {

			$essb_options = get_option( 'easy-social-share-buttons3' );
			$essb_options['turnoff_essb_optimize_box'] = true;
			$essb_options['turnoff_essb_advanced_box'] = true;
			$essb_options['display_in_types'] = '';

			update_option( 'easy-social-share-buttons3', $essb_options );
		}
	}
}