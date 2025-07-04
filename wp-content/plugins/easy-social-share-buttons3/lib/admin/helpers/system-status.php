<?php
if (! function_exists ( 'get_plugins' )) {
	require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

if (!function_exists('let_to_num')) {
	function let_to_num( $size ) {
		$l   = substr( $size, -1 );
		$ret = substr( $size, 0, -1 );
		switch ( strtoupper( $l ) ) {
			case 'P':
				$ret *= 1024;
			case 'T':
				$ret *= 1024;
			case 'G':
				$ret *= 1024;
			case 'M':
				$ret *= 1024;
			case 'K':
				$ret *= 1024;
		}
		return $ret;
	}
}

$active_plugins = (array) get_option( 'active_plugins', array() );

if ( is_multisite() ) {
	$active_plugins = array_merge( $active_plugins, get_site_option( 'active_sitewide_plugins', array() ) );
}

$pluginList = '';

foreach ( $active_plugins as $plugin ) {

	$plugin_data    = @get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );
	$dirname        = dirname( $plugin );
	$version_string = '';
	$network_string = '';

	if ( ! empty( $plugin_data['Name'] ) ) {

		// Link the plugin name to the plugin url if available.
		$plugin_name = esc_html( $plugin_data['Name'] );

		if ( ! empty( $plugin_data['PluginURI'] ) ) {
			$plugin_name = '<a href="' . esc_url( $plugin_data['PluginURI'] ) . '" title="' . esc_html__( 'Visit plugin homepage' , 'essb' ) . '">' . $plugin_name . '</a>';
		}
		$pluginList .= '
						<tr class="even table-border-bottom">
							<td><b>' . $plugin_data ['Name'] . '</b><br/><span class="label">slug: ' . $plugin_data ['TextDomain'] . ', author: <a href="' . $plugin_data ['AuthorURI'] . '" target="_blank">' . $plugin_data ['Author'] . '</a></span></td>
							<td><b>' . $plugin_data ['Version'] . '</b><br/><a href="' . esc_url($plugin_data ['PluginURI']) . '" target="_blank">' . $plugin_data ['PluginURI'] . '</a></td>
						</tr>
						';
					}
				}


				
$remote_get_status = '';
$remote_post_status = '';

$response = wp_safe_remote_get( 'https://build.envato.com/api/', array( 'decompress' => false, 'user-agent' => 'essb-remote-get-test' ) );
$remote_get_status = ( ! is_wp_error( $response ) && $response['response']['code'] >= 200 && $response['response']['code'] < 300 ) ? '<mark class="yes">&#10004;</mark>' : '<mark class="error">wp_remote_get() failed. Some theme features may not work. Please contact your hosting provider for additional information.</mark>';

$response = wp_safe_remote_post( 'https://developers.facebook.com/', array( 'decompress' => false, 'user-agent' => 'essb-remote-get-test' ) );
$remote_post_status = ( ! is_wp_error( $response ) && $response['response']['code'] >= 200 && $response['response']['code'] < 300 ) ? '<mark class="yes">&#10004;</mark>' : '<mark class="error">wp_remote_get() failed. Some theme features may not work. Please contact your hosting provider for additional information.</mark>';

if (function_exists ( 'fsockopen' )) {
	$fsockopen = '<mark class="yes">Enabled</mark>';
} else {
	$fsockopen = '<mark class="error">Disabled</mark>';
}
if (function_exists ( 'curl_version' )) {
	$curl_version = curl_version ();
	$curl_status = '<mark class="yes">Enabled: v' . $curl_version ['version'] . '</mark>';
} else {
	$curl_status = '<mark class="error">Disabled</mark>';
}
$theme = wp_get_theme ();

$time_limit = ini_get( 'max_execution_time' );

if ( 180 > $time_limit && 0 != $time_limit ) {
	$time_limit = '<mark class="error">' . sprintf( esc_html__( '%1$s - We recommend setting max execution time to at least 180 if you use share counters or share counter recovery.<br />See: <a href="%2$s" target="_blank" rel="noopener noreferrer">Increasing max execution to PHP</a>', 'essb' ), $time_limit, 'http://codex.wordpress.org/Common_WordPress_Errors#Maximum_execution_time_exceeded' ) . '</mark>';
} else {
	$time_limit = '<mark class="yes">' . $time_limit . '</mark>';
}

$memory = let_to_num( WP_MEMORY_LIMIT );
if ( $memory < 64000000 ) {
	$memory = '<mark class="error">' . sprintf( esc_html__( '%1$s - We recommend setting memory to at least <strong>128MB</strong>. <br /> Please define memory limit in <strong>wp-config.php</strong> file. To learn how, see: <a href="%2$s" target="_blank" rel="noopener noreferrer">Increasing memory allocated to PHP.</a>', 'essb' ), size_format( $memory ), 'http://codex.wordpress.org/Editing_wp-config.php#Increasing_memory_allocated_to_PHP' ) . '</mark>';
} else {
	$memory = '<mark class="yes">' . size_format( $memory ) . '</mark>';
	if ( $memory < 128000000 ) {
		$memory .= '<br /><mark class="message">' . esc_html__( 'Your current memory limit is sufficient, but if you use lot of plugins on site or you have many posts you may need to exceed it.', 'essb' ) . '</mark>';
	}
}

// Get the memory from PHP's configuration.
$memory_php = ini_get( 'memory_limit' );
// If we can't get it, fallback to WP_MEMORY_LIMIT.
if ( ! $memory || -1 === $memory ) {
	$memory_php = wp_convert_hr_to_bytes( WP_MEMORY_LIMIT );
}
// Make sure the value is properly formatted in bytes.
if ( ! is_numeric( $memory_php ) ) {
	$memory_php = wp_convert_hr_to_bytes( $memory_php );
}

