(function($){
	"use strict";
jQuery(document).ready(function($) {

	if (typeof Backbone != 'undefined' && typeof Marionette != 'undefined') {

		var nfpaypalRadio = Backbone.Radio;
		var mynfcontroller = Marionette.Object.extend({

			initialize: function() {
				// Listen for messages that are fired before a setting view is rendered.
				this.listenTo( nfpaypalRadio.channel( 'app' ), 'before:renderSetting', this.beforeRenderSetting );

				this.listenTo( nfpaypalRadio.channel( 'setting-paypal_standard_billing_cycle_type' ),     'attach:setting',      this.defaultFields );
				this.listenTo(nfpaypalRadio.channel('setting-name-paypal_standard_billing_cycle_number'), 'init:settingModel', this.registerBillingCycleNumberListener);
				this.listenTo(nfpaypalRadio.channel("actionSetting-paypal_standard_billing_cycle_type"), 'update:setting', this.triggerCycleNumberUpdate);
			},

			beforeRenderSetting: function (settingModel, dataModel, view ){
				if ( ( 'undefined' == dataModel.get( 'paypal_standard_billing_cycle_type' ) || _.isEmpty( dataModel.get( 'paypal_standard_billing_cycle_type' ) ) ) ) {
					dataModel.set( 'paypal_standard_billing_cycle_type', 'D' );
				}
				if ( ( 'undefined' == dataModel.get( 'paypal_standard_recurring_times' ) || _.isEmpty( dataModel.get( 'paypal_standard_recurring_times' ) ) ) ) {
					dataModel.set( 'paypal_standard_recurring_times', 'infinite' );
				}
				if ( ( 'undefined' == dataModel.get( 'paypal_standard_billing_cycle_number' ) || _.isEmpty( dataModel.get( 'paypal_standard_billing_cycle_number' ) ) ) ) {
					dataModel.set( 'paypal_standard_billing_cycle_number', '1' );
				}
			},
			defaultFields: function( settingModel, dataModel) {
			 this.triggerCycleNumberUpdate( dataModel, settingModel );

			 },
			registerBillingCycleNumberListener: function(model) {
				model.listenTo(nfpaypalRadio.channel('paypal_standard_billing_cycle_number'), 'update:BillingCycle', this.updateBillingCycle, model);

			},
			triggerCycleNumberUpdate: function(dataModel, settingModel) {
				var prev = dataModel.get('paypal_standard_billing_cycle_number');
				var type = dataModel.get('paypal_standard_billing_cycle_type');
				var min = 1;
				var max = 0;
				switch (type) {
					case "D":
						max = 100;
						break;
					case "W":
						max = 52;
						break;
					case "M":
						max = 12;
						break;
					case "Y":
						max = 5;
						break;
					default:
						max = 100;
						break;

				}
				var a = [];
				for (var i = min; i <= max; i++) {
					a.push({
						label: i,
						value: i
					});
				}

				//data ={options:a, choice}
				nfpaypalRadio.channel('paypal_standard_billing_cycle_number').trigger('update:BillingCycle', a, prev);
			},
			updateBillingCycle: function(options, selected) {
				var $el = jQuery('#paypal_standard_billing_cycle_number');
					$el.empty(); // remove old options
				var sel_options = this.get( 'options' );

				jQuery.each(options, function(key, value) {
					if( selected == value.label ){
						$el.append(jQuery('<option selected="selected"></option>').attr('value', value.label).text(value.label));
					}else{
						$el.append(jQuery('<option></option>').attr('value', value.label).text(value.label));
					}
					//$el.change();
				});

				this.set('options', options)
			}
		})

		 new mynfcontroller();
	}

});
})(jQuery);