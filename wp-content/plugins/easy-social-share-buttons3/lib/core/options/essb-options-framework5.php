<?php

class ESSBOptionsFramework {
	
	public static $color_fields = array();
	public static $was_lastrow_even = false;
	public static $section_active = false;
	public static $headings_count = 0;
	public static $heading_navigations = array();
	
	public static $default_settings_group = "essb_options";
	public static $options_cache = array();
	
	public static function reset_row_status() {
		self::$was_lastrow_even = false;
		self::$heading_navigations = array();
	}
	
	public static function external_options_value ($key, $param) {
		$value = '';
		if (!isset(self::$options_cache[$key])) {
			$settings_key = self::option_keys_to_settings($key);
			
			if (!empty($settings_key)) {
				self::$options_cache[$key] = get_option($settings_key);
			}						
		}
	
		
		if (isset(self::$options_cache[$key])) {
			$value = isset(self::$options_cache[$key][$param]) ? self::$options_cache[$key][$param] : '';
		}
		
		return $value;
	}
	
	public static function option_keys_to_settings($key) {
		$table = array('essb3_of' => 'essb3-of', 
				'essb3_ofob' => 'essb3-ofob', 
				'essb3_ofof' => 'essb3-ofof',
				'essb_fake' => 'essb-fake',
				'essb_hook' => 'essb-hook',
		        'essb3_oflock' => 'essb3-oflock'
		);
		
		if (has_filter('essb_additional_settings_key')) {
			$table = apply_filters('essb_additional_settings_key', $table);
		}
		
		return isset($table[$key]) ? $table[$key] : '';
	}
	
