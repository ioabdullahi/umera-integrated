<?php
/**
 * Ninja Forms plugin integration
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * In this file we integrate Ninja Forms with our theme:
 *    – Add the NINJA FORMS module on Live Composer toolbar
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2015 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 *
 * -------------------------------------------------------------------
 *
 * Send your ideas on code improvement or new hook requests using
 * contact form on https://themeforest.net/user/blueastralthemes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

// Delete the redirect transient to not allow Ninja Forms to redirect
// theme users to their welcome page ont he first plugin install
delete_transient( '_nf_activation_redirect' );
