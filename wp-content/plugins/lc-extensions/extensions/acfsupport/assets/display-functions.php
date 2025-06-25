<?php
/**
 * All the core functions
 *
 * @package Live Composer - ACF integration
 */

/**
 * Display default data for templates.
 *
 * @param  array $array options.
 */
function lcacf_display_default_data( $array ) {

	switch ( $array['module_id'] ) {
		case 'ACF_Text':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				$content = '<h1>This Is An Example Of A Heading 1</h1>
				<h2>This Is An Example Of A Heading 2</h2>
				<h3>This Is An Example Of A Heading 3</h3>
				<h4>This Is An Example Of A Heading 4</h4>
				<h5>This Is An Example Of A Heading 5</h5>
				<h6>This Is An Example Of A Heading 6</h6>
				<p>This is a paragraph. <a href="#">Consectetur adipisicing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';
				echo $content;
			}

			break;
		case 'ACF_Textarea':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				$content = '<h1>This Is An Example Of A Heading 1</h1>
				<h2>This Is An Example Of A Heading 2</h2>
				<h3>This Is An Example Of A Heading 3</h3>
				<h4>This Is An Example Of A Heading 4</h4>
				<h5>This Is An Example Of A Heading 5</h5>
				<h6>This Is An Example Of A Heading 6</h6>
				<p>This is a paragraph. <a href="#">Consectetur adipisicing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				<ul>
				<li>Unordered List item</li>
				<li>Unordered List item</li>
				<li>Unordered List item</li>
				<li>Unordered List item</li>
				</ul>
				<ol>
				<li>Ordered List item</li>
				<li>Ordered List item</li>
				<li>Ordered List item</li>
				<li>Ordered List item</li>
				</ol>
				<blockquote>This is a blockquote. <a href="#">Consectetur adipisicing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</blockquote>
				<input size="40" type="text" />
				<input type="submit" value="get" />';
				echo $content;
			}

			break;
		case 'ACF_Wysiwyg':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				$content = '<h1>This Is An Example Of A Heading 1</h1>
				<h2>This Is An Example Of A Heading 2</h2>
				<h3>This Is An Example Of A Heading 3</h3>
				<h4>This Is An Example Of A Heading 4</h4>
				<h5>This Is An Example Of A Heading 5</h5>
				<h6>This Is An Example Of A Heading 6</h6>
				<p>This is a paragraph. <a href="#">Consectetur adipisicing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				<ul>
				<li>Unordered List item</li>
				<li>Unordered List item</li>
				<li>Unordered List item</li>
				<li>Unordered List item</li>
				</ul>
				<ol>
				<li>Ordered List item</li>
				<li>Ordered List item</li>
				<li>Ordered List item</li>
				<li>Ordered List item</li>
				</ol>
				<blockquote>This is a blockquote. <a href="#">Consectetur adipisicing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</blockquote>
				<input size="40" type="text" />
				<input type="submit" value="get" />';
				echo $content;
			}

			break;
		case 'ACF_Number':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				echo __( '10', 'lc-acf-integration' );
			}

			break;
		case 'ACF_Page_Link':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				if ( ! empty( $array['label'] ) ) {
					$label = $array['label'];
				} else {
					$label = 'Link';
				}

				if ( 'link' === $array['display'] ) {
					$output = '<a href="#">' . $label . '</a>';
					echo $output;
				} elseif ( 'button' === $array['display'] ) { ?>
					<div class="lcacf-button">
						<a href="#">
							<?php if ( 'enabled' == $array['button_state'] && 'left' == $array['icon_pos'] ) : ?>
								<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
							<?php endif; ?>
							<?php echo stripslashes( $label ); ?>
							<?php if ( 'enabled' == $array['button_state'] && 'right' == $array['icon_pos'] ) : ?>
								<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
							<?php endif; ?>
						</a>
					</div>
				<?php
				}
			}

			break;
		case 'ACF_Date_Picker':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				echo __( 'dd/mm/YYYY', 'lc-acf-integration' );
			}

			break;
		case 'ACF_Image':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<img src="<?php echo LC_ACFINTEGRATION_PLUGIN_URL; ?>assets/images/placeholder.png" />
			<?php
			}

			break;
		case 'ACF_Checkbox':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				if ( 'single_line' === $array['display'] ) {
					echo '<span class="label">Checkbox:</span> one, two, three.';
				} else {
					?>
					<span class="label">Checkbox:</span>
					<ul>
						<li>one</li>
						<li>two</li>
						<li>three</li>
					</ul>
				<?php
				}
			}

			break;
		case 'ACF_Select':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				if ( 'single_line' === $array['display'] ) {
					echo '<span class="label">Select:</span> one, two, three.';
				} else {
					?>
					<span class="label">Select:</span>
					<ul>
						<li>one</li>
						<li>two</li>
						<li>three</li>
					</ul>
				<?php
				}
			}

			break;
		case 'ACF_File':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<a href="#">
					<?php if ( isset( $array['button_icon_id'] ) && '' !== $array['button_icon_id'] ) : ?>
						<span class="dslc-icon dslc-icon-<?php echo esc_attr( $array['button_icon_id'] ); ?>"></span>
					<?php endif; ?>
					<?php if ( $array['dslc_is_admin'] ) : ?>
						<span class="dslca-editable-content" data-id="button_text" data-type="simple" <?php if ( $array['dslc_is_admin'] ) { echo 'contenteditable'; } ?>><?php echo esc_html( $array['button_text'] ); ?></span>
					<?php else : ?>
						<span><?php echo esc_html( $array['button_text'] ); ?></span>
					<?php endif; ?>
				</a>
			<?php
			}

			break;
		case 'ACF_Taxonomy':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<ul>
					<li><a href="#">one</a></li>
					<li><a href="#">two</a></li>
					<li><a href="#">three</a></li>
					<li><a href="#">four</a></li>
				</ul>
			<?php
			}

			break;
		case 'ACF_Link':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				if ( ! empty( $array['label'] ) ) {
					$label = $array['label'];
				} else {
					$label = 'Link';
				}

				if ( 'link' === $array['display'] ) {
					$output = '<a href="#">' . $label . '</a>';
					echo $output;
				} elseif ( 'button' === $array['display'] ) {
					?>
					<div class="lcacf-button">
						<a href="#">
							<?php if ( 'enabled' == $array['button_state'] && 'left' == $array['icon_pos'] ) : ?>
								<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
							<?php endif; ?>
							<?php echo stripslashes( $label ); ?>
							<?php if ( 'enabled' == $array['button_state'] && 'right' == $array['icon_pos'] ) : ?>
								<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
							<?php endif; ?>
						</a>
					</div>
				<?php
				}
			}

			break;
		case 'ACF_Email':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['label'] ) ) {
					$label = $array['label'];
				} else {
					$label = 'test@test.com';
				}

				echo '<a href="mailto:#">' . $label . '</a>';
			}

			break;
		case 'ACF_URL':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['label'] ) ) {
					$label = $array['label'];
				} else {
					$label = 'http://test.com';
				}

				if ( 'link' == $array['display'] ) {
					echo '<a href="#">' . $label . '</a>';
				} else {
					echo 'http://test.com';
				}
			}

			break;
		case 'ACF_oEmbed':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<img src="<?php echo LC_ACFINTEGRATION_PLUGIN_URL; ?>assets/images/big-placeholder.png" />
			<?php
			}

			break;
		case 'ACF_Gallery':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<div class="dslc-slider"  data-animation="<?php echo $array['animation']; ?>" data-animation-speed="<?php echo $array['animation_speed']; ?>" data-autoplay="<?php echo $array['autoplay']; ?>" data-flexible-height="<?php echo $array['flexible_height']; ?>">
					<?php
					for ( $i = 0; $i < 15; $i++ ) {
						?>
						<div class="dslc-slider-item"><img src="<?php echo LC_ACFINTEGRATION_PLUGIN_URL; ?>assets/images/big-placeholder.png" /></div>
						<?php
					}
					?>
				</div><!-- .dslc-slider -->
			<?php
			}

			break;
		case 'ACF_Gallery_Grid':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<?php

				$gallery_images = array( 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 );

				/**
				 * Columns
				 */

				$columns_class = 'dslc-col dslc-' . $array['columns'] . '-col';
				$count = 0;
				$real_count = 0;
				$increment = $array['columns'];
				$max_count = 12;

				/**
				 * Type
				 */

				$container_class = 'sklc-gallery-images sklc-gallery-images-count-' . count( $gallery_images ) . ' sklc-gallery-images-center-' . $array['center_if_one'] . ' dslc-clearfix';

				if ( $array['type'] == 'masonry' && count( $gallery_images ) > 1 ) {
					$container_class .= ' dslc-init-masonry';
					$columns_class .= ' dslc-masonry-item ';
				} elseif ( $array['type'] == 'grid' ) {
					$container_class .= ' dslc-init-grid';
				}

				?>

				<div class="<?php echo $container_class; ?>">

					<?php

						if ( is_array( $gallery_images ) ) {

							/**
							 * Go through each image
							 */

							foreach ( $gallery_images as $gallery_image ) {

								/**
								 * Increment Count and Class
								 */

								$real_count++;

								if ( $real_count > $array['amount'] ) {
									break;
								}

								$count += $increment;

								if ( $count == $max_count ) {
									$count = 0;
									$columns_class_extra = ' dslc-last-col';
								} elseif ( $count == $increment ) {
									$columns_class_extra = ' dslc-first-col';
								} else {
									$columns_class_extra = '';
								}

								$img_class = '';
								$style_attr = '';

								/**
								 * Resize image
								 */

								$manual_resize = false;
								if ( isset( $array['thumb_resized_height'] ) && ! empty( $array['thumb_resized_height'] ) || isset( $array['thumb_resized_width'] ) && ! empty( $array['thumb_resized_width'] ) ) {

									// Enable manual resize
									$manual_resize = true;

									// Define the width/height vars
									$manual_resize_width = false;
									$manual_resize_height = false;

									// If width supplied
									if ( isset( $array['thumb_resized_width'] ) && ! empty( $array['thumb_resized_width'] ) ) {
										$manual_resize_width = $array['thumb_resized_width'];
									}

									// If height supplied
									if ( isset( $array['thumb_resized_height'] ) && ! empty( $array['thumb_resized_height'] ) ) {
										$manual_resize_height = $array['thumb_resized_height'];
									}

								}

								$gallery_image_src = DS_LIVE_COMPOSER_URL . '/images/placeholders/big-placeholder.png';

								$thumb_alt = '';

								if ( $manual_resize ) {

									if ( $manual_resize_width ) {
										$style_attr .= 'width:' . $manual_resize_width . 'px;';
									}

									if ( $manual_resize_height ) {
										$style_attr .= 'height:' . $manual_resize_height . 'px;';
									}

								}

								?><div class="sklc-gallery-image <?php echo $columns_class . $columns_class_extra; ?>"><img style="<?php echo $style_attr; ?>" class="<?php echo $img_class; ?>" src="<?php echo $gallery_image_src; ?>" alt="<?php echo $thumb_alt; ?>" /></div><?php

							}

						}

					?>

				</div><!-- .sklc-gallery-images -->
			<?php
			}

			break;
		case 'ACF_Radio_Button':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				echo '<span class="label">Label:</span> Value';
			}

			break;
		case 'ACF_Date_Time_Picker':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				echo __( 'dd/mm/YYYY 00:00 am', 'lc-acf-integration' );
			}

			break;
		case 'ACF_Time_Picker':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				echo __( '00:00 am', 'lc-acf-integration' );
			}

			break;
		case 'ACF_Button_Group':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				echo '<span class="label">Label:</span> Value';
			}

			break;
		case 'ACF_Post_Object':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<ul>
					<li><a href="#">one</a></li>
					<li><a href="#">two</a></li>
					<li><a href="#">three</a></li>
					<li><a href="#">four</a></li>
				</ul>
			<?php
			}

			break;
		case 'ACF_Relationship':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<ul>
					<li><a href="#">one</a></li>
					<li><a href="#">two</a></li>
					<li><a href="#">three</a></li>
					<li><a href="#">four</a></li>
				</ul>
			<?php
			}

			break;
		case 'ACF_User':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				?>
				<ul>
					<li><a href="#">Author One</a></li>
					<li><a href="#">Author Two</a></li>
					<li><a href="#">Author Three</a></li>
				</ul>
			<?php
			}

			break;
		case 'ACF_Google_Map':

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				$google_api = $array['google_api'];

				if ( ! empty( $google_api ) ) {
				?>
					<img src="<?php echo LC_ACFINTEGRATION_PLUGIN_URL; ?>assets/images/google-map.png" />
				<?php
				} else {
					echo lcacf_display_notice( 'google-map-api' );
				}
			}
			break;
		default:
			break;
	}
}