	public static function draw_options_field($option, $custom = false, $user_settings = array()) {
		global $essb_admin_options, $essb_admin_options_fanscounter, $essb_translate_options;
		
		
		$type = $option['type'];
		$title = isset($option['title']) ? $option['title'] : '';
		$submenu_link = isset($option['submenu_link']) ? $option['submenu_link'] : "";
		$description = isset($option['description']) ? $option['description'] : "";
		$id = isset($option['id']) ? $option['id'] : '';
		$icon = isset($option['icon']) ? $option['icon'] : '';
		$icon_position = isset($option['icon_position']) ? $option['icon_position'] : '';
		
		$on_text = isset($option['on_label']) ? $option['on_label'] : "";
		$off_text = isset($option['off_label']) ? $option['off_label'] : "";
		$listOfValues = isset($option['values']) ? $option['values'] : array();
		$class = isset($option['class']) ? $option['class'] : '';
		$mode = isset($option['mode']) ? $option['mode'] : 'htmlmixed';
		$recommended = isset($option['recommended']) ? $option['recommended'] : '';
		$select2_options = isset($option['select2_options']) ? $option['select2_options'] : array();
		
		$width = isset($option['width']) ? $option['width'] : '';
		$title_position = isset($option['title_position']) ? $option['title_position'] : '';
		$colwidth = isset($option['colwidth']) ? $option['colwidth'] : '';
		$style = isset($option['style']) ? $option['style'] : '';
		$in_section = isset($option['in_section']) ? $option['in_section'] : '';
		$element_options = isset($option['element_options']) ? $option['element_options']: array();
		$col_width = isset($option['col_width']) ? $option['col_width'] : '';
		$shortcode = isset($option['shortcode']) ? $option['shortcode'] : '';
		$alpha = isset($option['alpha']) ? $option['alpha'] : '';
		$row_wrap = isset($option['row_wrap']) ? $option['row_wrap'] : ''; 
		
		$settings_group = self::$default_settings_group;
		$is_fans_counter = false;
		if (strpos($id, 'essb3fans_') !== false) {
			$option_value = isset($essb_admin_options_fanscounter[$id]) ? $essb_admin_options_fanscounter[$id] : '';
			$settings_group = "essb_options_fans";
			$is_fans_counter = true;
		}
		else if(strpos($id, 'wpml_') !== false) {
			$option_value = isset($essb_translate_options[$id]) ? $essb_translate_options[$id] : '';
		}
		else if(strpos($id, '|') !== false) {
			$data_components = explode('|', $id);
			$settings_group = $data_components[0];
			$id = $data_components[1];
			$option_value = self::external_options_value($settings_group, $id);
		}
		else {
			$option_value = isset($essb_admin_options[$id]) ? $essb_admin_options[$id] : '';
		}
		
		if ($custom) {
			$option_value = isset($user_settings[$id]) ? $user_settings[$id] : '';
		}
		
		switch ($type) {
			case "heading1":
				self::draw_heading($title, '1', $submenu_link, '', $class);
				break;
			case "heading2":
				self::draw_heading($title, '2', $submenu_link, '', $class);
				break;
			case "heading3":
				self::draw_heading($title, '3', $submenu_link, '', $class);
				break;		
			case "heading4":
				self::draw_heading($title, '4', $submenu_link, $description, $class);
				break;		
			case "heading5":
				self::draw_heading($title, '5', $submenu_link, $description, $class);
				break;		
			case "heading6":
				self::draw_heading($title, '6', $submenu_link, $description, $class);
				break;
			case "heading7":
			    self::draw_heading($title, '7', $submenu_link, $description, $class, isset($option['icon']) ? $option['icon'] : '');
			    break;
			case "switch":
				self::draw_options_row_start($title, $description, $recommended, $col_width, '', 'essb_field_' . $id, $id);
				self::draw_switch_field($id, $settings_group, $option_value, $on_text, $off_text, $class);
				self::draw_options_row_end();
				break;		
			case "switch-in-panel":
			    self::draw_advanced_options_panel_start($title, 'ao-panel-'.$id, true, array(), 'essb_field_' . $id, $id);
				self::draw_switch_field($id, $settings_group, $option_value, $on_text, $off_text, $class);
				self::draw_advanced_options_panel_end($description, true);
				break;		
			case "text":
				self::draw_options_row_start($title, $description, $recommended, $col_width, '', 'essb_options_'.$id, $id);
				self::draw_input_field($id, false, $settings_group, $option_value, $icon, $class, $icon_position, '', $element_options);
				self::draw_options_row_end();
				break;		
			case "text-in-panel":
				self::draw_advanced_options_panel_start($title, 'ao-panel-'.$id);
				self::draw_input_field($id, false, $settings_group, $option_value, $icon, $class, $icon_position, '', $element_options);
				self::draw_advanced_options_panel_end($description);
				break;
			case "text-in-panel-stretched":
				self::draw_advanced_options_panel_start($title, 'ao-panel-'.$id, false, array('class' => 'stretched'));
				self::draw_input_field($id, true, $settings_group, $option_value, $icon, $class, $icon_position, '', $element_options);
				self::draw_advanced_options_panel_end($description);
				break;				
			case "text-stretched":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', 'essb_options_'.$id, $id);
				self::draw_input_field($id, true, $settings_group, $option_value, $icon, $class, $icon_position, '', $element_options);
				self::draw_options_row_end();
				break;		
			case "checkbox":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_checkbox_field($id, $settings_group, $option_value);
				self::draw_options_row_end();
				break;		
			case "checkbox_list":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_checkbox_list_field($id, $listOfValues, $settings_group, $option_value, $element_options);
				self::draw_options_row_end();
				break;		
			case "checkbox_list_sortable":
				
				
				if (!$is_fans_counter) {
					$ordered_values = isset($essb_admin_options[$id.'_order']) ? $essb_admin_options[$id.'_order'] : array();
				}
				else {
					//$essb_admin_options_fanscounter
					$ordered_values = isset($essb_admin_options_fanscounter[$id.'_order']) ? $essb_admin_options_fanscounter[$id.'_order'] : array();					
				}			
				
				if (is_array($ordered_values) && count($ordered_values) > 0) {
				    $listOfValues = $ordered_values;
				    
				    /**
				     * @since 8.5 Apply the additional networks that are required
				     */
				    if ($is_fans_counter) {
				        if (has_filter('essb4_followers_networks_update_list')) {
				            $listOfValues = apply_filters('essb4_followers_networks_update_list', $listOfValues);
				        }
				    }
				    else {
				        if (strpos($id, "profile_") === false) {
				            if (has_filter('essb4_social_networks_update_list')) {
				                $listOfValues = apply_filters('essb4_social_networks_update_list', $listOfValues);
				            }
				            
				            if (function_exists('essb_available_social_profiles')) {
				                $all_profiles = essb_available_social_profiles();
				            }
				        }
				        else {
				            if (has_filter('essb4_profile_networks_update_list')) {
				                $listOfValues = apply_filters('essb4_profile_networks_update_list', $listOfValues);
				            }
				        }
				    }
				    
				    // transform the values
				    $listOfValues = self::translate_key_array($listOfValues);
				    
				    if ($is_fans_counter) {
				        $listOfValues = self::remove_old_networks(ESSBSocialFollowersCounterHelper::available_social_networks(), $listOfValues);
				    }
				    else {
				        if (strpos($id, "profile_") !== false) {
				            $listOfValues = self::remove_old_networks(essb_available_social_profiles(), $listOfValues);
				        }
				    }
				}
				
				
				self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_checkbox_list_sortable_field($id, $listOfValues, $settings_group, $option_value, $style);
				self::draw_options_row_end();
				break;		
			case "select":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', 'essb_options_'.$id, $id);
				self::draw_select_field($id, $listOfValues, false, $settings_group, $option_value, $element_options);
				self::draw_options_row_end();
				break;	
			case "select-in-panel":
				self::draw_advanced_options_panel_start($title, 'settings-panel-'.$id);
				self::draw_select_field($id, $listOfValues, false, $settings_group, $option_value, $element_options);
				self::draw_advanced_options_panel_end($description);
				break;	
			case "textarea":
			    self::draw_options_row_start($title, $description, '', $col_width, '', 'essb_options_'.$id, $id);
			    self::draw_textarea_field($id, $settings_group, $option_value, '', isset($option['rows']) ? $option['rows'] : '');
				self::draw_options_row_end();
				break;
			case "editor":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_editor_field($id, $settings_group, $option_value, $mode);
				self::draw_options_row_end();
				break;
			case "wpeditor":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_wpeditor_field($id, $settings_group, $option_value);
				self::draw_options_row_end();
				break;
			case "color":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', 'essb_field_' . $id, $id);
				if ($alpha == 'true') {
					self::draw_acolor_field($id, $settings_group, $option_value);
				}
				else {
					self::draw_color_field($id, $settings_group, $option_value);
				}
				self::draw_options_row_end();
				break;
			case "color-in-panel":
				self::draw_advanced_options_panel_start($title, 'settings-panel-'.$id);
				if ($alpha == 'true') {
					self::draw_acolor_field($id, $settings_group, $option_value);
				}
				else {
					self::draw_color_field($id, $settings_group, $option_value);
				}
				self::draw_advanced_options_panel_end($description);
				break;
			case "image_checkbox":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_image_checkbox_field($id, $listOfValues, $settings_group, $option_value);
				self::draw_options_row_end();
				break;
			case "html_checkbox_buttons":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_image_checkbox_field($id, $listOfValues, $settings_group, $option_value, array('html' => 'true', 'shortcode' => $shortcode, 'width' => $width, 'buttons' => 'true'));
				self::draw_options_row_end();
				break;
			case "image_radio":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_image_radio_field($id, $listOfValues, $settings_group, $option_value);
				self::draw_options_row_end();
				break;
			case "html_radio":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_image_radio_field($id, $listOfValues, $settings_group, $option_value, array('html' => 'true', 'shortcode' => $shortcode, 'width' => $width));
				self::draw_options_row_end();
				break;
			case "html_radio_buttons":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_image_radio_field($id, $listOfValues, $settings_group, $option_value, array('html' => 'true', 'shortcode' => $shortcode, 'width' => $width, 'buttons' => 'true'));
				self::draw_options_row_end();
				break;
			case "func":
				if ($title != '') {
				    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				}
				else {
					self::draw_options_row_start_full();
				}
				if (function_exists($id)) {					
					$id($option);
				}
				if ($title != '') {
					self::draw_options_row_end();
				}
				else {
					self::draw_options_row_end();
				}
				break;
			case "component":
				
				if ($row_wrap == 'true') {
					self::draw_options_row_start_full();
				}
				
				if (function_exists($id)) {
					$id($option);
				}
				
				if ($row_wrap == 'true') {
					self::draw_options_row_end();
				}
				
				break;
			case "file":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_fileselect_field($id, $settings_group, $option_value, $icon, $class);
				self::draw_options_row_end();
				break;	
			case "fileimage":
				if ($mode == 'vertical') {
					self::draw_title($title, $description, 'inner-row');
					self::draw_options_row_start_full($class);
					self::draw_fileselect_image_field($id, $settings_group, $option_value, $icon, $class.$mode);
					self::draw_options_row_end();
				}
				else {
				    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
					self::draw_fileselect_image_field($id, $settings_group, $option_value, $icon, $class.$mode);
					self::draw_options_row_end();
				}
				break;
			case "simplesort":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_simplesort_field($id, $listOfValues, $settings_group, $option_value);
				self::draw_options_row_end();
				break;
			case 'section_start':
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_section_start();
				self::$section_active = true;
				break;
			case 'section_end':
				self::draw_section_end();
				self::draw_options_row_end();
				self::$section_active = false;
				break;
			case "select2":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_select2_field($id, $listOfValues, false, $settings_group, $option_value, $select2_options);
				self::draw_options_row_end();
				break;	
			case 'section_start_panels':
				self::draw_options_row_start($title, $description, $recommended, $col_width, $title_position);
				self::$section_active = true;
				break;
			case 'section_end_panels':
				self::draw_options_row_end();
				self::$section_active = false;
				break;

			case 'section_start_full_panels':
				$user_class = isset($element_options['css_class']) ? $element_options['css_class'] : '';
				self::draw_options_row_start_full($user_class);
				self::$section_active = true;
				break;
			case 'section_end_full_panels':
				self::draw_options_row_end();
				self::$section_active = false;
				break;
			case 'structure_section_start':
				self::draw_structure_section_start($width, $title, $description, $title_position, $colwidth, $element_options);
				break;
			case 'structure_section_end':
				self::draw_structure_section_end($title_position);
				break;
			case 'structure_row_start':
				self::draw_structure_row_start($class);
				break;
			case 'structure_row_end':
				self::draw_structure_row_end();
				break;	
			case "hint":
				self::draw_hint($title, $description, $icon, $style, $in_section);
				break;	
			case "help":
				self::draw_help($title, $description, $in_section, $element_options);
				break;	
			case "panel_start":
				self::draw_panel_start($title, $description, $icon, $element_options, $settings_group);
				break;
			case 'panel_end':
				self::draw_panel_end();
				break;	
			case "tabs_start":
				self::draw_tabs_start($listOfValues, $element_options);
				break;
			case 'tabs_end':
				self::draw_tabs_end();
				break;	
			case "tab_start":
				self::draw_tab_start($element_options);
				break;
			case 'tab_end':
				self::draw_tab_end();
				break;	
			case 'title':
				self::draw_title($title, $description, $class);
				break;
			// version 5 new components
			case "holder_start":
				self::draw_holder_start($element_options);
				break;
			case 'holder_end':
				self::draw_holder_end();
				break;
			case "toggle":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_toggle_field($id, $listOfValues, $settings_group, $option_value, $element_options);
				self::draw_options_row_end();
				break;
			case "toggle-in-panel":
				
				$add_class = isset($element_options['extra_class']) ? $element_options['extra_class'] : $id;
				
				self::draw_settings_panel_start($title, $add_class);
				self::draw_toggle_field($id, $listOfValues, $settings_group, $option_value, $element_options);
				self::draw_settings_panel_end($description, $recommended);
				break;
			case "group-select":
			    self::draw_options_row_start($title, $description, $recommended, $col_width, '', '', $id);
				self::draw_group_select_field($id, $listOfValues, $settings_group, $option_value, $element_options);
				self::draw_options_row_end();
				break;
			case "group-select-in-panel":
				self::draw_settings_panel_start($title, $id);
				self::draw_group_select_field($id, $listOfValues, $settings_group, $option_value, $element_options);
				self::draw_settings_panel_end($description, $recommended);
				break;
			case "network-select":
				self::draw_network_select($id, $settings_group, $element_options);
				break;
			case "template-select":
				self::draw_options_row_start_full('');			
				self::draw_template_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;
			case "buttonstyle-select":
				self::draw_options_row_start_full('');
				self::draw_buttonstyle_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;
			case "counterposition-select":
				self::draw_options_row_start_full('');
				self::draw_counterposition_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;
			case "totalcounterposition-select":
				self::draw_options_row_start_full('');
				self::draw_totalcounterposition_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;
			case "animation-select":
				self::draw_options_row_start_full('');
				self::draw_animation_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;
			case "single-position-select":
				self::draw_options_row_start_full('');
				self::draw_single_position_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;
			case "multi-position-select":
				self::draw_options_row_start_full('');
				self::draw_multi_position_select($id, $settings_group, $element_options);
				self::draw_options_row_end();
				break;	
			case "advanced-settings-panel-open":
				echo essb5_generate_code_advanced_setting_panel_open($title, $description, $element_options);
				break;		
			case "advanced-settings-panel-close":
				echo essb5_generate_code_advanced_setting_panel_close();
				break;	
		}
	}

	public static function draw_multi_position_select($field, $group = 'essb_options', $element_options = array()) {
		$values = isset($element_options['values']) ? $element_options['values'] : '';
		essb_component_multi_position_select($values, $field, $group);
	}
	
	public static function draw_single_position_select($field, $group = 'essb_options', $element_options = array()) {
		$values = isset($element_options['values']) ? $element_options['values'] : '';
		essb_component_single_position_select($values, $field, $group);
	}
	
	
	public static function draw_animation_select($field, $group = 'essb_options', $element_options = array()) {
		$position = isset($element_options['position']) ? $element_options['position'] : '';
		essb_component_animation_select($position, $group);
	}
	
	public static function draw_totalcounterposition_select($field, $group = 'essb_options', $element_options = array()) {
		$position = isset($element_options['position']) ? $element_options['position'] : '';
		essb_component_totalcounterpos_select($position, $group);
	}
	
	
	public static function draw_counterposition_select($field, $group = 'essb_options', $element_options = array()) {
		$position = isset($element_options['position']) ? $element_options['position'] : '';
		essb_component_counterpos_select($position, $group);
	}
	
