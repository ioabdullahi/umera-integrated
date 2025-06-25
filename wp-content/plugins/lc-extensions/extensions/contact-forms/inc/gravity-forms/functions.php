<?php

function lcpgravityforms_script(){
    wp_enqueue_style( 'gforms_reset_css', GFCommon::get_base_url() . "/css/formreset.css", null, GFCommon::$version );
    wp_enqueue_style( 'gforms_datepicker_css', GFCommon::get_base_url() . "/css/datepicker.css", null, GFCommon::$version );
    wp_enqueue_style( 'gforms_formsmain_css', GFCommon::get_base_url() . "/css/formsmain.css", null, GFCommon::$version );
    wp_enqueue_style( 'gforms_ready_class_css', GFCommon::get_base_url() . "/css/readyclass.css", null, GFCommon::$version );
    wp_enqueue_style( 'gforms_browsers_css', GFCommon::get_base_url() . "/css/browsers.css", null, GFCommon::$version );
    wp_enqueue_script( 'gform_json', GFCommon::get_base_url() ."js/jquery.json.js");
    wp_enqueue_script( 'gform_gravityforms', GFCommon::get_base_url() ."js/gravityforms.js");
    wp_enqueue_script( 'gform_conditional_logic', GFCommon::get_base_url() ."js/conditional_logic.js");
    wp_enqueue_script( 'gform_masked_input', GFCommon::get_base_url() ."js/jquery.maskedinput.js");
    wp_enqueue_script( 'gform_datepicker_init', GFCommon::get_base_url() ."js/datepicker.js");
    wp_enqueue_script( 'gform_textarea_counter', GFCommon::get_base_url() ."js/jquery.textareaCounter.plugin.js");
}
add_action( 'wp_enqueue_scripts', 'lcpgravityforms_script' );