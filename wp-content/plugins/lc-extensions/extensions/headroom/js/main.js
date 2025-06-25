(function() {
	if ( !jQuery( "body" ).hasClass( "dslca-enabled" ) ) {

		var header = document.querySelector("#dslc-header");

		if(window.location.hash) {
			header.classList.add("headroom--unpinned");
		}

		var headroom = new Headroom(header, {
			tolerance: {
				down : 10,
				up : 20
			},
			offset : 205
		});
		headroom.init();

		if ( jQuery( "#dslc-header" ).hasClass( "headroom" ) ) {

			var headerHeight = jQuery( "#dslc-header" ).height();
			jQuery( "#dslc-main .dslc-modules-section:first-child" ).css({ paddingTop : headerHeight });
		}
	}
}());