var MailChimpOptinsController = Marionette.Object.extend({
	initialize: function() {
		this.listenTo(nfRadio.channel('form'), 'render:view', this.setup);
	},
	setup: function(view) {
		var formID = view.model.get('id');
		nfRadio.channel('form-' + formID).reply('maybe:submit', this.beforeSubmit, this, formID);
	},
	beforeSubmit: function(formModel) {
		if ( formModel.get('errors').length > 0 ) {
			nfRadio.channel( 'form-' + formModel.get('id') ).request( 'remove:error', 'mailchimp-optins' );
		}

		return true;
	}
});

(function($) {
	$(document).ready(function($){
		new MailChimpOptinsController();
	});
})(jQuery);
