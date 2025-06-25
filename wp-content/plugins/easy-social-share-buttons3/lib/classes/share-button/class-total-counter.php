<?php

/**
 * Total Counter Generator Class
 *
 * This class is responsible for generating the HTML and functionality of the total counter
 * used in the Easy Social Share Buttons plugin. It provides methods to initialize default settings,
 * generate the counter HTML, format numbers, and manage display options.
 * 
 * @since 10.2
 * @package EasySocialShareButtons
 */
class ESSB_Total_Counter_Generator
{
    /**
     * @var bool $initialized Indicates whether the class has been initialized.
     *                        Defaults to false.
     */
    private static $initialized = false;

    private static $total_counter_hidden_till = '';
    private static $counter_total_text = '';
    private static $counter_total_text_shares = '';

    private static $counter_total_text_share = '';
    private static $counter_total_icon = '';

    private static $total_counter_afterbefore_text = '';

    /**
     * Initializes the default settings or values for the total counter.
     *
     * This method is responsible for setting up the default configurations
     * or values required for the total counter functionality in the plugin.
     *
     */
    public static function init_defaults()
    {
        self::$total_counter_hidden_till = essb_option_value('total_counter_hidden_till');
        if (!empty(self::$total_counter_hidden_till)) {
            self::$total_counter_hidden_till = intval(self::$total_counter_hidden_till);
        } else {
            self::$total_counter_hidden_till = 0;
        }

        self::$counter_total_text = essb_options_value('counter_total_text');
        if (empty(self::$counter_total_text)) {
            self::$counter_total_text = esc_html__('Total', 'essb');
        }

        self::$counter_total_text_shares = essb_option_value('activate_total_counter_text');
        if (empty(self::$counter_total_text_shares)) {
            self::$counter_total_text_shares = esc_html__('shares', 'essb');
        }

        self::$counter_total_text_share = essb_option_value('activate_total_counter_text_singular');
        if (empty(self::$counter_total_text_share)) {
            self::$counter_total_text_share = esc_html__('share', 'essb');
        }

        self::$counter_total_icon = essb_option_value('activate_total_counter_icon');
        if (empty(self::$counter_total_icon)) {
            self::$counter_total_icon = 'share-tiny';
        }

        self::$total_counter_afterbefore_text = essb_option_value('total_counter_afterbefore_text');
        if (empty(self::$total_counter_afterbefore_text)) {
            self::$total_counter_afterbefore_text = esc_html__('{TOTAL} shares', 'essb');
        }
    }

    /**
     * Generates the total counter HTML element.
     *
     * @param string $position The position of the counter (e.g., 'left', 'right', etc.).
     * @param int    $value    The value of the counter to display (default is 0).
     * @param string $tag      The HTML tag to use for the counter element (default is 'li').
     *
     * @return string The generated HTML for the total counter.
     */
    public static function generate($position = '', $value = 0, $tag = 'li', $button_display_position = '', $salt = '')
    {
        // Loading the defaults
        if (!self::$initialized) {
            self::init_defaults();
            self::$initialized = true;
        }

        $display_value = self::format_display_number($value);
        // If the share value is animated
        if (essb_option_bool_value('animate_total_counter')) {
            $display_value = '<span class="essb_animated" data-cnt="' . $value . '" data-cnt-short="' . $display_value . '">&nbsp;</span>';
        }

        $code = '<' . $tag . ' class="essb_item essb_totalcount_item essb_totalcount essb_tc_pos_' . $position . '"';

        // If the share counter is hidden
        if ($position == 'hidden') {
            $code .= ' style="display: none !important;"';
        } else {
            if (self::$total_counter_hidden_till != '' && intval(self::$total_counter_hidden_till) > 0 && intval(self::$total_counter_hidden_till) > intval($value)) {
                $code .= ' style="display: none !important;" data-essb-hide-till="' . esc_attr(self::$total_counter_hidden_till) . '"';
            }
        }

        $code .= ' data-counter-pos="' . esc_attr($position) . '"';
        $code .= ' data-counter-value="' . esc_attr($value) . '"';

        $code .= '>'; // end opening li tag

        $code .= '<div class="essb-tc-block ' . self::get_block_class($position) . '">';

        switch ($position) {
            case 'left':
            case 'right':
                $code .= '<span class="essb-tc-block-text">' . self::$counter_total_text . '</span>';
                $code .= '<span class="essb-tc-block-number">' . $display_value . '</span>';
                break;

            case 'leftbig':
            case 'rightbig':
                $code .= '<span class="essb-tc-block-number">' . $display_value . '</span>';
                $code .= '<span class="essb-tc-block-text">' . (intval($value) == 1 ? self::$counter_total_text_share : self::$counter_total_text_shares) . '</span>';
                break;

            case 'leftbigicon':
            case 'rightbigicon':
                $code .= '<div class="essb-tc-block-icon">' . essb_svg_icon(self::$counter_total_icon) . '</div>';
                $code .= '<div class="essb-tc-block-values">';
                $code .= '<span class="essb-tc-block-number">' . $display_value . '</span>';
                $code .= '<span class="essb-tc-block-text">' . (intval($value) == 1 ? self::$counter_total_text_share : self::$counter_total_text_shares) . '</span>';
                $code .= '</div>';
                break;

            case 'before':
            case 'after':
                $userbased_text = self::$total_counter_afterbefore_text;
                $userbased_text = str_replace('{TOTAL}', '<span class="essb-tc-block-number">' . $display_value . '</span>', $userbased_text);
                $code .= '<div class="essb-tc-block-values">' . $userbased_text . '</div>';
                break;
        }

        $code .= '</div>';

        $code .= '</' . $tag . '>'; // end counter element tag

        return $code;
    }