/**
 * Display real data for templates.
 *
 * @param  array $array options.
 */
function lcacf_display_real_data( $array ) {

	switch ( $array['module_id'] ) {
		case 'ACF_Text':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_text = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_text = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_text = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {
				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_text['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					if ( ! empty( $arr_text['prepend'] ) && ! empty( $arr_text['append'] ) ) {
						echo '<span class="prepend">' . $arr_text['prepend'] . '</span> ' . $arr_text['value'] . ' <span class="append">' . $arr_text['append'] . '</span> ';
					} elseif ( ! empty( $arr_text['prepend'] ) ) {
						echo '<span class="prepend">' . $arr_text['prepend'] . '</span> ' . $arr_text['value'];
					} elseif ( ! empty( $arr_text['append'] ) ) {
						echo $arr_text['value'] . ' <span class="append">' . $arr_text['append'] . '</span> ';
					} else {
						echo $arr_text['value'];
					}
				} else {
					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Textarea':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_textarea = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_textarea = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_textarea = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_textarea['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					echo $arr_textarea['value'];
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Wysiwyg':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_wysiwyg = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_wysiwyg = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_wysiwyg = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_wysiwyg['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					echo $arr_wysiwyg['value'];
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Number':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_number = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_number = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_number = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_number['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( ! empty( $arr_number['prepend'] ) && ! empty( $arr_number['append'] ) ) {
						echo '<span class="prepend">' . $arr_number['prepend'] . '</span> ' . $arr_number['value'] . ' <span class="append">' . $arr_number['append'] . '</span> ';
					} elseif ( ! empty( $arr_number['prepend'] ) ) {
						echo '<span class="prepend">' . $arr_number['prepend'] . '</span> ' . $arr_number['value'];
					} elseif ( ! empty( $arr_number['append'] ) ) {
						echo $arr_number['value'] . ' <span class="append">' . $arr_number['append'] . '</span> ';
					} else {
						echo $arr_number['value'];
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Page_Link':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_page_link = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_page_link = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_page_link = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_page_link['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( ! empty( $array['label'] ) ) {
						$label = $array['label'];
					} else {
						$label = $arr_page_link['value'];
					}

					if ( 'link' === $array['display'] ) {
						$output = '<a href="' . $arr_page_link['value'] . '">' . $label . '</a>';
						echo $output;
					} elseif ( 'button' === $array['display'] ) {
						?>
						<div class="lcacf-button">
							<a href="<?php echo $arr_page_link['value']; ?>">
								<?php if ( 'enabled' == $array['button_state'] && 'left' == $array['icon_pos'] ) : ?>
									<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
								<?php endif; ?>
								<?php echo stripslashes( $label ); ?>
								<?php if ( 'enabled' == $array['button_state'] && 'right' == $array['icon_pos'] ) : ?>
									<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
								<?php endif; ?>
							</a>
						</div>
					<?php
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Date_Picker':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_date_picker = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_date_picker = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_date_picker = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_date_picker['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					echo $arr_date_picker['value'];
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Image':

			$anchor_class = '';
			$anchor_target = '_self';
			$anchor_href = '#';

			if ( 'url_new' === $array['link_type'] ) {
				$anchor_target = '_blank';
			}

			if ( '' !== $array['link_url'] ) {
				$anchor_href = do_shortcode( $array['link_url'] );
			}

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_image = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_image = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_image = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_image['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					if ( is_array( $arr_image['value'] ) ) {

						$image_size = $arr_image['preview_size'];

						if ( 'full' === $image_size ) {
							$image_url = $arr_image['value']['url'];
						} else {
							$image_url = $arr_image['value']['sizes'][ $image_size ];
						}

						?>

						<?php if ( 'none' !== $array['link_type'] ) : ?>
							<a class="<?php echo esc_attr( $anchor_class ); ?>" href="<?php echo esc_url( $anchor_href ); ?>" target="<?php echo esc_attr( $anchor_target ); ?>">
						<?php endif; ?>
							<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $arr_image['value']['alt'] ); ?>" title="<?php echo esc_attr( $arr_image['value']['title'] ); ?>" />
						<?php if ( 'none' !== $array['link_type'] ) : ?>
							</a>
						<?php endif;

					} else {

						$acf_version = get_option( 'acf_version' );

						if ( version_compare( $acf_version, '5.0.0', '>=' ) ) {
							if ( is_string( $arr_image['value'] ) ) {
								$image_url = $arr_image['value'];
							} else {
								$image_url = wp_get_attachment_url( $arr_image['value'] );
							}
						} else {
							if ( 'url' === $arr_image['save_format'] ) {
								$image_url = $arr_image['value'];
							} else {
								$image_url = wp_get_attachment_url( intval( $arr_image['value'] ) );
							}
						}

						?>

						<?php if ( 'none' !== $array['link_type'] ) : ?>
							<a class="<?php echo esc_attr( $anchor_class ); ?>" href="<?php echo esc_url( $anchor_href ); ?>" target="<?php echo esc_attr( $anchor_target ); ?>">
						<?php endif; ?>
							<img src="<?php echo esc_url( $image_url ); ?>" />
						<?php if ( 'none' !== $array['link_type'] ) : ?>
							</a>
						<?php endif; ?>
				<?php }
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Checkbox':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_checkbox = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_checkbox = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_checkbox = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_checkbox['value'] ) && 'single_line' === $array['display'] && lcacf_exits_field( $current_id, $current_field ) ) {

					$arr_value = $arr_checkbox['value'];
					$last_key = array_search( end( $arr_value ), $arr_value );
					$label_checkbox = $arr_checkbox['label'];
					$acf_version = get_option( 'acf_version' );

					echo '<span class="label">' . $label_checkbox . ':</span> ';

					foreach ( $arr_value as $key => $value ) {

						if ( version_compare( $acf_version, '5.0.0', '>=' ) && 'array' == $arr_checkbox['return_format'] ) {

							if ( is_array( $value ) ) {
								if ( $key === $last_key ) {
									$checkbox = $value['label'] . '.';
								} else {
									$checkbox = $value['label'] . ', ';
								}
							} else {
								if ( $key === $last_key ) {
									$checkbox = $value . '.';
								} else {
									$checkbox = $value . ', ';
								}
							}
						} else {
							if ( $key === $last_key ) {
								$checkbox = $value . '.';
							} else {
								$checkbox = $value . ', ';
							}
						}

						echo $checkbox;
					}
				} elseif ( ! empty( $arr_checkbox['value'] ) && 'list' === $array['display'] && lcacf_exits_field( $current_id, $current_field ) ) {

					$arr_value = $arr_checkbox['value'];
					$label_checkbox = $arr_checkbox['label'];
					$acf_version = get_option( 'acf_version' );

					echo '<span class="label">' . $label_checkbox . ':</span> ';
					echo '<ul>';

					foreach ( $arr_value as $value ) {
						if ( version_compare( $acf_version, '5.0.0', '>=' ) && 'array' == $arr_checkbox['return_format'] ) {
							echo '<li>' . $value['label'] . '</li>';
						} else {
							echo '<li>' . $value . '</li>';
						}
					}
					echo '</ul>';
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Select':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_select = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_select = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_select = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_select['value'] ) && 'single_line' === $array['display'] && lcacf_exits_field( $current_id, $current_field ) ) {
					$arr_value = $arr_select['value'];
					$label_select = $arr_select['label'];

					echo '<span class="label">' . $label_select . ':</span> ';

					if ( 0 === $arr_select['multiple'] && is_string( $arr_select['value'] ) ) {
						echo $arr_select['value'] . '.';
					} else {

						if ( is_string( $arr_select['value'] ) ) {
							echo $arr_select['value'] . '.';
						} else {
							$last_key = array_search( end( $arr_value ), $arr_value );
							$acf_version = get_option( 'acf_version' );

							foreach ( $arr_value as $key => $value ) {

								if ( version_compare( $acf_version, '5.0.0', '>=' ) && 'array' == $arr_select['return_format'] ) {

									if ( is_array( $value ) ) {
										if ( $key === $last_key ) {
											$select = $value['label'] . '.';
										} else {
											$select = $value['label'] . ', ';
										}
									} else {
										if ( $key === $last_key ) {
											$select = $value . '.';
										} else {
											$select = $value . ', ';
										}
									}
								} else {
									if ( $key === $last_key ) {
										$select = $value . '.';
									} else {
										$select = $value . ', ';
									}
								}

								echo $select;
							}
						}
					}
				} elseif ( ! empty( $arr_select['value'] ) && 'list' === $array['display'] && lcacf_exits_field( $current_id, $current_field ) ) {
					$arr_value = $arr_select['value'];
					$label_select = $arr_select['label'];

					echo '<span class="label">' . $label_select . ':</span> ';
					echo '<ul>';
					if ( is_string( $arr_select['value'] ) ) {
						echo '<li>' . $arr_select['value'] . '</li>';
					} else {
						$acf_version = get_option( 'acf_version' );

						foreach ( $arr_value as $value ) {

							if ( version_compare( $acf_version, '5.0.0', '>=' ) && 'array' == $arr_select['return_format'] && 1 == $arr_select['multiple'] ) {
								echo '<li>' . $value['label'] . '</li>';
							} else {
								echo '<li>' . $value . '</li>';
							}
						}
					}
					echo '</ul>';
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_File':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_file = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_file = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_file = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_file['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( 'object' === $arr_file['save_format'] ) {
						$url = $arr_file['value']['url'];
					} elseif ( 'url' === $arr_file['save_format'] ) {
						$url = $arr_file['value'];
					} else {
						$url = wp_get_attachment_url( $arr_file['value'] );
					}

					?>
						<a target="_blank" href="<?php echo $url; ?>">
							<?php if ( isset( $array['button_icon_id'] ) && '' !== $array['button_icon_id'] ) : ?>
								<span class="dslc-icon dslc-icon-<?php echo esc_attr( $array['button_icon_id'] ); ?>"></span>
							<?php endif; ?>
							<?php if ( $array['dslc_is_admin'] ) : ?>
								<span class="dslca-editable-content" data-id="button_text" data-type="simple" <?php if ( $array['dslc_is_admin'] ) { echo 'contenteditable'; } ?>><?php echo esc_html( $array['button_text'] ); ?></span>
							<?php else : ?>
								<span><?php echo esc_html( $array['button_text'] ); ?></span>
							<?php endif; ?>
						</a>
					<?php
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Taxonomy':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_taxonomy = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_taxonomy = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_taxonomy = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_taxonomy['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					$field_type = $arr_taxonomy['field_type'];

					if ( 'object' === $arr_taxonomy['return_format'] ) {

						echo '<ul>';
						if ( 'radio' === $field_type || 'select' === $field_type ) {
							echo '<li><a href="' . get_term_link( $arr_taxonomy['value']->term_id ) . '">' . $arr_taxonomy['value']->name . '</a></li>';
						} else {
							foreach ( $arr_taxonomy['value'] as $taxonomy ) {
								echo '<li><a href="' . get_term_link( $taxonomy->term_taxonomy_id ) . '">' . $taxonomy->name . '</a></li>';
							}
						}
						echo '</ul>';
					} elseif ( 'id' === $arr_taxonomy['return_format'] ) {

						echo '<ul>';
						if ( 'radio' === $field_type || 'select' === $field_type ) {
							$term = get_term( $arr_taxonomy['value'] );
							echo '<li><a href="' . get_term_link( $arr_taxonomy['value'] ) . '">' . $term->name . '</a></li>';
						} else {
							foreach ( $arr_taxonomy['value'] as $id ) {
								$term = get_term( $id );
								echo '<li><a href="' . get_term_link( $id ) . '">' . $term->name . '</a></li>';
							}
						}
						echo '</ul>';
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Link':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_link = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_link = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_link = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_link['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( ! empty( $array['label'] ) ) {
						$label = $array['label'];
					} else {
						$label = $arr_link['value'];
					}

					if ( 'link' === $array['display'] ) {

						if ( is_array( $arr_link['value'] ) ) {

							if ( ! empty( $array['label'] ) ) {
								$label = $array['label'];
							} else {
								$label = $arr_link['value']['title'];
							}

							$output = '<a href="' . $arr_link['value']['url'] . '" target="' . $arr_link['value']['target'] . '" >' . $label . '</a>';
						} else {
							$output = '<a href="' . $arr_link['value'] . '">' . $label . '</a>';
						}

						echo $output;
					} elseif ( 'button' === $array['display'] ) {
						?>
						<div class="lcacf-button">
							<?php if ( is_array( $arr_link['value'] ) ) : ?>
								<a href="<?php echo $arr_link['value']['url']; ?>">
									<?php
									if ( ! empty( $array['label'] ) ) {
										$label = $array['label'];
									} else {
										$label = $arr_link['value']['title'];
									}
									?>
									<?php if ( 'enabled' == $array['button_state'] && 'left' == $array['icon_pos'] ) : ?>
										<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
									<?php endif; ?>
									<?php echo stripslashes( $label ); ?>
									<?php if ( 'enabled' == $array['button_state'] && 'right' == $array['icon_pos'] ) : ?>
										<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
									<?php endif; ?>
								</a>
							<?php else : ?>
								<a href="<?php echo $arr_link['value']; ?>">
									<?php if ( 'enabled' == $array['button_state'] && 'left' == $array['icon_pos'] ) : ?>
										<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
									<?php endif; ?>
									<?php echo stripslashes( $label ); ?>
									<?php if ( 'enabled' == $array['button_state'] && 'right' == $array['icon_pos'] ) : ?>
										<span class="dslc-icon dslc-icon-<?php echo $array['button_icon_id']; ?>"></span>
									<?php endif; ?>
								</a>
							<?php endif; ?>
						</div>
					<?php
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Email':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_email = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_email = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_email = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_email['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( ! empty( $array['label'] ) ) {
						$label = $array['label'];
					} else {
						$label = $arr_email['value'];
					}

					if ( ! empty( $arr_email['prepend'] ) && ! empty( $arr_email['append'] ) ) {
						echo '<span class="prepend">' . $arr_email['prepend'] . '</span> <a href="mailto:' . $arr_email['value'] . '">' . $label . '</a> <span class="append">' . $arr_email['append'] . '</span> ';
					} elseif ( ! empty( $arr_email['prepend'] ) ) {
						echo '<span class="prepend">' . $arr_email['prepend'] . '</span> <a href="mailto:' . $arr_email['value'] . '">' . $label . '</a>';
					} elseif ( ! empty( $arr_email['append'] ) ) {
						echo '<a href="mailto:' . $arr_email['value'] . '">' . $label . '</a> <span class="append">' . $arr_email['append'] . '</span> ';
					} else {
						echo '<a href="mailto:' . $arr_email['value'] . '">' . $label . '</a>';
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_URL':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_url = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_url = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_url = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_url['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( ! empty( $array['label'] ) ) {
						$label = $array['label'];
					} else {
						$label = $arr_url['value'];
					}

					if ( 'link' == $array['display'] ) {
						echo '<a href="' . $arr_url['value'] . '">' . $label . '</a>';
					} else {
						echo $arr_url['value'];
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_oEmbed':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_oembed = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_oembed = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_oembed = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_oembed['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					echo $arr_oembed['value'];
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Google_Map':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_google_map = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_google_map = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_google_map = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				// Check if Error-Proof mode activated in module options
				$error_proof_mode = false;
				if ( isset( $array['error_proof_mode'] ) && $array['error_proof_mode'] != '' ) {
					$error_proof_mode = true;
				}

				// Check if module rendered via ajax call
				$ajax_module_render = true;
				if ( isset( $array['module_render_nonajax'] ) ) {
					$ajax_module_render = false;
				}

				// Decide if we should render the module or wait for the page refresh
				$render_code = true;
				if ( $array['dslc_is_admin'] && $error_proof_mode && $ajax_module_render ) {
					$render_code = false;
				}

				if ( ! empty( $arr_google_map['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					$google_api = $array['google_api'];

					if ( ! empty( $google_api ) ) {
						if ( $render_code ) {

						?>
							<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo $google_api; ?>"></script>
							<script src="<?php echo LC_ACFINTEGRATION_PLUGIN_URL . 'modules/jquery/google-map/google-map.js' ?>"></script>
							<div class="acf-map" style="width: 100%; height: <?php echo $arr_google_map['height']; ?>px;">
								<div class="marker"
									data-lat="<?php echo $arr_google_map['value']['lat']; ?>"
									data-lng="<?php echo $arr_google_map['value']['lng']; ?>"
									data-zoom="<?php echo $arr_google_map['zoom']; ?>">
								</div>
							</div>
						<?php
						} else {
							echo lcacf_display_notice( 'google-map-refresh' );
						}
					} else {
						echo lcacf_display_notice( 'google-map-api' );
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Gallery':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_gallery = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_gallery = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_gallery = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_gallery['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					?>

						<div class="dslc-slider"  data-animation="<?php echo $array['animation']; ?>" data-animation-speed="<?php echo $array['animation_speed']; ?>" data-autoplay="<?php echo $array['autoplay']; ?>" data-flexible-height="<?php echo $array['flexible_height']; ?>">

							<?php

							$gallery_images = $arr_gallery['value'];
							$size = 'full';

							if ( $gallery_images ) {

								foreach ( $gallery_images as $gallery_image ) {

									$gallery_image_src = wp_get_attachment_image_src( $gallery_image['ID'], $size );
									$gallery_image_src = $gallery_image_src[0];

									$gallery_image_alt = $gallery_image['alt'];
									if ( ! $gallery_image_alt ) {
										$gallery_image_alt = '';
									}

									$gallery_image_title = $gallery_image['title'];
									if ( ! $gallery_image_title ) {
										$gallery_image_title = '';
									}

									?>
									<div class="dslc-slider-item"><img src="<?php echo $gallery_image_src; ?>" alt="<?php echo $gallery_image_alt; ?>" title="<?php echo $gallery_image_title; ?>" /></div>
									<?php
								}
							}

							?>

						</div><!-- .dslc-slider -->

					<?php

				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Gallery_Grid':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$arr_gallery = get_field_object( $array['field'], $array['preview_id'] );
			} else {
				$arr_gallery = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_gallery['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					?>

					<?php

					$gallery_images = $arr_gallery['value'];

					/**
					 * Columns
					 */

					$columns_class = 'dslc-col dslc-' . $array['columns'] . '-col';
					$count = 0;
					$real_count = 0;
					$increment = $array['columns'];
					$max_count = 12;

					/**
					 * Type
					 */

					$container_class = 'sklc-gallery-images sklc-gallery-images-count-' . count( $gallery_images ) . ' sklc-gallery-images-center-' . $array['center_if_one'] . ' dslc-clearfix';

					if ( $array['type'] == 'masonry' && count( $gallery_images ) > 1 ) {
						$container_class .= ' dslc-init-masonry';
						$columns_class .= ' dslc-masonry-item ';
					} elseif ( $array['type'] == 'grid' ) {
						$container_class .= ' dslc-init-grid';
					}

					/**
					 * Lightbox
					 */

					$img_class = '';
					if ( $array['lightbox_state'] == 'enabled' ) {
						$img_class = 'dslc-trigger-lightbox-gallery';
					}

					?>

					<div class="<?php echo $container_class; ?>">

						<?php

							if ( is_array( $gallery_images ) ) {

								/**
								 * Go through each image
								 */

								foreach ( $gallery_images as $gallery_image ) {

									/**
									 * Increment Count and Class
									 */

									$real_count++;

									if ( $real_count > $array['amount'] ) {
										break;
									}

									$count += $increment;

									if ( $count == $max_count ) {
										$count = 0;
										$columns_class_extra = ' dslc-last-col';
									} elseif ( $count == $increment ) {
										$columns_class_extra = ' dslc-first-col';
									} else {
										$columns_class_extra = '';
									}

									$style_attr = '';

									/**
									 * Resize image
									 */

									$manual_resize = false;
									if ( isset( $array['thumb_resized_height'] ) && ! empty( $array['thumb_resized_height'] ) || isset( $array['thumb_resized_width'] ) && ! empty( $array['thumb_resized_width'] ) ) {

										// Enable manual resize
										$manual_resize = true;

										// Define the width/height vars
										$manual_resize_width = false;
										$manual_resize_height = false;

										// If width supplied
										if ( isset( $array['thumb_resized_width'] ) && ! empty( $array['thumb_resized_width'] ) ) {
											$manual_resize_width = $array['thumb_resized_width'];
										}

										// If height supplied
										if ( isset( $array['thumb_resized_height'] ) && ! empty( $array['thumb_resized_height'] ) ) {
											$manual_resize_height = $array['thumb_resized_height'];
										}

									}

									$gallery_image_src = wp_get_attachment_image_src( $gallery_image['ID'], 'full' );
									$gallery_image_src = $gallery_image_src[0];

									// Get the ALT
									$thumb_alt = get_post_meta( $gallery_image['ID'], '_wp_attachment_image_alt', true );
									if ( ! $thumb_alt ) $thumb_alt = '';

									// If manual resize
									if ( $manual_resize ) {
										// Get resized version
										$gallery_image_src = dslc_aq_resize( $gallery_image_src, $manual_resize_width, $manual_resize_height, true );
									}

									?><div class="sklc-gallery-image <?php echo $columns_class . $columns_class_extra; ?>"><img style="<?php echo $style_attr; ?>" class="<?php echo $img_class; ?>" src="<?php echo $gallery_image_src; ?>" alt="<?php echo $thumb_alt; ?>" /></div><?php

								}

							}

						?>

						<?php if ( $array['lightbox_state'] == 'enabled' ) : ?>

							<div class="dslc-lightbox-gallery">

								<?php if ( ! empty( $gallery_images ) ) : ?>

									<?php foreach ( $gallery_images as $gallery_image ) : ?>

										<?php

											$gallery_image_src = wp_get_attachment_image_src( $gallery_image['ID'], 'full' );
											$gallery_image_src = $gallery_image_src[0];

											$gallery_image_title = $gallery_image['alt'];
											if ( ! $gallery_image_title ) $gallery_image_title = '';

											$gallery_image_caption = $gallery_image['caption'];
											if ( ! $gallery_image_caption ) $gallery_image_caption = '';
										?>

										<a href="<?php echo $gallery_image_src; ?>" title="<?php echo esc_attr( $gallery_image_title ); ?>" data-caption="<?php echo esc_attr( $gallery_image_caption ); ?>"></a>

									<?php endforeach; ?>

								<?php endif; ?>

							</div><!-- .dslc-gallery-lightbox -->

						<?php endif; ?>

					</div><!-- .sklc-gallery-images -->

					<?php

				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Radio_Button':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_radio_button = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_radio_button = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_radio_button = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_radio_button['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					$acf_version = get_option( 'acf_version' );

					if ( version_compare( $acf_version, '5.0.0', '>=' ) ) {
						if ( 'value' == $arr_radio_button['return_format'] ) {
							echo $arr_radio_button['value'];
						} elseif ( 'label' == $arr_radio_button['return_format'] ) {
							echo '<span class="label">' . $arr_radio_button['value'] . '</span>';
						} else {
							echo '<span class="label">' . $arr_radio_button['value']['label'] . ': </span>' . $arr_radio_button['value']['value'];
						}
					} else {
						echo $arr_radio_button['value'];
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Date_Time_Picker':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_date_time_picker = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_date_time_picker = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_date_time_picker = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_date_time_picker['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					echo $arr_date_time_picker['value'];
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Time_Picker':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_time_picker = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_time_picker = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_time_picker = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_time_picker['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					echo $arr_time_picker['value'];
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Button_Group':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_button_group = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_button_group = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_button_group = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_button_group['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					if ( 'value' == $arr_button_group['return_format'] ) {
						echo $arr_button_group['value'];
					} elseif ( 'label' == $arr_button_group['return_format'] ) {
						echo '<span class="label">' . $arr_button_group['value'] . '</span>';
					} else {
						echo '<span class="label">' . $arr_button_group['value']['label'] . ': </span>' . $arr_button_group['value']['value'];
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Post_Object':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_post_object = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_post_object = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_post_object = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_post_object['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					$field_type = $array['field'];

					if ( 'object' === $arr_post_object['return_format'] ) {

						echo '<ul>';
						if ( 0 == $arr_post_object['multiple'] ) {

							$post = $arr_post_object['value'];

							echo '<li><a href="' . get_permalink( $post->ID ) . '">' . $post->post_title . '</a></li>';
						} else {

							foreach ( $arr_post_object['value'] as $post ) {
								echo '<li><a href="' . get_permalink( $post->ID ) . '">' . $post->post_title . '</a></li>';
							}
						}
						echo '</ul>';
					} elseif ( 'id' === $arr_post_object['return_format'] ) {

						echo '<ul>';
						if ( 0 == $arr_post_object['multiple'] ) {

							$id = $arr_post_object['value'];

							echo '<li><a href="' . get_permalink( $id ) . '">' . get_the_title( $id ) . '</a></li>';
						} else {

							foreach ( $arr_post_object['value'] as $id ) {
								echo '<li><a href="' . get_permalink( $id ) . '">' . get_the_title( $id ) . '</a></li>';
							}
						}
						echo '</ul>';
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_Relationship':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_relationship = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_relationship = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_relationship = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_relationship['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {
					$field_type = $array['field'];

					if ( 'object' === $arr_relationship['return_format'] ) {

						echo '<ul>';
						foreach ( $arr_relationship['value'] as $post ) {
							echo '<li><a href="' . get_permalink( $post->ID ) . '">' . $post->post_title . '</a></li>';
						}
						echo '</ul>';
					} elseif ( 'id' === $arr_relationship['return_format'] ) {

						echo '<ul>';
						foreach ( $arr_relationship['value'] as $id ) {
							echo '<li><a href="' . get_permalink( $id ) . '">' . get_the_title( $id ) . '</a></li>';
						}
						echo '</ul>';
					}
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		case 'ACF_User':

			if ( 'dslc_templates' === get_post_type( $array['post_id'] ) ) {
				$id = '';

				if ( $array['dslc_is_admin'] ) {
					$id = $array['preview_id'];
				} else {
					$id = get_queried_object_id();
				}

				$term = get_term( $id );

				if ( ! empty( $term ) ) {
					$arr_user = get_field_object( $array['field'], 'category_' . $id );
				} else {
					$arr_user = get_field_object( $array['field'], $id );
				}
			} else {
				$arr_user = get_field_object( $array['field'], $array['post_id'] );
			}

			if ( ( 'not_set' === $array['field'] ) && $array['dslc_is_admin'] ) {
				echo lcacf_display_notice( 'select' );
			} else {

				if ( ! empty( $array['preview_id'] ) ) {
					$current_id = $array['preview_id'];
				} else {
					$current_id = $array['post_id'];
				}

				$current_field = $array['field'];

				if ( ! empty( $arr_user['value'] ) && lcacf_exits_field( $current_id, $current_field ) ) {

					echo '<ul>';
					if ( 0 == $arr_user['multiple'] ) {

						if ( 'nickname' == $array['display_name'] ) {
							$name = $arr_user['value']['nickname'];
						} else {
							$name = $arr_user['value']['display_name'];
						}

						echo '<li><a href="' . get_author_posts_url( $arr_user['value']['ID'] ) . '" rel="author">' . $name . '</a></li>';
					} else {

						foreach ( $arr_user['value'] as $user ) {

							if ( 'nickname' == $array['display_name'] ) {
								$name = $user['nickname'];
							} else {
								$name = $user['display_name'];
							}

							echo '<li><a href="' . get_author_posts_url( $user['ID'] ) . '" rel="author">' . $name . '</a></li>';
						}
					}
					echo '</ul>';
				} else {

					if ( $array['dslc_is_admin'] ) {
						if ( lcacf_exits_field( $current_id, $current_field ) ) {
							echo lcacf_display_notice( 'empty' );
						} else {
							echo lcacf_display_notice( 'select' );
						}
					}
				}
			}

			break;
		default:
			break;
	}
}

/**
 * Display notice.
 *
 * @param  string $notice Options.
 */
function lcacf_display_notice( $notice ) {

	if ( 'select' === $notice ) {
		$output = '<div class="dslc-notification dslc-red">' . __( 'Click the cog icon on the right of this box to choose which field to show.', 'lc-acf-integration' ) . '<span class="dslca-module-edit-hook dslc-icon dslc-icon-cog"></span></div>';
	} elseif ( 'empty' === $notice ) {
		$output = '<div class="dslc-notification dslc-red">' . __( 'Custom field is empty.', 'lc-acf-integration' ) . '</div>';
	} elseif ( 'google-map-api' === $notice ) {
		$output = '<div class="dslc-notification dslc-green">' . __( 'Click to set Google key.', 'lc-acf-integration' ) . '</div>';
	} elseif ( 'google-map-refresh' === $notice ) {
		$output = '<div class="dslc-notification dslc-green">' . __( 'Please, save and refresh this page to load the map.', 'lc-acf-integration' ) . '</div>';
	} else {
		$output = '';
	}

	return $output;
}

/**
 * Get all fields by group
 *
 * @param  string $type_field current type.
 */
function lcacf_get_all_fields_by_group( $type_field = '' ) {

	$acf_version = get_option( 'acf_version' );

	if ( version_compare( $acf_version, '5.0.0', '>=' ) ) {
		$acf_groups = get_posts(array(
			'numberposts' => -1,
			'post_type' => 'acf-field-group',
			'orderby' => 'menu_order title',
			'order' => 'asc',
			'suppress_filters' => false,
		));
	} else {
		$acf_groups = get_posts(array(
			'numberposts' => -1,
			'post_type' => 'acf',
			'orderby' => 'menu_order title',
			'order' => 'asc',
			'suppress_filters' => false,
		));
	}

	if ( $acf_groups ) {
		foreach ( $acf_groups as $acf_group ) {

			$groups[] = array(
				'id' => $acf_group->ID,
				'title' => $acf_group->post_title,
			);
		}
	}

	$choices = array();

	foreach ( $groups as $group ) {

		if ( version_compare( $acf_version, '5.7.11', '>=' ) ) {
			$acf_fields = acf_get_fields( $group['id'] );
		} elseif ( version_compare( $acf_version, '5.0.0', '>=' ) ) {
			$acf_fields = acf_get_fields_by_id( $group['id'] );
		} else {
			$acf_fields = apply_filters( 'acf/field_group/get_fields', array(), $group['id'] );
		}

		$all_fields = lcacf_get_all_the_fields( $acf_fields );

		foreach ( $all_fields as $acf_field ) {
			if ( $type_field === $acf_field['type'] ) {

				if ( ! empty( $acf_field['label'] ) && ! empty( $acf_field['name'] ) ) {
					$choices[] = array(
						'label' => $group['title'] . ': ' . $acf_field['label'],
						'value' => $acf_field['name'],
					);
				}
			}
		}
	}

	return $choices;
}

function lcacf_get_all_the_fields( $acf_fields = array() ) {
	$return = array();
	foreach ( $acf_fields as $acf_field ) {

		// Layout groups have set of inner fields.
		if ( 'group' === $acf_field['type'] ) {
			$inner_fields = lcacf_get_all_the_fields( $acf_field['sub_fields'] );

			if ( ! empty( $inner_fields ) ) {
				$return = array_merge( $return, $inner_fields );
			}
		} else {
			$return[] = $acf_field;
		}
	}

	return $return;
}

/**
 * Get all fields by id and type
 *
 * @param  number $id current id.
 * @param  string $type current type.
 */
function lcacf_get_all_fields( $id, $type ) {

	$fields = '';
	$term = get_term( $id );

	if ( ! empty( $term ) ) {
		$fields = get_field_objects( 'category_' . $id );
	} else {
		$fields = get_field_objects( $id );
	}

	$choices = array();

	if ( is_array( $fields ) ) {
		foreach ( $fields as $field_name => $value ) {
			if ( $type === $value['type'] ) {
				$label = $value['label'];
				$value = strtolower( $value['name'] );

				if ( ! empty( $label ) && ! empty( $value ) ) {
					$choices[] = array(
						'label' => $label,
						'value' => $value,
					);
				}
			}
		}
	}

	return $choices;
}

/**
 * Check exist field
 *
 * @param  number $current_id current id.
 * @param  string $current_field current field.
 */
function lcacf_exits_field( $current_id, $current_field ) {

	global $dslc_active;

	if ( $dslc_active ) {

		$term = get_term( $current_id );

		if ( ! empty( $term ) ) {
			$fields = get_field_objects( 'category_' . $current_id );
		} else {
			$fields = get_field_objects( $current_id );
		}

		if ( array_key_exists( $current_field, $fields ) ) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

/**
 * Get all fields by id
 *
 * @param  number $id current id.
 */
function lcacf_get_all_fields_by_id( $id ) {

	$fields = get_field_objects( $id );
	$choices = array();

	if ( is_array( $fields ) ) {
		foreach ( $fields as $field_name => $field ) {
			$label = $field['label'];
			$value = strtolower( $field['name'] );

			if ( ( 'textarea' == $field['type'] ) || ( 'image' == $field['type'] ) || ( 'oembed' == $field['type'] ) ) {
				if ( ! empty( $label ) && ! empty( $field['value'] ) ) {
					$choices[] = array(
						'label' => $label,
						'value' => $value . '|' . $field['type'],
					);
				}
			}
		}
	}

	return $choices;
}

/**
 * Display acf fields
 *
 * @param  array $options get all options.
 */
function lcacf_module_blog_post_main_after( $options ) {

	if ( isset( $options['acf_fields'] ) && ( $options['acf_fields'] != '' ) && ( 'none' !== $options['acf_fields'] ) ) {

		$acf_fields = explode( ' ', trim( $options['acf_fields'] ) );
		$acf_type = array();

		foreach ( $acf_fields as $field) {
			$field_explode = explode('|', $field);
			$field_name = $field_explode[0];
			$field_type = $field_explode[1];

			$acf_type[$field_type] = $field_name;
		}

		ob_start();

		if ( array_key_exists( 'textarea', $acf_type ) ) {
			$textarea = get_field( $acf_type['textarea'] );

			if ( ! empty( $textarea ) ) { ?>
				<div class="acf-textarea">
					<?php the_field( $acf_type['textarea'] ); ?>
				</div>
			<?php }
		}

		$textarea_output = ob_get_contents();
		ob_end_clean();

		ob_start();

		if ( array_key_exists( 'image', $acf_type ) ) {

			$image = get_field( $acf_type['image'] );

			if ( ! empty( $image ) ) { ?>
				<div class="acf-image-container">
					<div class="acf-image">
						<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />
					</div>
				</div>
			<?php }
		}

		$image_output = ob_get_contents();
		ob_end_clean();

		ob_start();

		if ( array_key_exists( 'oembed', $acf_type ) ) {

			$oembed = get_field( $acf_type['oembed'] );

			if ( ! empty( $oembed ) ) { ?>
				<div class="acf-oembed">
					<?php the_field( $acf_type['oembed'] ); ?>
				</div>
			<?php }
		}

		$oembed_output = ob_get_contents();
		ob_end_clean();

		switch ( $options['elements_position'] ) {
			case 'one':
				echo $textarea_output;
				echo $image_output;
				echo $oembed_output;
				break;
			case 'two':
				echo $image_output;
				echo $textarea_output;
				echo $oembed_output;
				break;
			case 'three':
				echo $textarea_output;
				echo $oembed_output;
				echo $image_output;
				break;
			case 'four':
				echo $image_output;
				echo $oembed_output;
				echo $textarea_output;
				break;
			case 'five':
				echo $oembed_output;
				echo $image_output;
				echo $textarea_output;
				break;
			case 'six':
				echo $oembed_output;
				echo $textarea_output;
				echo $image_output;
				break;
			default:
				echo $textarea_output;
				echo $image_output;
				echo $oembed_output;
		}
	}
}
add_action( 'dslc_module_blog_post_main_after', 'lcacf_module_blog_post_main_after' );
add_action( 'dslc_module_partners_main_after', 'lcacf_module_blog_post_main_after' );
add_action( 'dslc_module_projects_main_after', 'lcacf_module_blog_post_main_after' );
add_action( 'dslc_module_staff_main_after', 'lcacf_module_blog_post_main_after' );

/**
 * Add options
 *
 * @param  array $options get all options.
 * @param  number $id get current id.
 */
function lcacf_module_blog_add_options( $options, $id ) {

	if ( 'DSLC_Blog' === $id || 'DSLC_Partners' === $id
			|| 'DSLC_Projects' === $id || 'DSLC_Staff' === $id ) {

		$post_type = '';

		if ( 'DSLC_Blog' === $id ) {
			$post_type = 'post';
		} elseif ( 'DSLC_Partners' === $id ) {
			$post_type = 'dslc_partners';
		} elseif ( 'DSLC_Projects' === $id ) {
			$post_type = 'dslc_projects';
		} elseif ( 'DSLC_Staff' === $id ) {
			$post_type = 'dslc_staff';
		}

		$args = array(
			'post_type' => $post_type,
			'posts_per_page'  => -1
		);

		$posts = get_posts( $args );
		$choices = array();

		foreach ( $posts as $post ) {
			$acf_fields = lcacf_get_all_fields_by_id( $post->ID );

			if ( ! empty( $acf_fields ) ) {

				foreach ( $acf_fields as $field ) {

					$choices[] = array(
						'label' => $field['label'],
						'value' => $field['value'],
					);
				}
			}
		}

		$acf_choices = array_unique( $choices, SORT_REGULAR );

		if ( ! empty( $acf_choices ) ) {
			$acf_checkbox = array(
				array(
					'label' => __( 'ACF Fields', 'lc-acf-integration' ),
					'id' => 'acf_fields',
					'std' => '',
					'type' => 'checkbox',
					'choices' => $acf_choices,
					'section' => 'styling',
				),
			);

			$post_elements_key = array_search( 'post_elements', array_column( $options, 'id' ) );
			array_splice( $options, $post_elements_key + 1, 0, $acf_checkbox );

			$acf_style = array(
				array(
					'label' => __( 'Elements Position', 'lc-acf-integration' ),
					'id' => 'elements_position',
					'std' => 'one',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Textarea, Image, oEmbed', 'lc-acf-integration' ),
							'value' => 'one',
						),
						array(
							'label' => __( 'Image, Textarea, oEmbed', 'lc-acf-integration' ),
							'value' => 'two',
						),
						array(
							'label' => __( 'Textarea, oEmbed, Image', 'lc-acf-integration' ),
							'value' => 'three',
						),
						array(
							'label' => __( 'Image, oEmbed, Textarea', 'lc-acf-integration' ),
							'value' => 'four',
						),
						array(
							'label' => __( 'oEmbed, Image, Textarea', 'lc-acf-integration' ),
							'value' => 'five',
						),
						array(
							'label' => __( 'oEmbed, Textarea, Image', 'lc-acf-integration' ),
							'value' => 'six',
						),
					),
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
				array(
					'label' => __( 'Textarea', 'lc-acf-integration' ),
					'id' => 'css_acf_textarea_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
					array(
						'label' => __( 'Color', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'color',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Font Size', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_font_size',
						'onlypositive' => true, // Value can't be negative.
						'std' => '13',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'font-size',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Font Weight', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_font_weight',
						'std' => '400',
						'type' => 'select',
						'choices' => array(
							array(
								'label' => '100 - Thin',
								'value' => '100',
							),
							array(
								'label' => '200 - Extra Light',
								'value' => '200',
							),
							array(
								'label' => '300 - Light',
								'value' => '300',
							),
							array(
								'label' => '400 - Normal',
								'value' => '400',
							),
							array(
								'label' => '500 - Medium',
								'value' => '500',
							),
							array(
								'label' => '600 - Semi Bold',
								'value' => '600',
							),
							array(
								'label' => '700 - Bold',
								'value' => '700',
							),
							array(
								'label' => '800 - Extra Bold',
								'value' => '800',
							),
							array(
								'label' => '900 - Black',
								'value' => '900',
							),
						),
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'font-weight',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => '',
					),
					array(
						'label' => __( 'Font Family', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_font_family',
						'std' => 'Open Sans',
						'type' => 'font',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'font-family',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Font Style', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_font_style',
						'std' => 'normal',
						'type' => 'select',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'font-style',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'choices' => array(
							array(
								'label' => __( 'Normal', 'lc-acf-integration' ),
								'value' => 'normal',
							),
							array(
								'label' => __( 'Italic', 'lc-acf-integration' ),
								'value' => 'italic',
							),
						),
					),
					array(
						'label' => __( 'Letter Spacing', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_letter_spacing',
						'max' => 30,
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'letter-spacing',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
						'min' => -50,
						'max' => 50,
					),
					array(
						'label' => __( 'Line Height', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_line_height',
						'onlypositive' => true, // Value can't be negative.
						'std' => '22',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'line-height',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Text Align', 'lc-acf-integration' ),
						'id' => 'css_acf_textarea_text_align',
						'std' => 'left',
						'type' => 'text_align',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'text-align',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Margin Bottom', 'live-composer-page-builder' ),
						'id' => 'css_acf_textarea_margin_bottom',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-textarea',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
						'min' => -250,
						'max' => 250,
					),
				array(
					'label' => __( 'Textarea', 'lc-acf-integration' ),
					'id' => 'css_acf_textarea_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
				array(
					'label' => __( 'Image', 'lc-acf-integration' ),
					'id' => 'css_acf_image_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
					array(
						'label' => __( 'Align', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_align',
						'std' => 'center',
						'type' => 'text_align',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image-container',
						'affect_on_change_rule' => 'text-align',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Border Color', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_border_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'border-color',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Border Width', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_border_width',
						'onlypositive' => true, // Value can't be negative.
						'max' => 10,
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'border-width',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Borders', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_border_trbl',
						'std' => 'top right bottom left',
						'type' => 'checkbox',
						'choices' => array(
							array(
								'label' => __( 'Top', 'live-composer-page-builder' ),
								'value' => 'top',
							),
							array(
								'label' => __( 'Right', 'live-composer-page-builder' ),
								'value' => 'right',
							),
							array(
								'label' => __( 'Bottom', 'live-composer-page-builder' ),
								'value' => 'bottom',
							),
							array(
								'label' => __( 'Left', 'live-composer-page-builder' ),
								'value' => 'left',
							),
						),
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'border-style',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Border Radius', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_border_radius',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image, .acf-image img',
						'affect_on_change_rule' => 'border-radius',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Margin Top', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_margin_top',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						// 'affect_on_change_el' => '.acf-image-container',
						'affect_on_change_el' => '.acf-image', // @todo: check how it affects?
						'affect_on_change_rule' => 'margin-top',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
						'min' => -250,
						'max' => 250,
					),
					array(
						'label' => __( 'Margin Bottom', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_margin_bottom',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
						'min' => -250,
						'max' => 250,
					),
					array(
						'label' => __( 'Max Width', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_max_width',
						'std' => '',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'max-width',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
						'max' => 1400,
						'increment' => 5,
					),
					array(
						'label' => __( 'Minimum Height', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_min_height',
						'onlypositive' => true, // Value can't be negative.
						'std' => '',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'min-height',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
						'increment' => 5,
					),
					array(
						'label' => __( 'Padding Vertical', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_padding_vertical',
						'onlypositive' => true, // Value can't be negative.
						'max' => 600,
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Padding Horizontal', 'live-composer-page-builder' ),
						'id' => 'css_acf_image_padding_horizontal',
						'onlypositive' => true, // Value can't be negative.
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-image',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
				array(
					'label' => __( 'Image', 'lc-acf-integration' ),
					'id' => 'css_acf_image_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
				array(
					'label' => __( 'oEmbed', 'lc-acf-integration' ),
					'id' => 'css_acf_oembed_group',
					'type' => 'group',
					'action' => 'open',
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
					array(
						'label' => __( 'Border Color', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_border_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'border-color',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Border Width', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_border_width',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'border-width',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Borders', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_border_trbl',
						'std' => 'top right bottom left',
						'type' => 'checkbox',
						'choices' => array(
							array(
								'label' => __( 'Top', 'lc-acf-integration' ),
								'value' => 'top',
							),
							array(
								'label' => __( 'Right', 'lc-acf-integration' ),
								'value' => 'right',
							),
							array(
								'label' => __( 'Bottom', 'lc-acf-integration' ),
								'value' => 'bottom',
							),
							array(
								'label' => __( 'Left', 'lc-acf-integration' ),
								'value' => 'left',
							),
						),
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'border-style',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
					),
					array(
						'label' => __( 'Border Radius', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_border_radius',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'border-radius',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Margin Bottom', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_margin_bottom',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Padding Vertical', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_padding_vertical',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
					array(
						'label' => __( 'Padding Horizontal', 'lc-acf-integration' ),
						'id' => 'css_acf_oembed_padding_horizontal',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.acf-oembed',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'styling',
						'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
						'ext' => 'px',
					),
				array(
					'label' => __( 'oEmbed', 'lc-acf-integration' ),
					'id' => 'css_acf_oembed_group',
					'type' => 'group',
					'action' => 'close',
					'section' => 'styling',
					'tab' => __( 'ACF Fields', 'lc-acf-integration' ),
				),
			);

			$options = array_merge( $options, $acf_style);
		}

		return $options;
	} else {
		return $options;
	}
}
add_filter( 'dslc_module_options', 'lcacf_module_blog_add_options', 10, 2 );

/**
 * Delete control toggle
 *
 * @param  array $controls_without_toggle get all controls toggle.
 */
function lcacf_controls_without_toggle( $controls_without_toggle ) {

	$controls_without_toggle[] = 'acf_fields';
	$controls_without_toggle[] = 'elements_position';
	return $controls_without_toggle;
}
add_filter( 'dslc_controls_without_toggle', 'lcacf_controls_without_toggle' );