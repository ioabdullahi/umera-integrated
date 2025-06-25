<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Main LC_RestrictContent Class.
 */
class LC_RestrictContent {

    /**
     * Prevent creating multiple instances
     */
    public function __construct() {

        $this->setup_constants();
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_load_scripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'load_styles' ) );

        add_filter( 'dslc_filter_row_options', array( $this, 'lcrc_section_add_options' ) );
        add_filter( 'dslc_module_options', array( $this, 'lcrc_module_add_options' ) );
        add_filter( 'dslc_module_options_before_output', array( $this, 'lcrc_module_options_before_output' ) );

        add_filter( 'dslc_module_before_filter', array( $this, 'lcrc_module_before' ), 10, 2 );
        add_filter( 'dslc_module_after_filter', array( $this, 'lcrc_module_after' ), 10, 2 );

        add_filter( 'dslc_section_before', array( $this, 'lcrc_section_before' ), 10, 2 );
        add_filter( 'dslc_section_after', array( $this, 'lcrc_section_after' ), 10, 2 );
    }

    /**
     * Setup plugin constants.
     */
    private function setup_constants() {

        // Plugin version.
        if ( ! defined( 'LC_RestrictContent_VERSION' ) ) {

            define( 'LC_RestrictContent_VERSION', '1.0' );
        }

        // Plugin Folder URL.
        if ( ! defined( 'LC_RestrictContent_PLUGIN_URL' ) ) {

            define( 'LC_RestrictContent_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
        }

        // Plugin Text Domain.
        if ( ! defined( 'LC_RestrictContent_TEXTDOMAIN' ) ) {

            define( 'LC_RestrictContent_TEXTDOMAIN', 'lc-restrict-content' );
        }
    }

    /**
     * Admin Load Scipts
     */
    public function admin_load_scripts() {

        $dir = LC_RestrictContent_PLUGIN_URL;

        wp_register_script( LC_RestrictContent_TEXTDOMAIN . '-active-js', $dir . 'lc-restrict-content-extender.js', array(), LC_RestrictContent_VERSION, 'true' );
        wp_enqueue_script( LC_RestrictContent_TEXTDOMAIN . '-active-js' );
    }

    /**
     * Load Styles
     */
    public function load_styles() {
        wp_enqueue_style(
            LC_RestrictContent_TEXTDOMAIN,
            LC_RestrictContent_PLUGIN_URL . 'main.css',
            false
        );
    }

    /**
     * Add options to section
     *
     * @param array $options Get Options.
     */
    public function lcrc_section_add_options( $options ) {

        $new_options = array(

            'restrict_section_before' => array(
                'label' => __( 'Restrict Section Before', 'lc-restrict-content' ),
                'id' => 'restrict_section_before',
                'std' => '',
                'type' => 'text',
            ),
            'restrict_section_after' => array(
                'label' => __( 'Restrict Section After', 'lc-restrict-content' ),
                'id' => 'restrict_section_after',
                'std' => '',
                'type' => 'text',
            ),
        );

        $options = $options + $new_options;

        return $options;
    }

    /**
     * Add options to module
     *
     * @param array $options Get Options.
     */
    public function lcrc_module_add_options( $options ) {

        $new_options = array(

            'restrict_module_before' => array(
                'label' => __( 'Restrict Module Before', 'lc-restrict-content' ),
                'id' => 'restrict_module_before',
                'std' => '',
                'type' => 'text',
                'section' => 'functionality',
            ),
            'restrict_module_after' => array(
                'label' => __( 'Restrict Module After', 'lc-restrict-content' ),
                'id' => 'restrict_module_after',
                'std' => '',
                'type' => 'text',
                'section' => 'functionality',
            ),
        );

        $options = $options + $new_options;

        return $options;
    }

    public function lcrc_module_options_before_output( $options ) {

        foreach( $options as $key => $value ) {
            if ( 'restrict_module_before' == $key ) {
                unset( $options['restrict_module_before'] );
            } elseif ( 'restrict_module_after' == $key ) {
                unset( $options['restrict_module_after'] );
            }
        }

        return $options;
    }

    /**
     * Print module before
     *
     * @param string $content Get Content.
     * @param array  $options Get Options Module.
     */
    public function lcrc_module_before( $content, $options ) {

        if ( ! isset( $options['restrict_module_before'] ) ) {
            return false;
        }

        if ( '' !== $options['restrict_module_before'] ) {
            $content = $options['restrict_module_before'];
        }

        return $content;
    }

    /**
     * Print module after
     *
     * @param string $content Get Content.
     * @param array  $options Get Options Module.
     */
    public function lcrc_module_after( $content, $options ) {

        if ( ! isset( $options['restrict_module_after'] ) ) {
            return false;
        }

        if ( '' !== $options['restrict_module_after'] ) {
            $content = $options['restrict_module_after'];
        }

        return $content;
    }

    /**
     * Print section before
     *
     * @param string $content Get Content.
     * @param array  $options Get Options Section.
     */
    public function lcrc_section_before( $content, $options ) {

        if ( ! isset( $options['restrict_section_before'] ) ) {
            return false;
        }

        if ( '' !== $options['restrict_section_before'] ) {
            $content = $options['restrict_section_before'];
        }

        return $content;
    }

    /**
     * Print section after
     *
     * @param string $content Get Content.
     * @param array  $options Get Options Section.
     */
    public function lcrc_section_after( $content, $options ) {

        if ( ! isset( $options['restrict_section_after'] ) ) {
            return false;
        }

        if ( '' !== $options['restrict_section_after'] ) {
            $content = $options['restrict_section_after'];
        }

        return $content;
    }
}

$lc_restricted_content = new LC_RestrictContent;
