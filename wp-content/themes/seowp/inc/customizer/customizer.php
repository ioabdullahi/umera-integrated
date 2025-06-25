<?php
/**
 * Theme Customizer controls
 *
 * -------------------------------------------------------------------
 *
 * DESCRIPTION:
 *
 * This file describe all the controls we use in Theme Customizer.
 * We also extend default controls by creating value sliders,
 * custom color picker with transparency support, Goole Fonts, etc.
 *
 * @package    SEOWP WordPress Theme
 * @author     Vlad Mitkovsky <help@blueastralthemes.com>
 * @copyright  2014-2023 Blue Astral Themes
 * @license    GNU GPL, Version 3
 * @link       https://themeforest.net/user/blueastralthemes
 *
 * -------------------------------------------------------------------
 *
 * Send your ideas on code improvement or new hook requests using
 * contact form on https://themeforest.net/user/blueastralthemes
 */


/**
 * ----------------------------------------------------------------------
 * Adds body class .in-wp-customizer
 */
function lbmn_customizer_body_class( $classes = '' ) {
	if ( ! empty( $GLOBALS['wp_customize'] ) ) {
		$classes[] = 'in-wp-customizer';
	}

	return $classes;
}
add_filter( 'body_class', 'lbmn_customizer_body_class' );

function lbmn_get_goolefonts() {
	$googlefonts = array(
		"ABeeZee"                  => array( '400', '400italic' ),
		"Abel"                     => array(),
		"Abril+Fatface"            => array(),
		"Aclonica"                 => array(),
		"Acme"                     => array(),
		"Actor"                    => array(),
		"Adamina"                  => array(),
		"Advent+Pro"               => array( '100', '200', '300', '400', '500', '600', '700' ),
		"Aguafina+Script"          => array(),
		"Akronim"                  => array(),
		"Aladin"                   => array(),
		"Aldrich"                  => array(),
		"Alegreya"                 => array( '400', '400italic', '700', '700italic', '900', '900italic' ),
		"Alegreya+SC"              => array( '400', '400italic', '700', '700italic', '900', '900italic' ),
		"Alex+Brush"               => array(),
		"Alfa+Slab+One"            => array(),
		"Alice"                    => array(),
		"Alike"                    => array(),
		"Alike+Angular"            => array(),
		"Allan"                    => array( '400', '700' ),
		"Allerta"                  => array(),
		"Allerta+Stencil"          => array(),
		"Allura"                   => array(),
		"Almendra"                 => array( '400', '400italic', '700', '700italic' ),
		"Almendra+SC"              => array(),
		"Amarante"                 => array(),
		"Amaranth"                 => array( '400', '400italic', '700', '700italic' ),
		"Amatic+SC"                => array( '400', '700' ),
		"Amethysta"                => array(),
		"Anaheim"                  => array(),
		"Andada"                   => array(),
		"Andika"                   => array(),
		"Angkor"                   => array(),
		"Annie+Use+Your+Telescope" => array(),
		"Anonymous+Pro"            => array( '400', '400italic', '700', '700italic' ),
		"Antic"                    => array(),
		"Antic+Didone"             => array(),
		"Antic+Slab"               => array(),
		"Anton"                    => array(),
		"Arapey"                   => array( '400', '400italic' ),
		"Arbutus"                  => array(),
		"Arbutus+Slab"             => array(),
		"Architects+Daughter"      => array(),
		"Archivo+Black"            => array(),
		"Archivo+Narrow"           => array( '400', '400italic', '700', '700italic' ),
		"Arimo"                    => array( '400', '400italic', '700', '700italic' ),
		"Arizonia"                 => array(),
		"Armata"                   => array(),
		"Artifika"                 => array(),
		"Arvo"                     => array( '400', '400italic', '700', '700italic' ),
		"Asap"                     => array( '400', '400italic', '700', '700italic' ),
		"Asset"                    => array(),
		"Astloch"                  => array( '400', '700' ),
		"Asul"                     => array( '400', '700' ),
		"Atomic+Age"               => array(),
		"Aubrey"                   => array(),
		"Audiowide"                => array(),
		"Autour+One"               => array(),
		"Average"                  => array(),
		"Average+Sans"             => array(),
		"Averia+Gruesa+Libre"      => array(),
		"Averia+Libre"             => array( '300', '300italic', '400', '400italic', '700', '700italic' ),
		"Averia+Sans+Libre"        => array( '300', '300italic', '400', '400italic', '700', '700italic' ),
		"Averia+Serif+Libre"       => array( '300', '300italic', '400', '400italic', '700', '700italic' ),
		"Bad+Script"               => array(),
		"Balthazar"                => array(),
		"Bangers"                  => array(),
		"Basic"                    => array(),
		"Battambang"               => array( '400', '700' ),
		"Baumans"                  => array(),
		"Bayon"                    => array(),
		"Belgrano"                 => array(),
		"Belleza"                  => array(),
		"BenchNine"                => array( '300', '400', '700' ),
		"Bentham"                  => array(),
		"Berkshire+Swash"          => array(),
		"Bevan"                    => array(),
		"Bigshot+One"              => array(),
		"Bilbo"                    => array(),
		"Bilbo+Swash+Caps"         => array(),
		"Bitter"                   => array( '400', '400italic', '700' ),
		"Black+Ops+One"            => array(),
		"Bokor"                    => array(),
		"Bonbon"                   => array(),
		"Boogaloo"                 => array(),
		"Bowlby+One"               => array(),
		"Bowlby+One+SC"            => array(),
		"Brawler"                  => array(),
		"Bree+Serif"               => array(),
		"Bubblegum+Sans"           => array(),
		"Bubbler+One"              => array(),
		"Buda"                     => array( '300' ),
		"Buenard"                  => array( '400', '700' ),
		"Butcherman"               => array(),
		"Butterfly+Kids"           => array(),
		"Cabin"                    => array(
			'400',
			'400italic',
			'500',
			'500italic',
			'600',
			'600italic',
			'700',
			'700italic',
		),
		"Cabin+Condensed"          => array( '400', '500', '600', '700' ),
		"Cabin+Sketch"             => array( '400', '700' ),
		"Caesar+Dressing"          => array(),
		"Cagliostro"               => array(),
		"Calligraffitti"           => array(),
		"Cambo"                    => array(),
		"Candal"                   => array(),
		"Cantarell"                => array( '400', '400italic', '700', '700italic' ),
		"Cantata+One"              => array(),
		"Cantora+One"              => array(),
		"Capriola"                 => array(),
		"Cardo"                    => array( '400', '400italic', '700' ),
		"Carme"                    => array(),
		"Carrois+Gothic"           => array(),
		"Carrois+Gothic+SC"        => array(),
		"Carter+One"               => array(),
		"Caudex"                   => array( '400', '400italic', '700', '700italic' ),
		"Cedarville+Cursive"       => array(),
		"Ceviche+One"              => array(),
		"Changa+One"               => array( '400', '400italic' ),
		"Chango"                   => array(),
		"Chau+Philomene+One"       => array( '400', '400italic' ),
		"Chela+One"                => array(),
		"Chelsea+Market"           => array(),
		"Chenla"                   => array(),
		"Cherry+Cream+Soda"        => array(),
		"Cherry+Swash"             => array( '400', '700' ),
		"Chewy"                    => array(),
		"Chicle"                   => array(),
		"Chivo"                    => array( '400', '400italic', '900', '900italic' ),
		"Cinzel"                   => array( '400', '700', '900' ),
		"Cinzel+Decorative"        => array( '400', '700', '900' ),
		"Coda"                     => array( '400', '800', '800' ),
		"Codystar"                 => array( '300' ),
		"Codystar"                 => array( '400' ),
		"Combo"                    => array(),
		"Comfortaa"                => array( '300' ),
		"Comfortaa"                => array( '400', '700' ),
		"Coming+Soon"              => array(),
		"Concert+One"              => array(),
		"Condiment"                => array(),
		"Content"                  => array( '400', '700' ),
		"Contrail+One"             => array(),
		"Convergence"              => array(),
		"Cookie"                   => array(),
		"Copse"                    => array(),
		"Corben"                   => array( '400', '700' ),
		"Courgette"                => array(),
		"Cousine"                  => array( '400', '400italic', '700', '700italic' ),
		"Coustard"                 => array( '400', '900' ),
		"Covered+By+Your+Grace"    => array(),
		"Crafty+Girls"             => array(),
		"Creepster"                => array(),
		"Crete+Round"              => array( '400', '400italic' ),
		"Crimson+Text"             => array( '400', '400italic', '600', '600italic', '700', '700italic' ),
		"Crushed"                  => array(),
		"Cuprum"                   => array( '400', '400italic', '700', '700italic' ),
		"Cutive"                   => array(),
		"Cutive+Mono"              => array(),
		"Damion"                   => array(),
		"Dancing+Script"           => array( '400', '700' ),
		"Dangrek"                  => array(),
		"Dawning+of+a+New+Day"     => array(),
		"Days+One"                 => array(),
		"Delius"                   => array(),
		"Delius+Swash+Caps"        => array(),
		"Delius+Unicase"           => array( '400', '700' ),
		"Della+Respira"            => array(),
		"Devonshire"               => array(),
		"Didact+Gothic"            => array(),
		"Diplomata"                => array(),
		"Diplomata+SC"             => array(),
		"Doppio+One"               => array(),
		"Dorsa"                    => array(),
		"Dosis"                    => array( '200', '300' ),
		"Dosis"                    => array( '400', '500', '600', '700', '800' ),
		"Dr+Sugiyama"              => array(),
		"Droid+Sans"               => array( '400', '700' ),
		"Droid+Sans+Mono"          => array(),
		"Droid+Serif"              => array( '400', '400italic', '700', '700italic' ),
		"Duru+Sans"                => array(),
		"Dynalight"                => array(),
		"EB+Garamond"              => array(),
		"Eagle+Lake"               => array(),
		"Eater"                    => array(),
		"Economica"                => array( '400', '400italic', '700', '700italic' ),
		"Electrolize"              => array(),
		"Emblema+One"              => array(),
		"Emilys+Candy"             => array(),
		"Engagement"               => array(),
		"Enriqueta"                => array( '400', '700' ),
		"Erica+One"                => array(),
		"Esteban"                  => array(),
		"Euphoria+Script"          => array(),
		"Ewert"                    => array(),
		"Exo"                      => array(
			'100',
			'100italic',
			'200',
			'200italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'500',
			'500italic',
			'600',
			'600italic',
			'700',
			'700italic',
			'800',
			'800italic',
			'900',
			'900italic',
		),
		"Expletus+Sans"            => array(
			'400',
			'400italic',
			'500',
			'500italic',
			'600',
			'600italic',
			'700',
			'700italic',
		),
		"Fanwood+Text"             => array( '400', '400italic' ),
		"Fascinate"                => array(),
		"Fascinate+Inline"         => array(),
		"Faster+One"               => array(),
		"Fasthand"                 => array(),
		"Federant"                 => array(),
		"Federo"                   => array(),
		"Felipa"                   => array(),
		"Fenix"                    => array(),
		"Finger+Paint"             => array(),
		"Fjord+One"                => array(),
		"Flamenco"                 => array( '300', '400' ),
		"Flavors"                  => array(),
		"Fondamento"               => array( '400', '400italic' ),
		"Fontdiner+Swanky"         => array(),
		"Forum"                    => array(),
		"Francois+One"             => array(),
		"Fredericka+the+Great"     => array(),
		"Fredoka+One"              => array(),
		"Freehand"                 => array(),
		"Fresca"                   => array(),
		"Frijole"                  => array(),
		"Fugaz+One"                => array(),
		"GFS+Didot"                => array(),
		"GFS+Neohellenic"          => array( '400', '400italic', '700', '700italic' ),
		"Galdeano"                 => array(),
		"Galindo"                  => array(),
		"Gentium+Basic"            => array( '400', '400italic', '700', '700italic' ),
		"Gentium+Book+Basic"       => array( '400', '400italic', '700', '700italic' ),
		"Geo"                      => array( '400', '400italic' ),
		"Geostar"                  => array(),
		"Geostar+Fill"             => array(),
		"Germania+One"             => array(),
		"Give+You+Glory"           => array(),
		"Glass+Antiqua"            => array(),
		"Glegoo"                   => array(),
		"Gloria+Hallelujah"        => array(),
		"Goblin+One"               => array(),
		"Gochi+Hand"               => array(),
		"Gorditas"                 => array( '400', '700' ),
		"Goudy+Bookletter+1911"    => array(),
		"Graduate"                 => array(),
		"Gravitas+One"             => array(),
		"Great+Vibes"              => array(),
		"Griffy"                   => array(),
		"Gruppo"                   => array(),
		"Gudea"                    => array( '400', '400italic', '700' ),
		"Habibi"                   => array(),
		"Hammersmith+One"          => array(),
		"Handlee"                  => array(),
		"Hanuman"                  => array( '400', '700' ),
		"Happy+Monkey"             => array(),
		"Headland+One"             => array(),
		"Henny+Penny"              => array(),
		"Herr+Von+Muellerhoff"     => array(),
		"Holtwood+One+SC"          => array(),
		"Homemade+Apple"           => array(),
		"Homenaje"                 => array(),
		"IM+Fell+DW+Pica"          => array( '400', '400italic' ),
		"IM+Fell+DW+Pica+SC"       => array(),
		"IM+Fell+Double+Pica"      => array( '400', '400italic' ),
		"IM+Fell+Double+Pica+SC"   => array(),
		"IM+Fell+English"          => array( '400', '400italic' ),
		"IM+Fell+English+SC"       => array(),
		"IM+Fell+French+Canon"     => array( '400', '400italic' ),
		"IM+Fell+French+Canon+SC"  => array(),
		"IM+Fell+Great+Primer"     => array( '400', '400italic' ),
		"IM+Fell+Great+Primer+SC"  => array(),
		"Iceberg"                  => array(),
		"Iceland"                  => array(),
		"Imprima"                  => array(),
		"Inconsolata"              => array( '400', '700' ),
		"Inder"                    => array(),
		"Indie+Flower"             => array(),
		"Inika"                    => array( '400', '700' ),
		"Irish+Grover"             => array(),
		"Istok+Web"                => array( '400', '400italic', '700', '700italic' ),
		"Italiana"                 => array(),
		"Italianno"                => array(),
		"Jacques+Francois"         => array(),
		"Jacques+Francois+Shadow"  => array(),
		"Jim+Nightshade"           => array(),
		"Jockey+One"               => array(),
		"Jolly+Lodger"             => array(),
		"Josefin+Sans"             => array(
			'100',
			'100italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'600',
			'600italic',
			'700',
			'700italic',
		),
		"Josefin+Slab"             => array(
			'100',
			'100italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'600',
			'600italic',
			'700',
			'700italic',
		),
		"Judson"                   => array( '400', '400italic', '700' ),
		"Julee"                    => array(),
		"Julius+Sans+One"          => array(),
		"Junge"                    => array(),
		"Jura"                     => array( '300' ),
		"Jura"                     => array( '400', '500', '600' ),
		"Just+Another+Hand"        => array(),
		"Just+Me+Again+Down+Here"  => array(),
		"Kameron"                  => array( '400', '700' ),
		"Karla"                    => array( '400', '400italic', '700', '700italic' ),
		"Kaushan+Script"           => array(),
		"Kelly+Slab"               => array(),
		"Kenia"                    => array(),
		"Khmer"                    => array(),
		"Kite+One"                 => array(),
		"Knewave"                  => array(),
		"Kotta+One"                => array(),
		"Koulen"                   => array(),
		"Kranky"                   => array(),
		"Kreon"                    => array( '300', '400', '700' ),
		"Kristi"                   => array(),
		"Krona+One"                => array(),
		"La+Belle+Aurore"          => array(),
		"Lancelot"                 => array(),
		"Lato"                     => array(
			'100',
			'100italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'700',
			'700italic',
			'900',
			'900italic',
		),
		"League+Script"            => array(),
		"Leckerli+One"             => array(),
		"Ledger"                   => array(),
		"Lekton"                   => array( '400', '400italic', '700' ),
		"Lemon"                    => array(),
		"Life+Savers"              => array(),
		"Lilita+One"               => array(),
		"Limelight"                => array(),
		"Linden+Hill"              => array( '400', '400italic' ),
		"Lobster"                  => array(),
		"Lobster+Two"              => array( '400', '400italic', '700', '700italic' ),
		"Londrina+Outline"         => array(),
		"Londrina+Shadow"          => array(),
		"Londrina+Sketch"          => array(),
		"Londrina+Solid"           => array(),
		"Lora"                     => array( '400', '400italic', '700', '700italic' ),
		"Love+Ya+Like+A+Sister"    => array(),
		"Loved+by+the+King"        => array(),
		"Lovers+Quarrel"           => array(),
		"Luckiest+Guy"             => array(),
		"Lusitana"                 => array( '400', '700' ),
		"Lustria"                  => array(),
		"Macondo"                  => array(),
		"Macondo+Swash+Caps"       => array(),
		"Magra"                    => array( '400', '700' ),
		"Maiden+Orange"            => array(),
		"Mako"                     => array(),
		"Marcellus"                => array(),
		"Marcellus+SC"             => array(),
		"Marck+Script"             => array(),
		"Marko+One"                => array(),
		"Marmelad"                 => array(),
		"Marvel"                   => array( '400', '400italic', '700', '700italic' ),
		"Mate"                     => array( '400', '400italic' ),
		"Mate+SC"                  => array(),
		"Maven+Pro"                => array( '400', '500', '700', '900' ),
		"McLaren"                  => array(),
		"Meddon"                   => array(),
		"MedievalSharp"            => array(),
		"Medula+One"               => array(),
		"Megrim"                   => array(),
		"Meie+Script"              => array(),
		"Merienda+One"             => array(),
		"Merriweather"             => array( '300', '400', '700', '900' ),
		"Metal"                    => array(),
		"Metal+Mania"              => array(),
		"Metamorphous"             => array(),
		"Metrophobic"              => array(),
		"Michroma"                 => array(),
		"Miltonian"                => array(),
		"Miltonian+Tattoo"         => array(),
		"Miniver"                  => array(),
		"Miss+Fajardose"           => array(),
		"Modern+Antiqua"           => array(),
		"Molengo"                  => array(),
		"Molle"                    => array( '400italic' ),
		"Monofett"                 => array(),
		"Monoton"                  => array(),
		"Monsieur+La+Doulaise"     => array(),
		"Montaga"                  => array(),
		"Montez"                   => array(),
		"Montserrat"               => array( '400', '700' ),
		"Montserrat+Alternates"    => array( '400', '700' ),
		"Montserrat+Subrayada"     => array( '400', '700' ),
		"Moul"                     => array(),
		"Moulpali"                 => array(),
		"Mountains+of+Christmas"   => array( '400', '700' ),
		"Mr+Bedfort"               => array(),
		"Mr+Dafoe"                 => array(),
		"Mr+De+Haviland"           => array(),
		"Mrs+Saint+Delafield"      => array(),
		"Mrs+Sheppards"            => array(),
		"Muli"                     => array( '300', '300italic', '400', '400italic' ),
		"Mystery+Quest"            => array(),
		"Neucha"                   => array(),
		"Neuton"                   => array( '200', '300', '400', '400italic', '700', '800' ),
		"News+Cycle"               => array( '400', '700' ),
		"Niconne"                  => array(),
		"Nixie+One"                => array(),
		"Nobile"                   => array( '400', '400italic', '700', '700italic' ),
		"Nokora"                   => array( '400', '700' ),
		"Norican"                  => array(),
		"Nosifer"                  => array(),
		"Nothing+You+Could+Do"     => array(),
		"Noticia+Text"             => array( '400', '400italic', '700', '700italic' ),
		"Nova+Cut"                 => array(),
		"Nova+Flat"                => array(),
		"Nova+Mono"                => array(),
		"Nova+Oval"                => array(),
		"Nova+Round"               => array(),
		"Nova+Script"              => array(),
		"Nova+Slim"                => array(),
		"Nova+Square"              => array(),
		"Numans"                   => array(),
		"Nunito"                   => array( '300', '400', '700' ),
		"Odor+Mean+Chey"           => array(),
		"Offside"                  => array(),
		"Old+Standard+TT"          => array( '400', '400italic', '700' ),
		"Oldenburg"                => array(),
		"Oleo+Script"              => array( '400', '700' ),
		"Open+Sans"                => array(
			'300',
			'300italic',
			'400',
			'400italic',
			'600',
			'600italic',
			'700',
			'700italic',
			'800',
			'800italic',
		),
		"Open+Sans+Condensed"      => array( '300', '300italic', '700' ),
		"Oranienbaum"              => array(),
		"Orbitron"                 => array( '400', '500', '700', '900' ),
		"Oregano"                  => array( '400', '400italic' ),
		"Orienta"                  => array(),
		"Original+Surfer"          => array(),
		"Oswald"                   => array( '300', '400', '700' ),
		"Over+the+Rainbow"         => array(),
		"Overlock"                 => array( '400', '400italic', '700', '700italic', '900', '900italic' ),
		"Overlock+SC"              => array(),
		"Ovo"                      => array(),
		"Oxygen"                   => array( '300', '400', '700' ),
		"Oxygen+Mono"              => array(),
		"PT+Mono"                  => array(),
		"PT+Sans"                  => array( '400', '400italic', '700', '700italic' ),
		"PT+Sans+Caption"          => array( '400', '700' ),
		"PT+Sans+Narrow"           => array( '400', '700' ),
		"PT+Serif"                 => array( '400', '400italic', '700', '700italic' ),
		"PT+Serif+Caption"         => array( '400', '400italic' ),
		"Pacifico"                 => array(),
		"Paprika"                  => array(),
		"Parisienne"               => array(),
		"Passero+One"              => array(),
		"Passion+One"              => array( '400', '700', '900' ),
		"Patrick+Hand"             => array(),
		"Patua+One"                => array(),
		"Paytone+One"              => array(),
		"Peralta"                  => array(),
		"Permanent+Marker"         => array(),
		"Petit+Formal+Script"      => array(),
		"Petrona"                  => array(),
		"Philosopher"              => array( '400', '400italic', '700', '700italic' ),
		"Piedra"                   => array(),
		"Pinyon+Script"            => array(),
		"Plaster"                  => array(),
		"Play"                     => array( '400', '700' ),
		"Playball"                 => array(),
		"Playfair+Display"         => array( '400', '400italic', '700', '700italic', '900', '900italic' ),
		"Playfair+Display+SC"      => array( '400', '400italic', '700', '700italic', '900', '900italic' ),
		"Podkova"                  => array( '400', '700' ),
		"Poiret+One"               => array(),
		"Poller+One"               => array(),
		"Poly"                     => array( '400', '400italic' ),
		"Pompiere"                 => array(),
		"Pontano+Sans"             => array(),
		"Port+Lligat+Sans"         => array(),
		"Port+Lligat+Slab"         => array(),
		"Prata"                    => array(),
		"Preahvihear"              => array(),
		"Press+Start+2P"           => array(),
		"Princess+Sofia"           => array(),
		"Prociono"                 => array(),
		"Prosto+One"               => array(),
		"Puritan"                  => array( '400', '400italic', '700', '700italic' ),
		"Quando"                   => array(),
		"Quantico"                 => array( '400', '400italic', '700', '700italic' ),
		"Quattrocento"             => array( '400', '700' ),
		"Quattrocento+Sans"        => array( '400', '400italic', '700', '700italic' ),
		"Questrial"                => array(),
		"Quicksand"                => array( '300', '400', '700' ),
		"Qwigley"                  => array(),
		"Racing+Sans+One"          => array(),
		"Radley"                   => array( '400', '400italic', '100', '200' ),
		"Raleway"                  => array( '300', '400', '500', '600', '700', '800', '900' ),
		"Raleway+Dots"             => array(),
		"Rammetto+One"             => array(),
		"Ranchers"                 => array(),
		"Rancho"                   => array(),
		"Rationale"                => array(),
		"Redressed"                => array(),
		"Reenie+Beanie"            => array(),
		"Revalia"                  => array(),
		"Ribeye"                   => array(),
		"Ribeye+Marrow"            => array(),
		"Righteous"                => array(),
		"Roboto"                   => array(
			'100',
			'100italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'500',
			'500italic',
			'700',
			'700italic',
			'900',
			'900italic',
		),
		"Roboto+Condensed"         => array( '300', '300italic', '400', '400italic', '700', '700italic' ),
		"Roboto+Slab"              => array( '100', '300', '400', '700' ),
		"Rochester"                => array(),
		"Rock+Salt"                => array(),
		"Rokkitt"                  => array( '400', '700' ),
		"Romanesco"                => array(),
		"Ropa+Sans"                => array( '400', '400italic' ),
		"Rosario"                  => array( '400', '400italic', '700', '700italic' ),
		"Rosarivo"                 => array( '400', '400italic' ),
		"Rouge+Script"             => array(),
		"Rubik"                    => array( '300', '300italic', 'regular', 'italic', '500', '500italic', '700', '700italic', '900', '900italic' ),
		"Ruda"                     => array( '400', '700', '900' ),
		"Ruge+Boogie"              => array(),
		"Ruluko"                   => array(),
		"Ruslan+Display"           => array(),
		"Russo+One"                => array(),
		"Ruthie"                   => array(),
		"Rye"                      => array(),
		"Sail"                     => array(),
		"Salsa"                    => array(),
		"Sanchez"                  => array( '400', '400italic' ),
		"Sancreek"                 => array(),
		"Sansita+One"              => array(),
		"Sarina"                   => array(),
		"Satisfy"                  => array(),
		"Scada"                    => array( '400', '400italic', '700', '700italic' ),
		"Schoolbell"               => array(),
		"Seaweed+Script"           => array(),
		"Sevillana"                => array(),
		"Seymour+One"              => array(),
		"Shadows+Into+Light"       => array(),
		"Shadows+Into+Light+Two"   => array(),
		"Shanti"                   => array(),
		"Share"                    => array( '400', '400italic', '700', '700italic' ),
		"Share+Tech"               => array(),
		"Share+Tech+Mono"          => array(),
		"Shojumaru"                => array(),
		"Short+Stack"              => array(),
		"Siemreap"                 => array(),
		"Sigmar+One"               => array(),
		"Signika"                  => array( '300', '400', '600', '700' ),
		"Signika+Negative"         => array( '300', '400', '600', '700' ),
		"Simonetta"                => array( '400', '400italic', '900', '900italic' ),
		"Sirin+Stencil"            => array(),
		"Six+Caps"                 => array(),
		"Skranji"                  => array( '400', '700' ),
		"Slackey"                  => array(),
		"Smokum"                   => array(),
		"Smythe"                   => array(),
		"Sniglet"                  => array( '800' ),
		"Snippet"                  => array(),
		"Sofadi+One"               => array(),
		"Sofia"                    => array(),
		"Sonsie+One"               => array(),
		"Sorts+Mill+Goudy"         => array( '400', '400italic', '200' ),
		"Source+Code+Pro"          => array( '300', '400', '600', '700', '900', '200', '200italic' ),
		"Source+Sans+Pro"          => array(
			'200',
			'200italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'600',
			'600italic',
			'700',
			'700italic',
			'900',
			'900italic',
		),
		"Special+Elite"            => array(),
		"Spicy+Rice"               => array(),
		"Spinnaker"                => array(),
		"Spirax"                   => array(),
		"Squada+One"               => array(),
		"Stalinist+One"            => array(),
		"Stardos+Stencil"          => array( '400', '700' ),
		"Stint+Ultra+Condensed"    => array(),
		"Stint+Ultra+Expanded"     => array(),
		"Stoke"                    => array( '300', '400' ),
		"Strait"                   => array(),
		"Sue+Ellen+Francisco"      => array(),
		"Sunshiney"                => array(),
		"Supermercado+One"         => array(),
		"Suwannaphum"              => array(),
		"Swanky+and+Moo+Moo"       => array(),
		"Syncopate"                => array( '400', '700' ),
		"Tangerine"                => array( '400', '700' ),
		"Taprom"                   => array(),
		"Telex"                    => array(),
		"Tenor+Sans"               => array(),
		"The+Girl+Next+Door"       => array(),
		"Tienne"                   => array( '400', '700', '900' ),
		"Tinos"                    => array( '400', '400italic', '700', '700italic' ),
		"Titan+One"                => array(),
		"Titillium+Web"            => array(
			'200',
			'200italic',
			'300',
			'300italic',
			'400',
			'400italic',
			'600',
			'600italic',
			'700',
			'700italic',
			'900',
		),
		"Trade+Winds"              => array(),
		"Trocchi"                  => array(),
		"Trochut"                  => array( '400', '400italic', '700' ),
		"Trykker"                  => array(),
		"Tulpen+One"               => array(),
		"Ubuntu"                   => array(
			'300',
			'300italic',
			'400',
			'400italic',
			'500',
			'500italic',
			'700',
			'700italic',
		),
		"Ubuntu+Condensed"         => array(),
		"Ubuntu+Mono"              => array( '400', '400italic', '700', '700italic' ),
		"Ultra"                    => array(),
		"Uncial+Antiqua"           => array(),
		"Underdog"                 => array(),
		"Unica+One"                => array(),
		"UnifrakturCook"           => array( '700' ),
		"UnifrakturMaguntia"       => array(),
		"Unkempt"                  => array( '400', '700' ),
		"Unlock"                   => array(),
		"Unna"                     => array(),
		"VT323"                    => array(),
		"Varela"                   => array(),
		"Varela+Round"             => array(),
		"Vast+Shadow"              => array(),
		"Vibur"                    => array(),
		"Vidaloka"                 => array(),
		"Viga"                     => array(),
		"Voces"                    => array(),
		"Volkhov"                  => array( '400', '400italic', '700', '700italic' ),
		"Vollkorn"                 => array( '400', '400italic', '700', '700italic' ),
		"Voltaire"                 => array(),
		"Waiting+for+the+Sunrise"  => array(),
		"Wallpoet"                 => array(),
		"Walter+Turncoat"          => array(),
		"Warnes"                   => array(),
		"Wellfleet"                => array(),
		"Wire+One"                 => array(),
		"Yanone+Kaffeesatz"        => array( '200', '300', '400', '700' ),
		"Yellowtail"               => array(),
		"Yeseva+One"               => array(),
		"Yesteryear"               => array(),
		"Zeyada"                   => array(),
	);

	return $googlefonts;
}