if ( $memory_php < 64000000 ) {
	$memory_php = '<mark class="error">' . sprintf( esc_html__( '%1$s - We recommend setting memory to at least <strong>128MB</strong>. <br /> Please define memory limit in <strong>wp-config.php</strong> file. To learn how, see: <a href="%2$s" target="_blank" rel="noopener noreferrer">Increasing memory allocated to PHP.</a>', 'essb' ), size_format( $memory_php ), 'http://codex.wordpress.org/Editing_wp-config.php#Increasing_memory_allocated_to_PHP' ) . '</mark>';
} else {
	$memory_php = '<mark class="yes">' . size_format( $memory_php ) . '</mark>';
}

$max_input_vars = ini_get( 'max_input_vars' );
if ($max_input_vars < 1000) {
	$max_input_vars .= '<br/><mark class="error">Max input vars limitation will truncate POST data and some options may not save. We recommed to setup at least 1000. See: <a href="http://sevenspark.com/docs/ubermenu-3/faqs/menu-item-limit" target="_blank" rel="noopener noreferrer">Increasing max input vars limit.</a></mark>';
}
if ($max_input_vars > 999 && $max_input_vars < 5000) {
	$max_input_vars .= '<br/><mark class="warning">Current value of max input vars may prevent some options to save - for example in Where to display section. If you face such problem we recommend to increase value at setup 5000 or deactive display methods and functions that you do not use from Advanced Settings -> Deactivate Functions & Modules. See: <a href="http://sevenspark.com/docs/ubermenu-3/faqs/menu-item-limit" target="_blank" rel="noopener noreferrer">Increasing max input vars limit.</a></mark>';
}


$system_status = '
<div class="about-page-panel system-info-panel"><div class="panel-content">
<h4>Environment Statuses</h4>
<table cellspacing="0" cellpadding="3" border="0" class="system-status">
<col width="30%"/><col width="70%"/>
<tr class="even table-border-bottom"><td ><b>Home URL</b></td><td>' . esc_url(get_home_url ()) . '</td></tr>
<tr class="odd table-border-bottom"><td ><b>Site URL</b></td><td>' . esc_url(get_site_url ()) . '</td></tr>
<tr class="even table-border-bottom"><td><b>WordPress Version</b></td><td>' . get_bloginfo ( 'version' ) . '</td></tr>
<tr class="odd table-border-bottom"><td><b>PHP Version</b></td><td>' . phpversion () . '</td></tr>
<tr class="even table-border-bottom"><td><b>Easy Social Share Buttons version</b></td><td>' . ESSB3_VERSION . '</td></tr>
<tr class="odd table-border-bottom"><td><b>WP Memory Limit</b></td><td>' . $memory . '</td></tr>
<tr class="even table-border-bottom"><td><b>PHP Memory Limit</b></td><td>' . $memory_php . '</td></tr>
<tr class="odd table-border-bottom"><td><b>Max Post Size</b></td><td>' . ini_get('post_max_size') . '</td></tr>
<tr class="even table-border-bottom"><td><b>Max Upload Size</b></td><td>' . size_format(wp_max_upload_size()) . '</td></tr>
<tr class="odd table-border-bottom"><td><b>PHP Time Limit</b></td><td>' . $time_limit . '</td></tr>
<tr class="even table-border-bottom"><td><b>Max Input Vars</b></td><td>' . $max_input_vars . '</td></tr>
</table>
</div>
</div>
<div class="about-page-panel system-info-panel"><div class="panel-content">
<h4>Connection Statuses</h4>
<table cellspacing="0" cellpadding="3" border="0" class="system-status">
<col width="30%"/><col width="70%"/>
<tr class="even table-border-bottom"><td><b>fsockopen</b></td><td>' . $fsockopen . '</td></tr>
<tr class="odd table-border-bottom"><td><b>cURL</b></td><td>' . $curl_status . '</td></tr>
<tr class="even table-border-bottom"><td><b>WP Remote Get</b></td><td>' . $remote_get_status . '</td></tr>
<tr class="odd table-border-bottom"><td><b>WP Remote Post</b></td><td>' . $remote_post_status . '</td></tr>
</table>
</div>
</div>

<div class="about-page-panel system-info-panel"><div class="panel-content">
<h4>Active Theme</h4>
<table cellspacing="0" cellpadding="3" border="0" class="system-status">
<col width="30%"/><col width="70%"/>
<tr class="even table-border-bottom"><td><b>Theme Name</b></td><td><a href="'.esc_url($theme->get ('ThemeURI')).'" target="_blank">' . $theme ['Name'] . '</a></td></tr>
<tr class="odd table-border-bottom"><td><b>Theme Version</b></td><td>' . $theme ['Version'] . '</td></tr>
<tr class="even table-border-bottom"><td><b>Theme Author</b></td><td><a href="'.esc_url($theme->get ('AuthorURI')).'" target="_blank">' . $theme->get ('Author') . '</a></td></tr>
</table>
</div>
</div>

<div class="about-page-panel system-info-panel"><div class="panel-content">
<h4>Active Plugins</h4>
<table cellspacing="0" cellpadding="3" border="0" class="system-status">
<col width="30%"/><col width="70%"/>
<tr class="even table-border-bottom"><td><b>Number of Active Plugins</b></td><td><b>' . count( (array) get_option( 'active_plugins' ) ) . '</b></td></tr>
' . $pluginList . '
</table>
</div>
</div>
';

echo $system_status;

?>