<?php 

function essb_is_pinterest_sniff_disabled() {
    return essb_option_value('pinterest_button') == 'featured';
}

function essb_is_sharing_selected_images_only() {
    return essb_option_value('pinterest_button_grid') == 'pinterest';
}

function essb_pin_selected_images_only() {
    return !essb_is_pinterest_sniff_disabled() && essb_is_sharing_selected_images_only();
}