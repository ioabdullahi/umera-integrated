<?php
/**
 * Custom meta boxes initialization
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * In this file we define the meta boxes used. For now it's only
 * 'Custom footer' dropdown select for pages.
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
	exit;
} // Exit if accessed directly

/**
 * Register custom meta-boxes.
 *
 * @return void
 */
/* ✅ Add page design meta box on the 'add_meta_boxes' (header design option). */
add_action( 'add_meta_boxes', 'lbmn_register_custom_metaboxes' );
function lbmn_register_custom_metaboxes() {

	// Set array with all the footers listed
	// See /inc/functions-extras.php for lbmn_return_all_footers().
	$footer_posts = lbmn_return_all_footers();

	$prefix = 'lbmn_';
	$meta_boxes = array();

	// Page settings meta box.
	$meta_boxes[] = array(
		// Meta box id, UNIQUE per meta box. Optional since 4.1.5.
		'id'        => 'lbmn-page-settings',

		// Meta box title - Will appear at the drag and drop handle bar. Required.
		'title'     => esc_attr__( 'Page Design Settings', 'seowp' ),

		// Post types, accept custom post types as well - DEFAULT is array('post'). Optional.
		'post_type' => array( 'page' ),

		// Where the meta box appear: normal (default), advanced, side. Optional.
		'context'   => 'side',

		// Order of meta box: high (default), low. Optional.
		'priority'  => 'high',

		// Auto save: true, false (default). Optional.
		'autosave'  => true,

		// List of meta fields.
		'fields'   => array(
			// CHECKBOX LIST.
			array(
				'name'    => '',
				'id'      => "{$prefix}page_title_settings",
				'type'    => 'checkbox_list',
				'options' => array(
					'menuoverlay' => esc_attr__( 'Menu cover content', 'seowp' ),
				),
				'std'     => '',
			),
		),
	);

	// Loop through all meta-boxes in array to register each.
	foreach ( $meta_boxes as $meta_box ) {

		// Loop through all post types to register meta-box for each.
		foreach ( $meta_box['post_type'] as $meta_box_type ) {

			// Add meta box for the post type.
			add_meta_box(
				$meta_box['id'],        // String: id.
				$meta_box['title'],     // String: title.
				'lbmn_reder_metabox',   // String: callback.
				$meta_box['post_type'], // String: post_type.
				$meta_box['context'],   // String: context.
				$meta_box['priority'],  // String: priority.
				$meta_box['fields']     // Array: callback_args – pass the metabox fields.
			);
		}
	}

}

/**
 * Output metabox html on the post editing screen.
 *
 * @param  object $object   WP_Post Object – information about current page/post.
 * @param  array  $metabox  Meta-box fields passed as call back arguments.
 * @return void
 */
function lbmn_reder_metabox( $object, $metabox ) {

	$metabox_id = $metabox['id'];
	$metabox_fields = $metabox['args'];

	// Add an nonce field so we can check for it later.
	wp_nonce_field( 'lbmn_custom_metabox_save', 'lbmn_custom_metabox_nonce' );

	// Go through each filed to put in the meta-box.
	foreach ( $metabox_fields as $metabox_field ) {

		// Get current value from custom fields (if any).
		$curr_value_no_esc = get_post_meta( $object->ID, $metabox_field['id'], true );

		// If not value found set it to default/standard value.
		if ( ! isset( $curr_value_no_esc ) || '' === $curr_value_no_esc ) {
			$curr_value_no_esc = $metabox_field['std'];
		}

		$curr_value = esc_attr( $curr_value_no_esc );

		// Start fields output.
		if ( 'checkbox_list' === $metabox_field['type'] ) {
			// Output HTML for checkbox field.
			lbmn_render_metaboxfield_checkboxes( $metabox_field, $curr_value );
		}
	} // endforeach;
}

/**
 * Output HTML for checkbox field in meta-box.
 *
 * @param  array  $metabox_field  All the data with values for the field to output.
 * @param  string $curr_value     Current value for this field (if any).
 * @return void
 */
function lbmn_render_metaboxfield_checkboxes( $metabox_field, $curr_value ) {

	$curr_value_array = array();

	if ( '' !== $curr_value ) {
		$curr_value_array = explode( ' ', $curr_value );
	}

	?>

	<p><strong><?php echo esc_attr( $metabox_field['name'] ); ?></strong></p>

	<div class="lbmn-post-option-field-choice">

		<?php foreach ( $metabox_field['options'] as $value => $label ) : ?>

			<input type="checkbox"
			name="<?php echo esc_attr( $metabox_field['id'] ); ?>"
			id="<?php echo esc_attr( $metabox_field['id'] . $value ); ?>"
			value="<?php echo esc_attr( $value ); ?>"
			<?php if ( in_array( $value, $curr_value_array, true ) ) { echo 'checked="checked"'; } ?> />
			<label for="<?php echo esc_attr( $metabox_field['id'] . $value ); ?>">
				<?php echo esc_html( $label ); ?>
			</label>

		<?php endforeach; ?>

	</div><!-- .dslca-post-option-field-choice -->

	<?php
}

/**
 * Saves custom meta-boxes as custom field values.
 *
 * @param int  $post_id The post ID.
 * @param post $post    The post object.
 * @return  void
 */
function lbmn_save_custom_metaboxes( $post_id, $post ) {

	/**
	 * We need to verify this came from the our screen and with proper authorization,
	 * because save_post can be triggered at other times.
	 */

	// Checks save status.
	$is_autosave = wp_is_post_autosave( $post_id );
	$is_revision = wp_is_post_revision( $post_id );
	$is_valid_nonce = ( isset( $_POST['lbmn_custom_metabox_nonce'] ) && wp_verify_nonce( $_POST['lbmn_custom_metabox_nonce'], 'lbmn_custom_metabox_save' ) ) ? 'true' : 'false';

	// Exits script depending on save status.
	if ( $is_autosave || $is_revision || ! $is_valid_nonce ) {
		return;
	}

	// Check the user's permissions.
	if ( isset( $_POST['post_type'] ) && 'page' === $_POST['post_type'] ) {
		if ( ! current_user_can( 'edit_page', $post_id ) ) {
			return $post_id;
		}
	} else {
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $post_id;
		}
	}

	/* OK, it's safe for us to save the data now. */

	// Get footer id and sanitize it.
	if ( isset( $_POST['lbmn_custom_footer_id'] ) && '' !== $_POST['lbmn_custom_footer_id'] ) {
		$footer_id = sanitize_text_field( $_POST['lbmn_custom_footer_id'] );

		// Update the meta field.
		update_post_meta( $post_id, 'lbmn_custom_footer_id', $footer_id );
	} else {
		delete_post_meta( $post_id, 'lbmn_custom_footer_id' );
	}

	// Get title settings option value and sanitize it.
	if ( isset( $_POST['lbmn_page_title_settings'] ) ) {
		$title_settings = sanitize_text_field( $_POST['lbmn_page_title_settings'] );

		// Update the meta field.
		update_post_meta( $post_id, 'lbmn_page_title_settings', $title_settings );
	} else {
		delete_post_meta( $post_id, 'lbmn_page_title_settings' );
	}

}

/* Save post meta on the 'save_post' hook. */
add_action( 'save_post', 'lbmn_save_custom_metaboxes', 10, 2 );


