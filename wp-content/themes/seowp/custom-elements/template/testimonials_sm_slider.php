<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>


<div class="small_width_slider_testimonaial">
    <?php
    $args = array(
        'post_type' => "dslc_testimonials",
        'post_status' => 'publish',
        'orderby' => 'ID',
        'order' => 'Asc',
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
    
                <div class="card-body">
                    <p class="card-texts"> <?php echo wp_trim_words(get_the_content(), 200, '...'); ?></p>
                    <div class="image_with_title">
                        <span> <?php the_post_thumbnail(); ?></span>
                        <h2><?php the_title(); ?>
                            <span><?= isset($position) ? $position : "" ?></span>
                        </h2>
                    </div>
                </div>
        <?php
        endwhile;
        wp_reset_postdata(); ?>
    <?php endif; ?>
</div>

<style>
    p.card-texts {
        font-size: 20px;
        font-weight: 300;
        margin-bottom: 2rem;
        font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
        line-height: 1.3;
        color: #000;
    }
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
p.card-texts {
    line-height: 1.6;
    background: #fff;
    padding: 15px 15px;
}
    img.attachment-post-thumbnail.size-post-thumbnail.wp-post-image {
        width: 100px;
        border-radius: 50%;
        box-shadow: inset 0 0 20px 0 #00000038;
        border: 1px solid #00000040;
        padding: 10px;
    }
    .small_width_slider_testimonaial .card-body {
        box-shadow: none;
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

    
    .image_with_title {
        display: flex;
        align-items: center;
    }

</style>
<script>
jQuery( document ).ready(function() {
    jQuery('.small_width_slider_testimonaial').slick({
  infinite: false,
  dots: true,
  slidesToShow: 1,
  arrows: true,
  slidesToScroll: 1
});
});
   
</script>