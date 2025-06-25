<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Open Street Map
 */

	/**
	 * Register Module
	 */
	add_action( 'dslc_hook_register_modules', 'lcopensctreetmap_init_module' );

	function lcopensctreetmap_init_module() {
		return dslc_register_module( 'OpenSteetMap' );
	}

	/**
	 * Module Class
	 */
	class OpenSteetMap extends DSLC_Module {

		/**
		 * Unique module id
		 *
		 * @var string
		 */
		var $module_id;

		/**
		 * Module label to show in the page builder
		 *
		 * @var string
		 */
		var $module_title;

		/**
		 * Module icon name (FontAwesome)
		 *
		 * @var string
		 */
		var $module_icon;

		/**
		 * Section in the modules panel that includes this module
		 * Live Composer Extensions should use 'Extensions'
		 *
		 * @var string
		 */
		var $module_category;

		/**
		 * Construct
		 */
		function __construct() {

			$this->module_id = 'OpenSteetMap';
			$this->module_title = __( 'Open Street Map', 'lc_openstreetmap' );
			$this->module_icon = 'map-marker';
			$this->module_category = 'Extensions';

		}

		/**
		 * Options
		 */
		function options() {

			$options = array(

				array(
					'label' => __( 'Address', 'lc_openstreetmap' ),
					'id' => 'address',
					'std' => '14 High St, Newmarket CB8 8LB, United Kingdom',
					'type' => 'text',
				),
				array(
					'label' => __( 'Zoom', 'lc_openstreetmap' ),
					'help' => 'Set a value from 1 to 21. Bigger the number bigger the zoom.',
					'id' => 'zoom',
					'std' => '15',
					'type' => 'text',
				),
				array(
					'label' => __( 'Height', 'lc_openstreetmap' ),
					'id' => 'height',
					'std' => '400',
					'type' => 'text',
				),
				array(
					'label' => __( 'Mousewheel Zooming', 'lc_openstreetmap' ),
					'id' => 'scroll_wheel',
					'std' => 'true',
					'type' => 'select',
					'choices' => array(
						array(
							'label' => __( 'Enabled', 'lc_googlemaps' ),
							'value' => 'true',
						),
						array(
							'label' => __( 'Disabled', 'lc_googlemaps' ),
							'value' => 'false',
						),
					),
				),

				/**
				 * Styling
				 */

				array(
					'label' => __( ' BG Color', 'lc_openstreetmap' ),
					'id' => 'css_main_bg_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper',
					'affect_on_change_rule' => 'background-color',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Border Color', 'lc_openstreetmap' ),
					'id' => 'css_main_border_color',
					'std' => '',
					'type' => 'color',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper .leaflet-container',
					'affect_on_change_rule' => 'border-color',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Border Width', 'lc_openstreetmap' ),
					'id' => 'css_main_border_width',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper .leaflet-container',
					'affect_on_change_rule' => 'border-width',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Borders', 'lc_openstreetmap' ),
					'id' => 'css_main_border_trbl',
					'std' => 'top right bottom left',
					'type' => 'checkbox',
					'choices' => array(
						array(
							'label' => __( 'Top', 'lc_openstreetmap' ),
							'value' => 'top',
						),
						array(
							'label' => __( 'Right', 'lc_openstreetmap' ),
							'value' => 'right',
						),
						array(
							'label' => __( 'Bottom', 'lc_openstreetmap' ),
							'value' => 'bottom',
						),
						array(
							'label' => __( 'Left', 'lc_openstreetmap' ),
							'value' => 'left',
						),
					),
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper .leaflet-container',
					'affect_on_change_rule' => 'border-style',
					'section' => 'styling',
				),
				array(
					'label' => __( 'Border Radius - Top', 'lc_openstreetmap' ),
					'id' => 'css_main_border_radius_top',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper .leaflet-container',
					'affect_on_change_rule' => 'border-top-left-radius,border-top-right-radius',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Border Radius - Bottom', 'lc_openstreetmap' ),
					'id' => 'css_main_border_radius_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper .leaflet-container',
					'affect_on_change_rule' => 'border-bottom-left-radius,border-bottom-right-radius',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Margin Bottom', 'lc_openstreetmap' ),
					'id' => 'css_margin_bottom',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper .leaflet-container',
					'affect_on_change_rule' => 'margin-bottom',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Padding Vertical', 'lc_openstreetmap' ),
					'id' => 'css_main_padding_vertical',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper',
					'affect_on_change_rule' => 'padding-top,padding-bottom',
					'section' => 'styling',
					'ext' => 'px',
				),
				array(
					'label' => __( 'Padding Horizontal', 'lc_openstreetmap' ),
					'id' => 'css_main_padding_horizontal',
					'std' => '0',
					'type' => 'slider',
					'refresh_on_change' => false,
					'affect_on_change_el' => '#lc-osm-wrapper',
					'affect_on_change_rule' => 'padding-left,padding-right',
					'section' => 'styling',
					'ext' => 'px',
				),

			);

			$options = array_merge( $options, $this->shared_options( 'animation_options' ) );
			$options = array_merge( $options, $this->presets_options() );

			return apply_filters( 'dslc_module_options', $options, $this->module_id );

		}

		/**
		 * Output the module render
		 *
		 * @param  array $options All the plugin options.
		 * @return void
		 */
		function output( $options ) {

			/* Module Start */
			$this->module_start( $options );
			$mapid = random_int(1,999);
			$coordinates = lcopensstreetmap_address_to_coordinates( $options['address'] );
			if( !empty( $coordinates['lat'] ) ) {
				$lat = $coordinates['lat'];
			} 
			if( !empty( $coordinates['lon'] ) ){
				$lon = $coordinates['lon'];
			}
			
			$zoom = $options['zoom'];
			$height = $options['height'] . 'px';
			$scroll_wheel = $options['scroll_wheel'];

			?>

			<style type="text/css">
				#lc-osm-<?php echo $mapid; ?> { 
					height: <?php echo $height; ?>;
				}
			</style>

			<div id="lc-osm-wrapper">
				<div id="lc-osm-<?php echo $mapid; ?>"></div>
			</div>

			<script type="text/javascript">

				var lat = <?php echo $lat; ?>;
				var lon = <?php echo $lon; ?>;
				var zoom = <?php echo $zoom; ?>;
				var map = L.map( 'lc-osm-<?php echo $mapid; ?>', {
					scrollWheelZoom: <?php echo $scroll_wheel; ?>
				}).setView([lat, lon], zoom);

				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(map);

				L.marker([lat, lon]).addTo(map)
			</script>

			<?php

			/* Module End */
			$this->module_end( $options );

		}
	}
