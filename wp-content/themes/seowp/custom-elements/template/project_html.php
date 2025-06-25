<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />

<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>


<div class="card-deck project-1 image multiple-itemss">

    <?php
    $args = array(
        'post_type' => "dslc_projects",
        'post_status' => 'publish',
        'orderby' => 'ID',
        'order' => 'ASC',
        'posts_per_page' => 6,
        'paged' => 1
    );
    $the_query = new WP_Query($args); //print_r($the_query);
    ?>
    <?php
    if ($the_query->have_posts()) :
        while ($the_query->have_posts()) :
            $the_query->the_post();
           
    ?>
            <div class="card">
                <img class="card-img-top" src="<?= get_the_post_thumbnail_url(); ?>" alt="Card image cap">
                <div class="card-body">
                    <h2 class="card-title dslc-project-titles text-uppercase"><?php the_title(); ?></h2>
                    <p class=" dslc-project-excerpts myclass" id="my_id"><?php echo wp_trim_words(get_the_content(), 20, '...'); ?></p>
                </div>
            </div>
        <?php
        endwhile;
        wp_reset_postdata(); ?>
    <?php endif; ?>

</div>

<style>
    .card-body {
        padding: 30px 30px 20px 30px;
    }

    .project-1 {
        width: 1200px;
        margin: 0 auto;
    }

    .dslc-project-titles {
        font-size: 21px;
        font-weight: 600;
        line-height: 27px;
        letter-spacing: 1px;
        font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
        text-align: center;
    }

    .dslc-project-excerpts {
        background-color: #ffffff;
        font-size: 15px !important;
        font-weight: 300 !important;
        margin-bottom: 22px;
        padding-top: 0px;
        border-top-color: #e6e6e6;
        border-top-width: 0px;
        border-top-style: solid;
        text-align: center;
        line-height: 22px;
        font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
    }

    .image img {
        height: auto;
        max-width: 100%;
        border: solid 0px;
        border-radius: 24px 24px 0px 0px;
        box-shadow: none;
        border-color: #e6e6e6;
        width: 383;
        height: 256;
    }

    .card {
        border-top: none;
        border-radius: 24px;
        width: 409px;
        margin-left: 12.766px;
        margin-right: 12.766px;
    }

    button.slick-arrow,
    ul.slick-dots li button {
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
<?php 
$post_id = get_the_ID();

// Get Elementor data settings
$elementor_data = get_post_meta($post_id, '_elementor_data', true);

// Check if Elementor data exists
if ($elementor_data) {
    // Elementor data is stored as JSON, so you might want to decode it
    $elementor_data_decoded = json_decode($elementor_data, true);
    $desktop = 3; $tablet = 3; $mobile = 3; 
   
    foreach($elementor_data_decoded as $key => $item){
        
            if(isset($item['elements']) && !empty($item['elements'])){
                foreach($item['elements'] as $element){
                    if(isset($element) && !empty($element['elements'])){
                        foreach($element['elements'] as $ele){
                            if(isset($ele['settings']) && !empty($ele['settings'])){
                                foreach($ele['settings'] as $key_name => $origin_setting){
                                    if($key_name == "_desktop_slide_new"){
                                        $desktop = $origin_setting;
                                    }
                                    if($key_name == "_tablet_slide_new"){
                                         $tablet = $origin_setting;
                                    }
                                    if($key_name == "_mobile_slide_new"){
                                        $mobile = $origin_setting;
                                    }
                                }
                            }
                        }
                    }
                }
            }    
        
    } 

}  ?>
<script>
   $('.multiple-itemss').slick({
       infinite: false,
        dots: true,
        slidesToShow: <?= $desktop ?>,
        arrows: true,
        slidesToScroll: 3,
         responsive: [
      {
        breakpoint: 1220,
        settings: {
          slidesToShow: <?= $desktop ?>,
        }
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow:  <?= $tablet ?>,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: <?= $mobile ?>,
        }
      }
    ]
    });
</script>