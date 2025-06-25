<div class="row card_part">
    <?php
    $args = array(
        'post_type' => "dslc_testimonials",
        'post_status' => 'publish',
        'orderby' => 'ID',
        'order' => 'Asc',
        'paged' => 1
    );
    $the_query = new WP_Query($args); //print_r($the_query);
    ?>
    <?php
    if ($the_query->have_posts()) :
        while ($the_query->have_posts()) :
            $the_query->the_post();
            if (isset($the_query->post->ID) && !empty($the_query->post->ID)) {
                if (get_post_meta($the_query->post->ID)) {
                    $position = get_post_meta($the_query->post->ID)['dslc_testimonial_author_pos'][0];
                }
            }
    ?>
            <a href="<?php the_permalink(); ?>">
                <div class="card-body">
                    <p class="card-text"> <?php echo wp_trim_words(get_the_content(), 200, '...'); ?></p>
                    <div class="image_with_title">
                        <span class="card-img-top"> <?php the_post_thumbnail(); ?></span>
                        <h2><?php the_title(); ?>
                            <span><?= isset($position) ? $position : "" ?></span>
                        </h2>
                    </div>
                </div>
            </a>
        <?php
        endwhile;
        wp_reset_postdata(); ?>
    <?php endif; ?>
</div>
<div class="row">
    <div class="col-12">
        <div class="pagination">
            <?php
            echo paginate_links(array(
                'base' => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))),
                'total' => $the_query->max_num_pages,
                'current' => max(1, 1),
                'format' => '?paged=%#%',
                'show_all' => false,
                'type' => 'plain',
                'end_size' => 2,
                'mid_size' => 1,
                'prev_next' => true,
                // 'prev_text'    => sprintf( '<i></i> %1$s', __( 'Newer Posts', 'text-domain' ) ),
                //'next_text'    => sprintf( '%1$s <i></i>', __( 'Older Posts', 'text-domain' ) ),
                'add_args' => false,
                'add_fragment' => '#issue-list',
            ));
            ?>
        </div>
    </div>
</div>


<style>
    p.card-text {
        font-size: 20px;
        font-weight: 400;
        font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
        line-height: 1.3;
        color: #000;
    }

    img.attachment-post-thumbnail.size-post-thumbnail.wp-post-image {
        width: 100px;
        border-radius: 50%;
        box-shadow: inset 0 0 20px 0 #00000038;
        border: 1px solid #00000040;
        padding: 10px;
    }

    h2 {
        color: rgb(65, 72, 77);
        font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
        font-size: 20px;
        font-weight: 300;
        position: relative;
        margin-left: 1rem;
    }

    h2>span {
        display: block;
        font-size: 14px;
        position: absolute;
        bottom: -25px;
        left: 0;
    }

    .card-body {
        width: 370px;
        background: #fff;
        box-shadow: 0 0 20px 0 #0003;
        padding: 25px 33px;
        border-radius: 1rem;
        margin: 20px 10px;
    }

    .image_with_title {
        display: flex;
        align-items: center;
    }

    .card_part {
        display: flex;
        flex-wrap: wrap;
    }

    body.elementor-page-60855:not(.dslc-page-has-content) .site-content .dslc-modules-section-wrapper {
        width: 1200px !important;
        max-width: 1200px !important;
    }
</style>