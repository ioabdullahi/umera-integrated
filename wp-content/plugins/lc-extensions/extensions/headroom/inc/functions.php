<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Head Room
 */

function lcproext_header_option() {

    global $dslc_var_post_options;

    $dslc_var_post_options['dslc-hf-opts']['options'][] = array(
        'label' => __( 'Hide Header', 'live-composer-page-builder' ),
        'descr' => __( 'Hide your header until you need it.', 'live-composer-page-builder' ),
        'std' => 'disabled',
        'id' => 'dslc_hf_header_hide',
        'type' => 'select',
        'choices' => array(
            array(
                'label' => 'Enabled',
                'value' => 'enabled',
            ),
            array(
                'label' => 'Disabled',
                'value' => 'disabled',
            ),
        ),
    );
    
} add_action( 'init', 'lcproext_header_option', 91 );

/**
 * Add JavaScript and CSS
 */
function lcheadroom_js_style() {

    $header_footer = dslc_hf_get_ID( get_the_ID() );

    if ( $header_footer[ 'header' ] && is_numeric( $header_footer[ 'header' ] ) ) {
		$hf_id = $header_footer[ 'header' ];
    }

    if ( ! empty( $hf_id ) ) {

        $dlsc_hf_header = get_post_meta( $hf_id, 'dslc_hf_header_hide', true );

        if ( $dlsc_hf_header === 'enabled' ) {
            wp_enqueue_style( 'lc-headroom', LC_HEADROOM_URL . 'css/main.css' );
            wp_enqueue_script( 'lc-headroom-js', LC_HEADROOM_URL . 'js/headroom.js', '', false, true );
            wp_enqueue_script( 'lc-headroom-main-js', LC_HEADROOM_URL . 'js/main.js', '', false, true );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'lcheadroom_js_style' );