/**
 * Adds the individual sections, settings, and controls to the theme customizer
 */
function lbmn_customizer( $wp_customize ) {
	$color_opacity_options = array(
		'0'    => '0%',
		'0.03' => '3%',
		'0.05' => '5%',
		'0.07' => '7%',
		'0.1'  => '10%',
		'0.2'  => '20%',
		'0.3'  => '30%',
		'0.4'  => '40%',
		'0.5'  => '50%',
		'0.6'  => '60%',
		'0.7'  => '70%',
		'0.8'  => '80%',
		'0.9'  => '90%',
		'1'    => '100%',
	);

	$bg_image_repeat_options = array(
		'repeat'    => esc_attr__( 'Repeat', 'seowp' ),
		'repeat-x'  => esc_attr__( 'Repeat Horizontal', 'seowp' ),
		'repeat-y'  => esc_attr__( 'Repeat Vertical', 'seowp' ),
		'no-repeat' => esc_attr__( 'Do NOT Repeat', 'seowp' ),
	);

	$bg_image_position_options = array(
		'left top'   => esc_attr__( 'Top Left', 'seowp' ),
		'center top' => esc_attr__( 'Top Center', 'seowp' ),
		'right top'  => esc_attr__( 'Top Right', 'seowp' ),

		'left center'   => esc_attr__( 'Center Left', 'seowp' ),
		'center center' => esc_attr__( 'Center', 'seowp' ),
		'right center'  => esc_attr__( 'Center Right', 'seowp' ),

		'left bottom'   => esc_attr__( 'Bottom Left', 'seowp' ),
		'center bottom' => esc_attr__( 'Bottom Center', 'seowp' ),
		'right bottom'  => esc_attr__( 'Bottom Right', 'seowp' ),
	);

	$bg_image_attachment_options = array(
		'scroll' => esc_attr__( 'Scroll', 'seowp' ),
		'fixed'  => esc_attr__( 'Fixed', 'seowp' ),
	);

	$bg_image_size_options = array(
		'initial' => esc_attr__( 'Initial', 'seowp' ),
		'cover'    => esc_attr__( 'Cover', 'seowp' ),
		'contain'  => esc_attr__( 'Contain', 'seowp' ),
	);

	/**
	 * ----------------------------------------------------------------------
	 * Custom control types classes
	 */

	/**
	 * Adds textarea support to the theme customizer
	 */
	class LBMN_Customize_Textarea_Control extends WP_Customize_Control {

		public $type = 'textarea';

		public function render_content() {
			?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<textarea rows="5" class="customize-control-title-textarea" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
			</label>
			<?php
		}
	}


	/**
	 * Adds subheader control to the theme customizer
	 */
	class LBMN_Customize_Subheader_Control extends WP_Customize_Control {

		public $type = 'subheader';

		public function render_content() {
			?>
			<h3 class="customizer-subheader"><?php echo esc_html( $this->label ); ?></h3>
			<?php
		}
	}

	/**
	 * Adds custom color picker sliders support to the theme customizer
	 */
	class LBMN_Customize_Colorsliders_Control extends WP_Customize_Control {

		public $type = 'colorsliders';

		public function render_content() {
			?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
			</label>
			<div class="color-picker-slider-wrap">
				<input type="text" class="custom-color-picker-slider" <?php $this->link(); ?> value="<?php echo esc_attr( $this->value() ); ?>" data-color-format="rgb" />
			</div>
			<?php
		}
	}

	/**
	 * Adds slider support to the theme customizer
	 *
	 * http://ottopress.com/2012/making-a-custom-control-for-the-theme-customizer/comment-page-1/#comment-11705
	 * http://pastebin.com/NcHT6RRP
	 */
	class LBMN_Customize_Slider_Control extends WP_Customize_Control {

		// setup control type
		public $type = 'slider';

		// function to enqueue the right jquery scripts and styles
		public function enqueue() {
			wp_enqueue_script( 'jquery-ui-core' );
			wp_enqueue_script( 'jquery-ui-slider' );
		}

		// override content render function to output slider HTML
		public function render_content() { ?>

			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<input type="text" class="customizer-slider__text" id="input_<?php echo esc_attr( $this->id ); ?>" value="<?php echo esc_attr( $this->value() ); ?>" <?php $this->link(); ?>/>
			</label>
			<div id="slider_<?php echo esc_attr( $this->id ); ?>" class="customizer-slider__slider"></div>

			<script>
				jQuery( document ).ready( function( $ ) {
					<?php
					// prepare value and max/min values
					$value = floatval( str_replace( 'px', '', $this->value() ) );
					$min = floatval( str_replace( 'px', '', $this->choices['min'] ) );
					$max = floatval( str_replace( 'px', '', $this->choices['max'] ) );
					?>

					$( "#slider_<?php echo esc_attr( $this->id ); ?>" ).slider( {
						value: <?php echo esc_attr( $value ); ?>,
						min:   <?php echo esc_attr( $min ); ?>,
						max:   <?php echo esc_attr( $max ); ?>,
						step:  <?php echo esc_attr( $this->choices['step'] ); ?>,
						slide: function( event, ui ) {
							$( "#input_<?php echo esc_attr( $this->id ); ?>" ).val( ui.value ).keyup();
						}
					} );
					$( "#input_<?php echo esc_attr( $this->id ); ?>" ).val( $( "#slider_<?php echo esc_attr( $this->id ); ?>" ).slider( "value" ) );

				} );
			</script>

			<?php

		}
	}


	/**
	 * ----------------------------------------------------------------------
	 * Controls render functions
	 */


	/**
	 * Render panel head
	 * https://make.wordpress.org/core/2014/10/27/toward-a-complete-javascript-api-for-the-customizer/
	 */
	function render_panel_header( $label, $priority, $control_name, $description ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = 'customize-section-' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 10;
			}

			$wp_customize->add_panel( $control_name, array(
				'priority'       => $priority,
				'capability'     => 'edit_theme_options',
				'theme_supports' => '',
				'title'          => $label,
				'description'    => $description,
			) );
		}

	}

	/**
	 * Render section head
	 */
	function render_section_header( $label, $priority, $control_name, $description, $panel = null ) {
		global $wp_customize;
		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = 'customize-section-' . $control_name;
			}
			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_section( $control_name, array(
				'title'       => $label,
				'description' => $description,
				'priority'    => $priority,
				'panel'       => $panel,
			) );
		}
	}

	/**
	 * Render subheader control
	 */
	function render_subheader_control( $label, $section, $priority ) {
		global $wp_customize;
		if ( isset( $label ) ) {
			$control_name       = strtolower( $label );
			$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
			$control_name       = str_replace( $invalid_characters, '', $control_name );
			$control_name       = $section . '_' . $control_name;
			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( $control_name,
				array(
					'default'           => $control_name,
					'sanitize_callback' => 'lbmn_sanitize_text',
				)
			);
			$wp_customize->add_control( new LBMN_Customize_Subheader_Control ( $wp_customize, $control_name, array(
				'type'     => 'subheader',
				'label'    => $label,
				'section'  => $section,
				'priority' => $priority,
			) ) );
		}
	}

	/**
	 * Render color picker control
	 */
	function render_colorpicker_control( $label, $section, $priority, $default = null, $control_name = null ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}
			if ( ! isset( $priority ) ) {
				$priority = 20;
			}
			if ( ! isset( $default ) ) {
				$default = '#fff';
			}

			$wp_customize->add_setting( $control_name, array(
				'default'           => $default,
				'sanitize_callback' => 'sanitize_hex_color', // sanitize_hex_color is build-in WP function
				'transport'         => 'postMessage',
			) );

			$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $control_name, array(
				'label'    => $label,
				'section'  => $section,
				// 'settings' => $control_name, // by default it is id
				'priority' => $priority,
			) ) );
		}
	}

	/**
	 * Render custom (JQuery Color Picker Sliders) color picker control
	 */
	function render_colorpickersliders_control( $label, $section, $priority, $default = null, $control_name = null ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}
			if ( ! isset( $priority ) ) {
				$priority = 20;
			}
			if ( ! isset( $default ) ) {
				$default = '#fff';
			}

			$wp_customize->add_setting( $control_name, array(
				'default'   => $default,
				'sanitize_callback' => 'lbmn_sanitize_text',
				'transport' => 'postMessage',
			) );

			$wp_customize->add_control( new LBMN_Customize_Colorsliders_Control( $wp_customize, $control_name, array(
				'label'    => $label,
				'section'  => $section,
				// 'settings' => $control_name, // by default it is id
				'priority' => $priority,
			) ) );
		}
	}

	/**
	 * Render checkbox control
	 */
	function render_checkbox_control( $label, $section, $priority, $default, $control_name ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}
			if ( ! isset( $default ) ) {
				$default = '';
			}

			$wp_customize->add_setting( $control_name, array(
				'default'           => $default,
				'sanitize_callback' => 'lbmn_sanitize_checkbox',
				'transport'         => 'postMessage',
			) );

			$wp_customize->add_control( $control_name, array(
				'type'     => 'checkbox',
				'label'    => $label,
				'section'  => $section,
				'priority' => $priority,
			) );
		}
	}

	/**
	 * Render slider control
	 */
	function render_slider_control( $label, $section, $priority, $default, $control_name = null, $control_type = null, $choises = null ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}
			if ( ! isset( $default ) ) {
				$default = '';
			}
			if ( isset( $control_type ) ) {
				switch ( $control_type ) {
					case 'option':
						break;

					case 'theme_mod':
						break;

					default:
						$control_type = ''; // by default control type is 'theme_mod'
						break;
				}
			} else {
				$control_type = '';
			}

			$wp_customize->add_setting( $control_name, array(
				'default'           => $default,
				'sanitize_callback' => 'lbmn_sanitize_text',
				'transport'         => 'postMessage',
			) );

			$wp_customize->add_control( new LBMN_Customize_Slider_Control ( $wp_customize, $control_name, array(
				'type'     => 'text',
				'label'    => $label,
				'section'  => $section,
				'priority' => $priority,
				'choices'  => $choises,
			) ) );
		}
	}

	/**
	 * Render text control
	 */
	function render_text_control( $label, $section, $priority, $default, $control_name = null, $control_type = 'theme_mod', $options_settings = '' ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}
			if ( ! isset( $default ) ) {
				$default = '';
			}

			if ( ( $control_type != 'option' ) && ( $control_type != 'theme_mod' ) ) {
				$control_type = 'theme_mod';
			}

			if ( $options_settings == '' ) {
				$wp_customize->add_setting( $control_name, array(
					'default'           => $default,
					'sanitize_callback' => 'lbmn_sanitize_text',
					'transport'         => 'postMessage',
					'type'              => $control_type,
				) );

				$wp_customize->add_control( $control_name, array(
					'type'     => 'text',
					'label'    => $label,
					'section'  => $section,
					'priority' => $priority,
				) );
			} else {

				$var = $control_name . '[' . $options_settings . ']';

				$wp_customize->add_setting( $var, array(
					'default'           => $default,
					'sanitize_callback' => 'lbmn_sanitize_text',
					'transport'         => 'postMessage',
					'type'              => $control_type,
				) );

				$wp_customize->add_control( $options_settings, array(
					'type'     => 'text',
					'label'    => $label,
					'section'  => $section,
					'priority' => $priority,
					'settings' => $var,
				) );
			}
		}
	}

	/**
	 * Render textarea control
	 */
	function render_textarea_control( $label, $section, $priority, $default, $control_name = null, $control_type = null ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}
			if ( ! isset( $default ) ) {
				$default = '';
			}
			if ( isset( $control_type ) ) {
				switch ( $control_type ) {
					case 'option':
						break;

					case 'theme_mod':
						break;

					default:
						$control_type = ''; // by default control type is 'theme_mod'
						break;
				}
			} else {
				$control_type = '';
			}

			$wp_customize->add_setting( $control_name, array(
				'default'           => $default,
				'sanitize_callback' => 'lbmn_sanitize_text',
				'transport'         => 'postMessage',
			) );

			$wp_customize->add_control( new LBMN_Customize_Textarea_Control ( $wp_customize, $control_name, array(
				'type'     => 'text',
				'label'    => $label,
				'section'  => $section,
				'priority' => $priority,
			) ) );

		}
	}

	/**
	 * Render menu control
	 */
	function render_menu_control( $label, $section, $priority, $control_name, $default_menu ) {
		global $wp_customize;

		// Generation menu drop down choices
		$menus           = wp_get_nav_menus();
		$menuchoices     = array( 0 => esc_attr__( '&mdash; Select &mdash;', 'seowp' ), );
		$default_menu_id = 0;

		foreach ( $menus as $menu ) {
			$menu_name                     = wp_html_excerpt( $menu->name, 40, '&hellip;' );
			$menuchoices[ $menu->term_id ] = $menu_name;

			if ( $default_menu == $menu_name ) { // get menu id for default icons menu
				$default_menu_id = $menu->term_id;
			}
		}

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( $control_name, array(
				'sanitize_callback' => 'absint', // it's a standard WP function
				'theme_supports'    => 'menus',
				'default'           => $default_menu_id,
			) );

			$wp_customize->add_control( $control_name, array(
				'label'    => $label,
				'type'     => 'select',
				'choices'  => $menuchoices,
				'section'  => $section,
				'priority' => $priority,
			) );
		}
	}

	/**
	 * Render select control
	 */
	function render_select_control( $label, $section, $priority, $control_name, $select_options, $default_select_option = '' ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( $control_name, array(
				'sanitize_callback' => 'lbmn_sanitize_text',
				'default' => $default_select_option,
			) );

			$wp_customize->add_control( $control_name, array(
				'label'    => $label,
				'type'     => 'select',
				'section'  => $section,
				'priority' => $priority,
				'choices'  => $select_options,
			) );
		}
	}

	function render_live_select_control( $label, $section, $priority, $control_name, $select_options, $default_select_option = '' ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( $control_name, array(
				'sanitize_callback' => 'lbmn_sanitize_text',
				'default'   => $default_select_option,
				'transport' => 'postMessage',
			) );

			$wp_customize->add_control( $control_name, array(
				'label'    => $label,
				'type'     => 'select',
				'section'  => $section,
				'priority' => $priority,
				'choices'  => $select_options,
			) );
		}
	}

	/**
	 * Render Google Fonts selector
	 */
	function render_googlefonts_control( $label, $section, $priority, $control_name, $default_font ) {
		global $wp_customize;
		$googlefonts = lbmn_get_goolefonts();

		// $fontchoices = array( '&mdash; None &mdash;' => '&mdash; None &mdash;');
		$fontchoices = array();

		foreach ( $googlefonts as $font => $font_ext ) {
			// Prepare font name
			$fontname = str_replace( '+', ' ', $font );
			// $fontname = str_replace(':', ': ', $fontname);
			// $fontname = str_replace('00', '00 ', $fontname);

			if ( count( $font_ext ) && $font != $font_ext ) {

				$fontname .= ': ';
				$first_custom_weight = true;

				foreach ( $font_ext as $weight ) {
					// if ( $weight == 'regular' ) {
					//  $weight = '400';
					// }

					$custom_font_style = $weight;

					if ( ! stristr( $weight, 'italic' ) ) {
						$custom_font_weight = preg_replace( "/.*(\d{3}).*/", "$1", $weight );
						$custom_font_weight = intval( $custom_font_weight );

						if ( $custom_font_weight == 0 ) {
							$custom_font_weight = '400';
						}

						if ( ! $first_custom_weight ) {
							$fontname .= ', ';
						}

						$fontname .= $custom_font_weight;
					} else {
						// $fontname .= $weight . ' ';
						$fontname .= '+i';
					}

					$first_custom_weight = false;
				}
			}

			$fontchoices[ $font ] = $fontname;
		}

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( $control_name, array(
				'sanitize_callback' => 'lbmn_sanitize_text',
				'default' => $default_font,
			) );

			$wp_customize->add_control( $control_name, array(
				'label'    => $label,
				'type'     => 'select',
				'choices'  => $fontchoices,
				'section'  => $section,
				'priority' => $priority,
			) );
		}
	}


	/**
	 * Render image upload
	 */
	class MediaLibraryCallClosure {

		private $control_name;

		function __construct( $control_name ) {
			$this->control_name = $control_name;
		}

		function call() {
			?>
			<a class="choose-from-library-link button"
			   data-controller="<?php esc_attr( $this->control_name ); ?>">
				<?php esc_attr_e( 'Open Library', 'seowp' ); ?>
			</a>
			<?php
			// return term_meta_cmp($a, $b, $this->meta);
		}
	}

	function render_image_control( $label, $section, $priority, $control_name, $default_image = '' ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( 'lbmn_theme_options[' . $control_name . ']', array(
				'default'    => $default_image,
				'capability' => 'edit_theme_options',
				'type'       => 'option',
				'sanitize_callback' => 'lbmn_sanitize_text',
			) );

			$control = new WP_Customize_Image_Control( $wp_customize, $control_name, array(
				'label'    => $label,
				'section'  => $section,
				'priority' => $priority,
				'settings' => 'lbmn_theme_options[' . $control_name . ']',
			) );

			$wp_customize->add_control( $control );

		}
	}

	/**
	 * Render file select
	 */
	function render_file_control( $label, $section, $priority, $control_name, $default = '' ) {
		global $wp_customize;

		if ( isset( $label ) ) {
			if ( ! isset( $control_name ) ) {
				$control_name       = strtolower( $label );
				$invalid_characters = array( "$", "%", "#", "<", ">", "|", " " );
				$control_name       = str_replace( $invalid_characters, '', $control_name );
				$control_name       = $section . '_' . $control_name;
			}

			if ( ! isset( $priority ) ) {
				$priority = 20;
			}

			$wp_customize->add_setting( 'lbmn_theme_options[' . $control_name . ']', array(
				'default'    => $default,
				'capability' => 'edit_theme_options',
				'type'       => 'option',
				'sanitize_callback' => 'lbmn_sanitize_text',
			) );

			$wp_customize->add_control( new WP_Customize_Upload_Control( $wp_customize, $control_name, array(
				'label'    => $label,
				'section'  => $section,
				'priority' => $priority,
				'settings' => 'lbmn_theme_options[' . $control_name . ']',
			) ) );
		}
	}

	// Prepare font preset title
	function prepareFontPresetTitle( $preset_no ) {
		$font_preset_title = esc_attr__( 'Font preset', 'seowp' ) . ' '  . $preset_no;

		if ( get_theme_mod( 'lbmn_font_preset_usegooglefont_' . $preset_no, 1 ) ) { // if Google Font activated

			if ( get_theme_mod( 'lbmn_font_preset_googlefont_' . $preset_no, '' ) ) {
				$font_preset_title .= ': ' . get_theme_mod( 'lbmn_font_preset_googlefont_' . $preset_no, '' );
			} else {
				$font_preset_title .= ': ' . get_theme_mod( 'lbmn_font_preset_googlefont_' . $preset_no, constant( 'LBMN_FONT_PRESET_GOOGLEFONT_' . $preset_no . '_DEFAULT' ) );
			}

		} elseif ( get_theme_mod( 'lbmn_font_preset_webfont_' . $preset_no, '' ) ) {
			$font_preset_title .= ': ' . get_theme_mod( 'lbmn_font_preset_webfont_' . $preset_no, '' );
		} else {
			$font_preset_title .= ': ' . get_theme_mod( 'lbmn_font_preset_standard_' . $preset_no, '' );
		}

		return $font_preset_title;
	}

	/**
	 * ----------------------------------------------------------------------
	 * Predefined arrays
	 */
	$font_size_options = array(
		'8px'  => '8px',
		'9px'  => '9px',
		'10px' => '10px',
		'11px' => '11px',
		'12px' => '12px',
		'13px' => '13px',
		'14px' => '14px',
		'15px' => '15px',
		'16px' => '16px',
		'18px' => '18px',
		'21px' => '21px',
		'24px' => '24px',
		'27px' => '27px',
		'32px' => '32px',
		'36px' => '36px',
		'48px' => '48px',
		'60px' => esc_attr__( 'Oh man...', 'seowp' ),
	);

	$font_weight_options = array(
		'100' => esc_attr__( '100 Thin', 'seowp' ),
		'200' => esc_attr__( '200 Light', 'seowp' ),
		'300' => esc_attr__( '300 Book', 'seowp' ),
		'400' => esc_attr__( '400 Regular', 'seowp' ),
		'500' => esc_attr__( '500 Medium', 'seowp' ),
		'600' => esc_attr__( '600 DemiBold', 'seowp' ),
		'700' => esc_attr__( '700 Bold', 'seowp' ),
		'800' => esc_attr__( '800 ExtraBold', 'seowp' ),
		'900' => esc_attr__( '900 Heavy', 'seowp' ),
	);

	$font_styling_options = array(
		'small'       => esc_attr__( 'Small', 'seowp' ),
		'medium'      => esc_attr__( 'Medium', 'seowp' ),
		'large'       => esc_attr__( 'Large', 'seowp' ),
		'divider-1'   => '&nbsp;',
		'caps-small'  => esc_attr__( 'UPPERCASE: SMALL', 'seowp' ),
		'caps-medium' => esc_attr__( 'UPPERCASE: MEDIUM', 'seowp' ),
		'caps-large'  => esc_attr__( 'UPPERCASE: LARGE', 'seowp' ),
	);

	$panel_height_options = array(
		'small'  => esc_attr__( 'Small', 'seowp' ),
		'medium' => esc_attr__( 'Medium', 'seowp' ),
		'large'  => esc_attr__( 'Large', 'seowp' ),
	);

	$font_preset_options = array(
		'1' => prepareFontPresetTitle( '1' ),
		'2' => prepareFontPresetTitle( '2' ),
		'3' => prepareFontPresetTitle( '3' ),
		'4' => prepareFontPresetTitle( '4' ),
	);

	$menu_align_options = array(
		'left'   => esc_attr__( 'Left', 'seowp' ),
		'center' => esc_attr__( 'Center', 'seowp' ),
		'right'  => esc_attr__( 'Right', 'seowp' ),
	);

	$menu_iconposition_options = array(
		'left'              => esc_attr__( 'Left', 'seowp' ),
		'top'               => esc_attr__( 'Above', 'seowp' ),
		'right'             => esc_attr__( 'Right', 'seowp' ),
		'disable_first_lvl' => esc_attr__( 'Disable', 'seowp' ),
		'disable_globally'  => esc_attr__( 'Disable Icons Globaly', 'seowp' ),
	);

	$menu_separator_options = array(
		'none'   => esc_attr__( 'None', 'seowp' ),
		'smooth' => esc_attr__( 'Smooth', 'seowp' ),
		'sharp'  => esc_attr__( 'Sharp', 'seowp' ),
	);

	$dropdown_animation_options = array(
		'none'   => esc_attr__( 'None', 'seowp' ),
		'anim_1' => esc_attr__( 'Unfold', 'seowp' ),
		'anim_2' => esc_attr__( 'Fading', 'seowp' ),
		'anim_3' => esc_attr__( 'Scale', 'seowp' ),
		'anim_4' => esc_attr__( 'Down to Up', 'seowp' ),
		'anim_5' => esc_attr__( 'Dropdown', 'seowp' ),
	);

	$logo_placement_options = array(
		// 'above-default' =>'Above menu',
		'top-left'     => esc_attr__( 'Top-Left', 'seowp' ),
		'top-center'   => esc_attr__( 'Top-Center', 'seowp' ),
		'top-right'    => esc_attr__( 'Top-Right', 'seowp' ),
		'divider-1'    => '&nbsp;',
		'bottom-left'  => esc_attr__( 'Botttom-Left', 'seowp' ),
		'bottom-right' => esc_attr__( 'Botttom-Right', 'seowp' ),
	);

	/* The next settings not needed in the second generation of the theme. */
	if ( lbmn_updated_from_first_generation() ) {

		/**
		 * ----------------------------------------------------------------------
		 * Notification panel section
		 */

		render_panel_header( esc_attr__( 'Notification panel', 'seowp' ), 40, 'lbmn_panel_notificationpanel', esc_attr__( 'Site-wide notification panel settings', 'seowp' ) );
		render_section_header( esc_attr__( 'Basic Settings', 'seowp' ), 40, 'lbmn_notificationpanel_basic', '', 'lbmn_panel_notificationpanel' );
		render_checkbox_control( esc_attr__( 'Enable', 'seowp' ), 'lbmn_notificationpanel_basic', 20, 1, 'lbmn_notificationpanel_switch' ); // Notification panel switch
		render_slider_control( esc_attr__( 'Height', 'seowp' ), 'lbmn_notificationpanel_basic', 22, LBMN_NOTIFICATIONPANEL_HEIGHT_DEFAULT, 'lbmn_notificationpanel_height', null, array(
			'min'  => '40',
			'max'  => '120',
			'step' => '2',
		) );

		// Notification panel main controls
		render_section_header( esc_attr__( 'Message Elements', 'seowp' ), 50, 'lbmn_notificationpanel_elements', '', 'lbmn_panel_notificationpanel' );
		render_textarea_control( esc_attr__( 'Message', 'seowp' ), 'lbmn_notificationpanel_elements', 30, LBMN_NOTIFICATIONPANEL_MESSAGE_DEFAULT, 'lbmn_notificationpanel_message' ); // Notification message
		render_text_control( esc_attr__( 'Linked URL', 'seowp' ), 'lbmn_notificationpanel_elements', 40, LBMN_NOTIFICATIONPANEL_BUTTONURL_DEFAULT, 'lbmn_notificationpanel_buttonurl' );// Call to action button url

		// Colors
		render_section_header( esc_attr__( 'Colors', 'seowp' ), 60, 'lbmn_notificationpanel_colors', '', 'lbmn_panel_notificationpanel' );
		render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'lbmn_notificationpanel_colors', 200, LBMN_NOTIFICATIONPANEL_BACKGROUNDCOLOR_DEFAULT, 'lbmn_notificationpanel_backgroundcolor' ); // Top panel bg color
		render_colorpickersliders_control( esc_attr__( 'Text Color', 'seowp' ), 'lbmn_notificationpanel_colors', 300, LBMN_NOTIFICATIONPANEL_TXTCOLOR_DEFAULT, 'lbmn_notificationpanel_textcolor' ); // Top panel text color
		render_colorpickersliders_control( esc_attr__( 'Background Hover Color', 'seowp' ), 'lbmn_notificationpanel_colors', 320, LBMN_NOTIFICATIONPANEL_BACKGROUNDCOLOR_HOVER_DEFAULT, 'lbmn_notificationpanel_backgroundcolor_hover' );
		render_colorpickersliders_control( esc_attr__( 'Text Hover Color', 'seowp' ), 'lbmn_notificationpanel_colors', 340, LBMN_NOTIFICATIONPANEL_TXTCOLOR_HOVER_DEFAULT, 'lbmn_notificationpanel_textcolor_hover' );
		/**
		 * ----------------------------------------------------------------------
		 * Top panel section
		 */

		render_panel_header( esc_attr__( 'Top bar', 'seowp' ), 50, 'lbmn_panel_topbar', esc_attr__( 'Site-wide top panel settings', 'seowp' ) );
		render_section_header( esc_attr__( 'Basic Settings', 'seowp' ), 10, 'lbmn_topbar_basic', '', 'lbmn_panel_topbar' );
		render_checkbox_control( esc_attr__( 'Enable', 'seowp' ), 'lbmn_topbar_basic', 20, 1, 'lbmn_topbar_switch' ); // Top panel switch
		render_slider_control( esc_attr__( 'Height', 'seowp' ), 'lbmn_topbar_basic', 25, LBMN_TOPBAR_HEIGHT_DEFAULT, 'lbmn_topbar_height', null, array(
			'min'  => '30',
			'max'  => '80',
			'step' => '2',
		) );

		render_section_header( esc_attr__( 'Colors', 'seowp' ), 20, 'lbmn_topbar_colors', '', 'lbmn_panel_topbar' );
		render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'lbmn_topbar_colors', 100, LBMN_TOPBAR_BACKGROUNDCOLOR_DEFAULT, 'lbmn_topbar_backgroundcolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Color', 'seowp' ), 'lbmn_topbar_colors', 110, LBMN_TOPBAR_LINKCOLOR_DEFAULT, 'lbmn_topbar_linkcolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Hover Color', 'seowp' ), 'lbmn_topbar_colors', 120, LBMN_TOPBAR_LINKHOVERCOLOR_DEFAULT, 'lbmn_topbar_linkhovercolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Hover Background Color', 'seowp' ), 'lbmn_topbar_colors', 130, LBMN_TOPBAR_LINKHOVERBGCOLOR_DEFAULT, 'lbmn_topbar_linkhoverbackgroundcolor' );
		render_colorpickersliders_control( esc_attr__( 'Text Lines Color', 'seowp' ), 'lbmn_topbar_colors', 140, LBMN_TOPBAR_TEXTCOLOR_DEFAULT, 'lbmn_topbar_textlinescolor' );

		render_section_header( esc_attr__( 'Font', 'seowp' ), 30, 'lbmn_topbar_font', '', 'lbmn_panel_topbar' );
		render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_topbar_font', 310, 'lbmn_topbar_firstlevelitems_font', $font_preset_options, LBMN_TOPBAR_FIRSTLEVELITEMS_FONT_DEFAULT );
		render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_topbar_font', 330, 'lbmn_topbar_firstlevelitems_fontweight', $font_weight_options, LBMN_TOPBAR_FIRSTLEVELITEMS_FONTWEIGHT_DEFAULT ); //$font_weight_options // get_theme_mod( 'lbmn_headertop_firstlevelitems_font')
		render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_topba_fontr', 340, LBMN_TOPBAR_FIRSTLEVELITEMS_FONTSIZE_DEFAULT, 'lbmn_topbar_firstlevelitems_fontsize', null, array(
			'min'  => '10',
			'max'  => '80',
			'step' => '1',
		) );

		render_section_header( esc_attr__( 'Settings', 'seowp' ), 40, 'lbmn_topbar_settings', '', 'lbmn_panel_topbar' );
		render_live_select_control( esc_attr__( 'First Level Items Align', 'seowp' ), 'lbmn_topbar_settings', 410, 'lbmn_topbar_firstlevelitems_align', $menu_align_options, LBMN_TOPBAR_FIRSTLEVELITEMS_ALIGN_DEFAULT );
		render_live_select_control( esc_attr__( 'Icon Position', 'seowp' ), 'lbmn_topbar_settings', 420, 'lbmn_topbar_firstlevelitems_iconposition', $menu_iconposition_options, LBMN_TOPBAR_FIRSTLEVELITEMS_ICONPOSITION_DEFAULT );
		render_slider_control( esc_attr__( 'Icon Size (px)', 'seowp' ), 'lbmn_topbar_settings', 430, LBMN_TOPBAR_FIRSTLEVELITEMS_ICONSIZE_DEFAULT, 'lbmn_topbar_firstlevelitems_iconsize', null, array(
			'min'  => '5',
			'max'  => '30',
			'step' => '1',
		) );
		render_live_select_control( esc_attr__( 'Items Separator', 'seowp' ), 'lbmn_topbar_settings', 440, 'lbmn_topbar_firstlevelitems_separator', $menu_separator_options, LBMN_TOPBAR_FIRSTLEVELITEMS_SEPARATOR_DEFAULT );
		render_slider_control( esc_attr__( 'Items Separator Opacity', 'seowp' ), 'lbmn_topbar_settings', 450, LBMN_TOPBAR_FIRSTLEVELITEMS_SEPARATOR_OPACITY_DEFAULT, 'lbmn_topbar_firstlevelitems_separator_opacity', null, array(
			'min'  => '0',
			'max'  => '1',
			'step' => '0.01',
		) );

		/**
		 * ----------------------------------------------------------------------
		 * Header top section
		 */

		render_panel_header( esc_attr__( 'Header design', 'seowp' ), 63, 'lbmn_panel_headertop', esc_attr__( 'Site-wide header settings', 'seowp' ) );

		render_section_header( esc_attr__( 'Basic Settings', 'seowp' ), 10, 'lbmn_headertop_basic', '', 'lbmn_panel_headertop' );
		render_checkbox_control( esc_attr__( 'Enable', 'seowp' ), 'lbmn_headertop_basic', 20, 1, 'lbmn_headertop_switch' );
		render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'lbmn_headertop_basic', 185, LBMN_HEADERTOP_BACKGROUNDCOLOR_DEFAULT, 'lbmn_headertop_backgroundcolor' );
		render_slider_control( esc_attr__( 'Header Height', 'seowp' ), 'lbmn_headertop_basic', 210, LBMN_HEADERTOP_HEIGHT_DEFAULT, 'lbmn_headertop_height', null, array(
			'min'  => '30',
			'max'  => '200',
			'step' => '2',
		) );
		render_slider_control( esc_attr__( 'Menu Height', 'seowp' ), 'lbmn_headertop_basic', 215, LBMN_HEADERTOP_MENUHEIGHT_DEFAULT, 'lbmn_headertop_menu_height', null, array(
			'min'  => '30',
			'max'  => '100',
			'step' => '2',
		) );

		render_section_header( esc_attr__( 'Sticky On Scroll', 'seowp' ), 10, 'lbmn_sticky-settings', '', 'lbmn_panel_headertop' );
		render_checkbox_control( esc_attr__( 'Stick the menu on scroll', 'seowp' ), 'lbmn_sticky-settings', 220, LBMN_HEADERTOP_STICK_SWITCH_DEFAULT, 'lbmn_headertop_stick' );
		render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'lbmn_sticky-settings', 225, LBMN_HEADERTOP_STICK_BACKGROUNDCOLOR_DEFAULT, 'lbmn_headertop_stick_backgroundcolor' );
		render_slider_control( esc_attr__( 'Sticky/Mobile Menu Height', 'seowp' ), 'lbmn_sticky-settings', 230, LBMN_HEADERTOP_STICK_DEFAULT, 'lbmn_headertop_stick_height', null, array(
			'min'  => '30',
			'max'  => '100',
			'step' => '2',
		) );
		render_slider_control( esc_attr__( 'Sticky/Mobile Menu Padding', 'seowp' ), 'lbmn_sticky-settings', 234, LBMN_HEADERTOP_STICKY_PADDING_DEFAULT, 'lbmn_headertop_sticky_padding', null, array(
			'min'  => '0',
			'max'  => '60',
			'step' => '2',
		) );
		render_slider_control( esc_attr__( 'Sticky Scroll Offset (save to apply)', 'seowp' ), 'lbmn_sticky-settings', 240, LBMN_HEADERTOP_STICKYOFFSET_DEFAULT, 'lbmn_headertop_stickyoffset', null, array(
			'min'  => '0',
			'max'  => '400',
			'step' => '2',
		) );

		/**
		 * ----------------------------------------------------------------------
		 * Website Logo section
		 */

		render_panel_header( esc_attr__( 'Logo', 'seowp' ), 65, 'lbmn_panel_logo', esc_attr__( 'Website logotype settings', 'seowp' ) );

		render_section_header( esc_attr__( 'Basic Settings', 'seowp' ), 10, 'lbmn_logo_basic', '', 'lbmn_panel_logo' );
		render_live_select_control( esc_attr__( 'Placement:', 'seowp' ), 'lbmn_logo_basic', 20, 'lbmn_logo_placement', $logo_placement_options, LBMN_LOGO_PLACEMENT_DEFAULT );
		render_image_control( esc_attr__( 'Normal Image', 'seowp' ), 'lbmn_logo_basic', 30, 'lbmn_logo_image', LBMN_LOGO_IMAGE_DEFAULT ); //$default_image - optional parameter
		render_slider_control( esc_attr__( 'Maximum Logo Height (% to the height of the top header)', 'seowp' ), 'lbmn_logo_basic', 40, LBMN_LOGO_IMAGE_HEIGHT_DEFAULT, 'lbmn_logo_height', null, array(
			'min'  => '10',
			'max'  => '100',
			'step' => '1',
		) );

		render_section_header( esc_attr__( 'More Settings', 'seowp' ), 10, 'lbmn_logo_settings', '', 'lbmn_panel_logo' );
		render_slider_control( esc_attr__( 'Margin top (optional)', 'seowp' ), 'lbmn_logo_settings', 60, '', 'lbmn_logo_margin_top', null, array(
			'min'  => '-100',
			'max'  => '100',
			'step' => '2',
		) );
		render_slider_control( esc_attr__( 'Margin left (optional)', 'seowp' ), 'lbmn_logo_settings', 65, '', 'lbmn_logo_margin_left', null, array(
			'min'  => '-100',
			'max'  => '100',
			'step' => '2',
		) );
		render_slider_control( esc_attr__( 'Margin right (optional)', 'seowp' ), 'lbmn_logo_settings', 70, '', 'lbmn_logo_margin_right', null, array(
			'min'  => '-100',
			'max'  => '100',
			'step' => '2',
		) );

		/**
		 * ----------------------------------------------------------------------
		 * Mega Menu Settings
		 */

		render_panel_header( esc_attr__( 'Mega Menu', 'seowp' ), 75, 'lbmn_panel_megamenu', esc_attr__( 'Site-wide header settings', 'seowp' ) );

		render_section_header( esc_attr__( 'Colors', 'seowp' ), 10, 'lbmn_megamenu_colors', '', 'lbmn_panel_megamenu' );
		render_colorpickersliders_control( esc_attr__( 'Link Color', 'seowp' ), 'lbmn_megamenu_colors', 110, LBMN_HEADERTOP_LINKCOLOR_DEFAULT, 'lbmn_megamenu_linkcolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Hover Color', 'seowp' ), 'lbmn_megamenu_colors', 120, LBMN_HEADERTOP_LINKHOVERCOLOR_DEFAULT, 'lbmn_megamenu_linkhovercolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Hover Background Color', 'seowp' ), 'lbmn_megamenu_colors', 130, LBMN_MEGAMENU_LINKHOVERBACKGROUNDCOLOR_DEFAULT, 'lbmn_megamenu_linkhoverbackgroundcolor' );
		render_colorpickersliders_control( esc_attr__( 'Text Lines Color', 'seowp' ), 'lbmn_megamenu_colors', 140, LBMN_HEADERTOP_TEXTCOLOR_DEFAULT, 'lbmn_megamenu_textlinescolor' );

		render_section_header( esc_attr__( 'Font', 'seowp' ), 30, 'lbmn_megamenu_font', '', 'lbmn_panel_megamenu' );
		render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_megamenu_font', 310, 'lbmn_megamenu_firstlevelitems_font', $font_preset_options, LBMN_MEGAMENU_FIRSTLEVELITEMS_FONT_DEFAULT );
		render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_megamenu_font', 320, 'lbmn_megamenu_firstlevelitems_fontweight', $font_weight_options, LBMN_MEGAMENU_FIRSTLEVELITEMS_FONTWEIGHT_DEFAULT ); //$font_weight_options // get_theme_mod( 'lbmn_headertop_firstlevelitems_font')
		render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_megamenu_font', 330, LBMN_MEGAMENU_FIRSTLEVELITEMS_FONTSIZE_DEFAULT, 'lbmn_megamenu_firstlevelitems_fontsize', null, array(
			'min'  => '10',
			'max'  => '36',
			'step' => '1',
		) );

		render_section_header( esc_attr__( 'More Settings', 'seowp' ), 40, 'lbmn_megamenu_settings', '', 'lbmn_panel_megamenu' );
		render_live_select_control( esc_attr__( 'First Level Items Align', 'seowp' ), 'lbmn_megamenu_settings', 410, 'lbmn_megamenu_firstlevelitems_align', $menu_align_options, LBMN_MEGAMENU_FIRSTLEVELITEMS_ALIGN_DEFAULT );
		render_slider_control( esc_attr__( 'Hover/Active Border Radius', 'seowp' ), 'lbmn_megamenu_settings', 420, LBMN_HEADERTOP_LINKHOVERBORDERRADIUS_DEFAULT, 'lbmn_megamenu_linkhoverborderradius', null, array(
			'min'  => '0',
			'max'  => '30',
			'step' => '1',
		) );
		render_slider_control( esc_attr__( 'First Level Items Outer Spacing', 'seowp' ), 'lbmn_megamenu_settings', 430, LBMN_MEGAMENU_FIRSTLEVELITEMS_SPACING_DEFAULT, 'lbmn_megamenu_firstlevelitems_spacing', null, array(
			'min'  => '0',
			'max'  => '20',
			'step' => '1',
		) );
		render_slider_control( esc_attr__( 'First Level Items Inner Spacing', 'seowp' ), 'lbmn_megamenu_settings', 440, LBMN_MEGAMENU_FIRSTLEVELITEMS_INNERSPACING_DEFAULT, 'lbmn_megamenu_firstlevelitems_innerspacing', null, array(
			'min'  => '0',
			'max'  => '20',
			'step' => '1',
		) );

		render_subheader_control( esc_attr__( 'Icons', 'seowp' ), 'lbmn_megamenu_settings', 445 );
		render_live_select_control( esc_attr__( 'Icon Position', 'seowp' ), 'lbmn_megamenu_settings', 450, 'lbmn_megamenu_firstlevelitems_iconposition', $menu_iconposition_options, LBMN_MEGAMENU_FIRSTLEVELITEMS_ICONPOSITION_DEFAULT );
		render_slider_control( esc_attr__( 'Icon Size (px)', 'seowp' ), 'lbmn_megamenu_settings', 460, LBMN_MEGAMENU_FIRSTLEVELITEMS_ICONSIZE_DEFAULT, 'lbmn_megamenu_firstlevelitems_iconsize', null, array(
			'min'  => '5',
			'max'  => '30',
			'step' => '1',
		) );

		render_subheader_control( esc_attr__( 'Separators', 'seowp' ), 'lbmn_megamenu_settings', 465 );
		render_live_select_control( esc_attr__( 'Items Separator', 'seowp' ), 'lbmn_megamenu_settings', 470, 'lbmn_megamenu_firstlevelitems_separator', $menu_separator_options, LBMN_MEGAMENU_FIRSTLEVELITEMS_SEPARATOR_DEFAULT );
		render_slider_control( esc_attr__( 'Items Separator Opacity', 'seowp' ), 'lbmn_megamenu_settings', 480, LBMN_MEGAMENU_FIRSTLEVELITEMS_SEPARATOR_OPACITY_DEFAULT, 'lbmn_megamenu_firstlevelitems_separator_opacity', null, array(
			'min'  => '0',
			'max'  => '1',
			'step' => '.05',
		) );
		render_slider_control( esc_attr__( 'Items Separator Opacity', 'seowp' ), 'lbmn_megamenu_settings', 490, LBMN_TOPBAR_FIRSTLEVELITEMS_SEPARATOR_OPACITY_DEFAULT, 'lbmn_topbar_firstlevelitems_separator_opacity', null, array(
			'min'  => '0',
			'max'  => '1',
			'step' => '0.01',
		) );

		render_subheader_control( esc_attr__( 'Menu elements', 'seowp' ), 'lbmn_megamenu_settings', 500 );
		render_checkbox_control( esc_attr__( 'Enable WPML switcher', 'seowp' ), 'lbmn_megamenu_settings', 510, 0, 'lbmn_megamenu_wpml_switcher' );
		render_text_control( esc_attr__( 'Label For Mobile Menu', 'seowp' ), 'lbmn_megamenu_settings', 520, 'Menu', 'lbmn_megamenu_mobile_label' );

		/**
		 * ----------------------------------------------------------------------
		 * Mega Menu – Dropdown Settings
		 */

		render_section_header( esc_attr__( 'Mega Menu: Dropdown', 'seowp' ), 80, 'lbmn_megamenu_dropdown', esc_attr__( 'Site-wide header settings', 'seowp' ), 'lbmn_panel_megamenu' );

		render_subheader_control( esc_attr__( 'Colors', 'seowp' ), 'lbmn_megamenu_dropdown', 100 );
		render_colorpickersliders_control( esc_attr__( 'Text Color', 'seowp' ), 'lbmn_megamenu_dropdown', 140, LBMN_MEGAMENU_DROPDOWN_TEXTCOLOR_DEFAULT, 'lbmn_megamenu_dropdown_textcolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Color', 'seowp' ), 'lbmn_megamenu_dropdown', 155, LBMN_MEGAMENU_DROPDOWN_LINKCOLOR_DEFAULT, 'lbmn_megamenu_dropdown_linkcolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Hover Color', 'seowp' ), 'lbmn_megamenu_dropdown', 160, LBMN_MEGAMENU_DROPDOWN_LINKHOVERCOLOR_DEFAULT, 'lbmn_megamenu_dropdown_linkhovercolor' );
		render_colorpickersliders_control( esc_attr__( 'Link Hover Background Color', 'seowp' ), 'lbmn_megamenu_dropdown', 165, LBMN_MEGAMENU_DROPDOWN_LINKHOVERBACKGROUNDCOLOR_DEFAULT, 'lbmn_megamenu_dropdown_linkhoverbackgroundcolor' );
		render_colorpickersliders_control( esc_attr__( 'Dropdown Background Color', 'seowp' ), 'lbmn_megamenu_dropdown', 170, LBMN_MEGAMENU_DROPDOWN_BACKGROUND_DEFAULT, 'lbmn_megamenu_dropdown_background' );
		render_colorpickersliders_control( esc_attr__( 'Menu Items Divider Color', 'seowp' ), 'lbmn_megamenu_dropdown', 175, LBMN_MEGAMENU_DROPDOWN_MENUITEMSDIVIDERCOLOR_DEFAULT, 'lbmn_megamenu_dropdown_menuitemsdividercolor' );

		render_subheader_control( esc_attr__( 'Fonts', 'seowp' ), 'lbmn_megamenu_dropdown', 300 );
		render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_megamenu_dropdown', 360, 'lbmn_megamenu_dropdown_font', $font_preset_options, LBMN_MEGAMENU_DROPDOWN_FONT_DEFAULT );
		render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_megamenu_dropdown', 370, 'lbmn_megamenu_dropdown_fontweight', $font_weight_options, LBMN_MEGAMENU_DROPDOWN_FONTWEIGHT_DEFAULT );
		render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_megamenu_dropdown', 380, LBMN_MEGAMENU_DROPDOWN_FONTSIZE_DEFAULT, 'lbmn_megamenu_dropdown_fontsize', null, array(
			'min'  => '10',
			'max'  => '30',
			'step' => '1',
		) );
		render_slider_control( esc_attr__( 'Icon Size (px)', 'seowp' ), 'lbmn_megamenu_dropdown', 390, LBMN_MEGAMENU_DROPDOWN_ICONSIZE_DEFAULT, 'lbmn_megamenu_dropdown_iconsize', null, array(
			'min'  => '10',
			'max'  => '30',
			'step' => '1',
		) );

		render_subheader_control( esc_attr__( 'Menu settings', 'seowp' ), 'lbmn_megamenu_dropdown', 400 );
		render_live_select_control( esc_attr__( 'Dropdowns Animation', 'seowp' ), 'lbmn_megamenu_dropdown', 415, 'lbmn_megamenu_dropdown_animation', $dropdown_animation_options, LBMN_MEGAMENU_DROPDOWN_ANIMATION_DEFAULT );
		render_slider_control( esc_attr__( 'Dropdown Panel Radius', 'seowp' ), 'lbmn_megamenu_dropdown', 420, LBMN_MEGAMENU_DROPDOWNRADIUS_DEFAULT, 'lbmn_megamenu_dropdownradius', null, array(
			'min'  => '0',
			'max'  => '20',
			'step' => '1',
		) );
		render_slider_control( esc_attr__( 'Dropdown Marker Opacity', 'seowp' ), 'lbmn_megamenu_dropdown', 430, LBMN_MEGAMENU_DROPDOWN_MARKEROPACITY_DEFAULT, 'lbmn_megamenu_dropdown_markeropacity', null, array(
			'min'  => '0',
			'max'  => '1',
			'step' => '.01',
		) );

		/**
		 * ----------------------------------------------------------------------
		 * Search Block
		 */

		$searchblock_placement_options = array(
			'topbar-default'       => esc_attr__( 'Top panel:', 'seowp' ),
			'topbar-left'          => esc_attr__( '&mdash; Left', 'seowp' ),
			'topbar-right'         => esc_attr__( '&mdash; Right', 'seowp' ),
			'divider-1'            => '&nbsp;',
			'headertop-default'    => esc_attr__( 'Header top:', 'seowp' ),
			'headertop-left'       => esc_attr__( '&mdash; Left', 'seowp' ),
			'headertop-right'      => esc_attr__( '&mdash; Right', 'seowp' ),
			'divider-2'            => '&nbsp;',
			'headerbottom-default' => esc_attr__( 'Header bottom:', 'seowp' ),
			'headerbottom-left'    => esc_attr__( '&mdash; Left', 'seowp' ),
			'headerbottom-right'   => esc_attr__( '&mdash; Right', 'seowp' ),
		);

		$searchblock_shadow_options = array(
			'inside'  => esc_attr__( 'Inner shadow', 'seowp' ),
			'outside' => esc_attr__( 'Outer shadow', 'seowp' ),
			'none'    => esc_attr__( 'None', 'seowp' ),
		);

		render_section_header( esc_attr__( 'Search field', 'seowp' ), 90, 'lbmn_searchblock', esc_attr__( 'Settings for the search block in the site header', 'seowp' ) );
		render_checkbox_control( esc_attr__( 'Enable', 'seowp' ), 'lbmn_searchblock', 20, 1, 'lbmn_searchblock_switch' ); // Top panel switch
		render_slider_control( esc_attr__( 'Input Field Width (px)', 'seowp' ), 'lbmn_searchblock', 110, LBMN_SEARCHBLOCK_INPUTFIELDWIDTH_DEFAULT, 'lbmn_searchblock_inputfieldwidth', null, array(
			'min'  => '100',
			'max'  => '300',
			'step' => '2',
		) );
		render_slider_control( esc_attr__( 'Input Field Radius (px)', 'seowp' ), 'lbmn_searchblock', 115, LBMN_SEARCHBLOCK_INPUTFIELDRADIUS_DEFAULT, 'lbmn_searchblock_inputfieldradius', null, array(
			'min'  => '0',
			'max'  => '100',
			'step' => '1',
		) );
		render_live_select_control( esc_attr__( 'Input Field Shadow', 'seowp' ), 'lbmn_searchblock', 120, 'lbmn_searchblock_shadow', $searchblock_shadow_options, LBMN_SEARCHBLOCK_SHADOW_DEFAULT );
		render_colorpickersliders_control( esc_attr__( 'Input Background Color', 'seowp' ), 'lbmn_searchblock', 200, LBMN_SEARCHBLOCK_INPUTBACKGROUNDCOLOR_DEFAULT );
		render_colorpickersliders_control( esc_attr__( 'Text and Icon Color', 'seowp' ), 'lbmn_searchblock', 210, LBMN_SEARCHBLOCK_TEXTANDICONCOLOR_DEFAULT, 'lbmn_searchblock_textandiconcolor' );

	}

	// -------------------------------------------------------------------------
	// Page Layout Section
	// -------------------------------------------------------------------------

	render_section_header( esc_attr__( 'Page Layout and Background', 'seowp' ), 240, 'page_layout', esc_attr__( 'Here you can customize colors.', 'seowp' ) );

	render_colorpickersliders_control( esc_attr__( 'Content Background Color', 'seowp' ), 'page_layout', 10, LBMN_CONTENT_BACKGROUND_COLOR_DEFAULT, 'lbmn_content_background_color' );
	render_checkbox_control( esc_attr__( 'Make Page Layout Boxed', 'seowp' ), 'page_layout', 15, LBMN_PAGELAYOUTBOXED_SWITCH_DEFAULT, 'lbmn_pagelayoutboxed_switch' ); // Botttom panel switch.
	render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'page_layout', 20, LBMN_PAGEBACKGROUNDCOLOR_DEFAULT, 'lbmn_page_background_color' );
	render_image_control( esc_attr__( 'Background Image', 'seowp' ), 'page_layout', 30, 'lbmn_page_background_image' ); // The $default_image - optional parameter.
	render_slider_control( esc_attr__( 'Background Image Opacity', 'seowp' ), 'page_layout', 40, '1', 'lbmn_page_background_image_opacity', null, array(
		'min'  => '0',
		'max'  => '1',
		'step' => '.01',
	) );
	render_live_select_control( esc_attr__( 'Background Image Repeat', 'seowp' ), 'page_layout', 50, 'lbmn_page_background_image_repeat', $bg_image_repeat_options, 'repeat' );
	render_live_select_control( esc_attr__( 'Background Image Position', 'seowp' ), 'page_layout', 60, 'lbmn_page_background_image_position', $bg_image_position_options, 'center top' );
	render_live_select_control( esc_attr__( 'Background Image Attachment', 'seowp' ), 'page_layout', 70, 'lbmn_page_background_image_attachment', $bg_image_attachment_options, 'scroll' );
	render_live_select_control( esc_attr__( 'Background Image Size', 'seowp' ), 'page_layout', 80, 'lbmn_page_background_image_size', $bg_image_size_options, 'initial' );

	/**
	 * ----------------------------------------------------------------------
	 * Typography section
	 */

	render_section_header( esc_attr__( 'Typography and Text Colors', 'seowp' ), 250, 'lbmn_typography', esc_attr__( 'All the setings to make your text looks awesome.', 'seowp' ) );

	render_colorpickersliders_control( esc_attr__( 'Link Color', 'seowp' ), 'lbmn_typography', 10, LBMN_TYPOGRAPHY_LINK_COLOR_DEFAULT, 'lbmn_typography_link_color' );
	render_colorpickersliders_control( esc_attr__( 'Link Hover Color', 'seowp' ), 'lbmn_typography', 20, LBMN_TYPOGRAPHY_LINK_HOVER_COLOR_DEFAULT, 'lbmn_typography_link_hover_color' );

	render_subheader_control( esc_attr__( 'Paragraphs', 'seowp' ), 'lbmn_typography', 100 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 110, 'lbmn_typography_p_font', $font_preset_options, LBMN_TYPOGRAPHY_P_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 130, 'lbmn_typography_p_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_P_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 140, LBMN_TYPOGRAPHY_P_FONTSIZE_DEFAULT, 'lbmn_typography_p_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 150, LBMN_TYPOGRAPHY_P_LINEHEIGHT_DEFAULT, 'lbmn_typography_p_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 160, LBMN_TYPOGRAPHY_P_MARGINBOTTOM_DEFAULT, 'lbmn_typography_p_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 170, LBMN_TYPOGRAPHY_P_COLOR_DEFAULT, 'lbmn_typography_p_color' );

	render_subheader_control( esc_attr__( 'Heading 1', 'seowp' ), 'lbmn_typography', 200 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 210, 'lbmn_typography_h1_font', $font_preset_options, LBMN_TYPOGRAPHY_H1_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 230, 'lbmn_typography_h1_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_H1_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 240, LBMN_TYPOGRAPHY_H1_FONTSIZE_DEFAULT, 'lbmn_typography_h1_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 250, LBMN_TYPOGRAPHY_H1_LINEHEIGHT_DEFAULT, 'lbmn_typography_h1_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 260, LBMN_TYPOGRAPHY_H1_MARGINBOTTOM_DEFAULT, 'lbmn_typography_h1_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 270, LBMN_TYPOGRAPHY_H1_COLOR_DEFAULT, 'lbmn_typography_h1_color' );

	render_subheader_control( esc_attr__( 'Heading 2', 'seowp' ), 'lbmn_typography', 300 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 310, 'lbmn_typography_h2_font', $font_preset_options, LBMN_TYPOGRAPHY_H2_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 330, 'lbmn_typography_h2_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_H2_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 340, LBMN_TYPOGRAPHY_H2_FONTSIZE_DEFAULT, 'lbmn_typography_h2_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 350, LBMN_TYPOGRAPHY_H2_LINEHEIGHT_DEFAULT, 'lbmn_typography_h2_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 360, LBMN_TYPOGRAPHY_H2_MARGINBOTTOM_DEFAULT, 'lbmn_typography_h2_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 370, LBMN_TYPOGRAPHY_H2_COLOR_DEFAULT, 'lbmn_typography_h2_color' );

	render_subheader_control( esc_attr__( 'Heading 3', 'seowp' ), 'lbmn_typography', 400 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 410, 'lbmn_typography_h3_font', $font_preset_options, LBMN_TYPOGRAPHY_H3_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 430, 'lbmn_typography_h3_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_H3_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 440, LBMN_TYPOGRAPHY_H3_FONTSIZE_DEFAULT, 'lbmn_typography_h3_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 450, LBMN_TYPOGRAPHY_H3_LINEHEIGHT_DEFAULT, 'lbmn_typography_h3_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 460, LBMN_TYPOGRAPHY_H3_MARGINBOTTOM_DEFAULT, 'lbmn_typography_h3_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 470, LBMN_TYPOGRAPHY_H3_COLOR_DEFAULT, 'lbmn_typography_h3_color' );

	render_subheader_control( esc_attr__( 'Heading 4', 'seowp' ), 'lbmn_typography', 500 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 510, 'lbmn_typography_h4_font', $font_preset_options, LBMN_TYPOGRAPHY_H4_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 530, 'lbmn_typography_h4_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_H4_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 540, LBMN_TYPOGRAPHY_H4_FONTSIZE_DEFAULT, 'lbmn_typography_h4_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 550, LBMN_TYPOGRAPHY_H4_LINEHEIGHT_DEFAULT, 'lbmn_typography_h4_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 560, LBMN_TYPOGRAPHY_H4_MARGINBOTTOM_DEFAULT, 'lbmn_typography_h4_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 570, LBMN_TYPOGRAPHY_H4_COLOR_DEFAULT, 'lbmn_typography_h4_color' );

	render_subheader_control( esc_attr__( 'Heading 5', 'seowp' ), 'lbmn_typography', 600 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 610, 'lbmn_typography_h5_font', $font_preset_options, LBMN_TYPOGRAPHY_H5_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 630, 'lbmn_typography_h5_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_H5_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 640, LBMN_TYPOGRAPHY_H5_FONTSIZE_DEFAULT, 'lbmn_typography_h5_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 650, LBMN_TYPOGRAPHY_H5_LINEHEIGHT_DEFAULT, 'lbmn_typography_h5_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 660, LBMN_TYPOGRAPHY_H5_MARGINBOTTOM_DEFAULT, 'lbmn_typography_h5_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 670, LBMN_TYPOGRAPHY_H5_COLOR_DEFAULT, 'lbmn_typography_h5_color' );

	render_subheader_control( esc_attr__( 'Heading 6', 'seowp' ), 'lbmn_typography', 700 );
	render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_typography', 710, 'lbmn_typography_h6_font', $font_preset_options, LBMN_TYPOGRAPHY_H6_FONT_DEFAULT );
	render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_typography', 730, 'lbmn_typography_h6_fontweight', $font_weight_options, LBMN_TYPOGRAPHY_H6_FONTWEIGHT_DEFAULT );
	render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_typography', 740, LBMN_TYPOGRAPHY_H6_FONTSIZE_DEFAULT, 'lbmn_typography_h6_fontsize', null, array(
		'min'  => '10',
		'max'  => '80',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Line Height (px)', 'seowp' ), 'lbmn_typography', 750, LBMN_TYPOGRAPHY_H6_LINEHEIGHT_DEFAULT, 'lbmn_typography_h6_lineheight', null, array(
		'min'  => '5',
		'max'  => '100',
		'step' => '1',
	) );
	render_slider_control( esc_attr__( 'Margin Bottom (px)', 'seowp' ), 'lbmn_typography', 760, LBMN_TYPOGRAPHY_H6_MARGINBOTTOM_DEFAULT, 'lbmn_typography_h6_marginbottom', null, array(
		'min'  => '0',
		'max'  => '100',
		'step' => '1',
	) );
	render_colorpickersliders_control( esc_attr__( 'Font Color', 'seowp' ), 'lbmn_typography', 770, LBMN_TYPOGRAPHY_H6_COLOR_DEFAULT, 'lbmn_typography_h6_color' );

	/**
	 * ----------------------------------------------------------------------
	 * Font Sets
	 */

	/**
	 * http://www.google.com/fonts/#ReviewPlace:refine/Collection:Merriweather+Sans|Roboto+Condensed|Roboto|Oxygen|Dosis|Titillium+Web|Ubuntu|Lato|Raleway|Signika+Negative|Kreon|Open+Sans
	 * http://www.google.com/fonts/#ReviewPlace:refine/Collection:Merriweather:400,300|Lora|Rufina|Playfair+Display|Libre+Baskerville|Domine|Noto+Serif
	 */

	$typography_standard_fonts = array(
		'arial'               => esc_attr__( 'Sans-serif > Standard: Arial', 'seowp' ),
		'helvetica'           => esc_attr__( 'Sans-serif > Standard: Helvetica', 'seowp' ),
		'lucida-sans-unicode' => esc_attr__( 'Sans-serif > Standard: Lucida Sans Unicode', 'seowp' ),
		'century-gothic'      => esc_attr__( 'Sans-serif > Modern: Century Gothic', 'seowp' ),
		'divider-1'           => '&nbsp;',
		'arial-narrow'        => esc_attr__( 'Sans-serif > Narrow: Arial Narrow', 'seowp' ),
		'impact'              => esc_attr__( 'Sans-serif > Narrow Heavy: Impact', 'seowp' ),
		'arial-black'         => esc_attr__( 'Sans-serif > Heavy: Arial Black', 'seowp' ),
		'divider-2'           => '&nbsp;',
		'cambria'             => esc_attr__( 'Serif > Standard: Cambria', 'seowp' ),
		'verdana'             => esc_attr__( 'Serif > Standard: Verdana', 'seowp' ),
		'constantia'          => esc_attr__( 'Serif > Modern: Constantia', 'seowp' ),
		'bookman-old-style'   => esc_attr__( 'Serif > Old Style: Bookman Old Style', 'seowp' ),
	);

	render_section_header( esc_attr__( 'Font Presets', 'seowp' ), 255, 'lbmn_fonts', esc_attr__( 'All the setings to make your website looks awesome.', 'seowp' ) );

	// Web font preset 1:
	render_subheader_control( esc_attr__( 'Font Preset 1', 'seowp' ), 'lbmn_fonts', 100 );
	render_select_control( esc_attr__( 'Standard Font', 'seowp' ), 'lbmn_fonts', 110, 'lbmn_font_preset_standard_1', $typography_standard_fonts, LBMN_FONT_PRESET_STANDARD_1_DEFAULT );
	render_googlefonts_control( esc_attr__( 'Google Web Font', 'seowp' ), 'lbmn_fonts', 120, 'lbmn_font_preset_googlefont_1', LBMN_FONT_PRESET_GOOGLEFONT_1_DEFAULT );
	render_text_control( esc_attr__( 'Custom Web Font Name', 'seowp' ), 'lbmn_fonts', 130, '', 'lbmn_font_preset_webfont_1' );
	render_checkbox_control( esc_attr__( 'Use Google Web Fonts', 'seowp' ), 'lbmn_fonts', 140, 1, 'lbmn_font_preset_usegooglefont_1' );

	$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

	if ( ! empty( $languages ) ) {
		foreach ( $languages as $l ) {

			$my_default_lang = apply_filters( 'wpml_default_language', null );

			if ( $my_default_lang != $l['language_code'] ) {
				render_checkbox_control( esc_attr__( 'Use another for', 'seowp' ) . ' ' . $l['translated_name'] . ' ', 'lbmn_fonts', 150, 0, 'lbmn_use_another_font_preset_switch_1_' . $l['language_code'] );
				render_googlefonts_control( esc_attr__( 'Google Web Font -', 'seowp' ) . ' ' . $l['translated_name'] . ' ', 'lbmn_fonts', 150, 'lbmn_font_preset_googlefont_1_' . $l['language_code'] . '', LBMN_FONT_PRESET_GOOGLEFONT_1_DEFAULT );
				render_text_control( esc_attr__( 'Custom Web Font Name -', 'seowp' ) . ' ' . $l['translated_name'] . ' ', 'lbmn_fonts', 150, '', 'lbmn_font_preset_webfont_1_' . $l['language_code'] . '' );
				render_checkbox_control( esc_attr__( 'Use Google Web Fonts -', 'seowp' ) . ' ' . $l['translated_name'] . ' ', 'lbmn_fonts', 150, 1, 'lbmn_font_preset_usegooglefont_1_' . $l['language_code'] . '' );
			}
		}
	}

	// Web font preset 2:
	render_subheader_control( esc_attr__( 'Font Preset 2', 'seowp' ), 'lbmn_fonts', 200 );
	render_select_control( esc_attr__( 'Standard Font', 'seowp' ), 'lbmn_fonts', 210, 'lbmn_font_preset_standard_2', $typography_standard_fonts, LBMN_FONT_PRESET_STANDARD_2_DEFAULT );
	render_googlefonts_control( esc_attr__( 'Google Web Font', 'seowp' ), 'lbmn_fonts', 220, 'lbmn_font_preset_googlefont_2', LBMN_FONT_PRESET_GOOGLEFONT_2_DEFAULT );
	render_text_control( esc_attr__( 'Custom Web Font Name', 'seowp' ), 'lbmn_fonts', 230, '', 'lbmn_font_preset_webfont_2' );
	render_checkbox_control( esc_attr__( 'Use Google Web Fonts', 'seowp' ), 'lbmn_fonts', 240, 1, 'lbmn_font_preset_usegooglefont_2' );

	$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

	if ( ! empty( $languages ) ) {
		foreach ( $languages as $l ) {

			$my_default_lang = apply_filters( 'wpml_default_language', null );

			if ( $my_default_lang != $l['language_code'] ) {
				render_checkbox_control( esc_attr__( 'Use another for', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 250, 0, 'lbmn_use_another_font_preset_switch_2_' . $l['language_code'] );
				render_googlefonts_control( esc_attr__( 'Google Web Font -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 250, 'lbmn_font_preset_googlefont_2_' . $l['language_code'] . '', LBMN_FONT_PRESET_GOOGLEFONT_2_DEFAULT );
				render_text_control( esc_attr__( 'Custom Web Font Name -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 250, '', 'lbmn_font_preset_webfont_2_' . $l['language_code'] . '' );
				render_checkbox_control( esc_attr__( 'Use Google Web Fonts -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 250, 1, 'lbmn_font_preset_usegooglefont_2_' . $l['language_code'] . '' );
			}
		}
	}

	// Web font preset 3:
	render_subheader_control( esc_attr__( 'Font Preset 3', 'seowp' ), 'lbmn_fonts', 300 );
	render_select_control( esc_attr__( 'Standard Font', 'seowp' ), 'lbmn_fonts', 310, 'lbmn_font_preset_standard_3', $typography_standard_fonts, LBMN_FONT_PRESET_STANDARD_3_DEFAULT );
	render_googlefonts_control( esc_attr__( 'Google Web Font', 'seowp' ), 'lbmn_fonts', 320, 'lbmn_font_preset_googlefont_3', LBMN_FONT_PRESET_GOOGLEFONT_3_DEFAULT );
	render_text_control( esc_attr__( 'Custom Web Font Name', 'seowp' ), 'lbmn_fonts', 330, '', 'lbmn_font_preset_webfont_3' );
	render_checkbox_control( esc_attr__( 'Use Google Web Fonts', 'seowp' ), 'lbmn_fonts', 340, 1, 'lbmn_font_preset_usegooglefont_3' );

	$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

	if ( ! empty( $languages ) ) {
		foreach ( $languages as $l ) {

			$my_default_lang = apply_filters( 'wpml_default_language', null );

			if ( $my_default_lang != $l['language_code'] ) {
				render_checkbox_control( esc_attr__( 'Use another for', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 350, 0, 'lbmn_use_another_font_preset_switch_3_' . $l['language_code'] );
				render_googlefonts_control( esc_attr__( 'Google Web Font -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 350, 'lbmn_font_preset_googlefont_3_' . $l['language_code'] . '', LBMN_FONT_PRESET_GOOGLEFONT_3_DEFAULT );
				render_text_control( esc_attr__( 'Custom Web Font Name -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 350, '', 'lbmn_font_preset_webfont_3_' . $l['language_code'] . '' );
				render_checkbox_control( esc_attr__( 'Use Google Web Fonts -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 350, 1, 'lbmn_font_preset_usegooglefont_3_' . $l['language_code'] . '' );
			}
		}
	}

	// Web font preset 4:
	render_subheader_control( esc_attr__( 'Font Preset 4', 'seowp' ), 'lbmn_fonts', 400 );
	render_select_control( esc_attr__( 'Standard Font', 'seowp' ), 'lbmn_fonts', 410, 'lbmn_font_preset_standard_4', $typography_standard_fonts, LBMN_FONT_PRESET_STANDARD_4_DEFAULT );
	render_googlefonts_control( esc_attr__( 'Google Web Font', 'seowp' ), 'lbmn_fonts', 420, 'lbmn_font_preset_googlefont_4', LBMN_FONT_PRESET_GOOGLEFONT_4_DEFAULT );
	render_text_control( esc_attr__( 'Custom Web Font Name', 'seowp' ), 'lbmn_fonts', 430, '', 'lbmn_font_preset_webfont_4' );
	render_checkbox_control( esc_attr__( 'Use Google Web Fonts', 'seowp' ), 'lbmn_fonts', 440, 1, 'lbmn_font_preset_usegooglefont_4' );

	$languages = apply_filters( 'wpml_active_languages', null, 'orderby=id&order=desc' );

	if ( ! empty( $languages ) ) {
		foreach ( $languages as $l ) {

			$my_default_lang = apply_filters( 'wpml_default_language', null );

			if ( $my_default_lang != $l['language_code'] ) {
				render_checkbox_control( esc_attr__( 'Use another for', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 450, 0, 'lbmn_use_another_font_preset_switch_4_' . $l['language_code'] );
				render_googlefonts_control( esc_attr__( 'Google Web Font -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 450, 'lbmn_font_preset_googlefont_4_' . $l['language_code'] . '', LBMN_FONT_PRESET_GOOGLEFONT_4_DEFAULT );
				render_text_control( esc_attr__( 'Custom Web Font Name -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 450, '', 'lbmn_font_preset_webfont_4_' . $l['language_code'] . '' );
				render_checkbox_control( esc_attr__( 'Use Google Web Fonts -', 'seowp' ) . ' '  . $l['translated_name'] . ' ', 'lbmn_fonts', 450, 1, 'lbmn_font_preset_usegooglefont_4_' . $l['language_code'] . '' );
			}
		}
	}

	// Advanced font settings:
	render_subheader_control( esc_attr__( 'Additional character sets', 'seowp' ), 'lbmn_fonts', 500 );
	render_checkbox_control( esc_attr__( 'Latin Extended', 'seowp' ), 'lbmn_fonts', 510, 0, 'lbmn_font_characterset_latinextended' );
	render_checkbox_control( esc_attr__( 'Cyrillic', 'seowp' ), 'lbmn_fonts', 530, 0, 'lbmn_font_characterset_cyrillic' );
	render_checkbox_control( esc_attr__( 'Cyrillic Extended', 'seowp' ), 'lbmn_fonts', 540, 0, 'lbmn_font_characterset_cyrillicextended' );
	render_checkbox_control( esc_attr__( 'Greek', 'seowp' ), 'lbmn_fonts', 550, 0, 'lbmn_font_characterset_greek' );
	render_checkbox_control( esc_attr__( 'Greek Extended', 'seowp' ), 'lbmn_fonts', 560, 0, 'lbmn_font_characterset_greekextended' );
	render_checkbox_control( esc_attr__( 'Vietnamese', 'seowp' ), 'lbmn_fonts', 570, 0, 'lbmn_font_characterset_vietnamese' );

	/* The code below not used anymore in the second generation of the theme */
	if ( lbmn_updated_from_first_generation() ) {

		/**
		 * ----------------------------------------------------------------------
		 * "Call to action" section
		 */
		render_section_header( esc_attr__( 'Call-to-action area', 'seowp' ), 260, 'lbmn_calltoaction', esc_attr__( 'Site-wide call to action area settings', 'seowp' ) );
		render_checkbox_control( esc_attr__( 'Enable', 'seowp' ), 'lbmn_calltoaction', 20, 1, 'lbmn_calltoaction_switch' ); // Top panel switch.
		render_slider_control( esc_attr__( 'Height', 'seowp' ), 'lbmn_calltoaction', 22, LBMN_CALLTOACTION_HEIGHT_DEFAULT, 'lbmn_calltoaction_height', null, array(
			'min'  => '60',
			'max'  => '200',
			'step' => '2',
		) );

		// Message elements:
		render_text_control( esc_attr__( 'Call to action Message', 'seowp' ), 'lbmn_calltoaction', 40, LBMN_CALLTOACTION_MESSAGE_DEFAULT, 'lbmn_calltoaction_message' );// Call to action.
		render_text_control( esc_attr__( 'Link', 'seowp' ), 'lbmn_calltoaction', 70, LBMN_CALLTOACTION_URL_DEFAULT, 'lbmn_calltoaction_url' );
		// Font:
		render_live_select_control( esc_attr__( 'Font Family', 'seowp' ), 'lbmn_calltoaction', 80, 'lbmn_calltoaction_font', $font_preset_options, LBMN_CALLTOACTION_FONT_DEFAULT );
		render_live_select_control( esc_attr__( 'Font Weight', 'seowp' ), 'lbmn_calltoaction', 90, 'lbmn_calltoaction_fontweight', $font_weight_options, LBMN_CALLTOACTION_FONTWEIGHT_DEFAULT );
		render_slider_control( esc_attr__( 'Font Size (px)', 'seowp' ), 'lbmn_calltoaction', 100, LBMN_CALLTOACTION_FONTSIZE_DEFAULT, 'lbmn_calltoaction_fontsize', null, array(
			'min'  => '10',
			'max'  => '80',
			'step' => '1',
		) );
		// Colors:
		render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'lbmn_calltoaction', 110, LBMN_CALLTOACTION_BACKGROUNDCOLOR_DEFAULT );
		render_colorpickersliders_control( esc_attr__( 'Text Color', 'seowp' ), 'lbmn_calltoaction', 120, LBMN_CALLTOACTION_TXTCOLOR_DEFAULT );
		render_colorpickersliders_control( esc_attr__( 'Background Color', 'seowp' ), 'lbmn_calltoaction', 130, LBMN_CALLTOACTION_BACKGROUNDCOLOR_HOVER_DEFAULT, 'lbmn_calltoaction_backgroundcolor_hover' );
		render_colorpickersliders_control( esc_attr__( 'Text Color', 'seowp' ), 'lbmn_calltoaction', 140, LBMN_CALLTOACTION_TXTCOLOR_HOVER_DEFAULT, 'lbmn_calltoaction_textcolor_hover' );

	}

	/**
	 * ----------------------------------------------------------------------
	 * Other settings
	 */
	render_section_header( esc_attr__( 'Advanced Settings', 'seowp' ), 800, 'lbmn_advanced', '' );
	render_checkbox_control( esc_attr__( 'Enable Page Preloading Effect', 'seowp' ), 'lbmn_advanced', 20, 1, 'lbmn_advanced_preloader' );
	render_checkbox_control( esc_attr__( 'Enable Off Canvas Mobile Menu', 'seowp' ), 'lbmn_advanced', 30, 1, 'lbmn_advanced_off_canvas_mobile_menu' );
	render_text_control( esc_attr__( 'Envato Purchase Code (activates automatic theme updates):', 'seowp' ), 'lbmn_advanced', 40, '', 'lbmn_user', 'option', 'purchase_code' );


	/**
	 * ----------------------------------------------------------------------
	 * Remove some standard WP sections from Theme Customizer
	 */

	// $wp_customize->remove_section( 'nav' );
	// $wp_customize->remove_section( 'static_front_page' );
	// $wp_customize->remove_section( 'background_image' );

	/**
	 * ----------------------------------------------------------------------
	 * Remove some standard WP controls from Theme Customizer
	 */
	// $wp_customize->remove_control('blogname');
	// $wp_customize->remove_control('blogdescription');
	// $wp_customize->remove_control('site_icon');
}
add_action( 'customize_register', 'lbmn_customizer' );


/**
 * ----------------------------------------------------------------------
 * Customizer data sanitization
 */

function lbmn_sanitize_text( $input ) {
	return wp_kses_post( $input ); // Sanitize content for allowed HTML tags for post content.
}

function lbmn_sanitize_checkbox( $input ) {
	if ( $input == 1 ) {
		return 1;
	} else {
		return '';
	}
}

function lbmn_sanitize_sidebar_position( $input ) {
	$valid = array( 'left', 'none', 'right', );

	if ( array_key_exists( $input, $valid ) ) {
		return $input;
	} else {
		return '';
	}
}

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function lbmn_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';
}
add_action( 'customize_register', 'lbmn_customize_register' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function lbmn_customize_preview_js() {
	wp_enqueue_script(
		'lbmn_customizer_preview',
		get_template_directory_uri() . '/inc/customizer/customizer-preview.js',
		array( 'lbmn-custom-js' ),
		filemtime( get_template_directory() . '/inc/customizer/customizer-preview.js' ),
		true
	);

	// Send object 'customizerDataSent' with font presets sets
	$customizerData = array(
		'fontPresetsNames' => lbmn_return_font_presets_names(),
		'headerTopHeight'  => intval( str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_height', LBMN_HEADERTOP_HEIGHT_DEFAULT ) ) ),
		'megaMenuHeight'   => intval( str_replace( 'px', '', get_theme_mod( 'lbmn_headertop_menu_height', LBMN_HEADERTOP_MENUHEIGHT_DEFAULT ) ) ),
	);
	wp_localize_script( 'lbmn_customizer_preview', 'customizerDataSent', $customizerData );
}
add_action( 'customize_preview_init', 'lbmn_customize_preview_js' );

/**
 * Add more JavaScript files to customizer admin
 */
function lbmn_add_customizer_js() {

	wp_enqueue_media(); // need this to make WP Media Library to work

	wp_enqueue_script(
		'lbmn_customizer_tinycolor_js',
		get_template_directory_uri() . '/inc/customizer/jquery-colorpickersliders/jquery.colorpickersliders.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/inc/customizer/jquery-colorpickersliders/jquery.colorpickersliders.js' ),
		true
	);
	wp_enqueue_script(
		'lbmn_customizer_customcolorpicker_js',
		get_template_directory_uri() . '/inc/customizer/jquery-colorpickersliders/tinycolor.js',
		array( 'jquery', 'lbmn_customizer_tinycolor_js' ),
		filemtime( get_template_directory() . '/inc/customizer/jquery-colorpickersliders/tinycolor.js' ),
		true
	);
	wp_enqueue_script(
		'lbmn_customizer_adminjs',
		get_template_directory_uri() . '/inc/customizer/customizer-admin.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/inc/customizer/customizer-admin.js' ),
		true
	);
	wp_enqueue_style(
		'lbmn_customizer_adminstyle',
		get_template_directory_uri() . '/inc/customizer/customizer-admin.css',
		array(),
		filemtime( get_template_directory() . '/inc/customizer/customizer-admin.css' )
	);
	wp_enqueue_style(
		'lbmn_customizer_customcolorpicker_css',
		get_template_directory_uri() . '/inc/customizer/jquery-colorpickersliders/jquery.colorpickersliders.css'
	);
	// Prepare some data to be transmitted to JS.
	$customizerData = array( 'fontPresetsWeights' => lbmn_return_font_presets_weights() );

	// MegaMainMenu isn't installed - show a message using JS.
	if ( ! class_exists( 'mega_main_init' ) ) {
		$customizerData['notInstalled_MegaMainMenu'] = 1;
	}

	// LiveComposer isn't installed - show a message using JS.
	if ( ! class_exists( 'mega_main_init' ) || ! function_exists( 'lc_welcome' ) ) {
		$customizerData['notInstalled_requiredPlugin'] = 1;
	}

	// No menu assigned to the location 'header-menu'.
	if ( ! has_nav_menu( 'header-menu' ) ) {
		$customizerData['notAssigned_HeaderMenu'] = 1;
	}

	if ( ! has_nav_menu( 'topbar' ) ) {
		$customizerData['notAssigned_TopBar'] = 1;
	}

	// Strings in the JS that needs translation.
	$js_strings_to_translate = array(
		'beforeHeader' => esc_attr__( 'Before Header', 'seowp' ),
		'header'       => esc_attr__( 'Header', 'seowp' ),
		'content'      => esc_attr__( 'Content', 'seowp' ),
		'footer'       => esc_attr__( 'Footer', 'seowp' ),
		'other'        => esc_attr__( 'Other', 'seowp' ),

		'applyFontChanges' => sprintf( esc_attr__( 'Important: to apply font changes click %1$s"Save & Publish"%2$s on the top.', 'seowp' ), '<strong>', '</strong>' ),
		'whereToFindFonts' => sprintf(
			'%1$s <br /><br /><a href="http://www.google.com/fonts/" target="_blank" class="button button-primary lbmn-google-fonts-button">%2$s</a>',
			esc_attr__( 'Find the fonts for your project in the', 'seowp' ),
			esc_attr__( 'Google Fonts directory', 'seowp' ) ),
		'dropdownPreview'  => esc_attr__( 'Dropdown Preview', 'seowp' ),
		'nextDropdown'     => esc_attr__( 'Next Dropdown', 'seowp' ),
		'close'            => esc_attr__( 'Close', 'seowp' ),
	);

	$customizerData['strings'] = $js_strings_to_translate;

	// Send data to JS.
	wp_localize_script( 'lbmn_customizer_adminjs', 'customizerDataSentOnLoad', $customizerData );

	// Chosen Jquery selector with search by HARVEST
	// used fot Google Fonts selectors.
	wp_enqueue_script(
		'lbmn_chosen_selectorjs',
		get_template_directory_uri() . '/javascripts/chosen/chosen.jquery.min.js',
		array( 'jquery' ),
		filemtime( get_template_directory() . '/javascripts/chosen/chosen.jquery.min.js' ),
		true
	);
	wp_enqueue_style(
		'lbmn_chosen_selectorcss',
		get_template_directory_uri() . '/javascripts/chosen/chosen.css'
	);
}
// Include the custom js and css needed for Theme Customizer work.
add_action( 'customize_controls_enqueue_scripts', 'lbmn_add_customizer_js' );