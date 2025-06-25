<?php
/**
 * ----------------------------------------------------------------------
 * WP Cost Estimation & Payment Forms Builder integration.
 */

if ( function_exists( 'Estimation_Form' ) ||  function_exists( 'lfb_init_ep_form' )) {
	if ( function_exists( 'lfb_setThemeMode' ) ) {
		lfb_setThemeMode(); // Disable purchase code requrest.
		define( 'CNR_DEV', true ); // Make the plugin to output css without shortcode in the body.
	}
}

// Make the plugin to output css without shortcode in the body.
function lbmn_estimationform_lc_content( $post, $post_content ) {
	if ( ! empty( $post->ID ) ) {
		$livecomposer_code = get_post_meta( $post->ID, 'dslc_code', true );

		if ( $livecomposer_code ) {
			$livecomposer_code = dslc_decode_shortcodes( maybe_unserialize( $livecomposer_code ) );
			// Replace form_id=\\\"1\\\" -> form_id="1".
			$livecomposer_code = str_replace( '\\"', '"', $livecomposer_code );
			// Use it a few times to cover all possible variations for backslashes.
			$livecomposer_code = str_replace( '\\"', '"', $livecomposer_code );
			$livecomposer_code = str_replace( '\\"', '"', $livecomposer_code );
		}

		$post_content = $post_content . ' ' . $livecomposer_code;
	}
	return $post_content;
}

add_filter( 'lfb-load-assets-for-post', 'lbmn_estimationform_lc_content', 10, 2 );


// Custom demo forms import.
function lbmn_estimationform_demo_content( $file, $settings ) {
	$file = trailingslashit( get_template_directory() ) . 'design/demo-content/plugin-estimation-forms/export_estimation_form.json';
	return $file;
}

add_filter( 'lfb-installation-forms-import-file', 'lbmn_estimationform_demo_content', 10, 2 );
