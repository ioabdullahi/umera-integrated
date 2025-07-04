<?php
/**
 * @package EasySocialShareButtons\SocialShareOptimization
 * @author appscreo
 * @since 4.2
 * @version 4.0
 *
 * Generate Open Graph meta tags
 */

class ESSB_OpenGraph {
	
	/**
	 * Handle all meta sharing details
	 * @see class-metadetails.php
	 */
	private $meta_details = null;
	
	private $seo_integrations = null;
	
	/**
	 * Create instance of social media optimization tags
	 */
	public function __construct() {
		
		if (!is_admin()) {
			$this->meta_details = ESSB_FrontMetaDetails::get_instance();
			$this->seo_integrations = ESSB_SEO_Plugin_Integrations_SMO::get_instance();
			
			add_filter( 'language_attributes', array( $this, 'add_opengraph_namespace' ), 15 );
			
			add_action( 'essb_opengraph', array( $this, 'locale' ), 1 );
			add_action( 'essb_opengraph', array( $this, 'type' ), 5 );
			add_action( 'essb_opengraph', array( $this, 'og_title' ), 10 );
			add_action( 'essb_opengraph', array( $this, 'description' ), 11 );
			add_action( 'essb_opengraph', array( $this, 'url' ), 12 );
			add_action( 'essb_opengraph', array( $this, 'site_name' ), 13 );

			if (essb_options_bool_value('sso_advanced_tags')) {
				add_action( 'essb_opengraph', array( $this, 'website_facebook' ), 14 );
				add_action( 'essb_opengraph', array( $this, 'site_owner' ), 20 );
				add_action( 'essb_opengraph', array( $this, 'article_author_facebook' ), 15 );
			}
			add_action( 'essb_opengraph', array( $this, 'tags' ), 16 );
			add_action( 'essb_opengraph', array( $this, 'category' ), 17 );
			add_action( 'essb_opengraph', array( $this, 'publish_date' ), 19 );
			
			add_action( 'essb_opengraph', array( $this, 'image' ), 30 );
			add_action( 'essb_opengraph_image_only', array( $this, 'image' ), 30 );
				
			add_action( 'wp_head', array( $this, 'opengraph' ), 1 );
		}
		else {
		    /**
		     * @since 7.7.4 enable additional contact fileds
		     */
		    add_filter( 'user_contactmethods', array( $this, 'update_contactmethods' ), 10, 1 );
		}
	}
	
	public function update_contactmethods($contactmethods) {
	    $contactmethods['facebook']   = esc_html__( 'Facebook profile URL', 'essb' );
	    
	    return $contactmethods;
	}

	/**
	 * Output open graph tags
	 */
	public function opengraph() {
		
		if (is_single() || is_page() || is_front_page() || is_home() || is_search() || is_category() || is_tag() || is_tax() || is_author()) {
			wp_reset_query();		
			
			$deactivate_trigger = false;
			
			if (essb_is_module_deactivated_on('sso') || essb_is_plugin_deactivated_on()) {
				$deactivate_trigger = true;
			}
			
			$deactivate_trigger = apply_filters('essb_deactivate_opengraph', $deactivate_trigger);

			if (!$deactivate_trigger) {
			    echo PHP_EOL . '<!-- Easy Social Share Buttons for WordPress v.' . ESSB3_VERSION . ' https://socialsharingplugin.com -->' . PHP_EOL;
			    if ($this->seo_integrations->seo_plugin_found()) {
			        do_action( 'essb_opengraph_image_only' );
			    }
			    else {
				    do_action( 'essb_opengraph' );
			    }
				echo '<!-- / Easy Social Share Buttons for WordPress -->' . PHP_EOL;
			}
		}
	}
	
	/**
	 * Generate single open graph tag inside page content
	 * 
	 * @param string $property
	 * @param string $content
	 * @return boolean
	 */
	public function og_tag( $property, $content ) {
		$og_property = str_replace( ':', '_', $property );

		$content = apply_filters( 'essb_og_' . $og_property, $content );
		if ( empty( $content ) ) {
			return false;
		}
	
		echo '<meta property="', esc_attr( $property ), '" content="', esc_attr( $content ), '" />', "\n";
	
		return true;
	}
	
