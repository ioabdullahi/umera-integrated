(function ($) {
    "use strict";
    var lfb_isDraggingComponent = false;
    var lfb_elementHoverTimer = false;
    var lfb_currentFormID = 0;
    var lfb_currentStepID = 0;
    var lfb_currentStep = false;
    var lfb_editedItem = false;
    var lfb_copyHelper = null;
    var lfb_columnsSizes = ['1/6', '1/4', '1/3', '1/2', '2/3', '3/4', '1/1'];
    $(window).on('load', function () {

        $('#lfb_form:not(.lfb_popup)').addClass('lfb_visualReady');
        $('#lfb_form:not(.lfb_popup)').on('lfb_initComponentsMenu', lfb_initComponentsMenu);
        $('#lfb_form:not(.lfb_popup)').on('lfb_initVisualStep', lfb_initVisualStep);
        $('#lfb_form:not(.lfb_popup)').on('lfb_setBackendTheme', lfb_setBackendTheme);
        $('#lfb_form:not(.lfb_popup)').on('lfb_onItemDeleted', lfb_onItemDeleted);
        $('#lfb_form:not(.lfb_popup)').on('lfb_showComponentsMenu', lfb_showComponentsMenu);
        $('#lfb_form:not(.lfb_popup)').on('lfb_refreshItemDom', function (e, itemID) {
            lfb_refreshItemDom(itemID);
        });

        $('#lfb_form:not(.lfb_popup)').on('lfb_addComponent', lfb_addComponent);


        lfb_currentFormID = $('#lfb_form:not(.lfb_popup)').attr('data-form');
        if (typeof (window.parent) != 'undefined' && $(window.parent.document).find("#lfb_form:not(.lfb_popup)").length > 0) {
            window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_stepFrameLoaded');
            lfb_initComponentsMenu();
        }
        if (lfb_currentStepID != 0) {
            $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + lfb_currentStepID + '"]').show();
            $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + lfb_currentStepID + '"]').addClass('lfb_activeStep');
        }
    });

    function lfb_setBackendTheme(event, theme) {
        $('#lfb_form:not(.lfb_popup)').addClass('lfb_backendTheme_' + theme);
    }

    function lfb_cleanupPreviousStep() {
        clearTimeout(lfb_elementHoverTimer);
        
        $('.lfb_visualTooltip').remove();
        
        $('.lfb_hover, .lfb_hoverEdit').removeClass('lfb_hover').removeClass('lfb_hoverEdit');
        
        $('.lfb_itemLoader').hide();
    }

    function lfb_initVisualStep(event, stepID, formID) {
        lfb_cleanupPreviousStep();

        lfb_currentStepID = stepID;
        $(window).resize(function () {

            $('#lfb_bootstraped').css({
                height: $(window).height()
            });
        });
        $('#lfb_bootstraped').css({
            height: $(window).height()
        });
        var domStepID = stepID;
        if (domStepID == 0) {
            domStepID = 'final';
        }

        $('#lfb_bootstraped').addClass('lfb_visualEditing');
        $('#lfb_form:not(.lfb_popup)').addClass('lfb_visualEditing');
        $('#lfb_form:not(.lfb_popup)').attr('data-animspeed', '0');
        $('#lfb_form:not(.lfb_popup) .lfb_genSlide.lfb_activeStep').removeClass('lfb_activeStep');
        $('#lfb_form:not(.lfb_popup) .lfb_genSlide').hide();
        $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"]').show();
        $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"]').addClass('lfb_activeStep');

        setTimeout(function () {
            $('#lfb_form:not(.lfb_popup) .lfb_genSlide:not([data-stepid="' + domStepID + '"])').removeClass('lfb_activeStep');
            $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"]').addClass('lfb_activeStep');
            $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"]').show();
        }, 100);
        
        var $genContent = $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"] > .lfb_genContent');
        if (!$genContent.hasClass('lfb_sortable')) {
            $genContent.addClass('lfb_sortable');
        }
        
        $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"] .errorMsg').hide();
        $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"] .lfb_btn-next').show();
        if (!$('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"]').is('[data-start="1"]')) {
            $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"] .lfb_linkPreviousCt').show();

        }

        $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"] .lfb_stepTitle').addClass('positioned');

        $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"] .lfb_genContent').css({ opacity: 1 });

        $('#lfb_form:not(.lfb_popup).lfb_bootstraped #lfb_mainPanel').show();
        $('#lfb_form:not(.lfb_popup).lfb_bootstraped #lfb_panel > .container-fluid > .row').hide();

        setTimeout(function () {
            var titleHeight = $('#lfb_form:not(.lfb_popup).lfb_bootstraped #lfb_mainPanel .lfb_genSlide[data-stepid="' + domStepID + '"] .lfb_stepTitle').height();

            var heightP = $(' #lfb_form:not(.lfb_popup).lfb_bootstraped #lfb_mainPanel .lfb_genSlide[data-stepid="' + domStepID + '"] .lfb_genContent').outerHeight() + parseInt($(' #lfb_form:not(.lfb_popup).lfb_bootstraped #lfb_mainPanel').css('padding-bottom')) + 102 + titleHeight;

            if (domStepID == 'final') {
                heightP -= 80;
            }
            $(' #lfb_form:not(.lfb_popup).lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').animate({ minHeight: heightP });
            $(' #lfb_form:not(.lfb_popup).lfb_bootstraped[data-form="' + formID + '"] #lfb_mainPanel').css('max-height', 'none');

            $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + domStepID + '"]').show();
        }, 50);

        $('#lfb_form:not(.lfb_popup)  .lfb_item:not(.lfb_componentInitialized)').each(function () {
            $(this).addClass('lfb_componentInitialized');
            lfb_initItemToolbar($(this));
            lfb_initColumnToolbar($(this));

            lfb_initItemContent($(this));
        });

       // jQuery(window).trigger('resize');
        setTimeout(function () {
            jQuery(window).trigger('resize');
            $('#lfb_form:not(.lfb_popup) .tooltip').hide();
            updateColumnsBtnsAdd();
        }, 100);
      //  updateColumnsBtnsAdd();
    }

    function lfb_getStepByID(stepID, form) {
        var rep = false;
        for (var i = 0; i < form.steps.length; i++) {
            if (form.steps[i].id == stepID) {
                rep = form.steps[i];
                break;
            }
        }
        return rep;
    }


    function lfb_refreshItemDom(itemID) {
        jQuery.ajax({
            url: lfb_data.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_getItemDom',
                formID: lfb_currentFormID,
                itemID: itemID,
                stepID: lfb_currentStepID,
            }, success: function (itemDom) {
                var $item = $(itemDom);
                if (itemID > 0) {

                    var exItem = $('#lfb_form:not(.lfb_popup) .lfb_item[data-id="' + itemID + '"]');
                    exItem.after($item);
                    exItem.remove();
                } else {
                    var _stepID = lfb_currentStepID;
                    if (_stepID == 0) {
                        _stepID = 'final';
                    }
                    $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + _stepID + '"] > .lfb_genContent > .lfb_row').html($item);
                }
                if (itemID > 0) {
                    lfb_initItemToolbar($item);
                    lfb_initColumnToolbar($item);
                    lfb_initItemContent($item);
                    lfb_initNewItemContent($item);

                    $item.find('.lfb_item').each(function () {
                        lfb_initItemToolbar($(this));
                        lfb_initItemContent($(this));
                        lfb_initNewItemContent($(this));

                    });
                } else {

                    $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + _stepID + '"] > .lfb_genContent > .lfb_row').find('.lfb_item').each(function () {
                        lfb_initItemToolbar($(this));
                        lfb_initColumnToolbar($(this));
                        lfb_initItemContent($(this));
                        lfb_initNewItemContent($(this));

                    });
                }


            }
        });
    }

    function lfb_initRowMenu() {
        var menu = $('<div id="lfb_rowMenu" class="lfb_lPanel lfb_lPanelRight"></div>');
        menu.append('<div class="lfb_lPanelHeader"><span class="fas fa-pencil-alt"></span><span id="lfb_lPanelHeaderTitle">' + lfb_data.texts['Row settings'] + '</span>' +
            '<a href="javascript:" id="lfb_rowMenuCloseBtn" class="btn btn-alpha btn-circle"><span class="glyphicon glyphicon-remove"></span></a>' +
            '</div>'
        );
        menu.append(' <div class="lfb_lPanelBody"></div>');
        $('#lfb_bootstraped').append(menu);

        menu.find('.lfb_lPanelBody').append('<label>' + lfb_data.texts['Columns'] + '</label>');
        menu.find('.lfb_lPanelBody').append('<table class="table"></table>');
        menu.find('.table').append('<thead></thead>');
        menu.find('.table thead').append('<tr><th>' + lfb_data.texts['Size'] + '</th><th class="text-right"><a href="javascript:" data-action="addColumn" class="btn btn-primary btn-circle" title="' + lfb_data.texts['Add a column'] + '"><span class="fas fa-plus"></span></a></th></tr>');
        menu.find('.table').append('<tbody></tbody>');

        menu.find('#lfb_rowMenuCloseBtn').on('click', function () {
            menu.removeClass('lfb_open');
        });
        menu.find('a[data-action="addColumn"]').on('click', function () {
            var table = $(this).closest('table');

            var columnID = $(this).closest('tr[data-id]').attr('data-id');
            lfb_editedItem.children('.lfb_itemLoader').stop().fadeIn();

            jQuery.ajax({
                url: lfb_data.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_createRowColumn',
                    rowID: lfb_editedItem.attr('data-id')
                }, success: function (columnID) {

                    var column = {
                        size: '1/3',
                        id: columnID
                    };

                    addColumnRow(column, lfb_editedItem);

                }
            });
        });

    }

    function addColumnRow(column, $item) {
        var table = $('#lfb_rowMenu').find('table');

        var $tr = $('<tr data-id="' + column.id + '"></tr>');
        $tr.append('<td><select name="size" class="form-control form-control-sm"></select></td>');
        $tr.find('[name="size"]').append('<option value="auto">' + lfb_data.texts['Automatic'] + '</option>');
        $tr.find('[name="size"]').append('<option value="small">' + lfb_data.texts['Small'] + '</option>');
        $tr.find('[name="size"]').append('<option value="medium">' + lfb_data.texts['Medium'] + '</option>');
        $tr.find('[name="size"]').append('<option value="large">' + lfb_data.texts['Large'] + '</option>');
        $tr.find('[name="size"]').append('<option value="xl">' + lfb_data.texts['XL'] + '</option>');
        $tr.find('[name="size"]').append('<option value="fullWidth">' + lfb_data.texts['Full width'] + '</option>');
        $tr.append('<td class="text-right lfb_tdAction"></td>');
        $tr.find('.lfb_tdAction').append('<a href="javascript:" data-action="deleteColumn" class="btn btn-danger btn-circle"><span class="fas fa-trash"></span></a>');

        table.find('tbody').append($tr);
        lfb_updateRowColumns($item);
        lfb_refreshItemDom($item.attr('data-id'));
        $tr.find('[name="size"]').val(column.size.trim());

        $tr.find('[name="size"]').on('change', function () {
            var size = $(this).val();
            var columnElement = $(this).closest('.lfb_column').get(0);
            lfb_updateRowColumns($item);
            
            if(columnElement) {
                updateColumnSize(columnElement, size);
            }

            jQuery.ajax({
                url: lfb_data.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_editRowColumn',
                    rowID: $item.attr('data-id'),
                    columnID: column.id,
                    size: size
                }, success: function () {
                    lfb_refreshItemDom($item.attr('data-id'));
                }
            });
        });
        $tr.find('[data-action="deleteColumn"]').on('click', function () {
            var columnID = $(this).closest('tr[data-id]').attr('data-id');
            $(this).closest('tr[data-id]').remove();
            jQuery.ajax({
                url: lfb_data.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_deleteRowColumn',
                    rowID: lfb_editedItem.attr('data-id'),
                    columnID: column.id
                }, success: function () {
                    lfb_updateRowColumns(lfb_editedItem);
                    lfb_refreshItemDom(lfb_editedItem.attr('data-id'));

                }
            });
        });
    }

    function lfb_updateRowColumns($row) {
        var columns = new Array();
        $('#lfb_rowMenu table tr[data-id]').each(function () {
            columns.push({
                id: $(this).attr('data-id'),
                size: $(this).find('[name="size"]').val()
            });
        });

        $row.attr('data-columns', JSON.stringify(columns));

    }
    function lfb_updateItemsSortOrder() {
        var itemsIDs = [];
        var indexes = [];
        var columnsIDs = [];
        
        var $items = $('#lfb_form:not(.lfb_popup) .lfb_activeStep .lfb_item');
        
        $items.each(function () {
            itemsIDs.push($(this).attr('data-id'));
            indexes.push($(this).index());
            var columnID = '';
            if ($(this).closest('.lfb_column').length > 0) {
                columnID = $(this).closest('.lfb_column').attr('data-columnid');
            }
            columnsIDs.push(columnID);
        });
        
        jQuery.ajax({
            url: lfb_data.ajaxurl,
            type: 'post',
            async: true,
            data: {
                action: 'lfb_itemsSort',
                stepID: lfb_currentStepID,
                itemsIDs: itemsIDs,
                indexes: indexes,
                columnsIDs: columnsIDs
            }
        });
        
        updateColumnsBtnsAdd();
    }

    function lfb_initComponentsMenu() {
        if ($('#lfb_componentsPanel').length == 0) {
            jQuery.ajax({
                url: lfb_data.ajaxurl,
                type: 'post',
                data: {
                    action: 'lfb_getComponentMenu'
                },
                success: function (menu) {
                    if ($('#lfb_componentsPanel').length == 0) {
                        $('#lfb_bootstraped').prepend(menu);


                        $('#lfb_componentsCloseBtn').on('click', function () {
                            $('#lfb_componentsPanel').removeClass('lfb_open');
                        });

                        const sortables = $('#lfb_componentsPanel .lfb_sortable:not(.sortable-initialized)').get();
                        sortables.forEach(container => {
                            $(container).addClass('sortable-initialized');
                            
                            new Sortable(container, {
                                group: 'shared',
                                animation: 100, 
                                ghostClass: 'lfb-dragging-ghost',
                                handle: '.lfb-handler',
                                forceFallback: false, 
                                delay: 0,
                                delayOnTouchOnly: true,
                                onStart: (evt) => {
                                    lfb_isDraggingComponent = true;
                                    evt.item.style.backgroundColor = $('#lfb_mainPanel').css('background-color');
                                },
                                onEnd: (evt) => {
                                    lfb_isDraggingComponent = false;
                                    updateColumnsBtnsAdd();
                                    lfb_updateItemsSortOrder(); 
                                }
                            });
                        });

                        $('#lfb_componentsPanel').find('[data-toggle="switch"]').wrap('<div class="switch"  data-on-label="<i class=\'fas fa-check\'></i>" data-off-label="<i class=\'fas fa-times\'></i>" />').parent().bootstrapSwitch();

                        $('#lfb_componentsPanel').find('[data-type="slider"]').slider({
                            min: 0,
                            max: 100,
                            value: 50,
                            step: 1,
                            orientation: "horizontal",
                            range: "min"
                        });

                        $('#lfb_componentsPanel').find('.lfb_rate').rate({
                            initial_value: 3
                        }).css({
                            color: '#bdc3c7'
                        });


                        $('#lfb_componentsPanel #lfb_componentsFilters input.form-control').on('keyup change', function () {
                            var start = $(this).val().toLowerCase();
                            $('#lfb_componentsPanel .lfb_componentModel').each(function () {
                                if ($(this).find('.lfb_componentTitle').text().toLowerCase().indexOf(start) > -1 || start.trim().length == 0) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            });
                        });

                        lfb_initRowMenu();
                    }
                }
            });
        }

    }
    function lfb_editRow($item) {
        $('#lfb_rowMenu').addClass('lfb_open');

        $('#lfb_rowMenu table tbody').html('');
        var columns = JSON.parse($item.attr('data-columns'));
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            addColumnRow(column);

        }
    }
    function lfb_initNewItemContent($item) {

        $item.find('[data-toggle="switch"][data-checkboxstyle="switch"]').each(function () {
            if ($(this).closest('.switch').length == 0) {
                $(this).wrap('<div class="switch"  data-on-label="<i class=\'fas fa-check\'></i>" data-off-label="<i class=\'fas fa-times\'></i>" />').parent().bootstrapSwitch();
            }
        });
        $item.find('.lfb_colorpicker').each(function () {
            var $this = $(this);
            $(this).prev('.lfb_colorPreview').on('click', function () {
                if (!lfb_tld_selectionMode) {
                    $(this).next('.lfb_colorpicker').trigger('click');
                }
            });
            $(this).prev('.lfb_colorPreview').css({
                backgroundColor: $('#lfb_form:not(.lfb_popup)').data('lfb_form').colorA
            });
            $(this).colpick({
                color: $('#lfb_form:not(.lfb_popup)').data('lfb_form').colorA,
                layout: 'hex',
                onSubmit: function () {
                    $('body > .colpick').fadeOut();
                },
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                    $(el).val('#' + hex);
                    $(el).prev('.lfb_colorPreview').css({
                        backgroundColor: '#' + hex
                    });
                }
            });
        });

        if ($item.is('.lfb_gmap')) {
            if ($item.find('.gm-style').length == 0) {
                $item.css({
                    backgroundImage: 'url(' + lfb_data.assets_url + '/img/mapBg.jpg)',
                    height: $item.attr('data-height')
                });
            }
        }

        $item.find('img[data-tint="true"]').each(function () {
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
            img.onload = function () {
                ctx.fillStyle = $('#lfb_form:not(.lfb_popup)').data('lfb_form').colorA;
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

        $item.find('[data-type="slider"]:not(.ui-slider)').each(function () {

            var min = parseInt($(this).attr('data-min'));
            if (isNaN(min)) {
                min = 0;
            }
            var max = parseInt($(this).attr('data-max'));
            if (max == 0) {
                max = 30;
            }
            $(this).slider({
                min: min,
                max: max,
                value: 0,
                step: 1,
                orientation: "horizontal",
                range: "min"
            });
        });


        $item.find('.lfb_rate').each(function () {
            if ($(this).children().length == 0) {
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
                    step_size: 1
                }).css('color', color);
            }
        });
        setTimeout(function () {

            $item.find('canvas.img').each(function () {

                jQuery(this).parent().children('img').css('opacity', 0);
                jQuery(this).parent().children('img').show();
                jQuery(this).css({
                    width: jQuery(this).parent().children('img').get(0).width,
                    height: jQuery(this).parent().children('img').get(0).height
                });
                jQuery(this).parent().children('img').hide();

            });
        }, 200);

    }

    function lfb_initItemContent($item) {
        $item.find('.lfb_column').on('mouseenter', function (e) {
            e.preventDefault();
            $(this).addClass('lfb_hover');
        }).on('mouseleave', function (e) {
            e.preventDefault();
            $(this).removeClass('lfb_hover');
        });

        const sortables = $item.find('.lfb_sortable:not(.sortable-initialized)').get();
        sortables.forEach(container => {
            $(container).addClass('sortable-initialized');
            
            new Sortable(container, {
                group: 'shared',
                animation: 150,
                ghostClass: 'lfb-dragging-ghost',
                handle: '.lfb-handler,.lfb_itemBloc',
                animation: 100,
                forceFallback: false,
                delay: 0,
                delayOnTouchOnly: true,
                onStart: (evt) => {
                    lfb_isDraggingComponent = true;
                    evt.item.style.backgroundColor = $('#lfb_mainPanel').css('background-color');
                },
                onEnd: (evt) => {
                    lfb_isDraggingComponent = false;
                    updateColumnsBtnsAdd();
                    lfb_updateItemsSortOrder();
                }
            });
        });

        var stepID = lfb_currentStepID;
        if (stepID == 0) {
            stepID = 'final';
        }
        
        var $genContent = $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + stepID + '"] > .lfb_genContent');
        if ($genContent.children('.lfb_row').hasClass('lfb_sortable') && !$genContent.children('.lfb_row').hasClass('sortable-initialized')) {
            $genContent.children('.lfb_row').addClass('sortable-initialized');
            
            new Sortable($genContent.children('.lfb_row').get(0), {
                group: 'shared',
                animation: 150,
                ghostClass: 'lfb-dragging-ghost',
                handle: '.lfb-handler',
                animation: 100,
                forceFallback: false,
                delay: 0,
                delayOnTouchOnly: true,
                filter: '.lfb_btnAddItem',
                onStart: (evt) => {
                    lfb_isDraggingComponent = true;
                    evt.item.style.backgroundColor = $('#lfb_mainPanel').css('background-color');
                },
                onEnd: (evt) => {
                    lfb_isDraggingComponent = false;
                    updateColumnsBtnsAdd();
                    lfb_updateItemsSortOrder();
                }
            });
        }

        updateColumnsBtnsAdd();
    }
    function updateColumnsBtnsAdd() {
        var stepID = lfb_currentStepID;
        if (lfb_currentStepID == 0) {
            stepID = 'final';
        }
        
        var $rootRow = $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + stepID + '"] > .lfb_genContent > .lfb_row');
        var $btnAddItemBottom = $rootRow.children('.lfb_btnAddItem[data-direction="bottom"]');
        var $btnAddItemTop = $rootRow.children('.lfb_btnAddItem[data-direction="top"]');
        
        if ($btnAddItemBottom.length < 1) {
            var btnAddItem = $('<a href="javascript:" class="lfb_btnAddItem" data-direction="bottom" title="' + lfb_data.texts['Add a row'] + '"><span class="fas fa-plus"></span></a>');
            btnAddItem.on('click', function (e) {
                lfb_addComponent(e, 'row', '', 'bottom');
            });
            $rootRow.append(btnAddItem);
            btnAddItem.tooltip({
                html: true,
                template: '<div class="tooltip lfb_visualTooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                container: '#lfb_form:not(.lfb_popup)'
            });
        }
        
        var hasItems = $rootRow.find('.lfb_itemBloc').length > 0;
        
        if (!hasItems) {
            $btnAddItemTop.remove();
        } else if ($btnAddItemTop.length == 0) {
            var btnAddItem = $('<a href="javascript:" class="lfb_btnAddItem" data-direction="top" title="' + lfb_data.texts['Add a row'] + '"><span class="fas fa-plus"></span></a>');
            btnAddItem.on('click', function (e) {
                lfb_addComponent(e, 'row', '', 'top');
            });
            $rootRow.prepend(btnAddItem);
            btnAddItem.tooltip({
                html: true,
                template: '<div class="tooltip lfb_visualTooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                container: '#lfb_form:not(.lfb_popup)'
            });
        }
        
        var $columns = $('.lfb_column');
        $columns.each(function() {
            var $column = $(this);
            var $btnAddItemBottom = $column.find('.lfb_btnAddItem[data-direction="bottom"]');
            var $btnAddItemTop = $column.find('.lfb_btnAddItem[data-direction="top"]');
            var hasItems = $column.find('.lfb_itemBloc').length > 0;
            
            if ($btnAddItemBottom.length < 1) {
                var btnAddItem = $('<a href="javascript:" class="lfb_btnAddItem" data-direction="bottom" title="' + lfb_data.texts['Add a component'] + '"><span class="fas fa-plus"></span></a>');
                btnAddItem.on('click', function () {
                    var columnID = $(this).closest('.lfb_column').attr('data-columnid');
                    window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_showWinComponents', [columnID, $(this).attr('data-direction')]);
                });
                $column.append(btnAddItem);
                btnAddItem.tooltip({
                    html: true,
                    template: '<div class="tooltip lfb_visualTooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                    container: '#lfb_form:not(.lfb_popup)'
                });
            }
            
            if (!hasItems) {
                $btnAddItemTop.remove();
            } else if ($btnAddItemTop.length == 0) {
                var btnAddItem = $('<a href="javascript:" class="lfb_btnAddItem" data-direction="top" title="' + lfb_data.texts['Add a component'] + '"><span class="fas fa-plus"></span></a>');
                btnAddItem.on('click', function () {
                    var columnID = $(this).closest('.lfb_column').attr('data-columnid');
                    window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_showWinComponents', [columnID, $(this).attr('data-direction')]);
                });
                
                btnAddItem.tooltip({
                    html: true,
                    template: '<div class="tooltip lfb_visualTooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                    container: '#lfb_form:not(.lfb_popup)'
                });
                $column.prepend(btnAddItem);
            }
            
            if ($btnAddItemBottom.length == 1 && $btnAddItemBottom.index() < $column.children().length - 1) {
                var btn = $btnAddItemBottom;
                btn.detach();
                $column.append(btn);
            }
        });
    }
    function updateColumnBtnsAdd($column, $item) {

        if ($column.find('.lfb_btnAddItem').length < 1) {
            var btnAddItem = $('<a href="javascript:" class="lfb_btnAddItem" data-direction="bottom"><span class="fas fa-plus"></span></a>');
            btnAddItem.on('click', function () {
                var columnID = $(this).closest('.lfb_column').attr('data-columnid');
                window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_showWinComponents', [columnID, $(this).attr('data-direction')]);
            });

            $item.find('.lfb_column').append(btnAddItem);
        }

        $item.find('.lfb_column').each(function () {
            if ($(this).find('.lfb_itemBloc').length > 0 && $(this).find('.lfb_btnAddItem').length < 2) {

                var btnAddItem = $('<a href="javascript:" class="lfb_btnAddItem" data-direction="top"><span class="fas fa-plus"></span></a>');
                btnAddItem.on('click', function () {
                    var columnID = $(this).closest('.lfb_column').attr('data-columnid');
                    window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_showWinComponents', [columnID, $(this).attr('data-direction')]);
                });

                $(this).prepend(btnAddItem);
            }
        });

        if ($item.find('.lfb_column').find('.lfb_itemBloc').length == 0 && $(this).find('.lfb_btnAddItem').length > 1) {
            $item.find('.lfb_column').find('.lfb_btnAddItem[data-direction="top"]').remove();
        }
    }
    function lfb_initColumnToolbar($item) {
        $item.find('.lfb_column').each(function () {
            var $column = $(this);
            if ($column.children('.lfb_columnToolbar').length == 0) {

                var tb = $('<div class="lfb_columnToolbar"></div>');
                tb.append('<div class="lfb_column_sizer"></div>');
                var lessSizeBtn = $('<a href="javascript:" class="lfb_columnSizerBtn " data-size="-"><i class="fas fa-minus"></i></a>');
                var sizeInfo = $('<span class="lfb_columnSizerInfo px-2 text-white">1/3</span>');
                var plusSizeBtn = $('<a href="javascript:" class="lfb_columnSizerBtn" data-size="+"><i class="fas fa-plus"></i></a>');
                tb.find('.lfb_column_sizer').append(lessSizeBtn);
                tb.find('.lfb_column_sizer').append(sizeInfo);
                tb.find('.lfb_column_sizer').append(plusSizeBtn);
                tb.append('<a href="javascript:" data-action="delete" class="btn-danger"><span class="fas fa-trash" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['remove'] + '"></span></a>');

                tb.find('a[data-action="delete"]').on('click', function () {
                    if ($(this).closest('.lfb_column').find('.lfb_item ').length > 0) {
                        window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_cantDeleteColumn');
                    } else {

                        var columnID = $(this).closest('.lfb_column').attr('data-columnid');
                        var rowID = $(this).closest('.lfb_row').attr('data-id');
                        $(this).closest('.lfb_column').remove();
                        jQuery.ajax({
                            url: lfb_data.ajaxurl,
                            type: 'post',
                            data: {
                                action: 'lfb_deleteRowColumn',
                                rowID: rowID,
                                columnID: columnID
                            }, success: function () {

                            }
                        });
                    }
                });
                lessSizeBtn.on('click', function () {
                    reduceColumnSize($(this).closest('.lfb_column'));

                });
                plusSizeBtn.on('click', function () {
                    increaseColumnSize($(this).closest('.lfb_column'));

                });

                $column.prepend(tb);

                updateColumnSize($column, getColumnSize($column));
            }
        });

    }
    function lfb_initItemToolbar($item) {
        var itemID = $item.attr('data-id');
        $item = $('[data-id="' + itemID + '"]');
        if (!$item.is('.lfb_toolbarInitialized')) {
            $item.addClass('lfb_toolbarInitialized');
            var tb = $('<div class="lfb_elementToolbar"></div>');
            tb.append('<a href="javascript:" class="btn-primary lfb-handler"><span class="fas fa-arrows-alt" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['move'] + '"></span></a>');
            if ($item.is('.lfb_row')) {
                tb.append('<a href="javascript:" data-action="addColumn" class="btn-secondary"><span class="fas fa-plus" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['Add a column'] + '"></span></a>');
                tb.append('<a href="javascript:" data-action="showRowConditions" class="btn-default"><span class="fas fa-eye" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['Visibility conditions'] + '"></span></a>');

            } else {
                tb.append('<a href="javascript:" data-action="edit" class="btn-default"><span class="fas fa-pencil-alt" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['edit'] + '"></span></a>');
            }
            tb.append('<a href="javascript:" data-action="duplicate" class="btn-default"><span class="fas fa-copy" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['duplicate'] + '"></span></a>');
            tb.append('<a href="javascript:" data-action="style" class="btn-default"><span class="fas fa-fill-drip" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['style'] + '"></span></a>');

            tb.append('<a href="javascript:" data-action="delete" class="btn-danger"><span class="fas fa-trash" data-tooltip="true"  data-placement="bottom" title="' + lfb_data.texts['remove'] + '"></span></a>');

            $item.prepend(tb);
            tb.find('[data-action="showRowConditions"]').on('click', function () {
                window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_editRowConditions', [$(this).closest('.lfb_item').attr('data-id')]);
            });
            tb.find('[data-action="edit"]').on('click', function () {
                lfb_editedItem = $(this).closest('.lfb_item');
                if ($(this).closest('.lfb_item').attr('data-itemtype') == 'row') {
                    lfb_editRow($item);
                } else {

                    window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_editItem', [$(this).closest('.lfb_item').attr('data-id')]);
                }
            });
            tb.find('[data-action="addColumn"]').on('click', function () {
                jQuery.ajax({
                    url: lfb_data.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'lfb_createRowColumn',
                        rowID: $item.attr('data-id')
                    }, success: function (columnID) {

                        var column = {
                            size: '1/3',
                            id: columnID
                        };

                        addColumnRow(column, $item);

                    }
                });
            });
            tb.find('[data-action="style"]').on('click', function () {
                var domElement = '.lfb_item[data-id="' + $item.attr('data-id') + '"]';
                var targetStep = lfb_currentStepID;
                if (targetStep == 0) {
                    targetStep = 'final';
                }
                window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_openFormDesigner', [targetStep, domElement]);

            });
            tb.find('[data-action="duplicate"]').on('click', function () {
                window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_duplicateItem', [$(this).closest('.lfb_item').attr('data-id')]);
            });
            tb.find('[data-action="delete"]').on('click', function () {
                window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_askDeleteItem', [$(this).closest('.lfb_item').attr('data-id')]);

            });

            $item.on('mouseenter', function () {
                clearTimeout(lfb_elementHoverTimer);
                var chkChildrenhover = false;
                $(this).find('.lfb_item').each(function () {
                    if ($(this).is(':hover')) {
                        chkChildrenhover = true;
                    }
                });
                if ((lfb_isDraggingComponent && $(this).find('.lfb-column-inner.lfb_hoverEdit').length > 0) || (!lfb_isDraggingComponent && $(this).find('.lfb-column-inner:hover').length > 0)) {
                    chkChildrenhover = true;
                }
                if (!chkChildrenhover) {
                    $('.lfb_hoverEdit').removeClass('lfb_hoverEdit');
                    $(this).addClass('lfb_hover');
                    $(this).addClass('lfb_hoverEdit');
                } else {
                    $(this).removeClass('lfb_hover');
                    $(this).removeClass('lfb_hoverEdit');
                }
                var _self = $(this);
                $(this).parent().closest('.lfb_item ').removeClass('lfb_hover');
            }).on('mouseleave', function () {
                var _self = $(this);
                _self.removeClass('lfb_hover');
                _self.children('.lfb_hover').removeClass('lfb_hover');
                lfb_elementHoverTimer = setTimeout(function () {
                    _self.removeClass('lfb_hoverEdit');
                    _self.children('.lfb_hoverEdit').removeClass('lfb_hoverEdit');
                }, 500);
                if ($(this).closest('.lfb_item :hover').length > 0) {
                    $(this).closest('.lfb_item :hover').trigger('mouseenter');
                }
            });
            $item.prepend('<div class="lfb_itemLoader"><div class="lfb_spinner" data-tldinit="true"><div class="double-bounce1" data-tldinit="true"></div><div class="double-bounce2" data-tldinit="true"></div></div></div>');
            $item.find('.lfb_itemLoader').fadeOut(500);

            if ($item.is(':hover')) {
                $item.addClass('lfb_hover');
                $item.addClass('lfb_hoverEdit');
            }
        }
    }

    function lfb_onItemDeleted(event, itemID) {
        if ($('.lfb_item[data-id="' + itemID + '"]').length > 0) {
            var $item = $('.lfb_item[data-id="' + itemID + '"]');
            $item.remove();
        }
        updateColumnsBtnsAdd();
    }

    function lfb_renderComponent($component, columnID, checkboxStyle = 'checkbox') {

     /*  if (columnID == null || columnID == '') {
            $component = $('.lfb_activeStep .lfb_genContent  > .lfb_row > .lfb_componentModel');
        } else {
            $component = $('[data-columnid="' + columnID + '"] .lfb_componentModel');
        }*/
        var index = $component.index()-1;
        $component.prepend('<div class="lfb_itemLoader"><div class="lfb_spinner" data-tldinit="true"><div class="double-bounce1" data-tldinit="true"></div><div class="double-bounce2" data-tldinit="true"></div></div></div>');
        $component.find('.lfb_itemLoader').show();

        var $content = $('<div class="lfb_elementContent"></div>');

        var type = 'row';
        if ($component.attr('data-component') != undefined) {
            type = $component.attr('data-component');
        }
        var title = lfb_data.texts['Item'];
        if ($('#lfb_componentsPanel .lfb_componentModel[data-component="' + type + '"] .lfb_componentTitle').length > 0) {
            title = $('#lfb_componentsPanel .lfb_componentModel[data-component="' + type + '"] .lfb_componentTitle').html();
        }

        jQuery.ajax({
            url: lfb_data.ajaxurl,
            type: 'post',
            data: {
                action: 'lfb_createNewItem',
                formID: $('#lfb_form:not(.lfb_popup)').attr('data-form'),
                stepID: lfb_currentStepID,
                title: title,
                type: type,
                columnID: columnID,
                index: index,
                checkboxStyle: checkboxStyle
            },
            success: function (rep) {
                try {

                    rep = JSON.parse(rep);
                    var itemData = rep.itemData;
                    window.parent.jQuery('#lfb_form:not(.lfb_popup)').trigger('lfb_newItemAdded', [itemData]);

                    var $item = $(rep.itemDom);
                    $item.addClass('lfb_initItem');


                    if (columnID == null || columnID == '') {
                        $('.lfb_activeStep .lfb_genContent  > .lfb_row > .lfb_componentModel').after($item);
                    } else {
                        $('[data-columnid="' + columnID + '"] .lfb_componentModel').after($item);

                    }
                    $component.remove();
                    var rowID = $item.closest('.lfb_row').attr('data-id');
                    lfb_refreshItemDom(rowID);
                    lfb_updateItemsSortOrder();

                } catch (error) {
                    console.log(error);
                }

            }
        });
    }

    function lfb_showComponentsMenu() {
        $('#lfb_componentsFilters input').val('').trigger('keyup');
        $('#lfb_componentsFilters input').focus();
        $('#lfb_componentsPanel').addClass('lfb_open');
    }
    function lfb_addComponent(e, type, columnID, direction, checkboxStyle = 'checkbox') {
        var $component = $('#lfb_componentsPanel [data-component="' + type + '"]').clone();
        $component.detach();

        $component.attr('id', 'lfb_tempComponent_' + $.now());

        var stepID = lfb_currentStepID;
        if (stepID == 0) {
            stepID = 'final';
        }
        var parent = $('#lfb_form:not(.lfb_popup) .lfb_genSlide[data-stepid="' + stepID + '"] > .lfb_genContent > .lfb_row');
        if (columnID != '') {
            parent = $('.lfb_column[data-columnid="' + columnID + '"]');
        }
        if (direction == "top") {
            if (lfb_currentStepID == 0) {
                parent.children('#lfb_subTxtValue').after($component);
            } else {
                // Trouver le premier élément qui n'est pas le bouton d'ajout en haut
                var $firstItem = parent.children('.lfb_itemBloc').first();
                if ($firstItem.length > 0) {
                    $firstItem.before($component);
                } else {
                    // S'il n'y a pas d'éléments, placer avant le bouton du bas
                    parent.children('[data-direction="bottom"]').before($component);
                }
            }
        } else {
            parent.children('[data-direction="bottom"]').before($component);
        }

        lfb_renderComponent($component, columnID, checkboxStyle);

    }
    function getColumnData(columnID, $row) {
        var rep = false;
        var columns = JSON.parse($row.attr('data-columns'));
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].id == columnID) {
                rep = columns[i];
            }
        }
        return rep;
    }
    function updateColumnSizeInfo($column) {
        var sizeText = '1/1';
        var columnData = getColumnData($column.attr('data-columnid'), $column.closest('.lfb_row'));
        if (columnData) {
            sizeText = columnData.size.trim();
            $column.find('.lfb_columnToolbar .lfb_columnSizerInfo').html(sizeText);
        }

    }

    function reduceColumnSize($column) {

        var columnData = getColumnData($column.attr('data-columnid'), $column.closest('.lfb_row'));
        if (columnData) {
            var sizeIndex = lfb_columnsSizes.indexOf(columnData.size.trim());
            if (sizeIndex == -1) {
                if (columnData.size == 'small') {
                    sizeIndex = lfb_columnsSizes.indexOf('1/6');
                } else if (columnData.size == 'large') {
                    sizeIndex = lfb_columnsSizes.indexOf('1/2');
                } else if (columnData.size == 'xl') {
                    sizeIndex = lfb_columnsSizes.indexOf('2/3');
                } else if (columnData.size == 'fullWidth') {
                    sizeIndex = lfb_columnsSizes.indexOf('1/1');
                } else {
                    sizeIndex = lfb_columnsSizes.indexOf('1/3');
                }
            }
            if (sizeIndex > 0) {
                columnData.size = lfb_columnsSizes[sizeIndex - 1];
                updateColumnSize($column, columnData.size);
                jQuery.ajax({
                    url: lfb_data.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'lfb_editRowColumn',
                        rowID: $column.closest('.lfb_row').attr('data-id'),
                        columnID: columnData.id,
                        size: columnData.size
                    }, success: function () {
                    }
                });
            }
        }

    }
    function getColumnSize($column) {
        var size = '1/3';
        if ($column.is('.col-md-2')) {
            size = '1/6';
        } else if ($column.is('.col-md-3')) {
            size = '1/4';
        } else if ($column.is('.col-md-4')) {
            size = '1/3';
        } else if ($column.is('.col-md-6')) {
            size = '1/2';
        } else if ($column.is('.col-md-8')) {
            size = '2/3';
        } else if ($column.is('.col-md-9')) {
            size = '3/4';
        } else if ($column.is('.col-md-12')) {
            size = ' 1/1';
        }
        return size;
    }
    function updateColumnSize($column, size) {
        var cssClass = 'col-md-2';
        size = size.trim();
        if (size == '1/6') {
            cssClass = 'col-md-2';
        } else if (size == '1/4') {
            cssClass = 'col-md-3';
        } else if (size == '1/3') {
            cssClass = 'col-md-4';
        } else if (size == '1/2') {
            cssClass = 'col-md-6';
        } else if (size == '2/3') {
            cssClass = 'col-md-8';
        } else if (size == '3/4') {
            cssClass = 'col-md-9';
        } else if (size == '1/1') {
            cssClass = 'col-md-12';
        }
        $column.removeClass('col-md-2').removeClass('col-md-3').removeClass('col-md-4').removeClass('col-md-6').removeClass('col-md-8').removeClass('col-md-9').removeClass('col-md-12');
        $column.addClass(cssClass);
        $column.find('.lfb_columnToolbar .lfb_columnSizerInfo').html(size);

        var $row = $column.closest('.lfb_row');
        var columns = JSON.parse($row.attr('data-columns'));
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].id == $column.attr('data-columnid')) {
                columns[i].size = size;
            }
        }
        $row.attr('data-columns', JSON.stringify(columns));

    }
    function increaseColumnSize($column) {

        var columnData = getColumnData($column.attr('data-columnid'), $column.closest('.lfb_row'));
        if (columnData) {
            var sizeIndex = lfb_columnsSizes.indexOf(columnData.size);
            if (sizeIndex == -1) {
                sizeIndex = lfb_columnsSizes.indexOf('1/3');
            }
            if (sizeIndex < lfb_columnsSizes.length - 1) {
                columnData.size = lfb_columnsSizes[sizeIndex + 1];
                updateColumnSize($column, columnData.size);
                jQuery.ajax({
                    url: lfb_data.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'lfb_editRowColumn',
                        rowID: $column.closest('.lfb_row').attr('data-id'),
                        columnID: columnData.id,
                        size: columnData.size
                    }, success: function () {
                    }
                });
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Delete' && lfb_tld_selectedElement) {
            window.parent.jQuery('#lfb_form').trigger('lfb_askDeleteItem', 
                [lfb_tld_selectedElement.dataset.id]);
        }
    });

    $('#lfb_form').css('display', 'flex');
    $('#lfb_form .lfb_row').css({
        'display': 'flex',
        'flexWrap': 'wrap',
        'gap': '15px'
    });

})(jQuery);