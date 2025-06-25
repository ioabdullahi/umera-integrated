(function ($) {
    "use strict";

    var saveTimer = false;

    $(document).ready(function () {
        initLoginListeners();
        if (lfb_dataCust.customerID > 0) {
            loadOrders();
            initCustomerAccountUI();
        } else {
            initLoginUI();
        }
    });
    function initCustomerAccountUI() {

        $('#lfb_form.lfb_customerAccount [data-toggle="tooltip"]').tooltip({
        });
        $('#lfb_custAccountPanel a[data-action="saveCustomerInfos"]').on('click', saveCustomerInfos);
        $('#lfb_custAccountPanel a[data-action="deleteCustomerData"]').on('click', function () {
            $('#lfb_delDataForm').slideDown();
        });
        $('#lfb_custAccountPanel a[data-action="confirmDeleteCustomerData"]').on('click', confirmDeleteCustomerData);
        $('#lfb_custAccountPanel a[data-action="downloadCustomerData"]').on('click', downloadCustomerData);
        $('a[data-action="leaveAccount"]').on('click', leaveAccount);
    }
    function initLoginUI() {
        var winPass = $('<div class="modal fade" id="lfb_winPass" tabindex="-1" role="dialog" aria-hidden="true"></div>');
        winPass.append('<div class="modal-dialog  modal-sm"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"></div></div></div>');
        winPass.find('.modal-header').append('<h4 class="modal-title m-0"><i class="fas fa-lock-open"></i>' + lfb_dataCust.txtCustomersDataForgotPassLink + '</h4><a href="javascript:" class="close" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></a>');
        winPass.find('.modal-body').append('<div class="form-group"><div class="input-group"><div class="input-group-addon"><span class="far fa-envelope"></span></div><input type="text" class="form-control" id="lfb_manEmailPass" placeholder="' + lfb_dataCust.customersDataLabelEmail + '"></div></div>');
        winPass.find('.modal-body').append('<a href="javascript:" data-action="sendPass"  class="btn btn-primary"><span class="far fa-envelope"></span>' + lfb_dataCust.txtCustomersDataForgotPassLink + '</a>');
        winPass.find('.modal-body').append('<p id="lfb_passLostConfirmation"  style="text-align: center;"><span class="fas fa-check"></span><br/>' + lfb_dataCust.txtCustomersDataForgotPassSent + '</p>');
        $('#lfb_form').append(winPass);
        $('#lfb_winPass').find('#lfb_passLostConfirmation').hide();
        winPass.find('a[data-action="sendPass"]').on('click', sendPassword);
        $('#lfb_winPass .close').on('click',function(){            
            $('#lfb_winPass').modal('hide');
        });


    }
    function sendPassword() {
        var email = jQuery('#lfb_manEmailPass').val();
        var error = false;
        jQuery('#lfb_manEmailPass').closest('.form-group').removeClass('has-error');
        if (!checkEmail(email)) {
            jQuery('#lfb_manEmailPass').closest('.form-group').addClass('has-error');
            error = true;
        }
        if (!error) {
            jQuery.ajax({
                url: lfb_dataCust.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_forgotPassManD',
                    email: email
                },
                success: function (rep) {
                    rep = rep.trim();
                    if (rep == '1') {
                        jQuery('#lfb_winPass').find('.form-group,a.btn').hide();
                        jQuery('#lfb_winPass').find('#lfb_passLostConfirmation').show();
                        setTimeout(function () {
                            jQuery('#lfb_winPass').modal('hide');
                            jQuery('#lfb_winPass').find('#lfb_passLostConfirmation').hide();
                            jQuery('#lfb_winPass').find('.form-group,a.btn').show();
                        }, 3000);
                    } else {
                        jQuery('#lfb_manEmailPass').closest('.form-group').addClass('has-error');
                    }
                }
            });
        }
    }
    function initLoginListeners() {
        $('#lfb_custAccountLoginPanel').find('a[data-action="loginCustAccount"]').on('click', loginCustomer);
        $('#lfb_custAccountForgotPassLink').on('click', function () {
            $('#lfb_winPass .has-error').removeClass('has-error');
            $('#lfb_winPass').modal('show');
            var email = $('#lfb_custAccountLoginPanel [name="email"]').val();
            if (checkEmail(email)) {
                $('#lfb_winPass #lfb_manEmailPass').val(email);
            } else {
                $('#lfb_winPass #lfb_manEmailPass').val('');
            }
        });
    }
    function loginCustomer() {
        var email = $('#lfb_custAccountLoginPanel').find('[name="email"]').val();
        var pass = $('#lfb_custAccountLoginPanel').find('[name="pass"]').val();
        var error = false;
        $('#lfb_custAccountLoginPanel').find('.has-error').removeClass('has-error');
        if (!checkEmail(email)) {
            error = true;
            $('#lfb_custAccountLoginPanel').find('[name="email"]').closest('.form-group').addClass('has-error');
        }
        if (pass.length < 4) {
            error = true;
            $('#lfb_custAccountLoginPanel').find('[name="pass"]').closest('.form-group').addClass('has-error');
        }
        if (!error) {
            jQuery.ajax({
                url: lfb_dataCust.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_loginCustomer',
                    email: email,
                    pass: pass
                },
                success: function (rep) {
                    if (rep.trim() == 1) {
                        document.location.href = document.location.href;
                    } else {
                        $('#lfb_custAccountLoginPanel').find('[name="email"]').closest('.form-group').addClass('has-error');
                        $('#lfb_custAccountLoginPanel').find('[name="pass"]').closest('.form-group').addClass('has-error');
                    }
                }
            });
        }
    }

    function checkEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    function loadOrders() {

        jQuery.ajax({
            url: lfb_dataCust.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_loadCustomerOrders'
            },
            success: function (rep) {
                var orders = JSON.parse(rep);
                $('#lfb_customerOrdersTable tbody').html('');
                for (var i = 0; i < orders.length; i++) {
                    var order = orders[i];
                    var total = formatPrice(order.totalPrice, order.currency, order.currencyPosition, order.decimalsSeparator, order.thousandsSeparator, order.millionSeparator, order.billionsSeparator);
                    var totalSubscription = formatPrice(order.totalSubscription, order.currency, order.currencyPosition, order.decimalsSeparator, order.thousandsSeparator, order.millionSeparator, order.billionsSeparator);


                    var tr = $('<tr data-id="' + order.id + '"></tr>');
                    tr.append('<td>' + order.dateLog + '</td>');
                    tr.append('<td class="text-right">' + totalSubscription + '</td>');
                    tr.append('<td class="text-right">' + total + '</td>');
                    tr.append('<td>' + order.statusText + '</td>');
                    tr.append('<td class="lfb_actionTh"></td>');
                    if (order.contentUser == 1) {
                        tr.find('.lfb_actionTh').append('<a href="javascript:" data-action="viewOrder" title="' + lfb_dataCust.customersAc_viewOrder + '" class="btn btn-default btn-circle" data-toggle="tooltip" data-placement="bottom"><span class="fa fa-eye"></span></a>'
                                + '<a href="javascript:" data-action="downloadOrder" title="' + lfb_dataCust.customersAc_downloadOrder + '" class="btn btn-default btn-circle" data-toggle="tooltip" data-placement="bottom"><span class="fa fa-file-download"></span></a></td>');
                    }

                    $('#lfb_customerOrdersTable tbody').append(tr);

                    tr.find('[data-toggle="tooltip"]').tooltip({
                        container: '#lfb_form.lfb_customerAccount',
                        placement: 'top'
                    });

                    tr.find('a[data-action="viewOrder"]').on('click', function () {
                        $('.tooltip').remove();
                        $('#lfb_delDataForm').slideUp();
                        viewOrder($(this).closest('tr').attr('data-id'));
                    });
                    tr.find('a[data-action="downloadOrder"]').on('click', function () {
                        $('#lfb_delDataForm').slideUp();
                        $('.tooltip').remove();
                        downloadOrder($(this).closest('tr').attr('data-id'));
                    });

                }
            }
        });
    }

    function formatPrice(price, currency, currencyPosition, decimalsSeparator, thousandsSeparator, millionSeparator, billionsSeparator) {
        if (!price) {
            price = 0;
        }
        var formatedPrice = price.toString();
        formatedPrice = parseFloat(price).toFixed(2).toString();
        var decSep = decimalsSeparator;
        var thousSep = thousandsSeparator;
        var priceNoDecimals = formatedPrice;
        var millionSep = millionSeparator;
        var billionSep = billionsSeparator;
        var decimals = "";
        if (formatedPrice.indexOf('.') > -1) {
            priceNoDecimals = formatedPrice.substr(0, formatedPrice.indexOf('.'));
            decimals = formatedPrice.substr(formatedPrice.indexOf('.') + 1, 2);
            formatedPrice = formatedPrice.replace('.', decimalsSeparator);
            if (decimals.toString().length == 1) {
                decimals = decimals.toString() + '0';
            }
            if (priceNoDecimals.length > 9) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 9) + billionSep + priceNoDecimals.substr(priceNoDecimals.length - 9, 3) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length) + decimalsSeparator + decimals;
            } else if (priceNoDecimals.length > 6) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 6) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length) + decimalsSeparator + decimals;
            } else if (priceNoDecimals.length > 3) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length) + decimalsSeparator + decimals;
            }
        } else {
            if (priceNoDecimals.length > 9) {
                formatedPrice = formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 9) + billionSep + priceNoDecimals.substr(priceNoDecimals.length - 9, 3) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length);
            } else if (priceNoDecimals.length > 6) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 6) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length);
            } else if (priceNoDecimals.length > 3) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length);
            }
        }
        if (currencyPosition == 'left') {
            formatedPrice = currency.toString() + formatedPrice.toString();
        } else {
            formatedPrice = formatedPrice.toString() + currency.toString();
        }
        return formatedPrice;
    }
    function downloadOrder(orderID) {
        $('.tooltip').remove();
        jQuery.ajax({
            url: lfb_dataCust.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_downloadCustomerOrder',
                orderID: orderID
            },
            success: function (rep) {
                if (rep.trim() == 1) {
                    var win = window.open(lfb_dataCust.homeUrl + '/index.php?EPFormsBuilder=downloadMyOrder', '_blank');
                    if (typeof (win) !== 'null' && win != null) {
                        $('.tooltip').remove();
                        win.focus();
                        setTimeout(function () {
                            $('.tooltip').remove();
                            win.close();
                        }, 300);
                    }

                } else {
                    $('#lfb_customerOrdersTable tbody [data-action="downloadOrder"]').remove();
                }
            }
        });
    }
    function viewOrder(orderID) {
        jQuery.ajax({
            url: lfb_dataCust.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_viewCustomerOrder',
                orderID: orderID
            },
            success: function (rep) {
                $('#lfb_viewFormPanel').html(rep);
                $('#lfb_viewFormModal').modal('show');
                $('#lfb_viewFormPanel [bgcolor]').each(function () {
                    $(this).css({
                        backgroundColor: $(this).attr('bgcolor')
                    });
                });
                $('#lfb_viewFormPanel [bordercolor]').each(function () {
                    $(this).css({
                        border: '1px solid ' + $(this).attr('bordercolor')
                    });
                });



            }
        });
    }

    function saveCustomerInfos() {
        $('#lfb_delDataForm').slideUp();
        var error = false;
        var email = $('#lfb_accountInfosPanel').find('[name="email"]').val().trim();
        var firstName = $('#lfb_accountInfosPanel').find('[name="firstName"]').val().trim();
        var lastName = $('#lfb_accountInfosPanel').find('[name="lastName"]').val().trim();
        var phone = $('#lfb_accountInfosPanel').find('[name="phone"]').val().trim();
        var phoneJob = $('#lfb_accountInfosPanel').find('[name="phoneJob"]').val().trim();
        var job = $('#lfb_accountInfosPanel').find('[name="job"]').val().trim();
        var company = $('#lfb_accountInfosPanel').find('[name="company"]').val().trim();
        var url = $('#lfb_accountInfosPanel').find('[name="url"]').val().trim();
        var address = $('#lfb_accountInfosPanel').find('[name="address"]').val().trim();
        var city = $('#lfb_accountInfosPanel').find('[name="city"]').val().trim();
        var state = $('#lfb_accountInfosPanel').find('[name="state"]').val().trim();
        var country = $('#lfb_accountInfosPanel').find('[name="country"]').val().trim();
        var zip = $('#lfb_accountInfosPanel').find('[name="zip"]').val().trim();

        if (saveTimer) {
            clearTimeout(saveTimer);
        }
        $('#lfb_accountInfosPanel').find('.has-error').removeClass('has-error');
        var firstErrorElement = false;
        if (!checkEmail(email)) {
            error = true;
            $('#lfb_accountInfosPanel').find('[name="email"]').closest('.form-group').addClass('has-error');
            firstErrorElement = $('#lfb_accountInfosPanel').find('[name="email"]');

        }
        if (firstName.length < 3) {
            error = true;
            $('#lfb_accountInfosPanel').find('[name="firstName"]').closest('.form-group').addClass('has-error');
            if (!firstErrorElement) {
                firstErrorElement = $('#lfb_accountInfosPanel').find('[name="firstName"]');
            }
        }
        if (lastName.length < 3) {
            error = true;
            $('#lfb_accountInfosPanel').find('[name="lastName"]').closest('.form-group').addClass('has-error');
            if (!firstErrorElement) {
                firstErrorElement = $('#lfb_accountInfosPanel').find('[name="lastName"]');
            }
        }
        if (!error) {
            $('#lfb_custAccountPanel a[data-action="saveCustomerInfos"] span.fas').removeClass('fa-save').addClass('fa-spinner');
            jQuery.ajax({
                url: lfb_dataCust.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_saveCustomerInfos',
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    phoneJob: phoneJob,
                    job: job,
                    company: company,
                    url: url,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip
                },
                success: function (rep) {
                    $('#lfb_custAccountPanel a[data-action="saveCustomerInfos"] span.fas').removeClass('fa-spinner').addClass('fa-check');
                    saveTimer = setTimeout(function () {
                        $('#lfb_custAccountPanel a[data-action="saveCustomerInfos"] span.fas').removeClass('fa-check').addClass('fa-save');
                    }, 2000);
                }
            });
        } else {
            jQuery('body,html').animate({
                scrollTop: firstErrorElement.offset().top - 80
            }, 250);
        }
    }

    function confirmDeleteCustomerData() {
        jQuery.ajax({
            url: lfb_dataCust.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_confirmDeleteData'
            },
            success: function (rep) {
                jQuery('#lfb_delDataForm a.btn').hide();
                jQuery('#lfb_delDataForm').find('.alert').html('<p style="text-align: center;" class="lfb_text-mainColor">' + lfb_dataCust.txtCustomersDataModifyValidConfirm + '</p>');
            }
        });
    }

    function downloadCustomerData() {
        jQuery.ajax({
            url: lfb_dataCust.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_downloadDataMan'
            },
            success: function (rep) {
                rep = rep.trim();
                var w = window.open("");
                w.document.write(rep.replace(/\\\\n/g, '\n'));
                w.focus();
            }
        });
    }

    function leaveAccount() {
        jQuery.ajax({
            url: lfb_dataCust.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_manSignOut'
            },
            success: function (rep) {
                document.location.href = document.location.href;
            }
        });
    }
})(jQuery);