	public static function draw_buttonstyle_select($field, $group = 'essb_options', $element_options = array()) {
		$position = isset($element_options['position']) ? $element_options['position'] : '';
		$pinterest_mode = isset($element_options['pinterest_mode']) ? $element_options['pinterest_mode'] : false;
		essb_component_buttonstyle_select($position, $group, $pinterest_mode);
	}
	
	
	public static function draw_template_select($field, $group = 'essb_options', $element_options = array()) {
		$position = isset($element_options['position']) ? $element_options['position'] : '';
		$buttons = isset($element_options['buttons']) ? $element_options['buttons'] : '';
		essb_component_template_select($position, $group, $buttons);
	}
	
	
	public static function draw_network_select($field, $group = 'essb_options', $element_options = array()) {
		$position = isset($element_options['position']) ? $element_options['position'] : '';
		$all_networks = isset($element_options['all_networks']) ? $element_options['all_networks'] : false;
		essb_component_network_selection($position, $group, $all_networks);
	}
	
	public static function draw_toggle_field($field, $listOfValues, $group = 'essb_options', $value = '', $element_options = array()) {
		$user_size = isset($element_options['size']) ? $element_options['size'] : '';
		$add_class = isset($element_options['add_class']) ? $element_options['add_class'] : '';
		
		essb_component_options_group_select($field, $listOfValues, $user_size, $value, $group, $add_class);
	}
	
	public static function draw_group_select_field($field, $listOfValues, $group = 'essb_options', $value = '', $element_options = array()) {
		$user_size = isset($element_options['size']) ? $element_options['size'] : '';
	
		essb_component_options_group_select_multiple($field, $listOfValues, $user_size, $value, $group);
	}
	
	public static function draw_title($title = '', $description = '', $class = '') {
		self::draw_options_row_start_full($class);
		
		if ($title != '') {
			print '<strong class="essb-title">' .$title .'</strong>';
		}
		
		if ($description != '') {
			if ($title != '') { print '<br/>'; }
			print '<span class="label">'.($description).'</span>';
		}
		
		self::draw_options_row_end();
	}

	public static function draw_tab_start($element_options = array()) {
		$element_id = isset($element_options['element_id']) ? $element_options['element_id'] : '';
		$active = isset($element_options['active']) ? $element_options['active'] : '';
	

		print '<div class="essb-section-tab ess-section-tab-'.esc_attr($element_id).($active == 'true' ? " active": '').'" id="'.esc_attr($element_id).'">';
		
	}
	
	public static function draw_tab_end() {
		print '</div>'; // tab
	}
	
	public static function draw_holder_start($element_options = array()) {
		$class = isset($element_options['class']) ? $element_options['class'] : '';
		$user_id = isset($element_options['user_id']) ? $element_options['user_id'] : '';
	
	
		print '<div class="essb-section-holder '.esc_attr($class).'" id="'.esc_attr($user_id).'">';
	
	}
	
	public static function draw_holder_end() {
		print '</div>'; // tab
	}
	
	public static function draw_tabs_start($values, $element_options = array()) {
		$vertical = isset($element_options['vertical']) ? $element_options['vertical'] : '';
		$element_id = isset($element_options['element_id']) ? $element_options['element_id'] : '';
		$active_tab = isset($element_options['active_tab']) ? $element_options['active_tab'] : '';
		$css_class = isset($element_options['css_class']) ? $element_options['css_class'] : '';
		$full_width = isset($element_options['fullwidth']) ? $element_options['fullwidth'] : 'false';
		
		$mark_as_active = 0;
		
		if (intval($active_tab) != 0) {
			$mark_as_active = intval($active_tab);
		}
		
		$tab_styles = '';
		if ($full_width == 'true') {
			$count_of_all = count($values);
			$single_width = round(100 / $count_of_all, 3);
			$tab_styles = ' style="width:'.$single_width.'%;"';
		}
		
		print '<div class="essb-section-tabs '.($vertical == 'true' ? " essb-section-tabs-vertical" : " essb-section-tabs-linear").' '.esc_attr($css_class).'">';
		print '<div class="essb-section-tabs-navigation">';
		
		$tab_count = 0;
		print '<ul>';
		foreach ($values as $tab) {
			print '<li class="essb-section-tabs-single'.($tab_count == $mark_as_active ? " active": "").'" data-tab="'.esc_attr($element_id).'-'.esc_attr($tab_count).'"'.($tab_styles).' id="essb-tabs-'.esc_attr($element_id).'-'.esc_attr($tab_count).'">'.($tab).'</li>';
			$tab_count++;
		}
		
		print '</ul>';
		print '</div>';
		
		print '<div class="essb-section-tabs-container">';
	}
	
	public static function draw_tabs_end() {
		print '</div>'; // container
		print '</div>'; // tab
	}
	
	public static function draw_panel_start($title = '', $description = '', $icon = '', $element_options = array(), $settings_group = 'essb_options') {
		global $essb_admin_options;
		
		self::draw_options_row_start_full();
		
		$style = isset($element_options['style']) ? $element_options['style'] : '';
		$mode = isset($element_options['mode']) ? $element_options['mode'] : '';
		$state = isset($element_options['state']) ? $element_options['state'] : '';
		$switch_id = isset($element_options['switch_id']) ? $element_options['switch_id'] : '';
		$switch_value = ($switch_id != '') ? essb_option_value($switch_id) : '';
		$switch_on = isset($element_options['switch_on']) ? $element_options['switch_on'] : '';
		$switch_off = isset($element_options['switch_off']) ? $element_options['switch_off'] : '';
		$switch_submit = isset($element_options['switch_submit']) ? $element_options['switch_submit'] : '';
		$css_class = isset($element_options['css_class']) ? $element_options['css_class'] : '';
		
		// @since 7.7.2 SVG icon support for the panels
		$svg_icon = isset($element_options['svg_icon']) ? $element_options['svg_icon'] : '';
		if ($svg_icon != '' && $icon != '') {
		    $icon = '';
		}
		
		if ($description == '') { 
			$css_class .= ' essb-portlet-notdesc';
		}
		
		/**
		 * Add active class if opened
		 */
		if ($mode == 'switch' && $switch_value == 'true') {
		    $css_class .= ' portlet-active';
		}

		print '<div class="essb-portlet'.($style != "" ? " essb-portlet-".esc_attr($style) : "").($mode != '' ? ' essb-portlet-'.$mode : '').($switch_submit == 'true' ? ' essb-portlet-submit' : '').($css_class != '' ? ' '.esc_attr($css_class): '').'">';
		
		print '<div class="essb-portlet-heading'.($state == 'closed' ? ' essb-portlet-heading-closed' : '').($switch_submit == 'true' ? ' essb-portlet-submit' : '').'">';

		echo '<div class="essb-portlet-flex '.($switch_submit == 'true' ? ' essb-portlet-submit' : '').'">';
		
		if ($icon != '') {
		    print '<div class="essb-portlet-heading-icon"><i class="'.esc_attr($icon).'"></i></div>';
		}
		else if ($svg_icon != '') {
		    print '<div class="essb-portlet-heading-icon">'.$svg_icon.'</div>';
		}
		
		print "<h3>".$title.'</h3>';
		
		if ($mode != '') {
		    if ($mode == 'toggle') {
		        print '<div class="essb-portlet-state">';
		        if ($state == 'closed') {
		            print '<i class="fa fa-chevron-right"></i>';
		        }
		        else {
		            print '<i class="fa fa-chevron-down"></i>';
		        }
		        print '</div>';
		    }
		    
		    if ($mode == 'switch') {
		        print '<div class="essb-portlet-state essb-portlet-state-switch">';
		        self::draw_switch_field($switch_id, $settings_group, $switch_value, $switch_on, $switch_off);
		        print '</div>';
		        
		        if ($switch_value != 'true') {
		            $state = 'closed';
		        }
		    }
		}
		
		echo '</div>';		
        
        if ($description != '') {
			print '<div class="essb-portlet-description">'.($description).'</div>';
		}
		 		
		print '</div>';		
		// end: heading
		
		print '<div class="essb-portlet-content'.($state == 'closed' ? ' essb-portlet-content-closed' : '').'">';
		
		print '<div class="essb-portlet-content-separator"></div>';
		
		
	}
	
	public static function draw_panel_end() {
		print '</div>'; // content
		print '</div>'; // panel
		
		self::draw_options_row_end();
	}
	
	public static function generate_ui_badge($badge = '', $style = 'default', $size = 'default') {
		$output = '';

		$output .= '<span class="essb-ui-badge essb-ui-badge-'.$size.' essb-ui-badge-'.$style.'">'.$badge.'</span>';
		return $output;
	}

