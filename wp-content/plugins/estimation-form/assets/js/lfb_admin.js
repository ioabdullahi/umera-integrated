(function ($) {
  "use strict";
  var lfb_isLinking = false;
  var lfb_links = new Array();
  var lfb_linkCurrentIndex = -1;
  var lfb_canvasTimer;
  var lfb_mouseX, lfb_mouseY;
  var lfb_linkGradientIndex = 1;
  var lfb_itemWinTimer;
  var lfb_currentDomElement = false;
  var lfb_currentStep = false;
  var lfb_currentStepID = 0;
  var lfb_lock = false;
  var lfb_defaultStep = false;
  var lfb_steps = false;
  var lfb_params;
  var lfb_currentLinkIndex = 0;
  var lfb_settings;
  var lfb_formfield;
  var lfb_currentFormID = 0;
  var lfb_actTimer;
  var lfb_currentForm = false;
  var lfb_currentItemID = 0;
  var lfb_canSaveLink = true;
  var lfb_canDuplicate = true;
  var lfb_openChartsAuto = false;
  var lfb_currentCharts = false,
    lfb_currentChartsOptions,
    lfb_currentChartsData;
  var lfb_currentRedirEdit = 0;
  var lfb_distanceModeQt = false;
  var lfb_editorCustomJS;
  var lfb_editorCustomCSS;
  var lfb_editorLog;
  var lfb_formToDelete = 0;
  var lfb_calculationModeQt = false;
  var lfb_currentLogID = 0;
  var lfb_orderModified = false;
  var lfb_logEditorStepThStyle = "";
  var lfb_logEditorTdStyle = "";
  var lfb_logEditorSummaryTable = false;
  var lfb_currentLayerTr;
  var lfb_currentLogCurrency = "$";
  var lfb_currentLogCurrencyPosition = "left";
  var lfb_currentLogDecSep = ".";
  var lfb_currentLogThousSep = ",";
  var lfb_currentLogMilSep = "";
  var lfb_currentLogSubTxt = "";
  var lfb_currentLogSubTotal = 0;
  var lfb_currentLogTotal = 0;
  var lfb_currentLogIsPaid = false;
  var lfb_currentLogStatus = false;
  var lfb_currentLogUseSub = false;
  var lfb_currentLogCanPay = false;
  var lfb_logsTable;
  var lfb_customersTable;
  var lfb_customerOrdersTable;
  var lfb_disableLinksAnim = false;
  var lfb_currentCalendarID = 1;
  var lfb_currentCalendarEventID = 0;
  var lfb_currentCalendarEvents = new Array();
  var lfb_currentCalendarDefaultReminders = new Array();
  var lfb_currentCalendarCats = new Array();
  var lfb_currentCalendarDaysWeek = new Array();
  var lfb_currentCalendarDisabledHours = new Array();
  var lfb_lastCreatedStepID = -1;
  var lfb_lastCreatedLinkID = -1;
  var lfb_lastPanel = false;
  var lfb_itemPriceCalculationEditor;
  var lfb_itemCalculationQtEditor;
  var lfb_itemVariableCalculationEditor;
  var lfb_isDraggingComponent = false;
  var lfb_elementHoverTimer = false;
  var lfb_lastLogsFormID = 0;
  var lfb_tld_selectedElement;
  var lfb_tld_deviceMode = "all";
  var lfb_tld_imgField;
  var lfb_tld_modifsMade = false;
  var lfb_tld_newModifsMade = false;
  var lfb_tld_initialStyles = new Array();
  var lfb_tld_styles = new Array();
  var lfb_tld_firstLoad = true;
  var lfb_tld_previewUrl;
  var lfb_tld_elementInitialized = false;
  var lfb_tld_usedGoogleFonts = new Array();
  var lfb_tld_nullStyle =
    "background-color: rgba(0, 0, 0, 0); border-width: 0px; position: static; overflow: visible;";
  var lfb_tld_editorCSS;
  var lfb_tld_targetStepID = "";
  var lfb_tld_targetDomElement = "";
  var lfb_openAction = "";
  var lfb_wizardStep = 0;
  var lfb_aiStep = 0;
  var lfb_loaderText = null;

  var lfb_summernote_addValueBtn = function (context) {
    var ui = $.summernote.ui;
    var button = ui.button({
      contents: '<i class="fas fa-plus-circle"/>',
      tooltip: lfb_data.texts["Add a dynamic value"],
      data: {
        toggle: "",
      },
      click: function () {
        lfb_addDynamicValue(context.$note);
      },
    });

    return button.render();
  };
  var lfb_summernote_shortcodeBtnReminder = function (context) {
    var ui = $.summernote.ui;
    var list =
      '<li title="' +
      lfb_data.texts["Order reference"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[ref]</a></li>' +
      '<li title="' +
      lfb_data.texts["Date of the event"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[date]</a></li>' +
      '<li title="' +
      lfb_data.texts["Time of the event"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[time]</a></li>' +
      '<li title="' +
      lfb_data.texts["Customer email"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[customerEmail]</a></li>' +
      '<li title="' +
      lfb_data.texts["Customer address"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[customerEmail]</a></li>';

    var button = ui.buttonGroup([
      ui.button({
        className: "dropdown-toggle lfb_btnEditorShortCode",
        contents:
          '<span class="fa fa-rocket"></span><span class="caret"></span>',
        tooltip: lfb_data.texts["Add a shortcode"],
        data: {
          toggle: "dropdown",
        },
        click: function ($button) {},
      }),
      ui.dropdown({
        className: "drop-default summernote-list",
        contents: "<ul>" + list + "</ul>",
        callback: function ($dropdown) {
          $dropdown.find("a").each(function () {
            $(this).click(function () {
              context.invoke("editor.insertText", $(this).html());
              $dropdown.prev("button").trigger("click");
            });
          });
        },
      }),
    ]);

    return button.render();
  };
  var lfb_summernote_shortcodeBtn = function (context) {
    var ui = $.summernote.ui;
    var list =
      '<li title="' +
      lfb_data.texts["Selected items list"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[project_content]</a></li>' +
      '<li title="' +
      lfb_data.texts["Last step form values"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[information_content]</a></li>' +
      '<li title="' +
      lfb_data.texts["Total price"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[total_price]</a></li>' +
      '<li title="' +
      lfb_data.texts["Order reference"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[ref]</a></li>' +
      '<li title="' +
      lfb_data.texts["Date of the day"] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[date]</a></li>' +
      '<li title="' +
      lfb_data.texts[
        'It will return "Invoice" if payment has been made, or "Quotation" if not'
      ] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[order_type]</a></li>' +
      '<li data-summerbtnsc="paymentLink" title="' +
      lfb_data.texts[
        "It will show the payment link here if the payment is placed in the email"
      ] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[payment_link]</a></li>' +
      '<li data-summerbtnsc="customerLink" title="' +
      lfb_data.texts[
        "If the customer account management option is activated, it will show the link to the defined page"
      ] +
      '" data-toggle="tooltip"><a class="dropdown-item" href="#" role="listitem" >[customer_link]</a></li>';

    var button = ui.buttonGroup([
      ui.button({
        className: "dropdown-toggle lfb_btnEditorShortCode",
        contents:
          '<span class="fa fa-rocket"></span><span class="caret"></span>',
        tooltip: lfb_data.texts["Add a shortcode"],
        data: {
          toggle: "dropdown",
        },
        click: function ($button) {},
      }),
      ui.dropdown({
        className: "drop-default summernote-list",
        contents: "<ul>" + list + "</ul>",
        callback: function ($dropdown) {
          $dropdown.find("a").each(function () {
            $(this).click(function () {
              context.invoke("editor.insertText", $(this).html());
              $dropdown.prev("button").trigger("click");
            });
          });
        },
      }),
    ]);

    return button.render();
  };

  var lfb_summernoteReminderToolbar = [
    ["lfb", ["lfb_addValue", "lfb_shortcodeReminder"]],
    ["style", ["bold", "italic", "underline", "clear"]],
    ["fontsize", ["fontsize"]],
    ["color", ["color"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["height", ["height"]],
    ["insert", ["picture", "link", "table", "hr"]],
    ["code", ["codeview"]],
  ];
  var lfb_summernoteToolbar = [
    ["lfb", ["lfb_addValue", "lfb_shortcode"]],
    ["style", ["bold", "italic", "underline", "clear"]],
    ["fontsize", ["fontsize"]],
    ["color", ["color"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["height", ["height"]],
    ["insert", ["picture", "link", "table", "hr"]],
    ["code", ["codeview"]],
  ];
  var lfb_summernoteCustomContentToolbar = [
    ["lfb", ["lfb_addValue"]],
    ["style", ["bold", "italic", "underline", "clear"]],
    ["fontsize", ["fontsize"]],
    ["color", ["color"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["height", ["height"]],
    ["insert", ["picture", "link", "table", "hr"]],
    ["code", ["codeview"]],
  ];
  var lfb_summernoteLogToolbar = [
    ["style", ["bold", "italic", "underline", "clear"]],
    ["fontsize", ["fontsize"]],
    ["color", ["color"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["height", ["height"]],
    ["insert", ["picture", "link", "table", "hr"]],
    ["code", ["codeview"]],
  ];
  var lfb_summernoteBtns = {
    lfb_shortcode: lfb_summernote_shortcodeBtn,
    lfb_addValue: lfb_summernote_addValueBtn,
    lfb_shortcodeReminder: lfb_summernote_shortcodeBtnReminder,
  };

  lfb_data = lfb_data[0];
  var lfb_stepPossibleWidths = new Array(
    lfb_data.texts["Automatic"],
    "960",
    "1024",
    "1280"
  );

  $(document).ready(function () {
    lfb_loadSettings();
  });
  $(window).on("load", function () {
    $(".note-image-btn").val(lfb_data.texts["Save"]);
    window.onfocus = function () {
      $("#lfb_form").css("opacity", 1);
    };
    $(".lfb_dynamicHide").hide().removeClass("lfb_dynamicHide");
    $("#lfb_loader").remove();
    lfb_loaderText = $('<div id="lfb_loaderText" class="lfb_hidden"></div>');
    $("#wpcontent").append(
      '<div id="lfb_loader"><div class="lfb_spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>'
    );
    $("#lfb_loader").append(lfb_loaderText);
    $("#lfb_loader .lfb_spinner").css({
      top: $(window).height() / 2 - $("#wpadminbar").height() / 2,
    });
    lfb_initFormWizard();

    $("#lfb_formSettingsSidebar .nav-link, #lfb_formLeftNavbar > a").on(
      "click",
      function () {
        $("html,body").css("overflow-y", "auto");
      }
    );
    $("#lfb_aiCreationPanel").removeClass("lfb_hidden");
    $("#lfb_aiCreationPanel,#lfb_aiNotice").hide();

    $(window).resize(function () {
      $("#lfb_formSettingsSidebar").css({
        minHeight: $("#wpwrap").height(),
      });
      $("#lfb_loader .lfb_spinner").css({
        top: $(window).height() / 2 - $("#wpadminbar").height() / 2,
      });
      $("#lfb_bootstraped,#lfb_form").css({
        minHeight: $(window).height() - $("#wpadminbar").height(),
      });
      $("#lfb_emailTemplateAdmin").css({
        minHeight: $("#lfb_emailTemplateCustomer").outerHeight(),
      });

      $("#lfb_mainToolbar a.lfb_over-primary")
        .removeClass("lfb_over-primary")
        .addClass("lfb_over-default");
      $('#lfb_mainToolbar a[data-action="lfb_closeSettings"]')
        .removeClass("lfb_over-default")
        .addClass("lfb_over-primary");

      lfb_updatelLeftPanels();
      if (
        typeof lfb_settings == "object" &&
        typeof lfb_settings.backendTheme == "string" &&
        lfb_settings.backendTheme == "glassmorphic"
      ) {
        var margTop =
          $("#wpadminbar").outerHeight() +
          $(".lfb_mainHeader").outerHeight() +
          $("#lfb_editFormNavbar").outerHeight();
        var height = $(window).height() - margTop;
        height -= 48 * 2;

        $("#lfb_stepFrame.lfb_ready").css({
          height: height,
          top: margTop,
        });
      } else {
        $("#lfb_stepFrame").css({
          height:
            $(window).height() -
            ($("#lfb_winEditStepVisual .lfb_lPanelMenu").height() +
              $("#lfb_winEditStepVisual .lfb_winHeader").height()),
        });
      }

      var heightStepsOverflow =
        $(window).height() -
        ($("#wpadminbar").outerHeight() +
          $(".lfb_mainHeader").outerHeight() +
          $("#lfb_editFormNavbar").outerHeight());

      /* if (typeof (lfb_settings.backendTheme) == 'string' && lfb_settings.backendTheme == 'glassmorphic') {
                 heightStepsOverflow =  $(window).height() - ($('#wpadminbar').outerHeight() + $('.lfb_mainHeader').outerHeight() + $('#lfb_editFormNavbar').outerHeight());
             
             }*/
      $("#lfb_stepsOverflow").css({
        maxHeight: heightStepsOverflow,
      });

      $("#lfb_panelsContainer>div,#lfb_panelsContainer").css({
        minHeight: heightStepsOverflow,
      });
      $("#lfb_winEditStepVisual").css({
        minHeight: heightStepsOverflow,
      });
      $(".lfb_logEditorContainer,.lfb_logEditorContainer .note-editable").css({
        minHeight: heightStepsOverflow,
      });

      lfb_tld_updateFrameSize();
      if (lfb_disableLinksAnim) {
        lfb_updateStepCanvas();
      }
    });
    $(".lfb_shortcodeField").on("focus", function () {
      $(this).select();
    });

    $('#lfb_formFields [name="fieldsPreset"]').on("change", function () {
      if ($(this).val() == "glassmorphic") {
        $('#lfb_formFields [name="color_progressBar"]')
          .closest(".form-group")
          .fadeOut();

        $(
          '#lfb_formFields [name="color_datepickerBg"],#lfb_formFields [name="color_datepickerDates"]'
        )
          .closest(".form-group")
          .fadeOut();
      } else {
        $('#lfb_formFields [name="color_progressBar"]')
          .closest(".form-group")
          .fadeIn();
        $(
          '#lfb_formFields [name="color_datepickerBg"],#lfb_formFields [name="color_datepickerDates"]'
        )
          .closest(".form-group")
          .fadeIn();
      }
    });

    $('#lfb_formFields [name="gradientBg"]').on("change", function () {
      if ($(this).is(":checked")) {
        $('#lfb_formFields [name="colorGradientBg1"]')
          .closest(".form-group")
          .fadeIn();
        $('#lfb_formFields [name="colorGradientBg2"]')
          .closest(".form-group")
          .fadeIn();
        $('#lfb_formFields [name="colorBg"]').closest(".form-group").fadeOut();
        $('#lfb_formFields [name="colorPageBg"]')
          .closest(".form-group")
          .fadeOut();
      } else {
        $('#lfb_formFields [name="colorGradientBg1"]')
          .closest(".form-group")
          .fadeOut();
        $('#lfb_formFields [name="colorGradientBg2"]')
          .closest(".form-group")
          .fadeOut();
        $('#lfb_formFields [name="colorBg"]').closest(".form-group").fadeIn();
        $('#lfb_formFields [name="colorPageBg"]')
          .closest(".form-group")
          .fadeIn();
      }
    });

    $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
    $("#lfb_panelFormsList").removeClass("lfb_hidden");

    lfb_tld_tdgn_init();

    $("#lfb_bootstraped .modal").addClass("show").hide();
    $(
      '#lfb_bootstraped .modal .btn-close,#lfb_bootstraped .modal [data-dismiss="modal"]'
    ).on("click", function () {
      hideModal($(this).closest(".modal"));
    });
    $("#lfb_bootstraped .modal:not(.lfb_modal)").addClass("lfb_modal");
    $("#lfb_bootstraped,#lfb_form").css({
      minHeight: $(window).height() - $("#wpadminbar").height(),
    });
    lfb_updatelLeftPanels();
    $(".lfb_btnWinClose")
      .parent()
      .on("click", function () {
        lfb_closeWin($(this).closest(".lfb_window"));
        $("html").css("overflow-y", "auto");
      });

    $("#lfb_importFormsFieldBtn").on("click", function () {
      $('#lfb_winImport [name="importFile"]').trigger("click");
    });

    $("#lfb_formSettingsSidebar a").on("click", function () {
      var targetId = $(this).attr("data-panel");
      $("#lfb_settingsContainer").children().hide();
      $("#lfb_settingsContainer").find(targetId).show();
      $(this).closest("ul").find(".active").removeClass("active");
      $(this).addClass("active");
      if (targetId == "#lfb_tabGeneral") {
        lfb_editorCustomJS.refresh();
      } else if (targetId == "#lfb_tabDesign") {
        lfb_editorCustomCSS.refresh();
      }
    });

    $("#lfb_variablesTable tbody").sortable({
      helper: function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function (index) {
          $(this).width($originals.eq(index).width());
        });
        return $helper;
      },
      delay: 400,
      scroll: true,
      scrollSensitivity: 80,
      scrollSpeed: 3,
      stop: function (event, ui) {
        var variables = "";
        $("#lfb_variablesTable tbody tr[data-id]").each(function (i) {
          variables += $(this).attr("data-id") + ",";
        });
        if (variables.length > 0) {
          variables = variables.substr(0, variables.length - 1);
        }
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_changeVariablesOrders",
            variables: variables,
          },
        });
      },
    });

    var tooltip = $(
      '<div class="tooltip top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">0</div></div>'
    )
      .css({
        position: "absolute",
        top: -55,
        left: -42,
        opacity: 1,
      })
      .hide();
    $("#lfb_stepMaxWidth")
      .slider({
        min: 0,
        max: lfb_stepPossibleWidths.length - 1,
        value: 0,
        orientation: "horizontal",
        change: function (event, ui) {
          if (ui.value > 0) {
            tooltip
              .find(".tooltip-inner")
              .html(lfb_stepPossibleWidths[ui.value] + "px");
          } else {
            tooltip.find(".tooltip-inner").html(lfb_stepPossibleWidths[0]);
          }
          lfb_updateStepMainSettings();
        },
        slide: function (event, ui) {
          if (ui.value > 0) {
            tooltip
              .find(".tooltip-inner")
              .html(lfb_stepPossibleWidths[ui.value] + "px");
          } else {
            tooltip.find(".tooltip-inner").html(lfb_stepPossibleWidths[0]);
          }
          tooltip.show();
          lfb_updateStepMainSettings();
        },
        stop: function (event, ui) {
          if (ui.value > 0) {
            tooltip
              .find(".tooltip-inner")
              .html(lfb_stepPossibleWidths[ui.value] + "px");
          } else {
            tooltip.find(".tooltip-inner").html(lfb_stepPossibleWidths[0]);
          }
          tooltip.hide();
          lfb_updateStepMainSettings();
        },
      })
      .find(".ui-slider-handle")
      .append(tooltip)
      .on("mouseenter", function () {
        tooltip.show();
      })
      .on("mouseleave", function () {
        tooltip.hide();
      });

    $("#lfb_stepsContainer").droppable({
      drop: function (event, ui) {
        var $object = $(ui.draggable[0]);
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_saveStepPosition",
            stepID: $object.attr("data-stepid"),
            posX: parseInt($object.css("left")),
            posY: parseInt($object.css("top")),
          },
        });
        var currentStep = lfb_getStepByID(
          parseInt($object.attr("data-stepid"))
        );
        if (
          currentStep != null &&
          currentStep.content != null &&
          typeof currentStep.content != "string"
        ) {
          currentStep.content.previewPosX = parseInt($object.css("left"));
          currentStep.content.previewPosY = parseInt($object.css("top"));
        }
        lfb_updateStepCanvas();
      },
    });

    $('#lfb_orderStatusCt [name="orderStatus"]').on(
      "change",
      lfb_changeOrderStatus
    );
    document.addEventListener("visibilitychange", function () {
      lfb_updateStepCanvas();
    });

    $('a[data-action="editLastStep"]').on("click", function () {
      $('#lfb_formLeftNavbar a[data-action="showLastStep"]').trigger("click");
    });
    $("body").css({
      overflow: "initial",
    });
    initBootstrapUI();
    $("#lfb_editorLog").summernote({
      height: 500,
      minHeight: null,
      maxHeight: null,
      toolbar: lfb_summernoteLogToolbar,
      buttons: lfb_summernoteBtns,
      callbacks: {
        onFocus: function () {
          $(this).next(".note-editor").addClass("lfb-focus");
        },
        onBlur: function () {
          $(this).next(".note-editor").removeClass("lfb-focus");
        },
      },
    });
    $("#lfb_stepsOverflow").scroll(function () {
      if (lfb_disableLinksAnim) {
        lfb_updateStepCanvas();
      }
    });

    $('[data-action="defineItinerary"]').on("click", function () {
      lfb_editDistanceValue(9);
    });

    window.old_tb_remove = window.tb_remove;
    window.tb_remove = function () {
      window.old_tb_remove();
      lfb_formfield = null;
    };
    window.original_send_to_editor = window.send_to_editor;
    window.send_to_editor = function (html) {
      html = html.replace(/\[.+\]/g, "");
      if (lfb_formfield) {
        var alt = $("img", html).attr("alt");
        var fileurl = $("img", html).attr("src");
        if ($("img", html).length == 0) {
          fileurl = $(html).attr("src");
          alt = $(html).attr("alt");
        }
        lfb_formfield.val(fileurl);
        lfb_formfield.trigger("keyup");
        if (lfb_formfield.closest(".lfb_picOnly").length > 0) {
          $('#lfb_itemTabGeneral [name="imageDes"]').val(alt);
        }
        if (lfb_formfield.closest("#lfb_wizardSteps").length > 0) {
          lfb_analyzeWizardLogo(fileurl);
        }
        tb_remove();
      } else {
        window.original_send_to_editor(html);
      }
    };

    $("#lfb_localizationAuto").hide();

    $('[name="autoLocalisation"]').on("change", function () {
      if ($(this).is(":checked")) {
        $("#lfb_localizationManual").slideUp();
        $("#lfb_localizationAuto").slideDown();
      } else {
        $("#lfb_localizationManual").slideDown();
        $("#lfb_localizationAuto").slideUp();
      }
    });

    $("#previewPageSelect").on("change focusout", function () {
      if ($(this).val() == "") {
        var $sel = $("#lfb_winGlobalSettings").find('[name="previewPageID"]');
        $sel.attr("data-id", 0);
        $sel.val(0).trigger("change");
      }
    });

    $("#previewPageSelect").autocomplete({
      appendTo: $("#lfb_winGlobalSettings"),
      change: function (event, ui) {
        $(this).val(ui.item ? ui.item.value : "");
      },
      source: function (request, response) {
        jQuery.ajax({
          url: ajaxurl,
          dataType: "json",
          type: "post",
          data: {
            action: "lfb_getPagesByTerm",
            term: request.term,
          },
          success: function (data) {
            $("#previewPageSelect").removeClass("ui-autocomplete-loading");
            response(data);
          },
        });
      },
      minLength: 2,
      select: function (event, ui) {
        var data = ui.item;
        var $sel = $("#lfb_winGlobalSettings").find('[name="previewPageID"]');

        $sel.attr("data-id", data.id);
        $sel.val(data.id).trigger("change");
      },
    });

    $('a[data-action="lfb_showGradients"]').click(function () {
      $("#lfb_winGradient").data(
        "lfb_field",
        $(this).closest(".form-group").find("input")
      );
      showModal($("#lfb_winGradient"));
      $("#lfb_winGlobalSettings").css("opacity", 0.3);
    });
    $('#lfb_winGradient [data-dismiss="modal"]').on("click", function () {
      $("#lfb_winGlobalSettings").css("opacity", 1);
    });
    $("#lfb_winGradient .lfb_gradient").on("click", function () {
      $("#lfb_winGlobalSettings").css("opacity", 1);
      const gradient = $(this).attr("data-gradient");
      $("#lfb_winGradient").data("lfb_field").val(gradient);
      $("#lfb_winGradient").fadeOut();

      $("body").addClass("lfb_glassmorphic");
      $("body,#lfb_loader,#lfb_bootstraped").css("background-image", gradient);
    });

    $("#lfb_winGradient .lfb_gradient").each(function () {
      const gradient = $(this).attr("data-gradient");
      $(this).css("background-image", gradient);
    });

    $("#wooProductSelect").on("change focusout", function () {
      if ($(this).val() == "") {
        var $sel = $("#lfb_winItem").find('[name="wooProductID"]');
        $sel.attr("data-price", 0);
        $sel.attr("data-type", "");
        $sel.attr("data-max", 0);
        $sel.attr("data-woovariation", 0);
        $sel.attr("data-image", "");
        $sel.attr("data-title", "");
        $sel.attr("data-id", 0);
        $sel.val(0).trigger("change");
        $("#lfb_winItem").find('[name="wooVariation"]').val(0);
      }
    });
    $("#wooProductSelect").autocomplete({
      appendTo: $("#lfb_winItem"),
      change: function (event, ui) {
        $(this).val(ui.item ? ui.item.value : "");
      },
      source: function (request, response) {
        jQuery.ajax({
          url: ajaxurl,
          dataType: "json",
          type: "post",
          data: {
            action: "lfb_getWooProductsByTerm",
            term: request.term,
          },
          success: function (data) {
            $("#wooProductSelect").removeClass("ui-autocomplete-loading");
            response(data);
          },
        });
      },
      minLength: 2,
      select: function (event, ui) {
        var data = ui.item;
        var $sel = $("#lfb_winItem").find('[name="wooProductID"]');

        $sel.attr("data-price", data.price);
        $sel.attr("data-type", data.type);
        $sel.attr("data-max", data.max);
        $sel.attr("data-woovariation", data.woovariation);
        $sel.attr("data-image", data.image);
        $sel.attr("data-title", data.label);
        $sel.attr("data-id", data.id);
        $sel.val(data.id).trigger("change");
        $("#lfb_winItem").find('[name="wooVariation"]').val(data.woovariation);
      },
    });

    // $('#lfb_aiCreationPanel textarea').on('keyup', function (e) {

    //     if (e.keyCode == 13) {
    //         $(this).closest('[data-lfbsection]').find('a.lfb_aiNextBtn').trigger('click');
    //     }
    // });

    //  $('#lfb_bootstraped select:not(.lfb_defaultSelect)').niceSelect();

    $("a[data-btnaction]").on("click", mainSaveBtnClicked);
    $("#lfb_distanceDuration").on("change", function () {
      if ($(this).val() == "duration") {
        $("#lfb_distanceType").hide();
        $("#lfb_durationType").css({ display: "inline-block" });
      } else {
        $("#lfb_durationType").hide();
        $("#lfb_distanceType").css({ display: "inline-block" });
      }
    });
    $('a[data-action="stepSettings"]').on("click", function () {
      if (lfb_currentForm.form.useVisualBuilder == 1) {
        showModal($("#lfb_winStepSettings"));
      }
    });

    $('#lfb_winEditCoupon [name="useExpiration"]').on("change", function () {
      if ($(this).is(":checked")) {
        $('#lfb_winEditCoupon [name="expiration"]').closest(".col-6").show();
      } else {
        $('#lfb_winEditCoupon [name="expiration"]').closest(".col-6").hide();
      }
    });

    $('#lfb_panelFormsList a[data-action="loadForm"]').on("click", function () {
      lfb_loadForm($(this).closest("tr").attr("data-formid"));
    });
    $('#lfb_panelFormsList a[data-action="showShortcodeWin"]').on(
      "click",
      function () {
        lfb_showShortcodeWin($(this).closest("tr").attr("data-formid"));
      }
    );
    $('#lfb_panelFormsList a[data-action="formPreview"]').on(
      "click",
      function () {
        lfb_openFormPreview($(this).closest("tr").attr("data-formid"));
      }
    );
    $('#lfb_panelFormsList a[data-action="loadLogs"]').on("click", function () {
      lfb_openAction = "viewOrders";
      lfb_loadForm($(this).closest("tr").attr("data-formid"));
    });
    $('#lfb_panelFormsList a[data-action="openCharts"]').on(
      "click",
      function () {
        lfb_openAction = "viewCharts";
        lfb_openCharts($(this).closest("tr").attr("data-formid"));
      }
    );
    $('#lfb_panelFormsList a[data-action="duplicateForm"]').on(
      "click",
      function () {
        lfb_duplicateForm($(this).closest("tr").attr("data-formid"));
      }
    );
    $('#lfb_panelFormsList a[data-action="designForm"]').on(
      "click",
      function () {
        var formID = $(this).closest("tr").attr("data-formid");
        lfb_data.designForm = formID;
        lfb_loadForm(formID);
      }
    );

    $('a[data-action="lfb_addCoupon"]').on("click", function () {
      lfb_editCoupon(0);
    });
    $('a[data-action="lfb_addCalendarCat"]').on("click", function () {
      lfb_editCalendarCat(0);
    });
    $(".lfb_lPanelHeaderCloseBtn").on("click", function () {
      lfb_closeLeftPanel($(this).closest(".lfb_lPanel").attr("id"));
    });

    $('a[data-action="lfb_addCalendarReminder"]').on("click", function () {
      lfb_editCalendarReminder(0);
    });
    $('a[data-action="lfb_saveLogWithoutSend"]').on("click", function () {
      lfb_saveLog(false);
    });
    $('a[data-action="lfb_saveLogAndSend"]').on("click", function () {
      lfb_saveLog(true);
    });
    $('a[data-action="loadLogsFromCharts"]').on("click", function () {
      lfb_loadLogs($("#lfb_panelCharts").attr("data-formid"));
    });
    $('a[data-action="lfb_showImportWin"]').on("click", function () {
      showModal($("#lfb_winImport"));
    });
    $('#lfb_formFields .nav-tabs a[href="#lfb_tabDesign"]').on(
      "click",
      function () {
        setTimeout(function () {
          lfb_editorCustomCSS.refresh();
        }, 100);
      }
    );
    $("#lfb_btnAddEmailValue").on("click", function () {
      lfb_addEmailValue(0);
    });
    $("#lfb_btnAddPdfValue").on("click", function () {
      lfb_addEmailValue(3);
    });
    $("#lfb_btnAddEmailValueCustomer").on("click", function () {
      lfb_addEmailValue(1);
    });
    $("#lfb_btnAddPdfValueCustomer").on("click", function () {
      lfb_addEmailValue(4);
    });
    $("#lfb_addRedirBtn").on("click", function () {
      lfb_editRedirection(0);
    });
    $("#lfb_addFieldBtn").on("click", function () {
      lfb_editItem(0);
    });
    $('#lfb_winSaveBeforeSendOrder [data-dismiss="modal"]').on(
      "click",
      function () {
        lfb_orderModified = false;
        lfb_openWinSendOrderEmail();
      }
    );
    $('a[data-action="lfb_addItem"]').on("click", function () {
      lfb_editItem(0);
    });
    $('#lfb_priceCalculationField a[data-action="lfb_addCalculationValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = false;
        lfb_addCalculationValue(this);
      }
    );
    $(
      '#lfb_priceCalculationField a[data-action="lfb_addCalculationCondition"]'
    ).on("click", function () {
      lfb_calculationModeQt = false;
      lfb_addCalculationCondition();
    });
    $('#lfb_priceCalculationField a[data-action="lfb_editDistanceValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = false;
        lfb_editDistanceValue(false);
      }
    );
    $('#lfb_priceCalculationField a[data-action="lfb_addDateDiffValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = false;
        lfb_addDateDiffValue(this);
      }
    );

    $(
      '#lfb_quantityCalculationField a[data-action="lfb_addCalculationValue"]'
    ).on("click", function () {
      lfb_calculationModeQt = true;
      lfb_addCalculationValue(this);
    });
    $(
      '#lfb_quantityCalculationField a[data-action="lfb_addCalculationCondition"]'
    ).on("click", function () {
      lfb_calculationModeQt = true;
      lfb_addCalculationCondition();
    });
    $(
      '#lfb_quantityCalculationField a[data-action="lfb_editDistanceValue"]'
    ).on("click", function () {
      lfb_calculationModeQt = true;
      lfb_editDistanceValue(false);
    });
    $('#lfb_quantityCalculationField a[data-action="lfb_addDateDiffValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = true;
        lfb_addDateDiffValue(this);
      }
    );

    $('#lfb_varCalculationField a[data-action="lfb_addCalculationValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = 2;
        lfb_addCalculationValue(this);
      }
    );
    $(
      '#lfb_varCalculationField a[data-action="lfb_addCalculationCondition"]'
    ).on("click", function () {
      lfb_calculationModeQt = 2;
      lfb_addCalculationCondition();
    });
    $('#lfb_varCalculationField a[data-action="lfb_editDistanceValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = 2;
        lfb_editDistanceValue(false);
      }
    );
    $('#lfb_varCalculationField a[data-action="lfb_addDateDiffValue"]').on(
      "click",
      function () {
        lfb_calculationModeQt = 2;
        lfb_addDateDiffValue(this);
      }
    );

    $("#lfb_btnAddRichtextValue").on("click", function () {
      lfb_addEmailValue(2);
    });

    $("#lfb_exportLink").on("click", function () {
      hideModal($("#lfb_winExport"));
    });
    $("#lfb_downloadOrderLink").on("click", function () {
      hideModal($("#lfb_winDownloadOrder"));
    });
    $("#lfb_exportCustomerCsvLink").on("click", function () {
      hideModal($("#lfb_winExportCustomersCsv"));
    });
    $("#lfb_exportCustomerCsvLink").on("click", function () {
      hideModal($("#lfb_winExportCustomersCsv"));
    });
    $("#lfb_exportCalendarCsvLink").on("click", function () {
      hideModal($("#lfb_winCalendarCsv"));
    });

    $("#lfb_winItem .nav a[data-tab]").on("click", function () {
      var tab = $(this).attr("data-tab");
      $(this).closest(".nav").find("a").removeClass("active");
      $(this).addClass("active");
      $("#lfb_winItem div[data-tab]").addClass("lfb_hidden");
      $('#lfb_winItem div[data-tab="' + tab + '"]').removeClass("lfb_hidden");

      if (tab == "price") {
        lfb_itemPriceCalculationEditor.refresh();
        lfb_itemCalculationQtEditor.refresh();
        lfb_itemVariableCalculationEditor.refresh();
      }
    });

    $("#lfb_distanceQtContainer a").on("click", function () {
      lfb_editDistanceValue(9);
    });

    $('a[data-action="lfb_openFormDesigner"]').on(
      "click",
      lfb_openFormDesigner
    );

    $('#lfb_panelFormsList a[data-action="deleteForm"]').on(
      "click",
      function () {
        lfb_askDeleteForm($(this).closest("tr").attr("data-formid"));
      }
    );
    $("#lfb_formDesignerBtn").on("click", function () {
      lfb_openFormDesigner();
    });
    $('a[data-action="saveItem"]').on("click", lfb_saveItem);
    $('a[data-action="lfb_saveItem"]').on("click", lfb_saveItem);
    $('a[data-action="lfb_saveCalculationValue"]').on(
      "click",
      lfb_saveCalculationValue
    );
    $('a[data-action="lfb_saveCalculationDatesDiff"]').on(
      "click",
      lfb_saveCalculationDatesDiff
    );
    $('a[data-action="lfb_saveDistanceValue"]').on(
      "click",
      lfb_saveDistanceValue
    );
    $('a[data-action="lfb_saveCoupon"]').on("click", lfb_saveCoupon);
    $('a[data-action="lfb_confirmModifyTotal"]').on(
      "click",
      lfb_confirmModifyTotal
    );
    $('a[data-action="lfb_returnFormSettings"]').on("click", function () {
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_formFields").removeClass("lfb_hidden");
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_formSettings").show();
    });

    $('a[data-action="lfb_returnItem"]').on("click", function () {
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_winItem").removeClass("lfb_hidden");
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_item").show();
    });

    $('a[data-btnaction="saveRowConditions"]').on(
      "click",
      lfb_saveRowConditions
    );

    $('a[data-action="lfb_returnStepManager"]').on("click", function () {
      $("#lfb_innerLoader").fadeOut();
      $('[data-action="stepSettings"]').removeClass("disabled");
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_stepsOverflow").removeClass("lfb_hidden");
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_form").show();
      $(window).trigger("resize");
    });

    $('#lfb_winBackendTheme [name="backend_bgGradient"]')
      .closest(".form-group")
      .hide();

    $('#lfb_winBackendTheme [name="backendTheme"]').on("change", function () {
      if (
        $('#lfb_winBackendTheme [name="backendTheme"]').val() == "glassmorphic"
      ) {
        $('#lfb_winBackendTheme [name="backend_bgGradient"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $('#lfb_winBackendTheme [name="backend_bgGradient"]')
          .closest(".form-group")
          .slideUp();
      }
    });
    $('#lfb_winBackendTheme [data-action="lfb_saveBackendTheme"]').on(
      "click",
      function () {
        lfb_saveBackendTheme();
      }
    );

    $('a[data-action="lfb_returnStep"]').on("click", function () {
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      if (lfb_currentForm.form.useVisualBuilder == 1) {
        $("#lfb_winEditStepVisual").removeClass("lfb_hidden");
      } else {
        $("#lfb_winStep").removeClass("lfb_hidden");
      }
      $(".lfb_mainNavBar").hide();
      if (lfb_currentForm.form.useVisualBuilder == 1) {
        $("#lfb_navBar_stepVisual").show();
      } else {
        $("#lfb_navBar_step").show();
      }
    });
    var clipboard = new ClipboardJS(".lfb_copyShortcodeBtn");
    clipboard.on("success", function (e) {
      alert("The shortcode has been copied to your clipboard.");
    });

    if ($('#lfb_wizardSteps [name="autoLocalisation"]').is("[disabled]")) {
      $('#lfb_wizardSteps [name="autoLocalisation"]')
        .closest(".col-4")
        .css({ cursor: "pointer" })
        .on("click", function () {
          hideModal($("#lfb_winFormWizard"));
          setTimeout(function () {
            lfb_openGlobalSettings("openAiKey");
          }, 800);
        });
    }

    $('a[data-action="lfb_editShowStepConditions"]').on(
      "click",
      lfb_editShowStepConditions
    );
    $('a[data-action="lfb_importForms"]').on("click", lfb_importForms);
    $('a[data-action="lfb_confirmDeleteForm"]').on(
      "click",
      lfb_confirmDeleteForm
    );
    $('a[data-action="lfb_confirmDeleteStep"]').on(
      "click",
      lfb_confirmDeleteStep
    );
    $('a[data-action="lfb_confirmDeleteItem"]').on(
      "click",
      lfb_confirmDeleteItem
    );
    $('a[data-action="lfb_confirmRemoveLog"]').on(
      "click",
      lfb_confirmRemoveLog
    );
    $('a[data-action="lfb_confirmDeleteCalendarCat"]').on(
      "click",
      lfb_confirmDeleteCalendarCat
    );

    $('a[data-action="lfb_closeSettings"]').on("click", lfb_closeSettings);
    $('a[data-action="lfb_exportOrdersSelection"]').on(
      "click",
      lfb_exportOrdersSelection
    );
    $('a[data-action="lfb_deleteOrdersSelection"]').on(
      "click",
      lfb_deleteOrdersSelection
    );
    $('a[data-action="lfb_closeCharts"]').on("click", lfb_closeCharts);
    $('a[data-action="lfb_addForm"]').on("click", lfb_addForm);
    $('a[data-action="lfb_openFormWizard"]').on("click", lfb_openFormWizard);
    $('a[data-action="lfb_openAiFormWizard"]').on(
      "click",
      lfb_openAiFormWizard
    );
    $('a[data-action="generateFormAI"]').on("click", lfb_generateFormAI);

    $('a[data-action="lfb_exportForms"]').on("click", lfb_exportForms);
    $('a[data-action="lfb_removeAllSteps"]').on("click", lfb_removeAllSteps);
    $('a[data-action="lfb_openEmailTab"]').on("click", lfb_openEmailTab);
    $('a[data-action="lfb_resetReference"]').on("click", lfb_resetReference);
    $('a[data-action="lfb_openFormDesigner"]').on(
      "click",
      lfb_openFormDesigner
    );
    $('a[data-action="lfb_removeAllCoupons"]').on(
      "click",
      lfb_removeAllCoupons
    );
    $('a[data-action="lfb_editCustomerDataSettings"]').on(
      "click",
      lfb_editCustomerDataSettings
    );
    $('a[data-action="lfb_saveForm"]').on("click", lfb_saveForm);
    $('a[data-action="lfb_saveDynamicValue"]').on(
      "click",
      lfb_saveDynamicValue
    );
    $('a[data-action="lfb_addLinkInteraction"]').on(
      "click",
      lfb_addLinkInteraction
    );
    $('a[data-action="lfb_linkSave"]').on("click", lfb_linkSave);
    $('a[data-action="lfb_linkDel"]').on("click", lfb_linkDel);
    $('a[data-action="lfb_addRedirInteraction"]').on(
      "click",
      lfb_addRedirInteraction
    );
    $('a[data-action="lfb_redirSave"]').on("click", lfb_redirSave);
    $('a[data-action="lfb_addCalcInteraction"]').on(
      "click",
      lfb_addCalcInteraction
    );
    $('a[data-action="lfb_calcConditionSave"]').on(
      "click",
      lfb_calcConditionSave
    );
    $('a[data-action="lfb_calcConditionCancel"]').on(
      "click",
      lfb_calcConditionCancel
    );
    $('a[data-action="lfb_addShowLayerInteraction"]').on(
      "click",
      lfb_addShowLayerInteraction
    );
    $('a[data-action="lfb_showLayerConditionSave"]').on(
      "click",
      lfb_showLayerConditionSave
    );
    $('a[data-action="lfb_addShowInteraction"]').on(
      "click",
      lfb_addShowInteraction
    );
    $('a[data-action="lfb_showConditionSave"]').on(
      "click",
      lfb_showConditionSave
    );
    $('a[data-action="lfb_addShowStepInteraction"]').on(
      "click",
      lfb_addShowStepInteraction
    );
    $('a[data-action="lfb_showStepConditionSave"]').on(
      "click",
      lfb_showStepConditionSave
    );
    $('a[data-action="lfb_addNewCalendar"]').on("click", lfb_addNewCalendar);
    $('a[data-action="lfb_askDeleteCalendar"]').on(
      "click",
      lfb_askDeleteCalendar
    );
    $('a[data-action="lfb_closeEventsCategories"]').on(
      "click",
      lfb_closeEventsCategories
    );
    $('a[data-action="lfb_saveCalendarHoursDisabled"]').on(
      "click",
      lfb_saveCalendarHoursDisabled
    );
    $('a[data-action="lfb_saveCalendarDaysWeek"]').on(
      "click",
      lfb_saveCalendarDaysWeek
    );
    $('a[data-action="lfb_btnCalEventViewOrderClick"]').on(
      "click",
      lfb_btnCalEventViewOrderClick
    );
    $('a[data-action="lfb_btnCalEventViewCustomerClick"]').on(
      "click",
      lfb_btnCalEventViewCustomerClick
    );
    $('a[data-action="lfb_calendarEventViewGmap"]').on(
      "click",
      lfb_calendarEventViewGmap
    );
    $('a[data-action="lfb_saveCalendarEvent"]').on(
      "click",
      lfb_saveCalendarEvent
    );
    $('a[data-action="lfb_deleteCalendarEvent"]').on(
      "click",
      lfb_deleteCalendarEvent
    );
    $('a[data-action="lfb_closeLog"]').on("click", lfb_closeLog);
    $('a[data-action="lfb_orderAddRow"]').on("click", lfb_orderAddRow);
    $('a[data-action="lfb_orderAddStepRow"]').on("click", lfb_orderAddStepRow);
    $('a[data-action="lfb_openWinModifyTotal"]').on(
      "click",
      lfb_openWinModifyTotal
    );
    $('a[data-action="lfb_sendOrderByEmail"]').on(
      "click",
      lfb_sendOrderByEmail
    );
    $('a[data-action="lfb_editShowStepConditions"]').on(
      "click",
      lfb_editShowStepConditions
    );
    $('a[data-action="lfb_saveStep"]').on("click", lfb_saveStep);
    $('a[data-action="lfb_closeItemWin"]').on("click", lfb_closeItemWin);
    $('a[data-action="lfb_openCalendarPanelFromItem"]').on(
      "click",
      lfb_openCalendarPanelFromItem
    );
    $('a[data-action="lfb_add_option"]').on("click", lfb_add_option);
    $('a[data-action="lfb_editShowConditions"]').on(
      "click",
      lfb_editShowConditions
    );
    $('a[data-action="lfb_add_reduc"]').on("click", lfb_add_reduc);
    $('a[data-action="lfb_newLayerImg"]').on("click", lfb_newLayerImg);
    $('a[data-action="lfb_confirmDeleteCalendarEvent"]').on(
      "click",
      lfb_confirmDeleteCalendarEvent
    );
    $('a[data-action="lfb_deleteCalendar"]').on("click", lfb_deleteCalendar);
    $('a[data-action="lfb_saveCalendar"]').on("click", lfb_saveCalendar);
    $('a[data-action="lfb_saveCalendarCat"]').on("click", lfb_saveCalendarCat);
    $('a[data-action="lfb_saveCalendarReminder"]').on(
      "click",
      lfb_saveCalendarReminder
    );
    $('[data-action="lfb_tld_toggleSavePanel"]').on(
      "click",
      lfb_tld_toggleSavePanel
    );
    $('[data-action="lfb_tld_openSaveBeforeEditDialog"]').on(
      "click",
      lfb_tld_openSaveBeforeEditDialog
    );
    $('[data-action="lfb_tld_resetStyles"]').on("click", lfb_tld_resetStyles);
    $('[data-action="lfb_tld_leave"]').on("click", lfb_tld_leave);
    $('[data-action="lfb_tld_tdgn_toggleTdgnPanel"]').on(
      "click",
      lfb_tld_tdgn_toggleTdgnPanel
    );
    $('[data-action="lfb_tld_prepareSelectElement"]').on(
      "click",
      lfb_tld_prepareSelectElement
    );
    $('[data-action="lfb_tld_saveCurrentElement"]').on(
      "click",
      lfb_tld_saveCurrentElement
    );
    $('[data-action="lfb_tld_tdgn_toggleInspector"]').on(
      "click",
      lfb_tld_tdgn_toggleInspector
    );

    $("#lfb_winStepSettings")
      .find('[name="useShowConditions"]')
      .on("change", lfb_changeUseShowStepConditions);
    lfb_changeUseShowStepConditions();

    if ($('textarea[name="customJS"]').length > 0) {
      lfb_editorCustomJS = CodeMirror.fromTextArea(
        $('textarea[name="customJS"]').get(0),
        {
          mode: "javascript",
          lineNumbers: true,
        }
      );
      lfb_editorCustomCSS = CodeMirror.fromTextArea(
        $('textarea[name="customCss"]').get(0),
        {
          mode: "css",
          lineNumbers: true,
        }
      );
    }
    if ($("#lfb_winItem").length > 0) {
      lfb_itemPriceCalculationEditor = CodeMirror.fromTextArea(
        $('#lfb_winItem textarea[name="calculation"]').get(0),
        {
          mode: "javascript",
          lineNumbers: true,
        }
      );
      $('#lfb_winItem textarea[name="calculation"]').data(
        "codeMirrorEditor",
        lfb_itemPriceCalculationEditor
      );
      lfb_itemCalculationQtEditor = CodeMirror.fromTextArea(
        $('#lfb_winItem textarea[name="calculationQt"]').get(0),
        {
          mode: "javascript",
          lineNumbers: true,
        }
      );
      $('#lfb_winItem textarea[name="calculationQt"]').data(
        "codeMirrorEditor",
        lfb_itemCalculationQtEditor
      );

      lfb_itemVariableCalculationEditor = CodeMirror.fromTextArea(
        $('#lfb_winItem textarea[name="variableCalculation"]').get(0),
        {
          mode: "javascript",
          lineNumbers: true,
        }
      );
      $('#lfb_winItem textarea[name="variableCalculation"]').data(
        "codeMirrorEditor",
        lfb_itemVariableCalculationEditor
      );

      lfb_itemPriceCalculationEditor.jObject = $(
        '#lfb_winItem textarea[name="calculation"]'
      );
      lfb_itemCalculationQtEditor.jObject = $(
        '#lfb_winItem textarea[name="calculationQt"]'
      );
      lfb_itemVariableCalculationEditor.jObject = $(
        '#lfb_winItem textarea[name="variableCalculation"]'
      );

      lfb_initCalculationEditor("calculation");
      lfb_initCalculationEditor("calculationQt");
      lfb_initCalculationEditor("variableCalculation");

      $("#lfb_winItem")
        .find('[name="quantity_enabled"]')
        .on("change", lfb_changeQuantityEnabled);
      $("#lfb_winItem")
        .find('[name="quantityUpdated"]')
        .on("change", lfb_changeQuantity);
      $("#lfb_winItem")
        .find('[name="wooProductID"]')
        .on("change", lfb_changeWoo);
      $("#lfb_winItem")
        .find('[name="eddProductID"]')
        .on("change", lfb_changeEDD);
      $("#lfb_winItem")
        .find('[name="fieldType"]')
        .on("change", lfb_changeFieldType);
      $("#lfb_winItem").find('[name="type"]').on("change", lfb_changeFieldType);
      $("#lfb_winItem")
        .find('[name="autocomplete"]')
        .on("change", lfb_changeAutocomplete);
      $("#lfb_winItem")
        .find('[name="useCalculation"]')
        .on("change", lfb_changeUseCalculation);
      $("#lfb_winItem")
        .find('[name="useCalculationQt"]')
        .on("change", lfb_changeUseCalculationQt);
      $("#lfb_winItem")
        .find('[name="modifiedVariableID"]')
        .on("change", lfb_changeVariableCalculation);
      $("#lfb_winItem")
        .find('[name="validation"]')
        .on("change", lfb_changeValidation);
      $("#lfb_winItem").find('[name="type"]').on("change", lfb_changeItemType);
      $("#lfb_winItem")
        .find('[name="useShowConditions"]')
        .on("change", lfb_changeUseShowConditions);
      $("#lfb_winItem")
        .find('[name="showInSummary"]')
        .on("change", lfb_showSummaryItemChange);
      $("#lfb_winItem")
        .find('[name="useDistanceAsQt"]')
        .on("change", lfb_formDistanceAsQtChange);
      $("#lfb_winItem")
        .find('[name="isRequired"]')
        .on("change", lfb_changeItemIsRequired);
      $("#lfb_winItem")
        .find('[name="useValueAsQt"]')
        .on("change", lfb_changeUseValueAsQt);
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .on("change", lfb_changeItemCalendarID);
      $("#lfb_winItem")
        .find('[name="date_allowPast"]')
        .on("change", lfb_changeItemAllowPastDate);
      $("#lfb_winItem")
        .find('[name="dateType"]')
        .on("change", changeItemDateType);
      $("#lfb_winItem")
        .find('[name="dateType"]')
        .on("change", lfb_changeBusyDateEvent);
      $("#lfb_winItem")
        .find('[name="registerEvent"]')
        .on("change", lfb_changeRegisterEvent);
      $("#lfb_winItem")
        .find('[name="registerEvent"]')
        .on("change", lfb_changeBusyDateEvent);
      $("#lfb_winItem")
        .find('[name="eventDurationType"]')
        .on("change", lfb_changeBusyDateEvent);
      $("#lfb_winItem")
        .find('[name="useAsDateRange"]')
        .on("change", lfb_changeBusyDateEvent);
      $("#lfb_winItem")
        .find('[name="eventBusy"]')
        .on("change", lfb_changeBusyDateEvent);
      $("#lfb_winItem")
        .find('[name="useAsDateRange"]')
        .on("change", lfb_changeUseAsDateRange);
      $("#lfb_winItem")
        .find('[name="usePaypalIfChecked"]')
        .on("change", lfb_changeUsePaypalIfChecked);
      $("#lfb_winItem")
        .find('[name="dontUsePaypalIfChecked"]')
        .on("change", lfb_changeDontUsePaypalIfChecked);
      $("#lfb_winItem")
        .find('[name="sendAsUrlVariable"]')
        .on("change", lfb_changeSendAsVariable);
      $("#lfb_winItem")
        .find('[name="mapType"]')
        .on("change", lfb_changeMapType);
      $("#lfb_winItem")
        .find('[name="imageType"]')
        .on("change", lfb_changeImageType);
      $("#lfb_winItem")
        .find('[name="showInCsv"]')
        .on("change", lfb_changeShowCsv);
      $("#lfb_winItem")
        .find('[name="useCurrentWooProduct"]')
        .on("change", lfb_changeUseCurrentWoo);
      $("#lfb_winItem")
        .find('[name="isCountryList"]')
        .on("change", lfb_changeIsCountryList);
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .on("change", lfb_changeReducEnabled);
    }

    lfb_initLogsToolbar();
    lfb_initVariablesToolbar();
    lfb_initEditOrderToolbar();
    lfb_initMainToolbar();
    lfb_initWinGlobalSettings();
    lfb_initWinDeleteCustomer();
    lfb_initWinCustomerDetails();
    lfb_initWinCustomers();
    $('a[data-action="toggleDarkMode"]').on("click", function () {
      lfb_toggleDarkMode();
    });

    $('a[data-action="openStepSettings"]').on("click", function () {
      showModal($("#lfb_winStepSettings"));

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_loadStep",
          stepID: lfb_currentStepID,
        },
        success: function (rep) {
          rep = jQuery.parseJSON(rep);
          if (lfb_currentStepID == rep.step.id) {
            var step = rep.step;
            lfb_currentStep = rep;

            $("#lfb_winStepSettings")
              .find("input,select,textarea")
              .each(function () {
                if ($(this).is('[data-switch="switch"]')) {
                  var value = false;
                  eval(
                    "if(step." +
                      $(this).attr("name") +
                      " == 1){$(this).attr('checked','checked');} else {$(this).attr('checked',false);}"
                  );
                  eval(
                    "if(step." +
                      $(this).attr("name") +
                      ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
                  );
                } else {
                  eval("$(this).val(step." + $(this).attr("name") + ");");
                }
              });

            $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
              "update"
            );
          }
        },
      });
    });
    $('a[data-action="saveStepSettings"]').on("click", function () {
      lfb_saveStepSettings();
    });

    $("#lfb_winEditStepVisual #lfb_stepTitle").on("keyup", function () {
      $("#lfb_stepFrame")
        .contents()
        .find(
          '.lfb_genSlide[data-stepid="' +
            lfb_currentStepID +
            '"] .lfb_stepTitle'
        )
        .html($(this).val());
      lfb_currentStep.title = $(this).val();
      $('.lfb_stepBloc[data-stepid="' + lfb_currentStepID + '"] h4').html(
        lfb_currentStep.title
      );
    });
    $("#lfb_winEditStepVisual #lfb_stepTitle").on(
      "focusout",
      lfb_updateStepMainSettings
    );

    $('#lfb_winDeleteVariable a[data-action="deleteVariable"]').on(
      "click",
      lfb_confirmDeleteVariable
    );
    $('#lfb_winEditVariable a[data-action="saveVariable"]').on(
      "click",
      lfb_saveVariable
    );

    $('#lfb_calendarsNavbar a[data-action="openCalEventsCats"]').on(
      "click",
      lfb_openEventsCategories
    );
    $('#lfb_calendarsNavbar a[data-action="openCalDefReminders"]').on(
      "click",
      lfb_openDefaultReminders
    );
    $('#lfb_calendarsNavbar a[data-action="exportCalCsv"]').on(
      "click",
      lfb_exportCalendarEvents
    );

    $('#lfb_calendarsNavbar a[data-action="openCalDaysWeek"]').on(
      "click",
      function () {
        lfb_openLeftPanel("lfb_calendarDaysWeek");
      }
    );
    $('#lfb_calendarsNavbar a[data-action="openCalHours"]').on(
      "click",
      function () {
        lfb_openLeftPanel("lfb_calendarHoursEnabled");
      }
    );
    $('[data-action="showLastStep"]').on("click", function () {
      $("html").css("overflow-y", "auto");
      lfb_currentStepID = 0;
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $(this)
        .closest("#lfb_editFormNavbar")
        .find(".active")
        .removeClass("active");
      $(this).addClass("active");

      if (lfb_currentForm.form.useVisualBuilder == 1) {
        lfb_editVisualStep(0);
      } else {
        $(".lfb_mainNavBar").hide();
        $("#lfb_navBar_laststep").show();
        $("#lfb_finalStepFields").removeClass("lfb_hidden");
      }
      $(window).trigger("resize");
    });
    $('[data-action="showStepsManager"]').on("click", function () {
      $("html").css("overflow-y", "auto");

      $("#lfb_innerLoader").fadeOut();
      $('[data-action="stepSettings"]').removeClass("disabled");

      if (lfb_currentForm.steps.length > 0) {
        $("#lfb_noStepsMsg").addClass("hidden");
      } else {
        $("#lfb_noStepsMsg").removeClass("hidden");
      }

      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_stepsOverflow").removeClass("lfb_hidden");
      $(window).trigger("resize");

      $("#lfb_btnRemoveAllSteps").removeClass("lfb_hidden");
      $("#lfb_mainBtnSave").addClass("lfb_hidden");
      $(this)
        .closest("#lfb_editFormNavbar")
        .find(".active")
        .removeClass("active");
      $(this).addClass("active");
      if (lfb_disableLinksAnim) {
        setTimeout(lfb_updateStepCanvas, 200);
      }
      lfb_repositionLinks();
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_form").show();
      $(window).trigger("resize");
    });
    $('[data-action="continueLsc"]').on("click", function () {
      hideModal($("#lfb_winNoLicense"));
    });
    $('[data-action="showFormSettings"]').on("click", function () {
      $("#lfb_innerLoader").fadeOut();

      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_formSettings").show();
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_formFields").removeClass("lfb_hidden");
      $("#lfb_btnRemoveAllSteps").addClass("lfb_hidden");
      $("#lfb_mainBtnSave").removeClass("lfb_hidden");
      $("#lfb_mainBtnSave").attr("data-btnaction", "saveForm");
      $(this)
        .closest("#lfb_editFormNavbar")
        .find(".active")
        .removeClass("active");
      $(this).addClass("active");
      $('#lfb_formSettingsSidebar a[data-panel="#lfb_tabGeneral"]').trigger(
        "click"
      );
      $(window).trigger("resize");
      $("html").css("overflow-y", "auto");
    });

    $("#lfb_winItem .lfb_btnWinClose")
      .parent()
      .on("click", function () {
        $("html").css("overflow-y", "auto");
        if (
          lfb_currentStepID > 0 &&
          lfb_currentForm.form.useVisualBuilder != 1
        ) {
          $("#lfb_winStep").show();
          lfb_openWinStep(lfb_currentStepID);
        } else {
          $("#lfb_panelPreview").removeClass("lfb_hidden").show();
        }
      });
    $("#lfb_winStep .lfb_btnWinClose")
      .parent()
      .on("click", function () {
        $("html,body").css("overflow-y", "auto");
        $("#lfb_panelPreview").removeClass("lfb_hidden").show();
        lfb_currentStep = false;
        lfb_currentStepID = 0;
      });

    $("#lfb_winEditStepVisual .lfb_btnWinClose")
      .parent()
      .on("click", function () {
        $("html,body").css("overflow-y", "auto");
        $("#lfb_panelPreview").removeClass("lfb_hidden").show();
      });
    $("#lfb_winShowStepConditions .lfb_btnWinClose")
      .parent()
      .on("click", function () {
        if (lfb_currentForm.form.useVisualBuilder == 1) {
          showModal($("#lfb_winStepSettings"));
        }
      });

    if (lfb_data.lscV == 0 && !localStorage.getItem("lfb_dev")) {
      var randomTime = Math.floor(Math.random() * (6800 - 2400 + 1)) + 2400;

      setTimeout(function () {
        showModal($("#lfb_winNoLicense"));
        const $btn = $('#lfb_winNoLicense [data-action="continueLsc"]');
        var btnTxt = $btn.html();
        var stepIndex = 4;
        $btn.html(btnTxt + " (" + stepIndex + ")");
        $btn.prop("disabled", true);
        $btn.addClass("disabled");
        for (var i = stepIndex; i > 0; i--) {
          setTimeout(function () {
            stepIndex--;
            $btn.html(btnTxt + " (" + stepIndex + ")");
            if (stepIndex == 0) {
              $btn.removeProp("disabled");
              $btn.removeClass("disabled");
              $btn.html(btnTxt);
            }
          }, 1000 * i);
        }
      }, randomTime);
    }

    $(".colorpick").on("input", function () {
      var color = $(this).val();
      if (color.indexOf("#") == -1) {
        color = "#" + color;
      }
      $(this).next(".lfb_colorPreview").css({
        backgroundColor: color,
      });
    });

    $(document).on("mousemove", function (e) {
      if (lfb_isLinking) {
        lfb_mouseX = e.pageX - $("#lfb_stepsContainer").offset().left;
        lfb_mouseY = e.pageY - $("#lfb_stepsContainer").offset().top;
      }
    });
    $(window).resize(lfb_updateStepsDesign);
    lfb_itemWinTimer = setInterval(lfb_updateWinItemPosition, 30);
    $("#lfb_actionSelect").on("change", function () {
      lfb_changeActionBubble($("#lfb_actionSelect").val());
    });
    $("#lfb_interactionSelect").on("change", function () {
      lfb_changeInteractionBubble($("#lfb_interactionSelect").val());
    });
    $('input[data-iconfield="1"]').on("focusout", function () {
      if ($(this).val().indexOf("<i") > -1) {
        var tmpEl = $($(this).val());
        $(this).val(tmpEl.attr("class"));
      }
    });
    $('#lfb_winGlobalSettings [data-action="testSMTP"]').on(
      "click",
      lfb_testSMTP
    );
    $('#lfb_winShortcode [name="display"]').on("change", generateShortcode);
    $('#lfb_winShortcode [name="startStep"]').on("change", generateShortcode);
    $("#lfb_winShortcode")
      .find("#lfb_shortcodeField,#lfb_shortcodePopup")
      .on("click", function () {
        lfb_selectPre(this);
      });

    $(
      "#lfb_interactionBubble,#lfb_actionBubble,#lfb_linkBubble,#lfb_fieldBubble,#lfb_calculationValueBubble,#lfb_emailValueBubble,#lfb_distanceValueBubble,#lfb_calculationDatesDiffBubble"
    )
      .on("mouseeenter", function (e) {
        $(this).addClass("lfb_hover");
      })
      .on("mouseleave", function (e) {
        $(this).removeClass("lfb_hover");
      });
    $(
      "#lfb_interactionBubble,#lfb_actionBubble,#lfb_linkBubble,#lfb_fieldBubble,#lfb_calculationValueBubble,#lfb_emailValueBubble,#lfb_distanceValueBubble,#lfb_calculationDatesDiffBubble"
    )
      .find("select")
      .on("focusin", function () {
        $(this).addClass("lfb_hover");
      })
      .on("focusout", function () {
        $(this).removeClass("lfb_hover");
      });
    $("body").on("click", function () {
      if (!$("#lfb_interactionBubble").is(".lfb_hover")) {
        $("#lfb_interactionBubble").fadeOut();
      }
      if (
        !$("#lfb_actionBubble").is(".lfb_hover") &&
        !$("#lfb_websiteFrame").is(".lfb_hover") &&
        !$(".lfb_selectElementPanel").is(".lfb_hover")
      ) {
        $("#lfb_actionBubble").fadeOut();
      }
      if (!$("#lfb_linkBubble").is(".lfb_hover")) {
        $("#lfb_linkBubble").fadeOut();
      }
      if (
        !$("#lfb_calculationValueBubble").is(".lfb_hover") &&
        $("#lfb_calculationValueBubble").find(".lfb_hover").length == 0
      ) {
        $("#lfb_calculationValueBubble").fadeOut();
      }
      if (
        !$("#lfb_emailValueBubble").is(".lfb_hover") &&
        $("#lfb_emailValueBubble").find(".lfb_hover").length == 0
      ) {
        $("#lfb_emailValueBubble").fadeOut();
      }

      if (
        !$("#lfb_fieldBubble").is(".lfb_hover") &&
        $("#lfb_fieldBubble").find(".lfb_hover").length == 0
      ) {
        $("#lfb_fieldBubble").fadeOut();
      }
      if (
        !$("#lfb_distanceValueBubble").is(".lfb_hover") &&
        $("#lfb_distanceValueBubble").find(".lfb_hover").length == 0
      ) {
        $("#lfb_distanceValueBubble").fadeOut();
      }
      if (
        !$("#lfb_calculationDatesDiffBubble").is(".lfb_hover") &&
        $("#lfb_calculationDatesDiffBubble").find(".lfb_hover").length == 0
      ) {
        $("#lfb_calculationDatesDiffBubble").fadeOut();
      }
    });

    $('a[data-action="returnToTheForm"]').on("click", function () {
      $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
      $("#lfb_panelPreview").removeClass("lfb_hidden");
    });

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();
    $("#lfb_bootstraped .modal-dialog")
      .on("mouseeenter", function () {
        $(this).addClass("lfb_hover");
      })
      .on("mouseleave", function () {
        $(this).removeClass("lfb_hover");
      });
    $("#lfb_bootstraped .modal").on("hide.bs.modal", function (e) {
      if (!$(this).find(".modal-dialog").is(".lfb_hover")) {
        e.preventDefault();
      }
    });
    $("#lfb_closeWinActivationBtn").on("click", function () {
      if (!lfb_lock) {
        hideModal($("#lfb_winActivation"));
        $("#lfb_winActivation").delay(200).fadeOut();
      }
    });
    if (
      $("#lfb_winActivation").is('[data-show="true"]') &&
      document.referrer.indexOf("admin.php?page=lfb_menu") < 0
    ) {
      lfb_lock = true;

      $("#lfb_closeWinActivationBtn .lfb_text")
        .data("num", 10)
        .html("Wait 10 seconds");
      lfb_actTimer = setInterval(function () {
        var num = $("#lfb_closeWinActivationBtn .lfb_text").data("num");
        num--;
        if (num > 0) {
          $("#lfb_closeWinActivationBtn .lfb_text")
            .data("num", num)
            .html("Wait " + num + " seconds");
        } else {
          $("#lfb_closeWinActivationBtn").removeClass("disabled");
          lfb_lock = false;
          $("#lfb_closeWinActivationBtn .lfb_text")
            .data("num", "")
            .html("Close");
        }
      }, 1000);
    } else {
      $("#lfb_winActivation").attr("data-show", "false");
    }
    $("#lfb_winActivation").on("hide.bs.modal", function (e) {
      if (lfb_lock && !$("#lfb_winActivation .modal-dialog").is(".lfb_hover")) {
        e.preventDefault();
      }
    });
    $(document).on("mousedown", function (e) {
      if (e.button == 2 && lfb_isLinking) {
        lfb_isLinking = false;
      }
    });

    $('input[type="number"][min]').on("focusout", function () {
      if (
        $(this).val().indexOf("-") > -1 &&
        (!$(this).is("[min]") || $(this).attr("min").indexOf("-") < 0)
      ) {
        $(this).val(parseInt($(this).attr("min")));
      }
      if (parseFloat($(this).val()) < parseFloat($(this).attr("min"))) {
        $(this).val($(this).attr("min"));
      }
      if (parseFloat($(this).val()) > parseFloat($(this).attr("max"))) {
        $(this).val($(this).attr("max"));
      }
    });
    $(".form-group").each(function () {
      var self = this;
      if (
        $(self).find("small").length > 0 &&
        $(self).find(".form-control").length > 0
      ) {
        $(this)
          .find(".form-control")
          .tooltip({
            title: $(self).find("small").html(),
            container: "#lfb_bootstraped",
            html: true,
          });
      }
    });

    $('a[data-action="lfb_calculationAiWizard"]').on("click", function () {
      if (lfb_settings.openAiKey.length == 0) {
        lfb_openGlobalSettings("openAiKey");
        return;
      }
      $("#aiCalculationModal").removeClass("lfb-hidden");
      $("#aiCalculationModal").data(
        "field",
        $(this).closest(".form-group").attr("id")
      );
      showModal($("#aiCalculationModal"));
    });
    $("#submitAiCalculation").on("click", function () {
      var description = $("#aiCalculationDescription").val();

      if (description.trim() === "") {
        $("#aiCalculationDescription").addClass("is-invalid");
        return;
      }
      $("#aiCalculationDescription").removeClass("is-invalid");

      const field_id = $("#aiCalculationModal").data("field");

      var $button = $(this);
      $button.prop("disabled", true);
      $button.html(
        '<i class="fas fa-spinner fa-spin"></i> ' +
          lfb_data.texts["Loading"] +
          "..."
      );

      var mode = "price";
      if (field_id == "lfb_quantityCalculationField") {
        mode = "quantity";
      } else if (field_id == "lfb_varCalculationField") {
        mode = "variable";
      }

      $.ajax({
        url: ajaxurl,
        type: "POST",
        data: {
          action: "lfb_save_ai_calculation",
          formID: lfb_currentFormID,
          itemID: lfb_currentItemID,
          description: description,
          mode: mode,
        },
        success: function (response) {
          hideModal($("#aiCalculationModal"));
          if (field_id == "lfb_priceCalculationField") {
            lfb_itemPriceCalculationEditor.setValue(response.data.calculation);
          } else if (field_id == "lfb_quantityCalculationField") {
            lfb_itemCalculationQtEditor.setValue(response.data.calculation);
          } else if (field_id == "lfb_varCalculationField") {
            lfb_itemVarCalculationEditor.setValue(response.data.calculation);
          }
          $("#" + field_id)
            .find(".alert-success")
            .remove();
          $("#" + field_id)
            .find(".CodeMirror")
            .after(
              '<div class="alert alert-success lfb_txt-14 text-center">' +
                response.data.explanation +
                "</div>"
            );
        },
        error: function () {
          alert(lfb_data.texts["An error occurred. Please try again."]);
        },
        complete: function () {
          $button.prop("disabled", false);
          $button.html(lfb_data.texts["Calculate"]);
        },
      });
    });

    $("#lfb_editFinalStepVisual").on("click", function () {
      lfb_editVisualStep(0);
    });
    $("#lfb_winFormWizard")
      .find('[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });

    $("#lfb_winEditVariable")
      .find('[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });

    $("#lfb_winStepSettings")
      .find('[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });

    $("#lfb_winSendOrberByEmail")
      .find('[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });
    $("#lfb_bootstraped.lfb_bootstraped [data-toggle='switch']")
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });
    $("#lfb_bootstraped.lfb_bootstraped #lfb_winItem [data-switch='switch']")
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });
    $("#lfb_bootstraped.lfb_bootstraped #lfb_winStep [data-switch='switch']")
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });
    $("#lfb_bootstraped.lfb_bootstraped #lfb_formFields [data-switch='switch']")
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });
    $(
      "#lfb_bootstraped.lfb_bootstraped #lfb_winDeleteOrder [data-switch='switch']"
    )
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });
    $(
      "#lfb_bootstraped.lfb_bootstraped #lfb_winGlobalSettings [data-switch='switch']"
    )
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch({
        onLabel: lfb_data.texts["Yes"],
        offLabel: lfb_data.texts["No"],
      });

    var dateFormat = lfb_data.dateFormat;
    dateFormat = dateFormat.replace(/\\\//g, "/");
    dateFormat += " " + lfb_data.timeFormat;
    $(".lfb_datetimepicker")
      .datetimepicker({
        timeZone: "",
        showMeridian: lfb_data.dateMeridian == "1",
        format: dateFormat,
        container: $("#lfb_form.lfb_bootstraped"),
      })
      .on("show", function () {
        $(".datetimepicker .table-condensed .prev").show();
        $(".datetimepicker .table-condensed .switch").show();
        $(".datetimepicker .table-condensed .next").show();
      });
    $('#lfb_winEditCoupon [name="expiration"]')
      .datetimepicker({
        timeZone: "",
        showMeridian: false,
        format: "yyyy-mm-dd hh:ii",
        container: $("#lfb_form.lfb_bootstraped"),
      })
      .on("show", function () {
        $(".datetimepicker .table-condensed .prev").show();
        $(".datetimepicker .table-condensed .switch").show();
        $(".datetimepicker .table-condensed .next").show();
      });
    $("#lfb_stepsOverflow").on("contextmenu", function () {
      return false;
    });

    $("#lfb_imageLayersTable tbody").sortable({
      helper: function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function (index) {
          $(this).width($originals.eq(index).width());
        });
        return $helper;
      },
      stop: function (event, ui) {
        var layers = "";
        $("#lfb_imageLayersTable tbody tr[data-layerid]").each(function (i) {
          layers += $(this).attr("data-layerid") + ",";
        });
        if (layers.length > 0) {
          layers = layers.substr(0, layers.length - 1);
        }
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_changeLayersOrder",
            layers: layers,
          },
        });
      },
    });

    $("#lfb_finalStepItemsList table tbody").sortable({
      helper: function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function (index) {
          $(this).width($originals.eq(index).width());
        });
        return $helper;
      },
      stop: function (event, ui) {
        var fields = "";
        $("#lfb_finalStepItemsList table tbody tr[data-fieldid]").each(
          function (i) {
            fields += $(this).attr("data-fieldid") + ",";
          }
        );
        if (fields.length > 0) {
          fields = fields.substr(0, fields.length - 1);
        }
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_changeLastFieldsOrders",
            fields: fields,
          },
        });
      },
    });

    $('#lfb_winEditCoupon input[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch();

    var todayDate = new Date();
    $("#lfb_calendar").fullCalendar({
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek,agendaDay,listWeek",
      },
      defaultDate: new Date(),
      editable: true,
      locale: lfb_data.locale,
      timeFormat: lfb_data.timeFormatCal,
      navLinks: true,
      eventLimit: true,
      events: function (start, end, timezone, callback) {
        if ($("#lfb_winCalendars").css("display") != "none") {
          jQuery.ajax({
            url: ajaxurl,
            type: "post",
            data: {
              action: "lfb_getCalendarEvents",
              formID: lfb_currentFormID,
              calendarID: lfb_currentCalendarID,
              start: moment(start, "YYYY-MM-DD HH:mm:ss").toDate(),
              end: moment(end, "YYYY-MM-DD HH:mm:ss").toDate(),
            },
            success: function (doc) {
              doc = jQuery.parseJSON(doc, true);
              lfb_currentCalendarEvents = doc.events;
              lfb_currentCalendarDefaultReminders = doc.reminders;
              lfb_currentCalendarCats = doc.categories;
              lfb_currentCalendarDaysWeek = doc.daysWeek;
              lfb_currentCalendarDisabledHours = doc.disabledHours;
              lfb_generateCalendarCatsSelect();
              lfb_generateCalendarCatsTable();
              lfb_updateCalendarDaysWeekTable();
              lfb_updateCalendarHoursEnabledTable();

              jQuery.each(lfb_currentCalendarDaysWeek, function (i) {
                lfb_currentCalendarDaysWeek[i] = parseInt(this);
              });

              $("#lfb_calendar").fullCalendar(
                "option",
                "hiddenDays",
                lfb_currentCalendarDaysWeek
              );
              jQuery.each(lfb_currentCalendarEvents, function () {
                if (this.allDay == 1) {
                  this.allDay = true;
                } else {
                  this.allDay = false;
                }
              });
              $(
                '#lfb_calendarLeftMenu [name="orderID"] option[value!="0"]'
              ).remove();
              jQuery.each(doc.orders, function () {
                $('#lfb_calendarLeftMenu [name="orderID"]').append(
                  '<option value="' +
                    this.id +
                    '" data-customerid="' +
                    this.customerID +
                    '">' +
                    this.title +
                    "</option>"
                );
              });
              if (lfb_currentCalendarEventID > 0) {
                lfb_editCalendarEvent(lfb_currentCalendarEventID);
              }
              callback(lfb_currentCalendarEvents);
              $("#lfb_loader").fadeOut();
              $("#lfb_loaderText").html("");
            },
          });
        }
      },
      eventDrop: function (event, delta, revertFunc) {
        var end = event.start
          .toDate()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        if (event.end != null) {
          end = event.end.toDate().toISOString().slice(0, 19).replace("T", " ");
        }
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_updateCalendarEvent",
            formID: lfb_currentFormID,
            eventID: event.id,
            start: event.start
              .toDate()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            end: end,
          },
          success: function (rep) {},
        });
      },
      eventResize: function (event, jsEvent, ui, view) {
        var end = event.start
          .toDate()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        if (event.end != null) {
          end = event.end.toDate().toISOString().slice(0, 19).replace("T", " ");
        }
        var eventData = lfb_getCalendarEvent(event.id);
        eventData.end = end;
        if (lfb_currentCalendarEventID == event.id) {
          $('#lfb_calendarLeftMenu [name="end"]').datetimepicker(
            "setDate",
            moment(end, "YYYY-MM-DD HH:mm").toDate()
          );
        }

        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_updateCalendarEvent",
            formID: lfb_currentFormID,
            eventID: event.id,
            start: event.start
              .toDate()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            end: end,
          },
          success: function (rep) {},
        });
      },
      eventClick: function (calEvent, jsEvent, view) {
        lfb_editCalendarEvent(calEvent.id);
      },
      dayRender: function (date, cell) {
        var link = $(
          '<a href="javascript:" class="lfb_calendarLinkAddEventDay"><span class="fas fa-plus"></span></a>'
        );
        link.on("click", function () {
          lfb_addCalendarEvent(date, cell);
        });
        $(cell).append(link);
      },
      dayClick: function (date, jsEvent, view) {
        if (
          view.name == "agendaWeek" ||
          view.name == "agendaDay" ||
          view.name == "month"
        ) {
          lfb_addCalendarEvent(date);
        }
      },
    });
    $('#lfb_calendarLeftMenu [name="allDay"]').on(
      "change",
      lfb_calEventFullDayChange
    );
    $('#lfb_calendarLeftMenu [name="start"]').on(
      "change",
      lfb_calEventStartDateChange
    );
    $("#lfb_selectCalendar").on("change", lfb_selectCalendarChange);
    $('#lfb_calendarLeftMenu [name="orderID"]').on(
      "change",
      lfb_calEventOrderIDChange
    );
    $('#lfb_calendarLeftMenu [name="customerID"]').on(
      "change",
      lfb_calEventCustomerIDChange
    );

    $('#lfb_calendarLeftMenu [name="categoryID"]').on(
      "change",
      lfb_calEventCategoryIDChange
    );

    $("#calEventContent").summernote({
      height: 200,
      minHeight: null,
      maxHeight: null,
      toolbar: lfb_summernoteReminderToolbar,
      buttons: lfb_summernoteBtns,
      callbacks: {
        onFocus: function () {
          $(this).next(".note-editor").addClass("lfb-focus");
        },
        onBlur: function () {
          $(this).next(".note-editor").removeClass("lfb-focus");
        },
      },
    });

    $("#calEventContent_editor .note-editor .btn.dropdown-toggle").addClass(
      "lfb_close"
    );
    $("#calEventContent_editor .note-editor .btn.dropdown-toggle").on(
      "click",
      function () {
        $(
          "#calEventContent_editor .note-editor .btn.dropdown-toggle:not(.lfb_close)"
        ).trigger("click");
        if ($(this).is(".lfb_close")) {
          $(this).removeClass("lfb_close");
          $(this).next(".dropdown-menu").show();
        } else {
          $(this).addClass("lfb_close");
          $(this).next(".dropdown-menu").hide();
        }
      }
    );

    $('#calEventContent_editor .note-editor [data-toggle="tooltip"]').tooltip({
      container: "#lfb_bootstraped",
      placement: "bottom",
      boundary: "window",
    });

    $(".lfb_iconslist li a").on("click", function () {
      $(this)
        .closest(".form-group")
        .find(".btn.dropdown-toggle>span.lfb_name")
        .html($(this).attr("data-icon"));
      $(this)
        .closest(".form-group")
        .find("input.lfb_iconField")
        .val($(this).attr("data-icon"));
      $(this).closest("ul").find("li.lfb_active").removeClass("lfb_active");
      $(this).closest("li").addClass("lfb_active");
    });
    $("input.lfb_iconField").on("change", function () {
      if (
        $(this)
          .closest(".form-group")
          .find(".btn.dropdown-toggle>span.lfb_name")
          .html() != $(this).val()
      ) {
        $(this)
          .closest(".form-group")
          .find(".btn.dropdown-toggle>span.lfb_name")
          .html($(this).val());
      }
    });

    $('#lfb_winEditCalendarCat input[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch();
    $("#lfb_winEditCalendarCat .colorpick").each(function () {
      var $this = $(this);
      if ($(this).prev(".lfb_colorPreview").length == 0) {
        $(this).before(
          '<div class="lfb_colorPreview" style="background-color:#' +
            $this.val().substr(1, 7) +
            '"></div>'
        );
      }
      $(this)
        .prev(".lfb_colorPreview")
        .on("click", function () {
          $(this).next(".colorpick").trigger("click");
        });
      $(this).colpick({
        color: $this.val().substr(1, 7),
        onChange: function (hsb, hex, rgb, el, bySetColor) {
          $(el).val("#" + hex);
          $(el)
            .prev(".lfb_colorPreview")
            .css({
              backgroundColor: "#" + hex,
            });
        },
      });
    });
    $("#lfb_winGlobalSettings .colorpick").each(function () {
      var $this = $(this);
      if ($(this).prev(".lfb_colorPreview").length == 0) {
        $(this).before(
          '<div class="lfb_colorPreview" style="background-color:#' +
            $this.val().substr(1, 7) +
            '"></div>'
        );
      }
      $(this)
        .prev(".lfb_colorPreview")
        .on("click", function () {
          $(this).next(".colorpick").trigger("click");
        });
      $(this).colpick({
        color: $this.val().substr(1, 7),
        onChange: function (hsb, hex, rgb, el, bySetColor) {
          $(el).val("#" + hex);
          $(el)
            .prev(".lfb_colorPreview")
            .css({
              backgroundColor: "#" + hex,
            });
        },
      });
    });
    $("#lfb_winFormWizard .colorpick").each(function () {
      var $this = $(this);
      $(this).colpick({
        color: $this.val().substr(1, 7),
        onChange: function (hsb, hex, rgb, el, bySetColor) {
          $(el).val("#" + hex);
          $(el)
            .prev(".input-group-text")
            .css({
              backgroundColor: "#" + hex,
            });
        },
      });
    });
    $(".imageBtn").on("click", function () {
      lfb_formfield = $(this).prev("input");
      tb_show("", "media-upload.php?TB_iframe=true");

      return false;
    });

    $('#lfb_formFields [name="enableCustomersData"]')
      .closest(".form-group")
      .on("click", function () {
        if ($(this).find(".has-switch").is(".deactivate")) {
          lfb_openGlobalSettings();
          $('#lfb_winGlobalSettings [name="enableCustomerAccount"]')
            .closest(".has-switch")
            .addClass("lfb_animatedPulse");
          setTimeout(function () {
            $('#lfb_winGlobalSettings [name="enableCustomerAccount"]')
              .closest(".has-switch")
              .removeClass("lfb_animatedPulse");
          }, 2000);
        }
      });
    //
    $('#lfb_formFields [name="enableCustomersData"]')
      .closest(".switch.has-switch")
      .addClass("deactivate");

    $('#lfb_winExport input[data-switch="switch"]')
      .wrap(
        '<div class="switch" data-on-label="' +
          lfb_data.texts["Yes"] +
          '" data-off-label="' +
          lfb_data.texts["No"] +
          '" />'
      )
      .parent()
      .bootstrapSwitch();
    $('#lfb_winExport input[data-switch="switch"]').on(
      "change",
      lfb_exportForms
    );
    lfb_initCharts();

    lfb_initVisualBuilder();

    lfb_initWeeksDaysText();
    lfb_initStepVisual();
    lfb_initFormsBackend();
    if (lfb_data.designForm != 0) {
      lfb_loadForm(lfb_data.designForm);
    }
    $('a[data-action="closeCalendar"]').on("click", function () {
      lfb_closeLog();
      if (lfb_currentFormID > 0) {
        $("#lfb_panelPreview").removeClass("lfb_hidden").show();
      }
    });
    $("html,body").scrollTop(0);
  });

  function initBootstrapUI() {
    $('[data-toggle="tooltip"]').tooltip({
      container: "#lfb_bootstraped",
      placement: "bottom",
      boundary: "window",
    });
  }

  function lfb_initVisualBuilder() {
    $("#lfb_form").on("lfb_stepFrameLoaded", function () {
      lfb_stepFrameLoaded();
    });
    $("#lfb_form").on("lfb_editItem", function (e, itemID) {
      lfb_editItem(itemID);
    });
    $("#lfb_form").on("lfb_editRowConditions", function (e, itemID) {
      var itemData = null;
      var itemsList = new Array();
      if (lfb_currentStepID > 0) {
        itemsList = lfb_currentStep.items;
      } else {
        itemsList = lfb_currentForm.fields;
      }
      var chkItem = false;
      jQuery.each(itemsList, function () {
        var item = this;
        if (item.id == itemID) {
          chkItem = true;
          itemData = item;
          return false;
        }
      });
      if (itemData == null) {
        return false;
      }

      lfb_editRowConditions(itemData);
    });

    //lfb_editRowConditions
    $("#lfb_form").on("lfb_cantDeleteColumn", function (e) {
      lfb_notification(
        lfb_data.texts["The column must be empty to be deleted"],
        false,
        true,
        "bg-danger text-white"
      );
    });

    $("#lfb_form").on(
      "lfb_openFormDesigner",
      function (e, targetStep, targetDomElement) {
        lfb_openFormDesigner(targetStep, targetDomElement);
      }
    );
    $("#lfb_form").on("lfb_duplicateItem", function (e, itemID) {
      lfb_duplicateItem(itemID);
    });
    $("#lfb_form").on("lfb_askDeleteItem", function (e, itemID) {
      lfb_askDeleteItem(itemID);
    });
    $("#lfb_form").on("lfb_newItemAdded", function (e, itemData) {
      lfb_newItemAdded(itemData);
    });
    $("#lfb_form").on(
      "lfb_showWinComponents",
      function (e, columnID, direction) {
        $("#lfb_winComponents").data("lfb_columnID", columnID);
        $("#lfb_winComponents").data("lfb_direction", direction);
        showModal($("#lfb_winComponents"));
      }
    );
    $("#lfb_form").on(
      "lfb_stepFrameOnHeightChanged",
      lfb_stepFrameOnHeightChanged
    );

    $("#lfb_componentsList a").on("click", function () {
      var type = $(this).attr("data-type");
      var columnID = $("#lfb_winComponents").data("lfb_columnID");
      var direction = $("#lfb_winComponents").data("lfb_direction");
      var checkboxStyle = "checkbox";
      if ($(this).is("[data-checkboxstyle]")) {
        checkboxStyle = $(this).attr("data-checkboxstyle");
      }
      $("#lfb_stepFrame")[0]
        .contentWindow.jQuery("#lfb_form")
        .trigger("lfb_addComponent", [
          type,
          columnID,
          direction,
          checkboxStyle,
        ]);
      hideModal($("#lfb_winComponents"));
    });
  }

  function lfb_updateCalendarLeftMenuHeight() {
    var calendarMenuHeight = $("#lfb_calendar").outerHeight();
    if ($("#lfb_form").height() > calendarMenuHeight) {
      calendarMenuHeight = $("#lfb_form").outerHeight();
    }
    $("#lfb_calendarLeftMenu").css({
      height: calendarMenuHeight,
    });
  }

  function lfb_updatelLeftPanels() {
    $(".lfb_lPanel.lfb_lPanelLeft").each(function () {
      var newHeight = $(this).next(".lfb_lPanel.lfb_lPanelMain").outerHeight();
      if ($("#lfb_form").height() > newHeight) {
        newHeight = $("#lfb_form").outerHeight();
      }
      $(this).css({
        height: newHeight,
      });
    });
  }

  function lfb_openWinLicense() {
    if (lfb_data.lscV == 1) {
      $("#lfb_lscUnverified").hide();
      $("#lfb_winActivation .alert").hide();
    } else {
      $("#lfb_lscUnverified").show();
    }
    lfb_lock = false;
    showModal($("#lfb_winActivation"));
    $("#lfb_winActivation").fadeIn();
    $("#lfb_closeWinActivationBtn").removeAttr("disabled");
    $("#lfb_closeWinActivationBtn").removeClass("disabled");
  }

  function lfb_initFormsBackend() {
    $('#lfb_formFields [name="use_paypal"]').on("change", lfb_formPaypalChange);
    $('#lfb_formFields [name="use_stripe"]').on("change", lfb_formStripeChange);
    $('#lfb_formFields [name="use_razorpay"]').on(
      "change",
      lfb_formRazorPayChange
    );
    $('#lfb_formFields [name="isSubscription"]').on(
      "change",
      lfb_formIsSubscriptionChange
    );
    $('#lfb_formFields [name="gravityFormID"]').on(
      "change",
      lfb_formGravityChange
    );
    $('#lfb_formFields [name="save_to_cart"]').on("change", lfb_formWooChange);
    $('#lfb_formFields [name="save_to_cart_edd"]').on(
      "change",
      lfb_formEDDChange
    );
    $('#lfb_formFields [name="email_toUser"]').on(
      "change",
      lfb_formEmailUserChange
    );
    $('#lfb_formFields [name="useEmailVerification"]').on(
      "change",
      lfb_useEmailVerificationChange
    );
    $('#lfb_formFields [name="legalNoticeEnable"]').on(
      "change",
      lfb_formLegalNoticeChange
    );
    $('#lfb_formFields [name="useVAT"]').on("change", lfb_formUseVATChange);

    $('#lfb_formFields [name="useSummary"]').on(
      "change",
      lfb_formUseSummaryChange
    );
    $('#lfb_formFields [name="intro_enabled"]').on(
      "change",
      lfb_formUseIntroChange
    );
    $('#lfb_formFields [name="paypal_useIpn"]').on("change", lfb_formIpnChange);
    $('#lfb_formFields [name="useCoupons"]').on(
      "change",
      lfb_formUseCouponsChange
    );
    $('#lfb_formFields [name="useRedirectionConditions"]').on(
      "change",
      lfb_changeUseRedirs
    );
    $('#lfb_formFields [name="useMailchimp"]').on(
      "change",
      lfb_changeMailchimp
    );
    $('#lfb_formFields [name="useMailpoet"]').on("change", lfb_changeMailpoet);
    $('#lfb_formFields [name="useGetResponse"]').on(
      "change",
      lfb_changeGetResponse
    );
    $('#lfb_formFields [name="useGoogleFont"]').on(
      "change",
      lfb_useGoogleFontChange
    );
    $('#lfb_formFields [name="scrollTopPage"]').on(
      "change",
      lfb_scrollTopPageChange
    );
    $('#lfb_formFields [name="disableScroll"]').on(
      "change",
      lfb_disableScrollChange
    );
    $('#lfb_formFields [name="previousStepBtn"]').on(
      "change",
      lfb_previousStepBtnChange
    );
    $('#lfb_formFields [name="paymentType"]').on(
      "change",
      lfb_updateEmailPaymentType
    );
    $('#lfb_formFields [name="totalIsRange"]').on(
      "change",
      lfb_totalIsRangeChange
    );
    $('#lfb_formFields [name="totalRangeMode"]').on(
      "change",
      lfb_totalRangeModeChange
    );
    $('#lfb_formFields [name="getResponseKey"]').on(
      "focusout",
      lfb_changeGetResponseList
    );
    $('#lfb_formFields [name="mailchimpKey"]').on(
      "focusout",
      lfb_changeMailchimpList
    );
    $('#lfb_formFields [name="razorpay_payMode"]').on(
      "change",
      lfb_changeRazorpayPayMode
    );
    $('#lfb_formFields [name="stripe_payMode"]').on(
      "change",
      lfb_changeStripePayMode
    );
    $('#lfb_formFields [name="paypal_payMode"]').on(
      "change",
      lfb_changePaypalPayMode
    );
    $('#lfb_formFields [name="summary_hidePrices"]').on(
      "change",
      lfb_changeSummaryPriceShow
    );
    $('#lfb_formFields [name="summary_hideTotal"]').on(
      "change",
      lfb_changeSummaryPriceShow
    );
    $('#lfb_formFields [name="enableFloatingSummary"]').on(
      "change",
      lfb_changeEnableFloatingSummary
    );
    $('#lfb_formFields [name="summary_hidePrices"]').on(
      "change",
      lfb_changeSummaryHidePrices
    );
    $('#lfb_formFields [name="useCaptcha"]').on(
      "change",
      lfb_changeSendEmailLastStep
    );
    $('#lfb_formFields [name="enableSaveForLaterBtn"]').on(
      "change",
      lfb_changeSaveForLater
    );
    $('#lfb_formFields [name="sendPdfAdmin"]').on(
      "change",
      lfb_changeSendPdfAdmin
    );
    $('#lfb_formFields [name="sendPdfCustomer"]').on(
      "change",
      lfb_changeSendPdfUser
    );
    $('#lfb_formFields [name="enablePdfDownload"]').on(
      "change",
      lfb_changeSendPdfUser
    );
    $('#lfb_formFields [name="enableCustomersData"]').on(
      "change",
      lfb_changeEnableCustomerData
    );
    $('#lfb_formFields [name="dontStoreOrders"]').on(
      "change",
      lfb_changeDontStoreOrders
    );

    $("#lfb_formFields")
      .find('[name="sendUrlVariables"]')
      .on("change", lfb_changeSendUrlVariables);
    $("#lfb_formFields")
      .find('[name="enableZapier"]')
      .on("change", lfb_formZapierChange);
    $("#lfb_formFields")
      .find('[name="disableGrayFx"]')
      .on("change", lfb_formDisableGreyFx);
    $("#lfb_formFields")
      .find('[name="showSteps"]')
      .on("change", lfb_formShowStepsChange);
    $("#lfb_formFields")
      .find('[name="useCaptcha"]')
      .on("change", lfb_formUseCaptchaChange);

    $("#lfb_formFields")
      .find('[name="enablePdfDownload"]')
      .on("change", lfb_formPDFDownloadChange);
    $("#lfb_formFields")
      .find('[name="pdfDownloadFilename"]')
      .on("keyup focusout", lfb_formPDFFilenameChange);

    $("#lfb_chartsTypeSelect").on("change", lfb_chartsTypeChange);
    $("#lfb_chartsMonth").on("change", lfb_chartsMonthChange);
    $("#lfb_chartsYear").on("change", lfb_chartsYearChange);

    lfb_formGravityChange();
    lfb_formEDDChange();
    lfb_formLegalNoticeChange();
    lfb_formUseVATChange();
    lfb_formEmailUserChange();
    lfb_useEmailVerificationChange();
    lfb_formUseSummaryChange();
    lfb_formPaypalChange();
    lfb_formStripeChange();
    lfb_formRazorPayChange();
    lfb_formUseIntroChange();
    lfb_formUseCouponsChange();
    lfb_changeUseRedirs();
    lfb_changeMailchimp();
    lfb_changeMailpoet();
    lfb_changeGetResponse();
    lfb_changeGetResponseList();
    lfb_changeMailchimpList();
    lfb_useGoogleFontChange();
    lfb_chartsTypeChange();
    lfb_totalIsRangeChange();
    lfb_totalRangeModeChange();
    lfb_scrollTopPageChange();
    lfb_disableScrollChange();
    lfb_previousStepBtnChange();
    lfb_updateEmailPaymentType();
    lfb_changeStripePayMode();
    lfb_changePaypalPayMode();
    lfb_changeRazorpayPayMode();
    lfb_changeSummaryPriceShow();
    lfb_changeEnableFloatingSummary();
    lfb_changeSendEmailLastStep();
    lfb_changeSaveForLater();
    lfb_changeSendPdfAdmin();
    lfb_changeSendPdfUser();
    lfb_changeEnableCustomerData();
    lfb_formWooChange();
    lfb_changeSendUrlVariables();
    lfb_formZapierChange();
    lfb_formDisableGreyFx();
    lfb_formShowStepsChange();
    lfb_formUseCaptchaChange();
    lfb_formPDFDownloadChange();
    lfb_changeSummaryHidePrices();
    lfb_changeDontStoreOrders();

    $('#lfb_calculationValueBubble select[name="itemID"]').on(
      "change",
      lfb_updateCalculationsValueElements
    );
    $('#lfb_calculationValueBubble select[name="valueType"]').on(
      "change",
      lfb_updateCalculationsValueType
    );

    $('#lfb_winDynamicValue select[name="itemID"]').on(
      "change",
      lfb_updateDynamicValueElements
    );
    $('#lfb_winDynamicValue select[name="valueType"]').on(
      "change",
      lfb_updateDynamicValueType
    );
    lfb_updateDynamicValueType();
    lfb_updateCalculationsValueType();
  }

  function lfb_formPDFFilenameChange() {
    var value = $("#lfb_formFields").find('[name="pdfDownloadFilename"]').val();
    value = value.replace(/[^a-z0-9-_]/gi, "");
    $("#lfb_formFields").find('[name="pdfDownloadFilename"]').val(value);
  }

  function lfb_formPDFDownloadChange() {
    if (
      $("#lfb_formFields").find('[name="enablePdfDownload"]').is(":checked")
    ) {
      $('#lfb_formFields [name="pdfDownloadFilename"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="pdfDownloadFilename"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_initWinCustomerDetails() {
    $('#lfb_customersNavbar a[data-action="saveCustomer"]').on(
      "click",
      function () {
        lfb_saveCustomer();
      }
    );
  }

  function lfb_initWinCustomers() {
    $('#lfb_customersPanel a[data-action="exportCustomersCsv"]').on(
      "click",
      lfb_exportCustomersCSV
    );
    $('#lfb_customersPanel a[data-action="addCustomer"]').on(
      "click",
      function () {
        lfb_editCustomer(0);
      }
    );
  }

  function lfb_initWinGlobalSettings() {
    $("#lfb_winGlobalSettings .btn-close").on("click", function () {
      $("#lfb_mainToolbar a.lfb_over-primary")
        .removeClass("lfb_over-primary")
        .addClass("lfb_over-default");
      $('#lfb_mainToolbar a[data-action="lfb_closeSettings"]')
        .removeClass("lfb_over-default")
        .addClass("lfb_over-primary");
    });
    $('#lfb_winGlobalSettings a[data-action="saveGlobalSettings"]').on(
      "click",
      function () {
        lfb_saveGlobalSettings(function () {
          hideModal($("#lfb_winGlobalSettings"));

          $("#lfb_mainToolbar a.lfb_over-primary")
            .removeClass("lfb_over-primary")
            .addClass("lfb_over-default");
          $('#lfb_mainToolbar a[data-action="lfb_closeSettings"]')
            .removeClass("lfb_over-default")
            .addClass("lfb_over-primary");
          lfb_loadSettings();
        });
      }
    );

    $('#lfb_winGlobalSettings [name="enableCustomerAccount"]').on(
      "change",
      function () {
        if ($(this).is(":checked")) {
          $('#lfb_winGlobalSettings [name="customerAccountPageID"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $('#lfb_winGlobalSettings [name="customerAccountPageID"]')
            .closest(".form-group")
            .slideUp();
        }
      }
    );
    $('#lfb_winGlobalSettings [name="useSMTP"]').on("change", function () {
      if ($(this).is(":checked")) {
        $("#lfb_winGlobalSettings")
          .find(
            '[name="smtp_host"],[name="smtp_port"],[name="smtp_username"],[name="smtp_password"],[name="smtp_mode"]'
          )
          .closest(".form-group")
          .slideDown();
        $(
          '#lfb_winGlobalSettings [data-action="testSMTP"],#lfb_smtpTestRep'
        ).slideDown();
      } else {
        $("#lfb_winGlobalSettings")
          .find(
            '[name="smtp_host"],[name="smtp_port"],[name="smtp_username"],[name="smtp_password"],[name="smtp_mode"]'
          )
          .closest(".form-group")
          .slideUp();
        $(
          '#lfb_winGlobalSettings [data-action="testSMTP"],#lfb_smtpTestRep'
        ).slideUp();
      }
    });
    $("#lfb_winGlobalSettings .nav-tabs .nav-link a").on("click", function (e) {
      e.preventDefault();
      var panelID = $(this).attr("href");
      $(this).closest("ul").find(".active").removeClass("active");
      $(this).closest("li").addClass("active");
      $("#lfb_winGlobalSettings").find(".tab-pane").hide();
      $("#lfb_winGlobalSettings").find(panelID).show();
      return false;
    });
  }

  function lfb_initWinDeleteCustomer() {
    $('#lfb_winAskDeleteCustomer a[data-action="confirmDeleteCustomer"]').on(
      "click",
      function () {
        var customerID = $("#lfb_winAskDeleteCustomer").data("customerID");
        lfb_confirmDeleteCustomer(customerID);
        hideModal($("#lfb_winAskDeleteCustomer"));
      }
    );
  }

  function lfb_initMainToolbar() {
    $('#lfb_mainToolbar a[data-action="openWinBackendTheme"]').on(
      "click",
      lfb_openWinBackendTheme
    );
    $('#lfb_mainToolbar a[data-action="openGlobalSettings"]').on(
      "click",
      lfb_openGlobalSettings
    );
    $('#lfb_mainToolbar a[data-action="showCustomersPanel"]').on(
      "click",
      lfb_showCustomersPanel
    );
    $('#lfb_mainToolbar a[data-action="showAllOrders"]').on(
      "click",
      lfb_showAllOrders
    );
    $('#lfb_mainToolbar a[data-action="openCalendarsPanel"]').on(
      "click",
      function () {
        lfb_openCalendarsPanel(1);
      }
    );
  }

  function lfb_initLogsToolbar() {
    $('#lfb_navBar_logs a[data-action="refreshLogs"]').on(
      "click",
      lfb_refreshLogs
    );
    $('#lfb_navBar_logs a[data-action="exportLogs"]').on(
      "click",
      lfb_exportLogs
    );
    $('#lfb_navBar_logs a[data-action="openCharts"]').on("click", function () {
      lfb_showLoader();
      lfb_openCharts($("#lfb_panelLogs").attr("data-formid"));
    });
    $('#lfb_navBar_logs a[data-action="returnToForm"]').on(
      "click",
      lfb_closeLogs
    );
  }

  function lfb_initEditOrderToolbar() {
    $('#lfb_navBar_log  a[data-action="editOrder"]').on("click", function () {
      lfb_loadLog(lfb_currentLogID, true);
    });
    $('#lfb_navBar_log  a[data-action="sendOrderByEmail"]').on(
      "click",
      lfb_openWinSendOrderEmail
    );
    $('#lfb_navBar_log  a[data-action="downloadOrder"]').on(
      "click",
      lfb_downloadOrder
    );
    $('#lfb_navBar_log  a[data-action="returnOrders"]').on(
      "click",
      lfb_returnToOrdersList
    );
  }

  function lfb_initVariablesToolbar() {
    $('#lfb_navBar_variables a[data-action="addNewVariable"]').on(
      "click",
      lfb_addNewVariable
    );
    $('#lfb_navBar_variables a[data-action="returnToForm"]').on(
      "click",
      lfb_closeFormVariables
    );
  }

  function lfb_initFormsTopBtns() {
    $('#lfb_editFormNavbar a[data-action="addFormStep"]')
      .unbind("click")
      .on("click", function () {
        lfb_addStep(lfb_data.texts["My step"]);
      });
    $('#lfb_editFormNavbar a[data-action="shortcodesInfos"]')
      .unbind("click")
      .on("click", function () {
        lfb_showShortcodeWin(lfb_currentFormID);
      });
    $('#lfb_editFormNavbar a[data-action="viewFormLogs"]')
      .unbind("click")
      .on("click", function () {
        $("#lfb_innerLoader").fadeOut();

        $(this)
          .closest("#lfb_editFormNavbar")
          .find(".active")
          .removeClass("active");
        $(this).addClass("active");
        lfb_loadLogs(lfb_currentFormID);
      });
    $('#lfb_editFormNavbar a[data-action="viewFormCharts"]')
      .unbind("click")
      .on("click", function () {
        $("#lfb_innerLoader").fadeOut();
        lfb_showLoader();

        $(this)
          .closest("#lfb_editFormNavbar")
          .find(".active")
          .removeClass("active");
        $(this).addClass("active");
        lfb_loadCharts(lfb_currentFormID);

        $("#lfb_panelFormsList").hide();

        $(".lfb_mainNavBar").hide();
        $("#lfb_navBar_charts").show();
      });
    $('#lfb_editFormNavbar a[data-action="viewFormVariables"]')
      .unbind("click")
      .on("click", function () {
        $("#lfb_innerLoader").fadeOut();

        $(this)
          .closest("#lfb_editFormNavbar")
          .find(".active")
          .removeClass("active");
        $(this).addClass("active");
        lfb_viewFormVariables();
      });
    $("#lfb_btnRemoveAllSteps")
      .unbind("click")
      .on("click", function () {
        showModal($("#modal_removeAllSteps"));
      });
  }

  function lfb_formUseCaptchaChange() {
    if ($("#lfb_formFields").find('[name="useCaptcha"]').is(":checked")) {
      $("#lfb_formFields")
        .find('[name="recaptcha3Key"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_formFields")
        .find('[name="recaptcha3KeySecret"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_formFields")
        .find('[name="recaptcha3Key"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_formFields")
        .find('[name="recaptcha3KeySecret"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_formShowStepsChange() {
    if (
      $('#lfb_formFields [name="showSteps"]').val() == "0" &&
      $('#lfb_formFields [name="isSubscription"]').is(":checked")
    ) {
      $('#lfb_formFields [name="progressBarPriceType"]').parent().slideDown();
    } else {
      $('#lfb_formFields [name="progressBarPriceType"]').parent().slideUp();
    }
  }

  function lfb_formDisableGreyFx() {
    if (!$("#lfb_formFields").find('[name="disableGrayFx"]').is(":checked")) {
      $("#lfb_formFields")
        .find('[name="inverseGrayFx"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_formFields")
        .find('[name="inverseGrayFx"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_formZapierChange() {
    if ($("#lfb_formFields").find('[name="enableZapier"]').is(":checked")) {
      $("#lfb_formFields")
        .find('[name="zapierWebHook"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_formFields")
        .find('[name="zapierWebHook"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeSendUrlVariables() {
    if ($("#lfb_formFields").find('[name="sendUrlVariables"]').is(":checked")) {
      $("#lfb_formFields")
        .find('[name="sendVariablesMethod"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winEditVariable")
        .find('[name="sendAsGet"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_formFields")
        .find('[name="sendVariablesMethod"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winEditVariable")
        .find('[name="sendAsGet"]')
        .closest(".form-group")
        .slideUp();
    }
  }
  function lfb_changeDontStoreOrders() {
    if ($('#lfb_formFields [name="dontStoreOrders"]').is(":checked")) {
      $('#lfb_formFields [name="enableCustomersData"]')
        .parent()
        .bootstrapSwitch("setState", false);
      lfb_changeEnableCustomerData();
    }
  }
  function lfb_changeEnableCustomerData() {
    if ($('#lfb_formFields [name="enableCustomersData"]').is(":checked")) {

      $('#lfb_formFields [name="verifyEmail"]').parent()
      .bootstrapSwitch("setState", true);
      $('#lfb_formFields [name="verifyEmail"]').closest('.has-switch').addClass('deactivate');

      $('#lfb_formFields [name="customersDataEmailLink"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="email_toUser"]')
        .parent()
        .bootstrapSwitch("setState", true);
      $('#lfb_formFields [name="email_toUser"]')
        .parent()
        .parent()
        .addClass("deactivate");
      $("#alertCustomerData").slideDown();
      $('#lfb_formFields [name="email_toUser"]')
        .closest(".switch.has-switch")
        .attr("title", lfb_data.texts["userEmailTipDisabled"])
        .tooltip("update");
    } else {
      
      $('#lfb_formFields [name="verifyEmail"]').closest('.has-switch').removeClass('deactivate');
      $("#lfb_gdprSettings").slideUp();
      $('#lfb_formFields [name="customersDataEmailLink"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="email_toUser"]')
        .parent()
        .parent()
        .removeClass("deactivate");
      $('#lfb_formFields [name="email_toUser"]')
        .closest(".switch.has-switch")
        .attr("title", lfb_data.texts["userEmailTip"])
        .tooltip("update");
      $("#alertCustomerData").slideUp();
    }
  }

  function lfb_changeSendPdfUser() {
    if (
      $('#lfb_formFields [name="sendPdfCustomer"]').is(":checked") ||
      $('#lfb_formFields [name="enablePdfDownload"]').is(":checked")
    ) {
      $("#lfb_pdfTemplateUserContainer").slideDown();
    } else {
      $("#lfb_pdfTemplateUserContainer").slideUp();
    }
  }

  function lfb_changeSendPdfAdmin() {
    if ($('#lfb_formFields [name="sendPdfAdmin"]').is(":checked")) {
      $("#lfb_pdfTemplateAdminContainer").slideDown();
    } else {
      $("#lfb_pdfTemplateAdminContainer").slideUp();
    }
  }

  function lfb_changeSaveForLater() {
    if ($('#lfb_formFields [name="enableSaveForLaterBtn"]').is(":checked")) {
      $('#lfb_formFields [name="saveForLaterLabel"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="saveForLaterDelLabel"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="saveForLaterIcon"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="saveForLaterLabel"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="saveForLaterDelLabel"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="saveForLaterIcon"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeSendEmailLastStep() {
    var chkPossible = true;
    if (
      $('#lfb_formFields [name="use_paypal"]').is(":checked") ||
      $('#lfb_formFields [name="use_stripe"]').is(":checked") ||
      $('#lfb_formFields [name="use_razorpay"]').is(":checked") ||
      $('#lfb_formFields [name="legalNoticeEnable"]').is(":checked") ||
      $('#lfb_formFields [name="useCoupons"]').is(":checked")
    ) {
      chkPossible = false;
    }
    if (chkPossible) {
      jQuery.each(lfb_currentForm.fields, function () {
        var item = this;
        if (
          item.type != "richtext" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row"
        ) {
          if (
            item.isHidden == "0" ||
            item.isRequired == "1" ||
            item.validation != ""
          ) {
            chkPossible = false;
          }
        }
      });
    }
    if (chkPossible) {
      $('#lfb_formFields [name="sendEmailLastStep"]')
        .closest(".switch.has-switch")
        .removeClass("deactivate");
    } else {
      $('#lfb_formFields [name="sendEmailLastStep"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="sendEmailLastStep"]')
        .closest(".switch.has-switch")
        .addClass("deactivate");
    }
  }

  function lfb_changeSummaryHidePrices() {
    if ($('#lfb_formFields [name="summary_hidePrices"]').is(":checked")) {
      $('#lfb_formFields [name="floatSummary_hidePrices"]')
        .parent()
        .bootstrapSwitch("setState", true);
      $('#lfb_formFields [name="floatSummary_hidePrices"]')
        .closest(".form-group")
        .slideUp();
    } else {
      $('#lfb_formFields [name="floatSummary_hidePrices"]')
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_changeEnableFloatingSummary() {
    if ($('#lfb_formFields [name="enableFloatingSummary"]').is(":checked")) {
      $('#lfb_formFields [name="floatSummary_label"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="floatSummary_icon"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="floatSummary_numSteps"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="floatSummary_hidePrices"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="floatSummary_showInfo"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="floatSummary_label"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="floatSummary_icon"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="floatSummary_numSteps"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="floatSummary_hidePrices"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="floatSummary_showInfo"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeSummaryPriceShow() {
    if (
      $('#lfb_formFields [name="summary_hidePrices"]').is(":checked") ||
      $('#lfb_formFields [name="summary_hideTotal"]').is(":checked")
    ) {
      $('#lfb_formFields [name="summary_showAllPricesEmail"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="summary_showAllPricesEmail"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changePaypalPayMode() {
    if (
      $('#lfb_formFields [name="use_paypal"]').is(":checked") &&
      !$('#lfb_formFields [name="isSubscription"]').is(":checked")
    ) {
      $('#lfb_formFields [name="paypal_payMode"]')
        .closest(".form-group")
        .slideDown();
      if ($('#lfb_formFields [name="paypal_payMode"]').val() == "") {
        $('#lfb_formFields [name="paypal_fixedToPay"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_formFields [name="percentToPay"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $('#lfb_formFields [name="paypal_payMode"]').val() == "fixed"
      ) {
        $('#lfb_formFields [name="paypal_fixedToPay"]')
          .closest(".form-group")
          .slideDown();
        $('#lfb_formFields [name="percentToPay"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $('#lfb_formFields [name="paypal_payMode"]').val() == "percent"
      ) {
        $('#lfb_formFields [name="paypal_fixedToPay"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_formFields [name="percentToPay"]')
          .closest(".form-group")
          .slideDown();
      }
    } else {
      $('#lfb_formFields [name="paypal_payMode"]').val("");
      $('#lfb_formFields [name="paypal_payMode"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="paypal_fixedToPay"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="percentToPay"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeRazorpayPayMode() {
    if (
      $('#lfb_formFields [name="use_razorpay"]').is(":checked") &&
      !$('#lfb_formFields [name="isSubscription"]').is(":checked")
    ) {
      $('#lfb_formFields [name="razorpay_payMode"]')
        .closest(".form-group")
        .slideDown();
      if ($('#lfb_formFields [name="razorpay_payMode"]').val() == "") {
        $('#lfb_formFields [name="razorpay_fixedToPay"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_formFields [name="razorpay_percentToPay"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $('#lfb_formFields [name="razorpay_payMode"]').val() == "fixed"
      ) {
        $('#lfb_formFields [name="razorpay_fixedToPay"]')
          .closest(".form-group")
          .slideDown();
        $('#lfb_formFields [name="razorpay_percentToPay"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $('#lfb_formFields [name="razorpay_payMode"]').val() == "percent"
      ) {
        $('#lfb_formFields [name="razorpay_fixedToPay"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_formFields [name="razorpay_percentToPay"]')
          .closest(".form-group")
          .slideDown();
      }
    } else {
      $('#lfb_formFields [name="razorpay_payMode"]').val("");
      $('#lfb_formFields [name="razorpay_payMode"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="razorpay_fixedToPay"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="razorpay_percentToPay"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeStripePayMode() {
    if (
      $('#lfb_formFields [name="use_stripe"]').is(":checked") &&
      !$('#lfb_formFields [name="isSubscription"]').is(":checked")
    ) {
      $('#lfb_formFields [name="stripe_payMode"]')
        .closest(".form-group")
        .slideDown();
      if ($('#lfb_formFields [name="stripe_payMode"]').val() == "") {
        $('#lfb_formFields [name="stripe_fixedToPay"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_formFields [name="stripe_percentToPay"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $('#lfb_formFields [name="stripe_payMode"]').val() == "fixed"
      ) {
        $('#lfb_formFields [name="stripe_fixedToPay"]')
          .closest(".form-group")
          .slideDown();
        $('#lfb_formFields [name="stripe_percentToPay"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $('#lfb_formFields [name="stripe_payMode"]').val() == "percent"
      ) {
        $('#lfb_formFields [name="stripe_fixedToPay"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_formFields [name="stripe_percentToPay"]')
          .closest(".form-group")
          .slideDown();
      }
    } else {
      $('#lfb_formFields [name="stripe_payMode"]').val("");
      $('#lfb_formFields [name="stripe_payMode"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="stripe_fixedToPay"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="stripe_percentToPay"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_previousStepBtnChange() {
    if ($('#lfb_formFields [name="previousStepBtn"]').is(":checked")) {
      $('#lfb_formFields [name="previousStepButtonIcon"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="previousStepButtonIcon"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_formDistanceAsQtChange() {
    if ($('#lfb_winItem [name="useDistanceAsQt"]').is(":checked")) {
      $("#lfb_winItem #lfb_distanceQtContainer").slideDown();
    } else {
      $("#lfb_winItem #lfb_distanceQtContainer").slideUp();
    }
  }

  function lfb_changeUseRedirs() {
    if ($('#lfb_formFields [name="useRedirectionConditions"]').is(":checked")) {
      $("#lfb_formFields #lfb_redirConditionsContainer").slideDown();
    } else {
      $("#lfb_formFields #lfb_redirConditionsContainer").slideUp();
    }
  }

  function lfb_disableScrollChange() {
    if ($('#lfb_formFields [name="disableScroll"]').is(":checked")) {
      $('#lfb_formFields [name="scrollTopPage"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="scrollTopMargin"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="scrollTopMarginMobile"]')
        .closest(".form-group")
        .slideUp();
    } else {
      //$('#lfb_formFields [name="scrollTopPage"]').parent().bootstrapSwitch('setState', false);
      $('#lfb_formFields [name="scrollTopPage"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="scrollTopMargin"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="scrollTopMarginMobile"]')
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_scrollTopPageChange() {
    if ($('#lfb_formFields [name="scrollTopPage"]').is(":checked")) {
      $('#lfb_formFields [name="scrollTopMargin"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="scrollTopMarginMobile"]')
        .closest(".form-group")
        .slideUp();
    } else {
      $('#lfb_formFields [name="scrollTopMargin"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="scrollTopMarginMobile"]')
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_useGoogleFontChange() {
    if ($('#lfb_formFields [name="useGoogleFont"]').is(":checked")) {
      $('#lfb_formFields [name="googleFontName"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="googleFontName"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeMailchimp() {
    if ($('#lfb_formFields [name="useMailchimp"]').is(":checked")) {
      $('#lfb_formFields [name="mailchimpKey"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="mailchimpList"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="mailchimpOptin"]')
        .closest(".form-group")
        .slideDown();

      lfb_changeMailchimpList();
    } else {
      $('#lfb_formFields [name="mailchimpKey"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="mailchimpList"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="mailchimpOptin"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeMailpoet() {
    if ($('#lfb_formFields [name="useMailpoet"]').is(":checked")) {
      $('#lfb_formFields [name="mailPoetList"]')
        .closest(".form-group")
        .slideDown();
      lfb_changeMailpoetList();
    } else {
      $('#lfb_formFields [name="mailPoetList"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeGetResponse() {
    if ($('#lfb_formFields [name="useGetResponse"]').is(":checked")) {
      $('#lfb_formFields [name="getResponseKey"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="getResponseList"]')
        .closest(".form-group")
        .slideDown();
      lfb_changeGetResponseList();
    } else {
      $('#lfb_formFields [name="getResponseKey"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="getResponseList"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeMailchimpList() {
    $('#lfb_formFields [name="mailchimpList"] option').remove();
    var apiKey = $('#lfb_formFields [name="mailchimpKey"]').val();
    var serverPrefix = $('#lfb_formFields [name="mailchimpServer"]').val();
    if (apiKey != "" && serverPrefix != "") {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_getMailchimpLists",
          apiKey: apiKey,
          serverPrefix: serverPrefix,
        },
        success: function (rep) {
          $('#lfb_formFields [name="mailchimpList"]').html(rep);
          if (
            $(
              '#lfb_formFields [name="mailchimpList"] option[value="' +
                $('#lfb_tabSettings [name="mailchimpList"]').attr(
                  "data-initial"
                ) +
                '"]'
            ).length > 0
          ) {
            $('#lfb_formFields [name="mailchimpList"]').val(
              $('#lfb_tabSettings [name="mailchimpList"]').attr("data-initial")
            );
          }
          if (lfb_currentForm != false) {
            $('#lfb_formFields [name="mailchimpList"]').val(
              lfb_currentForm.form.mailchimpList
            );
          }
        },
      });
    }
  }

  function lfb_changeMailpoetList() {
    $('#lfb_formFields [name="mailPoetList"] option').remove();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_getMailpoetLists",
      },
      success: function (rep) {
        $('#lfb_formFields [name="mailPoetList"]').html(rep);
        if (
          $(
            '#lfb_formFields [name="mailPoetList"] option[value="' +
              $('#lfb_tabSettings [name="mailPoetList"]').attr("data-initial") +
              '"]'
          ).length > 0
        ) {
          $('#lfb_formFields [name="mailPoetList"]').val(
            $('#lfb_tabSettings [name="mailPoetList"]').attr("data-initial")
          );
        }
        if (lfb_currentForm != false) {
          $('#lfb_formFields [name="mailPoetList"]').val(
            lfb_currentForm.form.mailPoetList
          );
        }
      },
    });
  }

  function lfb_changeGetResponseList() {
    var apiKey = $('#lfb_formFields [name="getResponseKey"]').val();
    $('#lfb_tabSettings [name="getResponseList"] option').remove();
    if (apiKey != "") {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_getGetResponseLists",
          apiKey: apiKey,
        },
        success: function (rep) {
          $('#lfb_formFields [name="getResponseList"]').html(rep);
          if (
            $(
              '#lfb_formFields [name="getResponseList"] option[value="' +
                $('#lfb_tabSettings [name="getResponseList"]').attr(
                  "data-initial"
                ) +
                '"]'
            ).length > 0
          ) {
            $('#lfb_formFields [name="getResponseList"]').val(
              $('#lfb_tabSettings [name="getResponseList"]').attr(
                "data-initial"
              )
            );
          }
          if (lfb_currentForm != false) {
            $('#lfb_formFields [name="getResponseList"]').val(
              lfb_currentForm.form.getResponseList
            );
          }
        },
      });
    }
  }

  function lfb_formUseCouponsChange() {
    if ($('#lfb_formFields [name="useCoupons"]').is(":checked")) {
      $("#lfb_formFields .lfb_couponsContainer").slideDown();
    } else {
      $("#lfb_formFields .lfb_couponsContainer").slideUp();
    }
    lfb_changeSendEmailLastStep();
  }

  function lfb_formUseIntroChange() {
    if ($('#lfb_formFields [name="intro_enabled"]').is(":checked")) {
      $('#lfb_formFields [name="intro_title"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="intro_text"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="intro_btn"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="introButtonIcon"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="intro_title"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="intro_text"]').closest(".form-group").slideUp();
      $('#lfb_formFields [name="intro_btn"]').closest(".form-group").slideUp();
      $('#lfb_formFields [name="introButtonIcon"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_formIsSubscriptionChange() {
    if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
      $('#lfb_formFields [name="subscription_text"]').parent().slideDown();
      if ($('#lfb_formFields [name="showSteps"]').val() == 0) {
        $('#lfb_formFields [name="progressBarPriceType"]').parent().slideDown();
      }

      $('#lfb_formFields [name="totalIsRange"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="paypal_payMode"]').parent().slideUp();
      $('#lfb_formFields [name="paypal_payMode"]').val("");
      $('#lfb_formFields [name="stripe_payMode"]').parent().slideUp();
      $('#lfb_formFields [name="stripe_payMode"]').val("");
      $('#lfb_formFields [name="razorpay_payMode"]').parent().slideUp();
      $('#lfb_formFields [name="razorpay_payMode"]').val("");
      if ($('#lfb_formFields [name="use_paypal"]').is(":checked")) {
        $('#lfb_formFields [name="paypal_subsFrequency"]').parent().slideDown();
        $('#lfb_formFields [name="paypal_subsMaxPayments"]')
          .parent()
          .slideDown();
        $('#lfb_formFields [name="percentToPay"]').parent().slideUp();
      }
      if ($('#lfb_formFields [name="use_stripe"]').is(":checked")) {
        $('#lfb_formFields [name="stripe_subsFrequencyType"]')
          .parent()
          .slideDown();
      }
      if ($('#lfb_formFields [name="use_razorpay"]').is(":checked")) {
        $('#lfb_formFields [name="razorpay_subsFrequencyType"]')
          .parent()
          .slideDown();
      }
      $("#lfb_winItem")
        .find('[name="priceMode"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="subscription_text"]').parent().slideUp();
      $('#lfb_formFields [name="progressBarPriceType"]').parent().slideUp();
      $('#lfb_formFields [name="paypal_subsFrequency"]').parent().slideUp();
      $('#lfb_formFields [name="paypal_subsMaxPayments"]').parent().slideUp();
      $('#lfb_formFields [name="stripe_subsFrequencyType"]').parent().slideUp();
      $('#lfb_formFields [name="razorpay_subsFrequencyType"]')
        .parent()
        .slideUp();
      if ($('#lfb_formFields [name="use_paypal"]').is(":checked")) {
      }

      $("#lfb_winItem").find('[name="priceMode"]').val("");
      $("#lfb_winItem")
        .find('[name="priceMode"]')
        .closest(".form-group")
        .slideUp();
    }
    lfb_changePaypalPayMode();
    lfb_changeStripePayMode();
  }

  function lfb_formUseSummaryChange() {
    if ($('#lfb_formFields [name="useSummary"]').is(":checked")) {
      $('#lfb_formFields [name="summary_title"]').parent().slideDown();
    } else {
      $('#lfb_formFields [name="summary_title"]').parent().slideUp();
    }
  }

  function lfb_formUseVATChange() {
    if ($('#lfb_formFields [name="useVAT"]').is(":checked")) {
      $('#lfb_formFields [name="vatLabel"]').parent().slideDown();
      $('#lfb_formFields [name="vatAmount"]').parent().slideDown();
    } else {
      $('#lfb_formFields [name="legalNoticeTitle"]').parent().slideUp();
      $('#lfb_formFields [name="vatLabel"]').parent().slideUp();
      $('#lfb_formFields [name="vatAmount"]').parent().slideUp();
    }
  }

  function lfb_formLegalNoticeChange() {
    if ($('#lfb_formFields [name="legalNoticeEnable"]').is(":checked")) {
      $('#lfb_formFields [name="legalNoticeTitle"]').parent().slideDown();
      $("#lfb_formFields #lfb_legalNoticeContent")
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="legalNoticeTitle"]').parent().slideUp();
      $("#lfb_formFields #lfb_legalNoticeContent")
        .closest(".form-group")
        .slideUp();
    }
    lfb_changeSendEmailLastStep();
  }

  function lfb_totalIsRangeChange() {
    if ($('#lfb_formFields [name="totalIsRange"]').is(":checked")) {
      $('#lfb_formFields [name="use_paypal"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="use_stripe"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="isSubscription"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="save_to_cart"]')
        .parent()
        .bootstrapSwitch("setState", false);
      if ($('#lfb_formFields select[name="gravityFormID"]').val() > 0) {
        $('#lfb_formFields select[name="gravityFormID"]').val("0");
      }
      $('#lfb_formFields [name="totalRangeMode"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="totalRange"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="totalRange"]').closest(".form-group").slideUp();
      $('#lfb_formFields [name="totalRangeMode"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_totalRangeModeChange() {
    if ($('#lfb_formFields [name="totalRangeMode"]').val() == "") {
      $("#lfb_totalRangeLabelFixed").show();
      $("#lfb_totalRangeLabelPercent").hide();
    } else {
      $("#lfb_totalRangeLabelFixed").hide();
      $("#lfb_totalRangeLabelPercent").show();
    }
  }

  function lfb_formPaypalChange() {
    if ($('#lfb_formFields [name="use_paypal"]').is(":checked")) {
      $("#paypalFieldsCt").addClass("lfb_displayed");
      $("#lfb_formPaypal").slideDown();
      $('#lfb_formFields [name="totalIsRange"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="save_to_cart"]')
        .parent()
        .bootstrapSwitch("setState", false, true);
      $('#lfb_formFields [name="save_to_cart_edd"]')
        .parent()
        .bootstrapSwitch("setState", false, true);
      if ($('#lfb_formFields select[name="gravityFormID"]').val() > 0) {
        $('#lfb_formFields select[name="gravityFormID"]').val("0");
      }
      lfb_formIpnChange();
      lfb_changePaypalPayMode();
    } else {
      $("#paypalFieldsCt").removeClass("lfb_displayed");
      $("#lfb_formPaypal").slideUp();
      if (
        !$('#lfb_formFields [name="use_stripe"]').is(":checked") &&
        !$('#lfb_formFields [name="totalIsRange"]').is(":checked")
      ) {
        $("#lfb_formFields h4.lfb_wooOption").slideDown();
        $('#lfb_formFields [name="save_to_cart"]')
          .closest(".form-group")
          .slideDown();
        $('#lfb_formFields [name="save_to_cart_edd"]')
          .closest(".form-group")
          .slideDown();
      }
    }
    lfb_formIsSubscriptionChange();
    lfb_updatePaymentType();
  }

  function lfb_updatePaymentType() {
    if (
      ($('#lfb_formFields [name="use_paypal"]').is(":checked") &&
        $('#lfb_formFields [name="paypal_useIpn"]').is(":checked")) ||
      ($('#lfb_formFields [name="use_stripe"]').is(":checked") &&
        !$('#lfb_formFields [name="use_paypal"]').is(":checked")) ||
      ($('#lfb_formFields [name="use_razorpay"]').is(":checked") &&
        !$('#lfb_formFields [name="use_paypal"]').is(":checked"))
    ) {
      $('#lfb_formFields [name="paymentType"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="txt_payFormFinalTxt"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_formFields [name="paymentType"]').val("form");
      $('#lfb_formFields [name="paymentType"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="txt_payFormFinalTxt"]')
        .closest(".form-group")
        .slideUp();
    }
    lfb_updateEmailPaymentType();
    lfb_changeSendEmailLastStep();
  }

  function lfb_updateEmailPaymentType() {
    if (
      ($('#lfb_formFields [name="use_paypal"]').is(":checked") &&
        $('#lfb_formFields [name="paypal_useIpn"]').is(":checked")) ||
      $('#lfb_formFields [name="use_stripe"]').is(":checked")
    ) {
      if ($('#lfb_formFields [name="paymentType"]').val() == "email") {
        $('[name="emailPaymentType"]').closest(".form-group").slideDown();
      } else {
        $('[name="emailPaymentType"]').closest(".form-group").slideUp();
      }
    } else {
      $('[name="emailPaymentType"]').closest(".form-group").slideUp();
    }
  }

  function lfb_formRazorPayChange() {
    if ($('#lfb_formFields [name="use_razorpay"]').is(":checked")) {
      $("#razorpayFieldsCt").addClass("lfb_displayed");
      $('.lfb_razorpayField:not([name="razorpay_percentToPay"])').slideDown();
      $('#lfb_formFields [name="totalIsRange"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="save_to_cart"]')
        .parent()
        .bootstrapSwitch("setState", false);
      if ($('#lfb_formFields select[name="gravityFormID"]').val() > 0) {
        $('#lfb_formFields select[name="gravityFormID"]').val("0");
      }
    } else {
      $(".lfb_razorpayField").slideUp();
      $("#razorpayFieldsCt").removeClass("lfb_displayed");
      if (
        !$('#lfb_formFields [name="use_paypal"]').is(":checked") &&
        !$('#lfb_formFields [name="totalIsRange"]').is(":checked")
      ) {
        $("#lfb_formFields .lfb_wooOption").slideDown();
      }
    }

    lfb_formIsSubscriptionChange();
    lfb_updatePaymentType();
  }

  function lfb_formStripeChange() {
    if ($('#lfb_formFields [name="use_stripe"]').is(":checked")) {
      $("#stripeFieldsCt").addClass("lfb_displayed");
      $('.lfb_stripeField:not([name="stripe_percentToPay"])').slideDown();
      $('#lfb_formFields [name="totalIsRange"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="save_to_cart"]')
        .parent()
        .bootstrapSwitch("setState", false);
      if ($('#lfb_formFields select[name="gravityFormID"]').val() > 0) {
        $('#lfb_formFields select[name="gravityFormID"]').val("0");
      }

      $("#lfb_formFields .lfb_wooOption").slideUp();
      lfb_changeStripePayMode();
    } else {
      $("#stripeFieldsCt").removeClass("lfb_displayed");

      $(".lfb_stripeField").slideUp();
      if (
        !$('#lfb_formFields [name="use_paypal"]').is(":checked") &&
        !$('#lfb_formFields [name="totalIsRange"]').is(":checked")
      ) {
        $("#lfb_formFields .lfb_wooOption").slideDown();
      }
    }
    lfb_formIsSubscriptionChange();
    lfb_updatePaymentType();
  }

  function lfb_chartsTypeChange() {
    if ($("#lfb_chartsTypeSelect").val() == "month") {
      $("#lfb_panelCharts #lfb_chartsMonth").slideDown();
      $("#lfb_panelCharts #lfb_chartsYear").slideUp();
    } else if ($("#lfb_chartsTypeSelect").val() == "year") {
      $("#lfb_panelCharts #lfb_chartsMonth").slideUp();
      $("#lfb_panelCharts #lfb_chartsYear").slideDown();
    } else {
      $("#lfb_panelCharts #lfb_chartsMonth").slideUp();
      $("#lfb_panelCharts #lfb_chartsYear").slideUp();
    }
    if ($("#lfb_panelCharts").css("display") == "block") {
      lfb_loadCharts($("#lfb_panelCharts").attr("data-formid"));
    }
  }

  function lfb_chartsYearChange() {
    lfb_loadCharts($("#lfb_panelCharts").attr("data-formid"));
  }

  function lfb_chartsMonthChange() {
    lfb_loadCharts($("#lfb_panelCharts").attr("data-formid"));
  }

  function lfb_showShortcodeWin(formID) {
    if (!formID) {
      formID = lfb_currentFormID;
    }

    $('#lfb_winShortcode [name="startStep"]').html("");
    $("#lfb_winShortcode").find("span[data-displayid]").html(formID);
    showModal($("#lfb_winShortcode"));
    $('#lfb_winShortcode [data-display="popup"]').hide();
    $('#lfb_winShortcode [name="display"]').val("").trigger("change");

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_getFormSteps",
        formID: formID,
      },
      success: function (steps) {
        steps = jQuery.parseJSON(steps);
        var startStep = 0;
        var selected = "";
        var defClass = "";
        for (var i = 0; i < steps.length; i++) {
          var step = steps[i];
          selected = "";
          defClass = "";
          if (step.start == 1) {
            startStep = step.id;
            defClass = "default";
            selected = "selected";
          }
          $('#lfb_winShortcode [name="startStep"]').append(
            '<option class="' +
              defClass +
              '" ' +
              selected +
              ' value="' +
              step.id +
              '">' +
              step.title +
              "</option>"
          );
        }
        selected = "";
        defClass = "";
        if (startStep == 0) {
          defClass = "default";
          selected = "selected";
        }

        $('#lfb_winShortcode [name="startStep"]').append(
          '<option class="' +
            defClass +
            '" ' +
            selected +
            ' value="final">' +
            lfb_data.texts["lastStep"] +
            "</option>"
        );
        generateShortcode();
      },
    });
  }

  function lfb_formGravityChange() {
    if ($('#lfb_formFields select[name="gravityFormID"]').val() > 0) {
      $("#lfb_formFields .nav-tabs > li:eq(2)").slideUp();

      $("#lfb_finalStepFields").slideUp();
      $('#lfb_formFields [name="use_paypal"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="use_stripe"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="isSubscription"]')
        .parent()
        .bootstrapSwitch("setState", false);

      $('#lfb_formFields [name="close_url"]').closest(".form-group").slideUp();
      $('#lfb_formFields [name="useRedirectionConditions"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="redirectionDelay"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="useCaptcha"]').closest(".form-group").slideUp();
    } else {
      $("#lfb_finalStepFields").slideDown();
      $("#lfb_formFields .nav-tabs > li:eq(2)").slideDown();
      $('#lfb_formFields [name="close_url"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="useRedirectionConditions"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="redirectionDelay"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="useCaptcha"]')
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_useEmailVerificationChange() {
    if ($('#lfb_formFields [name="useEmailVerification"]').is(":checked")) {
      $("#lfb_emailVerificationContent_editor").slideDown();
    } else {
      $("#lfb_emailVerificationContent_editor").slideUp();
    }
  }

  function lfb_formEmailUserChange() {
    if ($('#lfb_formFields [name="email_toUser"]').is(":checked")) {
      $("#lfb_formEmailUser").slideDown();
    } else {
      $("#lfb_formEmailUser").slideUp();
      $('#lfb_formFields [name="enableCustomersData"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }
  }

  function lfb_formWooChange() {
    if ($('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
      $('#lfb_formFields [name="emptyWooCart"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="wooShowFormTitles"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_formFields [name="sendSummaryToWoo"]')
        .closest(".form-group")
        .slideDown();

      $('#lfb_formFields [name="save_to_cart_edd"]')
        .parent()
        .bootstrapSwitch("setState", false, true);
      $('#lfb_formFields [name="use_paypal"]')
        .parent()
        .bootstrapSwitch("setState", false, true);
    } else if (!$('#lfb_formFields [name="save_to_cart_edd"]').is(":checked")) {
    }
    if (!$('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
      $('#lfb_formFields [name="emptyWooCart"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="emptyWooCart"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="wooShowFormTitles"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="wooShowFormTitles"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_formFields [name="sendSummaryToWoo"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_formEDDChange() {
    if ($('#lfb_formFields [name="save_to_cart_edd"]').is(":checked")) {
      $("#lfb_formFields .lfb_paymentOption").slideUp();
      $('#lfb_formFields [name="save_to_cart"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="use_paypal"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="isSubscription"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="save_to_cart"]')
        .parent()
        .bootstrapSwitch("setState", false);
    } else if (!$('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
      $("#lfb_formFields .lfb_paymentOption").slideDown();
    }
  }

  function lfb_formIpnChange() {
    if ($('#lfb_formFields [name="paypal_useIpn"]').is(":checked")) {
      $("#lfb_infoIpn").slideDown();
    } else {
      $("#lfb_infoIpn").slideUp();
    }
    lfb_updatePaymentType();
  }

  function lfb_getStepByID(stepID) {
    var rep = false;
    jQuery.each(lfb_steps, function (i) {
      if (this.id == stepID) {
        rep = this;
      }
    });
    return rep;
  }

  function lfb_getItemByID(itemID) {
    var rep = false;
    jQuery.each(lfb_currentForm.steps, function () {
      jQuery.each(this.items, function () {
        if (this.id == itemID) {
          rep = this;
        }
      });
    });
    if (!rep) {
      jQuery.each(lfb_currentForm.fields, function () {
        if (this.id == itemID) {
          rep = this;
        }
      });
    }
    return rep;
  }

  function lfb_showLoader(text = "") {
    if (text == "") {
      lfb_loaderText.addClass("lfb_hidden");
    } else {
      lfb_loaderText.removeClass("lfb_hidden");
      lfb_loaderText.html(text);
    }
    $("html,body").animate({ scrollTop: 0 }, 250);
    $("#lfb_loader").fadeIn();
  }

  function lfb_addStep(step) {
    var title = "";
    var startStep = 0;
    if (!step.content) {
      title = step;
    } else {
      title = step.title;
    }

    if (step.id) {
      if (title.length > 40) {
        title = title.substr(0, 37) + " ...";
      }

      $("#lfb_noStepsMsg").removeClass("hidden");
      var newStep = $(
        '<div class="lfb_stepBloc palette palette-clouds"><div class="lfb_stepBlocWrapper"><h4>' +
          title +
          "</h4></div>" +
          '<a href="javascript:" class="lfb_btnEdit" title="' +
          lfb_data.texts["tip_editStep"] +
          '"><span class="fas fa-pencil-alt"></span></a>' +
          '<a href="javascript:" class="lfb_btnSup" title="' +
          lfb_data.texts["tip_delStep"] +
          '"><span class="fas fa-trash"></span></a>' +
          '<a href="javascript:" class="lfb_btnDup" title="' +
          lfb_data.texts["tip_duplicateStep"] +
          '"><span class="far fa-copy"></span></a>' +
          '<a href="javascript:" class="lfb_btnLink" title="' +
          lfb_data.texts["tip_linkStep"] +
          '"><span class="fas fa-link"></span></a>' +
          '<a href="javascript:" class="lfb_btnStart" title="' +
          lfb_data.texts["tip_flagStep"] +
          '"><span class="fas fa-flag"></span></a></div>'
      );
      if (step.content && step.content.start == 1) {
        newStep.find(".lfb_btnStart").addClass("lfb_selected");
        newStep.addClass("lfb_selected");
      }
      if (step.elementID) {
        newStep.attr("id", step.elementID);
      } else {
        newStep.uniqueId();
      }

      newStep.find("a[title]").tooltip({
        container: "#lfb_form",
        placement: "right",
      });
      newStep.on("mouseenter", function () {
        $(this).addClass("lfb_over");
      });
      newStep.on("mouseleave", function () {
        $(this).removeClass("lfb_over");
      });

      newStep.children("a.lfb_btnEdit").on("click", function () {
        if (lfb_currentForm.form.useVisualBuilder == 1) {
          lfb_editVisualStep($(this).parent().attr("data-stepid"));
        } else {
          lfb_openWinStep($(this).parent().attr("data-stepid"));
        }
      });
      newStep.children("a.lfb_btnLink").on("click", function () {
        lfb_startLink($(this).parent().attr("id"));
      });
      newStep.children("a.lfb_btnSup").on("click", function () {
        lfb_askDeleteStep($(this).parent().attr("data-stepid"));
      });
      newStep.children("a.lfb_btnDup").on("click", function () {
        lfb_duplicateStep($(this).parent().attr("data-stepid"));
      });
      newStep.children("a.lfb_btnStart").on("click", function () {
        lfb_showLoader();
        $(".lfb_stepBloc[data-stepid]")
          .find(".lfb_btnStart")
          .removeClass("lfb_selected");
        $(".lfb_stepBloc[data-stepid]")
          .find(".lfb_btnStart")
          .closest(".lfb_stepBloc")
          .removeClass("lfb_selected");
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (
            step.id != $(this).parent().attr("data-stepid") &&
            step.content.start == 1
          ) {
            step.content.start = 0;
            jQuery.ajax({
              url: ajaxurl,
              type: "post",
              data: {
                action: "lfb_saveStep",
                id: step.id,
                start: 0,
                formID: lfb_currentFormID,
                content: JSON.stringify(step.content),
              },
            });
          }
        });

        $(this).addClass("lfb_selected");
        $(this).closest(".lfb_stepBloc").addClass("lfb_selected");
        var currentStep = lfb_getStepByID(
          parseInt($(this).parent().attr("data-stepid"))
        );
        if (typeof currentStep.content == "string") {
          currentStep.content = JSON.parse(currentStep.content);
        }
        currentStep.content.start = 1;
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_saveStep",
            id: step.id,
            start: 1,
            formID: lfb_currentFormID,
            content: JSON.stringify(currentStep.content),
          },
          success: function () {
            lfb_loadForm(lfb_currentFormID);
          },
        });
      });

      newStep.draggable({
        containment: "parent",
        handle: ".lfb_stepBlocWrapper",
        start: function () {
          $("#lfb_stepsContainer .lfb_linkPoint").hide();
        },
        drag: function () {
          if (lfb_disableLinksAnim) {
            lfb_updateStepCanvas();
          }
        },
        stop: function () {
          lfb_repositionLinks();
          $("#lfb_stepsContainer .lfb_linkPoint").show();
          if (lfb_disableLinksAnim) {
            lfb_updateStepCanvas();
          }
        },
      });
      newStep.children(".lfb_stepBlocWrapper").on("click", function () {
        if (lfb_isLinking) {
          lfb_stopLink(newStep);
        }
      });
      var posX = 10,
        posY = 10;
      if (step.content && step.content.previewPosX) {
        posX = step.content.previewPosX;
        posY = step.content.previewPosY;
      } else {
        posX =
          $("#lfb_stepsOverflow").scrollLeft() +
          $("#lfb_stepsOverflow").width() / 2 -
          64;
        posY =
          $("#lfb_stepsOverflow").scrollTop() +
          $("#lfb_stepsOverflow").height() / 2 -
          64;
      }
      newStep.hide();
      $("#lfb_stepsContainer").append(newStep);
      newStep.css({
        left: posX + "px",
        top: posY + "px",
      });

      newStep.fadeIn();
      setTimeout(lfb_updateStepsDesign, 250);
      if ($("#lfb_stepsContainer .lfb_stepBloc").length == 0) {
        startStep = 1;
      }

      newStep.attr("data-stepid", step.id);
      if (lfb_lastCreatedStepID == step.id) {
        setTimeout(function () {
          lfb_linkLightStep(step.id);
        }, 500);
      }
    } else {
      var newStep = $("<div></div>");
      newStep.uniqueId();

      var randomX = Math.floor(Math.random() * 240);
      if (Math.random() > 0.5) {
        randomX = 0 - randomX;
      }
      var randomY = Math.floor(Math.random() * 80);
      if (Math.random() > 0.5) {
        randomY = 0 - randomY;
      }

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_addStep",
          elementID: newStep.attr("id"),
          formID: lfb_currentFormID,
          start: startStep,
          previewPosX:
            $("#lfb_stepsOverflow").scrollLeft() +
            $("#lfb_stepsOverflow").width() / 2 -
            randomX,
          previewPosY:
            $("#lfb_stepsOverflow").scrollTop() +
            $("#lfb_stepsOverflow").height() / 2 -
            randomY,
        },
        success: function (step) {
          step = jQuery.parseJSON(step);
          if (jQuery.inArray(step.id, lfb_steps) == -1) {
            lfb_lastCreatedStepID = step.id;
            lfb_showLoader();
            lfb_loadForm(lfb_currentFormID);
          }
        },
      });
    }
  }

  function lfb_removeStep(stepID) {
    var i = 0;

    $('.lfb_stepBloc[data-stepid="' + stepID + '"]').remove();
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeStep",
        stepID: stepID,
      },
      success: function () {
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_loadForm",
            formID: lfb_currentFormID,
          },
          success: function (rep) {
            rep = JSON.parse(rep);
            lfb_currentForm = rep;
            lfb_params = rep.params;
            lfb_steps = rep.steps;

            jQuery.each(rep.links, function (index) {
              var link = this;
              link.originID = $(
                '.lfb_stepBloc[data-stepid="' + link.originID + '"]'
              ).attr("id");
              link.destinationID = $(
                '.lfb_stepBloc[data-stepid="' + link.destinationID + '"]'
              ).attr("id");
              link.conditions = JSON.parse(link.conditions);
              lfb_links[index] = link;
            });
            lfb_repositionLinks();
            lfb_updateLastStepTab();
            if (lfb_steps.length > 0) {
              $("#lfb_noStepsMsg").addClass("hidden");
            } else {
              $("#lfb_noStepsMsg").removeClass("hidden");
            }
          },
        });
      },
    });
  }

  function lfb_updateStepsDesign() {
    $("#lfb_stepsCanvas").attr("width", $("#lfb_stepsContainer").outerWidth());
    $("#lfb_stepsCanvas").attr(
      "height",
      $("#lfb_stepsContainer").outerHeight()
    );
    $("#lfb_stepsCanvas").css({
      width: $("#lfb_stepsContainer").outerWidth(),
      height: $("#lfb_stepsContainer").outerHeight(),
    });
    $(".lfb_stepBloc > .lfb_stepBlocWrapper > h4").each(function () {
      $(this).css("margin-top", 0 - $(this).height() / 2);
    });
  }

  function lfb_repositionLinkPoints(linkIndexes) {
    var checkedLinks = new Array();

    $(".lfb_linkPoint").each(function () {
      var check = true;
      var index = $(this).attr("data-linkindex");
      if (lfb_links.length >= index) {
        if (
          typeof lfb_links[index] != "undefined" &&
          typeof lfb_links[index].id != "undefined" &&
          lfb_links[index].id != $(this).attr("data-linkid")
        ) {
          check = false;
        }
      } else {
        check = false;
      }
    });

    jQuery.each(linkIndexes, function () {
      var linkIndex = this;
      var link = lfb_links[linkIndex];
      if (
        $("#" + link.originID).length > 0 &&
        $("#" + link.destinationID).length > 0
      ) {
        checkedLinks.push(link);

        var originLeft =
          $("#" + link.originID).offset().left -
          $("#lfb_stepsContainer").offset().left +
          $("#" + link.originID).width() / 2;
        var originTop =
          $("#" + link.originID).offset().top -
          $("#lfb_stepsContainer").offset().top +
          $("#" + link.originID).height() / 2;
        var destinationLeft =
          $("#" + link.destinationID).offset().left -
          $("#lfb_stepsContainer").offset().left +
          $("#" + link.destinationID).width() / 2;
        var destinationTop =
          $("#" + link.destinationID).offset().top -
          $("#lfb_stepsContainer").offset().top +
          $("#" + link.destinationID).height() / 2;

        var dx = destinationLeft - originLeft;

        var bezierPos = getBezierXY(
          0.5,
          originLeft,
          originTop,
          originLeft + dx * 0.33,
          originTop,
          originLeft + dx * 0.67,
          destinationTop,
          destinationLeft,
          destinationTop
        );

        jQuery.each(checkedLinks, function (i) {
          if (
            this.originID == link.destinationID &&
            this.destinationID == link.originID &&
            i < linkIndex
          ) {
            bezierPos.x += 15;
            bezierPos.y += 15;
          }
        });

        $('.lfb_linkPoint[data-linkindex="' + linkIndex + '"]').css({
          left: bezierPos.x + "px",
          top: bezierPos.y + "px",
        });
      }
    });
  }

  function lfb_repositionLinkPoint(linkIndex) {
    var link = lfb_links[linkIndex];
    var originLeft =
      $("#" + link.originID).offset().left -
      $("#lfb_stepsContainer").offset().left +
      $("#" + link.originID).width() / 2;
    var originTop =
      $("#" + link.originID).offset().top -
      $("#lfb_stepsContainer").offset().top +
      $("#" + link.originID).height() / 2;
    var destinationLeft =
      $("#" + link.destinationID).offset().left -
      $("#lfb_stepsContainer").offset().left +
      $("#" + link.destinationID).width() / 2;
    var destinationTop =
      $("#" + link.destinationID).offset().top -
      $("#lfb_stepsContainer").offset().top +
      $("#" + link.destinationID).height() / 2;
    var posX = originLeft + (destinationLeft - originLeft) / 2;
    var posY = originTop + (destinationTop - originTop) / 2;

    jQuery.each(lfb_links, function (i) {
      if (
        this.originID == link.destinationID &&
        this.destinationID == link.originID &&
        i < linkIndex
      ) {
        posX += 15;
        posY += 15;
      }
    });
    $('.lfb_linkPoint[data-linkindex="' + linkIndex + '"]').css({
      left: posX + "px",
      top: posY + "px",
    });
  }

  function lfb_loadSettings() {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_loadSettings",
      },
      success: function (rep) {
        rep = jQuery.parseJSON(rep);
        lfb_settings = rep;
        $("#lfb_winGlobalSettings")
          .find("input,select,textarea")
          .each(function () {
            if ($(this).is('[data-switch="switch"]')) {
              var value = false;
              eval(
                "if(rep." +
                  $(this).attr("name") +
                  ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
              );
            } else {
              eval("$(this).val(rep." + $(this).attr("name") + ");");
            }
          });
        if (lfb_settings.encryptDB == 1) {
          $('#lfb_winGlobalSettings [name="encryptDB"]')
            .parent()
            .bootstrapSwitch("setState", true);
        } else {
          $('#lfb_winGlobalSettings [name="encryptDB"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }
        if (lfb_data.designForm == 0) {
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        }
        if (lfb_settings.enableCustomerAccount == 0) {
          $('#lfb_formFields [name="enableCustomersData"]')
            .closest(".switch.has-switch")
            .addClass("deactivate");
        } else {
          $('#lfb_formFields [name="enableCustomersData"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $('#lfb_formFields [name="enableCustomersData"]')
            .closest(".switch.has-switch")
            .removeClass("deactivate");
        }

        $('#lfb_winBackendTheme [name="backendTheme"]').val(
          lfb_settings.backendTheme
        );
        $('#lfb_winBackendTheme [name="backend_bgGradient"]').val(
          lfb_settings.backend_bgGradient
        );
        $('#lfb_winBackendTheme [name="backendTheme"]').trigger("change");

        $("#lfb_winGlobalSettings .colorpick").each(function () {
          var $this = $(this);
          if ($(this).prev(".lfb_colorPreview").length == 0) {
            $(this).before(
              '<div class="lfb_colorPreview" style="background-color:#' +
                $this.val().substr(1, 7) +
                '"></div>'
            );
          } else {
            $(this)
              .prev(".lfb_colorPreview")
              .attr("style", "background-color:#" + $this.val().substr(1, 7));
          }
          $(this)
            .prev(".lfb_colorPreview")
            .on("click", function () {
              $(this).next(".colorpick").trigger("click");
            });
          $(this).colpick({
            color: $this.val().substr(1, 7),
            onChange: function (hsb, hex, rgb, el, bySetColor) {
              $(el).val("#" + hex);
              $(el)
                .prev(".lfb_colorPreview")
                .css({
                  backgroundColor: "#" + hex,
                });
            },
          });
        });
        if (lfb_settings.backendTheme == "flat") {
          lfb_settings.useDarkMode = 0;
        }

        if (lfb_settings.openAiKey.length == 0) {
          $(".lfb_aiTool").addClass("lfb_aiDisabled");
        }

        if (lfb_settings.backendTheme == "glassmorphic") {
          lfb_settings.useDarkMode = 0;
          $("body").addClass("lfb_glassmorphic");
          setTimeout(function () {
            $("#lfb_panelFormsList").addClass("lfb_ready");
          }, 800);
        }
        if (lfb_settings.useDarkMode == 1) {
          $('a[data-action="toggleDarkMode"]').addClass("lfb_active");
          $("body").addClass("lfb_darkMode");
        } else {
          $('a[data-action="toggleDarkMode"]').removeClass("lfb_active");
          $("body").removeClass("lfb_darkMode");
        }

        $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
          "update"
        );

        $("#lfb_form").css("opacity", 1);
      },
    });
  }

  function lfb_toggleDarkMode() {
    var darkMode = 0;
    if ($("body").is(".lfb_darkMode")) {
      $('a[data-action="toggleDarkMode"]').removeClass("lfb_active");
      $("body").removeClass("lfb_darkMode");
    } else {
      darkMode = 1;
      $('a[data-action="toggleDarkMode"]').addClass("lfb_active");
      $("body").addClass("lfb_darkMode");
    }
    lfb_settings.useDarkMode = darkMode;
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_toggleDarkMode",
        darkMode: darkMode,
      },
    });
  }

  function lfb_closeSettings() {
    lfb_showLoader();
    document.location.reload();
  }

  function lfb_duplicateStep(stepID) {
    if (lfb_canDuplicate) {
      lfb_showLoader();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_duplicateStep",
          stepID: stepID,
        },
        success: function (newStepID) {
          lfb_canDuplicate = true;
          lfb_loadForm(lfb_currentFormID);
        },
      });
    }
  }

  function updateOverStepLinks($step) {
    var step = lfb_getStepByID($step.attr("data-stepid"));
    if (step) {
      var links = new Array();
      for (var i = 0; i < lfb_links.length; i++) {
        if (
          lfb_links[i].originID == step.id ||
          lfb_links[i].destinationID == step.id
        ) {
          var posX =
            parseInt($("#" + link.originID).css("left")) +
            $("#" + link.originID).outerWidth() / 2 +
            22;
          var posY =
            parseInt($("#" + link.originID).css("top")) +
            $("#" + link.originID).outerHeight() / 2 +
            22;
          var posX2 =
            parseInt($("#" + link.destinationID).css("left")) +
            $("#" + link.destinationID).outerWidth() / 2 +
            22;
          var posY2 =
            parseInt($("#" + link.destinationID).css("top")) +
            $("#" + link.destinationID).outerHeight() / 2 +
            22;

          var chkVisible = true;
          if (posY < $("#lfb_stepsOverflow").scrollTop()) {
            if (posY2 < $("#lfb_stepsOverflow").scrollTop()) {
              chkVisible = false;
            } else {
              if (
                posX < $("#lfb_stepsOverflow").scrollLeft() &&
                posX2 < $("#lfb_stepsOverflow").scrollLeft()
              ) {
                chkVisible = false;
              } else if (
                posX >
                  $("#lfb_stepsOverflow").scrollLeft() +
                    $("#lfb_stepsOverflow").width() &&
                posX2 >
                  $("#lfb_stepsOverflow").scrollLeft() +
                    $("#lfb_stepsOverflow").width()
              ) {
                chkVisible = false;
              }
            }
          }
          if (
            posY >
            $("#lfb_stepsOverflow").scrollTop() +
              $("#lfb_stepsOverflow").height()
          ) {
            if (
              posY2 >
              $("#lfb_stepsOverflow").scrollTop() +
                $("#lfb_stepsOverflow").height()
            ) {
              chkVisible = false;
            } else {
              if (
                posX < $("#lfb_stepsOverflow").scrollLeft() &&
                posX2 < $("#lfb_stepsOverflow").scrollLeft()
              ) {
                chkVisible = false;
              } else if (
                posX >
                  $("#lfb_stepsOverflow").scrollLeft() +
                    $("#lfb_stepsOverflow").width() &&
                posX2 >
                  $("#lfb_stepsOverflow").scrollLeft() +
                    $("#lfb_stepsOverflow").width()
              ) {
                chkVisible = false;
              }
            }
          }
          if (posX < $("#lfb_stepsOverflow").scrollLeft()) {
            if (posX2 < $("#lfb_stepsOverflow").scrollLeft()) {
              chkVisible = false;
            }
          }
          if (
            posX >
            $("#lfb_stepsOverflow").scrollLeft() +
              $("#lfb_stepsOverflow").width()
          ) {
            if (
              posX2 >
              $("#lfb_stepsOverflow").scrollLeft() +
                $("#lfb_stepsOverflow").width()
            ) {
              chkVisible = false;
            }
          }
          if (chkVisible) {
            links.push(link);
          }
        }
      }

      lfb_linkGradientIndex++;
      if (lfb_linkGradientIndex >= 30) {
        lfb_linkGradientIndex = 1;
      }
      for (var i = 0; i < links.length; i++) {
        var posX =
          parseInt($("#" + link.originID).css("left")) +
          $("#" + link.originID).outerWidth() / 2 +
          22;
        var posY =
          parseInt($("#" + link.originID).css("top")) +
          $("#" + link.originID).outerHeight() / 2 +
          22;
        var posX2 =
          parseInt($("#" + link.destinationID).css("left")) +
          $("#" + link.destinationID).outerWidth() / 2 +
          22;
        var posY2 =
          parseInt($("#" + link.destinationID).css("top")) +
          $("#" + link.destinationID).outerHeight() / 2 +
          22;

        var grd = ctx.createLinearGradient(posX, posY, posX2, posY2);

        var chkBack = false;
        var lfb_linkGradientIndexA = lfb_linkGradientIndex / 30;
        var gradPos1 = lfb_linkGradientIndexA;
        var gradPos2 = lfb_linkGradientIndexA + 0.1;
        var gradPos3 = lfb_linkGradientIndexA + 0.2;
        ctx.lineWidth = 4;
        if (gradPos2 > 1) {
          gradPos2 = 0;
          gradPos3 = 0.2;
        }
        if (gradPos3 > 1) {
          gradPos3 = 0;
        }
        var colorLink = "#16a085";
        if (lfb_settings.useDarkMode == 0) {
          colorLink = "#34495e";
        }
        if (lfb_settings.backendTheme == "glassmorphic") {
          colorLink = "rgba(0,0,0,0.2)";
        }
        grd.addColorStop(gradPos1, colorLink);
        grd.addColorStop(gradPos2, "#1ABC9C");
        grd.addColorStop(gradPos3, colorLink);
        ctx.strokeStyle = grd;
        ctx.beginPath();
        ctx.moveTo(posX, posY);

        var dx = posX2 - posX;
        var dy = posY2 - posY;
        ctx.bezierCurveTo(
          posX + dx * 0.33,
          posY,
          posX + dx * 0.67,
          posY2,
          posX2,
          posY2
        );
        ctx.stroke();

        if ($('.lfb_linkPoint[data-linkindex="' + index + '"]').length == 0) {
          var $point = $(
            '<a href="javascript:" data-linkid="' +
              link.id +
              '" data-linkindex="' +
              index +
              '" class="lfb_linkPoint"><span class="fas fa-pencil-alt"></span></a>'
          );
          $("#lfb_stepsContainer").append($point);
          $point.on("click", function () {
            lfb_openWinLink($(this));
          });
          lfb_repositionLinkPoint(index);
        }
      }
    }
  }

  function lfb_updateStepCanvas() {
    if (
      $("#lfb_stepsCanvas").length > 0 &&
      !$("#lfb_stepsOverflow").is(".lfb_hidden")
    ) {
      var ctx = $("#lfb_stepsCanvas").get(0).getContext("2d");
      var onlyStepID = -1;
      var stepOverID = -1;

      if ($(".lfb_stepBloc.ui-draggable-dragging").length > 0) {
        onlyStepID = $(".lfb_stepBloc.ui-draggable-dragging").attr("id");
      } else if ($(".lfb_stepBloc.lfb_over").length > 0) {
        stepOverID = $(".lfb_stepBloc.lfb_over").attr("id");
      }

      ctx.clearRect(
        0,
        0,
        $("#lfb_stepsCanvas").attr("width"),
        $("#lfb_stepsCanvas").attr("height")
      );
      lfb_linkGradientIndex++;
      if (lfb_linkGradientIndex >= 30) {
        lfb_linkGradientIndex = 1;
      }

      var linksPointsToReposition = new Array();

      jQuery.each(lfb_links, function (index) {
        var link = this;

        if (
          link.destinationID &&
          $("#" + link.originID).length > 0 &&
          $("#" + link.destinationID).length > 0
        ) {
          if (
            lfb_disableLinksAnim ||
            onlyStepID == -1 ||
            link.originID == onlyStepID ||
            link.destinationID == onlyStepID
          ) {
            var posX =
              parseInt($("#" + link.originID).css("left")) +
              $("#" + link.originID).outerWidth() / 2 +
              22;
            var posY =
              parseInt($("#" + link.originID).css("top")) +
              $("#" + link.originID).outerHeight() / 2 +
              22;
            var posX2 =
              parseInt($("#" + link.destinationID).css("left")) +
              $("#" + link.destinationID).outerWidth() / 2 +
              22;
            var posY2 =
              parseInt($("#" + link.destinationID).css("top")) +
              $("#" + link.destinationID).outerHeight() / 2 +
              22;

            var chkVisible = true;
            if (posY < $("#lfb_stepsOverflow").scrollTop()) {
              if (posY2 < $("#lfb_stepsOverflow").scrollTop()) {
                chkVisible = false;
              } else {
                if (
                  posX < $("#lfb_stepsOverflow").scrollLeft() &&
                  posX2 < $("#lfb_stepsOverflow").scrollLeft()
                ) {
                  chkVisible = false;
                } else if (
                  posX >
                    $("#lfb_stepsOverflow").scrollLeft() +
                      $("#lfb_stepsOverflow").width() &&
                  posX2 >
                    $("#lfb_stepsOverflow").scrollLeft() +
                      $("#lfb_stepsOverflow").width()
                ) {
                  chkVisible = false;
                }
              }
            }
            if (
              posY >
              $("#lfb_stepsOverflow").scrollTop() +
                $("#lfb_stepsOverflow").height()
            ) {
              if (
                posY2 >
                $("#lfb_stepsOverflow").scrollTop() +
                  $("#lfb_stepsOverflow").height()
              ) {
                chkVisible = false;
              } else {
                if (
                  posX < $("#lfb_stepsOverflow").scrollLeft() &&
                  posX2 < $("#lfb_stepsOverflow").scrollLeft()
                ) {
                  chkVisible = false;
                } else if (
                  posX >
                    $("#lfb_stepsOverflow").scrollLeft() +
                      $("#lfb_stepsOverflow").width() &&
                  posX2 >
                    $("#lfb_stepsOverflow").scrollLeft() +
                      $("#lfb_stepsOverflow").width()
                ) {
                  chkVisible = false;
                }
              }
            }
            if (posX < $("#lfb_stepsOverflow").scrollLeft()) {
              if (posX2 < $("#lfb_stepsOverflow").scrollLeft()) {
                chkVisible = false;
              }
            }
            if (
              posX >
              $("#lfb_stepsOverflow").scrollLeft() +
                $("#lfb_stepsOverflow").width()
            ) {
              if (
                posX2 >
                $("#lfb_stepsOverflow").scrollLeft() +
                  $("#lfb_stepsOverflow").width()
              ) {
                chkVisible = false;
              }
            }

            if (chkVisible) {
              var grd = ctx.createLinearGradient(posX, posY, posX2, posY2);

              var chkBack = false;
              var lfb_linkGradientIndexA = lfb_linkGradientIndex / 30;
              var gradPos1 = lfb_linkGradientIndexA;
              var gradPos2 = lfb_linkGradientIndexA + 0.1;
              var gradPos3 = lfb_linkGradientIndexA + 0.2;
              ctx.lineWidth = 4;
              if (gradPos2 > 1) {
                gradPos2 = 0;
                gradPos3 = 0.2;
              }
              if (gradPos3 > 1) {
                gradPos3 = 0;
              }
              var colorLink = "#6c757d";
              if (lfb_settings.useDarkMode != 1) {
                colorLink = "#bdc3c7";
              }
              if (lfb_settings.backendTheme == "glassmorphic") {
                colorLink = "rgba(255,255,255,0.2)";
              }
              if (
                !lfb_disableLinksAnim &&
                (link.originID == stepOverID ||
                  link.destinationID == stepOverID)
              ) {
                colorLink = "#bdc3c7";
                if (lfb_settings.useDarkMode != 1) {
                  colorLink = "#ecf0f1";
                }
                if (lfb_settings.backendTheme == "glassmorphic") {
                  colorLink = "rgba(255,255,255,0.3)";
                }
              }

              grd.addColorStop(gradPos1, colorLink);
              grd.addColorStop(gradPos2, "#1ABC9C");
              grd.addColorStop(gradPos3, colorLink);
              ctx.strokeStyle = grd;
              ctx.beginPath();
              ctx.moveTo(posX, posY);

              var dx = posX2 - posX;
              var dy = posY2 - posY;
              ctx.bezierCurveTo(
                posX + dx * 0.33,
                posY,
                posX + dx * 0.67,
                posY2,
                posX2,
                posY2
              );
              ctx.stroke();

              if (
                $('.lfb_linkPoint[data-linkindex="' + index + '"]').length == 0
              ) {
                var $point = $(
                  '<a href="javascript:" data-linkid="' +
                    link.id +
                    '" data-linkindex="' +
                    index +
                    '" class="lfb_linkPoint"><span class="fas fa-pencil-alt"></span></a>'
                );
                $("#lfb_stepsContainer").append($point);
                $point.on("click", function () {
                  lfb_openWinLink($(this));
                });
                lfb_repositionLinkPoint(index);
              }
            }
          }
        } else {
          $('.lfb_linkPoint[data-linkindex="' + index + '"]').remove();
        }
      });
    }
    if ($(".lfb_stepBloc.ui-draggable-dragging").length == 0) {
      if (lfb_isLinking) {
        var step = $("#" + lfb_links[lfb_linkCurrentIndex].originID);
        var posX =
          step.position().left +
          $("#lfb_stepsOverflow").scrollLeft() +
          step.outerWidth() / 2;
        var posY =
          step.position().top +
          $("#lfb_stepsOverflow").scrollTop() +
          step.outerHeight() / 2;
        ctx.strokeStyle = "#777c80";
        if (lfb_settings.useDarkMode != 1) {
          ctx.strokeStyle = "#1abc9c";
        }
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(posX, posY);

        var dx = lfb_mouseX - posX;
        ctx.bezierCurveTo(
          posX + dx * 0.33,
          posY,
          posX + dx * 0.67,
          lfb_mouseY,
          lfb_mouseX,
          lfb_mouseY
        );
        ctx.stroke();
      }
    }
  }

  function lfb_removeItem(itemID) {
    hideModal($("#lfb_winDeleteItem"));
    $('#lfb_itemsTable tr[data-itemid="' + itemID + '"]').remove();
    $('#lfb_finalStepItemsList tr[data-itemid="' + itemID + '"]').remove();

    if (lfb_currentForm.form.useVisualBuilder == 1) {
      $("#lfb_stepFrame")
        .contents()
        .find('.lfb_item[data-id="' + itemID + '"]')
        .remove();
    }
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeItem",
        itemID: itemID,
        stepID: lfb_currentStepID,
        formID: lfb_currentFormID,
      },
      success: function () {
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_loadForm",
            formID: lfb_currentFormID,
          },
          success: function (rep) {
            rep = JSON.parse(rep);
            lfb_currentForm = rep;
            lfb_loadFields();
            lfb_params = rep.params;
            lfb_steps = rep.steps;

            if (lfb_currentForm.form.useVisualBuilder == 1) {
            } else {
              if (lfb_currentStepID > 0) {
                lfb_openWinStep(lfb_currentStepID);
              }
            }
          },
        });
      },
    });
  }

  function lfb_editItem(itemID) {
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();

    lfb_showLoader();
    setTimeout(function () {
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_winItem").removeClass("lfb_hidden");
    }, 400);

    $('#lfb_winItem .nav a[data-tab="general"]').trigger("click");

    $("html,body").css("overflow-y", "auto");
    lfb_currentItemID = itemID;
    $('#lfb_winItem [name="type"] option[value="gmap"]').removeAttr("disabled");
    $("#lfb_winItem").find("input,textarea").val("");
    $("#lfb_winItem").find("select option").removeAttr("selected");
    $("#lfb_winItem").find("select option:eq(0)").attr("selected", "selected");
    $("#lfb_winItem")
      .find("#lfb_itemPriclfb_conditionAttributeMenuesGrid tbody tr")
      .not(".static")
      .remove();
    $("#lfb_winItem")
      .find("#lfb_itemOptionsValues tbody tr")
      .not(".static")
      .remove();
    $("#lfb_winItem").find(".is-invalid").removeClass("is-invalid");

    $("#lfb_winItem").find('[name="stepID"]').html("");
    for (var i = 0; i < lfb_currentForm.steps.length; i++) {
      var _step = lfb_currentForm.steps[i];
      $("#lfb_winItem")
        .find('[name="stepID"]')
        .append(
          '<option value="' + _step.id + '">' + _step.title + "</option>"
        );
    }
    $("#lfb_winItem")
      .find('[name="stepID"]')
      .append('<option value="0">' + lfb_data.texts["lastStep"] + "</option>");

    var $sel = $("#lfb_winItem").find('[name="wooProductID"]');
    $sel.attr("data-price", 0);
    $sel.attr("data-type", "");
    $sel.attr("data-max", 0);
    $sel.attr("data-woovariation", 0);
    $sel.attr("data-image", "");
    $sel.attr("data-title", "");
    $sel.attr("data-id", 0);
    $sel.val(0).trigger("change");
    $("#lfb_winItem").find('[name="wooVariation"]').val(0);

    $('#lfb_winItem [name="minDatepicker"] option:not([value="0"])').remove();
    jQuery.each(lfb_currentForm.steps, function (index) {
      jQuery.each(this.items, function (index) {
        if (this.type == "datepicker") {
          var step = lfb_getStepByID(this.stepID);
          $('#lfb_winItem [name="minDatepicker"]').append(
            '<option value="' +
              this.id +
              '">' +
              step.title +
              " > " +
              this.title +
              "</option>"
          );
        }
      });
    });
    jQuery.each(lfb_currentForm.fields, function (index) {
      if (this.type == "datepicker") {
        $('#lfb_winItem [name="minDatepicker"]').append(
          '<option value="' +
            this.id +
            '">' +
            lfb_data.texts["lastStep"] +
            " > " +
            this.title +
            "</option>"
        );
      }
    });

    if (itemID > 0) {
      var itemsList = new Array();
      if (lfb_currentStepID > 0) {
        itemsList = lfb_currentStep.items;
      } else {
        itemsList = lfb_currentForm.fields;
      }
      var chkItem = false;
      jQuery.each(itemsList, function () {
        var item = this;
        if (parseInt(item.id) == parseInt(itemID)) {
          chkItem = true;
          if (item.useRow == "") {
            item.useRow = 0;
          }
          $("#lfb_winItem")
            .find("input,select,textarea")
            .each(function () {
              if ($(this).is('[data-switch="switch"]')) {
                var value = false;
                eval(
                  "if(item." +
                    $(this).attr("name") +
                    " == 1){$(this).attr('checked','checked');} else {$(this).attr('checked',false);}"
                );
                eval(
                  "if(item." +
                    $(this).attr("name") +
                    ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
                );
              } else {
                eval("$(this).val(item." + $(this).attr("name") + ");");
              }
            });
          if (item.wooProductID > 0) {
            jQuery.ajax({
              url: ajaxurl,
              type: "post",
              data: {
                action: "lfb_getWooProductTitle",
                productID: item.wooProductID,
              },
              success: function (rep) {
                $("#lfb_winItem").find("#wooProductSelect").val(rep);
              },
            });
          }
          lfb_itemPriceCalculationEditor.setValue(item.calculation);
          lfb_itemCalculationQtEditor.setValue(item.calculationQt);
          lfb_itemVariableCalculationEditor.setValue(item.variableCalculation);
          lfb_itemPriceCalculationEditor.refresh();
          lfb_itemCalculationQtEditor.refresh();
          lfb_itemVariableCalculationEditor.refresh();
          $("#lfb_winItem #lfb_itemRichText").summernote(this.richtext);
          $("#lfb_winItem #lfb_itemRichText").summernote("code", this.richtext);

          $("#lfb_winItem").find('select[name="type"]').trigger("change");
          var reducs = item.reducsQt.split("*");
          $("#lfb_winItem")
            .find("#lfb_itemPricesGrid tbody tr")
            .not(".static")
            .remove();
          jQuery.each(reducs, function () {
            var reduc = this.split("|");
            if (reduc[0] && parseInt(reduc[0]) > 0) {
              var tr = $(
                "<tr><td>" +
                  reduc[0] +
                  "</td><td>" +
                  parseFloat(reduc[1]).toFixed(2) +
                  '</td><td><a href="javascript:" class="btn btn-danger  btn-circle "><span class="fas fa-trash"></span></a></td></tr>'
              );
              $("#lfb_itemPricesGrid tbody").prepend(tr);
              tr.find("a").on("click", function () {
                lfb_del_reduc(this);
              });
            }
          });
          var optionsV = item.optionsValues.split("|");
          jQuery.each(optionsV, function () {
            var value = this;
            var price = 0;
            if (this.indexOf(";;") > 0) {
              value = this.substr(0, this.indexOf(";;"));
              price = this.substr(this.indexOf(";;") + 2, this.length);
            }
            if (this != "") {
              var tr = $(
                "<tr><td>" +
                  value +
                  "</td><td>" +
                  price +
                  '</td><td><a href="javascript:" data-action="lfb_edit_option" class="btn btn-default  btn-circle "><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="lfb_del_option"  class="btn btn-danger  btn-circle "><span class="fas fa-trash"></span></a></td></tr>'
              );
              tr.find('a[data-action="lfb_edit_option"]').on(
                "click",
                function () {
                  lfb_edit_option(this);
                }
              );
              tr.find('a[data-action="lfb_del_option"]').on(
                "click",
                function () {
                  lfb_del_option(this);
                }
              );
              $("#lfb_itemOptionsValues #option_new_value")
                .closest("tr")
                .before(tr);
            }
          });
          $("#lfb_itemOptionsValues tbody").sortable({
            items: "tr:not(.static)",
            helper: function (e, tr) {
              var $originals = tr.children();
              var $helper = tr.clone();
              $helper.children().each(function (index) {
                $(this).width($originals.eq(index).width());
              });
              return $helper;
            },
          });

          var color = item.color;
          if (color == "") {
            color = "#FFFFFF;";
          }
          $("#lfb_winItem")
            .find('[name="color"]')
            .prev(".lfb_colorPreview")
            .css({
              backgroundColor: color,
            });

          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .val(item.eddProductID);
          $("#lfb_winItem")
            .find('[name="wooProductID"]')
            .val(item.wooProductID);
          if (item.wooProductID > 0 && item.wooVariation > 0) {
            $("#lfb_winItem")
              .find('[name="wooProductID"]')
              .find('option[value="' + item.wooProductID + '"]')
              .each(function () {
                if ($(this).attr("data-woovariation") == item.wooVariation) {
                  $(this).attr("selected", "selected");
                }
              });
          }
          if (item.eddProductID > 0 && item.eddVariation > 0) {
            $("#lfb_winItem")
              .find('[name="eddProductID"]')
              .find('option[value="' + item.eddProductID + '"]')
              .each(function () {
                if ($(this).attr("data-eddvariation") == item.eddVariation) {
                  $(this).attr("selected", "selected");
                }
              });
          }
          $("#lfb_imageLayersTable tbody").html("");
          var layers = new Array();
          jQuery.each(lfb_currentForm.layers, function () {
            if (this.itemID == item.id) {
              layers.push(this);
            }
          });
          if (layers.length > 0) {
            lfb_showLayersTable(layers);
          }
          $("#lfb_winItem")
            .find('[name="endDaterangeID"]')
            .find('option[value!="0"]')
            .remove();
          jQuery.each(lfb_steps, function () {
            var step = this;
            jQuery.each(step.items, function () {
              var item = this;
              var title = item.title;
              if (item.alias.trim().length > 0) {
                title = item.alias;
              }
              if (item.type == "datepicker" && item.id != itemID) {
                $("#lfb_winItem")
                  .find('[name="endDaterangeID"]')
                  .append(
                    '<option value="' +
                      item.id +
                      '">' +
                      step.title +
                      ' : " ' +
                      title +
                      ' "</option>'
                  );
              }
            });
          });
          jQuery.each(lfb_currentForm.fields, function () {
            var item = this;
            var title = item.title;
            if (item.alias.trim().length > 0) {
              title = item.alias;
            }
            if (item.type == "datepicker" && item.id != itemID) {
              $("#lfb_winItem")
                .find('[name="endDaterangeID"]')
                .append(
                  '<option value="' +
                    item.id +
                    '">' +
                    lfb_data.texts["lastStep"] +
                    ' : " ' +
                    title +
                    ' "</option>'
                );
            }
          });
        }
      });
      if (!chkItem) {
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_loadStep",
            stepID: lfb_currentStepID,
          },
          success: function (rep) {
            rep = jQuery.parseJSON(rep);
            lfb_currentStep = rep;
            lfb_editItem(itemID);
          },
        });
      }
    } else {
      $("#lfb_imageLayersTable tbody").html("");
      $("#lfb_winItem").find('input[name="operation"]').val("+");
      $("#lfb_winItem").find('input[name="ordersort"]').val(0);
      $("#lfb_winItem").find('input[name="quantity_max"]').val(5);
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="quantity_enabled"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="ischecked"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="isHidden"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="isRequired"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="dontAddToTotal"]')
        .parent()
        .bootstrapSwitch("setState", false);

      $("#lfb_winItem").find('select[name="checkboxStyle"]').val("switchbox");
      $("#lfb_winItem").find('select[name="type"]').val("picture");
      $("#lfb_winItem")
        .find('[name="showInSummary"]')
        .parent()
        .bootstrapSwitch("setState", true);
      $("#lfb_winItem")
        .find('[name="useCalculation"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem").find('[name="modifiedVariableID"]').val(0);
      $("#lfb_winItem").find('[name="mapZoom"]').val(1);
      $("#lfb_winItem").find('[name="mapType"]').val("marker");

      $("#lfb_winItem")
        .find('[name="useValueAsQt"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="hideQtSummary"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="hidePriceSummary"]')
        .parent()
        .bootstrapSwitch("setState", false);

      $("#lfb_winItem")
        .find('[name="useCalculationQt"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="showPrice"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="useShowConditions"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="sendAsUrlVariable"]')
        .parent()
        .bootstrapSwitch("setState", true);
      $("#lfb_winItem")
        .find('[name="allowedFiles"]')
        .val(".png,.jpg,.jpeg,.gif,.zip,.rar");
      $("#lfb_winItem").find('[name="maxFiles"]').val("4");
      $("#lfb_winItem").find('[name="useRow"]').val("0");
      $("#lfb_winItem")
        .find('[name="color"]')
        .val($('#lfb_tabDesign [name="colorA"]').val());
      $("#lfb_winItem")
        .find('[name="color"]')
        .prev(".lfb_colorPreview")
        .css({
          backgroundColor: $('#lfb_tabDesign [name="colorA"]').val(),
        });
      $("#lfb_winItem").find('[name="eventDurationType"]').val("hours");
      $("#lfb_winItem").find('[name="eventDuration"]').val("1");
      $("#lfb_winItem")
        .find('[name="eventTitle"]')
        .val(lfb_data.texts["newEvent"]);

      $("#lfb_imageLayersTableContainer").slideUp();
      $("#lfb_winItem").find('[name="stepID"]').val(lfb_currentStepID);

      $("#lfb_winItem")
        .find('[name="showInCsv"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }
    $("#lfb_winItem")
      .find('input[type="checkbox"]')
      .each(function () {
        if ($(this).is('[data-switch="switch"]')) {
          if ($(this).closest(".form-group").find("small").length > 0) {
            $(this)
              .closest(".has-switch")
              .tooltip({
                container: "#lfb_winItem",
                title: $(this).closest(".form-group").find("small").html(),
              });
          }
        }
      });

    lfb_changeQuantityEnabled();
    lfb_changeQuantity();
    lfb_changeWoo();
    lfb_changeEDD();
    lfb_changeFieldType();
    lfb_changeAutocomplete();
    lfb_changeUseCalculation();
    lfb_changeUseCalculationQt();
    lfb_changeVariableCalculation();
    lfb_changeValidation();
    setTimeout(lfb_changeItemType, 200);
    lfb_changeUseShowConditions();
    lfb_showSummaryItemChange();
    lfb_formDistanceAsQtChange();
    lfb_changeItemIsRequired();
    lfb_changeUseValueAsQt();
    lfb_changeItemCalendarID();
    lfb_changeItemAllowPastDate();
    changeItemDateType();
    lfb_changeRegisterEvent();
    lfb_changeBusyDateEvent();
    lfb_changeUseAsDateRange();
    lfb_changeUsePaypalIfChecked();
    lfb_changeDontUsePaypalIfChecked();
    lfb_changeSendAsVariable();
    lfb_changeMapType();
    lfb_changeImageType();
    lfb_changeShowCsv();
    lfb_changeUseCurrentWoo();
    lfb_changeIsCountryList();
    lfb_changeReducEnabled();

    setTimeout(function () {
      lfb_applyCalculationEditorTooltips("calculation");
      lfb_applyCalculationEditorTooltips("calculationQt");
      lfb_applyCalculationEditorTooltips("variableCalculation");
      lfb_changeReducEnabled();
    }, 500);

    $("#lfb_winItem").find("input.lfb_iconField").trigger("change");

    if ($('#lfb_formFields [name="gmap_key"]').val().length < 3) {
      $("#lfb_winItem #lfb_addDistanceBtn").attr("disabled", "disabled");
      $('#lfb_winItem [name="useDistanceAsQt"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_winItem [name="useDistanceAsQt"]')
        .closest(".switch.has-switch")
        .addClass("deactivate");
      $('#lfb_winItem [name="type"] option[value="gmap"]').attr(
        "disabled",
        "disabled"
      );

      $('#lfb_componentsList [data-type="gmap"]').addClass("disabled");
    } else {
      $("#lfb_winItem #lfb_addDistanceBtn").removeAttr("disabled");
      $('#lfb_winItem [name="useDistanceAsQt"]')
        .closest(".switch.has-switch")
        .removeClass("deactivate");
      $('#lfb_winItem [name="type"] option[value="gmap"]').removeAttr(
        "disabled"
      );
      $('#lfb_componentsList [data-type="gmap"]').removeClass("disabled");
    }
    $("html,body").scrollTop(0);
    setTimeout(function () {
      $("#lfb_loader").fadeOut();
      $("#lfb_loaderText").html("");
      $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
      setTimeout(function () {
        updateItemTabBtns();
      }, 400);
      lfb_applyCalculationEditorTooltips("calculation");
      lfb_applyCalculationEditorTooltips("calculationQt");
      lfb_applyCalculationEditorTooltips("variableCalculation");
    }, 800);
  }

  function lfb_changeShowCsv() {
    if ($("#lfb_winItem").find('[name="showInCsv"]').is(":checked")) {
      $("#lfb_winItem")
        .find('[name="csvTitle"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="csvTitle"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function updateItemTabBtns() {
    var chkPayOptions = false;
    var chkDesignOptions = false;
    $('#lfb_winItem div[data-tab="price"] .col-4 >.form-group').each(
      function () {
        if ($(this).css("display") != "none") {
          chkPayOptions = true;
        }
      }
    );
    $('#lfb_winItem div[data-tab="design"] .col-4 > .form-group').each(
      function () {
        if ($(this).css("display") != "none") {
          chkDesignOptions = true;
        }
      }
    );
    if (chkPayOptions) {
      $('#lfb_winItem a[data-tab="price"]').show();
    } else {
      $('#lfb_winItem a[data-tab="price"]').hide();
    }
    if (chkDesignOptions) {
      $('#lfb_winItem a[data-tab="design"]').show();
    } else {
      $('#lfb_winItem a[data-tab="design"]').hide();
    }
  }

  function lfb_changeUseCurrentWoo() {
    if (
      $("#lfb_winItem").find('[name="useCurrentWooProduct"]').is(":checked") &&
      $("#wooProductSelect").closest(".form-group").css("display") != "none"
    ) {
      $("#lfb_winItem")
        .find("#wooProductSelect")
        .closest(".form-group")
        .slideUp();
    } else {
      $("#lfb_winItem")
        .find("#wooProductSelect")
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_changeImageType() {
    if ($("#lfb_winItem").find('[name="imageType"]').val() == "fontIcon") {
      $("#lfb_winItem")
        .find('[name="image"],[name="shadowFX"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="icon"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="image"],[name="shadowFX"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem").find('[name="icon"]').closest(".form-group").slideUp();
    }
  }

  function lfb_changeMapType() {
    if ($("#lfb_winItem").find('[name="type"]').val() == "gmap") {
      if ($("#lfb_winItem").find('[name="mapType"]').val() == "") {
        $("#lfb_winItem").find('[name="mapType"]').val("marker");
      }
      if ($("#lfb_winItem").find('[name="mapType"]').val() == "itinerary") {
        $("#lfb_winItem")
          .find("#lfb_btnItemDefineItinerary")
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="address"]')
          .closest(".form-group")
          .slideUp();
      } else {
        $("#lfb_winItem")
          .find('[name="address"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find("#lfb_btnItemDefineItinerary")
          .closest(".form-group")
          .slideUp();
      }
    } else {
      $("#lfb_winItem")
        .find("#lfb_btnItemDefineItinerary")
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="address"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeIsCountryList() {
    if ($("#lfb_winItem").find('[name="type"]').val() == "select") {
      if ($("#lfb_winItem").find('[name="isCountryList"]').is(":checked")) {
        $("#lfb_itemOptionsValuesPanel").slideUp();
      } else {
        $("#lfb_itemOptionsValuesPanel").slideDown();
      }
    }
  }

  function lfb_changeUsePaypalIfChecked() {
    if ($("#lfb_winItem").find('[name="usePaypalIfChecked"]').is(":checked")) {
      $("#lfb_winItem")
        .find('[name="dontUsePaypalIfChecked"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }
  }

  function lfb_changeDontUsePaypalIfChecked() {
    if (
      $("#lfb_winItem").find('[name="dontUsePaypalIfChecked"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="usePaypalIfChecked"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }
  }

  function lfb_showSummaryItemChange() {
    if (
      $("#lfb_winItem").find('[name="showInSummary"]').is(":checked") &&
      $("#lfb_winItem").find('[name="type"]').val() != "richtext"
    ) {
      $("#lfb_winItem")
        .find('[name="hideQtSummary"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="hidePriceSummary"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="hideQtSummary"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="hidePriceSummary"]')
        .closest(".form-group")
        .slideUp();
    }
  }
  var lfb_isWoo = false;

  function lfb_changeWoo() {
    if ($("#lfb_winItem").find('[name="wooProductID"]').val() != "0") {
      $("#lfb_winItem").find('[name="eddProductID"]').val(0);
      lfb_isWoo = true;
      $(".wooMasked").fadeOut(200);
      if ($("#lfb_winItem").find('[name="title"]').val() == "") {
        $("#lfb_winItem")
          .find('[name="title"]')
          .val(
            $("#lfb_winItem").find('[name="wooProductID"]').attr("data-title")
          );
      }
      if (
        parseInt(
          $("#lfb_winItem").find('[name="wooProductID"]').attr("data-max")
        ) > 0
      ) {
        $("#lfb_winItem")
          .find('[name="quantity_max"]')
          .val(
            $("#lfb_winItem").find('[name="wooProductID"]').attr("data-max")
          );
      }
      if (
        ($("#lfb_winItem").find('[name="image"]').val() == "" ||
          $("#lfb_winItem")
            .find('[name="image"]')
            .val()
            .indexOf("150x150.png") > -1) &&
        $("#lfb_winItem").find('[name="wooProductID"]').attr("data-image") != ""
      ) {
        $("#lfb_winItem")
          .find('[name="image"]')
          .val(
            $("#lfb_winItem").find('[name="wooProductID"]').attr("data-image")
          );
      }
      if (
        $("#lfb_winItem").find('[name="price"]').val() == 0 ||
        $("#lfb_winItem").find('[name="price"]').val() == ""
      ) {
        $("#lfb_winItem")
          .find('[name="price"]')
          .val(
            $("#lfb_winItem").find('[name="wooProductID"]').attr("data-price")
          );
      }

      if (
        $("#lfb_winItem")
          .find('[name="wooProductID"]')
          .is('[data-type="subscription"]') ||
        $("#lfb_winItem")
          .find('[name="wooProductID"]')
          .is('[data-type="variable-subscription"]')
      ) {
        $("#lfb_winItem").find('[name="priceMode"]').val("sub");
      } else if (
        $("#lfb_winItem").find('[name="wooProductID"]').attr("data-type") != ""
      ) {
        $("#lfb_winItem").find('[name="priceMode"]').val("");
      }
    } else {
      lfb_isWoo = false;
      if (
        parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
      ) {
        $("#lfb_winItem")
          .find('[name="operation"]')
          .closest(".form-group")
          .slideDown();
        lfb_changeUseCalculation();
      }
    }
  }

  function lfb_changeAutocomplete() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() != "select" &&
      $("#lfb_winItem").find('[name="autocomplete"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="autocomplete"]')
        .closest(".form-group")
        .find(".alert")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="autocomplete"]')
        .closest(".form-group")
        .find(".alert")
        .slideUp();
    }
  }

  function lfb_changeFieldType() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "select" ||
      ($('#lfb_formFields [name="gmap_key"]').val().length > 3 &&
        $("#lfb_winItem").find('[name="type"]').val() == "textfield" &&
        ($("#lfb_winItem").find('[name="fieldType"]').val() == "address" ||
          $("#lfb_winItem").find('[name="fieldType"]').val() == "city" ||
          $("#lfb_winItem").find('[name="fieldType"]').val() == "country" ||
          $("#lfb_winItem").find('[name="fieldType"]').val() == "zip"))
    ) {
      $("#lfb_winItem")
        .find('[name="autocomplete"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="autocomplete"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="autocomplete"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeEDD() {
    if (parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) > 0) {
      $("#lfb_winItem").find('[name="wooProductID"]').val(0);
      if ($("#lfb_winItem").find('[name="title"]').val() == "") {
        $("#lfb_winItem")
          .find('[name="title"]')
          .val(
            $("#lfb_winItem")
              .find('[name="eddProductID"] option:selected')
              .data("title")
          );
      }
      if (
        $("#lfb_winItem")
          .find('[name="eddProductID"] option:selected')
          .data("img") &&
        $("#lfb_winItem").find('[name="image"]').val() == ""
      ) {
        $("#lfb_winItem")
          .find('[name="image"]')
          .val(
            $("#lfb_winItem")
              .find('[name="eddProductID"] option:selected')
              .data("img")
          );
      }

      $("#lfb_winItem")
        .find('[name="useCalculation"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="useCalculation"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="calculation"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="price"]').closest(".form-group").slideUp();
      $("#lfb_winItem")
        .find('[name="operation"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="dontAddToTotal"]')
        .closest(".form-group")
        .slideUp();
    } else {
      if (
        parseInt($("#lfb_winItem").find('[name="wooProductID"]').val()) == 0
      ) {
        $("#lfb_winItem")
          .find('[name="operation"]')
          .closest(".form-group")
          .slideDown();
        lfb_changeUseCalculation();
      }
    }
  }

  function lpf_changeOperation() {
    if (
      $("#lfb_winItem").find('[name="operation"]').val() == "x" ||
      $("#lfb_winItem").find('[name="operation"]').val() == "/"
    ) {
      $("#lfb_winItem")
        .find('[name="price"]')
        .parent()
        .find("label:eq(1)")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="price"]')
        .parent()
        .find("label:eq(0)")
        .slideUp();
    } else {
      $("#lfb_winItem")
        .find('[name="price"]')
        .parent()
        .find("label:eq(1)")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="price"]')
        .parent()
        .find("label:eq(0)")
        .slideDown();
    }
    if ($("#lfb_winItem").find('[name="operation"]').val() != "+") {
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="reduc_enabled"]').prop("checked", false);
      $("#lfb_winItem")
        .find("#lfb_itemPricesGrid tbody tr")
        .not(".static")
        .remove();
    } else if (
      $("#lfb_winItem").find('[name="quantity_enabled"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_changeUseShowConditions() {
    if ($("#lfb_winItem").find('[name="useShowConditions"]').is(":checked")) {
      $("#lfb_winItem")
        .find('[name="showConditions"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="showConditions"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeUseCalculation() {
    if (
      ($("#lfb_winItem").find('[name="type"]').val() == "numberfield" &&
        $("#lfb_winItem").find('[name="useValueAsQt"]').is(":checked")) ||
      $("#lfb_winItem").find('[name="type"]').val() == "picture" ||
      $("#lfb_winItem").find('[name="type"]').val() == "checkbox" ||
      $("#lfb_winItem").find('[name="type"]').val() == "slider" ||
      $("#lfb_winItem").find('[name="type"]').val() == "button" ||
      $("#lfb_winItem").find('[name="type"]').val() == "imageButton"
    ) {
      if (
        parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
      ) {
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideDown();
        if ($("#lfb_winItem").find('[name="useCalculation"]').is(":checked")) {
          if (
            $("#lfb_winItem")
              .find('[name="calculation"]')
              .closest(".form-group")
              .css("display") != "block"
          ) {
            $("#lfb_winItem")
              .find('[name="price"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem")
              .find('[name="calculation"]')
              .closest(".form-group")
              .slideDown();

            if (lfb_itemPriceCalculationEditor.getValue().trim() == "") {
              lfb_itemPriceCalculationEditor.setValue("[price] = 1\n");
            }
          }

          setTimeout(function () {
            lfb_itemPriceCalculationEditor.refresh();
          }, 300);
        } else {
          $("#lfb_winItem")
            .find('[name="price"]')
            .closest(".form-group")
            .slideDown();

          if (
            parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
          ) {
            $("#lfb_winItem")
              .find('[name="price"]')
              .closest(".form-group")
              .slideDown();
          }
          $("#lfb_winItem")
            .find('[name="calculation"]')
            .closest(".form-group")
            .slideUp();
        }
      }
    }
  }

  function lfb_changeVariableCalculation() {
    if ($("#lfb_winItem").find('[name="modifiedVariableID"]').val() != 0) {
      $("#lfb_winItem")
        .find('[name="variableCalculation"]')
        .closest(".form-group")
        .find(".lfb_calculationItemLabel")
        .html(
          $("#lfb_winItem")
            .find('[name="modifiedVariableID"] option:selected')
            .text() + "="
        );
      $("#lfb_winItem")
        .find('[name="variableCalculation"]')
        .closest(".form-group")
        .slideDown();

      if (lfb_itemVariableCalculationEditor.getValue().trim() == "") {
        lfb_itemVariableCalculationEditor.setValue("[variable] = 1\n");
      }

      setTimeout(function () {
        lfb_itemVariableCalculationEditor.refresh();
      }, 300);
    } else {
      $("#lfb_winItem")
        .find('[name="variableCalculation"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeUseCalculationQt() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "picture" ||
      $("#lfb_winItem").find('[name="type"]').val() == "checkbox" ||
      $("#lfb_winItem").find('[name="type"]').val() == "slider" ||
      $("#lfb_winItem").find('[name="type"]').val() == "button" ||
      $("#lfb_winItem").find('[name="type"]').val() == "imageButton" ||
      $("#lfb_winItem").find('[name="type"]').val() == "numberfield"
    ) {
      if ($("#lfb_winItem").find('[name="useCalculationQt"]').is(":checked")) {
        $("#lfb_winItem")
          .find('[name="calculationQt"]')
          .closest(".form-group")
          .stop()
          .slideDown();

        if (lfb_itemCalculationQtEditor.getValue().trim() == "") {
          lfb_itemCalculationQtEditor.setValue("[quantity] = 1\n");
        }

        setTimeout(function () {
          lfb_itemCalculationQtEditor.refresh();
        }, 300);
      } else {
        $("#lfb_winItem")
          .find('[name="calculationQt"]')
          .closest(".form-group")
          .stop()
          .slideUp();
      }
    }
  }

  function lfb_changeUseValueAsQt() {
    if ($("#lfb_winItem").find('[name="type"]').val() == "numberfield") {
      if ($("#lfb_winItem").find('[name="useValueAsQt"]').is(":checked")) {
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .parent()
          .bootstrapSwitch("setState", true);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideDown();

        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="operation"]')
          .closest(".form-group")
          .slideDown();
        if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideDown();
        }
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="useDistanceAsQt"]')
          .closest(".form-group")
          .slideDown();

        $("#lfb_winItem").find('[name="wooProductID"]').parent().show();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .show();
      } else {
        $("#lfb_winItem")
          .find('[name="price"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="operation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="reduc_enabled"]').prop("checked", false);
        $("#lfb_winItem")
          .find('[name="useDistanceAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .hide();
      }
      lfb_changeUseCalculation();
    }
  }

  function lfb_changeItemCalendarID() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "datepicker" &&
      $("#lfb_winItem").find('[name="calendarID"]').val() > 0
    ) {
      $("#lfb_winItem")
        .find('[name="registerEvent"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .animate({ width: 234 }, 200);
      setTimeout(function () {
        $("#lfb_winItem")
          .find('[name="calendarID"]')
          .closest(".form-group")
          .find("a.btn-circle")
          .fadeIn(200);
      }, 250);
    } else {
      $('#lfb_winItem [name="registerEvent"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="registerEvent"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .closest(".form-group")
        .find("a.btn-circle")
        .fadeOut(200);
      setTimeout(function () {
        $("#lfb_winItem")
          .find('[name="calendarID"]')
          .animate({ width: 280 }, 200);
      }, 250);
    }
  }

  function lfb_changeItemAllowPastDate() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "datepicker" &&
      !$("#lfb_winItem").find('[name="date_allowPast"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="startDateDays"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="startDateDays"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function changeItemDateType() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "datepicker" &&
      $("#lfb_winItem").find('[name="dateType"]').val() != "time"
    ) {
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="minDatepicker"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem").find('[name="calendarID"]').val("0");
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="minDatepicker"]')
        .closest(".form-group")
        .slideUp();
    }
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "datepicker" &&
      $("#lfb_winItem").find('[name="dateType"]').val() != "date"
    ) {
      $("#lfb_winItem")
        .find('[name="disableMinutes"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_winItem [name="disableMinutes"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="disableMinutes"]')
        .closest(".form-group")
        .slideUp();
    }
    lfb_changeItemCalendarID();
  }

  function lfb_updateItemCalCategories() {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_getCalendarCategories",
        calendarID: $("#lfb_winItem").find('[name="calendarID"]').val(),
      },
      success: function (rep) {
        rep = jQuery.parseJSON(rep.trim());
        $('#lfb_winItem [name="eventCategory"]').html("");
        jQuery.each(rep, function () {
          $('#lfb_winItem [name="eventCategory"]').append(
            '<option value="' + this.id + '">' + this.title + "</option>"
          );
        });
        $('#lfb_winItem [name="eventCategory"]').val();
        var itemsList = new Array();
        if (lfb_currentItemID > 0) {
          if (lfb_currentStepID > 0) {
            itemsList = lfb_currentStep.items;
          } else {
            itemsList = lfb_currentForm.fields;
          }
          jQuery.each(itemsList, function () {
            var item = this;
            if (item.id == lfb_currentItemID) {
              $('#lfb_winItem [name="eventCategory"]').val(item.eventCategory);
            }
          });
        }
      },
    });
  }

  function lfb_changeBusyDateEvent() {
    if (
      $("#lfb_winItem").find('[name="eventBusy"]').is(":checked") &&
      $("#lfb_winItem").find('[name="registerEvent"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="maxEvents"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="maxEvents"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeRegisterEvent() {
    if (
      $("#lfb_winItem").find('[name="registerEvent"]').is(":checked") &&
      $("#lfb_winItem").find('[name="type"]').val() == "datepicker"
    ) {
      lfb_updateItemCalCategories();
      $("#lfb_winItem")
        .find('[name="eventCategory"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="eventBusy"]')
        .closest(".form-group")
        .slideDown();
      if ($("#lfb_winItem").find('[name="eventBusy"]').is(":checked")) {
        $("#lfb_winItem")
          .find('[name="maxEvents"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="maxEvents"]')
          .closest(".form-group")
          .slideUp();
      }
      $("#lfb_winItem")
        .find('[name="eventTitle"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="useAsDateRange"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="eventCategory"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventBusy"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="maxEvents"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventDuration"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventTitle"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="useAsDateRange"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="useAsDateRange"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="endDaterangeID"]').val("");
      if ($("#lfb_winItem").find('[name="endDaterangeID"] option').length > 0) {
        $("#lfb_winItem")
          .find('[name="endDaterangeID"]')
          .val(
            $("#lfb_winItem")
              .find('[name="endDaterangeID"] option')
              .first()
              .attr("value")
          );
      }
      $("#lfb_winItem")
        .find('[name="endDaterangeID"]')
        .closest(".form-group")
        .slideUp();
    }
    lfb_changeUseAsDateRange();
  }

  function lfb_changeUseAsDateRange() {
    if ($("#lfb_winItem").find('[name="registerEvent"]').is(":checked")) {
      if ($("#lfb_winItem").find('[name="useAsDateRange"]').is(":checked")) {
        $("#lfb_winItem")
          .find('[name="endDaterangeID"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="eventDuration"]')
          .closest(".form-group")
          .slideUp();
      } else {
        $("#lfb_winItem").find('[name="endDaterangeID"]').val("");
        if (
          $("#lfb_winItem").find('[name="endDaterangeID"] option').length > 0
        ) {
          $("#lfb_winItem")
            .find('[name="endDaterangeID"]')
            .val(
              $("#lfb_winItem")
                .find('[name="endDaterangeID"] option')
                .first()
                .attr("value")
            );
        }
        $("#lfb_winItem")
          .find('[name="endDaterangeID"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="eventDuration"]')
          .closest(".form-group")
          .slideDown();
      }
    } else {
      $("#lfb_winItem")
        .find('[name="endDaterangeID"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeItemIsRequired() {
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "select" &&
      $('#lfb_winItem [name="isRequired"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="firstValueDisabled"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_winItem [name="firstValueDisabled"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="firstValueDisabled"]')
        .closest(".form-group")
        .slideUp();
    }
  }

 
  function lfb_changeItemType() {
    if (lfb_currentForm.form.useVisualBuilder == 1) {
      $("#lfb_winItem")
        .find('[name="useRow"]')
        .closest(".form-group")
        .parent()
        .hide();
    } else {
      $("#lfb_winItem")
        .find('[name="useRow"]')
        .closest(".form-group")
        .parent()
        .show();
    }

    if ($("#lfb_winItem").find('[name="type"]').val() != "numberfield") {
      $("#lfb_winItem")
        .find('[name="customQtSelector"]')
        .closest(".form-group")
        .slideUp();
    }

    if ($("#lfb_winItem").find('[name="type"]').val() == "rate") {
      $("#lfb_winItem")
        .find('[name="numValue"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="numValue"]')
        .closest(".form-group")
        .slideUp();
    }

    if ($("#lfb_winItem").find('[name="type"]').val() == "gmap") {
      $("#lfb_winItem")
        .find('[name="mapStyle"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="mapZoom"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="mapType"]')
        .closest(".form-group")
        .slideDown();
      if (
        $("#lfb_winItem").find('[name="maxHeight"]').val() == "" ||
        $("#lfb_winItem").find('[name="maxHeight"]').val() == 0
      ) {
        $("#lfb_winItem").find('[name="maxHeight"]').val(280);
      }
      if ($("#lfb_winItem").find('[name="mapZoom"]').val() == "") {
        $("#lfb_winItem").find('[name="mapZoom"]').val(1);
      }
      lfb_changeMapType();
    } else {
      $("#lfb_winItem")
        .find('[name="mapStyle"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="mapZoom"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="mapType"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="address"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find("#lfb_btnItemDefineItinerary")
        .closest(".form-group")
        .slideUp();
    }

    if ($("#lfb_winItem").find('[name="type"]').val() == "summary") {
      $("#lfb_winItem")
        .find('[name="hideInfoColumn"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="hideInfoColumn"]')
        .closest(".form-group")
        .slideUp();
    }

    if (
      $("#lfb_winItem").find('[name="type"]').val() == "select" ||
      $("#lfb_winItem").find('[name="type"]').val() == "textfield" ||
      $("#lfb_winItem").find('[name="type"]').val() == "numberfield" ||
      $("#lfb_winItem").find('[name="type"]').val() == "textarea"
    ) {
      $("#lfb_winItem")
        .find('[name="prefillVariable"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="prefillVariable"]')
        .closest(".form-group")
        .slideUp();
    }

    if ($("#lfb_winItem").find('[name="type"]').val() == "youtube") {
      $("#lfb_winItem")
        .find('[name="videoCode"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="videoCode"]')
        .closest(".form-group")
        .slideUp();
    }
    if ($("#lfb_winItem").find('[name="type"]').val() == "datepicker") {
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="startDateDays"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="startDateDays"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="calendarID"]').val(0);
      $("#lfb_winItem")
        .find('[name="calendarID"]')
        .closest(".form-group")
        .slideUp();
      $('#lfb_winItem [name="registerEvent"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_winItem [name="eventBusy"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="registerEvent"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="maxEvents"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventDuration"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventCategory"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventTitle"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="eventBusy"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="useAsDateRange"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="endDaterangeID"]')
        .closest(".form-group")
        .slideUp();
    }
    if (
      $("#lfb_winItem").find('[name="type"]').val() == "picture" ||
      $("#lfb_winItem").find('[name="type"]').val() == "imageButton" ||
      $("#lfb_winItem").find('[name="type"]').val() == "qtfield" ||
      $("#lfb_winItem").find('[name="type"]').val() == "button" ||
      $("#lfb_winItem").find('[name="type"]').val() == "imageButton"
    ) {
      if (
        $("#lfb_formFields").find('[name="sendUrlVariables"]').is(":checked") ||
        $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
      ) {
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideDown();
      }

      $("#lfb_winItem")
        .find('[name="readonly"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="visibleTooltip"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="checkboxStyle"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="useValueAsQt"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="sliderStep"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="dateType"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="modifiedVariableID"]')
        .closest(".form-group")
        .slideDown();
      $('#lfb_winItem [name="disableMinutes"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_winItem")
        .find('[name="disableMinutes"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find("#lfb_calEventRemindersTableItem")
        .closest(".form-group")
        .slideUp();
      $("#lfb_imageLayersTableContainer").slideUp();

      if ($("#lfb_winItem").find('[name="type"]').val() == "picture") {
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_default"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_default"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem .lfb_picOnly").slideUp();
      }

      if (
        $("#lfb_winItem").find('[name="type"]').val() == "button" ||
        $("#lfb_winItem").find('[name="type"]').val() == "imageButton"
      ) {
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_max"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_min"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="color"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="callNextStep"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideDown();

        if ($("#lfb_winItem").find('[name="type"]').val() == "imageButton") {
          $("#lfb_winItem")
            .find('[name="buttonText"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="description"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem .lfb_picOnly:not(.lfb_imageField)").slideUp();
          $("#lfb_winItem .lfb_imageField").slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="buttonText"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="description"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem .lfb_picOnly").slideUp();
        }
      } else {
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="color"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="callNextStep"]')
          .closest(".form-group")
          .slideUp();
        if ($("#lfb_winItem").find('[name="type"]').val() != "picture") {
          $("#lfb_winItem")
            .find('[name="icon"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $(".lfb_picOnly").slideDown();
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_max"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_min"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideDown();
      }
      $("#lfb_itemRichTextContainer").slideUp();
      $("#lfb_winItem").find(".lfb_textOnly").slideUp();

      $("#lfb_winItem")
        .find('[name="fieldType"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="useRow"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="urlTarget"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="urlTargetMode"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="showInSummary"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="hideInSummaryIfNull"]')
        .closest(".form-group")
        .slideDown();

      $("#lfb_winItem")
        .find('[name="isHidden"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="maxFiles"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="allowedFiles"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="minSize"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="maxSize"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="fileSize"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="defaultValue"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="minTime"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="shortcode"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="maxTime"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
      $("#lfb_winItem")
        .find('[name="useCalculationQt"]')
        .closest(".form-group")
        .slideUp();

      if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
      }

      $("#lfb_winItem").find('[name="validation"]').val("");
      $("#lfb_winItem")
        .find('[name="validation"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="placeholder"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="placeholder"]')
        .parent()
        .bootstrapSwitch("setState", false);

      if (!$("#lfb_winItem").find('[name="useCalculation"]').is(":checked")) {
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        if (
          $("#lfb_winItem").find('[name="wooProductID"]').val() == "0" &&
          parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
        ) {
          $("#lfb_winItem")
            .find('[name="price"]')
            .closest(".form-group")
            .slideDown();
        }
      } else {
        $("#lfb_winItem").find('[name="price"]').closest(".form-group").hide();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .show();
      }
      if (
        parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
      ) {
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="operation"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
      }
      $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
      $("#lfb_winItem")
        .find('[name="groupitems"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="quantity_max"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .closest(".form-group")
        .slideDown();
      if ($("#lfb_winItem").find('[name="type"]').val() == "qtfield") {
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="useDistanceAsQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isSelected"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="groupitems"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="imageTint"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .prop("checked", true);
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="image"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
      } else {
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem")
          .find('[name="wooProductID"]')
          .closest(".form-group")
          .show();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideDown();
        if (!$('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideUp();
        }

        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideDown();

        lfb_changeReducEnabled();
      }
      $("#lfb_winItem")
        .find('[name="isCountryList"]')
        .closest(".form-group")
        .slideUp();
    } else {
      if ($("#lfb_winItem").find('[name="type"]').val() == "rate") {
        $("#lfb_winItem")
          .find('[name="color"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="color"]')
          .closest(".form-group")
          .slideUp();
      }
      $("#lfb_winItem")
        .find('[name="callNextStep"]')
        .closest(".form-group")
        .slideUp();

      if ($("#lfb_winItem").find('[name="type"]').val() == "select") {
        $("#lfb_winItem")
          .find('[name="isCountryList"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="isCountryList"]')
          .closest(".form-group")
          .slideUp();
      }

      if ($("#lfb_winItem").find('[name="type"]').val() == "layeredImage") {
        $(".lfb_picOnly:not(.lfb_imageField)").slideUp();
      } else {
        $(".lfb_picOnly").slideUp();
      }

      $("#lfb_winItem")
        .find('[name="useCalculationQt"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="calculationQt"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="quantity_max"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="quantity_min"]')
        .closest(".form-group")
        .slideUp();
      if (
        $("#lfb_winItem").find('[name="type"]').val() != "slider" &&
        $("#lfb_winItem").find('[name="type"]').val() != "numberfield"
      ) {
        $('#lfb_winItem [name="quantity_enabled"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $('#lfb_winItem [name="reduc_enabled"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideUp();
      }
      if (
        $("#lfb_winItem").find('[name="type"]').val() == "textfield" ||
        $("#lfb_winItem").find('[name="type"]').val() == "select"
      ) {
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
      }
      if ($("#lfb_winItem").find('[name="type"]').val() == "textfield") {
        $("#lfb_winItem").find(".lfb_textOnly").slideDown();
      } else {
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
      }
      if (
        $("#lfb_winItem").find('[name="type"]').val() == "textfield" ||
        $("#lfb_winItem").find('[name="type"]').val() == "numberfield" ||
        $("#lfb_winItem").find('[name="type"]').val() == "textarea"
      ) {
        $("#lfb_winItem")
          .find('[name="readonly"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="readonly"]')
          .closest(".form-group")
          .slideUp();
      }
      if (
        $("#lfb_winItem").find('[name="type"]').val() == "textfield" ||
        $("#lfb_winItem").find('[name="type"]').val() == "numberfield" ||
        $("#lfb_winItem").find('[name="type"]').val() == "datepicker" ||
        $("#lfb_winItem").find('[name="type"]').val() == "textarea" ||
        $("#lfb_winItem").find('[name="type"]').val() == "timepicker"
      ) {
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }

        if (
          $("#lfb_winItem").find('[name="type"]').val() != "numberfield" ||
          !$("#lfb_winItem").find('[name="useValueAsQt"]').is(":checked")
        ) {
          $('#lfb_winItem [name="useDistanceAsQt"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $("#lfb_winItem")
            .find('[name="useCalculationQt"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();

        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        if ($("#lfb_winItem").find('[name="type"]').val() != "textarea") {
          $("#lfb_winItem")
            .find('[name="icon"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="iconPosition"]')
            .closest(".form-group")
            .slideDown();
        }
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        if ($("#lfb_winItem").find('[name="type"]').val() == "numberfield") {
          $("#lfb_winItem")
            .find('[name="customQtSelector"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="minSize"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="maxSize"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="useValueAsQt"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="modifiedVariableID"]')
            .closest(".form-group")
            .slideDown();
          if ($("#lfb_winItem").find('[name="useValueAsQt"]').is(":checked")) {
          } else {
            $("#lfb_winItem")
              .find('[name="price"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem")
              .find('[name="dontAddToTotal"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem")
              .find('[name="calculation"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem")
              .find('[name="useCalculation"]')
              .parent()
              .bootstrapSwitch("setState", false);
            $("#lfb_winItem")
              .find('[name="useCalculation"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem").find('[name="priceMode"]').val("");
            $("#lfb_winItem")
              .find('[name="priceMode"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem")
              .find('[name="operation"]')
              .closest(".form-group")
              .slideUp();
            $("#lfb_winItem")
              .find('[name="hideInSummaryIfNull"]')
              .parent()
              .bootstrapSwitch("setState", false);
            $("#lfb_winItem")
              .find('[name="hideInSummaryIfNull"]')
              .closest(".form-group")
              .slideUp();
          }
        } else {
          $("#lfb_winItem")
            .find('[name="price"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="hideInSummaryIfNull"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $("#lfb_winItem")
            .find('[name="hideInSummaryIfNull"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="minSize"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="maxSize"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="useValueAsQt"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="dontAddToTotal"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="calculation"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="useCalculation"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $("#lfb_winItem")
            .find('[name="useCalculation"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="modifiedVariableID"]')
            .val(0)
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem").find('[name="priceMode"]').val("");
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="operation"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideDown();

        if ($("#lfb_winItem").find('[name="type"]').val() == "textfield") {
          $("#lfb_winItem")
            .find('[name="validation"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem").find('[name="validation"]').val("");
          $("#lfb_winItem")
            .find('[name="validation"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="validationCaracts"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="validationMin"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="validationMax"]')
            .closest(".form-group")
            .slideUp();
        }
        if ($("#lfb_winItem").find('[name="type"]').val() == "textarea") {
          $("#lfb_winItem")
            .find('[name="icon"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="iconPosition"]')
            .closest(".form-group")
            .slideUp();
        }
        if ($("#lfb_winItem").find('[name="type"]').val() == "timepicker") {
          $("#lfb_winItem")
            .find('[name="minTime"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="maxTime"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="minTime"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="maxTime"]')
            .closest(".form-group")
            .slideUp();
        }
        if ($("#lfb_winItem").find('[name="type"]').val() != "datepicker") {
          $("#lfb_winItem")
            .find('[name="dateType"]')
            .closest(".form-group")
            .slideUp();
          $('#lfb_winItem [name="disableMinutes"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $("#lfb_winItem")
            .find('[name="disableMinutes"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find("#lfb_calEventRemindersTableItem")
            .closest(".form-group")
            .slideUp();
          if ($("#lfb_winItem").find('[name="type"]').val() != "timepicker") {
            $("#lfb_winItem")
              .find('[name="defaultValue"]')
              .closest(".form-group")
              .slideDown();
          } else {
            $("#lfb_winItem")
              .find('[name="defaultValue"]')
              .closest(".form-group")
              .slideUp();
          }
          $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        } else {
          $("#lfb_winItem")
            .find('[name="dateType"]')
            .closest(".form-group")
            .slideDown();
          if (
            $("#lfb_winItem").find('[name="calendarID"]').val() != "" &&
            $("#lfb_winItem").find('[name="calendarID"]').val() > 0
          ) {
            $("#lfb_winItem")
              .find("#lfb_calEventRemindersTableItem")
              .closest(".form-group")
              .slideDown();
          } else {
            $("#lfb_winItem")
              .find("#lfb_calEventRemindersTableItem")
              .closest(".form-group")
              .slideUp();
          }
          $("#lfb_winItem")
            .find('[name="defaultValue"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem").find(".lfb_onlyDatefield").slideDown();
        }
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('input[name="showPrice"]').val(0);
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "range") {
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }

        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();

        $("#lfb_winItem")
          .find('[name="eddProductID"]')
          .closest(".form-group")
          .slideUp();

        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .parent()
          .bootstrapSwitch("setState", true);
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="useDistanceAsQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useDistanceAsQt"]')
          .closest(".form-group")
          .slideUp();

        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').closest(".form-group").hide();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .show();

        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="operation"]')
          .closest(".form-group")
          .slideUp();

        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('input[name="showPrice"]').val(0);
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem").find('[name="priceMode"]').val("");
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "slider") {
        $("#lfb_imageLayersTableContainer").slideUp();
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }

        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().show();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideDown();
        if (!$('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .parent()
          .bootstrapSwitch("setState", true);
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="useDistanceAsQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useDistanceAsQt"]')
          .closest(".form-group")
          .slideUp();

        if (!$("#lfb_winItem").find('[name="useCalculation"]').is(":checked")) {
          if (
            $("#lfb_winItem").find('[name="wooProductID"]').val() == "0" &&
            parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
          ) {
            $("#lfb_winItem")
              .find('[name="price"]')
              .closest(".form-group")
              .slideDown();
          }
          $("#lfb_winItem")
            .find('[name="calculation"]')
            .closest(".form-group")
            .slideUp();
        } else {
          $("#lfb_winItem")
            .find('[name="price"]')
            .closest(".form-group")
            .hide();
          $("#lfb_winItem")
            .find('[name="calculation"]')
            .closest(".form-group")
            .show();
        }
        if (
          parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
        ) {
          $("#lfb_winItem")
            .find('[name="useCalculation"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="operation"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="dontAddToTotal"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="dontAddToTotal"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('input[name="showPrice"]').val(0);
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem").find('[name="priceMode"]').val("");
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "select") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        //if ($('#lfb_formFields [name="disableDropdowns"]').is(':checked')) {
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideDown();
        /* } else {
                     $('#lfb_winItem').find('[name="icon"]').closest('.form-group').slideUp();
                     $('#lfb_winItem').find('[name="iconPosition"]').closest('.form-group').slideUp();
                 }*/
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('input[name="showPrice"]').val(0);
        $("#lfb_winItem").find('[name="operation"]').parent().slideDown();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="price"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().show();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideDown();
        if (!$('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideDown();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideDown();
        if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem").find('[name="priceMode"]').val("");
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "filefield") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "gmap") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem").find('[name="picture"]').parent().hide();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "richtext") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideDown();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "shortcode") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "summary") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInfoColumn"]')
          .closest(".form-group")
          .slideDown();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "youtube") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="useRow"]').val("row");
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "separator") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="useRow"]').val("row");
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
      } else if ($("#lfb_winItem").find('[name="type"]').val() == "rate") {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="color"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="useRow"]').val("row");
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $("#lfb_winItem").find('[name="type"]').val() == "colorpicker"
      ) {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideUp();
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();

        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();

        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_max"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
      } else if (
        $("#lfb_winItem").find('[name="type"]').val() == "layeredImage"
      ) {
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_imageLayersTableContainer").slideDown();
        $("#lfb_winItem")
          .find('[name="sendAsUrlVariable"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="image"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="operation"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem").find('[name="price"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="dontAddToTotal"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="calculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="useCalculation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .val(0)
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $('#lfb_winItem [name="showPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideUp();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().hide();
        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="eddProductID"]').parent().slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="urlTarget"]').val("");
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="useRow"]').val("1");
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="priceMode"]').val("");
        $("#lfb_winItem")
          .find('[name="priceMode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find(".lfb_textOnly").slideUp();
        $("#lfb_winItem")
          .find('[name="fieldType"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="usePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="dontUsePaypalIfChecked"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hideQtSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="hidePriceSummary"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_imageLayersTableContainer").slideUp();
        if (
          $("#lfb_formFields")
            .find('[name="sendUrlVariables"]')
            .is(":checked") ||
          $("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="sendAsUrlVariable"]')
            .closest(".form-group")
            .slideDown();
        }
        $("#lfb_winItem")
          .find('[name="alignment"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="visibleTooltip"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="checkboxStyle"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="buttonText"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="tooltipText"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="tooltipImage"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="useCalculationQt"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="dateType"]')
          .closest(".form-group")
          .slideUp();
        $('#lfb_winItem [name="disableMinutes"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="disableMinutes"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find("#lfb_calEventRemindersTableItem")
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useValueAsQt"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxWidth"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxHeight"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="icon"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="iconPosition"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxTime"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="shortcode"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="validation"]').val("");
        $("#lfb_winItem")
          .find('[name="validation"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="placeholder"]')
          .parent()
          .bootstrapSwitch("setState", false);
        $("#lfb_winItem")
          .find('[name="isHidden"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find(".lfb_onlyDatefield").slideUp();
        if (!$("#lfb_winItem").find('[name="useCalculation"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="calculation"]')
            .closest(".form-group")
            .slideUp();
          if (
            parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
          ) {
            $("#lfb_winItem")
              .find('[name="price"]')
              .closest(".form-group")
              .slideDown();
          }
        } else {
          $("#lfb_winItem")
            .find('[name="price"]')
            .closest(".form-group")
            .hide();
          $("#lfb_winItem")
            .find('[name="calculation"]')
            .closest(".form-group")
            .show();
        }
        if (
          parseInt($("#lfb_winItem").find('[name="eddProductID"]').val()) == 0
        ) {
          $("#lfb_winItem")
            .find('[name="useCalculation"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="dontAddToTotal"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem").find('[name="operation"]').parent().slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="dontAddToTotal"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem")
          .find('[name="modifiedVariableID"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="showPrice"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find('[name="wooProductID"]').parent().show();

        $("#lfb_winItem")
          .find('[name="useCurrentWooProduct"]')
          .closest(".form-group")
          .slideDown();
        if (!$('#lfb_formFields [name="save_to_cart"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="eddProductID"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_winItem").find('[name="groupitems"]').parent().slideDown();
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="defaultValue"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="minSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="maxSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="fileSize"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="showInSummary"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="hideInSummaryIfNull"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem").find("#lfb_itemOptionsValuesPanel").slideUp();
        $("#lfb_winItem")
          .find('[name="ischecked"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="useRow"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="quantity_max"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="reduc_enabled"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="description"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="urlTarget"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="urlTargetMode"]')
          .closest(".form-group")
          .slideDown();
        $("#lfb_winItem")
          .find('[name="maxFiles"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem")
          .find('[name="allowedFiles"]')
          .closest(".form-group")
          .slideUp();

        if ($('#lfb_formFields [name="isSubscription"]').is(":checked")) {
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem").find('[name="priceMode"]').val("");
          $("#lfb_winItem")
            .find('[name="priceMode"]')
            .closest(".form-group")
            .slideUp();
        }
        if (
          $('#lfb_formFields [name="use_paypal"]').is(":checked") ||
          $('#lfb_formFields [name="use_stripe"]').is(":checked")
        ) {
          $("#lfb_winItem")
            .find('[name="usePaypalIfChecked"]')
            .closest(".form-group")
            .slideDown();
          $("#lfb_winItem")
            .find('[name="dontUsePaypalIfChecked"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $("#lfb_winItem")
            .find('[name="usePaypalIfChecked"]')
            .closest(".form-group")
            .slideUp();
          $("#lfb_winItem")
            .find('[name="dontUsePaypalIfChecked"]')
            .closest(".form-group")
            .slideUp();
        }
        $("#lfb_itemRichTextContainer").slideUp();
        $("#lfb_winItem")
          .find('[name="isRequired"]')
          .closest(".form-group")
          .slideDown();
      }
    }

    if (
      !$("#lfb_formFields").find('[name="sendUrlVariables"]').is(":checked") &&
      !$("#lfb_formFields").find('[name="enableZapier"]').is(":checked")
    ) {
      $("#lfb_winItem")
        .find('[name="sendAsUrlVariable"]')
        .closest(".form-group")
        .slideUp();
    }
    lfb_changeUseValueAsQt();
    lfb_changeItemIsRequired();
    lfb_changeValidation();
    lfb_changeUseCalculation();
    lfb_changeSendAsVariable();
    changeItemDateType();
    lfb_changeUseCalculationQt();
    setTimeout(lfb_changeUseCalculation, 200);
    setTimeout(function () {
      updateItemTabBtns();
    }, 400);
  }

  function lfb_changeSendAsVariable() {
    if (
      $("#lfb_winItem").find('[name="sendAsUrlVariable"]').is(":checked") &&
      $("#lfb_winItem").find('[name="type"]').val() != "shortcode" &&
      $("#lfb_winItem").find('[name="type"]').val() != "separator" &&
      $("#lfb_winItem").find('[name="type"]').val() != "richtext" &&
      $("#lfb_winItem").find('[name="type"]').val() != "summary" &&
      $("#lfb_winItem").find('[name="type"]').val() != "row" &&
      ($("#lfb_formFields").find('[name="sendUrlVariables"]').is(":checked") ||
        $("#lfb_formFields").find('[name="enableZapier"]').is(":checked"))
    ) {
      $("#lfb_winItem")
        .find('[name="variableName"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="sentAttribute"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="variableName"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="sentAttribute"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeValidation() {
    if ($("#lfb_winItem").find('[name="validation"]').val() == "custom") {
      $("#lfb_winItem")
        .find('[name="validationMin"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="validationMax"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="validationCaracts"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem").find('[name="mask"]').closest(".form-group").slideUp();
    } else if ($("#lfb_winItem").find('[name="validation"]').val() == "mask") {
      $("#lfb_winItem")
        .find('[name="validationMin"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="validationMax"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="validationCaracts"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="mask"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $("#lfb_winItem")
        .find('[name="validationMin"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="validationMax"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem")
        .find('[name="validationCaracts"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="mask"]').closest(".form-group").slideUp();
    }
  }

  function lfb_changeQuantityEnabled() {
    if ($("#lfb_winItem").find('[name="quantity_enabled"]').is(":checked")) {
      $("#efp_itemQuantity").slideDown();
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="useCalculationQt"]')
        .closest(".form-group")
        .slideDown();

      if (
        ($("#lfb_winItem").find('[name="type"]').val() == "picture" &&
          $('#lfb_formFields [name="qtType"]').val() == 2) ||
        $("#lfb_winItem").find('[name="type"]').val() == "slider"
      ) {
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideDown();
      } else {
        $("#lfb_winItem")
          .find('[name="sliderStep"]')
          .closest(".form-group")
          .slideUp();
        $("#lfb_winItem").find('[name="sliderStep"]').val(1);
      }
    } else {
      $("#lfb_winItem")
        .find('[name="reduc_enabled"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="reduc_enabled"]').prop("checked", false);
      $("#efp_itemQuantity").slideUp();
      $("#lfb_winItem")
        .find('[name="useDistanceAsQt"]')
        .closest(".form-group")
        .slideDown();
      $("#lfb_winItem")
        .find('[name="sliderStep"]')
        .closest(".form-group")
        .slideUp();
      $("#lfb_winItem").find('[name="sliderStep"]').val(1);
      $("#lfb_winItem")
        .find('[name="useCalculationQt"]')
        .closest(".form-group")
        .slideUp();
    }
  }

  function lfb_changeReducEnabled() {
    if ($("#lfb_winItem").find('[name="reduc_enabled"]').is(":checked")) {
      $("#lfb_itemPricesGrid").slideDown(250);
    } else {
      $("#lfb_itemPricesGrid").slideUp(250);
    }
  }

  function lfb_changeQuantity() {
    if ($("#lfb_winItem").find('input[name="quantityUpdated"]').val() < 1) {
      $("#lfb_winItem").find('input[name="quantityUpdated"]').val("3");
    }
  }

  function lfb_getReducs() {
    var reducsTab = new Array();
    $("#lfb_itemPricesGrid tbody tr")
      .not(".static")
      .each(function () {
        var qt = $(this).find("td:eq(0)").html();
        var price = $(this).find("td:eq(1)").html();
        reducsTab.push(new Array(qt, price));
      });
    reducsTab.sort(function (a, b) {
      return a[0] - b[0];
    });
    return reducsTab;
  }

  function lfb_getOptions() {
    var optionsTab = new Array();
    $("#lfb_itemOptionsValues tbody tr")
      .not(".static")
      .each(function () {
        if ($(this).find("td:eq(0) input").length > 0) {
          optionsTab.push(
            $(this).find("td:eq(0) input").val().replace(/"/g, "“") +
              ";;" +
              $(this).find("td:eq(1) input").val().replace(/"/g, "“")
          );
        } else {
          optionsTab.push(
            $(this).find("td:eq(0)").html().replace(/"/g, "“") +
              ";;" +
              $(this).find("td:eq(1)").html().replace(/"/g, "“")
          );
        }
      });
    return optionsTab;
  }

  function lfb_add_option() {
    var newValue = $("#lfb_itemOptionsValues #option_new_value").val();
    var newPrice = parseFloat(
      $("#lfb_itemOptionsValues #option_new_price").val()
    );
    if (isNaN(newPrice)) {
      newPrice = 0;
    }
    if (newValue != "") {
      var tr = $(
        "<tr><td>" +
          newValue +
          "</td><td>" +
          newPrice +
          '</td><td><a href="javascript:" data-action="lfb_edit_option" class="btn btn-default  btn-circle "><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="lfb_del_option" class="btn btn-sm btn-outline-danger btn-circle "><span class="fas fa-trash"></span></a></td></tr>'
      );
      tr.find('a[data-action="lfb_edit_option"]').on("click", function () {
        lfb_edit_option(this);
      });
      tr.find('a[data-action="lfb_del_option"]').on("click", function () {
        lfb_del_option(this);
      });
      $("#lfb_itemOptionsValues #option_new_value").closest("tr").before(tr);
      $("#lfb_itemOptionsValues #option_new_value").val("");
    }
    $("#lfb_itemOptionsValues #option_new_price").val("");
    $("#lfb_itemOptionsValues tbody").sortable({
      helper: function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function (index) {
          $(this).width($originals.eq(index).width());
        });
        return $helper;
      },
    });
  }

  function lfb_del_option(btn) {
    $(btn).parent().parent().remove();
  }

  function lfb_add_reduc() {
    var qt = parseInt($("#reduc_new_qt").val());
    var price = parseFloat($("#reduc_new_price").val());

    if (!isNaN(qt) && qt > 0 && !isNaN(price)) {
      var reducsTab = lfb_getReducs();
      reducsTab.push(new Array(qt, price));
      reducsTab.sort(function (a, b) {
        return b[0] - a[0];
      });
      $("#lfb_itemPricesGrid tbody tr").not(".static").remove();
      jQuery.each(reducsTab, function () {
        var tr = $(
          "<tr><td>" +
            this[0] +
            "</td><td>" +
            parseFloat(this[1]).toFixed(2) +
            '</td><td><a href="javascript:" data-action="lfb_del_reduc" class="btn btn-sm btn-outline-danger btn-circle "><span class="fas fa-trash"></span></a></td></tr>'
        );
        tr.find('a[data-action="lfb_del_reduc"]').on("click", function () {
          lfb_del_reduc(this);
        });
        $("#lfb_itemPricesGrid tbody").prepend(tr);
      });
      $("#reduc_new_qt").val("");
      $("#reduc_new_price").val("");
    }
  }

  function lfb_del_reduc(btn) {
    $(btn).parent().parent().remove();
  }

  function lfb_saveItem() {
    var reducs = "";
    var optionsValues = "";
    var wooVariation = 0;
    var eddVariation = 0;
    var error = false;

    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
    $("#lfb_winItem").find(".is-invalid").removeClass("is-invalid");

    if ($("#lfb_winItem .btn-codeview").is(".active")) {
      $("#lfb_winItem .btn-codeview").trigger("click");
    }

    $("#lfb_winItem")
      .find('[name="calculation"]')
      .val(
        $("#lfb_winItem").find('[name="calculation"]').val().replace(/"/g, "'")
      );
    $("#lfb_winItem")
      .find('[name="calculationQt"]')
      .val(
        $("#lfb_winItem")
          .find('[name="calculationQt"]')
          .val()
          .replace(/"/g, "'")
      );

    if ($("#lfb_winItem").find('input[name="title"]').val().length < 1) {
      error = true;
      $("#lfb_winItem").find('input[name="title"]').addClass("is-invalid");
    }
    if (
      (($("#lfb_winItem").find('select[name="type"]').val() == "picture" &&
        $("#lfb_winItem").find('[name="imageType"]').val() == "") ||
        $("#lfb_winItem").find('select[name="type"]').val() == "imageButton") &&
      $("#lfb_winItem").find('input[name="image"]').val().length < 4
    ) {
      error = true;
      $("#lfb_winItem").find('input[name="image"]').addClass("is-invalid");
    }
    if (
      $("#lfb_winItem").find('select[name="type"]').val() == "picture" &&
      $("#lfb_winItem").find('[name="imageType"]').val() == "fontIcon" &&
      $("#lfb_winItem").find('[name="icon"]').val() == ""
    ) {
      error = true;
      $("#lfb_winItem").find('[name="icon"]').addClass("is-invalid");
    }
    if (
      $("#lfb_winItem").find('select[name="type"]').val() == "layeredImage" &&
      $("#lfb_winItem").find('input[name="image"]').val().length < 4
    ) {
      error = true;
      $("#lfb_winItem").find('input[name="image"]').addClass("is-invalid");
    }
    if (
      $("#lfb_winItem").find('[name="quantity_enabled"]').val() == "1" &&
      $("#lfb_winItem").find('input[name="quantity_max"]').val() == ""
    ) {
      error = true;
      $("#lfb_winItem")
        .find('input[name="quantity_max"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winItem").find('select[name="type"]').val() == "shortcode" &&
      $("#lfb_winItem").find('input[name="shortcode"]').val().length < 1
    ) {
      error = true;
      $("#lfb_winItem").find('input[name="shortcode"]').addClass("is-invalid");
    }
    var optionStab = lfb_getOptions();
    jQuery.each(optionStab, function () {
      optionsValues += this + "|";
    });

    if ($("#lfb_winItem").find('[name="reduc_enabled"]').is(":checked")) {
      var reducsTab = lfb_getReducs();
      jQuery.each(reducsTab, function () {
        reducs += this[0] + "|" + parseFloat(this[1]).toFixed(2) + "*";
      });
      reducs = reducs.substr(0, reducs.length - 1);
    }
    if (
      $("#lfb_winItem")
        .find('[name="wooProductID"] option:selected')
        .data("woovariation") &&
      $("#lfb_winItem")
        .find('[name="wooProductID"] option:selected')
        .data("woovariation") > 0
    ) {
    }
    if (
      $("#lfb_winItem")
        .find('[name="eddProductID"] option:selected')
        .data("eddvariation") &&
      $("#lfb_winItem")
        .find('[name="eddProductID"] option:selected')
        .data("eddvariation") > 0
    ) {
      eddVariation = $("#lfb_winItem")
        .find('[name="eddProductID"] option:selected')
        .data("eddvariation");
    }

    var itemData = {};
    itemData.layers = new Array();
    if ($("#lfb_winItem").find('select[name="type"]').val() == "layeredImage") {
      $("#lfb_imageLayersTable tr[data-layerid]").each(function () {
        itemData.layers.push({
          id: $(this).attr("data-layerid"),
          title: $(this).find("td").first().find("a").text(),
          image: $(this).find('input[name="image"]').val(),
          showConditions: $(this).find('textarea[name="showConditions"]').val(),
          showConditionsOperator: $(this)
            .find('input[name="showConditionsOperator"]')
            .val(),
        });
      });
    }
    $("#lfb_winItem")
      .find("input[name],select[name],textarea[name]")
      .each(function () {
        if (
          $(this).closest("#lfb_itemPricesGrid").length == 0 &&
          $(this).closest("#lfb_itemOptionsValues").length == 0 &&
          $(this).closest("#lfb_calculationValueBubble").length == 0 &&
          $(this).closest("#lfb_imageLayersTable").length == 0
        ) {
          if (!$(this).is('[data-switch="switch"]')) {
            eval("itemData." + $(this).attr("name") + " = $(this).val();");
          } else {
            var value = 0;
            if ($(this).is(":checked")) {
              value = 1;
            }
            eval("itemData." + $(this).attr("name") + " = value;");
          }
        }
      });
    itemData.action = "lfb_saveItem";
    itemData.formID = lfb_currentFormID;
    itemData.defaultStepID = lfb_currentStepID;
    itemData.id = lfb_currentItemID;
    itemData.eddVariation = eddVariation;
    itemData.reducsQt = reducs;
    itemData.optionsValues = optionsValues;
    itemData.title = itemData.title.trim();

    itemData.calculation = lfb_itemPriceCalculationEditor.getValue();
    itemData.calculation = itemData.calculation.replace(/"/g, "'");
    itemData.calculationQt = lfb_itemCalculationQtEditor.getValue();
    itemData.calculationQt = itemData.calculationQt.replace(/"/g, "'");
    itemData.variableCalculation = lfb_itemVariableCalculationEditor.getValue();
    itemData.variableCalculation = itemData.variableCalculation.replace(
      /"/g,
      "'"
    );

    if (
      $("#lfb_itemRichText")
        .next(".note-editor")
        .find('.note-toolbar .note-view [data-name="codeview"]')
        .is(".active")
    ) {
      $("#lfb_itemRichText")
        .next(".note-editor")
        .find('.note-toolbar .note-view [data-name="codeview"]')
        .trigger("click");
    }

    itemData.richtext = $("#lfb_itemRichText").summernote("code");
    if (!error) {
      if (itemData.id > 0) {
        var itemIndex = -1;
        if (lfb_currentStepID > 0) {
          for (var i = 0; i < lfb_currentStep.items.length; i++) {
            if (lfb_currentStep.items[i].id == itemData.id) {
              itemIndex = i;
              break;
            }
          }
          if (itemIndex >= 0) {
            lfb_currentStep.items[i] = itemData;
          }
        } else {
          for (var i = 0; i < lfb_currentForm.fields.length; i++) {
            if (lfb_currentForm.fields[i].id == itemData.id) {
              itemIndex = i;
              break;
            }
          }
          if (itemIndex >= 0) {
            lfb_currentForm.fields[i] = itemData;
          }
        }
      }

      if (lfb_currentForm.form.useVisualBuilder == 1) {
        lfb_showLoader();

        if (lfb_currentStepID > 0) {
          var itemIndex = -1;
          for (var i = 0; i < lfb_currentStep.items.length; i++) {
            if (lfb_currentStep.items[i].id == itemData.id) {
              itemIndex = i;
              break;
            }
          }
          if (itemIndex > -1) {
            lfb_currentStep.items[itemIndex] = itemData;
          }
          var itemsList = lfb_currentStep.items;
        } else {
          var itemIndex = -1;
          for (var i = 0; i < lfb_currentForm.fields.length; i++) {
            if (lfb_currentForm.fields[i].id == itemData.id) {
              itemIndex = i;
              break;
            }
          }
          if (itemIndex > -1) {
            lfb_currentForm.fields[itemIndex] = itemData;
          }
        }

        $('a[data-btnaction="saveItem"] .fas')
          .removeClass("fa-save")
          .addClass("fa-sync-alt")
          .addClass("lfb_loadingBtn");
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: itemData,
          success: function (itemID) {
            if (itemData.type == "layeredImage") {
              lfb_loadForm(lfb_currentFormID);
            }
            if (lfb_currentStepID != itemData.stepID) {
              lfb_editVisualStep(lfb_currentStepID);
            } else {
              $("#lfb_stepFrame")[0]
                .contentWindow.jQuery("#lfb_form")
                .trigger("lfb_refreshItemDom", [itemID]);
            }
            $(".lfb_mainNavBar").hide();

            if (lfb_currentStepID == 0) {
              $("#lfb_navBar_lastStepVisual").show();
            } else {
              if (lfb_currentForm.form.useVisualBuilder == 1) {
                $("#lfb_navBar_stepVisual").show();
              } else {
                $("#lfb_navBar_step").show();
              }
            }
            $("#lfb_panelsContainer>div").addClass("lfb_hidden");
            $("#lfb_winEditStepVisual").removeClass("lfb_hidden");

            $('a[data-btnaction="saveItem"] .fas')
              .removeClass("fa-sync-alt")
              .addClass("fa-save")
              .removeClass("lfb_loadingBtn");
            $("html,body").css("overflow-y", "hidden");

            $("#lfb_loader").fadeOut();
            $("#lfb_loaderText").html("");

            
            if(itemData.defaultStepID != itemData.stepID){
              $("#lfb_stepFrame")[0]
              .contentWindow.jQuery("#lfb_form")
              .trigger("lfb_onItemDeleted", [
                itemData.id
              ]);
              $('.lfb_stepBloc[data-stepid="'+itemData.stepID+'"]').addClass('lfb_mustReloaded');
              
            }

            lfb_notification(lfb_data.texts["modifsSaved"], false, true);
          },
        });
      } else {
        lfb_showLoader();
        $('a[data-btnaction="saveItem"] .fas')
          .removeClass("fa-save")
          .addClass("fa-sync-alt")
          .addClass("lfb_loadingBtn");
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: itemData,
          success: function (itemID) {
            jQuery.ajax({
              url: ajaxurl,
              type: "post",
              data: {
                action: "lfb_loadForm",
                formID: lfb_currentFormID,
              },
              success: function (rep) {
                $('a[data-btnaction="saveItem"] .fas')
                  .removeClass("fa-sync-alt")
                  .addClass("fa-save")
                  .removeClass("lfb_loadingBtn");
                rep = JSON.parse(rep);
                lfb_currentForm = rep;
                lfb_loadFields();
                lfb_params = rep.params;
                lfb_steps = rep.steps;
                lfb_links = new Array();
                jQuery.each(rep.links, function (index) {
                  var link = this;
                  link.originID = $(
                    '.lfb_stepBloc[data-stepid="' + link.originID + '"]'
                  ).attr("id");
                  link.destinationID = $(
                    '.lfb_stepBloc[data-stepid="' + link.destinationID + '"]'
                  ).attr("id");
                  link.conditions = JSON.parse(link.conditions);
                  lfb_links[index] = link;
                });
                lfb_updateStepCanvas();
                if (lfb_currentStepID == 0) {
                  $("#lfb_loader").fadeOut();
                  $("#lfb_loaderText").html("");
                  $('a[data-action="showLastStep"]').trigger("click");
                } else {
                  lfb_openWinStep(lfb_currentStepID);
                  $("#lfb_loader").fadeOut();
                  $("#lfb_loaderText").html("");
                }


                lfb_notification(lfb_data.texts["modifsSaved"], false, true);
              },
            });
          },
        });
      }
    } else {
      $("body,html").animate(
        {
          scrollTop: 0,
        },
        200
      );
    }
  }

  function lfb_checkLicense() {
    var error = false;
    var $field = $('#lfb_winActivation input[name="purchaseCode"]');
    if ($field.val().length < 9) {
      $field.addClass("is-invalid");
    } else {
      lfb_showLoader();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: { action: "lfb_checkLicense", code: $field.val() },
        success: function (rep) {
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
          if (rep == "1") {
            $field.addClass("is-invalid");
          } else {
            lfb_lock = false;
            lfb_data.lscV = 1;
            hideModal($("#lfb_winActivation"));
            $("#lfb_winActivation").fadeOut();
            $("#lfb_winTldAddon")
              .find('input[name="purchaseCode"]')
              .val($field.val());
          }
        },
      });
    }
  }

  function lfb_duplicateForm(formID) {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: { action: "lfb_duplicateForm", formID: formID },
      success: function (rep) {
        document.location.reload();
      },
    });
  }

  function lfb_duplicateItem(itemID) {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: { action: "lfb_duplicateItem", itemID: itemID },
      success: function (rep) {
        if (rep) {
          var newItemID = rep.trim();

          var itemsList = new Array();
          if (lfb_currentStepID > 0) {
            itemsList = lfb_currentStep.items;
          } else {
            itemsList = lfb_currentForm.fields;
          }
          var itemData = lfb_getItemByID(itemID);
          if (itemData) {
            var newData = JSON.parse(JSON.stringify(itemData));
            newData.id = newItemID;
            newData.title += " (1)";
            itemsList.push(newData);

            if (lfb_currentForm.form.useVisualBuilder == 1) {
              $("#lfb_stepFrame")[0]
                .contentWindow.jQuery("#lfb_form")
                .trigger("lfb_refreshItemDom", [0]);
            } else {
              lfb_openWinStep(lfb_currentStepID);
            }
            lfb_reloadLayers();
          }
        }
      },
    });
  }

  function lfb_duplicateItemLastStep(itemID) {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: { action: "lfb_duplicateItem", itemID: itemID },
      success: function (rep) {
        lfb_loadFields();
        lfb_reloadLayers();
      },
    });
  }

  function lfb_reloadLayers() {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: { action: "lfb_loadLayers", formID: lfb_currentFormID },
      success: function (rep) {
        rep = jQuery.parseJSON(rep);
        lfb_currentForm.layers = rep;
      },
    });
  }

  function lfb_startPreview() {}

  function lfb_openWinStep(stepID) {
    lfb_currentStepID = stepID;
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
    $("#lfb_panelPreview").removeClass("lfb_hidden");
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winStep").removeClass("lfb_hidden");

    if (lfb_currentStepID == 0) {
      $("#lfb_itemsList").hide();
    } else {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_loadStep",
          stepID: stepID,
        },
        success: function (rep) {
          rep = jQuery.parseJSON(rep);
          if (lfb_currentStepID == rep.step.id) {
            var step = rep.step;
            lfb_currentStep = rep;
            $("#lfb_stepTabGeneral")
              .find("input,select,textarea")
              .each(function () {
                if ($(this).is('[data-switch="switch"]')) {
                  var value = false;
                  eval(
                    "if(step." +
                      $(this).attr("name") +
                      " == 1){$(this).attr('checked','checked');} else {$(this).attr('checked',false);}"
                  );
                  eval(
                    "if(step." +
                      $(this).attr("name") +
                      ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
                  );
                } else {
                  eval("$(this).val(step." + $(this).attr("name") + ");");
                }
              });

            $("#lfb_itemsTable tbody").html("");
            jQuery.each(rep.items, function () {
              var item = this;
              if (item.type != "row") {
                var $tr = $('<tr data-itemid="' + item.id + '"></tr>');
                var typeName = $("#lfb_winItem")
                  .find('[name="type"] option[value="' + item.type + '"]')
                  .text();
                $tr.append(
                  '<td><a href="javascript:"  data-action="lfb_editItem">' +
                    item.title +
                    "</a></td>"
                );
                $tr.append("<td>" + typeName + "</td>");
                $tr.append("<td>" + item.groupitems + "</td>");
                $tr.append(
                  '<td class="lfb_actionTh"><a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
                    lfb_data.texts["edit"] +
                    '" data-action="lfb_editItem" class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a>' +
                    '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
                    lfb_data.texts["duplicate"] +
                    '" data-action="lfb_duplicateItem" class="btn btn-sm btn-outline-secondary btn-circle"><span class="far fa-copy"></span></a>' +
                    '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
                    lfb_data.texts["remove"] +
                    '" data-action="lfb_removeItem" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a></td>'
                );

                $tr.find('[data-toggle="tooltip"]').tooltip();
                $tr
                  .find('a[data-action="lfb_editItem"]')
                  .on("click", function () {
                    lfb_editItem($(this).closest("tr").attr("data-itemid"));
                  });
                $tr
                  .find('a[data-action="lfb_duplicateItem"]')
                  .on("click", function () {
                    lfb_duplicateItem(
                      $(this).closest("tr").attr("data-itemid")
                    );
                  });
                $tr
                  .find('a[data-action="lfb_removeItem"]')
                  .on("click", function () {
                    lfb_askDeleteItem(
                      $(this).closest("tr").attr("data-itemid")
                    );
                  });
                $("#lfb_itemsTable tbody").append($tr);
              }
            });
            $("#lfb_itemsTable tbody").sortable({
              helper: function (e, tr) {
                var $originals = tr.children();
                var $helper = tr.clone();
                $helper.children().each(function (index) {
                  $(this).width($originals.eq(index).width());
                });
                return $helper;
              },
              delay: 400,
              scroll: true,
              scrollSensitivity: 80,
              scrollSpeed: 3,
              stop: function (event, ui) {
                var items = "";
                $("#lfb_itemsTable tbody tr[data-itemid]").each(function (i) {
                  items += $(this).attr("data-itemid") + ",";
                });
                if (items.length > 0) {
                  items = items.substr(0, items.length - 1);
                }
                jQuery.ajax({
                  url: ajaxurl,
                  type: "post",
                  data: {
                    action: "lfb_changeItemsOrders",
                    items: items,
                  },
                });
              },
            });
            $("#lfb_itemsList").show();
            $("#lfb_btns").html("");

            $(".lfb_mainNavBar").hide();
            if (lfb_currentForm.form.useVisualBuilder == 1) {
              $("#lfb_navBar_stepVisual").show();
            } else {
              $("#lfb_navBar_step").show();
            }

            $('#lfb_editFormNavbar [data-action="stepSettings"]').hide();

            $("#lfb_loader").fadeOut();
            $("#lfb_loaderText").html("");
            $("#lfb_winStep")
              .find('[name="useShowConditions"]')
              .on("change", lfb_changeUseShowStepConditions);
            lfb_changeUseShowStepConditions();

            $("#lfb_winStep")
              .find('input[type="checkbox"]')
              .each(function () {
                if ($(this).is('[data-switch="switch"]')) {
                  if ($(this).closest(".form-group").find("small").length > 0) {
                    $(this)
                      .closest(".has-switch")
                      .tooltip({
                        container: "#lfb_winStep",
                        title: $(this)
                          .closest(".form-group")
                          .find("small")
                          .html(),
                      });
                  }
                }
              });
          }
        },
      });
    }
  }

  function lfb_changeUseShowStepConditions() {
    if ($("#lfb_winStep").find('[name="useShowConditions"]').is(":checked")) {
      $("#lfb_winStep #showConditionsStepBtn").slideDown();
    } else {
      $("#lfb_winStep #showConditionsStepBtn").slideUp();
    }

    if (
      $("#lfb_winStepSettings")
        .find('[name="useShowConditions"]')
        .is(":checked")
    ) {
      $("#lfb_winStepSettings #showConditionsStepBtn").slideDown();
    } else {
      $("#lfb_winStepSettings #showConditionsStepBtn").slideUp();
    }
  }

  function lfb_saveStepSettings() {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );

    if ($('a[data-action="showLastStep"]').is(".active")) {
      $('#lfb_formFields [name="last_title"]').val(
        $("#lfb_winStepSettings").find('[name="title"]').val()
      );
      $('#lfb_formFields [name="succeed_text"]').val(
        $("#lfb_winStepSettings").find('[name="succeed_text"]').val()
      );
      $('#lfb_formFields [name="last_btn"]').val(
        $("#lfb_winStepSettings").find('[name="last_btn"]').val()
      );
      $('#lfb_formFields [name="hideFinalPrice"]')
        .parent()
        .bootstrapSwitch(
          "setState",
          $("#lfb_winStepSettings")
            .find('[name="hideFinalPrice"]')
            .is(":checked")
        );

      $('#lfb_formFields [name="summary_hideFinalStep"]')
        .parent()
        .bootstrapSwitch(
          "setState",
          $("#lfb_winStepSettings")
            .find('[name="showInSummary"]')
            .is(":checked")
        );

      var summary_hideFinalStep = 0;
      var hideFinalbtn = 0;
      var hideFinalPrice = 0;
      var useSignature = 0;
      var useSummary = 0;
      if (
        $("#lfb_winStepSettings").find('[name="showInSummary"]').is(":checked")
      ) {
        summary_hideFinalStep = 1;
      }
      if (
        $("#lfb_winStepSettings")
          .find('[name="hideNextStepBtn"]')
          .is(":checked")
      ) {
        hideFinalbtn = 1;
      }
      if (
        $("#lfb_winStepSettings").find('[name="hideFinalPrice"]').is(":checked")
      ) {
        hideFinalPrice = 1;
      }
      if (
        $("#lfb_winStepSettings").find('[name="useSignature"]').is(":checked")
      ) {
        useSignature = 1;
      }
      if (
        $("#lfb_winStepSettings").find('[name="useSummary"]').is(":checked")
      ) {
        useSummary = 1;
      }
      lfb_showLoader();

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveLastStepSettings",
          formID: lfb_currentFormID,
          last_title: $("#lfb_winStepSettings").find('[name="title"]').val(),
          summary_hideFinalStep: summary_hideFinalStep,
          last_btn: $("#lfb_winStepSettings").find('[name="last_btn"]').val(),
          succeed_text: $("#lfb_winStepSettings")
            .find('[name="succeed_text"]')
            .val(),
          hideFinalbtn: hideFinalbtn,
          useSummary: useSummary,
          useSignature: useSignature,
          hideFinalPrice: hideFinalPrice,
        },
        success: function (stepID) {
          $("#lfb_stepFrame")[0]
            .contentWindow.jQuery("#lfb_form")
            .trigger("lfb_refreshItemDom", [0]);
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    } else {
      var stepData = lfb_getStepByID(lfb_currentStepID);
      if (!stepData) {
        stepData = {};
      }

      $("#lfb_winStepSettings")
        .find("input,select,textarea")
        .each(function () {
          if (!$(this).closest(".col-4").is(".lfb_hidden")) {
            if (!$(this).is('[data-switch="switch"]')) {
              eval("stepData." + $(this).attr("name") + " = $(this).val();");
            } else {
              var value = 0;
              if ($(this).is(":checked")) {
                value = 1;
              }
              eval("stepData." + $(this).attr("name") + " = value;");
            }
          }
        });

      $("#lfb_stepFrame")
        .contents()
        .find(
          '.lfb_genSlide[data-stepid="' +
            lfb_currentStepID +
            '"] .lfb_stepTitle'
        )
        .html(stepData.title);
      $("#lfb_stepFrame")
        .contents()
        .find(
          '.lfb_genSlide[data-stepid="' +
            lfb_currentStepID +
            '"] .lfb_stepDescription'
        )
        .html(stepData.description);

      $('.lfb_stepBloc[data-stepid="' + lfb_currentStepID + '"] h4').html(
        stepData.title
      );

      stepData.maxWidth = 0;
      if ($("#lfb_stepMaxWidth").slider("value") > 0) {
        stepData.maxWidth =
          lfb_stepPossibleWidths[$("#lfb_stepMaxWidth").slider("value")];
      }

      stepData.formID = lfb_currentFormID;
      stepData.id = lfb_currentStepID;

      var stepDataClone = {
        ...stepData,
      };
      delete stepDataClone.items;
      delete stepDataClone.content;
      stepDataClone.action = "lfb_saveStep";

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: stepDataClone,
        success: function (stepID) {},
      });
    }
    lfb_updateStepsDesign();
    hideModal($("#lfb_winStepSettings"));
  }

  function lfb_saveStep() {
    lfb_showLoader();
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
    var stepData = {};
    $("#lfb_stepTabGeneral")
      .find("input,select,textarea")
      .each(function () {
        if (!$(this).is('[data-switch="switch"]')) {
          eval("stepData." + $(this).attr("name") + " = $(this).val();");
        } else {
          var value = 0;
          if ($(this).is(":checked")) {
            value = 1;
          }
          eval("stepData." + $(this).attr("name") + " = value;");
        }
      });
    stepData.action = "lfb_saveStep";
    stepData.formID = lfb_currentFormID;
    stepData.id = lfb_currentStepID;
    $('.lfb_stepBloc[data-stepid="' + lfb_currentStepID + '"] h4').html(
      stepData.title
    );
    lfb_updateStepsDesign();

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: stepData,
      success: function (stepID) {
        lfb_openWinStep(stepID);
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
      },
    });
  }

  function lfb_closeItemWin() {}

  function lfb_closeWin(win) {
    if (win.is("#lfb_winDistance")) {
      $("#lfb_winItem").show();
      win.fadeOut();
    } else {
      $("#lfb_stepsContainer").show();
      win.fadeOut();
      setTimeout(function () {
        lfb_updateStepsDesign();
        if (lfb_disableLinksAnim) {
          clearInterval(lfb_canvasTimer);
          lfb_canvasTimer = false;
          lfb_updateStepCanvas();
        }
      }, 250);
    }
  }

  function lfb_startLink(stepID) {
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    lfb_isLinking = true;
    lfb_linkCurrentIndex = lfb_links.length;
    lfb_links.push({
      originID: stepID,
      destinationID: null,
    });

    setTimeout(function () {
      $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    }, 200);
  }

  function lfb_stopLink(newStep) {
    var chkLink = false;
    jQuery.each(lfb_links, function () {
      if (
        this.originID == lfb_links[lfb_linkCurrentIndex].originID &&
        this.destinationID == newStep.attr("id")
      ) {
        chkLink = this;
      }
    });
    lfb_isLinking = false;
    if (lfb_links[lfb_linkCurrentIndex].originID != newStep.attr("id")) {
      if (!chkLink) {
        lfb_links[lfb_linkCurrentIndex].destinationID = newStep.attr("id");
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_newLink",
            formID: lfb_currentFormID,
            originStepID: $(
              "#" + lfb_links[lfb_linkCurrentIndex].originID
            ).attr("data-stepid"),
            destinationStepID: $(
              "#" + lfb_links[lfb_linkCurrentIndex].destinationID
            ).attr("data-stepid"),
          },
          success: function (linkID) {
            lfb_lastCreatedLinkID = linkID;
            lfb_links[lfb_linkCurrentIndex].id = linkID;
            jQuery.ajax({
              url: ajaxurl,
              type: "post",
              data: {
                action: "lfb_loadForm",
                formID: lfb_currentFormID,
              },
              success: function (rep) {
                rep = JSON.parse(rep);
                lfb_currentForm = rep;
                lfb_params = rep.params;
                lfb_steps = rep.steps;
                jQuery.each(rep.links, function (index) {
                  var link = this;
                  link.originID = $(
                    '.lfb_stepBloc[data-stepid="' + link.originID + '"]'
                  ).attr("id");
                  link.destinationID = $(
                    '.lfb_stepBloc[data-stepid="' + link.destinationID + '"]'
                  ).attr("id");
                  link.conditions = JSON.parse(link.conditions);
                  lfb_links[index] = link;
                });
                if (lfb_disableLinksAnim) {
                  lfb_updateStepCanvas();
                }
                lfb_repositionLinks();
                setTimeout(lfb_repositionLinks, 60);
              },
            });
          },
        });
      }
    } else {
      jQuery.grep(lfb_links, function (value) {
        return value != chkLink;
      });
    }
    lfb_updateStepCanvas();
  }

  function lfb_itemsCheckRows(item) {
    var clear = $(item).parent().children(".clearfix");
    clear.detach();
    $(item).parent().append(clear);
  }

  function lfb_getUniqueTime() {
    var time = new Date().getTime();
    while (time == new Date().getTime());
    return new Date().getTime();
  }

  function lfb_changeInteractionBubble(action) {
    $("#lfb_interactionBubble").data("type", action);
    $("#lfb_interactionBubble #lfb_interactionContent > div").slideUp();
    if (action != "") {
      $(
        '#lfb_interactionBubble #lfb_interactionContent > [data-type="' +
          action +
          '"]'
      ).slideDown();
    }
    if (action == "select") {
      var nbSel = $(
        '#lfb_interactionContent > [data-type="' + action + '"]'
      ).find(".form-group:not(.default)").length;

      if (
        nbSel == 0 ||
        $('#lfb_interactionContent > [data-type="' + action + '"]')
          .find(".form-group:not(.default):last-child")
          .find("input")
          .val() == ""
      ) {
        lfb_interactionAddSelect(action);
      }
    }
  }

  function lfb_interactionAddSelect(action) {
    var nbSel = $(
      '#lfb_interactionContent > [data-type="' + action + '"]'
    ).find(".form-group").length;
    var $field = $(
      '<div class="form-group"><label>' +
        lfb_data.txt_option +
        '</label><input type="text" placeholder="' +
        lfb_data.txt_option +
        '" class="form-control" name="s_' +
        nbSel +
        '_value"></div>'
    );
    $field.find("input").on("keyup", function () {
      if ($(this).val() == "") {
        if ($(this).closest(".form-group:not(.default)").index() > 0) {
          $(this).closest(".form-group:not(.default)").remove();
        }
      } else {
        if (
          $(this)
            .closest(".form-group:not(.default)")
            .next(".form-group:not(.default)").length == 0
        ) {
          lfb_interactionAddSelect(action);
        }
      }
    });
    $('#lfb_interactionContent > [data-type="' + action + '"]').append($field);
    return $field;
  }

  function lfb_openWinLink($item) {
    lfb_currentLinkIndex = $item.attr("data-linkindex");
    $("#lfb_winLink").attr("data-linkindex", $item.attr("data-linkindex"));
    $(".lfb_conditionItem").remove();
    var stepID = $("#" + lfb_links[$item.attr("data-linkindex")].originID).attr(
      "data-stepid"
    );
    var step = lfb_getStepByID(stepID);
    var destID = $(
      "#" + lfb_links[$item.attr("data-linkindex")].destinationID
    ).attr("data-stepid");
    var destination = lfb_getStepByID(destID);

    $("#lfb_linkInteractions").show();
    $("#lfb_linkOriginTitle").html(step.title);
    $("#lfb_linkDestinationTitle").html(destination.title);

    jQuery.each(lfb_links[lfb_currentLinkIndex].conditions, function () {
      lfb_addLinkInteraction(this);
    });
    $("#lfb_linkOperator").val(lfb_links[lfb_currentLinkIndex].operator);
    $(
      "#lfb_winLink #lfb_conditionsTable select.lfb_conditionoperatorSelect"
    ).trigger("change");

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winLink").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_link").show();

    setTimeout(lfb_updateStepsDesign, 255);

    setTimeout(function () {
      $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    }, 300);
  }

  function lfb_addShowLayerInteraction(data) {
    var $item = $('<tr class="lfb_conditionItem"></tr>');
    var $select = $(
      '<select class="lfb_conditionSelect form-control"></select>'
    );
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type != "richtext" &&
          item.type != "colorpicker" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row" &&
          item.type != "layeredImage"
        ) {
          var itemID = step.id + "_" + item.id;
          $select.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    var finalStepTxt = lfb_data.texts["lastStep"];
    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }
      if (
        item.type != "richtext" &&
        item.type != "colorpicker" &&
        item.type != "shortcode" &&
        item.type != "summary" &&
        item.type != "separator" &&
        item.type != "row" &&
        item.type != "layeredImage"
      ) {
        var itemID = "0_" + item.id;
        $select.append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '" data-datetype="' +
            item.dateType +
            '">' +
            finalStepTxt +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });

    jQuery.each(lfb_currentForm.variables, function () {
      $select.append(
        '<option value="v_' +
          this.id +
          '" data-type="variable" data-vartype="' +
          this.type +
          '">' +
          lfb_data.texts["Variable"] +
          ' : " ' +
          this.title +
          ' "</option>'
      );
    });
    $select.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $select.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    var $operator = $(
      '<select class="lfb_conditionoperatorSelect form-control"></select>'
    );
    $select.on("change", function () {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      if (stepID > 0) {
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
      } else {
        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == itemID) {
            item = this;
          }
        });
      }
      var operator = $(this)
        .parent()
        .parent()
        .find(".lfb_conditionoperatorSelect");
      operator.find("option").remove();
      if (
        $select.find("option:selected").is("[data-static]") ||
        $select.find("option:selected").is('[data-type="variable"]')
      ) {
        var options = lfb_conditionGetOperators(
          {
            type: $select.find("option:selected").attr("data-type"),
            varType: $select.find("option:selected").attr("data-vartype"),
          },
          $select
        );
      } else {
        var options = lfb_conditionGetOperators(item, $select);
      }
      jQuery.each(options, function () {
        operator.append(
          '<option value="' +
            this.value +
            '"  data-variable="' +
            this.hasVariable +
            '">' +
            this.text +
            "</option>"
        );
      });
      lfb_linksUpdateFields($operator);
      setTimeout(function () {
        lfb_linksUpdateFields($operator);
      }, 300);
    });

    if (data && typeof data.interaction != "undefined") {
      $select.val(data.interaction);
    }
    if (
      $select.find("option:selected").is("[data-static]") ||
      $select.find("option:selected").is('[data-type="variable"]')
    ) {
      var options = lfb_conditionGetOperators(
        {
          type: $select.find("option:selected").attr("data-type"),
          varType: $select.find("option:selected").attr("data-vartype"),
        },
        $select
      );
    } else {
      if ($select.val()) {
        var stepID = $select.val().substr(0, $select.val().indexOf("_"));
        var itemID = $select
          .val()
          .substr($select.val().indexOf("_") + 1, $select.val().length);
        var item = false;
        if (stepID > 0) {
          jQuery.each(lfb_steps, function () {
            var step = this;
            if (step.id == stepID) {
              jQuery.each(step.items, function () {
                if (this.id == itemID) {
                  item = this;
                }
              });
            }
          });
        } else {
          jQuery.each(lfb_currentForm.fields, function () {
            if (this.id == itemID) {
              item = this;
            }
          });
        }
        var options = lfb_conditionGetOperators(item, $select);
      }
    }
    jQuery.each(options, function () {
      $operator.append(
        '<option value="' +
          this.value +
          '" data-variable="' +
          this.hasVariable +
          '">' +
          this.text +
          "</option>"
      );
    });

    $operator.on("change", function () {
      lfb_linksUpdateFields($(this));
    });
    setTimeout(function () {
      $select.trigger("change");
    }, 250);
    var $col1 = $("<td></td>");
    $col1.append($select);
    $item.append($col1);
    var $col2 = $("<td></td>");
    $col2.append($operator);
    $item.append($col2);
    $item.append(
      '<td></td><td class="text-end"><a href="javascript:" class="lfb_conditionDelBtn text-danger" data-action="lfb_conditionRemove"><span class="fas fa-trash"></span></a> </td>'
    );
    $item.find('a[data-action="lfb_conditionRemove"]').on("click", function () {
      lfb_conditionRemove(this);
    });

    if (data && typeof data.action != "undefined") {
      $operator.val(data.action);
      $operator.trigger("change");
      if (data.value) {
        lfb_linksUpdateFields($operator, data);
      }
      setTimeout(function () {
        $operator.val(data.action);
        $operator.trigger("change");
        if (data.value) {
          $operator
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValue")
            .val(data.value);
          setTimeout(function () {
            $operator
              .closest(".lfb_conditionItem")
              .find(".lfb_conditionValue")
              .val(data.value);
          }, 200);
          lfb_linksUpdateFields($operator, data);
        }
      }, 300);
    }
    //  $item.find('select').niceSelect();
    $("#lfb_showLayerConditionsTable tbody").append($item);
  }

  function lfb_addShowStepInteraction(data) {
    var $item = $('<tr class="lfb_conditionItem"></tr>');
    var $select = $(
      '<select class="lfb_conditionSelect form-control"></select>'
    );
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type != "richtext" &&
          item.type != "colorpicker" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row" &&
          item.type != "layeredImage"
        ) {
          var itemID = step.id + "_" + item.id;
          $select.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    jQuery.each(lfb_currentForm.variables, function () {
      $select.append(
        '<option value="v_' +
          this.id +
          '" data-type="variable" data-vartype="' +
          this.type +
          '">' +
          lfb_data.texts["Variable"] +
          ' : " ' +
          this.title +
          ' "</option>'
      );
    });

    $select.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $select.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    var $operator = $(
      '<select class="lfb_conditionoperatorSelect form-control"></select>'
    );
    $select.on("change", function () {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      jQuery.each(lfb_steps, function () {
        var step = this;
        if (step.id == stepID) {
          jQuery.each(step.items, function () {
            if (this.id == itemID) {
              item = this;
            }
          });
        }
      });
      var operator = $(this)
        .parent()
        .parent()
        .find(".lfb_conditionoperatorSelect");
      operator.find("option").remove();
      if (
        $select.find("option:selected").is("[data-static]") ||
        $select.find("option:selected").is('[data-type="variable"]')
      ) {
        var options = lfb_conditionGetOperators(
          {
            type: $select.find("option:selected").attr("data-type"),
            varType: $select.find("option:selected").attr("data-vartype"),
          },
          $select
        );
      } else {
        var options = lfb_conditionGetOperators(item, $select);
      }
      jQuery.each(options, function () {
        operator.append(
          '<option value="' +
            this.value +
            '"  data-variable="' +
            this.hasVariable +
            '">' +
            this.text +
            "</option>"
        );
      });
      $operator.trigger("change");
      setTimeout(function () {
        $operator.trigger("change");
      }, 300);
    });
    if (data && typeof data.interaction != "undefined") {
      $select.val(data.interaction);
    }
    if (
      $select.find("option:selected").is("[data-static]") ||
      $select.find("option:selected").is('[data-type="variable"]')
    ) {
      var options = lfb_conditionGetOperators(
        {
          type: $select.find("option:selected").attr("data-type"),
          varType: $select.find("option:selected").attr("data-vartype"),
        },
        $select
      );
    } else {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      jQuery.each(lfb_steps, function () {
        var step = this;
        if (step.id == stepID) {
          jQuery.each(step.items, function () {
            if (this.id == itemID) {
              item = this;
            }
          });
        }
      });
      var options = lfb_conditionGetOperators(item, $select);
    }
    jQuery.each(options, function () {
      $operator.append(
        '<option value="' +
          this.value +
          '" data-variable="' +
          this.hasVariable +
          '">' +
          this.text +
          "</option>"
      );
    });

    $operator.on("change", function () {
      lfb_linksUpdateFields($(this));
    });
    setTimeout(function () {
      $select.trigger("change");
    }, 250);
    var $col1 = $("<td></td>");
    $col1.append($select);
    $item.append($col1);
    var $col2 = $("<td></td>");
    $col2.append($operator);
    $item.append($col2);
    $item.append(
      '<td></td><td class="text-end"><a href="javascript:" class="lfb_conditionDelBtn text-danger" data-action="lfb_conditionRemove"><span class="fas fa-trash"></span></a> </td>'
    );
    $item.find('a[data-action="lfb_conditionRemove"]').on("click", function () {
      lfb_conditionRemove(this);
    });

    if (data && typeof data.action != "undefined") {
      $operator.val(data.action);
      $operator.trigger("change");
      if (data.value) {
        lfb_linksUpdateFields($operator, data);
      }
      setTimeout(function () {
        $operator.val(data.action);
        $operator.on("change", function () {
          lfb_linksUpdateFields($(this));
        });
        if (data.value) {
          $operator
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValue")
            .val(data.value);
          setTimeout(function () {
            $operator
              .closest(".lfb_conditionItem")
              .find(".lfb_conditionValue")
              .val(data.value);
          }, 200);
          lfb_linksUpdateFields($operator, data);
        }
      }, 300);
    }
    //    $item.find('select').niceSelect();
    $("#lfb_showStepConditionsTable tbody").append($item);
  }

  function lfb_addRedirInteraction(data) {
    var $item = $('<tr class="lfb_conditionItem"></tr>');
    var $select = $(
      '<select class="lfb_conditionSelect form-control"></select>'
    );
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type != "richtext" &&
          item.type != "colorpicker" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row" &&
          item.type != "layeredImage"
        ) {
          var itemID = step.id + "_" + item.id;
          $select.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    var finalStepTxt = lfb_data.texts["lastStep"];
    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }
      if (
        item.type != "richtext" &&
        item.type != "colorpicker" &&
        item.type != "shortcode" &&
        item.type != "summary" &&
        item.type != "separator" &&
        item.type != "row" &&
        item.type != "layeredImage"
      ) {
        var itemID = "0_" + item.id;
        $select.append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '" data-datetype="' +
            item.dateType +
            '">' +
            finalStepTxt +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });
    jQuery.each(lfb_currentForm.variables, function () {
      $select.append(
        '<option value="v_' +
          this.id +
          '" data-type="variable" data-vartype="' +
          this.type +
          '">' +
          lfb_data.texts["Variable"] +
          ' : " ' +
          this.title +
          ' "</option>'
      );
    });

    $select.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $select.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    var $operator = $(
      '<select class="lfb_conditionoperatorSelect form-control"></select>'
    );
    $select.on("change", function () {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      if (stepID > 0) {
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
      } else {
        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == itemID) {
            item = this;
          }
        });
      }
      var operator = $(this)
        .parent()
        .parent()
        .find(".lfb_conditionoperatorSelect");
      operator.find("option").remove();
      if (
        $select.find("option:selected").is("[data-static]") ||
        $select.find("option:selected").is('[data-type="variable"]')
      ) {
        var options = lfb_conditionGetOperators(
          {
            type: $select.find("option:selected").attr("data-type"),
            varType: $select.find("option:selected").attr("data-vartype"),
          },
          $select
        );
      } else {
        var options = lfb_conditionGetOperators(item, $select);
      }
      jQuery.each(options, function () {
        operator.append(
          '<option value="' +
            this.value +
            '"  data-variable="' +
            this.hasVariable +
            '">' +
            this.text +
            "</option>"
        );
      });
      $operator.trigger("change");
    });
    if (data && typeof data.interaction != "undefined") {
      $select.val(data.interaction);
    }
    if (
      $select.find("option:selected").is("[data-static]") ||
      $select.find("option:selected").is('[data-type="variable"]')
    ) {
      var options = lfb_conditionGetOperators(
        {
          type: $select.find("option:selected").attr("data-type"),
          varType: $select.find("option:selected").attr("data-vartype"),
        },
        $select
      );
    } else {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      if (stepID > 0) {
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
      } else {
        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == itemID) {
            item = this;
          }
        });
      }
      var options = lfb_conditionGetOperators(item, $select);
    }
    jQuery.each(options, function () {
      $operator.append(
        '<option value="' +
          this.value +
          '" data-variable="' +
          this.hasVariable +
          '">' +
          this.text +
          "</option>"
      );
    });

    if ($("#lfb_winRedirection").css("display") != "none") {
      $operator.on("change", function () {
        lfb_linksUpdateFields($(this));
      });
    }
    $operator.trigger("change");
    setTimeout(function () {
      $select.trigger("change");
    }, 250);
    var $col1 = $("<td></td>");
    $col1.append($select);
    $item.append($col1);
    var $col2 = $("<td></td>");
    $col2.append($operator);
    $item.append($col2);
    $item.append(
      '<td></td><td class="text-end"><a href="javascript:" class="lfb_conditionDelBtn text-danger" data-action="lfb_conditionRemove"><span class="fas fa-trash"></span></a> </td>'
    );
    $item.find('a[data-action="lfb_conditionRemove"]').on("click", function () {
      lfb_conditionRemove(this);
    });

    if (data && typeof data.action != "undefined") {
      $operator.val(data.action);
      // $operator.trigger('change');
      if (data.value) {
        data.value = data.value.replace(/</g, "&lt;");
        data.value = data.value.replace(/>/g, "&gt;");
        $operator
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .val(data.value);
      }
      lfb_linksUpdateFields($operator, data);

      setTimeout(function () {
        $operator.val(data.action);
        $operator.trigger("change");

        if (data.value) {
          data.value = data.value.replace(/</g, "&lt;");
          data.value = data.value.replace(/>/g, "&gt;");
          $operator
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValue")
            .val(data.value);
        }
      }, 400);
    }
    //   $item.find('select').niceSelect();
    $("#lfb_redirConditionsTable tbody").append($item);
  }

  function lfb_addShowInteraction(data) {
    var $item = $('<tr class="lfb_conditionItem"></tr>');
    var $select = $(
      '<select class="lfb_conditionSelect form-control"></select>'
    );
    jQuery.each(lfb_steps, function () {
      var step = this;
      $select.append(
        '<option value="_step-' +
          step.id +
          '" data-type="step" data-static="1"  data-variable="numberfield">' +
          step.title +
          " :  " +
          lfb_data.texts["totalQuantity"] +
          "</option>"
      );

      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type != "richtext" &&
          item.type != "colorpicker" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row" &&
          item.type != "layeredImage"
        ) {
          var itemID = step.id + "_" + item.id;
          $select.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    jQuery.each(lfb_currentForm.variables, function () {
      $select.append(
        '<option value="v_' +
          this.id +
          '" data-type="variable" data-vartype="' +
          this.type +
          '">' +
          lfb_data.texts["Variable"] +
          ' : " ' +
          this.title +
          ' "</option>'
      );
    });
    var finalStepTxt = lfb_data.texts["lastStep"];
    $select.append(
      '<option value="_step-0" data-type="step" data-static="1"  data-variable="numberfield">' +
        finalStepTxt +
        " :  " +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;

      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }
      if (
        item.type != "richtext" &&
        item.type != "colorpicker" &&
        item.type != "shortcode" &&
        item.type != "summary" &&
        item.type != "separator" &&
        item.type != "row" &&
        item.type != "layeredImage"
      ) {
        var itemID = "0_" + item.id;
        $select.append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '" data-datetype="' +
            item.dateType +
            '">' +
            finalStepTxt +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });

    $select.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $select.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    var $operator = $(
      '<select class="lfb_conditionoperatorSelect form-control"></select>'
    );
    $select.on("change", function () {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      if (stepID > 0) {
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
      } else {
        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == itemID) {
            item = this;
          }
        });
      }
      var operator = $(this)
        .parent()
        .parent()
        .find(".lfb_conditionoperatorSelect");
      operator.find("option").remove();
      if (
        $select.find("option:selected").is("[data-static]") ||
        $select.find("option:selected").is('[data-type="variable"]')
      ) {
        var options = lfb_conditionGetOperators(
          {
            type: $select.find("option:selected").attr("data-type"),
            varType: $select.find("option:selected").attr("data-vartype"),
          },
          $select
        );
      } else {
        var options = lfb_conditionGetOperators(item, $select);
      }
      jQuery.each(options, function () {
        operator.append(
          '<option value="' +
            this.value +
            '"  data-variable="' +
            this.hasVariable +
            '">' +
            this.text +
            "</option>"
        );
      });
      $operator.trigger("change");
    });

    if (data && typeof data.interaction != "undefined") {
      $select.val(data.interaction);
    }
    if (
      $select.find("option:selected").is("[data-static]") ||
      $select.find("option:selected").is('[data-type="variable"]')
    ) {
      var options = lfb_conditionGetOperators(
        {
          type: $select.find("option:selected").attr("data-type"),
          varType: $select.find("option:selected").attr("data-vartype"),
        },
        $select
      );
    } else {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      if (stepID > 0) {
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
      } else {
        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == itemID) {
            item = this;
          }
        });
      }
      var options = lfb_conditionGetOperators(item, $select);
    }
    jQuery.each(options, function () {
      $operator.append(
        '<option value="' +
          this.value +
          '" data-variable="' +
          this.hasVariable +
          '">' +
          this.text +
          "</option>"
      );
    });

    $operator.on("change", function () {
      lfb_linksUpdateFields($(this));
    });
    var $col1 = $("<td></td>");
    $col1.append($select);
    $item.append($col1);
    var $col2 = $("<td></td>");
    $col2.append($operator);
    $item.append($col2);
    $item.append(
      '<td></td><td class="text-end"><a href="javascript:" class="lfb_conditionDelBtn text-danger" data-action="lfb_conditionRemove"><span class="fas fa-trash"></span></a> </td>'
    );
    $item.find('a[data-action="lfb_conditionRemove"]').on("click", function () {
      lfb_conditionRemove(this);
    });

    if (data && typeof data.action != "undefined") {
      $operator.val(data.action);
      $operator.trigger("change");
      if (data.value) {
        $operator
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .val(data.value);
      }
      lfb_linksUpdateFields($operator, data);
    }
    //   $item.find('select').niceSelect();
    $("#lfb_showConditionsTable tbody").append($item);
  }

  function lfb_addCalcInteraction(data) {
    var $item = $('<tr class="lfb_conditionItem"></tr>');
    var $select = $(
      '<select class="lfb_conditionSelect form-control"></select>'
    );
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;

        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type != "richtext" &&
          item.type != "colorpicker" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row" &&
          item.type != "layeredImage"
        ) {
          var itemID = step.id + "_" + item.id;
          $select.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    var finalStepTxt = lfb_data.texts["lastStep"];
    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }
      if (
        item.type != "richtext" &&
        item.type != "colorpicker" &&
        item.type != "shortcode" &&
        item.type != "summary" &&
        item.type != "separator" &&
        item.type != "row" &&
        item.type != "layeredImage"
      ) {
        var itemID = "0_" + item.id;
        $select.append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '" data-datetype="' +
            item.dateType +
            '">' +
            finalStepTxt +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });

    $select.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $select.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    var $operator = $(
      '<select class="lfb_conditionoperatorSelect form-control"></select>'
    );
    $select.on("change", function () {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      if (stepID > 0) {
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
      } else {
        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == itemID) {
            item = this;
          }
        });
      }
      var operator = $(this)
        .parent()
        .parent()
        .find(".lfb_conditionoperatorSelect");
      operator.find("option").remove();
      if (
        $select.find("option:selected").is("[data-static]") ||
        $select.find("option:selected").is('[data-type="variable"]')
      ) {
        var options = lfb_conditionGetOperators(
          {
            type: $select.find("option:selected").attr("data-type"),
            varType: $select.find("option:selected").attr("data-vartype"),
          },
          $select
        );
      } else {
        var options = lfb_conditionGetOperators(item, $select);
      }
      jQuery.each(options, function () {
        operator.append(
          '<option value="' +
            this.value +
            '"  data-variable="' +
            this.hasVariable +
            '">' +
            this.text +
            "</option>"
        );
      });
      $operator.trigger("change");
    });

    if (data && typeof data.interaction != "undefined") {
      $select.val(data.interaction);
    }
    if (
      $select.find("option:selected").is("[data-static]") ||
      $select.find("option:selected").is('[data-type="variable"]')
    ) {
      var options = lfb_conditionGetOperators(
        {
          type: $select.find("option:selected").attr("data-type"),
          varType: $select.find("option:selected").attr("data-vartype"),
        },
        $select
      );
    } else {
      var stepID = $select
        .find("option")
        .first()
        .attr("value")
        .substr(0, $select.find("option").first().attr("value").indexOf("_"));
      var itemID = $select
        .find("option")
        .first()
        .attr("value")
        .substr(
          $select.find("option").first().attr("value").indexOf("_") + 1,
          $select.find("option").first().attr("value").length
        );
      var item = false;
      jQuery.each(lfb_steps, function () {
        var step = this;
        if (step.id == stepID) {
          jQuery.each(step.items, function () {
            if (this.id == itemID) {
              item = this;
            }
          });
        }
      });
      var options = lfb_conditionGetOperators(item, $select);
    }
    jQuery.each(options, function () {
      $operator.append(
        '<option value="' +
          this.value +
          '" data-variable="' +
          this.hasVariable +
          '">' +
          this.text +
          "</option>"
      );
    });

    $operator.on("change", function () {
      lfb_linksUpdateFields($(this));
    });
    var $col1 = $("<td></td>");
    $col1.append($select);
    $item.append($col1);
    var $col2 = $("<td></td>");
    $col2.append($operator);
    $item.append($col2);
    $item.append(
      '<td></td><td class="text-end"><a href="javascript:" class="lfb_conditionDelBtn text-danger" data-action="lfb_conditionRemove"><span class="fas fa-trash"></span></a> </td>'
    );

    $item.find('a[data-action="lfb_conditionRemove"]').on("click", function () {
      lfb_conditionRemove(this);
    });

    if (data && typeof data.action != "undefined") {
      $operator.val(data.action);
      $operator.trigger("change");

      if (data.value) {
        lfb_linksUpdateFields($operator, data);
      }
    }
    $operator.trigger("change");
    $select.trigger("change");
    //   $item.find('select').niceSelect();
    $("#lfb_calcConditionsTable tbody").append($item);

    setTimeout(function () {
      $item.find("select").trigger("change");
      $operator.trigger("change");
      $select.trigger("change");
    }, 400);
  }

  function lfb_addLinkInteraction(data) {
    var $item = $('<tr class="lfb_conditionItem"></tr>');
    var $select = $(
      '<select class="lfb_conditionSelect form-control"></select>'
    );
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;

        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type != "richtext" &&
          item.type != "colorpicker" &&
          item.type != "shortcode" &&
          item.type != "summary" &&
          item.type != "separator" &&
          item.type != "row" &&
          item.type != "layeredImage"
        ) {
          var itemID = step.id + "_" + item.id;
          $select.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    jQuery.each(lfb_currentForm.variables, function () {
      $select.append(
        '<option value="v_' +
          this.id +
          '" data-type="variable" data-vartype="' +
          this.type +
          '">' +
          lfb_data.texts["Variable"] +
          ' : " ' +
          this.title +
          ' "</option>'
      );
    });
    $select.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $select.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );
    var $operator = $(
      '<select class="lfb_conditionoperatorSelect form-control"></select>'
    );
    $select.on("change", function () {
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);
      var item = false;
      jQuery.each(lfb_steps, function () {
        var step = this;
        if (step.id == stepID) {
          jQuery.each(step.items, function () {
            if (this.id == itemID) {
              item = this;
            }
          });
        }
      });
      var operator = $(this)
        .parent()
        .parent()
        .find(".lfb_conditionoperatorSelect");
      operator.find("option").remove();
      if (
        $select.find("option:selected").is("[data-static]") ||
        $select.find("option:selected").is('[data-type="variable"]')
      ) {
        var options = lfb_conditionGetOperators(
          {
            type: $select.find("option:selected").attr("data-type"),
            varType: $select.find("option:selected").attr("data-vartype"),
          },
          $select
        );
      } else {
        var options = lfb_conditionGetOperators(item, $select);
      }
      jQuery.each(options, function () {
        operator.append(
          '<option value="' +
            this.value +
            '"  data-variable="' +
            this.hasVariable +
            '">' +
            this.text +
            "</option>"
        );
      });
      $operator.trigger("change");
    });
    if (data && typeof data.interaction != "undefined") {
      $select.val(data.interaction);
    }
    if (
      $select.find("option:selected").is("[data-static]") ||
      $select.find("option:selected").is('[data-type="variable"]')
    ) {
      var options = lfb_conditionGetOperators(
        {
          type: $select.find("option:selected").attr("data-type"),
          varType: $select.find("option:selected").attr("data-vartype"),
        },
        $select
      );
    } else {
      if ($select.val()) {
        var stepID = $select.val().substr(0, $select.val().indexOf("_"));
        var itemID = $select
          .val()
          .substr($select.val().indexOf("_") + 1, $select.val().length);
        var item = false;
        jQuery.each(lfb_steps, function () {
          var step = this;
          if (step.id == stepID) {
            jQuery.each(step.items, function () {
              if (this.id == itemID) {
                item = this;
              }
            });
          }
        });
        if ($select.val().substr(0, 6) == "_step-") {
          item = { type: "step" };
        }
        var options = lfb_conditionGetOperators(item, $select);
      }
    }
    jQuery.each(options, function () {
      $operator.append(
        '<option value="' +
          this.value +
          '" data-variable="' +
          this.hasVariable +
          '">' +
          this.text +
          "</option>"
      );
    });

    $operator.on("change", function () {
      lfb_linksUpdateFields($(this));
    });
    var $col1 = $("<td></td>");
    $col1.append($select);
    $item.append($col1);
    var $col2 = $("<td></td>");
    $col2.append($operator);
    $item.append($col2);
    $item.append(
      '<td></td><td class="text-end"><a href="javascript:" class="lfb_conditionDelBtn text-danger" data-action="lfb_conditionRemove"><span class="fas fa-trash"></span></a> </td>'
    );
    $item.find('a[data-action="lfb_conditionRemove"]').on("click", function () {
      lfb_conditionRemove(this);
    });

    if (data && typeof data.action != "undefined") {
      $operator.val(data.action);
      $operator.trigger("change");
      if (data.value) {
        $operator
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .val(data.value);
      }

      if (data.value) {
        lfb_linksUpdateFields($operator, data);
      }
    }
    $("#lfb_conditionsTable tbody").append($item);
    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_linksUpdateFields($operatorSelect, data) {
    $operatorSelect
      .closest(".lfb_conditionItem")
      .find(".lfb_conditionValue")
      .parent()
      .remove();
    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "textfield"
    ) {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><input type="text" placeholder="" class="lfb_conditionValue form-control" /> </div>'
          );
      }
    }

    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "numberfield"
    ) {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><input type="number" class="lfb_conditionValue form-control" /> </div>'
          );
      }
    }
    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "pricefield"
    ) {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><input type="number" step="any" class="lfb_conditionValue form-control" /> </div>'
          );
      }
    }

    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "datefield"
    ) {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><input type="text" step="any" class="lfb_conditionValue form-control"/> </div>'
          );
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .datetimepicker({
            format: "yyyy-mm-dd",
            showMeridian: lfb_data.dateMeridian == "1",
            container: "#lfb_form.lfb_bootstraped",
            minView: 2,
          })
          .on("show", function () {
            $(".datetimepicker .table-condensed .prev").show();
            $(".datetimepicker .table-condensed .switch").show();
            $(".datetimepicker .table-condensed .next").show();
          });
      }
    }
    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "timefield"
    ) {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><input type="text lfb_timepicker"  class="lfb_conditionValue form-control"/> </div>'
          );

        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .datetimepicker({
            showMeridian: lfb_data.dateMeridian == "1",
            container: "#lfb_form.lfb_bootstraped",
            format: "hh:ii",
            startView: 1,
          })
          .on("show", function () {
            $(".datetimepicker .table-condensed .prev").hide();
            $(".datetimepicker .table-condensed .switch").hide();
            $(".datetimepicker .table-condensed .next").hide();
          });
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .on("click", function () {
            $(this).datetimepicker("show");
          });
      }
    }
    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "datetimefield"
    ) {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><input type="text lfb_timepicker"  class="lfb_conditionValue form-control"/> </div>'
          );

        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .datetimepicker({
            showMeridian: $('#lfb_formFields [name="timeModeAM"]').is(
              ":checked"
            ),
            container: "#lfb_form.lfb_bootstraped",
            format: "yyyy-mm-dd hh:ii",
          })
          .on("show", function () {
            $(".datetimepicker .table-condensed .prev").show();
            $(".datetimepicker .table-condensed .switch").show();
            $(".datetimepicker .table-condensed .next").show();
          });
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue")
          .on("click", function () {
            $(this).datetimepicker("show");
          });
      }
    }

    if (
      $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionoperatorSelect option:selected")
        .attr("data-variable") == "select"
    ) {
      var optionsSelect = "";
      var $select = $operatorSelect
        .closest(".lfb_conditionItem")
        .find(".lfb_conditionSelect");
      var stepID = $select.val().substr(0, $select.val().indexOf("_"));
      var itemID = $select
        .val()
        .substr($select.val().indexOf("_") + 1, $select.val().length);

      var optionsString = "";
      jQuery.each(lfb_currentForm.steps, function () {
        if (this.id == stepID) {
          jQuery.each(this.items, function () {
            if (this.id == itemID) {
              optionsString = this.optionsValues;
            }
          });
        }
      });

      jQuery.each(lfb_currentForm.fields, function () {
        if (this.id == itemID) {
          optionsString = this.optionsValues;
        }
      });
      var optionsArray = optionsString.split("|");
      jQuery.each(optionsArray, function () {
        var value = this;
        if (value.indexOf(";;") > 0) {
          var valueArray = value.split(";;");
          value = valueArray[0];
        }
        if (value.length > 0) {
          optionsString +=
            '<option value="' + value + '">' + value + "</option>";
        }
      });

      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length == 0
      ) {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .children("td:eq(2)")
          .html(
            '<div><select class="lfb_conditionValue form-control">' +
              optionsString +
              "</select> </div>"
          );
      }
    }
    if ($("#lfb_winRedirection").css("display") == "none") {
      if (
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValue").length > 0
      ) {
        if (
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValueBtn").length == 0
        ) {
          var $btn = $(
            '<a href="javascript:"  class="lfb_conditionValueBtn"><span class="fas fa-list-alt"></span></a>'
          );
          $btn.on("click", function () {
            lfb_conditionValueBtnClick(this);
          });
          $operatorSelect
            .closest(".lfb_conditionItem")
            .children("td:eq(3)")
            .prepend($btn);
        }
        if (
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValueMenu").length == 0
        ) {
          var $menu = $('<div class="lfb_conditionValueMenu"></div>');
          var $menuItem = $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionSelect")
            .clone();
          $menuItem.on("change", function () {
            lfb_updateConditionValueElements(this);
          });
          $menuItem.css({
            width: "52%",
            display: "inline-block",
            marginRight: 5,
          });
          $menuItem
            .removeClass("lfb_conditionSelect")
            .addClass("lfb_conditionValueItemSelect");
          $menu.append($menuItem);

          var $menuElement = $(
            '<select class="form-control lfb_conditionAttributeMenu" style="width:45%;display:inline-block; float:right;"></select>'
          );
          $menuElement.append(
            '<option value="">' + lfb_data.texts["price"] + "</value>"
          );
          $menuElement.append(
            '<option value="quantity">' +
              lfb_data.texts["quantity"] +
              "</value>"
          );
          $menuElement.append(
            '<option value="value">' + lfb_data.texts["value"] + "</value>"
          );
          $menu.append($menuElement);

          $operatorSelect
            .closest(".lfb_conditionItem")
            .children("td:eq(2)")
            .append($menu);
        }
      } else {
        $operatorSelect
          .closest(".lfb_conditionItem")
          .find(".lfb_conditionValueBtn")
          .remove();
      }
    }
    setTimeout(function () {
      if (data && data.value) {
        if (data.value.indexOf("_") > -1 && data.value.indexOf("-") > 0) {
          var itemID = data.value.substr(0, data.value.indexOf("-"));
          var attribute = data.value.substr(
            data.value.indexOf("-") + 1,
            data.value.length
          );
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValueItemSelect")
            .val(itemID);
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValueItemSelect")
            .trigger("change");
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionAttributeMenu")
            .val(attribute);
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValue")
            .parent()
            .hide();
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValueMenu")
            .show();
        } else {
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValueMenu")
            .hide();
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValue")
            .parent()
            .show();
          $operatorSelect
            .closest(".lfb_conditionItem")
            .find(".lfb_conditionValue")
            .val(data.value);
        }
      } else {
      }
      $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    }, 500);
  }

  function lfb_updateConditionValueElements(select) {
    var $selectItem = $(select);
    var $selectElement = $(select).next(".lfb_conditionAttributeMenu");
    $selectElement.val("");
    $selectElement.find('option[value="quantity"]').hide();
    $selectElement.find('option[value=""]').show();
    if ($selectItem.val() != "") {
      var selectedItemID = $selectItem.val();
      if (selectedItemID.indexOf("_") > 0) {
        selectedItemID = selectedItemID.substr(
          selectedItemID.indexOf("_") + 1,
          selectedItemID.length
        );
      }
      jQuery.each(lfb_currentForm.steps, function () {
        jQuery.each(this.items, function () {
          if (this.id == selectedItemID) {
            if (this.quantity_enabled == 1 || this.type == "slider") {
              $selectElement.find('option[value="quantity"]').show();
            } else {
              $selectElement.find('option[value="quantity"]').hide();
            }
            if (this.type == "numberfield") {
              $selectElement.find('option[value="value"]').show();
              $selectElement.find('option[value=""]').hide();
              $selectElement.val("value");
            } else if (
              this.type == "textfield" ||
              this.type == "select" ||
              this.type == "textarea" ||
              this.type == "datepicker" ||
              this.type == "timepicker"
            ) {
              $selectElement.find('option[value="value"]').show();
              $selectElement.find('option[value=""]').hide();
              $selectElement.val("value");
            } else {
              $selectElement.find('option[value="value"]').hide();
              $selectElement.find('option[value=""]').show();
            }
            if (this.type == "select") {
              $selectElement.find('option[value=""]').show();
            }
          }
        });
      });
      jQuery.each(lfb_currentForm.fields, function () {
        if (this.id == selectedItemID) {
          if (this.quantity_enabled == 1 || this.type == "slider") {
            $selectElement.find('option[value="quantity"]').show();
          } else {
            $selectElement.find('option[value="quantity"]').hide();
          }
          if (this.type == "numberfield") {
            $selectElement.find('option[value="value"]').show();
            $selectElement.find('option[value=""]').hide();
            $selectElement.val("value");
          } else if (
            this.type == "textfield" ||
            this.type == "select" ||
            this.type == "textarea" ||
            this.type == "datepicker" ||
            this.type == "timepicker"
          ) {
            $selectElement.find('option[value="value"]').show();
            $selectElement.find('option[value=""]').hide();
            $selectElement.val("value");
          } else {
            $selectElement.find('option[value="value"]').hide();
            $selectElement.find('option[value=""]').show();
          }
          if (this.type == "select") {
            $selectElement.find('option[value=""]').show();
          }
        }
      });

      if ($selectItem.val() == "_total") {
        $selectElement.find('option[value="quantity"]').hide();
        $selectElement.find('option[value=""]').show();
        $selectElement.val("");
      }
      if ($selectItem.val() == "_total_qt") {
        $selectElement.find('option[value="quantity"]').show();
        $selectElement.find('option[value=""]').hide();
        $selectElement.val("quantity");
      }
    }
  }

  function lfb_conditionValueBtnClick(btn) {
    var $btn = $(btn);
    $btn
      .closest(".lfb_conditionItem")
      .find(".lfb_conditionValueItemSelect")
      .trigger("change");
    if (
      $btn
        .closest(".lfb_conditionItem")
        .children("td:eq(2)")
        .find("div:not(.lfb_conditionValueMenu)")
        .css("display") != "none"
    ) {
      $btn
        .closest(".lfb_conditionItem")
        .children("td:eq(2)")
        .find("div:not(.lfb_conditionValueMenu)")
        .hide();
      $btn
        .closest(".lfb_conditionItem")
        .children("td:eq(2)")
        .find("div.lfb_conditionValueMenu")
        .show();
    } else {
      $btn
        .closest(".lfb_conditionItem")
        .children("td:eq(2)")
        .find("div:not(.lfb_conditionValueMenu)")
        .show();
      $btn
        .closest(".lfb_conditionItem")
        .children("td:eq(2)")
        .find("div.lfb_conditionValueMenu")
        .hide();
    }
  }

  function lfb_conditionRemove(btn) {
    var $btn = $(btn);
    $btn.closest(".lfb_conditionItem").remove();
  }

  function lfb_getConditionValue($field, calculationMode) {
    var rep = "";
    if ($field != null && $field.length > 0) {
      rep = $field.val();
      if ($field.parent().css("display") == "none") {
        if (typeof calculationMode != "undefined" && calculationMode) {
          var itemID = 0;
          if (
            $field.closest("td").find(".lfb_conditionValueItemSelect").val() ==
            "_total_qt"
          ) {
            rep = "[total_quantity]";
          } else if (
            $field.closest("td").find(".lfb_conditionValueItemSelect").val() ==
            "_total"
          ) {
            rep = "[total_quantity]";
          } else {
            itemID = $field
              .closest("td")
              .find(".lfb_conditionValueItemSelect")
              .val()
              .substr(
                $field
                  .closest("td")
                  .find(".lfb_conditionValueItemSelect")
                  .val()
                  .indexOf("_") + 1,
                $field.closest("td").find(".lfb_conditionValueItemSelect").val()
                  .length
              );
          }
          var attribute = $field
            .closest("td")
            .find(".lfb_conditionAttributeMenu")
            .val();
          if (attribute == "") {
            attribute = "price";
          }
          rep = "[item-" + itemID + "_" + attribute + "]";
        } else {
          rep =
            $field.closest("td").find(".lfb_conditionValueItemSelect").val() +
            "-" +
            $field.closest("td").find(".lfb_conditionAttributeMenu").val();
        }
      }
    }
    return rep;
  }

  function lfb_linkSave() {
    if (lfb_canSaveLink) {
      lfb_canSaveLink = false;
      lfb_links[lfb_currentLinkIndex].conditions = new Array();
      $(".lfb_conditionItem").each(function () {
        lfb_links[lfb_currentLinkIndex].conditions.push({
          interaction: $(this).find(".lfb_conditionSelect").val(),
          action: $(this).find(".lfb_conditionoperatorSelect").val(),
          value: lfb_getConditionValue($(this).find(".lfb_conditionValue")),
        });
      });
      lfb_links[lfb_currentLinkIndex].operator = $("#lfb_linkOperator").val();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveLink",
          formID: lfb_currentFormID,
          linkID: lfb_links[lfb_currentLinkIndex].id,
          operator: lfb_links[lfb_currentLinkIndex].operator,
          originID: lfb_links[lfb_currentLinkIndex].originID,
          destinationID: lfb_links[lfb_currentLinkIndex].destinationID,
          conditions: JSON.stringify(
            lfb_links[lfb_currentLinkIndex].conditions
          ),
        },
        success: function () {
          lfb_updateStepCanvas();
          $('a[data-action="lfb_returnStepManager"]').trigger("click");
          lfb_repositionLinks();
          setTimeout(lfb_repositionLinks, 200);
          lfb_canSaveLink = true;
        },
      });
    }
  }

  function lfb_linkDel() {
    if (lfb_canSaveLink) {
      $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();

      $('a[data-action="showStepsManager"]').trigger("click");

      $(".lfb_linkPoint[data-linkindex=" + lfb_currentLinkIndex + "]").remove();
      lfb_canSaveLink = false;
      setTimeout(function () {
        lfb_canSaveLink = true;
      }, 1500);

      var linkID = lfb_links[lfb_currentLinkIndex].id;
      lfb_links.splice(
        jQuery.inArray(lfb_links[lfb_currentLinkIndex], lfb_links),
        1
      );
      $('.lfb_linkPoint[data-linkid="61"]').remove();
      lfb_updateStepCanvas();

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_removeLink",
          formID: lfb_currentFormID,
          linkID: linkID,
        },
        success: function () {},
      });
    }
  }

  function lfb_conditionGetOperators(item, $select) {
    var options = new Array();
    switch (item.type) {
      case "step":
        options.push({
          value: "superior",
          text: lfb_data.texts["isSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "inferior",
          text: lfb_data.texts["isInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "numberfield",
        });
        break;
      case "totalPrice":
        options.push({
          value: "superior",
          text: lfb_data.texts["isSuperior"],
          hasVariable: "pricefield",
        });
        options.push({
          value: "inferior",
          text: lfb_data.texts["isInferior"],
          hasVariable: "pricefield",
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "pricefield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "pricefield",
        });
        break;
      case "totalQt":
        options.push({
          value: "superior",
          text: lfb_data.texts["isSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "inferior",
          text: lfb_data.texts["isInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "numberfield",
        });
        break;
      case "variable":
        if (typeof item.varType != "undefined" && item.varType == "text") {
          options.push({
            value: "filled",
            text: lfb_data.texts["isFilled"],
          });
          options.push({
            value: "equal",
            text: lfb_data.texts["isEqual"],
            hasVariable: "textfield",
          });
          options.push({
            value: "different",
            text: lfb_data.texts["isntEqual"],
            hasVariable: "textfield",
          });
        } else {
          options.push({
            value: "superior",
            text: lfb_data.texts["isSuperior"],
            hasVariable: "numberfield",
          });
          options.push({
            value: "inferior",
            text: lfb_data.texts["isInferior"],
            hasVariable: "numberfield",
          });
          options.push({
            value: "equal",
            text: lfb_data.texts["isEqual"],
            hasVariable: "numberfield",
          });
          options.push({
            value: "different",
            text: lfb_data.texts["isntEqual"],
            hasVariable: "numberfield",
          });
        }
        break;

      case "picture":
        options.push({
          value: "clicked",
          text: lfb_data.texts["isSelected"],
        });
        options.push({
          value: "unclicked",
          text: lfb_data.texts["isUnselected"],
        });
        options.push({
          value: "PriceSuperior",
          text: lfb_data.texts["isPriceSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceInferior",
          text: lfb_data.texts["isPriceInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceEqual",
          text: lfb_data.texts["isPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceDifferent",
          text: lfb_data.texts["isntPriceEqual"],
          hasVariable: "numberfield",
        });
        if (item.quantity_enabled == "1") {
          options.push({
            value: "QtSuperior",
            text: lfb_data.texts["isQuantitySuperior"],
            hasVariable: "numberfield",
          });
          options.push({
            value: "QtInferior",
            text: lfb_data.texts["isQuantityInferior"],
            hasVariable: "numberfield",
          });
          options.push({
            value: "QtEqual",
            text: lfb_data.texts["isQuantityEqual"],
            hasVariable: "numberfield",
          });
          options.push({
            value: "QtDifferent",
            text: lfb_data.texts["isntQuantityEqual"],
            hasVariable: "numberfield",
          });
        }
        break;
      case "button":
        options.push({
          value: "clicked",
          text: lfb_data.texts["isSelected"],
        });
        options.push({
          value: "unclicked",
          text: lfb_data.texts["isUnselected"],
        });
        options.push({
          value: "PriceSuperior",
          text: lfb_data.texts["isPriceSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceInferior",
          text: lfb_data.texts["isPriceInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceEqual",
          text: lfb_data.texts["isPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceDifferent",
          text: lfb_data.texts["isntPriceEqual"],
          hasVariable: "numberfield",
        });
        break;
      case "imageButton":
        options.push({
          value: "clicked",
          text: lfb_data.texts["isSelected"],
        });
        options.push({
          value: "unclicked",
          text: lfb_data.texts["isUnselected"],
        });
        options.push({
          value: "PriceSuperior",
          text: lfb_data.texts["isPriceSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceInferior",
          text: lfb_data.texts["isPriceInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceEqual",
          text: lfb_data.texts["isPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceDifferent",
          text: lfb_data.texts["isntPriceEqual"],
          hasVariable: "numberfield",
        });
        break;

      case "slider":
        options.push({
          value: "PriceSuperior",
          text: lfb_data.texts["isPriceSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceInferior",
          text: lfb_data.texts["isPriceInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceEqual",
          text: lfb_data.texts["isPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceDifferent",
          text: lfb_data.texts["isntPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "QtSuperior",
          text: lfb_data.texts["isQuantitySuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "QtInferior",
          text: lfb_data.texts["isQuantityInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "QtEqual",
          text: lfb_data.texts["isQuantityEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "QtDifferent",
          text: lfb_data.texts["isntQuantityEqual"],
          hasVariable: "numberfield",
        });
        break;

      case "textfield":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "textfield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "textfield",
        });
        break;
      case "rate":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        options.push({
          value: "superior",
          text: lfb_data.texts["isSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "inferior",
          text: lfb_data.texts["isInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "numberfield",
        });
        break;
      case "numberfield":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        options.push({
          value: "superior",
          text: lfb_data.texts["isSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "inferior",
          text: lfb_data.texts["isInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "numberfield",
        });
        break;
      case "textarea":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        break;
      case "datepicker":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        if ($select.find("option:selected").is('[data-datetype="date"]')) {
          options.push({
            value: "superior",
            text: lfb_data.texts["isSuperior"],
            hasVariable: "datefield",
          });
          options.push({
            value: "inferior",
            text: lfb_data.texts["isInferior"],
            hasVariable: "datefield",
          });
          options.push({
            value: "equal",
            text: lfb_data.texts["isEqual"],
            hasVariable: "datefield",
          });
          options.push({
            value: "different",
            text: lfb_data.texts["isntEqual"],
            hasVariable: "datefield",
          });
        } else if (
          $select.find("option:selected").is('[data-datetype="time"]')
        ) {
          options.push({
            value: "superior",
            text: lfb_data.texts["isSuperior"],
            hasVariable: "timefield",
          });
          options.push({
            value: "inferior",
            text: lfb_data.texts["isInferior"],
            hasVariable: "timefield",
          });
          options.push({
            value: "equal",
            text: lfb_data.texts["isEqual"],
            hasVariable: "timefield",
          });
          options.push({
            value: "different",
            text: lfb_data.texts["isntEqual"],
            hasVariable: "timefield",
          });
        } else if (
          $select.find("option:selected").is('[data-datetype="dateTime"]')
        ) {
          options.push({
            value: "superior",
            text: lfb_data.texts["isSuperior"],
            hasVariable: "datetimefield",
          });
          options.push({
            value: "inferior",
            text: lfb_data.texts["isInferior"],
            hasVariable: "datetimefield",
          });
          options.push({
            value: "equal",
            text: lfb_data.texts["isEqual"],
            hasVariable: "datetimefield",
          });
          options.push({
            value: "different",
            text: lfb_data.texts["isntEqual"],
            hasVariable: "datetimefield",
          });
        }

        break;
      case "timepicker":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        options.push({
          value: "superior",
          text: lfb_data.texts["isSuperior"],
          hasVariable: "timefield",
        });
        options.push({
          value: "inferior",
          text: lfb_data.texts["isInferior"],
          hasVariable: "timefield",
        });
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "timefield",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "timefield",
        });
        break;
      case "select":
        options.push({
          value: "equal",
          text: lfb_data.texts["isEqual"],
          hasVariable: "select",
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
          hasVariable: "select",
        });
        options.push({
          value: "PriceSuperior",
          text: lfb_data.texts["isPriceSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceInferior",
          text: lfb_data.texts["isPriceInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceEqual",
          text: lfb_data.texts["isPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceDifferent",
          text: lfb_data.texts["isntPriceEqual"],
          hasVariable: "numberfield",
        });

        break;
      case "filefield":
        options.push({
          value: "filled",
          text: lfb_data.texts["isFilled"],
        });
        break;
      case "checkbox":
        options.push({
          value: "clicked",
          text: lfb_data.texts["isSelected"],
        });
        options.push({
          value: "unclicked",
          text: lfb_data.texts["isUnselected"],
        });
        options.push({
          value: "PriceSuperior",
          text: lfb_data.texts["isPriceSuperior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceInferior",
          text: lfb_data.texts["isPriceInferior"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceEqual",
          text: lfb_data.texts["isPriceEqual"],
          hasVariable: "numberfield",
        });
        options.push({
          value: "PriceDifferent",
          text: lfb_data.texts["isntPriceEqual"],
          hasVariable: "numberfield",
        });
        break;
      case "datefield":
        options.push({
          value: "filled",
          text: lfb_data.txt_filled,
        });
        options.push({
          value: "superior",
          text: lfb_data.txt_superiorTo,
        });
        options.push({
          value: "inferior",
          text: lfb_data.txt_inferiorTo,
        });
        options.push({
          value: "equal",
          text: lfb_data.txt_equalTo,
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
        });
        break;
      case "date":
        options.push({
          value: "superior",
          text: lfb_data.txt_superiorTo,
        });
        options.push({
          value: "inferior",
          text: lfb_data.txt_inferiorTo,
        });
        options.push({
          value: "equal",
          text: lfb_data.txt_equalTo,
        });
        options.push({
          value: "different",
          text: lfb_data.texts["isntEqual"],
        });
        break;
    }
    return options;
  }

  function lfb_updateWinItemPosition() {
    if ($("#lfb_winStep").css("display") != "none") {
      var $item = $("#" + $("#lfb_itemWindow").attr("data-item"));
      if ($item.length > 0) {
        $("#lfb_itemWindow").css({
          top:
            $item.offset().top -
            $("#lfb_bootstraped.lfb_bootstraped").offset().top +
            $item.outerHeight() +
            12,
          left:
            $item.offset().left -
            $("#lfb_bootstraped.lfb_bootstraped").offset().left,
        });
      } else {
        $("#lfb_itemWindow").fadeOut();
      }
    } else {
      $("#lfb_itemWindow").fadeOut();
    }
  }

  function lfb_checkEmail(emailToTest) {
    return emailToTest.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  function lfb_existInDefaultStep(itemID) {
    var rep = false;
    jQuery.each(lfb_defaultStep.interactions, function () {
      var interaction = this;
      if (interaction.itemID == itemID) {
        rep = true;
      }
    });
    return rep;
  }

  function lfb_removeAllSteps() {
    lfb_showLoader();
    setTimeout(function () {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_removeAllSteps",
          formID: lfb_currentFormID,
        },
        success: function () {
          lfb_loadForm(lfb_currentFormID);
        },
      });
    }, 300);
  }

  function lfb_addForm() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_addForm",
      },
      success: function (formID) {
        lfb_loadForm(formID);
      },
    });
  }

  function lfb_removeForm(formID) {
    $('#lfb_panelFormsList tr[data-formid="' + formID + '"]').remove();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeForm",
        formID: formID,
      },
      success: function () {},
    });
  }

  function lfb_saveForm() {
    var formData = {};
    var globalData = {};
    $("#lfb_formFields")
      .find("input,select,textarea")
      .each(function () {
        if (
          $(this).closest("#lfb_gdprSettings").length == 0 &&
          $(this).closest("#lfb_fieldBubble").length == 0 &&
          $(this).closest("#lfb_couponsTable").length == 0 &&
          $(this).closest("#lfb_distanceValueBubble").length == 0 &&
          $(this).closest("#lfb_calculationDatesDiffBubble").length == 0
        ) {
          if (!$(this).is('[data-switch="switch"]')) {
            eval("formData." + $(this).attr("name") + " = $(this).val();");
          } else {
            var value = 0;
            if ($(this).is(":checked")) {
              value = 1;
            }
            eval("formData." + $(this).attr("name") + " = value;");
          }
        }
      });
    $("#lfb_gdprSettings")
      .find("input,select,textarea")
      .each(function () {
        if (!$(this).is('[data-switch="switch"]')) {
          eval("globalData." + $(this).attr("name") + " = $(this).val();");
        } else {
          var value = 0;
          if ($(this).is(":checked")) {
            value = 1;
          }
          eval("globalData." + $(this).attr("name") + " = value;");
        }
      });
    if ($('#lfb_formFields [name="encryptDB"]').is(":checked")) {
      globalData.encryptDB = 1;
    } else {
      globalData.encryptDB = 0;
    }
    formData.pdf_adminContent = lfb_getEmailPdfContent(
      $("#pdf_adminContent").summernote("code")
    );
    formData.pdf_userContent = lfb_getEmailPdfContent(
      $("#pdf_userContent").summernote("code")
    );
    formData.email_adminContent = lfb_getEmailPdfContent(
      $("#email_adminContent").summernote("code")
    );
    formData.email_userContent = lfb_getEmailPdfContent(
      $("#email_userContent").summernote("code")
    );
    formData.legalNoticeContent = $("#lfb_legalNoticeContent").summernote(
      "code"
    );
    formData.emailVerificationContent = $(
      "#lfb_emailVerificationContent"
    ).summernote("code");
    formData.customCss = lfb_editorCustomCSS.getValue();
    formData.customJS = lfb_editorCustomJS.getValue();
    formData.lastSave = Date.now();

    formData.action = "lfb_saveForm";
    formData.formID = lfb_currentFormID;
    formData.globalData = JSON.stringify(globalData);

    lfb_disableLinksAnim = false;
    if (formData.disableLinksAnim == 1) {
      // lfb_disableLinksAnim = true;
    }
    clearInterval(lfb_canvasTimer);
    lfb_canvasTimer = setInterval(function () {
      if (!lfb_disableLinksAnim || lfb_isLinking) {
        lfb_updateStepCanvas();
      }
    }, 60);
    if (lfb_disableLinksAnim) {
      lfb_updateStepCanvas();
    }
    lfb_currentForm.form = formData;
    if (formData.useVisualBuilder == 1) {
      $("#lfb_finalStepVisualBtn").show();
      $("#lfb_finalStepItemsList").hide();
    } else {
      $("#lfb_finalStepVisualBtn").hide();
      $("#lfb_finalStepItemsList").show();
    }

    if (formData.useVisualBuilder == 1) {
      $('#lfb_formFields [name="alignLeft"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="alignLeft"]').closest(".form-group").hide();
      $('#lfb_formFields [name="inlineLabels"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_formFields [name="inlineLabels"]').closest(".form-group").hide();
    }

    if (formData.useVisualBuilder == 1) {
      $("#lfb_finalStepVisualBtn").show();
      $("#lfb_finalStepItemsList").hide();
    } else {
      $("#lfb_finalStepVisualBtn").hide();
      $("#lfb_finalStepItemsList").show();
    }
    $('a[data-btnaction="saveForm"] .fas')
      .removeClass("fa-save")
      .addClass("fa-sync-alt")
      .addClass("lfb_loadingBtn");

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: formData,
      success: function () {
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
        $('a[data-btnaction="saveForm"] .fas')
          .removeClass("fa-sync-alt")
          .addClass("fa-save")
          .removeClass("lfb_loadingBtn");
      },
    });
  }

  function lfb_editField(fieldID) {
    $("#lfb_fieldBubble").find("input,textarea").val("");
    $("#lfb_fieldBubble").find("select option").removeAttr("selected");
    $("#lfb_fieldBubble")
      .find("select option:eq(0)")
      .attr("selected", "selected");
    if (fieldID > 0) {
      jQuery.each(lfb_currentForm.fields, function () {
        var field = this;
        if (field.id == fieldID) {
          $("#lfb_fieldBubble")
            .find("input,select,textarea")
            .each(function () {
              eval("$(this).val(field." + $(this).attr("name") + ");");
            });
        }
      });
      $("#lfb_fieldBubble").css({
        left: $(
          '#lfb_finalStepFields tr[data-fieldid="' + fieldID + '"] td:eq(0) a'
        ).offset().left,
        top: $(
          '#lfb_finalStepFields tr[data-fieldid="' + fieldID + '"] td:eq(0) a'
        ).offset().top,
      });
    } else {
      $("#lfb_fieldBubble").find('input[name="id"]').val(0);
      $("#lfb_fieldBubble").css({
        left: $("#lfb_addFieldBtn").offset().left,
        top: $("#lfb_addFieldBtn").offset().top + 18,
      });
    }
    $("#lfb_fieldBubble").fadeIn();
    $("#lfb_fieldBubble").addClass("lfb_hover");
    setTimeout(function () {
      $("#lfb_fieldBubble").removeClass("lfb_hover");
    }, 50);
  }

  function lfb_saveField() {
    lfb_showLoader();
    $("#lfb_fieldBubble").fadeOut();
    var fieldData = {};
    $("#lfb_fieldBubble")
      .find("input,select,textarea")
      .each(function () {
        eval("fieldData." + $(this).attr("name") + " = $(this).val();");
      });
    fieldData.action = "lfb_saveField";
    fieldData.formID = lfb_currentFormID;
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: fieldData,
      success: function () {
        lfb_loadFields();
      },
    });
  }

  function lfb_loadFields() {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_loadFields",
        formID: lfb_currentFormID,
      },
      success: function (fields) {
        $("#lfb_finalStepFields table tbody").html("");
        if (fields != "[]") {
          fields = JSON.parse(fields);
          lfb_currentForm.fields = fields;
          jQuery.each(fields, function () {
            var field = this;
            if (field.type != "row") {
              var $tr = $('<tr data-fieldid="' + field.id + '"></tr>');
              $tr.append(
                '<td><a href="javascript:" data-action="lfb_editItem">' +
                  field.title +
                  "</a></td>"
              );
              $tr.append("<td>" + field.type + "</td>");
              $tr.append("<td>" + field.groupitems + "</td>");
              $tr.append(
                "<td>" +
                  '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
                  lfb_data.texts["edit"] +
                  '" data-action="lfb_editItem" class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a>' +
                  '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
                  lfb_data.texts["duplicate"] +
                  '" data-action="lfb_duplicateItemLastStep" class="btn btn-sm btn-outline-secondary btn-circle"><span class="far fa-copy"></span></a>' +
                  '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
                  lfb_data.texts["remove"] +
                  '" data-action="lfb_removeItem" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a>' +
                  "</td>"
              );
              $tr
                .find('a[data-action="lfb_editItem"]')
                .on("click", function () {
                  lfb_editItem($(this).closest("tr").attr("data-fieldid"));
                });
              $tr
                .find('a[data-action="lfb_duplicateItemLastStep"]')
                .on("click", function () {
                  lfb_duplicateItemLastStep(
                    $(this).closest("tr").attr("data-fieldid")
                  );
                });
              $tr
                .find('a[data-action="lfb_removeItem"]')
                .on("click", function () {
                  lfb_removeItem($(this).closest("tr").attr("data-fieldid"));
                });
              $tr.find('[data-toggle="tooltip"]').tooltip();
              $("#lfb_finalStepFields table tbody").append($tr);
            }
            if (lfb_data.designForm == 0) {
              $("#lfb_loader").fadeOut();
              $("#lfb_loaderText").html("");
            }
          });
        }
      },
    });
  }

  function lfb_removeField(fieldID) {
    $(
      '#lfb_finalStepFields table tr[data-fieldid="' + fieldID + '"]'
    ).slideUp();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeField",
        fieldID: fieldID,
      },
    });
  }

  function lfb_repositionLinks() {
    var linksPointsToReposition = new Array();
    for (var i = 0; i < lfb_links.length; i++) {
      linksPointsToReposition.push(i);
    }
    lfb_repositionLinkPoints(linksPointsToReposition);
  }

  function lfb_loadForm(formID, callback) {
    lfb_currentFormID = formID;

    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    $("#lfb_btnLogsForm").attr("data-formid", formID);
    lfb_showLoader();
    setTimeout(function () {
      $("#adminmenumain").hide();
      $("#wpcontent").css({ marginLeft: 0 });
    }, 300);

    $(
      "#lfb_stepsContainer .lfb_stepBloc,.lfb_loadSteps,.lfb_linkPoint"
    ).remove();
    $("#lfb_formFields")
      .find("#lfb_itemPricesGrid tbody tr")
      .not(".static")
      .remove();
    $("#lfb_logsBtn").attr("data-formid", formID);
    $("#lfb_chartsBtn").attr("data-formid", formID);
    lfb_initFormsTopBtns(formID);
    $('a[data-action="previewForm"]')
      .unbind("click")
      .on("click", function () {
        lfb_openFormPreview(formID);
      });
    $('#lfb_formSettingsSidebar a[data-panel="#lfb_tabGeneral"]').trigger(
      "click"
    );
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_loadForm",
        formID: formID,
      },
      success: function (rep) {
        rep = JSON.parse(rep);
        lfb_currentForm = rep;
        lfb_loadFields();
        lfb_params = rep.params;
        lfb_steps = rep.steps;

        if (lfb_currentForm.form.useVisualBuilder == 1) {
          $("#lfb_finalStepVisualBtn").show();
          $("#lfb_finalStepItemsList").hide();
        } else {
          $("#lfb_finalStepVisualBtn").hide();
          $("#lfb_finalStepItemsList").show();
        }

        if (lfb_currentForm.form.useVisualBuilder == 1) {
          $('#lfb_formFields [name="alignLeft"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $('#lfb_formFields [name="alignLeft"]').closest(".form-group").hide();
          $('#lfb_formFields [name="inlineLabels"]')
            .parent()
            .bootstrapSwitch("setState", false);
          $('#lfb_formFields [name="inlineLabels"]')
            .closest(".form-group")
            .hide();
        }

        if (lfb_currentForm.form.useVisualBuilder == 1) {
          $("#lfb_finalStepVisualBtn").show();
          $("#lfb_finalStepItemsList").hide();
        } else {
          $("#lfb_finalStepVisualBtn").hide();
          $("#lfb_finalStepItemsList").show();
        }

        lfb_disableLinksAnim = false;
        if (rep.form.disableLinksAnim == "1") {
          //   lfb_disableLinksAnim = true;
        }
        lfb_updateLastStepTab();

        $("#lfb_formFields")
          .find("input,select,textarea")
          .each(function () {
            if (
              !$(this).is('[data-name="encryptDB"]') &&
              $(this).closest("#lfb_gdprSettings").length == 0 &&
              $(this).closest("#lfb_calculationDatesDiffBubble").length == 0 &&
              $(this).closest("#lfb_calculationValueBubble").length == 0
            ) {
              if ($(this).is('[data-switch="switch"]')) {
                var value = false;
                eval(
                  "if(rep.form." +
                    $(this).attr("name") +
                    " == 1){$(this).attr('checked','checked');} else {$(this).attr('checked',false);}"
                );
                eval(
                  "if(rep.form." +
                    $(this).attr("name") +
                    ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
                );

                var self = this;
                if ($(self).closest(".form-group").find("small").length > 0) {
                  $(self)
                    .closest(".has-switch")
                    .tooltip({
                      container: "#lfb_bootstraped",
                      title: $(self)
                        .closest(".form-group")
                        .find("small")
                        .html(),
                    });
                }
              } else if ($(this).is("pre")) {
                eval("$(this).html(rep.form." + $(this).attr("name") + ");");
              } else {
                eval("$(this).val(rep.form." + $(this).attr("name") + ");");
              }
            }
          });

        $('#lfb_formFields [name="fieldsPreset"]').trigger("change");
        $('#lfb_formFields [name="paymentType"]').val(rep.form.paymentType);
        lfb_initFormsBackend();

        $("#lfb_itemRichText").summernote({
          height: 300,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteCustomContentToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#lfb_tabEmail").show();
        $("#lfb_emailVerificationContent").summernote({
          height: 200,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#lfb_emailVerificationContent").summernote(
          rep.form.emailVerificationContent
        );
        $("#email_adminContent").summernote({
          height: 300,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#email_adminContent").summernote(
          "code",
          rep.form.email_adminContent
        );

        $("#lfb_formEmailUser").show();
        $("#email_userContent").summernote({
          height: 300,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#email_userContent").summernote("code", rep.form.email_userContent);

        $("#pdf_adminContent").summernote({
          height: 300,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#pdf_adminContent").summernote("code", rep.form.pdf_adminContent);

        $("#pdf_userContent").summernote({
          height: 300,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#pdf_userContent").summernote("code", rep.form.pdf_userContent);

        $("#lfb_legalNoticeContent").summernote({
          height: 180,
          minHeight: null,
          maxHeight: null,
          toolbar: lfb_summernoteToolbar,
          buttons: lfb_summernoteBtns,
          callbacks: {
            onFocus: function () {
              $(this).next(".note-editor").addClass("lfb-focus");
            },
            onBlur: function () {
              $(this).next(".note-editor").removeClass("lfb-focus");
            },
          },
        });
        $("#lfb_legalNoticeContent").summernote(
          "code",
          rep.form.legalNoticeContent
        );
        $(".note-editor .btn.dropdown-toggle").addClass("lfb_close");
        $(".note-editor .btn.dropdown-toggle").on("click", function () {
          if ($(this).is(".lfb_close")) {
            $(this).removeClass("lfb_close");
            $(this).next(".dropdown-menu").show();
          } else {
            $(this).addClass("lfb_close");
            $(this).next(".dropdown-menu").hide();
          }
        });

        $('.note-editor [data-toggle="tooltip"]').tooltip({
          container: "#lfb_bootstraped",
          placement: "bottom",
          boundary: "window",
        });

        if (rep.form.customJS) {
          lfb_editorCustomJS.setValue(rep.form.customJS);
        }
        if (rep.form.customCss) {
          lfb_editorCustomCSS.setValue(rep.form.customCss);
        }
        setTimeout(function () {
          lfb_editorCustomJS.refresh();
          lfb_editorCustomCSS.refresh();
        }, 100);
        $(".imageBtn").on("click", function () {
          lfb_formfield = $(this).prev("input");
          tb_show("", "media-upload.php?TB_iframe=true");
          return false;
        });

        if (!$('#lfb_formFields [name="email_toUser"]').is(":checked")) {
          $("#lfb_formEmailUser").hide();
        }
        $("#lfb_tabEmail").attr("style", "");
        $("#lfb_tabEmail").prop("style", "");

        $("#lfb_formFields .colorpick").each(function () {
          var $this = $(this);
          if ($(this).next(".lfb_colorPreview").length == 0) {
            $(this).after(
              '<div class="lfb_colorPreview" style="background-color:#' +
                $this.val().substr(1, 7) +
                '"></div>'
            );
          }
          $(this)
            .next(".lfb_colorPreview")
            .on("click", function () {
              $(this).prev(".colorpick").trigger("click");
            });
          $(this).colpick({
            color: $this.val().substr(1, 7),
            onBeforeShow: function () {
              $(".colpick").hide();
            },
            onChange: function (hsb, hex, rgb, el, bySetColor) {
              $(el).val("#" + hex);
              $(el)
                .closest(".form-group")
                .find(".lfb_colorPreview")
                .css({
                  backgroundColor: "#" + hex,
                });
            },
          });
        });
        lfb_updateFormVariablesTable();
        jQuery.each(rep.steps, function (index) {
          var step = this;
          if (step.content != "") {
            step.content = step.content.replace('}"', "}");
            step.content = step.content.replace('"{', "{");
            try {
              step.content = JSON.parse(step.content);
              lfb_addStep(step);
            } catch (e) {}
          }
        });
        lfb_lastCreatedStepID = 0;
        jQuery.each(rep.links, function (index) {
          var link = this;
          link.originID = $(
            '.lfb_stepBloc[data-stepid="' + link.originID + '"]'
          ).attr("id");
          link.destinationID = $(
            '.lfb_stepBloc[data-stepid="' + link.destinationID + '"]'
          ).attr("id");
          link.conditions = JSON.parse(link.conditions);
          lfb_links[index] = link;
        });
        if (lfb_canvasTimer) {
          clearInterval(lfb_canvasTimer);
        }
        lfb_canvasTimer = setInterval(function () {
          if (!lfb_disableLinksAnim || lfb_isLinking) {
            lfb_updateStepCanvas();
          }
        }, 60);

        setTimeout(function () {
          lfb_repositionLinks();
        }, 100);

        jQuery.each(rep.redirections, function (index) {
          var tr = $('<tr data-id="' + this.id + '"></tr>');
          tr.append("<td>" + this.url + "</td>");
          tr.append(
            '<td><a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
              lfb_data.texts["edit"] +
              '" data-action="lfb_editRedirection" class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="lfb_removeRedirection" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a></td>'
          );
          tr.find('a[data-action="lfb_editRedirection"]').on(
            "click",
            function () {
              lfb_editRedirection($(this).closest("tr").attr("data-id"));
            }
          );
          tr.find('a[data-action="lfb_removeRedirection"]').on(
            "click",
            function () {
              lfb_removeRedirection($(this).closest("tr").attr("data-id"));
            }
          );
          $("#lfb_redirsTable tbody").append(tr);
        });

        $("#lfb_formFields").find("input.lfb_iconField").trigger("change");
        $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
        $("#lfb_panelPreview").removeClass("lfb_hidden");

        $("#lfb_panelsContainer>div").addClass("lfb_hidden");
        $("#lfb_winStep").removeClass("lfb_hidden");

        $("#lfb_couponsTable tbody").html("");
        jQuery.each(rep.coupons, function () {
          var coupon = this;

          if (coupon.reductionType == "percentage") {
            coupon.reduction = "-" + coupon.reduction + "%";
          } else {
            coupon.reduction = "-" + parseFloat(coupon.reduction).toFixed(2);
          }

          var tdAction = $(
            '<td style="text-align:right;">' +
              '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
              lfb_data.texts["edit"] +
              '" data-action="lfb_editCoupon" class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a>' +
              '<a href="javascript:"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
              lfb_data.texts["remove"] +
              '" data-action="lfb_removeCoupon" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a>' +
              "</td>"
          );
          tdAction
            .find('a[data-action="lfb_editCoupon"]')
            .on("click", function () {
              lfb_editCoupon($(this).closest("tr").attr("data-couponid"));
            });
          tdAction
            .find('a[data-action="lfb_removeCoupon"]')
            .on("click", function () {
              lfb_removeCoupon($(this).closest("tr").attr("data-couponid"));
            });
          var tr = $('<tr data-couponid="' + coupon.id + '"></div>');
          tr.append("<td>" + coupon.couponCode + "</td>");
          tr.append("<td>" + coupon.useMax + "</td>");
          tr.append("<td>" + coupon.currentUses + "</td>");
          tr.append("<td>" + coupon.reduction + "</td>");
          tr.append(tdAction);
          $("#lfb_couponsTable tbody").append(tr);
        });

        $("input.lfb_timepicker").each(function () {
          $(this).datetimepicker({
            showMeridian: $('#lfb_formFields [name="timeModeAM"]').is(
              ":checked"
            ),
            container: "#lfb_form.lfb_bootstraped",
            format: "HH:mm",
          });
          $(this).on("click", function () {
            $(this).datetimepicker("show");
          });
        });

        $("#lfb_finalStepFields table tbody tr").each(function () {
          var itemType = $(this).find("td:eq(1)").text();
          if (
            $("#lfb_winItem").find(
              '[name="type"] option[value="' + itemType + '"]'
            ).length > 0
          ) {
            var typeName = $("#lfb_winItem")
              .find('[name="type"] option[value="' + itemType + '"]')
              .text();
            $(this).find("td:eq(1)").html(typeName);
          }
        });

        lfb_updateStepsDesign();
        //  $('#lfb_bootstraped.lfb_panel,#wpcontent,body').addClass('lfb_fullscreen');

        if (lfb_openChartsAuto) {
          lfb_openChartsAuto = false;
          lfb_loadCharts(formID);
        } else {
          if (lfb_data.designForm == 0) {
            if (typeof callback == "undefined") {
              $("#lfb_loader").delay(1000).fadeOut();
            }
          }
        }
        if (typeof lfb_settings != "undefined" && lfb_settings.encryptDB == 1) {
          $('#lfb_formFields [name="encryptDB"]')
            .parent()
            .bootstrapSwitch("setState", true);
        } else {
          $('#lfb_formFields [name="encryptDB"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }

        $("#lfb_emailTemplateAdmin").css({
          minHeight: $("#lfb_emailTemplateCustomer").outerHeight(),
        });
        setTimeout(function () {
          $('a[href="#collapse-lfb_tabEmail"]').on("click", lfb_openEmailTab);
          lfb_updateStepsDesign();
          lfb_updateStepCanvas();
        }, 250);

        if (lfb_data.designForm != 0) {
          lfb_data.designForm = 0;
          window.history.pushState(
            "lfb",
            document.title,
            "admin.php?page=lfb_menu"
          );
          lfb_openFormDesigner();
        }
        if (rep.steps.length > 0) {
          $("#lfb_noStepsMsg").removeClass("hidden");
        } else {
          $("#lfb_noStepsMsg").addClass("hidden");
        }

        jQuery.each(rep.fields, function (index) {
          if (this.type == "datepicker") {
            $('#lfb_winItem [name="minDatepicker"]').append(
              '<option value="' +
                this.id +
                '">' +
                lfb_data.texts["lastStep"] +
                " > " +
                this.title +
                "</option>"
            );
          }
        });
        $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
          "update"
        );

        if (lfb_openAction == "viewOrders") {
          $('a[data-action="viewFormLogs"]').trigger("click");
        } else if (lfb_openAction == "viewCharts") {
          $('a[data-action="viewFormCharts"]').trigger("click");
        } else {
          $('a[data-action="showStepsManager"]').trigger("click");
        }
        setTimeout(function () {
          $("#lfb_editFormNavbar").addClass("lfb_ready");
          $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
            "update"
          );
          setTimeout(function () {
            $(window).trigger("resize");
          }, 800);
        }, 1800);
        if (typeof callback != "undefined") {
          callback();
        }
      },
    });
    $("body").trigger("lfb_onFormLoaded");
  }

  function lfb_openEmailTab() {
    setTimeout(function () {
      $("#lfb_emailTemplateAdmin").css({
        minHeight: $("#lfb_emailTemplateCustomer").outerHeight(),
      });
    }, 100);
  }

  function lfb_initCharts() {
    if (typeof google != "undefined") {
      google.charts.load("current", { packages: ["corechart"] });
    }
  }

  function lfb_openCharts(formID) {
    lfb_openChartsAuto = true;
    lfb_loadForm(formID);
  }

  function lfb_closeCharts() {
    lfb_showLoader();
    $("#lfb_panelPreview").removeClass("lfb_hidden").show();
    $("#lfb_panelCharts").hide();
    lfb_loadForm($("#lfb_panelCharts").attr("data-formid"));
  }

  function lfb_loadCharts(formID) {
    $("#lfb_panelCharts").attr("data-formid", formID);

    var mode = $("#lfb_chartsTypeSelect").val();
    var year = $("#lfb_chartsYear").val();
    var month = $("#lfb_chartsMonth").val();
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_loadCharts",
        formID: formID,
        mode: mode,
        year: year,
        yearMonth: month,
      },
      success: function (rep) {
        var chkSubs = false;
        var rowsPrice = [];
        rep = rep.split("|");
        jQuery.each(rep, function () {
          if (this.indexOf(";") > -1) {
            var row = this.split(";");
            if (row[2] > 0) {
              chkSubs = true;
            }
            rowsPrice.push([
              row[0].toString(),
              parseFloat(row[1]),
              parseFloat(row[2]),
            ]);
          }
        });

        google.charts.setOnLoadCallback(function () {
          var data = new google.visualization.DataTable();
          data.addColumn("string", "X");
          data.addColumn("number", lfb_data.texts["oneTimePayment"]);
          data.addColumn("number", lfb_data.texts["subscriptions"]);

          var prefixCurrency = "";
          var suffixCurrency = "";
          if ($('#lfb_formFields [name="currencyPosition"]').val() == "right") {
            suffixCurrency = $('#lfb_formFields [name="currency"]').val();
          } else {
            prefixCurrency = $('#lfb_formFields [name="currency"]').val();
          }
          var decimalSymbol = $(
            '#lfb_formFields [name="decimalsSeparator"]'
          ).val();
          var thousandsSeparator = $(
            '#lfb_formFields [name="thousandsSeparator"]'
          ).val();
          var millionSeparator = $(
            '#lfb_formFields [name="millionSeparator"]'
          ).val();
          if (thousandsSeparator == ".") {
            thousandsSeparator = " ";
          }
          var columnFormat =
            prefixCurrency +
            "###" +
            millionSeparator +
            "###" +
            thousandsSeparator +
            "###" +
            decimalSymbol +
            "00" +
            suffixCurrency;

          var formatter = new google.visualization.NumberFormat({
            prefix: prefixCurrency,
            suffix: suffixCurrency,
          });

          var bgColor = "#ccc";
          var legendColor = "#bdc3c7";
          if (lfb_settings.backendTheme == "glassmorphic") {
            //   bgColor = "rgba(255,255,255,0.2)";
            bgColor = "#ddd";
            // legendColor = "#fff";
          } else if (lfb_settings.backendTheme == "flat") {
            bgColor = "#fff";
          }

          var options = {
            hAxis: {
              title: lfb_data.texts["months"],
            },
            vAxis: {
              title: lfb_data.texts["amountOrders"],
              format: columnFormat,
              viewWindow: {
                min: 0,
              },
            },
            legend: { position: "bottom" },
            backgroundColor: bgColor,
            colors: ["#16a085", "#9b59b6", "#95a5a6", "#34495e"],
            width: $("#lfb_charts").parent().width(),
            height: 550,
            pointSize: 5,
            focusTarget: "category",
            tooltip: {
              isHtml: true,
              trigger: "both",
              showColorCode: true,
              textStyle: { color: "#000" },
              backgroundColor: "#fff",
              opacity: 0.8,
            },
            curveType: "function",
          };
          options.backgroundColor = "#202224";
          options.legendTextStyle = { color: "#62666a" };
          options.titleTextStyle = { color: "#62666a" };
          options.hAxis = { textStyle: { color: "#62666a" } };
          options.vAxis = { textStyle: { color: "#62666a" } };
          if (lfb_settings.useDarkMode == 0) {
            options.backgroundColor = bgColor;
            options.legendTextStyle = { color: legendColor };
            options.titleTextStyle = { color: legendColor };
            options.hAxis = { textStyle: { color: legendColor } };
            options.vAxis = { textStyle: { color: legendColor } };
          }
          data.addRows(rowsPrice);

          formatter.format(data, 1);
          formatter.format(data, 2);
          lfb_currentChartsOptions = options;
          lfb_currentChartsData = data;

          var chart = new google.visualization.LineChart(
            document.getElementById("lfb_charts")
          );
          lfb_currentCharts = chart;

          google.visualization.events.addListener(chart, "ready", function () {
            google.visualization.events.addListener(
              chart,
              "onmouseover",
              function (e) {
                if (e.row != null && e.column != null) {
                  chart.setSelection([{ row: e.row, column: e.column }]);
                }
              }
            );

            google.visualization.events.addListener(
              chart,
              "onmouseout",
              function (e) {
                chart.setSelection([]);
              }
            );
          });

          chart.draw(data, options);

          $(window).resize(function () {
            var data = lfb_currentChartsData;
            var options = lfb_currentChartsOptions;
            options.width = $("#lfb_charts").parent().width();
            lfb_currentCharts.draw(data, options);
          });

          $("#lfb_panelsContainer>div").addClass("lfb_hidden");
          $("#lfb_panelCharts").removeClass("lfb_hidden");
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
          $(window).trigger("resize");
        });
      },
    });
  }

  function lfb_refreshLogs() {
    lfb_showLoader();
    var formID = $("#lfb_panelLogs").attr("data-formid");
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_loadLogs",
        formID: formID,
      },
      success: function (rep) {
        if ($("#lfb_logsTable").closest(".dataTables_wrapper").length > 0) {
          lfb_logsTable.destroy();
        }
        var orders = JSON.parse(rep.trim());
        $("#lfb_logsTable tbody").html("");

        for (var i = 0; i < orders.length; i++) {
          var order = orders[i];

          var total = lfb_formatPrice(
            order.totalPrice,
            order.currency,
            order.currencyPosition,
            order.decimalsSeparator,
            order.thousandsSeparator,
            order.millionSeparator,
            order.billionsSeparator
          );
          var totalSubscription = lfb_formatPrice(
            order.totalSubscription,
            order.currency,
            order.currencyPosition,
            order.decimalsSeparator,
            order.thousandsSeparator,
            order.millionSeparator,
            order.billionsSeparator
          );

          var $tr = $(
            '<tr data-id="' +
              order.id +
              '" data-formid="' +
              order.formID +
              '" data-logid="' +
              order.id +
              '" data-useremail="' +
              order.email +
              '"></tr>'
          );
          $tr.append('<td><input name="tableSelector" type="checkbox" /></td>');
          $tr.append("<td>" + order.dateLog + "</td>");
          $tr.append(
            '<td><a href="javascript:" data-action="viewOrder">' +
              order.ref +
              "</a></td>"
          );
          $tr.append("<td>" + order.firstName + " " + order.lastName + "</td>");
          $tr.append("<td>" + order.email + "</td>");
          $tr.append("<td>" + order.payMethod + "</td>");
          $tr.append("<td>" + order.verifiedPayment + "</td>");
          $tr.append(
            '<td class="lfb_log_totalSubTd">' + totalSubscription + "</td>"
          );
          $tr.append('<td class="lfb_log_totalTd">' + total + "</td>");
          $tr.append(
            '<td class="lfb_logStatusTd">' + order.statusText + "</td>"
          );
          $tr.append('<td class="lfb_actionTh text-end"></td>');

          $tr
            .find(".lfb_actionTh")
            .append(
              '<a href="javascript:" data-action="viewOrder" class="btn btn-outline btn-outline-primary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["View this order"] +
                '" data-bs-placement="bottom"><span class="fas fa-search"></span></a>'
            );
          $tr
            .find(".lfb_actionTh")
            .append(
              '<a href="javascript:"  data-action="editOrder"  class="btn btn-outline btn-outline-secondary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["edit"] +
                '" data-bs-placement="bottom"><span class="fas fa-pencil-alt"></span></a>'
            );
          $tr
            .find(".lfb_actionTh")
            .append(
              '<a href="javascript:"  data-action="downloadOrder"  class="btn btn-outline btn-outline-secondary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["Download the order"] +
                '" data-bs-placement="bottom"><span class="fa fa-file-download"></span></a>'
            );
          $tr
            .find(".lfb_actionTh")
            .append(
              '<a href="javascript:"  data-action="editCustomer" data-customerid="' +
                order.customerID +
                '" class="btn btn-outline btn-outline-secondary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["Customer information"] +
                '" data-bs-placement="bottom"><span class="fas fa-user"></span></a>'
            );
          $tr
            .find(".lfb_actionTh")
            .append(
              '<a href="javascript:" data-action="deleteOrder" class="btn btn-outline btn-outline-danger btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["Delete this order"] +
                '" data-bs-placement="bottom"><span class="fas fa-trash"></span></a>'
            );

          $("#lfb_logsTable tbody").append($tr);

          $tr.find('[data-action="viewOrder"]').on("click", function () {
            lfb_showLoader();
            var orderID = $(this).closest("tr").attr("data-id");
            lfb_loadLog(orderID, false);
          });
          $tr.find('[data-action="editOrder"]').on("click", function () {
            lfb_lastPanel = $("#lfb_panelLogs");
            lfb_lastPanel.fadeOut();
            lfb_showLoader();
            var orderID = $(this).closest("tr").attr("data-id");
            lfb_loadLog(orderID, true);
          });
          $tr.find('[data-action="downloadOrder"]').on("click", function () {
            var orderID = $(this).closest("tr").attr("data-id");
            lfb_currentLogID = orderID;
            lfb_downloadOrder(orderID);
          });
          $tr.find('[data-action="deleteOrder"]').on("click", function () {
            var orderID = $(this).closest("tr").attr("data-id");
            var formID = $(this).closest("tr").attr("data-formid");
            lfb_removeLog(orderID, formID);
          });
          $tr.find('[data-action="editCustomer"]').on("click", function () {
            var customerID = $(this).attr("data-customerid");
            lfb_editCustomer(customerID);
          });
        }

        lfb_logsTable = $("#lfb_logsTable").DataTable({
          ordering: false,
          language: {
            search: lfb_data.texts["search"],
            infoFiltered: lfb_data.texts["filteredFrom"],
            zeroRecords: lfb_data.texts["noRecords"],
            infoEmpty: "",
            info: lfb_data.texts["showingPage"],
            lengthMenu: lfb_data.texts["display"] + " _MENU_",
            paginate: {
              first: '<span class="fas fa-fast-backward"></span>',
              previous: '<span class="fas fa-step-backward"></span>',
              next: '<span class="fas fa-step-forward"></span>',
              last: '<span class="fas fa-fast-forward"></span>',
            },
          },
        });
        $("#lfb_logsTable_filter input")
          .detach()
          .appendTo($("#lfb_logsTable_filter"));
        $("#lfb_logsTable_filter label").remove();
        $("#lfb_logsTable_length select")
          .detach()
          .appendTo($("#lfb_logsTable_length"));
        $("#lfb_logsTable_length label").remove();

        $("#lfb_logsTable").wrap('<div class="table-responsive"></div>');
        $('#lfb_logsTable [name="tableSelector"]').attr("checked", "checked");
        $('#lfb_logsTable [name="tableSelector"]').on("change", function () {
          if ($('#lfb_logsTable [name="tableSelector"]:checked').length == 0) {
            $(
              "#lfb_btnExportOrdersSelection,#lfb_btnDeleteOrdersSelection"
            ).attr("disabled", "disabled");
          } else {
            $(
              "#lfb_btnExportOrdersSelection,#lfb_btnDeleteOrdersSelection"
            ).removeAttr("disabled");
          }
        });
        if ($('#lfb_logsTable [name="tableSelector"]:checked').length == 0) {
          $("#lfb_btnExportOrdersSelection,#lfb_btnDeleteOrdersSelection").attr(
            "disabled",
            "disabled"
          );
        } else {
          $(
            "#lfb_btnExportOrdersSelection,#lfb_btnDeleteOrdersSelection"
          ).removeAttr("disabled");
        }
        $("#lfb_logsTable thead th:last").css({
          width: 238,
        });
        $("#lfb_logsTableAllSelect").on("change", function () {
          if ($(this).is(":checked")) {
            $('#lfb_logsTable tbody [name="tableSelector"]').prop(
              "checked",
              true
            );
          } else {
            $('#lfb_logsTable tbody [name="tableSelector"]').prop(
              "checked",
              false
            );
          }
        });
        $(".lfb_mainNavBar").hide();
        $("#lfb_navBar_logs").show();
        $("#lfb_rootPanelContainer > div:not(#lfb_panelPreview)").hide();
        //   $('#lfb_panelsContainer').addClass('lfb_hidden');
        $("#lfb_panelsContainer>div").addClass("lfb_hidden");
        $("#lfb_panelLogs").removeClass("lfb_hidden");
        $("#lfb_panelsContainer").removeClass("lfb_hidden");

        $('#lfb_logsTable tbody [data-toggle="tooltip"]').tooltip();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      },
    });
  }

  function lfb_loadLogs(formID) {
    lfb_showLoader();
    lfb_lastLogsFormID = formID;
    $("#lfb_panelLogs").attr("data-formid", formID);
    lfb_refreshLogs();
    $("#lfb_panelFormsList").addClass("lfb_hidden");
    $("#lfb_panelPreview").removeClass("lfb_hidden");
    $('#lfb_navBar_logs [data-action="exportLogs"]').removeClass("lfb_noMargR");
    $("body").css({
      overflow: "initial",
    });
    if (lfb_currentFormID > 0) {
      $('#lfb_navBar_logs [data-action="openCharts"]').removeClass(
        "lfb_noMargR"
      );
      $('#lfb_navBar_logs [data-action="returnToForm"]').show();
      $("#lfb_formLeftNavbar > *").show();
    } else {
      $('#lfb_navBar_logs [data-action="openCharts"]').addClass("lfb_noMargR");
      $('#lfb_navBar_logs [data-action="returnToForm"]').hide();
      $("#lfb_formLeftNavbar > *").hide();
    }
    if (formID > 0) {
      $('#lfb_navBar_logs [data-action="openCharts"]').show();
      $('#lfb_navBar_logs [data-action="exportLogs"]').removeClass(
        "lfb_noMargR"
      );
    } else {
      $('#lfb_navBar_logs [data-action="openCharts"]').hide();
      if (lfb_currentFormID == 0) {
        $('#lfb_navBar_logs [data-action="exportLogs"]').addClass(
          "lfb_noMargR"
        );
      }
    }
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
  }

  function lfb_loadLog(logID, modeEdit) {
    lfb_currentLogID = logID;
    lfb_orderModified = false;
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_loadLog",
        logID: logID,
      },
      success: function (rep) {
        $("#lfb_winLog").find(".lfb_logContainer").html(rep);
        $("#lfb_winLog")
          .find(".lfb_logContainer")
          .find("[bgcolor]")
          .each(function () {
            $(this).css({
              backgroundColor: $(this).attr("bgcolor"),
            });
          });
        if (
          $("#lfb_winLog").find(".lfb_logContainer #lfb_summaryVat").length == 0
        ) {
          $('#lfb_winNewTotal [name="lfb_modifyVATField"]')
            .closest(".form-group")
            .hide();
        } else {
          $('#lfb_winNewTotal [name="lfb_modifyVATField"]')
            .closest(".form-group")
            .show();
        }
        $('#lfb_winNewTotal [name="lfb_modifyVATField"]').val(
          $("#lfb_winLog").find(".lfb_logContainer #lfb_logVatPrice").html()
        );
        $('#lfb_winNewTotal [name="lfb_modifyTotalField"]').val(
          $("#lfb_winLog").find(".lfb_logContainer #lfb_logTotal").html()
        );
        $('#lfb_winNewTotal [name="lfb_modifySubTotalField"]').val(
          $("#lfb_winLog").find(".lfb_logContainer #lfb_logSubTotal").html()
        );
        lfb_currentLogCurrency = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logCurrency")
          .html();
        lfb_currentLogCurrencyPosition = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logCurrencyPosition")
          .html();

        lfb_currentLogTotal = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logTotal")
          .html();
        lfb_currentLogSubTotal = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logSubTotal")
          .html();

        lfb_currentLogDecSep = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logDecSep")
          .html();
        lfb_currentLogThousSep = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logThousSep")
          .html();
        lfb_currentLogMilSep = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logMilSep")
          .html();
        lfb_currentLogSubTxt = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logSubTxt")
          .html();
        lfb_currentLogUseSub = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_currentLogUseSub")
          .html();
        lfb_currentLogIsPaid = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_currentLogIsPaid")
          .html();
        lfb_currentLogStatus = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_currentLogStatus")
          .html();
        lfb_currentLogCanPay = $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_logCanPay")
          .html();
        $("#lfb_winLog")
          .find(".lfb_logContainer #lfb_currentLogStatus")
          .remove();
        $('#lfb_navBar_log [name="orderStatus"]').val(lfb_currentLogStatus);
        $("#lfb_winLog").find("#lfb_logDecSep").remove();
        $("#lfb_winLog").find("#lfb_logThousSep").remove();
        $("#lfb_winLog").find("#lfb_logMilSep").remove();
        $("#lfb_winLog").find("#lfb_logSubTxt").remove();
        $("#lfb_winLog").find("#lfb_currentLogIsPaid").remove();
        $("#lfb_winLog").find("#lfb_currentLogUseSub").remove();
        $("#lfb_winLog").find("#lfb_logCurrency").remove();
        $("#lfb_winLog").find("#lfb_logCurrencyPosition").remove();
        $("#lfb_winLog").find("#lfb_logCanPay").remove();

        $("#lfb_editorLog").summernote(
          "code",
          $("#lfb_winLog").find(".lfb_logContainer").html()
        );
        $("#lfb_winLog .lfb_logEditorContainer .panel-body *[bgcolor]").each(
          function () {
            $(this).css({
              backgroundColor: $(this).attr("bgcolor"),
            });
          }
        );

        if (lfb_currentLogCanPay == 1) {
          $('#lfb_winSendOrberByEmail [name="addPaymentLink"]')
            .closest(".form-group")
            .slideDown();
        } else {
          $('#lfb_winSendOrberByEmail [name="addPaymentLink"]')
            .closest(".form-group")
            .slideUp();
          $('#lfb_winSendOrberByEmail [name="addPaymentLink"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }

        $("#lfb_winLog .lfb_logEditorContainer .panel-body").on(
          "click",
          function () {}
        );
        $("#lfb_winLog").css({
          backgroundColor: $("body").css("background-color"),
        });
        $("#lfb_winLog .lfb_logEditorContainer .panel-body *[color]").each(
          function () {
            $(this).css({
              color: $(this).attr("bgcolor"),
            });
          }
        );
        $(".lfb_logEditorContainer .note-editable").on("keyup", function () {
          $(".lfb_logEditorContainer .note-editable table tbody tr")
            .find("th,td")
            .each(function () {
              if ($(this).children("span").length == 0) {
                var $span = $("<span></span>");
                $(this).append($span);

                $span.bind(
                  "mousedown.ui-disableSelection selectstart.ui-disableSelection",
                  function (e) {
                    e.stopImmediatePropagation();
                  }
                );
              }
              if ($(this).children().eq(0).is("br")) {
                $(this).children().eq(0).remove();
              }
            });
        });

        $("#lfb_winLog")
          .find(".lfb_logContainer [bgcolor]")
          .each(function () {
            $(this).css({
              backgroundColor: $(this).attr("bgcolor"),
            });
          });
        var userEmail = $('#lfb_logsTable tr[data-logid="' + logID + '"]').attr(
          "data-useremail"
        );
        $('#lfb_winSendOrberByEmail [name="recipients"]').val(userEmail);
        $("#lfb_rootPanelContainer > div").addClass("lfb_hidden");
        $("#lfb_panelPreview").removeClass("lfb_hidden").show();

        $("#lfb_winLog .lfb_logContainer").show();
        $("#lfb_winLog .lfb_logEditorContainer").hide();
        $("#lfb_panelsContainer>div").addClass("lfb_hidden");
        $("#lfb_winLog").removeClass("lfb_hidden");

        $(".lfb_mainNavBar").hide();
        $("#lfb_navBar_log").show();

        setTimeout(function () {
          $(window).trigger("resize");
        }, 1800);

        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        if (modeEdit) {
          lfb_editLog();
        }
      },
    });
  }

  function lfb_openWinSendOrderEmail() {
    if (lfb_orderModified) {
      showModal($("#lfb_winSaveBeforeSendOrder"));
    } else {
      $("#lfb_winLog .lfb_logContainer").show();
      $("#lfb_winLog .lfb_logEditorContainer").hide();
      showModal($("#lfb_winSendOrberByEmail"));
      $('#lfb_winSendOrberByEmail [name="generatePdf"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }
  }

  function lfb_editLog() {
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_logEdit").show();

    if (
      !$(".lfb_logEditorContainer .note-editable table tbody").is("ui-sortable")
    ) {
      $(".lfb_logEditorContainer .note-editable table tbody").sortable({
        helper: function (e, tr) {
          var $originals = tr.children();
          var $helper = tr.clone();
          $helper.children().each(function (index) {
            $(this).width($originals.eq(index).width());
          });
          return $helper;
        },
        stop: function (event, ui) {},
      });
      $(".lfb_logEditorContainer .note-editable table tbody tr")
        .find("td>span,th>span>strong")
        .bind(
          "mousedown.ui-disableSelection selectstart.ui-disableSelection",
          function (e) {
            e.stopImmediatePropagation();
          }
        );
    }

    $(".lfb_logEditorContainer .note-editable table").each(function () {
      if ($(this).find('th[width="103"]').length > 0) {
        lfb_logEditorSummaryTable = $(this);
        $(this)
          .find("tr>th[colspan]")
          .each(function () {
            if ($(this).closest("tr").children().length == 1) {
              lfb_logEditorStepThStyle = $(this)
                .closest("tr")
                .children("th")
                .children("span")
                .find("strong")
                .attr("style");
            }
          });
        $(this)
          .find("tr>td:not([colspan])")
          .each(function () {
            lfb_logEditorTdStyle = $(this)
              .closest("tr")
              .children("th")
              .children("span")
              .attr("style");
          });
      }
    });
    if (!lfb_logEditorSummaryTable) {
      lfb_logEditorSummaryTable = $(
        $(".lfb_logEditorContainer .note-editable table").get(0)
      );
    }

    $("#lfb_winLog .lfb_logContainer").hide();
    $("#lfb_winLog .lfb_logEditorContainer").show();
    lfb_orderModified = true;
    $(window).trigger("resize");
  }

  function lfb_orderAddRow() {
    var $trModel = false;

    lfb_logEditorSummaryTable.find("tr").each(function () {
      if (
        $(this).children("td").length > 0 &&
        !$(this).children("td").first().is("[colspan]")
      ) {
        $trModel = $(this);
      }
    });
    var $tr = $trModel.clone();
    $tr.find("td>span").html("");
    $tr
      .find("td>span")
      .bind(
        "mousedown.ui-disableSelection selectstart.ui-disableSelection",
        function (e) {
          e.stopImmediatePropagation();
        }
      );
    $tr.attr("style", lfb_logEditorTdStyle);
    lfb_logEditorSummaryTable.find("tbody").append($tr);
  }

  function lfb_orderAddStepRow() {
    var $trModel = false;

    lfb_logEditorSummaryTable.find("tr").each(function () {
      if (
        $(this).children("th").length == 1 &&
        $(this).children().length == 1
      ) {
        $trModel = $(this);
      }
    });
    var $tr = $trModel.clone();
    $tr.find("th>span>strong").html("");
    $tr
      .find("th>span>strong")
      .bind(
        "mousedown.ui-disableSelection selectstart.ui-disableSelection",
        function (e) {
          e.stopImmediatePropagation();
        }
      );
    lfb_logEditorSummaryTable.find("tbody").append($tr);
  }

  function lfb_exportCalendarEvents() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_exportCalendarEvents",
        calendarID: lfb_currentCalendarID,
      },
      success: function (rep) {
        rep = rep.trim();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        $("#lfb_exportCalendarCsvLink").attr(
          "href",
          "admin.php?page=lfb_menu&lfb_action=downloadCalendarCsv"
        );
        showModal($("#lfb_winCalendarCsv"));
      },
    });
  }

  function lfb_exportCustomersCSV() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_exportCustomersCSV",
      },
      success: function (rep) {
        rep = rep.trim();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        $("#lfb_exportCustomerCsvLink").attr(
          "href",
          "admin.php?page=lfb_menu&lfb_action=downloadCustomersCsv"
        );
        showModal($("#lfb_winExportCustomersCsv"));
      },
    });
  }

  function lfb_downloadOrder() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_downloadLog",
        logID: lfb_currentLogID,
      },
      success: function (rep) {
        rep = rep.trim();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        $("#lfb_downloadOrderLink").attr(
          "href",
          "admin.php?page=lfb_menu&lfb_action=downloadOrder&ref=" + rep
        );
        showModal($("#lfb_winDownloadOrder"));
      },
    });
  }

  function lfb_sendOrderByEmail() {
    $('#lfb_winSendOrberByEmail [name="recipients"]').removeClass("is-invalid");
    $('#lfb_winSendOrberByEmail [name="subject"]').removeClass("is-invalid");
    var recipients = $('#lfb_winSendOrberByEmail [name="recipients"]').val();
    var subject = $('#lfb_winSendOrberByEmail [name="subject"]').val();
    var error = false;
    if (recipients.length == 0) {
      error = true;
      $('#lfb_winSendOrberByEmail [name="recipients"]').addClass("is-invalid");
    } else {
      var allRecipients = recipients.split(",");
      jQuery.each(allRecipients, function () {
        if (!lfb_checkEmail(this)) {
          error = true;
          $('#lfb_winSendOrberByEmail [name="recipients"]').addClass(
            "is-invalid"
          );
        }
      });
    }
    if (subject.length == 0) {
      error = true;
      $('#lfb_winSendOrberByEmail [name="subject"]').addClass("is-invalid");
    }
    var generatePDF = 0;
    if ($('#lfb_winSendOrberByEmail [name="generatePdf"]').is(":checked")) {
      generatePDF = 1;
    }
    var addPayLink = 0;
    if ($('#lfb_winSendOrberByEmail [name="addPaymentLink"]').is(":checked")) {
      addPayLink = 1;
    }
    if (!error) {
      lfb_showLoader();
      hideModal($("#lfb_winSendOrberByEmail"));
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_sendOrderByEmail",
          logID: lfb_currentLogID,
          recipients: recipients,
          subject: subject,
          generatePDF: generatePDF,
          addPayLink: addPayLink,
        },
        success: function () {
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    }
  }

  function lfb_saveLog(mustOpenWinSend) {
    lfb_orderModified = false;
    lfb_showLoader();
    $(".lfb_logEditorContainer .note-editable table tbody tr")
      .find("td>span,th>span")
      .each(function () {
        $(this).css("display", "inline-block");
      });
    $(
      '.lfb_logEditorContainer .note-editable *[class!="lfb_value"]'
    ).removeAttr("class");
    $(".lfb_logEditorContainer .note-editable table").each(function () {
      if (!$(this).is("[width]")) {
        $(this).attr("width", "668");
        $(this).css("width", "100%");
      }
    });
    $(".lfb_logEditorContainer .note-editable table")
      .find("td,th")
      .each(function () {
        var width = parseInt(
          ($(this).width() * 100) / $(this).closest("table").width()
        );
        $(this).css("width", parseInt(width) + "%");
        width = parseInt((width * 668) / 100);
        $(this).attr("width", width);
      });

    var total = lfb_formatPrice(
      lfb_currentLogTotal,
      lfb_currentLogCurrency,
      lfb_currentLogCurrencyPosition,
      lfb_currentLogDecSep,
      lfb_currentLogThousSep,
      lfb_currentLogMilSep,
      ""
    );
    var totalSubscription = lfb_formatPrice(
      lfb_currentLogSubTotal,
      lfb_currentLogCurrency,
      lfb_currentLogCurrencyPosition,
      lfb_currentLogDecSep,
      lfb_currentLogThousSep,
      lfb_currentLogMilSep,
      ""
    );

    $("#lfb_logsTable,#lfb_customerOrdersTable")
      .find('tr[data-id="' + lfb_currentLogID + '"] .lfb_log_totalTd')
      .html(total);
    $("#lfb_logsTable,#lfb_customerOrdersTable")
      .find('tr[data-id="' + lfb_currentLogID + '"] .lfb_log_totalSubTd')
      .html(totalSubscription);

    var content = $("#lfb_editorLog").summernote("code");
    var $content = $('<div id="lfb_tmpLogContent"></div>');
    $content.html(content);
    $content.find('[style="display: none;"],[style="display:none;"]').remove();
    $content.find("#lfb_logVatPrice,#lfb_logTotal,#lfb_logSubTotal").remove();
    $content
      .find('[id="lfb_logVatPrice"],[id="lfb_logTotal"],[id="lfb_logSubTotal"]')
      .remove();
    content = $content.html();
    $content.remove();

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_saveLog",
        logID: lfb_currentLogID,
        formID: lfb_currentFormID,
        content: content,
        total: lfb_currentLogTotal,
        totalSub: lfb_currentLogSubTotal,
      },
      success: function () {
        $("#lfb_winLog")
          .find(".lfb_logContainer")
          .html($("#lfb_editorLog").summernote("code"));
        $("#lfb_winLog .lfb_logContainer").show();
        $("#lfb_winLog .lfb_logEditorContainer").hide();

        $(".lfb_mainNavBar").hide();
        $("#lfb_navBar_log").show();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        if (mustOpenWinSend) {
          lfb_openWinSendOrderEmail();
        }
      },
    });
  }

  function lfb_closeLog() {
    $("#lfb_winLog").fadeOut();
    if (lfb_lastPanel) {
      lfb_lastPanel.fadeIn();
      lfb_lastPanel = false;
    } else {
      $("#lfb_panelLogs").show();
      $("body").css({
        overflow: "initial",
      });
    }
  }

  function lfb_removeLog(logID, formID) {
    $("#lfb_winDeleteOrder").attr("data-logid", logID);
    $("#lfb_winDeleteOrder").attr("data-formid", formID);
    showModal($("#lfb_winDeleteOrder"));
  }

  function lfb_confirmRemoveLog() {
    var logID = $("#lfb_winDeleteOrder").attr("data-logid");
    var formID = $("#lfb_winDeleteOrder").attr("data-formid");
    var allOrders = 0;
    if ($('#lfb_winDeleteOrder [name="allOrders"]').is(":checked")) {
      allOrders = 1;
    }
    hideModal($("#lfb_winDeleteOrder"));
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeLog",
        logID: logID,
        allOrders: allOrders,
      },
      success: function () {
        lfb_loadLogs(formID);
      },
    });
  }

  function lfb_exportForms() {
    var withLogs = 0;
    var withCoupons = 0;
    if ($('[name="exportLogs"]').is(":checked")) {
      withLogs = 1;
    }
    if ($('[name="exportCoupons"]').is(":checked")) {
      withCoupons = 1;
    }
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_exportForms",
        withLogs: withLogs,
        withCoupons: withCoupons,
      },
      success: function (rep) {
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        if (rep == "1") {
          showModal($("#lfb_winExport"));
        } else {
          alert(lfb_data.texts["errorExport"]);
        }
      },
    });
  }

  function lfb_importForms() {
    lfb_showLoader();
    hideModal($("#lfb_winImport"));
    var formData = new FormData($("#lfb_winImportForm")[0]);

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      xhr: function () {
        var myXhr = jQuery.ajaxSettings.xhr();
        return myXhr;
      },
      success: function (rep) {
        if (rep != "1") {
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
          alert(lfb_data.texts["errorImport"]);
        } else {
          document.location.reload();
        }
      },
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
    });
  }

  function getCouponByID(couponID) {
    var rep = false;
    jQuery.each(lfb_currentForm.coupons, function () {
      if (this.id == couponID) {
        rep = this;
      }
    });
    return rep;
  }

  function lfb_editCoupon(couponID) {
    var couponCode = "";
    var useMax = 1;
    var reduction = 0;
    var reductionType = "price";
    if (couponID > 0) {
      var coupon = getCouponByID(couponID);
      if (coupon) {
        couponCode = coupon.couponCode;
        useMax = coupon.useMax;
        reduction = coupon.reduction;
        reductionType = coupon.reductionType;
        if (coupon.useExpiration == 1) {
          $('#lfb_winEditCoupon [name="useExpiration"]')
            .parent()
            .bootstrapSwitch("setState", true);
          $('#lfb_winEditCoupon [name="expiration"]').closest(".col-6").show();
          $('#lfb_winEditCoupon [name="expiration"]').datetimepicker(
            "setDate",
            moment(coupon.expiration, "YYYY-MM-DD HH:mm").toDate()
          );
        } else {
          $('#lfb_winEditCoupon [name="useExpiration"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }
      }
    } else {
      $('#lfb_winEditCoupon [name="useExpiration"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_winEditCoupon [name="expiration"]').closest(".col-6").hide();
    }

    $("#lfb_winEditCoupon .is-invalid").removeClass("is-invalid");
    $("#lfb_winEditCoupon").attr("data-couponid", couponID);
    $('#lfb_winEditCoupon [name="couponCode"]').val(couponCode);
    $('#lfb_winEditCoupon [name="useMax"]').val(useMax);
    $('#lfb_winEditCoupon [name="reduction"]').val(reduction);
    $('#lfb_winEditCoupon [name="reductionType"]').val(reductionType);

    showModal($("#lfb_winEditCoupon"));
  }

  function lfb_removeCoupon(couponID) {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeCoupon",
        formID: lfb_currentFormID,
        couponID: couponID,
      },
      success: function () {
        $(
          '#lfb_couponsTable tbody tr[data-couponid="' + couponID + '"]'
        ).slideUp();
        setTimeout(function () {
          $(
            '#lfb_couponsTable tbody tr[data-couponid="' + couponID + '"]'
          ).remove();
        }, 300);
      },
    });
  }

  function lfb_removeAllCoupons() {
    $("#lfb_couponsTable tbody").html("");
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeAllCoupons",
        formID: lfb_currentFormID,
      },
      success: function () {},
    });
  }

  function lfb_saveCoupon() {
    var couponID = $("#lfb_winEditCoupon").attr("data-couponid");
    $("#lfb_winEditCoupon .is-invalid").removeClass("is-invalid");

    var error = false;
    if ($('#lfb_winEditCoupon [name="couponCode"]').val().length < 3) {
      error = true;
      $('#lfb_winEditCoupon [name="couponCode"]').addClass("is-invalid");
    }
    if (!error) {
      hideModal($("#lfb_winEditCoupon"));
      var couponCode = $('#lfb_winEditCoupon [name="couponCode"]').val();
      var useMax = $('#lfb_winEditCoupon [name="useMax"]').val();
      var reduction = $('#lfb_winEditCoupon [name="reduction"]').val();
      var reductionType = $('#lfb_winEditCoupon [name="reductionType"]').val();
      if (reduction == "" || isNaN(reduction)) {
        reduction = 0;
      }
      if (reduction < 0) {
        reduction *= -1;
      }
      var useExpiration = 0;
      if ($('#lfb_winEditCoupon [name="useExpiration"]').is(":checked")) {
        useExpiration = 1;
      }

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCoupon",
          formID: lfb_currentFormID,
          couponID: couponID,
          couponCode: $('#lfb_winEditCoupon [name="couponCode"]').val(),
          useMax: $('#lfb_winEditCoupon [name="useMax"]').val(),
          reduction: $('#lfb_winEditCoupon [name="reduction"]').val(),
          reductionType: $('#lfb_winEditCoupon [name="reductionType"]').val(),
          useExpiration: useExpiration,
          expiration: moment(
            $('#lfb_winEditCoupon [name="expiration"]').datetimepicker(
              "getDate"
            )
          ).format("YYYY-MM-DD HH:mm"),
        },
        success: function (rep) {
          if (couponID == 0) {
            lfb_currentForm.coupons.push({
              id: rep,
              formID: lfb_currentFormID,
              couponCode: $('#lfb_winEditCoupon [name="couponCode"]').val(),
              useMax: $('#lfb_winEditCoupon [name="useMax"]').val(),
              reduction: $('#lfb_winEditCoupon [name="reduction"]').val(),
              reductionType: $(
                '#lfb_winEditCoupon [name="reductionType"]'
              ).val(),
              useExpiration: useExpiration,
              expiration: moment(
                $('#lfb_winEditCoupon [name="expiration"]').datetimepicker(
                  "getDate"
                )
              ).format("YYYY-MM-DD HH:mm"),
            });
          }
          var coupon = getCouponByID(couponID);
          if (coupon) {
            coupon.useExpiration = $(
              '#lfb_winEditCoupon [name="useExpiration"]'
            ).is(":checked");
            coupon.expiration = moment(
              $('#lfb_winEditCoupon [name="expiration"]').datetimepicker(
                "getDate"
              )
            ).format("YYYY-MM-DD HH:mm");
          }

          if (reductionType == "percentage") {
            reduction = "-" + reduction + "%";
          } else {
            reduction = "-" + parseFloat(reduction).toFixed(2);
          }

          if (couponID == 0) {
            var tdAction = $(
              '<td style="text-align:right;">' +
                '<a href="javascript:" data-action="lfb_editCoupon" class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a>' +
                '<a href="javascript:" data-action="lfb_removeCoupon" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a>' +
                "</td>"
            );

            tdAction
              .find('a[data-action="lfb_editCoupon"]')
              .on("click", function () {
                lfb_editCoupon($(this).closest("tr").attr("data-couponid"));
              });
            tdAction
              .find('a[data-action="lfb_removeCoupon"]')
              .on("click", function () {
                lfb_removeCoupon($(this).closest("tr").attr("data-couponid"));
              });
            var tr = $('<tr data-couponid="' + rep + '"></div>');
            tr.append("<td>" + couponCode + "</td>");
            tr.append("<td>" + useMax + "</td>");
            tr.append("<td>0</td>");
            tr.append("<td>" + reduction + "</td>");
            tr.append(tdAction);
            $("#lfb_couponsTable tbody").append(tr);
          } else {
            $(
              '#lfb_couponsTable tbody tr[data-couponid="' +
                couponID +
                '"] td:eq(0)'
            ).html(couponCode);
            $(
              '#lfb_couponsTable tbody tr[data-couponid="' +
                couponID +
                '"] td:eq(1)'
            ).html(useMax);
            $(
              '#lfb_couponsTable tbody tr[data-couponid="' +
                couponID +
                '"] td:eq(3)'
            ).html(reduction);
          }
        },
      });
    }
  }

  function lfb_addDateDiffValue(btn) {
    $("#lfb_calculationDatesDiffBubble").find("select").val("currentDate");
    $("#lfb_calculationDatesDiffBubble").css({
      left: $(btn).offset().left,
      top: $(btn).offset().top + 10 + $("body").scrollTop(),
    });
    $("#lfb_calculationValueBubble").fadeOut();
    $("#lfb_calculationDatesDiffBubble").fadeIn();
    $("#lfb_calculationDatesDiffBubble").addClass("lfb_hover");
    lfb_updateCalculationsDates();
  }

  function lfb_updateCalculationsDates() {
    $(
      "#lfb_calculationDatesDiffBubble select option:not([data-static])"
    ).remove();
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (item.type == "datepicker") {
          var itemID = item.id;
          $("#lfb_calculationDatesDiffBubble select").append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });

    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }
      if (item.type == "datepicker") {
        var itemID = item.id;
        $("#lfb_calculationDatesDiffBubble select").append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            lfb_data.texts["lastStep"] +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });
  }

  function lfb_addCalculationValue(btn) {
    $("#lfb_calculationValueBubble").find("select,textarea,input").val("");
    lfb_updateCalculationsValueItems();
    $("#lfb_calculationValueBubble").css({
      left: $(btn).offset().left,
      top: $(btn).offset().top + $("body").scrollTop() + 10,
    });
    $("#lfb_calculationDatesDiffBubble").fadeOut();
    $("#lfb_calculationValueBubble").fadeIn();
    $("#lfb_calculationValueBubble").addClass("lfb_hover");
    lfb_updateCalculationsValueElements();
    lfb_updateCalculationsValueType();
    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_updateCalculationsValueItems() {
    var $selectItem = $('#lfb_calculationValueBubble select[name="itemID"]');
    $selectItem.html("");
    jQuery.each(lfb_steps, function () {
      var step = this;
      $selectItem.append(
        '<option value="step-' +
          step.id +
          '" >' +
          step.title +
          " :  " +
          lfb_data.texts["totalQuantity"] +
          " </option>"
      );

      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          item.type == "picture" ||
          item.type == "checkbox" ||
          item.type == "numberfield" ||
          item.type == "select" ||
          item.type == "slider" ||
          item.type == "button" ||
          item.type == "imageButton" ||
          this.type == "numberfield" ||
          this.type == "textfield" ||
          this.type == "datepicker" ||
          this.type == "select" ||
          this.type == "textarea" ||
          this.type == "range"
        ) {
          var itemID = item.id;
          $selectItem.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }

      if (
        item.type == "picture" ||
        item.type == "checkbox" ||
        item.type == "numberfield" ||
        item.type == "select" ||
        item.type == "slider" ||
        item.type == "button" ||
        item.type == "imageButton" ||
        this.type == "numberfield" ||
        this.type == "textfield" ||
        this.type == "datepicker" ||
        this.type == "select" ||
        this.type == "textarea" ||
        this.type == "range"
      ) {
        var itemID = item.id;
        $selectItem.append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '" data-datetype="' +
            item.dateType +
            '">' +
            lfb_data.texts["lastStep"] +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });

    $selectItem.append(
      '<option value="_total" data-type="totalPrice">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $selectItem.append(
      '<option value="_total_qt" data-type="totalQt">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );
  }

  function lfb_updateCalculationsValueElements() {
    var $selectItem = $('#lfb_calculationValueBubble select[name="itemID"]');
    var $selectElement = $(
      '#lfb_calculationValueBubble select[name="element"]'
    );
    $selectElement.val("");
    $selectElement.find('option[value="quantity"]').hide();
    $selectElement.find('option[value=""]').show();
    if ($selectItem.val().indexOf("step-") == 0) {
      $selectElement.find('option[value="quantity"]').show();
      $selectElement.find('option[value=""]').hide();
      $selectElement.find('option[value="value"]').hide();
      $selectElement.val("quantity");
    } else {
      if ($selectItem.val() != "") {
        var selectedItemID = $selectItem.val();
        jQuery.each(lfb_currentForm.steps, function () {
          jQuery.each(this.items, function () {
            if (this.id == selectedItemID) {
              if (this.quantity_enabled == 1 || this.type == "slider") {
                $selectElement.find('option[value="quantity"]').show();
              } else {
                $selectElement.find('option[value="quantity"]').hide();
              }
              if (
                this.type == "numberfield" ||
                this.type == "textfield" ||
                this.type == "datepicker" ||
                this.type == "select" ||
                this.type == "textarea" ||
                this.type == "rate"
              ) {
                $selectElement.find('option[value="value"]').show();
                $selectElement.find('option[value=""]').hide();
                $selectElement.find('option[value="min"]').hide();
                $selectElement.find('option[value="max"]').hide();
                $selectElement.val("value");
              } else {
                $selectElement.find('option[value="value"]').hide();
                $selectElement.find('option[value="min"]').hide();
                $selectElement.find('option[value="max"]').hide();
                $selectElement.find('option[value=""]').show();
              }
              if (this.type == "select") {
                $selectElement.find('option[value=""]').show();
              }
              if (this.type == "range") {
                $selectElement.find('option[value="value"]').hide();
                $selectElement.find('option[value="quantity"]').hide();
                $selectElement.find('option[value=""]').hide();
                $selectElement.find('option[value="min"]').show();
                $selectElement.find('option[value="max"]').show();
              }
              return false;
            }
          });
        });

        jQuery.each(lfb_currentForm.fields, function () {
          if (this.id == selectedItemID) {
            if (this.quantity_enabled == 1 || this.type == "slider") {
              $selectElement.find('option[value="quantity"]').show();
            } else {
              $selectElement.find('option[value="quantity"]').hide();
            }
            $selectElement.find('option[value="min"]').hide();
            $selectElement.find('option[value="max"]').hide();
            if (
              this.type == "numberfield" ||
              this.type == "textfield" ||
              this.type == "datepicker" ||
              this.type == "select" ||
              this.type == "textarea" ||
              this.type == "rate"
            ) {
              $selectElement.find('option[value="value"]').show();
              $selectElement.find('option[value=""]').hide();
              $selectElement.val("value");
            } else {
              $selectElement.find('option[value="value"]').hide();
              $selectElement.find('option[value=""]').show();
            }
            if (this.type == "select") {
              $selectElement.find('option[value=""]').show();
            }
            if (this.type == "range") {
              $selectElement.find('option[value="value"]').hide();
              $selectElement.find('option[value="quantity"]').hide();
              $selectElement.find('option[value=""]').hide();
              $selectElement.find('option[value="min"]').show();
              $selectElement.find('option[value="max"]').show();
            }
          }
        });
        if ($selectItem.val() == "_total_qt") {
          $selectElement.find('option[value="quantity"]').show();
          $selectElement.find('option[value=""]').hide();
          $selectElement.find('option[value="value"]').hide();
          $selectElement.val("quantity");
        }
      }
    }

    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    setTimeout(function () {
      $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    }, 300);
  }

  function lfb_addDistanceCondition() {
    $("#lfb_winDistances").fadeIn();
  }

  function lfb_saveCalculationValue() {
    var targetfieldName = "calculation";
    if (lfb_calculationModeQt == 1) {
      targetfieldName = "calculationQt";
    } else if (lfb_calculationModeQt == 2) {
      targetfieldName = "variableCalculation";
    }
    var $selectItem = $('#lfb_calculationValueBubble select[name="itemID"]');
    var $selectElement = $(
      '#lfb_calculationValueBubble select[name="element"]'
    );
    var $selectVariable = $(
      '#lfb_calculationValueBubble select[name="variableID"]'
    );
    var attribute = "price";
    if ($selectElement.val() != "") {
      attribute = $selectElement.val();
    }

    if (attribute == "value") {
      jQuery.each(lfb_currentForm.steps, function () {
        jQuery.each(this.items, function () {
          if (this.id == $selectItem.val()) {
            if (this.type == "datepicker") {
              attribute = "date";
            }
            return false;
          }
        });
      });
    }
    var itemTag = "[item-" + $selectItem.val() + "_" + attribute + "]";

    if ($selectItem.val() == "_total") {
      itemTag = "[total]";
    }
    if ($selectItem.val() == "_total_qt") {
      itemTag = "[total_quantity]";
    }
    if ($selectItem.val().indexOf("step-") == 0) {
      var stepID = $selectItem.val().substr(5);
      itemTag = "[step-" + stepID + "_" + attribute + "]";
    }
    if (
      $('#lfb_calculationValueBubble select[name="valueType"]').val() ==
      "variable"
    ) {
      if ($selectVariable.val() != "" && $selectVariable.val() != null) {
        itemTag = "[variable-" + $selectVariable.val() + "]";
      } else {
        itemTag = "";
      }
    }

    if (
      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .next()
        .is(".CodeMirror")
    ) {
      var editor = lfb_itemPriceCalculationEditor;
      if (targetfieldName == "calculationQt") {
        editor = lfb_itemCalculationQtEditor;
      } else if (targetfieldName == "variableCalculation") {
        editor = lfb_itemVariableCalculationEditor;
      }
      var doc = editor.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(itemTag, cursor);
      lfb_applyCalculationEditorTooltips(targetfieldName);
    } else {
      var posCar = $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .prop("selectionStart");
      var value = $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val();
      if (isNaN(posCar)) {
        posCar = value.length;
      }
      var newValue =
        value.substr(0, posCar) +
        " " +
        itemTag +
        " " +
        value.substr(posCar, value.length);
      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val(newValue);
    }
    $("#lfb_calculationValueBubble").fadeOut();
  }

  function lfb_saveCalculationDatesDiff() {
    var targetfieldName = "calculation";
    if (lfb_calculationModeQt == 1) {
      targetfieldName = "calculationQt";
    } else if (lfb_calculationModeQt == 2) {
      targetfieldName = "variableCalculation";
    }
    var $startDate = $(
      '#lfb_calculationDatesDiffBubble select[name="startDate"]'
    );
    var $endDate = $('#lfb_calculationDatesDiffBubble select[name="endDate"]');
    var itemTag =
      "[dateDifference-" + $startDate.val() + "_" + $endDate.val() + "]";
    if (
      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .next()
        .is(".CodeMirror")
    ) {
      var editor = lfb_itemPriceCalculationEditor;
      if (targetfieldName == "calculationQt") {
        editor = lfb_itemCalculationQtEditor;
      } else if (targetfieldName == "variableCalculation") {
        editor = lfb_itemVariableCalculationEditor;
      }
      var doc = editor.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(itemTag, cursor);
      lfb_applyCalculationEditorTooltips(targetfieldName);
    } else {
      var posCar = $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .prop("selectionStart");
      var value = $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val();
      if (isNaN(posCar)) {
        posCar = value.length;
      }
      var newValue =
        value.substr(0, posCar) +
        " " +
        itemTag +
        " " +
        value.substr(posCar, value.length);
      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val(newValue);
    }

    $("#lfb_calculationDatesDiffBubble").fadeOut();
  }

  function lfb_addCalculationCondition() {
    $("#lfb_winCalculationConditions #lfb_calcConditionsTable tbody").html("");
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winCalculationConditions").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_calcConditions").show();
  }

  function lfb_calcConditionCancel() {
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winItem").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();
  }

  function lfb_calcConditionSave() {
    var targetfieldName = "calculation";
    if (lfb_calculationModeQt == 1) {
      targetfieldName = "calculationQt";
    } else if (lfb_calculationModeQt == 2) {
      targetfieldName = "variableCalculation";
    }

    var conditionString = "if(";
    if (
      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val().length > 0
    ) {
      conditionString = "\n" + conditionString;
    }
    var operator = "&&";
    if ($("#lfb_calcOperator").val() == "OR") {
      operator = "||";
    }
    $(
      "#lfb_winCalculationConditions #lfb_calcConditionsTable tbody tr.lfb_conditionItem"
    ).each(function () {
      var tr = this;
      var itemID = $(tr).find(".lfb_conditionSelect").val();

      var valueCondition = lfb_getConditionValue(
        $(this).find(".lfb_conditionValue"),
        true
      );
      valueCondition = valueCondition.replace(/</g, "&lt;");
      if (
        itemID != "_total" &&
        itemID != "_total_qt" &&
        (itemID.length < 2 || itemID.substr(0, 2) != "v_")
      ) {
        itemID =
          "item-" + itemID.substr(itemID.indexOf("_") + 1, itemID.length);
      } else if (itemID.length >= 2 && itemID.substr(0, 2) == "v_") {
        itemID =
          "variable-" + itemID.substr(itemID.indexOf("_") + 1, itemID.length);
      }
      if (
        $(tr).find(".lfb_conditionoperatorSelect ").val().substr(0, 2) == "Qt"
      ) {
        conditionString += "[" + itemID + "_quantity]";
        if ($(tr).find(".lfb_conditionoperatorSelect ").val() == "QtSuperior") {
          conditionString += " >";
        } else if (
          $(tr).find(".lfb_conditionoperatorSelect ").val() == "QtInferior"
        ) {
          conditionString += " <";
        } else if (
          $(tr).find(".lfb_conditionoperatorSelect ").val() == "QtDifferent"
        ) {
          conditionString += " !=";
        } else {
          conditionString += " ==";
        }
        conditionString += valueCondition;
      } else if (
        $(tr).find(".lfb_conditionoperatorSelect ").val().substr(0, 5) ==
        "Price"
      ) {
        conditionString += "[" + itemID + "_price]";
        if (
          $(tr).find(".lfb_conditionoperatorSelect ").val() == "PriceSuperior"
        ) {
          conditionString += " >";
        } else if (
          $(tr).find(".lfb_conditionoperatorSelect ").val() == "PriceInferior"
        ) {
          conditionString += " <";
        } else if (
          $(tr).find(".lfb_conditionoperatorSelect ").val() == "PriceDifferent"
        ) {
          conditionString += " !=";
        } else {
          conditionString += " ==";
        }
        conditionString += valueCondition;
      } else if (
        $(tr).find(".lfb_conditionoperatorSelect ").val() == "clicked"
      ) {
        conditionString += "[" + itemID + "_isChecked]";
      } else if (
        $(tr).find(".lfb_conditionoperatorSelect ").val() == "unclicked"
      ) {
        conditionString += "[" + itemID + "_isUnchecked]";
      } else if (
        $(tr).find(".lfb_conditionoperatorSelect ").val() == "superior"
      ) {
        if (itemID == "_total") {
          conditionString += "[total]";
          conditionString += " >";
          conditionString += valueCondition;
        } else if (itemID == "_total_qt") {
          conditionString += "[total_quantity]";
          conditionString += " >";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "select"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " >";
          conditionString += "'" + valueCondition + "'";
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "numberfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " >";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "rate"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " >";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "textfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " >";
          conditionString += "'" + valueCondition + "'";
        } else {
          conditionString += "[" + itemID + "_date]";
          conditionString += " >";
          conditionString += "'" + valueCondition + "'";
        }
      } else if (
        $(tr).find(".lfb_conditionoperatorSelect").val() == "inferior"
      ) {
        if (itemID == "_total") {
          conditionString += "[total]";
          conditionString += " <";
          conditionString += valueCondition;
        } else if (itemID == "_total_qt") {
          conditionString += "[total_quantity]";
          conditionString += " <";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "select"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " <";
          conditionString += "'" + valueCondition + "'";
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "numberfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " <";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "rate"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " <";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "textfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " <";
          conditionString += "'" + valueCondition + "'";
        } else {
          conditionString += "[" + itemID + "_date]";
          conditionString += " <";
          conditionString += '"' + valueCondition + '"';
        }
      } else if ($(tr).find(".lfb_conditionoperatorSelect").val() == "equal") {
        if (itemID == "_total") {
          conditionString += "[total]";
          conditionString += " ==";
          conditionString += valueCondition;
        } else if (itemID == "_total_qt") {
          conditionString += "[total_quantity]";
          conditionString += " ==";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "select"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " ==";
          conditionString += "'" + valueCondition + "'";
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "numberfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " ==";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "rate"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " ==";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "textfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " ==";
          conditionString += "'" + valueCondition + "'";
        } else {
          conditionString += "[" + itemID + "_date]";
          conditionString += " ==";
          conditionString += "'" + valueCondition + "'";
        }
      } else if (
        $(tr).find(".lfb_conditionoperatorSelect").val() == "different"
      ) {
        if (itemID == "_total") {
          conditionString += "[total]";
          conditionString += " !=";
          conditionString += valueCondition;
        } else if (itemID == "_total_qt") {
          conditionString += "[total_quantity]";
          conditionString += " !=";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "select"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " !=";
          conditionString += "'" + valueCondition + "'";
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "numberfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " !=";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "rate"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " !=";
          conditionString += valueCondition;
        } else if (
          $(tr)
            .find(
              '.lfb_conditionSelect option[value="' +
                $(tr).find(".lfb_conditionSelect").val() +
                '"]'
            )
            .attr("data-type") == "textfield"
        ) {
          conditionString += "[" + itemID + "_value]";
          conditionString += " !=";
          conditionString += "'" + valueCondition + "'";
        } else {
          conditionString += "[" + itemID + "_date]";
          conditionString += " !=";
          conditionString += "'" + valueCondition + "'";
        }
      } else if ($(tr).find(".lfb_conditionoperatorSelect").val() == "filled") {
        conditionString += "[" + itemID + "_isFilled]";
      }
      conditionString += operator;
    });
    conditionString = conditionString.substr(0, conditionString.length - 2);
    conditionString += ") {" + "\n" + "\n" + "}";

    if (
      $(
        "#lfb_winCalculationConditions #lfb_calcConditionsTable tbody tr.lfb_conditionItem"
      ).length == 0
    ) {
      conditionString = "if( ) { }";
    }
    if (
      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .next()
        .is(".CodeMirror")
    ) {
      var editor = lfb_itemPriceCalculationEditor;
      if (targetfieldName == "calculationQt") {
        editor = lfb_itemCalculationQtEditor;
      } else if (targetfieldName == "variableCalculation") {
        editor = lfb_itemVariableCalculationEditor;
      }
      var doc = editor.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(conditionString, cursor);

      setTimeout(function () {
        lfb_applyCalculationEditorTooltips(targetfieldName);
        editor.refresh();
      }, 250);
    } else {
      var posCar = $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .prop("selectionStart");
      var value = $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val();
      if (isNaN(posCar)) {
        posCar == value.length;
      }
      var newValue =
        value.substr(0, posCar) +
        conditionString +
        " " +
        value.substr(posCar, value.length);

      $("#lfb_winItem")
        .find('[name="' + targetfieldName + '"]')
        .val(newValue);
    }
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winItem").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();
  }

  function lfb_addDynamicValue(editor) {
    if (editor.attr("id") == "calEventContent") {
      $("#lfb_winEditReminder").hide();
    }
    $("#lfb_winDynamicValue").data("lfb_editor", editor);
    $("#lfb_winDynamicValue").find("select,textarea,input").val("");
    showModal($("#lfb_winDynamicValue"));
    lfb_updateDynamicValueItems();
    lfb_updateDynamicValueType();
    lfb_updateDynamicValueElements();
  }

  function lfb_addEmailValue(mode) {
    $("#lfb_winDynamicValue").data("lfb_mode", mode);
    $("#lfb_emailValueBubble").find("select,textarea,input").val("");
    lfb_updateDynamicValueItems();
    var target = "#lfb_btnAddEmailValue";
    $("#lfb_emailValueBubble").attr("data-customermode", mode);
    if (mode == 1) {
      target = "#lfb_btnAddEmailValueCustomer";
    } else if (mode == 2) {
      target = "#lfb_btnAddRichtextValue";
    } else if (mode == 3) {
      target = "#lfb_btnAddPdfValue";
    } else if (mode == 4) {
      target = "#lfb_btnAddPdfValueCustomer";
    }
    $("#lfb_emailValueBubble").css({
      left: $(target).offset().left - 80,
      top: $(target).offset().top + 28,
    });
    $("#lfb_emailValueBubble").fadeIn();
    $("#lfb_emailValueBubble").addClass("lfb_hover");
    lfb_updateDynamicValueType();
    lfb_updateDynamicValueElements();
  }

  function lfb_updateCalculationsValueType() {
    if (
      $('#lfb_calculationValueBubble select[name="valueType"]').val() ==
      "variable"
    ) {
      $('#lfb_calculationValueBubble select[name="element"]')
        .closest(".form-group")
        .hide();
      $('#lfb_calculationValueBubble select[name="itemID"]')
        .closest(".form-group")
        .hide();
      $('#lfb_calculationValueBubble select[name="variableID"]')
        .closest(".form-group")
        .show();
      if (
        $('#lfb_calculationValueBubble select[name="variableID"] option')
          .length > 0
      ) {
        $('#lfb_calculationValueBubble select[name="variableID"]').val(
          $('#lfb_emailValueBubble select[name="variableID"] option')
            .first()
            .attr("value")
        );
      }
    } else {
      $('#lfb_calculationValueBubble select[name="element"]')
        .closest(".form-group")
        .show();
      $('#lfb_calculationValueBubble select[name="itemID"]')
        .closest(".form-group")
        .show();
      $('#lfb_calculationValueBubble select[name="variableID"]')
        .closest(".form-group")
        .hide();
    }
    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_updateDynamicValueType() {
    if (
      $('#lfb_winDynamicValue select[name="valueType"]').val() == "variable"
    ) {
      $('#lfb_winDynamicValue select[name="element"]')
        .closest(".form-group")
        .hide();
      $('#lfb_winDynamicValue select[name="itemID"]')
        .closest(".form-group")
        .hide();
      $('#lfb_winDynamicValue select[name="variableID"]')
        .closest(".form-group")
        .show();
      if (
        $('#lfb_winDynamicValue select[name="variableID"] option').length > 0
      ) {
        $('#lfb_winDynamicValue select[name="variableID"]').val(
          $('#lfb_emailValueBubble select[name="variableID"] option')
            .first()
            .attr("value")
        );
      }
    } else {
      $('#lfb_winDynamicValue select[name="element"]')
        .closest(".form-group")
        .show();
      $('#lfb_winDynamicValue select[name="itemID"]')
        .closest(".form-group")
        .show();
      $('#lfb_winDynamicValue select[name="variableID"]')
        .closest(".form-group")
        .hide();
    }
    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_updateDynamicValueElements() {
    var $selectItem = $('#lfb_winDynamicValue select[name="itemID"]');
    var $selectElement = $('#lfb_winDynamicValue select[name="element"]');
    $selectElement.val("");
    $selectElement.find('option[value="quantity"]').hide();
    $selectElement.find('option[value=""]').show();
    $selectElement.find('option[value="image"]').hide();
    if ($selectItem.val() != "") {
      var selectedItemID = $selectItem.val();
      jQuery.each(lfb_currentForm.steps, function () {
        jQuery.each(this.items, function () {
          if (this.id == selectedItemID) {
            if (this.quantity_enabled == 1 || this.type == "slider") {
              $selectElement.find('option[value="quantity"]').show();
            } else {
              $selectElement.find('option[value="quantity"]').hide();
            }

            if (
              this.type == "richtext" ||
              this.type == "textfield" ||
              this.type == "numberfield" ||
              this.type == "textarea" ||
              this.type == "select" ||
              this.type == "colorpicker" ||
              this.type == "datepicker" ||
              this.type == "timepicker" ||
              this.type == "filefield" ||
              this.type == "rate"
            ) {
              $selectElement.find('option[value="value"]').show();
              $selectElement.find('option[value=""]').hide();
              $selectElement.val("value");
            } else {
              $selectElement.find('option[value="value"]').hide();
              $selectElement.find('option[value=""]').show();
            }
            if (this.type == "select") {
              $selectElement.find('option[value=""]').show();
            } else if (this.type == "picture") {
              $selectElement.find('option[value="image"]').show();
            }
          }
        });
      });

      jQuery.each(lfb_currentForm.fields, function () {
        if (this.id == selectedItemID) {
          if (this.quantity_enabled == 1 || this.type == "slider") {
            $selectElement.find('option[value="quantity"]').show();
          } else {
            $selectElement.find('option[value="quantity"]').hide();
          }
          if (
            this.type == "richtext" ||
            this.type == "textfield" ||
            this.type == "textarea" ||
            this.type == "select" ||
            this.type == "colorpicker" ||
            this.type == "datepicker" ||
            this.type == "timepicker" ||
            this.type == "filefield" ||
            this.type == "rate"
          ) {
            $selectElement.find('option[value="value"]').show();
            $selectElement.find('option[value=""]').hide();
            $selectElement.val("value");
          } else {
            $selectElement.find('option[value="value"]').hide();
            $selectElement.find('option[value=""]').show();
          }
          if (this.type == "select") {
            $selectElement.find('option[value=""]').show();
          } else if (this.type == "picture") {
            $selectElement.find('option[value="image"]').show();
          }
        }
      });
      if ($selectItem.val() == "_total_qt") {
        $selectElement.find('option[value="quantity"]').show();
        $selectElement.find('option[value=""]').hide();
        $selectElement.find('option[value="title"]').hide();
        $selectElement.val("quantity");
      } else if ($selectItem.val() == "_total") {
        $selectElement.find('option[value="quantity"]').hide();
        $selectElement.find('option[value=""]').show();
        $selectElement.find('option[value="title"]').hide();
        $selectElement.val("");
      } else {
        $selectElement.find('option[value="title"]').show();
      }
    }
    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_updateDynamicValueItems() {
    var $selectItem = $('#lfb_winDynamicValue select[name="itemID"]');
    $selectItem.html("");
    jQuery.each(lfb_steps, function () {
      var step = this;
      jQuery.each(step.items, function () {
        var item = this;
        var title = item.title;
        if (item.alias.trim().length > 0) {
          title = item.alias;
        }
        if (
          this.type == "richtext" ||
          this.type == "picture" ||
          this.type == "checkbox" ||
          this.type == "numberfield" ||
          this.type == "select" ||
          this.type == "slider" ||
          this.type == "button" ||
          this.type == "imageButton" ||
          this.type == "rate" ||
          this.type == "textfield" ||
          this.type == "textarea" ||
          this.type == "select" ||
          this.type == "colorpicker" ||
          this.type == "datepicker" ||
          this.type == "timepicker"
        ) {
          var itemID = item.id;
          $selectItem.append(
            '<option value="' +
              itemID +
              '" data-type="' +
              item.type +
              '" data-datetype="' +
              item.dateType +
              '">' +
              step.title +
              ' : " ' +
              title +
              ' "</option>'
          );
        }
      });
    });
    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      var title = item.title;
      if (item.alias.trim().length > 0) {
        title = item.alias;
      }
      if (
        this.type == "richtext" ||
        this.type == "picture" ||
        this.type == "checkbox" ||
        this.type == "numberfield" ||
        this.type == "select" ||
        this.type == "slider" ||
        this.type == "button" ||
        this.type == "imageButton" ||
        this.type == "filefield" ||
        this.type == "rate" ||
        this.type == "textfield" ||
        this.type == "textarea" ||
        this.type == "select" ||
        this.type == "colorpicker" ||
        this.type == "datepicker" ||
        this.type == "timepicker"
      ) {
        var itemID = item.id;
        $selectItem.append(
          '<option value="' +
            itemID +
            '" data-type="' +
            item.type +
            '" data-datetype="' +
            item.dateType +
            '">' +
            lfb_data.texts["lastStep"] +
            ' : " ' +
            title +
            ' "</option>'
        );
      }
    });

    $selectItem.append(
      '<option value="_total" data-static="1" data-type="totalPrice" data-variable="pricefield">' +
        lfb_data.texts["totalPrice"] +
        "</option>"
    );
    $selectItem.append(
      '<option value="_total_qt" data-static="1" data-type="totalQt" data-variable="numberfield">' +
        lfb_data.texts["totalQuantity"] +
        "</option>"
    );

    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_saveDynamicValue() {
    var editor = $("#lfb_winDynamicValue").data("lfb_editor");
    var $selectItem = $('#lfb_winDynamicValue select[name="itemID"]');
    var $selectElement = $('#lfb_winDynamicValue select[name="element"]');
    var $selectVariable = $('#lfb_winDynamicValue select[name="variableID"]');

    var attribute = $('#lfb_winDynamicValue select[name="element"]').val();
    if (attribute == "") {
      attribute = "price";
    }
    if ($selectElement.val() != "") {
      attribute = $selectElement.val();
    }
    var itemTag = "[item-" + $selectItem.val() + "_" + attribute + "]";
    if ($selectItem.val() == "_total") {
      itemTag = "[total]";
    }
    if ($selectItem.val() == "_total_qt") {
      itemTag = "[total_quantity]";
    }
    if (
      $('#lfb_winDynamicValue select[name="valueType"]').val() == "variable"
    ) {
      if ($selectVariable.val() != "" && $selectVariable.val() != null) {
        itemTag = "[variable-" + $selectVariable.val() + "]";
      } else {
        itemTag = "";
      }
    }
    editor.summernote("editor.focus");
    editor.summernote("editor.insertText", itemTag);

    hideModal($("#lfb_winDynamicValue"));

    if (editor.attr("id") == "calEventContent") {
      $("#lfb_winEditReminder").show();
    }
  }

  function lfb_exportLogs() {
    var formID = $("#lfb_panelLogs").attr("data-formid");
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_exportLogs",
        formID: formID,
      },
      success: function (rep) {
        if (rep != "error") {
          document.location.href =
            "admin.php?page=lfb_menu&lfb_action=downloadLogs";
        }
      },
    });
  }

  function lfb_showLayerConditionSave() {
    var conditions = new Array();
    $("#lfb_showLayerConditionsTable .lfb_conditionItem").each(function () {
      var condValue = lfb_getConditionValue(
        $(this).find(".lfb_conditionValue")
      );

      if (condValue) {
        condValue = condValue.replace(/\'/g, "`");
      }
      conditions.push({
        interaction: $(this).find(".lfb_conditionSelect").val(),
        action: $(this).find(".lfb_conditionoperatorSelect").val(),
        value: condValue,
      });
    });
    lfb_currentLayerTr
      .find('[name="showConditions"]')
      .val(JSON.stringify(conditions));
    lfb_currentLayerTr
      .find('[name="showConditionsOperator"]')
      .val($("#lfb_showLayerOperator").val());
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winItem").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();
  }

  function lfb_editLayerConditions(btn) {
    lfb_currentLayerTr = $(btn).closest("tr");
    $("#lfb_winLayerShowConditions #lfb_showStepOperator").val(
      lfb_currentLayerTr.find('[name="showConditions"]').val()
    );
    $("#lfb_winLayerShowConditions #lfb_showLayerConditionsTable tbody").html(
      ""
    );

    if (lfb_currentLayerTr.find('[name="showConditions"]').val() != "") {
      var conditions = JSON.parse(
        lfb_currentLayerTr.find('[name="showConditions"]').val()
      );
      jQuery.each(conditions, function () {
        lfb_addShowLayerInteraction(this);
      });
    }

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winLayerShowConditions").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_layerConditions").show();
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
  }

  function lfb_editRowConditions(rowData) {
    lfb_currentItemID = rowData.id;

    $("html,body").css("overflow-y", "auto");

    $("#lfb_winShowStepConditions #lfb_showStepOperator").val(
      rowData.showConditionsOperator
    );
    $("#lfb_winShowStepConditions #lfb_showStepConditionsTable tbody").html("");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_row").show();

    try {
      var conditions = JSON.parse(rowData.showConditions);
      jQuery.each(conditions, function () {
        lfb_addShowStepInteraction(this);
      });
    } catch (e) {}

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winShowStepConditions").removeClass("lfb_hidden");

    //   $('.lfb_mainNavBar').hide();
    //    $('#lfb_navBar_showStepConditions').show();

    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
  }

  function lfb_editShowStepConditions() {
    hideModal($("#lfb_winStepSettings"));

    var winStep = $("#lfb_winStep");
    if (lfb_currentForm.form.useVisualBuilder == 1) {
      winStep = $("#lfb_winStepSettings");
    }
    $("#lfb_winShowStepConditions #lfb_showStepOperator").val(
      winStep.find('[name="showConditionsOperator"]').val()
    );
    $("#lfb_winShowStepConditions #lfb_showStepConditionsTable tbody").html("");
    if (winStep.find('[name="showConditions"]').val() != "") {
      try {
        var conditions = JSON.parse(
          winStep.find('[name="showConditions"]').val()
        );
        jQuery.each(conditions, function () {
          lfb_addShowStepInteraction(this);
        });
      } catch (e) {}
    }

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winShowStepConditions").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_showStepConditions").show();

    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
  }

  function lfb_editShowConditions() {
    $("#lfb_winShowConditions #lfb_showOperator").val(
      $("#lfb_winItem").find('[name="showConditionsOperator"]').val()
    );
    $("#lfb_winShowConditions #lfb_showConditionsTable tbody").html("");
    if ($("#lfb_winItem").find('[name="showConditions"]').val() != "") {
      try {
        var conditions = JSON.parse(
          $("#lfb_winItem").find('[name="showConditions"]').val()
        );
        jQuery.each(conditions, function () {
          lfb_addShowInteraction(this);
        });
      } catch (e) {}
    }
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winShowConditions").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_showItemConditions").show();

    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
  }

  function lfb_saveRowConditions() {
    var conditions = new Array();

    $("#lfb_showStepConditionsTable .lfb_conditionItem").each(function () {
      var condValue = lfb_getConditionValue(
        $(this).find(".lfb_conditionValue")
      );
      if (condValue) {
        condValue = condValue.replace(/\'/g, "`");
      }
      conditions.push({
        interaction: $(this).find(".lfb_conditionSelect").val(),
        action: $(this).find(".lfb_conditionoperatorSelect").val(),
        value: condValue,
      });
    });

    var itemData = lfb_getItemByID(lfb_currentItemID);
    if (itemData) {
      itemData.showConditionsOperator = $("#lfb_showStepOperator").val();
      itemData.showConditions = JSON.stringify(conditions);

      $.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveRowConditions",
          itemID: lfb_currentItemID,
          showConditionsOperator: $("#lfb_showStepOperator").val(),
          showConditions: JSON.stringify(conditions),
          formID: lfb_currentFormID,
        },
        success: function (rep) {},
      });
    }
    $("#lfb_winShowStepConditions").addClass("lfb_hidden");

    if (lfb_currentForm.form.useVisualBuilder == 1) {
      $("#lfb_winEditStepVisual").removeClass("lfb_hidden");
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_stepVisual").show();
    } else {
      $("#lfb_winStep").removeClass("lfb_hidden");
    }
  }

  function lfb_showConditionSave() {
    var conditions = new Array();
    $("#lfb_showConditionsTable .lfb_conditionItem").each(function () {
      var condValue = lfb_getConditionValue(
        $(this).find(".lfb_conditionValue")
      );

      if (condValue) {
        condValue = condValue.replace(/\'/g, "`");
      }
      conditions.push({
        interaction: $(this).find(".lfb_conditionSelect").val(),
        action: $(this).find(".lfb_conditionoperatorSelect").val(),
        value: condValue,
      });
    });
    $("#lfb_winItem")
      .find('.form-group [name="showConditionsOperator"]')
      .val($("#lfb_showOperator").val());
    $("#lfb_winItem")
      .find('.form-group [name="showConditions"]')
      .val(JSON.stringify(conditions));
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winItem").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();
  }

  function lfb_showStepConditionSave() {
    var conditions = new Array();
    var winStep = $("#lfb_winStep");
    if (lfb_currentForm.form.useVisualBuilder == 1) {
      winStep = $("#lfb_winStepSettings");
    }

    if ($("#lfb_showStepConditionsTable .lfb_conditionItem").length == 0) {
      winStep
        .find('[name="useShowConditions"]')
        .parent()
        .bootstrapSwitch("setState", false);
    } else {
      $("#lfb_showStepConditionsTable .lfb_conditionItem").each(function () {
        var condValue = lfb_getConditionValue(
          $(this).find(".lfb_conditionValue")
        );
        if (condValue) {
          condValue = condValue.replace(/\'/g, "`");
        }
        conditions.push({
          interaction: $(this).find(".lfb_conditionSelect").val(),
          action: $(this).find(".lfb_conditionoperatorSelect").val(),
          value: condValue,
        });
      });
    }
    winStep
      .find('[name="showConditionsOperator"]')
      .val($("#lfb_showStepOperator").val());
    winStep.find('[name="showConditions"]').val(JSON.stringify(conditions));

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");

    if (lfb_currentForm.form.useVisualBuilder == 1) {
      $("#lfb_winEditStepVisual").removeClass("lfb_hidden");
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_stepVisual").show();
      showModal($("#lfb_winStepSettings"));
    } else {
      $("#lfb_winStep").removeClass("lfb_hidden");
      $(".lfb_mainNavBar").hide();
      $("#lfb_navBar_step").show();
    }
  }

  function lfb_selectPre(input) {
    $(input).select();
  }

  function lfb_removeRedirection(id) {
    $('#lfb_redirsTable tr[data-id="' + id + '"]').remove();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_removeRedirection",
        id: id,
        formID: lfb_currentFormID,
      },
    });
  }

  function lfb_editRedirection(id, mode) {
    lfb_currentRedirEdit = id;
    $("#lfb_winRedirection #lfb_redirOperator").val(
      $("#lfb_winItem").find('[name="showConditionsOperator"]').val()
    );
    $("#lfb_winRedirection #lfb_redirConditionsTable tbody").html("");
    $("#lfb_winRedirection #lfb_redirUrl").val("");

    if (id > 0) {
      if (lfb_currentForm.redirections.length > 0) {
        $("#lfb_redirOperator").val(
          lfb_currentForm.redirections[0].conditionsOperator
        );
      }
      jQuery.each(lfb_currentForm.redirections, function () {
        if (this.id == id) {
          $("#lfb_winRedirection #lfb_redirUrl").val(this.url);
          var conditions = this.conditions.replace(/\\"/g, '"');
          conditions = JSON.parse(conditions);
          jQuery.each(conditions, function () {
            lfb_addRedirInteraction(this);
          });
        }
      });
    }

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winRedirection").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_redirections").show();
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
  }

  function lfb_redirSave() {
    var conditions = new Array();
    $("#lfb_winRedirection #lfb_redirUrl").removeClass("is-invalid");
    $("#lfb_winRedirection .lfb_conditionItem").each(function () {
      var condValue = $(this).find(".lfb_conditionValue").val();
      if (condValue) {
        condValue = condValue.replace(/\'/g, "`");
      }
      conditions.push({
        interaction: $(this).find(".lfb_conditionSelect").val(),
        action: $(this).find(".lfb_conditionoperatorSelect").val(),
        value: condValue,
      });
    });
    var url = $("#lfb_winRedirection #lfb_redirUrl").val();
    if (url.length < 1) {
      $("#lfb_winRedirection #lfb_redirUrl").addClass("is-invalid");
    } else {
      var data = {
        action: "lfb_saveRedirection",
        id: lfb_currentRedirEdit,
        url: url,
        formID: lfb_currentFormID,
        conditions: JSON.stringify(conditions),
        operator: $("#lfb_redirOperator").val(),
      };
      lfb_showLoader();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: data,
        success: function (rep) {
          if (lfb_currentRedirEdit == 0) {
            data.id = rep;
            lfb_currentForm.redirections.push(data);
            var tr = $('<tr data-id="' + data.id + '"></tr>');
            tr.append("<td>" + data.url + "</td>");
            tr.append(
              '<td style="text-align:right;"><a href="javascript:" data-action="lfb_editRedirection" class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="lfb_removeRedirection" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a></td>'
            );
            tr.find('a[data-action="lfb_editRedirection"]').on(
              "click",
              function () {
                lfb_editRedirection($(this).closest("tr").attr("data-id"));
              }
            );
            tr.find('a[data-action="lfb_removeRedirection"]').on(
              "click",
              function () {
                lfb_removeRedirection($(this).closest("tr").attr("data-id"));
              }
            );
            $("#lfb_redirsTable tbody").append(tr);
          } else {
            jQuery.each(lfb_currentForm.redirections, function () {
              if (this.id == lfb_currentRedirEdit) {
                this.url = data.url;
                this.conditions = data.conditions;
                this.conditionsOperator = data.operator;
              }
            });
          }
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    }

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_formFields").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_redirections").show();
  }

  function lfb_editDistanceValue(modeQt) {
    lfb_distanceModeQt = modeQt;
    var departAdress = -1;
    var departCity = -1;
    var departZip = -1;
    var departCountry = -1;
    var arrivalAdress = -1;
    var arrivalCity = -1;
    var arrivalZip = -1;
    var arrivalCountry = -1;
    var distanceType = "km";

    $("#lfb_distanceDuration").closest("p").show();
    if (modeQt == 9) {
      if ($('#lfb_winItem [name="type"]').val() == "gmap") {
        $("#lfb_distanceDuration").closest("p").hide();
      }
      var distCode = $('#lfb_winItem [name="distanceQt"]').val();
      if (distCode.indexOf("distance_") > -1) {
        var i = -1;
        while ((i = distCode.indexOf("distance_", i + 1)) != -1) {
          var departAdPosEnd = distCode.indexOf("-", i + 9) + 1;
          departAdress = distCode.substr(
            i + 9,
            distCode.indexOf("-", i) - (i + 9)
          );

          var departCityPosEnd = distCode.indexOf("-", departAdPosEnd) + 1;
          departCity = distCode.substr(
            departAdPosEnd,
            distCode.indexOf("-", departAdPosEnd) - departAdPosEnd
          );

          var departZipPosEnd = distCode.indexOf("-", departCityPosEnd) + 1;
          departZip = distCode.substr(
            departCityPosEnd,
            distCode.indexOf("-", departCityPosEnd) - departCityPosEnd
          );

          var departCountryPosEnd = distCode.indexOf("_", departZipPosEnd) + 1;
          departCountry = distCode.substr(
            departZipPosEnd,
            distCode.indexOf("_", departZipPosEnd) - departZipPosEnd
          );

          var arrivalAdPosEnd = distCode.indexOf("-", departCountryPosEnd) + 1;
          arrivalAdress = distCode.substr(
            departCountryPosEnd,
            distCode.indexOf("-", departCountryPosEnd) - departCountryPosEnd
          );

          var arrivalCityPosEnd = distCode.indexOf("-", arrivalAdPosEnd) + 1;
          arrivalCity = distCode.substr(
            arrivalAdPosEnd,
            distCode.indexOf("-", arrivalAdPosEnd) - arrivalAdPosEnd
          );

          var arrivalZipPosEnd = distCode.indexOf("-", arrivalCityPosEnd) + 1;
          arrivalZip = distCode.substr(
            arrivalCityPosEnd,
            distCode.indexOf("-", arrivalCityPosEnd) - arrivalCityPosEnd
          );

          var arrivalCountryPosEnd =
            distCode.indexOf("-", arrivalZipPosEnd) + 1;
          arrivalCountry = distCode.substr(
            arrivalZipPosEnd,
            distCode.indexOf("_", arrivalZipPosEnd) - arrivalZipPosEnd
          );

          distanceType = distCode.substr(
            arrivalCountryPosEnd,
            distCode.indexOf("]", arrivalCountryPosEnd) - arrivalCountryPosEnd
          );
        }
      }
    }

    var $selectDepart = $("#lfb_departAdressItem");
    var $selectArrival = $("#lfb_arrivalAdressItem");
    var $selectDepartCity = $("#lfb_departCityItem");
    var $selectArrivalCity = $("#lfb_arrivalCityItem");
    var $selectDepartZip = $("#lfb_departZipItem");
    var $selectArrivalZip = $("#lfb_arrivalZipItem");
    var $selectDepartCountry = $("#lfb_departCountryItem");
    var $selectArrivalCountry = $("#lfb_arrivalCountryItem");
    $("#lfb_distanceType").val(distanceType);

    $selectDepart.find("option").remove();
    $selectArrival.find("option").remove();
    $selectDepartCity.find("option").remove();
    $selectArrivalCity.find("option").remove();
    $selectDepartZip.find("option").remove();
    $selectArrivalZip.find("option").remove();
    $selectDepartCountry.find("option").remove();
    $selectArrivalCountry.find("option").remove();
    $selectDepart.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectArrival.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectDepartCity.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectArrivalCity.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectDepartZip.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectArrivalZip.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectDepartCountry.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );
    $selectArrivalCountry.append(
      '<option value="" data-type="">' + lfb_data.texts["Nothing"] + "</option>"
    );

    jQuery.each(lfb_currentForm.steps, function () {
      var step = this;
      jQuery.each(this.items, function () {
        var item = this;
        if (item.type == "textfield" || item.type == "select") {
          var itemID = item.id;
          var selDepAd = "";
          var selDepCity = "";
          var selDepZip = "";
          var selDepCountry = "";
          var selArrAd = "";
          var selArrCity = "";
          var selArrZip = "";
          var selArrCountry = "";

          if (item.id == departAdress) {
            selDepAd = "selected";
          }
          if (item.id == departCity) {
            selDepCity = "selected";
          }
          if (item.id == departZip) {
            selDepZip = "selected";
          }
          if (item.id == departCountry) {
            selDepCountry = "selected";
          }
          if (item.id == arrivalAdress) {
            selArrAd = "selected";
          }
          if (item.id == arrivalCity) {
            selArrCity = "selected";
          }
          if (item.id == arrivalZip) {
            selArrZip = "selected";
          }
          if (item.id == arrivalCountry) {
            selArrCountry = "selected";
          }

          $selectDepart.append(
            "<option " +
              selDepAd +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectArrival.append(
            "<option " +
              selArrAd +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectDepartCity.append(
            "<option " +
              selDepCity +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectArrivalCity.append(
            "<option " +
              selArrCity +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectDepartZip.append(
            "<option " +
              selDepZip +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectArrivalZip.append(
            "<option " +
              selArrZip +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectDepartCountry.append(
            "<option " +
              selDepCountry +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
          $selectArrivalCountry.append(
            "<option " +
              selArrCountry +
              ' value="' +
              itemID +
              '" data-type="' +
              item.type +
              '">' +
              step.title +
              ' : " ' +
              item.title +
              ' "</option>'
          );
        }
      });
    });

    var finalStepTxt = lfb_data.texts["lastStep"];
    jQuery.each(lfb_currentForm.fields, function () {
      var item = this;
      if (item.type == "textfield" || item.type == "select") {
        var itemID = item.id;
        var selDepAd = "";
        var selDepCity = "";
        var selDepZip = "";
        var selDepCountry = "";
        var selArrAd = "";
        var selArrCity = "";
        var selArrZip = "";
        var selArrCountry = "";

        if (item.id == departAdress) {
          selDepAd = "selected";
        }
        if (item.id == departCity) {
          selDepCity = "selected";
        }
        if (item.id == departZip) {
          selDepZip = "selected";
        }
        if (item.id == departCountry) {
          selDepCountry = "selected";
        }
        if (item.id == arrivalAdress) {
          selArrAd = "selected";
        }
        if (item.id == arrivalCity) {
          selArrCity = "selected";
        }
        if (item.id == arrivalZip) {
          selArrZip = "selected";
        }
        if (item.id == arrivalCountry) {
          selArrCountry = "selected";
        }

        $selectDepart.append(
          "<option " +
            selDepAd +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectArrival.append(
          "<option " +
            selArrAd +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectDepartCity.append(
          "<option " +
            selDepCity +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectArrivalCity.append(
          "<option " +
            selArrCity +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectDepartZip.append(
          "<option " +
            selDepZip +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectArrivalZip.append(
          "<option " +
            selArrZip +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectDepartCountry.append(
          "<option " +
            selDepCountry +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
        $selectArrivalCountry.append(
          "<option " +
            selArrCountry +
            ' value="' +
            itemID +
            '" data-type="' +
            item.type +
            '">' +
            finalStepTxt +
            ' : " ' +
            item.title +
            ' "</option>'
        );
      }
    });

    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winDistance").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_calcDistance").show();

    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    setTimeout(() => {
      $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    }, 400);
  }

  function lfb_saveDistanceValue() {
    var targetfieldName = "calculation";
    if (lfb_calculationModeQt == 1) {
      targetfieldName = "calculationQt";
    } else if (lfb_calculationModeQt == 2) {
      targetfieldName = "variableCalculation";
    }

    var depAd = "";
    if ($("#lfb_departAdressItem").val() != "") {
      depAd = $("#lfb_departAdressItem").val();
    }
    var depCity = "";
    if ($("#lfb_departCityItem").val() != "") {
      depCity = $("#lfb_departCityItem").val();
    }
    var depCountry = "";
    if ($("#lfb_departCountryItem").val() != "") {
      depCountry = $("#lfb_departCountryItem").val();
    }
    var depZip = "";
    if ($("#lfb_departZipItem").val() != "") {
      depZip = $("#lfb_departZipItem").val();
    }

    var arrivalAd = "";
    if ($("#lfb_arrivalAdressItem").val() != "") {
      arrivalAd = $("#lfb_arrivalAdressItem").val();
    }
    var arrivalCity = "";
    if ($("#lfb_arrivalCityItem").val() != "") {
      arrivalCity = $("#lfb_arrivalCityItem").val();
    }
    var arrivalCountry = "";
    if ($("#lfb_arrivalCountryItem").val() != "") {
      arrivalCountry = $("#lfb_arrivalCountryItem").val();
    }
    var arrivalZip = "";
    if ($("#lfb_arrivalZipItem").val() != "") {
      arrivalZip = $("#lfb_arrivalZipItem").val();
    }
    var distanceType = $("#lfb_distanceType").val();
    if ($("#lfb_distanceDuration").val() == "duration") {
      distanceType = $("#lfb_durationType").val();
    }

    var code = "[distance_";
    code +=
      depAd +
      "-" +
      depCity +
      "-" +
      depZip +
      "-" +
      depCountry +
      "_" +
      arrivalAd +
      "-" +
      arrivalCity +
      "-" +
      arrivalZip +
      "-" +
      arrivalCountry +
      "_" +
      distanceType;
    code += "]";

    if (
      depAd == "" &&
      depCity == "" &&
      depCountry == "" &&
      arrivalAd == "" &&
      arrivalCity == "" &&
      arrivalCountry == "" &&
      depZip == "" &&
      arrivalZip == ""
    ) {
      code = "";
    }

    if (lfb_distanceModeQt != 9) {
      if (
        $("#lfb_winItem")
          .find('[name="' + targetfieldName + '"]')
          .next()
          .is(".CodeMirror")
      ) {
        var editor = lfb_itemPriceCalculationEditor;
        if (targetfieldName == "calculationQt") {
          editor = lfb_itemCalculationQtEditor;
        } else if (targetfieldName == "variableCalculation") {
          editor = lfb_itemVariableCalculationEditor;
        }
        var doc = editor.getDoc();
        var cursor = doc.getCursor();
        doc.replaceRange(code, cursor);
        lfb_applyCalculationEditorTooltips(targetfieldName);
      } else {
        var posCar = $("#lfb_winItem")
          .find('[name="' + targetfieldName + '"]')
          .prop("selectionStart");
        var value = $("#lfb_winItem")
          .find('[name="' + targetfieldName + '"]')
          .val();
        if (isNaN(posCar)) {
          posCar == value.length;
        }
        var newValue =
          value.substr(0, posCar) +
          " " +
          code +
          " " +
          value.substr(posCar, value.length);
        $("#lfb_winItem")
          .find('[name="' + targetfieldName + '"]')
          .val(newValue);
      }
    } else {
      $("#lfb_winItem").find('[name="distanceQt"]').val(code);
    }

    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $("#lfb_winItem").removeClass("lfb_hidden");
    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_item").show();
  }

  function lfb_openFormDesigner(targetStep, targetDomElement) {
    $("#lfb_innerLoader").fadeOut();

    if (typeof targetStep != "undefined") {
      lfb_tld_targetStepID = targetStep;
    }
    if (typeof targetDomElement != "undefined") {
      lfb_tld_targetDomElement = targetDomElement;
    }
    lfb_tld_targetDomElement = targetDomElement;
    $("body").addClass("lfb_formDesigner");

    lfb_tld_onOpen();
  }

  function lfb_closeFormDesigner() {
    $("body").removeClass("lfb_formDesigner");
    $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
    $("#lfb_tld_tdgnBootstrap").addClass("lfb_hidden");

    if (lfb_currentFormID > 0) {
      $("#lfb_panelPreview").removeClass("lfb_hidden");
      if (
        lfb_currentForm.form.useVisualBuilder == 1 &&
        lfb_tld_targetStepID != ""
      ) {
        var stepID = lfb_tld_targetStepID;
        if (lfb_tld_targetStepID == "final") {
          stepID = 0;
        }
        $("#lfb_stepFrame").attr("src", "about:blank");
        lfb_editVisualStep(stepID);
      } else {
        $('a[data-action="showStepsManager"]').trigger("click");
      }
    } else {
      $("#lfb_panelFormsList").removeClass("lfb_hidden");
    }
    lfb_tld_targetStepID = "";
    lfb_tld_targetDomElement = "";
    setTimeout(function () {
      $("#lfb_tld_tdgnFrame").attr("src", "about:blank");
    }, 400);
    $("body").css({
      overflow: "initial",
    });
  }

  function lfb_edit_option(btn) {
    var $tr = $(btn).closest("tr");
    var name = $tr.children("td:eq(0)").html();
    var price = $tr.children("td:eq(1)").html();
    $tr
      .children("td:eq(0)")
      .html(
        '<input type="text" id="option_edit_value" class="form-control" value="' +
          name +
          '" placeholder="Option value">'
      );
    $tr
      .children("td:eq(1)")
      .html(
        '<input type="number" id="option_new_price" step="any" class="form-control" value="' +
          price +
          '" placeholder="Option price">'
      );
    $(btn).hide();
    $(btn).after(
      '<a href="javascript:"  data-action="lfb_edit_saveOption" class="btn btn-circle btn-outline btn-outline-primary btn-circle "><span class="fas fa-check"></span></a>'
    );
    $(btn)
      .next('a[data-action="lfb_edit_saveOption"]')
      .on("click", function () {
        lfb_edit_saveOption(this);
      });
  }

  function lfb_edit_saveOption(btn) {
    var $tr = $(btn).closest("tr");
    var name = $tr.children("td:eq(0)").find("input").val().replace(/"/g, "“");
    var price = $tr.children("td:eq(1)").find("input").val();
    $tr.children("td:eq(0)").html(name);
    $tr.children("td:eq(1)").html(price);
    $(btn).prev("a").show();
    $(btn).remove();
  }

  function lfb_askDeleteItem(itemID) {
    $("#lfb_winDeleteItem").attr("data-itemid", itemID);
    showModal($("#lfb_winDeleteItem"));
  }

  function lfb_confirmDeleteItem() {
    lfb_removeItem($("#lfb_winDeleteItem").attr("data-itemid"));

    if (lfb_currentForm.form.useVisualBuilder == 1) {
      $("#lfb_stepFrame")[0]
        .contentWindow.jQuery("#lfb_form")
        .trigger("lfb_onItemDeleted", [
          $("#lfb_winDeleteItem").attr("data-itemid"),
        ]);
    }
    hideModal($("#lfb_winDeleteItem"));
  }

  function lfb_askDeleteStep(stepID) {
    $("#lfb_winDeleteStep").attr("data-stepid", stepID);
    showModal($("#lfb_winDeleteStep"));
  }

  function lfb_confirmDeleteStep() {
    hideModal($("#lfb_winDeleteStep"));
    lfb_removeStep($("#lfb_winDeleteStep").attr("data-stepid"));
  }

  function lfb_askDeleteForm(formID) {
    lfb_formToDelete = formID;
    var formTitle = $(
      '#lfb_panelFormsList table tbody > tr[data-formid="' +
        formID +
        '"] a.lfb_formListTitle'
    ).text();
    $("#lfb_winDeleteForm #lfb_deleteFormTitle").html(formTitle);
    $('#lfb_winDeleteForm [data-action="lfb_confirmDeleteForm"]').focus();
    showModal($("#lfb_winDeleteForm"));
  }

  function lfb_confirmDeleteForm() {
    hideModal($("#lfb_winDeleteForm"));
    lfb_removeForm(lfb_formToDelete);
  }

  function lfb_removeLayerImg(btn) {
    var $tr = $(btn).closest("tr");
    $tr.slideUp();
    setTimeout(function () {
      $tr.remove();
    }, 380);
  }

  function lfb_showLayersTable(layers) {
    $("#lfb_imageLayersTable tbody").html("");
    jQuery.each(layers, function () {
      var img =
        '<input type="hidden" name="image" value="' + this.image + '" />';
      if (this.image != "") {
        img +=
          '<a href="javascript:" class="imageBtn" data-toggle="tooltip" data-bs-placement="bottom" title="' +
          lfb_data.texts["edit"] +
          '" ><img src="' +
          this.image +
          '" class="lfb_layerImgPreview" /></a>';
      } else {
        img +=
          '<a href="javascript:" class="btn btn-circle btn-primary imageBtn"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
          lfb_data.texts["edit"] +
          '"><span class="fas fa-plus"></span></a>';
      }
      var $tr = $('<tr data-layerid="' + this.id + '"></tr>');
      $tr.append(
        '<td><a href="javascript:" data-action="lfb_editLayerTitle">' +
          this.title +
          "</a></td>"
      );
      $tr.append("<td>" + img + "</td>");
      $tr.append(
        '<td style="text-align: right;"><a href="javascript:" data-toggle="tooltip" data-bs-placement="bottom"  title="' +
          lfb_data.texts["editConditions"] +
          '" class="btn btn-circle btn-primary" data-action="lfb_editLayerConditions"><span class="fa fa-eye"></span></a><textarea style="display: none;" name="showConditions">' +
          this.showConditions +
          '</textarea><input type="hidden" name="showConditionsOperator" value="' +
          this.showConditionsOperator +
          '"/><a href="javascript:" data-action="lfb_duplicateLayer" data-toggle="tooltip" data-bs-placement="bottom"  title="' +
          lfb_data.texts["duplicate"] +
          '"  class="btn btn-sm btn-outline-secondary btn-circle"><span class="far fa-copy"></span></a><a href="javascript:" data-toggle="tooltip" data-bs-placement="bottom"  title="' +
          lfb_data.texts["remove"] +
          '" class="btn btn-circle btn-danger" data-action="lfb_removeLayerImg"><span class="fas fa-trash"></span></a></td>'
      );

      $("#lfb_imageLayersTable tbody").append($tr);

      $tr.find('[name="image"]').on("keyup", function () {
        lfb_onLayerImgChange(this);
      });

      $tr.find('[data-toggle="tooltip"]').tooltip();

      $tr.find('a[data-action="lfb_editLayerTitle"]').on("click", function () {
        lfb_editLayerTitle(this);
      });
      $tr
        .find('a[data-action="lfb_editLayerConditions"]')
        .on("click", function () {
          lfb_editLayerConditions(this);
        });
      $tr.find('a[data-action="lfb_duplicateLayer"]').on("click", function () {
        lfb_duplicateLayer(this);
      });
      $tr.find('a[data-action="lfb_removeLayerImg"]').on("click", function () {
        lfb_removeLayerImg(this);
      });

      $tr.find(".imageBtn").on("click", function () {
        lfb_formfield = $(this).prev("input");
        tb_show("", "media-upload.php?TB_iframe=true");
        return false;
      });
    });
  }

  function lfb_duplicateLayer(btn) {
    $("#lfb_imageLayersTable .lfb_layerEditField").remove();
    var $tr = $(btn).closest("tr");
    var newTr = $tr.clone();
    $tr.after(newTr);
    newTr.find(".imageBtn").on("click", function () {
      lfb_formfield = $(this).prev("input");
      tb_show("", "media-upload.php?TB_iframe=true");
      return false;
    });
  }

  function lfb_newLayerImg() {
    var $tr = $('<tr data-layerid="0"></tr>');
    $tr.append(
      '<td><a href="javascript:" data-action="lfb_editLayerTitle">' +
        lfb_data.texts["myNewLayer"] +
        "</a></td>"
    );
    $tr.append(
      '<td><input type="hidden" name="image" value="" /><a href="javascript:"  data-bs-placement="bottom" data-toggle="tooltip" title="' +
        lfb_data.texts["edit"] +
        '" class="btn btn-circle btn-primary imageBtn"><span class="fas fa-plus"></span></a></td>'
    );

    $tr.find('[name="image"]').on("keyup", function () {
      lfb_onLayerImgChange(this);
    });
    $tr.append(
      '<td style="text-align: right;"><a href="javascript:" data-toggle="tooltip"  data-bs-placement="bottom" title="' +
        lfb_data.texts["editConditions"] +
        '" class="btn btn-circle btn-primary" data-action="lfb_editLayerConditions"><span class="fa fa-eye"></span></a><textarea style="display: none;" name="showConditions"></textarea><input type="hidden" name="showConditionsOperator" value=""/><a href="javascript:"  data-bs-placement="bottom" data-toggle="tooltip" title="' +
        lfb_data.texts["duplicate"] +
        '" data-action="lfb_duplicateLayer" class="btn btn-sm btn-outline-secondary btn-circle"><span class="far fa-copy"></span></a><a href="javascript:"  data-bs-placement="bottom" data-toggle="tooltip" title="' +
        lfb_data.texts["remove"] +
        '" class="btn btn-circle btn-danger" data-action="lfb_removeLayerImg"><span class="fas fa-trash"></span></a></td>'
    );

    $tr.find('a[data-action="lfb_editLayerTitle"]').on("click", function () {
      lfb_editLayerTitle(this);
    });
    $tr
      .find('a[data-action="lfb_editLayerConditions"]')
      .on("click", function () {
        lfb_editLayerConditions(this);
      });
    $tr.find('a[data-action="lfb_duplicateLayer"]').on("click", function () {
      lfb_duplicateLayer(this);
    });
    $tr.find('a[data-action="lfb_removeLayerImg"]').on("click", function () {
      lfb_removeLayerImg(this);
    });

    $tr.find('[data-toggle="tooltip"]').tooltip();
    $("#lfb_imageLayersTable tbody").append($tr);
    $tr.find(".imageBtn").on("click", function () {
      lfb_formfield = $(this).prev("input");
      tb_show("", "media-upload.php?TB_iframe=true");
      return false;
    });
  }

  function lfb_editLayerTitle(btn) {
    if ($("#lfb_imageLayersTable .lfb_layerEditField").length > 0) {
      $("#lfb_imageLayersTable .lfb_layerEditField")
        .prev()
        .html($("#lfb_imageLayersTable .lfb_layerEditField input").val());
      $("#lfb_imageLayersTable .lfb_layerEditField").prev().show();
      $("#lfb_imageLayersTable .lfb_layerEditField").remove();
    }
    $(btn).closest("tr").children("td").first().find("a").hide();
    $(btn)
      .closest("tr")
      .children("td")
      .first()
      .find("a")
      .after(
        '<div class="lfb_layerEditField form-group"><input type="text" class="form-control" value="' +
          $(btn).closest("tr").children("td").first().find("a").text() +
          '"/></div>'
      );
    $("#lfb_imageLayersTable .lfb_layerEditField").on("focusout", function () {
      $("#lfb_imageLayersTable .lfb_layerEditField")
        .prev()
        .html($("#lfb_imageLayersTable .lfb_layerEditField input").val());
      $("#lfb_imageLayersTable .lfb_layerEditField").prev().show();
      $("#lfb_imageLayersTable .lfb_layerEditField").remove();
    });
  }

  function lfb_onLayerImgChange(field) {
    var rep = "";
    if ($(field).val() == "") {
      $(field).closest("td").find("a").addClass("btn");
      $(field).closest("td").find("a").addClass("btn-primary");
      $(field).closest("td").find("a").addClass("btn-circle");
      $(field)
        .closest("td")
        .find("a")
        .html('<span class="fas fa-plus"></span>');
    } else {
      $(field).closest("td").find("a").removeClass("btn");
      $(field).closest("td").find("a").removeClass("btn-primary");
      $(field).closest("td").find("a").removeClass("btn-circle");
      $(field)
        .closest("td")
        .find("a")
        .html(
          '<img src="' + $(field).val() + '" class="lfb_layerImgPreview" />'
        );
    }
  }

  function lfb_openWinModifyTotal() {
    if (lfb_currentLogUseSub == 1) {
      $('#lfb_winNewTotal [name="lfb_modifySubTotalField"]')
        .closest(".form-group")
        .slideDown();
    } else {
      $('#lfb_winNewTotal [name="lfb_modifySubTotalField"]').val(0);
      $('#lfb_winNewTotal [name="lfb_modifySubTotalField"]')
        .closest(".form-group")
        .slideUp();
    }
    showModal($("#lfb_winNewTotal"));
  }

  function lfb_confirmModifyTotal() {
    hideModal($("#lfb_winNewTotal"));
    var vatPrice = parseFloat(
      $('#lfb_winNewTotal [name="lfb_modifyVATField"]').val()
    );
    var total = parseFloat(
      $('#lfb_winNewTotal [name="lfb_modifyTotalField"]').val()
    );
    var totalSub = parseFloat(
      $('#lfb_winNewTotal [name="lfb_modifySubTotalField"]').val()
    );

    if (isNaN(vatPrice)) {
      vatPrice = 0;
    }

    lfb_currentLogTotal = total;
    lfb_currentLogSubTotal = totalSub;
    var summaryPrice =
      lfb_currentLogCurrency +
      "" +
      lfb_formatLogPrice(totalSub.toFixed(2), lfb_currentFormID);
    var summaryPriceSingle =
      lfb_currentLogCurrency +
      "" +
      lfb_formatLogPrice(total.toFixed(2), lfb_currentFormID);
    if (lfb_currentLogCurrencyPosition != "left") {
      vatPrice =
        lfb_formatLogPrice(vatPrice.toFixed(2), lfb_currentFormID) +
        "" +
        lfb_currentLogCurrency;
      summaryPrice =
        lfb_formatLogPrice(totalSub.toFixed(2), lfb_currentFormID) +
        "" +
        lfb_currentLogCurrency;
      summaryPriceSingle =
        lfb_formatLogPrice(total.toFixed(2), lfb_currentFormID) +
        "" +
        lfb_currentLogCurrency;
    } else {
      vatPrice =
        lfb_currentLogCurrency +
        "" +
        lfb_formatLogPrice(vatPrice.toFixed(2), lfb_currentFormID);
    }

    if ($("#lfb_winLog").find(".lfb_logContainer #lfb_summaryVat").length > 0) {
      var color = $("#lfb_winLog")
        .find(".lfb_logContainer #lfb_vatRow")
        .find("th")
        .first()
        .css("color");
      $(".lfb_logEditorContainer #lfb_summaryVat").html(
        '<span style="color: ' + color + ' !important;">' + vatPrice + "</span>"
      );
    }
    var totalColor = $(".lfb_logEditorContainer #lfb_summaryTotal span").css(
      "color"
    );
    if (total > 0 && totalSub > 0) {
      $(".lfb_logEditorContainer #lfb_summaryTotal").html(
        '<span style="color: ' +
          totalColor +
          ' !important;">' +
          summaryPrice +
          "</span>" +
          lfb_currentLogSubTxt +
          " <br/>+" +
          summaryPriceSingle
      );
    } else if (totalSub > 0) {
      $(".lfb_logEditorContainer #lfb_summaryTotal").html(
        '<span style="color: ' +
          totalColor +
          ' !important;">' +
          summaryPrice +
          "</span>" +
          lfb_currentLogSubTxt
      );
    } else {
      $(".lfb_logEditorContainer #lfb_summaryTotal").html(
        '<span style="color: ' +
          totalColor +
          ' !important;">' +
          summaryPriceSingle +
          "</span>"
      );
    }
    $(".lfb_logEditorContainer #lfb_summaryTotal").css(
      "color",
      $(".lfb_logEditorContainer #lfb_summaryTotal").attr("color")
    );
  }

  function lfb_formatLogPrice(price, formID) {
    if (!price) {
      price = 0;
    }
    var formatedPrice = price.toString();
    if (formatedPrice.indexOf(".") > -1) {
      formatedPrice = parseFloat(price).toFixed(2).toString();
    }
    var form = lfb_currentForm;
    if (form.summary_noDecimals == "1") {
      formatedPrice = Math.round(formatedPrice).toString();
    }
    var decSep = lfb_currentLogDecSep;
    var thousSep = lfb_currentLogThousSep;
    var priceNoDecimals = formatedPrice;
    var millionSep = lfb_currentLogMilSep;
    var decimals = "";
    if (formatedPrice.indexOf(".") > -1) {
      priceNoDecimals = formatedPrice.substr(0, formatedPrice.indexOf("."));
      decimals = formatedPrice.substr(formatedPrice.indexOf(".") + 1, 2);
      formatedPrice = formatedPrice.replace(".", decSep);
      if (decimals.toString().length == 1) {
        decimals = decimals.toString() + "0";
      }
      if (priceNoDecimals.length > 6) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 6) +
          millionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 6, 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          ) +
          decSep +
          decimals;
      } else if (priceNoDecimals.length > 3) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          ) +
          decSep +
          decimals;
      }
    } else {
      if (priceNoDecimals.length > 6) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 6) +
          millionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 6, 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          );
      } else if (priceNoDecimals.length > 3) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          );
      }
    }
    return formatedPrice;
  }

  function lfb_resetReference() {
    $("#lfb_btnResetRef").addClass("disabled");
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_resetReference",
        formID: lfb_currentFormID,
      },
    });
  }

  function lfb_openCalendarPanelFromItem() {
    lfb_openCalendarsPanel($('#lfb_winItem [name="calendarID"]').val());
  }

  function lfb_openCalendarsPanel(calendarID) {
    $("html,body").css("overflow-y", "auto");

    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    $("#lfb_mainToolbar a.lfb_over-primary")
      .removeClass("lfb_over-primary")
      .addClass("lfb_over-default");
    $('#lfb_mainToolbar a[data-action="openCalendarsPanel"]')
      .removeClass("lfb_over-default")
      .addClass("lfb_over-primary");

    if (calendarID == null) {
      calendarID = 1;
    }
    if ($("#lfb_panelLogs").css("display") != "none") {
      lfb_lastPanel = $("#lfb_panelLogs");
    } else {
      lfb_lastPanel = false;
    }

    lfb_showLoader();
    $("#lfb_panelFormsList .tooltip").remove();
    $(".lfb_winHeader .tooltip").remove();

    setTimeout(function () {
      $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
      $("#lfb_winCalendars").removeClass("lfb_hidden");
      $("#lfb_winCalendars").show();
    }, 300);
    $("#lfb_navBar_calendars").show();
    if (lfb_currentForm) {
      $('#lfb_winCalendars [data-action="returnToTheForm"]').show();
    } else {
      $('#lfb_winCalendars [data-action="returnToTheForm"]').hide();
    }

    lfb_currentCalendarEventID = 0;
    $("#lfb_selectCalendar").val(calendarID);
    $("#lfb_selectCalendar").trigger("change");
    setTimeout(function () {
      $("#lfb_loader").fadeOut();
      $("#lfb_loaderText").html("");
      $(window).trigger("resize");
      $("#lfb_selectCalendar").trigger("change");
    }, 1000);
  }

  function lfb_openCalendarLeftMenu() {
    lfb_openLeftPanel("lfb_calendarLeftMenu");
  }

  function lfb_closeCalendarLeftMenu() {
    $("#lfb_calendarLeftMenu .lfb_lPanelBody").fadeOut();
    $("#lfb_calendarLeftMenu .lfb_lPanelHeader").fadeOut();
    setTimeout(function () {
      $("#lfb_calendar").removeClass("lfb_open");
      $("#lfb_calendarLeftMenu").removeClass("lfb_open");
    }, 300);
  }

  function lfb_editCalendarEvent(eventID) {
    var chkEvent = false;
    if (eventID > 0) {
      $("#lfb_calEventRemindersTable").closest(".form-group").show();
      var eventData = lfb_getCalendarEvent(eventID);
      if (eventData != false) {
        chkEvent = true;
        lfb_currentCalendarEventID = eventID;
        $('#lfb_calendarLeftMenu [name="title"]').val(eventData.title);
        $('#lfb_calendarLeftMenu [name="start"]').datetimepicker(
          "setDate",
          moment(
            eventData.start,
            "YYYY-MM-DD " + lfb_data.timeFormatMoment
          ).toDate()
        );
        if (eventData.allDay == 1) {
          $('#lfb_calendarLeftMenu [name="end"]')
            .closest(".form-group")
            .slideUp();
          $('#lfb_calendarLeftMenu [name="end"]').val("");
          $('#lfb_calendarLeftMenu [name="allDay"]')
            .parent()
            .bootstrapSwitch("setState", true);
        } else {
          $('#lfb_calendarLeftMenu [name="end"]').datetimepicker(
            "setDate",
            moment(
              eventData.end,
              "YYYY-MM-DD " + lfb_data.timeFormatMoment
            ).toDate()
          );
          $('#lfb_calendarLeftMenu [name="end"]')
            .closest(".form-group")
            .slideDown();
          $('#lfb_calendarLeftMenu [name="allDay"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }
        var isBusy = false;
        if (eventData.isBusy == 1) {
          isBusy = true;
        }
        $('#lfb_calendarLeftMenu [name="orderID"]').val(eventData.orderID);
        $('#lfb_calendarLeftMenu [name="categoryID"]').val(
          eventData.categoryID
        );
        $('#lfb_calendarLeftMenu [name="customerID"]').val(
          eventData.customerID
        );
        $('#lfb_calendarLeftMenu [name="notes"]').val(eventData.notes);
        $('#lfb_calendarLeftMenu [name="customerAddress"]').val(
          eventData.customerAddress
        );
        $('#lfb_calendarLeftMenu [name="customerEmail"]').val(
          eventData.customerEmail
        );
        $('#lfb_calendarLeftMenu [name="isBusy"]')
          .parent()
          .bootstrapSwitch("setState", isBusy);
        lfb_generateRemindersTable(eventData.reminders);
      }
    } else {
      $("#lfb_calEventRemindersTable").closest(".form-group").hide();
    }
    if (!chkEvent) {
      lfb_currentCalendarEventID = 0;
      $('#lfb_calendarLeftMenu [name="title"]').val("");
      $('#lfb_calendarLeftMenu [name="start"]').val("");
      $('#lfb_calendarLeftMenu [name="end"]').val("");
      $('#lfb_calendarLeftMenu [name="allDay"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $('#lfb_calendarLeftMenu [name="orderID"]').val("");
      $('#lfb_calendarLeftMenu [name="notes"]').val("");
      $('#lfb_calendarLeftMenu [name="categoryID"]').val(
        $('#lfb_calendarLeftMenu [name="categoryID"] option')
          .first()
          .attr("value")
      );
      $('#lfb_calendarLeftMenu [name="customerID"]').val(
        $('#lfb_calendarLeftMenu [name="customerID"] option')
          .first()
          .attr("value")
      );
      $('#lfb_calendarLeftMenu [name="customerAddress"]').val("");
      $('#lfb_calendarLeftMenu [name="customerEmail"]').val("");
      $('#lfb_calendarLeftMenu [name="isBusy"]')
        .parent()
        .bootstrapSwitch("setState", false);
      $("#lfb_calendarLeftMenu #lfb_calEventRemindersTable tbody").html("");
    }
    $("html,body").animate({ scrollTop: 0 }, 250);
    lfb_updatelLeftPanels();
    lfb_openCalendarLeftMenu();
  }

  function lfb_generateRemindersTable(reminders) {
    var target = "#lfb_calendarLeftMenu #lfb_calEventRemindersTable";
    if (lfb_currentCalendarEventID == 0) {
      target = "#lfb_calEventRemindersTableDefault";
    }
    $(target).find("tbody").html("");
    jQuery.each(reminders, function () {
      var delayText = lfb_data.texts["days"];
      if (this.delayType == "hours") {
        delayText = lfb_data.texts["hours"];
      } else if (this.delayType == "weeks") {
        delayText = lfb_data.texts["weeks"];
      } else if (this.delayType == "months") {
        delayText = lfb_data.texts["months"];
      }
      var tr = $(
        '<tr data-id="' +
          this.id +
          '"><td>' +
          this.delayValue +
          " " +
          this.delayType +
          '</td><td class="lfb_calReminderActionTd"><a href="javascript:" data-action="lfb_editCalendarReminder" class="btn btn-outline-primary btn-circle "><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="lfb_deleteCalendarReminder" class="btn btn-sm btn-outline-danger btn-circle "><span class="fas fa-trash"></span></a></td></tr>'
      );
      tr.find('a[data-action="lfb_editCalendarReminder"]').on(
        "click",
        function () {
          lfb_editCalendarReminder($(this).closest("tr").attr("data-id"));
        }
      );
      tr.find('a[data-action="lfb_deleteCalendarReminder"]').on(
        "click",
        function () {
          lfb_deleteCalendarReminder($(this).closest("tr").attr("data-id"));
        }
      );
      $(target).find("tbody").append(tr);
    });
    if (reminders.length == 0) {
      $(target)
        .find("tbody")
        .html(
          '<tr><td colspan="2">' + lfb_data.texts["noReminders"] + "</td></tr>"
        );
    }
  }

  function lfb_calEventFullDayChange() {
    if ($('#lfb_calendarLeftMenu [name="allDay"]').is(":checked")) {
      $('#lfb_calendarLeftMenu [name="end"]').closest(".form-group").slideUp();
    } else {
      $('#lfb_calendarLeftMenu [name="end"]')
        .closest(".form-group")
        .slideDown();
    }
  }

  function lfb_calEventStartDateChange() {
    if (!$('#lfb_calendarLeftMenu [name="allDay"]').is(":checked")) {
      if (
        $('#lfb_calendarLeftMenu [name="end"]').val() == "" ||
        moment(
          $('#lfb_calendarLeftMenu [name="end"]').datetimepicker("getDate")
        ) <
          moment(
            $('#lfb_calendarLeftMenu [name="start"]').datetimepicker("getDate")
          )
      ) {
        $('#lfb_calendarLeftMenu [name="end"]').datetimepicker(
          "setDate",
          moment(
            moment(
              $('#lfb_calendarLeftMenu [name="start"]').datetimepicker(
                "getDate"
              )
            ).add(1, "hours"),
            "YYYY-MM-DD  HH:mm"
          ).toDate()
        );
      }
    }
  }

  function lfb_calEventCategoryIDChange() {
    var category = lfb_getCalendarCat(
      $('#lfb_calendarLeftMenu [name="categoryID"]').val()
    );
    if (category.isBusy == 1) {
      $('#lfb_calendarLeftMenu [name="isBusy"]')
        .parent()
        .bootstrapSwitch("setState", true);
    } else {
      $('#lfb_calendarLeftMenu [name="isBusy"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }
  }

  function lfb_selectCalendarChange() {
    if ($("#lfb_selectCalendar").val() > 1) {
      $("#lfb_btnDeleteCalendar").removeAttr("disabled");
    } else {
      $("#lfb_btnDeleteCalendar").attr("disabled", "disabled");
    }
    lfb_closeAllLeftPanels();
    lfb_currentCalendarEventID = 0;
    lfb_currentCalendarID = $("#lfb_selectCalendar").val();
    $("#lfb_calendar").fullCalendar("refetchEvents");
  }

  function lfb_saveCalendarEvent() {
    var title = $('#lfb_calendarLeftMenu [name="title"]').val();
    var start = moment(
      $('#lfb_calendarLeftMenu [name="start"]').datetimepicker("getDate")
    ).format("YYYY-MM-DD HH:mm:ss");
    var end = moment(
      $('#lfb_calendarLeftMenu [name="end"]').datetimepicker("getDate")
    ).format("YYYY-MM-DD HH:mm:ss");
    var customerEmail = $('#lfb_calendarLeftMenu [name="customerEmail"]').val();
    var customerAddress = $(
      '#lfb_calendarLeftMenu [name="customerAddress"]'
    ).val();
    var notes = $('#lfb_calendarLeftMenu [name="notes"]').val();
    var categoryID = $('#lfb_calendarLeftMenu [name="categoryID"]').val();
    var allDay = 0;
    var isBusy = 0;
    var error = false;

    $('#lfb_calendarLeftMenu [name="title"]').removeClass("is-invalid");
    $('#lfb_calendarLeftMenu [name="end"]').removeClass("is-invalid");

    if (title.length == 0) {
      error = true;
      $('#lfb_calendarLeftMenu [name="title"]').addClass("is-invalid");
    }
    if ($('#lfb_calendarLeftMenu [name="allDay"]').is(":checked")) {
      allDay = 1;
    }
    if ($('#lfb_calendarLeftMenu [name="isBusy"]').is(":checked")) {
      isBusy = 1;
    }
    if (!allDay && $('#lfb_calendarLeftMenu [name="end"]').val() == "") {
      error = true;
      $('#lfb_calendarLeftMenu [name="end"]').addClass("is-invalid");
    }

    if (!error) {
      $("body,html").animate(
        {
          scrollTop: 0,
        },
        200
      );
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCalendarEvent",
          calendarID: lfb_currentCalendarID,
          eventID: lfb_currentCalendarEventID,
          title: title,
          allDay: allDay,
          orderID: $('#lfb_calendarLeftMenu [name="orderID"]').val(),
          start: start,
          end: end,
          customerEmail: customerEmail,
          customerAddress: customerAddress,
          categoryID: categoryID,
          notes: notes,
          isBusy: isBusy,
        },
        success: function (eventID) {
          var newData = {
            calendarID: lfb_currentCalendarID,
            eventID: eventID,
            title: title,
            allDay: allDay,
            orderID: $('#lfb_calendarLeftMenu [name="orderID"]').val(),
            start: start,
            end: end,
            customerEmail: customerEmail,
            customerAddress: customerAddress,
            notes: notes,
            isBusy: isBusy,
            categoryID: categoryID,
            reminders: new Array(),
          };

          if (lfb_currentCalendarEventID == 0) {
            lfb_currentCalendarEvents.push(newData);
            lfb_currentCalendarEventID = eventID;
          } else {
            var eventData = lfb_getCalendarEvent(eventID);
            eventData = newData;
          }
          $("#lfb_calendar").fullCalendar("refetchEvents");
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
          $("#lfb_calEventRemindersTable").closest(".form-group").slideDown();
        },
      });
    }
  }

  function lfb_addCalendarEvent(date, cell) {
    lfb_editCalendarEvent(0);
    $('#lfb_calendarLeftMenu [name="start"]').datetimepicker(
      "setDate",
      new Date(
        moment.utc(date).format("YYYY-MM-DD " + lfb_data.timeFormatMoment)
      )
    );
    var endDate = date.toDate();
    endDate.setTime(endDate.getTime() + 60 * 60 * 1000);
    $('#lfb_calendarLeftMenu [name="end"]').datetimepicker(
      "setDate",
      new Date(
        moment.utc(endDate).format("YYYY-MM-DD " + lfb_data.timeFormatMoment)
      )
    );
  }

  function lfb_confirmDeleteCalendarEvent() {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      200
    );
    hideModal($("#lfb_winDeleteCalendarEvent"));
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_deleteCalendarEvent",
        eventID: lfb_currentCalendarEventID,
      },
      success: function () {
        $("#lfb_calendar").fullCalendar("refetchEvents");
        lfb_currentCalendarEventID = 0;
        lfb_closeAllLeftPanels();
      },
    });
  }

  function lfb_deleteCalendarEvent() {
    showModal($("#lfb_winDeleteCalendarEvent"));
  }

  function lfb_addNewCalendar() {
    $("#lfb_winEditCalendar").attr("data-calendarid", 0);
    showModal($("#lfb_winEditCalendar"));
  }

  function lfb_addEditCalendar() {
    $("#lfb_winEditCalendar").attr("data-calendarid", lfb_currentCalendarID);
    showModal($("#lfb_winEditCalendar"));
  }

  function lfb_saveCalendar() {
    var calendarID = $("#lfb_winEditCalendar").attr("data-calendarid");
    var title = $('#lfb_winEditCalendar [name="title"]').val();
    $('#lfb_winEditCalendar [name="title"]').removeClass("is-invalid");

    if (title.length == 0) {
      $('#lfb_winEditCalendar [name="title"]').addClass("is-invalid");
    } else {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCalendar",
          calendarID: calendarID,
          title: title,
        },
        success: function (newCalendarID) {
          if (calendarID > 0) {
            $('#lfb_selectCalendar option[value="' + newCalendarID + '"]').html(
              rep
            );
          } else {
            $("#lfb_selectCalendar").append(
              '<option value="' + newCalendarID + '">' + title + "</option>"
            );
            $("#lfb_winItem")
              .find('[name="calendarID"]')
              .append(
                '<option value="' + newCalendarID + '">' + title + "</option>"
              );
            $("#lfb_selectCalendar").val(newCalendarID);
            $("#lfb_selectCalendar").trigger("change");
          }
        },
      });
      hideModal($("#lfb_winEditCalendar"));
    }
  }

  function lfb_askDeleteCalendar() {
    showModal($("#lfb_winDeleteCalendar"));
  }

  function lfb_deleteCalendar() {
    hideModal($("#lfb_winDeleteCalendar"));
    if (lfb_currentCalendarID > 1) {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_deleteCalendar",
          calendarID: lfb_currentCalendarID,
        },
        success: function (calendarID) {
          calendarID = calendarID.trim();

          $("#lfb_winItem")
            .find(
              '[name="calendarID"] option[value="' +
                lfb_currentCalendarID +
                '"]'
            )
            .remove();
          $(
            '#lfb_selectCalendar option[value="' + lfb_currentCalendarID + '"]'
          ).remove();
          lfb_currentCalendarID = 1;
          $("#lfb_selectCalendar").val(1);
          $("#lfb_selectCalendar").trigger("change");
          $("#lfb_calendar").fullCalendar("refetchEvents");
        },
      });
    }
  }

  function lfb_getCalendarEvent(eventID) {
    var rep = false;
    jQuery.each(lfb_currentCalendarEvents, function () {
      if (this.id == eventID) {
        rep = this;
      }
    });
    return rep;
  }

  function lfb_btnCalEventViewCustomerClick() {
    var customerID = parseInt(
      $('#lfb_calendarLeftMenu [name="customerID"]').val()
    );
    if (customerID > 0) {
      lfb_showLoader();
      lfb_editCustomer(customerID);
      $("#lfb_loader").fadeOut();
      $("#lfb_loaderText").html("");
    }
  }

  function lfb_btnCalEventViewOrderClick() {
    var orderID = parseInt($('#lfb_calendarLeftMenu [name="orderID"]').val());
    if (orderID > 0) {
      lfb_lastPanel = $("#lfb_winCalendars");
      lfb_showLoader();
      lfb_loadLog(orderID, false);
      $("#lfb_loader").fadeOut();
      $("#lfb_loaderText").html("");
    }
  }

  function lfb_calEventCustomerIDChange() {
    var customerID = parseInt(
      $('#lfb_calendarLeftMenu [name="customerID"]').val()
    );
    if (customerID == 0) {
    } else {
      if (
        $('#lfb_calendarLeftMenu [name="orderID"]').val() != 0 &&
        $('#lfb_calendarLeftMenu [name="orderID"] option:selected').attr(
          "data-customerid"
        ) != customerID
      ) {
        $('#lfb_calendarLeftMenu [name="orderID"]').val(0);
      }
    }
  }

  function lfb_calEventOrderIDChange() {
    var orderID = parseInt($('#lfb_calendarLeftMenu [name="orderID"]').val());
    if (orderID == 0) {
      $('#lfb_calendarLeftMenu [name="orderID"]')
        .parent()
        .find(".btn-circle")
        .attr("disabled", "disabled");
    } else {
      $('#lfb_calendarLeftMenu [name="orderID"]')
        .parent()
        .find(".btn-circle")
        .removeAttr("disabled");
      var customerID = $(
        '#lfb_calendarLeftMenu [name="orderID"] option:selected'
      ).attr("data-customerid");
      $('#lfb_calendarLeftMenu [name="customerID"]').val(customerID);
    }
  }

  function lfb_getCalendarReminder(reminderID, eventID) {
    var reminderData = false;
    if (eventID > 0) {
      jQuery.each(lfb_getCalendarEvent(eventID).reminders, function () {
        if (this.id == reminderID) {
          reminderData = this;
        }
      });
    } else {
      jQuery.each(lfb_currentCalendarDefaultReminders, function () {
        if (this.id == reminderID) {
          reminderData = this;
        }
      });
    }
    return reminderData;
  }

  function lfb_editCalendarReminder(reminderID) {
    var reminderData = lfb_getCalendarReminder(
      reminderID,
      lfb_currentCalendarEventID
    );
    $("#lfb_winEditReminder").attr("data-remininderid", reminderID);
    if (reminderID > 0) {
      $('#lfb_winEditReminder [name="delayValue"]').val(
        reminderData.delayValue
      );
      $('#lfb_winEditReminder [name="delayType"]').val(reminderData.delayType);
      $('#lfb_winEditReminder [name="title"]').val(reminderData.title);
      $('#lfb_winEditReminder [name="email"]').val(reminderData.email);
      $("#calEventContent").summernote(reminderData.content);
    } else {
      $('#lfb_winEditReminder [name="email"]').val(
        $('#lfb_formFields [name="email"]').val()
      );
      $('#lfb_winEditReminder [name="delayValue"]').val(2);
      $('#lfb_winEditReminder [name="delayType"]').val("hours");
      $('#lfb_winEditReminder [name="title"]').val(
        lfb_data.texts["newEventSubject"]
      );
      $("#calEventContent").summernote(
        lfb_data.texts["newEventContent"].replace(
          "[date]",
          "<strong>[date]</strong>"
        )
      );
    }
    $("#lfb_winEditReminder").attr("data-reminderid", reminderID);
    showModal($("#lfb_winEditReminder"));
  }

  function lfb_saveCalendarReminder() {
    var delayType = $('#lfb_winEditReminder [name="delayType"]').val();
    var delayValue = $('#lfb_winEditReminder [name="delayValue"]').val();
    var title = $('#lfb_winEditReminder [name="title"]').val();
    var email = $('#lfb_winEditReminder [name="email"]').val();
    var content = $("#calEventContent").summernote("code");
    var reminderID = $("#lfb_winEditReminder").attr("data-remininderid");

    $('#lfb_winEditReminder [name="delayValue"]').removeClass("is-invalid");
    $('#lfb_winEditReminder [name="title"]').removeClass("is-invalid");

    var error = false;
    if (delayValue == "") {
      error = true;
      $('#lfb_winEditReminder [name="delayValue"]').addClass("is-invalid");
    }
    if (title == "") {
      error = true;
      $('#lfb_winEditReminder [name="title"]').addClass("is-invalid");
    }
    if (!lfb_checkEmail(email)) {
      error = true;
      $('#lfb_winEditReminder [name="email"]').addClass("is-invalid");
    }

    if (!error) {
      hideModal($("#lfb_winEditReminder"));

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCalendarReminder",
          calendarID: lfb_currentCalendarID,
          eventID: lfb_currentCalendarEventID,
          reminderID: reminderID,
          delayValue: delayValue,
          delayType: delayType,
          email: email,
          title: title,
          content: content,
        },
        success: function (newReminderID) {
          newReminderID = newReminderID.trim();
          var reminderData = {};
          if (reminderID > 0) {
            reminderData = lfb_getCalendarReminder(
              reminderID,
              lfb_currentCalendarEventID
            );
          }
          reminderData.delayType = delayType;
          reminderData.delayValue = delayValue;
          reminderData.title = title;
          reminderData.content = content;

          if (reminderID == 0) {
            reminderData.id = newReminderID;
            if (lfb_currentCalendarEventID > 0) {
              var currentEvent = lfb_getCalendarEvent(
                lfb_currentCalendarEventID
              );
              currentEvent.reminders.push(reminderData);
              lfb_editCalendarEvent(lfb_currentCalendarEventID);
            } else {
              lfb_currentCalendarDefaultReminders.push(reminderData);
              lfb_openDefaultReminders();
            }
          }

          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    }
  }

  function lfb_deleteCalendarReminder(reminderID) {
    if (lfb_currentCalendarEventID > 0) {
      var eventData = lfb_getCalendarEvent(lfb_currentCalendarEventID);
      eventData.reminders = jQuery.grep(
        eventData.reminders,
        function (reminder) {
          return reminder.id != reminderID;
        }
      );
    } else {
      lfb_currentCalendarDefaultReminders = jQuery.grep(
        lfb_currentCalendarDefaultReminders,
        function (reminder) {
          return reminder.id != reminderID;
        }
      );
    }
    var target = "#lfb_calendarLeftMenu #lfb_calEventRemindersTable";
    if (lfb_currentCalendarEventID == 0) {
      target = "#lfb_calEventRemindersTableDefault";
    }

    if ($(target).find("tbody").children().length == 0) {
      $(target)
        .find("tbody")
        .html(
          '<tr><td colspan="2">' + lfb_data.texts["noReminders"] + "</td></tr>"
        );
    }
    $(target)
      .find('tr[data-id="' + reminderID + '"]')
      .slideUp();
    setTimeout(function () {
      $(target)
        .find('tr[data-id="' + reminderID + '"]')
        .remove();
    }, 300);
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_deleteCalendarReminder",
        reminderID: reminderID,
      },
      success: function (rep) {},
    });
  }

  function lfb_calendarEventViewGmap() {
    var address = $('#lfb_calendarLeftMenu [name="customerAddress"]').val();
    if (address.length > 0) {
      var url =
        "https://www.google.com/maps/place/" + encodeURIComponent(address);
      var win = window.open(url, "_blank");
      win.focus();
    }
  }

  function lfb_openLeftPanel(panelID) {
    if (panelID != "lfb_calendarLeftMenu") {
      lfb_currentCalendarEventID = 0;
    }
    $("#" + panelID)
      .parent()
      .find(".lfb_lPanelMain")
      .addClass("lfb_open");
    $("#" + panelID).addClass("lfb_open");
    $("#" + panelID)
      .parent()
      .find(".lfb_lPanelLeft")
      .not("#" + panelID)
      .find(".lfb_lPanelBody,.lfb_lPanelHeader")
      .fadeOut();
    setTimeout(function () {
      $("#" + panelID)
        .parent()
        .find(".lfb_lPanelLeft")
        .not("#" + panelID)
        .removeClass("lfb_open");
      $("#" + panelID)
        .find(".lfb_lPanelBody,.lfb_lPanelHeader")
        .fadeIn();
    }, 300);
  }

  function lfb_closeLeftPanel(panelID) {
    lfb_currentCalendarEventID = 0;
    $("#" + panelID)
      .find(".lfb_lPanelBody,.lfb_lPanelHeader")
      .fadeOut();
    setTimeout(function () {
      $("#" + panelID)
        .parent()
        .find(".lfb_lPanelMain")
        .removeClass("lfb_open");
      $("#" + panelID).removeClass("lfb_open");
    }, 300);
  }

  function lfb_closeAllLeftPanels() {
    $(".lfb_lPanelLeft.lfb_open").each(function () {
      lfb_closeLeftPanel($(this).attr("id"));
    });
  }

  function lfb_openDefaultReminders() {
    lfb_currentCalendarEventID = 0;
    lfb_generateRemindersTable(lfb_currentCalendarDefaultReminders);
    lfb_openLeftPanel("lfb_calendarDefaultReminders");
  }

  function lfb_closeDefaultReminders() {
    $("#lfb_calendarDefaultReminders .lfb_lPanelBody").fadeOut();
    $("#lfb_calendarDefaultReminders .lfb_lPanelHeader").fadeOut();
    setTimeout(function () {
      $("#lfb_calendar").removeClass("lfb_open");
      $("#lfb_calendarDefaultReminders").removeClass("lfb_open");
    }, 300);
  }

  function lfb_openEventsCategories() {
    lfb_openLeftPanel("lfb_calendarEventsCategories");
  }

  function lfb_closeEventsCategories() {
    $("#lfb_calendarEventsCategories .lfb_lPanelBody").fadeOut();
    $("#lfb_calendarEventsCategories .lfb_lPanelHeader").fadeOut();
    setTimeout(function () {
      $("#lfb_calendar").removeClass("lfb_open");
      $("#lfb_calendarEventsCategories").removeClass("lfb_open");
    }, 300);
  }

  function lfb_editCalendarCat(catID) {
    if (catID > 0) {
      var catData = lfb_getCalendarCat(catID);
      if (catData != false) {
        $("#lfb_winEditCalendarCat").find('[name="title"]').val(catData.title);
        $("#lfb_winEditCalendarCat").find('[name="color"]').val(catData.color);
        if (catData.isBusy) {
          $('#lfb_calendarLeftMenu [name="isBusy"]')
            .parent()
            .bootstrapSwitch("setState", true);
        } else {
          $('#lfb_calendarLeftMenu [name="isBusy"]')
            .parent()
            .bootstrapSwitch("setState", false);
        }
      }
    } else {
      $("#lfb_winEditCalendarCat").find('[name="title"]').val("");
      $("#lfb_winEditCalendarCat").find('[name="color"]').val("#f39c12");
    }
    $("#lfb_winEditCalendarCat")
      .find(".lfb_colorPreview")
      .css(
        "backgroundColor",
        $("#lfb_winEditCalendarCat").find('[name="color"]').val()
      );
    $("#lfb_winEditCalendarCat").attr("data-id", catID);
    showModal($("#lfb_winEditCalendarCat"));
  }

  function lfb_saveCalendarCat() {
    var catID = $("#lfb_winEditCalendarCat").attr("data-id");
    var title = $("#lfb_winEditCalendarCat").find('[name="title"]').val();
    var color = $("#lfb_winEditCalendarCat").find('[name="color"]').val();

    var error = false;
    if (title == "") {
      error = true;
      $('#lfb_winEditCalendarCat [name="title"]').addClass("is-invalid");
    }
    if (!error) {
      hideModal($("#lfb_winEditCalendarCat"));
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCalendarCat",
          calendarID: lfb_currentCalendarID,
          catID: catID,
          title: title,
          color: color,
        },
        success: function () {
          $("#lfb_calendar").fullCalendar("refetchEvents");
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    }
  }

  function lfb_generateCalendarCatsSelect() {
    $("#lfb_calendarLeftMenu").find('[name="categoryID"]').html("");
    jQuery.each(lfb_currentCalendarCats, function () {
      $("#lfb_calendarLeftMenu")
        .find('[name="categoryID"]')
        .append('<option value="' + this.id + '">' + this.title + "</option>");
    });
  }

  function lfb_generateCalendarCatsTable() {
    $("#lfb_calendarEventsCatsTable").find("tbody").html("");
    jQuery.each(lfb_currentCalendarCats, function () {
      var btnDeleteStyle = "";
      if (this.id == 1) {
        btnDeleteStyle = "display:none;";
      }
      var tr = $(
        '<tr data-id="' +
          this.id +
          '"><td>' +
          this.title +
          '</td><td><div class="lfb_calendarCatColor" style="background-color: ' +
          this.color +
          ';"></div></td><td class="lfb_calReminderActionTd"><a href="javascript:" data-action="lfb_editCalendarCat" class="btn btn-outline btn-outline-primary  btn-circle "><span class="fas fa-pencil-alt"></span></a><a href="javascript:" style="' +
          btnDeleteStyle +
          '" data-action="lfb_deleteCalendarCat" class="btn btn-sm btn-outline-danger btn-circle "><span class="fas fa-trash"></span></a></td></tr>'
      );

      tr.find('a[data-action="lfb_editCalendarCat"]').on("click", function () {
        lfb_editCalendarCat($(this).closest("tr").attr("data-id"));
      });
      tr.find('a[data-action="lfb_deleteCalendarCat"]').on(
        "click",
        function () {
          lfb_deleteCalendarCat($(this).closest("tr").attr("data-id"));
        }
      );
      $("#lfb_calendarEventsCatsTable").find("tbody").append(tr);
    });
    if (lfb_currentCalendarCats.length == 0) {
      $("#lfb_calendarEventsCatsTable")
        .find("tbody")
        .html(
          '<tr><td colspan="3">' + lfb_data.texts["noCategories"] + "</td></tr>"
        );
    }
  }

  function lfb_confirmDeleteCalendarCat() {
    lfb_showLoader();
    var catID = $("#lfb_winDeleteCalendarCat").attr("data-id");
    hideModal($("#lfb_winDeleteCalendarCat"));
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_deleteCalendarCat",
        catID: catID,
      },
      success: function () {
        $("#lfb_calendar").fullCalendar("refetchEvents");
      },
    });
  }

  function lfb_deleteCalendarCat(catID) {
    $("#lfb_winDeleteCalendarCat").attr("data-id", catID);
    showModal($("#lfb_winDeleteCalendarCat"));
  }

  function lfb_getCalendarCat(catID) {
    var catData = false;
    jQuery.each(lfb_currentCalendarCats, function () {
      if (this.id == catID) {
        catData = this;
      }
    });
    return catData;
  }

  function lfb_updateCalendarDaysWeekTable() {
    $("#lfb_calendarDaysWeekTable tr[data-day]")
      .find('input[type="checkbox"]')
      .parent()
      .bootstrapSwitch("setState", true);
    jQuery.each(lfb_currentCalendarDaysWeek, function (i) {
      $('#lfb_calendarDaysWeekTable tr[data-day="' + this + '"]')
        .find('input[type="checkbox"]')
        .parent()
        .bootstrapSwitch("setState", false);
    });
  }

  function lfb_updateCalendarHoursEnabledTable() {
    $("#lfb_calendarHoursEnabledTable tr[data-hour]")
      .find('input[type="checkbox"]')
      .parent()
      .bootstrapSwitch("setState", true);
    jQuery.each(lfb_currentCalendarDisabledHours, function (i) {
      $('#lfb_calendarHoursEnabledTable tr[data-hour="' + this + '"]')
        .find('input[type="checkbox"]')
        .parent()
        .bootstrapSwitch("setState", false);
    });
  }

  function lfb_saveCalendarHoursDisabled() {
    var hoursData = "";
    for (var i = 0; i < 24; i++) {
      if (
        !$('#lfb_calendarHoursEnabledTable tr[data-hour="' + i + '"]')
          .find('input[type="checkbox"]')
          .is(":checked")
      ) {
        hoursData += i + ",";
      }
    }

    if (hoursData.length > 0) {
      hoursData = hoursData.substr(0, hoursData.length - 1);
    }
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_saveCalendarHoursDisabled",
        calendarID: lfb_currentCalendarID,
        hours: hoursData,
      },
      success: function () {
        $("#lfb_calendar").fullCalendar("refetchEvents");
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      },
    });
  }

  function lfb_saveCalendarDaysWeek() {
    if (
      $("#lfb_calendarDaysWeekTable tr[data-day]").find(
        'input[type="checkbox"]:checked'
      ).length > 0
    ) {
      var daysData = "";
      for (var i = 0; i < 7; i++) {
        if (
          !$('#lfb_calendarDaysWeekTable tr[data-day="' + i + '"]')
            .find('input[type="checkbox"]')
            .is(":checked")
        ) {
          daysData += i + ",";
        }
      }

      if (daysData.length > 0) {
        daysData = daysData.substr(0, daysData.length - 1);
      }
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCalendarDaysWeek",
          calendarID: lfb_currentCalendarID,
          days: daysData,
        },
        success: function () {
          $("#lfb_calendar").fullCalendar("refetchEvents");
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    }
  }

  function lfb_initWeeksDaysText() {
    $("#lfb_calendarDaysWeekTable tr[data-day]").each(function () {
      if (
        typeof jQuery.fn.datetimepicker != "undefined" &&
        typeof jQuery.fn.datetimepicker.dates != "undefined" &&
        typeof jQuery.fn.datetimepicker.dates[lfb_data.locale] != "undefined"
      ) {
        $(this)
          .find("td")
          .first()
          .html(
            jQuery.fn.datetimepicker.dates[lfb_data.locale].days[
              parseInt($(this).attr("data-day"))
            ]
          );
      }
    });
    if (
      typeof jQuery.fn.datetimepicker != "undefined" &&
      typeof jQuery.fn.datetimepicker.dates != "undefined" &&
      typeof jQuery.fn.datetimepicker.dates[lfb_data.locale] != "undefined"
    ) {
      if (jQuery.fn.datetimepicker.dates[lfb_data.locale].weekStart == 1) {
        $('#lfb_calendarDaysWeekTable tr[data-day="0"]')
          .detach()
          .appendTo("#lfb_calendarDaysWeekTable tbody");
      }
    }
  }

  function lfb_deleteOrdersSelection() {
    var logsIDs = "";
    $('#lfb_logsTable tr[data-logid] [name="tableSelector"]:checked').each(
      function () {
        logsIDs += $(this).closest("tr").attr("data-logid") + ",";
      }
    );
    if (logsIDs.length > 0) {
      lfb_showLoader();
      logsIDs = logsIDs.substr(0, logsIDs.length - 1);
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_removeLogs",
          logsIDs: logsIDs,
        },
        success: function () {
          lfb_loadLogs($("#lfb_panelLogs").attr("data-formid"));
        },
      });
    }
  }

  function lfb_exportOrdersSelection() {
    var logsIDs = "";
    $('#lfb_logsTable tr[data-logid] [name="tableSelector"]:checked').each(
      function () {
        logsIDs += $(this).closest("tr").attr("data-logid") + ",";
      }
    );
    if (logsIDs.length > 0) {
      var logID = $("#lfb_panelLogs").attr("data-formid");
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_exportLogs",
          formID: logID,
          logsIDs: logsIDs,
        },
        success: function (rep) {
          if (rep != "error") {
            $("#lfb_loader").fadeOut();
            $("#lfb_loaderText").html("");
            document.location.href =
              "admin.php?page=lfb_menu&lfb_action=downloadLogs";
          }
        },
      });
    }
  }

  function lfb_saveCustomerDataSettings() {
    var error = false;

    if (
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataWarningText"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataWarningText"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataDownloadLink"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataDownloadLink"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataDeleteLink"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataDeleteLink"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataLeaveLink"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataLeaveLink"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataDeleteDelay"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataDeleteDelay"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings").find('[name="txtCustomersDataTitle"]').val()
        .length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataTitle"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataLabelEmail"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataLabelEmail"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataLabelPass"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataLabelPass"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataLabelModify"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="customersDataLabelModify"]')
        .addClass("is-invalid");
    }
    if (
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataEditLink"]')
        .val().length == 0
    ) {
      error = true;
      $("#lfb_winCustDataSettings")
        .find('[name="txtCustomersDataEditLink"]')
        .addClass("is-invalid");
    }

    if (!error) {
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_saveCustomerDataSettings",
          txtCustomersDataWarningText: $("#lfb_winCustDataSettings")
            .find('[name="txtCustomersDataWarningText"]')
            .val(),
          txtCustomersDataDownloadLink: $("#lfb_winCustDataSettings")
            .find('[name="txtCustomersDataDownloadLink"]')
            .val(),
          txtCustomersDataDeleteLink: $("#lfb_winCustDataSettings")
            .find('[name="txtCustomersDataDeleteLink"]')
            .val(),
          txtCustomersDataLeaveLink: $("#lfb_winCustDataSettings")
            .find('[name="txtCustomersDataLeaveLink"]')
            .val(),
          customersDataDeleteDelay: $("#lfb_winCustDataSettings")
            .find('[name="customersDataDeleteDelay"]')
            .val(),
          txtCustomersDataTitle: $("#lfb_winCustDataSettings")
            .find('[name="txtCustomersDataTitle"]')
            .val(),
          customersDataLabelEmail: $("#lfb_winCustDataSettings")
            .find('[name="customersDataLabelEmail"]')
            .val(),
          customersDataLabelPass: $("#lfb_winCustDataSettings")
            .find('[name="customersDataLabelPass"]')
            .val(),
          customersDataLabelModify: $("#lfb_winCustDataSettings")
            .find('[name="customersDataLabelModify"]')
            .val(),
          txtCustomersDataEditLink: $("#lfb_winCustDataSettings")
            .find('[name="txtCustomersDataEditLink"]')
            .val(),
        },
      });
      hideModal($("#lfb_winCustDataSettings"));
    }
  }

  function generateShortcode() {
    var formID = $("#lfb_winShortcode").find("span[data-displayid]").html();
    var startStep = $('#lfb_winShortcode [name="startStep"]').val();
    var startStepTxt = "";
    if (
      startStep &&
      !$('#lfb_winShortcode [name="startStep"] :selected').is(".default")
    ) {
      startStepTxt = ' step="' + startStep + '"';
    }

    if ($('#lfb_winShortcode [name="display"]').val() == "fullscreen") {
      $("#lfb_shortcodeField").val(
        '[estimation_form form_id="' +
          formID +
          '" fullscreen="true"' +
          startStepTxt +
          "]"
      );
      $('#lfb_winShortcode [data-display="popup"]').slideUp();
    } else if ($('#lfb_winShortcode [name="display"]').val() == "popup") {
      $("#lfb_shortcodeField").val(
        '[estimation_form form_id="' +
          formID +
          '" popup="true"' +
          startStepTxt +
          "]"
      );
      $("#lfb_shortcodePopup").val(
        '<a href="#" class="open-estimation-form form-' +
          formID +
          '">Open Form</a>'
      );
      $('#lfb_winShortcode [data-display="popup"]').slideDown();
    } else {
      $("#lfb_shortcodeField").val(
        '[estimation_form form_id="' + formID + '"' + startStepTxt + "]"
      );
      $('#lfb_winShortcode [data-display="popup"]').slideUp();
    }
  }

  function lfb_linkLightStep(stepID) {
    $(
      '#lfb_stepsContainer .lfb_stepBloc[data-stepid="' + stepID + '"]'
    ).addClass("linkLight");
    setTimeout(function () {
      $(
        '#lfb_stepsContainer .lfb_stepBloc[data-stepid="' + stepID + '"]'
      ).removeClass("linkLight");
    }, 2000);
    lfb_lastCreatedStepID = -1;
  }

  function lfb_viewFormVariables() {
    $("#lfb_panelsContainer>div").addClass("lfb_hidden");
    $(this)
      .closest("#lfb_editFormNavbar")
      .find(".active")
      .removeClass("active");
    $(this).addClass("active");
    $("#lfb_panelVariables").removeClass("lfb_hidden");

    $(".lfb_mainNavBar").hide();
    $("#lfb_navBar_variables").show();
  }

  function lfb_closeFormVariables() {
    $('a[data-action="showStepsManager"]').trigger("click");
  }

  function lfb_closeLogs() {
    $('a[data-action="showStepsManager"]').trigger("click");
  }

  function lfb_addNewVariable() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_addNewVariable",
        formID: lfb_currentFormID,
      },
      success: function (variableID) {
        variableID = variableID.trim();
        lfb_currentForm.variables.push({
          id: variableID,
          title: lfb_data.texts["My Variable"],
          type: "integer",
          sendAsGet: 0,
          defaultValue: 0,
        });
        lfb_updateFormVariablesTable();
        lfb_editVariable(variableID);
      },
    });
  }

  function lfb_getVariable(variableID) {
    var rep = false;
    for (var i = 0; i < lfb_currentForm.variables.length; i++) {
      if (lfb_currentForm.variables[i].id == variableID) {
        rep = lfb_currentForm.variables[i];
      }
    }
    return rep;
  }

  function lfb_editVariable(variableID) {
    var variable = lfb_getVariable(variableID);
    if (variable) {
      $("#lfb_winEditVariable").data("variableID", variableID);
      $("#lfb_winEditVariable").find('[name="title"]').val(variable.title);
      $("#lfb_winEditVariable").find('[name="type"]').val(variable.type);
      $("#lfb_winEditVariable")
        .find('[name="defaultValue"]')
        .val(variable.defaultValue);
      $('#lfb_winEditVariable [name="sendAsGet"]').removeAttr("checked");
      $('#lfb_winEditVariable [name="sendAsGet"]')
        .parent()
        .bootstrapSwitch("setState", false);
      if (variable.sendAsGet == 1) {
        $('#lfb_winEditVariable [name="sendAsGet"]')
          .parent()
          .bootstrapSwitch("setState", true);
      }

      showModal($("#lfb_winEditVariable"));
    }
    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    $("#lfb_loader").fadeOut();
    $("#lfb_loaderText").html("");
  }

  function lfb_deleteVariable(variableID) {
    var variable = lfb_getVariable(variableID);
    if (variable) {
      $("#lfb_winDeleteVariable").data("variableID", variableID);
      $("#lfb_winDeleteVariable .modal-body").html(
        $("#lfb_winDeleteVariable .modal-body")
          .html()
          .replace("[variableName]", variable.title)
      );
      showModal($("#lfb_winDeleteVariable"));
    }
  }

  function lfb_confirmDeleteVariable() {
    var variableID = $("#lfb_winDeleteVariable").data("variableID");
    hideModal($("#lfb_winDeleteVariable"));
    $('#lfb_variablesTable tbody tr[data-id="' + variableID + '"]').remove();

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_deleteVariable",
        variableID: variableID,
      },
      success: function () {
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_loadForm",
            formID: lfb_currentFormID,
          },
          success: function (rep) {
            rep = JSON.parse(rep);
            lfb_currentForm = rep;
            lfb_params = rep.params;
            lfb_steps = rep.steps;

            jQuery.each(rep.links, function (index) {
              var link = this;
              link.originID = $(
                '.lfb_stepBloc[data-stepid="' + link.originID + '"]'
              ).attr("id");
              link.destinationID = $(
                '.lfb_stepBloc[data-stepid="' + link.destinationID + '"]'
              ).attr("id");
              link.conditions = JSON.parse(link.conditions);
              lfb_links[index] = link;
            });
            lfb_repositionLinks();
            lfb_updateLastStepTab();
          },
        });
      },
    });
  }

  function lfb_saveVariable() {
    var variableID = $("#lfb_winEditVariable").data("variableID");
    var title = $('#lfb_winEditVariable [name="title"]').val();
    var type = $('#lfb_winEditVariable [name="type"]').val();
    var defaultValue = $('#lfb_winEditVariable [name="defaultValue"]').val();
    var sendAsGet = 0;
    if ($('#lfb_winEditVariable [name="sendAsGet"]').is(":checked")) {
      sendAsGet = 1;
    }
    var error = false;
    $("#lfb_winEditVariable .is-invalid").removeClass("is-invalid");
    if (title.length < 2) {
      error = true;
      $('#lfb_winEditVariable [name="title"]').addClass("is-invalid");
    }
    if (!error) {
      var variable = lfb_getVariable(variableID);
      if (variable) {
        variable.title = title;
        variable.type = type;
        variable.sendAsGet = sendAsGet;
        variable.defaultValue = defaultValue;
        lfb_updateFormVariablesTable();
        hideModal($("#lfb_winEditVariable"));
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_saveVariable",
            variableID: variableID,
            title: title,
            type: type,
            defaultValue: defaultValue,
            sendAsGet: sendAsGet,
          },
          success: function () {
            $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
              "update"
            );
          },
        });
      }
    }
  }

  function lfb_updateFormVariablesTable() {
    $("#lfb_variablesTable tbody").html("");
    $(
      '#lfb_winItem [name="modifiedVariableID"] option:not([value="0"]),#lfb_emailValueBubble select[name="variableID"] option,#lfb_calculationValueBubble select[name="variableID"] option,#lfb_winDynamicValue select[name="variableID"] option'
    ).remove();

    jQuery.each(lfb_currentForm.variables, function (index) {
      var tr = $('<tr data-id="' + this.id + '"></tr>');
      tr.append("<td>" + this.title + "</td>");
      var type = lfb_data.texts["Integer"];
      if (this.type == "float") {
        type = lfb_data.texts["Float"];
      } else if (this.type == "currency") {
        type = lfb_data.texts["Currency"];
      } else if (this.type == "text") {
        type = lfb_data.texts["Text"];
      }
      tr.append("<td>" + type + "</td>");
      tr.append("<td>" + this.defaultValue + "</td>");
      tr.append(
        '<td class="lfb_actionTh"><a href="javascript:" data-action="editVariable"  data-toggle="tooltip" data-bs-placement="bottom" title="' +
          lfb_data.texts["edit"] +
          '"  class="btn btn-sm btn-outline-primary btn-circle"><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="deleteVariable" class="btn btn-sm btn-outline-danger btn-circle"><span class="fas fa-trash"></span></a></td>'
      );
      tr.find('a[data-action="editVariable"]').on("click", function () {
        lfb_editVariable($(this).closest("tr").attr("data-id"));
      });
      tr.find('a[data-action="deleteVariable"]').on("click", function () {
        lfb_deleteVariable($(this).closest("tr").attr("data-id"));
      });
      $("#lfb_variablesTable tbody").append(tr);

      $(
        '#lfb_winItem [name="modifiedVariableID"],#lfb_emailValueBubble select[name="variableID"],#lfb_calculationValueBubble select[name="variableID"],#lfb_winDynamicValue select[name="variableID"]'
      ).append('<option value="' + this.id + '">' + this.title + "</option>");
    });
  }

  function lfb_returnToOrdersList() {
    lfb_loadLogs(lfb_lastLogsFormID);
    /* $('a[data-action="viewFormLogs"]').trigger('click');*/
    $("#lfb_panelLogs").show();
    $("body").css({
      overflow: "initial",
    });
  }

  function lfb_showCustomersPanel() {
    $("#lfb_panelFormsList .tooltip").remove();
    $(".lfb_winHeader .tooltip").remove();
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    lfb_refreshCustomersList();

    $(this).closest("#lfb_mainToolbar").find(".active").removeClass("active");
    $(this).addClass("active");
    $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
    $("#lfb_customersPanel").removeClass("lfb_hidden").show();

    $("#lfb_mainToolbar a.lfb_over-primary")
      .removeClass("lfb_over-primary")
      .addClass("lfb_over-default");
    $('#lfb_mainToolbar a[data-action="showCustomersPanel"]')
      .removeClass("lfb_over-default")
      .addClass("lfb_over-primary");
  }

  function lfb_refreshCustomersList() {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_getCustomersList",
      },
      success: function (rep) {
        rep.trim();
        var customers = jQuery.parseJSON(rep);

        if (
          $("#lfb_customersTable").closest(".dataTables_wrapper").length > 0
        ) {
          lfb_customersTable.destroy();
        }

        $("#lfb_customersTable tbody").html("");
        for (var i = 0; i < customers.length; i++) {
          var customer = customers[i];
          var tr = $('<tr data-id="' + customer.id + '"></tr>');
          tr.append("<td>" + customer.email + "</td>");
          tr.append(
            "<td>" + customer.firstName + " " + customer.lastName + "</td>"
          );
          tr.append("<td>" + customer.phone + "</td>");
          tr.append("<td>" + customer.lastOrderDate + "</td>");
          tr.append("<td>" + customer.inscriptionDate + "</td>");
          tr.append(
            '<td class="lfb_actionTh text-end"><a href="javascript:" data-action="editCustomer" class="btn btn-outine btn-outline-secondary  btn-circle "><span class="fas fa-pencil-alt"></span></a><a href="javascript:" data-action="deleteCustomer" class="btn btn-outline btn-outline-danger  btn-circle "><span class="fas fa-trash"></span></a></td>'
          );

          tr.find('a[data-action="editCustomer"]').on("click", function () {
            lfb_editCustomer($(this).closest("tr").attr("data-id"));
          });
          tr.find('a[data-action="deleteCustomer"]').on("click", function () {
            lfb_deleteCustomer($(this).closest("tr").attr("data-id"));
          });
          $("#lfb_customersTable tbody").append(tr);
        }

        lfb_customersTable = $("#lfb_customersTable").DataTable({
          language: {
            search: lfb_data.texts["search"],
            infoFiltered: lfb_data.texts["filteredFrom"],
            zeroRecords: lfb_data.texts["noRecords"],
            infoEmpty: "",
            info: lfb_data.texts["showingPage"],
            lengthMenu: lfb_data.texts["display"] + " _MENU_",
            paginate: {
              first: '<span class="fas fa-fast-backward"></span>',
              previous: '<span class="fas fa-step-backward"></span>',
              next: '<span class="fas fa-step-forward"></span>',
              last: '<span class="fas fa-fast-forward"></span>',
            },
          },
        });

        $("#lfb_customersTable_filter input")
          .detach()
          .appendTo($("#lfb_logsTable_filter"));
        $("#lfb_logsTable_filter input").attr("placeholder", "...");
        $("#lfb_customersTable_filter label").remove();
        $("#lfb_customersTable_length select")
          .detach()
          .appendTo($("#lfb_logsTable_length"));
        $("#lfb_customersTable_length label").remove();

        $("#lfb_customersTable").wrap('<div class="table-responsive"></div>');
        $('#lfb_customersTable [name="tableSelector"]').attr(
          "checked",
          "checked"
        );
        $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
          "update"
        );
      },
    });
  }

  function lfb_editCustomer(customerID) {
    $("#lfb_customerDetailsPanel").data("customerID", customerID);
    if (customerID > 0) {
      lfb_showLoader();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_getCustomerDetails",
          customerID: customerID,
        },
        success: function (rep) {
          rep = jQuery.parseJSON(rep);
          $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
          $("#lfb_customerDetailsPanel").removeClass("lfb_hidden");
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
          $("#lfb_customerDetailsPanel")
            .find("input[name],select[name],textarea[name]")
            .each(function () {
              if ($(this).is('[data-switch="switch"]')) {
                var value = false;
                eval(
                  "if(rep." +
                    $(this).attr("name") +
                    ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
                );
              } else {
                eval("$(this).val(rep." + $(this).attr("name") + ");");
              }
            });
          if (
            $("#lfb_customerOrdersTable").closest(".dataTables_wrapper")
              .length > 0
          ) {
            lfb_customerOrdersTable.destroy();
          }
          $("#lfb_customerOrdersTable tbody").html("");
          for (var i = 0; i < rep.orders.length; i++) {
            var order = rep.orders[i];
            var total = lfb_formatPrice(
              order.totalPrice,
              order.currency,
              order.currencyPosition,
              order.decimalsSeparator,
              order.thousandsSeparator,
              order.millionSeparator,
              order.billionsSeparator
            );
            var totalSubscription = lfb_formatPrice(
              order.totalSubscription,
              order.currency,
              order.currencyPosition,
              order.decimalsSeparator,
              order.thousandsSeparator,
              order.millionSeparator,
              order.billionsSeparator
            );

            var tr = $(
              '<tr data-id="' +
                order.id +
                '" data-formid="' +
                order.formID +
                '"></tr>'
            );
            tr.append("<td>" + order.dateLog + "</td>");
            tr.append("<td>" + order.ref + "</td>");
            tr.append("<td>" + order.paid + "</td>");
            tr.append(
              '<td class="lfb_log_totalTd text-end">' + total + "</td>"
            );
            tr.append(
              '<td class="lfb_log_totalSubTd text-end">' +
                totalSubscription +
                "</td>"
            );
            tr.append(
              '<td class="lfb_logStatusTd">' + order.statusText + "</td>"
            );
            tr.append(
              '<td class="lfb_actionTh text-end">' +
                '<a href="javascript:" data-action="viewOrder" class="btn btn-sm btn-outline-primary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["View this order"] +
                '" data-bs-placement="bottom"><span class="fas fa-search"></span></a>' +
                '<a href="javascript:" data-action="editOrder" class="btn btn-sm btn-outline-secondary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["edit"] +
                '" data-bs-placement="bottom"><span class="fas fa-pencil-alt"></span></a>' +
                ' <a href="javascript:" data-action="downloadOrder" class="btn btn-sm btn-outline-secondary btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["Download the order"] +
                '" data-bs-placement="bottom"><span class="fa fa-file-download"></span></a>' +
                '<a href="javascript:" data-action="deleteOrder"  class="btn btn-sm btn-outline-danger btn-circle" data-toggle="tooltip" title="' +
                lfb_data.texts["Delete this order"] +
                '" data-bs-placement="bottom"><span class="fas fa-trash"></span></a></td>'
            );

            $("#lfb_customerOrdersTable tbody").append(tr);
            tr.find('[data-action="viewOrder"]').on("click", function () {
              lfb_showLoader();
              var orderID = $(this).closest("tr").attr("data-id");
              lfb_loadLog(orderID, false);
            });
            tr.find('[data-action="editOrder"]').on("click", function () {
              lfb_showLoader();
              var orderID = $(this).closest("tr").attr("data-id");
              lfb_loadLog(orderID, true);
            });
            tr.find('[data-action="downloadOrder"]').on("click", function () {
              var orderID = $(this).closest("tr").attr("data-id");
              lfb_currentLogID = orderID;
              lfb_downloadOrder(orderID);
            });
            tr.find('[data-action="deleteOrder"]').on("click", function () {
              var orderID = $(this).closest("tr").attr("data-id");
              var formID = $(this).closest("tr").attr("data-formid");
              lfb_removeLog(orderID, formID);
            });
          }
          lfb_customerOrdersTable = $("#lfb_customerOrdersTable").DataTable({
            language: {
              search: lfb_data.texts["search"],
              infoFiltered: lfb_data.texts["filteredFrom"],
              zeroRecords: lfb_data.texts["noRecords"],
              infoEmpty: "",
              info: lfb_data.texts["showingPage"],
              lengthMenu: lfb_data.texts["display"] + " _MENU_",
              paginate: {
                first: '<span class="fas fa-fast-backward"></span>',
                previous: '<span class="fas fa-step-backward"></span>',
                next: '<span class="fas fa-step-forward"></span>',
                last: '<span class="fas fa-fast-forward"></span>',
              },
            },
          });

          $("#lfb_customerOrdersTable_filter input")
            .detach()
            .appendTo($("#lfb_logsTable_filter"));
          $("#lfb_customerOrdersTable_filter label").remove();
          $("#lfb_customerOrdersTable_length select")
            .detach()
            .appendTo($("#lfb_logsTable_length"));
          $("#lfb_customerOrdersTable_length label").remove();

          $("#lfb_customerOrdersTable").wrap(
            '<div class="table-responsive"></div>'
          );
          $('#lfb_customerOrdersTable [name="tableSelector"]').attr(
            "checked",
            "checked"
          );

          $("#lfb_customerDetailsPanel").show();
          $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
            "update"
          );
        },
      });
    } else {
      $("#lfb_customerDetailsPanel")
        .find("input[name],select[name],textarea[name]")
        .val("");
      if (
        $("#lfb_customerOrdersTable").closest(".dataTables_wrapper").length > 0
      ) {
        lfb_customerOrdersTable.destroy();
      }
      $("#lfb_customerOrdersTable tbody").html("");
      lfb_customerOrdersTable = $("#lfb_customerOrdersTable").DataTable({
        language: {
          search: lfb_data.texts["search"],
          infoFiltered: lfb_data.texts["filteredFrom"],
          zeroRecords: lfb_data.texts["noRecords"],
          infoEmpty: "",
          info: lfb_data.texts["showingPage"],
          lengthMenu: lfb_data.texts["display"] + " _MENU_",
          paginate: {
            first: '<span class="fas fa-fast-backward"></span>',
            previous: '<span class="fas fa-step-backward"></span>',
            next: '<span class="fas fa-step-forward"></span>',
            last: '<span class="fas fa-fast-forward"></span>',
          },
        },
      });

      $("#lfb_customerOrdersTable_filter input")
        .detach()
        .appendTo($("#lfb_logsTable_filter"));
      $("#lfb_customerOrdersTable_filter label").remove();
      $("#lfb_customerOrdersTable_length select")
        .detach()
        .appendTo($("#lfb_logsTable_length"));
      $("#lfb_customerOrdersTable_length label").remove();

      $("#lfb_customerOrdersTable").wrap(
        '<div class="table-responsive"></div>'
      );
      $('#lfb_customerOrdersTable [name="tableSelector"]').attr(
        "checked",
        "checked"
      );

      $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
      $("#lfb_customerDetailsPanel").removeClass("lfb_hidden").show();
    }
    $("#lfb_navBar_customerDetails").show();
  }

  function lfb_deleteCustomer(customerID) {
    $("#lfb_winAskDeleteCustomer").data("customerID", customerID);
    showModal($("#lfb_winAskDeleteCustomer"));
  }

  function lfb_confirmDeleteCustomer(customerID) {
    $('#lfb_customersTable tbody tr[data-id="' + customerID + '"]').remove();

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_deleteCustomer",
        customerID: customerID,
      },
      success: function (rep) {},
    });
  }

  function lfb_formatPrice(
    price,
    currency,
    currencyPosition,
    decimalsSeparator,
    thousandsSeparator,
    millionSeparator,
    billionsSeparator
  ) {
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
    if (formatedPrice.indexOf(".") > -1) {
      priceNoDecimals = formatedPrice.substr(0, formatedPrice.indexOf("."));
      decimals = formatedPrice.substr(formatedPrice.indexOf(".") + 1, 2);
      formatedPrice = formatedPrice.replace(".", decimalsSeparator);
      if (decimals.toString().length == 1) {
        decimals = decimals.toString() + "0";
      }
      if (priceNoDecimals.length > 9) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 9) +
          billionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 9, 3) +
          millionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 6, 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          ) +
          decimalsSeparator +
          decimals;
      } else if (priceNoDecimals.length > 6) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 6) +
          millionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 6, 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          ) +
          decimalsSeparator +
          decimals;
      } else if (priceNoDecimals.length > 3) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          ) +
          decimalsSeparator +
          decimals;
      }
    } else {
      if (priceNoDecimals.length > 9) {
        formatedPrice = formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 9) +
          billionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 9, 3) +
          millionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 6, 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          );
      } else if (priceNoDecimals.length > 6) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 6) +
          millionSep +
          priceNoDecimals.substr(priceNoDecimals.length - 6, 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          );
      } else if (priceNoDecimals.length > 3) {
        formatedPrice =
          priceNoDecimals.substr(0, priceNoDecimals.length - 3) +
          thousSep +
          priceNoDecimals.substr(
            priceNoDecimals.length - 3,
            priceNoDecimals.length
          );
      }
    }
    if (currencyPosition == "left") {
      formatedPrice = currency.toString() + formatedPrice.toString();
    } else {
      formatedPrice = formatedPrice.toString() + currency.toString();
    }
    return formatedPrice;
  }

  function lfb_saveCustomer() {
    var customerID = $("#lfb_customerDetailsPanel").data("customerID");
    var customerData = {};
    $("#lfb_customerDetailsPanel")
      .find("input[name],select[name],textarea[name]")
      .each(function () {
        $("#lfb_customerDetailsPanel")
          .find("input[name],select[name],textarea[name]")
          .each(function () {
            if ($(this).closest("#lfb_customerOrders").length == 0) {
              if (!$(this).is('[data-switch="switch"]')) {
                eval(
                  "customerData." + $(this).attr("name") + " = $(this).val();"
                );
              } else {
                var value = 0;
                if ($(this).is(":checked")) {
                  value = 1;
                }
                eval("customerData." + $(this).attr("name") + " = value;");
              }
            }
          });
      });
    var error = false;
    $("#lfb_customerDetailsPanel .is-invalid").removeClass("is-invalid");
    if (!lfb_checkEmail($('#lfb_customerDetailsPanel [name="email"]').val())) {
      error = true;
      $('#lfb_customerDetailsPanel [name="email"]').addClass("is-invalid");
    }
    customerData.action = "lfb_saveCustomer";
    customerData.customerID = customerID;
    if (!error) {
      lfb_showLoader();

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: customerData,
        success: function (rep) {
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
        },
      });
    }
  }

  function lfb_openWinBackendTheme() {
    showModal($("#lfb_winBackendTheme"));
  }

  function lfb_openGlobalSettings(highlightField = false) {
    $("#lfb_smtpTestRep").html("");
    $("#lfb_winGlobalSettings")
      .find("input,select,textarea")
      .each(function () {
        if ($(this).is('[data-switch="switch"]')) {
          var value = false;
          eval(
            "if(lfb_settings." +
              $(this).attr("name") +
              ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
          );
        } else {
          eval("$(this).val(lfb_settings." + $(this).attr("name") + ");");
        }
      });

    $("#previewPageSelect").val(lfb_settings.previewPageTitle);
    if (lfb_settings.encryptDB == 1) {
      $('#lfb_winGlobalSettings [name="encryptDB"]')
        .parent()
        .bootstrapSwitch("setState", true);
    } else {
      $('#lfb_winGlobalSettings [name="encryptDB"]')
        .parent()
        .bootstrapSwitch("setState", false);
    }

    showModal($("#lfb_winGlobalSettings"));

    $("#lfb_mainToolbar a.lfb_over-primary")
      .removeClass("lfb_over-primary")
      .addClass("lfb_over-default");
    $('#lfb_mainToolbar a[data-action="openGlobalSettings"]')
      .removeClass("lfb_over-default")
      .addClass("lfb_over-primary");
    if (highlightField) {
      setTimeout(function () {
        $('#lfb_winGlobalSettings [name="' + highlightField + '"]')
          .closest(".form-group")
          .addClass("lfb_highlightField");
        setTimeout(function () {
          $('#lfb_winGlobalSettings [name="' + highlightField + '"]')
            .closest(".form-group")
            .removeClass("lfb_highlightField");
        }, 1000);
      }, 300);
    }
  }

  function lfb_saveGlobalSettings(callback) {
    var settingsData = {};
    var error = false;
    $("#lfb_winGlobalSettings")
      .find("input[name],select[name],textarea[name]")
      .each(function () {
        $("#lfb_winGlobalSettings")
          .find("input[name],select[name],textarea[name]")
          .each(function () {
            if (!$(this).is('[data-switch="switch"]')) {
              eval(
                "settingsData." + $(this).attr("name") + " = $(this).val();"
              );
            } else {
              var value = 0;
              if ($(this).is(":checked")) {
                value = 1;
              }
              eval("settingsData." + $(this).attr("name") + " = value;");
            }
          });
      });

    settingsData.action = "lfb_saveGlobalSettings";

    if (!error) {
      lfb_showLoader();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: settingsData,
        success: function (rep) {
          $("#lfb_loader").fadeOut();
          $("#lfb_loaderText").html("");
          callback();
        },
      });
    }
  }

  function lfb_editCustomerDataSettings() {
    showModal($("#lfb_winGlobalSettings"));
    $('#lfb_winGlobalSettings a[href="#lfb_tabTextsSettings"]').trigger(
      "click"
    );
  }

  function lfb_changeOrderStatus(e) {
    var newStatus = $('#lfb_navBar_log [name="orderStatus"]').val();
    $("#lfb_logsTable,#lfb_customerOrdersTable")
      .find('tr[data-id="' + lfb_currentLogID + '"] .lfb_logStatusTd')
      .html($('#lfb_navBar_log [name="orderStatus"] option:selected').text());

    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_changeOrderStatus",
        orderID: lfb_currentLogID,
        status: newStatus,
      },
    });
  }

  function lfb_getEmailPdfContent(content) {
    var $content = $("<div></div>");
    $content.html(content);
    $content.find("span").each(function () {
      if ($(this).html().indexOf("[project_content]") > -1) {
        var parent = $(this);
        if ($(this).parents("span").last().length > 0) {
          parent = $(this).parents("span").last();
        }
        parent.after("[project_content]");

        $(this).remove();
      }
    });
    return $content.html();
  }

  function lfb_testSMTP() {
    var error = false;
    $("#lfb_winGlobalSettings .is-invalid").removeClass("is-invalid");
    if (
      !lfb_checkEmail($('#lfb_winGlobalSettings [name="adminEmail"]').val())
    ) {
      error = true;
      $('#lfb_winGlobalSettings [name="adminEmail"]').addClass("is-invalid");
    }
    if ($('#lfb_winGlobalSettings [name="smtp_host"]').val().length < 3) {
      error = true;
      $('#lfb_winGlobalSettings [name="smtp_host"]').addClass("is-invalid");
    }
    if ($('#lfb_winGlobalSettings [name="smtp_port"]').val().length < 1) {
      error = true;
      $('#lfb_winGlobalSettings [name="smtp_port"]').addClass("is-invalid");
    }
    if ($('#lfb_winGlobalSettings [name="smtp_username"]').val().length < 3) {
      error = true;
      $('#lfb_winGlobalSettings [name="smtp_username"]').addClass("is-invalid");
    }
    if ($('#lfb_winGlobalSettings [name="smtp_password"]').val().length < 3) {
      error = true;
      $('#lfb_winGlobalSettings [name="smtp_password"]').addClass("is-invalid");
    }
    if (!error) {
      lfb_saveGlobalSettings(function () {
        jQuery.ajax({
          url: ajaxurl,
          type: "post",
          data: {
            action: "lfb_testSMTP",
            senderName: $('#lfb_winGlobalSettings [name="senderName"]').val(),
            email: $('#lfb_winGlobalSettings [name="adminEmail"]').val(),
            host: $('#lfb_winGlobalSettings [name="smtp_host"]').val(),
            port: $('#lfb_winGlobalSettings [name="smtp_port"]').val(),
            username: $('#lfb_winGlobalSettings [name="smtp_username"]').val(),
            pass: $('#lfb_winGlobalSettings [name="smtp_password"]').val(),
            mode: $('#lfb_winGlobalSettings [name="smtp_mode"]').val(),
          },
          success: function (rep) {
            rep = rep.trim();
            var code = rep.substr(0, rep.indexOf("|"));
            var message = rep.substr(rep.indexOf("|") + 1, rep.length);
            var alertClass = "alert-danger";
            if (code == 1) {
              alertClass = "alert-success";
            }
            $("#lfb_smtpTestRep").html(
              '<div class="alert ' + alertClass + '">' + message + "</div>"
            );
          },
        });
      });
    }
  }

  function lfb_applyCalculationEditorTooltips(editorName) {
    $("#lfb_winItem .tooltip").remove();
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    var editor = $('textarea[name="' + editorName + '"]').data(
      "codeMirrorEditor"
    );
    editor.jObject
      .next(".CodeMirror")
      .find(".cm-variable")
      .each(function () {
        var itemEl = $(this);
        var tooltipText = "";
        if (itemEl.html() == "item") {
          var itemID = 0;
          var attribute = "";
          itemID = parseInt(itemEl.next().next(".cm-number").text());
          attribute = itemEl.next().next().next(".cm-variable").text();

          var item = lfb_getItemByID(itemID);
          if (item) {
            var step = lfb_getStepByID(item.stepID);
            if (item.stepID == 0) {
              step = { title: lfb_data.texts["lastStep"] };
            }
            if (attribute == "_price") {
              tooltipText = lfb_data.texts["Price of the item [item]"].replace(
                "[item]",
                "<strong>" + item.title + "</strong> (" + step.title + ")"
              );
            } else if (attribute == "_value") {
              tooltipText = lfb_data.texts["Value of the item [item]"].replace(
                "[item]",
                "<strong>" + item.title + "</strong> (" + step.title + ")"
              );
            } else if (attribute == "_quantity") {
              tooltipText = lfb_data.texts[
                "Quantity of the item [item]"
              ].replace(
                "[item]",
                "<strong>" + item.title + "</strong> (" + step.title + ")"
              );
            } else if (attribute == "_title") {
              tooltipText = lfb_data.texts["Title of the item [item]"].replace(
                "[item]",
                "<strong>" + item.title + "</strong> (" + step.title + ")"
              );
            } else if (
              attribute == "_isChecked" ||
              attribute == "_isUnchecked"
            ) {
              tooltipText =
                "<strong>" + item.title + "</strong> (" + step.title + ")";
            }
          }
        } else if (itemEl.html() == "variable") {
          var variableID = parseInt(itemEl.next().next(".cm-number").text());
          var variable = lfb_getVariable(variableID);
          if (variable) {
            tooltipText = variable.title;
          }
        } else if (itemEl.html() == "step") {
          var stepID = parseInt(itemEl.next().next(".cm-number").text());
          var step = lfb_getStepByID(stepID);
          if (stepID == 0) {
            step = { title: lfb_data.texts["lastStep"] };
          }
          attribute = itemEl.next().next().next(".cm-variable").text();
          if (step) {
            if (attribute == "_quantity") {
              tooltipText = lfb_data.texts[
                "Total quantity of the step [step]"
              ].replace("[step]", "<strong>" + step.title + "</strong>");
            } else if (attribute == "_price") {
              tooltipText = lfb_data.texts[
                "Total price of the step [step]"
              ].replace("[step]", "<strong>" + step.title + "</strong>");
            } else if (attribute == "_title") {
              tooltipText = lfb_data.texts["Title of the step [step]"].replace(
                "[step]",
                "<strong>" + step.title + "</strong>"
              );
            }
          }
        } else if (itemEl.html() == "total") {
          tooltipText = lfb_data.texts["Total price of the form"];
        } else if (itemEl.html() == "total_quantity") {
          tooltipText = lfb_data.texts["Total selected quantity in the form"];
        }

        if (tooltipText != "") {
          itemEl.tooltip({
            title: tooltipText,
            html: true,
            container: "#lfb_winItem",
            placement: "bottom",
            template:
              '<div class="tooltip lfb_greyTooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
          });
          itemEl.next(".cm-operator").tooltip({
            title: tooltipText,
            html: true,
            container: "#lfb_winItem",
            placement: "bottom",
            template:
              '<div class="tooltip lfb_greyTooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
          });
          if (itemEl.next().next(".cm-number").length == 1) {
            itemEl.next().next(".cm-number").tooltip({
              title: tooltipText,
              html: true,
              container: "#lfb_winItem",
              placement: "bottom",
              template:
                '<div class="tooltip lfb_greyTooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            });
          }
          if (itemEl.next().next().next(".cm-variable").length == 1) {
            itemEl.next().next().next(".cm-variable").tooltip({
              title: tooltipText,
              html: true,
              container: "#lfb_winItem",
              placement: "bottom",
              template:
                '<div class="tooltip lfb_greyTooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            });
          }
        }
      });
  }

  function lfb_initCalculationEditor(editorName) {
    var editor = $('textarea[name="' + editorName + '"]').data(
      "codeMirrorEditor"
    );
    editor.on("change", function () {
      setTimeout(function () {
        lfb_applyCalculationEditorTooltips(editorName);
      }, 500);
    });
    setTimeout(function () {
      lfb_applyCalculationEditorTooltips(editorName);
    }, 500);
  }

  function lfb_openFormPreview(formID) {
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_getFormPreviewURL",
        formID: formID,
      },
      success: function (url) {
        var win = window.open(url, "_blank");
        if (typeof win !== "null" && win != null) {
          win.focus();
        }
      },
    });
  }

  function lfb_showAllOrders() {
    $("#lfb_mainToolbar a.lfb_over-primary")
      .removeClass("lfb_over-primary")
      .addClass("lfb_over-default");
    $('#lfb_mainToolbar a[data-action="showAllOrders"]')
      .removeClass("lfb_over-default")
      .addClass("lfb_over-primary");

    lfb_loadLogs(0);
  }

  function lfb_initStepVisual() {
    $('#lfb_winEditStepVisual a[data-action="openComponents"]').on(
      "click",
      function () {
        $("#lfb_stepFrame")[0]
          .contentWindow.jQuery("#lfb_form")
          .trigger("lfb_showComponentsMenu");
      }
    );
  }

  function lfb_stepFrameOnHeightChanged() {
    if (lfb_settings.backendTheme != "glassmorphic") {
      $("#lfb_stepFrame").css({
        minHeight: $("#lfb_stepFrame")[0]
          .contentWindow.jQuery("#lfb_form")
          .outerHeight(),
      });
    }
  }

  function lfb_stepFrameLoaded() {
    if (
      $("#lfb_winEditStepVisual").css("display") == "block" &&
      $("#lfb_stepFrame").contents().find("#lfb_form").is(".lfb_visualReady")
    ) {
      $("#lfb_stepFrame")[0]
        .contentWindow.jQuery("#lfb_form")
        .trigger("lfb_setBackendTheme", [lfb_settings.backendTheme]);
      $("#lfb_stepFrame")[0]
        .contentWindow.jQuery("#lfb_form")
        .trigger("lfb_initVisualStep", [lfb_currentStepID, lfb_currentFormID]);
      $("#lfb_innerLoader").fadeOut();
      $('[data-action="stepSettings"]').removeClass("disabled");
      lfb_stepFrameOnHeightChanged();
      setTimeout(function () {
        lfb_stepFrameOnHeightChanged();
        $("body .tooltip, #lfb_bootstraped  .tooltip").remove();
      }, 500);
      setTimeout(function () {
        lfb_stepFrameOnHeightChanged();
      }, 3000);

      if (lfb_settings.backendTheme == "glassmorphic") {
        $("#lfb_stepFrame").addClass("lfb_ready");
        var margTop =
          $("#wpadminbar").outerHeight() +
          $(".lfb_mainHeader").outerHeight() +
          $("#lfb_editFormNavbar").outerHeight();
        var height = $(window).height() - margTop;
        height -= 48 * 2;

        $("#lfb_stepFrame.lfb_ready").css({
          height: height,
          top: margTop,
        });
      }

      $("#lfb_stepFrame.lfb_ready").css({
        height:
          $(window).innerHeight() -
          ($("#lfb_winEditStepVisual .lfb_lPanelMenu").outerHeight() +
            $("#lfb_winEditStepVisual .lfb_winHeader").outerHeight() +
            $("#wpadminbar").outerHeight()),
      });
    }
  }

  function lfb_editVisualStep(stepID) {
    $("body>.tooltip, #lfb_bootstraped > .tooltip").remove();
    if ($('#lfb_formFields [name="gmap_key"]').val().length < 3) {
      $("#lfb_winComponents").find('a[data-type="gmap"]').addClass("disabled");
    } else {
      $("#lfb_winComponents")
        .find('a[data-type="gmap"]')
        .removeClass("disabled");
    }

    $(".lfb_mainNavBar").hide();

    if (stepID == 0) {
      $("#lfb_navBar_lastStepVisual").show();
    } else {
      if (lfb_currentForm.form.useVisualBuilder == 1) {
        $("#lfb_navBar_stepVisual").show();
      } else {
        $("#lfb_navBar_step").show();
      }
    }
    $('#lfb_editFormNavbar [data-action="stepSettings"]').show();
    lfb_currentStepID = stepID;
    lfb_currentStep = lfb_getStepByID(stepID);
    if (lfb_currentStep) {
      $("#lfb_winEditStepVisual #lfb_stepTitle").val(lfb_currentStep.title);
      $("#lfb_winEditStepVisual #lfb_stepMaxWidth").slider("value", 0);
      if (lfb_currentStep.maxWidth > 0) {
        $("#lfb_winEditStepVisual #lfb_stepMaxWidth").slider(
          "value",
          lfb_stepPossibleWidths.indexOf(lfb_currentStep.maxWidth)
        );
      }

      $("#lfb_winEditStepVisual .lfb_lPanelMenu .lfb_alignRight").show();
      $('#lfb_winEditStepVisual a[data-action="openStepSettings"]').show();

      $("#lfb_winStepSettings")
        .find("input,select,textarea")
        .each(function () {
          if ($(this).is('[data-switch="switch"]')) {
            var value = false;
            eval(
              "if(lfb_currentStep." +
                $(this).attr("name") +
                " == 1){$(this).attr('checked','checked');} else {$(this).attr('checked',false);}"
            );
            eval(
              "if(lfb_currentStep." +
                $(this).attr("name") +
                ' == 1){ $(this).parent().bootstrapSwitch("setState",true); } else {$(this).parent().bootstrapSwitch("setState",false);}'
            );
          } else {
            eval("$(this).val(lfb_currentStep." + $(this).attr("name") + ");");
          }
        });

      $("#lfb_winStepSettings #showConditionsStepBtn")
        .closest(".col-4")
        .removeClass("lfb_hidden");
      $('#lfb_winStepSettings [name="description"]')
        .closest(".col-4")
        .removeClass("lfb_hidden");
      $('#lfb_winStepSettings [name="useShowConditions"]')
        .closest(".col-4")
        .removeClass("lfb_hidden");
      $('#lfb_winStepSettings [name="itemRequired"]')
        .closest(".col-4")
        .removeClass("lfb_hidden");
      $("#lfb_winStepSettings .lfb_lastStepOnly")
        .closest(".col-4")
        .addClass("lfb_hidden");
    } else {
      $("#lfb_winEditStepVisual .lfb_lPanelMenu .lfb_alignRight").addClass(
        "lfb_hidden"
      );
      $("#lfb_winStepSettings #showConditionsStepBtn")
        .closest(".col-4")
        .addClass("lfb_hidden");
      $('#lfb_winStepSettings [name="description"]')
        .closest(".col-4")
        .addClass("lfb_hidden");
      $('#lfb_winStepSettings [name="useShowConditions"]')
        .closest(".col-4")
        .addClass("lfb_hidden");
      $('#lfb_winStepSettings [name="itemRequired"]')
        .closest(".col-4")
        .addClass("lfb_hidden");
      $('#lfb_winStepSettings [name="title"]').val(
        lfb_currentForm.form.last_title
      );
      $("#lfb_winStepSettings .lfb_lastStepOnly")
        .closest(".col-4")
        .removeClass("lfb_hidden");

      $('#lfb_winStepSettings [name="last_text"]').val(
        lfb_currentForm.form.last_text
      );
      $('#lfb_winStepSettings [name="last_btn"]').val(
        lfb_currentForm.form.last_btn
      );
      $('#lfb_winStepSettings [name="succeed_text"]').val(
        lfb_currentForm.form.succeed_text
      );

      if (lfb_currentForm.form.hideFinalPrice == 1) {
        $('#lfb_winStepSettings [name="hideFinalPrice"]')
          .parent()
          .bootstrapSwitch("setState", true);
      } else {
        $('#lfb_winStepSettings [name="hideFinalPrice"]')
          .parent()
          .bootstrapSwitch("setState", false);
      }
      if (lfb_currentForm.form.useSummary == 1) {
        $('#lfb_winStepSettings [name="useSummary"]')
          .parent()
          .bootstrapSwitch("setState", true);
      } else {
        $('#lfb_winStepSettings [name="useSummary"]')
          .parent()
          .bootstrapSwitch("setState", false);
      }
      if (lfb_currentForm.form.useSignature == 1) {
        $('#lfb_winStepSettings [name="useSignature"]')
          .parent()
          .bootstrapSwitch("setState", true);
      } else {
        $('#lfb_winStepSettings [name="useSignature"]')
          .parent()
          .bootstrapSwitch("setState", false);
      }

      if (lfb_currentForm.form.summary_hideFinalStep == 1) {
        $('#lfb_winStepSettings [name="showInSummary"]')
          .parent()
          .bootstrapSwitch("setState", true);
      } else {
        $('#lfb_winStepSettings [name="showInSummary"]')
          .parent()
          .bootstrapSwitch("setState", false);
      }
    }

    if (
      $("#lfb_stepFrame").attr("src") == "about:blank" ||
      $("#lfb_stepFrame")
        .contents()
        .find(
          '#lfb_form .lfb_genSlide[data-stepid="' + lfb_currentStepID + '"]'
        ).length == 0
        || $('.lfb_stepBloc[data-stepid="'+lfb_currentStepID+'"]').is('.lfb_mustReloaded')
    ) {
      $('.lfb_stepBloc[data-stepid="'+lfb_currentStepID+'"]').removeClass('lfb_mustReloaded');
      $('[data-action="stepSettings"]').addClass("disabled");
      // if (lfb_settings.backendTheme != 'glassmorphic') {
      $("#lfb_innerLoader").fadeIn();
      // }
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_winEditStepVisual").removeClass("lfb_hidden");

      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_getFormPreviewURL",
          formID: lfb_currentFormID,
        },
        success: function (url) {
          if (url.indexOf("?") > 0) {
            url += "&lfb_editForm=1";
          } else {
            url += "?lfb_editForm=1";
          }
          if (
            document.location.href.indexOf("https:") == 0 &&
            url.indexOf("http:") == 0
          ) {
            url = url.replace("http:", "https:");
          } else if (
            document.location.href.indexOf("http:") == 0 &&
            url.indexOf("https:") == 0
          ) {
            url = url.replace("https:", "http:");
          }
          $("#lfb_stepFrame").attr("src", url);
          if (lfb_settings.backendTheme != "glassmorphic") {
            $("#lfb_stepFrame").css({
              height:
                $(window).innerHeight() -
                ($("#lfb_winEditStepVisual .lfb_lPanelMenu").outerHeight() +
                  $("#lfb_winEditStepVisual .lfb_winHeader").outerHeight() +
                  $("#wpadminbar").outerHeight()),
            });
          }
          $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
            "update"
          );
        },
      });
    } else {
      $("#lfb_winEditStepVisual").show();
      $("#lfb_stepFrame")[0]
        .contentWindow.jQuery("#lfb_form")
        .trigger("lfb_initVisualStep", [lfb_currentStepID, lfb_currentFormID]);
      $("#lfb_innerLoader").fadeOut();
      $('[data-action="stepSettings"]').removeClass("disabled");
      if (lfb_settings.backendTheme != "glassmorphic") {
        $("#lfb_stepFrame").css({
          height:
            $(window).height() -
            ($("#lfb_winEditStepVisual .lfb_lPanelMenu").outerHeight() +
              $("#lfb_winEditStepVisual .lfb_winHeader").outerHeight() +
              $("#wpadminbar").outerHeight()),
        });
      }
      $("#lfb_panelsContainer>div").addClass("lfb_hidden");
      $("#lfb_winEditStepVisual").removeClass("lfb_hidden");
      $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
    }
  }

  function lfb_renderComponent($component) {
    var $element = $('<div class="lfb_componentBloc"></div>');

    var tb = $('<div class="lfb_elementToolbar"></div>');
    tb.append(
      '<a href="javascript:" class="btn-primary lfb-handler"><span class="fas fa-arrows-alt" data-tooltip="true"  data-bs-placement="bottom" title="' +
        lfb_data.texts["move"] +
        '"></span></a>'
    );
    tb.append(
      '<a href="javascript:" data-action="edit" class="btn-secondary"><span class="fas fa-pencil-alt" data-tooltip="true"  data-bs-placement="bottom" title="' +
        lfb_data.texts["edit"] +
        '"></span></a>'
    );
    if (!$element.is('[data-id="kafb_stepsContainer"]')) {
      tb.append(
        '<a href="javascript:" data-action="duplicate" class="btn-secondary"><span class="fas fa-copy" data-tooltip="true"  data-bs-placement="bottom" title="' +
          lfb_data.texts["duplicate"] +
          '"></span></a>'
      );
    }
    tb.append(
      '<a href="javascript:" data-action="delete" class="btn-danger"><span class="fas fa-trash" data-tooltip="true"  data-bs-placement="bottom" title="' +
        lfb_data.texts["remove"] +
        '"></span></a>'
    );

    $element.append(tb);

    var $content = $('<div class="lfb_elementContent"></div>');

    $element
      .on("mouseenter", function () {
        clearTimeout(lfb_elementHoverTimer);
        var chkChildrenhover = false;
        $(this)
          .find(".lfb_componentBloc")
          .each(function () {
            if ($(this).is(":hover")) {
              chkChildrenhover = true;
            }
          });
        if (
          (lfb_isDraggingComponent &&
            $(this).find(".lfb-column-inner.kafb_hoverEdit").length > 0) ||
          (!lfb_isDraggingComponent &&
            $(this).find(".lfb-column-inner:hover").length > 0)
        ) {
          chkChildrenhover = true;
        }
        if (!chkChildrenhover) {
          $(".lfb_hoverEdit").removeClass("lfb_hoverEdit");
          $(this).addClass("lfb_hover");
          $(this).addClass("lfb_hoverEdit");
        } else {
          $(this).removeClass("lfb_hover");
          $(this).removeClass("lfb_hoverEdit");
        }
        var _self = $(this);
        $(this)
          .parent()
          .closest(".lfb_componentBloc ")
          .removeClass("lfb_hover");
      })
      .on("mouseleave", function () {
        var _self = $(this);
        _self.removeClass("lfb_hover");
        _self.children(".lfb_hover").removeClass("lfb_hover");
        lfb_elementHoverTimer = setTimeout(function () {
          _self.removeClass("lfb_hoverEdit");
          _self.children(".lfb_hoverEdit").removeClass("lfb_hoverEdit");
        }, 500);
        if ($(this).closest(".lfb_componentBloc :hover").length > 0) {
          $(this).closest(".lfb_componentBloc :hover").trigger("mouseenter");
        }
      });

    var type = $component.attr("data-component");
    if (type == "row") {
      $content.append('<div class="row lfb_rowEdited"></div>');
    }
    $element.append($content);

    $component.after($element);
    $component.remove();
  }

  function lfb_newItemAdded(itemData) {
    if (lfb_currentStep) {
      lfb_currentStep.items.push(itemData);
    } else {
      lfb_currentForm.fields.push(itemData);
    }
  }

  function lfb_updateStepMainSettings() {
    var maxWidth = 0;
    if ($("#lfb_stepMaxWidth").slider("value") > 0) {
      maxWidth =
        lfb_stepPossibleWidths[$("#lfb_stepMaxWidth").slider("value")] + "px";
    }
    var width = maxWidth;
    if (width == 0) {
      width = "100%";
    }
    $("#lfb_stepFrame").contents().find(".lfb_activeStep").css({
      "max-width": width,
    });
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_changeStepMainSettings",
        stepID: lfb_currentStepID,
        title: $("#lfb_winEditStepVisual #lfb_stepTitle").val(),
        maxWidth: maxWidth,
      },
      success: function (rep) {},
    });
  }

  function lfb_updateLastStepTab() {
    $('#lfb_formFields [href="#lfb_finalStepItemsList"]').removeClass(
      "lfb_highlightTab"
    );
    $("#lfb_editFinalStepVisual").removeClass("lfb_highlightTab");
    if (lfb_currentForm) {
      if (lfb_currentForm.steps.length == 0) {
        $('#lfb_formFields [href="#lfb_finalStepItemsList"]').addClass(
          "lfb_highlightTab"
        );
        $("#lfb_editFinalStepVisual").addClass("lfb_highlightTab");
      }
    }
  }

  function lfb_tld_initStyles() {
    lfb_tld_styles = new Array();
    lfb_tld_styles.push({
      device: "all",
      elements: new Array(),
    });
    lfb_tld_styles.push({
      device: "desktop",
      elements: new Array(),
    });
    lfb_tld_styles.push({
      device: "desktopTablet",
      elements: new Array(),
    });
    lfb_tld_styles.push({
      device: "tablet",
      elements: new Array(),
    });
    lfb_tld_styles.push({
      device: "tabletPhone",
      elements: new Array(),
    });
    lfb_tld_styles.push({
      device: "phone",
      elements: new Array(),
    });
    lfb_tld_modifsMade = false;
  }
  /*function lfb_showLoader() {
        $('html,body').animate({ scrollTop: 0 }, 250);
        $('#lfb_loader').fadeIn();
    }*/

  function lfb_tld_onOpen() {
    if ($("#lfb_tld_tdgnFrame").attr("src") == "about:blank") {
      lfb_showLoader();
      jQuery.ajax({
        url: ajaxurl,
        type: "post",
        data: {
          action: "lfb_getFormPreviewURL",
          formID: lfb_currentFormID,
        },
        success: function (url) {
          if (url.indexOf("?") > -1) {
            lfb_tld_previewUrl =
              url + "&rand=" + Math.random() + "&lfb_designForm=1";
          } else {
            lfb_tld_previewUrl =
              url + "?rand=" + Math.random() + "&lfb_designForm=1";
          }
          $("#lfb_tld_tdgnFrame").attr("src", lfb_tld_previewUrl);
        },
      });
    } else {
    }
    setTimeout(function () {
      $(window).trigger("resize");
    }, 500);
  }

  function lfb_tld_tdgn_init() {
    $("#lfb_form").on("lfb_tld_itemSelected", lfb_tld_itemSelected);

    $('[data-action="lfb_tld_editCSS"]').on("click", lfb_tld_editCSS);
    $('[data-action="lfb_tld_resetSessionStyles"]').on(
      "click",
      lfb_tld_resetSessionStyles
    );
    $('[data-action="lfb_tld_resetAllStyles"]').on(
      "click",
      lfb_tld_resetAllStyles
    );
    $('[data-action="lfb_tld_saveEditedCSS"]').on(
      "click",
      lfb_tld_saveEditedCSS
    );
    $("#lfb_tld_savePanelToggleBtn").on("click", lfb_tld_toggleSavePanel);
    $('#lfb_tld_panelSectionStyles a[data-devicebtn="all"]').on(
      "click",
      function () {
        lfb_tld_changeDeviceMode("all");
      }
    );
    $('#lfb_tld_panelSectionStyles a[data-devicebtn="desktop"]').on(
      "click",
      function () {
        lfb_tld_changeDeviceMode("desktop");
      }
    );
    $('#lfb_tld_panelSectionStyles a[data-devicebtn="desktopTablet"]').on(
      "click",
      function () {
        lfb_tld_changeDeviceMode("desktopTablet");
      }
    );
    $('#lfb_tld_panelSectionStyles a[data-devicebtn="tabletPhone"]').on(
      "click",
      function () {
        lfb_tld_changeDeviceMode("tabletPhone");
      }
    );
    $('#lfb_tld_panelSectionStyles a[data-devicebtn="tablet"]').on(
      "click",
      function () {
        lfb_tld_changeDeviceMode("tablet");
      }
    );
    $('#lfb_tld_panelSectionStyles a[data-devicebtn="phone"]').on(
      "click",
      function () {
        lfb_tld_changeDeviceMode("phone");
      }
    );

    $('[data-action="lfb_tld_leaveConfirm"]').on("click", lfb_tld_leaveConfirm);
    $('[data-action="lfb_tld_saveCurrentElement"]').on(
      "click",
      lfb_tld_saveCurrentElement
    );
    $('[data-action="lfb_tld_confirmSaveStyles"]').on(
      "click",
      lfb_tld_confirmSaveStyles
    );
    $('[data-action="lfb_tld_confirmSaveStylesBeforeEdit"]').on(
      "click",
      lfb_tld_confirmSaveStylesBeforeEdit
    );
    $('[data-action="lfb_tld_confirmSaveStyles"]').on(
      "click",
      lfb_tld_confirmSaveStyles
    );

    lfb_tld_initStyles();
    lfb_tld_tdgn_initMenu();
    $("#lfb_tld_tdgn_applyModifsTo").on(
      "change",
      lfb_tld_tdgn_applyModifsChange
    );
    $("#lfb_tld_styleBackgroundType").on(
      "change",
      lfb_tld_styleBackgroundTypeChange
    );
    $("#lfb_tld_styleBackgroundType_color").on(
      "change",
      lfb_tld_styleBackgroundType_colorChange
    );
    $("#lfb_tld_styleBackgroundType_imageUrl").on(
      "keyup",
      lfb_tld_styleBackgroundType_imageChange
    );
    $("#lfb_tld_styleBackgroundType_imageUrl").on(
      "change",
      lfb_tld_styleBackgroundType_imageChange
    );
    $("#lfb_tld_styleBackgroundType_imageSize").on(
      "change",
      lfb_tld_styleBackgroundType_imageChange
    );
    $("#lfb_tld_style_borderColor").on(
      "change",
      lfb_tld_style_borderColorChange
    );
    $("#lfb_tld_style_borderStyle").on(
      "change",
      lfb_tld_style_borderStyleChange
    );
    $("#lfb_tld_style_widthType").on("change", lfb_tld_style_widthTypeChange);
    $("#lfb_tld_style_heightType").on("change", lfb_tld_style_heightTypeChange);
    $("#lfb_tld_tdgn_applyScope").on("change", lfb_tld_tdgn_applyScopeChange);
    $("#lfb_tld_style_display").on("change", lfb_tld_style_displayChange);
    $("#lfb_tld_style_position").on("change", lfb_tld_style_positionChange);
    $("#lfb_tld_style_positionLeft").on(
      "change",
      lfb_tld_style_positionLeftChange
    );
    $("#lfb_tld_style_positionTop").on(
      "change",
      lfb_tld_style_positionTopChange
    );
    $("#lfb_tld_style_positionBottom").on(
      "change",
      lfb_tld_style_positionBottomChange
    );
    $("#lfb_tld_style_positionRight").on(
      "change",
      lfb_tld_style_positionRightChange
    );
    $("#lfb_tld_style_float").on("change", lfb_tld_style_floatChange);
    $("#lfb_tld_style_clear").on("change", lfb_tld_style_clearChange);
    $("#lfb_tld_style_paddingTypeBottom").on(
      "change",
      lfb_tld_style_paddingTypeBottomChange
    );
    $("#lfb_tld_style_paddingTypeTop").on(
      "change",
      lfb_tld_style_paddingTypeTopChange
    );
    $("#lfb_tld_style_paddingTypeLeft").on(
      "change",
      lfb_tld_style_paddingTypeLeftChange
    );
    $("#lfb_tld_style_paddingTypeRight").on(
      "change",
      lfb_tld_style_paddingTypeRightChange
    );
    $("#lfb_tld_style_marginTypeBottom").on(
      "change",
      lfb_tld_style_marginTypeBottomChange
    );
    $("#lfb_tld_style_marginTypeTop").on(
      "change",
      lfb_tld_style_marginTypeTopChange
    );
    $("#lfb_tld_style_marginTypeLeft").on(
      "change",
      lfb_tld_style_marginTypeLeftChange
    );
    $("#lfb_tld_style_marginTypeRight").on(
      "change",
      lfb_tld_style_marginTypeRightChange
    );
    $("#lfb_tld_style_fontType").on("change", lfb_tld_style_fontTypeChange);
    $("#lfb_tld_style_fontFamily").on("change", lfb_tld_style_fontFamilyChange);
    $("#lfb_tld_style_fontStyle").on("change", lfb_tld_style_fontStyleChange);
    $("#lfb_tld_style_fontColor").on("change", lfb_tld_style_fontColorChange);
    $("#lfb_tld_style_lineHeightType").on(
      "change",
      lfb_tld_style_lineHeightTypeChange
    );
    $("#lfb_tld_style_scrollX").on("change", lfb_tld_style_scrollXChange);
    $("#lfb_tld_style_scrollY").on("change", lfb_tld_style_scrollYChange);
    $("#lfb_tld_style_visibility").on("change", lfb_tld_style_visibilityChange);
    $("#lfb_tld_style_shadowType").on("change", lfb_tld_style_shadowTypeChange);
    $("#lfb_tld_style_shadowColor").on("change", lfb_tld_style_shadowChange);
    $("#lfb_tld_style_textShadowColor").on(
      "change",
      lfb_tld_style_textShadowChange
    );
    $("#lfb_tld_style_textAlign").on("change", lfb_tld_style_textAlignChange);
    $("#lfb_tld_stateSelect").on("change", lfb_tld_changeStateMode);

    $("#lfb_tld_styleBackgroundType_colorAlpha").on(
      "slidechange",
      lfb_tld_styleBackgroundType_colorAlphaChange
    );
    $("#lfb_tld_styleBackgroundType_colorAlpha").on(
      "slide",
      lfb_tld_styleBackgroundType_colorAlphaChange
    );
    $("#lfb_tld_style_borderSize").on(
      "slidechange",
      lfb_tld_style_borderSizeChange
    );
    $("#lfb_tld_style_borderSize").on("slide", lfb_tld_style_borderSizeChange);
    $("#lfb_tld_style_borderSize").bind(
      "lfb_tld_update",
      lfb_tld_style_borderSizeChange
    );
    $("#lfb_tld_style_width").on("slide", lfb_tld_style_widthChange);
    $("#lfb_tld_style_width").bind("lfb_tld_update", lfb_tld_style_widthChange);
    $("#lfb_tld_style_widthFlex").on("slide", lfb_tld_style_widthFlexChange);
    $("#lfb_tld_style_widthFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_widthFlexChange
    );
    $("#lfb_tld_style_height").on("slide", lfb_tld_style_heightChange);
    $("#lfb_tld_style_height").bind(
      "lfb_tld_update",
      lfb_tld_style_heightChange
    );
    $("#lfb_tld_style_heightFlex").on("slide", lfb_tld_style_heightFlexChange);
    $("#lfb_tld_style_heightFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_heightFlexChange
    );
    $("#lfb_tld_style_left").on("slide", lfb_tld_style_leftChange);
    $("#lfb_tld_style_left").bind("lfb_tld_update", lfb_tld_style_leftChange);
    $("#lfb_tld_style_right").on("slide", lfb_tld_style_rightChange);
    $("#lfb_tld_style_right").bind("lfb_tld_update", lfb_tld_style_rightChange);
    $("#lfb_tld_style_bottom").on("slide", lfb_tld_style_bottomChange);
    $("#lfb_tld_style_bottom").bind(
      "lfb_tld_update",
      lfb_tld_style_bottomChange
    );
    $("#lfb_tld_style_top").on("slide", lfb_tld_style_topChange);
    $("#lfb_tld_style_top").bind("lfb_tld_update", lfb_tld_style_topChange);
    $("#lfb_tld_style_leftFlex").on("slide", lfb_tld_style_leftFlexChange);
    $("#lfb_tld_style_leftFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_leftFlexChange
    );
    $("#lfb_tld_style_rightFlex").on("slide", lfb_tld_style_rightFlexChange);
    $("#lfb_tld_style_rightFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_rightFlexChange
    );
    $("#lfb_tld_style_topFlex").on("slide", lfb_tld_style_topFlexChange);
    $("#lfb_tld_style_topFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_topFlexChange
    );
    $("#lfb_tld_style_bottomFlex").on("slide", lfb_tld_style_bottomFlexChange);
    $("#lfb_tld_style_bottomFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_bottomFlexChange
    );
    $("#lfb_tld_style_marginLeft").on("slide", lfb_tld_style_marginLeftChange);
    $("#lfb_tld_style_marginLeft").bind(
      "lfb_tld_update",
      lfb_tld_style_marginLeftChange
    );
    $("#lfb_tld_style_marginRight").on(
      "slide",
      lfb_tld_style_marginRightChange
    );
    $("#lfb_tld_style_marginRight").bind(
      "lfb_tld_update",
      lfb_tld_style_marginRightChange
    );
    $("#lfb_tld_style_marginTop").on("slide", lfb_tld_style_marginTopChange);
    $("#lfb_tld_style_marginTop").bind(
      "lfb_tld_update",
      lfb_tld_style_marginTopChange
    );
    $("#lfb_tld_style_marginBottom").on(
      "slide",
      lfb_tld_style_marginBottomChange
    );
    $("#lfb_tld_style_marginBottom").bind(
      "lfb_tld_update",
      lfb_tld_style_marginBottomChange
    );
    $("#lfb_tld_style_marginLeftFlex").on(
      "slide",
      lfb_tld_style_marginLeftFlexChange
    );
    $("#lfb_tld_style_marginLeftFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_marginLeftFlexChange
    );
    $("#lfb_tld_style_marginRightFlex").on(
      "slide",
      lfb_tld_style_marginRightFlexChange
    );
    $("#lfb_tld_style_marginRightFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_marginRightFlexChange
    );
    $("#lfb_tld_style_marginTopFlex").on(
      "slide",
      lfb_tld_style_marginTopFlexChange
    );
    $("#lfb_tld_style_marginTopFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_marginTopFlexChange
    );
    $("#lfb_tld_style_marginBottomFlex").on(
      "slide",
      lfb_tld_style_marginBottomFlexChange
    );
    $("#lfb_tld_style_marginBottomFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_marginBottomFlexChange
    );
    $("#lfb_tld_style_paddingLeft").on(
      "slide",
      lfb_tld_style_paddingLeftChange
    );
    $("#lfb_tld_style_paddingLeft").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingLeftChange
    );
    $("#lfb_tld_style_paddingRight").on(
      "slide",
      lfb_tld_style_paddingRightChange
    );
    $("#lfb_tld_style_paddingRight").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingRightChange
    );
    $("#lfb_tld_style_paddingTop").on("slide", lfb_tld_style_paddingTopChange);
    $("#lfb_tld_style_paddingTop").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingTopChange
    );
    $("#lfb_tld_style_paddingBottom").on(
      "slide",
      lfb_tld_style_paddingBottomChange
    );
    $("#lfb_tld_style_paddingBottom").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingBottomChange
    );
    $("#lfb_tld_style_paddingLeftFlex").on(
      "slide",
      lfb_tld_style_paddingLeftFlexChange
    );
    $("#lfb_tld_style_paddingLeftFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingLeftFlexChange
    );
    $("#lfb_tld_style_paddingRightFlex").on(
      "slide",
      lfb_tld_style_paddingRightFlexChange
    );
    $("#lfb_tld_style_paddingRightFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingRightFlexChange
    );
    $("#lfb_tld_style_paddingTopFlex").on(
      "slide",
      lfb_tld_style_paddingTopFlexChange
    );
    $("#lfb_tld_style_paddingTopFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingTopFlexChange
    );
    $("#lfb_tld_style_paddingBottomFlex").on(
      "slide",
      lfb_tld_style_paddingBottomFlexChange
    );
    $("#lfb_tld_style_paddingBottomFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_paddingBottomFlexChange
    );
    $("#lfb_tld_style_fontSize").on("slide", lfb_tld_style_fontSizeChange);
    $("#lfb_tld_style_fontSize").bind(
      "lfb_tld_update",
      lfb_tld_style_fontSizeChange
    );
    $("#lfb_tld_style_lineHeight").on("slide", lfb_tld_style_lineHeightChange);
    $("#lfb_tld_style_lineHeight").bind(
      "lfb_tld_update",
      lfb_tld_style_lineHeightChange
    );
    $("#lfb_tld_style_lineHeightFlex").on(
      "slide",
      lfb_tld_style_lineHeightFlexChange
    );
    $("#lfb_tld_style_lineHeightFlex").bind(
      "lfb_tld_update",
      lfb_tld_style_lineHeightFlexChange
    );
    $("#lfb_tld_style_opacity").on("slide", lfb_tld_style_opacityChange);
    $("#lfb_tld_style_opacity").bind(
      "lfb_tld_update",
      lfb_tld_style_opacityChange
    );
    $("#lfb_tld_style_shadowSize").on("slide", lfb_tld_style_shadowChange);
    $("#lfb_tld_style_shadowSize").bind(
      "lfb_tld_update",
      lfb_tld_style_shadowChange
    );
    $("#lfb_tld_style_shadowX").on("slide", lfb_tld_style_shadowChange);
    $("#lfb_tld_style_shadowX").bind(
      "lfb_tld_update",
      lfb_tld_style_shadowChange
    );
    $("#lfb_tld_style_shadowY").on("slide", lfb_tld_style_shadowChange);
    $("#lfb_tld_style_shadowY").bind(
      "lfb_tld_update",
      lfb_tld_style_shadowChange
    );
    $("#lfb_tld_style_shadowAlpha").on("slide", lfb_tld_style_shadowChange);
    $("#lfb_tld_style_shadowAlpha").bind(
      "lfb_tld_update",
      lfb_tld_style_shadowChange
    );
    $("#lfb_tld_style_textShadowX").on("slide", lfb_tld_style_textShadowChange);
    $("#lfb_tld_style_textShadowX").bind(
      "lfb_tld_update",
      lfb_tld_style_textShadowChange
    );
    $("#lfb_tld_style_textShadowY").on("slide", lfb_tld_style_textShadowChange);
    $("#lfb_tld_style_textShadowY").bind(
      "lfb_tld_update",
      lfb_tld_style_textShadowChange
    );
    $("#lfb_tld_style_textShadowAlpha").on(
      "slide",
      lfb_tld_style_textShadowChange
    );
    $("#lfb_tld_style_textShadowAlpha").bind(
      "lfb_tld_update",
      lfb_tld_style_textShadowChange
    );

    $("#lfb_tld_style_borderRadiusTopLeft").on(
      "slide",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusTopLeft").bind(
      "lfb_tld_update",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusTopRight").on(
      "slide",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusTopRight").bind(
      "lfb_tld_update",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusBottomLeft").on(
      "slide",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusBottomLeft").bind(
      "lfb_tld_update",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusBottomRight").on(
      "slide",
      lfb_tld_style_borderRadiusChange
    );
    $("#lfb_tld_style_borderRadiusBottomRight").bind(
      "lfb_tld_update",
      lfb_tld_style_borderRadiusChange
    );

    $("#lfb_tld_tdgnFrame").on("load", function () {
      if ($("#lfb_tld_tdgnFrame").attr("src") != "about:blank") {
        if (lfb_tld_firstLoad) {
          lfb_tld_firstLoad = false;
        }
        $("#lfb_loader").delay(1000).fadeOut();
        setTimeout(function () {
          $("#lfb_rootPanelContainer>div").addClass("lfb_hidden");
          $("#lfb_tld_tdgnBootstrap").removeClass("lfb_hidden");
        }, 1000);
        lfb_tld_updateDomTree();
        lfb_tld_unselectElement();
        lfb_tld_changeDeviceMode("all");
        if (lfb_tld_targetStepID != "") {
          $("#lfb_tld_tdgnFrame")[0]
            .contentWindow.jQuery("#lfb_form")
            .trigger("lfb_setAnimImmediate", [lfb_currentFormID]);

          $("#lfb_tld_tdgnFrame")
            .contents()
            .find("#lfb_form")
            .attr("data-nowstart", 1);
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find("#lfb_form")
            .attr("data-animspeed", 0);
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep")
            .removeClass("lfb_activeStep");
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find('[data-start="1"]')
            .attr("data-start", "0");
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find('.lfb_genSlide[data-stepid="' + lfb_tld_targetStepID + '"]')
            .addClass("lfb_activeStep");
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find('.lfb_genSlide[data-stepid="' + lfb_tld_targetStepID + '"]')
            .attr("data-start", "1");

          $("#lfb_tld_tdgnFrame")
            .contents()
            .find("#lfb_form .lfb_startBtnContainer")
            .hide();
          $("#lfb_tld_tdgnFrame").contents().find("#lfb_form #genPrice").show();
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find("#lfb_form #lfb_mainPanel")
            .attr(
              "style",
              "transition: none !important;opacity:1 !important;display: block !important;"
            );
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep")
            .show()
            .attr(
              "style",
              "transition: none !important;opacity:1 !important;display: block !important;"
            );
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .lfb_genContent")
            .show()
            .attr(
              "style",
              "transition: none !important;opacity:1 !important;display: block !important;"
            );
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .lfb_stepTitle")
            .show()
            .attr(
              "style",
              "transition: none !important;opacity:1 !important;display: block !important;"
            );
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .lfb_stepTitle")
            .addClass("positionned");
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .datetimepicker")
            .hide();
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .lfb_errorMsg ")
            .hide();
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .tooltip")
            .hide();
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(".lfb_activeStep .lfb_btn-next")
            .show();

          $("#lfb_tld_tdgnFrame")[0]
            .contentWindow.jQuery("#lfb_form")
            .trigger("lfb_resizeAll");

          if (lfb_tld_targetDomElement != "") {
            lfb_tld_selectElement(
              $("#lfb_tld_tdgnFrame").contents().find(lfb_tld_targetDomElement)
            );
            lfb_tld_elementInitialized = false;
            lfb_tld_getElementStyles(
              $("#lfb_tld_tdgnFrame")
                .contents()
                .find(lfb_tld_targetDomElement)[0]
            );
            setTimeout(function () {
              lfb_tld_elementInitialized = true;
            }, 250);
          }
          $("#lfb_tld_tdgnFrame")
            .contents()
            .find(
              '#lfb_mainPanel .lfb_genSlide[data-stepid="' +
                lfb_tld_targetStepID +
                '"] .lfb_rate'
            )
            .each(function () {
              var width =
                22 * $(this).find(".rate-base-layer").children().length;
              var height = 32;
              if (parseInt($(this).css("width")) == 0) {
                $(this).css({ width: width, height: height });
                $(this).children().css({ width: width, height: height });
              }
            });

          var heightStepsOverflow =
            $(window).height() -
            ($("#wpadminbar").outerHeight() +
              $(".lfb_mainHeader").outerHeight() +
              $("#lfb_editFormNavbar").outerHeight());

          $("#lfb_tld_tdgnContainer").css({
            minHeight: heightStepsOverflow,
          });
        }

        setTimeout(function () {
          $(window).trigger("resize");
        }, 500);
      }
    });

    $(".lfb_imageBtn").on("click", function () {
      lfb_tld_imgField = $(this).prev("input");
      lfb_formfield = $(this).prev("input");
      tb_show("", "media-upload.php?TB_iframe=true");
      return false;
    });
    if ($("textarea#lfb_tld_editCssField").length > 0) {
      lfb_tld_editorCSS = CodeMirror.fromTextArea(
        $("textarea#lfb_tld_editCssField").get(0),
        {
          mode: "css",
          lineNumbers: true,
        }
      );
    }

    $(".lfb_tld_colorpick").each(function () {
      var $this = $(this);
      if ($(this).prev(".lfb_tld_colorPreview").length == 0) {
        $(this).before(
          '<div class="lfb_tld_colorPreview" style="background-color:#' +
            $this.val().substr(1, 7) +
            '"></div>'
        );
      }
      $(this)
        .prev(".lfb_tld_colorPreview")
        .on("click", function () {
          $(this).next(".lfb_tld_colorpick").trigger("click");
        });
      $(this).colpick({
        color: $this.val().substr(1, 7),

        onChange: function (hsb, hex, rgb, el, bySetColor) {
          var newColor = lfb_tld_hex2Rgba("#" + hex, 1);
          if ($(el).attr("id") == "#lfb_tld_styleBackgroundType_color") {
            newColor = lfb_tld_hex2Rgba(
              "#" + hex,
              $("#lfb_tld_styleBackgroundType_colorAlpha").slider("value")
            );
          } else if ($(el).attr("id") == "#lfb_tld_style_shadowColor") {
            newColor = lfb_tld_hex2Rgba(
              "#" + hex,
              $("#lfb_tld_style_shadowAlpha").slider("value")
            );
          }

          $(el)
            .prev(".lfb_tld_colorPreview")
            .css({
              backgroundColor: "#" + hex,
            });
          $(el).val(newColor);
          $(el).trigger("change");
        },
        onSubmit: function (hsb, hex, rgb, el, bySetColor) {
          $(".colpick.colpick_full").fadeOut();
        },
      });
      $(this).on("change", function () {
        $(this)
          .prev(".lfb_tld_colorPreview")
          .css({
            backgroundColor: $(this).val(),
          });
      });
    });
    $(".lfb_tld_sliderField").on("change", function () {
      var value = $(this).val();
      if (value > $(this).prev(".lfb_tld_slider").attr("max")) {
        value = $(this).prev(".lfb_tld_slider").attr("max");
      }
      if (value < $(this).prev(".lfb_tld_slider").attr("min")) {
        value = $(this).prev(".lfb_tld_slider").attr("min");
      }
      $(this).prev(".lfb_tld_slider").slider("value", parseInt(value));
    });

    $(".lfb_tld_sliderField").on("keyup", lfb_tld_updateFromSliderField);
    $(".lfb_tld_sliderField").on("mouseup", lfb_tld_updateFromSliderField);

    lfb_tld_fillFontSelect();
    lfb_tld_unselectElement();
  }

  function lfb_tld_updateFromSliderField() {
    var value = $(this).val();
    if (value > parseInt($(this).prev(".lfb_tld_slider").attr("max"))) {
      value = parseInt($(this).prev(".lfb_tld_slider").attr("max"));
    }
    if (value < parseInt($(this).prev(".lfb_tld_slider").attr("min"))) {
      value = parseInt($(this).prev(".lfb_tld_slider").attr("min"));
    }
    $(this).prev(".lfb_tld_slider").slider("value", parseInt(value));
    $(this).prev(".lfb_tld_slider").trigger("lfb_tld_update");
  }

  function lfb_tld_fillFontSelect() {
    var fonts = [
      "ABeeZee",
      "Abel",
      "Abril Fatface",
      "Aclonica",
      "Acme",
      "Actor",
      "Adamina",
      "Advent Pro",
      "Aguafina Script",
      "Akronim",
      "Aladin",
      "Aldrich",
      "Alef",
      "Alegreya",
      "Alegreya SC",
      "Alegreya Sans",
      "Emilys Candy",
      "Engagement",
      "Englebert",
      "Enriqueta",
      "Erica One",
      "Esteban",
      "Euphoria Script",
      "Ewert",
      "Exo",
      "Exo 2",
      "Lato",
      "League Script",
      "Leckerli One",
      "Ledger",
      "Lekton",
      "Lemon",
      "Libre Baskerville",
      "Life Savers",
      "Lilita One",
      "Lily Script One",
      "Limelight",
      "Linden Hill",
      "Lobster",
      "Lobster Two",
      "Londrina Outline",
      "Londrina Shadow",
      "Londrina Sketch",
      "Londrina Solid",
      "Lora",
      "Love Ya Like A Sister",
      "Loved by the King",
      "Lovers Quarrel",
      "Luckiest Guy",
      "Odor Mean Chey",
      "Offside",
      "Old Standard TT",
      "Poly",
      "Pompiere",
      "Pontano Sans",
      "Poppins",
      "Port Lligat Sans",
      "Port Lligat Slab",
      "Pragati Narrow",
      "Prata",
      "Preahvihear",
      "Press Start 2P",
      "Princess Sofia",
      "Prociono",
      "Prosto One",
      "Puritan",
      "Purple Purse",
      "Quando",
      "Quantico",
      "Quattrocento",
      "Quattrocento Sans",
      "Questrial",
      "Quicksand",
      "Quintessential",
      "Qwigley",
      "Racing Sans One",
      "Radley",
      "Rajdhani",
      "Raleway",
      "Raleway Dots",
      "Ramabhadra",
      "Ramaraja",
      "Rambla",
      "Rammetto One",
      "Ranchers",
      "Rancho",
      "Ranga",
      "Rationale",
      "Ravi Prakash",
      "Redressed",
      "Reenie Beanie",
      "Revalia",
      "Rhodium Libre",
      "Ribeye",
      "Ribeye Marrow",
      "Righteous",
      "Risque",
      "Roboto",
      "Roboto Condensed, sans serif",
      "Roboto Mono",
      "Roboto Slab",
    ];

    jQuery.each(fonts, function () {
      $("#lfb_tld_style_fontFamily").append(
        $("<option></option>").attr("value", this).text(this)
      );
    });
  }

  function lfb_tld_tdgn_initMenu() {
    var i = 0;
    $("#lfb_tld_tdgnPanel .lfb_tld_tdgn_section").each(function () {
      $(this)
        .find(".lfb_tld_tdgn_sectionButton")
        .prepend(
          '<a href="javascript:" data-action="lfb_tld_tdgn_toggleSection"  class="lfb_tld_tdgn_sectionTitle btn btn-outline btn-outline-secondary">' +
            $(this).attr("data-title") +
            '<span class="fas fa-chevron-up ms-2 float-end mt-1""></span></a>'
        );
      if (i > 0) {
        lfb_tld_tdgn_toggleSection(
          $(this).find(".lfb_tld_tdgn_sectionTitle"),
          false
        );
      }
      i++;
    });
    $('#lfb_tld_tdgnPanel [data-action="lfb_tld_tdgn_toggleSection"]').on(
      "click",
      function () {
        lfb_tld_tdgn_toggleSection(this, true);
      }
    );
    $("#lfb_tld_tdgnPanel .panel-heading>.panel-title>a").each(function () {
      $(this).append(
        '<span class="fas fa-chevron-down ms-2 float-end"></span>'
      );
    });
    $("#lfb_tld_tdgnPanel .panel-heading").on("click", function () {
      $(this)
        .closest(".panel-group")
        .find(".panel-title .fas")
        .removeClass("fa-chevron-down");
      $(this)
        .closest(".panel-group")
        .find(".panel-title .fas")
        .addClass("fa-chevron-up");
      $(this).find(".fas").removeClass("fa-chevron-up");
      $(this).find(".fas").addClass("fa-chevron-down");
      $(this).closest(".panel-group").find(".panel-collapse").hide();
      $(this).closest(".panel").find(".panel-collapse").show();
    });
    $("#lfb_tld_tdgnPanel .panel-heading>.panel-title>a").on(
      "click",
      function () {
        $(this).parent().trigger("click");
      }
    );
    $("#lfb_tld_tdgnContainer .lfb_tld_slider").each(function () {
      var min = parseInt($(this).attr("data-min"));
      if (min == 0) {
        min = 0;
      }
      var max = parseInt($(this).attr("data-max"));
      if (max == 0) {
        max = 30;
      }
      var step = 1;
      if (
        $(this).attr("data-step") &&
        $(this).attr("data-step") != "undefined" &&
        $(this).attr("data-step") != ""
      ) {
        if ($(this).attr("data-step").indexOf(".") >= 0) {
          step = parseFloat($(this).attr("data-step"));
        } else {
          step = parseInt($(this).attr("data-step"));
        }
      }
      var tooltip = $(
        '<div class="tooltip top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' +
          min +
          "</div></div>"
      )
        .css({
          position: "absolute",
          top: -55,
          left: -12,
          opacity: 1,
        })
        .hide();
      $(this)
        .slider({
          min: parseInt(min),
          max: parseInt(max),
          value: parseInt(min),
          step: step,
          range: "min",
          orientation: "horizontal",
          change: function (event, ui) {
            tooltip.find(".tooltip-inner").html(ui.value);
            $(this).next(".lfb_tld_sliderField").val(ui.value);
          },
          slide: function (event, ui) {
            tooltip.find(".tooltip-inner").html(ui.value);
            tooltip.show();
            $(this).next(".lfb_tld_sliderField").val(ui.value);
          },
          stop: function (event, ui) {
            tooltip.find(".tooltip-inner").html(ui.value);
            tooltip.hide();
            $(this).next(".lfb_tld_sliderField").val(ui.value);
            $(this).trigger("slide");
          },
        })
        .find(".ui-slider-handle")
        .append(tooltip)
        .on("mouseenter", function () {
          tooltip.show();
        })
        .on("mouseleave", function () {
          tooltip.hide();
        });
      if ($(this).next(".lfb_tld_sliderField").length > 0) {
        $(this).next(".lfb_tld_sliderField").attr("min", min);
        $(this).next(".lfb_tld_sliderField").attr("max", max);
        $(this).next(".lfb_tld_sliderField").val(min);
      }
    });
    $("#lfb_tld_tdgnContainer .lfb_bootstrap-select").on("click", function () {
      if ($(this).is(".open")) {
        $(this).removeClass("open");
      } else {
        $(this).addClass("open");
      }
    });

    $("#lfb_tld_stateSelect")
      .closest(".lfb_bootstrap-select")
      .find(".btn.dropdown-toggle")
      .addClass("btn-info");
  }

  function lfb_tld_tdgn_toggleSection(element, realClick) {
    if (
      realClick &&
      !$(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionTitle > span")
        .is(".fa-chevron-up")
    ) {
      $("#lfb_tld_tdgnPanel .lfb_tld_tdgn_section:not(.lfb_tld_closed)").each(
        function () {
          if (
            !$(this).attr("data-title") !=
            $(element).closest(".lfb_tld_tdgn_section").attr("data-title")
          ) {
            lfb_tld_tdgn_toggleSection(
              $(this).find(".lfb_tld_tdgn_sectionTitle").get(0),
              false
            );
          }
        }
      );
    }
    if (
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionTitle > span")
        .is(".fa-chevron-up")
    ) {
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionTitle > span")
        .removeClass("fa-chevron-up");
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionTitle > span")
        .addClass("fa-chevron-down");
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionBody,.lfb_tld_tdgn_sectionBar")
        .slideUp();
      $(element).closest(".lfb_tld_tdgn_section").addClass("lfb_tld_closed");
    } else {
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionTitle > span")
        .removeClass("fa-chevron-down");
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionTitle > span")
        .addClass("fa-chevron-up");
      $(element)
        .closest(".lfb_tld_tdgn_section")
        .find(".lfb_tld_tdgn_sectionBody,.lfb_tld_tdgn_sectionBar")
        .slideDown();
      $(element).closest(".lfb_tld_tdgn_section").removeClass("lfb_tld_closed");
    }
  }

  function lfb_tld_tdgn_toggleTdgnPanel() {
    if ($("#lfb_tld_tdgnPanelToggleBtn > span.fas").is(".fa-chevron-left")) {
      $("#lfb_tld_tdgnPanelToggleBtn > span.fas").removeClass(
        "fa-chevron-left"
      );
      $("#lfb_tld_tdgnPanelToggleBtn > span.fas").addClass("fa-chevron-right");
      $("#lfb_tld_tdgnPanel #lfb_tld_tdgnPanelHeaderTitle").fadeOut(50);
      $("#lfb_tld_tdgnPanel #lfb_tld_tdgnPanelHeader .fa").fadeOut(50);
      $("#lfb_tld_tdgnPanel").addClass("lfb_tld_collapsed");
      $("#lfb_tld_tdgnInspector").addClass("lfb_tld_panelFullWidth");
      $("#lfb_tld_tdgnFrame").addClass("lfb_tld_panelFullWidth");
    } else {
      $("#lfb_tld_tdgnPanelToggleBtn > span.fas").removeClass(
        "fa-chevron-right"
      );
      $("#lfb_tld_tdgnPanelToggleBtn > span.fas").addClass("fa-chevron-left");
      setTimeout(function () {
        $("#lfb_tld_tdgnPanel #lfb_tld_tdgnPanelHeaderTitle").fadeIn(150);
        $("#lfb_tld_tdgnPanel #lfb_tld_tdgnPanelHeader .fa").fadeIn(200);
      }, 200);
      $("#lfb_tld_tdgnPanel").removeClass("lfb_tld_collapsed");
      $("#lfb_tld_tdgnInspector").removeClass("lfb_tld_panelFullWidth");
      $("#lfb_tld_tdgnFrame").removeClass("lfb_tld_panelFullWidth");
      if (
        $("#lfb_tld_tdgnFrame")[0]
          .contentWindow.jQuery("#lfb_form")
          .is(".lfb_tldSelection")
      ) {
        lfb_tld_stopSelectionElement();
      }
    }
    lfb_tld_updateFrameSize();
  }

  function lfb_tld_toggleSavePanel() {
    lfb_tld_confirmSaveStyles();
  }

  function lfb_tld_confirmSaveStyles() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_tld_saveCSS",
        styles: lfb_tld_formatStylesBeforeSend(),
        formID: lfb_currentFormID,
        gfonts: lfb_tld_getGoogleFontsUsed(),
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        hideModal($("#lfb_tld_winSaveDialog"));
        $("#lfb_tld_winSaveDialog").fadeOut();
        var random = Math.floor(Math.random() * 10000 + 1);
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
        $("#lfb_tld_tdgnFrame").attr(
          "src",
          lfb_tld_previewUrl + "&tmp=" + random + "&lfb_designForm=1"
        );
        lfb_tld_initStyles();
        lfb_tld_unselectElement();
      },
    });
  }

  function lfb_tld_confirmSaveStylesBeforeEdit() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_tld_saveCSS",
        styles: lfb_tld_formatStylesBeforeSend(),
        formID: lfb_currentFormID,
        gfonts: lfb_tld_getGoogleFontsUsed(),
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        var random = Math.floor(Math.random() * 10000 + 1);
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
        $("#lfb_tld_tdgnFrame").attr(
          "src",
          lfb_tld_previewUrl + "&tmp=" + random + "&lfb_designForm=1"
        );
        lfb_tld_initStyles();
        lfb_tld_unselectElement();
        lfb_tld_editCSS();
      },
    });
  }

  function lfb_tld_tdgn_toggleInspector() {
    if (
      $("#lfb_tld_tdgnInspectorToggleBtn > span.fas").is(".fa-chevron-down")
    ) {
      $("#lfb_tld_tdgnInspectorToggleBtn > span.fas").removeClass(
        "fa-chevron-down"
      );
      $("#lfb_tld_tdgnInspectorToggleBtn > span.fas").addClass("fa-chevron-up");
      $("#lfb_tld_tdgnFrame").animate(
        {
          paddingBottom: 46,
        },
        250
      );
      $("#lfb_tld_tdgnInspector").addClass("lfb_tld_collapsed");
    } else {
      $("#lfb_tld_tdgnInspectorToggleBtn > span.fas").removeClass(
        "fa-chevron-up"
      );
      $("#lfb_tld_tdgnInspectorToggleBtn > span.fas").addClass(
        "fa-chevron-down"
      );
      $("#lfb_tld_tdgnFrame").animate(
        {
          paddingBottom: 280,
        },
        250
      );
      $("#lfb_tld_tdgnInspector").removeClass("lfb_tld_collapsed");
    }
  }

  function lfb_tld_tdgn_applyModifsChange() {
    if ($("#lfb_tld_tdgn_applyModifsTo").val() == "cssClasses") {
      $("#lfb_tld_tdgn_applyToClasses").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_tdgn_applyToClasses").closest(".form-group").slideUp();
    }
  }

  function lfb_tdn_viewTreeItem(item) {
    lfb_tld_selectElement(
      $("#lfb_tld_tdgnFrame")
        .contents()
        .find("#" + $(item).attr("data-elementid"))
    );
    lfb_tld_elementInitialized = false;
    lfb_tld_getElementStyles(
      $("#lfb_tld_tdgnFrame")
        .contents()
        .find("#" + $(item).attr("data-elementid"))[0]
    );
    setTimeout(function () {
      lfb_tld_elementInitialized = true;
    }, 250);
  }

  function lfb_tld_treed(o, element) {
    var openedClass = "fa-minus";
    var closedClass = "fa-plus";

    if (typeof o != "undefined") {
      if (typeof o.openedClass != "undefined") {
        openedClass = o.openedClass;
      }
      if (typeof o.closedClass != "undefined") {
        closedClass = o.closedClass;
      }
    }
    var tree = $(element);
    tree.addClass("lfb_tld_tree");
    tree.find("li").each(function () {
      var branch = $(this);
      var margL = "";
      if (branch.children("ul").length > 0) {
        margL = "";
      }
      var link = $(
        '<a href="javascript:" class="lfb_tld_treeEyeLink"><span class="far fa-eye" ></span></a>'
      );
      link.on("click", function () {
        lfb_tdn_viewTreeItem($(this).parent());
      });
      link.on("mouseover", function () {
        $(this).addClass("tdn_hover");
      });
      link.on("mouseleave", function () {
        $(this).removeClass("tdn_hover");
      });
      branch.prepend(link);
    });
    tree
      .find("li")
      .has("ul")
      .each(function () {
        var branch = $(this);
        branch.prepend("<i class='indicator fas " + closedClass + "'></i>");
        branch.addClass("branch");
        branch.on("click", function (e) {
          if (
            this == e.target &&
            !$(this).find(".lfb_tld_treeEyeLink").is(".tdn_hover")
          ) {
            var icon = $(this).children("i:first");
            icon.toggleClass(openedClass + " " + closedClass);
            $(this).children().children("li").toggle();
            if ($(this).children("ul").is(".lfb_tld_open")) {
              $(this).children("ul").removeClass("lfb_tld_open");
            } else {
              $(this).children("ul").addClass("lfb_tld_open");
            }
          }
        });
        branch.children().children("li").toggle();
      });

    tree.find(".branch .indicator").each(function () {
      jQuery(this).on("click", function () {
        jQuery(this).closest("li").click();
      });
    });
    tree.find(".branch>a:not(.tld_treeEyeLink)").each(function () {
      jQuery(this).on("click", function (e) {
        jQuery(this).closest("li").click();
        e.preventDefault();
      });
    });
    tree.find(".branch>button").each(function () {
      jQuery(this).on("click", function (e) {
        jQuery(this).closest("li").click();
        e.preventDefault();
      });
    });
    tree.find(".branch>a.tld_treeEyeLink").each(function () {
      jQuery(this).on("click", function (e) {
        e.preventDefault();
      });
    });
  }

  function lfb_tld_expandTree(targetID) {
    if (
      $('#lfb_tld_tdgnInspector a[data-targetid="' + targetID + '"]').length > 0
    ) {
      var $li = $(
        '#lfb_tld_tdgnInspector li[data-elementid="' + targetID + '"]'
      );
      lfb_tld_expandTreeParent($li);
    }
  }

  function lfb_tld_expandTreeParent($element) {
    if (!$element.children("ul").is(".lfb_tld_open")) {
      $element.children("a[data-targetid]").trigger("click");
    }
    if ($element.closest(".lfb_tld_tree").length > 0) {
      lfb_tld_expandTreeParent($element.parent().closest("li"));
    }
  }

  function lfb_tld_getPath(el, modeClasses, start) {
    var path = "";
    if ($(el).length > 0 && typeof $(el).prop("tagName") != "undefined") {
      if ($(el).attr("id") != "lfb_form") {
        if (
          (start &&
            modeClasses &&
            (!$(el).attr("id") || $(el).attr("id") != "lfb_panel")) ||
          !$(el).attr("id") ||
          $(el).attr("id").substr(0, 9) == "ultimate-" ||
          $(el).attr("id").substr(0, 6) == "ui-id-" ||
          $(el).attr("id").substr(0, 2) == "dp"
        ) {
          if (!modeClasses) {
            var target =
              ">" +
              $(el).prop("tagName") +
              ":nth-child(" +
              ($(el).index() + 1) +
              ")";
            if ($(el).is(".lfb_genSlide")) {
              target = '> [data-stepid="' + $(el).attr("data-stepid") + '"]';
            } else if ($(el).is("[data-itemid]")) {
              target = '> [data-itemid="' + $(el).attr("data-itemid") + '"]';
            }
            path = target + path;
          } else {
            var classes = "";
            if (
              $(el).attr("class") &&
              $(el).attr("class").length > 0 &&
              (start || !$(el).is(".row"))
            ) {
              classes = $(el).attr("class");
              if (start) {
                classes = $("#lfb_tld_tdgn_applyToClasses").val();
              }
              var classNameToRemove = "";
              jQuery.each(classes.split(" "), function () {
                if (this.indexOf("lfb_itemContainer_") == 0) {
                  classNameToRemove = this;
                }
              });
              classes = "." + classes.replace(/  /g, " ");
              classes = classes.replace(/ /g, ".");
              classes = classes.replace("lfb_activeStep", "");
              classes = classes.replace("col-md-2", "");
              classes = classes.replace("col-md-12", "");
              classes = classes.replace("lfb_tld_edited", "");
              classes = classes.replace("lfb_tld_selectedElement", "");
              classes = classes.replace("lfb_tld_hasShadow", "");
              if (classNameToRemove != "") {
                classes = classes.replace(classNameToRemove, "");
              }
              classes = classes.replace("..", ".");
              classes = classes.replace("..", ".");
              classes = classes.replace("..", ".");

              if (classes.substr(classes.length - 1, 1) == ".") {
                classes = classes.substr(0, classes.length - 1);
              }
              if (classes.substr(classes.length - 1, 1) == ".") {
                classes = classes.substr(0, classes.length - 1);
              }
              if (start) {
                path = " " + classes + path;
              } else {
                path = " " + $(el).prop("tagName") + classes + path;
              }
            }
          }
          if (!$(el).parent().is("#lfb_form")) {
            path = lfb_tld_getPath($(el).parent(), modeClasses, false) + path;
          }
        } else {
          path += "#" + $(el).attr("id");
        }
      }
    }
    return path;
  }

  function lfb_tld_isHovered($element) {
    return $(lfb_tld_getPath($element, false, true) + ":hover").length > 0;
  }

  function lfb_tld_updateDomTree() {
    var index = 0;
    var domContent = lfb_tld_analyzeElement(
      $("#lfb_tld_tdgnFrame").contents().find("#lfb_form"),
      0
    );
    $("#lfb_tld_tdgnInspectorBody").html("<ul>" + domContent + "</ul>");
    lfb_tld_treed("undefined", $("#lfb_tld_tdgnInspectorBody>ul").get(0));
  }

  function lfb_tld_analyzeElement(element, index) {
    index++;
    var classesString = "";
    var idString = "";
    var tmpID = element.attr("id");
    if (element.attr("id") && element.attr("id").length > 0) {
      idString = "#" + element.attr("id");
    } else {
      element.uniqueId();
      tmpID = element.attr("id");
    }
    element.attr("tldtreeinit", true);
    var rep = '<li data-index="' + index + '"  data-elementid="' + tmpID + '">';
    var elementName = lfb_tld_getElementName(element, false);
    var htmlContent = $(element).text();
    if ($(element).children().length == 0) {
      if (htmlContent.length > 200) {
        htmlContent = htmlContent.substr(0, 200) + "...";
      }
    } else {
      htmlContent = "";
    }
    var html = '<span class="lfb_tld_htmlContent">' + htmlContent + "</span>";

    rep +=
      '<a href="javascript:" data-targetid="' +
      element.attr("id") +
      '" style="padding-left:' +
      (index * 6 + 20) +
      'px;">' +
      elementName +
      "  " +
      html +
      "</a>";
    if (element.children(":not(script)").length > 0) {
      rep += "<ul>";
      element.children(":not(script)").each(function () {
        rep += lfb_tld_analyzeElement($(this), index);
      });
      rep += "</ul>";
    }
    rep += "</li>";
    return rep;
  }

  function lfb_tld_getElementName(element, shortMode) {
    var elementName = "";
    var classesString = "";
    var idString = "";
    if (
      element.attr("id") &&
      element.attr("id").length > 0 &&
      element.attr("id").indexOf("ui-id-") != 0 &&
      element.attr("id").indexOf("dp") != 0 &&
      element.attr("id").indexOf("ultimate-") != 0
    ) {
      idString = "#" + element.attr("id");
    }
    idString = '<span class="lfb_tld_inspectorId">' + idString + "</span>";
    if (element.attr("class") && element.attr("class").length > 0) {
      jQuery.each(element.attr("class").split(" "), function () {
        if (this.indexOf("lfb_tld_") != 0) {
          classesString += "." + this;
        }
      });
    }
    var maxChar = 50;
    if (shortMode) {
      maxChar = 25;
    }
    if (classesString.length > maxChar) {
      classesString = classesString.substr(0, maxChar) + "...";
    }
    classesString =
      '<span class="lfb_tld_inspectorClass">' + classesString + "</span>";
    if (element.prop("tagName") && element.prop("tagName") !== null) {
      elementName =
        element.prop("tagName").toLowerCase() + idString + classesString;
    } else {
      elementName = idString + classesString;
    }
    return elementName;
  }

  function lfb_tld_selectElement(element) {
    if (!$(lfb_tld_selectedElement).is($(element))) {
      $("#lfb_tld_stateSelect").val("default");
    }
    var elementName = lfb_tld_getElementName(element, true);
    $("#lfb_tld_tdgnFrame")
      .contents()
      .find(".lfb_tld_selectedElement")
      .removeClass("lfb_tld_selectedElement");
    element.addClass("lfb_tld_selectedElement");
    $("#lfb_tld_tdgnFrame")[0]
      .contentWindow.jQuery("#lfb_form")
      .trigger("lfb_tld_updateSelector");

    $("#lfb_tld_tdgn_applyScope").val("all");
    $("#lfb_tld_tdgn_selectedElement").html(elementName);

    $(
      "#lfb_tld_tdgnPanelBody > :not(#lfb_tld_tdgn_selectElementBtn)"
    ).slideDown();
    var classes = $(element).attr("class");
    if (typeof classes == "string") {
      classes = classes.replace("lfb_tld_edited", "");
      classes = classes.replace("lfb_tld_selectedElement", "");
      classes = classes.replace("lfb_tld_hasShadow", "");
    }

    if (classes.length > 2 && classes.substr(classes.length - 2, 2) == "  ") {
      classes = classes.substr(0, classes.length - 2);
    }
    $("#lfb_tld_tdgn_applyToClasses").val(classes);
    $("#lfb_tld_tdgnInspectorBody .lfb_tld_tree a.lfb_tld_active").removeClass(
      "lfb_tld_active"
    );
    $(
      '#lfb_tld_tdgnInspectorBody .lfb_tld_tree a[data-targetid="' +
        $(element).attr("id") +
        '"]'
    ).addClass("lfb_tld_active");
    lfb_tld_expandTree($(element).attr("id"));
    if ($("#lfb_tld_tdgnInspector").is(".lfb_tld_collapsed")) {
    }
    $("#lfb_tld_tdgnFrame")
      .contents()
      .find('#lfb_form.lfb_bootstraped[data-form="' + lfb_currentFormID + '"]')
      .animate(
        {
          scrollTop: $(element).offset().top - 80,
        },
        500
      );
    setTimeout(function () {
      $("#lfb_tld_tdgnInspectorBody").animate(
        {
          scrollTop:
            $("#lfb_tld_tdgnInspectorBody").scrollTop() +
            $(
              '#lfb_tld_tdgnInspectorBody .lfb_tld_tree a[data-targetid="' +
                $(element).attr("id") +
                '"]'
            ).offset().top -
            $("#lfb_tld_tdgnInspectorBody").offset().top -
            20,
        },
        200
      );
    }, 200);
    lfb_tld_selectedElement = element;

    if (
      $(lfb_tld_selectedElement).is("#lfb_form") ||
      $(lfb_tld_selectedElement).closest("#lfb_summary").length > 0 ||
      $(lfb_tld_selectedElement).is("#lfb_summary")
    ) {
      $("#tdgn-style-margins").closest(".panel.panel-default").slideUp();
      $("#tdgn-style-position").closest(".panel.panel-default").slideUp();
      $("#tdgn-style-size").closest(".panel.panel-default").slideUp();
      $("#tdgn-style-visibility").closest(".panel.panel-default").slideUp();
    } else {
      $("#tdgn-style-margins").closest(".panel.panel-default").slideDown();
      $("#tdgn-style-position").closest(".panel.panel-default").slideDown();
      $("#tdgn-style-size").closest(".panel.panel-default").slideDown();
      $("#tdgn-styapplyMle-visibility")
        .closest(".panel.panel-default")
        .slideDown();
    }
  }

  function lfb_tld_unselectElement() {
    lfb_tld_selectedElement = null;
    $("#lfb_tld_stateSelect").val("default");
    $(
      "#lfb_tld_tdgnPanelBody > :not(#lfb_tld_tdgn_selectElementBtn)"
    ).slideUp();
    if (!lfb_tld_firstLoad) {
      $("#lfb_tld_tdgnFrame")[0]
        .contentWindow.jQuery("#lfb_form")
        .trigger("lfb_tld_unSelectElement");
    }
  }

  function lfb_tld_confirmStylesElement() {}

  function lfb_tld_updateFrameSize() {
    if (
      $("#lfb_tld_tdgnFrame").is(".lfb_tld_viewTablet") ||
      $("#lfb_tld_tdgnFrame").is(".lfb_tld_viewMobile")
    ) {
      var frameWidth = 780;
      if ($("#lfb_tld_tdgnFrame").is(".lfb_tld_viewMobile")) {
        $("#lfb_tld_tdgnFrame").css({
          width: 380,
        });
        frameWidth = 380;
      } else if ($("#lfb_tld_tdgnFrame").is(".lfb_tld_viewTablet")) {
        $("#lfb_tld_tdgnFrame").css({
          width: 780,
        });
      }
      if ($("#lfb_tld_tdgnPanelToggleBtn > span.fas").is(".fa-chevron-left")) {
        $("#lfb_tld_tdgnFrame").css({
          left: $(window).width() / 2 - (frameWidth / 2 - 280 / 2),
        });
      } else {
        $("#lfb_tld_tdgnFrame").css({
          left: $(window).width() / 2 - frameWidth / 2,
        });
      }
    } else {
      if ($("#lfb_tld_tdgnPanelToggleBtn > span.fas").is(".fa-chevron-left")) {
        $("#lfb_tld_tdgnFrame").css({
          width: "100%",
          left: 0,
        });
      } else {
        $("#lfb_tld_tdgnFrame").css({
          width: "100%",
          left: 0,
        });
      }
    }
  }

  function lfb_tld_changeDeviceMode(mode) {
    var hasChanged = false;
    if (mode != lfb_tld_deviceMode) {
      hasChanged = true;
    }
    var devicesUsed = new Array();
    lfb_tld_deviceMode = mode;
    $("#lfb_tld_tdgnFrame").removeClass("lfb_tld_viewTablet");
    $("#lfb_tld_tdgnFrame").removeClass("lfb_tld_viewMobile");
    if (mode == "tabletPhone" || mode == "tablet") {
      $("#lfb_tld_tdgnFrame").addClass("lfb_tld_viewTablet");
    } else if (mode == "phone") {
      $("#lfb_tld_tdgnFrame").addClass("lfb_tld_viewMobile");
    }
    setTimeout(function () {
      lfb_tld_updateFrameSize();
    }, 200);
    $('a[data-devicebtn="all"]').removeClass("lfb_tld_active");
    $('a[data-devicebtn="desktop"]').removeClass("lfb_tld_active");
    $('a[data-devicebtn="desktopTablet"]').removeClass("lfb_tld_active");
    $('a[data-devicebtn="tabletPhone"]').removeClass("lfb_tld_active");
    $('a[data-devicebtn="tablet"]').removeClass("lfb_tld_active");
    $('a[data-devicebtn="phone"]').removeClass("lfb_tld_active");

    if (mode == "all") {
      $('a[data-devicebtn="all"]').addClass("lfb_tld_active");
      devicesUsed.push("all");
    } else if (mode == "desktop") {
      $('a[data-devicebtn="desktop"]').addClass("lfb_tld_active");
      devicesUsed.push("all");
      devicesUsed.push("desktop");
    } else if (mode == "desktopTablet") {
      $('a[data-devicebtn="desktopTablet"]').addClass("lfb_tld_active");
      devicesUsed.push("all");
      devicesUsed.push("tablet");
      devicesUsed.push("desktop");
    } else if (mode == "tabletPhone") {
      $('a[data-devicebtn="tabletPhone"]').addClass("lfb_tld_active");
      devicesUsed.push("all");
      devicesUsed.push("phone");
      devicesUsed.push("tablet");
    } else if (mode == "tablet") {
      $('a[data-devicebtn="tablet"]').addClass("lfb_tld_active");
      devicesUsed.push("all");
      devicesUsed.push("tablet");
    } else if (mode == "phone") {
      $('a[data-devicebtn="phone"]').addClass("lfb_tld_active");
      devicesUsed.push("all");
      devicesUsed.push("phone");
    }

    $("#lfb_tld_tdgnFrame")
      .contents()
      .find("body")
      .find("*.lfb_tld_edited")
      .each(function () {
        if ($(this).is("[data-originalstyle]")) {
          $(this).attr("style", $(this).attr("data-originalstyle"));
        } else {
          $(this).attr("style", "");
        }
      });
    jQuery.each(devicesUsed, function () {
      var dataDevice = lfb_tld_getElementsDataByDevice(this);
      if (dataDevice) {
        jQuery.each(dataDevice.elements, function () {
          if (
            !$(this.element).is(
              $("#lfb_tld_tdgnFrame").contents().find(this.domSelector)
            )
          ) {
            this.element = $("#lfb_tld_tdgnFrame")
              .contents()
              .find(this.domSelector);
          }
          if (
            $("#lfb_tld_tdgnFrame")
              .contents()
              .find(this.domSelector)
              .is("[data-originalstyle]")
          ) {
            $("#lfb_tld_tdgnFrame")
              .contents()
              .find(this.domSelector)
              .attr(
                "style",
                $("#lfb_tld_tdgnFrame")
                  .contents()
                  .find(this.domSelector)
                  .attr("style") +
                  ";" +
                  $("#lfb_tld_tdgnFrame")
                    .contents()
                    .find(this.domSelector)
                    .attr("data-originalstyle")
              );
          }
          if ($("#lfb_tld_stateSelect").val() == "hover") {
            $("#lfb_tld_tdgnFrame")
              .contents()
              .find("#lfb_form " + this.domSelector)
              .attr("style", this.hoverStyle);
          } else if ($("#lfb_tld_stateSelect").val() == "focus") {
            $("#lfb_tld_tdgnFrame")
              .contents()
              .find("#lfb_form " + this.domSelector)
              .attr("style", this.focusStyle);
          } else {
            $("#lfb_tld_tdgnFrame")
              .contents()
              .find("#lfb_form " + this.domSelector)
              .attr("style", this.style);
          }
        });
      }
    });
    if (
      lfb_tld_selectedElement != null &&
      $(lfb_tld_selectedElement).length > 0
    ) {
      setTimeout(function () {
        if (
          lfb_tld_selectedElement != null &&
          $(lfb_tld_selectedElement).length > 0
        ) {
          if (
            !$("#lfb_tld_tdgnFrame")[0]
              .contentWindow.jQuery("#lfb_form")
              .is(".lfb_tldSelection")
          ) {
            lfb_tld_selectElement($(lfb_tld_selectedElement));
            lfb_tld_elementInitialized = false;
            lfb_tld_getElementStyles(lfb_tld_selectedElement);
            setTimeout(function () {
              lfb_tld_elementInitialized = true;
            }, 250);
          }
        }
      }, 500);
    }
  }

  function lfb_tld_prepareSelectElement() {
    if (
      $("#lfb_tld_tdgnFrame")
        .contents()
        .find("#lfb_form")
        .find('*:not([data-tldtreeinit="true"])').length > 0
    ) {
      lfb_tld_updateDomTree();
    }

    if (!$("#lfb_tld_tdgnInspector").is(".lfb_tld_collapsed")) {
      lfb_tld_tdgn_toggleInspector();
    }
    if (!$("#lfb_tld_tdgnPanel").is(".lfb_tld_collapsed")) {
      lfb_tld_tdgn_toggleTdgnPanel();
    }
    var link = $(
      '<a href="javascript:" class="btn btn-outline btn-outline-light lfb_stopSelectionBtn"></a>'
    );
    link.append('<span class="fas fa-stop"></span>');
    link.append(lfb_data.texts["stopSelection"]);
    var noticeContent = $("<div></div>");
    noticeContent.append('<p class="text-center"></p>');
    noticeContent.find("p").append(link);

    lfb_notification(noticeContent.html(), " ", false);
    $(".toast a.lfb_stopSelectionBtn").on(
      "click",
      lfb_tld_stopSelectionElement
    );
    $("#lfb_tld_tdgnFrame")[0]
      .contentWindow.jQuery("#lfb_form")
      .addClass("lfb_tldSelection");
  }

  function lfb_tld_stopSelectionElement() {
    lfb_tld_closeNotification();
    $(".toast").toast("hide");
    setTimeout(function () {
      $(".toast").remove();
    }, 300);
    $("#lfb_tld_tdgnFrame")[0]
      .contentWindow.jQuery("#lfb_form")
      .removeClass("lfb_tldSelection");
    if ($("#lfb_tld_tdgnPanel").is(".lfb_tld_collapsed")) {
      lfb_tld_tdgn_toggleTdgnPanel();
    }
  }

  function lfb_notification(
    text,
    iconCls,
    autoClose = true,
    colorClass = "bg-primary text-white"
  ) {
    var toast = $(
      '<div class="toast text-white fade show position-fixed  fixed lfb_height0 bottom-0 end-0 ' +
        colorClass +
        '"></div>'
    );
    var icon = '<i class="fas fa-info-circle me-2"></i>';
    if (iconCls) {
      icon = '<i class="' + iconCls + ' me-2"></i>';
    }
    toast.append(
      '<div class="toast-body text-center">' + icon + text + "</div>"
    );
    $("#lfb_bootstraped").append(toast);
    toast.toast({
      autohide: autoClose,
    });
    toast.toast("show");
    setTimeout(function () {
      toast.removeClass("lfb_height0");
    }, 500);
  }

  function lfb_tld_closeNotification() {
    if (
      $(
        "#lfb_bootstraped.lfb_bootstraped #lfb_tld_tdgnContainer >.lfb_notification"
      ).length > 0
    ) {
      var notification = $(
        "#lfb_bootstraped.lfb_bootstraped  #lfb_tld_tdgnContainer>.lfb_notification"
      ).slideUp();
      setTimeout(function () {
        notification.remove();
      }, 500);
    }
  }

  function lfb_tld_itemSelected(ev, element) {
    if (!$(element).is("lfb_tld_edited")) {
      $(element).attr("data-originalstyle", $(element).attr("style"));
      $(element).addClass("lfb_tld_edited");
    }
    lfb_tld_selectElement($(element));
    lfb_tld_stopSelectionElement();

    lfb_tld_elementInitialized = false;
    lfb_tld_getElementStyles(element);
    $(
      '.lfb_tld_tdgn_section:not([data-title="Selection"]):not(.lfb_tld_closed) .lfb_tld_tdgn_toggleSection'
    ).each(function () {
      lfb_tld_tdgn_toggleSection(this, false);
    });
    if (
      $(
        '.lfb_tld_tdgn_section[data-title="Selection"].lfb_tld_closed .lfb_tld_tdgn_toggleSection'
      ).length > 0
    ) {
      lfb_tld_tdgn_toggleSection(
        $(
          '.lfb_tld_tdgn_section[data-title="Selection"].lfb_tld_closed .lfb_tld_tdgn_toggleSection'
        ).get(0),
        false
      );
    }
    setTimeout(function () {
      lfb_tld_elementInitialized = true;
    }, 250);
  }

  function lfb_tld_initStyleComponent(style) {
    if (style == "background") {
    }
  }

  function lfb_tld_hex2Rgba(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      return (
        "rgba(" +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
        "," +
        alpha +
        ")"
      );
    }
  }

  function lfb_tld_rgb2hex(rgb) {
    rgb = rgb.match(
      /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
    );
    return rgb && rgb.length === 4
      ? "#" +
          ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
      : "";
  }

  function lfb_tld_getElementStyles(element) {
    var $element = $(element);

    var alpha = 1;

    $("#lfb_tld_tdgn_applyModifsTo").val("onlyThis");
    $("#lfb_tld_styleBackgroundType_color").val("#2c3e50");
    $("#lfb_tld_style_fontColor").val("#2c3e50");
    if ($element.css("background-image").indexOf("url(") != -1) {
      $("#lfb_tld_styleBackgroundType").val("image");
      $("#lfb_tld_styleBackgroundType_imageUrl").val(
        $element.css("background-image").replace("url(", "").replace(")", "")
      );
    } else if (
      $element.css("background-color") != "" &&
      $element.css("background-color") != "rgba(0, 0, 0, 0)"
    ) {
      $("#lfb_tld_styleBackgroundType_imageUrl").val("");
      var color = lfb_tld_rgb2hex($element.css("background-color"));
      if ($element.css("background-color").indexOf("rgba") == 0) {
        alpha = $element
          .css("background-color")
          .substr(
            $element.css("background-color").lastIndexOf(",") + 1,
            $element.css("background-color").lastIndexOf(")") -
              ($element.css("background-color").lastIndexOf(",") + 1)
          );
      }
      if (color == "#") {
        color = "#2c3e50";
      }
      $("#lfb_tld_styleBackgroundType_color").val(color);
      $("#lfb_tld_styleBackgroundType_color").trigger("change");
      $("#lfb_tld_styleBackgroundType").val("color");
    } else {
      $("#lfb_tld_styleBackgroundType").val("");
    }
    $("#lfb_tld_styleBackgroundType_colorAlpha").slider("value", alpha);
    $("#lfb_tld_styleBackgroundType_imageSize").val(
      $element.css("background-size")
    );
    $("#lfb_tld_style_clear").val($element.css("clear"));
    $("#lfb_tld_style_float").val($element.css("float"));

    var borderSize = 0;
    if (!isNaN(parseInt($element.css("border-width")))) {
      borderSize = parseInt($element.css("border-width"));
    }
    $("#lfb_tld_style_borderSize").slider("value", borderSize);
    $("#lfb_tld_style_width").slider("value", 0);
    $("#lfb_tld_style_widthFlex").slider("value", 0);
    $("#lfb_tld_style_height").slider("value", 0);
    $("#lfb_tld_style_heightFlex").slider("value", 0);

    $("#lfb_tld_style_left").slider("value", 0);
    $("#lfb_tld_style_leftFlex").slider("value", 0);
    $("#lfb_tld_style_right").slider("value", 0);
    $("#lfb_tld_style_rightFlex").slider("value", 0);
    $("#lfb_tld_style_top").slider("value", 0);
    $("#lfb_tld_style_topFlex").slider("value", 0);
    $("#lfb_tld_style_bottom").slider("value", 0);
    $("#lfb_tld_style_bottomFlex").slider("value", 0);
    $("#lfb_tld_style_marginLeft").slider("value", 0);
    $("#lfb_tld_style_marginLeftFlex").slider("value", 0);
    $("#lfb_tld_style_marginRight").slider("value", 0);
    $("#lfb_tld_style_marginRightFlex").slider("value", 0);
    $("#lfb_tld_style_marginTop").slider("value", 0);
    $("#lfb_tld_style_marginTopFlex").slider("value", 0);
    $("#lfb_tld_style_marginBottom").slider("value", 0);
    $("#lfb_tld_style_marginBottomFlex").slider("value", 0);
    $("#lfb_tld_style_borderRadiusTopLeft").slider("value", 0);
    $("#lfb_tld_style_borderRadiusTopRight").slider("value", 0);
    $("#lfb_tld_style_borderRadiusBottomLeft").slider("value", 0);
    $("#lfb_tld_style_borderRadiusBottomLeft").slider("value", 0);

    if ($element.css("width").indexOf("%") > 0) {
      $("#lfb_tld_style_widthType").val("flexible");
      $("#lfb_tld_style_widthFlex").slider(
        "value",
        parseInt($element.css("width"))
      );
    } else if ($element.width() != $element.parent().width()) {
      $("#lfb_tld_style_widthType").val("fixed");
      $("#lfb_tld_style_width").slider("value", $element.width());
    } else {
      $("#lfb_tld_style_widthType").val("auto");
    }
    if ($element.css("height").indexOf("%") > 0) {
      $("#lfb_tld_style_heightType").val("flexible");
      $("#lfb_tld_style_heightFlex").slider(
        "value",
        parseInt($element.css("height"))
      );
    } else if ($element.height() != $element.parent().height()) {
      $("#lfb_tld_style_heightType").val("fixed");
      $("#lfb_tld_style_height").slider("value", $element.height());
    } else {
      $("#lfb_tld_style_heightType").val("auto");
    }
    $("#lfb_tld_style_borderStyle").val($element.css("border-style"));
    $("#lfb_tld_style_borderColor").val($element.css("border-color"));
    var display = $element.css("display");
    if (
      $('#lfb_tld_style_display > option[value="' + display + '"]').length == 0
    ) {
      display = "inherit";
    }
    $("#lfb_tld_style_display").val(display);
    $("#lfb_tld_style_position").val($element.css("position"));
    if ($element.css("left") != "auto") {
      $("#lfb_tld_style_positionLeft").val("fixed");
    } else {
      $("#lfb_tld_style_positionLeft").val("auto");
    }
    if ($element.css("right") != "auto") {
      $("#lfb_tld_style_positionRight").val("fixed");
    } else {
      $("#lfb_tld_style_positionRight").val("auto");
    }
    if ($element.css("top") != "auto") {
      $("#lfb_tld_style_positionTop").val("fixed");
    } else {
      $("#lfb_tld_style_positionTop").val("auto");
    }
    if ($element.css("bottom") != "auto") {
      $("#lfb_tld_style_positionBottom").val("fixed");
    } else {
      $("#lfb_tld_style_positionBottom").val("auto");
    }
    var value = parseInt($element.css("left"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("left").indexOf("%") > 0) {
      $("#lfb_tld_style_leftFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_left").slider("value", value);
    }

    value = parseInt($element.css("right"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("right").indexOf("%") > 0) {
      $("#lfb_tld_style_rightFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_right").slider("value", value);
    }

    value = parseInt($element.css("top"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("top").indexOf("%") > 0) {
      $("#lfb_tld_style_topFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_top").slider("value", value);
    }
    value = parseInt($element.css("bottom"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("bottom").indexOf("%") > 0) {
      $("#lfb_tld_style_bottomFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_bottom").slider("value", value);
    }

    if ($element.css("margin-left").indexOf("px") > 0) {
      $("#lfb_tld_style_marginTypeLeft").val("fixed");
    } else if ($element.css("margin-left").indexOf("%") > 0) {
      $("#lfb_tld_style_marginTypeLeft").val("flexible");
    } else {
      $("#lfb_tld_style_marginTypeLeft").val("auto");
    }
    if ($element.css("margin-right").indexOf("px") > 0) {
      $("#lfb_tld_style_marginTypeRight").val("fixed");
    } else if ($element.css("margin-right").indexOf("%") > 0) {
      $("#lfb_tld_style_marginTypeRight").val("flexible");
    } else {
      $("#lfb_tld_style_marginTypeRight").val("auto");
    }
    if ($element.css("margin-top").indexOf("px") > 0) {
      $("#lfb_tld_style_marginTypeTop").val("fixed");
    } else if ($element.css("margin-top").indexOf("%") > 0) {
      $("#lfb_tld_style_marginTypeTop").val("flexible");
    } else {
      $("#lfb_tld_style_marginTypeTop").val("auto");
    }
    if ($element.css("margin-bottom").indexOf("px") > 0) {
      $("#lfb_tld_style_marginTypeBottom").val("fixed");
    } else if ($element.css("margin-bottom").indexOf("%") > 0) {
      $("#lfb_tld_style_marginTypeBottom").val("flexible");
    } else {
      $("#lfb_tld_style_marginTypeBottom").val("auto");
    }

    if ($element.css("padding-left").indexOf("px") > 0) {
      $("#lfb_tld_style_paddingTypeLeft").val("fixed");
    } else if ($element.css("padding-left").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingTypeLeft").val("flexible");
    } else {
      $("#lfb_tld_style_paddingTypeLeft").val("auto");
    }
    if ($element.css("padding-right").indexOf("px") > 0) {
      $("#lfb_tld_style_paddingTypeRight").val("fixed");
    } else if ($element.css("padding-right").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingTypeRight").val("flexible");
    } else {
      $("#lfb_tld_style_paddingTypeRight").val("auto");
    }
    if ($element.css("padding-top").indexOf("px") > 0) {
      $("#lfb_tld_style_paddingTypeTop").val("fixed");
    } else if ($element.css("padding-top").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingTypeTop").val("flexible");
    } else {
      $("#lfb_tld_style_paddingTypeTop").val("auto");
    }
    if ($element.css("padding-bottom").indexOf("px") > 0) {
      $("#lfb_tld_style_paddingTypeBottom").val("fixed");
    } else if ($element.css("padding-bottom").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingTypeBottom").val("flexible");
    } else {
      $("#lfb_tld_style_paddingTypeBottom").val("auto");
    }

    value = parseInt($element.css("padding-left"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("padding-left").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingLeftFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_paddingLeft").slider("value", value);
    }
    value = parseInt($element.css("padding-right"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("padding-right").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingRightFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_paddingRight").slider("value", value);
    }
    value = parseInt($element.css("padding-top"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("padding-top").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingTopFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_paddingTop").slider("value", value);
    }
    value = parseInt($element.css("padding-bottom"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("padding-bottom").indexOf("%") > 0) {
      $("#lfb_tld_style_paddingBottomFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_paddingBottom").slider("value", value);
    }

    value = parseInt($element.css("margin-left"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("margin-left").indexOf("%") > 0) {
      $("#lfb_tld_style_marginLeftFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_marginLeft").slider("value", value);
    }

    value = parseInt($element.css("margin-right"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("margin-right").indexOf("%") > 0) {
      $("#lfb_tld_style_marginRightFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_marginRight").slider("value", value);
    }

    value = parseInt($element.css("margin-top"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("margin-top").indexOf("%") > 0) {
      $("#lfb_tld_style_marginTopFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_marginTop").slider("value", value);
    }

    value = parseInt($element.css("margin-bottom"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("margin-bottom").indexOf("%") > 0) {
      $("#lfb_tld_style_marginBottomFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_marginBottom").slider("value", value);
    }
    $("#lfb_tld_style_fontFamily").val(
      $element.css("font-family").replace('"', "").replace('"', "")
    );
    $("#lfb_tld_style_fontColor").val($element.css("color"));
    $("#lfb_tld_style_fontSize").slider(
      "value",
      parseInt($element.css("font-size"))
    );

    value = parseInt($element.css("line-height"));
    if (isNaN(value)) {
      value = 0;
    }
    if ($element.css("line-height").indexOf("%") > 0) {
      $("#lfb_tld_style_lineHeightType").val("flexible");
      $("#lfb_tld_style_lineHeightFlex").slider("value", value + "%");
    } else {
      $("#lfb_tld_style_lineHeightType").val("fixed");
      $("#lfb_tld_style_lineHeight").slider("value", value);
    }
    $("#lfb_tld_style_lineHeight").slider(
      "value",
      parseInt($element.css("line-height"))
    );

    $("#lfb_tld_style_fontStyle option[value='italic']").prop(
      "selected",
      false
    );
    $("#lfb_tld_style_fontStyle option[value='bold']").prop("selected", false);
    $("#lfb_tld_style_fontStyle option[value='underline']").prop(
      "selected",
      false
    );
    var style = "none";
    if ($element.css("font-style") == "italic") {
      $("#lfb_tld_style_fontStyle option[value='italic']").prop(
        "selected",
        true
      );
    }
    if ($element.css("font-weight") == "bold") {
      $("#lfb_tld_style_fontStyle option[value='bold']").prop("selected", true);
    }
    if ($element.css("text-decoration") == "underline") {
      $("#lfb_tld_style_fontStyle option[value='underline']").prop(
        "selected",
        true
      );
    }
    var shadow = "outside";
    var shadowX = 0;
    var shadowY = 0;
    var shadowSize = 0;
    var shadowAlpha = 1;
    var shadowColor = "rgb(255,255,255)";
    var posIndex = 0;

    var shadowStyle = $element.css("box-shadow");
    if (
      $element.css("box-shadow") == "none" ||
      !$element.is(".lfb_tld_hasShadow")
    ) {
      shadow = "none";
    } else {
      if ($element.css("box-shadow").indexOf("inset") > 0) {
        shadow = "inside";
      }
      shadowColor = shadowStyle.substr(0, shadowStyle.indexOf(")") + 1);
      if (shadowColor.indexOf("rgba") == 0) {
        shadowAlpha = shadowColor.substr(
          shadowColor.lastIndexOf(",") + 1,
          shadowColor.lastIndexOf(")") - (shadowColor.lastIndexOf(",") + 1)
        );
      }
      shadowX = shadowStyle.substr(
        shadowStyle.indexOf(")") + 1,
        shadowStyle.indexOf("px") - shadowStyle.indexOf(")") - 1
      );
      posIndex = shadowStyle.indexOf("px") + 2;
      shadowY = shadowStyle.substr(
        posIndex,
        shadowStyle.indexOf("px", posIndex) - posIndex
      );
      posIndex = shadowStyle.indexOf("px", posIndex) + 2;
      shadowSize = shadowStyle.substr(
        posIndex,
        shadowStyle.indexOf("px", posIndex) - posIndex
      );
    }

    $("#lfb_tld_style_shadowType").val(shadow);
    $("#lfb_tld_style_shadowColor").val(shadowColor);
    $("#lfb_tld_style_shadowAlpha").slider("value", shadowAlpha);

    shadowColor = "rgb(0,0,0)";
    shadowStyle = $element.css("text-shadow");
    if (shadowStyle == "none") {
      $("#lfb_tld_style_textShadowColor").val("rgba(0,0,0,0)");
    } else {
      shadowColor = shadowStyle.substr(0, shadowStyle.indexOf(")") + 1);
      shadowX = shadowStyle.substr(
        shadowStyle.indexOf(")") + 1,
        shadowStyle.indexOf("px") - shadowStyle.indexOf(")") - 1
      );
      posIndex = shadowStyle.indexOf("px") + 2;
      shadowY = shadowStyle.substr(
        posIndex,
        shadowStyle.indexOf("px", posIndex) - posIndex
      );
    }
    shadowAlpha = 0;
    if (shadowColor.indexOf("rgba") == 0) {
      shadowAlpha = shadowColor.substr(
        shadowColor.lastIndexOf(",") + 1,
        shadowColor.lastIndexOf(")") - (shadowColor.lastIndexOf(",") + 1)
      );
    }
    $("#lfb_tld_style_textShadowAlpha").slider("value", shadowAlpha);
    $("#lfb_tld_style_textShadowColor").val(shadowColor);

    $("#lfb_tld_style_scrollX").val($element.css("overflow-x"));
    $("#lfb_tld_style_scrollY").val($element.css("overflow-y"));
    $("#lfb_tld_style_visibility").val($element.css("visibility"));
    if (
      $element.css("text-align") == "left" ||
      $element.css("text-align") == "right" ||
      $element.css("text-align") == "justify"
    ) {
      $("#lfb_tld_style_textAlign").val($element.css("text-align"));
    } else {
      $("#lfb_tld_style_textAlign").val("auto");
    }

    $("#lfb_tld_style_opacity").slider("value", $element.css("opacity"));
    $("#lfb_tld_style_shadowX").slider("value", shadowX);
    $("#lfb_tld_style_shadowY").slider("value", shadowY);
    $("#lfb_tld_style_shadowSize").slider("value", shadowSize);

    $("#lfb_tld_style_textShadowX").slider("value", shadowX);
    $("#lfb_tld_style_textShadowY").slider("value", shadowY);

    $("#lfb_tld_style_borderRadiusTopLeft").slider(
      "value",
      parseInt($element.css("border-top-left-radius"))
    );
    $("#lfb_tld_style_borderRadiusTopRight").slider(
      "value",
      parseInt($element.css("border-top-right-radius"))
    );
    $("#lfb_tld_style_borderRadiusBottomLeft").slider(
      "value",
      parseInt($element.css("border-bottom-left-radius"))
    );
    $("#lfb_tld_style_borderRadiusBottomRight").slider(
      "value",
      parseInt($element.css("border-bottom-right-radius"))
    );

    lfb_tld_style_widthTypeChange();
    lfb_tld_style_heightTypeChange();
    $("#lfb_tld_tdgnContainer .lfb_tld_slider").trigger("change");
    $("#lfb_tld_tdgnContainer")
      .find("input:not(.lfb_tld_sliderField),select")
      .trigger("change");
    $("#lfb_tld_tdgnContainer").find("select.lfb_tld_selectpicker");
  }

  function lfb_tld_tdgn_applyScopeChange() {
    if ($("#lfb_tld_tdgn_applyScope").val() == "container") {
      $("#lfb_tld_tdgn_scopeContainerClass").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_tdgn_scopeContainerClass").closest(".form-group").slideUp();
    }
  }

  function lfb_tld_styleBackgroundTypeChange() {
    var elementsToClose = new Array();
    var selectedElement = "";
    if ($("#lfb_tld_styleBackgroundType").val() == "color") {
      $("#lfb_tld_styleBackgroundType_imageUrl").val("");
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          backgroundImage: "none",
        });
      }
      $("#lfb_tld_styleBackgroundType_imageToggle").slideUp();
      $("#lfb_tld_styleBackgroundType_colorToggle").slideDown();
    } else if ($("#lfb_tld_styleBackgroundType").val() == "image") {
      $("#lfb_tld_styleBackgroundType_colorToggle").slideUp();
      $("#lfb_tld_styleBackgroundType_imageToggle").slideDown();
      lfb_tld_selectedElement.css({
        backgroundColor: "transparent",
      });
    } else {
      $("#lfb_tld_styleBackgroundType_imageToggle").slideUp();
      $("#lfb_tld_styleBackgroundType_colorToggle").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          backgroundImage: "none",
          backgroundColor: "transparent",
        });
      }
    }
  }

  function lfb_tld_styleBackgroundType_colorChange() {
    if ($("#lfb_tld_styleBackgroundType").val() == "color") {
      var newColor = $("#lfb_tld_styleBackgroundType_color").val();
      if ($("#lfb_tld_styleBackgroundType_color").val().indexOf("rgb") > -1) {
        newColor = lfb_tld_rgb2hex(
          $("#lfb_tld_styleBackgroundType_color").val()
        );
      }
      if (newColor == "") {
        newColor = "transparent";
      } else {
        newColor = lfb_tld_hex2Rgba(
          newColor,
          $("#lfb_tld_styleBackgroundType_colorAlpha").slider("value")
        );
      }
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          backgroundColor: newColor,
        });
      }
    }
  }

  function lfb_tld_styleBackgroundType_colorAlphaChange() {
    if ($("#lfb_tld_styleBackgroundType").val() == "color") {
      if ($("#lfb_tld_styleBackgroundType_color").val() != "") {
        var newColor = $("#lfb_tld_styleBackgroundType_color").val();
        if ($("#lfb_tld_styleBackgroundType_color").val().indexOf("rgb") > -1) {
          newColor = lfb_tld_rgb2hex(
            $("#lfb_tld_styleBackgroundType_color").val()
          );
        }
        newColor = lfb_tld_hex2Rgba(
          newColor,
          $("#lfb_tld_styleBackgroundType_colorAlpha").slider("value")
        );
        $("#lfb_tld_styleBackgroundType_color").val(newColor);
        $("#lfb_tld_styleBackgroundType_color").trigger("change");
      }
    }
  }

  function lfb_tld_styleBackgroundType_imageChange() {
    if ($("#lfb_tld_styleBackgroundType").val() == "image") {
      if ($("#lfb_tld_styleBackgroundType_imageUrl").val() != "none") {
        var image =
          "url(" + $("#lfb_tld_styleBackgroundType_imageUrl").val() + ")";
        var size = $("#lfb_tld_styleBackgroundType_imageSize").val();
        if ($("#lfb_tld_styleBackgroundType_imageUrl").val() == "") {
          image = "none";
        }
        if (lfb_tld_elementInitialized) {
          lfb_tld_selectedElement.css({
            backgroundImage: image,
            backgroundSize: size,
          });
        }
      }
    }
  }

  function lfb_tld_style_borderColorChange() {
    var color = $("#lfb_tld_style_borderColor").val();
    if (color == "") {
      color = "transparent";
    }
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        borderColor: color,
      });
    }
  }

  function lfb_tld_style_borderStyleChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        borderStyle: $("#lfb_tld_style_borderStyle").val(),
      });
    }
  }

  function lfb_tld_style_borderSizeChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        borderWidth: $("#lfb_tld_style_borderSize").slider("value"),
      });
    }
  }

  function lfb_tld_style_widthChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        width: $("#lfb_tld_style_width").slider("value"),
      });
    }
  }

  function lfb_tld_style_widthFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        width: $("#lfb_tld_style_widthFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_heightChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        height: $("#lfb_tld_style_height").slider("value"),
      });
    }
  }

  function lfb_tld_style_heightFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        height: $("#lfb_tld_style_heightFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_widthTypeChange() {
    var type = $("#lfb_tld_style_widthType").val();
    if (type == "fixed") {
      $("#lfb_tld_style_width").closest(".form-group").slideDown();
      $("#lfb_tld_style_widthFlex").closest(".form-group").slideUp();
    } else if (type == "flexible") {
      $("#lfb_tld_style_widthFlex").closest(".form-group").slideDown();
      $("#lfb_tld_style_width").closest(".form-group").slideUp();
    } else {
      $("#lfb_tld_style_width").closest(".form-group").slideUp();
      $("#lfb_tld_style_widthFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          width: "auto",
        });
      }
    }
  }

  function lfb_tld_style_heightTypeChange() {
    var type = $("#lfb_tld_style_heightType").val();
    if (type == "fixed") {
      $("#lfb_tld_style_height").closest(".form-group").slideDown();
      $("#lfb_tld_style_heightFlex").closest(".form-group").slideUp();
    } else if (type == "flexible") {
      $("#lfb_tld_style_heightFlex").closest(".form-group").slideDown();
      $("#lfb_tld_style_height").closest(".form-group").slideUp();
    } else {
      $("#lfb_tld_style_height").closest(".form-group").slideUp();
      $("#lfb_tld_style_heightFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          height: "auto",
        });
      }
    }
  }

  function lfb_tld_style_displayChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        display: $("#lfb_tld_style_display").val(),
      });
    }
  }

  function lfb_tld_style_positionChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        position: $("#lfb_tld_style_position").val(),
      });
    }
    if ($("#lfb_tld_style_position").val() == "static") {
      $("#lfb_tld_style_positionLeft").val("auto");
      $("#lfb_tld_style_positionLeft").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionLeft").closest(".form-group").slideUp();
      $("#lfb_tld_style_left").closest(".form-group").slideUp();
      $("#lfb_tld_style_leftFlex").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionRight").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionRight").val("auto");
      $("#lfb_tld_style_right").closest(".form-group").slideUp();
      $("#lfb_tld_style_rightFlex").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionTop").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionTop").val("auto");
      $("#lfb_tld_style_top").closest(".form-group").slideUp();
      $("#lfb_tld_style_topFlex").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionBottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_positionBottom").val("auto");
      $("#lfb_tld_style_bottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_bottomFlex").closest(".form-group").slideUp();
    } else {
      $("#lfb_tld_style_positionLeft").closest(".form-group").slideDown();
      $("#lfb_tld_style_positionRight").closest(".form-group").slideDown();
      $("#lfb_tld_style_positionTop").closest(".form-group").slideDown();
      $("#lfb_tld_style_positionBottom").closest(".form-group").slideDown();
    }
    $("#lfb_tld_style_positionBottom").trigger("change");
    $("#lfb_tld_style_positionTop").trigger("change");
    $("#lfb_tld_style_positionLeft").trigger("change");
    $("#lfb_tld_style_positionRight").trigger("change");
  }

  function lfb_tld_style_positionLeftChange() {
    if ($("#lfb_tld_style_positionLeft").val() == "fixed") {
      $("#lfb_tld_style_left").closest(".form-group").slideDown();
      $("#lfb_tld_style_leftFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_positionLeft").val() == "flexible") {
      $("#lfb_tld_style_left").closest(".form-group").slideUp();
      $("#lfb_tld_style_leftFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_left").closest(".form-group").slideUp();
      $("#lfb_tld_style_leftFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          left: "auto",
        });
      }
    }
  }

  function lfb_tld_style_positionRightChange() {
    if ($("#lfb_tld_style_positionRight").val() == "fixed") {
      $("#lfb_tld_style_right").closest(".form-group").slideDown();
      $("#lfb_tld_style_rightFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_positionRight").val() == "flexible") {
      $("#lfb_tld_style_right").closest(".form-group").slideUp();
      $("#lfb_tld_style_rightFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_right").closest(".form-group").slideUp();
      $("#lfb_tld_style_rightFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          right: "auto",
        });
      }
    }
  }

  function lfb_tld_style_floatChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        float: $("#lfb_tld_style_float").val(),
      });
    }
  }

  function lfb_tld_style_clearChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        clear: $("#lfb_tld_style_clear").val(),
      });
    }
  }

  function lfb_tld_style_marginTypeLeftChange() {
    if ($("#lfb_tld_style_marginTypeLeft").val() == "fixed") {
      $("#lfb_tld_style_marginLeft").closest(".form-group").slideDown();
      $("#lfb_tld_style_marginLeftFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_marginTypeLeft").val() == "flexible") {
      $("#lfb_tld_style_marginLeft").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginLeftFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_marginLeft").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginLeftFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          marginLeft: "auto",
        });
      }
    }
  }

  function lfb_tld_style_marginTypeRightChange() {
    if ($("#lfb_tld_style_marginTypeRight").val() == "fixed") {
      $("#lfb_tld_style_marginRight").closest(".form-group").slideDown();
      $("#lfb_tld_style_marginRightFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_marginTypeRight").val() == "flexible") {
      $("#lfb_tld_style_marginRight").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginRightFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_marginRight").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginRightFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          marginRight: "auto",
        });
      }
    }
  }

  function lfb_tld_style_marginTypeTopChange() {
    if ($("#lfb_tld_style_marginTypeTop").val() == "fixed") {
      $("#lfb_tld_style_marginTop").closest(".form-group").slideDown();
      $("#lfb_tld_style_marginTopFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_marginTypeTop").val() == "flexible") {
      $("#lfb_tld_style_marginTop").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginTopFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_marginTop").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginTopFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          marginTop: "auto",
        });
      }
    }
  }

  function lfb_tld_style_marginTypeBottomChange() {
    if ($("#lfb_tld_style_marginTypeBottom").val() == "fixed") {
      $("#lfb_tld_style_marginBottom").closest(".form-group").slideDown();
      $("#lfb_tld_style_marginBottomFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_marginTypeBottom").val() == "flexible") {
      $("#lfb_tld_style_marginBottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginBottomFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_marginBottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_marginBottomFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          marginBottom: "auto",
        });
      }
    }
  }

  function lfb_tld_style_paddingTypeBottomChange() {
    if ($("#lfb_tld_style_paddingTypeBottom").val() == "fixed") {
      $("#lfb_tld_style_paddingBottom").closest(".form-group").slideDown();
      $("#lfb_tld_style_paddingBottomFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_paddingTypeBottom").val() == "flexible") {
      $("#lfb_tld_style_paddingBottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingBottomFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_paddingBottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingBottomFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          paddingBottom: "auto",
        });
      }
    }
  }

  function lfb_tld_style_paddingTypeTopChange() {
    if ($("#lfb_tld_style_paddingTypeTop").val() == "fixed") {
      $("#lfb_tld_style_paddingTop").closest(".form-group").slideDown();
      $("#lfb_tld_style_paddingTopFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_paddingTypeTop").val() == "flexible") {
      $("#lfb_tld_style_paddingTop").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingTopFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_paddingTop").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingTopFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          paddingTop: "auto",
        });
      }
    }
  }

  function lfb_tld_style_paddingTypeLeftChange() {
    if ($("#lfb_tld_style_paddingTypeLeft").val() == "fixed") {
      $("#lfb_tld_style_paddingLeft").closest(".form-group").slideDown();
      $("#lfb_tld_style_paddingLeftFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_paddingTypeLeft").val() == "flexible") {
      $("#lfb_tld_style_paddingLeft").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingLeftFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_paddingLeft").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingLeftFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          paddingLeft: "auto",
        });
      }
    }
  }

  function lfb_tld_style_paddingTypeRightChange() {
    if ($("#lfb_tld_style_paddingTypeRight").val() == "fixed") {
      $("#lfb_tld_style_paddingRight").closest(".form-group").slideDown();
      $("#lfb_tld_style_paddingRightFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_paddingTypeRight").val() == "flexible") {
      $("#lfb_tld_style_paddingRight").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingRightFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_paddingRight").closest(".form-group").slideUp();
      $("#lfb_tld_style_paddingRightFlex").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          paddingRight: "auto",
        });
      }
    }
  }

  function lfb_tld_style_positionTopChange() {
    if ($("#lfb_tld_style_positionTop").val() == "fixed") {
      $("#lfb_tld_style_top").closest(".form-group").slideDown();
      $("#lfb_tld_style_topFlex").closest(".form-group").slideUp();
    } else if ($("#lfb_tld_style_positionTop").val() == "flexible") {
      $("#lfb_tld_style_top").closest(".form-group").slideUp();
      $("#lfb_tld_style_topFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_top").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          top: "auto",
        });
      }
    }
  }

  function lfb_tld_style_positionBottomChange() {
    if ($("#lfb_tld_style_positionBottom").val() == "fixed") {
      $("#lfb_tld_style_bottom").closest(".form-group").slideDown();
    } else if ($("#lfb_tld_style_positionBottom").val() == "flexible") {
      $("#lfb_tld_style_bottom").closest(".form-group").slideUp();
      $("#lfb_tld_style_bottomFlex").closest(".form-group").slideDown();
    } else {
      $("#lfb_tld_style_bottom").closest(".form-group").slideUp();
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          bottom: "auto",
        });
      }
    }
  }

  function lfb_tld_style_leftChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        left: $("#lfb_tld_style_left").slider("value"),
      });
    }
  }

  function lfb_tld_style_rightChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        right: $("#lfb_tld_style_right").slider("value"),
      });
    }
  }

  function lfb_tld_style_topChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        top: $("#lfb_tld_style_top").slider("value"),
      });
    }
  }

  function lfb_tld_style_bottomChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        bottom: $("#lfb_tld_style_bottom").slider("value"),
      });
    }
  }

  function lfb_tld_style_leftFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        left: $("#lfb_tld_style_leftFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_rightFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        right: $("#lfb_tld_style_rightFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_topFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        top: $("#lfb_tld_style_topFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_bottomFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        bottom: $("#lfb_tld_style_bottomFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_marginLeftFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginLeft: $("#lfb_tld_style_marginLeftFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_marginRightFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginRight: $("#lfb_tld_style_marginRightFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_marginTopFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginTop: $("#lfb_tld_style_marginTopFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_marginBottomFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginBottom:
          $("#lfb_tld_style_marginBottomFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_marginLeftChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginLeft: $("#lfb_tld_style_marginLeft").slider("value"),
      });
    }
  }

  function lfb_tld_style_marginRightChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginRight: $("#lfb_tld_style_marginRight").slider("value"),
      });
    }
  }

  function lfb_tld_style_marginTopChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginTop: $("#lfb_tld_style_marginTop").slider("value"),
      });
    }
  }

  function lfb_tld_style_marginBottomChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        marginBottom: $("#lfb_tld_style_marginBottom").slider("value"),
      });
    }
  }

  function lfb_tld_style_paddingLeftChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingLeft: $("#lfb_tld_style_paddingLeft").slider("value"),
      });
    }
  }

  function lfb_tld_style_paddingRightChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingRight: $("#lfb_tld_style_paddingRight").slider("value"),
      });
    }
  }

  function lfb_tld_style_paddingTopChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingTop: $("#lfb_tld_style_paddingTop").slider("value"),
      });
    }
  }

  function lfb_tld_style_paddingBottomChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingBottom: $("#lfb_tld_style_paddingBottom").slider("value"),
      });
    }
  }

  function lfb_tld_style_paddingLeftFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingLeft: $("#lfb_tld_style_paddingLeftFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_paddingRightFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingRight:
          $("#lfb_tld_style_paddingRightFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_paddingTopFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingTop: $("#lfb_tld_style_paddingTopFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_paddingBottomFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        paddingBottom:
          $("#lfb_tld_style_paddingBottomFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_fontTypeChange() {
    if ($("#lfb_tld_style_fontType").val() == "google") {
      $("#lfb_tld_style_fontFamily").next(".lfb_tld_fieldBtn").show();
      $("#lfb_tld_style_fontFamily").addClass("lfb_tld_fieldHasBtn");

      lfb_tld_selectedElement.attr("data-googlefont", "true");
    } else {
      $("#lfb_tld_style_fontFamily").next(".lfb_tld_fieldBtn").hide();
      lfb_tld_selectedElement.removeAttr("data-googlefont");
      $("#lfb_tld_style_fontFamily").removeClass("lfb_tld_fieldHasBtn");
    }
  }

  function lfb_tld_style_fontFamilyChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        fontFamily: $("#lfb_tld_style_fontFamily").val(),
      });
      if (
        !$("#lfb_tld_style_fontFamily option:selected").is(
          '[data-default="true"]'
        )
      ) {
        var fontName = $("#lfb_tld_style_fontFamily").val().replace(/ /g, "+");
        lfb_tld_selectedElement.attr("data-googlefont", "true");
        $("#lfb_tld_tdgnFrame")
          .contents()
          .find("head")
          .append(
            "<link href='https://fonts.googleapis.com/css?family=" +
              fontName +
              "' rel='stylesheet' type='text/css'>"
          );
      } else {
        lfb_tld_selectedElement.removeAttr("data-googlefont");
      }
    }
  }

  function lfb_tld_style_fontSizeChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        fontSize: $("#lfb_tld_style_fontSize").slider("value"),
      });
    }
  }

  function lfb_tld_style_lineHeightChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        lineHeight: $("#lfb_tld_style_lineHeight").slider("value") + "px",
      });
    }
  }

  function lfb_tld_style_lineHeightFlexChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        lineHeight: $("#lfb_tld_style_lineHeightFlex").slider("value") + "%",
      });
    }
  }

  function lfb_tld_style_lineHeightTypeChange() {
    if ($("#lfb_tld_style_lineHeightType").val() == "flexible") {
      $("#lfb_tld_style_lineHeightFlex").closest(".form-group").slideDown();
      $("#lfb_tld_style_lineHeight").closest(".form-group").slideUp();
    } else {
      $("#lfb_tld_style_lineHeightFlex").closest(".form-group").slideUp();
      $("#lfb_tld_style_lineHeight").closest(".form-group").slideDown();
    }
  }

  function lfb_tld_style_scrollXChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        overflowX: $("#lfb_tld_style_scrollX").val(),
      });
    }
  }

  function lfb_tld_style_scrollYChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        overflowY: $("#lfb_tld_style_scrollY").val(),
      });
    }
  }

  function lfb_tld_style_visibilityChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        visibility: $("#lfb_tld_style_visibility").val(),
      });
    }
  }

  function lfb_tld_style_shadowTypeChange() {
    var type = $("#lfb_tld_style_shadowType").val();
    if (type == "none") {
      $("#lfb_tld_style_shadowX").closest(".form-group").slideUp();
      $("#lfb_tld_style_shadowY").closest(".form-group").slideUp();
      $("#lfb_tld_style_shadowSize").closest(".form-group").slideUp();
      $("#lfb_tld_style_shadowColor").closest(".form-group").slideUp();
      $("#lfb_tld_style_shadowAlpha").closest(".form-group").slideUp();
      lfb_tld_selectedElement.removeClass("lfb_tld_hasShadow");
    } else if (type == "outside") {
      $("#lfb_tld_style_shadowX").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowY").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowSize").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowColor").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowAlpha").closest(".form-group").slideDown();
      if (!lfb_tld_selectedElement.is(".lfb_tld_hasShadow")) {
        lfb_tld_selectedElement.addClass("lfb_tld_hasShadow");
      }
    } else {
      $("#lfb_tld_style_shadowX").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowY").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowSize").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowColor").closest(".form-group").slideDown();
      $("#lfb_tld_style_shadowAlpha").closest(".form-group").slideDown();
      if (!lfb_tld_selectedElement.is(".lfb_tld_hasShadow")) {
        lfb_tld_selectedElement.addClass("lfb_tld_hasShadow");
      }
    }
    lfb_tld_style_shadowChange();
  }

  function lfb_tld_style_shadowChange() {
    var type = $("#lfb_tld_style_shadowType").val();
    var shadowX = $("#lfb_tld_style_shadowX").slider("value");
    var shadowY = $("#lfb_tld_style_shadowY").slider("value");
    var size = $("#lfb_tld_style_shadowSize").slider("value");
    var newColor = $("#lfb_tld_style_shadowColor").val();
    if ($("#lfb_tld_style_shadowColor").val().indexOf("rgb") > -1) {
      newColor = lfb_tld_rgb2hex($("#lfb_tld_style_shadowColor").val());
    }
    newColor = lfb_tld_hex2Rgba(
      newColor,
      $("#lfb_tld_style_shadowAlpha").slider("value")
    );
    if (type == "none") {
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          boxShadow: "none",
        });
      }
    } else {
      var inside = "";
      if (type == "inside") {
        inside = "inset";
      }
      if (lfb_tld_elementInitialized) {
        lfb_tld_selectedElement.css({
          boxShadow:
            newColor +
            +shadowX +
            "px " +
            shadowY +
            "px " +
            size +
            "px " +
            inside +
            " ",
        });
      }
    }
  }

  function lfb_tld_style_borderRadiusChange() {
    var topLeft = $("#lfb_tld_style_borderRadiusTopLeft").slider("value");
    var topRight = $("#lfb_tld_style_borderRadiusTopRight").slider("value");
    var bottomLeft = $("#lfb_tld_style_borderRadiusBottomLeft").slider("value");
    var bottomRight = $("#lfb_tld_style_borderRadiusBottomRight").slider(
      "value"
    );
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        "border-top-left-radius": topLeft + "px",
        "border-top-right-radius": topRight + "px",
        "border-bottom-left-radius": bottomLeft + "px",
        "border-bottom-right-radius": bottomRight + "px",
      });
    }
  }

  function lfb_tld_style_textShadowChange() {
    var shadowX = $("#lfb_tld_style_textShadowX").slider("value");
    var shadowY = $("#lfb_tld_style_textShadowY").slider("value");
    var newColor = $("#lfb_tld_style_textShadowColor").val();
    if ($("#lfb_tld_style_textShadowColor").val().indexOf("rgb") > -1) {
      newColor = lfb_tld_rgb2hex($("#lfb_tld_style_textShadowColor").val());
    }
    newColor = lfb_tld_hex2Rgba(
      newColor,
      $("#lfb_tld_style_textShadowAlpha").slider("value")
    );

    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        textShadow: shadowX + "px " + shadowY + "px " + newColor,
      });
    }
  }

  function lfb_tld_style_textAlignChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        textAlign: $("#lfb_tld_style_textAlign").val(),
      });
    }
  }

  function lfb_tld_style_opacityChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        opacity: $("#lfb_tld_style_opacity").slider("value"),
      });
    }
  }

  function lfb_tld_style_fontStyleChange() {
    var styles = new Array();
    $("#lfb_tld_style_fontStyle option:selected").each(function () {
      styles.push($(this).attr("value"));
    });

    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({ fontStyle: "normal" });
      lfb_tld_selectedElement.css({ fontWeight: "normal" });
      lfb_tld_selectedElement.css({ textDecoration: "none" });
      if (jQuery.inArray("bold", styles) > -1) {
        lfb_tld_selectedElement.css({ fontWeight: "bold" });
      }
      if (jQuery.inArray("italic", styles) > -1) {
        lfb_tld_selectedElement.css({ fontStyle: "italic" });
      }
      if (jQuery.inArray("underline", styles) > -1) {
        lfb_tld_selectedElement.css({ textDecoration: "underline" });
      }
    }
  }

  function lfb_tld_style_fontColorChange() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_selectedElement.css({
        color: $("#lfb_tld_style_fontColor").val(),
      });
    }
  }

  function lfb_tld_saveCurrentElement() {
    var existingStyle = lfb_tld_getElementData(
      lfb_tld_selectedElement,
      lfb_tld_deviceMode
    );

    var domSelector =
      '#lfb_form.lfb_bootstraped[data-form="' +
      lfb_currentFormID +
      '"] ' +
      lfb_tld_getPath(lfb_tld_selectedElement, false, true);
    if ($("#lfb_tld_tdgn_applyModifsTo").val() == "cssClasses") {
      var filledClasses = $("#lfb_tld_tdgn_applyToClasses").val();
      if (filledClasses.substr(filledClasses.length - 1) == " ") {
        filledClasses = filledClasses.substr(0, filledClasses.length - 1);
      }
      if (filledClasses.substr(filledClasses.length - 1) == " ") {
        filledClasses = filledClasses.substr(0, filledClasses.length - 1);
      }
      filledClasses = "." + filledClasses;
      filledClasses = filledClasses.replaceAll(" ", ".");
      domSelector =
        '#lfb_form.lfb_bootstraped[data-form="' +
        lfb_currentFormID +
        '"] ' +
        filledClasses;
    }

    if (
      lfb_tld_selectedElement.attr("style") &&
      lfb_tld_selectedElement.attr("style") != ""
    ) {
      if (existingStyle && existingStyle.domSelector == domSelector) {
        if ($("#lfb_tld_stateSelect").val() == "default") {
          existingStyle.style = lfb_tld_selectedElement.attr("style");
        } else if ($("#lfb_tld_stateSelect").val() == "focus") {
          existingStyle.focusStyle = lfb_tld_selectedElement.attr("style");
        } else {
          existingStyle.hoverStyle = lfb_tld_selectedElement.attr("style");
        }
      } else {
        var dataDevice = lfb_tld_getElementsDataByDevice(lfb_tld_deviceMode);
        if (dataDevice) {
          var newStyle = lfb_tld_selectedElement
            .attr("style")
            .replace(lfb_tld_selectedElement.attr("data-originalstyle"), "");
          if ($("#lfb_tld_tdgn_applyModifsTo").val() == "cssClasses") {
            var filledClasses = $("#lfb_tld_tdgn_applyToClasses").val();
            if (filledClasses.substr(filledClasses.length - 1) == " ") {
              filledClasses = filledClasses.substr(0, filledClasses.length - 1);
            }
            if (filledClasses.substr(filledClasses.length - 1) == " ") {
              filledClasses = filledClasses.substr(0, filledClasses.length - 1);
            }
            filledClasses = filledClasses;
            filledClasses = filledClasses.replaceAll(" ", ".");
            domSelector =
              '#lfb_form.lfb_bootstraped[data-form="' +
              lfb_currentFormID +
              '"] .' +
              filledClasses;
          }
          if ($("#lfb_tld_tdgn_applyScope").val() == "page") {
            var pageClass = "";
            jQuery.each(
              $("#lfb_tld_tdgnFrame")
                .contents()
                .find("body")
                .attr("class")
                .split(" "),
              function () {
                if (this.indexOf("page-id-") == 0) {
                  pageClass = "body." + this;
                }
              }
            );
            domSelector =
              pageClass +
              ' #lfb_form.lfb_bootstraped[data-form="' +
              lfb_currentFormID +
              '"] ' +
              domSelector;
          } else if ($("#lfb_tld_tdgn_applyScope").val() == "container") {
            if ($("#lfb_tld_tdgn_scopeContainerClass").val().length > 0) {
              domSelector =
                '#lfb_form.lfb_bootstraped[data-form="' +
                lfb_currentFormID +
                '"] .' +
                $("#lfb_tld_tdgn_scopeContainerClass").val() +
                " > " +
                domSelector;
            }
          }
          if ($("#lfb_tld_stateSelect").val() == "default") {
            dataDevice.elements.push({
              element: lfb_tld_selectedElement.get(0),
              domSelector: domSelector,
              style: newStyle,
            });
          } else if ($("#lfb_tld_stateSelect").val() == "focus") {
            dataDevice.elements.push({
              element: lfb_tld_selectedElement.get(0),
              domSelector: domSelector,
              focusStyle: newStyle,
            });
          } else {
            dataDevice.elements.push({
              element: lfb_tld_selectedElement.get(0),
              domSelector: domSelector,
              hoverStyle: newStyle,
            });
          }
        }
      }
      lfb_notification(lfb_data.texts["stylesApplied"], false, true);
      lfb_tld_modifsMade = true;
      $(".lfb_tld_tdgn_section:not(.lfb_tld_closed)").each(function () {
        lfb_tld_tdgn_toggleSection($(this), false);
      });
    }
  }

  function lfb_tld_getElementData(element, device) {
    var rep = false;
    jQuery.each(lfb_tld_styles, function () {
      if (this.device == device) {
        jQuery.each(this.elements, function () {
          if (this.element === element.get(0)) {
            rep = this;
          }
        });
      }
    });
    return rep;
  }

  function lfb_tld_getElementsDataByDevice(device) {
    var rep = false;
    jQuery.each(lfb_tld_styles, function () {
      if (this.device == device) {
        rep = this;
      }
    });
    return rep;
  }

  function lfb_tld_getGoogleFontsUsed() {
    lfb_tld_usedGoogleFonts = new Array();
    $("#lfb_tld_tdgnFrame")
      .contents()
      .find('[data-googlefont="true"]')
      .each(function () {
        var font = $(this).css("font-family");
        if (jQuery.inArray(font, lfb_tld_usedGoogleFonts) == -1) {
          lfb_tld_usedGoogleFonts.push(font);
        }
      });
    var rep = "";
    jQuery.each(lfb_tld_usedGoogleFonts, function () {
      rep += this + ",";
    });
    return rep;
  }

  function lfb_tld_formatStylesBeforeSend() {
    var rep = new Array();
    jQuery.each(lfb_tld_styles, function () {
      var device = this;
      var newDevice = {
        device: device.device,
        elements: new Array(),
      };
      jQuery.each(device.elements, function () {
        newDevice.elements.push({
          domSelector: this.domSelector,
          style: this.style,
          hoverStyle: this.hoverStyle,
          focusStyle: this.focusStyle,
        });
      });
      rep.push(newDevice);
    });

    return JSON.stringify(rep);
  }

  function lfb_tld_exportCSS() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_tld_exportCSS",
        styles: lfb_tld_formatStylesBeforeSend(),
        formID: lfb_currentFormID,
        gfonts: lfb_tld_getGoogleFontsUsed(),
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        var win = window.open(lfb_data.exportUrl + rep, "_blank");
        win.focus();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      },
    });
  }

  function lfb_tld_leave() {
    if (lfb_tld_modifsMade) {
      showModal($("#lfb_tld_winSaveDialog"));
      $("#lfb_tld_winSaveDialog").fadeIn();
    } else {
      lfb_closeFormDesigner();
    }
  }

  function lfb_tld_leaveConfirm() {
    lfb_closeFormDesigner();
  }

  function lfb_tld_changeStateMode() {
    if (lfb_tld_elementInitialized) {
      lfb_tld_changeDeviceMode(lfb_tld_deviceMode);
    }
  }

  function lfb_tld_resetStyles() {
    showModal($("#lfb_tld_winResetStylesDialog"));
  }

  function lfb_tld_resetSessionStyles() {
    jQuery.each(lfb_tld_styles, function () {
      this.elements = new Array();
    });
    lfb_tld_changeDeviceMode(lfb_tld_deviceMode);
  }

  function lfb_tld_resetAllStyles() {
    lfb_showLoader();
    lfb_tld_resetSessionStyles();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_tld_resetCSS",
        formID: lfb_currentFormID,
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        var random = Math.floor(Math.random() * 10000 + 1);
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
        $("#lfb_tld_tdgnFrame").attr(
          "src",
          lfb_tld_previewUrl + "&tmp=" + random + "&lfb_designForm=1"
        );
        lfb_tld_initStyles();
        lfb_tld_unselectElement();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      },
    });
  }

  function lfb_tld_editCSS() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_tld_getCSS",
        formID: lfb_currentFormID,
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        lfb_tld_editorCSS.setValue(rep);
        setTimeout(function () {
          lfb_tld_editorCSS.refresh();
        }, 300);
        showModal($("#lfb_tld_winEditCSSDialog"));
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      },
    });
  }

  function lfb_tld_saveEditedCSS() {
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_tld_saveEditedCSS",
        formID: lfb_currentFormID,
        css: lfb_tld_editorCSS.getValue(),
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        var random = Math.floor(Math.random() * 10000 + 1);
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
        $("#lfb_tld_tdgnFrame").attr(
          "src",
          lfb_tld_previewUrl + "&tmp=" + random + "&lfb_designForm=1"
        );
        lfb_tld_initStyles();
        lfb_tld_unselectElement();
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      },
    });
  }

  function lfb_tld_openSaveBeforeEditDialog() {
    if (lfb_tld_modifsMade) {
      showModal($("#lfb_tld_winSaveBeforeEditDialog"));
    } else {
      lfb_tld_editCSS();
    }
  }

  function getBezierXY(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
    return {
      x:
        Math.pow(1 - t, 3) * sx +
        3 * t * Math.pow(1 - t, 2) * cp1x +
        3 * t * t * (1 - t) * cp2x +
        t * t * t * ex,
      y:
        Math.pow(1 - t, 3) * sy +
        3 * t * Math.pow(1 - t, 2) * cp1y +
        3 * t * t * (1 - t) * cp2y +
        t * t * t * ey,
    };
  }

  function showModal($modal) {
    $modal.fadeIn(250);
    $("#lfb_backdrop").fadeIn(250);
  }

  function hideModal($modal) {
    $modal.fadeOut(250);
    $("#lfb_backdrop").fadeOut(250);
  }

  function mainSaveBtnClicked() {
    if ($(this).attr("data-btnaction") == "saveForm") {
      lfb_saveForm();
    } else if ($(this).attr("data-btnaction") == "saveStep") {
      if (lfb_currentForm.form.useVisualBuilder == 1) {
        if (lfb_currentStepID > 0) {
          $('a[data-action="showStepsManager"]').trigger("click");
        }
        lfb_notification(lfb_data.texts["modifsSaved"], false, true);
      } else {
        lfb_saveStep();
      }
    } else if ($(this).attr("data-btnaction") == "saveItem") {
      lfb_saveItem();
    } else if ($(this).attr("data-btnaction") == "closeItem") {
      if (lfb_currentStepID == 0) {
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        $('a[data-action="showLastStep"]').trigger("click");
      } else {
        if (lfb_currentForm.form.useVisualBuilder == 1) {
          lfb_editVisualStep(lfb_currentStepID);
        } else {
          lfb_openWinStep(lfb_currentStepID);
        }
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
      }
    }
  }
  function lfb_generateFormAI() {
    const description = $('#lfb_aiFormPanel [name="formDescription"]').val();
    if (description.length < 5) {
      $('#lfb_aiFormPanel [name="formDescription"]').addClass("is-invalid");
      return;
    }

    $("#lfb_aiFormPanel .lfb_aiContent").hide();
    $("#lfb_aiFormPanel .lfb_aiGenerating").removeClass("d-none");
    $('[data-action="generateFormAI"]').addClass("disabled");
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_generateFormAI",
        formData: description,
        language: $('#lfb_aiFormPanel [name="language"]').val(),
        nonce: lfb_data.nonce,
      },
      success: function (rep) {
        rep = JSON.parse(rep);
        $('[data-action="generateFormAI"]').removeClass("disabled");
        if (!rep.error) {
          hideModal($("#lfb_aiFormPanel"));

          lfb_loadForm(rep.formID, function () {
            $("#lfb_aiFormPanel .lfb_aiContent").show();
            $("#lfb_aiFormPanel .lfb_aiGenerating").addClass("d-none");
            $("#lfb_loader").fadeOut();
            getAiLanguageSettings(rep.language);

            lfb_saveForm();

            $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
              "update"
            );
          });
        } else {
          $("#lfb_aiFormPanel .lfb_aiContent").show();
          $("#lfb_aiFormPanel .lfb_aiGenerating").addClass("d-none");
          lfb_notification(rep.error, true, false);
        }
      },
      error: function () {
        $("#lfb_aiFormPanel .lfb_aiContent").show();
        $("#lfb_aiFormPanel .lfb_aiGenerating").addClass("d-none");
        $('[data-action="generateFormAI"]').removeClass("disabled");
        lfb_notification(lfb_data.texts["errorOccured"], true, false);
      },
    });
  }
  function lfb_openAiFormWizard() {
    if (lfb_settings.openAiKey.length == 0) {
      setTimeout(function () {
        lfb_openGlobalSettings("openAiKey");
      }, 200);
    } else {
      showModal($("#lfb_aiFormPanel"));
    }
  }

  function lfb_openFormWizard() {
    $('#lfb_winFormWizard [name="currency"]').val("USD").trigger("change");
    $("#lfb_winFormWizard #lfb_wizardSteps > div").addClass("hidden");
    $('#lfb_winFormWizard [data-step="1"]').removeClass("hidden");
    $('#lfb_winFormWizard .modal-footer [data-action="previousStep"]').hide();
    lfb_wizardStep = 0;

    var mainColor = "#1abc9c";
    var secondaryColor = "#2c3e50";
    var darkColor = "#95a5a6";
    var lightColor = "#ecf0f1";

    $('#lfb_winFormWizard [name="mainColor"]').val(mainColor).trigger("change");
    $('#lfb_winFormWizard [name="secondaryColor"]')
      .val(secondaryColor)
      .trigger("change");
    $('#lfb_winFormWizard [name="darkColor"]').val(darkColor).trigger("change");
    $('#lfb_winFormWizard [name="lightColor"]')
      .val(lightColor)
      .trigger("change");

    $('#lfb_winFormWizard [name="currency"]').val("USD").trigger("change");

    $('#lfb_winFormWizard [name="isSubscription"]')
      .removeProp("checked")
      .trigger("change");
    $('#lfb_winFormWizard [name="stripe_subsFrequency"]').val(1);
    $('#lfb_winFormWizard [name="stripe_subsFrequencyType"]').val("month");
    $("#lfb_wizardSteps > div[data-step]")
      .removeClass("active")
      .addClass("hidden");
    $('#lfb_wizardSteps > div[data-step="1"]')
      .addClass("active")
      .removeClass("hidden");
    showModal($("#lfb_winFormWizard"));

    $('#lfb_winFormWizard a[data-action="continue"]').focus();

    $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect("update");
  }

  function lfb_getNumberSeparators() {
    var res = {
      decimal: ".",
      thousand: "",
    };
    var str = parseFloat(1234567.89).toLocaleString();
    if (!str.match("1")) return res;

    res.decimal = str.replace(/.*7(.*)8.*/, "$1");
    res.thousand = str.replace(/.*4(.*)5.*/, "$1");
    res.million = str.replace(/.*1(.*)2.*/, "$1");

    return res;
  }

  function lfb_localeUses24HourTime(langCode) {
    return (
      new Intl.DateTimeFormat(langCode, {
        hour: "numeric",
      })
        .formatToParts(new Date(2020, 0, 1, 13))
        .find((part) => part.type === "hour").value.length === 2
    );
  }

  function lfb_isLocaleCurrencyPositionRight() {
    var language = window.navigator.userLanguage || window.navigator.language;
    var formatter = new Intl.NumberFormat(language, {
      style: "currency",
      currency: "EUR",
    });

    var price = formatter.format(100);
    if (price.indexOf("€") == 0) {
      return 0;
    } else {
      return 1;
    }
  }

  function lfb_initFormWizard() {
    $("#lfb_wizardTemplateList .lfb_templateCard").on("click", function () {
      $("#lfb_wizardTemplateList .active").removeClass("active");
      $(this).addClass("active");
    });
    $("#lfb_wizardStepBuilderChoice .card").on("click", function () {
      $("#lfb_wizardStepBuilderChoice .active").removeClass("active");
      $(this).addClass("active");
    });
    $('#lfb_winFormWizard a[data-action="continue"]').on(
      "click",
      lfb_wizardBtnContinueClicked
    );

    $('#lfb_winFormWizard [name="sendPdfCustomer"]').on("change", function () {
      if ($(this).is(":checked")) {
        $('#lfb_winFormWizard [name="sendEmail"]')
          .parent()
          .bootstrapSwitch("setState", true);
      }
    });
    $('#lfb_winFormWizard [name="sendEmail"]').on("change", function () {
      if (!$(this).is(":checked")) {
        $('#lfb_winFormWizard [name="sendPdfCustomer"]')
          .parent()
          .bootstrapSwitch("setState", false);
      }
    });

    $("#lfb_winFormWizard .colorpick").on("change", function () {
      $(this)
        .prev(".input-group-text")
        .css({
          backgroundColor: $(this).val(),
        });
    });
    $('#lfb_winFormWizard [name="isSubscription"]').on("change", function () {
      if ($(this).is(":checked")) {
        $('#lfb_winFormWizard [name="subscription_text"]')
          .closest(".col-6")
          .show();
        $('#lfb_winFormWizard [name="stripe_subsFrequency"]')
          .closest(".col-12")
          .show();
      } else {
        $('#lfb_winFormWizard [name="subscription_text"]')
          .closest(".col-6")
          .hide();
        $('#lfb_winFormWizard [name="stripe_subsFrequency"]')
          .closest(".col-12")
          .hide();
      }
    });
    var getCurrencySymbol = (locale, currency) =>
      (0)
        .toLocaleString(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        .replace(/\d/g, "")
        .trim();

    $('#lfb_winFormWizard [name="currency"]').on("change", function () {
      var currency = $(this).val();
      if (currency != "") {
        var language =
          window.navigator.userLanguage || window.navigator.language;
        var currencySymbol = getCurrencySymbol(language, currency);
        if (currency == "USD") {
          currencySymbol = "$";
        }
        $('#lfb_winFormWizard [name="currencySymbol"]').val(currencySymbol);

        var seps = lfb_getNumberSeparators();
        $('#lfb_winFormWizard [name="decimalsSeparator"]').val(seps.decimal);
        $('#lfb_winFormWizard [name="thousandsSeparator"]').val(seps.thousand);
        $('#lfb_winFormWizard [name="millionSeparator"]').val(seps.million);

        if (lfb_isLocaleCurrencyPositionRight()) {
          $('#lfb_winFormWizard [name="currencyPosition"]').val("right");
        } else {
          $('#lfb_winFormWizard [name="currencyPosition"]').val("left");
        }
        if (lfb_localeUses24HourTime(language)) {
          $('#lfb_winFormWizard [name="timeMode"]').val("24");
        } else {
          $('#lfb_winFormWizard [name="timeMode"]').val("12");
        }
        var startLang = language;
        if (language.indexOf("-") > 0) {
          startLang = language.substr(0, language.indexOf("-"));
        }
        $('#lfb_winFormWizard [name="datepickerLang"]').val(startLang);
      } else {
        $('#lfb_winFormWizard [name="currencySymbol"]').val("$");
      }
    });
  }

  function lfb_getSecondGradientColor(mainColor) {
    var originalHSV = Please.HEX_to_HSV(mainColor);

    var newHSV = {
      h: (originalHSV.h + 120) % 360, 
      s: originalHSV.s * 0.8, 
      v: originalHSV.v < 0.5 ? originalHSV.v * 1.2 : originalHSV.v * 0.8, 
    };

    var newColor = Please.HSV_to_HEX(newHSV);

    return newColor;
  }

  function lfb_analyzeWizardLogo(fileurl) {
    var img = document.createElement("img");
    img.setAttribute("src", fileurl);

    var mainColor = "#1abc9c";
    var secondaryColor = "#bdc3c7";
    var darkColor = "#95a5a6";
    var lightColor = "#ecf0f1";

    img.addEventListener("load", function () {
      var vibrant = new Vibrant(img);
      var swatches = vibrant.swatches();
      if (typeof swatches["Vibrant"] != "undefined") {
        mainColor = swatches["Vibrant"].getHex();
      }
      if (typeof swatches["Muted"] != "undefined") {
        secondaryColor = swatches["Muted"].getHex();
      }
      if (typeof swatches["DarkVibrant"] != "undefined") {
        darkColor = swatches["DarkVibrant"].getHex();
      }
      if (typeof swatches["LightMuted"] != "undefined") {
        lightColor = swatches["LightMuted"].getHex();
      }

      $('#lfb_winFormWizard [name="mainColor"]')
        .val(mainColor)
        .trigger("change");
      $('#lfb_winFormWizard [name="secondaryColor"]')
        .val(secondaryColor)
        .trigger("change");
      //   $('#lfb_winFormWizard [name="darkColor"]').val(darkColor).trigger('change');
      //  $('#lfb_winFormWizard [name="lightColor"]').val(lightColor).trigger('change');
    });
  }

  function lfb_wizardBtnContinueClicked() {
    var stepIndex = $("#lfb_winFormWizard [data-step].active").index();
    var error = false;

    $("#lfb_winFormWizard .is-invalid").removeClass("is-invalid");
    $("#lfb_wizardTemplateList").removeClass("border-danger");

    if (stepIndex == 0) {
      if (
        $('#lfb_winFormWizard [data-step].active [name="title"]').val().length <
        3
      ) {
        error = true;
        $('#lfb_winFormWizard [data-step].active [name="title"]').addClass(
          "is-invalid"
        );
      }
      if ($("#lfb_wizardTemplateList .lfb_templateCard.active").length < 0) {
        error = true;
        $("#lfb_wizardTemplateList").addClass("border-danger");
      }
    }
    if (!error) {
      var template = $("#lfb_wizardTemplateList .lfb_templateCard.active").attr(
        "data-template"
      );
      var validSteps = $(
        '#lfb_winFormWizard [data-step]:not([data-reqtemplate]):not([data-notemplate="' +
          template +
          '"]),#lfb_winFormWizard [data-step][data-reqtemplate="' +
          template +
          '"]'
      );
      lfb_wizardStep = lfb_wizardStep + 1;
      if (
        lfb_wizardStep == 4 &&
        $('#lfb_winFormWizard [name="autoLocalisation"]').is(":checked")
      ) {
        lfb_wizardStep++;
      }
      if (lfb_wizardStep < validSteps.length) {
        $("#lfb_winFormWizard [data-step].active")
          .addClass("hidden")
          .removeClass("active");
        $(validSteps.get(lfb_wizardStep))
          .removeClass("hidden")
          .addClass("active");
        $("#lfb_winFormWizard [data-step]").removeAttr("style");
        $('#lfb_winFormWizard [name="currency"]').trigger("change");

        if (lfb_wizardStep == validSteps.length - 1) {
          $('#lfb_winFormWizard a[data-action="continue"]').html(
            '<i class="fas fa-rocket me-2"></i>' +
              lfb_data.texts["Create the form"]
          );
        } else {
          $('#lfb_winFormWizard a[data-action="continue"]').html(
            '<i class="fas fa-check me-2"></i>' + lfb_data.texts["Continue"]
          );
        }
      } else {
        lfb_wizardFinished();
      }
    }
  }

  function lfb_wizardFinished() {
    var template = $("#lfb_wizardTemplateList .lfb_templateCard.active").attr(
      "data-template"
    );
    lfb_showLoader();
    jQuery.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_addForm",
        template: template,
      },
      success: function (formID) {
        lfb_loadForm(formID, function () {
          $('#lfb_formFields [name="btn_step"]').val(
            $('#lfb_winFormWizard [name="btn_step"]').val()
          );
          $('#lfb_formFields [name="previous_step"]').val(
            $('#lfb_winFormWizard [name="previous_step"]').val()
          );
          $('#lfb_formFields [name="txt_invoice"]').val(
            $('#lfb_winFormWizard [name="txt_invoice"]').val()
          );
          $('#lfb_formFields [name="txt_quotation"]').val(
            $('#lfb_winFormWizard [name="txt_quotation"]').val()
          );
          $('#lfb_formFields [name="last_title"]').val(
            $('#lfb_winFormWizard [name="last_title"]').val()
          );
          $('#lfb_formFields [name="last_text"]').val(
            $('#lfb_winFormWizard [name="last_text"]').val()
          );
          $('#lfb_formFields [name="last_btn"]').val(
            $('#lfb_winFormWizard [name="last_btn"]').val()
          );
          $('#lfb_formFields [name="succeed_text"]').val(
            $('#lfb_winFormWizard [name="succeed_text"]').val()
          );

          $('#lfb_formFields [name="stripe_publishKey"]').val(
            $('#lfb_winFormWizard [name="stripe_publishKey"]').val()
          );
          $('#lfb_formFields [name="stripe_secretKey"]').val(
            $('#lfb_winFormWizard [name="stripe_secretKey"]').val()
          );
          $('#lfb_formFields [name="paypal_email"]').val(
            $('#lfb_winFormWizard [name="paypal_email"]').val()
          );

          $('#lfb_formFields [name="isSubscription"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="isSubscription"]').is(":checked")
            );
          $('#lfb_formFields [name="subscription_text"]').val(
            $('#lfb_winFormWizard [name="subscription_text"]').val()
          );
          $('#lfb_formFields [name="stripe_subsFrequency"]').val(
            $('#lfb_winFormWizard [name="stripe_subsFrequency"]').val()
          );
          $('#lfb_formFields [name="stripe_subsFrequencyType"]').val(
            $('#lfb_winFormWizard [name="stripe_subsFrequencyType"]').val()
          );

          $('#lfb_formFields [name="title"]').val(
            $('#lfb_winFormWizard [name="title"]').val()
          );

          $('#lfb_formFields [name="colorA"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="color_summaryTheadBg"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="color_fieldsBorderFocus"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="color_summaryFooterTxt"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="color_btnBg"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="color_progressBarA"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="color_progressBarB"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );

          $('#lfb_formFields [name="colorSecondary"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );
          $('#lfb_formFields [name="colorCbCircleOn"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );
          $('#lfb_formFields [name="colorC"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );
          $('#lfb_formFields [name="color_summaryTbodyTxt"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );
          $('#lfb_formFields [name="color_summaryStepBg"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );
          $('#lfb_formFields [name="color_fieldsBorder"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );
          $('#lfb_formFields [name="color_fieldsText"]').val(
            $('#lfb_winFormWizard [name="secondaryColor"]').val()
          );

          $('#lfb_formFields [name="gradientBg"]')
            .parent()
            .bootstrapSwitch("setState", true);

          $('#lfb_formFields [name="colorGradientBg1"]').val(
            $('#lfb_winFormWizard [name="mainColor"]').val()
          );
          $('#lfb_formFields [name="colorGradientBg2"]').val(
            lfb_getSecondGradientColor(
              $('#lfb_winFormWizard [name="mainColor"]').val()
            )
          );

          $('#lfb_formFields [name="useSummary"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="showSummary"]').is(":checked")
            );
          $('#lfb_formFields [name="sendPdfCustomer"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="sendPDF"]').is(":checked")
            );
          $('#lfb_formFields [name="email_toUser"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="sendEmail"]').is(":checked")
            );

          $('#lfb_formFields [name="enableSaveForLaterBtn"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="enableSaveForLaterBtn"]').is(
                ":checked"
              )
            );
          $('#lfb_formFields [name="useSignature"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="useSignature"]').is(":checked")
            );
          $('#lfb_formFields [name="enableFloatingSummary"]')
            .parent()
            .bootstrapSwitch(
              "setState",
              $('#lfb_winFormWizard [name="floatingSummary"]').is(":checked")
            );

          $('#lfb_formFields [name="datepickerLang"]').val(
            $('#lfb_winFormWizard [name="datepickerLang"]').val()
          );
          $('#lfb_formFields [name="currencyPosition"]').val(
            $('#lfb_winFormWizard [name="currencyPosition"]').val()
          );
          $('#lfb_formFields [name="currency"]').val(
            $('#lfb_winFormWizard [name="currencySymbol"]').val()
          );
          $('#lfb_formFields [name="paypal_currency"]').val(
            $('#lfb_winFormWizard [name="currency"]').val()
          );
          $('#lfb_formFields [name="stripe_currency"]').val(
            $('#lfb_winFormWizard [name="currency"]').val()
          );

          $('#lfb_formFields [name="datepickerLang"]').val(
            $('#lfb_winFormWizard [name="datepickerLang"]').val()
          );
          $('#lfb_formFields [name="decimalsSeparator"]').val(
            $('#lfb_winFormWizard [name="decimalsSeparator"]').val()
          );
          $('#lfb_formFields [name="thousandsSeparator"]').val(
            $('#lfb_winFormWizard [name="thousandsSeparator"]').val()
          );
          $('#lfb_formFields [name="billionsSeparator"]').val(
            $('#lfb_winFormWizard [name="billionsSeparator"]').val()
          );

          if ($('#lfb_winFormWizard [name="timeMode"]').val() == "12") {
            $('#lfb_formFields [name="timeModeAM"]')
              .parent()
              .bootstrapSwitch("setState", true);
          } else {
            $('#lfb_formFields [name="timeModeAM"]')
              .parent()
              .bootstrapSwitch("setState", false);
          }
          if (
            $("#lfb_wizardStepBuilderChoice .card[data-builder].active").attr(
              "data-builder"
            ) == "visual"
          ) {
            $('#lfb_formFields [name="useVisualBuilder"]')
              .parent()
              .bootstrapSwitch("setState", true);
          } else {
            $('#lfb_formFields [name="useVisualBuilder"]')
              .parent()
              .bootstrapSwitch("setState", false);
          }
          $('#lfb_formFields [name="fieldsPreset"]').val("glassmorphic");
          $('#lfb_formFields [name="imgIconStyle"]').val("zoom");

          $("#lfb_formFields .lfb_colorPreview").each(function () {
            $(this).css({
              backgroundColor: $(this).prev("input").val(),
            });
          });

          $('#lfb_formFields [name="groupAutoClick"]')
            .parent()
            .bootstrapSwitch("setState", true);
          $('#lfb_formFields [name="autocloseDatepicker"]')
            .parent()
            .bootstrapSwitch("setState", true);
          $('#lfb_formFields [name="groupAutoClick"]')
            .parent()
            .bootstrapSwitch("setState", true);

          if (template == "payment") {
            $('#lfb_formFields [name="showSteps"]').val(3);

            if (
              $('#lfb_winFormWizard [name="stripe_publishKey"]').val().trim()
                .length > 0
            ) {
              $('#lfb_formFields [name="use_stripe"]')
                .parent()
                .bootstrapSwitch("setState", true);
            }
            if (
              $('#lfb_winFormWizard [name="paypal_email"]').val().trim()
                .length > 0
            ) {
              $('#lfb_formFields [name="use_paypal"]')
                .parent()
                .bootstrapSwitch("setState", true);
            }
          } else if (template == "contact") {
            $('#lfb_formFields [name="showSteps"]').val(2);
            $('#lfb_formFields [name="animationsSpeed"]').val(0);
            $('#lfb_formFields [name="hideFinalPrice"]')
              .parent()
              .bootstrapSwitch("setState", true);
            $('#lfb_formFields [name="last_btn"]').val("Send");
            $('#lfb_formFields [name="last_title"]').val("Contact us !");

            $('#lfb_formFields [name="finalButtonIcon"]').val(
              "far fa-paper-plane"
            );
          }

          if (
            $('#lfb_winFormWizard [name="autoLocalisation"]').is(":checked")
          ) {
            getAiLanguageSettings(
              $('#lfb_winFormWizard [name="language"]').val()
            );
          }

          hideModal($("#lfb_winFormWizard"));
          lfb_saveForm();

          $("#lfb_bootstraped select:not(.lfb_defaultSelect)").niceSelect(
            "update"
          );
        });
      },
    });
  }

  function getAiLanguageSettings(language) {
    $.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_getAiSettings",
        language: language,
      },
      success: function (reponse) {
        if (reponse.error) {
          const errorMsg = reponse.data.error.message;
          alert(errorMsg);
          return;
        }

        const settings = JSON.parse(reponse.data);

        if (
          typeof settings === "object" &&
          settings !== null &&
          settings.hasOwnProperty("countryCode")
        ) {
          $('#lfb_formFields [name="datepickerLang"]').val(
            settings.countryCode
          );
          $('#lfb_formFields [name="currency"]').val(settings.currency);
          $('#lfb_formFields [name="currencyPosition"]').val(
            settings.currencyPosition
          );
          $('#lfb_formFields [name="thousandsSeparator"]').val(
            settings.thousandsSeparator
          );
          $('#lfb_formFields [name="decimalsSeparator"]').val(
            settings.decimalsSeparator
          );
          $('#lfb_formFields [name="millionSeparator"]').val(
            settings.millionSeparator
          );
          $('#lfb_formFields [name="billionsSeparator"]').val(
            settings.billionsSeparator
          );
          $('#lfb_formFields [name="btn_step"]').val(settings.texts.btn_step);
          $('#lfb_formFields [name="previous_step"]').val(
            settings.texts.previous_step
          );
          $('#lfb_formFields [name="intro_title"]').val(
            settings.texts.intro_title
          );
          $('#lfb_formFields [name="intro_text"]').val(
            settings.texts.intro_text
          );
          $('#lfb_formFields [name="intro_btn"]').val(settings.texts.intro_btn);
          $('#lfb_formFields [name="last_title"]').val(
            settings.texts.last_title
          );
          $('#lfb_formFields [name="last_text"]').val(settings.texts.last_text);
          $('#lfb_formFields [name="last_btn"]').val(settings.texts.last_btn);
          $('#lfb_formFields [name="last_msg_label"]').val(
            settings.texts.last_msg_label
          );
          $('#lfb_formFields [name="succeed_text"]').val(
            settings.texts.succeed_text
          );
          $('#lfb_formFields [name="email_subject"]').val(
            settings.texts.email_subject
          );
          $('#lfb_formFields [name="email_userSubject"]').val(
            settings.texts.email_userSubject
          );
          $('#lfb_formFields [name="summary_title"]').val(
            settings.texts.summary_title
          );
          $('#lfb_formFields [name="summary_description"]').val(
            settings.texts.summary_description
          );
          $('#lfb_formFields [name="summary_quantity"]').val(
            settings.texts.summary_quantity
          );
          $('#lfb_formFields [name="summary_price"]').val(
            settings.texts.summary_price
          );
          $('#lfb_formFields [name="summary_value"]').val(
            settings.texts.summary_value
          );
          $('#lfb_formFields [name="summary_total"]').val(
            settings.texts.summary_total
          );
          $('#lfb_formFields [name="txtDistanceError"]').val(
            settings.texts.txtDistanceError
          );
          $('#lfb_formFields [name="txtSignature"]').val(
            settings.texts.txtSignature
          );
          $('#lfb_formFields [name="errorMessage"]').val(
            settings.texts.errorMessage
          );

          $('#lfb_formFields [name="filesUpload_text"]').val(
            settings.texts.filesUpload_text
          );
          $('#lfb_formFields [name="summary_discount"]').val(
            settings.texts.summary_discount
          );
          $('#lfb_formFields [name="filesUploadSize_text"]').val(
            settings.texts.filesUploadSize_text
          );
          $('#lfb_formFields [name="filesUploadType_text"]').val(
            settings.texts.filesUploadType_text
          );
          $('#lfb_formFields [name="filesUploadLimit_text"]').val(
            settings.texts.filesUploadLimit_text
          );
          $('#lfb_formFields [name="labelRangeBetween"]').val(
            settings.texts.labelRangeBetween
          );
          $('#lfb_formFields [name="labelRangeAnd"]').val(
            settings.texts.labelRangeAnd
          );
          $('#lfb_formFields [name="txt_invoice"]').val(
            settings.texts.txt_invoice
          );
          $('#lfb_formFields [name="txt_quotation"]').val(
            settings.texts.txt_quotation
          );
          $('#lfb_formFields [name="saveForLaterLabel"]').val(
            settings.texts.saveForLaterLabel
          );
          $('#lfb_formFields [name="saveForLaterDelLabel"]').val(
            settings.texts.saveForLaterDelLabel
          );
          $('#lfb_formFields [name="txt_emailActivationCode"]').val(
            settings.texts.txt_emailActivationCode
          );
          $('#lfb_formFields [name="txt_emailActivationInfo"]').val(
            settings.texts.txt_emailActivationInfo
          );
          $('#lfb_formFields [name="enableEmailPaymentText"]').val(
            settings.texts.enableEmailPaymentText
          );
          $('#lfb_formFields [name="txt_stripe_title"]').val(
            settings.texts.txt_stripe_title
          );
          $('#lfb_formFields [name="txt_stripe_btnPay"]').val(
            settings.texts.txt_stripe_btnPay
          );
          $('#lfb_formFields [name="txt_stripe_totalTxt"]').val(
            settings.texts.txt_stripe_totalTxt
          );
          $('#lfb_formFields [name="txt_stripe_cardOwnerLabel"]').val(
            settings.texts.txt_stripe_cardOwnerLabel
          );
          $('#lfb_formFields [name="txt_stripe_paymentFail"]').val(
            settings.texts.txt_stripe_paymentFail
          );
          $('#lfb_formFields [name="txt_payFormFinalTxt"]').val(
            settings.texts.txt_payFormFinalTxt
          );
          $('#lfb_formFields [name="txt_btnPaypal"]').val(
            settings.texts.txt_btnPaypal
          );
          $('#lfb_formFields [name="txt_btnStripe"]').val(
            settings.texts.txt_btnStripe
          );
          $('#lfb_formFields [name="txtForgotPassLink"]').val(
            settings.texts.txtForgotPassLink
          );
          $('#lfb_formFields [name="txtForgotPassSent"]').val(
            settings.texts.txtForgotPassSent
          );
        } else {
          console.error("Invalid settings object or missing countryCode");
        }
      },
    });
  }

  function lfb_saveBackendTheme() {
    const backendTheme = $('#lfb_winBackendTheme [name="backendTheme"]').val();
    const bgGradient = $(
      '#lfb_winBackendTheme [name="backend_bgGradient"]'
    ).val();
    lfb_showLoader();

    hideModal($("#lfb_winBackendTheme"));

    $.ajax({
      url: ajaxurl,
      type: "post",
      data: {
        action: "lfb_saveBackendTheme",
        backendTheme: backendTheme,
        bgGradient: bgGradient,
      },
      success: function (rep) {
        $("#lfb_loader").fadeOut();
        $("#lfb_loaderText").html("");
        lfb_notification(lfb_data.texts["backendThemeChanged"], false, true);
      },
    });
  }
})(jQuery);
