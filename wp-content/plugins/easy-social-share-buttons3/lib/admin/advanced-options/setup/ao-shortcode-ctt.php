<?php

if (function_exists('essb_advancedopts_settings_group')) {
	essb_advancedopts_settings_group('essb_options');
}

essb_advancedopts_section_open('ao-small-values');

echo '<div class="essb-floating-shortcodegenerator" data-shortcode="sharable-quote" data-content="false">';

echo '<div class="shortcode-button">';
echo '<a href="#" class="essb-ui-btn essb-ui-btn-primary essb-ui-btn-lg ao-generate-shortcode-btn">'.esc_html__('Generate Shortcode', 'essb').'</a>';
echo '</div>';

echo '<div class="shortcode-result">';
echo '</div>';

echo '<div class="shortcode-options">';

echo '<p>';
echo '<label for="cct_shortcode_type"><strong>Shortcode type</strong></label>';
echo '<select class="widefat ao-shortcode-type-select shortcode-ignore" id="cct_shortcode_type" name="cct_shortcode_type">';
echo '<option value="sharable-quote" data-set-shortcode="sharable-quote" data-set-content="false">Block Quote</option>';
echo '<option value="inline-tweet" data-set-shortcode="inline-tweet" data-set-content="true">Inline</option>';
echo '</select>';
echo '</p>';

$default_options = essb_get_shortcode_options_sharable_quote();
foreach ($default_options as $key => $setup) {
	$value = '';
	$type = $setup['type'];
	$title = isset($setup['title']) ? $setup['title'] : '';
	$description = isset($setup['description']) ? $setup['description'] : '';
	$options = isset($setup['options']) ? $setup['options'] : array();
	
	if ($type == 'textarea') {
	    echo '<p>';
	    echo '<label for="instagramfeed_shortcode_'.$key.'"><strong>'.$title.'</strong></label>';
	    echo '<textarea class="widefat" id="instagramfeed_shortcode_'.$key.'" name="instagramfeed_shortcode_'.$key.'" type="text" value="'.esc_attr($value).'" data-param="'.esc_attr($key).'"></textarea>';
	    
	    if ($description != '') {
	        echo '<em>'.$description.'</em>';
	    }
	    
	    echo '</p>';
	}
		
	if ($type == 'text') {
		echo '<p>';
		echo '<label for="instagramfeed_shortcode_'.$key.'"><strong>'.$title.'</strong></label>';
		echo '<input class="widefat" id="instagramfeed_shortcode_'.$key.'" name="instagramfeed_shortcode_'.$key.'" type="text" value="'.esc_attr($value).'" data-param="'.esc_attr($key).'" />';

		if ($description != '') {
			echo '<em>'.$description.'</em>';
		}

		echo '</p>';
	}
		
	if ($type == 'select') {
		echo '<p>';
		echo '<label for="instagramfeed_shortcode_'.$key.'"><strong>'.$title.'</strong></label>';
		echo '<select class="widefat" id="instagramfeed_shortcode_'.$key.'" name="instagramfeed_shortcode_'.$key.'" value="'.esc_attr($value).'" data-param="'.esc_attr($key).'" >';
		foreach ($options as $opt_key => $opt_value) {
			echo '<option value="'.$opt_key.'" '.($opt_key == $value ? 'selected': '').'>'.$opt_value.'</option>';
		}
		echo '</select>';

		if ($description != '') {
			echo '<em>'.$description.'</em>';
		}

		echo '</p>';
	}
}
echo '</div>'; // options
echo '</div>'; // generator