	public static function generate_card_hint($title = '', $description = '', $icon = '', $badge = '', $action_link = '', $style = '') {
		$output = '';

		if (empty($style)) {
			$style = 'default';
		}

		$output .= '<div class="essb-ui-card essb-hint essb-hint-style-'. $style .'">';

		$output .= '<div class="essb-ui-card-content">';

		$output .= '<div class="essb-ui-flex essb-ui-align-center essb-ui-justify-between essb-ui-flex100">';

		// heading and icon
		$output .= '<div class="essb-ui-flex essb-ui-align-center essb-ui-gap-2">';

		// icon
		if (!empty($icon)) {
			$output .= '<div class="essb-ui-icon-frame">';
			$output .= '<svg class="essb-ui-svg-frame essb-ui-svg-frame-primary" fill="none" height="48" viewBox="0 0 44 48" width="44" xmlns="http://www.w3.org/2000/svg">
							<path d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506 
			18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937 
			39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z" fill="">
							</path>
							<path d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506 14.3196 43.1506 
			18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919 47.1572 19.8081 47.1572 16.25 45.1029L6.59937 
			39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365 14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z" stroke="">
							</path>
						</svg>';
			$output .= '<i class="essb-ui-svg-icon essb-ui-svg-primary-icon">';
			$output .= essb_ui_get_svg_icon($icon);
			$output .= '</i>';
			$output .= '</div>';
		}

		// title/desc
		$output .= '<div class="essb-ui-flex essb-ui-flex-col essb-ui-gap-1.5">';

		if (!empty($title)) {
			$output .= '<div class="essb-ui-font-semibold essb-ui-line-height-sm essb-ui-text-base essb-ui-flex essb-ui-align-center essb-ui-gap-1.5">' . $title . '</div>';
		}

		if (!empty($description)) {
			$output .= '<div class="essb-ui-line-height-base">' . $description . '</div>';
		}

		$output .= '</div>'; // title/desc

		$output .= '</div>'; // heading and icon

		// badge and action
		$output .= '<div class="essb-ui-flex essb-ui-align-center essb-ui-gap-2.5">';

		if (!empty($badge)) {
			$output .= $badge;
		}

		if (!empty($action_link)) {
			$output .= $action_link;
		}

		$output .= '</div>';

		$output .= '</div>'; // flex-sub-cart-content

		$output .= '</div>'; // essb-ui-card-content

		$output .= '</div>';

		return $output;
	}

	public static function draw_card_hint($title = '', $description = '', $icon = '', $badge = '', $action_link = '', $style = '') {
		echo self::generate_card_hint($title, $description, $icon, $badge, $action_link, $style);
	}

	public static function draw_hint($title = '', $description = '', $icon = '', $style = '', $in_section = 'false') {
		
		self::draw_options_row_start_full();
		
		print '<div class="essb-options-hint'.($style != "" ? " essb-options-hint-".esc_attr($style) : "").'">';
		
		if ($icon != '') {
			print '<div class="essb-options-hint-icon"><i class="'.esc_attr($icon).'"></i></div>';
			print '<div class="essb-options-hint-withicon">';
		}
		
		if ($title != '') {
			printf('<div class="essb-options-hint-title">%1$s</div>', ($title));
		}
		if ($description != '') {
			printf('<div class="essb-options-hint-desc">%1$s</div>', ($description));
		}
		
		if ($icon != '') { print '</div>'; }
		
		print '</div>';
		
		self::draw_options_row_end();
	}
	
	public static function draw_help($title = '', $description = '', $in_section = 'false', $element_options = array()) {
		$buttons = isset($element_options['buttons']) ? $element_options['buttons'] : array();
		
		if (count($buttons) == 0) {
			return;
		}
				
		$callback_url = '';
		
		if (count($buttons) == 1) {
			foreach ($buttons as $title => $url) {
				$callback_url = $url;
			}
		}
		
		echo '<div class="essb-options-helprow" data-url="'.esc_url($callback_url).'">';
		
		echo '<div class="help-heading">';
		echo '<div class="help-action-btn">';
		echo '<div class="icon"><i class="fa32 ti-help-alt"></i></div>';
		echo '<div class="cta">'.esc_html__('Need Help?', 'essb').'</div>';
		echo '</div>'; // help-action-btn
		echo '</div>';
		
		if (count($buttons) > 1) {
			echo '<div class="help-details">';
			
			if ($title != '') {
				echo '<div class="title">'.$title.'</div>';
			}
			
			if ($description != '') {
				echo '<div class="desc">'.$description.'</div>';
			}
			
			echo '<div class="buttons">';
			foreach ($buttons as $title => $url) {
				echo '<div class="single-button"><a href="'.esc_url($url).'" target="_blank" class="button-help">'.($title).'<i class="fa fa-external-link"></i></a></div>';
			}
			echo '</div>';
			
			echo '</div>';
		}
		
		echo '</div>';
	}

	public static function draw_help_legacy($title = '', $description = '', $in_section = 'false', $element_options = array()) {
			
		$buttons = isset($element_options['buttons']) ? $element_options['buttons'] : array();		
		
		self::draw_options_row_start_full();
	
		print '<div class="essb-options-hint essb-options-hint-glowhelp">';
	
		print '<div class="essb-options-hint-icon"><i class="fa32 ti-help-alt"></i></div>';
		print '<div class="essb-options-hint-withicon">';
	
		if ($title != '') {
			printf('<div class="essb-options-hint-title">%1$s</div>', ($title));
		}
		if ($description != '') {
			printf('<div class="essb-options-hint-desc">%1$s</div>', ($description));
		}
		
		if (count($buttons) > 0 ){
			print '<div class="essb-options-hint-buttons">';
			foreach ($buttons as $title => $url) {
				print '<a href="'.esc_url($url).'" target="_blank">'.($title).'</a>';
			}
			print '</div>';
		}
		
		echo '<span class="deactivate-link deactivate-help-hint">'.esc_html__('Hide help hints', 'essb').'</span>';
	
	
		print '</div>';

	
		print '</div>';
	
		self::draw_options_row_end();
	}
	
	public static function draw_structure_row_start($class = '') {
		$row_class = "";
		if (!self::$section_active) {
			$row_class = (self::$was_lastrow_even) ? "odd" : "even";
			self::$was_lastrow_even = !self::$was_lastrow_even;
		}
		
		if ($class != '') { $row_class .= ' '.$class; }
		
		printf('<div class="essb-flex-grid-r %1$s table-border-bottom">', esc_attr($row_class));
	}
	
	public static function draw_structure_row_end() {
		print '</div>';
	}
	
	public static function draw_structure_section_end($position = 'top') {
		if ($position == 'left') {
			print '</div>';
		}
		
		print '</div>';
	}
	
	public static function draw_structure_section_start($width = '', $title = '', $description = '', $position = 'top', $colwidth = '', $element_options = array()) {
		if ($width == '') {
			$width = 'c12'; // full row if no custom width is applied;
		}
		
		if (isset($element_options) && isset($element_options['additional_class'])) {
			$width .= ' '.$element_options['additional_class'];
		}

		printf('<div class="essb-flex-grid-c %1$s">', $width);
		
		if ($position == '') { $position = 'top'; }
		
		if ($title != '') {
			print '<div class="essb-flex-grid-r">';
			
			if ($position == 'top') {
				print '<div class="essb-flex-grid-c c12 bold">';
				echo '<span class="title">'.($title).'</span>';
				
				if ($description != '') {
					print '<br/><span class="label">'.($description).'</span>';
				}
				print '</div>';
				
				print '</div>';
			}
			if ($position == 'left') {
				
				$col1 = '3';
				$col2 = '9';
				
				if (intval($colwidth) > 0) {
					$col1 = $colwidth;
					$col2 = 12 - intval($col1);
				} 
				
				print '<div class="essb-flex-grid-c c'.esc_attr($col1).' bold">';
				echo '<span class="title">'.esc_html($title).'</span>';
				
				if ($description != '') {
					print '<br/><span class="label">'.($description).'</span>';
				}
				print '</div>';
				echo '<div class="essb-flex-grid-c c'.esc_attr($col2).'">';
			}
		}
	}
	
	/**
	 * Simple row opening element with title, description and elementid for attribution
	 * 
	 * @param string $title
	 * @param string $description
	 * @param string $element_id
	 */
	public static function draw_options_row_start_advanced_panel($title = '', $description = '', $element_id = '') {
	    if (empty($title)) {
	        self::draw_options_row_start_full();
	        return;
	    }
	    
	    $recommended = '';
	    
	    $basic_param_col = '4';
	    $basic_value_col = '8';
	    
	    $col_width = 0;
	    if (intval($col_width) > 0) {
	        $basic_param_col = $col_width;
	        $basic_value_col = 12 - $col_width;
	    }
	    
	    $row_class = "";
	    if (!self::$section_active) {
	        $row_class = (self::$was_lastrow_even) ? "odd" : "even";
	        self::$was_lastrow_even = !self::$was_lastrow_even;
	    }
	    
	    if ($description != '') {
	        $new_line = "<br/>";
	        $description = sprintf('%2$s<span class="label">%1$s', ($description), $new_line);
	    }
	    
	    if ($description == '' && $recommended == '') {
	        $row_class .= ' no-description';
	    }
	    
	    if (!empty($element_id)) {
	        $panel_class = $element_id;
	        $panel_class = str_replace('essb_field_', '', $panel_class);
	        $panel_class = str_replace('essb_options_', '', $panel_class);
	        $row_class .= ' settings-panel-' . esc_attr($panel_class);
	        $row_class .= ' ao-panel-' . esc_attr($panel_class);
	    }
	    
	    $for_attribution = $element_id != '' ? 'for="'.esc_attr($element_id).'"': '';
	    
	    printf('<div class="essb-flex-grid-r %1$s table-border-bottom">', esc_attr($row_class));
	    printf('<div class="essb-flex-grid-c c'.esc_attr($basic_param_col).' bold"><label class="title" %4$s>%1$s</label>%3$s%2$s</div>', $title, $description, $recommended, $for_attribution);
	    echo '<div class="essb-flex-grid-c c'.esc_attr($basic_value_col).'">';
	}
	
