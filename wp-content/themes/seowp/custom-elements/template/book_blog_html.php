<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<div class="dslc-tp-title">
  <div class="row">
     
         <?php
    $args = array(
        'post_type' => "dslc_downloads",
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
        <div class="col-md-6">
          <div class="row main align-items-center">
            <div class=" col-md-3"><a href="<?php the_permalink(); ?>" class=""><?php the_post_thumbnail(); ?></a></div>
            <div class="col right-box">
              <div class="dslc-blog-post-title">
                <h2><a href="<?php the_permalink(); ?>" id="title"><?php the_title(); ?></a></h2>
              </div>
              <!-- here start profile -->
              <div class="dslc-blog-post-meta">
                <div class="description"><?php echo wp_trim_words(get_the_content(), 15, '...'); ?></div>
                <div class="read-more">
                  <a href="<?php the_permalink(); ?>">Download now</a>
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
</div>
</div>

<style>
  body {
    font-family: 'Rubik', Helvetica, Arial, 'DejaVu Sans', 'Liberation Sans', Freesans, sans-serif;
  }

  .dslc-blog-post-meta a:hover {
    color: #fb55a5;
  }

  .dslc-blog-post-title {
    text-align: inherit;
    margin-bottom: 10px;
  }

  .dslc-blog-post-title h2 a {
    color: RGB(70, 72, 75);
    font-size: 27px;
    font-weight: 600;
    line-height: 33px;
  }

  .description {
    text-align: inherit;
    color: rgb(97, 103, 108);
    font-size: 16px;
    font-weight: 300;
    margin-bottom: 22px;
    line-height: 23px;
  }

  #title:hover {
    color: #fb55a5 !important;
  }

  .read-more a {
    border-radius: 15px;
    color: #f37648;
    font-size: 16px;
    font-weight: 400;
    padding: 12px 12px 12px 12px;
    border-width: 2px;
    border-style: solid solid solid solid;
    border-color: #e8e8e8;
    text-decoration: none;
    width: fit-content;
  }

  .read-more a:hover {
    background-color: #fb55a5;
    color: #ffffff;
    border-color: #fb55a5;
  }

  .read-more {
    margin-bottom: 10px;
  }

  .dslc-cpt-post-thumb-inner {
    padding-left: 40px;
    padding-right: 40px;
  }

  .main {
    /*margin-bottom:44px;*/
  }
</style>