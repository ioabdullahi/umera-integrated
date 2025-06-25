(function ($) {
    "use strict";

    jQuery('.lfb-admin-notice .lfb-admin-notice-dismiss').on('click', function () {
        jQuery.ajax({
            url: ajaxurl,
            data: {
                action: 'lfb_admin_notice_dismiss'
            }
        });
        jQuery('.lfb-admin-notice').fadeOut();
    });

    jQuery('.lfb-admin-notice .lfb-admin-notice-remind-later').on('click', function () {
        jQuery.ajax({
            url: ajaxurl,
            data: {
                action: 'lfb_admin_notice_remind_me_later'
            }
        });
        jQuery('.lfb-admin-notice').fadeOut();
    });

})(jQuery);