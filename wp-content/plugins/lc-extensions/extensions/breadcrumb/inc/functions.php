<?php
/**
 * All functions
 *
 * @package LiveComposer
 */

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	exit;
}

/**
 *
 * Used for displaying the breadcrumb.
 */
function dslc_display_breadcrumb() {

	/* === OPTIONS === */

	$text['home']     = 'Home'; // Text for the 'Home' link.
	$wrap_before    = '<div class="breadcrumbs">'; // The opening wrapper tag.
	$wrap_after     = '</div><!-- .breadcrumbs -->'; // The closing wrapper tag.
	$sep            = '/'; // Separator between crumbs.
	$sep_before     = '<span class="sep">'; // Tag before separator.
	$sep_after      = '</span>'; // Tag after separator.
	$show_home_link = 1; // 1 - Show the 'Home' link, 0 - don't show.
	$show_on_home   = 0; // 1 - Show breadcrumbs on the homepage, 0 - don't show.
	$show_current   = 1; // 1 - Show current page title, 0 - don't show.
	$before         = '<span class="item_current">'; // Tag before the current crumb.
	$after          = '</span>'; // Tag after the current crumb.

	/* === END OF OPTIONS === */

	global $post;

	$home_url       = home_url();
	$link_before    = '<span class="item">';
	$link_after     = '</span>';
	$link_attr      = '';
	$link_in_before = '<span>';
	$link_in_after  = '</span>';
	$link           = $link_before . '<a href="%1$s"' . $link_attr . '>' . $link_in_before . '%2$s' . $link_in_after . '</a>' . $link_after;
	$frontpage_id   = get_option( 'page_on_front' );
	$parent_id      = $post->post_parent;
	$sep            = ' ' . $sep_before . $sep . $sep_after . ' ';
	$home_link      = $link_before . '<a href="' . $home_url . '"' . $link_attr . ' class="home">' . $link_in_before . $text['home'] . $link_in_after . '</a>' . $link_after;

	if ( is_home() || is_front_page() ) {
		if ( $show_on_home ) {
			echo $wrap_before . $home_link . $wrap_after;
		}
	} else {
		echo $wrap_before;

		if ( $show_home_link ) {
			echo $home_link;
		}

		if ( is_category() || is_tax() ) {
			$cat = get_category( get_query_var( 'cat' ), false );

			if ( ! is_wp_error( $cat ) ) {
				if ( 0 != $cat->parent ) {
					$cats = get_category_parents( $cat->parent, true, $sep );
					$cats = preg_replace("#^(.+)$sep$#", "$1", $cats);
					$cats = preg_replace('#<a([^>]+)>([^<]+)<\/a>#', $link_before . '<a$1' . $link_attr .'>' . $link_in_before . '$2' . $link_in_after .'</a>' . $link_after, $cats);
					if ( $show_home_link ) {
						echo $sep;
					}
					echo $cats;
				}
			}

			if ( get_query_var( 'paged' ) ) {
				$cat = $cat->cat_ID;
				echo $sep . sprintf( $link, get_category_link( $cat ), get_cat_name( $cat ) ) . $sep . $before . get_query_var('paged') . $after;
			} else {
				if ( $show_current ) {
					echo $sep . $before . single_cat_title( '', false ) . $after;
				}
			}
		} elseif ( is_search() ) {
			if ( have_posts() ) {
				if ( $show_home_link && $show_current ) {
					echo $sep;
				}
				if ( $show_current ) {
					echo $before . get_search_query() . $after;
				}
			} else {
				if ( $show_home_link ) {
					echo $sep;
				}
				echo $before . get_search_query() . $after;
			}
		} elseif ( is_day() ) {
			if ( $show_home_link ) {
				echo $sep;
			}
			echo sprintf( $link, get_year_link( get_the_time( 'Y' ) ), get_the_time( 'Y' ) ) . $sep;
			echo sprintf( $link, get_month_link( get_the_time( 'Y' ), get_the_time( 'm' ) ), get_the_time( 'F' ) );
			if ( $show_current ) {
				echo $sep . $before . get_the_time('d') . $after;
			}
		} elseif ( is_month() ) {
			if ( $show_home_link ) {
				echo $sep;
			}
			echo sprintf( $link, get_year_link( get_the_time( 'Y' ) ), get_the_time( 'Y' ) );
			if ( $show_current ) {
				echo $sep . $before . get_the_time( 'F' ) . $after;
			}
		} elseif ( is_year() ) {
			if ( $show_home_link && $show_current ) {
				echo $sep;
			}
			if ( $show_current ) {
				echo $before . get_the_time( 'Y' ) . $after;
			}
		} elseif ( is_single() && ! is_attachment() ) {
			if ( $show_home_link ) {
				echo $sep;
			}
			if ( get_post_type() != 'post' ) {
				$post_type = get_post_type_object( get_post_type() );
				$slug = $post_type->rewrite;
				printf( $link, $home_url . '/' . $slug['slug'] . '/', $post_type->labels->singular_name );
				if ( $show_current ) {
					echo $sep . $before . get_the_title() . $after;
				}
			} else {
				$cat = get_the_category();
				$cat = $cat[0];
				$cats = get_category_parents( $cat, true, $sep );
				if ( ! $show_current || get_query_var( 'cpage' ) ) {
					$cats = preg_replace("#^(.+)$sep$#", "$1", $cats);
				}
				$cats = preg_replace('#<a([^>]+)>([^<]+)<\/a>#', $link_before . '<a$1' . $link_attr .'>' . $link_in_before . '$2' . $link_in_after .'</a>' . $link_after, $cats);
				echo $cats;
				if ( get_query_var( 'cpage' ) ) {
					echo $sep . sprintf( $link, get_permalink(), get_the_title()) . $sep . $before . get_query_var( 'cpage' ) . $after;
				} else {
					if ( $show_current ) {
						echo $before . get_the_title() . $after;
					}
				}
			}
			// Custom post type.
		} elseif ( ! is_single() && ! is_page() && get_post_type() != 'post' && ! is_404() ) {
			$post_type = get_post_type_object( get_post_type() );
			if ( get_query_var( 'paged' ) ) {
				echo $sep . sprintf( $link, get_post_type_archive_link( $post_type->name ), $post_type->label ) . $sep . $before . get_query_var( 'paged' ) . $after;
			} else {
				if ( $show_current ) {
					echo $sep . $before . $post_type->label . $after;
				}
			}
		} elseif ( is_attachment() ) {
			if ( $show_home_link ) {
				echo $sep;
			}
			$parent = get_post( $parent_id );
			$cat = get_the_category( $parent->ID );
			$cat = $cat[0];
			if ( $cat ) {
				$cats = get_category_parents( $cat, true, $sep );
				$cats = preg_replace('#<a([^>]+)>([^<]+)<\/a>#', $link_before . '<a$1' . $link_attr .'>' . $link_in_before . '$2' . $link_in_after .'</a>' . $link_after, $cats);
				echo $cats;
			}
			printf( $link, get_permalink( $parent ), $parent->post_title );
			if ( $show_current ) {
				echo $sep . $before . get_the_title() . $after;
			}
		} elseif ( is_page() && ! $parent_id ) {
			if ( $show_current ) {
				echo $sep . $before . get_the_title() . $after;
			}
		} elseif ( is_page() && $parent_id ) {
			if ( $show_home_link ) {
				echo $sep;
			}
			if ( $parent_id != $frontpage_id ) {
				$breadcrumbs = array();
				while ( $parent_id ) {
					$page = get_page( $parent_id );
					if ( $parent_id != $frontpage_id ) {
						$breadcrumbs[] = sprintf( $link, get_permalink( $page->ID ), get_the_title( $page->ID ) );
					}
					$parent_id = $page->post_parent;
				}
				$breadcrumbs = array_reverse( $breadcrumbs );
				for ( $i = 0; $i < count( $breadcrumbs ); $i++ ) {
					echo $breadcrumbs[ $i ];
					if ( $i != count( $breadcrumbs ) -1 ) {
						echo $sep;
					}
				}
			}
			if ( $show_current ) {
				echo $sep . $before . get_the_title() . $after;
			}
		} elseif ( is_tag() ) {
			if ( get_query_var( 'paged' ) ) {
				$tag_id = get_queried_object_id();
				$tag = get_tag( $tag_id );
				echo $sep . sprintf( $link, get_tag_link( $tag_id ), $tag->name ) . $sep . $before . get_query_var( 'paged' ) . $after;
			} else {
				if ( $show_current ) {
					echo $sep . $before . single_tag_title( '', false ) . $after;
				}
			}
		} elseif ( is_author() ) {
			global $author;
			$author = get_userdata( $author );
			if ( get_query_var( 'paged' ) ) {
				if ( $show_home_link ) {
					echo $sep;
				}
				echo sprintf( $link, get_author_posts_url( $author->ID ), $author->display_name ) . $sep . $before . get_query_var( 'paged' ) . $after;
			} else {
				if ( $show_home_link && $show_current ) {
					echo $sep;
				}
				if ( $show_current ) {
					echo $before . $author->display_name . $after;
				}
			}
		} elseif ( is_404() ) {
			if ( $show_home_link && $show_current ) {
				echo $sep;
			}
			if ( $show_current ) {
				echo $before . $after;
			}
		} elseif ( has_post_format() && ! is_singular() ) {
			if ( $show_home_link ) {
				echo $sep;
			}
			echo get_post_format_string( get_post_format() );
		}
		echo $wrap_after;
	}

}
