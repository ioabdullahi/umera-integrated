(function($) {
    "use strict";

    var lfb_lastStepID = 0;
    var lfb_lastSteps = new Array();
    var lfb_plannedSteps;
    var lfb_gmapMatrixService = false;
    var lfb_tld_selectionMode = false;
    var lfb_calendars = new Array();
    var lfb_stripe;
    var lfb_mapStyles = new Array();

    lfb_initMapStyles();

    $(document).ready(function() {

        initComboBox();
        lfb_initDocReady();

        $('body').on('lfb_initDocReady', function(e) {
            lfb_initDocReady();
        });
        $('body').on('lfb_initWinReady', function(e) {
            lfb_initWinReady();
        });
        $('body').on('lfb_resize', function(e) {
            lfb_onResize();
        });
        if ($('#lfb_signature').length > 0) {
            document.addEventListener("touchstart", touchHandler, true);
            document.addEventListener("touchmove", touchHandler, true);
            document.addEventListener("touchend", touchHandler, true);
            document.addEventListener("touchcancel", touchHandler, true);
        }
    });
    $(window).on('load', function() {
        lfb_initWinReady();
    });

    function touchHandler(event) {
        var touch = event.changedTouches[0];

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
                touchstart: "mousedown",
                touchmove: "mousemove",
                touchend: "mouseup"
            }[event.type], true, true, window, 1,
            touch.screenX, touch.screenY,
            touch.clientX, touch.clientY, false,
            false, false, false, 0, null);

        touch.target.dispatchEvent(simulatedEvent);
    }

    function initComboBox() {
        $.widget("custom.combobox", {
            _create: function() {
                this.wrapper = $("<span>")
                    .addClass("custom-combobox lfb_comboboxContainer")
                    .insertAfter(this.element);

                this.element.hide();
                this._createAutocomplete();
                this._createShowAllButton();
            },

            _createAutocomplete: function() {
                var selected = this.element.children(":selected"),
                    value = selected.val() ? selected.text() : "";

                this.input = $("<input>")
                    .appendTo(this.wrapper)
                    .val(value)
                    .attr("title", "")
                    .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left form-control")
                    .autocomplete({
                        classes: {
                            "ui-autocomplete": "lfb_dropdownAutocompleteMenu"
                        },
                        delay: 0,
                        minLength: 0,
                        appendTo: $('#lfb_form'),
                        source: this._source.bind(this),
                        change: function(event, ui) {
                            $(this).closest('.lfb_itemBloc').find('select').trigger('change');
                        },
                        select: function(event, ui) {
                            $(this).closest('.lfb_itemBloc').find('select').trigger('change');
                        },
                        open: function(event, ui) {
                            $('.lfb_dropdownAutocompleteMenu').css({
                                width: $(this).outerWidth(),
                            });
                            $(this).closest('.lfb_itemBloc').find('.fa-solid').addClass('fa-caret-up');
                            $(this).closest('.lfb_itemBloc').find('.fa-solid').removeClass('fa-caret-down');
                        },
                        close: function(event, ui) {
                            $(this).closest('.lfb_itemBloc').find('.fa-solid').removeClass('fa-caret-up');
                            $(this).closest('.lfb_itemBloc').find('.fa-solid').addClass('fa-caret-down');
                        }
                    });

                this._on(this.input, {
                    autocompleteselect: function(event, ui) {
                        ui.item.option.selected = true;
                        this._trigger("select", event, {
                            item: ui.item.option
                        });
                    },

                    autocompletechange: "_removeIfInvalid"
                });
            },

            _createShowAllButton: function() {
                var input = this.input,
                    wasOpen = false;
                $("<a>")
                    .attr("tabIndex", -1)
                    .attr("title", "Show All Items")
                    .appendTo(this.wrapper)
                    .append('<i class="fa-solid fa-caret-down"></i>')
                    .removeClass("ui-corner-all")
                    .addClass("custom-combobox-toggle ui-corner-right lfb_dropdownAutocompleteBtn")
                    .on("mousedown", function() {
                        wasOpen = input.autocomplete("widget").is(":visible");
                    })
                    .on("click", function() {
                        input.trigger("focus");
                        if (wasOpen) {
                            return;
                        }
                        input.autocomplete("search", "");
                    });
            },

            _source: function(request, response) {
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response(this.element.children("option").map(function() {
                    var text = $(this).text();
                    if (this.value && (!request.term || matcher.test(text)))
                        return {
                            label: text,
                            value: text,
                            option: this
                        };
                }));
            },

            _removeIfInvalid: function(event, ui) {
                if (ui.item) {
                    return;
                }
                var value = this.input.val(),
                    valueLowerCase = value.toLowerCase(),
                    valid = false;
                this.element.children("option").each(function() {
                    if ($(this).text().toLowerCase() === valueLowerCase) {
                        this.selected = valid = true;
                        return false;
                    }
                });
                if (valid) {
                    return;
                }
                this.input
                    .val("")
                    .attr("title", value + " didn't match any item");
                this.element.val("");
                this.input.autocomplete("instance").term = "";
            },

            _destroy: function() {
                this.wrapper.remove();
                this.element.show();
            }
        });

        $("#lfb_form .lfb_combobox").combobox();
    }

    function lfb_initDocReady() {

        $('.lfb_dynamicHide').hide().removeClass('lfb_dynamicHide');
        if ($('#lfb_form').length > 0) {
            if (document.location.href.indexOf('lfb_action=preview') > -1) {
                $('#lfb_form:not(.lfb_fullscreen)').remove();
            }
            initFlatUI();
            window.Dropzone.autoDiscover = false;
            lfb_initForms();
            jQuery.each(lfb_forms, function() {
                var form = this;
                lfb_checkItems(form.formID);
                lfb_initListeners(form.formID);
            });
        }
    }

    function lfb_initWinReady() {
        if ($('#lfb_form').length > 0) {
            lfb_onResize();
            $(window).resize(lfb_onResize);

            $(window).on("popstate", function(e) {
                if (e.originalEvent.state !== null) {
                    e.preventDefault();
                    lfb_previousStep(lfb_forms[0].formID);
                }
            });

        }
        $(document).on('scroll', function() {
            $('#lfb_form .lfb_datepicker').trigger('blur');
        });
        $('body,html,#lfb_form').on('scroll', function() {
            $('#lfb_form .lfb_datepicker').trigger('blur');
        });
        $('#ajax-loading-screen').fadeOut();
        $('#ajax-content-wrap >.container-wrap').css({
            opacity: 1,
            display: 'block'
        });
        $('#lfb_form').on('lfb_getForm', function(e, formID) {
            return lfb_getForm(formID);
        });
        $('#lfb_form').on('lfb_updatePrice', function(e, formID) {
            lfb_updatePrice(formID);
        });
        $('#lfb_form').on('lfb_order', function(e, formID) {
            lfb_order(formID);
        });
        $('#lfb_form').on('lfb_nextStep', function(e, formID) {
            lfb_nextStep(formID);
        });
        $('#lfb_form').on('lfb_checkStepItemsValid', function(e, stepID, formID) {
            return lfb_checkStepItemsValid(stepID, formID);
        });

        $('#lfb_form').on('lfb_changeStep', function(e, stepID, formID) {
            lfb_changeStep(stepID, formID);
        });
        $('#lfb_form').on('lfb_getUrlVariablesByFormID', function(e, formID) {
            return lfb_getUrlVariablesByFormID(formID);
        });
        $('#lfb_form').on('lfb_itemClick', function(e, $item, action, formID) {
            lfb_itemClick($($item), action, formID);
        });
        $('#lfb_form').on('lfb_getVariableByID', function(e, formID, variableID) {
            const form = lfb_getForm(formID);
            return lfb_getVariableByID(form, variableID);
        });
        $('#lfb_form').on('lfb_setVariableByID', function(e, formID, variableID, value) {
            const form = lfb_getForm(formID);
            var variable = lfb_getVariableByID(form, variableID);
            if (variable) {
                variable.value = value;
            }
        });


        $('#lfb_form canvas.img').each(function() {

            $(this).parent().children('img').css('opacity', 0);
            $(this).parent().children('img').show();
            $(this).css({
                width: $(this).parent().children('img').get(0).width,
                height: $(this).parent().children('img').get(0).height
            });
            $(this).parent().children('img').hide();

        });
        jQuery.each(lfb_forms, function() {
            var form = this;
            if (form.useCaptcha == 1 && form.recaptcha3Key != '') {
                if ($('.grecaptcha-badge').length > 0 && $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .grecaptcha-badge').length == 0) {
                    var captchaImg = $('.grecaptcha-badge').clone();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .lfb_genContentSlide').append(captchaImg);
                }
            }

        });

    }

    function lfb_initMapStyles() {
        lfb_mapStyles.push({ name: 'default', styles: [] });
        lfb_mapStyles.push({
            name: 'aubergine',
            styles: [{
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#1d2c4d"
                    }]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#8ec3b9"
                    }]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#1a3646"
                    }]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#4b6878"
                    }]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#64779e"
                    }]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#4b6878"
                    }]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#334e87"
                    }]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#023e58"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#283d6a"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#6f9ba5"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#1d2c4d"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#023e58"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#3C7680"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#304a7d"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#98a5be"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#1d2c4d"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#2c6675"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#255763"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#b0d5ce"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#023e58"
                    }]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#98a5be"
                    }]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#1d2c4d"
                    }]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#283d6a"
                    }]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#3a4762"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#0e1626"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#4e6d70"
                    }]
                }
            ]
        });
        lfb_mapStyles.push({
            name: 'retro',
            styles: [{
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#ebe3cd"
                    }]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#523735"
                    }]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#f5f1e6"
                    }]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#c9b2a6"
                    }]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#dcd2be"
                    }]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#ae9e90"
                    }]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#dfd2ae"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#dfd2ae"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#93817c"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#a5b076"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#447530"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f5f1e6"
                    }]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#fdfcf8"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f8c967"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#e9bc62"
                    }]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#e98d58"
                    }]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#db8555"
                    }]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#806b63"
                    }]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#dfd2ae"
                    }]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#8f7d77"
                    }]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#ebe3cd"
                    }]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#dfd2ae"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#b9d3c2"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#92998d"
                    }]
                }
            ]
        });
        lfb_mapStyles.push({
            name: 'night',
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }],
                },
                {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#2f3948" }],
                },
                {
                    featureType: "transit.station",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }],
                },
            ]
        });
    }

    function lfb_clearFixedElements() {
        $('*:not(#lfb_bootstraped)').each(function() {
            if ($(this).closest('#lfb_bootstraped').length == 0 && $(this).css('position') != 'static') {
                $(this).css('position', 'static');
            }
            if ($(this).closest('#lfb_bootstraped').length == 0) {
                $(this).css('will-change', 'unset');
            }
        });
    }

    function lfb_getForm(formID) {
        var rep = false;
        for (var i = 0; i < lfb_forms.length; i++) {
            if (lfb_forms[i].formID == formID) {
                rep = lfb_forms[i];
                break;
            }
        }
        return rep;
    }

    function lfb_onResize() {
        $('#lfb_form.lfb_fullscreen:not(.lfb_visualEditing)').css({
            minHeight: $(window).height()
        });

        if ($(window).width() <= 768) {
            var stepDesHeight = 0;

            $('#lfb_form .lfb_stepDescription').each(function() {
                $(this).css({
                    top: $(this).closest('.lfb_genSlide').find('.lfb_stepTitle').height() + 48
                });
            });
            $('#lfb_form .lfb_genContent ').each(function() {
                var stepDesHeight = 0;
                if ($(this).closest('.lfb_genSlide').find('.lfb_stepDescription').length > 0) {
                    stepDesHeight = lfb_zeroIfNan($(this).closest('.lfb_genSlide').find('.lfb_stepDescription').height());
                }
                $(this).css({
                    paddingTop: $(this).closest('.lfb_genSlide').find('.lfb_stepTitle').height() + stepDesHeight + 90
                });
            });
        } else {
            $('#lfb_form .lfb_stepDescription').each(function() {
                $(this).css({
                    top: $(this).closest('.lfb_genSlide').find('.lfb_stepTitle').height() + 28
                });
            });
            $('#lfb_form .lfb_genContent ').each(function() {
                var stepDesHeight = 0;
                if ($(this).closest('.lfb_genSlide').find('.lfb_stepDescription').length > 0) {
                    stepDesHeight = lfb_zeroIfNan($(this).closest('.lfb_genSlide').find('.lfb_stepDescription').height());
                }
                $(this).css({
                    paddingTop: $(this).closest('.lfb_genSlide').find('.lfb_stepTitle').height() + stepDesHeight + 70
                });
            });
        }
    }

    function lfb_updatePlannedSteps(formID) {
        var startStepID = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_mainPanel .lfb_genSlide[data-start="1"]').attr('data-stepid'));
        lfb_plannedSteps = new Array();
        lfb_plannedSteps.push(startStepID);
        lfb_plannedSteps = lfb_scanPlannedSteps(startStepID, formID);
    }

    function lfb_scanPlannedSteps(stepID, formID) {
        var plannedSteps = new Array();
        var potentialSteps = lfb_findPotentialsSteps(stepID, formID);
        if (potentialSteps.length > 0 && potentialSteps[0] != 'final') {
            lfb_plannedSteps.push(potentialSteps[0]);
            lfb_scanPlannedSteps(potentialSteps[0], formID);
        } else {
            return lfb_plannedSteps;
        }
        return lfb_plannedSteps;
    }

    function lfb_getStepQuantities(formID, stepID, itemID) {
        var form = lfb_getForm(formID);
        var quantities = 0;
        if (jQuery.inArray(parseInt(stepID), lfb_lastSteps) > -1 || stepID == form.step) {

            var formContent = lfb_getFormContent(formID, true, stepID);
            var items = formContent[2];
            jQuery.each(items, function() {
                if (this.itemid != itemID && this.type != 'row' && this.type != 'column') {
                    var item = this;
                    if (isNaN(item.quantity)) {
                        quantities++;
                    } else {
                        quantities += parseInt(item.quantity);
                    }
                }
            });
        }
        return quantities;
    }

    function lfb_getTotalQuantities(formID, stepID, itemID) {
        var form = lfb_getForm(formID);
        var formContent = lfb_getFormContent(formID, true);
        var items = formContent[2];
        var quantities = 0;

        var mustChkPosition = true;
        if (isNaN(stepID) || stepID == 0) {
            mustChkPosition = false;
        }
        var chkStep = false;

        jQuery.each(items, function() {
            if (this.itemid != itemID) {
                var item = this;
                if (mustChkPosition && !chkStep && item.stepid == stepID) {
                    chkStep = true;
                }
                if (!chkStep || item.stepid == stepID) {
                    if (isNaN(item.quantity)) {
                        quantities++;
                    } else {
                        quantities += parseInt(item.quantity);
                    }
                }
            }
        });
        return quantities;
    }

    function lfb_itemClick($item, action, formID) {
        var form = lfb_getForm(formID);
        var chkGrpReq = false;
        var $this = $item;
        var isChecked = false;


        if (action) {
            $('#lfb_form[data-form="' + form.formID + '"] .quantityBtns').removeClass('open');
            $('#lfb_form[data-form="' + form.formID + '"] .quantityBtns').fadeOut(250);
            var deviceAgent = navigator.userAgent.toLowerCase();
            var agentID = deviceAgent.match(/(iPad|iPhone|iPod)/i);
            if (agentID) {
                $('body :not(.ui-slider-handle) > .tooltip').remove();
                $('body > .tooltip').remove();
                $('#lfb_form[data-form="' + form.formID + '"] > .tooltip').remove();
            }

        }
        if (action) {
            $this.addClass('action');
        }
        if ((action) || (!$this.is('.action'))) {
            if (form.imgIconStyle != 'zoom') {

                $this.find('span.icon_select').animate({
                    bottom: 160,
                    opacity: 0
                }, 200);
            }
            if ($this.is('.checked')) {
                if ((action) && ($this.data('required'))) {} else {
                    if (form.imgIconStyle == 'zoom') {
                        $this.delay(200).css('transition-delay', '0.2s');
                        $this.find('span.icon_select').css('transition-delay', '0s');
                    } else {
                        $this.css('transition-delay', '0s');
                    }
                    var unChkDelay = 220;
                    if (form.imgIconStyle == 'zoom') {
                        unChkDelay = 0;
                    }
                    $this.delay(unChkDelay).removeClass('checked');
                    if (form.imgIconStyle != 'zoom') {
                        $this.delay(220).find('span.icon_select').removeClass('fa-check').addClass('fa-times');
                    } else {
                        $this.find('span.icon_select').css('transition-delay', '0s');
                    }
                    $this.delay(400).css('transition-delay', '0s');
                    $this.find('.icon_quantity').delay(300).fadeOut(200);

                }
            } else {
                $this.css('transition-delay', '0s');
                if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                    if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {
                        $item.tooltip('show');
                    }
                }
                isChecked = true;
                if (form.imgIconStyle == 'zoom') {
                    $this.find('span.icon_select').css('transition-delay', '.5s');
                }
                if (!$this.is('[type="checkbox"][data-checkboxstyle="checkbox"]')) {
                    $this.delay(220).addClass('checked');
                }
                if (form.imgIconStyle != 'zoom') {
                    $this.delay(220).find('span.icon_select').removeClass('fa-times').addClass('fa-check');
                }
                if ($this.find('.quantityBtns').length > 0 && !$this.is('[data-distanceqt]')) {
                    $this.find('.icon_quantity').delay(300).fadeIn(200);
                    $this.find('.quantityBtns').delay(500).addClass('open');
                    $this.find('.quantityBtns').delay(500).fadeIn('200');

                    if ($item.find('.lfb_sliderQt').length > 0) {
                        setTimeout(function() {
                            lfb_updatePrice(form.formID, $item.attr('data-itemid'));
                        }, 50);
                    }
                }
                if ($this.data('urltarget') && $this.data('urltarget') != "") {
                    var method = $this.data('urltargetmode');
                    if (method != '_self' && method != '_blank') {
                        method = '_blank';
                    }
                    var win = window.open($this.data('urltarget'), method);
                    if (typeof(win) !== 'null' && win != null) {
                        win.focus();
                    }
                }
            }
            if (form.imgIconStyle != 'zoom') {
                $this.find('span.icon_select').delay(300).animate({
                    bottom: 0,
                    opacity: 1
                }, 200);
            };
            if ((action) && ($this.data('group'))) {
                $this.closest('.lfb_genSlide').find('div.lfb_selectable.checked[data-group="' + $this.data('group') + '"]:not([data-itemid="' + $this.attr('data-itemid') + '"])').each(function() {
                    lfb_itemClick($(this), false, formID);
                    $(this).removeClass('checked');
                });
                $this.closest('.lfb_genSlide').find('input[type=checkbox][data-group="' + $this.data('group') + '"]:checked:not([data-itemid="' + $this.attr('data-itemid') + '"])').trigger('click.auto');


                $this.closest('.lfb_genSlide').find('a.lfb_button.checked[data-group="' + $this.data('group') + '"]:not([data-itemid="' + $this.attr('data-itemid') + '"])').each(function() {

                    lfb_itemClick($(this), false, formID);
                    $(this).removeClass('checked');
                });
                if (form.groupAutoClick == '1' && $this.is('.checked') && $this.closest('.lfb_genSlide').is('[data-required=true]')) {
                    setTimeout(function() {
                        if ($this.closest('.lfb_genSlide').find('[data-itemid]').not('[data-itemtype="separator"]').not('.lfb_richtext').not('[data-group="' + $this.data('group') + '"]').not('.lfb_disabled').length == 0 &&
                            $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .quantityBtns').length == 0 && $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .lfb_qtfield').length == 0) {
                            lfb_nextStep(form.formID);
                        }
                    }, 500);
                }
            }

            setTimeout(function() {
                lfb_updatePrice(formID);
                $this.removeClass('action');
            }, 420);
        }

        setTimeout(function() {
            if ($this.is('[data-usedistance="true"]')) {
                lfb_removeDistanceError($this.attr('data-itemid'), formID);
            }
        }, 200);
    }

    function lfb_nl2br(str, is_xhtml) {
        str = str.replace(/\n\n/g, '\n');
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }

    function lfb_findGetParameter(parameterName) {
        var result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function(item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }

    function lfb_initForms() {
        jQuery.each(lfb_forms, function() {
            var form = this;
            form.price = 0;
            form.priceSingle = 0;
            form.priceMax = 0;
            form.step = 0;
            form.gFormDesignCheck = 0;
            form.timer_gFormSubmit = null;
            form.timer_gFormDesign = null;
            form.animationsSpeed *= 1000;
            form.reductionResult = 0;
            form.reduction = 0;
            form.discountCode = "";
            form.discountCodeDisplayed = false;
            form.initialPrice = parseFloat(form.initialPrice);
            form.contactSent = 0;
            form.gravitySent = false;
            form.shineFxIndex = 0;
            form.subscriptionText = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').html();
            form.richtextsContent = new Array();
            form.emailSent = false;
            form.autoStart = false;
            form.urlVariables = '';
            form.useRazorpay = false;
            form.razorpayReady = false;
            form.stripeToken = '';
            form.itemsData = new Array();
            form.signature = false;
            $('#lfb_form[data-form="' + form.formID + '"]').data('lfb_form', form);

            lfb_initVerificationCodeModal(form);

            setTimeout(function(){
            $('#lfb_form[data-form="' + form.formID + '"] [data-toggle="tooltip"][data-tooltiptext]:not([title])').each(function() {
                $(this).attr('title', $(this).attr('data-tooltiptext'));
            });
        },400);

            var darkBgColor = false;

            if (form.stepsColorBackground) {
                var c = form.stepsColorBackground.substring(1);
                var rgb = parseInt(c, 16);
                var r = (rgb >> 16) & 0xff;
                var g = (rgb >> 8) & 0xff;
                var b = (rgb >> 0) & 0xff;
                var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                if (luma < 40) {
                    darkBgColor = true;
                }
            }
            if (darkBgColor) {
                $('#lfb_form[data-form="' + form.formID + '"]').addClass('lfb_darkStepBg');
            }

            if ($('#lfb_form[data-form="' + form.formID + '"] #lfb_btnStart').length > 0) {
                $('#lfb_form[data-form="' + form.formID + '"] #lfb_btnStart').on('click', function() {
                    lfb_startFormIntro(form.formID);
                });
            }

            if ($('#lfb_form[data-form="' + form.formID + '"] #lfb_couponBtn').length > 0) {
                $('#lfb_form[data-form="' + form.formID + '"] #lfb_couponBtn').on('click', function() {
                    lfb_applyCouponCode(form.formID);
                });
            }
            if ($('#lfb_form[data-form="' + form.formID + '"] a.lfb_btnSaveForm').length > 0) {
                $('#lfb_form[data-form="' + form.formID + '"] a.lfb_btnSaveForm').on('click', function() {
                    lfb_saveForLater(form.formID);
                });
            }
            if ($('#lfb_form[data-form="' + form.formID + '"] a.lfb_btnFloatingSummary').length > 0) {
                $('#lfb_form[data-form="' + form.formID + '"] a.lfb_btnFloatingSummary').on('click', function() {
                    lfb_toggleFloatingSummary(form.formID);
                });
            }


            if ($('#lfb_form[data-form="' + form.formID + '"]').is('.lfb_visualEditing')) {
                lfb_clearFixedElements();
            }

            if ($('#lfb_form[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                $('#lfb_form[data-form="' + form.formID + '"]').closest('#lfb_bootstraped').parents().css({ position: 'static', display: 'block' });
            }

            if (form.useSignature == 1) {
                form.signature = $('#lfb_form[data-form="' + form.formID + '"] #lfb_signature').signature({
                    thickness: 4,
                    guideline: false,
                    guidelineOffset: 26,
                    background: '#fff'
                });
                $('#lfb_form[data-form="' + form.formID + '"] #lfb_resetSignature').on('click', function() {
                    form.signature.signature('clear');
                });
                setTimeout(function() {
                    $('#lfb_form[data-form="' + form.formID + '"] #lfb_signature canvas').attr('width', $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_signature').width());
                    $('#lfb_form[data-form="' + form.formID + '"] #lfb_signature canvas').css('width', $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_signature').width());
                }, 500);

            }
            for (var i = 0; i < form.variables.length; i++) {
                form.variables[i].value = form.variables.defaultValue;
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').on('click', function() {
                lfb_showWinStripePayment(form);
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_richtext[data-itemid]').each(function() {
                form.richtextsContent[$(this).attr('data-itemid').toString()] = $(this).html();
            });
            setTimeout(() => {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-prefill]').each(function() {
                    if ($(this).attr('data-prefill').length > 0) {
                        var value = lfb_findGetParameter($(this).attr('data-prefill'));
                        if (value !== null) {
                            $(this).val(value).trigger('change');
                        }
                    }
                });
            }, 200);




            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-tooltiptext][data-tooltipimg!=""]').each(function() {
                $(this).attr('data-tooltiptext', $(this).attr('data-tooltiptext') + "<br/><img src='" + $(this).attr('data-tooltipimg') + "' alt='" + $(this).attr('data-tooltiptext') + "'/>");
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-type="numberfield"]:not([value])').each(function() {
                var min = 0;
                if ($(this).is('[min]')) {
                    min = parseInt($(this).attr('min'));
                }
                $(this).val(min);
            });
            var formID = form.formID;
            if (form.save_to_cart == 1) {
                form.save_to_cart = true;
            } else {
                form.save_to_cart = false;
            }
            if (form.save_to_cart_edd == 1) {
                form.save_to_cart_edd = true;
            } else {
                form.save_to_cart_edd = false;
            }

            if (form.gravityFormID > 0) {
                jQuery.ajax({
                    url: form.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'get_currentRef',
                        formID: formID
                    },
                    success: function(currentRef) {
                        form.current_ref = currentRef;
                    }
                });
            }

            var calendarsToCheck = new Array();
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_mainPanel .lfb_genSlide .lfb_timepicker').each(function() {
                $(this).timepicker({
                    showMeridian: parseInt(form.timeModeAM),
                    appendWidgetTo: '#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]'
                });
                $(this).on('click', function() {
                    $(this).timepicker('showWidget');
                });
                $(this).timepicker().on('changeTime.timepicker', function(e) {
                    var minTime = $(this).attr('data-mintime');
                    var maxTime = $(this).attr('data-maxtime');
                    if (minTime != "" && minTime.indexOf(':') > 0) {
                        var minHour = parseInt(minTime.substr(0, minTime.indexOf(':')));
                        var minMins = parseInt(minTime.substr(minTime.indexOf(':') + 1, 2));
                        if (minTime.indexOf('PM') > 0 && minHour != 12) {
                            minHour += 12;
                        }
                        var hours = e.time.hours;
                        if (e.time.meridian == "PM") {
                            hours += 12;
                        }
                        if (hours < minHour || (hours == minHour && e.time.minutes < minMins)) {
                            $(this).val('');
                        }
                    }
                    if (maxTime != "" && maxTime.indexOf(':') > 0) {
                        var maxHour = parseInt(maxTime.substr(0, maxTime.indexOf(':')));
                        var maxMins = parseInt(maxTime.substr(maxTime.indexOf(':') + 1, 2));
                        if (maxTime.indexOf('PM') > 0 && maxHour != 12) {
                            maxHour += 12;
                        }
                        var hours = e.time.hours;
                        if (e.time.meridian == "PM") {
                            hours += 12;
                        }
                        if (hours > maxHour || (hours == maxHour && e.time.minutes > maxMins)) {
                            $(this).val('');
                        }
                    }
                });
            });
            var dateFormat = lfb_forms[0].dateFormat;
            dateFormat = dateFormat.replace(/\\\//g, "/");
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_mainPanel .lfb_genSlide .lfb_datepicker:not(.lfb_datepickerReady)').each(function() {
                var minDate = new Date();
                $(this).addClass('lfb_datepickerReady');
                if ($(this).is('[data-allowpast="1"]') || $(this).is('[data-datetype="time"]')) {
                    minDate = null;
                } else if ($(this).is('[data-allowpast="0"]') && parseInt($(this).attr('data-startdays')) > 0) {
                    var nbDays = parseInt($(this).attr('data-startdays'));
                    minDate.setDate(minDate.getDate() + nbDays);
                }
                var maxView = '';
                var daysWeekDisabled = new Array();
                if ($(this).is('[data-daysweek]') && $(this).attr('data-daysweek') != '') {
                    jQuery.each($(this).attr('data-daysweek').split(','), function() {
                        daysWeekDisabled.push(parseInt(this));
                    });
                }
                var datepickerData = {
                    daysOfWeekDisabled: daysWeekDisabled,
                    language: form.datePickerLanguage,
                    fontAwesome: true,
                    timeZone: '',
                    startDate: minDate,
                    showMeridian: parseInt(form.timeModeAM),
                    container: '.lfb_itemContainer_' + $(this).attr('data-itemid')
                };
                var dateType = $(this).attr('data-datetype');
                if (dateType == 'date') {
                    datepickerData.format = dateFormat;
                    datepickerData.minView = 2;
                    if (minDate) {
                        minDate.setHours(0);
                        minDate.setMinutes(0);
                    }
                    $(this).attr('data-disableminutes', '0');
                } else if (dateType == 'time') {
                    if (parseInt(form.timeModeAM) == 1) {
                        datepickerData.format = 'H:ii P';
                    } else {
                        datepickerData.format = 'hh:ii';
                    }
                    datepickerData.startView = 1;
                    if ($(this).is('[data-disableminutes="1"]')) {
                        datepickerData.minView = 1;
                        if (minDate) {
                            minDate.setMinutes(0);
                        }
                    }
                } else {
                    if (parseInt(form.timeModeAM) == 1) {
                        datepickerData.format = dateFormat + ' H:ii P';
                    } else {
                        datepickerData.format = dateFormat + ' hh:ii';
                    }
                    if ($(this).is('[data-disableminutes="1"]')) {
                        datepickerData.minView = 1;
                    }
                }

                $(this).datetimepicker(datepickerData)
                    .on('show', function(ev) {
                        $(this).data('lastdate', $(this).val());
                        $(this).val('');
                    }).on('hide', function(ev) {
                        if ($(this).val() == '' && $(this).data('lastdate') != '') {
                            $(this).val($(this).data('lastdate'));
                        }
                    }).on('changeDay', function(ev) {
                        $(this).val('');
                        var day = moment.utc(ev.date).format('YYYY-MM-DD');
                        var eventDuration = $(this).attr('data-eventduration');
                        var eventDurationType = $(this).attr('data-eventdurationtype');
                        var disabledHours = lfb_getDisabledHours($(this).attr('data-calendarid'), day, eventDuration, eventDurationType);

                        var dayWeek = ev.date.getDay();
                        if ($(this).attr('data-daysweek').indexOf(dayWeek.toString()) > -1) {
                            disabledHours = new Array();
                            for (var i = 0; i < 24; i++) {
                                disabledHours.push(parseInt(i));
                            }
                        }
                        $(this).data('date', day);
                        $(this).datetimepicker('setHoursDisabled', disabledHours);
                        $(this).addClass('checked');

                        var form = lfb_getForm($(this).closest('#lfb_form').attr('data-form'));

                        if ($(this).is('[data-datetype="date"]') && form.autocloseDatepicker == '1') {
                            var $this = $(this);
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  .datetimepicker').hide();

                            if (form.groupAutoClick == '1' && $this.closest('.lfb_genSlide').is('[data-required=true]')) {
                                setTimeout(function() {
                                    if ($this.closest('.lfb_genSlide').find('[data-itemid]').not('[data-itemid="' + $this.attr('data-itemid') + '"]').not('[data-itemtype="separator"]').not('.lfb_richtext').not('[data-group="' + $this.data('group') + '"]').not('.lfb_disabled').length == 0 &&
                                        $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .quantityBtns').length == 0 && $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .lfb_qtfield').length == 0) {
                                        lfb_nextStep(form.formID);
                                    }
                                }, 500);
                            }
                        }

                    })
                    .on('changeMinute', function(ev) {
                        var $this = $(this);
                        $(this).addClass('checked');
                        if (form.autocloseDatepicker == 1) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  .datetimepicker').hide();

                            if (form.groupAutoClick == '1' && $this.closest('.lfb_genSlide').is('[data-required=true]')) {
                                setTimeout(function() {
                                    if ($this.closest('.lfb_genSlide').find('[data-itemid]').not('[data-itemid="' + $this.attr('data-itemid') + '"]').not('[data-itemtype="separator"]').not('.lfb_richtext').not('[data-group="' + $this.data('group') + '"]').not('.lfb_disabled').length == 0 &&
                                        $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .quantityBtns').length == 0 && $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .lfb_qtfield').length == 0) {
                                        lfb_nextStep(form.formID);
                                    }
                                }, 500);
                            }
                        }
                    })
                    .on('changeHour', function(ev) {
                        var $this = $(this);

                        $(this).addClass('checked');
                        if ($(this).is('[data-datetype="dateTime"]') && form.autocloseDatepicker == '1' && $(this).is('[data-disableminutes="1"]')) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  .datetimepicker').hide();

                            if (form.groupAutoClick == '1' && $this.closest('.lfb_genSlide').is('[data-required=true]')) {
                                setTimeout(function() {
                                    if ($this.closest('.lfb_genSlide').find('[data-itemid]').not('[data-itemid="' + $this.attr('data-itemid') + '"]').not('[data-itemtype="separator"]').not('.lfb_richtext').not('[data-group="' + $this.data('group') + '"]').not('.lfb_disabled').length == 0 &&
                                        $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .quantityBtns').length == 0 && $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .lfb_qtfield').length == 0) {
                                        lfb_nextStep(form.formID);
                                    }
                                }, 500);
                            }
                        }
                        if ($(this).is('[data-datetype="time"]') && $(this).is('[data-disableminutes="1"]')) {
                            var date = moment(ev.date).utc();
                            date.subtract(moment(ev.date).minutes(), 'minutes');
                            var datepicker = this;
                            setTimeout(function() {
                                $(datepicker).datetimepicker('setDate', new Date(date.format('YYYY-MM-DD HH:00')));
                            }, 1);

                            if (form.autocloseDatepicker == 1) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  .datetimepicker').hide();

                                if (form.groupAutoClick == '1' && $this.closest('.lfb_genSlide').is('[data-required=true]')) {
                                    setTimeout(function() {
                                        if ($this.closest('.lfb_genSlide').find('[data-itemid]').not('[data-itemid="' + $this.attr('data-itemid') + '"]').not('[data-itemtype="separator"]').not('.lfb_richtext').not('[data-group="' + $this.data('group') + '"]').not('.lfb_disabled').length == 0 &&
                                            $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .quantityBtns').length == 0 && $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .lfb_qtfield').length == 0) {
                                            lfb_nextStep(form.formID);
                                        }
                                    }, 500);
                                }
                            }
                        } else {
                            var day = moment.utc(ev.date).format('YYYY-MM-DD');
                            var hour = moment.utc(ev.date).format('HH');
                            var eventDuration = $(this).attr('data-eventduration');
                            var eventDurationType = $(this).attr('data-eventdurationtype');
                            var disabledMinutes = lfb_getDisabledMinutes($(this).attr('data-calendarid'), day, hour, eventDuration, eventDurationType);
                            $(this).data('date', moment.utc(ev.date).format('YYYY-MM-DD HH:00'));
                            if ($(this).is('[data-disableminutes="1"]')) {
                                var newDate = moment.utc(ev.date).format('YYYY-MM-DD HH:00');

                                $(this).data('date', newDate);
                                $(this).addClass('checked');
                                var _this = this;
                                setTimeout(function() {
                                    var date = moment(newDate);
                                    date.subtract(moment(date).minutes(), 'minutes');
                                    $(this).data('date', date.toDate());
                                    $(_this).datetimepicker('setDate', new Date());
                                    $(_this).datetimepicker('setDate', date.toDate());
                                    var postText = '';
                                    if ($(_this).val().indexOf('PM') > $(_this).val().indexOf(':')) {
                                        postText = ' PM';
                                    } else if ($(_this).val().indexOf('AM') > $(_this).val().indexOf(':')) {
                                        postText = ' AM';
                                    }
                                    $(_this).val($(_this).val().split(':')[0] + ':00' + postText);

                                }, 50);
                            }
                            $(this).datetimepicker('setMinutesDisabled', disabledMinutes);


                        }
                    });

                var _this = this;

                $(this).closest('.form-group').next('.datetimepicker').find('.datetimepicker-hours thead tr:first-child th').on('click', function() {
                    var link = this;
                    setTimeout(function() {
                        var datepicker = $(link).closest('.datetimepicker').prev('.form-group').find('.lfb_datepicker');
                        var date = $(_this).datetimepicker('getViewDate');
                        datepicker.val('');
                        var day = moment(date).format('YYYY-MM-DD');
                        var eventDuration = datepicker.attr('data-eventduration');
                        var eventDurationType = datepicker.attr('data-eventdurationtype');
                        var disabledHours = lfb_getDisabledHours(datepicker.attr('data-calendarid'), day, eventDuration, eventDurationType);

                        datepicker.data('date', day);


                        if (datepicker.is('[data-daysweek]') && typeof($(this).attr('data-daysweek')) != 'undefined') {
                            jQuery.each(datepicker.attr('data-daysweek').split(','), function() {
                                if (this == date.getDay()) {
                                    disabledHours = new Array();
                                    for (var i = 0; i < 24; i++) {
                                        disabledHours.push(i);
                                    }
                                }
                            });
                        }
                        datepicker.datetimepicker('setHoursDisabled', disabledHours);

                    }, 10);
                });
                if (dateType == 'date') {
                    $(this).on('show', function() {
                        $('.datetimepicker .table-condensed .prev').show();
                        $('.datetimepicker .table-condensed .switch').show();
                        $('.datetimepicker .table-condensed .next').show();
                    });
                } else if (dateType == 'time') {
                    $(this).on('show', function() {
                        $('.datetimepicker .table-condensed .prev').hide();
                        $('.datetimepicker .table-condensed .switch').hide();
                        $('.datetimepicker .table-condensed .next').hide();
                    });
                } else {
                    $(this).on('show', function() {
                        $('.datetimepicker .table-condensed .prev').show();
                        $('.datetimepicker .table-condensed .switch').show();
                        $('.datetimepicker .table-condensed .next').show();
                    });;
                }
                if ($(this).attr('data-calendarid') != 0 && parseInt($(this).attr('data-calendarid')) > 0) {
                    if (jQuery.inArray($(this).attr('data-calendarid'), calendarsToCheck) == -1) {
                        calendarsToCheck.push($(this).attr('data-calendarid'));
                    }
                }
                if ($(this).attr('placeholder').length == 0 && $(this).val().length == 0) {
                    if ($(this).is('[data-disableminutes="1"]') || $(this).attr('data-calendarid') != '0') {} else {
                        $(this).datetimepicker('setDate', new Date());
                    }
                }
                $(this).on('keypress', function(e) {
                    e.preventDefault();
                });

                if (!$(this).is('[data-mindatepicker="0"]') && !$(this).is('[data-datetype="time"]')) {
                    var originalDatepicker = $(this);
                    var minDatepicker = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-itemid="' + $(this).attr('data-mindatepicker') + '"]');


                    minDatepicker.on('changeDate', function() {
                        var currentDate = moment(originalDatepicker.datetimepicker('getDate')).format('YYYY-MM-DD HH:mm');

                        var day = moment(minDatepicker.datetimepicker('getDate'));
                        var newDay = day.add(parseInt(originalDatepicker.attr('data-startdays')), 'day');

                        newDay = newDay.add(parseInt(minDatepicker.attr('data-eventduration')), minDatepicker.attr('data-eventdurationtype'));

                        if (newDay.format('YYYY-MM-DD HH:mm') > currentDate) {
                            originalDatepicker.datetimepicker('setDate', newDay.toDate());
                        }
                    });
                    originalDatepicker.on('changeDate', function() {
                        var currentDate = moment(originalDatepicker.datetimepicker('getDate')).format('YYYY-MM-DD HH:mm');
                        var day = moment(minDatepicker.datetimepicker('getDate'));
                        var newDay = moment(minDatepicker.datetimepicker('getDate')).add(parseInt(minDatepicker.attr('data-startdays')), 'day');
                        newDay = newDay.add(parseInt(minDatepicker.attr('data-eventduration')), minDatepicker.attr('data-eventdurationtype'));

                        if (newDay.format('YYYY-MM-DD HH:mm') > currentDate) {
                            var newDate = moment(originalDatepicker.datetimepicker('getDate')).subtract(parseInt(originalDatepicker.attr('data-startdays')), 'day');
                            newDate = newDate.subtract(parseInt(minDatepicker.attr('data-eventduration')), minDatepicker.attr('data-eventdurationtype'));
                            minDatepicker.datetimepicker('setDate', newDate.toDate());
                        }
                    });
                }
            });
            if (calendarsToCheck.length > 0) {
                lfb_getBusyDates(form.formID, calendarsToCheck);
            }

            var deviceAgent = navigator.userAgent.toLowerCase();
            var agentID = deviceAgent.match(/(iPad|iPhone|iPod)/i);
            if (agentID) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-flipfx="1"]').removeAttr('data-flipfx');
            }

            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-emaillaststep="1"]')) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .linkPrevious').addClass('lfb-hidden');
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrder').addClass('lfb-hidden');
            }
            if (form.hideFinalbtn == 1) {
                $('#lfb_form[data-form="' + form.formID + '"] #lfb_btnOrder').addClass('lfb-hidden');
            }

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .form-control').on('focus', function() {
                if (form.disableTipMobile == 0 && lfb_is_touch_device()) {
                    $(this).tooltip('show');
                }
            }).on('focusout', function() {
                if (form.disableTipMobile == 0 && lfb_is_touch_device()) {
                    $('#lfb_form :not(.ui-slider-handle) > .tooltip').remove();
                    $('body > .tooltip').remove();
                    $('#lfb_form[data-form="' + form.formID + '"] > .tooltip').remove();
                }
            });

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide .lfb_genContent div.lfb_selectable span.icon_select.lfb_fxZoom').css({
                textShadow: '-2px 0px ' + $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel').css('background-color')
            });
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_popup') && !$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').closest('#lfb_bootstraped').parent().is('body')) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').closest('#lfb_bootstraped').detach().appendTo('body');
            }
            if ($('#lfb_form[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                $('html,body').css('overflow-y', 'hidden');
            }
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').attr('target', '_self');
            }

            if (typeof(google) != 'undefined') {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_gmap').each(function() {
                    $(this).css('height', $(this).attr('data-height'));
                    var $item = $(this);
                    var centerMap = { lat: 0, lng: 0 };
                    var styles = lfb_getMapStyle($(this).attr('data-mapstyle'));

                    var map = new google.maps.Map(document.getElementById('lfb_mapCt_' + $item.attr('data-itemid')), {
                        zoom: parseInt($item.attr('data-mapzoom')),
                        controlSize: 32,
                        center: centerMap,
                        styles: styles
                    });
                    $(this).data('gmap', map);

                    if ($(this).attr('data-maptype') == 'marker') {
                        var address = $item.attr('data-address');
                        if (address.length > 3) {
                            var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ 'address': address }, function(results, status) {
                                if (typeof(results[0]) != 'undefined') {

                                    centerMap = results[0].geometry.location;
                                    map.setCenter(centerMap);
                                    var marker = new google.maps.Marker({
                                        position: results[0].geometry.location,
                                        map: map
                                    });

                                    $(this).data('mapMarker', marker);
                                }
                            });
                        }
                    } else if ($(this).is('[data-itinerary]')) {
                        var directionRenderer = new google.maps.DirectionsRenderer();
                        directionRenderer.setMap(map);
                        $(this).data('directionRenderer', directionRenderer);



                        lfb_updateGmapItinerary($(this), form.formID);

                    }
                });
            }

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-lazy-src]').each(function() {
                $(this).parent().on('click', function(e) {
                    lfb_itemClick($(this), true, form.formID);
                });
            });
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns').length > 0) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns [data-payment="paypal"]').on('click', function(e) {
                    e.preventDefault();
                    form.stripeToken = '';
                    form.useRazorpay = false;
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').slideUp();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrderPaypal').trigger('click');
                });

                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns [data-payment="razorpay"]').on('click', function() {

                    var isOK = lfb_checkStepItemsValid('final', form.formID);
                    if (isOK) {

                        lfb_checkCaptcha(form, function() {
                            setTimeout(function() {
                                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                        scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_razorPayCt').offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                    }, form.animationsSpeed * 2);
                                } else {
                                    $('body,html').animate({
                                        scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_razorPayCt').offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                    }, form.animationsSpeed * 2);
                                }

                            }, 350);

                            if (lfb_lastSteps.length > 0) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel #lfb_razorPayCt .linkPrevious').fadeIn();
                            }
                            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #btnOrderRazorpay').length > 0) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #btnOrderRazorpay').trigger('click');
                            }
                        });

                    }
                });

                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns [data-payment="stripe"]').on('click', function() {
                    form.useRazorpay = false;
                    form.useStripePayment = true;
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').slideUp();
                    var isOK = lfb_checkStepItemsValid('final', form.formID);
                    if (isOK) {
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_captcha').length > 0) {
                            jQuery.ajax({
                                url: form.ajaxurl,
                                type: 'post',
                                data: {
                                    action: 'lfb_checkCaptcha',
                                    formID: formID,
                                    captcha: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_captchaField').val()
                                },
                                success: function(rep) {
                                    if (rep == '1') {

                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_captchaPanel').slideUp(100);
                                        lfb_showWinStripePayment(form);
                                    } else {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_captchaField').closest('.form-group').addClass('has-error');

                                    }
                                }
                            });
                        } else {


                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_captchaPanel').slideUp(100);
                            lfb_showWinStripePayment(form);
                        }
                    }
                });
            }

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #btnOrderRazorpay').on('click', function() {
                form.useRazorpay = true;
                lfb_order(formID);
            });

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] input:not([type=checkbox])').on('change', function() {
                lfb_updatePrice(formID, $(this).attr('data-itemid'));
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] textarea').on('change', function() {
                lfb_updatePrice(formID, $(this).attr('data-itemid'));
            });
            if (form.enableShineFxBtn == 1) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('a.btn-primary').append('<canvas class="lfb_shineCanvas"></canvas>');
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('a.btn-primary').on('mouseover', function() {
                    if (form.shineFxIndex == 0) {
                        lfb_shineBtn(formID, $(this).find('.lfb_shineCanvas'));
                    }
                });
            }


            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_dropzone').each(function() {
                var maxSize = null;
                if ($(this).attr('data-maxfiles') > 0) {
                    maxSize = $(this).attr('data-maxfiles');
                }
                var dropzone = $(this);
                $(this).dropzone({
                    url: form.ajaxurl + '?form=' + formID,
                    paramName: 'file',
                    maxFilesize: $(this).attr('data-filesize'),
                    maxFiles: maxSize,
                    addRemoveLinks: true,
                    dictRemoveFile: '',
                    dictCancelUpload: '',
                    acceptedFiles: $(this).attr('data-allowedfiles'),
                    dictDefaultMessage: form.filesUpload_text,
                    dictFileTooBig: form.filesUploadSize_text,
                    dictInvalidFileType: form.filesUploadType_text,
                    dictMaxFilesExceeded: form.filesUploadLimit_text,
                    init: function() {
                        this.on("thumbnail", function(file, dataUrl) {
                            var thumb = $(file.previewElement);
                            var fileName = file.name.replace(/\//g, '');
                            fileName = fileName.replace(/ /g, '_');
                            fileName = fileName.replace(/'/g, '_');
                            fileName = fileName.replace(/"/g, '_');
                            fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');

                            thumb.attr('data-file', fileName + '_' + dropzone.data('currentFileIndex'));
                        });
                        this.on("sending", function(file, xhr, formData) {
                                dropzone.closest('.lfb_genSlide').find('.lfb_btn-next').fadeOut();
                                dropzone.closest('.lfb_genSlide').find('.btn-primary').fadeOut();
                                formData.append("action", 'lfb_upload_form');
                                formData.append("formSession", $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-formsession'));
                                formData.append('itemID', dropzone.attr('data-itemid'));
                            }),
                            this.on("complete", function(file, xhr) {
                                if (dropzone.find('.dz-preview:not(.dz-complete)').length == 0 || dropzone.find('.dz-preview').length == 0) {
                                    dropzone.closest('.lfb_genSlide').find('.lfb_btn-next').fadeIn();
                                    dropzone.closest('.lfb_genSlide').find('.btn-primary').fadeIn();
                                }
                                lfb_updatePrice(form.formID);
                            });
                        this.on("success", function(file, rep) {
                            var thumb = $(file.previewElement);
                            var fileName = file.name.replace(/\//g, '');
                            fileName = fileName.replace(/ /g, '_');
                            fileName = fileName.replace(/'/g, '_');
                            fileName = fileName.replace(/"/g, '_');
                            fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');
                            if (form.emailCustomerLinks == 1) {
                                var reps = rep.split('||');
                                var url = reps[0];
                                thumb.attr('data-url', url);
                                rep = reps[1];
                            }
                            if (typeof(rep) == 'undefined' || rep == undefined || rep == 'undefined') {
                                thumb.addClass('dz-error');
                                thumb.find('[data-dz-errormessage]').html('There is an error, please try again');
                            } else {
                                thumb.attr('data-file', rep + '_' + fileName);
                            }
                        });
                        this.on("removedfile", function(file, xhr) {
                            lfb_updatePrice(form.formID);
                        });
                    }
                });
            });


            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('.lfb_rate').each(function() {

                var max = parseInt($(this).closest('.lfb_itemBloc').attr('data-max'));
                var initialValue = parseInt($(this).closest('.lfb_itemBloc').attr('data-value'));
                if (isNaN(initialValue)) {
                    initialValue = 5;
                }
                var color = '#bdc3c7';
                if ($(this).closest('.lfb_itemBloc').attr('data-color') != '') {
                    color = $(this).closest('.lfb_itemBloc').attr('data-color');
                }
                if (color.indexOf('#') == -1) {
                    color = '#' + color;
                }
                var stepSize = $(this).closest('.lfb_itemBloc').attr('data-interval');
                $(this).rate({
                    initial_value: initialValue,
                    max_value: max,
                    step_size: 1,
                    cursor: 'pointer'
                }).on("change", function(ev, data) {
                    $(this).closest('.lfb_itemBloc').addClass('checked');
                    $(this).closest('.lfb_itemBloc').addClass('lfb_changed');
                    lfb_updatePrice(formID, $(this).closest('.lfb_itemBloc').attr('data-itemid'));
                }).css({
                    color: color
                });
            });

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('.form-control[data-validation="mask"][data-mask]').each(function() {
                if ($(this).attr('data-mask').trim().length > 0) {
                    $(this).mask($(this).attr('data-mask'), { clearIfNotMatch: true });
                }
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('input[type="text"][data-itemid],textarea[data-itemid]').each(function() {
                $(this).attr('data-initialvalue', $(this).val());
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-itemid][data-type="slider"]').each(function() {
                var min = parseInt($(this).attr('data-min'));
                if (isNaN(min)) {
                    min = 0;
                }
                var max = parseInt($(this).attr('data-max'));
                if (max == 0) {
                    max = 30;
                }
                var dataDefaultValue = parseFloat($(this).attr('data-value'));
                if($(this).is('[data-qtdefault]')){
                    dataDefaultValue  = parseFloat($(this).attr('data-qtdefault'));
                }
                var defaultValue = min;
                if (!isNaN(dataDefaultValue) && dataDefaultValue >= min && dataDefaultValue <= max) {
                    defaultValue = dataDefaultValue;
                }

                var tooltip = $('<div class="tooltip bs-tooltip-top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + defaultValue + '</div></div>').css({
                    position: 'absolute',
                    top: -55,
                    left: -20,
                    opacity: 1
                }).hide();
                var step = 1;
                if ($(this).is('[data-stepslider]') && parseFloat($(this).attr('data-stepslider')) > 0) {
                    step = parseFloat($(this).attr('data-stepslider'));
                }
                var isRange = 'min';
                if ($(this).is('.lfb_range')) {
                    isRange = true;
                }
                var isDisabled = false;
                $(this).slider({
                    min: min,
                    max: max,
                    value: defaultValue,
                    step: step,
                    range: isRange,
                    disabled: isDisabled,
                    orientation: "horizontal",
                    change: function(event, ui) {
                        if (!lfb_isSelectionMode(form.formID)) {
                            if (Number.isInteger(ui.value)) {
                                $(ui.handle).find('.tooltip-inner').html(lfb_formatPrice(ui.value, form.formID));
                            } else {
                                $(ui.handle).find('.tooltip-inner').html(ui.value);
                            }
                            if (event.originalEvent) {
                                lfb_updatePrice(formID, $(this).attr('data-itemid'));
                            }
                        }
                    },
                    start: function(event, ui) {
                        if (lfb_isSelectionMode(form.formID)) {
                            return false;
                        }
                    },
                    slide: function(event, ui) {
                        if (lfb_isSelectionMode(form.formID)) {
                            return false;
                        }
                        if (Number.isInteger(ui.value)) {
                            $(ui.handle).find('.tooltip-inner').html(lfb_formatPrice(ui.value, form.formID));
                        } else {
                            $(ui.handle).find('.tooltip-inner').html(ui.value);
                        }
                        var _self = this;
                        if (event.originalEvent) {
                            setTimeout(function() {
                                lfb_updatePrice(formID, $(_self).attr('data-itemid'));
                                $(_self).addClass('lfb_changed');
                            }, 30);
                            $(ui.handle).find('.tooltip').show();
                        }
                        lfb_updatePrice(formID, $(_self).attr('data-itemid'));
                    },
                    stop: function(event, ui) {
                        if (Number.isInteger(ui.value)) {
                            $(ui.handle).find('.tooltip-inner').html(lfb_formatPrice(ui.value, form.formID));
                        } else {
                            $(ui.handle).find('.tooltip-inner').html(ui.value);
                        }
                        lfb_updatePrice(formID, $(this).attr('data-itemid'));
                        $(ui.handle).find('.tooltip').hide();
                        if (isRange === true) {
                            var prefix = '';
                            var sufix = '';
                            if ($(this).find('.ui-slider-range').is('[data-tooltipprefix]')) {
                                prefix = $(this).find('.ui-slider-range').attr('data-tooltipprefix');
                            }
                            if ($(this).find('.ui-slider-range').is('[data-tooltipsufix]')) {
                                sufix = $(this).find('.ui-slider-range').attr('data-tooltipsufix');
                            }
                            $(this).find('.ui-slider-range').attr('title', prefix + ui.values[0] + ' - ' + ui.values[1] + sufix);
                            $(this).find('.ui-slider-range').attr('data-bs-original-title', prefix + ui.values[0] + ' - ' + ui.values[1] + sufix);
                        }
                    }

                }).find(".ui-slider-handle").append(tooltip).on('mouseenter', function() {
                    if (!lfb_isSelectionMode(form.formID)) {
                        $(this).find('.tooltip').show();
                    }
                }).on('mouseleave', function() {
                    $(this).find('.tooltip').hide();
                });
                if (isRange === true) {
                    $(this).find('.ui-slider-range').attr('title', min + ' - ' + max).tooltip({
                        html: true,
                        container: '#lfb_form[data-form="' + form.formID + '"]'
                    });
                    var _slider = $(this);
                    $(this).find('.ui-slider-range').on('mouseenter', function() {
                        var prefix = '';
                        var sufix = '';
                        if ($(this).is('[data-tooltipprefix]')) {
                            prefix = $(this).attr('data-tooltipprefix');
                        }
                        if ($(this).is('[data-tooltipsufix]')) {
                            sufix = $(this).attr('data-tooltipsufix');
                        }
                        $(this).attr('title', prefix + ' ' + _slider.slider('values')[0] + ' - ' + _slider.slider('values')[1] + sufix);
                        $(this).attr('data-bs-original-title', prefix + ' ' + _slider.slider('values')[0] + ' - ' + _slider.slider('values')[1] + sufix);
                    });
                }
            });

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_colorpicker').each(function() {
                var $this = $(this);
                $(this).prev('.lfb_colorPreview').on('click', function() {
                    if (!lfb_isSelectionMode(form.formID)) {
                        $(this).next('.lfb_colorpicker').trigger('click');
                    }
                });
                $(this).prev('.lfb_colorPreview').css({
                    backgroundColor: form.colorA
                });
                $(this).colpick({
                    color: form.colorA,
                    layout: 'hex',
                    onSubmit: function() {
                        $('body > .colpick').fadeOut();
                    },
                    onChange: function(hsb, hex, rgb, el, bySetColor) {
                        $(el).val('#' + hex);
                        $(el).prev('.lfb_colorPreview').css({
                            backgroundColor: '#' + hex
                        });
                    }
                });
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('.lfb_colorPreview[data-urltarget],input[type="text"][data-itemid]:not(.lfb_colorpicker)[data-urltarget],textarea[data-itemid][data-urltarget],select[data-itemid][data-urltarget],input[type="number"][data-urltarget]').each(function() {
                $(this).on('click', function() {
                    if (!lfb_isSelectionMode(form.formID)) {
                        var win = window.open($(this).attr('data-urltarget'), '_blank');
                        if (typeof(win) !== 'null' && win != null) {
                            win.focus();
                        }
                    }
                });
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('[data-fieldtype]').each(function() {
                $(this).attr('name', $(this).attr('data-fieldtype'));
            });

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('[data-autocomplete="1"]').each(function() {
                var options = {};
                if ($(this).attr('data-fieldtype') == 'city') {
                    options.types = ['(cities)'];
                } else if ($(this).attr('data-fieldtype') == 'address') {
                    if ($(this).closest('.lfb_genContent').find('[data-fieldtype="city"]').length > 0) {
                        options.types = ['address'];
                    }
                } else if ($(this).attr('data-fieldtype') == 'country') {
                    options.types = ['(regions)'];
                } else if ($(this).attr('data-fieldtype') == 'zip') {
                    options.types = ['(regions)'];
                }
                var autocomplete = new google.maps.places.Autocomplete($(this).get(0), options);
                autocomplete.field = $(this);
                if ($(this).attr('data-fieldtype') == 'zip') {
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        var place = autocomplete.getPlace();
                        for (var i = 0; i < place.address_components.length; i++) {
                            for (var j = 0; j < place.address_components[i].types.length; j++) {
                                if (place.address_components[i].types[j] == "postal_code") {
                                    autocomplete.field.val(place.address_components[i].long_name);

                                }
                            }
                        }
                    });
                } else if ($(this).attr('data-fieldtype') == 'country') {
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        var place = autocomplete.getPlace();
                        for (var i = 0; i < place.address_components.length; i++) {
                            for (var j = 0; j < place.address_components[i].types.length; j++) {
                                if (place.address_components[i].types[j] == "country") {
                                    autocomplete.field.val(place.address_components[i].long_name);

                                }
                            }
                        }
                    });
                }
            });


            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_mainPanel .lfb_genSlide [data-group]').each(function() {
                var $this = $(this);
                if (form.groupAutoClick == '1' && $this.prop('data-group') != "" && $this.closest('.lfb_genSlide').is('[data-required=true]')) {
                    if ($this.closest('.lfb_genSlide').find('[data-itemid]:not(.lfb_disabled)').not('.lfb_richtext').not('[data-group="' + $this.data('group') + '"]').not('.lfb_disabled').length == 0 &&
                        $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .quantityBtns').length == 0 && $this.closest('.lfb_genSlide').find('[data-group="' + $this.data('group') + '"] .lfb_qtfield').length == 0) {
                        $this.closest('.lfb_genSlide').find('.lfb_btn-next').addClass('lfb-hidden');
                    }
                }

            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_mainPanel .lfb_genSlide div.lfb_selectable.prechecked,#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_mainPanel .lfb_genSlide a.lfb_button.prechecked,#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide input[type=checkbox][data-price].prechecked').each(function() {
                lfb_itemClick($(this), false, formID);
            });
            lfb_initPrice(formID);
            lfb_updatePrice(formID);
            /* $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnStart').on('click', function () {
                 if (!lfb_isSelectionMode(formID)) {
                     lfb_openGenerator(formID);
                 }
             });*/
            lfb_initGform(formID);
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').attr('target', '_self');
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .quantityBtns > a').on('click', function() {
                if (!lfb_isSelectionMode(form.formID)) {
                    if ($(this).attr('data-btn') == 'less') {

                        if (typeof($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .quantityBtns > a[data-btn="more"]').data('incrementInterval')) != 'undefined') {
                            clearInterval($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .quantityBtns > a[data-btn="more"]').data('incrementInterval'));
                        }
                        lfb_quantity_less(this, formID);
                    } else {
                        if (typeof($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .quantityBtns > a[data-btn="less"]').data('incrementInterval')) != 'undefined') {
                            clearInterval($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .quantityBtns > a[data-btn="less"]').data('incrementInterval'));
                        }
                        lfb_quantity_more(this, formID);
                    }
                }
            });


            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .linkPrevious').on('click', function() {
                if (!lfb_isSelectionMode(form.formID)) {
                    lfb_previousStep(formID);
                }
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_btn-next').on('click', function() {
                if (!lfb_isSelectionMode(form.formID)) {
                    lfb_nextStep(formID);
                }
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrderPaypal').on('click', function() {
                if (!lfb_isSelectionMode(form.formID)) {
                    lfb_order(formID);
                }
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide [data-toggle="switch"]').on('change', function() {
                var fieldID = $(this).attr('data-fieldid');
                lfb_toggleField(fieldID, formID);
            });

            var chkGrav = false;
            $('.gform_wrapper').each(function() {
                var gravID = $(this).attr('id').substr($(this).attr('id').lastIndexOf('_') + 1, $(this).attr('id').length);
                if (gravID == form.gravityFormID) {
                    if (!chkGrav) {
                        chkGrav = true;
                        $(this).detach().insertAfter('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice');
                    } else {
                        $(this).remove();
                    }
                }
            });
            setTimeout(function() {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .gform_wrapper').length > 1) {
                    var chkGravA = false;
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .gform_wrapper').each(function() {
                        if (!chkGravA) {
                            chkGravA = true;
                        } else {
                            $(this).remove();
                        }
                    });
                }
            }, 500);
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_qtfield').attr('type', 'number');
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_qtfield').on('focusout', function() {
                if ($(this).val().indexOf('-') > -1 && (!$(this).is('[min]') || $(this).attr('min').indexOf('-') < 0)) {
                    $(this).val(parseInt($(this).attr('min')));
                }
                if (parseFloat($(this).val()) < parseInt($(this).attr('min'))) {
                    $(this).val($(this).attr('min'));
                }
                if (parseFloat($(this).val()) > parseInt($(this).attr('max'))) {
                    $(this).val($(this).attr('max'));
                }
                lfb_updatePrice(form.formID);
                lfb_updateSummary(form.formID);
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] input[type="number"][data-itemid]').on('keydown', function(event) {
                return event.keyCode == 69 ? false : true;
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] input[type="number"][data-itemid]').on('focusin', function() {
                if ($(this).val() == 0) {
                    $(this).val('');
                }
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] input[type="number"][data-itemid]').on('keyup change', function() {
                lfb_updatePrice(form.formID);
                lfb_updateSummary(form.formID);

            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] input[type="number"][data-itemid]').on('focusout', function(e) {

                if ($(this).val() == '') {
                    $(this).val(0);
                }
                if ($(this).val() == 0 && !$(this).is('[data-required="true"]')) {

                } else {
                    if ($(this).val().indexOf('-') > -1 && (!$(this).is('[min]') || $(this).attr('min').indexOf('-') < 0)) {
                        $(this).val(parseInt($(this).attr('min')));
                    }
                    if (parseFloat($(this).val()) < parseFloat($(this).attr('min'))) {
                        $(this).val($(this).attr('min'));
                    }
                    if (parseFloat($(this).val()) > parseFloat($(this).attr('max'))) {
                        $(this).val($(this).attr('max'));
                    }

                    if ($(this).val() == '' || isNaN(parseInt($(this).val()))) {
                        $(this).val(0);
                    }
                    if ($(this).val() != '' && ($(this).is('[data-valueasqt="0"]') || $(this).val() > 0)) {
                        $(this).addClass('checked');
                    } else {
                        $(this).removeClass('checked');
                    }
                }
                if (e.originalEvent !== undefined) {
                    lfb_updatePrice(form.formID);
                    lfb_updateSummary(form.formID);

                }
            });
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_sliderQt').each(function() {
                var min = parseInt($(this).closest('.quantityBtns').attr('data-min'));
                if (min == 0) {
                    min = 1;
                }
                var tooltip = $('<div class="tooltip top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + min + '</div></div>').css({
                    position: 'absolute',
                    top: -55,
                    left: -20,
                    opacity: 1
                }).hide();
                var step = 1;
                if ($(this).closest('.quantityBtns').is('[data-stepslider]') && parseInt($(this).closest('.quantityBtns').attr('data-stepslider')) > 0) {
                    step = parseInt($(this).closest('.quantityBtns').attr('data-stepslider'));
                }
                var isDisabled = false;
                $(this).slider({
                    min: min,
                    max: parseInt($(this).closest('.quantityBtns').attr('data-max')),
                    value: parseInt($(this).closest('.quantityBtns').next('.icon_quantity').html()),
                    orientation: "horizontal",
                    range: "min",
                    disabled: isDisabled,
                    step: step,
                    change: function(event, ui) {
                        tooltip.find('.tooltip-inner').html(ui.value);
                        $(this).closest('.quantityBtns').next('.icon_quantity').html(ui.value);
                        if (event.originalEvent) {
                            lfb_updatePrice(formID, $(this).attr('data-itemid'));
                        }
                    },
                    slide: function(event, ui) {
                        $(this).closest('.quantityBtns').next('.icon_quantity').html(ui.value);
                        tooltip.find('.tooltip-inner').html(ui.value);
                        if (event.originalEvent) {
                            lfb_updatePrice(formID, $(this).attr('data-itemid'));
                        }
                    }
                }).find(".ui-slider-handle").append(tooltip).on('mouseenter', function() {
                    tooltip.show();
                }).on('mouseleave', function() {
                    tooltip.hide();
                });
            });
            if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_visualEditing')) {
                lfb_loadStoredForm(form.formID);
            }
            lfb_initRichTextValues(form.formID);
            if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_visualEditing')) {
                if (form.intro_enabled == '0') {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_btnFloatingSummary').css({
                        display: 'inline-block'
                    });
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_btnSaveForm').css({
                        display: 'inline-block'
                    });
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnStart,#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #startInfos').hide();

                    if (form.showSteps != '2') {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice').fadeIn(500);
                    } else {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice').hide();
                    }
                    if (form.showSteps == 3) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stepper').fadeIn(500);
                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel').fadeIn(form.animationsSpeed, function() {
                        if (!form.autoStart) {
                            if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_visualEditing')) {
                                lfb_nextStep(form.formID);
                            }
                        }
                    });
                }
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_loader').fadeOut();
        });
    }

    function lfb_replaceAllBackSlash(targetStr) {
        var index = targetStr.indexOf("\\");
        while (index >= 0) {
            targetStr = targetStr.replace("\\", "");
            index = targetStr.indexOf("\\");
        }
        return targetStr;
    }

    function lfb_shineBtn(formID, $canvas) {
        var form = lfb_getForm(formID);
        $canvas.attr({
            width: $canvas.width(),
            height: $canvas.height()
        });
        $canvas.css({
            borderRadius: $canvas.parent().css('border-radius')
        });
        var ctx = $canvas.get(0).getContext('2d');
        ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
        var grd = ctx.createLinearGradient(0, 0, $canvas.width(), $canvas.height());
        form.shineFxIndex += 0.08;
        if (form.shineFxIndex > 1) {
            ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
            form.shineFxIndex = 0;
        } else {
            var pos = form.shineFxIndex;
            var prevPos = pos - 0.1;
            if (prevPos < 0) {
                prevPos = 0;
            }
            var nextPos = pos + 0.1;
            if (nextPos > 1) {
                nextPos = 1;
            }
            grd.addColorStop(0, "transparent");
            grd.addColorStop(prevPos, "rgba(255,255,255,0)");
            grd.addColorStop(pos, "rgba(255,255,255,0.3)");
            grd.addColorStop(nextPos, "rgba(255,255,255,0)");
            grd.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
            setTimeout(function() {
                lfb_shineBtn(formID, $canvas);
            }, 30);
        }
    }

    function lfb_updateLayerImages(formID) {
        var form = lfb_getForm(formID);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_layeredImage').each(function() {
            var stepID = $(this).closest('.lfb_genSlide').attr('data-stepid');
            var _stepID = parseInt(stepID);
            if (isNaN(_stepID)) {
                _stepID = 0;
            }


            var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
            if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
                lastAndCurrentSteps.push(parseInt(form.step));
            } else if (form.step == 'final') {
                lastAndCurrentSteps.push('final');
            }

            $(this).find('img:not(.lfb_baseLayer)').each(function() {
                var conditions = lfb_replaceAllBackSlash($(this).attr('data-showconditions'));
                conditions = conditions.replace(/'/g, '"');
                if (conditions.length > 0) {
                    try {
                        conditions = JSON.parse(conditions);
                        var errors = lfb_checkConditions(conditions, formID, _stepID);
                        var operator = $(this).attr('data-showconditionsoperator');


                        if ((operator == 'OR' && !errors.errorOR) || (operator != 'OR' && !errors.error)) {
                            $(this).fadeIn();
                        } else {
                            $(this).fadeOut();
                        }

                    } catch (e) {
                        $(this).fadeIn();
                    }
                } else {
                    $(this).fadeIn();
                }
            });
        });
    }

    function lfb_updateShowSteps(formID) {
        for (var i = 0; i < lfb_plannedSteps.length; i++) {
            var stepEl = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + lfb_plannedSteps[i] + '"]');
            if (stepEl.is('[data-useshowconditions]')) {
                var conditions = lfb_replaceAllBackSlash(stepEl.attr('data-showconditions'));
                conditions = conditions.replace(/'/g, '"');
                if (conditions != '') {
                    try {
                        conditions = JSON.parse(conditions);
                        var errors = lfb_checkConditions(conditions, formID, parseInt(stepEl.attr('data-stepid')));
                        var operator = stepEl.attr('data-showconditionsoperator');
                        if ((operator == 'OR' && !errors.errorOR) || (operator != 'OR' && !errors.error)) {
                            if (stepEl.is('.lfb_disabled')) {
                                stepEl.css({
                                    opacity: 0
                                });
                                stepEl.removeClass('lfb_disabled');
                            }
                        } else {
                            if (!stepEl.is('.lfb_disabled')) {
                                stepEl.addClass('lfb_disabled');
                            }
                        }
                    } catch (e) {}
                }
            }
        }

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-useshowconditions]').each(function() {

        });
    }

    function lfb_updateShowItems(formID) {
        var form = lfb_getForm(formID);
        var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
        var pricePreviousStep = 0;
        var singlePricePreviousStep = 0;
        if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
            lastAndCurrentSteps.push(parseInt(form.step));
        } else if (form.step == 'final') {
            lastAndCurrentSteps.push('final');
        }

        for (var o = 0; o < lastAndCurrentSteps.length; o++) {

            var _stepID = lastAndCurrentSteps[o];
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + _stepID + '"] [data-useshowconditions]').each(function() {
                var conditions = lfb_replaceAllBackSlash($(this).attr('data-showconditions'));
                conditions = conditions.replace(/'/g, '"');
                if (conditions != '') {
                    try {
                        conditions = JSON.parse(conditions);
                        var errors = lfb_checkConditions(conditions, formID, _stepID);
                        var operator = $(this).attr('data-showconditionsoperator');
                        if ((operator == 'OR' && !errors.errorOR) || (operator != 'OR' && !errors.error)) {
                            if (($(this).is('.lfb_itemBloc') && $(this).is('.lfb_disabled')) || $(this).closest('.lfb_itemBloc').length > 0 && $(this).closest('.lfb_itemBloc').is('.lfb_disabled')) {

                                $(this).removeClass('lfb_disabled');
                                $(this).closest('.lfb_itemBloc').removeClass('lfb_disabled');
                                $(this).stop().animate({
                                    opacity: 1
                                }, 300);
                                if ($(this).is('input.prechecked') && !$(this).is(':checked')) {
                                    lfb_itemClick($(this), false, formID);
                                }
                                if ($(this).is('.lfb_selectable.prechecked') && !$(this).is('.checked')) {
                                    lfb_itemClick($(this), false, formID);
                                }
                                if ($(this).is('.lfb_button.prechecked') && !$(this).is('.checked')) {
                                    lfb_itemClick($(this), false, formID);
                                }
                                if ($(this).is('input[type="text"]') || $(this).is('textarea')) {
                                    if ($(this).is('[data-initialvalue]')) {
                                        $(this).val($(this).attr('data-initialvalue'));
                                    }
                                }

                                $(this).closest('.lfb_itemBloc').stop().fadeIn(100);
                            }
                        } else {
                            if (!$(this).is('.lfb_disabled')) {
                                $(this).css({
                                    opacity: 1
                                });
                                if ($(this).is(':checked')) {
                                    lfb_itemClick($(this), false, formID);
                                }
                                if ($(this).is('.checked')) {
                                    lfb_itemClick($(this), false, formID);
                                }
                                if ($(this).is('.lfb_dropzone')) {
                                    $(this).find('.dz-preview').remove();
                                }

                                $(this).addClass('lfb_disabled');
                                $(this).closest('.lfb_itemBloc').addClass('lfb_disabled');
                                $(this).stop().animate({
                                    opacity: 0
                                }, 300);
                                $(this).closest('.lfb_itemBloc').stop().fadeOut(300);
                            }
                        }
                    } catch (e) {}
                }
            });
        }

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]:not(.lfb_visualEditing) .lfb_genSlide.lfb_activeStep:not(#finalSlide) .lfb_row').each(function() {
            var row = $(this);
            var chkColumns = false;
            $(this).find('.lfb_column').each(function() {
                var chkItem = false;
                if ($(this).find('.lfb_item:not(.lfb_disabled):not(.lfb-hidden)').length > 0) {
                    chkItem = true;
                    chkColumns = true;
                }
                if (!chkItem) {
                    $(this).addClass('lfb-hidden');
                } else {
                    $(this).removeClass('lfb-hidden');
                }
            });
            if ($(this).children('.lfb_item:not(.lfb_disabled):not(.lfb-hidden)').length > 0) {
                chkColumns = true;
            }

            if (!chkColumns) {
                $(this).addClass('lfb-hidden');
            } else {
                $(this).removeClass('lfb-hidden');

            }
        });
        setTimeout(function() {
            lfb_resize(form);

        }, 200);
    }

    function lfb_removeFile(formID, file) {
        var form = lfb_getForm(formID);
        jQuery.ajax({
            url: form.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_removeFile',
                formSession: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-formsession'),
                file: file
            }
        });
    }

    function lfb_disablesThemeScripts() {
        var scriptsCheck = false;
        $('script').each(function() {
            if ((scriptsCheck)) {
                if ($(this).attr("src") && $(this).attr("src").indexOf("WP_Helper_Creator") > 0) {} else if ($(this).attr("src") && $(this).attr("src").indexOf("VisitorsTracker") > 0) {} else if ($(this).attr("src") && $(this).attr("src").indexOf("WP_Visual_Chat") > 0) {} else if ($(this).attr("src") && $(this).attr("src").indexOf("gravityforms") > 0) {} else {
                    var scriptCt = this.innerText || this.textContent;
                    if (scriptCt.indexOf('analytics') < 0 && $(this).parents('.gform_wrapper').length == 0) {
                        $(this).attr("disabled", "disabled");
                    }
                }
            }
            if ($(this).attr("src") && $(this).attr("src").indexOf("lfb_form") > 0) {
                scriptsCheck = true;
            }

        });
    }


    function lfb_initGform(formID) {
        var form = lfb_getForm(formID);
        if (form.gravityFormID > 0) {
            form.gravitySent = false;
            form.gFormDesignCheck++;
            if (form.timer_gFormDesign) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide').delay(100).animate({
                    opacity: 1
                }, 1000);
            }
            $('#gform_wrapper_' + form.gravityFormID + ' input[type=radio]').not('[data-toggle="radio"]').attr('data-toggle', 'radio');
            $('#gform_wrapper_' + form.gravityFormID + '  .ginput_container input,#gform_wrapper_' + form.gravityFormID + '  .ginput_container select,#gform_wrapper_' + form.gravityFormID + ' .ginput_container textarea').attr('title', 'control');
            $('#gform_wrapper_' + form.gravityFormID + '  .ginput_container input,#gform_wrapper_' + form.gravityFormID + '  .ginput_container textarea, #gform_wrapper_' + form.gravityFormID + ' .ginput_container select').not('[type=checkbox]').not('[type=radio]').not('[type=submit]').addClass('form-control');
            $('#gform_wrapper_' + form.gravityFormID + '  .ginput_container').addClass('form-group');
            $('#gform_wrapper_' + form.gravityFormID + '  .gform_button').attr('class', 'btn btn-wide btn-primary');
            $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper input[type="radio"]:not(.ready)').each(function() {
                $(this).addClass('ready');
                var label = $('#gform_wrapper_' + form.gravityFormID + ' .gform_wrapper label[for="' + $(this).attr('id') + '"]').html();
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').parent('li').css('display', 'inline-block');
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').append($(this));
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').addClass('radio');
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').prepend('<span class="icons"><span class="first-icon far fa-square"></span><span class="second-icon far fa-check-square"></span></span>');
                if (!$('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').parent('li').next().is('br')) {
                    $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').parent('li').after('<br/>');
                }
                if ($(this).is(':checked')) {
                    $(this).trigger('click');
                }
            });
            $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper input[type="checkbox"]:not(.ready)').each(function() {
                $(this).addClass('ready');
                var label = $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').html();
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').parent('li').css('display', 'inline-block');
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').append($(this));
                $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').addClass('checkbox');
                $(this).before('<span class="icons"><span class="first-icon far fa-square"></span><span class="second-icon far fa-check-square"></span></span>');
                if (!$('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').parent('li').next().is('br')) {
                    $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label[for="' + $(this).attr('id') + '"]').parent('li').after('<br/>');
                }

            });
            $('#gform_wrapper_' + form.gravityFormID + '  .gform_wrapper label.checkbox').each(function() {
                if ($(this).find('[type=checkbox]').length > 0) {
                    $(this).find('[type=checkbox]').eq(1).remove();
                }
                if ($(this).find('[type=checkbox]').is(':checked')) {
                    $(this).find('[type=checkbox]').trigger('click');
                }
            });
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm  #lfb_btnOrderPaypal').hide();
            }
            $(' #gform_submit_button_' + form.gravityFormID).on('click', function(e) {
                if (!lfb_isSelectionMode(form.formID)) {
                    if (!form.gravitySent) {
                        form.gravitySent = true;
                        $(this).addClass('anim');
                        form.gFormDesignCheck = 0;
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide').delay(1000).animate({
                            opacity: 0
                        }, 1000);
                        var $this = $(this);
                        setTimeout(function() {
                            form.timer_gFormDesign = setTimeout(function() {
                                lfb_initGform(formID);
                            }, 2000);
                        }, 1000);
                    }
                }
            });
        }
    }


    function lfb_initPrice(formID) {
        var form = lfb_getForm(formID);
        if (form.max_price > 0) {
            form.priceMax = form.max_price;
        } else {
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide [data-price]').each(function() {
                if ($(this).data('price') && $(this).data('price') > 0) {
                    if ($(this).find('.icon_quantity').length > 0) {
                        var max = parseFloat($(this).find('.icon_quantity').html());
                        if (max > 10 && parseFloat($(this).data('price')) > 100) {
                            max = 10;
                        } else if (max > 30) {
                            max = 30;
                        } else {
                            max = parseFloat($(this).find('.quantityBtns').data('max'));
                        }
                        if ($(this).data('operation') == '-' || $(this).data('operation') == '/') {} else {
                            form.priceMax += parseFloat($(this).data('price')) * max;
                        }
                    } else if ($(this).find('.lfb_qtfield').length > 0) {
                        var max = parseFloat($(this).find('.lfb_qtfield').val());
                        if (max > 10 && parseFloat($(this).data('price')) > 100) {
                            max = 10;
                        } else if (max > 30) {
                            max = 30;
                        } else {
                            if (parseFloat($(this).find('.lfb_qtfield').attr('max').length > 0)) {
                                max = parseFloat($(this).find('.lfb_qtfield').attr('max'));
                            } else {
                                max = 30;
                            }
                        }
                        if ($(this).data('operation') == '-' || $(this).data('operation') == '/') {} else {
                            form.priceMax += parseFloat($(this).data('price')) * max;
                        }
                    } else {
                        if ($(this).data('operation') == '+') {
                            form.priceMax += parseFloat($(this).data('price'));
                        }
                    }
                }
            });
            form.priceMax += form.initialPrice;
            $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide [data-price][data-operation="x"]').each(function() {
                if ($(this).find('.icon_quantity').length > 0) {
                    for (var i = 0; i < parseFloat($(this).find('.icon_quantity').html()); i++) {
                        form.priceMax = form.priceMax + (form.priceMax * parseFloat($(this).data('price')) / 100);
                    }
                } else {
                    form.priceMax = form.priceMax + (form.priceMax * parseFloat($(this).data('price')) / 100);
                }
            });
        }
    }


    function initFlatUI() {
        $('#lfb_form.lfb_bootstraped .input-group').on('focus', '.form-control', function() {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function() {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });
        $("#lfb_form.lfb_bootstraped .pagination").on('click', "a", function() {
            $(this).parent().siblings("li").removeClass("active").end().addClass("active");
        });
        $("#lfb_form.lfb_bootstraped .btn-group").on('click', "a", function() {
            $(this).siblings().removeClass("active").end().addClass("active");
        });

        $('#lfb_form.lfb_bootstraped [data-toggle="switch"][data-checkboxstyle="switch"]').wrap('<div class="switch"  data-on-label="<i class=\'fas fa-check\'></i>" data-off-label="<i class=\'fas fa-times\'></i>" />').parent().bootstrapSwitch();

        $('#lfb_form.lfb_bootstraped [data-toggle="switch"][data-checkboxstyle="switch"]').on('change', function() {
            if (!$(this).is(':checked')) {
                $(this).removeClass('checked');
            }
        });
        $("#lfb_form.lfb_bootstraped input[type=checkbox][data-urltarget]").each(function() {
            $(this).on('change', function() {
                if (!lfb_isSelectionMode(0)) {
                    if ($(this).is(':checked')) {
                        if ($(this).is('[data-urltargetmode="_self"]')) {
                            document.location.href = $(this).attr('data-urltarget');
                        } else {
                            var win = window.open($(this).attr('data-urltarget'), '_blank');
                            if (typeof(win) !== 'null' && win != null) {
                                win.focus();
                            }
                        }
                    }
                }
            });
        });
        if ($("#lfb_form.lfb_bootstraped .lfb_selectpicker").length > 0) {
            $("#lfb_form.lfb_bootstraped .lfb_selectpicker").selectpicker();
            $("#lfb_form.lfb_bootstraped .lfb_selectpicker").each(function() {
                $(this).closest('.lfb_itemBloc').find('.btn-group.lfb_bootstrap-select').attr('data-originaltitle', $(this).attr('data-originaltitle'));
                $(this).closest('.lfb_itemBloc').find('.btn-group.lfb_bootstrap-select').attr('data-bs-original-title', $(this).attr('data-bs-original-title'));
                $(this).closest('.lfb_itemBloc').find('.btn-group.lfb_bootstrap-select').attr('data-tooltiptext', $(this).attr('data-tooltiptext'));
                $(this).closest('.lfb_itemBloc').find('.btn-group.lfb_bootstrap-select').attr('data-tooltipimg', $(this).attr('data-tooltipimg'));
                $(this).closest('.lfb_itemBloc').find('.btn-group.lfb_bootstrap-select').attr('data-toggle', $(this).attr('data-toggle'));
                $(this).closest('.lfb_itemBloc').find('.btn-group.lfb_bootstrap-select').attr('data-placement', $(this).attr('data-placement'));
            });
        }

        $('#lfb_form .input-group-addon').on('click', function() {
            $(this).next('input').trigger('focus');
        });

        $('#lfb_form .form-control.lfb_customQtSelector').each(function() {
            const $container = $('<div class="lfb_numberFieldQtSelectorContainer"></div>');
            $(this).wrap($container);
            const btnLess = $('<a href="javascript:" class="lfb_numberFieldQtSelector" data-lfbdirection="-">-</a>');
            btnLess.insertBefore($(this));
            const btnPlus = $('<a href="javascript:" class="lfb_numberFieldQtSelector" data-lfbdirection="+">+</a>');
            btnPlus.insertAfter($(this));

            btnPlus.on('click', function() {
                var formID = $(this).closest('#lfb_form').attr('data-form');
                if (typeof(btnLess.data('incrementInterval')) != 'undefined') {
                    clearInterval(btnLess.data('incrementInterval'));
                }
                if (typeof(btnPlus.data('incrementInterval')) != 'undefined') {
                    clearInterval(btnPlus.data('incrementInterval'));
                }
                var newValue = parseFloat($(this).parent().find('input').val()) + 1;
                if ($(this).parent().find('input').attr('max') && newValue > parseFloat($(this).parent().find('input').attr('max'))) {
                    newValue = parseFloat($(this).parent().find('input').attr('max'));
                }
                if ($(this).parent().find('input').attr('min') && newValue < parseFloat($(this).parent().find('input').attr('min'))) {
                    newValue = parseFloat($(this).parent().find('input').attr('min'));
                }
                $(this).parent().find('input').val(newValue);
                lfb_updatePrice(formID);
            });

            btnLess.on('click', function() {
                var formID = $(this).closest('#lfb_form').attr('data-form');

                if (typeof(btnLess.data('incrementInterval')) != 'undefined') {
                    clearInterval(btnLess.data('incrementInterval'));
                }
                if (typeof(btnPlus.data('incrementInterval')) != 'undefined') {
                    clearInterval(btnPlus.data('incrementInterval'));
                }
                var newValue = parseFloat($(this).parent().find('input').val()) - 1;
                if ($(this).parent().find('input').attr('max') && newValue > parseFloat($(this).parent().find('input').attr('max'))) {
                    newValue = parseFloat($(this).parent().find('input').attr('max'));
                }
                if ($(this).parent().find('input').attr('min') && newValue < parseFloat($(this).parent().find('input').attr('min'))) {
                    newValue = parseFloat($(this).parent().find('input').attr('min'));
                }
                $(this).parent().find('input').val(newValue);
                lfb_updatePrice(formID);
            });
        });

    }

    function lfb_getItemDataFromItem(form, itemID) {
        var itemData = false;
        var checkedItems = new Array();
        var $itembloc = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_itemContainer_' + itemID);
        var stepID = $itembloc.closest('.lfb_genSlide').attr('data-stepid');
        var $panel = $itembloc.closest('.lfb_genSlide');
        var showSummary = true;
        if ($itembloc.is('.lfb_disabled')) {

            var itemID = $itembloc.find('[data-itemid]').attr('data-itemid');
            form.itemsData = jQuery.grep(form.itemsData, function(exItem) {
                return exItem.itemid != itemID;
            });


        } else {
            if ($itembloc.find('div.lfb_selectable.checked').length > 0) {
                var itemSelf = $itembloc.find('div.lfb_selectable.checked').get(0);
                var quantityText = '';
                if ($(itemSelf).is('[data-resqt]')) {
                    $(itemSelf).data('resqt', $(itemSelf).attr('data-resqt'));
                }
                if ($(itemSelf).is('[data-resprice]')) {
                    $(itemSelf).data('resprice', $(itemSelf).attr('data-resprice'));
                }

                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }

                var quantity = parseFloat($(itemSelf).data('resqt'));
                var priceItem = parseFloat($(itemSelf).data('resprice'));
                if (quantity == 0) {
                    quantity = 1;
                }
                if (quantity > 1) {
                    quantityText = quantity + 'x ';
                }
                if ($(itemSelf).data('price')) {
                    if ($(itemSelf).data('operation') == "+") {
                        if (form.currencyPosition == 'left') {
                            priceItem = form.currency + priceItem;
                        } else {
                            priceItem += form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "-") {
                        if (form.currencyPosition == 'left') {
                            priceItem = '-' + form.currency + priceItem;
                        } else {
                            priceItem += '-' + form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "/") {
                        priceItem = '-' + $(itemSelf).data('price') + '%';
                    } else {
                        priceItem = '+' + $(itemSelf).data('price') + '%';
                    }

                }
                var itemPriceS = parseFloat($(itemSelf).data('resprice'));
                if (isNaN(itemPriceS)) {
                    itemPriceS = parseFloat($(itemSelf).data('price'));
                }
                var isSinglePrice = false;
                if ($(itemSelf).is('[data-singleprice="true"]')) {
                    isSinglePrice = true;
                }


                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    var label = $(itemSelf).attr('data-title');
                    if ($(itemSelf).is('[data-bs-original-title]') && $(itemSelf).is('[data-reducqt]')) {
                        label = $(itemSelf).attr('data-bs-original-title');
                    }
                    if ($(itemSelf).is('[data-originaltitle]') && $(itemSelf).is('[data-showprice="1"]')) {
                        label = $(itemSelf).attr('data-originaltitle');
                    }
                    if ($(itemSelf).is('[data-originallabel]')) {
                        label = $(itemSelf).attr('data-originallabel');
                    }

                    itemData = {
                        label: label,
                        type: $itembloc.attr('data-itemtype'),
                        itemid: $(itemSelf).attr('data-itemid'),
                        price: itemPriceS,
                        quantity: quantity,
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: isSinglePrice,
                        image: $(itemSelf).find('.img').attr('src')
                    };
                }
            }
            if ($itembloc.find('a.lfb_button.checked').length > 0) {
                var itemSelf = $itembloc.find('a.lfb_button.checked').get(0);
                var priceItem = parseFloat($(itemSelf).data('price'));
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                if ($(itemSelf).data('price')) {

                    if ($(itemSelf).data('operation') == "+") {
                        if (form.currencyPosition == 'left') {
                            priceItem = form.currency + priceItem;
                        } else {
                            priceItem += form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "-") {
                        if (form.currencyPosition == 'left') {
                            priceItem = '-' + form.currency + priceItem;
                        } else {
                            priceItem += '-' + form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "/") {
                        priceItem = '-' + priceItem + '%';
                    } else {
                        priceItem = '+' + priceItem + '%';
                    }
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' (' + $(itemSelf).val() + ')';
                    }

                } else {
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' : ' + $(itemSelf).val() + '';
                    }

                }
                var label = $(itemSelf).attr('data-title');
                if ($(itemSelf).is('[data-originaltitle]') && $(itemSelf).is('[data-showprice="1"]')) {
                    label = $(itemSelf).attr('data-originaltitle');
                }
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if ($(itemSelf).is('select')) {
                    label += ' : ' + $(itemSelf).val();
                }

                var isSinglePrice = false;
                if ($(itemSelf).is('[data-singleprice="true"]')) {
                    isSinglePrice = true;
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        price: parseFloat($(itemSelf).data('resprice')),
                        quantity: 1,
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: isSinglePrice
                    };
                }
            }
            if ($itembloc.find('input[type=checkbox]:checked').length > 0) {
                var itemSelf = $itembloc.find('input[type=checkbox]:checked').get(0);
                var priceItem = parseFloat($(itemSelf).data('price'));
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                if ($(itemSelf).data('price')) {

                    if ($(itemSelf).data('operation') == "+") {
                        if (form.currencyPosition == 'left') {
                            priceItem = form.currency + priceItem;
                        } else {
                            priceItem += form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "-") {
                        if (form.currencyPosition == 'left') {
                            priceItem = '-' + form.currency + priceItem;
                        } else {
                            priceItem += '-' + form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "/") {
                        priceItem = '-' + priceItem + '%';
                    } else {
                        priceItem = '+' + priceItem + '%';
                    }
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' (' + $(itemSelf).val() + ')';
                    }

                } else {
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' : ' + $(itemSelf).val() + '';
                    }

                }
                var label = $(itemSelf).attr('data-title');
                if ($(itemSelf).is('[data-originaltitle]') && $(itemSelf).is('[data-showprice="1"]')) {
                    label = $(itemSelf).attr('data-originaltitle');
                }
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if ($(itemSelf).is('select')) {
                    label += ' : ' + $(itemSelf).val();
                }

                var isSinglePrice = false;
                if ($(itemSelf).is('[data-singleprice="true"]')) {
                    isSinglePrice = true;
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        price: parseFloat($(itemSelf).data('resprice')),
                        quantity: 1,
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: isSinglePrice
                    };
                }
            }
            if ($itembloc.is('.lfb_richtext') && !$itembloc.is('.lfb_shortcode')) {
                var itemSelf = $itembloc.get(0);

                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: $(itemSelf).attr('data-title'),
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: $(itemSelf).html(),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary
                    };
                }

            }
            if ($itembloc.find('div[data-type="slider"][data-itemid].lfb_range').length > 0) {
                var itemSelf = $itembloc.find('div[data-type="slider"]').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                var minValue = parseFloat($(itemSelf).slider("values")[0]);
                var maxValue = parseFloat($(itemSelf).slider("values")[1]);

                var label = $(itemSelf).attr('data-title');
                if ($(itemSelf).is('[data-originaltitle]') && $(itemSelf).is('[data-showprice="1"]')) {
                    label = $(itemSelf).attr('data-originaltitle');
                }
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }

                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        price: 0,
                        quantity: 0,
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: false,
                        value: minValue + ' - ' + maxValue,
                        minValue: minValue,
                        maxValue: maxValue
                    };
                }
            }
            if ($itembloc.find('div[data-type="slider"][data-itemid]:not(.lfb_range)').length > 0) {
                var itemSelf = $itembloc.find('div[data-type="slider"]').get(0);
                var priceItem = parseFloat($(itemSelf).data('price'));
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }

                var quantity = parseFloat($(itemSelf).slider('value'));
                if (quantity == 0) {
                    quantity = 1;
                }
                if (quantity > 1) {
                    quantityText = quantity + 'x ';
                }

                if ($(itemSelf).data('price')) {
                    if ($(itemSelf).data('operation') == "+") {
                        if (form.currencyPosition == 'left') {
                            priceItem = form.currency + priceItem;
                        } else {
                            priceItem += form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "-") {
                        if (form.currencyPosition == 'left') {
                            priceItem = '-' + form.currency + priceItem;
                        } else {
                            priceItem += '-' + form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "/") {
                        priceItem = '-' + priceItem + '%';
                    } else {
                        priceItem = '+' + priceItem + '%';
                    }
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' (' + $(itemSelf).val() + ')';
                    }


                } else {
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' : ' + $(itemSelf).val() + '';
                    }

                }
                var label = $(itemSelf).attr('data-title');
                if ($(itemSelf).is('[data-originaltitle]') && $(itemSelf).is('[data-showprice="1"]')) {
                    label = $(itemSelf).attr('data-originaltitle');
                }
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if ($(itemSelf).is('select')) {
                    label += ' : ' + $(itemSelf).val();
                }

                var isSinglePrice = false;
                if ($(itemSelf).is('[data-singleprice="true"]')) {
                    isSinglePrice = true;
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        price: parseFloat($(itemSelf).data('resprice')),
                        quantity: parseFloat($(itemSelf).slider('value')),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: isSinglePrice
                    };
                }
            }
            if ($itembloc.find('select[data-itemid]').length > 0) {
                var itemSelf = $itembloc.find('select[data-itemid]').get(0);
                var priceItem = parseFloat($(itemSelf).data('price'));
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                if ($(itemSelf).data('price') && $(itemSelf).data('price') > 0) {
                    if ($(itemSelf).data('operation') == "+") {
                        if (form.currencyPosition == 'left') {
                            priceItem = form.currency + priceItem;
                        } else {
                            priceItem += form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "-") {
                        if (form.currencyPosition == 'left') {
                            priceItem = '-' + form.currency + priceItem;
                        } else {
                            priceItem += '-' + form.currency;
                        }
                    } else if ($(itemSelf).data('operation') == "/") {
                        priceItem = '-' + priceItem + '%';
                    } else {
                        priceItem = '+' + priceItem + '%';
                    }
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' (' + $(itemSelf).val() + ')';
                    }

                } else {
                    var title = $(itemSelf).attr('data-originaltitle');
                    if ($(itemSelf).is('select')) {
                        title += ' : ' + $(itemSelf).val() + '';
                    }

                }
                var label = $(itemSelf).attr('data-title');

                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                var isSinglePrice = false;
                if ($(itemSelf).is('[data-singleprice="true"]')) {
                    isSinglePrice = true;
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                var valueSelect = $(itemSelf).val();
                if (valueSelect == null) {
                    valueSelect = '';
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        price: parseFloat($(itemSelf).data('resprice')),
                        value: valueSelect,
                        quantity: 1,
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: isSinglePrice
                    };
                }
            }
            if ($itembloc.find('input[type=file]').length > 0) {
                var itemSelf = $itembloc.find('input[type=file]').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }

                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: $(itemSelf).val(),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isFile: true
                    };
                }

            }
            if ($itembloc.find('.lfb_dropzone').length > 0) {
                var itemSelf = $itembloc.find('.lfb_dropzone').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                var filesValue = '';
                var filesValueG = '';
                var files = new Array();
                $(itemSelf).find('.dz-preview[data-file]:not(.dz-error)').each(function() {
                    files.push($(this).attr('data-file').replace(/ /g, '_'));

                        filesValue += ' - <span class="lfb_file">' + $(this).attr('data-file').replace(/ /g, '_') + '</span>' + "<br/>";
                        filesValueG += ' - ' + $(this).attr('data-file').replace(/ /g, '_') + '\n';
                    }
                });

                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if (files.length > 0) {

                    if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                        showSummary = false;
                    }
                    if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                        checkedItems.push($(itemSelf).attr('data-itemid'));
                        itemData = {
                            label: label,
                            itemid: $(itemSelf).attr('data-itemid'),
                            type: $itembloc.attr('data-itemtype'),
                            value: filesValue,
                            step: $panel.attr('data-title'),
                            stepid: stepID,
                            showInSummary: showSummary,
                            isFile: true,
                            files: files
                        };
                    }
                }

            }
            if ($itembloc.find('input[type=text][data-itemid]:not(.lfb_colorpicker)').length > 0) {
                var itemSelf = $itembloc.find('input[type=text]:not(.lfb_colorpicker)').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }


                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: $(itemSelf).val(),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary
                    };
                }
            }
            if ($itembloc.find('input[type=number][data-itemid]:not(.lfb_colorpicker)').length > 0) {
                var itemSelf = $itembloc.find('input[type=number]:not(.lfb_colorpicker)').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                var quantity = parseFloat($(itemSelf).val());
                quantityText = quantity + 'x ';



                var fieldVal = $(itemSelf).val();
                var fieldQt = undefined;
                var itemPriceS = undefined;
                if ($(itemSelf).is('[data-valueasqt="1"]')) {
                    fieldVal = undefined;
                    fieldQt = parseFloat($(itemSelf).val());
                    itemPriceS = parseFloat($(itemSelf).data('resprice'));
                    if (isNaN(itemPriceS)) {
                        itemPriceS = parseFloat($(itemSelf).data('price'));
                    }
                }
                var isSinglePrice = false;
                if ($(itemSelf).is('[data-singleprice="true"]')) {
                    isSinglePrice = true;
                }
                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }

                if ($(itemSelf).is('[data-hidezeropricesum="true"]') && itemPriceS == 0) {
                    showSummary = false;
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: fieldVal,
                        quantity: fieldQt,
                        price: itemPriceS,
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary,
                        isSinglePrice: isSinglePrice
                    };
                }
            }
            if ($itembloc.find('.lfb_colorPreview').length > 0) {
                var itemSelf = $itembloc.find('.lfb_colorPreview').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }

                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: $(itemSelf).next('.lfb_colorpicker').val(),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary
                    };
                }
            }
            if ($itembloc.find('textarea').length > 0) {
                var itemSelf = $itembloc.find('textarea').get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }

                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: lfb_nl2br($(itemSelf).val()),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary
                    };
                }
            }
            if ($itembloc.find('.lfb_rate').length > 0) {
                var itemSelf = $itembloc.get(0);
                if ($panel.is('[data-showstepsum="0"]') || !$(itemSelf).is('[data-showinsummary="true"]')) {
                    showSummary = false;
                }
                var label = $(itemSelf).data("title");
                if ($(itemSelf).is('[data-originallabel]')) {
                    label = $(itemSelf).attr('data-originallabel');
                }
                if (jQuery.inArray($(itemSelf).attr('data-itemid'), checkedItems) == -1) {
                    checkedItems.push($(itemSelf).attr('data-itemid'));
                    itemData = {
                        label: label,
                        itemid: $(itemSelf).attr('data-itemid'),
                        type: $itembloc.attr('data-itemtype'),
                        value: $itembloc.find('.lfb_rate').rate('getValue'),
                        step: $panel.attr('data-title'),
                        stepid: stepID,
                        showInSummary: showSummary
                    };
                }
            }

            if (itemData) {
                if ($itembloc.find('[data-showprice="0"]').length > 0) {
                    itemData.showPrice = false;
                } else {
                    itemData.showPrice = true;
                }
            }
        }
        return itemData;
    }

    function lfb_updateItemData(form, itemID) {
        var exItemData = false;
        var exItemIndex = -1;
        for (var i = 0; i < form.itemsData.length; i++) {
            if (form.itemsData[i].itemid == itemID) {
                exItemData = form.itemsData[i];
                exItemIndex = i;
                break;
            }
        }

        var $itembloc = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_itemContainer_' + itemID);
        if ($itembloc.is('.lfb_disabled')) {
            if (exItemData) {
                form.itemsData = jQuery.grep(form.itemsData, function(exItem) {
                    return exItem.itemid != itemID;
                });
            }
        } else {
            var itemData = lfb_getItemDataFromItem(form, itemID);
            if (exItemData) {
                form.itemsData[exItemIndex] = itemData;
            } else {
                form.itemsData.push(itemData);
            }
        }
    }


    function lfb_getItemData(form, itemID) {
        var rep = false;
        for (var i = 0; i < form.itemsData.length; i++) {
            if (form.itemsData[i].itemid == itemID) {
                rep = form.itemsData[i];
                if (rep && rep.stepid == form.step) {
                    rep = lfb_getItemDataFromItem(form, itemID);
                }
                break;
            }
        }
        if (!rep) {
            rep = lfb_getItemDataFromItem(form, itemID);
        }
        return rep;
    }

    function lfb_getFormContent(formID, useCurrent, onlyStepID) {
        var form = lfb_getForm(formID);
        var content = "";
        var contentGform = "";
        var totalTxt = "";
        var items = new Array();
        contentGform += "Ref : " + form.current_ref + " \n";
        var lastStepTitle = "";
        var cloneSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
        if (useCurrent) {
            if (form.step != 'final') {
                cloneSteps.push(form.step);
            }
        }
        if (form.step == 'final') {
            cloneSteps.push('final');
        }
        if (typeof(onlyStepID) != 'undefined' && onlyStepID != 0) {
            cloneSteps = new Array();
            cloneSteps.push(onlyStepID);
        }
        var checkedItems = new Array();
        for (var o = 0; o < cloneSteps.length; o++) {
            var _stepID = cloneSteps[o];
            var $panel = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + _stepID + '"]');
            if (($panel.attr('data-stepid') == 'final' || jQuery.inArray(parseInt($panel.attr('data-stepid')), lfb_plannedSteps) >= 0) && !$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-title][data-stepid="' + _stepID + '"]').is('.lfb_disabled')) {
                var stepID = $panel.attr('data-stepid');
                if (stepID != 'final') {
                    stepID = parseInt(stepID);
                }


                if (!$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('[data-sumhidesteps="1"]')) {
                    content += "<br/><p><u><b>" + $panel.attr("data-title") + " :</b></u></p><br/>";
                    contentGform += "\n\n---------" + $panel.attr("data-title") + " :---------\n";
                }
                var stepsItemsData = new Array();
                $panel.find('.lfb_itemBloc:not(.lfb_disabled)').each(function() {
                    var _itemID = 0;
                    if ($(this).find('[data-itemid]').length > 0) {
                        _itemID = $(this).find('[data-itemid]').attr('data-itemid');
                    } else {
                        _itemID = $(this).attr('data-itemid');
                    }
                    if (checkedItems.indexOf(_itemID) == -1) {
                        checkedItems.push(_itemID);
                        var itemData = lfb_getItemData(form, _itemID);
                        if (itemData) {
                            items.push(itemData);
                            stepsItemsData.push(itemData);
                        }
                    }
                });


                for (var j = 0; j < stepsItemsData.length; j++) {

                    if (stepsItemsData[j].type != 'richtext' && stepsItemsData[j].showInSummary) {
                        if (typeof(stepsItemsData[j].label) != 'undefined') {
                            if (typeof(stepsItemsData[j].price) != 'undefined' && stepsItemsData[j].price != 0 && stepsItemsData[j].showPrice) {
                                var itemPrice = lfb_formatPrice(parseFloat(stepsItemsData[j].price).toFixed(2), formID) + form.currency;
                                if (form.currencyPosition == 'left') {
                                    itemPrice = form.currency + lfb_formatPrice(parseFloat(stepsItemsData[j].price).toFixed(2), formID);
                                }


                                if (typeof(stepsItemsData[j].value) != 'undefined') {

                                    content += '    - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].value + ' (' + itemPrice + ')<br/>';
                                    contentGform += ' - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].value + ' (' + itemPrice + ')\n';
                                } else
                                if (typeof(stepsItemsData[j].quantity) != 'undefined' && stepsItemsData[j].quantity > 1) {
                                    content += '    - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].quantity + ' (' + itemPrice + ')<br/>';
                                    contentGform += ' - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].quantity + ' (' + itemPrice + ')\n';
                                } else {
                                    content += '    - ' + stepsItemsData[j].label + ' : ' + itemPrice + '<br/>';
                                    contentGform += ' - ' + stepsItemsData[j].label + ' : ' + itemPrice + '\n';

                                }
                            } else if (typeof(stepsItemsData[j].value) != 'undefined') {
                                if (stepsItemsData[j].value != '') {
                                    content += '    - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].value + '<br/>';
                                    contentGform += ' - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].value + '\n';
                                }
                            } else if (typeof(stepsItemsData[j].quantity) != 'undefined' && stepsItemsData[j].quantity > 1) {
                                content += '    - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].quantity + '<br/>';
                                contentGform += ' - ' + stepsItemsData[j].label + ' : ' + stepsItemsData[j].quantity + '\n';
                            } else {
                                content += '    - ' + stepsItemsData[j].label + '<br/>';
                                contentGform += ' - ' + stepsItemsData[j].label + '\n';

                            }
                        }
                    }
                }

            }
        }
        if (!form.price || form.price < 0) {
            form.price = 0;
        }
        var pattern = /^\d+(\.\d{2})?$/;
        if (!pattern.test(form.price)) {
            form.price = parseFloat(form.price).toFixed(2);
        }
        if (form.discountCode != '') {
            if (form.reductionResult > 0) {
                var reduction = parseFloat(form.reductionResult).toFixed(2) + form.currency;
                if (form.currencyPosition == 'left') {
                    reduction = form.currency + parseFloat(form.reductionResult).toFixed(2);
                }
                content += '<br/> Coupon : ' + form.discountCode + ' (' + reduction + ')';

            } else {

                content += '<br/> Coupon : ' + form.discountCode;
            }
        }
        if (form.currencyPosition == 'left') {

            totalTxt += form.currency + lfb_formatPrice(parseFloat(form.price).toFixed(2), formID);
            contentGform += '\n\nTotal : ' + form.currency + lfb_formatPrice(parseFloat(form.price).toFixed(2), formID);
        } else {
            totalTxt += lfb_formatPrice(parseFloat(form.price).toFixed(2), formID) + form.currency;
            contentGform += '\n\nTotal : ' + lfb_formatPrice(parseFloat(form.price).toFixed(2), formID) + form.currency;
        }
        return new Array(content, totalTxt, items, contentGform);
    }

    function lfb_check_gform_response(formID) {
        var form = lfb_getForm(formID);
        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #gforms_confirmation_message').length > 0) {
            clearInterval(form.timer_gFormSubmit);
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0 && form.price > 0) {

                var payPrice = form.price;
                if (form.payMode == 'percent') {
                    payPrice = parseFloat(payPrice) * (parseFloat(form.percentToPay) / 100);
                } else if (form.payMode == 'fixed') {
                    payPrice = parseFloat(form.fixedToPay);
                }
                payPrice = parseFloat(payPrice).toFixed(2);
                if (form.priceSingle > 0) {
                    var payPriceSingle = form.priceSingle;
                    if (form.payMode == 'percent') {
                        payPriceSingle = parseFloat(payPriceSingle) * (parseFloat(form.percentToPay) / 100);
                    } else if (form.payMode == 'fixed') {
                        payPriceSingle = parseFloat(form.fixedToPay);
                    }


                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').length == 0) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="a1" value="0">');
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="p1" value="1">');
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="t1" value="M">');
                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').val(payPriceSingle);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p1]').val($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p3]').val());
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').remove();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=t1]').remove();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p1]').remove();
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=amount]').val(payPrice);
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a3]').val(payPrice);
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=item_number]').val(form.current_ref);
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=item_name]').val($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=item_name]').val() + ' - ' + form.current_ref);
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [type="submit"]').trigger('click');
            } else {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .gfield_error').length > 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .gform_footer').show();
                }
                $('#finalText').html($('#gform_wrapper_' + form.gravityFormID + ' .gforms_confirmation_message').html());
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide #gforms_confirmation_message').fadeIn();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide #lfb_summary').fadeOut();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide #lfb_couponContainer').fadeOut();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide #lfb_legalNoticeContent').fadeOut();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .linkPrevious').fadeOut();
                lfb_finalStep(formID);
            }
        }
    }

    function lfb_quantity_less(btn, formID) {
        var $target = $(btn).parent().parent().find('.icon_quantity');
        var min = parseFloat($(btn).parent().data('min'));
        var quantity = parseInt($target.html());
        if (quantity > 1 && quantity > min) {
            quantity--;
            $target.html(quantity);
            lfb_updatePrice(formID);
        }
    }

    function lfb_quantity_more(btn, formID) {
        var $target = $(btn).parent().parent().find('.icon_quantity');
        var max = parseFloat($(btn).parent().data('max'));
        var quantity = parseFloat($target.html());
        if (quantity < max || max == 0) {
            quantity++;
            $target.html(quantity);
            lfb_updatePrice(formID);
        }
    }


    function lfb_checkEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    function lfb_isIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function lfb_cloneSummary(mode, formID) {
        var form = lfb_getForm(formID);
        var $summaryClone = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary').clone();

        const fieldsStyle = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').attr('data-stylefields');

        if ($summaryClone.find('#lfb_summaryDiscountTr').css('display') != 'table-row') {
            $summaryClone.find('#lfb_summaryDiscountTr').remove();
        }
        if ($('body').is('.rtl')) {
            $summaryClone.css({
                textAlign: 'right',
                direction: 'rtl'
            });
            $summaryClone.find('table').css({
                textAlign: 'right',
                direction: 'rtl'
            });
        }
        $summaryClone.addClass('lfb-hidden');
        $summaryClone.uniqueId();
        var nbCols = 4;
        if (form.summary_showAllPricesEmail == '1') {
            $summaryClone.find('.lfb_hidePrice').removeClass('lfb_hidePrice').removeClass('lfb-hidden');
        }

        $summaryClone.find('thead th').each(function() {
            if ($(this).is('.lfb-hidden')) {
                nbCols--;
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary').after($summaryClone);
        $summaryClone.children('h4').remove();
        $summaryClone.find('*:not(.lfb_value)').each(function() {
            $(this).css({
                fontSize: $(this).css('font-size'),
                padding: $(this).css('padding'),
                textAlign: $(this).css('text-align'),
                lineHeight: $(this).css('line-height')
            });
        });
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table thead > tr > th:eq(1)').is('.lfb-hidden')) {
            $summaryClone.find('table thead > tr > th:eq(1)').remove();
            $summaryClone.find('table tbody td.lfb_valueTd').remove();
        }
        $summaryClone.find('th.lfb_summaryStep').attr('align', 'center');
        $summaryClone.find('table').attr('width', '90%');
        $summaryClone.find('table').css('width', '90%');
        $summaryClone.find('table').attr('border', '1');
        $summaryClone.find('table').attr('bordercolor', lfb_rgb2hex($summaryClone.find('table').css('border-color')));
        $summaryClone.find('table').attr('style', 'width:90%;margin:0 auto;');
        $summaryClone.find('thead td, thead th').each(function() {
            if (fieldsStyle == 'glassmorphic') {
                $(this).attr('bgcolor', form.color_summaryTheadBg);
                $(this).css('background', form.color_summaryTheadBg);
                $(this).css('color', form.color_summaryTheadTxt);
                $(this).attr('color', form.color_summaryTheadTxt);
            } else {
                $(this).attr('bgcolor', lfb_rgb2hex($summaryClone.find('thead').css('background-color')));
                $(this).css('background', lfb_rgb2hex($summaryClone.find('thead').css('background-color')));
            }
        });
        $summaryClone.find('tbody th').each(function() {
            if (fieldsStyle == 'glassmorphic') {
                $(this).attr('bgcolor', form.color_summaryStepBg);
                $(this).css('color', form.color_summaryStepTxt);
                $(this).attr('color', form.color_summaryStepTxt);
            }
        });
        $summaryClone.find('th').each(function() {
            if (fieldsStyle != 'glassmorphic') {
                $(this).attr('bgcolor', lfb_rgb2hex($(this).css('background-color')));
            }
        });
        $summaryClone.find('td').each(function() {
            if (fieldsStyle == 'glassmorphic') {
                $(this).attr('bgcolor', form.color_summaryTbodyBg);
                $(this).css('color', form.color_summaryTbodyTxt);
                $(this).attr('color', form.color_summaryTbodyTxt);

            } else {
                if ($(this).attr('style').indexOf('background-color') > -1 || $(this).attr('style').indexOf('background') > -1) {
                    $(this).attr('bgcolor', lfb_rgb2hex($(this).css('background-color')));
                } else {
                    $(this).attr('bgcolor', lfb_rgb2hex($(this).closest('table').css('background-color')));
                }
            }
        });

        if (fieldsStyle == 'glassmorphic') {
            $summaryClone.find('td,th').each(function() {
                $(this).html('<span style="color: ' + lfb_rgb2hex($(this).css('color')) + '; font-size: ' + $(this).css('font-size') + '">' + $(this).html() + '</span>');
            });
        } else {
            $summaryClone.find('td,th').each(function() {
                $(this).attr('color', lfb_rgb2hex($(this).css('color')));
                $(this).html('<span style="color: ' + lfb_rgb2hex($(this).css('color')) + '; font-size: ' + $(this).css('font-size') + '">' + $(this).html() + '</span>');
            });
        }
        $summaryClone.find('table .lfb-hidden').remove();
        $summaryClone.find('table').attr('cellspacing', '0');
        $summaryClone.find('table').attr('cellpadding', '8');
        $summaryClone.find('table').attr('bgcolor', '#FFFFFF');
        $summaryClone.find('td,th').each(function() {
            $(this).attr('align', $(this).css('text-align'));
            $(this).css('padding', $(this).css('padding'));
        });
        if (form.summary_showAllPricesEmail == '1') {
            $summaryClone.find('.lfb_summaryStep').attr('colspan', nbCols);
            $summaryClone.find('#lfb_summaryDiscountTr>th:eq(0),#lfb_summaryTotalTr>th:eq(0)').attr('colspan', nbCols - 1);
        }
        if (nbCols == 3) {
            $summaryClone.find('td:not(:first-child)').each(function() {
                $(this).attr('width', '164');
            });
            $summaryClone.find('th:not(:first-child)').each(function() {
                $(this).attr('width', '164');
            });
            $summaryClone.find('tr>td:first-child').each(function() {
                $(this).attr('width', '340');
            });
            $summaryClone.find('tr>th:first-child').each(function() {
                $(this).attr('width', '340');
            });
        } else if (nbCols == 2) {
            $summaryClone.find('td:not(:first-child)').each(function() {
                $(this).attr('width', '50%');
            });
            $summaryClone.find('th:not(:first-child)').each(function() {
                $(this).attr('width', '50%');
            });
            $summaryClone.find('tr>td:first-child').each(function() {
                $(this).attr('width', '50%');
            });
            $summaryClone.find('tr>th:first-child').each(function() {
                $(this).attr('width', '50%');
            });
        } else {

            $summaryClone.find('td:not(:first-child)').each(function() {
                $(this).attr('width', '103');
            });
            $summaryClone.find('th:not(:first-child)').each(function() {
                $(this).attr('width', '103');
            });
            $summaryClone.find('tr>td:first-child').each(function() {
                $(this).attr('width', '332');
            });
            $summaryClone.find('tr>th:first-child').each(function() {
                $(this).attr('width', '332');
            });
        }
        $summaryClone.find('*:not(.lfb_value)').each(function() {
            var color = lfb_rgb2hex($(this).css('color'));
            $(this).css({
                color: ''
            });
            $(this).attr('style', $(this).attr('style') + ';color:' + color);
            if ($(this).attr('style').length > 0) {
                $(this).attr('style', $(this).attr('style') + ';color:' + color);
            } else {
                $(this).attr('style', 'color:' + color);
            }

        });


        $summaryClone.find('[data-tldinit]').removeAttr('data-tldinit');
        $summaryClone.find('.lfb_file').each(function() {
            $(this).removeAttr('style');
            $(this).removeAttr('data-tldinit');
        });
        $summaryClone.html('<div id="lfb_summaryCt" style="padding-top: 24px;padding-bottom: 24px; text-align: center;">' + $summaryClone.html() + '</div>');
        return $summaryClone;
    }

    function lfb_getContactInformations(formID, useJson) {
        if (useJson) {
            var rep = {
                email: '',
                phone: '',
                firstName: '',
                lastName: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                job: '',
                phoneJob: '',
                url: '',
                company: ''
            };
        } else {
            var rep = new Array();
            rep['email'] = '';
            rep['phone'] = '';
            rep['firstName'] = '';
            rep['lastName'] = '';
            rep['address'] = '';
            rep['city'] = '';
            rep['state'] = '';
            rep['zip'] = '';
            rep['country'] = '';
            rep['job'] = '';
            rep['phoneJob'] = '';
            rep['url'] = '';
            rep['company'] = '';

        }
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="email"]').each(function() {
            if ($(this).val().length > 0 && lfb_checkEmail($(this).val())) {
                if (useJson) {
                    rep.email = $(this).val();
                } else {
                    rep['email'] = $(this).val();
                }
            }
        });
        var phone = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="phone"]').each(function() {
            if ($(this).val().length > 3) {
                if (useJson) {
                    rep.phone = $(this).val();
                } else {
                    rep['phone'] = $(this).val();
                }
            }
        });
        var firstName = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="firstName"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.firstName = $(this).val();
                } else {
                    rep['firstName'] = $(this).val();
                }
            }
        });
        var lastName = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="lastName"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.lastName = $(this).val();
                } else {
                    rep['lastName'] = $(this).val();
                }
            }
        });
        var address = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="address"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.address = $(this).val();
                } else {
                    rep['address'] = $(this).val();
                }
            }
        });
        var city = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="city"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.city = $(this).val();
                } else {
                    rep['city'] = $(this).val();
                }
            }
        });
        var state = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="state"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.state = $(this).val();
                } else {
                    rep['state'] = $(this).val();
                }
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="zip"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.zip = $(this).val();
                } else {
                    rep['zip'] = $(this).val();
                }
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="country"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.country = $(this).val();
                } else {
                    rep['country'] = $(this).val();
                }
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="job"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.job = $(this).val();
                } else {
                    rep['job'] = $(this).val();
                }
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="phoneJob"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.phoneJob = $(this).val();
                } else {
                    rep['phoneJob'] = $(this).val();
                }
            }
        });

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="url"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.url = $(this).val();
                } else {
                    rep['url'] = $(this).val();
                }
            }
        });

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="company"]').each(function() {
            if ($(this).val().length > 0) {
                if (useJson) {
                    rep.company = $(this).val();
                } else {
                    rep['company'] = $(this).val();
                }
            }
        });


        return rep;
    }

    function lfb_getUrlVariablesByFormID(formID) {
        var form = lfb_getForm(formID);
        var contentForm = lfb_getFormContent(formID);
        var urlVariables = lfb_getUrlVariables(formID, contentForm[2], true);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').data('lfb_urlVariables', urlVariables);
        return urlVariables;

    }

    function lfb_getUrlVariables(formID, items) {
        var form = lfb_getForm(formID);
        var variablesText = '';
        var checkedVariables = new Array();
        jQuery.each(items, function() {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + this.itemid + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + this.itemid + '"]');
                if ($item.is('[data-urlvariable="1"]')) {
                    var value = '0';
    
                    if ($item.attr('data-sentattribute') == 'quantity') {
                        if ($item.is('.lfb_dropzone')) {
                            value = '';
                            value = value.replace(/<span class="lfb_file">/g, "");
                            value = value.replace(/<\/span>/g, "");
                            value = value.substr(3, value.length);
                            if (form.emailCustomerLinks == 1) {
                                value = '';
                                $item.find('.dz-success.dz-complete').each(function() {
                                    value += $(this).attr('data-url') + ',';
                                });
                                if (value.length > 0) {
                                    value = value.substr(0, value.length - 1);
                                }
                            }
                        } else if (typeof(this.value) != 'undefined') {
                            value = this.value.replace(/\+/g, "%2b");
                        } else if (typeof(this.quantity) != 'undefined') {
                            value = this.quantity;
                        }
    
                    } else if ($item.attr('data-sentattribute') == 'title') {
                        value = $item.attr('data-originallabel');
                    } else {
                        if (typeof(this.price) != 'undefined') {
                            value = this.price;
                        }
                    }
    
                    var title = $item.attr('data-variablename');
                    if (title.length > 0 && title.replace(/ /g, "").length > 0) {
                        title = lfb_formatForUrl(title);
                    } else {
                        title = lfb_formatForUrl(this.label);
                    }
                    if (typeof(value) == 'string') {
                        value = value.replace(/<br\s*[\/]?>/gi, "\n");
                    }
                    if (checkedVariables.indexOf(title) == -1) {
                        checkedVariables.push(title);
                        variablesText += '&' + title + '=' + value;
                    }
                }
            }
        });
    
        for (var i = 0; i < form.variables.length; i++) {
            if (form.variables[i].sendAsGet == 1 && typeof (form.variables[i].value) != 'undefined' && typeof (form.variables[i].value.replace) == 'function') {
                variablesText += '&' + lfb_formatForUrl(form.variables[i].title) + '=' + form.variables[i].value.replace(/\+/g, "%2b");
            }
        }

        if (variablesText.length > 0) {
            variablesText = '?' + variablesText.substr(1, variablesText.length);
            if (typeof (form.orderRef) != 'undefined') {
                var refName = form.refVarName;
                variablesText += '&' + refName + '=' + form.orderRef;
            }
            if (form.discountCode != '') {
                variablesText += '&coupon=' + form.discountCode + '&discount=' + form.reductionResult;
            }
        } else {
            if (typeof (form.orderRef) != 'undefined') {
                var refName = form.refVarName;
                variablesText += '?' + refName + '=' + form.orderRef;
                if (form.discountCode != '') {
                    variablesText += '&coupon=' + form.discountCode + '&discount=' + form.reductionResult;
                }
            } else {

                if (form.discountCode != '') {
                    variablesText += '?coupon=' + form.discountCode + '&discount=' + form.reductionResult;
                }
            }
        }
        return variablesText;
    }

    function lfb_formatForUrl(text) {
        text = text.replace(/ /g, "_");
        text = text.replace(/[^\w\s]/gi, '');
        return text;
    }

    function lfb_orderSend(formID, informations, email, fields) {

        var form = lfb_getForm(formID);
        var contentForm = lfb_getFormContent(formID);
        var content = contentForm[0];
        content = content.replace(/<br\/>/g, '[n]');
        var totalTxt = contentForm[1];
        var items = contentForm[2];
        form.urlVariables = '';
        if (form.sendUrlVariables == 1) {
            form.urlVariables = lfb_getUrlVariables(formID, contentForm[2], true);

        }
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('[data-subs]')) {
            totalTxt += $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').attr('data-subs');
        }
        var usePaypalIpn = 0;
        var activatePaypal = true;
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-activatePaypal="true"]:not(:checked):not(.checked)').each(function() {
            var cStepID = $(this).closest('.lfb_genSlide').attr('data-stepid');
            if (cStepID != 'final') {
                cStepID = parseInt(cStepID);
            }
            if (jQuery.inArray(cStepID, lfb_lastSteps) == -1) {} else {
                activatePaypal = false;
            }
        });
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').find('[data-dontactivatepaypal="true"].checked,[data-dontactivatepaypal="true"]:checked').length > 0) {
            activatePaypal = false;
        }
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_paypalForm').is('[data-useipn="1"]')) {
            usePaypalIpn = 1;
        }
        var $summaryClone = lfb_cloneSummary(false, formID);
        var summaryData = $summaryClone.html();
        $summaryClone.remove();

        var infosCt = lfb_getContactInformations(formID);
        email = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .emailField').val();
        if (lfb_checkEmail(infosCt['email'])) {
            email = infosCt['email'];
        }

        var total = parseFloat(form.price);
        var totalSub = 0;
        var subFrequency = '';
        var formTitle = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-formtitle');
        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-isSubs="true"]')) {
            total = parseFloat(form.priceSingle);
            totalSub = parseFloat(form.price);
            subFrequency = form.subscriptionText;
        }
        var fieldsLast = new Array();
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide input[type=text],#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide input[type=email], #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide textarea').each(function() {
            if ($(this).closest('#lfb_paypalForm').length == 0) {
                fieldsLast.push({
                    fieldID: $(this).prop('id').substr(6, 9),
                    value: lfb_nl2br($(this).val())
                });
            }
        });
        var activatePaypal = true;
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-activatePaypal="true"]:not(:checked):not(.checked)').each(function() {
            var cStepID = $(this).closest('.lfb_genSlide').attr('data-stepid');
            if (cStepID != 'final') {
                cStepID = parseInt(cStepID);
            }
            if (jQuery.inArray(cStepID, lfb_lastSteps) == -1) {} else {
                activatePaypal = false;
            }
        });

        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').find('[data-dontactivatepaypal="true"].checked,[data-dontactivatepaypal="true"]:checked').length > 0) {
            activatePaypal = false;
        }
        var captcha = '';
        if (typeof ga !== 'undefined') {
            try {
                ga('set', 'page', location.pathname + "#" + "Form+sent");
                ga('send', 'pageview');
            } catch (e) {}
        }
        if (typeof gtag !== 'undefined') {
            try {
                gtag('event', 'page_view', {
                    page_location: window.location.href,
                    page_path: location.pathname + "#Form+sent",
                    page_title: document.title + " Form sent",
                });

            } catch (e) {}
        }
        form.emailSent = true;
        if (localStorage.getItem('lfb_savedFormID') !== null && parseInt(localStorage.getItem('lfb_savedFormID')) == formID && localStorage.getItem('lfb_savedForm') !== null) {
            localStorage.removeItem('lfb_savedFormID');
            localStorage.removeItem('lfb_formsession');
            localStorage.removeItem('lfb_savedForm');
            localStorage.removeItem('lfb_savedFormPastSteps');
            localStorage.removeItem('lfb_savedFormStep');
        }
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').fadeOut();
        var eventsData = new Array();
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_datepicker[data-calendarid!="0"][data-registerevent="1"]').each(function() {
            if ($(this).val() != '') {
                var eventData = {};
                eventData.calendarID = parseInt($(this).attr('data-calendarid'));
                eventData.duration = parseInt($(this).attr('data-eventduration'));
                eventData.durationType = $(this).attr('data-eventdurationtype');
                if (eventData.durationType == 'mins') {
                    eventData.durationType = 'minutes';
                }
                eventData.isBusy = parseInt($(this).attr('data-eventbusy'));
                eventData.categoryID = parseInt($(this).attr('data-eventcategory'));
                eventData.startDate = moment($(this).datetimepicker("getDate")).format('YYYY-MM-DD HH:mm');
                eventData.endDate = moment($(this).datetimepicker("getDate")).add(eventData.duration, eventData.durationType).format('YYYY-MM-DD HH:mm');
                eventData.title = $(this).attr('data-eventtitle');
                if ($(this).attr('data-datetype') == 'date') {
                    var startDateMoment = moment($(this).datetimepicker("getDate"));
                    eventData.startDate = startDateMoment.format('YYYY-MM-DD');
                    var endDateMoment = moment($(this).datetimepicker("getDate")).add(eventData.duration, eventData.durationType);
                    eventData.endDate = endDateMoment.format('YYYY-MM-DD');
                    if (eventData.startDate == eventData.endDate || endDateMoment.diff(startDateMoment, 'hours') == 24) {
                        eventData.fullDay = 1;
                    }
                    
                } else {
                    eventData.fullDay = 0;
                }
                if ($(this).attr('data-useasdaterange') == '1') {
                    var endDatepickerID = $(this).attr('data-enddaterangeid');
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + endDatepickerID + '"]').length > 0) {
                        eventData.fullDay = 0;
                        if ($(this).attr('data-datetype') == 'date') {
                            eventData.endDate = moment($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + endDatepickerID + '"]').datetimepicker("getDate")).format('YYYY-MM-DD');
                        } else {
                            eventData.endDate = moment($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + endDatepickerID + '"]').datetimepicker("getDate")).format('YYYY-MM-DD HH:mm');
                        }
                    }
                }
                eventsData.push(eventData);
            }
        });
        if (typeof(form.verifiedEmail) == 'undefined' || !form.verifiedEmail) {
            form.verifiedEmail = '';
        } else {
            email = form.verifiedEmail;
        }
        var signature = '';
        if (form.useSignature == 1) {
            signature = form.signature.signature('toDataURL', 'image/png');
        }
        var $totalText = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice').clone();
        var totalIndexToRemove = -1;
        $totalText.find('span').each(function(i) {
            if ($(this).css('display') == 'none') {
                totalIndexToRemove = i;
            }
        });
        if (totalIndexToRemove > -1) {
            $totalText.children('span')[totalIndexToRemove].remove();
        }
        var totalText = $totalText.text();


        jQuery.ajax({
            url: form.ajaxurl,
            type: 'post',
            data: {
                action: 'send_email',
                formID: form.formID,
                informations: informations,
                email: email,
                customerInfos: lfb_getContactInformations(form.formID, true),
                summary: summaryData,
                stripeCustomerID: form.stripeCustomerID,
                stripeToken: form.stripeToken,
                stripeSrc: form.stripeSrc,
                totalTxt: totalTxt,
                email_toUser: form.email_toUser,
                usePaypalIpn: usePaypalIpn,
                discountCode: form.discountCode,
                formSession: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_formSession').val(),
                totalText: totalText,
                total: total,
                totalSub: totalSub,
                subFrequency: subFrequency,
                formTitle: formTitle,
                contactSent: form.contactSent,
                contentTxt: content,
                items: items,
                fieldsLast: fieldsLast,
                activatePaypal: activatePaypal,
                captcha: form.captcha,
                useRtl: $('body').is('.rtl'),
                finalUrl: lfb_getRedirectionURL(form.formID),
                eventsData: JSON.stringify(eventsData),
                razorpayReady: form.razorpayReady,
                variables: JSON.stringify(form.variables),
                verifiedEmail: form.verifiedEmail,
                signature: signature,
                vatPrice: form.vatPrice,
                vatLabel: form.vatLabel,
                vatAmount: form.vatAmount
            },
            success: function(current_ref) {

                var dontCallFinalStep = false;
                form.orderRef = current_ref;
                if (form.sendUrlVariables == 1) {
                    form.urlVariables = lfb_getUrlVariables(formID, contentForm[2]);
                }
                if (form.enableZapier == '1' && form.zapierWebHook.length > 0) {
                    var dataVariables = lfb_getUrlVariables(formID, contentForm[2]);
                    if (dataVariables.length > 1) {
                        dontCallFinalStep = true;
                        dataVariables = dataVariables.substr(1, dataVariables.length);
                        jQuery.ajax({
                            url: form.zapierWebHook,
                            type: 'get',
                            data: dataVariables,
                            success: function() {
                                lfb_finalStep(formID);
                            },
                            error: function() {
                                lfb_finalStep(formID);
                            }
                        });
                    }


                }
                $summaryClone.remove();
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_loader').delay(1000).fadeOut();
                if (activatePaypal && (typeof(form.stripePaid) == 'undefined') && $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0 && (form.price > 0 || form.priceSingle > 0)) {
                    var payPrice = form.price;
                    if (form.payMode == 'percent') {
                        payPrice = parseFloat(payPrice) * (parseFloat(form.percentToPay) / 100);
                    } else if (form.payMode == 'fixed') {
                        payPrice = parseFloat(form.fixedToPay);
                    }
                    payPrice = parseFloat(payPrice).toFixed(2);
                    if (form.priceSingle > 0) {
                        var payPriceSingle = form.priceSingle;
                        if (form.payMode == 'percent') {
                            payPriceSingle = parseFloat(payPriceSingle) * (parseFloat(form.percentToPay) / 100);
                        } else if (form.payMode == 'fixed') {
                            payPriceSingle = parseFloat(form.fixedToPay);
                        }
                        payPriceSingle = parseFloat(payPriceSingle).toFixed(2);
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').length == 0) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="a1" value="0"/>');
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="p1" value="1"/>');
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="t1" value="M"/>');
                        }
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').val(payPriceSingle);
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p1]').val($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p3]').val());
                        if (payPrice <= 0) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=cmd]').val('_xclick');
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a3]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=t3]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p3]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=bn]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=no_note]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=src]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=t1]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p1]').remove();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').append('<input type="hidden" name="amount" value="' + payPriceSingle + '"/>');
                        }
                    } else {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a1]').remove();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=t1]').remove();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=p1]').remove();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=amount]').val(payPrice);
                    }

                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name="return"]').val(lfb_getRedirectionURL(formID));

                    var redirUrl = lfb_getRedirectionURL(formID);
                    if (redirUrl != "" && redirUrl != "#" && redirUrl != " ") {
                        if (form.save_to_cart && form.cartPage != '') {
                            redirUrl = form.cartPage;
                        }
                    }
                    if (redirUrl != "" && redirUrl != "#" && redirUrl != " ") {
                        if (form.urlVariables != '') {
                            if (redirUrl.indexOf('?') > -1) {
                                form.urlVariables.replace('?', '&');
                            }
                        }
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_paypalForm input[name="return"]').val(redirUrl + form.urlVariables);
                    }




                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=a3]').val(payPrice);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=custom]').val(current_ref);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=item_number]').val(current_ref);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=item_name]').val($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [name=item_name]').val() + ' - ' + current_ref);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm [type="submit"]').trigger('click');
                }


                if (activatePaypal && $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0 && (form.price > 0 || form.priceSingle > 0) && typeof(form.stripePaid) == 'undefined') {} else if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeForm').length > 0 && form.price > 0) {} else if (!form.save_to_cart && !form.save_to_cart_edd && !dontCallFinalStep) {
                    lfb_finalStep(formID);
                }

                if (form.save_to_cart_edd) {
                    var products = new Array();
                    var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
                    if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
                        lastAndCurrentSteps.push(parseInt(form.step));
                    } else if (form.step == 'final' && jQuery.inArray('final', lastAndCurrentSteps) == -1) {
                        lastAndCurrentSteps.push('final');
                    }

                    jQuery.each(lastAndCurrentSteps, function() {
                        var $panel = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"]');
                        $panel.find('div.lfb_selectable.checked:not(.lfb_disabled),a.lfb_button.checked:not(.lfb_disabled),input[type=checkbox]:checked:not(.lfb_disabled),[data-type="slider"]:not(.lfb_disabled)').each(function() {
                            var quantity = 1;
                            if (parseInt($(this).data('resqt')) > 0) {
                                quantity = parseInt($(this).data('resqt'));
                            }
                            if ($(this).is('[data-type="slider"]')) {
                                quantity = parseInt($(this).slider('value'));
                                if (!isNaN(parseInt($(this).find('.tooltip-inner').html()))) {
                                    quantity = parseInt($(this).find('.tooltip-inner').html());
                                }
                            }
                            if (parseInt($(this).data('prodid')) > 0) {
                                products.push({
                                    quantity: quantity,
                                    product_id: parseInt($(this).data('prodid')),
                                    variation: parseInt($(this).data('eddvar'))
                                });
                            }
                        });
                    });
                    jQuery.ajax({
                        url: form.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'lfb_cartdd_save',
                            products: products
                        },
                        success: function() {
                            lfb_finalStep(formID);
                        }
                    });
                }

                if (form.save_to_cart) {
                    var products = new Array();
                    var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
                    if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
                        lastAndCurrentSteps.push(parseInt(form.step));
                    } else if (form.step == 'final' && jQuery.inArray('final', lastAndCurrentSteps) == -1) {
                        lastAndCurrentSteps.push('final');
                    }

                    jQuery.each(lastAndCurrentSteps, function() {
                        var $panel = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"]');
                        $panel.find('div.lfb_selectable.checked:not(.lfb_disabled),a.lfb_button.checked:not(.lfb_disabled),input[type=checkbox]:checked:not(.lfb_disabled),[data-type="numberfield"]:not(.lfb_disabled),[data-type="slider"]:not(.lfb_disabled),select[data-itemid]:not(.lfb_disabled)').each(function() {
                            var quantity = 1;
                            if (parseInt($(this).data('resqt')) > 0) {
                                quantity = parseInt($(this).data('resqt'));
                            }
                            if ($(this).is('[data-type="slider"]')) {
                                quantity = parseInt($(this).slider('value'));

                            }
                            if ($(this).is('[data-type="numberfield"]')) {
                                quantity = $(this).val();
                            }

                            if (parseInt($(this).data('prodid')) > 0) {
                                var title = $(this).attr('data-originaltitle');
                                if ($(this).is('[data-originallabel]')) {
                                    title = $(this).attr('data-originallabel')
                                }

                                var productData = {
                                    quantity: quantity,
                                    title: title,
                                    product_id: parseInt($(this).data('prodid')),
                                    variation: parseInt($(this).attr('data-woovar')),
                                    price: parseFloat($(this).data('resprice') / quantity).toFixed(2)
                                };
                                if (typeof($(this).data('imageProduct')) != 'undefined' && $(this).data('imageProduct') != '') {
                                    productData.imageProduct = $(this).data('imageProduct');
                                }

                                products.push(productData);
                            }
                        });
                    });
                    jQuery.ajax({
                        url: form.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'lfb_cart_save',
                            formID: formID,
                            ref: current_ref,
                            emptyWooCart: form.emptyWooCart,
                            products: products,
                            contentTxt: content
                        },
                        success: function() {
                            lfb_finalStep(formID);
                        }
                    });
                }
            }

        });
    }

    function lfb_checkLastStepFields(formID) {
        var form = lfb_getForm(formID);
        var isOK = true;
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide input[type=text],#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide input[type=email], #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide textarea').each(function() {
            if ($(this).closest('#lfb_paypalForm').length == 0) {
                if (!$(this).is('.lfb_disabled')) {
                    if ($(this).attr('data-required') && $(this).attr('data-required') == 'true' && $(this).val().length < 1) {
                        isOK = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!$(this).is('#lfb_captchaField')) {
                            if (form.disableScroll != 1) {
                                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen') || $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_popup')) {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                        scrollTop: $(this).parent().offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                    }, form.animationsSpeed * 2);
                                } else {
                                    if (form.scrollTopPage == '1') {
                                        $('body,html').animate({
                                            scrollTop: 0
                                        }, form.animationsSpeed * 2);
                                    } else {
                                        $('body,html').animate({
                                            scrollTop: $(this).parent().offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                        }, form.animationsSpeed * 2);
                                    }
                                }
                            }
                        }
                    }
                    if ($(this).is('.emailField') && !lfb_checkEmail($(this).val())) {
                        isOK = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (form.disableScroll != 1) {
                            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen') || $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_popup')) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                    scrollTop: $(this).parent().offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                }, form.animationsSpeed * 2);
                            } else {
                                if (form.scrollTopPage == '1') {
                                    $('body,html').animate({
                                        scrollTop: 0
                                    }, form.animationsSpeed * 2);
                                } else {
                                    $('body,html').animate({
                                        scrollTop: $(this).parent().offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                    }, form.animationsSpeed * 2);
                                }
                            }
                        }
                    }
                }
            }
        });

        return isOK;
    }

    function lfb_order(formID) {
        var form = lfb_getForm(formID);
        var isOK = true;
        var informations = '';
        var email = '';

        var fields = new Array();

        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide .form-group').removeClass('has-error');

        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide').find('.lfb_item input:not([type="checkbox"])[data-itemid],.lfb_item textarea[data-itemid],.lfb_item select[data-itemid]').each(function() {
            if ($(this).closest('#lfb_paypalForm').length == 0) {
                if ($(this).is('.lfb_disabled')) {} else {
                    if ($(this).is('#lfb_couponField')) {} else if ($(this).is('#lfb_captchaField')) {} else {
                        var dbpoints = ':';
                        if ($(this).closest('.lfb_item').find('label').html().lastIndexOf(':') == $(this).closest('.lfb_item').find('label').html().length - 1) {
                            dbpoints = '';
                        }
                        if ($('body').is('.rtl')) {
                            informations += '<p><b><span class="lfb_value">' + $(this).val() + '</span></b>' + dbpoints + ' ' + $(this).closest('.lfb_item').find('label').html() + '</p>';
                        } else {
                            informations += '<p>' + $(this).closest('.lfb_item').find('label').html() + ' ' + dbpoints + ' <b><span class="lfb_value">' + $(this).val() + '</span></b></p>';
                        }

                    }
                }
            }
        });
        isOK = lfb_checkStepItemsValid('final', formID);

        if (form.legalNoticeEnable == 1) {
            if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_legalCheckbox').is(':checked')) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_legalCheckbox').closest('.form-group').addClass('has-error');
                isOK = false;
            }
        }



        if (isOK == true && lfb_checkUserEmail(form)) {
            lfb_checkCaptcha(form, function() {
                var emailField = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').last();
                var email = emailField.val();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide').find('#lfb_btnOrder,.linkPrevious').fadeOut(250);
                lfb_uploadFiles(form.formID, informations, email, fields);
            });
        }
    }

    function lfb_getPreviousEnabledStep(formID, lastSteps) {
        var rep = -1;
        var stepID = lastSteps[lastSteps.length - 1];

        if (!$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').is('.lfb_disabled') &&
            ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_item:not(.lfb_row ):not(.lfb-hidden)').length > 0 ||
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_distanceError').length > 0)) {
            rep = stepID;
        } else {
            lastSteps.pop();
            if (lastSteps.length > 0) {
                rep = lfb_getPreviousEnabledStep(formID, lastSteps);
            } else {
                rep = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-start="1"]').attr('data-stepid');
            }
        }

        lfb_lastSteps = lastSteps;

        return rep;
    }

    function lfb_previousStep(formID) {
        var form = lfb_getForm(formID);
        var deviceAgent = navigator.userAgent.toLowerCase();
        var posTop = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_mainPanel').offset().top - 100;

        if (form.disableScroll != 1) {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_fullscreen') ||
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_popup')) {
                posTop = 0;
                if (form.intro_enabled > 0) {
                    posTop = lfb_zeroIfNan($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #startInfos').height()) + 100
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').animate({
                    scrollTop: posTop
                }, 250);
            } else {
                if ($('header').length > 0 && lfb_isAnyParentFixed($('header'))) {
                    posTop -= lfb_zeroIfNan($('header').height());
                }
                posTop -= (48 + parseInt(lfb_getScrollTopMargin(form)));
                if (form.scrollTopPage == '1') {
                    $('body,html').animate({
                        scrollTop: 0
                    }, form.animationsSpeed * 2);
                } else {
                    $('body,html').animate({
                        scrollTop: posTop
                    }, 250);
                }
            }
        }

        var agentID = deviceAgent.match(/(iPad|iPhone|iPod)/i);
        if (agentID) {
            $('#lfb_form :not(.ui-slider-handle) > .tooltip').remove();
            $('body > .tooltip').remove();
            $('#lfb_form[data-form="' + form.formID + '"] > .tooltip').remove();
        }
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_errorMsg').hide();

        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('a.lfb_button.checked:not(.prechecked)').each(function() {
            lfb_itemClick($(this), false, formID);
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('div.lfb_selectable.checked:not(.prechecked)').each(function() {
            lfb_itemClick($(this), false, formID);
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('input[data-toggle="switch"]:checked:not(.prechecked)').each(function() {
            $(this).trigger('click.auto');
        });

        var chkCurrentStep = false;
        var lastStepID = 0;
        var lastStepIndex = 0;
        jQuery.each(lfb_lastSteps, function(i) {
            var stepID = this;
            if (parseInt(stepID) == parseInt(form.step)) {
                chkCurrentStep = true;
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_executed').removeClass('lfb_executed');
            if (!chkCurrentStep) {
                if (($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_item:not(.lfb-hidden)').length > 0 ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_distanceError').length > 0) &&
                    !$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').is('.lfb_disabled')) {
                    lastStepID = stepID;
                    lastStepIndex = i;
                }
            }
        });
        lfb_lastSteps = jQuery.grep(lfb_lastSteps, function(value, i) {
            if (i <= lastStepIndex)
                return (value);
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide.lfb_activeStep').hide();
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + lastStepID + '"] .lfb_genContent').css('opacity', 0);
        lfb_changeStep(lastStepID, formID);
    }



    function lfb_returnToStep(stepID, formID) {
        var form = lfb_getForm(formID);
        if (stepID != form.step) {
            var deviceAgent = navigator.userAgent.toLowerCase();
            var agentID = deviceAgent.match(/(iPad|iPhone|iPod)/i);
            if (agentID) {
                $('#lfb_form :not(.ui-slider-handle) > .tooltip').remove();
                $('body > .tooltip').remove();
                $('#lfb_form[data-form="' + form.formID + '"] > .tooltip').remove();
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_errorMsg').hide();

            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('a.lfb_button.checked:not(.prechecked)').each(function() {
                lfb_itemClick($(this), false, formID);
            });
            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('div.lfb_selectable.checked:not(.prechecked)').each(function() {
                lfb_itemClick($(this), false, formID);
            });
            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('input[data-toggle="switch"]:checked:not(.prechecked)').each(function() {
                $(this).trigger('click.auto');
            });


            var stepIndex = lfb_lastSteps.indexOf(stepID);
            var removedSteps = [];
            for (var i = stepIndex + 1; i < lfb_lastSteps.length; i++) {
                removedSteps.push(lfb_lastSteps[i]);
            }
            form.itemsData = jQuery.grep(form.itemsData, function(value, i) {
                if (removedSteps.indexOf(parseInt(value.stepid)) == -1)
                    return (value);
            });

            lfb_lastSteps = jQuery.grep(lfb_lastSteps, function(value, i) {
                if (i <= stepIndex)
                    return (value);
            });
            lfb_changeStep(stepID, formID);
            setTimeout(function() {
                lfb_updateSummary(formID, true);
            }, 350);
            setTimeout(function() {
                lfb_updateStep(formID);
            }, 2000);

        }
    }

    function lfb_uploadFiles(formID, informations, email, fields) {
        var mustSend = true;
        var form = lfb_getForm(formID);
        if (form.useRazorpay && !form.razorpayReady) {
            mustSend = false;
            var singleCost = form.price;
            var subCost = 0;
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-isSubs="true"]')) {
                subCost = form.price;
                singleCost = 0;
                if (form.priceSingle > 0) {
                    singleCost = form.priceSingle;
                }
            }
            jQuery.ajax({
                url: form.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_makeRazorPayment',
                    formID: formID,
                    singleCost: singleCost,
                    subCost: subCost,
                    ref: form.current_ref,
                    email: email
                },
                success: function(rep) {
                    if (rep.trim().indexOf('error') == -1) {
                        var orderID = rep.trim();


                        var customerName = '';
                        var firstName = '';
                        var lastName = '';
                        var email = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .emailField').val();
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="firstName"]').length > 0) {
                            firstName = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="firstName"]').val();
                        }
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="lastName"]').length > 0) {
                            lastName = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-fieldtype="lastName"]').val();
                        }
                        customerName = firstName + ' ' + lastName;
                        var options = {
                            "key": form.razorpay_publishKey,
                            "name": form.title,
                            "description": "",
                            "image": form.razorpay_logoImg,
                            "handler": function(response) {
                                form.razorpayReady = true;
                                lfb_uploadFiles(formID, informations, email, fields);
                            },
                            "prefill": {
                                "name": customerName,
                                "email": email
                            },
                            "theme": {
                                "color": form.colorA
                            }
                        };
                        if (orderID.indexOf('sub_') == 0) {
                            options.subscription_id = orderID;
                        } else {
                            options.order_id = orderID;
                        }
                        var rzp1 = new Razorpay(options);
                        rzp1.open();

                    } else {
                        alert(rep);
                    }
                }
            });

        } else if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-emaillaststep="1"]')) {

        } else {

            if (form.disableScroll != 1) {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_fullscreen')) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').css('overflow-y', 'hidden');
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').animate({
                        scrollTop: 0
                    }, form.animationsSpeed * 2);
                } else {
                    if (form.scrollTopPage == '1') {
                        $('body,html').animate({
                            scrollTop: 0
                        }, form.animationsSpeed * 2);
                    } else {
                        $('body,html').animate({
                            scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                        }, form.animationsSpeed * 2);
                    }
                }
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnFloatingSummary').fadeOut(form.animationsSpeed);
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').fadeOut(form.animationsSpeed);

            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_loader').fadeIn(form.animationsSpeed * 2);
            setTimeout(function() {
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').fadeOut(form.animationsSpeed * 2);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #startInfos').fadeOut(form.animationsSpeed * 2);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #genPrice').fadeOut(form.animationsSpeed * 2);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_stepper').fadeOut(form.animationsSpeed * 2);
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide').fadeOut(form.animationsSpeed * 2);
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_btn-next').fadeOut(form.animationsSpeed);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_btnNextContainer').fadeOut(form.animationsSpeed);

                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalText').css({
                    opacity: 0,
                    display: 'block'
                });
                setTimeout(function() {

                    if (form.disableScroll != 1) {
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_fullscreen')) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').animate({
                                scrollTop: 0
                            }, form.animationsSpeed * 2);
                        } else {
                            if (form.scrollTopPage == '1') {
                                $('body,html').animate({
                                    scrollTop: 0
                                }, form.animationsSpeed * 2);
                            } else {
                                $('body,html').animate({
                                    scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                                }, form.animationsSpeed * 2);
                            }
                        }
                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalText').animate({ opacity: 1 }, form.animationsSpeed * 2);
                }, form.animationsSpeed * 4 + 50);
            }, form.animationsSpeed * 2 + 50);
        }
        if (mustSend) {
            lfb_orderSend(formID, informations, email, fields);
        }

    }

    function lfb_isAnyParentFixed($el, rep) {
        if (!rep) {
            var rep = false;
        }
        try {
            if ($el.parent().length > 0 && $el.parent().css('position') == "fixed") {
                rep = true;
            }
        } catch (e) {}
        if (!rep && $el.parent().length > 0) {
            rep = lfb_isAnyParentFixed($el.parent(), rep);
        }
        return rep;
    }

    function lfb_is_touch_device() {
        return (('ontouchstart' in window) ||
            (navigator.MaxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    function lfb_toggleFloatingSummary(formID) {
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').is('.lfb_open')) {
            lfb_closeFloatingSummary(formID);
        } else {
            lfb_showFloatingSummary(formID);
        }
    }

    function lfb_closeFloatingSummary(formID) {
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').removeClass('lfb_open');
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').stop().slideUp();
    }

    function lfb_showFloatingSummary(formID) {
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').addClass('lfb_open');
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').stop().slideDown();
    }

    function lfb_updateOtherSummary(formID) {
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemtype="summary"]').each(function() {
            var $summaryClone = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide >.lfb_genContent > .lfb_genContentSlide  > #lfb_summary').first().clone();
            $summaryClone.removeAttr('id');
            $summaryClone.removeClass('lfb-hidden');

            $summaryClone.find('h3').html($(this).attr('data-title'));

            if ($(this).attr('data-hideinfo') == '1') {
                $summaryClone.find('.lfb_valueTh').addClass('lfb-hidden');
                $summaryClone.find('.lfb_valueTd').addClass('lfb-hidden');
            }

            var $item = $(this);
            var nbCol = 4;
            if ($summaryClone.find('.lfb_valueTh').is('.lfb-hidden') || $summaryClone.find('.lfb_valueTh').css('display') == 'none') {
                nbCol--;
            }
            if ($summaryClone.find('thead .lfb_quantityTh').is('.lfb-hidden')) {
                nbCol--;
            }
            if ($summaryClone.find('thead .lfb_priceTh').is('.lfb-hidden')) {
                nbCol--;
            }
            $summaryClone.find('.lfb_summaryStep').attr('colspan', nbCol);
            $summaryClone.find('.lfb_static [colspan]').attr('colspan', nbCol - 1);
            $item.find('.lfb_summaryItemContent').html($summaryClone);

        });

    }

    function lfb_updateFloatingSummary(formID) {
        var form = lfb_getForm(formID);
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').length > 0) {
            var $summaryClone = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary').clone();

            var useInfos = false;
            if (form.floatSummary_showInfo == '1') {
                useInfos = true;
            }

            if ($summaryClone.find('tbody').children(':not(.lfb_static)').length == 0 && $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').is('[data-numberstep="1"]')) {
                lfb_closeFloatingSummary(formID);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnFloatingSummary:not(.disabled)').addClass('disabled');
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnFloatingSummary').removeClass('disabled');
                $summaryClone.find('h4').remove();
                $summaryClone.attr('id', 'lfb_floatingSummaryContent');
                $summaryClone.removeClass('lfb-hidden');
                if (!useInfos) {
                    $summaryClone.find('.lfb_valueTd,.lfb_valueTh').addClass('lfb-hidden');
                }
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').is('[data-hideprices="1"]')) {
                    $summaryClone.find('.lfb_priceTd,.lfb_priceTh').addClass('lfb-hidden');
                    $summaryClone.find('#lfb_summaryDiscountTr,#lfb_summaryTotalTr').addClass('lfb-hidden');
                }
                $summaryClone.find('.lfb_summaryStep').attr('colspan', $summaryClone.find('thead th:not(.lfb-hidden)').length);
                if (!useInfos) {
                    $summaryClone.find('tr.lfb_noPriceRow').remove();
                }
                $summaryClone.find('#lfb_vatRow>th:eq(0),#lfb_summaryDiscountTr>th:eq(0),#lfb_summaryTotalTr>th:eq(0)').attr('colspan', $summaryClone.find('thead th:not(.lfb-hidden)').length - 1);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary #lfb_floatingSummaryInner').html($summaryClone);
                $summaryClone.find('.lfb_summaryStep').on('click', function() {
                    var formID = $(this).closest('#lfb_form').attr('data-form');
                    var form = lfb_getForm(formID);
                    var stepID = parseInt($(this).attr('data-step'));
                    if (typeof(form.canGoprevious) == 'undefined' || form.canGoprevious) {
                        lfb_returnToStep(stepID, formID);
                    }
                });
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').is('[data-numberstep="1"]')) {
                    $summaryClone.find('.lfb_summaryStep').each(function(i) {
                        var stepIndex = i + 1;
                        $(this).find('strong').html(stepIndex + '. ' + $(this).find('strong').html());
                    });
                }
            }
        }
    }

    function lfb_updateSummary(formID, dontUseCurrent) {
        var form = lfb_getForm(formID);
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary').length > 0 || $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary').length > 0) {
            var useCurrent = true;
            if (dontUseCurrent) {
                useCurrent = false;
            }
            var formContent = lfb_getFormContent(formID, useCurrent);
            var items = formContent[2];
            var step = -1;
            var hasValues = false;
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr:not(.lfb_static)').remove();
            var priceClass = '';
            if (form.summary_hidePrices == 1) {
                priceClass = 'lfb-hidden lfb_hidePrice';
            }
            jQuery.each(items, function() {
                var item = this;
                if (item.label != undefined && item.label != "" && item.label != "undefined" && item.type != 'summary') {
                    if (!$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + item.itemid + '"]').is('.lfb_disabled') && $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + item.itemid + '"]').closest('.lfb_disabled').length == 0) {
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr[data-item="' + item.itemid + '"]').length == 0) {
                            if (isNaN(item.stepid)) {
                                item.stepid = 'final';
                            }
                            if (item.stepid != 'final' || form.summary_hideFinalStep != '1') {
                                if (item.stepid != step && !$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('[data-sumhidesteps="1"]')) {
                                    var stepTitle = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + item.stepid + '"]').attr('data-title');
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody #lfb_summaryDiscountTr').before('<tr><th colspan="4" class="lfb_summaryStep" data-step="' + item.stepid + '">' + stepTitle + '</th>');
                                }
                                step = item.stepid;

                                if (isNaN(item.quantity)) {
                                    item.quantity = 1;
                                }
                                var itemClass = "";
                                if (isNaN(item.price)) {
                                    itemClass = 'lfb_noPriceRow';
                                    item.price = 0;
                                }
                                var value = item.value;
                                if (item.value === undefined) {
                                    value = "";
                                } else {
                                    itemClass += ' lfb_infoRow';
                                }


                                if (value != "" && item.showInSummary) {
                                    hasValues = true;
                                }
                                var itemPrice = item.price;
                                var itemQt = lfb_formatPrice(item.quantity, formID);
                                if (value != "" && itemPrice == 0 && itemQt == 1) {
                                    itemQt = '';
                                    itemPrice = '';
                                } else {
                                    var isNegative = false;
                                    if (parseFloat(itemPrice) < 0) {
                                        isNegative = true;
                                        itemPrice *= -1;
                                    }
                                    if (form.currencyPosition == 'left') {
                                        if (form.summary_hideZeroDecimals == 1 && Number.isInteger(itemPrice)) {
                                            itemPrice = form.currency + '' + lfb_formatPrice(parseInt(itemPrice), formID);

                                        } else {
                                            itemPrice = form.currency + '' + lfb_formatPrice(parseFloat(itemPrice).toFixed(2), formID);
                                        }
                                    } else {
                                        if (form.summary_hideZeroDecimals == 1 && Number.isInteger(itemPrice)) {
                                            itemPrice = lfb_formatPrice(parseInt(itemPrice), formID) + '' + form.currency;

                                        } else {
                                            itemPrice = lfb_formatPrice(parseFloat(itemPrice).toFixed(2), formID) + '' + form.currency;

                                        }
                                    }
                                    if (isNegative) {
                                        itemPrice = '- ' + itemPrice;
                                    }
                                }
                                var classIsFile = '';
                                if (item.isFile) {}
                                var cssQt = '';
                                if (form.summary_hideQt == 1) {
                                    cssQt = 'lfb-hidden';
                                }
                                if (form.summary_hideZero == 1 && item.price == 0) {
                                    itemPrice = '';
                                }
                                if (form.summary_hideZeroQt == 1 && item.quantity == 0) {
                                    itemQt = '';
                                }

                                var hideClass = '';
                                if (!item.showInSummary) {
                                    hideClass = 'lfb-hidden';
                                }
                                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + item.itemid + '"]').is('[data-hideqtsum="true"]')) {
                                    itemQt = '';
                                }

                                if (form.priceSingle > 0 && !item.isSinglePrice && (itemPrice != "" || itemPrice > 0)) {
                                    itemPrice += ' ' + form.subscriptionText;
                                }
                                if (form.price <= 0) {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary .lfb_subTxt').addClass('lfb-hidden');
                                } else {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary .lfb_subTxt').removeClass('lfb-hidden');
                                }
                                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + item.itemid + '"]').is('[data-hidepricesum="true"]')) {
                                    itemPrice = '';
                                }

                                var itemDes = '';
                                if (form.summary_showDescriptions == 1) {
                                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_itemContainer_' + item.itemid + ' .lfb_itemDes').length > 0 && $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_itemContainer_' + item.itemid + ' .lfb_itemDes').html() != '') {
                                        itemDes = '<br/><span class="lfb_sumItemDes" style="font-size:12px;">' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_itemContainer_' + item.itemid + ' .lfb_itemDes').html() + '</span>';
                                    } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_itemContainer_' + item.itemid + ' .lfb_imageButtonDescription').length > 0) {
                                        itemDes = '<br/><span class="lfb_sumItemDes">' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_itemContainer_' + item.itemid + ' .lfb_imageButtonDescription').html() + '</span>';

                                    }
                                }
                                var mustShow = true;
                                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + item.itemid + '"]').is('[data-hidezeropricesum="true"]') && item.price == 0) {
                                    mustShow = false;
                                }

                                if (mustShow) {
                                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_itemContainer_' + item.itemid + '').is('[data-itemtype="filefield"]')) {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody #lfb_summaryDiscountTr').before('<tr data-item="' + item.itemid + '" data-itemstep="' + item.stepid + '" class="' + itemClass + ' ' + hideClass + '"><td>' + item.label + itemDes + '</td><td class="lfb_valueTd ' + classIsFile + '">' + value + '</td><td class="lfb_quantityTd ' + cssQt + '">' + itemQt + '</td><td class="lfb_priceTd ' + priceClass + '">' + itemPrice + '</td></tr>');
                                    } else {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody #lfb_summaryDiscountTr').before('<tr data-item="' + item.itemid + '" data-itemstep="' + item.stepid + '" class="' + itemClass + ' ' + hideClass + '"><td>' + item.label + itemDes + '</td><td class="lfb_valueTd ' + classIsFile + '"><span class="lfb_value">' + value + '</span></td><td class="lfb_quantityTd ' + cssQt + '">' + itemQt + '</td><td class="lfb_priceTd ' + priceClass + '">' + itemPrice + '</td></tr>');

                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (form.reductionResult > 0) {
                var reduction = parseFloat(form.reductionResult).toFixed(2) + form.currency;
                if (form.currencyPosition == 'left') {
                    reduction = form.currency + parseFloat(form.reductionResult).toFixed(2);
                }
                reduction = '-' + reduction;
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscount>span').html(reduction);
                if (!form.discountCodeDisplayed) {
                    var discLabel = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr th[colspan]').html();
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr th[colspan] i').length == 0) {
                        if (discLabel.substr(discLabel.length - 1, 1) == ':') {
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr th[colspan]').html(discLabel.substr(0, discLabel.length - 1) + ' <i>(' + form.discountCode + ')</i> :');
                        } else {
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr th[colspan]').html(discLabel + ' <i>(' + form.discountCode + ')</i>');
                        }
                    }
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr').css('display', 'table-row');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_floatingSummary #lfb_summaryDiscountTr').css('display', 'table-row');
            }

            if (form.useVAT == 1) {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_vatRow').length == 0) {
                    var $vatRow = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr').clone();
                    $vatRow.attr('id', 'lfb_vatRow');
                    $vatRow.find('#lfb_summaryDiscount').attr('id', 'lfb_summaryVat');
                    $vatRow.children('th').first().html(form.vatLabel + ' ' + form.vatAmount + '% :');
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr').after($vatRow);
                }



                var vatText = form.currency + lfb_formatPrice(parseFloat(form.vatPrice).toFixed(2), formID);
                if (form.summary_hideZeroDecimals == 1 && Number.isInteger(form.price)) {
                    vatText = form.currency + lfb_formatPrice(parseInt(form.vatPrice), formID);
                }
                if (form.currencyPosition != 'left') {
                    vatText = lfb_formatPrice(parseFloat(form.vatPrice).toFixed(2), formID) + form.currency;
                    if (form.summary_hideZeroDecimals == 1 && Number.isInteger(form.price)) {
                        vatText = lfb_formatPrice(parseInt(form.vatPrice), formID) + form.currency;
                    }
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryVat').html(vatText);
            }

            if (!form.price || form.price < 0) {
                form.price = 0;
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tr th.lfb_summaryStep').each(function() {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tr[data-itemstep="' + $(this).attr('data-step') + '"]:not(.lfb-hidden)').length == 0) {
                    $(this).parent().addClass('lfb-hidden');
                }
            });
            var summaryPrice = form.currency + '' + lfb_formatPrice(parseFloat(form.price).toFixed(2), formID);
            var summaryPriceSingle = form.currency + '' + lfb_formatPrice(parseFloat(form.priceSingle).toFixed(2), formID);

            if (form.summary_hideZeroDecimals == 1 && Number.isInteger(form.price)) {
                summaryPrice = form.currency + '' + lfb_formatPrice(parseInt(form.price), formID);
                summaryPriceSingle = form.currency + '' + lfb_formatPrice(parseInt(form.priceSingle), formID);
            }
            if (form.currencyPosition != 'left') {
                if (form.summary_hideZeroDecimals == 1 && Number.isInteger(form.price)) {
                    summaryPrice = lfb_formatPrice(parseInt(form.price), formID) + '' + form.currency;
                    summaryPriceSingle = lfb_formatPrice(parseInt(form.priceSingle), formID) + '' + form.currency;
                } else {
                    summaryPrice = lfb_formatPrice(parseFloat(form.price).toFixed(2), formID) + '' + form.currency;
                    summaryPriceSingle = lfb_formatPrice(parseFloat(form.priceSingle).toFixed(2), formID) + '' + form.currency;
                }
            }

            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table #lfb_summaryTotal>span:eq(0)').html(summaryPrice);

            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-totalrange]') && parseFloat(form.price) > 0) {
                var labelA = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-rangelabelbetween');
                var labelB = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-rangelabeland');
                var range = parseFloat($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-totalrange'));
                var rangeMin = (parseFloat(form.price) - range / 2);

                var rangeMax = parseFloat(form.price) + range / 2;
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-rangemode="percent"]')) {
                    rangeMin = parseFloat(form.price) - ((parseFloat(form.price) * range) / 100);
                    rangeMax = parseFloat(form.price) + ((parseFloat(form.price) * range) / 100);
                }
                if (rangeMin < 0) {
                    rangeMin = 0;
                }
                if (rangeMax < 0) {
                    rangeMax = 0;
                }

                var formatedPrice = labelA + ' <strong>' + form.currency + '' + lfb_formatPrice(rangeMin, formID) + '</strong> ' + labelB + ' <strong>' + form.currency + '' + lfb_formatPrice(rangeMax, formID) + '</strong>';

                if (form.currencyPosition != 'left') {
                    var range = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-totalrange'));
                    formatedPrice = labelA + ' <strong>' + lfb_formatPrice(rangeMin, formID) + form.currency + '</strong> ' + labelB + ' <strong>' + lfb_formatPrice(rangeMax, formID) + form.currency + '</strong>';
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table #lfb_summaryTotal>span:eq(0)').html(formatedPrice);

            }
            var colspan = 4;
            if (form.summary_hideQt == 1) {
                colspan -= 1;
            }
            if (form.summary_hidePrices == 1) {
                colspan -= 1;
            }
            if (!hasValues) {
                colspan -= 1;
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table td.lfb_valueTd').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table thead th:eq(1)').hide().addClass('lfb-hidden');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr#lfb_summaryTotalTr th[colspan]').attr('colspan', colspan - 1);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr#lfb_summaryDiscountTr th[colspan]').attr('colspan', colspan - 1);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr th.lfb_summaryStep').attr('colspan', colspan);
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table thead th:eq(1)').show().removeClass('lfb-hidden');

                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr:eq(1)').show();
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody td.lfb_valueTd').show();
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr#lfb_summaryTotalTr th[colspan]').attr('colspan', colspan - 1);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr#lfb_summaryDiscountTr th[colspan]').attr('colspan', colspan - 1);
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tbody tr th.lfb_summaryStep').attr('colspan', colspan);
            }
        }

        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_vatRow').length > 0) {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_vatRow').children('th').first().attr('colspan', $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary #lfb_summaryDiscountTr').children('th').first().attr('colspan'));
        }

        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('[data-sumstepsclick="1"]')) {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary .lfb_summaryStep:not([data-step="final"])').each(function() {
                $(this).css('cursor', 'pointer');
                $(this).on('click', function() {
                    var formID = $(this).closest('#lfb_form').attr('data-form');
                    var form = lfb_getForm(formID);
                    var stepID = parseInt($(this).attr('data-step'));
                    if (typeof(form.canGoprevious) == 'undefined' || form.canGoprevious) {
                        lfb_returnToStep(stepID, formID);
                    }
                });
            });
        }
        setTimeout(function() {
            lfb_updateFloatingSummary(formID);
            lfb_updateOtherSummary(formID);
        }, 300);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').trigger('summaryUpdated');
    }


    function lfb_changeStep(stepID, formID) {
        var form = lfb_getForm(formID);

        // if (stepID != form.step) {

        $('#lfb_form :not(.ui-slider-handle) > .tooltip').remove();
        $('body > .tooltip').remove();
        $('#lfb_form[data-form="' + form.formID + '"] > .tooltip').remove();
        $('#lfb_form[data-form="' + form.formID + '"] .datetimepicker ').hide();

        if (form.intro_enabled > 0 || form.step > 0) {
            var posTop = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_mainPanel').offset().top - 100;


            if (form.disableScroll != 1) {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_fullscreen') ||
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_popup')) {
                    posTop = 0;
                    if (form.intro_enabled > 0) {
                        posTop = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #startInfos').height() + 100
                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').animate({
                        scrollTop: posTop
                    }, 250);
                } else {
                    if ($('header').length > 0 && lfb_isAnyParentFixed($('header'))) {
                        posTop -= $('header').height();
                    }
                    posTop -= (48 + parseInt(lfb_getScrollTopMargin(form)));
                    if (form.scrollTopPage == '1') {
                        $('body,html').animate({
                            scrollTop: 0
                        }, form.animationsSpeed * 2);
                    } else {
                        $('body,html').animate({
                            scrollTop: posTop
                        }, 250);
                    }
                }
            }
        }
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .quantityBtns').removeClass('open');
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .quantityBtns').fadeOut(form.animationsSpeed / 4);
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide').fadeOut(form.animationsSpeed * 2);
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_btn-next').fadeOut(form.animationsSpeed / 2);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_btnNextContainer').fadeOut(form.animationsSpeed / 2);
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_linkPreviousCt').fadeOut(form.animationsSpeed / 2);
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_distanceError').fadeOut(form.animationsSpeed / 2);



        var activatePaypal = true;
        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').length == 0 &&
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length == 0 &&
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').length == 0) {
            activatePaypal = false;
        }
        if (stepID == 'final') {
            lfb_updateSummary(formID);
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-activatePaypal="true"]:not(:checked):not(.checked)').each(function() {
                var cStepID = $(this).closest('.lfb_genSlide').attr('data-stepid');
                if (cStepID != 'final') {
                    cStepID = parseInt(cStepID);
                }
                if (jQuery.inArray(cStepID, lfb_lastSteps) == -1) {} else {
                    activatePaypal = false;
                }
            });


            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').find('[data-dontactivatepaypal="true"].checked,[data-dontactivatepaypal="true"]:checked').length > 0) {
                activatePaypal = false;
            }
            if (activatePaypal) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns').show();
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns').length > 0) {

                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').closest('.lfb_btnNextContainer').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').hide();
                } else {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').length > 0) {

                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').show();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_btnNextContainerStripe').show();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrder').closest('.lfb_btnNextContainer').hide();

                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').show();
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').length > 0) {

                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').show();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrder').closest('.lfb_btnNextContainer').hide();
                        setTimeout(function() {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm .lfb_btnNextContainer').fadeIn();
                        }, form.animationsSpeed * 2);
                    }
                }
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paypalForm').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_btnNextContainerStripe').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnPayStripe').closest('.lfb_btnNextContainer').hide();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrder').closest('.lfb_btnNextContainer').show();

            }
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-emaillaststep="1"]') && !form.emailSent) {
                setTimeout(function() {
                    lfb_updatePrice(formID);
                    setTimeout(function() {
                        lfb_order(formID);
                    }, 1000);
                }, 1200);
            }
        }

        var $title = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.lfb_stepTitle');
        var $des = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('p.lfb_stepDescription');
        var $content = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.lfb_genContent');
        var totalBottom = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.lfb_totalBottomContainer');
        $content.find('.lfb_genContentSlide').removeClass('active');
        $content.find('.lfb_genContentSlide').eq(0).addClass('active');


        $content.animate({
            opacity: 0
        }, form.animationsSpeed);
        $des.animate({
            opacity: 0
        }, form.animationsSpeed);
        $title.removeClass('positioned');
        $title.css({
            "-webkit-transition": "none",
            "transition": "none"
        });
        totalBottom.animate({
            opacity: 0
        }, form.animationsSpeed);
        if (typeof ga !== 'undefined') {
            try {
                ga('set', 'page', location.pathname + "#" + encodeURIComponent($title.html()).replace(/%20/g, '+'));
                ga('send', 'pageview');
            } catch (e) {}
        }
        if (typeof gtag !== 'undefined') {
            try {
                gtag('event', 'page_view', {
                    page_location: window.location.href,
                    page_path: location.pathname + "#" + encodeURIComponent($title.html()).replace(/%20/g, '+'),
                    page_title: document.title + " " + $title.html(),
                });

                gtag('set', 'page', location.pathname + "#" + encodeURIComponent($title.html()).replace(/%20/g, '+'));
                gtag('send', 'pageview');
            } catch (e) {}
        }


        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').css('opacity', 0).show();

        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').hide().css('opacity', 1);
        var animSpeed = form.animationsSpeed * 4.5;

        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').is('[data-start="1"]')) {
            lfb_initPanelResize(formID);
            animSpeed = form.animationsSpeed * 2.5;
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').fadeIn(form.animationsSpeed * 2);
        } else {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').delay(form.animationsSpeed * 2).fadeIn(form.animationsSpeed * 2);
        }

        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_project').length > 0) {
            var contentForm = lfb_getFormContent(formID);
            var content = contentForm[3];
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_project textarea').val(content);
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_total:not(.gfield_price) input').val(form.price);
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_total.gfield_price .ginput_product_price').html(form.price);
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_total.gfield_price input[id^="ginput_base_price"]').val(form.price);


        }
        if (animSpeed == 0) {
            animSpeed = 100;
        }

        setTimeout(function() {
            $title.css({
                "-webkit-transition": "all 0.3s ease-out",
                "transition": "all 0.3s ease-out"
            }).addClass('positioned');


            $content.css({
                paddingTop: lfb_zeroIfNan($des.height()) + lfb_zeroIfNan($title.height()) + 70
            });
            $content.delay(form.animationsSpeed * 2).animate({
                opacity: 1
            }, form.animationsSpeed);
            $des.delay(form.animationsSpeed).animate({
                opacity: 1,
                top: $des.closest('.lfb_genSlide').find('.lfb_stepTitle').height() + 48
            }, form.animationsSpeed);

            totalBottom.delay(form.animationsSpeed * 2).animate({
                opacity: 1
            }, form.animationsSpeed);


            setTimeout(function() {
                var titleHeight = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_stepTitle').height();

                var heightP = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_genContent').outerHeight() + parseInt($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').css('padding-bottom')) + 102 + titleHeight;

                if (stepID == 'final') {
                    heightP -= 80;
                }

                var animMainPanelSpeed = 300;
                if (form.animationsSpeed == 0) {
                    animMainPanelSpeed = 0;
                }
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').animate({ minHeight: heightP }, animMainPanelSpeed);
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').css('max-height', 'none');
            }, form.animationsSpeed * 2);



            if (!$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').is('.lfb_disabledBtn')) {
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').css('display', 'inline-block').hide();
                setTimeout(function() {
                    if (!$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').is('.lfb_disabledBtn')) {
                        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').fadeIn(500);
                        setTimeout(function() {
                            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').is('.lfb_disabledBtn')) {
                                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').hide();
                            }
                        }, 550);
                    }
                }, form.animationsSpeed * 2);
            } else {
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btn-next').hide();
            }

            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]  #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .datetimepicker').hide();

            if (stepID == 'final') {
                if (activatePaypal) {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns').length == 0) {
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_razorPayCt').length > 0) {
                            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_genContentSlide > .lfb_btnNextContainer').hide();

                        }
                    }
                } else {
                    $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btnNextContainer').fadeIn(500);
                    $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btnNextContainerStripe').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_paymentMethodBtns').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeForm  .lfb_stripeContainer').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeForm .lfb_btnNextContainer').hide();

                }

                if (form.useSignature == 1) {
                    $('#lfb_form[data-form="' + form.formID + '"] #lfb_signature canvas').attr('width', $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_signature').width());
                    $('#lfb_form[data-form="' + form.formID + '"] #lfb_signature canvas').css('width', $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_signature').width());
                    form.signature.signature('clear');
                }
            } else {
                if (form.animationsSpeed == 0) {
                    $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btnNextContainer').show();

                } else {
                    $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_btnNextContainer').fadeIn(500);
                }
            }

            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-previousstepbtn="true"]') && stepID == 'final') {

                setTimeout(function() {
                    var chkBtn = false;
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + stepID + '"] ').find('.lfb_btn-next,#lfb_btnOrderPaypal,#lfb_btnPayStripe,#lfb_btnOrder,#btnOrderRazorpay').each(function() {
                        if ($(this).css('display') != 'none' && $(this).closest('.lfb_btnNextContainer').css('display') != 'none') {
                            chkBtn = true;
                        }
                    });
                    if (chkBtn) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + stepID + '"] ').find('.linkPrevious').css({
                            marginTop: -15
                        });
                    } else {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + stepID + '"] ').find('.linkPrevious').css({
                            marginTop: 24
                        });
                    }
                    if (lfb_lastSteps.length > 0) {
                        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"][data-previousstepbtn="true"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_linkPreviousCt').delay(form.animationsSpeed * 3).fadeIn(500);

                        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"]:not([data-previousstepbtn="true"]) #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_linkPreviousCt').delay(form.animationsSpeed * 3).css({ opacity: 0, display: 'inline-block' }).animate({ opacity: 1 }, 600);
                    }
                }, 1000);

            } else {
                if (lfb_lastSteps.length > 0) {
                    $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"][data-previousstepbtn="true"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_linkPreviousCt').delay(form.animationsSpeed * 3).fadeIn(500);
                    $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"]:not([data-previousstepbtn="true"]) #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_linkPreviousCt').delay(form.animationsSpeed * 3).css({ opacity: 0, display: 'inline-block' }).animate({ opacity: 1 }, 600);

                }
            }


            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_distanceError').delay(form.animationsSpeed * 3).fadeIn(500);


            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                var deviceAgent = navigator.userAgent.toLowerCase();
                var agentID = deviceAgent.match(/(iPad|iPhone|iPod)/i);
                if (agentID) {
                    $content.delay(750).find('[data-toggle="tooltip"]').tooltip({
                        html: true,
                        container: '#lfb_form[data-form="' + formID + '"]',
                        trigger: 'manual'
                    }).on('show.bs.tooltip', function() {
                        $(this).find('.tooltip-inner').css({
                            maxWidth: $(window).width()
                        });
                    });
                } else {
                    $content.delay(750).find('[data-toggle="tooltip"]').tooltip({
                        html: true,
                        container: '#lfb_form[data-form="' + formID + '"]'
                    }).on('show.bs.tooltip', function(t, a) {
                        $('#lfb_form[data-form="' + formID + '"] .tooltip-inner').css({
                            maxWidth: $(window).width() + 'px'
                        });
                    });
                }
                $content.on('enter', function() {
                    if (this.options.trigger == 'hover' && 'ontouchstart' in document.documentElement) {
                        return;
                    }
                });
            }


            setTimeout(function() {

                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide.lfb_activeStep').removeClass('lfb_activeStep');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').addClass('lfb_activeStep');
                $content.find('.lfb_itemQtField').each(function() {
                    if ($(this).parent().next().is('.lfb_itemDes')) {
                        $(this).css({
                            marginTop: 20 + $(this).parent().next().outerHeight()
                        });
                    }
                });
                form.step = stepID;
                setTimeout(function() {
                    lfb_updateStep(formID);

                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('[data-usedistance="true"]').each(function() {
                        lfb_removeDistanceError($(this).attr('data-itemid'), formID);
                    }, 100);
                    $('#lfb_form :not(.ui-slider-handle) > .tooltip').remove();
                    $('body > .tooltip').remove();
                    $('#lfb_form[data-form="' + formID + '"] > .tooltip').remove();


                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').attr('data-currentstep', stepID);
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').trigger('stepChanged');


                }, (form.animationsSpeed * 2) + 550);
                lfb_updatePrice(formID);
                if (form.backFomFinal) {
                    form.backFomFinal = false;
                }

            }, 300);

        }, animSpeed);

        if (form.animationsSpeed == 0) {
            setTimeout(lfb_resizeAll, 500);
        }


        $('#lfb_form :not(.ui-slider-handle) > .tooltip').remove();
        $('body > .tooltip').remove();
        $('#lfb_form[data-form="' + formID + '"] > .tooltip').remove();
        lfb_updatePrice(formID);
        // }
    }

    function lfb_zeroIfNan(value) {
        if (isNaN(value)) {
            return 0;
        } else {
            return value;
        }
    }

    function lfb_findPotentialsSteps(originStepID, formID) {
        var form = lfb_getForm(formID);
        var potentialSteps = new Array();
        var conditionsArray = new Array();
        var noConditionsSteps = new Array();
        var maxConditions = 0;
        jQuery.each(form.links, function() {
            var link = this;

            if (link.originID == originStepID) {
                var error = false;
                var errorOR = true;
                if (link.conditions && link.conditions != "[]") {
                    link.conditionsO = JSON.parse(link.conditions);
                    var errors = lfb_checkConditions(link.conditionsO, formID, originStepID);
                    error = errors.error;
                    errorOR = errors.errorOR;
                } else {
                    noConditionsSteps.push(link.destinationID);
                    errorOR = false;
                }
                if ((link.operator == 'OR' && !errorOR) || (link.operator != 'OR' && !error)) {
                    link.conditionsO = JSON.parse(link.conditions);
                    conditionsArray.push({
                        stepID: parseInt(link.destinationID),
                        nbConditions: link.conditionsO.length
                    });
                    if (link.conditionsO.length > maxConditions) {
                        maxConditions = link.conditionsO.length;
                    }
                    potentialSteps.push(parseInt(link.destinationID));

                }
            }
        });
        if (originStepID == 0) {
            potentialSteps.push(parseInt($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_mainPanel .lfb_genSlide[data-start="1"]').attr('data-stepid')));
        }
        if (potentialSteps.length == 0) {
            potentialSteps.push('final');
        } else if (noConditionsSteps.length > 0 && noConditionsSteps.length < potentialSteps.length) {
            jQuery.each(noConditionsSteps, function() {
                var removeItem = this;
                potentialSteps = jQuery.grep(potentialSteps, function(value) {
                    return value != removeItem;
                });
            });
            if (maxConditions > 0) {
                jQuery.each(potentialSteps, function(stepID) {
                    jQuery.each(conditionsArray, function(condition) {
                        if (condition.stepID == stepID && condition.nbConditions < maxConditions) {
                            potentialSteps = jQuery.grep(potentialSteps, function(value) {
                                return value != stepID;
                            });
                        }
                    });
                });
            }
        }
        return potentialSteps;
    }

    function lfb_checkConditions(conditions, formID, _stepID, onlyPastSteps) {
        var error = false;
        var form = lfb_getForm(formID);
        var errorOR = true;
        if (typeof(onlyPastSteps) == 'undefined') {
            onlyPastSteps = false;
        }

        var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
        if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
            lastAndCurrentSteps.push(parseInt(form.step));
        } else if (form.step == 'final' && jQuery.inArray('final', lastAndCurrentSteps) == -1) {
            lastAndCurrentSteps.push('final');
        }


        jQuery.each(conditions, function() {
            var condition = this;
            if (condition.interaction.substr(0, 1) != '_' && condition.interaction.substr(0, 2) != 'v_') {
                var stepID = condition.interaction.substr(0, condition.interaction.indexOf('_'));
                if (stepID == 0) {
                    stepID = 'final';
                }
                var chkStep = true;
                if (onlyPastSteps) {
                    if (lastAndCurrentSteps.indexOf(parseInt(stepID)) == -1 /*|| stepID == form.step*/ ) {
                        if (condition.action && condition.action == "unclicked") {
                            error = false;
                        } else {
                            error = true;
                        }
                        chkStep = false;
                    }
                }
                if (condition.value && typeof(condition.value) == 'string') {
                    condition.value = condition.value.replace(/&lt;/g, "<");
                    condition.value = condition.value.replace(/&gt;/g, ">");
                }

                if (chkStep) {

                    var itemID = condition.interaction.substr(condition.interaction.indexOf('_') + 1, condition.interaction.length);
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_genContent [data-itemid="' + itemID + '"]').length > 0) {

                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_genContent [data-itemid="' + itemID + '"]');

                        if ($item.is('.lfb_disabled') || $item.closest('.lfb_genSlide').is('.lfb_disabled')) {
                            if (condition.action != "unclicked") {
                                error = true;
                            } else {
                                errorOR = false;
                            }
                        } else {
                            if (condition.value && condition.value.indexOf('_') > -1) {
                                if (condition.value.substr(0, 1) != '_') {
                                    var valueStepID = condition.value.substr(0, condition.value.indexOf('_'));
                                    var attribute = condition.value.substr(condition.value.indexOf('-') + 1, condition.value.length);
                                    if (valueStepID == 0) {
                                        valueStepID = 'final';
                                    }
                                    var valueItemID = condition.value.substr(condition.value.indexOf('_') + 1, condition.value.indexOf('-') - (condition.value.indexOf('_') + 1));
                                    if (valueStepID == 'v') {
                                        condition.value = parseFloat(lfb_getVariableByID(form, valueItemID).value);
                                    } else if (attribute == 'stepqt') {
                                        condition.value = lfb_getStepQuantities(stepID, formID, itemID);
                                    } else {
                                        var $valueItem = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + valueStepID + '"] .lfb_genContent [data-itemid="' + valueItemID + '"]');

                                        if ($valueItem.length > 0) {
                                            if (attribute == '') {
                                                if (typeof($valueItem.data('resprice')) != 'undefined') {
                                                    condition.value = parseFloat($valueItem.data('resprice'));
                                                } else if ($valueItem.is('[data-resqt]')) {
                                                    condition.value = parseFloat($valueItem.attr('data-resqt'));
                                                }
                                            } else if (attribute == 'quantity') {
                                                if ($valueItem.is('.lfb_disabled')) {
                                                    condition.value = 0;
                                                } else {
                                                    if ($valueItem.is('input[type="number"]')) {
                                                        condition.value = $valueItem.val();
                                                    } else {
                                                        if ($valueItem.find('.lfb_qtfield').length > 0) {
                                                            condition.value = parseInt($valueItem.find('.lfb_qtfield').val());
                                                        } else {
                                                            condition.value = parseInt($valueItem.find('.icon_quantity').html());
                                                        }

                                                    }
                                                }
                                            } else if (attribute == 'value') {
                                                if ($valueItem.is('.lfb_disabled')) {
                                                    condition.value = '';
                                                } else {

                                                    condition.value = $valueItem.val();

                                                    if ($valueItem.is('.lfb_datepicker')) {
                                                        condition.value = moment.utc($valueItem.datetimepicker("getDate")).format('YYYY-MM-DD');
                                                    }
                                                    condition.value = condition.value.replace(/\`/g, "'");
                                                }
                                            }
                                        }
                                    }
                                } else {

                                    if (condition.value == '_total' || condition.value == '_total-') {
                                        condition.value = form.price;
                                    } else if (condition.value == '_total_qt') {
                                        condition.value = lfb_getTotalQuantities(formID, _stepID, itemID);
                                    }
                                }

                            } else if (condition.value) {
                                condition.value = condition.value.replace(/\`/g, "'");
                            }
                            switch (condition.action) {
                                case "clicked":
                                    if ($item.closest('.lfb_itemBloc').is('.lfb_disabled')) {
                                        error = true;
                                    } else {

                                        if ($item.is('[type="checkbox"]')) {
                                            if (!$item.is(':checked')) {
                                                error = true;
                                            }
                                            if ($item.is(':checked')) {
                                                errorOR = false;
                                            }
                                        } else {
                                            if (!$item.is('.checked') && !$item.is(':checked')) {
                                                error = true;
                                            }
                                            if ($item.is('.checked') || $item.is(':checked')) {
                                                errorOR = false;
                                            }
                                        }
                                    }
                                    break;
                                case "unclicked":
                                    if ($item.closest('.lfb_itemBloc').is('.lfb_disabled')) {
                                        errorOR = false;
                                        error = false;
                                    } else {
                                        if ($item.is(':not([type="checkbox"]).checked') || $item.is(':checked')) {
                                            error = true;
                                        }
                                        if (!$item.is(':not([type="checkbox"]).checked') && !$item.is(':checked')) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "filled":
                                    if ($item.is('.lfb_dropzone')) {
                                        if ($item.find('.dz-preview[data-file].dz-success.dz-complete').length == 0) {
                                            error = true;
                                        } else {
                                            errorOR = false;
                                        }
                                    } else {
                                        if ($item.val().length == 0) {
                                            error = true;
                                        } else {
                                            errorOR = false;
                                        }
                                    }

                                    break;
                                case "equal":
                                    if ($item.is('.lfb_datepicker')) {
                                        if ($item.is('[data-datetype="date"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') != condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') == condition.value) {
                                                errorOR = false;
                                            }
                                        } else if ($item.is('[data-datetype="time"]')) {
                                            if (moment($item.datetimepicker("getDate")).format('HH:mm') != condition.value) {
                                                error = true;
                                            }
                                            if (moment($item.datetimepicker("getDate")).format('HH:mm') == condition.value) {
                                                errorOR = false;
                                            }
                                        } else {
                                            if (!moment.utc($item.datetimepicker("getDate")).isSame(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).isSame(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                errorOR = false;
                                            }
                                        }
                                    } else {
                                        if ($item.val() != condition.value) {
                                            error = true;
                                        } else {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "different":
                                    if ($item.val() == condition.value) {
                                        error = true;
                                    } else {
                                        errorOR = false;
                                    }
                                    break;
                                case "PriceSuperior":
                                    var price = parseFloat($item.data('resprice'));
                                    if ($item.is('.lfb_button:not(.checked)') || $item.is('.lfb_selectable:not(.checked)') || $item.is('input[type=checkbox]:not(:checked)') || price <= condition.value) {
                                        error = true;
                                    }
                                    if (($item.is('.checked') || $item.is(':checked')) && price > condition.value) {
                                        errorOR = false;
                                    }
                                    break;
                                case "PriceInferior":
                                    var price = parseFloat($item.data('resprice'));
                                    if ($item.is('.lfb_button:not(.checked)') || $item.is('.lfb_selectable:not(.checked)') || $item.is('input[type=checkbox]:not(:checked)') || price >= condition.value) {
                                        error = true;
                                    }
                                    if (($item.is('.checked') || $item.is(':checked')) && price < condition.value) {
                                        errorOR = false;
                                    }
                                    break;
                                case "PriceEqual":
                                    var price = parseFloat($item.data('resprice'));
                                    if ($item.is('.lfb_button:not(.checked)') || $item.is('.lfb_selectable:not(.checked)') || $item.is('input[type=checkbox]:not(:checked)') || price != condition.value) {
                                        error = true;
                                    }
                                    if (($item.is('.checked') || $item.is(':checked')) && price == condition.value) {
                                        errorOR = false;
                                    }
                                    break;
                                case "PriceDifferent":
                                    var price = parseFloat($item.data('resprice'));
                                    if ($item.is('.lfb_button:not(.checked)') || $item.is('.lfb_selectable:not(.checked)') || $item.is('input[type=checkbox]:not(:checked)') || price == condition.value) {
                                        error = true;
                                    }
                                    if (($item.is('.checked') || $item.is(':checked')) && price != condition.value) {
                                        errorOR = false;
                                    }
                                    break;
                                case "QtSuperior":
                                    if ($item.is('.lfb_selectable:not(.checked)') || ($item.find('.icon_quantity').length > 0 && parseInt($item.find('.icon_quantity').html()) <= condition.value) || ($item.find('.lfb_qtfield').length > 0 && parseInt($item.find('.lfb_qtfield').val()) <= condition.value) || ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) <= condition.value)) {

                                        error = true;
                                    }
                                    if ($item.is('.lfb_selectable')) {
                                        if ($item.is('.lfb_selectable.checked') && (parseInt($item.find('.icon_quantity').html()) > condition.value) || (parseInt($item.find('.lfb_qtfield').val()) > condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) > condition.value) {
                                        errorOR = false;
                                    }
                                    if ($item.is('input')) {
                                        if (parseInt($item.val()) <= condition.value) {
                                            error = true;
                                        }
                                        if (parseInt($item.val()) > condition.value) {
                                            errorOR = false;
                                        }
                                    }

                                    break;
                                case "QtInferior":
                                    if ($item.is('.lfb_selectable:not(.checked)') || ($item.find('.icon_quantity').length > 0 && parseInt($item.find('.icon_quantity').html()) >= condition.value) || ($item.find('.lfb_qtfield').length > 0 && parseInt($item.find('.lfb_qtfield').val()) >= condition.value) || ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) >= condition.value)) {
                                        error = true;
                                    }
                                    if ($item.is('.lfb_selectable')) {
                                        if ($item.is('.lfb_selectable.checked') && (parseInt($item.find('.icon_quantity').html()) < condition.value) || (parseInt($item.find('.lfb_qtfield').val()) < condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) < condition.value) {
                                        errorOR = false;
                                    }
                                    if ($item.is('input')) {
                                        if (parseInt($item.val()) >= condition.value) {
                                            error = true;
                                        }
                                        if (parseInt($item.val()) < condition.value) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "QtEqual":
                                    if ($item.is('.lfb_selectable:not(.checked)') || ($item.find('.icon_quantity').length > 0 && parseInt($item.find('.icon_quantity').html()) != condition.value) || ($item.find('.lfb_qtfield').length > 0 && parseInt($item.find('.lfb_qtfield').val()) != condition.value) || ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) != condition.value)) {
                                        error = true;
                                    }
                                    if ($item.is('.lfb_selectable')) {
                                        if ($item.is('.lfb_selectable.checked') && (parseInt($item.find('.icon_quantity').html()) == condition.value) || (parseInt($item.find('.lfb_qtfield').val()) == condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) == condition.value) {
                                        errorOR = false;
                                    }
                                    if ($item.is('input')) {
                                        if (parseInt($item.val()) != condition.value) {
                                            error = true;
                                        }
                                        if (parseInt($item.val()) == condition.value) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "QtDifferent":
                                    if ($item.is('.lfb_selectable:not(.checked)') || ($item.find('.icon_quantity').length > 0 && parseInt($item.find('.icon_quantity').html()) == condition.value) || ($item.find('.lfb_qtfield').length > 0 && parseInt($item.find('.lfb_qtfield').val()) == condition.value) || ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) == condition.value)) {
                                        error = true;
                                    }
                                    if ($item.is('.lfb_selectable')) {
                                        if ($item.is('.lfb_selectable.checked') && (parseInt($item.find('.icon_quantity').html()) != condition.value) || (parseInt($item.find('.lfb_qtfield').val()) != condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-type="slider"]') && $item.is('.ui-slider') && parseInt($item.slider("value")) != condition.value) {
                                        errorOR = false;
                                    }
                                    if ($item.is('input')) {
                                        if (parseInt($item.val()) == condition.value) {
                                            error = true;
                                        }
                                        if (parseInt($item.val()) != condition.value) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "superior":
                                    if ($item.is('.lfb_datepicker')) {
                                        if ($item.is('[data-datetype="date"]')) {
                                            if (moment($item.datetimepicker("getDate")).format('YYYY-MM-DD 00:00') <= moment(condition.value).format('YYYY-MM-DD 00:00')) {
                                                error = true;
                                            }
                                            if (moment($item.datetimepicker("getDate")).format('YYYY-MM-DD 00:00') > moment(condition.value).format('YYYY-MM-DD 00:00')) {
                                                errorOR = false;
                                            }
                                        } else if ($item.is('[data-datetype="time"]')) {
                                            if (moment($item.datetimepicker("getDate")).format('HH:mm') <= condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') > condition.value) {
                                                errorOR = false;
                                            }
                                        } else {
                                            if (moment.utc($item.datetimepicker("getDate")).isSameOrBefore(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).isAfter(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                errorOR = false;
                                            }
                                        }
                                    } else if ($item.is('.lfb_timepicker')) {
                                        var valueHour = parseInt(condition.value.substr(0, condition.value.indexOf(':')));
                                        var valueMins = parseInt(condition.value.substr(condition.value.indexOf(':') + 1, 2));
                                        if (condition.value.indexOf('PM') > 0 && valueHour != 12) {
                                            valueHour += 12;
                                        }
                                        var itemHour = parseInt($item.val().substr(0, $item.val().indexOf(':')));
                                        var itemMins = parseInt($item.val().substr($item.val().indexOf(':') + 1, 2));
                                        if ($item.val().indexOf('PM') > 0 && itemHour != 12) {
                                            itemHour += 12;
                                        }
                                        if (itemHour < valueHour || (itemHour == valueHour && itemMins <= valueMins)) {
                                            error = true;
                                        }
                                        if (itemHour > valueHour || (itemHour == valueHour && itemMins > valueMins)) {
                                            errorOR = false;
                                        }

                                    } else if ($item.is('input[type="number"]')) {
                                        if (parseFloat($item.val()) <= parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.val()) > parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-itemtype="rate"]')) {
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) <= parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) > parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "inferior":
                                    if ($item.is('.lfb_datepicker')) {
                                        if ($item.is('[data-datetype="date"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') >= condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') < condition.value) {
                                                errorOR = false;
                                            }
                                        } else if ($item.is('[data-datetype="time"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') >= condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') < condition.value) {
                                                errorOR = false;
                                            }
                                        } else {
                                            /*   if (moment.utc($item.datetimepicker("getDate")).isSameOrAfter(moment.utc(condition.value).toDate().getTime())) {
                                                   error = true;
                                               }
                                               if (moment.utc($item.datetimepicker("getDate")).isBefore(moment.utc(condition.value).toDate().getTime())) {
                                                   errorOR = false;
                                               }*/
                                            if (moment.utc($item.datetimepicker("getDate")).isSameOrAfter(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).isBefore(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                errorOR = false;
                                            }
                                        }
                                    } else if ($item.is('.lfb_timepicker')) {
                                        var valueHour = parseInt(condition.value.substr(0, condition.value.indexOf(':')));
                                        var valueMins = parseInt(condition.value.substr(condition.value.indexOf(':') + 1, 2));
                                        if (condition.value.indexOf('PM') > 0 && valueHour != 12) {
                                            valueHour += 12;
                                        }
                                        var itemHour = parseInt($item.val().substr(0, $item.val().indexOf(':')));
                                        var itemMins = parseInt($item.val().substr($item.val().indexOf(':') + 1, 2));
                                        if ($item.val().indexOf('PM') > 0 && itemHour != 12) {
                                            itemHour += 12;
                                        }
                                        if (itemHour > valueHour || (itemHour == valueHour && itemMins >= valueMins)) {
                                            error = true;
                                        }
                                        if (itemHour < valueHour || (itemHour == valueHour && itemMins < valueMins)) {
                                            errorOR = false;
                                        }

                                    } else if ($item.is('input[type="number"]')) {
                                        if (parseFloat($item.val()) >= parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.val()) < parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-itemtype="rate"]')) {
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) >= parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) < parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "equal":
                                    if ($item.is('.lfb_datepicker')) {
                                        if ($item.is('[data-datetype="date"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') != condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') == condition.value) {
                                                errorOR = false;
                                            }
                                        } else if ($item.is('[data-datetype="time"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') != condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') == condition.value) {
                                                errorOR = false;
                                            }
                                        } else {
                                            if (!moment.utc($item.datetimepicker("getDate")).isSame(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).isSame(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                errorOR = false;
                                            }
                                        }
                                    } else if ($item.is('.lfb_timepicker')) {
                                        var valueHour = parseInt(condition.value.substr(0, condition.value.indexOf(':')));
                                        var valueMins = parseInt(condition.value.substr(condition.value.indexOf(':') + 1, 2));
                                        if (condition.value.indexOf('PM') > 0 && valueHour != 12) {
                                            valueHour += 12;
                                        }
                                        var itemHour = parseInt($item.val().substr(0, $item.val().indexOf(':')));
                                        var itemMins = parseInt($item.val().substr($item.val().indexOf(':') + 1, 2));
                                        if ($item.val().indexOf('PM') > 0 && itemHour != 12) {
                                            itemHour += 12;
                                        }
                                        if (itemHour != valueHour) {
                                            error = true;
                                        }
                                        if (itemHour == valueHour) {
                                            errorOR = false;
                                        }

                                    } else if ($item.is('input[type="number"]')) {
                                        if (parseFloat($item.val()) != parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.val()) == parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-itemtype="rate"]')) {
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) != parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) == parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                                case "different":
                                    if ($item.is('.lfb_datepicker')) {
                                        if ($item.is('[data-datetype="date"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') == condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD') != condition.value) {
                                                errorOR = false;
                                            }
                                        } else if ($item.is('[data-datetype="time"]')) {
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') == condition.value) {
                                                error = true;
                                            }
                                            if (moment.utc($item.datetimepicker("getDate")).format('HH:mm') != condition.value) {
                                                errorOR = false;
                                            }
                                        } else {
                                            if (moment.utc($item.datetimepicker("getDate")).isSame(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                error = true;
                                            }
                                            if (!moment.utc($item.datetimepicker("getDate")).isSame(moment.utc(condition.value).format('YYYY-MM-DD HH:mm'))) {
                                                errorOR = false;
                                            }
                                        }
                                    } else if ($item.is('.lfb_timepicker')) {
                                        var valueHour = parseInt(condition.value.substr(0, condition.value.indexOf(':')));
                                        var valueMins = parseInt(condition.value.substr(condition.value.indexOf(':') + 1, 2));
                                        if (condition.value.indexOf('PM') > 0 && valueHour != 12) {
                                            valueHour += 12;
                                        }
                                        var itemHour = parseInt($item.val().substr(0, $item.val().indexOf(':')));
                                        var itemMins = parseInt($item.val().substr($item.val().indexOf(':') + 1, 2));
                                        if ($item.val().indexOf('PM') > 0 && itemHour != 12) {
                                            itemHour += 12;
                                        }
                                        if (itemHour == valueHour) {
                                            error = true;
                                        }
                                        if (itemHour != valueHour) {
                                            errorOR = false;
                                        }

                                    } else if ($item.is('input[type="number"]')) {
                                        if (parseFloat($item.val()) == parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.val()) != parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    } else if ($item.is('[data-itemtype="rate"]')) {
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) == parseFloat(condition.value)) {
                                            error = true;
                                        }
                                        if (parseFloat($item.find('.lfb_rate').rate('getValue')) != parseFloat(condition.value)) {
                                            errorOR = false;
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            } else {
                if (condition.interaction.substr(0, 2) == 'v_') {
                    var valueItemID = condition.interaction.substr(condition.interaction.indexOf('_') + 1, condition.interaction.length - (condition.interaction.indexOf('_') + 1));
                    var variableValue = parseFloat(lfb_getVariableByID(form, valueItemID).value);
                    if (lfb_getVariableByID(form, valueItemID).type == 'text') {
                        variableValue = lfb_getVariableByID(form, valueItemID).value;
                    }


                    if (condition.value && condition.value.indexOf('_') > -1) {
                        if (condition.value.substr(0, 1) != '_') {
                            var valueStepID = condition.value.substr(0, condition.value.indexOf('_'));
                            var attribute = condition.value.substr(condition.value.indexOf('-') + 1, condition.value.length);
                            if (valueStepID == 0) {
                                valueStepID = 'final';
                            }
                            var valueItemID = condition.value.substr(condition.value.indexOf('_') + 1, condition.value.indexOf('-') - (condition.value.indexOf('_') + 1));
                            if (valueStepID == 'v') {
                                condition.value = parseFloat(lfb_getVariableByID(form, valueItemID).value);
                            } else if (attribute == 'stepqt') {
                                condition.value = lfb_getStepQuantities(stepID, formID, itemID);
                            } else {
                                var $valueItem = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + valueStepID + '"] .lfb_genContent [data-itemid="' + valueItemID + '"]');

                                if ($valueItem.length > 0) {
                                    if (attribute == '') {
                                        if (typeof($valueItem.data('resprice')) != 'undefined') {
                                            condition.value = parseFloat($valueItem.data('resprice'));
                                        } else if ($valueItem.is('[data-resqt]')) {
                                            condition.value = parseFloat($valueItem.attr('data-resqt'));
                                        }
                                    } else if (attribute == 'quantity') {
                                        if ($valueItem.is('.lfb_disabled')) {
                                            condition.value = 0;
                                        } else {
                                            if ($valueItem.is('input[type="number"]')) {
                                                condition.value = $valueItem.val();
                                            } else {
                                                if ($valueItem.find('.lfb_qtfield').length > 0) {
                                                    condition.value = parseInt($valueItem.find('.lfb_qtfield').val());
                                                } else {
                                                    condition.value = parseInt($valueItem.find('.icon_quantity').html());
                                                }

                                            }
                                        }
                                    } else if (attribute == 'value') {
                                        if ($valueItem.is('.lfb_disabled')) {
                                            condition.value = '';
                                        } else {

                                            condition.value = $valueItem.val();

                                            if ($valueItem.is('.lfb_datepicker')) {
                                                condition.value = moment.utc($valueItem.datetimepicker("getDate")).format('YYYY-MM-DD');
                                            }
                                            condition.value = condition.value.replace(/\`/g, "'");
                                        }
                                    }
                                }
                            }
                        } else {

                            if (condition.value == '_total' || condition.value == '_total-') {
                                condition.value = form.price;
                            } else if (condition.value == '_total_qt') {
                                condition.value = lfb_getTotalQuantities(formID, _stepID, itemID);
                            }
                        }

                    } else if (condition.value) {
                        condition.value = condition.value.replace(/\`/g, "'");
                    }



                    switch (condition.action) {
                        case "superior":
                            if (variableValue <= condition.value) {
                                error = true;
                            }
                            if (variableValue > condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "inferior":
                            if (variableValue >= condition.value) {
                                error = true;
                            }
                            if (variableValue < condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "equal":
                            if (variableValue != condition.value) {
                                error = true;
                            }
                            if (variableValue == condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "different":
                            if (variableValue == condition.value) {
                                error = true;
                            }
                            if (variableValue != condition.value) {
                                errorOR = false;
                            }
                            break;
                    }

                } else if (condition.interaction && condition.interaction.length > 6 && condition.interaction.substr(0, 6) == '_step-') {
                    var stepID = condition.interaction.substr(6, condition.interaction.length);
                    if (stepID == 0) {
                        stepID = 'final';
                    }
                    var totalQt = lfb_getStepQuantities(formID, stepID, itemID);

                    switch (condition.action) {
                        case "superior":
                            if (totalQt <= condition.value) {
                                error = true;
                            }
                            if (totalQt > condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "inferior":
                            if (totalQt >= condition.value) {
                                error = true;
                            }
                            if (totalQt < condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "equal":
                            if (totalQt != condition.value) {
                                error = true;
                            }
                            if (totalQt == condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "different":
                            if (totalQt == condition.value) {
                                error = true;
                            }
                            if (totalQt != condition.value) {
                                errorOR = false;
                            }
                            break;
                    }

                }
                if (condition.interaction == "_total") {
                    switch (condition.action) {
                        case "superior":
                            if (parseFloat(form.price) <= parseFloat(condition.value)) {
                                error = true;
                            }
                            if (parseFloat(form.price) > parseFloat(condition.value)) {
                                errorOR = false;
                            }
                            break;
                        case "inferior":
                            if (parseFloat(form.price) >= parseFloat(condition.value)) {
                                error = true;
                            }
                            if (parseFloat(form.price) < parseFloat(condition.value)) {
                                errorOR = false;
                            }
                            break;
                        case "equal":
                            if (parseFloat(form.price) != parseFloat(condition.value)) {
                                error = true;
                            }
                            if (parseFloat(form.price) == parseFloat(condition.value)) {
                                errorOR = false;
                            }
                            break;
                        case "different":
                            if (parseFloat(form.price) == condition.value) {
                                error = true;
                            }
                            if (parseFloat(form.price) != condition.value) {
                                errorOR = false;
                            }
                            break;
                    }
                } else if (condition.interaction == "_total_qt") {
                    var totalQt = lfb_getTotalQuantities(formID, _stepID);
                    switch (condition.action) {
                        case "superior":
                            if (totalQt <= condition.value) {
                                error = true;
                            }
                            if (totalQt > condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "inferior":
                            if (totalQt >= condition.value) {
                                error = true;
                            }
                            if (totalQt < condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "equal":
                            if (totalQt != condition.value) {
                                error = true;
                            }
                            if (totalQt == condition.value) {
                                errorOR = false;
                            }
                            break;
                        case "different":
                            if (totalQt == condition.value) {
                                error = true;
                            }
                            if (totalQt != condition.value) {
                                errorOR = false;
                            }
                            break;
                    }
                }
            }
        });

        if (conditions.length == 0) {
            errorOR = false;
        }
        return {
            error: error,
            errorOR: errorOR
        };
    }

    function lfb_scrollToItem($item, stepID, formID) {

        //if (stepID == 'final') {
            var form = lfb_getForm(formID);
            if (form.disableScroll != 1) {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen') || $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_popup')) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                        scrollTop: $item.parent().offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                    }, form.animationsSpeed * 2);
                } else {
                    if (form.scrollTopPage == '1') {
                        $('body,html').animate({
                            scrollTop: 0
                        }, form.animationsSpeed * 2);
                    } else {
                        $('body,html').animate({
                            scrollTop: $item.parent().offset().top - (80 + parseInt(lfb_getScrollTopMargin(form)))
                        }, form.animationsSpeed * 2);
                    }
                }
            }

     //   }
    }

    function lfb_checkStepItemsValid(stepID, formID) {
        var chkSelectionitem = true;
        var chkError = false;
        var form = lfb_getForm(formID);
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.has-error').removeClass('has-error');
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.icon_select.lfb_error').removeClass('lfb_error');
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('input[type=text]:not(.lfb_disabled),input[type=password]:not(.lfb_disabled),select').each(function() {
            if ($(this).closest('.lfb_itemBloc.lfb_disabled').length == 0) {
                if ($(this).closest('#lfb_stripeForm').length == 0 && $(this).closest('#lfb_paypalForm').length == 0) {
                    if ($(this).is('[data-required="true"]') && $(this).val().length < 1) {

                        chkSelectionitem = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                        chkError = true;
                    }
                    if ($(this).is('[data-validation="phone"]') && $(this).val().length > 0 && ($(this).val().length < 5 || /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i.test($(this).val()) == false)) {
                        chkSelectionitem = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                        chkError = true;
                    } else if ($(this).is('[data-validation="number"]') && /^\d+$/.test($(this).val()) == false) {
                        chkSelectionitem = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                        chkError = true;
                    } else if ($(this).is('[data-validation="email"]') && $(this).val().length > 0 && !lfb_checkEmail($(this).val())) {
                        chkSelectionitem = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                        chkError = true;
                    } else if ($(this).is('[data-validation="fill"]') && $(this).val().length == 0) {
                        chkSelectionitem = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                        chkError = true;
                    } else if ($(this).is('[data-validation="custom"]') && $(this).val().length > 0) {
                        var error = false;
                        if (parseInt($(this).attr('data-validmin')) > 0 && $(this).val().length < parseInt($(this).attr('data-validmin'))) {
                            error = true;
                        }
                        if (parseInt($(this).attr('data-validmax')) > 0 && $(this).val().length > parseInt($(this).attr('data-validmax'))) {
                            error = true;
                        }
                        if ($(this).is('[data-validcar]') && $(this).attr('data-validcar') != "") {
                            var field = $(this);
                            if ($(this).attr('data-validcar').indexOf(',') > -1) {
                                var chars = $(this).attr('data-validcar').split(',');
                                jQuery.each(chars, function() {
                                    if (field.val().indexOf(this) == -1) {
                                        error = true;
                                    }
                                });
                            } else {
                                if (field.val().indexOf($(this).attr('data-validcar')) == -1) {
                                    error = true;
                                }
                            }
                        }
                        if (error) {
                            chkSelectionitem = false;
                            $(this).closest('.form-group').addClass('has-error');
                            if (!chkError) {
                                lfb_scrollToItem($(this), stepID, formID);
                            }
                            chkError = true;
                        }
                    }
                }
            }
        });

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('input[type=text][minlength]:not(.lfb_disabled)').each(function() {
            if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                if ($(this).val().length < $(this).attr('minlength')) {
                    chkSelectionitem = false;
                    $(this).closest('.form-group').addClass('has-error');
                    if (!chkError) {
                        lfb_scrollToItem($(this), stepID, formID);
                    }
                }
            }
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('select[data-required="true"]:not(.lfb_disabled)').each(function() {
            if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                if ($(this).is('[data-firstvaluedisabled="true"]') && ((!$(this).is('.lfb_selectpicker') && $(this).find("option:selected").index() == 0) || (($(this).is('.lfb_selectpicker') && $(this).val() == $(this).find("option").first().attr('value'))))) {
                    chkSelectionitem = false;
                    $(this).closest('.form-group').addClass('has-error');
                    if (!chkError) {
                        lfb_scrollToItem($(this), stepID, formID);
                    }
                }
            }
        });



        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('input[type=text][minlength]:not(.lfb_disabled)').each(function() {
            if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                if ($(this).val().length < $(this).attr('minlength')) {
                    chkSelectionitem = false;
                    $(this).closest('.form-group').addClass('has-error');
                    if (!chkError) {
                        lfb_scrollToItem($(this), stepID, formID);
                    }
                }
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('input[type=number][data-required="true"]:not(.lfb_disabled)').each(function() {
            if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                if ($(this).val() == '' || $(this).val() == 0) {
                    chkSelectionitem = false;
                    $(this).closest('.form-group').addClass('has-error');
                    if (!chkError) {
                        lfb_scrollToItem($(this), stepID, formID);
                    }
                }
            }
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.lfb_dropzone:not(.lfb_disabled)').each(function() {
            if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                if ($(this).is('[data-required="true"]') && $(this).find('.dz-preview[data-file].dz-success.dz-complete').length == 0) {
                    chkSelectionitem = false;
                    $(this).parent().addClass('has-error');
                    if (!chkError) {
                        lfb_scrollToItem($(this), stepID, formID);
                    }
                } else if ($(this).find('.dz-preview[data-file].dz-complete').length > parseInt($(this).attr('data-maxfiles'))) {
                    chkSelectionitem = false;
                    $(this).parent().addClass('has-error');
                    if (!chkError) {
                        lfb_scrollToItem($(this), stepID, formID);
                    }
                }
            }

        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('textarea[data-required="true"]:not(.lfb_disabled)').each(function() {
            if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                if ($(this).closest('#lfb_stripeForm').length == 0 && $(this).closest('#lfb_paypalForm').length == 0) {
                    if ($(this).val().length < 1) {
                        chkSelectionitem = false;
                        $(this).closest('.form-group').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                    }
                }
            }
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('input[type=checkbox][data-required="true"]:not(.lfb_disabled)').each(function() {
            if (!$(this).is(':checked')) {

                if (!$(this).is('[data-group]') || ($(this).attr('data-group') != '' &&
                        $(' #lfb_form[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] [data-group="' + $(this).attr('data-group') + '"]:checked').length == 0)) {
                    if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                        chkSelectionitem = false;
                        $(this).closest('.form-group,p,.lfb_itemBloc').addClass('has-error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                    }
                }
            }
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.lfb_selectable[data-required="true"]:not(.lfb_disabled)').each(function() {
            if (!$(this).is('.checked')) {


                if (!$(this).is('[data-group]') || ($(this).attr('data-group') != '' &&
                        $(' #lfb_form[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] [data-group="' + $(this).attr('data-group') + '"].checked').length == 0)) {
                    if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                        chkSelectionitem = false;
                        $(this).find('.icon_select').addClass('lfb_error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                    }
                }
            }
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').find('.lfb_button[data-required="true"]:not(.lfb_disabled)').each(function() {
            if (!$(this).is('.checked')) {
                if (!$(this).is('[data-group]') || ($(this).attr('data-group') != '' &&
                        $(' #lfb_form[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] [data-group="' + $(this).attr('data-group') + '"].checked').length == 0)) {
                    if ($(this).closest('.lfb_row.lfb_disabled').length == 0) {
                        chkSelectionitem = false;
                        $(this).find('.icon_select').addClass('lfb_error');
                        if (!chkError) {
                            lfb_scrollToItem($(this), stepID, formID);
                        }
                    }
                }
            }
        });
        if (stepID == 'final' && form.useSignature == 1) {
            var jsonSign = JSON.parse(form.signature.signature('toJSON'));
            if (jsonSign.lines.length == 0) {
                chkSelectionitem = false;
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_signature').addClass('has-error');
                if (!chkError) {
                    lfb_scrollToItem($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_signature'), stepID, formID);
                }
                chkError = true;
            }
        }
        return chkSelectionitem;
    }

    function lfb_nextStep(formID) {
        var form = lfb_getForm(formID);
        $('#lfb_bootstraped :not(.ui-slider-handle) > .tooltip').remove();
        $('#lfb_form[data-form="' + form.formID + '"] > .tooltip').remove();
        var deviceAgent = navigator.userAgent.toLowerCase();
        var agentID = deviceAgent.match(/(iPad|iPhone|iPod)/i);
        if (agentID) {
            setTimeout(function() {
                $('#lfb_bootstraped :not(.ui-slider-handle) > .tooltip').remove();
            }, 500);
        }

        lfb_updateShowSteps(formID);
        $('.lfb_errorMsg').hide();
        var chkSelection = true;
        var chkSelectionitem = true;
        var maxConditions = 0;

        var potentialSteps = lfb_findPotentialsSteps(form.step, formID);

        if (form.step > 0) {
            if ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').data('required') == true) {
                chkSelection = false;
                if (($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('select:not(.lfb_disabled):not([data-firstvaluedisabled="true"])').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('div.lfb_selectable.checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('a.lfb_button.checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('input[data-toggle="switch"]:checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('input[type=text][data-title].checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('[data-itemtype="rate"][data-title].checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('input[type=number][data-itemid].checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('input[type=file].checked:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_colorPreview:not(.lfb_disabled)').length > 0) ||
                    ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.dz-preview[data-file].dz-success.dz-complete').length > 0)) {
                    chkSelection = true;
                }


                if (!chkSelection) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('select:not(.lfb_disabled)[data-firstvaluedisabled="true"]').each(function() {
                        if (((!$(this).is('.lfb_selectpicker') && $(this).find("option:selected").index() > 0) || (($(this).is('.lfb_selectpicker') && $(this).find("option:selected").index() > 1)))) {
                            chkSelection = true;
                        }
                    });
                }
            }
            chkSelectionitem = lfb_checkStepItemsValid(form.step, formID);
        }

        if (chkSelection && chkSelectionitem && lfb_checkUserEmail(form)) {

            lfb_lastStepID = form.step;
            if ((parseFloat(lfb_lastStepID) == parseInt(lfb_lastStepID)) && !isNaN(lfb_lastStepID)) {
                if (jQuery.inArray(parseInt(form.step), lfb_lastSteps) == -1) {
                    lfb_lastSteps.push(parseInt(form.step));
                }
            }
            var title = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + lfb_lastStepID + '"] .lfb_stepTitle').html();
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_fullscreen') && !$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_popup')) {
                history.pushState({ id: lfb_lastStepID }, '', '');
            }
            var nextStepID = potentialSteps[0];
            if (nextStepID != 'final') {
                nextStepID = lfb_getNextEnabledStep(formID, potentialSteps);
                if (nextStepID == -1) {
                    nextStepID = 'final';
                }
            }
            if (form.sendContactASAP == 1 && $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"]').length > 0 &&
                lfb_checkEmail($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"]').val())) {
                form.contactSent = 1;
                var infosCt = lfb_getContactInformations(formID);
                jQuery.ajax({
                    url: form.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'lfb_sendCt',
                        formID: formID,
                        email: infosCt['email'],
                        lastName: infosCt['lastName'],
                        firstName: infosCt['firstName'],
                        phone: infosCt['phone'],
                        country: infosCt['country'],
                        zip: infosCt['zip'],
                        state: infosCt['state'],
                        city: infosCt['city'],
                        address: infosCt['address']
                    },
                    success: function(rep) {}
                });
            }
            lfb_changeStep(nextStepID, formID);
        } else if (!chkSelection) {
            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_errorMsg').slideDown();
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').trigger('stepError');
        }
    }

    function lfb_getNextEnabledStep(formID, potentialSteps) {
        var rep = -1;
        var stepID = potentialSteps[0];
        if (stepID != 'final') {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_visualEditing')) {
                rep = stepID;
            } else {
                if (!$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"]').is('.lfb_disabled') &&
                    ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_item:not(.lfb_row ):not(.lfb-hidden)').length > 0 ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + stepID + '"] .lfb_distanceError').length > 0)) {
                    rep = stepID;
                } else {
                    lfb_lastSteps.push(parseInt(stepID));
                    lfb_updatePrice(formID);
                    rep = lfb_getNextEnabledStep(formID, lfb_findPotentialsSteps(parseInt(stepID), formID));
                }
            }
        }

        return rep;
    }

    function lfb_openGenerator(formID) {
        var form = lfb_getForm(formID);

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #startInfos').addClass('lfb_loaded');
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #startInfos > p').slideDown();
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnFloatingSummary').css({
            display: 'inline-block'
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').css({
            display: 'inline-block'
        });

        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnStart').parent().fadeOut(form.animationsSpeed);
        setTimeout(function() {
            if (form.showSteps != '2') {
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').find('.genPrice,#lfb_stepper').fadeIn(form.animationsSpeed);
            }
            if (!form.autoStart) {
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').show();
                setTimeout(function() {
                    lfb_nextStep(formID);
                }, form.animationsSpeed + form.animationsSpeed / 2);
            }
        }, form.animationsSpeed);
    }

    function lfb_initListeners(formID) {
        var form = lfb_getForm(formID);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').on('lfb_setAnimImmediate', lfb_setAnimImmediate);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').on('lfb_resizeAll', lfb_resizeAll);

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide div.lfb_selectable .img,  #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide div.lfb_selectable .icon_select').on('click', function() {
            if (!lfb_isSelectionMode(formID)) {
                lfb_itemClick($(this).parent(), true, formID);
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide a.lfb_button').on('click', function() {
            if (!lfb_isSelectionMode(formID)) {
                lfb_itemClick($(this), true, formID);
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-callnextstep="1"]').on('click', function() {
            if (!lfb_isSelectionMode(formID) && $(this).is('.checked')) {
                lfb_nextStep(formID);
            }
        });

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel input[type=checkbox][data-price]').on('change', function() {
            if ($(this).is('[data-usedistance="true"]')) {
                lfb_removeDistanceError($(this).attr('data-itemid'), formID);
            }
            var $this = $(this);
            if ($this.data('group')) {

                $this.closest('.lfb_genSlide').find('a.lfb_button.checked[data-group="' + $this.data('group') + '"]:not([data-itemid="' + $this.attr('data-itemid') + '"])').each(function() {

                    lfb_itemClick($(this), false, formID);
                    $(this).removeClass('checked');
                });

            }

            lfb_updatePrice(formID, $(this).attr('data-itemid'));



        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel input[type=checkbox][data-group]').on('change', function(e) {
            var clickedInput = $(this);
            if (clickedInput.is(':checked')) {
                $(this).closest('.lfb_genSlide').find('div.lfb_selectable.checked[data-group="' + clickedInput.data('group') + '"]').each(function() {
                    lfb_itemClick($(this), false, formID);
                });
                $(this).closest('.lfb_genSlide').find('input[type=checkbox][data-group="' + clickedInput.data('group') + '"]:checked').each(function() {
                    if (!$(this).is(clickedInput)) {
                        $(this).trigger('click.auto');
                    }
                });

                if ($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('[data-autoclick="1"]') && clickedInput.closest('.lfb_genSlide').find('[data-itemid]').not('[data-group="' + clickedInput.data('group') + '"]').not('.lfb_richtext').not('.lfb_disabled').length == 0) {
                    var form = lfb_getForm(formID);
                    lfb_nextStep(form.formID);
                }
            }

        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide select[data-itemid]').on('change', function() {
            var value = $(this).val();
            var price = 0;
            $(this).find('option').each(function() {
                if ($(this).attr('value') == value) {
                    price = $(this).attr('data-price');
                }
            });
            $(this).attr('data-price', price);
            $(this).data('price', price);
            lfb_updatePrice(formID);
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide select[data-itemid]').trigger('change');

        $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel input[type=checkbox][data-price]').on('change', function() {

        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide input.lfb_qtfield').on('change', function() {
            lfb_updatePrice(formID, $(this).attr('data-itemid'));
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide').find('input[type=text][data-title],textarea[data-title],input[type=file][data-title],input[type=number][data-title]').on('change', function() {
            if ($(this).val().length > 0) {
                $(this).addClass('checked');
                $(this).addClass('lfb_changed');
            } else {
                $(this).removeClass('checked');
            }
        });
        $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide div.lfb_selectable .icon_quantity').on('click', function() {
            if (!lfb_isSelectionMode(formID)) {
                $('.quantityBtns').not($(this).parent().find('.quantityBtns')).removeClass('open');
                $('.quantityBtns').not($(this).parent().find('.quantityBtns')).fadeOut(250);

                if (!$(this).parent().find('.quantityBtns').is('.open') && $(this).parent().is('.checked')) {
                    if ($(this).parent().find('.quantityBtns .tooltip-inner').length > 0) {
                        $(this).parent().find('.quantityBtns .tooltip-inner').html(parseInt($(this).parent().find('.icon_quantity').html()));
                    }
                    $(this).parent().find('.quantityBtns').addClass('open');
                    $(this).parent().find('.quantityBtns').fadeIn(250);
                } else {
                    $(this).parent().find('.quantityBtns').removeClass('open');
                    $(this).parent().find('.quantityBtns').fadeOut(250);
                }
            }
        });

        $('#lfb_orderMessageCheck').on('change', function() {
            if ($(this).is(':checked')) {
                $('#lfb_orderMessage').slideDown(250);
            } else {
                $('#lfb_orderMessage').slideUp(250);
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnOrder').on('click', function() {
            if (!lfb_isSelectionMode(formID)) {
                lfb_order(formID);
            }
        });

        $('#gform_wrapper_' + form.gravityFormID + ' form').on('submit', function(e) {
            var $this = $(this);
            if (!$(this).is('.submit')) {
                e.preventDefault();
                $(this).addClass('submit');


                if (form.save_to_cart) {
                    var products = new Array();
                    var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));

                    if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
                        lastAndCurrentSteps.push(parseInt(form.step));
                    } else if (form.step == 'final' && jQuery.inArray('final', lastAndCurrentSteps) == -1) {
                        lastAndCurrentSteps.push('final');
                    }

                    jQuery.each(lastAndCurrentSteps, function() {
                        var $panel = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"]');
                        $panel.find('div.lfb_selectable.checked:not(.lfb_disabled),a.lfb_button.checked:not(.lfb_disabled),input[type=checkbox]:checked:not(.lfb_disabled),[data-type="slider"]:not(.lfb_disabled)').each(function() {
                            var quantity = 1;
                            if (parseInt($(this).data('resqt')) > 0) {
                                quantity = parseInt($(this).data('resqt'));
                            }
                            if ($(this).is('[data-type="slider"]')) {
                                quantity = parseInt($(this).slider('value'));
                                if (!isNaN(parseInt($(this).find('.tooltip-inner').html()))) {
                                    quantity = parseInt($(this).find('.tooltip-inner').html());
                                }
                            }
                            if (parseInt($(this).data('prodid')) > 0) {
                                products.push({
                                    quantity: quantity,
                                    product_id: parseInt($(this).data('prodid')),
                                    variation: parseInt($(this).attr('data-woovar'))
                                });
                            }
                        });
                    });
                    jQuery.ajax({
                        url: form.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'lfb_cart_save',
                            ref: form.current_ref,
                            emptyWooCart: form.emptyWooCart,
                            products: products
                        },
                        success: function() {
                            form.timer_gFormSubmit = setInterval(function() {
                                lfb_check_gform_response(form.formID);
                            }, 300);
                            setTimeout(function() {
                                $this.submit();
                            }, 700);
                        }
                    });
                } else {
                    form.timer_gFormSubmit = setInterval(function() {
                        lfb_check_gform_response(form.formID);
                    }, 300);
                    setTimeout(function() {
                        $this.submit();
                    }, 700);
                }
            } else {
                $(this).removeClass('submit');
            }
        });


    }

    function lfb_checkItems(formID) {
        var form = lfb_getForm(formID);
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide div.lfb_selectable img[data-tint="true"]').each(function() {
            $(this).css('opacity', 0);
            $(this).show();
            var $canvas = $('<canvas class="img"></canvas>');
            $canvas.css({
                width: $(this).get(0).width,
                height: $(this).get(0).height
            });
            $(this).hide();
            $(this).after($canvas);
            var ctx = $canvas.get(0).getContext('2d');
            var img = new Image();
            img.onload = function() {
                ctx.fillStyle = form.colorA;
                ctx.fillRect(0, 0, $canvas.get(0).width, $canvas.get(0).height);
                ctx.fill();
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(img, 0, 0, $canvas.get(0).width, $canvas.get(0).height);
            };
            if ($(this).is('[data-lazy-src]')) {
                img.src = $(this).attr('data-lazy-src');
            } else {
                img.src = $(this).attr('src');
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide div.lfb_selectable img[data-tint="false"]').each(function() {
            if ($(this).is('[data-src]')) {
                $(this).attr('src', $(this).attr('data-src'));
            }
        });

        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide div.lfb_selectable.checked , #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide  input[type=checkbox]:checked').on('mouseenter', function() {
            $(this).addClass('lfb_hover');
        }).on('mouseleave', function() {
            $(this).removeClass('lfb_hover');
        });
    }

    function lfb_getDistanceCalc(distanceCode, formID, itemID, depart, arrival, distanceType) {
        var rep = 0;
        var distanceMode = google.maps.UnitSystem.METRIC;
        var form = lfb_getForm(formID);
        if (form.distancesMode == 'route') {
            lfb_gmapMatrixService = new google.maps.DistanceMatrixService();
            lfb_gmapMatrixService.getDistanceMatrix({
                origins: [depart],
                destinations: [arrival],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            }, function(response, status) {
                var error = false;
                if (status == google.maps.DistanceMatrixStatus.OK) {
                    var distance = 0;
                    var duration = 0;
                    if (response.rows[0].elements[0].distance) {
                        distance = response.rows[0].elements[0].distance.value;
                        distance = distance / 1000;
                        if (distanceType == 'miles') {
                            distance = distance * 0.62;
                        } else if (distanceType == 'mins') {
                            distance = Math.round(parseInt(response.rows[0].elements[0].duration.value) / 60);
                        } else if (distanceType == 'hours') {
                            distance = Math.round(parseInt(response.rows[0].elements[0].duration.value) / 60 / 60);
                        }
                    } else {
                        error = true;
                    }
                    var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + itemID + '"]');
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + itemID + '"]').attr('data-distance', distance);

                    lfb_updateSummary(formID);
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tr[data-itemstep="' + itemID + '"] td:eq(2)').html(distance);
                    lfb_updatePrice(formID);
                    lfb_removeDistanceError(itemID, formID);
                } else {
                    error = true;
                }
                if (error) {
                    lfb_showDistanceError(itemID, formID);
                }
            });
        } else {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': depart }, function(results, status) {
                if (typeof(results[0]) != 'undefined') {
                    var pointA = results[0].geometry.location;
                    geocoder.geocode({ 'address': arrival }, function(results, status) {
                        if (typeof(results[0]) != 'undefined') {
                            var pointB = results[0].geometry.location;

                            var distance = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
                            distance = distance / 1000;
                            if (distanceType == 'miles') {
                                distance = distance * 0.62;
                            }
                            var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + itemID + '"]');
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + itemID + '"]').attr('data-distance', distance);

                            lfb_updateSummary(formID);
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table tr[data-itemstep="' + itemID + '"] td:eq(2)').html(distance);
                            lfb_updatePrice(formID);
                            lfb_removeDistanceError(itemID, formID);
                        } else {
                            lfb_showDistanceError(itemID, formID);

                        }

                    });
                } else {
                    lfb_showDistanceError(itemID, formID);

                }
            });
        }

        return rep;
    }

    function lfb_executeCalculation(calculation, formID, targetID) {
        calculation = calculation.replace(/\\/g, '');
        var form = lfb_getForm(formID);
        var price = 0;
        var i = 0;
        var elementsToReplace = new Array();
        var itemData = lfb_getItemData(form, targetID);
        var _stepID = itemData.stepid;
        var isVariable = false;
        if (calculation.indexOf('[variable]') > -1) {
            isVariable = true;
        }
        calculation = calculation.replace(/\[variable\]/g, '[price]');
        calculation = calculation.replace(/\[quantity\]/g, '[price]');
        calculation = calculation.replace(/\[value\]/g, '[price]');

        while ((i = calculation.indexOf('variable-', i + 1)) != -1) {
            var variableID = calculation.substr(i + 9, calculation.indexOf(']', i) - (i + 9));
            var value = 0;
            var variable = lfb_getVariableByID(form, variableID);
            if (variable) {
                value = variable.value;
                if (variable.type == 'text') {
                    value = '"' + variable.value + '"';
                } else {
                    if (isNaN(value)) {
                        value = 0;
                    }
                }
            }
            elementsToReplace.push({
                oldValue: calculation.substr(i - 1, (calculation.indexOf(']', i) + 1) - (i - 1)),
                newValue: value
            });
        }
        while ((i = calculation.indexOf('item-', i + 1)) != -1) {
            var itemID = calculation.substr(i + 5, calculation.indexOf('_', i) - (i + 5));
            var action = calculation.substr(calculation.indexOf('_', i) + 1, (calculation.indexOf(']', i) - 1) - (calculation.indexOf('_', i)));
            var value = 0;
            var calItemData = lfb_getItemData(form, itemID);
            if (typeof(calItemData) != 'undefined' && calItemData) {

                if (action == 'isChecked') {
                    if (calItemData) {
                        value = '1==1';
                    } else {
                        value = '1==0'
                    }
                }
                if (action == 'isUnchecked') {
                    if (!calItemData) {
                        value = '1==1';
                    } else {
                        value = '1==0'
                    }
                }
                if (action == 'isFilled') {
                    if (calItemData.type == 'filefield') {

                        if (calItemData.files.length > 0) {
                            value = '1==1';
                        } else {
                            value = '1==0';
                        }
                    } else {
                        var value = 0;
                        if (typeof(calItemData.value) == 'undefined') {
                            if (typeof(calItemData.quantity) != 'undefined') {
                                value = calItemData.quantity;
                            }

                        } else {
                            value = calItemData.value;
                        }
                        if (value.length > 0) {
                            value = '1==1';
                        } else {
                            value = '1==0';
                        }
                    }
                }
                if (action == 'price') {
                    value = 0;
                    if (itemID == 'total') {
                        value = form.price;
                    } else {
                        value = 0;
                        if (typeof(calItemData.price) != 'undefined') {
                            value = calItemData.price;
                        }
                    }
                }
                if (action == 'quantity') {
                    value = 0;
                    if (typeof(calItemData.quantity) != 'undefined') {
                        value = calItemData.quantity;
                    }

                }
                if (action == 'min') {
                    value = 0;
                    if (calItemData.type == 'range') {
                        if (typeof(calItemData.minValue) != 'undefined') {
                            value = calItemData.minValue;
                        }
                    }
                }
                if (action == 'max') {
                    value = 0;
                    if (calItemData.type == 'range') {
                        if (typeof(calItemData.maxValue) != 'undefined') {
                            value = calItemData.maxValue;
                        }
                    }
                }
                if (action == 'value') {
                    value = 0;
                    if (calItemData.type == 'numberfield') {
                        if (typeof(calItemData.quantity) != 'undefined') {
                            value = calItemData.quantity;
                        } else if (typeof(calItemData.value) != 'undefined') {
                            value = calItemData.value;
                        }
                        if (isNaN(value)) {
                            value = 0;
                        }
                    } else {
                        value = "'" + calItemData.value + "'";
                    }



                }
                if (action == 'date') {

                    var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]');
                    if ($item.is('.lfb_datepicker') && $item.datetimepicker("getDate") != null) {
                        value = "'" + moment($item.datetimepicker("getDate")).format('YYYY-MM-DD') + "'";
                    } else {
                        value = "null";
                    }
                }
            } else {
                if (action == 'isUnchecked') {
                    value = '1==1';
                }
            }

            if (typeof(value) == 'undefined') {
                value = 0;
            }
            elementsToReplace.push({
                oldValue: calculation.substr(i - 1, (calculation.indexOf(']', i) + 1) - (i - 1)),
                newValue: value
            });
        }

        while ((i = calculation.indexOf('step-', i + 1)) != -1) {
            var stepID = calculation.substr(i + 5, calculation.indexOf('_', i) - (i + 5));
            var action = calculation.substr(calculation.indexOf('_', i) + 1, (calculation.indexOf(']', i) - 1) - (calculation.indexOf('_', i)));

            if (action == 'quantity') {
                value = lfb_getStepQuantities(formID, stepID, targetID);
            }
            elementsToReplace.push({
                oldValue: calculation.substr(i - 1, (calculation.indexOf(']', i) + 1) - (i - 1)),
                newValue: value
            });
        }

        var todayDate = new Date();
        var month = todayDate.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var today = todayDate.getFullYear().toString() + month.toString() + todayDate.getDate().toString();
        calculation = calculation.replace(/\[currentDate\]/g, today);

        if (calculation.indexOf('dateDifference-') > -1) {

            while ((i = calculation.indexOf('dateDifference-', i + 1)) != -1) {
                var startDateAdPosEnd = calculation.indexOf('_', i + 15) + 1;
                var startDate = calculation.substr(i + 15, calculation.indexOf('_', i) - (i + 15));
                var endDate = calculation.substr(startDateAdPosEnd, calculation.indexOf(']', startDateAdPosEnd) - (startDateAdPosEnd));

                if (startDate == 'currentDate') {
                    startDate = todayDate;
                } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + startDate + '"]').length > 0 &&
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + startDate + '"]').val().length > 0) {
                    var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + startDate + '"]');
                    startDate = $item.datetimepicker("getDate");
                } else {
                    startDate = todayDate;
                }
                if (endDate == 'currentDate') {
                    endDate = todayDate;
                } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + endDate + '"]').length > 0 &&
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + endDate + '"]').val().length > 0) {
                    var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + endDate + '"]');
                    endDate = $item.datetimepicker("getDate");
                } else {
                    endDate = todayDate;
                }

                startDate.setMinutes(0);
                startDate.setHours(0);
                endDate.setMinutes(0);
                endDate.setHours(0);
                var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
                var result = Math.round(timeDiff / (1000 * 3600 * 24));
                if (result < 0) {
                    result = 0;
                }

                elementsToReplace.push({
                    oldValue: calculation.substr(i - 1, (calculation.indexOf(']', i) + 1) - (i - 1)),
                    newValue: result
                });

            }
        }


        if (calculation.indexOf('distance_') > -1) {
            var $target = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + targetID + '"]');
            $target.attr('data-usedistance', 'true');
            while ((i = calculation.indexOf('distance_', i + 1)) != -1) {

                var distanceType = 'km';

                var departAdPosEnd = calculation.indexOf('-', i + 9) + 1;
                var departAdress = calculation.substr(i + 9, calculation.indexOf('-', i) - (i + 9));

                var departCityPosEnd = calculation.indexOf('-', departAdPosEnd) + 1;
                var departCity = calculation.substr(departAdPosEnd, calculation.indexOf('-', departAdPosEnd) - (departAdPosEnd));

                var departZipPosEnd = calculation.indexOf('-', departCityPosEnd) + 1;
                var departZip = calculation.substr(departCityPosEnd, calculation.indexOf('-', departCityPosEnd) - (departCityPosEnd));

                var departCountryPosEnd = calculation.indexOf('_', departZipPosEnd) + 1;
                var departCountry = calculation.substr(departZipPosEnd, calculation.indexOf('_', departZipPosEnd) - (departZipPosEnd));

                var arrivalAdPosEnd = calculation.indexOf('-', departCountryPosEnd) + 1;
                var arrivalAdress = calculation.substr(departCountryPosEnd, calculation.indexOf('-', departCountryPosEnd) - (departCountryPosEnd));

                var arrivalCityPosEnd = calculation.indexOf('-', arrivalAdPosEnd) + 1;
                var arrivalCity = calculation.substr(arrivalAdPosEnd, calculation.indexOf('-', arrivalAdPosEnd) - (arrivalAdPosEnd));

                var arrivalZipPosEnd = calculation.indexOf('-', arrivalCityPosEnd) + 1;
                var arrivalZip = calculation.substr(arrivalCityPosEnd, calculation.indexOf('-', arrivalCityPosEnd) - (arrivalCityPosEnd));

                var arrivalCountryPosEnd = calculation.indexOf('_', arrivalZipPosEnd) + 1;
                var arrivalCountry = calculation.substr(arrivalZipPosEnd, calculation.indexOf('_', arrivalZipPosEnd) - (arrivalZipPosEnd));

                distanceType = calculation.substr(arrivalCountryPosEnd, calculation.indexOf(']', arrivalCountryPosEnd) - (arrivalCountryPosEnd));


                if (departAdress != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departAdress + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departAdress + '"]');
                        departAdress = $item.val();
                    } else {
                        departAdress = 0;
                    }
                }
                if (departCity != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCity + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCity + '"]');
                        departCity = $item.val();
                    } else {
                        departCity = 0;
                    }
                }
                if (departZip != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departZip + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departZip + '"]');
                        departZip = $item.val();
                    } else {
                        departZip = 0;
                    }
                }
                if (departCountry != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCountry + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCountry + '"]');
                        departCountry = $item.val();
                    } else {
                        departCountry = 0;
                    }
                }
                if (arrivalAdress != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalAdress + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalAdress + '"]');
                        arrivalAdress = $item.val();
                    } else {
                        arrivalAdress = 0;
                    }
                }
                if (arrivalCity != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCity + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCity + '"]');
                        arrivalCity = $item.val();
                    } else {
                        arrivalCity = 0;
                    }
                }
                if (arrivalZip != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalZip + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalZip + '"]');
                        arrivalZip = $item.val();
                    } else {
                        arrivalZip = 0;
                    }
                }
                if (arrivalCountry != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCountry + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCountry + '"]');
                        arrivalCountry = $item.val();
                    } else {
                        arrivalCountry = 0;
                    }
                }
                if ($target.closest('.lfb_genSlide').find('.lfb_distanceError').length > 0) {
                    lfb_removeDistanceError(targetID, formID);
                }
                var distanceCode = calculation.substr(i - 1, (calculation.indexOf(']', i) + 1) - (i - 1));
                var distance = 0;
                if ($target.attr('data-distance') != "") {
                    distance = parseFloat($target.attr('data-distance'));
                }
                if (departAdress == "" && departCity == "" && departCountry == "" && arrivalAdress == "" && arrivalCity == "" && arrivalCountry == "" && departZip == "" && arrivalZip == "") {
                    lfb_showDistanceError(targetID, formID);
                } else {
                    if (form.gmap_key == "") {
                        lfb_showDistanceError(targetID, formID);
                        console.log("invalid gmap api key");
                    } else {
                        var depart = departAdress + ' ' + departZip + ' ' + departCity + ' ' + departCountry;
                        var arrival = arrivalAdress + ' ' + arrivalZip + ' ' + arrivalCity + ' ' + arrivalCountry;
                        if ($target.attr('data-departure') != depart || arrival != $target.attr('data-arrival')) {
                            $target.attr('data-departure', depart);
                            $target.attr('data-arrival', arrival);
                            lfb_getDistanceCalc(distanceCode, formID, targetID, depart, arrival, distanceType);
                        }
                    }
                }
                elementsToReplace.push({
                    oldValue: calculation.substr(i - 1, (calculation.indexOf(']', i) + 1) - (i - 1)),
                    newValue: distance
                });
            }
        }
        jQuery.each(elementsToReplace, function() {
            calculation = calculation.replace(this.oldValue, this.newValue);
        });
        calculation = calculation.replace(/\[total_single\]/g, form.priceSingle);
        calculation = calculation.replace(/\[total_default\]/g, form.price);
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('[data-isSubs]') && ((itemData && itemData.isSinglePrice) || $('[data-itemid="' + targetID + '"]').is('[data-singleprice="true"]'))) {
            calculation = calculation.replace(/\[total\]/g, form.priceSingle);
        } else {
            calculation = calculation.replace(/\[total\]/g, form.price);
        }
        if (calculation.indexOf('[total_quantity]') > -1) {
            calculation = calculation.replace(/\[total_quantity\]/g, lfb_getTotalQuantities(formID, _stepID, targetID));
        }

        if (calculation.indexOf('[price]') == -1) {
            i = 0;
            while ((i = calculation.indexOf('{', i + 1)) != -1) {
                var charsToEnd = calculation.substr(i + 1, (calculation.indexOf('}', i + 1) - (i + 1)));
                if (/\S/.test(charsToEnd)) {
                    calculation = calculation.substr(0, i + 1) + ' price =' + calculation.substr(i + 1, calculation.length);
                    i += 8;
                }
            }
            if (calculation.indexOf('if') < 0) {
                calculation = 'price = ' + calculation;
            } else {
                var charsToStart = calculation.substr(0, calculation.indexOf('if'));
                if (/\S/.test(charsToStart)) {
                    calculation = 'price = ' + calculation;
                }
            }
            calculation = lfb_removeDoubleSpaces(calculation);
            calculation = calculation.replace(/price =\n if/g, "\nif");
            calculation = calculation.replace(/price = if/g, "if");
            calculation = calculation.replace(/price = \nif/g, "\nif");
            calculation = calculation.replace(/price = \n if/g, "\n if");
        } else {
            calculation = calculation.replace(/\[price\]/g, "price");
            calculation = calculation.replace(/\[quantity\]/g, "price");
            calculation = calculation.replace(/\[variable\]/g, "price");

            calculation = lfb_removeDoubleSpaces(calculation);
        }
        if (calculation.trim() != 'price =') {
            try {
                eval(calculation);
            } catch (e) {
                console.log('wrong calculation : ' + calculation);
            }
        }
        if (isVariable) {
            return price;
        } else {
            return parseFloat(price);
        }
    }

    function lfb_parseDate(input) {
        var rep = input;
        if (typeof input == 'string') {
            var parts = input.match(/(\d+)/g);
            rep = new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return rep;
    }

    function lfb_removeDoubleSpaces(string) {
        string = string.replace(/\t/g, '');
        string = string.replace(/  /g, ' ');
        if (string.indexOf('  ') > -1) {
            lfb_removeDoubleSpaces(string);
        }
        return string;
    }

    function lfb_removeDistanceError(itemID, formID) {
        var $target = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]');

        if ($target.closest('.lfb_genSlide').find('[data-itemid][data-usedistance="true"]:not([data-distance]):not([type="checkbox"]).checked,[data-itemid][data-usedistance="true"]:not([data-distance]):checked,[data-itemid][data-usedistance="true"]:not([data-distance])[data-type="slider"]').length == 0 &&
            $target.closest('.lfb_genSlide').find('[data-itemid][data-usedistance="true"][data-distance="0"]:not([type="checkbox"]).checked,[data-itemid][data-usedistance="true"][data-distance="0"]:checked,[data-itemid][data-usedistance="true"][data-distance="0"][data-type="slider"]').length == 0) {
            $target.closest('.lfb_genSlide').find('.lfb_btn-next').fadeIn();
            $target.closest('.lfb_genSlide').find('.lfb_btnNextContainer').fadeIn();
            $target.closest('.lfb_genSlide').find('.lfb_btn-next').removeClass('lfb_disabledBtn');
            var errorMsg = $target.closest('.lfb_genSlide').find('.lfb_distanceError');
            errorMsg.fadeOut();
            setTimeout(function() {
                errorMsg.remove();
            }, 300);
        }
    }

    function lfb_showDistanceError(itemID, formID) {
        var form = lfb_getForm(formID);
        var $target = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]');
        $target.closest('.lfb_genSlide').find('.lfb_btn-next').addClass('lfb_disabledBtn');
        $target.closest('.lfb_genSlide').find('.lfb_btn-next').hide();
        if ($target.closest('.lfb_genSlide').find('.lfb_distanceError').length == 0) {
            $target.closest('.lfb_genSlide').find('.lfb_btnNextContainer').before('<div class="lfb_distanceError alert alert-danger"><p>' + form.txtDistanceError + '</p></div>');

        }
        var stepID = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-itemid="' + itemID + '"]').closest('.lfb_genSlide').attr('data-stepid');
        if (form.step == 'final' && !form.backFomFinal) {
            form.backFomFinal = true;
            lfb_changeStep(stepID, formID);
        }

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').trigger('lfb_distanceError');


    }

    function lfb_updateLabelItem($item, formID) {
        var form = lfb_getForm(formID);
        if (!$item.is('.dropzone')) {
            $item.closest('.lfb_itemBloc').find("label").each(function() {
                if ($(this).html().indexOf(":") > -1 && $(this).closest('.switch').length == 0) {
                    $(this).html($item.attr('data-original-label'));
                }
            });

            if ($item.parent().children('.lfb_imgTitle').length > 0 && $item.is('[data-bs-original-title]')) {
                $item.parent().children('.lfb_imgTitle').html($item.attr('data-bs-original-title'));
            }
            if ($item.is('[type="checkbox"]')) {
                $item.closest('.lfb_itemBloc').find('div > label').first().html($item.attr('data-original-label'));
            }

            if ($item.find('.lfb_buttonTitle').length > 0 && $item.is('[data-bs-original-title]')) {
                $item.find('.lfb_buttonTitle').html($item.attr('data-bs-original-title'));
            }

        }
    }

    function getItemCalculation(form, itemID, calculationType) {
        var rep = '';
        if (form.debugCalculations == 1) {
            var attribute = 'calculation';
            if (calculationType == 'calculationQt') {
                attribute = 'calculationqt';
            } else if (calculationType == 'variableCalculation') {
                attribute = 'calculationvar';
            } else if (calculationType == 'distanceQt') {
                attribute = 'distanceqt';
            }

            rep = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').attr('data-' + attribute);
        } else {
            form.usingCalculationItems.forEach(item => {
                if (item.id == itemID) {
                    rep = item[calculationType];
                }
            });
        }
        return rep;
    }

    function lfb_updatePrice(formID, fromItemID) {
        var hasSinglePrice = false;

        var form = lfb_getForm(formID);
        lfb_updatePlannedSteps(formID);
        lfb_updateStep(formID);
        lfb_updateShowItems(formID);
        form.lastPrice = form.price;
        form.price = form.initialPrice;
        form.priceSingle = 0;
        var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
        var pricePreviousStep = 0;
        var singlePricePreviousStep = 0;

        for (var i = 0; i < form.variables.length; i++) {
            form.variables[i].value = form.variables[i].defaultValue;
        }

        if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
            lastAndCurrentSteps.push(parseInt(form.step));
        } else if (form.step == 'final' && jQuery.inArray('final', lastAndCurrentSteps) == -1) {
            lastAndCurrentSteps.push('final');
        }
        for (var i = 0; i < lastAndCurrentSteps.length; i++) {
            var step = lastAndCurrentSteps[i];
            if ((step == 'final' || parseInt(step) != 0) && !$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + step + '"]').is('.lfb_disabled')) {
                var $panel = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + step + '"]');


                $panel.find('[data-itemid]').each(function() {
                    if ($(this).is('div.lfb_selectable.checked') ||
                        $(this).is('div[data-type="slider"]') ||
                        $(this).is('a.lfb_button.checked') ||
                        $(this).is('input[type=checkbox]:checked') ||
                        $(this).is('select[data-itemid][data-price]') ||
                        $(this).is('input[type=number][data-valueasqt="1"]')
                    ) {
                        if (!$(this).is('.lfb_disabled') && $(this).closest('.lfb_itemBloc.lfb_disabled').length == 0) {
                            if (!$(this).is('.lfb_disabled')) {
                                if ($(this).is('[data-singleprice="true"]')) {
                                    hasSinglePrice = true;
                                }
                                if (!$(this).is('[data-usecalculation]')) {
                                    $(this).data('price', $(this).attr('data-price'));
                                }
                                if ($(this).is('[data-usecalculation]')) {
                                    if (step == form.step || !$(this).is('.lfb_executed')) {

                                        // $(this).data('price', lfb_executeCalculation($(this).attr('data-calculation'), formID, $(this).attr('data-itemid')));
                                        $(this).data('price', lfb_executeCalculation(getItemCalculation(form, $(this).attr('data-itemid'), 'calculation'), formID, $(this).attr('data-itemid')));


                                    } else {
                                        $(this).attr('data-price', $(this).data('price'));
                                    }
                                }
                                if ($(this).find('.icon_quantity').length > 0 || $(this).find('.lfb_qtfield').length > 0 || $(this).is('[data-type="slider"]') || $(this).is('input[type=number][data-valueasqt="1"]')) {
                                    var quantityA = '';
                                    var min = 0;
                                    var max = 99999999999999;
                                    if ($(this).find('.icon_quantity').length > 0) {
                                        quantityA = $(this).find('.icon_quantity').html();
                                        min = parseFloat($(this).find('.quantityBtns').attr('data-min'));
                                        max = parseFloat($(this).find('.quantityBtns').attr('data-max'));


                                    } else if ($(this).find('.lfb_qtfield').length > 0) {
                                        quantityA = $(this).find('.lfb_qtfield').val();
                                        min = $(this).find('.lfb_qtfield').attr('min');
                                        max = $(this).find('.lfb_qtfield').attr('max');
                                    } else if ($(this).is('[data-type="slider"]')) {
                                        quantityA = parseFloat($(this).slider('value'));
                                        min = $(this).attr('data-min');
                                        max = $(this).attr('data-max');
                                    } else if ($(this).is('input[type=number][data-valueasqt="1"]')) {
                                        quantityA = parseFloat($(this).val());
                                        min = $(this).attr('min');
                                        if ($(this).is('[max]')) {
                                            max = $(this).attr('max');
                                        } else {
                                            max = 99999999999999999;
                                        }
                                    }

                                    if ($(this).is('[data-usecalculationqt]') && !$(this).is('.lfb_changed') && (typeof(fromItemID) == 'undefined' || $(this).attr('data-itemid') != fromItemID)) {
                                        //quantityA = lfb_executeCalculation($(this).attr('data-calculationqt'), formID, $(this).attr('data-itemid'));
                                        quantityA = lfb_executeCalculation(getItemCalculation(form, $(this).attr('data-itemid'), 'calculationQt'), formID, $(this).attr('data-itemid'));

                                        if (isNaN(quantityA)) {
                                            quantityA = 0;
                                        }
                                        if (quantityA > max) {
                                            quantityA = max;
                                        }
                                        if (quantityA < min) {
                                            quantityA = min;
                                        }

                                        if ($(this).find('.icon_quantity').length > 0) {
                                            $(this).find('.icon_quantity').html(quantityA);
                                            if ($(this).find('.lfb_sliderQt').length > 0) {
                                                $(this).find('.lfb_sliderQt').slider('value', parseFloat(quantityA));
                                            }
                                            $(this).find('.quantityBtns').addClass('lfb-hidden');

                                        } else if ($(this).find('.lfb_qtfield').length > 0) {
                                            $(this).find('.lfb_qtfield').val(quantityA);
                                        } else if ($(this).is('[data-type="slider"]')) {
                                            $(this).slider('value', parseFloat(quantityA));
                                        } else if ($(this).is('input[type="number"]')) {
                                            $(this).val(quantityA);
                                        }
                                    }

                                    if ($(this).is('[data-distanceqt]')) {
                                        lfb_executeCalculation(getItemCalculation(form, $(this).attr('data-itemid'), 'distanceQt'), formID, $(this).attr('data-itemid'));

                                        //  lfb_executeCalculation($(this).attr('data-distanceqt'), formID, $(this).attr('data-itemid'));
                                        if ($(this).is('[data-distance]')) {
                                            quantityA = parseFloat($(this).attr('data-distance')).toFixed(2);
                                        }
                                        if (quantityA < min) {
                                            quantityA = min;
                                        } else if (quantityA > max) {
                                            quantityA = max;
                                        }
                                        if ($(this).find('.lfb_qtfield').length > 0) {
                                            $(this).find('.lfb_qtfield').val(quantityA);
                                        } else if ($(this).find('.lfb_sliderQt').length > 0) {
                                            $(this).find('.lfb_sliderQt').slider('value', quantityA);
                                            $(this).find('.icon_quantity').html(quantityA);
                                        } else if ($(this).find('.quantityBtns').length > 0) {
                                            $(this).find('.icon_quantity').html(quantityA);
                                        } else if ($(this).is('[data-type="slider"]')) {
                                            $(this).slider('value', quantityA);
                                        }

                                        if ($(this).is('[data-usecalculation]')) {
                                            // $(this).data('price', lfb_executeCalculation($(this).attr('data-calculation'), formID, $(this).attr('data-itemid')));
                                            $(this).data('price', lfb_executeCalculation(getItemCalculation(form, $(this).attr('data-itemid'), 'calculation'), formID, $(this).attr('data-itemid')));

                                        }
                                    }


                                    $(this).attr('data-resqt', quantityA);
                                    if ($(this).is('[data-price]')) {
                                        if ($(this).data('operation') == '-') {
                                            $(this).data('resprice', 0 - parseFloat($(this).data('price')) * parseFloat(quantityA));
                                            if ($(this).is('[data-singleprice="true"]')) {
                                                form.priceSingle -= parseFloat($(this).data('price')) * parseFloat(quantityA);
                                            } else {
                                                form.price -= parseFloat($(this).data('price')) * parseFloat(quantityA);
                                            }
                                        } else if ($(this).data('operation') == 'x') {
                                            for (var i = 0; i < parseFloat(quantityA); i++) {
                                                if (i == 0) {
                                                    form.price = form.price;
                                                    $(this).data('resprice', form.price);
                                                } else {
                                                    if ($(this).is('[data-singleprice="true"]')) {
                                                        if ($(this).is('[data-addtototal!="no"]')) {
                                                            form.priceSingle += ((singlePricePreviousStep * parseFloat($(this).data('price'))) / 100);
                                                        }
                                                        $(this).data('resprice', (singlePricePreviousStep * parseFloat($(this).data('price'))) / 100);
                                                    } else {
                                                        if ($(this).is('[data-addtototal!="no"]')) {
                                                            form.price += ((pricePreviousStep * parseFloat($(this).data('price'))) / 100);
                                                        }
                                                        $(this).data('resprice', (form.price * parseFloat($(this).data('price'))) / 100);
                                                    }
                                                }
                                            }
                                        } else if ($(this).data('operation') == '/') {
                                            for (var i = 0; i < parseFloat(quantityA); i++) {
                                                $(this).data('resprice', 0 - (form.price * parseFloat($(this).data('price'))) / 100);
                                                if ($(this).is('[data-singleprice="true"]')) {
                                                    if ($(this).is('[data-addtototal!="no"]')) {
                                                        form.priceSingle = form.price - (form.price * parseFloat($(this).data('price'))) / 100;
                                                    }
                                                } else {
                                                    if ($(this).is('[data-addtototal!="no"]')) {
                                                        form.price = form.price - (form.price * parseFloat($(this).data('price'))) / 100;
                                                    }
                                                }
                                            }
                                        } else {
                                            var reducIndex = -2;
                                            if ($(this).data('reduc') && $(this).data('reducqt').length > 0) {
                                                var self = this;
                                                var reducsTab = $(this).data('reducqt');
                                                reducsTab = reducsTab.split("*");
                                                var valuesTab = new Array();
                                                var minQtReduc = 0;
                                                jQuery.each(reducsTab, function(i) {
                                                    var reduc = reducsTab[i].split('|');
                                                    valuesTab.push(reduc[1]);
                                                    if (parseFloat(reduc[0]) <= parseFloat(quantityA)) {
                                                        reducIndex = i;
                                                    }
                                                    if (parseFloat(reduc[0]) < minQtReduc || minQtReduc == 0) {
                                                        minQtReduc = parseFloat(reduc[0]);
                                                    }

                                                });
                                            }
                                            if (reducIndex >= 0) {
                                                var calculatedPrice = parseFloat(valuesTab[reducIndex]) * parseFloat(quantityA);
                                                if ($(this).attr('data-price') == "0") {
                                                    calculatedPrice = parseFloat(valuesTab[reducIndex]) * (parseFloat(quantityA) - minQtReduc);
                                                }
                                                $(this).data('resprice', calculatedPrice);
                                                if ($(this).is('[data-singleprice="true"]')) {

                                                    if ($(this).is('[data-addtototal!="no"]')) {
                                                        form.priceSingle += parseFloat(calculatedPrice);
                                                    }
                                                } else {
                                                    if ($(this).is('[data-addtototal!="no"]')) {
                                                        form.price += parseFloat(calculatedPrice);
                                                    }
                                                }

                                                if (form.currencyPosition == 'left') {
                                                    if ($(this).is('[data-showprice="1"]')) {
                                                        if ($(this).data('operation') == "+") {
                                                            $(this).attr('title', $(this).data('originaltitle') + ' : ' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));


                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : ' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : ' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);
                                                        } else if ($(this).data('operation') == "-") {
                                                            $(this).attr('title', $(this).data('originaltitle') + ' : -' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : -' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : -' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);
                                                        } else if ($(this).data('operation') == "x") {
                                                            $(this).attr('title', $(this).data('originaltitle') + ' : +' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : +' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : +' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }

                                                            lfb_updateLabelItem($(this), formID);
                                                        } else {
                                                            $(this).attr('title', $(this).data('originaltitle') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : -' + form.currency + (lfb_formatPrice(valuesTab[reducIndex], formID)));

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);
                                                        }
                                                    } else {
                                                        $(this).attr('data-original-label', $(this).data('originallabel'));

                                                        if ($(this).is('[data-tooltiptext]')) {
                                                            $(this).attr('data-bs-original-title', $(this).attr('data-tooltiptext'));
                                                        } else {
                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle'));

                                                        }
                                                    }
                                                    if ($(this).find('.quantityBtns').is('.open') && form.imgTitlesStyle == '') {
                                                        if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                                                            $(this).tooltip('show');
                                                        }
                                                    }
                                                } else {
                                                    if ($(this).is('[data-showprice="1"]')) {
                                                        if ($(this).attr('data-operation') == "+") {
                                                            $(this).attr('title', $(this).data('originaltitle') + ' : ' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : ' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : ' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);
                                                        } else if ($(this).attr('data-operation') == "-") {
                                                            $(this).attr('title', $(this).data('originaltitle') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)));
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);
                                                        } else if ($(this).attr('data-operation') == "x") {
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : +' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);

                                                            $(this).attr('title', $(this).data('originaltitle') + ' : +' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : +' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);

                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : +' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);
                                                        } else {
                                                            $(this).attr('data-original-label', $(this).data('originallabel') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + form.currency);

                                                            $(this).attr('title', $(this).data('originaltitle') + ' : --' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle') + ' : -' + (lfb_formatPrice(valuesTab[reducIndex], formID)) + '%');
                                                            if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {

                                                            }
                                                            lfb_updateLabelItem($(this), formID);

                                                        }
                                                    } else {
                                                        $(this).attr('data-original-label', $(this).data('originallabel'));

                                                        if ($(this).is('[data-tooltiptext]')) {
                                                            $(this).attr('data-bs-original-title', $(this).attr('data-tooltiptext'));

                                                        } else {
                                                            $(this).attr('data-bs-original-title', $(this).data('originaltitle'));

                                                        }
                                                    }
                                                    if ($(this).find('.quantityBtns').is('.open') && form.imgTitlesStyle == '') {
                                                        if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                                                            $(this).tooltip('show');
                                                        }
                                                    }
                                                }
                                            } else {
                                                $(this).data('resprice', parseFloat($(this).data('price')) * parseFloat(quantityA));
                                                form.price = parseFloat(form.price);
                                                form.priceSingle = parseFloat(form.priceSingle);
                                                if ($(this).is('[data-singleprice="true"]')) {
                                                    if ($(this).is('[data-addtototal!="no"]')) {
                                                        form.priceSingle += parseFloat($(this).data('price')) * parseFloat(quantityA);
                                                    }
                                                } else {
                                                    if ($(this).is('[data-addtototal!="no"]')) {
                                                        form.price += parseFloat($(this).data('price')) * parseFloat(quantityA);
                                                    }
                                                }

                                                lfb_updateItemTitleNoReduc($(this), form);
                                                if ($(this).find('.quantityBtns').is('.open') && form.imgTitlesStyle == '') {
                                                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                                                        $(this).tooltip('show');
                                                    }
                                                }

                                            }
                                        }
                                    } else {
                                        $(this).data('resprice', '0');
                                    }


                                } else {
                                    $(this).data('resqt', '0');
                                    if ($(this).data('price')) {
                                        if ($(this).data('operation') == '-') {
                                            $(this).data('resprice', 0 - parseFloat($(this).data('price')));
                                            if ($(this).is('[data-singleprice="true"]')) {
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.priceSingle -= parseFloat($(this).data('price'));
                                                }
                                            } else {
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.price -= parseFloat($(this).data('price'));
                                                }
                                            }
                                        } else if ($(this).data('operation') == 'x') {
                                            if ($(this).is('[data-singleprice="true"]')) {
                                                $(this).data('resprice', (form.priceSingle * parseFloat($(this).data('price'))) / 100);
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.priceSingle = form.priceSingle + (form.priceSingle * parseFloat($(this).data('price'))) / 100;
                                                }
                                            } else {
                                                $(this).data('resprice', (form.price * parseFloat($(this).data('price'))) / 100);
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.price = form.price + (form.price * parseFloat($(this).data('price'))) / 100;
                                                }
                                            }
                                        } else if ($(this).attr('data-operation') == '/') {
                                            if ($(this).is('[data-singleprice="true"]')) {
                                                $(this).data('resprice', 0 - (form.priceSingle * parseFloat($(this).data('price'))) / 100);
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.priceSingle = form.priceSingle - (form.priceSingle * parseFloat($(this).data('price'))) / 100;
                                                }
                                            } else {
                                                $(this).data('resprice', 0 - (form.price * parseFloat($(this).data('price'))) / 100);
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.price = form.price - (form.price * parseFloat($(this).data('price'))) / 100;
                                                }
                                            }
                                        } else {
                                            $(this).data('resprice', $(this).data('price'));
                                            if ($(this).is('[data-singleprice="true"]')) {
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.priceSingle += parseFloat($(this).data('price'));
                                                }
                                            } else {
                                                if ($(this).is('[data-addtototal!="no"]')) {
                                                    form.price = parseFloat(form.price) + parseFloat($(this).data('price'));
                                                }
                                            }


                                        }

                                        lfb_updateItemTitleNoReduc($(this), form);
                                    } else {
                                        $(this).data('resprice', '0');
                                    }
                                }


                            }
                        }

                        if ($(this).is('[data-usecalculationvar]') && !$(this).is('[data-usecalculationvar="0"]')) {
                            //    lfb_updateVariable(form, $(this).attr('data-usecalculationvar'), $(this).attr('data-calculationvar'), $(this).attr('data-itemid'));
                            lfb_updateVariable(form, $(this).attr('data-usecalculationvar'), getItemCalculation(form, $(this).attr('data-itemid'), 'variableCalculation'), $(this).attr('data-itemid'));

                        }


                    }


                    if ($(this).is('input[type!="checkbox"][data-usecalculationvar]') && !$(this).is('[data-usecalculationvar="0"]')) {
                        //   lfb_updateVariable(form, $(this).attr('data-usecalculationvar'), $(this).attr('data-calculationvar'), $(this).attr('data-itemid'));
                        lfb_updateVariable(form, $(this).attr('data-usecalculationvar'), getItemCalculation(form, $(this).attr('data-itemid'), 'variableCalculation'), $(this).attr('data-itemid'));

                    }

                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').trigger('priceUpdated', [$(this).attr('data-itemid')]);
                    lfb_updateItemData(form, $(this).attr('data-itemid'));

                });
            }
            pricePreviousStep = form.price;
            singlePricePreviousStep = form.priceSingle;
        }
        if (form.reduction > 0) {
            if (form.reductionType && form.reductionType == '%') {
                if (form.priceSingle > 0) {
                    form.reductionResult = (form.priceSingle * form.reduction) / 100;
                } else {
                    form.reductionResult = (form.price * form.reduction) / 100;
                }
            } else {
                form.reductionResult = form.reduction;
            }
            form.reductionResult = parseFloat(form.reductionResult);
            if (form.priceSingle == 0) {
                form.price -= form.reductionResult;
            } else {
                form.priceSingle -= form.reductionResult;
            }

        }

        lfb_updateVAT(formID);

        if (!form.price || form.price < 0) {
            form.price = 0;
        }
        if (!hasSinglePrice || !form.priceSingle || form.priceSingle < 0) {
            form.priceSingle = 0;
        }
        var pattern = /^\d+(\.\d{2})?$/;
        if (!pattern.test(form.price)) {
            form.price = parseFloat(form.price).toFixed(2);
        }
        try {
            if (!pattern.test(form.priceSingle)) {
                form.priceSingle = parseFloat(form.priceSingle).toFixed(2);
            }
        } catch (e) {}
        var formatedSinglePrice = form.currency + '' + lfb_formatPrice(parseFloat(form.priceSingle), formID);
        var formatedPrice = form.currency + '' + lfb_formatPrice(parseFloat(form.price), formID);
        var labelA = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-rangelabelbetween');
        var labelB = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-rangelabeland');
        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-totalrange]') && parseFloat(form.price) > 0) {
            if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').is('.lfb_notNull')) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').addClass('lfb_notNull');
            }
            var range = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-totalrange'));
            var rangeMin = (parseFloat(form.price) - range / 2);
            var rangeMax = parseFloat(form.price) + range / 2;
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-rangemode="percent"]')) {
                rangeMin = parseFloat(form.price) - ((parseFloat(form.price) * range) / 100);
                rangeMax = parseFloat(form.price) + ((parseFloat(form.price) * range) / 100);
            }
            if (rangeMin < 0) {
                rangeMin = 0;
            }

            formatedPrice = labelA + '<br/><strong>' + form.currency + '' + lfb_formatPrice(rangeMin, formID) + '</strong><br/>' + labelB + '<br/><strong>' + form.currency + '' + lfb_formatPrice(rangeMax, formID) + '</strong>';
        } else {
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').removeClass('lfb_notNull');
        }
        if (form.currencyPosition != 'left') {
            formatedPrice = lfb_formatPrice(form.price, formID) + '' + form.currency;
            formatedSinglePrice = lfb_formatPrice(form.priceSingle, formID) + '' + form.currency;
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-totalrange]') && parseFloat(form.price) > 0) {
                if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').is('.lfb_notNull')) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').addClass('lfb_notNull');
                }
                var range = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-totalrange'));
                var rangeMin = (parseFloat(form.price) - range / 2);
                var rangeMax = parseFloat(form.price) + range / 2;
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-rangemode="percent"]')) {
                    rangeMin = parseFloat(form.price) - ((parseFloat(form.price) * range) / 100);
                    rangeMax = parseFloat(form.price) + ((parseFloat(form.price) * range) / 100);
                }
                if (rangeMin < 0) {
                    rangeMin = 0;
                }
                formatedPrice = labelA + '<br/><strong>' + lfb_formatPrice(rangeMin, formID) + form.currency + '</strong><br/>' + labelB + '<br/><strong>' + lfb_formatPrice(rangeMax, formID) + form.currency + '</strong>';
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').removeClass('lfb_notNull');
            }
        }
        if (form.showTotalBottom == 1) {
            if (hasSinglePrice && form.priceSingle > 0) {
                if (form.price < 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom').removeClass('lfb_priceSingle');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom>span.lfb_subPrice').remove();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom>br').remove();

                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom').addClass('lfb_priceSingle');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom').each(function() {
                        if ($(this).find('.lfb_subPrice').length == 0) {
                            $(this).find('>span:eq(0)').after('<br/><span class="lfb_subPrice">+ ' + formatedPrice + '</span>');

                        }
                    });
                }
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom').removeClass('lfb_priceSingle');
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom>span.lfb_subPrice').remove();
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom>br').remove();
            }


            if (hasSinglePrice && form.priceSingle > 0) {
                if (form.price <= 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span:first-child').html(formatedSinglePrice);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span.lfb_subPrice').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span:eq(2)').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom .lfb_subTxtBottom').hide();
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span.lfb_subPrice').show();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span:eq(2)').show();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span:first-child').html(formatedSinglePrice);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span.lfb_subPrice').html('+ ' + formatedPrice);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom .lfb_subTxtBottom').show();
                }

            } else {
                if (form.price <= 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom .lfb_subTxtBottom').hide();
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom .lfb_subTxtBottom').show();
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_totalBottom> span:first-child').html(formatedPrice);

            }
        }
        if (form.showSteps == 0) {
            if (hasSinglePrice && form.priceSingle > 0) {
                if (form.price < 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').removeClass('lfb_priceSingle');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price>span.lfb_subPrice').remove();

                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').addClass('lfb_priceSingle');
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span.lfb_subPrice').length == 0) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price>span:eq(0)').after('<span class="lfb_subPrice">+ ' + formatedPrice + '</span>');

                    }
                }
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').removeClass('lfb_priceSingle');
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price>span.lfb_subPrice').remove();
            }


            if (hasSinglePrice && form.priceSingle > 0) {
                if (form.price <= 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').css('top', '6px');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').html(formatedSinglePrice);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span.lfb_subPrice').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:eq(2)').hide();
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').css('top', '-5px');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span.lfb_subPrice').show();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:eq(2)').show();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').html(formatedSinglePrice);
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span.lfb_subPrice').html('+ ' + formatedPrice);
                }

            } else {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-isSubs="true"]')) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').css('position', 'relative').css('top', '6px');
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').css('position', 'relative').css('top', '0px');
                }
                if (form.price > 0) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').css('position', 'relative').css('top', '0px');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:eq(1)').show();
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:eq(1)').hide();
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').html(formatedPrice);

            }
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').length > 0) {
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price> span:first-child').html().length > 8) {
                    if (parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size')) >= 16) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size', '16px');
                    }
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size', '18px');
                }
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price > span:first-child').html().length > 9) {
                    if (parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size')) >= 14) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size', '14px');
                    }
                }
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price > span:first-child').html().length > 10) {
                    if (parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size')) >= 11) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').css('font-size', '11px');
                    }
                }
            }
            var formPrice = form.price;
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-isSubs="true"]') && form.progressBarPriceType == 'single') {
                formPrice = form.priceSingle;
            }
            var percent = (formPrice * 100) / form.priceMax;

            if (form.showInitialPrice == 1) {
                percent = ((formPrice - parseFloat(form.initialPrice)) * 100) / form.priceMax;
            }
            if (percent > 100) {
                percent = 100;
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar').css('width', percent + '%');
            if ($('body').is('.rtl')) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').animate({
                    right: percent + '%'
                }, 70);
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .genPrice .progress .progress-bar-price').animate({
                    left: percent + '%'
                }, 70);
            }
        }

        var summaryPrice = form.currency + '' + lfb_formatPrice(parseFloat(form.price).toFixed(2), formID);
        var summaryPriceSingle = form.currency + '' + lfb_formatPrice(parseFloat(form.priceSingle).toFixed(2), formID);
        if (form.currencyPosition != 'left') {
            summaryPrice = lfb_formatPrice(parseFloat(form.price).toFixed(2), formID) + '' + form.currency;
            summaryPriceSingle = lfb_formatPrice(parseFloat(form.priceSingle).toFixed(2), formID) + '' + form.currency;
        }

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table #lfb_summaryTotal>span:eq(0)').html(summaryPrice);

        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-totalrange]') && parseFloat(form.price) > 0) {
            var labelA = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-rangelabelbetween');
            var labelB = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-rangelabeland');
            var range = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-totalrange'));
            var rangeMin = (parseFloat(form.price) - range / 2);
            var rangeMax = parseFloat(form.price) + range / 2;
            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-rangemode="percent"]')) {
                rangeMin = parseFloat(form.price) - ((parseFloat(form.price) * range) / 100);
                rangeMax = parseFloat(form.price) + ((parseFloat(form.price) * range) / 100);
            }
            if (rangeMin < 0) {
                rangeMin = 0;
            }

            formatedPrice = labelA + '<br/><strong>' + form.currency + '' + lfb_formatPrice(rangeMin, formID) + '</strong><br/>' + labelB + '<br/><strong>' + form.currency + '' + lfb_formatPrice(rangeMax, formID) + '</strong>';

            if (form.currencyPosition != 'left') {
                var range = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-totalrange'));
                formatedPrice = labelA + '<br/><strong>' + lfb_formatPrice(rangeMin, formID) + form.currency + '</strong><br/>' + labelB + '<br/><strong>' + lfb_formatPrice(rangeMax, formID) + form.currency + '</strong>';
            }
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table #lfb_summaryTotal>span:eq(0)').html(formatedPrice.replace(/<br\/>/g, ' '));

        }
        lfb_updateSummary(formID);
        if (hasSinglePrice && form.priceSingle > 0) {
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(0)').html(formatedSinglePrice);
            if (form.price <= 0) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').css('display', 'none');
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(2)').css('display', 'none');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table #lfb_summaryTotal>span:eq(0)').html('<strong>' + summaryPriceSingle + '</strong>');

            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(2)').css('display', 'inline-block');
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').html('+' + formatedPrice + form.subscriptionText);
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').css('display', 'block');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_summary table #lfb_summaryTotal>span:eq(0)').html('<strong>' + summaryPriceSingle + '</strong> <br/>+' + summaryPrice);

            }
        } else if (form.priceSingle == 0 && form.price == 0) {
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').css('display', 'none');
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(2)').css('display', 'none');
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(0)').html(formatedPrice);
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').html(form.subscriptionText);

        } else if (form.priceSingle == 0 && form.price > 0) {
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(0)').html(formatedPrice);
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').html(form.subscriptionText);
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(2)').css('display', 'inline-block');
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').css('display', 'inline-block');
        } else {
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(2)').css('display', 'inline-block');
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(1)').css('display', 'inline-block');
            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice span:eq(0)').html(formatedPrice);
        }

        lfb_updateShowSteps(formID);
        lfb_updateShowItems(formID);
        lfb_updateLayerImages(formID);
        lfb_updateStep(formID);
        lfb_updateRichTextValues(formID);
    }


    function lfb_updateItemTitleNoReduc($item, form) {
        var formID = form.formID;
        if (form.currencyPosition == 'left') {
            if ($item.is('[data-showprice="1"]')) {
                if ($item.data('operation') == "+") {
                    $item.attr('title', $item.data('originaltitle') + ' : ' + form.currency + (lfb_formatPrice($item.data('price'), formID)));
                    $item.attr('data-original-label', $item.data('originallabel') + ' : ' + form.currency + (lfb_formatPrice($item.data('price'), formID)));
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : ' + form.currency + (lfb_formatPrice($item.data('price'), formID)));

                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {


                        }
                    }
                    lfb_updateLabelItem($item, formID);
                } else if ($item.data('operation') == "-") {
                    $item.attr('data-original-label', $item.data('originallabel') + ' : -' + form.currency + (lfb_formatPrice($item.data('price'), formID)));
                    $item.attr('title', $item.data('originaltitle') + ' : -' + form.currency + (lfb_formatPrice($item.data('price'), formID)));
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {}
                    }

                    $item.attr('data-original-label', $item.data('originallabel') + ' : -' + form.currency + (lfb_formatPrice($item.data('price'), formID)));
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : -' + form.currency + (lfb_formatPrice($item.data('price'), formID)));
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {}
                    }
                    lfb_updateLabelItem($item, formID);
                } else if ($item.data('operation') == "x") {

                    $item.attr('title', $item.data('originaltitle') + ' : +' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    $item.attr('data-original-label', $item.data('originallabel') + ' : +' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : +' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    lfb_updateLabelItem($item, formID);
                } else {
                    $item.attr('title', $item.data('originaltitle') + ' : -' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    $item.attr('data-original-label', $item.data('originallabel') + ' : -' + (lfb_formatPrice($item.data('price'), formID)) + '%');

                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : -' + (lfb_formatPrice($item.data('price'), formID)) + '%');



                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    lfb_updateLabelItem($item, formID);
                }
            } else {
                if ($item.is('[data-tooltiptext]')) {
                    $item.attr('data-bs-original-title', $(this).attr('data-tooltiptext'));

                } else {
                    $item.attr('data-bs-original-title', $item.data('originaltitle'));

                }
            }
        } else {
            if ($item.is('[data-showprice="1"]')) {
                if ($item.attr('data-operation') == "+") {
                    $item.attr('title', $item.data('originaltitle') + ' : ' + (lfb_formatPrice($item.data('price'), formID)) + form.currency);
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : ' + (lfb_formatPrice($item.data('price'), formID)) + form.currency);
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    lfb_updateLabelItem($item, formID);
                } else if ($item.attr('data-operation') == "-") {
                    $item.attr('title', $item.data('originaltitle') + ' : -' + (lfb_formatPrice($item.data('price'), formID)));
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : -' + (lfb_formatPrice($item.data('price'), formID)) + form.currency);
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    lfb_updateLabelItem($item, formID);
                } else if ($item.attr('data-operation') == "x") {
                    $item.attr('title', $item.data('originaltitle') + ' : +' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {


                        }
                    }
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : +' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    lfb_updateLabelItem($item, formID);
                } else {
                    $item.attr('title', $item.data('originaltitle') + ' : -' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    $item.attr('data-bs-original-title', $item.data('originaltitle') + ' : -' + (lfb_formatPrice($item.data('price'), formID)) + '%');
                    if (form.disableTipMobile == 0 || !lfb_is_touch_device()) {
                        if (!$item.is('[data-type="slider"]') && !$item.is('.lfb_button') && form.imgTitlesStyle == '') {

                        }
                    }
                    lfb_updateLabelItem($item, formID);
                }
            } else {
                if ($item.is('[data-tooltiptext]')) {
                    $item.attr('data-bs-original-title', $(this).attr('data-tooltiptext'));

                } else {
                    $item.attr('data-bs-original-title', $item.data('originaltitle'));

                }
            }
        }
        if ($item.parent().children('.lfb_imgTitle').length > 0 && $item.is('[data-bs-original-title]')) {
            $item.parent().children('.lfb_imgTitle').html($item.attr('data-bs-original-title'));
        }

    }

    function lfb_isDecimal(n) {
        if (n == "")
            return false;

        var strCheck = "0123456789";
        var i;

        for (i in n) {
            if (strCheck.indexOf(n[i]) == -1)
                return false;
        }
        return true;
    }


    function lfb_changeContentSlide(dir, formID) {
        var index = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide.active').index();
        if (dir == 'left') {
            if (index > 0) {
                index--;
            } else {
                index = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide').length;
            }
        } else {
            if (index < $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide').length - 1) {
                index++;
            } else {
                index = 0;
            }
        }
        $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide.active').fadeOut(500, function() {
            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide.active').removeClass('active');
            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide').eq(index).delay(200).fadeIn(500, function() {
                $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"]').find('.lfb_genContent').find('.lfb_genContentSlide').eq(index).delay(250).addClass('active');
            });
        });
    }

    function lfb_toggleField(fieldID, formID) {
        var form = lfb_getForm(formID);
        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #field_' + fieldID + '_cb').is(':checked')) {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #field_' + fieldID).addClass('opened');
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #field_' + fieldID).slideDown(250);
        } else {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #field_' + fieldID).removeClass('opened');
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #field_' + fieldID).slideUp(250);
        }
        setTimeout(function() {
            var titleHeight = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_stepTitle').height();
            var heightP = $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid=' + form.step + '] .lfb_genContent').outerHeight() + parseInt($(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').css('padding-bottom')) + 102 + titleHeight;
            if (form.step == 'final') {
                heightP -= 80;
            }

            var animSpeed = 300;
            if (form.animationsSpeed == 0) {
                animSpeed = 0;
            }
            $(' #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').animate({ minHeight: heightP }, animSpeed);
        }, 300);
    }

    function lfb_finalStep(formID) {
        var form = lfb_getForm(formID);
        form.step++;
        if (form.enablePdfDownload == 1) {
            var win = window.open(form.homeUrl + '/index.php?EPFormsBuilder=downloadMyOrder', '_blank');
            if (typeof(win) !== 'null' && win != null) {
                win.focus();
                setTimeout(function() {
                    win.close();
                }, 400);
            }
        }
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').trigger('formSent');
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_loader').delay(800).fadeOut(form.animationsSpeed * 2);
        if (form.redirectionDelay == 0) {
            form.redirectionDelay = 1;
        }
        setTimeout(function() {
            var redirUrl = lfb_getRedirectionURL(formID);
            if (redirUrl != "" && redirUrl != "#" && redirUrl != " ") {
                if (form.urlVariables != '') {
                    if (redirUrl.indexOf('?') > -1) {
                        form.urlVariables.replace('?', '&');
                    }
                }
                document.location.href = redirUrl + form.urlVariables;
            }

        }, form.redirectionDelay * 1000);

    }


    function lfb_updateStep(formID) {
        var form = lfb_getForm(formID);
        if (form.showSteps == 1) {

            var realPlannedSteps = new Array();
            var noHideBtn = false;
            jQuery.each(lfb_plannedSteps, function() {
                if (!noHideBtn && !$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"]').is('.lfb_disabled') &&
                    ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"] .lfb_item:not(.lfb-hidden)').length > 0 ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"] .lfb_distanceError').length > 0)) {
                    realPlannedSteps.push(this);
                }
            });
            var disp_step = 0;
            jQuery.each(realPlannedSteps, function(i, v) {
                if (parseInt(v) == parseInt(form.step)) {
                    disp_step = i;
                }
            });
            disp_step++;
            if (disp_step == 0) {
                disp_step = 1;
            }
            if (form.step == 'final') {
                disp_step = realPlannedSteps.length + 1;
            }
            var totalStep = realPlannedSteps.length + 1;
            if (disp_step > totalStep) {
                disp_step = totalStep;
            }
            var percent = ((disp_step) * 100) / totalStep;
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .genPrice .progress .progress-bar-price> span:first-child').html((disp_step) + '/' + totalStep);
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .genPrice .progress .progress-bar').css('width', percent + '%');
        } else if (form.showSteps == 3) {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_stepper *:not(#lfb_stepperBar)').remove();
            var noHideBtn = false;
            var realPlannedSteps = new Array();
            jQuery.each(lfb_plannedSteps, function() {
                if (!noHideBtn && !$('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"]').is('.lfb_disabled') &&
                    ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"] .lfb_item:not(.lfb-hidden)').length > 0 ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"] .lfb_distanceError').length > 0)) {
                    realPlannedSteps.push(this);


                }
            });
            var chkCurrentStep = false;
            var currentStepID = parseInt($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide.lfb_activeStep').attr('data-stepid'));
            jQuery.each(realPlannedSteps, function(i) {

                var stepTitle = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + this + '"] .lfb_stepTitle').html();
                var point = $('<a href="javascript:"  class="lfb_stepperPoint" data-stepid="' + this + '" title="' + stepTitle + '"></a>');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_stepper').append(point);


                point.tooltip({
                    html: true,
                    container: '#lfb_form[data-form="' + formID + '"]',
                    placement: 'bottom'
                });

                if (chkCurrentStep) {
                    point.addClass('lfb_disabledPoint');
                } else if (parseInt(this) == currentStepID) {
                    point.addClass('lfb_currentPoint');
                    chkCurrentStep = true;
                } else {
                    point.on('click', function() {
                        var stepID = parseInt($(this).attr('data-stepid'));
                        lfb_returnToStep(stepID, formID);
                    });
                }

                var posX = (100 / realPlannedSteps.length) * (i);
                if ((posX == 100 || posX == 0) && realPlannedSteps.length == 1) {
                    posX = 50;
                } else {
                    posX += (100 / realPlannedSteps.length) / 2;
                }
                point.css({
                    left: posX + '%'
                });
                if (parseInt(this) == currentStepID) {

                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_stepper #lfb_stepperBar').css({
                        width: posX + '%'
                    });
                }
            });
            if (form.step == 'final') {
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_stepper #lfb_stepperBar').css({
                    width: '100%'
                });
            }
        }
    }

    function lfb_initPanelResize(formID) {
        var form = lfb_getForm(formID);
        $(window).resize(function() {
            lfb_resize(form);
        });
    }

    function lfb_resizeAll() {
        $(window).trigger('resize');
    }

    function lfb_resize(form) {
        var titleHeight = $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_stepTitle').height();
        var heightP = $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_genContent').outerHeight() + parseInt($(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel').css('padding-bottom')) + 102 + titleHeight;
        if (form.step == 'final') {
            heightP -= 80;
        }
        var animSpeed = 300;
        if (form.animationsSpeed == 0) {
            animSpeed = 0;
        }
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel').animate({ minHeight: heightP }, animSpeed);
        if (form.useSignature == 1) {
            $('#lfb_form[data-form="' + form.formID + '"] #lfb_signature canvas').attr('width', $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_signature').width());
        }
    }

    function lfb_rgb2hex(rgb) {
        if (rgb.indexOf('rgb') > -1) {
            try {
                rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            } catch (e) {
                return rgb;
            }
        } else {
            return rgb;
        }
    }

    function lfb_formatPriceWithCurrency(price, formID) {
        var form = lfb_getForm(formID);
        price = lfb_formatPrice(price, formID);
        if (form.currencyPosition == 'left') {
            price = form.currency + price;
        } else {
            price += form.currency;
        }
        return price;
    }

    function lfb_formatPrice(price, formID, forceDecimals) {
        if (!price) {
            price = 0;
        }
        if (typeof(forceDecimals) == 'undefined') {
            var forceDecimals = false;
        }
        var formatedPrice = price.toString();
        if (formatedPrice.indexOf('.') > -1) {
            formatedPrice = parseFloat(price).toFixed(2).toString();
        }
        var form = lfb_getForm(formID);
        if (form.summary_noDecimals == '1') {
            formatedPrice = Math.round(formatedPrice).toString();
        }
        var decSep = form.decimalsSeparator;
        var thousSep = form.thousandsSeparator;
        var priceNoDecimals = formatedPrice;
        var millionSep = form.millionSeparator;
        var billionSep = form.billionsSeparator;
        var decimals = "";
        if (formatedPrice.indexOf('.') > -1) {
            priceNoDecimals = formatedPrice.substr(0, formatedPrice.indexOf('.'));
            decimals = formatedPrice.substr(formatedPrice.indexOf('.') + 1, 2);
            formatedPrice = formatedPrice.replace('.', form.decimalsSeparator);
            if (decimals.toString().length == 1) {
                decimals = decimals.toString() + '0';
            }
            if (priceNoDecimals.length > 9) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 9) + billionSep + priceNoDecimals.substr(priceNoDecimals.length - 9, 3) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length) + form.decimalsSeparator + decimals;
            } else if (priceNoDecimals.length > 6) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 6) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length) + form.decimalsSeparator + decimals;
            } else if (priceNoDecimals.length > 3) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length) + form.decimalsSeparator + decimals;
            }
        } else {
            if (priceNoDecimals.length > 9) {
                formatedPrice = formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 9) + billionSep + priceNoDecimals.substr(priceNoDecimals.length - 9, 3) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length);
            } else if (priceNoDecimals.length > 6) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 6) + millionSep + priceNoDecimals.substr(priceNoDecimals.length - 6, 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length);
            } else if (priceNoDecimals.length > 3) {
                formatedPrice = priceNoDecimals.substr(0, priceNoDecimals.length - 3) + thousSep + priceNoDecimals.substr(priceNoDecimals.length - 3, priceNoDecimals.length);
            }
            if (forceDecimals) {
                formatedPrice += decSep + '00';
            }
        }
        return formatedPrice;

    }

    function lfb_applyCouponCode(formID) {
        var form = lfb_getForm(formID);
        var code = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_couponField').val();
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_couponField').closest('.form-group').removeClass('has-error');
        if (code.length < 3) {
            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_couponField').closest('.form-group').addClass('has-error');
        } else {
            jQuery.ajax({
                url: form.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_applyCouponCode',
                    formID: formID,
                    code: code
                },
                success: function(rep) {
                    setTimeout(function() {
                        if (rep == '0' || rep == '') {
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_couponField').closest('.form-group').addClass('has-error');
                        } else {

                            if ($('#lfb_form[data-form="' + formID + '"] #lfb_couponContainer').length > 0) {
                                $('#lfb_form[data-form="' + formID + '"] #lfb_couponContainer').slideUp();
                            }
                            var reduction = rep;
                            if (rep.indexOf('%') > 0) {
                                reduction = rep.substr(0, rep.length - 1);
                                form.reductionType = '%';
                            }
                            form.discountCode = code;
                            form.reduction = parseFloat(reduction);
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #finalSlide .lfb_genContent').animate({ opacity: 0 }, form.animationsSpeed);
                            setTimeout(function() {
                                lfb_updatePrice(formID);
                                lfb_changeStep('final', formID);
                            }, form.animationsSpeed + 100);
                        }
                    }, 200);
                }
            });
        }
    }

    function lfb_getRedirectionURL(formID) {
        var form = lfb_getForm(formID);
        var rep = form.close_url;
        if (form.useRedirectionConditions == 1) {
            jQuery.each(form.redirections, function() {
                var conditions = this.conditions.replace(/'/g, '"');
                conditions = conditions.replace(/\\"/g, '"');
                conditions = JSON.parse(conditions);
                var errors = lfb_checkConditions(conditions, formID, 'final');
                var error = errors.error;
                var errorOR = errors.errorOR;

                if ((this.conditionsOperator == 'OR' && !errorOR) || (this.conditionsOperator != 'OR' && !error)) {
                    rep = this.url;
                }

            });
        }
        return rep;
    }

    function lfb_formatQuantity(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function lfb_isSelectionMode(formID) {
        if (formID > 0) {
            return $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').is('.lfb_tldSelection');
        } else {
            return $('#lfb_form.lfb_bootstraped[data-form]').is('.lfb_tldSelection');
        }

    }

    function lfb_startFormIntro(formID) {
        if (!lfb_isSelectionMode(formID)) {
            lfb_openGenerator(formID);
        }
    }

    function lfb_initRichTextValues(formID) {
        var form = lfb_getForm(formID);
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_richtext[data-itemid]:not(.lfb_shortcode)').each(function() {
            var i = 0;
            var elementsToReplace = new Array();
            var _stepID = parseInt($(this).closest('.lfb_genSlide').attr('data-stepid'));
            if (form.richtextsContent[$(this).attr('data-itemid').toString()] !== undefined) {
                var content = form.richtextsContent[$(this).attr('data-itemid').toString()];
                while ((i = content.indexOf('[variable-', i + 1)) != -1) {
                    var variableID = content.substr(i + 10, content.indexOf(']', i) - (i + 10));
                    var value = '<span class="lfb_richVariable" data-varvariableid="' + variableID + '"></span>';

                    elementsToReplace.push({
                        oldValue: content.substr(i, (content.indexOf(']', i) + 1) - (i)),
                        newValue: value
                    });
                }


                i = 0;
                while ((i = content.indexOf('item-', i + 1)) != -1) {
                    var itemID = content.substr(i + 5, content.indexOf('_', i) - (i + 5));
                    var action = content.substr(content.indexOf('_', i) + 1, (content.indexOf(']', i) - 1) - (content.indexOf('_', i)));
                    var value = '<span class="lfb_richVariable" data-varitemid="' + itemID + '" data-action="' + action + '"></span>';

                    elementsToReplace.push({
                        oldValue: content.substr(i - 1, (content.indexOf(']', i) + 1) - (i - 1)),
                        newValue: value
                    });
                }


                if (content.indexOf('dateDifference-') > -1) {
                    while ((i = content.indexOf('dateDifference-', i + 1)) != -1) {
                        var startDateAdPosEnd = content.indexOf('_', i + 15) + 1;
                        var startDate = content.substr(i + 15, content.indexOf('_', i) - (i + 15));
                        var endDate = content.substr(startDateAdPosEnd, content.indexOf(']', startDateAdPosEnd) - (startDateAdPosEnd));

                        var itemID = startDate;
                        var action = 'dateDifference';
                        var value = '<span class="lfb_richVariable" data-varitemid="' + itemID + '" data-action="' + action + '" data-enddateid="' + endDate + '"></span>';

                        elementsToReplace.push({
                            oldValue: content.substr(i - 1, (content.indexOf(']', i) + 1) - (i - 1)),
                            newValue: value
                        });
                    }
                }

                if (content.indexOf('distance_') > -1) {
                    $target.attr('data-usedistance', 'true');
                    while ((i = content.indexOf('distance_', i + 1)) != -1) {

                        var distanceType = 'km';

                        var departAdPosEnd = content.indexOf('-', i + 9) + 1;
                        var departAdress = content.substr(i + 9, content.indexOf('-', i) - (i + 9));

                        var departCityPosEnd = content.indexOf('-', departAdPosEnd) + 1;
                        var departCity = content.substr(departAdPosEnd, content.indexOf('-', departAdPosEnd) - (departAdPosEnd));

                        var departZipPosEnd = content.indexOf('-', departCityPosEnd) + 1;
                        var departZip = content.substr(departCityPosEnd, content.indexOf('-', departCityPosEnd) - (departCityPosEnd));

                        var departCountryPosEnd = content.indexOf('_', departZipPosEnd) + 1;
                        var departCountry = content.substr(departZipPosEnd, content.indexOf('_', departZipPosEnd) - (departZipPosEnd));

                        var arrivalAdPosEnd = content.indexOf('-', departCountryPosEnd) + 1;
                        var arrivalAdress = content.substr(departCountryPosEnd, content.indexOf('-', departCountryPosEnd) - (departCountryPosEnd));

                        var arrivalCityPosEnd = content.indexOf('-', arrivalAdPosEnd) + 1;
                        var arrivalCity = content.substr(arrivalAdPosEnd, content.indexOf('-', arrivalAdPosEnd) - (arrivalAdPosEnd));

                        var arrivalZipPosEnd = content.indexOf('-', arrivalCityPosEnd) + 1;
                        var arrivalZip = content.substr(arrivalCityPosEnd, content.indexOf('-', arrivalCityPosEnd) - (arrivalCityPosEnd));

                        var arrivalCountryPosEnd = content.indexOf('_', arrivalZipPosEnd) + 1;
                        var arrivalCountry = content.substr(arrivalZipPosEnd, content.indexOf('_', arrivalZipPosEnd) - (arrivalZipPosEnd));

                        distanceType = content.substr(arrivalCountryPosEnd, content.indexOf(']', arrivalCountryPosEnd) - (arrivalCountryPosEnd));

                        var action = 'distance';
                        var value = '<span class="lfb_richVariable" data-action="' + action + '" data-distancetype="' + distanceType + '" data-departadress="' + departAdress + '" data-departcity="' + departCity + '" data-departzip="' + departZip + '" data-departcountry="' + departCountry + '" data-arrivaladress="' + arrivalAdress + '" data-arrivalcity="' + arrivalCity + '" data-arrivalzip="' + arrivalZip + '" data-arrivalcountry="' + arrivalCountry + '" ></span>';

                        elementsToReplace.push({
                            oldValue: content.substr(i - 1, (content.indexOf(']', i) + 1) - (i - 1)),
                            newValue: value
                        });
                    }



                }

                var todayDate = new Date();
                var month = todayDate.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                var today = todayDate.getFullYear().toString() + month.toString() + todayDate.getDate().toString();
                var dateFormat = lfb_forms[0].dateFormat.toUpperCase();
                dateFormat = dateFormat.replace(/\\\//g, "/");
                dateFormat = dateFormat.replace(/d /g, "DD ");
                dateFormat = dateFormat.replace(/yyyy/g, "YYYY");
                content = content.replace(/\[currentDate\]/g, moment(todayDate).format(dateFormat));
                content = content.replace(/\[total\]/g, '<span class="lfb_richVariable" data-action="total"></span>');
                content = content.replace(/\[total_quantity\]/g, '<span class="lfb_richVariable" data-action="total_quantity"></span>');

                jQuery.each(elementsToReplace, function() {
                    content = content.replace(this.oldValue, this.newValue);
                });
                $(this).html(content);
            }

        });

    }

    function lfb_updateRichTextValues(formID) {
        var form = lfb_getForm(formID);
        var todayDate = new Date();
        var month = todayDate.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var today = todayDate.getFullYear().toString() + month.toString() + todayDate.getDate().toString();
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_richtext[data-itemid]:not(.lfb_shortcode) .lfb_richVariable[data-varvariableid]').each(function() {
            var variableID = $(this).attr('data-varvariableid');
            var variable = lfb_getVariableByID(form, variableID);
            var value = 0;
            if (variable) {
                if (variable.type == 'float') {
                    value = lfb_formatPrice(parseFloat(variable.value), formID);
                } else {
                    value = variable.value;
                }

            }

            $(this).html(value);
        });
        var lastAndCurrentSteps = JSON.parse(JSON.stringify(lfb_lastSteps));
        if (form.step != 'final' && jQuery.inArray(parseInt(form.step), lastAndCurrentSteps) == -1) {
            lastAndCurrentSteps.push(parseInt(form.step));
        } else if (form.step == 'final') {
            lastAndCurrentSteps.push('final');
        }

        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_richtext[data-itemid]:not(.lfb_shortcode) .lfb_richVariable:not([data-varvariableid])').each(function() {
            var i = 0;
            var _stepID = parseInt($(this).closest('.lfb_genSlide').attr('data-stepid'));
            var targetID = $(this).closest('.lfb_richtext').attr('data-itemid');

            var itemID = $(this).attr('data-varitemid');
            var action = $(this).attr('data-action');
            var value = 0;
            var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]');

            var itemStepID = $item.closest('.lfb_genSlide').attr('data-stepid');
            if (itemStepID != 'final') {
                itemStepID = parseInt(itemStepID);
            }

            if (action == 'price') {
                value = 0;
                if (jQuery.inArray(itemStepID, lastAndCurrentSteps) > -1) {
                    if (itemID == 'total') {
                        value = form.price;
                    } else {
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('.checked') ||
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is(':checked') ||
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('select') ||
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('[data-type="slider"]')) {
                            value = parseFloat($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').data('resprice'));
                            if (isNaN(value)) {
                                value = 0;
                            }
                        }
                    }
                    value = lfb_formatPrice(parseFloat(value), formID, true);
                    if (form.currencyPosition == 'left') {
                        value = form.currency + value;
                    } else {
                        value += form.currency;
                    }
                }
            }
            if (action == 'title' || action == 'label') {
                if (jQuery.inArray(itemStepID, lastAndCurrentSteps) > -1 && !$item.is('.lfb_disabled')) {

                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('.checked') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is(':checked') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('select') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('[type="text"]') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('[type="number"]') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('textarea') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('.lfb_colorPreview') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('lfb_layeredImage') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('[data-type="slider"]') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('.lfb_dropzone') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('[data-type="slider"]')) {
                        value = $item.attr('data-originallabel');

                    } else {
                        value = '';

                    }
                } else {
                    value = '';
                }
            }
            if (action == 'quantity') {
                if (jQuery.inArray(itemStepID, lastAndCurrentSteps) > -1) {
                    if ($item.is('input') || $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('.checked') ||
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is(':checked')) {
                        if ($item.is('input')) {
                            value = $item.val();
                        } else if ($item.find('.icon_quantity').length > 0) {
                            value = parseFloat($item.find('.icon_quantity').html());
                        } else {
                            value = $item.find('.lfb_qtfield').val();
                        }
                        if (isNaN(value)) {
                            value = 0;
                        }
                    } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('[data-type="slider"]')) {
                        value = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').slider('value');
                    }
                    value = lfb_formatPrice(parseFloat(value), formID);
                }
            }
            if (action == 'image') {
                if (jQuery.inArray(itemStepID, lastAndCurrentSteps) > -1 && !$item.is('.lfb_disabled') && $item.is('.checked')) {
                    value = '<img src="' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"] img').attr('src') + '" alt=""/>';
                } else {
                    value = '';
                }
            }
            if (action == 'value') {
                if (jQuery.inArray(itemStepID, lastAndCurrentSteps) > -1 && !$item.is('.lfb_disabled')) {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').is('select')) {
                        value = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').val();
                    } else {
                        value = ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + itemID + '"]').val());

                    }
                } else {
                    value = '';
                }
            }
            if (action == 'date') {
                if (jQuery.inArray(itemStepID, lastAndCurrentSteps) > -1 && $item.is('.lfb_datepicker') && $item.datetimepicker("getDate") != null) {
                    value = moment.utc($item.datetimepicker("getDate")).format('YYYY-MM-DD');
                } else {
                    value = "null";
                }
            }
            if (action == 'dateDifference') {
                var startDate = itemID;
                var endDate = $(this).attr('data-enddateid');

                if (startDate == 'currentDate') {
                    startDate = todayDate;
                } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + startDate + '"]').length > 0 &&
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + startDate + '"]').val().length > 0) {
                    var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + startDate + '"]');
                    startDate = $item.datetimepicker("getDate");
                } else {
                    startDate = todayDate;
                }
                if (endDate == 'currentDate') {
                    endDate = today;
                } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + endDate + '"]').length > 0 &&
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + endDate + '"]').val().length > 0) {
                    var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + endDate + '"]');
                    endDate = $item.datetimepicker("getDate");
                } else {
                    endDate = todayDate;
                }


                var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
                var result = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (result < 0) {
                    result = 0;
                }
                value = result;
            }
            if (action == 'distance') {
                var departAdress = $(this).attr('data-departadress');
                var departCity = $(this).attr('data-departcity');
                var departZip = $(this).attr('data-departzip');
                var departCountry = $(this).attr('data-departcountry');
                var arrivalAdress = $(this).attr('data-arrivaladress');
                var arrivalCity = $(this).attr('data-arrivalcity');
                var arrivalZip = $(this).attr('data-arrivalzip');
                var arrivalCountry = $(this).attr('data-arrivalcountry');
                var distanceType = $(this).attr('data-distancetype');

                if (departAdress != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departAdress + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departAdress + '"]');
                        departAdress = $item.val();
                    } else {
                        departAdress = 0;
                    }
                }
                if (departCity != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCity + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCity + '"]');
                        departCity = $item.val();
                    } else {
                        departCity = 0;
                    }
                }
                if (departZip != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departZip + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departZip + '"]');
                        departZip = $item.val();
                    } else {
                        departZip = 0;
                    }
                }
                if (departCountry != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCountry + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCountry + '"]');
                        departCountry = $item.val();
                    } else {
                        departCountry = 0;
                    }
                }
                if (arrivalAdress != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalAdress + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalAdress + '"]');
                        arrivalAdress = $item.val();
                    } else {
                        arrivalAdress = 0;
                    }
                }
                if (arrivalCity != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCity + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCity + '"]');
                        arrivalCity = $item.val();
                    } else {
                        arrivalCity = 0;
                    }
                }
                if (arrivalZip != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalZip + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalZip + '"]');
                        arrivalZip = $item.val();
                    } else {
                        arrivalZip = 0;
                    }
                }
                if (arrivalCountry != "") {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCountry + '"]').length > 0) {
                        var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCountry + '"]');
                        arrivalCountry = $item.val();
                    } else {
                        arrivalCountry = 0;
                    }
                }
                if ($target.closest('.lfb_genSlide').find('.lfb_distanceError').length > 0) {
                    lfb_removeDistanceError(targetID, formID);
                }
                var distanceCode = content.substr(i - 1, (content.indexOf(']', i) + 1) - (i - 1));
                var distance = 0;
                if ($target.attr('data-distance') != "") {
                    distance = parseFloat($target.attr('data-distance'));
                }
                if (departAdress == "" && departCity == "" && departCountry == "" && arrivalAdress == "" && arrivalCity == "" && arrivalCountry == "" && departZip == "" && arrivalZip == "") {
                    lfb_showDistanceError(targetID, formID);
                } else {
                    if (form.gmap_key == "") {
                        lfb_showDistanceError(targetID, formID);
                        console.log("invalid gmap api key");
                    } else {
                        var depart = departAdress + ' ' + departZip + ' ' + departCity + ' ' + departCountry;
                        var arrival = arrivalAdress + ' ' + arrivalZip + ' ' + arrivalCity + ' ' + arrivalCountry;
                        if ($target.attr('data-departure') != depart || arrival != $target.attr('data-arrival')) {
                            $target.attr('data-departure', depart);
                            $target.attr('data-arrival', arrival);
                            lfb_getDistanceCalc(distanceCode, formID, targetID, depart, arrival, distanceType);
                        }
                    }
                }
                value = distance;
            }
            if (action == 'total') {
                value = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #lfb_finalPrice').html();
            } else if (action == 'total_quantity') {
                value = lfb_getTotalQuantities(formID, _stepID, targetID);
            }
            $(this).html(value);
        });
    }

    function lfb_saveForLater(formID) {
        var form = lfb_getForm(formID);
        if (form.step != '0') {

            if (localStorage.getItem('lfb_savedFormID') !== null && parseInt(localStorage.getItem('lfb_savedFormID')) == formID && localStorage.getItem('lfb_savedForm') !== null) {
                localStorage.removeItem('lfb_savedFormID');
                localStorage.removeItem('lfb_formsession');
                localStorage.removeItem('lfb_savedForm');
                localStorage.removeItem('lfb_savedFormPastSteps');
                localStorage.removeItem('lfb_savedFormStep');
                localStorage.removeItem('lfb_savedFormTime');
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fa,.fas,.fab').attr('class', 'fas ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext') != '') {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm span:not(.fa):not(.fas):not(.fab)').html($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext'));
                }
            } else {
                var selection = lfb_getFormContent(formID, true)[2];
                localStorage.setItem('lfb_savedFormID', formID);
                localStorage.setItem('lfb_formsession', $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').attr('data-formsession'));
                localStorage.setItem('lfb_savedForm', JSON.stringify(selection));
                localStorage.setItem('lfb_savedFormPastSteps', JSON.stringify(lfb_lastSteps));
                localStorage.setItem('lfb_savedFormStep', form.step);
                localStorage.setItem('lfb_savedFormTime', Date.now());

                var defaultIconClass = '';
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fa,.fab,.fas').length > 0) {
                    defaultIconClass = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fa,.fas,.fab').attr('class');

                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fa,.fas,.fab').attr('class', 'fas fa-check');
                }
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').removeClass('btn-default').addClass('btn-primary');
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext') != '') {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm span:not(.fa):not(.fas):not(.fab)').html($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-deltext'));
                }
                setTimeout(function() {
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fas,.fa,.fab').length > 0) {
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fas,.fa,.fab').attr('class', 'fas fa-redo');
                    }

                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').removeClass('btn-primary').addClass('btn-default');
                }, 1500);
            }
        }
    }

    function lfb_getStoredSelectionItemID(selection, itemID) {
        var rep = false;

        jQuery.each(selection, function() {
            if (this.itemid == itemID) {
                rep = this;
            }
        });

        return rep;
    }

    function lfb_loadStoredForm(formID) {
        var form = lfb_getForm(formID);
        var dateS = new Date(parseInt(form.lastS));

        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').length > 0) {
            if (localStorage.getItem("lfb_savedFormID") !== null && parseInt(localStorage.getItem("lfb_savedFormID")) == formID && localStorage.getItem("lfb_savedForm") !== null) {

                var dateSave = new Date(parseInt(localStorage.getItem("lfb_savedFormTime")));
                if (dateSave > dateS) {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fas,.fa,.fab').attr('class', 'fas fa-redo');
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext') != '') {
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm span:not(.fas):not(.fa):not(.fab)').html($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-deltext'));
                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').attr('data-formsession', localStorage.getItem('lfb_formsession'));
                    var selection = JSON.parse(localStorage.getItem("lfb_savedForm"));
                    var pastSteps = JSON.parse(localStorage.getItem("lfb_savedFormPastSteps"));
                    var currentStep = (localStorage.getItem("lfb_savedFormStep"));
                    if (jQuery.inArray(currentStep, pastSteps) == -1) {
                        pastSteps.push(currentStep);
                    }

                    if (pastSteps.length > 0) {
                        form.autoStart = true;
                        jQuery.each(pastSteps, function() {
                            var stepID = this.toString();
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-stepid="' + stepID + '"] [data-itemid]').each(function() {
                                var $item = $(this);
                                var storedItem = lfb_getStoredSelectionItemID(selection, parseInt($item.attr('data-itemid')));
                                if ($item.is('.lfb_selectable')) {
                                    if (storedItem != false) {
                                        if ($item.find('.icon_quantity').length > 0) {
                                            $item.find('.icon_quantity').html(storedItem.quantity);
                                            if ($item.find('.lfb_sliderQt').length > 0) {
                                                $item.find('.lfb_sliderQt').slider('value', parseInt(storedItem.quantity));
                                            }

                                        } else if ($item.find('.lfb_qtfield').length > 0) {
                                            $item.find('.lfb_qtfield').val(parseInt(storedItem.quantity));
                                        } else if ($item.is('[data-type="slider"]')) {
                                            $item.slider('value', parseInt(storedItem.quantity));
                                        }
                                        if (!$item.is('.checked')) {
                                            lfb_itemClick($(this), false, formID);
                                        }
                                    } else if ($item.is('.checked')) {
                                        lfb_itemClick($(this), false, formID);
                                    }
                                } else if ($item.is('.lfb_button')) {
                                    if (storedItem != false) {
                                        if (!$item.is('.checked')) {
                                            lfb_itemClick($(this), false, formID);
                                        }
                                    } else if ($item.is('.checked')) {
                                        lfb_itemClick($(this), false, formID);
                                    }
                                } else if ($item.is('[data-toggle="switch"]')) {
                                    if (storedItem != false) {
                                        if (!$item.is(':checked')) {
                                            $item.trigger('click');
                                        }
                                    } else if ($item.is('.checked')) {
                                        lfb_itemClick($(this), false, formID);
                                    }
                                } else if ($item.is('.lfb_colorPreview')) {
                                    if (storedItem != false) {
                                        $item.closest('.lfb_itemBloc').find('.lfb_colorpicker').val(storedItem.value);
                                    }
                                } else if ($item.is('.lfb_datepicker')) {
                                    if (storedItem != false) {
                                        $item.val(storedItem.value);
                                    }
                                } else if ($item.is('.lfb_dropzone')) {
                                    if (storedItem != false) {
                                        var dropzoneField = Dropzone.forElement('#' + $item.attr('id'));
                                        var fileName = storedItem.value;
                                        fileName = fileName.replace('- <span class="lfb_file">', '');
                                        fileName = fileName.replace(' ', '');
                                        fileName = fileName.replace('</span>', '');
                                        fileName = fileName.replace('<br/>', '');
                                        var preloadedFile = {
                                            name: fileName,
                                            size: 12345,
                                            accepted: true,
                                            kind: 'image'
                                        };
                                        dropzoneField.emit("addedfile", preloadedFile);
                                        dropzoneField.files.push(preloadedFile);
                                        dropzoneField.createThumbnailFromUrl(preloadedFile, form.imgPreview, function() {
                                            dropzoneField.emit("complete", preloadedFile);
                                        }, "anonymous");
                                    }
                                } else if ($item.is('[data-type="numberfield"]')) {
                                    if (storedItem != false) {
                                        if ($item.is('[data-valueasqt="1"]')) {
                                            $item.val(storedItem.quantity);
                                        } else {
                                            $item.val(storedItem.value);
                                        }
                                    }
                                } else if ($item.is('select')) {
                                    if (storedItem != false) {
                                        $item.val(storedItem.value);
                                    }
                                } else if ($item.is('[data-type="slider"]')) {
                                    if (storedItem != false) {
                                        $item.slider('value', parseInt(storedItem.quantity));
                                    }
                                } else if ($item.is('textarea')) {
                                    if (storedItem != false) {
                                        $item.val(storedItem.value);
                                    }
                                } else if ($item.is('input[type="text"]')) {
                                    if (storedItem != false) {
                                        $item.val(storedItem.value);
                                    }
                                }
                            });
                            if (stepID != currentStep) {
                                lfb_lastSteps.push(parseInt(stepID));
                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] [data-stepid="' + stepID + '"] .lfb_errorMsg').hide();
                                if (form.intro_enabled == '1') {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]  #startInfos > p').slideDown();
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnFloatingSummary').css({
                                        display: 'inline-block'
                                    });
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').css({
                                        display: 'inline-block'
                                    });

                                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_btnStart').parent().fadeOut(form.animationsSpeed, function() {
                                        if (form.showSteps != '2') {
                                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"]').find('.genPrice,#lfb_stepper').fadeIn(form.animationsSpeed);
                                        }
                                        $(' #lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel').fadeIn(form.animationsSpeed + form.animationsSpeed / 2, function() {
                                            lfb_changeStep(currentStep, formID);
                                        });
                                    });
                                } else {
                                    lfb_changeStep(currentStep, formID);
                                }
                            }
                        });
                    }
                    setTimeout(function() {
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide.lfb_activeStep').css('opacity', 1);
                    }, 2000);
                } else {

                    localStorage.removeItem('lfb_formsession');
                    localStorage.removeItem('lfb_savedFormID');
                    localStorage.removeItem('lfb_savedForm');
                    localStorage.removeItem('lfb_savedFormPastSteps');
                    localStorage.removeItem('lfb_savedFormStep');
                    localStorage.removeItem('lfb_savedFormTime');
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fa').attr('class', 'fa ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fab').attr('class', 'fab ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fas').attr('class', 'fas ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));
                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext') != '') {
                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm span:not(.fas):not(.fab):not(.fa)').html($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext'));
                    }
                }
            } else {
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fa').attr('class', 'fa ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));
                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fab').attr('class', 'fab ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));

                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').children('.fas').attr('class', 'fas ' + $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-originalicon'));
                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext') != '') {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm span:not(.fas):not(.fab):not(.fa)').html($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_btnSaveForm').attr('data-defaulttext'));
                }
            }
        }
    }

    function lfb_getCalendarByID(calendarID) {
        var rep = false;
        jQuery.each(lfb_calendars, function() {
            if (this.id == calendarID) {
                rep = this;
            }
        });
        return rep;
    }

    function lfb_getDisabledHours(calendarID, day, eventDuration, eventDurationType) {
        var disabledHours = new Array();
        var calendar = lfb_getCalendarByID(calendarID);
        if (calendar != false) {

            var enabledMins = $('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').is('[data-disableminutes="0"]');
            var maxEvents = parseInt($('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-maxevents'));
            if (isNaN(maxEvents) || maxEvents == 0) {
                maxEvents = 1;
            }

            var durationToSub = eventDurationType;
            if (eventDurationType == 'mins') {
                durationToSub = 'minutes';
            }

            var selDate = new Date(day);
            var daysWeek = new Array();
            if ($('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-daysweek').indexOf(',') > -1) {
                daysWeek = $('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-daysweek').split(',');
            }
            if (selDate.getDay() != '' && ($('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-daysweek') == selDate.getDay() || daysWeek.indexOf(selDate.getDay()) > -1)) {
                for (var i = 0; i < 24; i++) {
                    disabledHours.push(parseInt(i));
                }

            } else {
                if ($('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"][data-hoursdisabled]').attr('data-hoursdisabled') != '') {
                    var hoursDisabledData = $('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-hoursdisabled');
                    if (hoursDisabledData.indexOf(',') > -1) {
                        jQuery.each(hoursDisabledData.split(','), function() {
                            var hour = parseInt(this);
                            disabledHours.push(hour);
                            if (eventDurationType == 'hours') {
                                for (var i = 0; i < parseInt(eventDuration); i++) {
                                    if (jQuery.inArray(hour - i, disabledHours) == -1) {
                                        disabledHours.push(hour - i);
                                    }
                                }
                            } else if (eventDurationType == 'mins') {
                                for (var i = 0; i <= Math.floor(eventDuration / 60); i++) {
                                    if (jQuery.inArray(hour - i, disabledHours) == -1) {
                                        disabledHours.push(hour - i);
                                    }
                                }
                            }
                        });
                    } else {
                        disabledHours.push(parseInt(hoursDisabledData));
                    }
                }

                var nbEventsHours = [];
                for (var i = 0; i < 24; i++) {
                    nbEventsHours[i] = 0;
                }

                jQuery.each(calendar.events, function() {
                    var startDate = moment(this.startDate);
                    startDate = startDate.subtract(parseInt(eventDuration), durationToSub);
                    startDate = startDate.add(5, 'minute');

                    for (var i = 0; i < 24; i++) {
                        var formatedI = i;
                        if (i < 10) {
                            formatedI = '0' + i;
                        }
                        var currentDate = moment(day + ' ' + formatedI + ':00');
                        if (((!enabledMins && currentDate.isSameOrAfter(startDate, 'hour')) || (enabledMins && currentDate.isAfter(startDate, 'hour'))) && currentDate.isBefore(moment(this.endDate), 'hour')) {
                            nbEventsHours[i]++;
                            if (nbEventsHours[i] >= maxEvents) {
                                if (jQuery.inArray(i, disabledHours) == -1) {
                                    disabledHours.push(parseInt(i));
                                }
                            }
                        }
                    }
                });
            }
        }
        return disabledHours;
    }

    function lfb_getDisabledMinutes(calendarID, day, hour, eventDuration, eventDurationType) {
        var disabledMinutes = new Array();
        var calendar = lfb_getCalendarByID(calendarID);

        if (calendar != false) {

            var maxEvents = parseInt($('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-maxevents'));
            if (isNaN(maxEvents) || maxEvents == 0) {
                maxEvents = 1;
            }

            var disabledHours = lfb_getDisabledHours(calendarID, day, eventDuration, eventDurationType);

            var durationToSub = eventDurationType;
            if (eventDurationType == 'mins') {
                durationToSub = 'minutes';
            }
            var hoursDisabledData = $('#lfb_form .lfb_datepicker[data-calendarid="' + calendar.id + '"]').attr('data-hoursdisabled');
            if (hoursDisabledData.indexOf(',') > -1) {
                jQuery.each(hoursDisabledData.split(','), function() {
                    var hourD = parseInt(this);
                    var maxTime = moment(new Date(day + ' ' + hourD + ':00')).subtract(parseInt(eventDuration), durationToSub).add(1, 'minute').format('YYYY-MM-DD HH:mm');
                    for (var i = 0; i <= 11; i++) {
                        if (moment(new Date(day + ' ' + hour + ':' + (i * 5))).isAfter(moment(new Date(maxTime))) && moment(new Date(day + ' ' + hour + ':' + (i * 5))).isBefore(moment(new Date(moment(new Date(day + ' ' + hourD + ':00')))))) {
                            if (jQuery.inArray(i * 5, disabledMinutes) == -1) {
                                disabledMinutes.push(parseInt(i * 5));
                            }
                        }
                    }
                });
            }
            if (jQuery.inArray(parseInt(hour), disabledHours) > -1) {
                for (var i = 0; i <= 11; i++) {
                    if (jQuery.inArray(i * 5, disabledMinutes) == -1) {
                        disabledMinutes.push(parseInt(i * 5));
                    }
                }
            }

            var nbEventsMins = [];
            for (var i = 0; i <= 11; i++) {
                nbEventsMins[parseInt(i * 5)] = 0;
            }

            jQuery.each(calendar.events, function() {
                var startDate = moment(this.startDate);
                startDate = startDate.subtract(parseInt(eventDuration), durationToSub);
                startDate = startDate.add(5, 'minute');


                var formatedHour = parseInt(hour);
                if (formatedHour < 10) {
                    formatedHour = '0' + formatedHour;
                }
                var currentDate = moment(day + ' ' + formatedHour + ':00');

                if (currentDate.isAfter(startDate, 'hour') && currentDate.isBefore(moment(this.endDate), 'hour')) {
                    for (var i = 0; i <= 11; i++) {
                        nbEventsMins[parseInt(i * 5)]++;
                        if (nbEventsMins[parseInt(i * 5)] >= maxEvents) {
                            if (jQuery.inArray(i * 5, disabledMinutes) == -1) {
                                disabledMinutes.push(parseInt(i * 5));
                            }
                        }
                    }
                } else if (currentDate.isSame(startDate, 'hour')) {
                    for (var i = 0; i <= 11; i++) {
                        if (startDate.isSame(moment(this.endDate), 'hour')) {

                            if (i * 5 >= startDate.format('mm') && i * 5 < moment(this.endDate).format('mm')) {
                                nbEventsMins[parseInt(i * 5)]++;
                                if (nbEventsMins[parseInt(i * 5)] >= maxEvents) {
                                    if (jQuery.inArray(i * 5, disabledMinutes) == -1) {
                                        disabledMinutes.push(parseInt(i * 5));
                                    }
                                }
                            }
                        } else {
                            if (i * 5 >= startDate.format('mm')) {
                                nbEventsMins[parseInt(i * 5)]++;
                                if (nbEventsMins[parseInt(i * 5)] >= maxEvents) {
                                    if (jQuery.inArray(i * 5, disabledMinutes) == -1) {
                                        disabledMinutes.push(parseInt(i * 5));
                                    }
                                }
                            }
                        }

                    }
                } else if (currentDate.isSame(moment(this.endDate), 'hour')) {
                    for (var i = 0; i <= 11; i++) {
                        if (i * 5 < moment(this.endDate).format('mm')) {
                            nbEventsMins[parseInt(i * 5)]++;
                            if (nbEventsMins[parseInt(i * 5)] >= maxEvents) {
                                if (jQuery.inArray(i * 5, disabledMinutes) == -1) {
                                    disabledMinutes.push(parseInt(i * 5));
                                }
                            }
                        }
                    }

                }

            });
        }
        return disabledMinutes;
    }

    function lfb_setAnimImmediate(e, formID) {
        var form = lfb_getForm(formID);
        form.animationsSpeed = 0;
    }

    function lfb_getCalendarEventsAtDate(calendar, date) {
        var rep = 0;
        jQuery.each(calendar.events, function() {
            var startDate = moment.utc(this.startDate);
            var endDate = moment.utc(this.endDate);
            if (date.isSameOrAfter(startDate) && (this.fullDay || date.isSameOrBefore(endDate))) {
                rep++;
            }
        });
        return rep;
    }

    function lfb_getBusyDates(formID, calendarsIDs) {
        var form = lfb_getForm(formID);
        jQuery.ajax({
            url: form.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_getBusyDates',
                formID: formID,
                calendarsIDs: calendarsIDs
            },
            success: function(rep) {
                rep = rep.trim();
                rep = JSON.parse(rep, true);
                lfb_calendars = rep.calendars;
                jQuery.each(rep.calendars, function() {

                    var _calendar = this;
                    $('#lfb_form .lfb_datepicker[data-calendarid="' + this.id + '"]').each(function() {
                        var _datepicker = $(this);

                        var disabledDates = new Array();
                        jQuery.each(_calendar.events, function() {
                            if (this.fullDay == 1) {
                                var startDate = moment.utc(this.startDate);
                                var endDate = moment.utc(this.endDate);
                                endDate.subtract(1,'minutes');
                                var startDateSt = startDate.format('YYYY-MM-DD');
                                if (lfb_getCalendarEventsAtDate(_calendar, startDate) >= _datepicker.attr('data-maxevents')) {
                                    disabledDates.push(startDateSt);
                                }

                                for (var i = 1; i <= endDate.diff(startDate, 'days'); i++) {
                                    var date = startDate.add(i, 'days');
                                    if (lfb_getCalendarEventsAtDate(_calendar, date) >= _datepicker.attr('data-maxevents')) {
                                        disabledDates.push(date.format('YYYY-MM-DD'));
                                    }
                                }
                            } else {
                                var startDate = moment.utc(this.startDate);

                                var durationToSub = _datepicker.attr('data-eventdurationtype');
                                if (_datepicker.attr('data-eventdurationtype') == 'mins') {
                                    durationToSub = 'minutes';
                                }
                                this.startDate = startDate.format('YYYY-MM-DD HH:mm');

                                var endDate = moment.utc(this.endDate);
                                var startDateSt = startDate.format('YYYY-MM-DD');

                                if (endDate.diff(startDate, 'hours') > 24) {

                                    var startI = 1;
                                    if (startDate.format('m') == 0) {
                                        startI = 0;
                                    }
                                    for (var i = startI; i <= endDate.diff(startDate, 'days'); i++) {
                                        var date = startDate.clone().add(i, 'days');
                                        if (lfb_getCalendarEventsAtDate(_calendar, date) >= _datepicker.attr('data-maxevents')) {
                                            disabledDates.push(date.format('YYYY-MM-DD'));
                                        }
                                    }
                                }
                            }
                        });
                        _datepicker.datetimepicker('setDatesDisabled', disabledDates);
                    });

                });
            }
        });
    }

    function lfb_showWinStripePayment(form) {

        var isOK = lfb_checkStepItemsValid('final', form.formID);

        if (form.legalNoticeEnable == 1) {
            if (!$('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_legalCheckbox').is(':checked')) {
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_legalCheckbox').closest('.form-group').addClass('has-error');
                isOK = false;
            }
        }

        if (isOK) {
            lfb_checkCaptcha(form, function() {
                var activatePaypal = true;
                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-activatePaypal="true"]:not(:checked):not(.checked)').each(function() {
                    var cStepID = $(this).closest('.lfb_genSlide').attr('data-stepid');
                    if (cStepID != 'final') {
                        cStepID = parseInt(cStepID);
                    }
                    if (jQuery.inArray(cStepID, lfb_lastSteps) == -1) {} else {
                        activatePaypal = false;
                    }
                });
                if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('[data-dontactivatepaypal="true"].checked,[data-dontactivatepaypal="true"]:checked').length > 0) {
                    activatePaypal = false;
                }
                if (!activatePaypal || (form.price == 0 && form.priceSingle == 0)) {
                    lfb_order(form.formID);
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-info="amount"]').html($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_finalPrice').html());

                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="loading"]').show();
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal .modal-footer').hide();
                    lfb_stripe = Stripe(form.stripePubKey);

                    var singleTotal = parseFloat(form.price);
                    var subTotal = 0;

                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-isSubs="true"]')) {
                        singleTotal = parseFloat(form.priceSingle);
                        subTotal = parseFloat(form.price);
                    }

                    if (form.payMode == 'percent') {
                        singleTotal = parseFloat(singleTotal) * (parseFloat(form.percentToPay) / 100);
                        var amountToShow = '<span>' + lfb_formatPriceWithCurrency(singleTotal, form.formID) + '</span>';
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-info="amount"]').html(amountToShow);

                    } else if (form.payMode == 'fixed') {
                        singleTotal = parseFloat(form.fixedToPay);
                        var amountToShow = '<span>' + lfb_formatPriceWithCurrency(singleTotal, form.formID) + '</span>';
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-info="amount"]').html(amountToShow);
                    }

                    if (form.stripeToken == '' || (typeof(form.stripeAmountSingle) != 'undefined' && form.stripeAmountSingle != singleTotal) || (typeof(form.stripeAmountSingle) != 'undefined' && form.stripeAmountSub != subTotal)) {

                        jQuery.ajax({
                            url: form.ajaxurl,
                            type: 'post',
                            data: {
                                action: 'lfb_getStripePaymentIntent',
                                singleTotal: singleTotal,
                                subTotal: subTotal,
                                formID: form.formID,
                                customerInfos: lfb_getContactInformations(form.formID, true)
                            },
                            success: function(rep) {
                                rep = JSON.parse(rep);
                                form.stripeToken = rep.token;
                                form.stripeCustomerID = rep.customerID;
                                form.stripeAmountSingle = singleTotal;
                                form.stripeAmountSub = subTotal;

                                var elements = lfb_stripe.elements();
                                form.cardElement = elements.create('cardNumber');
                                form.cardElement.mount('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-element');

                                form.cardExp = elements.create('cardExpiry');
                                form.cardExp.mount('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_expiration-element');

                                form.cardExp.addEventListener('change', function(event) {
                                    if (event.error) {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html(event.error.message);
                                    } else {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html('');
                                    }
                                });

                                form.cardCvc = elements.create('cardCvc');
                                form.cardCvc.mount('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_cvc-element');

                                form.cardCvc.addEventListener('change', function(event) {
                                    if (event.error) {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html(event.error.message);
                                    } else {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html('');
                                    }
                                });

                                form.cardElement.addEventListener('change', function(event) {
                                    if (event.error) {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html(event.error.message);
                                    } else {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html('');
                                    }
                                });
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="form"]').show();
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal .modal-footer').slideDown();

                            }
                        });
                    } else {
                        var elements = lfb_stripe.elements();
                        form.cardElement = elements.create('cardNumber');
                        form.cardElement.mount('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-element');
                        form.cardElement.addEventListener('change', function(event) {
                            if (event.error) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html(event.error.message);
                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html('');
                            }
                        });

                        form.cardExp = elements.create('cardExpiry');
                        form.cardExp.mount('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_expiration-element');

                        form.cardExp.addEventListener('change', function(event) {
                            if (event.error) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html(event.error.message);
                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html('');
                            }
                        });

                        form.cardCvc = elements.create('cardCvc');
                        form.cardCvc.mount('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_cvc-element');

                        form.cardCvc.addEventListener('change', function(event) {
                            if (event.error) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html(event.error.message);
                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripe_card-error').html('');
                            }
                        });

                        var singleTotal = parseFloat(form.price);
                        var subTotal = 0;

                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('[data-isSubs="true"]')) {
                            singleTotal = parseFloat(form.priceSingle);
                            subTotal = parseFloat(form.price);
                        }
                        if (form.payMode == 'percent') {
                            singleTotal = parseFloat(singleTotal) * (parseFloat(form.percentToPay) / 100);
                            var amountToShow = '<span>' + lfb_formatPriceWithCurrency(singleTotal, form.formID) + '</span>';
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-info="amount"]').html(amountToShow);

                        } else if (form.payMode == 'fixed') {
                            singleTotal = parseFloat(form.fixedToPay);
                            var amountToShow = '<span>' + lfb_formatPriceWithCurrency(singleTotal, form.formID) + '</span>';
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-info="amount"]').html(amountToShow);
                        }

                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="form"]').show();
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal .modal-footer').slideDown();
                    }
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal a[data-action="pay"]').unbind('click');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal a[data-action="pay"]').on('click', function() {
                        var error = false;
                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal .has-error').removeClass('has-error');
                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal [name="ownerName"]').val().length < 3) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal [name="ownerName"]').closest('.form-group').addClass('has-error');
                            error = true;
                        }
                        if (!error) {
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="loading"]').show();
                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal .modal-footer').hide();

                            lfb_stripe.createSource(form.cardElement).then(function(result) {
                                if (result.error) {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-info="error"]').html(result.error.message);
                                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="fail"]').show();
                                } else {
                                    form.stripeSrc = result.source.id;

                                    if (subTotal > 0) {
                                        jQuery.ajax({
                                            url: form.ajaxurl,
                                            type: 'post',
                                            data: {
                                                action: 'lfb_processStripeSubscription',
                                                formID: form.formID,
                                                stripeSrc: form.stripeSrc,
                                                customerID: form.stripeCustomerID,
                                                singleTotal: singleTotal,
                                                subTotal: subTotal
                                            },
                                            success: function(rep) {
                                                rep = rep.trim();
                                                if (rep == 1) {

                                                    if (singleTotal > 0) {
                                                        lfb_stripe.handleCardPayment(
                                                            form.stripeToken, form.cardElement, {
                                                                payment_method_data: {
                                                                    billing_details: { name: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal [name="ownerName"]').val() }
                                                                }
                                                            }
                                                        ).then(function(result) {
                                                            if (result.error) {
                                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-info="error"]').html(result.error);
                                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="fail"]').show();
                                                            } else {
                                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');
                                                                form.stripePaid = true;
                                                                lfb_order(form.formID);
                                                            }
                                                        });
                                                    } else {
                                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');
                                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');
                                                        form.stripePaid = true;
                                                        lfb_order(form.formID);
                                                    }

                                                } else if (rep.indexOf('pi_') > -1) {
                                                    lfb_stripe.handleCardPayment(
                                                        rep, form.cardElement, {
                                                            payment_method_data: {
                                                                billing_details: { name: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal [name="ownerName"]').val() }
                                                            }
                                                        }
                                                    ).then(function(result) {
                                                        if (result.error) {
                                                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-info="error"]').html(result.error);
                                                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                                                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="fail"]').show();
                                                        } else {
                                                            if (singleTotal > 0) {
                                                                lfb_stripe.handleCardPayment(
                                                                    form.stripeToken, form.cardElement, {
                                                                        payment_method_data: {
                                                                            billing_details: { name: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal [name="ownerName"]').val() }
                                                                        }
                                                                    }
                                                                ).then(function(result) {
                                                                    if (result.error) {
                                                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-info="error"]').html(result.error);
                                                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                                                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="fail"]').show();
                                                                    } else {
                                                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');

                                                                        form.stripePaid = true;
                                                                        lfb_order(form.formID);
                                                                    }
                                                                });
                                                            } else {
                                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');
                                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');
                                                                form.stripePaid = true;
                                                                lfb_order(form.formID);
                                                            }
                                                        }

                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        lfb_stripe.handleCardPayment(
                                            form.stripeToken, form.cardElement, {
                                                payment_method_data: {
                                                    billing_details: { name: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_stripeModal [name="ownerName"]').val() }
                                                }
                                            }
                                        ).then(function(result) {
                                            if (result.error) {
                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] [data-info="error"]').html(result.error);
                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel]').hide();
                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal [data-panel="fail"]').show();
                                            } else {
                                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('hide');
                                                form.stripePaid = true;
                                                lfb_order(form.formID);
                                            }
                                        });
                                    }


                                }
                            });


                        }
                    });
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').find('#lfb_stripeModal').modal('show');
                }
            });

        }
    }

    function lfb_checkCaptcha(form, callback) {
        if (form.useCaptcha == 1 && form.recaptcha3Key != '') {
            grecaptcha.ready(function() {
                grecaptcha.execute(form.recaptcha3Key, { action: 'sending_form' }).then(function(token) {
                    form.captcha = token;
                    callback(form);
                }).catch(function(error) {
                    console.log("Erreur lors de l'exécution de reCAPTCHA: ", error);
                    callback(form);
                });
            });
        } else {
            callback(form);
        }
    }

    function lfb_updateVariable(form, variableID, calculation, targetID) {
        for (var i = 0; i < form.variables.length; i++) {
            if (form.variables[i].id == variableID) {
                var variable = form.variables[i];
                variable.value = lfb_executeCalculation(calculation, form.formID, targetID);
                if (variable.type == 'integer') {
                    variable.value = Math.round(variable.value);
                } else if (variable.type == 'float') {
                    variable.value = variable.value;
                }
                break;
            }
        }
    }

    function lfb_getVariableByID(form, variableID) {
        var rep = false;
        for (var i = 0; i < form.variables.length; i++) {
            if (form.variables[i].id == variableID) {
                rep = form.variables[i];
                break;
            }
        }
        return rep;
    }

    function lfb_initVerificationCodeModal(form){
        const formID = form.formID;
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_verification-char').on('input', function(){
            if($(this).val().length == 1){
                if($(this).next().length > 0){
                    $(this).next().focus();
                } else {
                    lfb_checkVerificationCode(form);
                }
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_verification-char').on('keydown', function(e){
            if(e.which == 8){
                $(this).prev().focus();
            }
        });
        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').first().on('paste', function(e) {
            e.preventDefault();
            var pastedText = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
            var verificationInputs = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char');
            
            for (var i = 0; i < Math.min(pastedText.length, verificationInputs.length); i++) {
                $(verificationInputs[i]).val(pastedText[i]);
            }
            
            if (pastedText.length > 0) {
                $(verificationInputs[Math.min(pastedText.length, verificationInputs.length) - 1]).focus();
            }
            lfb_checkVerificationCode(form);
        });
    }

    function lfb_checkVerificationCode(form){

        var verificationCode = '';
        
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').each(function(){
            verificationCode += $(this).val();
        });

        $.ajax({
            url: form.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_checkVerificationCode',
                formID: form.formID,
                code: verificationCode,
                email: form.emailProposed
            },
            success: function(rep){
                rep = JSON.parse(rep);
                if(rep.success){
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_verificationModal').modal('hide');
                    form.verifiedEmail = form.emailProposed;
                    lfb_nextStep(form.formID);
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').val('');
                    $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').first().focus();
                }
            }
        });
    }

    function lfb_checkUserEmail(form) {
        var rep = true;
        var formID = form.formID;

        if (form.verifyEmail == 1  && typeof(form.stripePaid) == 'undefined' && (typeof(form.verifiedEmail) == 'undefined' || !form.verifiedEmail) && $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').length > 0) 
        {
            rep = false;
            var emailField = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').last();
            var targetEmail = emailField.val();

            form.emailProposed = targetEmail;
            $.ajax({
                url: form.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_sendVerificationCode',
                    formID: formID,
                    email: targetEmail
                }, 
                success: function(rep){
                    rep = JSON.parse(rep);
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal').modal('show');
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').val('');
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').first().focus();
                    
                    if(rep.success){
                         } else {
                            alert(rep.message);
                    }
                }
            });

        }
    
        /*  if (form.enableCustomerAccount == 1 && typeof(form.stripePaid) == 'undefined' && (typeof(form.verifiedEmail) == 'undefined' || !form.verifiedEmail) && $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').length > 0) {
            rep = false;
            var emailField = $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').last();

            if (typeof(form.emailProposed) == 'undefined' || form.emailProposed != emailField.val()) {
                form.emailProposed = emailField.val();
                jQuery.ajax({
                    url: form.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'lfb_checkEmailCustomer',
                        formID: form.formID,
                        email: form.emailProposed
                    },
                    success: function(rep) {
                        if (rep.trim() == 1) {
                            if ($('#lfb_customerPasswordField').length == 0) {
                                var passCt = $('<div id="lfb_forgotPassCt" class="form-group has-error" ></div>');
                                passCt.hide();
                                passCt.append('<div  class="input-group" ><span class="input-group-addon"><span class="fa fa-lock" ></span></span><input type="password" id="lfb_forgotPassField" class="form-control" /></div>');
                                passCt.append('<div class="lfb_forgotPassLinkCt"><a href="javascript:" id="lfb_forgotPassLink">' + form.txtCustomersDataForgotPassLink + '</a></div>');

                                emailField.closest('.form-group').after(passCt);
                                $('#lfb_forgotPassLink').on('click', function() {
                                    if (lfb_checkEmail(emailField.val())) {
                                        emailField.attr('disabled', 'disabled');
                                        jQuery.ajax({
                                            url: form.ajaxurl,
                                            type: 'post',
                                            data: {
                                                action: 'lfb_forgotPassManD',
                                                email: form.emailProposed
                                            },
                                            success: function(rep) {
                                                $('#lfb_passModal').modal('show');
                                            }
                                        });
                                    }
                                });
                                $('#lfb_form[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').slideDown();

                                if (form.disableScroll != 1) {
                                    setTimeout(function() {
                                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                                scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                            }, form.animationsSpeed * 2);
                                        } else {
                                            $('body,html').animate({
                                                scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                            }, form.animationsSpeed * 2);
                                        }

                                    }, 350);
                                }

                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassField').val('');
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassField').closest('.form-group').addClass('has-error');

                                if (form.disableScroll != 1) {
                                    setTimeout(function() {
                                        if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                                            $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                                scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                            }, form.animationsSpeed * 2);
                                        } else {
                                            $('body,html').animate({
                                                scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                            }, form.animationsSpeed * 2);
                                        }

                                    }, 350);
                                }

                            }
                        } else {
                            form.verifiedEmail = form.emailProposed;
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').removeClass('lfb_open').slideUp();
                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').last().attr('disabled', 'disabled');
                            if (form.step == 'final') {
                                if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_paymentMethodBtns').length == 0) {
                                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_btnNextContainer').css('display') != 'none') {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_btnOrder').trigger('click');
                                    } else {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_btnOrderPaypal, #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_btnPayStripe,#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #btnOrderRazorpay').trigger('click');
                                    }
                                }
                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_btn-next').trigger('click');
                            }
                        }
                    }
                });

            } else if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassField').length > 0) {
                var pass = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassField').val();
                if (pass.length > 3) {
                    jQuery.ajax({
                        url: form.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'lfb_verificationPass',
                            formID: formID,
                            pass: pass
                        },
                        success: function(rep) {
                            if (rep.trim() == 1) {
                                form.verifiedEmail = form.emailProposed;
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').removeClass('lfb_open').slideUp();
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"]').last().attr('disabled', 'disabled');
                                if (form.step == 'final') {
                                    if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_paymentMethodBtns').length == 0) {
                                        if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_btnNextContainer').css('display') != 'none') {
                                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_btnOrder').trigger('click');
                                        } else {
                                            $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_btnOrderPaypal, #lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_btnPayStripe,#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #btnOrderRazorpay').trigger('click');
                                        }
                                    }
                                } else {
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] .lfb_btn-next').trigger('click');
                                }
                            } else {
                                $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassField').closest('.form-group').addClass('has-error');

                                if (form.disableScroll != 1) {
                                    if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                                        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                            scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                        }, form.animationsSpeed * 2);
                                    } else {
                                        $('body,html').animate({
                                            scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                        }, form.animationsSpeed * 2);
                                    }
                                }
                            }
                        }
                    });
                } else {
                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').addClass('has-error');

                    if (form.disableScroll != 1) {
                        setTimeout(function() {
                            if ($('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').is('.lfb_fullscreen')) {
                                $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"]').animate({
                                    scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                }, form.animationsSpeed * 2);
                            } else {
                                $('body,html').animate({
                                    scrollTop: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] .lfb_genSlide[data-stepid="' + form.step + '"] #lfb_forgotPassCt').offset().top - (120 + parseInt(lfb_getScrollTopMargin(form)))
                                }, form.animationsSpeed * 2);
                            }

                        }, 350);
                    }

                }

            }
        }


        if(rep && form.enableCustomerAccount == 0 && (typeof(form.verifiedEmail) == 'undefined' || !form.verifiedEmail)){
            if($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"][data-cid="1"]').length > 0){
           
                const targetEmail = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide[data-stepid="' + form.step + '"] [data-fieldtype="email"][data-required="true"][data-cid="1"]').val();
                if(targetEmail.length > 0){
                    if(lfb_checkEmail(targetEmail)){
                        rep = false;
                        form.emailProposed = targetEmail;
                        $.ajax({
                            url: form.ajaxurl,
                            type: 'post',
                            data: {
                                action: 'lfb_sendVerificationCode',
                                formID: formID,
                                email: targetEmail
                            }, 
                            success: function(rep){
                                rep = JSON.parse(rep);
                                if(rep.success){
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal').modal('show');
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').val('');
                                    $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_verificationModal .lfb_verification-code-inputs .lfb_verification-char').first().focus();
                                } else {
                                    console.log(rep);
                                }
                            }
                        });
                    }
                        
                    
                }
            }
        }*/

        return rep;
    }


    function lfb_decodeCalculation(value) {
        var chars = new Array();
        chars[0] = 9;
        chars[1] = 3;
        chars[2] = 5;
        chars[3] = 8;
        chars[4] = 2;
        chars[5] = 6;
        chars[6] = 4;
        chars[7] = 1;
        chars[8] = 0;
        chars[9] = 7;

        var result = "";
        for (var i = 0; i < value.length; i++) {
            if (chars.indexOf(parseInt(value[i])) > -1) {
                result += chars[parseInt(value[i])];
            } else {
                result += value[i];
            }
        }
        return result;
    }

    function lfb_downloadAsPDF(formID) {
        var form = lfb_getForm(formID);
        var $summaryClone = lfb_cloneSummary(false, formID);
        var summaryData = $summaryClone.html();
        $summaryClone.remove();


        var contentForm = lfb_getFormContent(formID);
        var content = contentForm[0];
        content = content.replace(/<br\/>/g, '[n]');
        var totalTxt = contentForm[1];
        var items = contentForm[2];

        var infosCt = lfb_getContactInformations(formID);
        email = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] .emailField').val();
        if (lfb_checkEmail(infosCt['email'])) {
            email = infosCt['email'];
        }

        var informations = '';
        $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #finalSlide').find('.lfb_item input:not([type="checkbox"])[data-itemid],.lfb_item textarea[data-itemid],.lfb_item select[data-itemid]').each(function() {
            if ($(this).closest('#lfb_paypalForm').length == 0) {
                if ($(this).is('.lfb_disabled')) {} else {
                    if ($(this).is('#lfb_couponField')) {} else if ($(this).is('#lfb_captchaField')) {} else {
                        var dbpoints = ':';
                        if ($(this).closest('.lfb_item').find('label').html().lastIndexOf(':') == $(this).closest('.lfb_item').find('label').html().length - 1) {
                            dbpoints = '';
                        }
                        if ($('body').is('.rtl')) {
                            informations += '<p><b><span class="lfb_value">' + $(this).val() + '</span></b>' + dbpoints + ' ' + $(this).closest('.lfb_item').find('label').html() + '</p>';
                        } else {
                            informations += '<p>' + $(this).closest('.lfb_item').find('label').html() + ' ' + dbpoints + ' <b><span class="lfb_value">' + $(this).val() + '</span></b></p>';
                        }

                    }
                }
            }
        });

        jQuery.ajax({
            url: form.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_downloadOrderPDF',
                formID: form.formID,
                informations: informations,
                email: email,
                customerInfos: lfb_getContactInformations(form.formID, true),
                summary: summaryData,
                totalTxt: totalTxt,
                formSession: $('#lfb_form.lfb_bootstraped[data-form="' + form.formID + '"] #lfb_formSession').val(),
                items: items,
                useRtl: $('body').is('.rtl'),
                variables: JSON.stringify(form.variables)
            },
            success: function(rep) {

                var win = window.open(form.homeUrl + '/index.php?EPFormsBuilder=downloadMyOrder', '_blank');
                if (typeof(win) !== 'null' && win != null) {
                    win.focus();
                    setTimeout(function() {
                        win.close();
                    }, 300);
                }
            }
        });
    }

    function lfb_updateVAT(formID) {
        var form = lfb_getForm(formID);
        form.vatPrice = 0;
        if (form.useVAT == 1) {
            if (form.singlePrice > 0) {
                form.vatPrice = (form.singlePrice * form.vatAmount) / 100;
                form.singlePrice = form.singlePrice + form.vatPrice;
            } else {
                form.vatPrice = (form.price * form.vatAmount) / 100;
                form.price = form.price + form.vatPrice;
            }

        }
    }

    function lfb_updateGmapItinerary($mapItem, formID) {
        var itinerary = $mapItem.attr('data-itinerary');
        var directionRenderer = $mapItem.data('directionRenderer');
        var map = $mapItem.data('gmap');
        var init = false;
        if (!$mapItem.is('.lfb_gmapInit')) {
            init = true;
            $mapItem.addClass('lfb_gmapInit');
        }

        var i = 1;
        var departAdPosEnd = itinerary.indexOf('-', i + 9) + 1;
        var departAdress = itinerary.substr(i + 9, itinerary.indexOf('-', i) - (i + 9));

        var departCityPosEnd = itinerary.indexOf('-', departAdPosEnd) + 1;
        var departCity = itinerary.substr(departAdPosEnd, itinerary.indexOf('-', departAdPosEnd) - (departAdPosEnd));

        var departZipPosEnd = itinerary.indexOf('-', departCityPosEnd) + 1;
        var departZip = itinerary.substr(departCityPosEnd, itinerary.indexOf('-', departCityPosEnd) - (departCityPosEnd));

        var departCountryPosEnd = itinerary.indexOf('_', departZipPosEnd) + 1;
        var departCountry = itinerary.substr(departZipPosEnd, itinerary.indexOf('_', departZipPosEnd) - (departZipPosEnd));

        var arrivalAdPosEnd = itinerary.indexOf('-', departCountryPosEnd) + 1;
        var arrivalAdress = itinerary.substr(departCountryPosEnd, itinerary.indexOf('-', departCountryPosEnd) - (departCountryPosEnd));

        var arrivalCityPosEnd = itinerary.indexOf('-', arrivalAdPosEnd) + 1;
        var arrivalCity = itinerary.substr(arrivalAdPosEnd, itinerary.indexOf('-', arrivalAdPosEnd) - (arrivalAdPosEnd));

        var arrivalZipPosEnd = itinerary.indexOf('-', arrivalCityPosEnd) + 1;
        var arrivalZip = itinerary.substr(arrivalCityPosEnd, itinerary.indexOf('-', arrivalCityPosEnd) - (arrivalCityPosEnd));

        var arrivalCountryPosEnd = itinerary.indexOf('_', arrivalZipPosEnd) + 1;
        var arrivalCountry = itinerary.substr(arrivalZipPosEnd, itinerary.indexOf('_', arrivalZipPosEnd) - (arrivalZipPosEnd));

        if (departAdress != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departAdress + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departAdress + '"]');
                departAdress = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                departAdress = 0;
            }
        }
        if (departCity != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCity + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCity + '"]');
                departCity = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                departCity = 0;
            }
        }
        if (departZip != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departZip + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departZip + '"]');
                departZip = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                departZip = 0;
            }
        }
        if (departCountry != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCountry + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + departCountry + '"]');
                departCountry = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                departCountry = 0;
            }
        }
        if (arrivalAdress != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalAdress + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalAdress + '"]');
                arrivalAdress = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                arrivalAdress = 0;
            }
        }
        if (arrivalCity != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCity + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCity + '"]');
                arrivalCity = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                arrivalCity = 0;
            }
        }
        if (arrivalZip != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalZip + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalZip + '"]');
                arrivalZip = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                arrivalZip = 0;
            }
        }
        if (arrivalCountry != "") {
            if ($('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCountry + '"]').length > 0) {
                var $item = $('#lfb_form.lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel .lfb_genSlide [data-itemid="' + arrivalCountry + '"]');
                arrivalCountry = $item.val();
                if (init) {
                    $item.on('focusout change', function() {
                        lfb_updateGmapItinerary($mapItem, formID);
                    });
                }
            } else {
                arrivalCountry = 0;
            }
        }
        var depart = departAdress + ' ' + departZip + ' ' + departCity + ' ' + departCountry;
        var arrival = arrivalAdress + ' ' + arrivalZip + ' ' + arrivalCity + ' ' + arrivalCountry;

        if (depart.replaceAll(' ', '').length > 2 && arrival.replaceAll(' ', '').length > 2) {

            new google.maps.DirectionsService().route({
                    origin: {
                        query: depart,
                    },
                    destination: {
                        query: arrival,
                    },
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                    if (status === "OK") {
                        directionRenderer.setDirections(response);

                    }
                }
            );
        }
    }

    function lfb_getMapStyle(mapStyle) {
        var rep = lfb_mapStyles[0];
        for (var i = 0; i < lfb_mapStyles.length; i++) {
            if (lfb_mapStyles[i].name == mapStyle) {
                rep = lfb_mapStyles[i].styles;
                break;
            }
        }
        return rep;
    }

    function lfb_getScrollTopMargin(form) {
        if ($(window).width() <= 480) {
            return form.scrollTopMarginMobile;
        } else {
            return form.scrollTopMargin;
        }
    }

})(jQuery);
