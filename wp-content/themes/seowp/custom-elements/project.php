<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Define our Pt Elementor Call Out settings.
 */
class project_101_class extends Widget_Base {
	/**
	 * Define our get_name settings.
	 */
	public function get_name() {
		return 'Ctea-project-101';
	}
	/**
	 * Define our get_title settings.
	 */
	public function get_title() {
		return 'Custom blog hcard';
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
	 public function register_controls(){
	     $this->start_controls_section(
        	'section_grid_query',
        	[
        		'label' => esc_html__( 'Slider Options', 'SEOWP' ),
        		'tab' => Controls_Manager::TAB_CONTENT,
        	]
        );

        $this->add_control(
			'_desktop_slide_new',
			[
				'label' => 'Desktop Slides',
				'type' => Controls_Manager::NUMBER,
				'default' => 3,
				'min' => 1,
			]
		);
		$this->add_control(
			'_tablet_slide_new',
			[
				'label' => 'Tablet Slides',
				'type' => Controls_Manager::NUMBER,
				'default' => 3,
				'min' => 1,
			]
		);
        $this->add_control(
			'_mobile_slide_new',
			[
				'label' => 'Mobile Slides',
				'type' => Controls_Manager::NUMBER,
				'default' => 3,
				'min' => 1,
			]
		);

	 }

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

        echo do_shortcode('[project_101 show_filters="false"]');
 }
	
}
/*=============Call this every widget ====================*/
Plugin::instance()->widgets_manager->register_widget_type( new project_101_class() );

