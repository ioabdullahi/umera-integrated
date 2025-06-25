<?php

/**
 * Class ESSB_Manage_Share_Networks
 *
 * This class is responsible for managing social share networks within the Easy Social Share Buttons plugin.
 *
 * @package EasySocialShareButtons
 * @since 10.2.1
 * @author Easy Social Share Buttons Team
 */
class ESSB_Manage_Share_Networks
{
    /**
     * List of social networks
     * @var array
     */
    public $networks = array();

    /**
     * List of active social networks
     * @var null|array
     */
    private $active_networks_list = null;

    private $validate_active_networks_list = false;

    public static $_instance;

    public static function instance()
    {
        if (! (self::$_instance instanceof self)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    /**
     * Cloning disabled
     */
    public function __clone() {}

    /**
     * Serialization disabled
     */
    public function __sleep() {}

    /**
     * De-serialization disabled
     */
    public function __wakeup() {}

    public function __construct()
    {
        // Output the network ID colors
        add_filter('essb_css_buffer_head', array($this, 'prepare_css_styles'));

        // Include networks in the list for picking and executing
        add_filter('essb_available_social_share_networks', array($this, 'register_added_networks'));

        /**
         * Validates if the social network is enabled or not in the list.
         * This ensures that only active social networks are processed or displayed.
         */
        if (essb_option_bool_value('activate_networks_manage')) {
            if (is_null($this->active_networks_list)) {
                $this->active_networks_list = essb_option_value('functions_networks');
                $this->validate_active_networks_list = true;
                if (!is_array($this->active_networks_list)) {
                    $this->active_networks_list = array();
                }
            }
        }
    }
    /**
     * Registers an SVG icon with a given ID and SVG code.
     *
     * This method allows you to add a custom SVG icon to the system by providing
     * a unique identifier and the corresponding SVG code.
     *
     * @param string $svg_id   The unique identifier for the SVG icon.
     * @param string $svg_code The SVG code representing the icon.
     *
     * @return void
     */
    public function register_svg($svg_id, $svg_code)
    {
        if (!class_exists('ESSB_SVG_Icons')) {
            include_once(ESSB3_CLASS_PATH . 'assets/class-svg-icons.php');
        }
        ESSB_SVG_Icons::register_icon_code($svg_id, $svg_code);
    }

    /**
     * Retrieves the share address for a specific social network.
     *
     * @param string $network_id The ID of the social network for which the share address is being retrieved.
     * @param array $share Optional. An array of share data to be used in generating the share address. Default is an empty array.
     * @param array $additional_parameters Optional. An array of additional parameters to include in the share address. Default is an empty array.
     * @return string The generated share address for the specified social network.
     */
    public function get_share_address($network_id = '', $share = array(), $additional_parameters = array())
    {
        $r = '';

        if (isset($this->networks[$network_id])) {
            $command = $this->networks[$network_id]['share'];

            if (is_string($command)) {
                $r = strtr($command, $this->default_share_replace_pairs($share));

                if (!empty($additional_parameters)) {
                    $r = strtr($r, $additional_parameters);
                }
            } else if (is_array($command)) {
                $base_url = $command['url'];
                $query = $command['query'];

                foreach ($query as $param => $model) {
                    if (isset($additional_parameters[$model])) {
                        $value = $additional_parameters[$model];
                    } else {
                        if (isset($share[$model])) {
                            $value = $share[$model];
                        }
                    }

                    if (strpos($value, '{') !== false) {
                        $value = strtr($value, $this->default_share_replace_pairs($share));
                    }

                    if (!empty($value)) {
                        $base_url = add_query_arg($param, $value, $base_url);
                    }
                }

                $r = $base_url;
            }
        }

        return $r;
    }

    /**
     * Provides the default replacement pairs for share data.
     *
     * This method is used to define the default key-value pairs that will be used
     * to replace placeholders in share data. It accepts an optional array of share
     * data to customize the replacement pairs.
     *
     * @param array $share Optional. An array of share data to customize the replacement pairs.
     *                     Default is an empty array.
     * @return array The default replacement pairs for share data.
     */
    private function default_share_replace_pairs($share = array())
    {
        $r = array();

        $keys = array('url', 'short_url', 'title', 'image', 'title_plain', 'description', 'short_url_twitter', 'pinterest_image', 'full_url', 'pinterest_desc');

        foreach ($keys as $key) {
            $value = isset($share[$key]) ? $share[$key] : '';

            if ($key == 'pinterest_image' && empty($value)) {
                $value = isset($share['image']) ? $share['image'] : '';
            }

            if (($key == 'short_url' || $key == 'short_url_twitter') && empty($value)) {
                $value = isset($share['url']) ? $share['url'] : '';
            }

            if ($key == 'pinterest_desc' && empty($value)) {
                $value = isset($share['title']) ? $share['title'] : '';
            }

            $r['{' . $key . '}'] = $value;
        }

        return $r;
    }

    /**
     * Checks if a specific social network exists.
     *
     * @param string $network_id The ID of the social network to check. Default is an empty string.
     * @return bool True if the network exists, false otherwise.
     */
    public function exist_network($network_id = '')
    {
        return isset($this->networks[$network_id]) ? true : false;
    }

    /**
     * Adds a new social network to the list.
     *
     * @param string       $network_id   The unique identifier for the social network.
     * @param string       $network_name The display name of the social network.
     * @param string|array $icon         The icon representation for the social network. 
     *                                   Can be a string (icon alias) or an array containing 
     *                                   the icon alias and SVG code.
     * @param string       $base_color   The base color associated with the social network.
     * @param string|array $share        Share command for the social network
     */
    public function add($network_id, $network_name, $icon, $base_color, $share)
    {
        $icon_alias = '';
        if (is_array($icon)) {
            $this->register_svg($icon['icon_id'], $icon['svg']);
            $icon_alias = $icon['icon_id'];
        } else {
            $icon_alias = $icon;
        }

        $this->networks[$network_id] = array(
            'name' => $network_name,
            'icon' => $icon_alias,
            'base_color' => $base_color,
            'share' => $share
        );
    }

    public function register_added_networks($networks = array())
    {
        foreach ($this->networks as $id => $data) {
            if ($this->is_network_disabled($id)) {
                continue;
            }

            $networks[$id] = array('name' => $data['name'], 'type' => 'buildin', 'supports' => 'desktop,mobile,retina templates only');
        }

        return $networks;
    }

    /**
     * Checks if a social network is registered.
     *
     * @param string $network_id The ID of the social network to check.
     * @return bool True if the network is registered, false otherwise.
     */
    private function is_network_disabled($network_id)
    {
        $r = false;

        if ($this->validate_active_networks_list) {
            $list = is_null($this->active_networks_list) ? array() : $this->active_networks_list;

            if (!isset($list[$network_id])) {
                $r = true;
            }
        }

        return $r;
    }

    /**
     * Prepares the CSS styles for the social share networks.
     *
     * This method generates CSS code for each enabled social network, setting
     * a custom CSS variable (--essb-network) with the base color of the network.
     * Disabled networks are skipped during the generation process.
     *
     * @return string The generated CSS code for the enabled social networks.
     */
    public function prepare_css_styles()
    {
        $css_code = '';

        foreach ($this->networks as $id => $data) {
            if ($this->is_network_disabled($id)) {
                continue;
            }

            $css_code .= '.essb_links .essb_link_' . esc_attr($id) . ' { --essb-network: ' . esc_attr($data['base_color']) . ';}';
        }

        return $css_code;
    }

    public function get_admin_styles()
    {
        $css_code = '';

        foreach ($this->networks as $id => $data) {
            if ($this->is_network_disabled($id)) {
                continue;
            }

            $css_code .= '.essb_links .essb_link_' . esc_attr($id) . ' { --essb-network: ' . esc_attr($data['base_color']) . '}';
            $css_code .= '.essb-network-color-' . esc_attr($id) . ' { background-color: ' . esc_attr($data['base_color']) . '!important;color: #fff !important;}';
        }

        return $css_code;
    }
}

ESSB_Factory_Loader::activate_instance('essb-manage-share-networks', 'ESSB_Manage_Share_Networks');



function essb_manage_share_networks()
{
    if (!ESSB_Factory_Loader::running('essb-manage-share-networks')) {
        ESSB_Factory_Loader::activate_instance('essb-manage-share-networks', 'ESSB_Manage_Share_Networks');
    }

    return ESSB_Factory_Loader::get('essb-manage-share-networks');
}
