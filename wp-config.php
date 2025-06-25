<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'jF<x3I] guY0`Kf5<%~1ni16`w$,0HL~[!2?()OefG=}lJ-{KV8Pna@dB!w?_=[/' );
define( 'SECURE_AUTH_KEY',   '_7_rPM<L9<o/Fk5XZV% (QYj_Gh80|ag]yun2zTxroAO+.YL sw{&O*3]izE1{B/' );
define( 'LOGGED_IN_KEY',     'fevxl~H,]B-WwzD$R S^wMNFSfSf$ax2zj]fxq+B=_*+oO{v^k[S[7cBMn1:a5~1' );
define( 'NONCE_KEY',         'OU&-Op`M0|j{)PptLXXA*S$~nsK1:{d}m@kR*<8d#m85Nk*)AM:u.bXAcWU4UF3n' );
define( 'AUTH_SALT',         'XR_V%pk_Y[^@eSdKFrk2Sk*J)lh~P0-TSSIm]>*_7FnjT;T}xiMH5=`!LJUy9$hD' );
define( 'SECURE_AUTH_SALT',  'qTxbx)9l!v<2_r]{a:P-pRk]TrW<$zwyBw=^>/nb5Fu3oj=ea8q:mr]ZBO=ztRkO' );
define( 'LOGGED_IN_SALT',    '}}7A$DUo<g%fib`QIR8]iAAkqUsLGDA+Dv[NCGZ_@|Pa8_FdwHwNp++f~Z?n.BMw' );
define( 'NONCE_SALT',        '(}P0wJPh6PLs3&n4oPY_&#Sa`%nZ;*oG4.[]~zsGGa~|&@8+H7$E/VX~#9*+OoT<' );
define( 'WP_CACHE_KEY_SALT', '7D;d)^6}M;fc6}[Eqak;lYHa4FLS.O^z15_d8e{369JlNGl-wE:L*:i%#_E.OZ^^' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