	public function add_opengraph_namespace( $input ) {
		$namespaces = array(
				'og: http://ogp.me/ns#',
		);
		
		if ( essb_option_value('opengraph_tags_fbapp') != ''  ) {
			$namespaces[] = 'fb: http://ogp.me/ns/fb#';
		}
	
		$namespace_string = implode( ' ', array_unique( $namespaces ) );
	
		if ( strpos( $input, ' prefix=' ) !== false ) {
			$regex   = '`prefix=([\'"])(.+?)\1`';
			$replace = 'prefix="$2 ' . $namespace_string . '"';
			$input   = preg_replace( $regex, $replace, $input );
		}
		else {
			$input .= ' prefix="' . $namespace_string . '"';
		}
	
		return $input;
	}
	
	
	public function locale( $echo = true ) {

		$locale = get_locale();
	
		// Catch some weird locales served out by WP that are not easily doubled up.
		$fix_locales = array(
				'ca' => 'ca_ES',
				'en' => 'en_US',
				'el' => 'el_GR',
				'et' => 'et_EE',
				'ja' => 'ja_JP',
				'sq' => 'sq_AL',
				'uk' => 'uk_UA',
				'vi' => 'vi_VN',
				'zh' => 'zh_CN',
		);
	
		if ( isset( $fix_locales[ $locale ] ) ) {
			$locale = $fix_locales[ $locale ];
		}
	
		// Convert locales like "es" to "es_ES", in case that works for the given locale (sometimes it does).
		if ( strlen( $locale ) == 2 ) {
			$locale = strtolower( $locale ) . '_' . strtoupper( $locale );
		}
	
		// These are the locales FB supports.
		$fb_valid_fb_locales = array(
				'af_ZA', // Afrikaans.
				'ak_GH', // Akan.
				'am_ET', // Amharic.
				'ar_AR', // Arabic.
				'as_IN', // Assamese.
				'ay_BO', // Aymara.
				'az_AZ', // Azerbaijani.
				'be_BY', // Belarusian.
				'bg_BG', // Bulgarian.
				'bn_IN', // Bengali.
				'br_FR', // Breton.
				'bs_BA', // Bosnian.
				'ca_ES', // Catalan.
				'cb_IQ', // Sorani Kurdish.
				'ck_US', // Cherokee.
				'co_FR', // Corsican.
				'cs_CZ', // Czech.
				'cx_PH', // Cebuano.
				'cy_GB', // Welsh.
				'da_DK', // Danish.
				'de_DE', // German.
				'el_GR', // Greek.
				'en_GB', // English (UK).
				'en_IN', // English (India).
				'en_PI', // English (Pirate).
				'en_UD', // English (Upside Down).
				'en_US', // English (US).
				'eo_EO', // Esperanto.
				'es_CL', // Spanish (Chile).
				'es_CO', // Spanish (Colombia).
				'es_ES', // Spanish (Spain).
				'es_LA', // Spanish.
				'es_MX', // Spanish (Mexico).
				'es_VE', // Spanish (Venezuela).
				'et_EE', // Estonian.
				'eu_ES', // Basque.
				'fa_IR', // Persian.
				'fb_LT', // Leet Speak.
				'ff_NG', // Fulah.
				'fi_FI', // Finnish.
				'fo_FO', // Faroese.
				'fr_CA', // French (Canada).
				'fr_FR', // French (France).
				'fy_NL', // Frisian.
				'ga_IE', // Irish.
				'gl_ES', // Galician.
				'gn_PY', // Guarani.
				'gu_IN', // Gujarati.
				'gx_GR', // Classical Greek.
				'ha_NG', // Hausa.
				'he_IL', // Hebrew.
				'hi_IN', // Hindi.
				'hr_HR', // Croatian.
				'hu_HU', // Hungarian.
				'hy_AM', // Armenian.
				'id_ID', // Indonesian.
				'ig_NG', // Igbo.
				'is_IS', // Icelandic.
				'it_IT', // Italian.
				'ja_JP', // Japanese.
				'ja_KS', // Japanese (Kansai).
				'jv_ID', // Javanese.
				'ka_GE', // Georgian.
				'kk_KZ', // Kazakh.
				'km_KH', // Khmer.
				'kn_IN', // Kannada.
				'ko_KR', // Korean.
				'ku_TR', // Kurdish (Kurmanji).
				'ky_KG', // Kyrgyz.
				'la_VA', // Latin.
				'lg_UG', // Ganda.
				'li_NL', // Limburgish.
				'ln_CD', // Lingala.
				'lo_LA', // Lao.
				'lt_LT', // Lithuanian.
				'lv_LV', // Latvian.
				'mg_MG', // Malagasy.
				'mi_NZ', // Maori.
				'mk_MK', // Macedonian.
				'ml_IN', // Malayalam.
				'mn_MN', // Mongolian.
				'mr_IN', // Marathi.
				'ms_MY', // Malay.
				'mt_MT', // Maltese.
				'my_MM', // Burmese.
				'nb_NO', // Norwegian (bokmal).
				'nd_ZW', // Ndebele.
				'ne_NP', // Nepali.
				'nl_BE', // Dutch (Belgie).
				'nl_NL', // Dutch.
				'nn_NO', // Norwegian (nynorsk).
				'ny_MW', // Chewa.
				'or_IN', // Oriya.
				'pa_IN', // Punjabi.
				'pl_PL', // Polish.
				'ps_AF', // Pashto.
				'pt_BR', // Portuguese (Brazil).
				'pt_PT', // Portuguese (Portugal).
				'qu_PE', // Quechua.
				'rm_CH', // Romansh.
				'ro_RO', // Romanian.
				'ru_RU', // Russian.
				'rw_RW', // Kinyarwanda.
				'sa_IN', // Sanskrit.
				'sc_IT', // Sardinian.
				'se_NO', // Northern Sami.
				'si_LK', // Sinhala.
				'sk_SK', // Slovak.
				'sl_SI', // Slovenian.
				'sn_ZW', // Shona.
				'so_SO', // Somali.
				'sq_AL', // Albanian.
				'sr_RS', // Serbian.
				'sv_SE', // Swedish.
				'sw_KE', // Swahili.
				'sy_SY', // Syriac.
				'sz_PL', // Silesian.
				'ta_IN', // Tamil.
				'te_IN', // Telugu.
				'tg_TJ', // Tajik.
				'th_TH', // Thai.
				'tk_TM', // Turkmen.
				'tl_PH', // Filipino.
				'tl_ST', // Klingon.
				'tr_TR', // Turkish.
				'tt_RU', // Tatar.
				'tz_MA', // Tamazight.
				'uk_UA', // Ukrainian.
				'ur_PK', // Urdu.
				'uz_UZ', // Uzbek.
				'vi_VN', // Vietnamese.
				'wo_SN', // Wolof.
				'xh_ZA', // Xhosa.
				'yi_DE', // Yiddish.
				'yo_NG', // Yoruba.
				'zh_CN', // Simplified Chinese (China).
				'zh_HK', // Traditional Chinese (Hong Kong).
				'zh_TW', // Traditional Chinese (Taiwan).
				'zu_ZA', // Zulu.
				'zz_TR', // Zazaki.
		);
	
		// Check to see if the locale is a valid FB one, if not, use en_US as a fallback.
		if ( ! in_array( $locale, $fb_valid_fb_locales ) ) {
			$locale = strtolower( substr( $locale, 0, 2 ) ) . '_' . strtoupper( substr( $locale, 0, 2 ) );
			if ( ! in_array( $locale, $fb_valid_fb_locales ) ) {
				$locale = 'en_US';
			}
		}
	
		if ( $echo !== false ) {
			$this->og_tag( 'og:locale', $locale );
		}
	
		return $locale;
	}
	
