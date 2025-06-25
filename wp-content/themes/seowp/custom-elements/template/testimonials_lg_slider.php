<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
				
<div class="full_width_slider_testimonaial">
    <?php
    $args = array(
        'post_type' => "dslc_testimonials",
        'post_status' => 'publish',
        'orderby' => 'ID',
        'order' => 'DESC',
        'paged' => 1,
        'posts_per_page' => 3
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
        <div class="container">
            <div class="row">
                <div class="col-sm-8 left_hand_side">
                    <p class="card-text"> <?php echo wp_trim_words(get_the_content(), 200, '...'); ?></p>
                </div>
                <div class="col-sm-4 right_hand_side">
                    <div class="detail">
                        <div class="image_with_title">
                            <span class="slide-img-top"><?php the_post_thumbnail(); ?></span>
                            <h2><?php the_title(); ?>
                                <span><?= isset($position) ? $position : "" ?></span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>  
        </div>  
        <?php
        endwhile;
        wp_reset_postdata(); ?>
    <?php endif; ?>
</div>

<style>
button.slick-arrow,ul.slick-dots li button {
    display: none !important;
}
ul.slick-dots {
    display: flex;
    justify-content: center;
}
li.slick-active {
    color: red;
}
</style>
<script>
    $('.full_width_slider_testimonaial').slick({
  infinite: false,
  dots: true,
  slidesToShow: 1,
  arrows: true,
  slidesToScroll: 1
});
</script>