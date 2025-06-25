<?php
/**
 * Module Gallery Grid
 *
 * @package Live Composer - ACF integration
 */

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	exit;
}

/**
 * Module Class
 */
class ACF_Gallery_Grid extends DSLC_Module {

	/**
	 * Unique module id
	 *
	 * @var string
	 */
	var $module_id;

	/**
	 * Module label to show in the page builder
	 *
	 * @var string
	 */
	var $module_title;

	/**
	 * Module icon name (FontAwesome)
	 *
	 * @var string
	 */
	var $module_icon;

	/**
	 * Section in the modules panel that includes this module
	 *
	 * @var string
	 */
	var $module_category;

	/**
	 * Exclude from main listing
	 *
	 * @var string
	 */
	var $exclude_from_main_listing;

	/**
	 * Construct
	 */
	function __construct() {

		$this->module_id = 'ACF_Gallery_Grid';
		$this->module_title = __( 'Gallery Grid', 'lc-acf-integration' );
		$this->module_icon = 'picture';
		$this->module_category = 'ACF - Content';
		$this->exclude_from_main_listing = true;
	}

	/**
	 * Module options.
	 * Function build array with all the module functionality and styling options.
	 * Based on this array Live Composer builds module settings panel.
	 * – Every array inside $dslc_options means one option = one control.
	 * – Every option should have unique (for this module) id.
	 * – Options divides on "Functionality" and "Styling".
	 * – Styling options start with css_XXXXXXX
	 * – Responsive options start with css_res_t_ (Tablet) or css_res_p_ (Phone)
	 * – Options can be hidden.
	 * – Options can have a default value.
	 * – Options can request refresh from server on change or do live refresh via CSS.
	 *
	 * @return array All the module options in array.
	 */
	function options() {

		if ( isset( $_POST['post_id'] ) ) {

			$post_id = $_POST['post_id'];
			$type = get_post_type( $post_id );

			if ( 'dslc_templates' === $type ) {

				if ( isset( $_POST['dslc_url_vars']['preview_id'] ) ) {
					$id = $_POST['dslc_url_vars']['preview_id'];
				} else {
					$id = '';
				}
			} else {
				$id = $post_id;
			}
		} else {
			$id = '';
		}

		$choices = array();
		$choices[] = array(
			'label' => __( 'Choose field', 'lc-acf-integration' ),
			'value' => 'not_set',
		);

		if ( ! empty( $id ) ) {

			$fields = lcacf_get_all_fields( $id, 'gallery' );

			if ( ! empty( $fields ) ) {

				foreach ( $fields as $field ) {

					$choices[] = array(
						'label' => $field['label'],
						'value' => $field['value'],
					);
				}
			}
		} else {

			$fields = lcacf_get_all_fields_by_group( 'gallery' );

			if ( ! empty( $fields ) ) {

				foreach ( $fields as $field ) {

					$choices[] = array(
						'label' => $field['label'],
						'value' => $field['value'],
					);
				}
			}
		}

		$dslc_options = array(

			array(
				'label' => __( 'Show On', 'lc-acf-integration' ),
				'id' => 'css_show_on',
				'std' => 'desktop tablet phone',
				'type' => 'checkbox',
				'choices' => array(
					array(
						'label' => __( 'Desktop', 'lc-acf-integration' ),
						'value' => 'desktop',
					),
					array(
						'label' => __( 'Tablet', 'lc-acf-integration' ),
						'value' => 'tablet',
					),
					array(
						'label' => __( 'Phone', 'lc-acf-integration' ),
						'value' => 'phone',
					),
				),
			),
			array(
				'label' => __( 'ACF Field to Display', 'lc-acf-integration' ),
				'id' => 'select_field',
				'std' => 'not_set',
				'type' => 'select',
				'choices' => $choices,
			),
			array(
				'label' => __( 'Columns', 'lcproext' ),
				'id' => 'columns',
				'std' => '4',
				'type' => 'select',
				'choices' => $this->shared_options('posts_per_row_choices'),
			),
			array(
				'label' => __( 'Type', 'lcproext' ),
				'id' => 'type',
				'std' => 'grid',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Grid', 'lcproext' ),
						'value' => 'grid',
					),
					array(
						'label' => __( 'Masonry', 'lcproext' ),
						'value' => 'masonry',
					),
				)
			),
			array(
				'label' => __( 'Lightbox', 'lcproext' ),
				'help' => __( 'Enabling will make clicking an image open up the image in a lightbox.', 'lcproext' ),
				'id' => 'lightbox_state',
				'std' => 'enabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Enabled', 'lcproext' ),
						'value' => 'enabled'
					),
					array(
						'label' => __( 'Disabled', 'lcproext' ),
						'value' => 'disabled'
					),
				)
			),
			array(
				'label' => __( 'Images Per Page', 'lcproext' ),
				'id' => 'amount',
				'std' => '4',
				'type' => 'text',
			),

			/**
			 * Image
			 */

			array(
				'label' => __( 'Center If One', 'lcproext' ),
				'id' => 'center_if_one',
				'std' => 'disabled',
				'type' => 'select',
				'choices' => array(
					array(
						'label' => __( 'Enabled', 'lcproext' ),
						'value' => 'enabled'
					),
					array(
						'label' => __( 'Disabled', 'lcproext' ),
						'value' => 'disabled'
					),
				),
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'BG Color', 'lcproext' ),
				'id' => 'css_thumb_bg_color',
				'std' => '',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'background-color',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Border Color', 'lcproext' ),
				'id' => 'css_thumb_border_color',
				'std' => '#e6e6e6',
				'type' => 'color',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'border-color',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Border Width', 'lcproext' ),
				'id' => 'css_thumb_border_width',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'border-width',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Borders', 'lcproext' ),
				'id' => 'css_thumb_border_trbl',
				'std' => 'top right bottom left',
				'type' => 'checkbox',
				'choices' => array(
					array(
						'label' => __( 'Top', 'lcproext' ),
						'value' => 'top'
					),
					array(
						'label' => __( 'Right', 'lcproext' ),
						'value' => 'right'
					),
					array(
						'label' => __( 'Bottom', 'lcproext' ),
						'value' => 'bottom'
					),
					array(
						'label' => __( 'Left', 'lcproext' ),
						'value' => 'left'
					),
				),
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'border-style',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Border Radius - Top', 'lcproext' ),
				'id' => 'css_thumb_border_radius_top',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image,.sklc-gallery-image img',
				'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
				'ext' => 'px'
			),
			array(
				'label' => __( 'Border Radius - Bottom', 'lcproext' ),
				'id' => 'css_thumb_border_radius_bottom',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image,.sklc-gallery-image img',
				'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
				'ext' => 'px'
			),
			array(
				'label' => __( 'Margin Bottom', 'lcproext' ),
				'id' => 'css_thumb_margin',
				'std' => '30',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'margin-bottom',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
				'ext' => 'px'
			),
			array(
				'label' => __( 'Padding Vertical', 'lcproext' ),
				'id' => 'css_thumb_padding_vertical',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'padding-top,padding-bottom',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Padding Horizontal', 'lcproext' ),
				'id' => 'css_thumb_padding_horizontal',
				'std' => '0',
				'type' => 'slider',
				'refresh_on_change' => false,
				'affect_on_change_el' => '.sklc-gallery-image',
				'affect_on_change_rule' => 'padding-left,padding-right',
				'section' => 'styling',
				'ext' => 'px',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Resize - Height', 'lcproext' ),
				'id' => 'thumb_resized_height',
				'std' => '',
				'type' => 'text',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
			),
			array(
				'label' => __( 'Resize - Width', 'lcproext' ),
				'id' => 'thumb_resized_width',
				'std' => '',
				'type' => 'text',
				'section' => 'styling',
				'tab' => __( 'General', 'lcproext' ),
			),

		);

		$dslc_options = array_merge( $dslc_options, $this->shared_options( 'animation_options', array(
			'hover_opts' => false,
		) ) );
		$dslc_options = array_merge( $dslc_options, $this->presets_options() );

		return apply_filters( 'dslc_module_options', $dslc_options, $this->module_id );
	}

	/**
	 * Module HTML output.
	 *
	 * @param  array $options Module options to fill the module template.
	 * @return void
	 */
	function output( $options ) {

		global $dslc_active;

		if ( $dslc_active && is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
			$dslc_is_admin = true;
		} else {
			$dslc_is_admin = false;
		}

		$this->module_start( $options );
		/* Module output starts here */
		?>

		<div class="lc-acf-gallery-grid">
			<div class="lc-acf-gallery-grid-main">
			<?php

			if ( isset( $_POST['dslc_url_vars'] ) ) {

				if ( isset( $_POST['dslc_url_vars']['preview_id'] ) ) {
					$preview_id = $_POST['dslc_url_vars']['preview_id'];
				} else {
					$preview_id = '';
				}
			} elseif ( isset( $_GET['preview_id'] ) ) {

				$preview_id = $_GET['preview_id'];
			} else {

				$preview_id = '';
			}

			$module_id = $this->module_id;
			$post_id = $options['post_id'];
			$field = $options['select_field'];
			$columns = $options['columns'];
			$type = $options['type'];
			$ligthbox = $options['lightbox_state'];
			$amount = $options['amount'];
			$center_if_one = $options['center_if_one'];
			$thumb_resized_width = $options['thumb_resized_width'];
			$thumb_resized_height = $options['thumb_resized_height'];

			$lcacf_array_real_data = array(
				'module_id' => $module_id,
				'post_id' => $post_id,
				'preview_id' => $preview_id,
				'field' => $field,
				'dslc_is_admin' => $dslc_is_admin,
				'columns' => $columns,
				'type' => $type,
				'lightbox_state' => $ligthbox,
				'amount' => $amount,
				'center_if_one' => $center_if_one,
				'thumb_resized_width' => $thumb_resized_width,
				'thumb_resized_height' => $thumb_resized_height
			);

			$lcacf_array_default_data = array(
				'module_id' => $module_id,
				'field' => $field,
				'dslc_is_admin' => $dslc_is_admin,
				'columns' => $columns,
				'type' => $type,
				'lightbox_state' => $ligthbox,
				'amount' => $amount,
				'center_if_one' => $center_if_one,
				'thumb_resized_width' => $thumb_resized_width,
				'thumb_resized_height' => $thumb_resized_height
			);

			if ( ! $dslc_active ) {

				if ( 'dslc_templates' !== get_post_type( get_the_ID() ) ) {
					lcacf_display_real_data( $lcacf_array_real_data );
				} else {
					if ( is_user_logged_in() && current_user_can( DS_LIVE_COMPOSER_CAPABILITY ) ) {
						lcacf_display_default_data( $lcacf_array_default_data );
					}
				}
			} elseif ( $dslc_active ) {

				if ( 'dslc_templates' !== get_post_type( $post_id ) ) {
					lcacf_display_real_data( $lcacf_array_real_data );
				} elseif ( ! empty( $preview_id ) ) {
					lcacf_display_real_data( $lcacf_array_real_data );
				} else {
					lcacf_display_default_data( $lcacf_array_default_data );
				}
			}

			?>
			</div><!-- .lc-acf-gallery-slider-main -->
		</div><!-- .lc-acf-gallery-slider -->

		<?php
		/* Module output ends here */
		$this->module_end( $options );
	}
}

/**
 * Register Module
 */
add_action( 'dslc_hook_register_modules', 'lcacf_init_gallery_grid' );

function lcacf_init_gallery_grid() {
    return dslc_register_module( 'ACF_Gallery_Grid' );
}
