<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<div class="row">
  
     <?php
    $args = array(
        'post_type' => "post",
        'post_status' => 'publish',
        'orderby' => 'ID',
        'order' => 'DESC',
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
    <div class="col-md-6"> 
  
<div class="row main">
    <div class="dslc-blog-post-thumb-inner dslca-post-thumb col-md-5 image" id="image">
        <a href="#" class=""><?php the_post_thumbnail();?></a>
    </div>
    <div class="col-sm-6">
        <div class="dslc-blog-post-title">
            <h2><a href="<?php the_permalink(); ?>" id="title"><?php the_title(); ?></a></h2>
        </div>
        <!-- here start profile -->
       
        <div class="description"><?php echo wp_trim_words(get_the_content(), 15, '...'); ?></div>
        <div class="read-more">
            <a href="<?php the_permalink(); ?>">
                Learn More
            </a>
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
    body {
        font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
        line-height: 27px;
        font-weight: 300;
        color: rgb(65, 72, 77);
    }

    .dslc-blog-post-meta a {
        font-size: 14px;
    }

    .date {
        font-size: 14px;
    }

    .dslc-blog-post-meta a:hover {
        color: #fb55a5;
    }

    .image img {
        border-radius: 10px;
    }

    .dslc-blog-post-title {
        text-align: inherit;
        margin-bottom: 16px;
    }

    .dslc-blog-post-title h2 a {
        color: RGB(70, 72, 75);
        font-size: 38px;
        font-weight: 600;
        line-height: 40px;
    }

    .dslc-blog-post-meta-avatar {
        margin-right: 10px;
        width: 30px;
    }

    .dslc-blog-post-meta {
        border: solid rgba(229, 229, 229, 0.48) 1px;

    }

    .description {
        text-align: inherit;
        color: RGB(65, 72, 77);
        font-weight: 300;
        margin-bottom: 29px;
    }

    #title:hover {
        color: #fb55a5 !important;
    }

    .read-more a {
        border-radius: 10px;
        color: #f37648;
        font-size: 16px;
        font-weight: 400;
        padding: 13px 14px 13px 14px;
        border-width: 2px;
        border-style: solid solid solid solid;
        border-color: #e8e8e8;
        text-decoration: none;
        width: fit-content;
    }

    .read-more:hover{
        color:#fb55a5 !important;
    }
    .read-more a:hover {
        background-color: #fb55a5;
        color: #ffffff;
    }

    /*.dslc-post-separator {*/
    /*    margin-bottom: 44px;*/
    /*    padding-bottom: 44px;*/
    /*    border-color: rgba(230, 230, 230, 0.47);*/
    /*    border-bottom-width: 1px;*/
    /*    border-style: solid;*/
    /*}*/

    .main {
        margin-bottom: 44px;
    }
</style>