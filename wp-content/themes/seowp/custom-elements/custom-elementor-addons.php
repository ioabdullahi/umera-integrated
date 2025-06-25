<?php
require get_template_directory(). '/custom-elements/elementor-helper.php';

add_action( 'elementor/widgets/widgets_registered', 'seowp_elementor_elements' );

function seowp_elementor_elements($widgets_manager){
    // We check if the Elementor plugin has been installed / activated.
    if(defined('ELEMENTOR_PATH') && class_exists('Elementor\Widget_Base')) {
        require  get_template_directory(). '/custom-elements/testimonials.php'; 
        require  get_template_directory(). '/custom-elements/testimonials_lg_slider.php'; 
        require  get_template_directory(). '/custom-elements/flat_horizontal_blog.php'; 
        require  get_template_directory(). '/custom-elements/testimonials_sm_slider.php'; 
        require  get_template_directory(). '/custom-elements/flat_descriptive_blog.php';
        require  get_template_directory(). '/custom-elements/flat_customblog_hcard.php';
        require  get_template_directory(). '/custom-elements/flat_blog_blocks.php';
        require  get_template_directory(). '/custom-elements/flat_customblog_vcard.php';
        require  get_template_directory(). '/custom-elements/blog_horizontal.php'; 
        require  get_template_directory(). '/custom-elements/testimoialcenter.php';
        require  get_template_directory(). '/custom-elements/issue.php'; // 2 module
        require  get_template_directory(). '/custom-elements/project.php'; // 3 module
        require  get_template_directory(). '/custom-elements/project102.php'; // 4 module
        require  get_template_directory(). '/custom-elements/blog.php'; // 5 module
        require  get_template_directory(). '/custom-elements/book_blog.php'; // 6 module
        require  get_template_directory(). '/custom-elements/staff.php'; // 7 module
        require  get_template_directory(). '/custom-elements/testimonial102.php'; // 8 module
    }
}