	public static function draw_options_row_start($title, $description = '', $recommended = '', $col_width = '', $vertical = '', $element_id = '', $field_id = '') {
		
		// @new 4.0 - if field has no title than we use it in full width
		if (empty($title)) {
			self::draw_options_row_start_full();
			return;
		}
		
		$basic_param_col = '4';
		$basic_value_col = '8';
		
		$new_style = false;
		
		if (intval($col_width) > 0) {
			$basic_param_col = $col_width;
			$basic_value_col = 12 - $col_width;
		}
		
		$row_class = "";
		if (!self::$section_active) {
			$row_class = (self::$was_lastrow_even) ? "odd" : "even";
			self::$was_lastrow_even = !self::$was_lastrow_even;
		}
		
		if (class_exists('ESSBControlCenter') && ESSBControlCenter::is_new_version()) {
		    $new_style = true;
		}
		
        if (class_exists('ESSBControlCenter') && ESSBControlCenter::is_description_inline($field_id)) {
            $new_style = false;
        }
		
		if ($description != '') {
			$new_line = "<br/>";
			if ($recommended != '') { $new_line = ''; }
			if ($new_style) {
			    
			    
			    $help_link = ESSBControlCenter::get_help_link($field_id);
			    if ($help_link != '') {
			        $help_link = ' href="'.esc_url($help_link).'" target="_blank"';
			        
			        $description .= " [Click ? to learn more]";
			    }			    
			    
			    
			    $description = '<a '.$help_link.' class="help" data-microtip-size="large" data-microtip-position="bottom-right" role="tooltip" aria-label="'.$description.'">?';			    
			    $description .= '</a>';
			    $recommended = '';
			    
			    $has_extra_description = ESSBControlCenter::get_extra_description($field_id);
			    if ($has_extra_description != '') {
			        $title .= sprintf('%2$s<span class="label">%1$s', $has_extra_description, $new_line);
			    }
			}
			else {
                $description = sprintf('%2$s<span class="label">%1$s', ($description), $new_line);
			}
		}
		
		if ($recommended != '') {
			$recommended = '<br />
								<div class="essb-recommended">
									<i class="fa fa-check"></i><span></span>
								</div>';
		}
		
		if ($vertical == 'true') {
			printf('<div class="essb-flex-grid-r %1$s table-border-bottom essb-flex-grid-nomargin">', esc_attr($row_class));
			printf('<div class="essb-flex-grid-c c12 bold"><label class="title" for="'.esc_attr($element_id).'">%1$s</label>%3$s%2$s</div>', $title, $description, $recommended);
			echo '</div>';
			printf('<div class="essb-flex-grid-r %1$s table-border-bottom">', esc_attr($row_class));
			echo '<div class="essb-flex-grid-c c12">';
				
		}
		else {
		    
		    if ($description == '' && $recommended == '') {
		        $row_class .= ' no-description';
		    }
		    
		    $for_attribution = $element_id != '' ? 'for="'.esc_attr($element_id).'"': '';
		    
		    if ($new_style && $description != '') {
		        $basic_param_col .= ' essb-help-hinticon';
		        $row_class .= ' essb-flex-centerv';
		    }
		    
		    if (!empty($element_id)) {
		        $panel_class = $element_id;
		        $panel_class = str_replace('essb_field_', '', $panel_class);
		        $panel_class = str_replace('essb_options_', '', $panel_class);
		        $row_class .= ' settings-panel-' . esc_attr($panel_class);
		        $row_class .= ' ao-panel-' . esc_attr($panel_class);
		    }
		    
			printf('<div class="essb-flex-grid-r %1$s table-border-bottom">', esc_attr($row_class));
			printf('<div class="essb-flex-grid-c c'.esc_attr($basic_param_col).' bold"><label class="title" %4$s>%1$s</label>%3$s%2$s</div>', $title, $description, $recommended, $for_attribution);
			echo '<div class="essb-flex-grid-c c'.esc_attr($basic_value_col).'">';
		}
	}
	
	public static function draw_options_row_start_full($class = '') {
		$row_class = "";
		if (!self::$section_active) {
			$row_class = (self::$was_lastrow_even) ? "odd" : "even";
			self::$was_lastrow_even = !self::$was_lastrow_even;
		}
		
		if ($class != '') { $row_class .= ' '.$class; }

		printf('<div class="essb-flex-grid-r %1$s table-border-bottom">', esc_attr($row_class));
		print '<div class="essb-flex-grid-c c12">';
	}
	
	public static function draw_options_row_end() {
		echo '</div>';
		echo '</div>';
	}
	
	/**
	 * Closing the new panel style options
	 * 
	 * @param {string} $description
	 * @param {boolean} $is_switch
	 */
	public static function draw_advanced_options_panel_end($description = '', $is_switch = false) {
		if ($is_switch) {
			echo '</div>'; // closing tile controls
			echo '</div>'; // closing the head
		}
		else {
			echo '</div>'; // closing controls element
		}
		
		if ($description != '') {
			echo '<div class="advancedoptions-tile-body">'.$description.'</div>';
		}
		
		echo '</div>'; // pannel closes
	}
	
	/**
	 * Generate the new style panel options
	 * 
	 * @param {string} $title
	 * @param {string} $panel_id
	 * @param {boolean} $is_switch
	 * @param {array} $element_options
	 */
	public static function draw_advanced_options_panel_start($title = '', $panel_id = '', $is_switch = false, $element_options = array(), $element_id = '', $id = '') {
		$add_class = isset($element_options['class']) ? $element_options['class'] : '';
		
		echo '<div class="advancedoptions-tile advancedoptions-panel '.esc_attr($panel_id).($add_class != '' ? ' '.esc_attr($add_class) : '').'">';
		echo '<div class="advancedoptions-tile-head">';
		
		if ($is_switch && $element_id != '') {
		    echo '<div class="advancedoptions-tile-head-title"><h3><label for="'.$element_id.'">'.$title.'</label></h3></div>';
		}
		else {
            echo '<div class="advancedoptions-tile-head-title"><h3>'.$title.'</h3></div>';
		}
		
		if ($is_switch) {
			echo '<div class="advancedoptions-tile-head-tools">';	
		}
		else {
			echo '</div>'; // closing head
			echo '<div class="advancedoptions-tile-control">';
		}
	}

	public static function draw_settings_panel_start($title, $panel_id = '') {
		print '<div class="essb-admin-options-panel '.esc_attr($panel_id).'">';
		
		printf('<div class="essb-admin-options-panel-title">%1$s</div>', $title);
		print '<div class="essb-admin-options-panel-content">';
	}
	
	public static function draw_settings_panel_end($description = '', $recommended = '') {
		if ($description != '') {
			$new_line = "";
			if ($recommended != '') {
				$new_line = '';
			}
			$description = sprintf('%2$s<span class="label">%1$s', $description, $new_line);
		}
		
		if ($recommended != '') {
			$recommended = '<br />
			<div class="essb-recommended">
			<i class="fa fa-check"></i><span></span>
			</div>';
		}
		
		print '</div>';
		printf('<div class="essb-admin-options-panel-desc">%1$s</div>', $description);
		print '</div>';
	}
	
	public static function draw_section_start() {
		echo '<table border="0" cellpadding="5" cellspacing="0" width="100%">
		<col width="35%" />
		<col width="65%" />';
	}
	
	public static function draw_section_end() {
		echo '</table>';
	}
	
	public static function draw_heading($title, $level = '1', $submenu_link = '', $desc = '', $class = '', $icon = '') {
		$css_class_heading = "";
		switch ($level) {
			case "1":
				$css_class_heading = "sub";
				break;
			case "2":
				$css_class_heading = "sub2";
				break;
			case "3":
				$css_class_heading = "sub3";
				break;
			case "4":
				$css_class_heading = "sub4";
				break;
			case "5":
				$css_class_heading = "sub5";
				break;
			case "6":
				$css_class_heading = 'sub6';
				break;
			case "7":
			    $css_class_heading = 'sub7';
			    $title = '<em>' . $title . '</em>';
			    break;
			default:
				$css_class_heading = "sub";
				break;
		}
		
		if ($submenu_link != '') {
			$submenu_link = sprintf('id="essb-submenu-%1%s"', $submenu_link);
		}
		
		if (empty($submenu_link) && $level != '1') {
			self::$headings_count++;
			$navigation_id = "essb-internal-".self::$headings_count;
			self::$heading_navigations[] = array("id" => $navigation_id, "title" => $title, "level" => $level);
			$submenu_link = sprintf('id="%1$s"', esc_attr($navigation_id));
		}
		
		if ($desc != '') {
			$title .= '<span class="label">'.$desc.'</span>';
		}
		
		if (!empty($icon)) {
		    $icon = '<span class="icon">' . $icon . '</span>';
		}
		
		printf('<div class="essb-flex-grid-r'.($class != '' ? ' '.esc_attr($class) : '').'" %1$s>', $submenu_link);
		printf('<div class="essb-flex-grid-c c12 essb-heading %1$s">%3$s<div>%2$s</div></div>', esc_attr($css_class_heading), $title, $icon);
		print '</div>';
	}
	
