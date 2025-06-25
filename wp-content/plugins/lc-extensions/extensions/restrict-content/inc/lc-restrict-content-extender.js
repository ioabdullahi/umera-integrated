/**
 * Section
 */
jQuery(document).on( 'click', ".dslca-modules-section-edit-field[data-id='restrict_section_before'], .dslca-modules-section-edit-field[data-id='restrict_section_after']", function(event){

	var currentData, row_edited;

	currentData = jQuery(this).data("id");
	row_edited = jQuery('.dslca-modules-section-being-edited', LiveComposer.Builder.PreviewAreaDocument).length;

	// If settings panel opened
	if ( row_edited > 0 ) {

		LiveComposer.Builder.UI.CModalWindow({
			title: 'Please add your content.',
			content: '<textarea>' + event.target.value + '</textarea>',
			confirm: function() {

				var textarea = jQuery('.dslca-prompt-modal textarea').val();

				if ( 'restrict_section_before' == currentData ) {
					jQuery("[data-id='restrict_section_before']").val( textarea ).change();
				} else {
					jQuery("[data-id='restrict_section_after']").val( textarea ).change();
				}
			}
		});
	}
});

/**
 * Module
 */
jQuery(document).on( 'click', ".dslca-module-edit-field[data-id='restrict_module_before'], .dslca-module-edit-field[data-id='restrict_module_after']", function(event){

	var currentData, module_edited;

	currentData = jQuery(this).data("id");
	module_edited = jQuery('.dslca-module-being-edited', LiveComposer.Builder.PreviewAreaDocument).length;

	// If settings panel opened
	if ( module_edited > 0 ) {

		LiveComposer.Builder.UI.CModalWindow({
			title: 'Please add your content.',
			content: '<textarea>' + event.target.value + '</textarea>',
			confirm: function() {

				var textarea = jQuery('.dslca-prompt-modal textarea').val();

				if ( 'restrict_module_before' == currentData ) {
					jQuery("[data-id='restrict_module_before']").val( textarea ).change();
				} else {
					jQuery("[data-id='restrict_module_after']").val( textarea ).change();
				}
			}
		});
	}
});