    public static function register_additional_styles($position = '', $button_display_position = '', $salt = '')
    {
        $r = '';
        $output = '';
        $container_key = '';
        $container_salt_key = '';

        if (!empty($salt)) {
            $container_salt_key = '.essb_' . $salt;
        }

        if (!empty($button_display_position)) {
            $container_key = '.essb_displayed_' . $button_display_position;
        }

        if ($button_display_position == 'sidebar' || $button_display_position == 'postfloat') {
            $output .= $container_key . '.essb_links .essb-tc-block { margin: 0; margin-bottom: 5px; flex-direction: column; }';
            $output .= $container_key . '.essb_links .essb-tc-style-text-big-icon .essb-svg-icon { margin-right: 0; }';
        }

        if (!empty($output)) {
            $r = ESSB_Dynamic_CSS_Builder::output_inline_code('sharing-total-' . $button_display_position . '-' . $position, $output, true);
        }
        return $r;
    }

    /**
     * Retrieves the CSS class for a block based on its position.
     *
     * @param string $position The position of the block (optional).
     *                         This parameter can be used to determine
     *                         the specific class to return.
     * @return string The CSS class for the block.
     */
    public static function get_block_class($position = '')
    {
        $r = '';

        switch ($position) {
            case 'hidden':
                $r = 'essb-tc-style-hidden';
                break;
            case 'left':
            case 'right':
                $r = 'essb-tc-style-text';
                break;
            case 'leftbig':
            case 'rightbig':
                $r = 'essb-tc-style-text-big';
                break;
            case 'leftbigicon':
            case 'rightbigicon':
                $r = 'essb-tc-style-text-big-icon';
                break;
            case 'before':
            case 'after':
                $r = 'essb-tc-style-line';
                break;
        }

        return $r;
    }

    /**
     * Formats a given number for display purposes.
     *
     * This method takes a numeric value and formats it into a human-readable
     * string representation, typically used for displaying counts or totals.
     *
     * @param int|float $value The numeric value to be formatted. Defaults to 0.
     * @return string The formatted number as a string.
     */
    public static function format_display_number($value = 0)
    {
        $value_format = essb_option_value('total_counter_format');
        $r = '';

        switch ($value_format) {
            case 'full':
                $r = number_format(intval($value));
                break;
            case 'fulldot':
                $r = number_format(intval($value), 0, '', '.');
                break;
            case 'fullcomma':
                $r = number_format(intval($value), 0, '', ',');
                break;
            case 'fullspace':
                $r = number_format(intval($value), 0, '', ' ');
                break;
            case 'no':
                $r = intval($value);
                break;
            default:
                $r = self::shorten_value($value);
                break;
        }
        return $r;
    }

    /**
     * Shortens a numeric value into a human-readable format with suffixes.
     *
     * This method takes a numeric value and converts it into a shorter format
     * with appropriate suffixes such as 'K' for thousands and 'M' for millions.
     * It ensures proper formatting and rounding for readability.
     *
     * @param int $val The numeric value to be shortened. Defaults to 0.
     * 
     * @return string|int The shortened value as a string with a suffix ('K', 'M'),
     *                    or the original value formatted as a number if less than 1000.
     *                    Returns 0 if the input value is not provided or is 0.
     */
    public static function shorten_value($val = 0)
    {
        if ($val) {
            $val = intval($val);
            if ($val < 1000) {
                return number_format($val);
            } else {
                if ($val < 1200) {
                    $val = intval($val) / 1000;
                    return number_format($val, 1) . 'K';
                } else {
                    if ($val < 1000000) {
                        $val = intval($val) / 1000;
                        return number_format($val, 1) . 'K';
                    } else {
                        $val = intval($val) / 1000000;
                        return number_format($val, 1) . 'M';
                    }
                }
            }
        } else {
            return 0;
        }
    }
}