	public static function draw_simplesort_field($field, $listOfValues, $settings_group = 'essb_options', $value = '') {
		if ($value == '') {
			$value = $listOfValues; // initialize default values
		}
		
		printf('<ul class="essb_sortable" id="essb-sortable-%1$s">', esc_attr($field));
		
		foreach ($value as $single) {
			printf('<li><i class="fa fa-bars" style="margin-right: 3px; margin-left: 3px;"></i> %1$s<input type="hidden" name="%2$s[%3$s][]" value="%1$s"/></li>', $single, $settings_group, $field);
		}
		
		echo '</ul>';
	}
	
	public static function draw_image_checkbox_field($field, $listOfValues, $settings_group = 'essb_options', $value = '', $element_options = array()) {
		$exist_user_value = false;

		if ($value != '') {
			$exist_user_value = true;
		}		
		
		if (!isset($element_options)) {
			$element_options = array();
		}
		$html_values = isset($element_options['html']) ? $element_options['html'] : '';
		$shortcode = isset($element_options['shortcode']) ? $element_options['shortcode'] : '';
		$width = isset($element_options['width']) ? $element_options['width'] : '';
		$buttons = isset($element_options['buttons']) ? $element_options['buttons'] : '';
		
		echo '<div class="essb_image_checkbox_container essb_image_checkbox_container_'.$field.' '.($html_values == 'true' ? 'essb_radio_container_html' : '').' '.($buttons == 'true' ? 'essb_radio_container_buttons' : '').'">';
		foreach ( $listOfValues as $singleValueCode => $singleValue ) {
			$label = isset($singleValue['label']) ? $singleValue['label'] : '';
			
			$active_state = "";
			$active_element = "";
			
			if ($exist_user_value) {
				$key = $singleValueCode;
				if (in_array($key, $value)) {
					$active_state = " active";
					$active_element = ' checked="checked"';
				}
			}
			
			if ($label != '') {
				$label = sprintf('<div class="essb_checkbox_label">%1$s</div>', $label);
			}	
			
			if ($html_values == 'true') {
				if ($shortcode == 'true') {
					$singleValue['image'] = do_shortcode($singleValue['image']);
				}
				
				printf('<div class="essb_checkbox"><div class="essb_image_checkbox%6$s" data-field="%8$s_%3$s" '.($width != '' ? ' style="width:'.$width.';"' : '').'>
						<span class="checkbox-image">%5$s%2$s</span>
						<span class="checkbox-state"><i class="fa fa-lg fa-check-circle"></i></span>
						<input type="checkbox" id="essb_options_%8$s_%3$s" name="%4$s[%8$s][]" value="%3$s"%7$s/>
						</div>%5$s</div>', ESSB3_PLUGIN_URL, $singleValue['image'], $singleValueCode, $settings_group, $label, $active_state, $active_element, $field);
			}
			else {
				$pathToImages = ESSB3_PLUGIN_URL.'/';
				if (strpos($singleValue['image'], 'http://') !== false || strpos($singleValue['image'], 'https://') !== false) {
					$pathToImages = '';
				}
				printf('<div class="essb_checkbox"><div class="essb_image_checkbox%6$s" data-field="%8$s_%3$s">
						<span class="checkbox-image"><img src="%1$s%2$s"/></span>
						<span class="checkbox-state"><i class="fa fa-lg fa-check-circle"></i></span>
						<input type="checkbox" id="essb_options_%8$s_%3$s" name="%4$s[%8$s][]" value="%3$s"%7$s/>					
						</div>%5$s</div>', $pathToImages, $singleValue['image'], $singleValueCode, $settings_group, $label, $active_state, $active_element, $field);
			}
		}	
		echo '</div>';
	}

	public static function draw_image_radio_field($field, $listOfValues, $settings_group = 'essb_options', $value = '', $element_options = array()) {		
		$exist_user_value = false;
		
		$exist_user_value = true;
		
		if (!isset($element_options)) { $element_options = array(); }
		$html_values = isset($element_options['html']) ? $element_options['html'] : '';
		$shortcode = isset($element_options['shortcode']) ? $element_options['shortcode'] : '';
		$width = isset($element_options['width']) ? $element_options['width'] : '';
		$buttons = isset($element_options['buttons']) ? $element_options['buttons'] : '';
		
		echo '<div class="essb_image_radio_container essb_image_radio_container_'.$field.' '.($html_values == 'true' ? 'essb_radio_container_html' : '').' '.($buttons == 'true' ? 'essb_radio_container_buttons' : '').'">';
		$position = 1;
		foreach ( $listOfValues as $singleValueCode => $singleValue ) {
			$label = isset($singleValue['label']) ? $singleValue['label'] : '';
				
			$active_state = "";
			$active_element = "";
				
			if ($exist_user_value) {				
				if ($value == $singleValueCode) {
					$active_state = " active";
					$active_element = ' checked="checked"';
				}
			}				
			
			if ($label != '') {
				if ($html_values == 'true') {
					$label = sprintf('<div class="essb_radio_label_html">%1$s</div>', $label);
				}
				else {
					$label = sprintf('<div class="essb_radio_label">%1$s</div>', $label);
				}
			}
				
			if ($html_values == 'true') {
				if ($shortcode == 'true') {
					$singleValue['image'] = do_shortcode($singleValue['image']);
				}
				printf('<div class="essb_radio"><div class="essb_image_radio%8$s" data-field="%6$s_%7$s" '.($width != '' ? ' style="width:'.$width.';"' : '').'>
						<span class="checkbox-image">%5$s%2$s</span>
						<span class="checkbox-state"><i class="fa fa-lg fa-check-circle"></i></span>
						<input type="radio" id="essb_options_%6$s_%7$s" name="%4$s[%6$s]" value="%3$s"%9$s/>
						</div></div>', ESSB3_PLUGIN_URL, $singleValue['image'], $singleValueCode, $settings_group, $label, $field, $position, $active_state, $active_element);
			}
			else {
				
				$pathToImages = ESSB3_PLUGIN_URL.'/';
				if (strpos($singleValue['image'], 'http://') !== false || strpos($singleValue['image'], 'https://') !== false) {
					$pathToImages = '';
				}
				
				printf('<div class="essb_radio"><div class="essb_image_radio%8$s" data-field="%6$s_%7$s">
						<span class="checkbox-image"><img src="%1$s%2$s"/></span>
						<span class="checkbox-state"><i class="fa fa-lg fa-check-circle"></i></span>
						<input type="radio" id="essb_options_%6$s_%7$s" name="%4$s[%6$s]" value="%3$s"%9$s/>
						</div>%5$s</div>', $pathToImages, $singleValue['image'], $singleValueCode, $settings_group, $label, $field, $position, $active_state, $active_element);
			}
			$position++;
		}
		echo '</div>';
	}
	
	
	public static function draw_textarea_field($field, $settings_group = 'essb_options', $value = '', $placeholder = '', $rows = '') {
	    
	    if (empty($rows) || intval($rows) <= 0) {
	        $rows = '5';
	    }
	    
		$value = esc_textarea ( stripslashes($value));

		/**
		 * @since 8.8.1
		 * Output refactored to ensure compatibility with PHP 8.1
		 * printf('<textarea id="essb_options_%1$s" name="%2$s[%1$s]" class="input-element stretched" rows="'.esc_attr($rows).'" placeholder="'.$placeholder.'">%3$s</textarea>', $field, $settings_group, $value);
		 */
		
		echo '<textarea id="essb_options_'.$field.'" name="'.$settings_group.'['.$field.']" class="input-element stretched" rows="'.esc_attr($rows).'" placeholder="'.$placeholder.'">'.$value.'</textarea>';
	}

	public static function draw_wpeditor_field($field, $settings_group = 'essb_options', $value = '') {
		$value =  ( stripslashes($value));
		
		printf('<textarea id="essb_options_%1$s" name="%2$s[%1$s]" class="input-element stretched essb-hidden-element" rows="5">%3$s</textarea>', $field, $settings_group, $value);
		$editor_options = array('textarea_name' => $settings_group.'['.$field.']', 'editor_height' => '200');
		wp_editor($value, sprintf('wpeditor_%1$s', $field), $editor_options);
	}
	
	public static function draw_editor_field($field, $settings_group = 'essb_options', $value = '', $mode = 'htmlmixed') {
		$value = esc_textarea ( stripslashes($value));
		printf('<textarea id="essb_options_%1$s" name="%2$s[%1$s]" class="input-element stretched is-code-editor" rows="5" data-function-activate="activate__%1$s" data-editor-key="editor_%1$s">%3$s</textarea>', $field, $settings_group, $value);
		printf('<script>
				var editor_%1$s;
				function activate__%1$s() {
      loadedEditorControls["editor_%1$s"] = CodeMirror.fromTextArea(document.getElementById("essb_options_%1$s"), {
      lineNumbers: true,
      mode: "%2$s",
				lineWrapping: true,      
      matchBrackets: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
				};
  </script>', $field, $mode);
  		
	}
	
	
	public static function draw_switch_field($field, $settings_group = 'essb_options', $value = '', $on_text = '', $off_text = '', $switch_submit = '') {
		if ($settings_group == '') { $settings_group = "essb_options"; }
		
		if ($on_text == "") { $on_text = esc_html__('On', 'essb'); }
		if ($off_text == "") { $off_text = esc_html__('Off', 'essb'); }
		
		if ($value == "true") {
			$on_switch = " selected";
			$off_switch = "";				
		}
		else {
			$off_switch = " selected";
			$on_switch = "";
		}
		$is_checked = ($value == 'true') ? ' checked="checked"' : '';
		
		echo '<div class="onoffswitch'.($switch_submit == 'true' ? ' essb-switch-submit' : '').'">
			<input id="essb_field_'.$field.'" type="checkbox" name="'.$settings_group.'['.$field.']" class="onoffswitch-checkbox" value="true" '.$is_checked.'>
			<label class="onoffswitch-label" for="essb_field_'.$field.'">
				<span class="onoffswitch-inner"></span>
				<span class="onoffswitch-switch"></span>
			</label>
		</div>';
	}
	
	public static function draw_input_field($field_id, $fullwidth = false, $settings_group = 'essb_options', $value = '', $icon = '', $class = '', $icon_position = '', $placeholder_text = '', $element_options = array()) {
		$multiple = isset($element_options['multiple']) ? $element_options['multiple'] : array();
		if (!is_array($multiple)) {
			$multiple = array();
		}
		
		if (count($multiple) == 0) {
			$value = esc_attr ( stripslashes($value));
			if ($icon != '' && $icon_position != 'right') {
				printf('<span class="essb-input-prefix-icon"><i class="fa %1$s"></i></span>', $icon);
			}
			
			if ($icon != '' && $icon_position == 'right') {
			    $class .= ' input_icon_right';
			}
			
			if ($icon != '' && $icon_position == 'right') {
			    $class .= ' input_icon_left';
			}
			
			echo '<input id="essb_options_' . $field_id . '" type="text" name="' . $settings_group . '[' . $field_id . ']" value="' . $value . '" class="input-element' . ($fullwidth ? ' stretched' : '') . ' '.$class.'" placeholder="'.$placeholder_text.'" />';
	
			if ($icon != '' && $icon_position == 'right') {
			    printf('<span class="essb-input-suffix-icon '.$icon_position.'"><i class="fa %1$s"></i></span>', $icon);
			}
		}
		else {
			
			foreach ($multiple as $multi_field_id => $multi_field_title) {
				$value = stripslashes(essb_option_value($multi_field_id));
				echo '<div class="single-multivalue">';
				printf('<span class="essb-input-prefix-icon essb-input-textprefix">%1$s</span>', $multi_field_title);
				echo '<input id="essb_options_' . $multi_field_id . '" type="text" name="' . $settings_group . '[' . $multi_field_id . ']" value="' . $value . '" class="input-element' . ($fullwidth ? ' stretched' : '') . ' '.$class.'" placeholder="'.$placeholder_text.'" />';
				echo '</div>';
			}
		}
	}
	
	public static function draw_fileselect_image_field($field_id, $settings_group = 'essb_options', $value = '', $icon = '', $class = '', $placeholder_value = '') {
		if ($icon != '') {
			printf('<span class="essb-input-prefix-icon"><i class="fa %1$s"></i></span>', $icon);
		}
	
		if (function_exists ( 'wp_enqueue_media' )) {
			wp_enqueue_media ();
		} else {
			wp_enqueue_style ( 'thickbox' );
			wp_enqueue_script ( 'media-upload' );
			wp_enqueue_script ( 'thickbox' );
		}
		
		
		$css_background = '';
		if ($value != '' || $placeholder_value != '') {
			$css_background = 'style="background-image: url('.$value.');"';
			
			if ($value == '' && $placeholder_value != '') {
				$css_background = 'style="background-image: url('.$placeholder_value.');"';
			}
		}
	
		echo '<div class="default-preview-image '.$field_id.'">
			<div class="'.$field_id.'-placeholder image-placeholder"'.$css_background.'>&nbsp;</div>
			<a href="#" class="essb-btn essb-btn-blue image-picker-button" id="essb_fileselect_' . $field_id . '" title="'.esc_html__('Select Image', 'essb').'"><i class="fa fa-picture-o"></i></a>
			<a href="#" class="essb-btn essb-btn-red image-picker-clear-button" id="essb_clearselect_' . $field_id . '"  title="'.esc_html__('Remove Image', 'essb').'"><i class="fa fa-times"></i></a>
			</div>';
		echo '<input id="essb_options_' . $field_id . '" type="text" name="' . $settings_group . '[' . $field_id . ']" value="' . $value . '" class="input-element small-stretched media-select '.$class.'" />';
		?>
			
			<script type="text/javascript">
	
			jQuery(document).ready(function($){
				 
				 
			    var custom_uploader;

			    $('#essb_clearselect_<?php echo $field_id; ?>').click(function(e) {
			    	  e.preventDefault();
			    	$('#essb_options_<?php echo $field_id; ?>').val('');
			    	$('#essb_options_<?php echo $field_id; ?>').trigger('change');
		            if ($('.<?php echo $field_id; ?>-placeholder').length) {
			            $('.<?php echo $field_id; ?>-placeholder').css('background-image', '');
		            }
			    });
			 
			    $('#essb_fileselect_<?php echo $field_id; ?>').click(function(e) {
			 
			        e.preventDefault();
			 
			        //If the uploader object has already been created, reopen the dialog
			        if (custom_uploader) {
			            custom_uploader.open();
			            return;
			        }
			 
			        //Extend the wp.media object
			        custom_uploader = wp.media.frames.file_frame = wp.media({
			            title: 'Select File',
			            button: {
			                text: 'Select File'
			            },
			            multiple: false
			        });
			 
			        //When a file is selected, grab the URL and set it as the text field's value
			        custom_uploader.on('select', function() {
			            attachment = custom_uploader.state().get('selection').first().toJSON();
			            $('#essb_options_<?php echo $field_id; ?>').val(attachment.url);
			            $('#essb_options_<?php echo $field_id; ?>').trigger('change');
			            if ($('.<?php echo $field_id; ?>-placeholder').length) {
				            console.log('set image');
				            $('.<?php echo $field_id; ?>-placeholder').css('background-image', 'url('+attachment.url+')');
			            }
			        });
			 
			        //Open the uploader dialog
			        custom_uploader.open();
			 
			    });

			    $('.<?php echo $field_id; ?>-placeholder').click(function(e) {
					 
			        e.preventDefault();
			 
			        //If the uploader object has already been created, reopen the dialog
			        if (custom_uploader) {
			            custom_uploader.open();
			            return;
			        }
			 
			        //Extend the wp.media object
			        custom_uploader = wp.media.frames.file_frame = wp.media({
			            title: 'Select File',
			            button: {
			                text: 'Select File'
			            },
			            multiple: false
			        });
			 
			        //When a file is selected, grab the URL and set it as the text field's value
			        custom_uploader.on('select', function() {
			            attachment = custom_uploader.state().get('selection').first().toJSON();
			            $('#essb_options_<?php echo $field_id; ?>').val(attachment.url);
			            $('#essb_options_<?php echo $field_id; ?>').trigger('change');
			            if ($('.<?php echo $field_id; ?>-placeholder').length) {
				            console.log('set image');
				            $('.<?php echo $field_id; ?>-placeholder').css('background-image', 'url('+attachment.url+')');
			            }
			        });
			 
			        //Open the uploader dialog
			        custom_uploader.open();
			 
			    });
			});
	
			</script>
			
			<?php 
		}

	public static function draw_fileselect_field($field_id, $settings_group = 'essb_options', $value = '', $icon = '', $class = '') {
		echo '<div class="essb-ui-flex essb-ui-align-center">';
		if ($icon != '') {
			printf('<span class="essb-input-prefix-icon"><i class="fa %1$s"></i></span>', $icon);
		}
	
		if (function_exists ( 'wp_enqueue_media' )) {
			wp_enqueue_media ();
		} else {
			wp_enqueue_style ( 'thickbox' );
			wp_enqueue_script ( 'media-upload' );
			wp_enqueue_script ( 'thickbox' );
		}
		echo '<input id="essb_options_' . $field_id . '" type="text" name="' . $settings_group . '[' . $field_id . ']" value="' . $value . '" class="input-element small-stretched '.$class.'" />';
		echo '<a href="#" class="essb-btn essb-btn-blue essb-ui-btn essb-ui-btn-primary essb-ui-btn-sm" id="essb_fileselect_' . $field_id . '" style="margin-left: 5px; margin-top: -2px;">'.esc_html__('Select File', 'essb').'</a>';
		echo '</div>';
		?>
		
		<script type="text/javascript">

		jQuery(document).ready(function($){
			 
			 
		    var custom_uploader;
		 
		 
		    $('#essb_fileselect_<?php echo $field_id; ?>').click(function(e) {
		 
		        e.preventDefault();
		 
		        //If the uploader object has already been created, reopen the dialog
		        if (custom_uploader) {
		            custom_uploader.open();
		            return;
		        }
		 
		        //Extend the wp.media object
		        custom_uploader = wp.media.frames.file_frame = wp.media({
		            title: 'Select File',
		            button: {
		                text: 'Select File'
		            },
		            multiple: false
		        });
		 
		        //When a file is selected, grab the URL and set it as the text field's value
		        custom_uploader.on('select', function() {
		            attachment = custom_uploader.state().get('selection').first().toJSON();
		            $('#essb_options_<?php echo $field_id; ?>').val(attachment.url);
		        });
		 
		        //Open the uploader dialog
		        custom_uploader.open();
		 
		    });
		});

		</script>
		
		<?php 
	}
	
	
	public static function draw_select_field($field, $listOfValues, $simpleList = false, $group = 'essb_options', $value = '', $element_options = array()) {
		
		$multiple = isset($element_options['multiple']) ? $element_options['multiple'] : '';
		
		if ($listOfValues == 'list_all_posttype') {
		    $listOfValues = ESSB_Plugin_Loader::supported_post_types(false, false);
		}
		
		if ($multiple == 'true') {
			if (!is_array($value)) {
				$value = array();
			}
			echo '<select name="' . $group . '[' . $field . '][]" class="input-element essb-select2" id="essb_options_' . $field . ($group != 'essb_options' ? '_' . $group : '') . '" data-values="'.implode (',', $value).'" multiple="multiple">';
		} 
		else {
		    
		    $first_value = '';
		    
		    if ($simpleList) {
		        if (isset($listOfValues[0])) {
		            $first_value = $listOfValues[0];
		        }
		    }
		    else {
		        $array = $listOfValues;
		        reset($array);
		        $first_value = key($array);
		    }
		    
			echo '<select name="' . $group . '[' . $field . ']" class="input-element" id="essb_options_' . $field . '" data-default="'.esc_attr($first_value).'">';
		}
		
		if ($simpleList) {
			foreach ( $listOfValues as $singleValue ) {
				printf ( '<option value="%1$s" %2$s>%1$s</option>', $singleValue, ($singleValue == $value ? 'selected' : '') );
			}
		} else {
			foreach ( $listOfValues as $singleValueCode => $singleValue ) {
				printf ( '<option value="%s" %s>%s</option>', $singleValueCode, ($singleValueCode == $value ? 'selected' : ''), $singleValue );
			}
		}
		
		echo '</select>';
	}

	public static function draw_select2_field($field, $listOfValues, $simpleList = false, $group = 'essb_options', $value = '', $select2_options = array()) {
	
		$allow_clear = isset($select2_options['allow_clear']) ? $select2_options['allow_clear'] : false;
		$multiple = isset($select2_options['multiple']) ? $select2_options['multiple'] : false;
		$placeholder = isset($select2_options['placeholder']) ? $select2_options['placeholder'] : false;
		
		$allow_clear_state = ($allow_clear) ? "true" : "false";
		
		echo '<select name="' . $group . '[' . $field . ']" class="input-element '.($multiple ? 'stretched' : "").'" id="essb_options_' . $field . '" '.($multiple ? 'multiple="multiple"' : "").'>';
	
		if ($simpleList) {
			foreach ( $listOfValues as $singleValue ) {
				printf ( '<option value="%1$s" %2$s>%1$s</option>', $singleValue, ($singleValue == $value ? 'selected' : '') );
			}
		} else {
			foreach ( $listOfValues as $singleValueCode => $singleValue ) {
				printf ( '<option value="%s" %s>%s</option>', $singleValueCode, ($singleValueCode == $value ? 'selected' : ''), $singleValue );
			}
		}
	
		echo '</select>';
		
		echo '<script type="text/javascript">jQuery(document).ready(function($){
		jQuery("#essb_options_' . $field . '").select2({
  placeholder: "'.$placeholder.'",
  allowClear: '.$allow_clear_state.'
});});</script>';
	}
	
	public static function draw_checkbox_field($field, $group = 'essb_options', $value = '') {
		$is_checked = ($value == 'true') ? ' checked="checked"' : '';
		echo '<input id="essb_options_' . $field . '" type="checkbox" name="' . $group . '[' . $field . ']" value="true" ' . $is_checked . ' />';
	}

	public static function draw_checkbox_list_field($field, $listOfValues, $group = 'essb_options', $value = '', $element_options = array()) {
		if (!is_array($value)) { $value = array(); }
		
		if (isset($element_options) && isset($element_options['source'])) {
		    if ($element_options['source'] == 'post_types') {
		        $listOfValues = essb_get_post_types();
		    }
		}
		
		foreach ($listOfValues as $key => $text) {
			$is_checked = in_array($key, $value) ? ' checked="checked"' : '';
			echo '<span class="essb_checkbox_list_item"><input id="essb_options_' . $field .'_'.$key . '" type="checkbox" name="' . $group . '[' . $field . '][]" value="'.$key.'" ' . $is_checked . ' /><label for="essb_options_' . $field.'_'.$key . '">'.$text.'</label></span>';
		}
	}
	
	public static function draw_checkbox_list_sortable_field($field, $listOfValues, $group = 'essb_options', $value = '', $style = '') {	    
	    if (!is_array($value)) {
			$value = array();
		}
	
		$id_field = $field;
		if ($style != '' && $style == 'networks') {
			echo '<input type="text" class="input-element input-filter stretched-50" placeholder="Quick Filter Networks ..." data-filter="essb-sortable-'.$field.'"/>';
				
		}
		
		printf('<ul class="essb_sortable" id="essb-sortable-%1$s">', $id_field);
		foreach ($listOfValues as $key => $text) {
			$is_checked = in_array($key, $value) ? ' checked="checked"' : '';
			
			if ($style == 'networks') {
				echo '<li data-filter-value="'.$text.'"><i class="essb_icon_'.$key.'" style="margin-right: 3px; margin-left: 3px;"></i><span class="essb_checkbox_list_item"><input id="essb_options_' . $field . '" type="checkbox" name="' . $group . '[' . $field . '][]" value="'.$key.'" ' . $is_checked . ' />'.$text.'<input type="hidden" name="' . $group . '[' . $field . '_order][]" value="'.$key.'|'.$text.'"/></span></li>';
			}
			else {
				echo '<li><i class="fa fa-bars" style="margin-right: 3px; margin-left: 3px;"></i><span class="essb_checkbox_list_item"><input id="essb_options_' . $field . '" type="checkbox" name="' . $group . '[' . $field . '][]" value="'.$key.'" ' . $is_checked . ' />'.$text.'<input type="hidden" name="' . $group . '[' . $field . '_order][]" value="'.$key.'|'.$text.'"/></span></li>';
			}
		}
		echo '</ul>';
	}
	
	public static function draw_color_field($field, $group = 'essb_options', $value = '') {
		
		$value = stripslashes ( $value );
		
		$css_id = (($group != 'essb_options') ? $group.'_' : '').$field;
		
		echo '<input id="essb_options_' . $css_id . '" type="text" name="' . $group . '[' . $field . ']" value="' . $value . '" class="input-element stretched input-colorselector" data-default-color="' . $value . '" />';
		
		array_push ( self::$color_fields, 'essb_options_' . $css_id );
	}
	
	public static function draw_acolor_field($field, $group = 'essb_options', $value = '') {
	
		$value = stripslashes ( $value );
		$css_id = (($group != 'essb_options') ? $group.'_' : '').$field;
		echo '<input id="essb_options_' . $css_id . '" type="text" name="' . $group . '[' . $field . ']" value="' . $value . '" class="input-element stretched input-colorselector" data-default-color="' . $value . '" data-alpha="true" />';
	
		array_push ( self::$color_fields, 'essb_options_' . $css_id );
	}
	
	public static function reset_color_selector() {
		self::$color_fields = array();
	}
	
	public static function register_color_selector() {
		?>
<div id="colorpicker"></div>
<script type="text/javascript">		
			
			
			jQuery(document).ready(function($){
				<?php
		
		foreach ( self::$color_fields as $single ) {
			print "$('#" . $single . "').wpColorPicker();";
		}
		
		?>
			});
			
			</script>
<?php
	}
	
	public static function translate_key_array($array) {
		if (!is_array($array)) { return array(); }
		
		$key_array = array();
		
		foreach ($array as $text_value) {
			$keys = explode('|', $text_value);
			
			$key = $keys[0];
			$text = $keys[1];
			
			$key_array[$key] = $text;
		}
		
		return $key_array;
	}
	
	/**
	 * Compare ordered values and remove outdated networks
	 * @param unknown $all_networks
	 * @param unknown $ordered_networks
	 */
	public static function remove_old_networks($all_networks, $ordered_networks) {
        $r = array();        
        
        foreach ($ordered_networks as $key => $text) {
            if (isset($all_networks[$key])) {
                $r[$key] = $text;
            }
        }
        
        return $r;
	}

}


?>