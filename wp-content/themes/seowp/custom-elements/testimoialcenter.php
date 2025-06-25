<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Define our Pt Elementor Call Out settings.
 */
class seowp_testimonial_center extends Widget_Base {
	/**
	 * Define our get_name settings.
	 */
	public function get_name() {
		return 'testimonial_center';
	}
	/**
	 * Define our get_title settings.
	 */
	public function get_title() {
		return 'testimonial center';
	}
	/**
	 * Define our get_icon settings.
	 */
	public function get_icon() {
		return 'eicon-call-to-action';
	}
	/**
	 * Define our get_categories settings.
	 */
	public function get_categories() {
		return [ 'seowp-pro-elements' ];
	}
	/**
	 * Define our register_controls settings.
	 */

	/**
	 * Define our Content Display inline settings.
	 */
	public function add_inline_editing_attributes( $key, $toolbar = 'basic' ) {
		if ( ! Plugin::$instance->editor->is_edit_mode() ) {
			return;
		}
		$this->add_render_attribute( $key, [
			'class' => 'elementor-inline-editing',
			'data-elementor-setting-key' => $key,
		] );
		if ( 'basic' !== $toolbar ) {
			$this->add_render_attribute( $key, [
				'data-elementor-inline-editing-toolbar' => $toolbar,
			] );
		}
	}

	/**
	 * Define our Content Display settings.
	 */
	public function render() {
		$settings = $this->get_settings();

        echo do_shortcode('[testimoial_center show_filters="false"]');
 }
	
}
/*=============Call this every widget ====================*/
Plugin::instance()->widgets_manager->register_widget_type( new seowp_testimonial_center() );

