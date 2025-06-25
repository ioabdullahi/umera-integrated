<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

<div class="card-deck project-1 image">
    <div class="row"> 
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
    
      <div class="col-md-4" >
                <div class="card" style="max-width: 100%;margin-bottom:15px;margin-top:15px;">
                <img class="card-img-top" src="<?= get_the_post_thumbnail_url(); ?>" alt="Card image cap">
                <div class="card-body">
                    <h2 class="card-title dslc-project-title text-uppercase"><?php the_title(); ?></h2>
                    <p class="card-text dslc-project-excerpt"><?php echo wp_trim_words(get_the_content(), 15, '...'); ?></p>
                    
                </div>
            </div>
       </div>
       
  <?php
        endwhile;
        wp_reset_postdata(); ?>
    <?php endif; ?>
  
</div>
</div>

<style>
.card-body{
    padding: 30px 30px 30px 30px;
}
.project-1{
    width: 1200px;
    margin: 0 auto;
}

.dslc-project-title{
    font-size: 24px;
    font-weight: 700;
    line-height: 27px;
    letter-spacing: 1px;
    font-family: 'Rubik', Helvetica,Arial,'DejaVu Sans','Liberation Sans',Freesans,sans-serif;
    text-align : left;
}

.dslc-project-excerpt {
    background-color: #ffffff;
    font-size: 14px !important;
    font-weight: 300 !important;
    margin-bottom: 22px;
    padding-top: 0px;
    border-top-style: solid;
    text-align : left;
    line-height: 23px;
    font-family: 'Rubik', Helvetica,Arial,'DejaVu Sans','Liberation Sans',Freesans,sans-serif;
}
.image img {
    height: auto;
    max-width: 100%;
    border: solid 0px;
    border-radius: 20px 20px 0px 0px;
    box-shadow: none;
    border-color: #e6e6e6;
    width: 383;
    height: 256;
}
.card {
    border-top: none;
    border-radius: 20px;
    width: 409px;
    margin-left: 12.766px;
    margin-right: 12.766px;
}
.dslc-cpt-post-read-more{
    background-color: transparent;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 400;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 12px;
    padding-right: 12px;
    border-width: 2px;
    border-style: solid solid solid solid;
    border-color: #f1f1f1;
    width: fit-content;

}
.dslc-cpt-post-read-more:hover{
    background-color: #fb55a5; 
    color:#ffffff;;
}
.dslc-cpt-post-read-more:hover a{
    background-color: #fb55a5; 
    color:#ffffff;;
}
a{
    color:#f78f3b;
}

.dslc-icon{
    margin-right: 5px;
}
.elementor-widget-container {
    color: black;
}
</style>