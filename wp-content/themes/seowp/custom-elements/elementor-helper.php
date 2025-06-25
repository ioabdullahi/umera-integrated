<?php
namespace Elementor;
function seowp_elementor_init(){
    Plugin::instance()->elements_manager->add_category(
        'seowp-pro-elements',

        [
            'title'  => 'SEOWP Custom Elements',
            'icon' => 'font'
        ],
        1
    );
}
add_action('elementor/init','Elementor\seowp_elementor_init');