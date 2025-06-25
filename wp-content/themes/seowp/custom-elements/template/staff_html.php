<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<div class="row">
<?php
    $args = array(
        'post_type' => "dslc_staff",
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
                    $position = get_post_meta($the_query->post->ID,'dslc_staff_position');
                    $twitter = get_post_meta($the_query->post->ID,'dslc_staff_social_twitter');
                    $facebook = get_post_meta($the_query->post->ID,'dslc_staff_social_facebook');
                    $instagram = get_post_meta($the_query->post->ID,'dslc_staff_social_instagram');
                    $google_plus = get_post_meta($the_query->post->ID, 'dslc_staff_social_googleplus');
                    
                }
            }
    ?>
    
    <div class="dslc-3-col main col-md-3 mb-4 mt-4" data-cats="">
    <div class="dslc-post-thumb">
    <div class="dslc-staff-member-thumb-inner dslca-post-thumb image">
		<img width="400" height="400" src="<?= the_post_thumbnail_url(); ?>" class="attachment-full size-full wp-post-image" alt="" decoding="async" title="avatar-6" >
	</div>
	    <div class="about">
			    <div class="dslc-staff-member-social">
                    <a target="_blank" href="<?= isset($twitter[0]) ? $twitter[0] : "#" ?>"><span class="dslc-icon dslc-icon-twitter"></span></a>
					<a target="_blank" href="<?= isset($facebook[0]) ? $facebook[0] : "#" ?>"><span class="dslc-icon dslc-icon-facebook"></span></a>
					<a target="_blank" href="<?= isset($google_plus[0]) ? $google_plus[0] : "#" ?>"><span class="dslc-icon dslc-icon-google-plus"></span></a>
					<a target="_blank" href="<?= isset($instagram[0]) ? $instagram[0] : "#" ?>"><span class="dslc-icon dslc-icon-linkedin"></span></a>
				</div>
            <div class="dslc-staff-member-main">
                <div class="dslc-staff-member-title"><h2><a href="/staff-view/maria-murphy/"><?php the_title(); ?></a></h2></div>
                <div class="dslc-staff-member-position"><?= isset($position[0]) ? $position[0] : "" ?></div>
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
    body{
        font-family: 'Rubik', Helvetica,Arial,'DejaVu Sans','Liberation Sans',Freesans,sans-serif;
    }
    .dslc-3-col.main {
        max-width: 300px;
    }
    .dslc-staff-member-social {
        text-align: center;
        background-color: #ffffff;
        padding-top: 16px;
        padding-bottom: 16px;
        border-bottom:solid rgba(126,128,128,0.08) 1px;
        border-width: 1px;
        /*border-style: none none solid none;*/
    }
    .about{
        border:solid rgba(126,128,128,0.08) 1px;
        text-align:center;
        background:white !important;
        border-bottom-left-radius:14px;
        border-bottom-right-radius:14px;
    }
    img {
        border-top-left-radius:14px !important;
        border-top-right-radius:14px !important;
    }
    .dslc-staff-member-social a {
        color: rgba(31,32,65,0.43);
        font-size: 18px !important;
        font-weight: 500;
        line-height: 27px;
    }
    .dslc-staff-member-main {
        background-color: #ffffff;
        min-height: 120px;
        padding: 29px 30px 29px 30px;
        text-align: center;
        border-bottom-left-radius: 13px;
        border-bottom-right-radius: 13px;
    }
    .main{
        border-radius:14px !important;
        width:100%;
    }
    .dslc-staff-member-position {
    color: #9396e1;
    font-size: 15px;
    font-weight: 300;
    font-style: normal;
    }
    .dslc-staff-member-title h2{
            font-size: 24px !important;
            font-weight: 500;
            line-height: 27px;
    }
    
</style>