	public function type( $echo = true ) {
	
		if ( is_front_page() || is_home() ) {
			$type = 'website';
		}
		elseif ( is_single () || is_page () ) {
			$type = 'article';
		}
		else {
			// We use "object" for archives etc. as article doesn't apply there.
			$type = 'object';
		}
		
		if (essb_option_bool_value('sso_gifimages')) {
			$img = $this->meta_details->image();
			if (!empty($img) && is_string($img)) {
				if ($this->is_gif($img)) {
					add_filter( 'essb_opengraph_type', array( $this, 'return_type_gif' ) );
				}
			}
		}
	

		$type = apply_filters( 'essb_opengraph_type', $type );
	
		if ( is_string( $type ) && $type !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:type', $type );			
			}
			else {
				return $type;
			}
		}
	
		return '';
	}
	
	public function og_title( $echo = true ) {
	
		$title = $this->meta_details->title();
		
		$title = trim( apply_filters( 'essb_opengraph_title', $title ) );
	
		if ( is_string( $title ) && $title !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:title', $title );
	
				return true;
			}
		}
	
		if ( $echo === false ) {
			return $title;
		}
	
		return false;
	}
	
	public function site_owner() {
		if ( essb_option_value('opengraph_tags_fbapp') != '' ) {
			$this->og_tag( 'fb:app_id', essb_option_value('opengraph_tags_fbapp') );
	
			return true;
		}
	
		return false;
	}
	
	public function description( $echo = true ) {
	
		$ogdesc = trim( apply_filters( 'essb_opengraph_desc', $this->meta_details->description() ) );
	
		if ( is_string( $ogdesc ) && $ogdesc !== '' ) {
			if ( $echo !== false ) {
				$this->og_tag( 'og:description', $ogdesc );
			}
		}
	
		return $ogdesc;
	}

	public function url() {
		$url = apply_filters( 'essb_opengraph_url', $this->meta_details->url() );
		
		if (essb_option_bool_value('sso_httpshttp')) {
			$url = str_replace('https://', 'http://', $url);
		}
	
		if ( is_string( $url ) && $url !== '' ) {
			$this->og_tag( 'og:url', esc_url( $url ) );
	
			return true;
		}
	
		return false;
	}
	
	public function site_name() {
		$name = apply_filters( 'essb_opengraph_site_name', get_bloginfo( 'name' ) );
		if ( is_string( $name ) && $name !== '' ) {
			$this->og_tag( 'og:site_name', $name );
		}
	}
	
	public function website_facebook() {
	
		$tags_fbpage = essb_option_value('opengraph_tags_fbpage');
		
		if ( 'article' === $this->type( false ) && $tags_fbpage != '' ) {
			$this->og_tag( 'article:publisher', $tags_fbpage );
	
			return true;
		}
	
		return false;
	}
	
	/**
	 * The generation of the author is allowed for taxonomies too. The check for 
	 * post optimizations will happen only for singular posts/pages
	 * 
	 */
	public function article_author_facebook() {
		if (!is_singular()) {
			return;
		}
		
		/**
		 * The global setting
		 */
		$facebook = essb_option_value('opengraph_tags_fbauthor');
		
		if (is_singular()) {
		    /**
		     * The current post setting
		     */
			$onpost_fb_authorship = get_post_meta (get_the_ID(), 'essb_post_og_author', true);
			
			if (!empty($onpost_fb_authorship)) {
				$facebook = $onpost_fb_authorship;
			}
			
			/**
			 * The user meta field
			 */
			$user_fb_authorship = get_the_author_meta('facebook');
			if ($user_fb_authorship != '') {
			    $facebook = $user_fb_authorship;
			}
		}
		
		$facebook = apply_filters( 'essb_opengraph_author_facebook', $facebook );
	
		if ( $facebook && ( is_string( $facebook ) && $facebook !== '' ) ) {
			$this->og_tag( 'article:author', $facebook );
	
			return true;
		}
	
		return false;
	}
	
	public function tags() {
		if ( ! is_singular() ) {
			return false;
		}
	
		$tags = get_the_tags();
		if ( ! is_wp_error( $tags ) && ( is_array( $tags ) && $tags !== array() ) ) {
	
			foreach ( $tags as $tag ) {
				$this->og_tag( 'article:tag', $tag->name );
			}
	
			return true;
		}
	
		return false;
	}
	
	public function category() {
	
		if ( ! is_singular() ) {
			return false;
		}
	
		$terms = get_the_category();
	
		if ( ! is_wp_error( $terms ) && ( is_array( $terms ) && $terms !== array() ) ) {
	
			// We can only show one section here, so we take the first one.
			$this->og_tag( 'article:section', $terms[0]->name );
	
			return true;
		}
	
		return false;
	}
	
	public function publish_date() {
	
		if ( ! is_singular( 'post' ) ) {
			/**
			 * Filter: 'essb_opengraph_show_publish_date' - Allow showing publication date for other post types
			 *
			 * @api bool $unsigned Whether or not to show publish date
			 *
			 * @param string $post_type The current URL's post type.
			 */
			if ( false === apply_filters( 'essb_opengraph_show_publish_date', false, get_post_type() ) ) {
				return false;
			}
		}
	
		$pub = get_the_date( DATE_W3C );
		$this->og_tag( 'article:published_time', $pub );
	
		$mod = get_the_modified_date( DATE_W3C );
		if ( $mod != $pub ) {
			$this->og_tag( 'article:modified_time', $mod );
			$this->og_tag( 'og:updated_time', $mod );
		}
	
		return true;
	}
	
	public function image( ) {
		
		$img = $this->meta_details->image();
		
		$img = trim( apply_filters( 'essb_opengraph_image', $img ) );
		
		if (!empty($img) && is_string($img)) {
			$this->og_tag( 'og:image', esc_url( $img ) );
			
			// Adding secure image too
			if ( strpos( $img, 'https://' ) === 0 ) {
			    $this->og_tag( 'og:image:secure_url', esc_url( $img ) );
			}
			
			if (essb_option_bool_value('sso_gifimages')) {
				if ($this->is_gif($img)) {
					add_filter( 'essb_opengraph_type', array( $this, 'return_type_gif' ) );
				}
			}
		}
		
		if (essb_option_bool_value('sso_multipleimages')) {
			$images = $this->meta_details->additional_images();
			
			foreach ($images as $img) {
				$this->og_tag( 'og:image', esc_url( $img ) );
				
				if ( strpos( $img, 'https://' ) === 0 ) {
				    $this->og_tag( 'og:image:secure_url', esc_url( $img ) );
				}
			}
		}
		
		if (essb_option_bool_value('sso_imagesize')) {
		    
		    $thumb = $img;
		    //if (empty($thumb)) {
		    //    $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'original' );
		    //}
		    
		    if (!empty($thumb)) {
		        try {
		            if ( $this->check_featured_image_size( $thumb ) ) {
		                if ( ! empty( $thumb[1] ) ) {
		                    $this->og_tag( 'og:image:width', absint( $thumb[1] ) );
		                }
		                
		                if ( ! empty( $thumb[2] ) ) {
		                    $this->og_tag( 'og:image:height', absint( $thumb[2] ) );
		                }
		            }
		            else {
		                $image_file = '';
		                
		                if (is_array($thumb)) {
		                    $image_file = $thumb[0];
		                }
		                else {
		                    $image_file = $thumb;
		                }
		                
		                if (!empty($image_file)) {
		                    try {
        		                $image_details = getimagesize($image_file);
                		        
                		        if ( ! empty( $image_details[0] ) ) {
                		            $this->og_tag( 'og:image:width', absint( $image_details[0] ) );
                		        }
                		        
                		        if ( ! empty( $image_details[1] ) ) {
                		            $this->og_tag( 'og:image:height', absint( $image_details[1] ) );
                		        }
		                    }
		                    catch (Exception $e) {
		                        
		                    }
		                }
		            }
		        }
		      catch (Exception $e) {
		      }
		    }
		    
		}
		
	}
	
	public function return_type_gif($type) {
		return 'video.other';
	}
	
	private function is_gif($img) {
		if ( strpos( $img, '.gif' ) ) {
			return true;
		}
		else {
			return false;
		}
	}
	
	private function check_featured_image_size( $img_data ) {
	
		if ( ! is_array( $img_data ) ) {
			return false;
		}
	
		// Get the width and height of the image.
		if ( $img_data[1] < 200 || $img_data[2] < 200 ) {
			return false;
		}
	
		return true;
	}
}