(function ($) {
    "use strict";
    
jQuery(window).on('load',function () {
    jQuery('.open-estimation-form').click(lfb_popup_estimation);
});

var lfb_initial_overflowBody = "auto";
var lfb_initial_overflowHtml = "auto";
function lfb_popup_estimation() {
    var form_id = 0;
    var cssClass = jQuery(this).attr('class');
    cssClass = cssClass.split(' ');
    var startStep = "";
    jQuery.each(cssClass, function (c) {
        c = cssClass[c];
        if (c.indexOf('form-') > -1) {
            form_id = c.substr(c.indexOf('form-') + 5, c.length);
        }
        if (c.indexOf('step-') > -1) {
            startStep = c.substr(c.indexOf('step-') + 5, c.length);
        }
    });
    lfb_initial_overflowBody = jQuery('body').css('overflow-y');
    lfb_initial_overflowHtml = jQuery('html').css('overflow-y');
    jQuery('body,html').css('overflow-y','hidden');
    if(startStep != ""){
        jQuery('#lfb_form[data-form="' + form_id + '"] .lfb_genSlide').attr('data-start',0);
        jQuery('#lfb_form[data-form="' + form_id + '"] .lfb_genSlide[data-stepid="'+startStep+'"]').attr('data-start',1);
        jQuery('#lfb_form[data-form="' + form_id + '"]').trigger('lfb_changeStep',startStep,form_id);
    }
    jQuery('#lfb_form[data-form="' + form_id + '"]').show().animate({
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 1
    }, 500, function () {
        jQuery('#lfb_form[data-form="' + form_id + '"] #lfb_close_btn').delay(500).fadeIn(500);
        jQuery('#lfb_form[data-form="' + form_id + '"] #lfb_close_btn').click(function () {
            lfb_close_popup_estimation(form_id);
        });
		 jQuery('#lfb_form[data-form="' + form_id + '"] #lfb_mainPanel').show();
        
          setTimeout(function(){
            jQuery('body').trigger('lfb_resize');              
          },250);
         
    });    
    
}

function lfb_close_popup_estimation(form_id) {
    jQuery('#lfb_form[data-form="' + form_id + '"]').animate({
        top: '50%',
        left: '50%',
        width: '0px',
        height: '0px',
        opacity: 0
    }, 500, function () {
        jQuery('body').css('overflow-y',lfb_initial_overflowBody);
        jQuery('html').css('overflow-y',lfb_initial_overflowHtml);
        location.reload();
    });

}

})(jQuery);