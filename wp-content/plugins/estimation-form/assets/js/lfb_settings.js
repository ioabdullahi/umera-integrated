(function ($) {
    "use strict";
    lfb_settingsData = lfb_settingsData[0];
    $(document).ready(function () {
        $('#lfb_form').css('opacity',1);
        $('#lfb_licenseRep').hide();
        $('a[data-action="lfb_settings_checkLicense"]').on('click', lfb_settings_checkLicense);
        if (lfb_settingsData.backendTheme == 'glassmorphic') {
            $('body').addClass('lfb_glassmorphic');
        }

    });

  
    function lfb_settings_checkLicense() {
        var error = false;
        var $field = jQuery('#lfb_settings_licenseContainer input[name="purchaseCode"]');
        $field.parent().removeClass('has-error');
            if($field.val().length < 7){
                $field.parent().addClass('has-error');
            } else {
                lfb_showLoader();
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {action: 'lfb_checkLicense', code: $field.val()},
                success: function (rep) {
                    jQuery('#lfb_loader').fadeOut();
                    if(rep == '777'){
                        document.location.reload();                        
                    } else {
                        $field.parent().addClass('has-error');
                        $('#lfb_licenseRep').remove();
                        var $msg = $('<div id="lfb_licenseRep" class="alert alert-danger">'+rep+'</div>');
                        $('#lfb_alertX').before($msg);                        
                    }
                }
            });
        }
    }
    function lfb_showLoader() {
        jQuery('html,body').animate({scrollTop: 0}, 250);
        jQuery('#lfb_loader').fadeIn();
    }
    
})(jQuery);