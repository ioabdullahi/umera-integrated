<?php
/**
 * File with Live Composer module registration
 *
 * @package Live Composer - Opens Street Map
 */

/**
 * Get coordinated from address
 *
 * @param  string  $address       Address to transform into Lat/Long.
 * @return array                  Coordinates.
 */
function lcopensstreetmap_address_to_coordinates( $address ) {

    $args = array( 'q' => urlencode( $address ) );
    $url = esc_url_raw( add_query_arg( $args, 'https://nominatim.openstreetmap.org/search?format=json' ) );
    $response = wp_remote_get( $url );

    if ( is_wp_error( $response ) ) {
        return;
    }

    $data = wp_remote_retrieve_body( $response );

    if ( is_wp_error( $data ) ) {
        return;
    }

    if ( 200 == $response['response']['code'] ) {

        $data = json_decode( $data );
        $coordinates = array();
        
        if( !empty( $data[0]->lat ) ) {
            $coordinates['lat'] = $data[0]->lat;
        }

        if( !empty( $data[0]->lon ) ) {
            $coordinates['lon'] = $data[0]->lon;
        }


        return $coordinates;
        
    }
}
