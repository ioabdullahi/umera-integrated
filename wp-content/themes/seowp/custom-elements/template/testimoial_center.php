<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
				
<div class="full_width_slider_testimonaial border-radius_for_slider">
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
        <div>
            <div class="row align-items-center testimonail_center">
                <div class="col-12 left_hand_side text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>
                    <p class="card-text text-center"> <?php echo wp_trim_words(get_the_content(), 20, '...'); ?></p>
                </div>
                <div class="col-12 right_hand_side ">
                    <div class="detail ">
                        <div class="image_with_title">
                            <h2 class="w-100 text-center mt-4 pt-2 pb-4"><?php the_title(); ?>
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
.border-radius_for_slider {
    border-radius: 1.6rem;
    margin-bottom: 3rem;
}
.left_hand_side > svg {
    fill: #fff;
    width: 50px;
    height: 60px;
    margin-bottom: 1rem;
}
.testimonail_center {
    padding: 2rem 15%;
        padding-bottom: 0;
}
button.slick-arrow,ul.slick-dots li button {
    display: none !important;
}
.border-radius_for_slider ul.slick-dots {
    display: flex;
    justify-content: center;
        top: 40px;
    position: relative;
}
li.slick-active {
    color: red;
}
.right_hand_side .detail img {
    width: 100px;
    height: 100px;
    border-radius: 50% !important;
    box-shadow: inset 0 0 20px 0 #ffffff61;
    padding: 11px;
}
.image_with_title {
    display: flex;
    align-items: center;
}
.image_with_title h2 > span {
    display: block;
    font-size: 16px;
    line-height: 1.2;
}
p.card-text,.image_with_title h2{
        color: rgb(255, 255, 255);
    font-size: 24px;
    font-weight: 300;
    line-height: 34px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    padding-top: 0px;
    text-align: left;
}

span.slide-img-top {
    margin-right: 1rem;
}
.full_width_slider_testimonaial {
    background: #8829e1;
    padding-bottom: 0;
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