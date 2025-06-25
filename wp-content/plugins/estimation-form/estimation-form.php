<?php

/*
 * Plugin Name: WP Cost Estimation & Payment Forms Builder 
 * Version: 100.2.3
 *
 * Plugin URI: http://codecanyon.net/item/wp-cost-estimation-payment-forms-builder/7818230
 * Description: This awesome plugin allows you to create easily beautiful cost estimation & payment forms on your Wordpress website
 * Author: Biscay Charly (loopus)
 * Author URI: http://www.loopus-plugins.com/
 * Requires at least: 3.8
 * Tested up to: 6.7.2
 *
 * @package WordPress
 * @author Biscay Charly (loopus)
 * @since 1.0.0 
 */

if (!defined('ABSPATH'))
    exit;

register_activation_hook(__FILE__, 'lfb_install');
register_deactivation_hook(__FILE__, 'lfb_deactivate');
register_uninstall_hook(__FILE__, 'lfb_uninstall');


global $jal_db_version;
$jal_db_version = "1.1";


if (!class_exists("GetResponseEP", false)) {
    require_once('includes/getResponse/GetResponse.php');
}

require_once('includes/lfb_core.php');
require_once('includes/lfb_admin.php');

function lfb_init_ep_form()
{
    update_option("lfb_themeMode", false);
    $version = 10.230;
    lfb_checkDBUpdates($version);
    update_option("lfb_free", false);
    $instance = lfb_Core::instance(__FILE__, $version);
    if (is_null($instance->menu)) {
        $instance->menu = lfb_Admin::instance($instance);
    }

    return $instance;
}

/**
 * Installation. Runs on activation.
 * @access  public
 * @since   1.0.0
 * @return  void
 */
function lfb_install()
{
    global $wpdb;
    global $jal_db_version;
    if (file_exists(ABSPATH . 'wp-admin/includes/upgrade.php')) {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    }

    if(is_plugin_active('WP_Estimation_Form_Free/estimation-form.php')){
        deactivate_plugins('WP_Estimation_Form_Free/estimation-form.php');
    }    

    add_option("jal_db_version", $jal_db_version);

    $db_table_name = $wpdb->prefix . "lfb_forms";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		title TEXT NOT NULL,
                errorMessage TEXT NOT NULL,
                intro_enabled BOOL NOT NULL,
                emptyWooCart BOOL NOT NULL,
                save_to_cart BOOL NOT NULL,
                save_to_cart_edd BOOL NOT NULL,
                use_paypal BOOL NOT NULL,
                paypal_email TEXT NOT NULL,
                paypal_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
                paypal_useIpn BOOL NOT NULL,
                paypal_useSandbox BOOL NOT NULL,
                paypal_subsFrequency SMALLINT(5) NOT NULL DEFAULT 1,
                paypal_subsFrequencyType VARCHAR(1) NOT NULL DEFAULT 'M',
                paypal_subsMaxPayments SMALLINT(5) NOT NULL DEFAULT 0,
                paypal_languagePayment TINYTEXT NOT NULL DEFAULT '',
                use_stripe BOOL NOT NULL,
                stripe_useSandbox BOOL NOT NULL,
                stripe_secretKey TEXT NOT NULL,
                stripe_publishKey TEXT NOT NULL,
                stripe_currency TINYTEXT NOT NULL,
                stripe_subsFrequency SMALLINT(5) NOT NULL DEFAULT 1,
                stripe_subsFrequencyType VARCHAR(16) NOT NULL DEFAULT 'month',  
                stripe_logoImg TEXT NOT NULL,
                use_razorpay BOOL NOT NULL,
                razorpay_useSandbox BOOL NOT NULL,
                razorpay_secretKey TEXT NOT NULL,
                razorpay_publishKey TEXT NOT NULL,
                razorpay_currency VARCHAR(6) NOT NULL DEFAULT 'INR',
                razorpay_subsFrequency SMALLINT(5) NOT NULL DEFAULT 1,
                razorpay_subsFrequencyType VARCHAR(16) NOT NULL DEFAULT 'monthly', 
                razorpay_logoImg TEXT NOT NULL, 
                isSubscription BOOL NOT NULL,
                subscription_text TEXT NOT NULL,
                close_url TEXT NOT NULL,
                btn_step TEXT NOT NULL,
                previous_step TEXT NOT NULL,
                intro_title TEXT NOT NULL,
                intro_text TEXT NOT NULL,
                intro_btn TEXT NOT NULL,
                intro_image TEXT NOT NULL,
                last_title TEXT NOT NULL,
                last_text TEXT NOT NULL,
                last_btn TEXT NOT NULL,
                last_msg_label TEXT NOT NULL,
                initial_price FLOAT NOT NULL,
                max_price FLOAT NOT NULL,
                succeed_text TEXT NOT NULL,
                email_name TEXT NOT NULL,
                email TEXT NOT NULL,
                email_adminContent LONGTEXT NOT NULL,
                email_subject TEXT NOT NULL,
                email_toUser BOOL NOT NULL,
                email_userSubject TEXT NOT NULL,
                email_userContent LONGTEXT NOT NULL,
                emailCustomerLinks BOOL NOT NULL DEFAULT 0,                
                gravityFormID INT(9) NOT NULL,
                animationsSpeed FLOAT NOT NULL DEFAULT 0.5,
                showSteps SMALLINT(5) NOT NULL,
                qtType SMALLINT(9) NOT NULL,
                show_initialPrice BOOL NOT NULL,
                ref_root VARCHAR(32) NOT NULL DEFAULT 'A000',
                current_ref INT(9) NOT NULL DEFAULT 1,
                colorA TINYTEXT NOT NULL,
                colorB TINYTEXT NOT NULL,
                colorC TINYTEXT NOT NULL,
                colorBg TINYTEXT NOT NULL,
                colorSecondary TINYTEXT NOT NULL,
                colorSecondaryTxt TINYTEXT NOT NULL,
                colorCbCircle TINYTEXT NOT NULL,
                colorCbCircleOn TINYTEXT NOT NULL,
                colorPageBg TINYTEXT NOT NULL,
                item_pictures_size SMALLINT(9) NOT NULL,
                hideFinalPrice BOOL NOT NULL DEFAULT 0,
                priceFontSize SMALLINT NOT NULL DEFAULT 18,
                customCss LONGTEXT NOT NULL,
                disableTipMobile BOOL NOT NULL,
                legalNoticeContent LONGTEXT NOT NULL,
                legalNoticeTitle TEXT NOT NULL,
                legalNoticeEnable BOOL NOT NULL,
                datepickerLang VARCHAR(16)  NOT NULL,
         	    percentToPay FLOAT DEFAULT 100,
                currency TEXT NOT NULL,
                currencyPosition TEXT NOT NULL,
                thousandsSeparator VARCHAR(4) NOT NULL,
                decimalsSeparator VARCHAR(4) NOT NULL,
                millionSeparator VARCHAR(4) NOT NULL,
                billionsSeparator VARCHAR(4) NOT NULL,
                useSummary BOOL NOT NULL,
                summary_title TEXT NOT NULL,
                summary_description TEXT NOT NULL,
                summary_quantity TEXT NOT NULL,
                summary_price TEXT NOT NULL,
                summary_total TEXT NOT NULL,
                summary_value TEXT NOT NULL,
                summary_discount TEXT NOT NULL,
                summary_hideQt BOOL NOT NULL,
                summary_hideZero BOOL NOT NULL,
                summary_hideZeroQt BOOL NOT NULL,
                summary_hideZeroDecimals BOOL NOT NULL,
                summary_hidePrices BOOL NOT NULL,
                summary_hideTotal BOOL NOT NULL,
                summary_hideFinalStep BOOL NOT NULL DEFAULT 1,
                summary_showAllPricesEmail BOOL NOT NULL DEFAULT 0,
                summary_showDescriptions BOOL NOT NULL DEFAULT 0,
                summary_hideStepsRows BOOL NOT NULL DEFAULT 0,
                enableFloatingSummary BOOL NOT NULL DEFAULT 0,
                floatSummary_icon TEXT NOT NULL,
                floatSummary_label TEXT NOT NULL,
                floatSummary_numSteps BOOL NOT NULL DEFAULT 0,
                floatSummary_hidePrices BOOL NOT NULL DEFAULT 0,
                groupAutoClick BOOL NOT NULL,
                useCoupons BOOL NOT NULL,
                inverseGrayFx BOOL NOT NULL,                
                couponText TEXT NOT NULL,
                useMailchimp BOOL NOT NULL,
                mailchimpKey TEXT NOT NULL,
                mailchimpList TEXT NOT NULL,
                mailchimpOptin BOOL NOT NULL,
                useMailpoet BOOL NOT NULL,
                mailPoetList TEXT NOT NULL,
                useGetResponse BOOL NOT NULL,
                getResponseKey TEXT NOT NULL,
                getResponseList TEXT NOT NULL,
                loadAllPages BOOL NOT NULL,
                filesUpload_text TEXT NOT NULL,
                filesUploadSize_text TEXT NOT NULL,
                filesUploadType_text TEXT NOT NULL,      
                filesUploadLimit_text TEXT NOT NULL,
                useGoogleFont BOOL NOT NULL DEFAULT 1,
                googleFontName TEXT NOT NULL,
                analyticsID TEXT NOT NULL,
                sendPdfCustomer BOOL NOT NULL, 
                sendPdfAdmin BOOL NOT NULL, 
                sendContactASAP BOOL NOT NULL,
                showTotalBottom BOOL NOT NULL,
                stripe_label_creditCard TEXT NOT NULL,
                stripe_label_cvc TEXT NOT NULL,
                stripe_label_expiration TEXT NOT NULL,  
                scrollTopMargin INT(9) NOT NULL,
                scrollTopMarginMobile SMALLINT(5) NOT NULL,
                redirectionDelay INT(9) NOT NULL DEFAULT 5,
                useRedirectionConditions BOOL NOT NULL DEFAULT 0,
                gmap_key TEXT NOT NULL,
                txtDistanceError TEXT NOT NULL,
                customJS TEXT NOT NULL,
                disableDropdowns BOOL NOT NULL DEFAULT 1,                
                usedCssFile TEXT NOT NULL,
                formStyles LONGTEXT NOT NULL,
                columnsWidth SMALLINT(5) NOT NULL,
                inlineLabels BOOL NOT NULL DEFAULT 0,
                previousStepBtn BOOL NOT NULL DEFAULT 0,
                alignLeft BOOL NOT NULL DEFAULT 0,
                totalIsRange BOOL NOT NULL DEFAULT 0,
                totalRange SMALLINT(5) NOT NULL DEFAULT 100,
                totalRangeMode VARCHAR(16) NOT NULL DEFAULT '',
                labelRangeBetween VARCHAR(128) NOT NULL DEFAULT 'between',
                labelRangeAnd VARCHAR(128) NOT NULL DEFAULT 'and',                
                useCaptcha  BOOL NOT NULL DEFAULT 0,
                captchaLabel VARCHAR(250) NOT NULL DEFAULT 'Please rewrite the following text in the field',
                summary_noDecimals BOOL NOT NULL DEFAULT 0, 
                summary_stepsClickable  BOOL NOT NULL DEFAULT 0, 
                scrollTopPage BOOL NOT NULL DEFAULT 0,                 
         	stripe_percentToPay FLOAT DEFAULT 100,             
         	razorpay_percentToPay FLOAT DEFAULT 100,                
                nextStepButtonIcon TEXT NOT NULL,
                previousStepButtonIcon TEXT NOT NULL,
                finalButtonIcon TEXT NOT NULL,
                introButtonIcon TEXT NOT NULL,
                imgIconStyle TEXT NOT NULL,
                timeModeAM BOOL NOT NULL DEFAULT 1,
                fieldsPreset TEXT NOT NULL,
                enableFlipFX BOOL NOT NULL DEFAULT 1,
                enableShineFxBtn BOOL NOT NULL DEFAULT 1,
                paymentType TEXT NOT NULL, 
                enableEmailPaymentText TEXT NOT NULL,
                emailPaymentType TEXT NOT NULL, 
                txt_invoice TEXT NOT NULL,  
                txt_quotation TEXT NOT NULL,  
                txt_payFormFinalTxt TEXT NOT NULL,                               
                stripe_payMode TEXT NOT NULL,                         
                stripe_fixedToPay FLOAT DEFAULT 100,      
                paypal_payMode TEXT NOT NULL,                         
                paypal_fixedToPay FLOAT DEFAULT 100,     
                razorpay_payMode TEXT NOT NULL,                         
                razorpay_fixedToPay FLOAT DEFAULT 100,                     
                disableLinksAnim BOOL NOT NULL DEFAULT 0,
                imgTitlesStyle TEXT NOT NULL,
                sendEmailLastStep BOOL NOT NULL DEFAULT 0,
                enableSaveForLaterBtn BOOL NOT NULL DEFAULT 0,
                saveForLaterLabel TEXT NOT NULL DEFAULT '',
                saveForLaterDelLabel VARCHAR(64) NOT NULL DEFAULT 'Delete backup',                
                saveForLaterIcon VARCHAR(64) NOT NULL DEFAULT 'fa fa-floppy',
                lastSave TEXT NOT NULL,
                pdf_userContent LONGTEXT NOT NULL,
                pdf_adminContent LONGTEXT NOT NULL,
                mainTitleTag VARCHAR(6) NOT NULL DEFAULT 'h1',
                stepTitleTag VARCHAR(6) NOT NULL DEFAULT 'h2',
                enableCustomersData BOOL NOT NULL DEFAULT 0,
                customersDataEmailLink LONGTEXT NOT NULL,
                sendUrlVariables BOOL NOT NULL DEFAULT 0,
                sendVariablesMethod VARCHAR(12) NOT NULL DEFAULT '',
                enableZapier BOOL NOT NULL DEFAULT 0,
                zapierWebHook TEXT NOT NULL DEFAULT '',
                randomSeed VARCHAR(64) NOT NULL DEFAULT '',
                disableGrayFx BOOL NOT NULL DEFAULT 0,   
                txt_btnPaypal TEXT NOT NULL,
                txt_btnStripe TEXT NOT NULL,
                txt_stripe_title TEXT NOT NULL,
                txt_stripe_btnPay TEXT NOT NULL,                
                txt_stripe_totalTxt TEXT NOT NULL,
                txt_stripe_paymentFail TEXT NOT NULL, 
                txt_stripe_cardOwnerLabel TEXT NOT NULL,  
                txt_btnRazorpay TEXT NOT NULL,                 
                wooShowFormTitles BOOL NOT NULL DEFAULT 1,
                progressBarPriceType TEXT,  
                tooltip_width SMALLINT(5) NOT NULL DEFAULT 200,
                useEmailVerification BOOL NOT NULL DEFAULT 0,
                emailVerificationContent TEXT NOT NULL,
                txt_emailActivationInfo TEXT NOT NULL,
                txt_emailActivationCode TEXT NOT NULL,
                emailVerificationSubject TEXT NOT NULL,
                recaptcha3Key TEXT NOT NULL,
                recaptcha3KeySecret TEXT NOT NULL,
                defaultStatus TEXT NOT NULL,
                distancesMode TEXT NOT NULL,
                txtForgotPassSent TEXT NOT NULL,
                txtForgotPassLink TEXT NOT NULL,
                backgroundImg TEXT NOT NULL,
                enablePdfDownload BOOL NOT NULL DEFAULT 0,
                pdfDownloadFilename TEXT NOT NULL,
                useSignature BOOL NOT NULL,
                txtSignature TEXT NOT NULL,
                useVAT BOOL NOT NULL DEFAULT 0,
                vatAmount FLOAT NOT NULL,
                vatLabel TEXT NOT NULL,
                floatSummary_showInfo BOOL NOT NULL,
                autocloseDatepicker  BOOL NOT NULL,
                sendSummaryToWoo BOOL NOT NULL,
                color_summaryTheadBg VARCHAR(7) NOT NULL DEFAULT '#1abc9c',  
                color_summaryTheadTxt VARCHAR(7) NOT NULL DEFAULT '#ffffff',  
                color_summaryTbodyBg VARCHAR(7) NOT NULL DEFAULT '#ffffff',  
                color_summaryTbodyTxt VARCHAR(7) NOT NULL DEFAULT '#bdc3c7',  
                color_summaryStepBg VARCHAR(7) NOT NULL DEFAULT '#bdc3c7',  
                color_summaryStepTxt VARCHAR(7) NOT NULL DEFAULT '#ffffff',  
                color_summaryFooterBg VARCHAR(7) NOT NULL DEFAULT '#ffffff',  
                color_summaryFooterTxt VARCHAR(7) NOT NULL DEFAULT '#16a085',  
                hideFinalbtn BOOL NOT NULL,
                color_fieldsBg VARCHAR(7) NOT NULL DEFAULT '#ffffff',  
                color_fieldsBorder VARCHAR(7) NOT NULL DEFAULT '#bdc3c7',  
                color_fieldsBorderFocus VARCHAR(7) NOT NULL DEFAULT '#1abc9c',  
                color_fieldsText VARCHAR(7) NOT NULL DEFAULT '#bdc3c7',  
                color_fieldsBorderText VARCHAR(7) NOT NULL DEFAULT '#bdc3c7',                
                useVisualBuilder BOOL NOT NULL DEFAULT 1,   
                color_btnBg VARCHAR(7) NOT NULL DEFAULT '#1abc9c',
                color_btnText VARCHAR(7) NOT NULL DEFAULT '#ffffff',
                color_progressBar VARCHAR(7) NOT NULL DEFAULT '#ebedef',                
                color_progressBarA VARCHAR(7) NOT NULL DEFAULT '#ebedef',
                color_progressBarB VARCHAR(7) NOT NULL DEFAULT '#ebedef',
                labelFontSize SMALLINT DEFAULT 16,
                columnsGap SMALLINT DEFAULT 0,
                gradientBg BOOL NOT NULL DEFAULT 0,
                colorGradientBg1 VARCHAR(7) NOT NULL DEFAULT '#ecf0f1',
                colorGradientBg2 VARCHAR(7) NOT NULL DEFAULT '#bdc3c7',
                bcc_email TEXT NOT NULL,                
                disableScroll BOOL NOT NULL,
                dontStoreOrders BOOL NOT NULL DEFAULT 0,
                color_datepickerDisabledDates VARCHAR(7) NOT NULL DEFAULT '#777',
                color_datepickerDates VARCHAR(7) NOT NULL DEFAULT '#ffffff',
                color_datepickerBg VARCHAR(7) NOT NULL DEFAULT '#1abc9c',
                verifyEmail BOOL NOT NULL DEFAULT 0,
            UNIQUE KEY id (id)
            ) $charset_collate;";
            dbDelta($sql);
        }



    $db_table_name = $wpdb->prefix . "lfb_steps";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
    		formID mediumint (9) NOT NULL,
    		start BOOL  NOT NULL DEFAULT 0,
    		title VARCHAR(120) NOT NULL,
    		content TEXT NOT NULL,
    		ordersort mediumint(9) NOT NULL,
    		itemRequired BOOL  NOT NULL DEFAULT 0,
    		itemDepend SMALLINT(5) NOT NULL,
    		interactions TEXT NOT NULL,
    		description TEXT NOT NULL,
    		showInSummary BOOL  NOT NULL DEFAULT 1,
            itemsPerRow TINYINT(2) NOT NULL,
            useShowConditions BOOL NOT NULL,
            showConditions LONGTEXT NOT NULL,
            showConditionsOperator VARCHAR(8) NOT NULL,
            hideNextStepBtn  BOOL NOT NULL,
            imagesSize SMALLINT(5) NOT NULL DEFAULT 0,
            maxWidth SMALLINT(4) NOT NULL DEFAULT 0,
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_logs";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
    		formID mediumint (9) NOT NULL,
    		customerID mediumint (9) NOT NULL,
    		ref VARCHAR(120) NOT NULL,
    		email VARCHAR(250) NOT NULL,
                adminEmailSubject TEXT NOT NULL,
                userEmailSubject TEXT NOT NULL,
    		content MEDIUMTEXT NOT NULL,
                contentUser LONGTEXT NOT NULL,
    		pdfContent LONGTEXT NOT NULL,
                pdfContentUser LONGTEXT NOT NULL,
                contentTxt LONGTEXT NOT NULL,
                dateLog VARCHAR(64) NOT NULL,
                sendToUser BOOL NOT NULL,
                checked BOOL NOT NULL,
                phone VARCHAR(120) NOT NULL,
                firstName VARCHAR(250) NOT NULL,
                lastName VARCHAR(250) NOT NULL,
                address TEXT NOT NULL,
                city VARCHAR(250) NOT NULL,
                country VARCHAR(250) NOT NULL,
                state VARCHAR(250) NOT NULL,
                zip VARCHAR(128) NOT NULL,
                totalText TEXT NOT NULL,
                totalPrice FLOAT NOT NULL,
                totalSubscription FLOAT NOT NULL,
                subscriptionFrequency VARCHAR(64) NOT NULL,
                formTitle VARCHAR(250) NOT NULL,
                paid BOOL NOT NULL,
                paymentKey VARCHAR(250) NOT NULL DEFAULT '',
                finalUrl VARCHAR(250) NOT NULL DEFAULT '',
                eventsData LONGTEXT NOT NULL,      
                sessionF VARCHAR(250) NOT NULL DEFAULT '',
                currency VARCHAR (32) NOT NULL,
                currencyPosition VARCHAR (32) NOT NULL,
                thousandsSeparator VARCHAR(4) NOT NULL,
                decimalsSeparator VARCHAR(4) NOT NULL,
                millionSeparator VARCHAR(4) NOT NULL,
                billionsSeparator VARCHAR(4) NOT NULL,
                status VARCHAR(32) NOT NULL DEFAULT 'completed',
                vatLabel VARCHAR(16) NOT NULL DEFAULT 'V.A.T',
                vatAmount FLOAT NOT NULL,
                vatPrice FLOAT NOT NULL,   
                company TEXT NOT NULL,     
                payMethod TEXT NOT NULL,
                discountCode TEXT NOT NULL,
                selectedItems  LONGTEXT NOT NULL,         
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_items";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                title VARCHAR(250) NOT NULL,
                description TEXT NOT NULL,
                alias TEXT NOT NULL,
                ordersort mediumint(9) NOT NULL,
                image VARCHAR(250) NOT NULL,
                imageDes VARCHAR(250) NOT NULL,
                groupitems VARCHAR(120) NOT NULL,
                type VARCHAR(120) NOT NULL,
                stepID mediumint(9) NOT NULL,
                formID mediumint(9) NOT NULL,
                price FLOAT NOT NULL,
                operation VARCHAR(1) NOT NULL DEFAULT '+',
                ischecked BOOL NOT NULL,
                isRequired BOOL NOT NULL,
                quantity_enabled BOOL NOT NULL,
                quantity_max INT(11)  NOT NULL,
                quantity_min INT(11)  NOT NULL,
                quantity_default SMALLINT(5) NOT NULL,
                reduc_enabled BOOL NOT NULL,
                reduc_qt SMALLINT(5) NOT NULL,
                reduc_value FLOAT NOT NULL,
                reducsQt LONGTEXT NOT NULL,
                isWooLinked BOOL NOT NULL,
                wooProductID INT(11)  NOT NULL,
                wooVariation INT(11)  NOT NULL,
                eddProductID INT(11)  NOT NULL,
                eddVariation INT(11)  NOT NULL,
                imageTint BOOL  NOT NULL,
                showPrice BOOL NOT NULL,
                useRow BOOL NOT NULL,
                optionsValues LONGTEXT NOT NULL,
                urlTarget TEXT,
                showInSummary BOOL DEFAULT 1,
                richtext TEXT NOT NULL,
                isHidden BOOL NOT NULL,
                minSize FLOAT NOT NULL,
                maxSize FLOAT NOT NULL,
                isNumeric BOOL NOT NULL,
                isSinglePrice BOOL NOT NULL,
                maxFiles SMALLINT(9) NOT NULL,
                allowedFiles VARCHAR(250) NOT NULL DEFAULT '.png,.jpg,.jpeg,.gif,.zip,.rar',
                useCalculation BOOL NOT NULL,
                calculation LONGTEXT NOT NULL,
                fieldType VARCHAR(64) NOT NULL,
                useShowConditions BOOL NOT NULL,
                showConditions LONGTEXT NOT NULL,
                showConditionsOperator VARCHAR(8) NOT NULL,
                usePaypalIfChecked BOOL NOT NULL,
                dontUsePaypalIfChecked BOOL NOT NULL,                
                useDistanceAsQt BOOL NOT NULL,
                distanceQt VARCHAR(250) NOT NULL,
                hideQtSummary BOOL NOT NULL,
                hidePriceSummary BOOL NOT NULL,
                defaultValue TEXT NOT NULL,
                fileSize INT(9) NOT NULL DEFAULT 25,
                firstValueDisabled BOOL NOT NULL,
                sliderStep FLOAT NOT NULL DEFAULT 1,
                date_allowPast BOOL NOT NULL,
                date_showMonths BOOL NOT NULL,
                date_showYears BOOL NOT NULL,     
                shortcode LONGTEXT NOT NULL,
                minTime VARCHAR(16) NOT NULL,
                maxTime VARCHAR(16) NOT NULL,
                dontAddToTotal BOOL NOT NULL,
                useCalculationQt BOOL NOT NULL,
                calculationQt LONGTEXT NOT NULL,
                placeholder VARCHAR(250) NOT NULL,
                validation VARCHAR(64) NOT NULL,
                validationMin SMALLINT(5) NOT NULL,
                validationMax SMALLINT(5) NOT NULL,                
                validationCaracts VARCHAR(250) NOT NULL,    
                icon VARCHAR(128) NOT NULL,
                iconPosition BOOL NOT NULL,
                maxWidth SMALLINT(5) NOT NULL,
                maxHeight SMALLINT(5) NOT NULL,
                autocomplete BOOL NOT NULL,
                urlTargetMode VARCHAR(64) NOT NULL DEFAULT '_blank',
                color VARCHAR(64) NOT NULL DEFAULT '#1abc9c',
                callNextStep BOOL NOT NULL DEFAULT 0,
                useValueAsQt BOOL NOT NULL DEFAULT 0,
                dateType VARCHAR(32) NOT NULL DEFAULT 'date', 
                calendarID MEDIUMINT(9) NOT NULL DEFAULT 0,                
                eventDuration SMALLINT(5) NOT NULL DEFAULT 1,
                eventDurationType VARCHAR(25) NOT NULL DEFAULT 'hours', 
                eventCategory SMALLINT(5) NOT NULL DEFAULT 1, 
                eventTitle VARCHAR(250) NOT NULL DEFAULT 'New event',
                registerEvent BOOL NOT NULL DEFAULT 0,
                eventBusy BOOL NOT NULL DEFAULT 0,
                useAsDateRange BOOL NOT NULL DEFAULT 0,
                endDaterangeID MEDIUMINT(9) NOT NULL DEFAULT 0, 
                disableMinutes BOOL NOT NULL DEFAULT 0,
                tooltipText LONGTEXT NOT NULL,
                sendAsUrlVariable BOOL NOT NULL DEFAULT 1,
                variableName VARCHAR(128) NOT NULL DEFAULT '',
                priceMode VARCHAR(4) NOT NULL DEFAULT '',
                buttonText VARCHAR(128) NOT NULL DEFAULT '',
                hideInSummaryIfNull BOOL NOT NULL DEFAULT 0,
                checkboxStyle VARCHAR(16) NOT NULL DEFAULT 'switchbox',
                visibleTooltip BOOL NOT NULL DEFAULT 0,
                tooltipImage TEXT NOT NULL,
                mask TEXT NOT NULL,
                modifiedVariableID SMALLINT(5) NOT NULL DEFAULT 0,
                variableCalculation TEXT NOT NULL,
                maxEvents SMALLINT(4) NOT NULL DEFAULT 1,
                shadowFX BOOL NOT NULL DEFAULT 0,
                startDateDays SMALLINT(4) NOT NULL DEFAULT 0,         
                notes TEXT NOT NULL,
                isCountryList BOOL NOT NULL DEFAULT 0,     
                columns TEXT NOT NULL,    
                columnID TEXT NOT NULL,
                numValue TINYINT(2) NOT NULL DEFAULT 3,
                sentAttribute TEXT NOT NULL,
                mapType TEXT NOT NULL,
                mapStyle TEXT NOT NULL,
                address TEXT NOT NULL,
                mapZoom TINYINT(2) NOT NULL DEFAULT 1,
                imageType TEXT NOT NULL,
                useCurrentWooProduct BOOL NOT NULL DEFAULT 0,
                isRange BOOL NOT NULL,
                minDatepicker mediumint(9) NOT NULL DEFAULT 0,
                alignment TINYINT(1) NOT NULL DEFAULT 0,
                hideInfoColumn BOOL NOT NULL DEFAULT 0,
                readonly BOOL NOT NULL DEFAULT 0,
                videoCode TEXT NOT NULL,
                prefillVariable  TEXT NOT NULL,
                showInCsv BOOL NOT NULL DEFAULT 0,
                csvTitle TINYTEXT NOT NULL,
                cssClasses TEXT NOT NULL,                
                customQtSelector BOOL NOT NULL DEFAULT 0,
  		UNIQUE KEY id (id)
		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_links";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
    		formID mediumint (9) NOT NULL,
    		originID INT(9) NOT NULL,
    		destinationID INT(9) NOT NULL,
    		conditions TEXT NOT NULL,
                operator VARCHAR(8) NOT NULL,
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }


    $db_table_name = $wpdb->prefix . "lfb_fields";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		    id mediumint(9) NOT NULL AUTO_INCREMENT,
                    formID SMALLINT(5) NOT NULL,
    		    label VARCHAR(120) NOT NULL,
    		    ordersort mediumint(9) NOT NULL,
    		    isRequired BOOL NOT NULL,
    		    typefield VARCHAR(32) NOT NULL,
    		    visibility VARCHAR(32) NOT NULL,
                    validation VARCHAR(64) NOT NULL,
                    fieldType VARCHAR(64) NOT NULL,
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_settings";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
  		id mediumint(9) NOT NULL AUTO_INCREMENT,
  		purchaseCode VARCHAR(250) NOT NULL,
  		previewHeight SMALLINT(5) NOT NULL DEFAULT 300,
        tdgn_enabled BOOL NOT NULL,
        firstStart BOOL NOT NULL DEFAULT 1,
        customerDataAdminEmail VARCHAR(250) NOT NULL DEFAULT 'your@email.here',
        txtCustomersDataWarningText LONGTEXT NOT NULL,
        txtCustomersDataDownloadLink VARCHAR(250) NOT NULL DEFAULT 'Download my data as JSON',
        txtCustomersDataDeleteLink VARCHAR(250)NOT NULL DEFAULT 'Delete all my data',
        txtCustomersDataLeaveLink VARCHAR(250) NOT NULL DEFAULT 'Sign out',
        txtCustomersDataEditLink VARCHAR(250) NOT NULL DEFAULT 'Modify my data',
        customersDataDeleteDelay SMALLINT(5) NOT NULL DEFAULT 3,  
        txtCustomersDataTitle VARCHAR(250) NOT NULL DEFAULT 'Manage my data',  
        customersDataLabelEmail VARCHAR(250) NOT NULL DEFAULT 'Your email', 
        customersDataLabelPass VARCHAR(250) NOT NULL DEFAULT 'Your password', 
        customersDataLabelModify VARCHAR(250) NOT NULL DEFAULT 'What data do you want to edit ?',    
        txtCustomersDataForgotPassLink VARCHAR(250) NOT NULL DEFAULT 'Send me my password', 
        txtCustomersDataForgotPassSent VARCHAR(250) NOT NULL DEFAULT 'Your password has been sent by email', 
        txtCustomersDataForgotMailSubject  VARCHAR(250) NOT NULL DEFAULT 'Here is your password', 
        txtCustomersDataForgotPassMail LONGTEXT NOT NULL, 
        txtCustomersDataModifyValidConfirm VARCHAR(250) NOT NULL DEFAULT 'Your request has been sent and will be processed as soon as possible', 
        txtCustomersDataModifyMailSubject VARCHAR(250) NOT NULL DEFAULT 'Data modification request from a customer', 
        txtCustomersDataDeleteMailSubject VARCHAR(250) NOT NULL DEFAULT 'Data deletion request from a customer',           
        txtCustomersAccountCreated  LONGTEXT NOT NULL,
        txtCustomersAccountCreatedSubject  VARCHAR(250) NOT NULL DEFAULT 'New account created', 
        encryptDB BOOL NOT NULL DEFAULT 1,  
        enableCustomerAccount BOOL NOT NULL DEFAULT 0,
        customerAccountPageID mediumint(9) NOT NULL DEFAULT 0,
        customersDataLabelBtnLogin VARCHAR(250) NOT NULL DEFAULT 'Login',
        customersAc_firstName VARCHAR(64) NOT NULL DEFAULT 'First name', 
        customersAc_lastName VARCHAR(64) NOT NULL DEFAULT 'Last name', 
        customersAc_email VARCHAR(64) NOT NULL DEFAULT 'Email',
        customersAc_address VARCHAR(64) NOT NULL DEFAULT 'Address',
        customersAc_city VARCHAR(64) NOT NULL DEFAULT 'City',
        customersAc_zip VARCHAR(64) NOT NULL DEFAULT 'Postal code',
        customersAc_state VARCHAR(64) NOT NULL DEFAULT 'State',
        customersAc_country VARCHAR(64) NOT NULL DEFAULT 'Country',
        customersAc_phone VARCHAR(64) NOT NULL DEFAULT 'Phone',
        customersAc_job VARCHAR(64) NOT NULL DEFAULT 'Job',
        customersAc_inscription VARCHAR(64) NOT NULL DEFAULT 'Inscription',
        customersAc_phoneJob VARCHAR(64) NOT NULL DEFAULT 'Job phone',
        customersAc_company VARCHAR(64) NOT NULL DEFAULT 'Company',
        customersAc_url VARCHAR(64) NOT NULL DEFAULT 'Website',
        customersAc_customerInfo VARCHAR(64) NOT NULL DEFAULT 'My information', 
        customersAc_save VARCHAR(64) NOT NULL DEFAULT 'Save',
        customersAc_sendPass VARCHAR(64) NOT NULL DEFAULT 'Send my password',
        customersAc_date VARCHAR(64) NOT NULL DEFAULT 'Date',
        customersAc_totalSub VARCHAR(64) NOT NULL DEFAULT 'Subscription cost',
        customersAc_total VARCHAR(64) NOT NULL DEFAULT 'Total cost',  
        customersAc_myOrders VARCHAR(64) NOT NULL DEFAULT 'My orders',  
        customersAc_viewOrder VARCHAR(64) NOT NULL DEFAULT 'View this order',  
        customersAc_downloadOrder VARCHAR(64) NOT NULL DEFAULT 'Download this order',       
        customersAc_status VARCHAR(64) NOT NULL DEFAULT 'Status',
        mainColor_primary VARCHAR(8) NOT NULL DEFAULT '#16a085',     
        mainColor_secondary VARCHAR(8) NOT NULL DEFAULT '#bdc3c7',     
        mainColor_warning VARCHAR(8) NOT NULL DEFAULT '#f1c40f',   
        mainColor_danger VARCHAR(8) NOT NULL DEFAULT '#e74c3c',
        mainColor_loginPanelBg VARCHAR(8) NOT NULL DEFAULT '#ecf0f1',
        mainColor_loginPanelTxt VARCHAR(8) NOT NULL DEFAULT '#444444', 
        txt_order_pending TEXT NOT NULL,
        txt_order_canceled TEXT NOT NULL,
        txt_order_beingProcessed TEXT NOT NULL,
        txt_order_shipped TEXT NOT NULL,
        txt_order_completed TEXT NOT NULL,
        useSMTP BOOL NOT NULL DEFAULT 0,
        smtp_host VARCHAR(64) NOT NULL DEFAULT 'smtp.example.com',
        smtp_port VARCHAR(6) NOT NULL DEFAULT '465',
        smtp_username VARCHAR(64) NOT NULL DEFAULT 'username',
        smtp_password TEXT NOT NULL,
        smtp_mode VARCHAR(3) NOT NULL DEFAULT 'ssl',
        useDarkMode BOOL NOT NULL DEFAULT 0,
        adminEmail VARCHAR(128) NOT NULL DEFAULT '',
        senderName VARCHAR(128) NOT NULL DEFAULT '',
        useVisualBuilder BOOL NOT NULL DEFAULT 1,                
        previewPageID BIGINT(20) NOT NULL DEFAULT 0,
        asyncJsLoad BOOL NOT NULL DEFAULT 0,
        footerJsLoad BOOL NOT NULL DEFAULT 1,
        backendTheme VARCHAR(64) NOT NULL DEFAULT 'glassmorphic',
        backend_bgGradient TEXT NOT NULL,
        debugCalculations BOOL NOT NULL DEFAULT 0,
        openAiKey VARCHAR(255) NOT NULL DEFAULT '',
        openAiModel VARCHAR(255) NOT NULL DEFAULT 'gpt-4o',        
        txtVerificationLabel TEXT NOT NULL,
        txtCodeVerificationSubject TEXT NOT NULL,
        txtCodeVerificationEmail TEXT NOT NULL,
  		UNIQUE KEY id (id)
  		) $charset_collate;";

        dbDelta($sql);


        $rows_affected = $wpdb->insert(
            $db_table_name,
            array(
                'previewHeight' => 300,
                'txt_order_pending' => 'Pending',
                'txt_order_canceled' => 'Canceled',
                'txt_order_beingProcessed' => 'Being Processed',
                'txt_order_shipped' => 'Shipped',
                'txt_order_completed' => 'Completed',
                'txtCustomersAccountCreated' => 'Hello [name],\nA new account was created for you on [url].\nHere is your password: <b>[password]</b>.Thank you for your confidence !',
                'customerDataAdminEmail' => 'your@email.here',
                'txtCustomersDataWarningText' => 'I understand and agree that deleting my data may result in the inability to process your order properly.',
                'txtCustomersDataDownloadLink' => 'Download my data as JSON',
                'txtCustomersDataDeleteLink' => 'Delete all my data',
                'txtCustomersDataLeaveLink' => 'Sign out',
                'customersDataDeleteDelay' => 3,
                'txtCustomersDataTitle' => 'Manage my data',
                'txtCustomersDataForgotPassLink' => 'Send me my password',
                'txtCustomersDataForgotPassSent' => 'Your password has been sent by email',
                'txtCustomersDataForgotMailSubject' => 'Here is your password',
                'txtCustomersDataForgotPassMail' => "Hello,\nHere is your password :\nPassword: [password]\nYou can manage your account from : [url]",
                'txtCustomersDataModifyValidConfirm' => 'Your request has been sent and will be processed as soon as possible',
                'txtCustomersDataModifyMailSubject' => 'Data modification request from a customer',
                'txtCustomersDataDeleteMailSubject' => 'Data deletion request from a customer',
                'backendTheme' => 'glassmorphic',
                'backend_bgGradient' => 'linear-gradient(to right, #8e2de2 0%, #4a00e0 100%)',
                'txtVerificationLabel' => 'Fill the code you received by email',
                'txtCodeVerificationSubject' => 'Code verification',
                'txtCodeVerificationEmail' => '<p>Here is the verification code to fill in the form to confirm your email :</p><h1>[code]</h1>'
            )
        );
    }

    $db_table_name = $wpdb->prefix . "lfb_coupons";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
  		        id mediumint(9) NOT NULL AUTO_INCREMENT,
                formID mediumint(9) NOT NULL,
                couponCode VARCHAR(250) NOT NULL,
                reduction FLOAT NOT NULL,
                reductionType VARCHAR(64) NOT NULL,
                useMax SMALLINT(5) NOT NULL DEFAULT 1,
                currentUses SMALLINT(5) NOT NULL,                
                useExpiration BOOL NOT NULL DEFAULT 0,
                expiration VARCHAR(32) NOT NULL,
  		UNIQUE KEY id (id)
  		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_redirConditions";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
    		formID mediumint (9) NOT NULL,    		
    		conditions TEXT NOT NULL,
                conditionsOperator VARCHAR(4) NOT NULL DEFAULT '+',
                url VARCHAR(250) NOT NULL,
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_layeredImages";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                formID SMALLINT(5) NOT NULL,
                itemID SMALLINT(5) NOT NULL,
                title VARCHAR(120) NOT NULL,
                ordersort mediumint(9) NOT NULL,
                image VARCHAR(250) NOT NULL,
                showConditions TEXT NOT NULL,
                showConditionsOperator VARCHAR(8) NOT NULL,           
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_calendars";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                title VARCHAR(250) NOT NULL,    	
                unavailableDays VARCHAR(32) NOT NULL DEFAULT '',
                unavailableHours VARCHAR(64) NOT NULL DEFAULT '',
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
        $rows_affected = $wpdb->insert($db_table_name, array('title' => 'Default', 'unavailableDays' => '', 'unavailableHours' => ''));
    }

    $db_table_name = $wpdb->prefix . "lfb_calendarEvents";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
                calendarID SMALLINT(5) NOT NULL,
    		title VARCHAR(250) NOT NULL,    	
                startDate DATETIME NOT NULL,	
                endDate DATETIME NOT NULL,
                fullDay BOOL NOT NULL DEFAULT 0,
                orderID MEDIUMINT(9) NOT NULL,
                customerID MEDIUMINT(9) NOT NULL,
                isBusy BOOL NOT NULL DEFAULT 1,
                notes LONGTEXT NOT NULL,
                categoryID SMALLINT(5) NOT NULL DEFAULT 1,
                customerEmail VARCHAR(250) NOT NULL DEFAULT '',
                customerAddress TEXT NOT NULL,          
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_calendarCategories";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
                calendarID SMALLINT(5) NOT NULL DEFAULT 1,
    		title VARCHAR(250) NOT NULL,    	
                color VARCHAR(64) NOT NULL DEFAULT '#1abc9c',  
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
        $rows_affected = $wpdb->insert($db_table_name, array('title' => 'Default', 'color' => '#1abc9c', 'calendarID' => 1));
    }



    $db_table_name = $wpdb->prefix . "lfb_calendarReminders";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
                calendarID mediumint(9) NOT NULL,
                eventID mediumint(9) NOT NULL,
                title VARCHAR(250) NOT NULL,
                content LONGTEXT NOT NULL,
                isSent BOOL NOT NULL DEFAULT 0,
                method VARCHAR(64) NOT NULL DEFAULT 'email',
                delayType VARCHAR(16) NOT NULL DEFAULT 'day',	
                delayValue SMALLINT(5) NOT NULL DEFAULT 1,    
                email VARCHAR(250) NOT NULL DEFAULT '',    
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    $db_table_name = $wpdb->prefix . "lfb_customers";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
                email VARCHAR(250) NOT NULL,
                password VARCHAR(250) NOT NULL,      
                verifiedEmail BOOL NOT NULL DEFAULT 0,
                phone TEXT NOT NULL,
                phoneJob TEXT NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                country TEXT NOT NULL,
                state TEXT NOT NULL,
                zip TEXT NOT NULL,
                url TEXT NOT NULL,
                company TEXT NOT NULL,
                job TEXT NOT NULL,     	
                inscriptionDate DATETIME NOT NULL,	                
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }


    $db_table_name = $wpdb->prefix . "lfb_variables";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
                formID mediumint(9) NOT NULL,
                title VARCHAR(250) NOT NULL,
                type VARCHAR(64) NOT NULL,
    		    ordersort mediumint(9) NOT NULL,
                defaultValue VARCHAR(200) NOT NULL,
                sendAsGet BOOL NOT NULL DEFAULT 0,
    		UNIQUE KEY id (id)
    		) $charset_collate;";
        dbDelta($sql);
    }

    update_option('lfbK', md5(uniqid(rand(), true)));
    global $isInstalled;
    $isInstalled = true;
}

// End install()

function lfb_setThemeMode()
{
    update_option("lfb_themeMode", true);
}

/**
 * Update database
 * @access  public
 * @since   2.0
 * @return  void
 */
function lfb_checkDBUpdates($version)
{
    global $wpdb;
    $installed_ver = get_option("lfb_version");
    if ($installed_ver === false) {
        $installed_ver = get_option("wpecf_version");
    }
    if ($installed_ver === false) {
        $installed_ver = $version;
    }

    delete_option('wpecf_version');

    if (file_exists(ABSPATH . 'wp-admin/includes/upgrade.php')) {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    }

    if (!$installed_ver || $installed_ver < 9.681) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN zapierWebHook TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN summary_title TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN summary_description TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6812) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD tooltipImage TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN urlTarget TEXT NOT NULL;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD tooltip_width SMALLINT(5) NOT NULL DEFAULT 200;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6813) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD summary_hideStepsRows BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6822) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD mask TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6823) {

        $db_table_name = $wpdb->prefix . "wpefc_variables";
        if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
            if (!empty($wpdb->charset))
                $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
            if (!empty($wpdb->collate))
                $charset_collate .= " COLLATE $wpdb->collate";

            $sql = "CREATE TABLE $db_table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
                formID mediumint(9) NOT NULL,
                title VARCHAR(250) NOT NULL,
                type VARCHAR(64) NOT NULL,
                defaultValue VARCHAR(24) NOT NULL,
    		UNIQUE KEY id (id)
    		) $charset_collate;";
            dbDelta($sql);
        }

        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD modifiedVariableID SMALLINT(5) NOT NULL DEFAULT 0;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD variableCalculation TEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.6824) {

        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD useEmailVerification BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD emailVerificationContent TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD  txt_emailActivationCode TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD  txt_emailActivationInfo TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD emailVerificationSubject TEXT NOT NULL;";
        $wpdb->query($sql);



        $forms = $wpdb->get_results("SELECT emailVerificationSubject,txt_emailActivationInfo,emailVerificationContent,txt_emailActivationCode,id FROM $table_name ORDER BY id DESC");
        foreach ($forms as $form) {
            $wpdb->update($table_name, array(
                'emailVerificationSubject' => 'Here is your email verification code',
                'txt_emailActivationInfo' => 'A unique verification code has just been sent to you by email, please copy it in the field below to validate your email address.',
                'emailVerificationContent' => '<p>Here is the verification code to fill in the form to confirm your email :</p><h1>[code]</h1>',
                'txt_emailActivationCode' => 'Fill your verifiation code here'
            ), array('id' => $form->id));
        }
    }

    if (!$installed_ver || $installed_ver < 9.6825) {

        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD recaptcha3Key TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD recaptcha3KeySecret TEXT NOT NULL;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_items";
        $items = $wpdb->get_results("SELECT showInSummary,type,id FROM $table_name WHERE type='richtext' ORDER BY id DESC");
        foreach ($items as $item) {
            $wpdb->update($table_name, array(
                'showInSummary' => 0
            ), array('id' => $item->id));
        }

        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD enableCustomerAccount BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customerAccountPageID SMALLINT(5) NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersDataLabelBtnLogin VARCHAR(250) NOT NULL DEFAULT 'Login';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_firstName VARCHAR(64) NOT NULL DEFAULT 'First name';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_lastName VARCHAR(64) NOT NULL DEFAULT 'Last name';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_email VARCHAR(64) NOT NULL DEFAULT 'Email';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_address VARCHAR(64) NOT NULL DEFAULT 'Address';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_state VARCHAR(64) NOT NULL DEFAULT 'State';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_city VARCHAR(64) NOT NULL DEFAULT 'City';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_zip VARCHAR(64) NOT NULL DEFAULT 'Postal code';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_country VARCHAR(64) NOT NULL DEFAULT 'Country';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_phone VARCHAR(64) NOT NULL DEFAULT 'Phone';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_phoneJob VARCHAR(64) NOT NULL DEFAULT 'Job phone';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_company VARCHAR(64) NOT NULL DEFAULT 'Company';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_url VARCHAR(64) NOT NULL DEFAULT 'Website';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_job VARCHAR(64) NOT NULL DEFAULT 'Job';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_inscription VARCHAR(64) NOT NULL DEFAULT 'Inscription';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_customerInfo VARCHAR(64) NOT NULL DEFAULT 'My information';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_save VARCHAR(64) NOT NULL DEFAULT 'Save';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_sendPass VARCHAR(64) NOT NULL DEFAULT 'Send my password';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_date VARCHAR(64) NOT NULL DEFAULT 'Date';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_totalSub VARCHAR(64) NOT NULL DEFAULT 'Subscription cost';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_total VARCHAR(64) NOT NULL DEFAULT 'Total cost';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_myOrders VARCHAR(64) NOT NULL DEFAULT 'My orders';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_viewOrder VARCHAR(64) NOT NULL DEFAULT 'View this order';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_downloadOrder VARCHAR(64) NOT NULL DEFAULT 'Download this order';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mainColor_primary VARCHAR(8) NOT NULL DEFAULT '#16a085';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mainColor_secondary VARCHAR(8) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mainColor_warning VARCHAR(8) NOT NULL DEFAULT '#f1c40f';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mainColor_danger VARCHAR(8) NOT NULL DEFAULT '#e74c3c';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mainColor_loginPanelBg VARCHAR(8) NOT NULL DEFAULT '#ecf0f1';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mainColor_loginPanelTxt VARCHAR(8) NOT NULL DEFAULT '#444444';";
        $wpdb->query($sql);


        $table_name = $wpdb->prefix . "wpefc_customers";
        $sql = "ALTER TABLE " . $table_name . " ADD verifiedEmail BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD phone VARCHAR(32) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD phoneJob VARCHAR(32) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD firstName VARCHAR(64) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD lastName VARCHAR(64) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD address TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD country VARCHAR(64) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD state VARCHAR(64) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD zip VARCHAR(12) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD url VARCHAR(250) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD company VARCHAR(250) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD job VARCHAR(64) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD city VARCHAR(64) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD inscriptionDate DATETIME NOT NULL;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD currency VARCHAR (32) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD currencyPosition VARCHAR (16) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD thousandsSeparator VARCHAR (4) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD decimalsSeparator VARCHAR (4) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD millionSeparator VARCHAR (4) NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD billionsSeparator VARCHAR (4) NOT NULL;";
        $wpdb->query($sql);

        $orders = $wpdb->get_results("SELECT formID,id FROM $table_name ORDER BY id DESC");
        foreach ($orders as $order) {
            $table_nameF = $wpdb->prefix . "wpefc_logs";
            $formReq = $wpdb->get_results("SELECT formID,currency,currencyPosition,thousandsSeparator,decimalsSeparator,millionSeparator,billionsSeparator FROM $table_nameF WHERE formID=" . $order->formID . " LIMIT 1");
            if (count($formReq) > 0) {
                $form = $formReq[0];
                $wpdb->update($table_name, array(
                    'currency' => $form->currency,
                    'currencyPosition' => $form->currencyPosition,
                    'thousandsSeparator' => $form->thousandsSeparator,
                    'decimalsSeparator' => $form->decimalsSeparator,
                    'millionSeparator' => $form->millionSeparator,
                    'billionsSeparator' => $form->billionsSeparator
                ), array('id' => $order->id));
            }
        }
    }

    if (!$installed_ver || $installed_ver < 9.6826) {

        $table_name = $wpdb->prefix . "wpefc_forms";

        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN txt_btnPaypal VARCHAR(64) NOT NULL DEFAULT 'Pay with Paypal';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN txt_btnStripe VARCHAR(64) NOT NULL DEFAULT 'Pay with Paypal';";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " ADD defaultStatus VARCHAR(32) NOT NULL DEFAULT 'completed';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD distancesMode VARCHAR(10) NOT NULL DEFAULT 'route';";
        $wpdb->query($sql);


        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD txt_order_pending TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txt_order_canceled TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txt_order_beingProcessed TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txt_order_shipped TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txt_order_completed TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD customersAc_status VARCHAR(64) NOT NULL DEFAULT 'Status';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD useSMTP BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD  smtp_host VARCHAR(64) NOT NULL DEFAULT 'smtp.example.com';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD smtp_port VARCHAR(6) NOT NULL DEFAULT '465';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD smtp_username VARCHAR(64) NOT NULL DEFAULT 'username';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD smtp_password TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD smtp_mode VARCHAR(3) NOT NULL DEFAULT 'ssl';";
        $wpdb->query($sql);

        $settings = $wpdb->get_results("SELECT id,txt_order_pending,txt_order_canceled,txt_order_beingProcessed,txt_order_shipped,txt_order_completed FROM $table_name WHERE id=1");
        $settings = $settings[0] ?? '';
        $wpdb->update($table_name, array(
            'txt_order_pending' => 'Pending',
            'txt_order_canceled' => 'Canceled',
            'txt_order_beingProcessed' => 'Being Processed',
            'txt_order_shipped' => 'Shipped',
            'txt_order_completed' => 'Completed',
        ), array('id' => 1));

        $table_name = $wpdb->prefix . "wpefc_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD status VARCHAR(32) NOT NULL DEFAULT 'completed';";
        $wpdb->query($sql);


        $table_name = $wpdb->prefix . "wpefc_calendarEvents";
        $sql = "ALTER TABLE " . $table_name . " ADD customerID MEDIUMINT(9) NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6827) {

        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD maxEvents SMALLINT(4) NOT NULL DEFAULT 1;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD txtForgotPassSent TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txtForgotPassLink TEXT NOT NULL;";
        $wpdb->query($sql);

        $forms = $wpdb->get_results("SELECT id,txtForgotPassSent,txtForgotPassLink FROM $table_name ORDER BY id DESC");
        foreach ($forms as $form) {
            $wpdb->update($table_name, array(
                'txtForgotPassSent' => 'Your password has been sent by email',
                'txtForgotPassLink' => 'Send me my password'
            ), array('id' => $form->id));
        }
    }

    if (!$installed_ver || $installed_ver < 9.6828) {

        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD startDateDays SMALLINT(4) NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD shadowFX BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD backgroundImg TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN floatSummary_icon VARCHAR(250) NOT NULL DEFAULT 'fas fa-shopping-cart';";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD useDarkMode BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6844) {

        $table_name = $wpdb->prefix . "wpefc_steps";
        $sql = "ALTER TABLE " . $table_name . " ADD imagesSize SMALLINT(5) NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6851) {

        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD adminEmail VARCHAR(128) NOT NULL DEFAULT '';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD senderName VARCHAR(128) NOT NULL DEFAULT '';";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6862) {

        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN customerAccountPageID mediumint(9) NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6891) {

        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD notes TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6903) {

        $table_name = $wpdb->prefix . "wpefc_customers";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN phone TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN phoneJob TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN firstName TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN lastName TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN address TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN city TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN country TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN state TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN zip TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN url TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN company TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN job TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6963) {
        $table_name = $wpdb->prefix . "wpefc_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD adminEmailSubject TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD userEmailSubject TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6972) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD legalNoticeContent LONGTEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.6993) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD enablePdfDownload BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD pdfDownloadFilename TEXT NOT NULL;";
        $wpdb->query($sql);

        $forms = $wpdb->get_results("SELECT id,pdfDownloadFilename FROM $table_name ORDER BY id DESC");
        foreach ($forms as $form) {
            $wpdb->update($table_name, array(
                'pdfDownloadFilename' => 'my-order'
            ), array('id' => $form->id));
        }
    }
    if (!$installed_ver || $installed_ver < 9.6994) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN email TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6998) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN initial_price DOUBLE NOT NULL;";
        $wpdb->query($sql);
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN price DOUBLE NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.6999) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD useSignature BOOL NOT NULL;";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " ADD txtSignature TEXT NOT NULL;";
        $wpdb->query($sql);

        $forms = $wpdb->get_results("SELECT id,txtSignature FROM $table_name ORDER BY id DESC");
        foreach ($forms as $form) {
            $wpdb->update($table_name, array(
                'txtSignature' => 'Signature'
            ), array('id' => $form->id));
        }
    }

    if (!$installed_ver || $installed_ver < 9.700) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD isCountryList BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.7015) {
        $table_name = $wpdb->prefix . "wpefc_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD totalText TEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.7069) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD columns TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD columnID TEXT NOT NULL;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD useVisualBuilder BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_steps";
        $sql = "ALTER TABLE " . $table_name . " ADD maxWidth SMALLINT(4) NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.70795) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD numValue TINYINT(2) NOT NULL DEFAULT 3;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.7103) {

        $table_name = $wpdb->prefix . "wpefc_items";
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'numValue'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD numValue TINYINT(2) NOT NULL DEFAULT 3;";
            $wpdb->query($sql);
        }
    }

    if (!$installed_ver || $installed_ver < 9.7122) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'txt_stripe_title'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD txt_stripe_title TEXT NOT NULL;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'txt_stripe_btnPay'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD txt_stripe_btnPay TEXT NOT NULL;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'txt_stripe_totalTxt'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD txt_stripe_totalTxt TEXT NOT NULL;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'txt_stripe_paymentFail'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD txt_stripe_paymentFail TEXT NOT NULL;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'txt_stripe_cardOwnerLabel'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD txt_stripe_cardOwnerLabel TEXT NOT NULL;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'txt_btnRazorpay'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD txt_btnRazorpay TEXT NOT NULL;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'wooShowFormTitles'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD wooShowFormTitles BOOL NOT NULL DEFAULT 1;";
            $wpdb->query($sql);
        }
        $row = $wpdb->get_results("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $table_name . "' AND column_name = 'wooShowFormTitles'");
        if (empty($row)) {
            $sql = "ALTER TABLE " . $table_name . " ADD progressBarPriceType VARCHAR(7) NOT NULL DEFAULT '';";
            $wpdb->query($sql);
        }
    }

    if (!$installed_ver || $installed_ver < 9.7172) {
        $table_name = $wpdb->prefix . "wpefc_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD previewPageID mediumint(9) NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.7185) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD useVAT BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD vatAmount FLOAT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD vatLabel VARCHAR(16) NOT NULL DEFAULT 'VAT';";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD vatPrice FLOAT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD vatAmount FLOAT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD vatLabel VARCHAR(16) NOT NULL DEFAULT 'VAT';";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_forms";
        $forms = $wpdb->get_results("SELECT id,vatLabel,vatAmount FROM $table_name ORDER BY id DESC");
        foreach ($forms as $form) {
            $wpdb->update($table_name, array(
                'vatLabel' => 'V.A.T',
                'vatAmount' => 20
            ), array('id' => $form->id));
        }
    }

    if (!$installed_ver || $installed_ver < 9.722) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD sentAttribute TEXT NOT NULL;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "wpefc_items";
        $items = $wpdb->get_results("SELECT sentAttribute,id,type FROM $table_name ORDER BY id DESC");
        foreach ($items as $item) {
            $attribute = 'price';
            if ($item->type == 'textfield' || $item->type == 'numberfield' || $item->type == 'slider' || $item->type == 'select' || $item->type == 'colorpicker') {
                $attribute = 'quantity';
            }
            $wpdb->update($table_name, array(
                'sentAttribute' => $attribute
            ), array('id' => $item->id));
        }
    }

    if (!$installed_ver || $installed_ver < 9.7242) {
        $table_name = $wpdb->prefix . "wpefc_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD company TEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.7273) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD mapType TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD address TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD mapZoom TINYINT(2) NOT NULL DEFAULT 1;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD imageType TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.7274) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD mapStyle TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.7275) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD scrollTopMarginMobile SMALLINT(5) NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.7276) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD floatSummary_showInfo BOOL NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD autocloseDatepicker BOOL NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.7279) {
        $table_name = $wpdb->prefix . "wpefc_variables";
        $sql = "ALTER TABLE " . $table_name . " ADD sendAsGet BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 9.72792) {
        $table_name = $wpdb->prefix . "wpefc_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD sendSummaryToWoo BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.7291) {
        $table_name = $wpdb->prefix . "wpefc_items";
        $sql = "ALTER TABLE " . $table_name . " ADD useCurrentWooProduct BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 9.731) {


        if ($wpdb->get_var("SHOW TABLES LIKE '" . $wpdb->prefix . "wpefc_forms'") == $wpdb->prefix . "wpefc_forms") {


            $forms = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "wpefc_forms");
            foreach ($forms as $form) {
                $form->customCss = str_replace('wpe_', 'lfb_', $form->customCss);
                $form->formStyles = str_replace('wpe_', 'lfb_', $form->formStyles);
                $form->customJS = str_replace('wpe_', 'lfb_', $form->customJS);

                $form->customCss = str_replace('sfb_', 'lfb_', $form->customCss);
                $form->formStyles = str_replace('sfb_', 'lfb_', $form->formStyles);
                $form->customJS = str_replace('sfb_', 'lfb_', $form->customJS);

                $form->customCss = str_replace('wpefc_', 'lfb_', $form->customCss);
                $form->formStyles = str_replace('wpefc_', 'lfb_', $form->formStyles);
                $form->customJS = str_replace('wpefc_', 'lfb_', $form->customJS);

                $form->customCss = str_replace('genSlide', 'lfb_genSlide', $form->customCss);
                $form->formStyles = str_replace('genSlide', 'lfb_genSlide', $form->formStyles);
                $form->customJS = str_replace('genSlide', 'lfb_genSlide', $form->customJS);

                $form->customCss = str_replace('genContentSlide', 'lfb_genContentSlide', $form->customCss);
                $form->formStyles = str_replace('genContentSlide', 'lfb_genContentSlide', $form->formStyles);
                $form->customJS = str_replace('genContentSlide', 'lfb_genContentSlide', $form->customJS);

                $form->customCss = str_replace('stepTitle', 'lfb_stepTitle', $form->customCss);
                $form->formStyles = str_replace('stepTitle', 'lfb_stepTitle', $form->formStyles);
                $form->customJS = str_replace('stepTitle', 'lfb_stepTitle', $form->customJS);

                $form->customCss = str_replace('errorMsg', 'lfb_errorMsg', $form->customCss);
                $form->formStyles = str_replace('errorMsg', 'lfb_errorMsg', $form->formStyles);
                $form->customJS = str_replace('errorMsg', 'lfb_errorMsg', $form->customJS);

                $form->customCss = str_replace('genContent', 'lfb_genContent', $form->customCss);
                $form->formStyles = str_replace('genContent', 'lfb_genContent', $form->formStyles);
                $form->customJS = str_replace('genContent', 'lfb_genContent', $form->customJS);

                $form->customCss = str_replace('finalPrice', 'lfb_finalPrice', $form->customCss);
                $form->formStyles = str_replace('finalPrice', 'lfb_finalPrice', $form->formStyles);
                $form->customJS = str_replace('finalPrice', 'lfb_finalPrice', $form->customJS);

                $form->customCss = str_replace('itemBloc', 'lfb_itemBloc', $form->customCss);
                $form->formStyles = str_replace('itemBloc', 'lfb_itemBloc', $form->formStyles);
                $form->customJS = str_replace('itemBloc', 'lfb_itemBloc', $form->customJS);


                $form->customCss = str_replace('selectable', 'lfb_selectable', $form->customCss);
                $form->formStyles = str_replace('selectable', 'lfb_selectable', $form->formStyles);
                $form->customJS = str_replace('selectable', 'lfb_selectable', $form->customJS);

                $form->customCss = str_replace('wtmt_paypalForm', 'lfb_paypalForm', $form->customCss);
                $form->formStyles = str_replace('wtmt_paypalForm', 'lfb_paypalForm', $form->formStyles);
                $form->customJS = str_replace('wtmt_paypalForm', 'lfb_paypalForm', $form->customJS);

                $form->customCss = str_replace('btnOrderPaypal', 'lfb_btnOrderPaypal', $form->customCss);
                $form->formStyles = str_replace('btnOrderPaypal', 'lfb_btnOrderPaypal', $form->formStyles);
                $form->customJS = str_replace('btnOrderPaypal', 'lfb_btnOrderPaypal', $form->customJS);

                $form->customCss = str_replace('mainPanel', 'lfb_mainPanel', $form->customCss);
                $form->formStyles = str_replace('mainPanel', 'lfb_mainPanel', $form->formStyles);
                $form->customJS = str_replace('mainPanel', 'lfb_mainPanel', $form->customJS);

                $form->customCss = str_replace('btn-next', 'lfb_btn-next', $form->customCss);
                $form->formStyles = str_replace('btn-next', 'lfb_btn-next', $form->formStyles);
                $form->customJS = str_replace('btn-next', 'lfb_btn-next', $form->customJS);


                $form->customCss = str_replace('#btnStart', '#lfb_btnStart', $form->customCss);
                $form->formStyles = str_replace('#btnStart', '#lfb_btnStart', $form->formStyles);
                $form->customJS = str_replace('#btnStart', '#lfb_btnStart', $form->customJS);


                $form->formStyles = str_replace('#estimation_popup', '#lfb_form', $form->formStyles);
                $form->customCss = str_replace('#estimation_popup', '#lfb_form', $form->customCss);
                $form->customJS = str_replace('#estimation_popup', '#lfb_form', $form->customJS);

                $wpdb->update($wpdb->prefix . 'wpefc_forms', array(
                    'customCss' => $form->customCss,
                    'customJS' => $form->customJS,
                    'formStyles' => $form->formStyles
                ), array('id' => $form->id));
            }

            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_forms RENAME " . $wpdb->prefix . "lfb_forms");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_steps RENAME " . $wpdb->prefix . "lfb_steps");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_links RENAME " . $wpdb->prefix . "lfb_links");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_items RENAME " . $wpdb->prefix . "lfb_items");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_settings RENAME " . $wpdb->prefix . "lfb_settings");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_fields RENAME " . $wpdb->prefix . "lfb_fields");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_logs RENAME " . $wpdb->prefix . "lfb_logs");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_coupons RENAME " . $wpdb->prefix . "lfb_coupons");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_redirConditions RENAME " . $wpdb->prefix . "lfb_redirConditions");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_layeredImages RENAME " . $wpdb->prefix . "lfb_layeredImages");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_calendars RENAME " . $wpdb->prefix . "lfb_calendars");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_calendarReminders RENAME " . $wpdb->prefix . "lfb_calendarReminders");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_calendarCategories RENAME " . $wpdb->prefix . "lfb_calendarCategories");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_calendarEvents RENAME " . $wpdb->prefix . "lfb_calendarEvents");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_customers RENAME " . $wpdb->prefix . "lfb_customers");
            $wpdb->query("ALTER TABLE " . $wpdb->prefix . "wpefc_variables RENAME " . $wpdb->prefix . "lfb_variables");

            $moFiles = scandir(plugin_dir_path(__FILE__) . '/languages/');
            foreach ($moFiles as $moFile) {
                if (strpos($moFile, 'WP_Estimation_Form_') !== FALSE && strpos($moFile, 'fr_FR') === FALSE && strpos($moFile, 'de_DE') === FALSE) {
                    rename(plugin_dir_path(__FILE__) . '/languages/' . $moFile, plugin_dir_path(__FILE__) . '/languages/' . str_replace('WP_Estimation_Form', 'lfb', $moFile));
                }
            }
        }
    }
    if ($wpdb->get_var("SHOW TABLES LIKE '" . $wpdb->prefix . "wpefc_forms'") == $wpdb->prefix . "wpefc_forms") {
        if (!$installed_ver || $installed_ver < 9.737) {
            $forms = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "lfb_forms");
            foreach ($forms as $form) {
                $form->customCss = str_replace('.itemDes', '.lfb_itemDes', $form->customCss);
                $form->formStyles = str_replace('.itemDes', '.lfb_itemDes', $form->formStyles);
                $form->customJS = str_replace('.itemDes', '.lfb_itemDes', $form->customJS);

                $wpdb->update($wpdb->prefix . 'wpefc_forms', array(
                    'customCss' => $form->customCss,
                    'customJS' => $form->customJS,
                    'formStyles' => $form->formStyles
                ), array('id' => $form->id));
            }
        }
    }


    if (!$installed_ver || $installed_ver < 10.0) {


        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD isRange BOOL NOT NULL";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD minDatepicker mediumint(9) NOT NULL DEFAULT 0";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD alignment TINYINT(1) NOT NULL DEFAULT 0";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD hideInfoColumn BOOL NOT NULL DEFAULT 0";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD readonly BOOL NOT NULL DEFAULT 0";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD videoCode TEXT NOT NULL";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD prefillVariable TEXT NOT NULL";
        $wpdb->query($sql);


        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryTheadBg VARCHAR(7) NOT NULL DEFAULT '#1abc9c';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryTheadTxt VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryTbodyBg VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryTbodyTxt VARCHAR(7) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryStepBg VARCHAR(7) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryStepTxt VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryFooterBg VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_summaryFooterTxt VARCHAR(7) NOT NULL DEFAULT '#16a085';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD hideFinalbtn BOOL NOT NULL;";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " ADD color_fieldsBg VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_fieldsBorder VARCHAR(7) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_fieldsBorderFocus VARCHAR(7) NOT NULL DEFAULT '#1abc9c';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_fieldsBorderText VARCHAR(7) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_fieldsText VARCHAR(7) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD useVisualBuilder BOOL NOT NULL;";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " ADD color_btnBg VARCHAR(7) NOT NULL DEFAULT '#1abc9c';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_btnText VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_progressBar VARCHAR(7) NOT NULL DEFAULT '#e1e7eb';";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " ADD labelFontSize SMALLINT DEFAULT 16;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD columnsGap SMALLINT DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD gradientBg BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD colorGradientBg1 VARCHAR(7) NOT NULL DEFAULT '#ecf0f1';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD colorGradientBg2 VARCHAR(7) NOT NULL DEFAULT '#bdc3c7';";
        $wpdb->query($sql);


        $table_name = $wpdb->prefix . 'lfb_settings';
        $settings = $wpdb->get_results("SELECT id,useVisualBuilder  FROM $table_name WHERE id=1");
        $settings = $settings[0];

        $forms = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "lfb_forms");
        foreach ($forms as $form) {


            $fieldsColor = $form->colorC;
            if (strtolower($fieldsColor) == '#ffffff') {
                $fieldsColor = '#bdc3c7';
            }

            $wpdb->update($wpdb->prefix . 'lfb_forms', array(
                'useVisualBuilder' => $settings->useVisualBuilder,
                'color_summaryTheadBg' => $form->colorA,
                'color_summaryTheadTxt' => '#ffffff',
                'color_summaryTbodyBg' => '#ffffff',
                'color_summaryTbodyTxt' => $fieldsColor,
                'color_summaryStepBg' => $fieldsColor,
                'color_summaryStepTxt' => '#ffffff',
                'color_fieldsBg' => '#ffffff',
                'color_fieldsBorder' => $form->colorSecondary,
                'color_fieldsBorderFocus' => $form->colorA,
                'color_fieldsText' => $form->colorC,
                'color_summaryFooterTxt' => $form->colorA,
                'color_summaryFooterBg' => '#ffffff',
                'color_btnBg' => $form->colorA,
                'color_btnText' => '#ffffff',
                'disableDropdowns' => 1,
            ), array('id' => $form->id));


            $table_name = $wpdb->prefix . "lfb_settings";
            $settings = $wpdb->get_results("SELECT * FROM $table_name WHERE id=1 LIMIT 1");
            $rep = false;
            if (count($settings) > 0) {
                $settings = $settings[0];
                if ($settings->purchaseCode != "") {

                    try {
                        $currentUrl = get_site_url();
                        $domain = $_SERVER['SERVER_NAME'];
                        $url = 'https://loopus.tech/updateEP/update.php?verifyEPLicense=' . $settings->purchaseCode . '&url=' . $currentUrl . '&domain=' . $domain;
                        $ch = curl_init($url);
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        $rep = curl_exec($ch);
                        if ($rep != '0777') {
                            $wpdb->update($table_name, array('purchaseCode' => ''), array('id' => 1));
                        }
                    } catch (Throwable $t) {
                        $wpdb->update($table_name, array('purchaseCode' => ''), array('id' => 1));
                    } catch (Exception $e) {
                        $wpdb->update($table_name, array('purchaseCode' => ''), array('id' => 1));
                    }
                }
            }
        }
    }

    if (!$installed_ver || $installed_ver < 10.101) {
        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD bcc_email TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.102) {
        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD summary_hideZeroDecimals BOOL NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.118) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD asyncJsLoad BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1191) {
        $table_name = $wpdb->prefix . "lfb_variables";
        $sql = "ALTER TABLE " . $table_name . " ADD ordersort mediumint(9) NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1193) {
        $table_name = $wpdb->prefix . "lfb_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD selectedItems LONGTEXT NOT NULL;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD showInCsv BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1212) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD footerJsLoad BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1252) {

        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD cssClasses TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1264) {

        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN minSize FLOAT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN maxSize FLOAT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN sliderStep FLOAT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1269) {

        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN stripe_secretKey TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN stripe_publishKey TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN previous_step TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN intro_title TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN paypal_payMode TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN razorpay_payMode TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN stripe_payMode TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN fieldsPreset TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN nextStepButtonIcon VARCHAR(64) NOT NULL DEFAULT 'fa-check';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN previousStepButtonIcon VARCHAR(64) NOT NULL DEFAULT 'fa-arrow-left';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN finalButtonIcon VARCHAR(64) NOT NULL DEFAULT 'fa-check';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN introButtonIcon  VARCHAR(64) NOT NULL DEFAULT 'fa-check';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN imgIconStyle VARCHAR(32) NOT NULL DEFAULT 'circles';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN email_subject  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN email_userSubject  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN floatSummary_label  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN mailchimpKey  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN mailchimpList  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN getResponseKey  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN getResponseList  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN analyticsID  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN stripe_label_creditCard  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN stripe_label_cvc  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN stripe_label_expiration TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN gmap_key  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN usedCssFile  TEXT NOT NULL;";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN lastSave TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN currency TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN currencyPosition TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN summary_price TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN summary_total TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN summary_value TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN saveForLaterLabel TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN saveForLaterDelLabel VARCHAR(64) NOT NULL DEFAULT 'Delete backup';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN saveForLaterIcon VARCHAR(64) NOT NULL DEFAULT 'fa fa-floppy';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN razorpay_secretKey TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN razorpay_publishKey TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN intro_btn TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN intro_image  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN last_title  TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN last_btn TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN last_msg_label TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN email_name TEXT NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1331) {

        $table_name = $wpdb->prefix . "lfb_variables";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN defaultValue VARCHAR(200) NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1335) {

        $table_name = $wpdb->prefix . "lfb_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD payMethod TEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1353) {

        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD disableScroll BOOL NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1393) {

        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD csvTitle TINYTEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1394) {

        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD alias TEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1472) {

        $table_name = $wpdb->prefix . "lfb_coupons";
        $sql = "ALTER TABLE " . $table_name . " ADD expiration VARCHAR(32) NOT NULL;";
        $wpdb->query($sql);
        $table_name = $wpdb->prefix . "lfb_coupons";
        $sql = "ALTER TABLE " . $table_name . " ADD useExpiration BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.1492) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD txtCustomersAccountCreated  LONGTEXT NOT NULL;";
        $wpdb->query($sql);
        $wpdb->update($table_name, array('txtCustomersAccountCreated' => "Hello [name],\nA new account was created for you on [url].\nHere is your password: <b>[password]</b>.Thank you for your confidence !"), array('id' => 1));

        $sql = "ALTER TABLE " . $table_name . " ADD txtCustomersAccountCreatedSubject VARCHAR(250) NOT NULL DEFAULT 'New account created';";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1572) {
        $table_name = $wpdb->prefix . "lfb_logs";
        $sql = "ALTER TABLE " . $table_name . " ADD discountCode TEXT NOT NULL;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.1595) {
        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD customQtSelector BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.167) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD backendTheme VARCHAR(64) NOT NULL DEFAULT 'glassmorphic';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD backend_bgGradient TEXT NOT NULL;";
        $wpdb->query($sql);

        $wpdb->update($table_name, array('backend_bgGradient' => "linear-gradient(to right, #8e2de2 0%, #4a00e0 100%)"), array('id' => 1));


        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN  previewPageID BIGINT(20) NOT NULL;";
        $wpdb->query($sql);
    }


    if (!$installed_ver || $installed_ver < 10.1672) {

        $table_name = $wpdb->prefix . "lfb_forms";


        $sql = "ALTER TABLE " . $table_name . " ADD color_progressBarA VARCHAR(7) NOT NULL DEFAULT '#1abc9c';";
        $wpdb->query($sql);

        $sql = "ALTER TABLE " . $table_name . " ADD color_progressBarB VARCHAR(7) NOT NULL DEFAULT '#1abc9c';";
        $wpdb->query($sql);

        $forms = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "lfb_forms");
        foreach ($forms as $form) {
            $wpdb->update($wpdb->prefix . 'lfb_forms', array(
                'color_progressBarA' => $form->colorA,
                'color_progressBarB' => $form->colorA
            ), array('id' => $form->id));
        }
    }
    if (!$installed_ver || $installed_ver < 10.179) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD debugCalculations BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.182) {    
        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " MODIFY COLUMN title VARCHAR(250) NOT NULL;";
        $wpdb->query($sql);
    }
    if (!$installed_ver || $installed_ver < 10.189) {   
        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD dontStoreOrders BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);
    }

    if (!$installed_ver || $installed_ver < 10.193) {    
        $table_name = $wpdb->prefix . "lfb_items";
        $sql = "ALTER TABLE " . $table_name . " ADD quantity_default SMALLINT(5) NOT NULL;";
        $wpdb->query($sql);
    }
    
    if (!$installed_ver || $installed_ver < 10.194) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD openAiKey VARCHAR(255) NOT NULL DEFAULT '';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD openAiModel VARCHAR(255) NOT NULL DEFAULT 'gpt-4o';";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "lfb_settings";
        $wpdb->update($table_name, array('asyncJsLoad' => 0), array('id' => 1));
    }

    
    if (!$installed_ver || $installed_ver < 10.1952) {
     
        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD color_datepickerDisabledDates VARCHAR(7) NOT NULL DEFAULT '#777';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_datepickerDates VARCHAR(7) NOT NULL DEFAULT '#ffffff';";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD color_datepickerBg VARCHAR(7) NOT NULL DEFAULT '#1abc9c';";
        $wpdb->query($sql);

        $forms = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "lfb_forms");
        foreach ($forms as $form) {
            $wpdb->update($wpdb->prefix . 'lfb_forms', array(
                'color_datepickerDisabledDates' => '#999',
                'color_datepickerDates' => $form->colorSecondaryTxt, 
                'color_datepickerBg' => $form->colorA
            ), array('id' => $form->id));
        }
    }

    if (!$installed_ver || $installed_ver < 10.1973) {

        $table_name = $wpdb->prefix . "lfb_forms";
        $sql = "ALTER TABLE " . $table_name . " ADD verifyEmail BOOL NOT NULL DEFAULT 0;";
        $wpdb->query($sql);

        $table_name = $wpdb->prefix . "lfb_settings";
        $sql = "ALTER TABLE " . $table_name . " ADD txtVerificationLabel TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txtCodeVerificationSubject TEXT NOT NULL;";
        $wpdb->query($sql);
        $sql = "ALTER TABLE " . $table_name . " ADD txtCodeVerificationEmail TEXT NOT NULL;";
        $wpdb->query($sql);

        $wpdb->update($table_name, array('txtVerificationLabel' => 'Fill the code you received by email', 'txtCodeVerificationSubject' => 'Here is your email verification code', 'txtCodeVerificationEmail' => '<p>Here is the verification code to fill in the form to confirm your email :</p><h1>[code]</h1>'), array('id' => 1));    

    }

    if (!$installed_ver || $installed_ver < 10.210) {
        $table_name = $wpdb->prefix . "lfb_settings";
        $settings = $wpdb->get_results("SELECT purchaseCode,id FROM " . $table_name . " WHERE id=1 LIMIT 1");
        if (count($settings) > 0) {
            $settings = $settings[0];
            if ($settings->purchaseCode != "") {
                try {

                    $currentUrl = get_site_url();
                    $domain = $_SERVER['SERVER_NAME'];
    
                    $curl = new Wp_Http_Curl();
                    $result = $curl->request('https://loopus.tech/updateEP/update.php?verifyExLicense=' . $settings->purchaseCode . '&url=' . $currentUrl . '&domain=' . $domain, array('method' => 'GET'));
                    if (!is_wp_error($result)) {                        
                       if ($result['body'] == '0555') {
                           $wpdb->update($table_name, array('purchaseCode' => ''), array('id' => 1));
                       }
                    }
    
                } catch (Exception $e) {
                }
            }
            
        }
       
    }

    update_option("lfb_version", $version);
}

function lfb_stringEncode($value)
{
    if ($value != "") {
        $iv = openssl_random_pseudo_bytes(16);
        $text = openssl_encrypt($value, 'aes128', get_option('lfbK'), null, $iv);
        $text = lfb_safe_b64encode($text . '::' . $iv);
    } else {
        $text = "";
    }
    return $text;
}

function lfb_safe_b64encode($string)
{
    $data = base64_encode($string);
    $data = str_replace(array('+', '/', '='), array('-', '_', ''), $data);
    return $data;
}

function lfb_generatePassword($length = 8)
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $count = mb_strlen($chars);
    for ($i = 0, $result = ''; $i < $length; $i++) {
        $index = rand(0, $count - 1);
        $result .= mb_substr($chars, $index, 1);
    }
    return $result;
}

function lfb_deactive()
{
    global $wpdb;

    try {
        $table_name = $wpdb->prefix . "lfb_settings";
        $settings = $wpdb->get_results("SELECT * FROM $table_name WHERE id=1 LIMIT 1");
        $rep = false;
        if (count($settings) > 0) {
            $settings = $settings[0];
            if ($settings->purchaseCode != "") {
                $url = 'https://loopus.tech/updateEP/update.php?unregisterEPLicense=' . $settings->purchaseCode;
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $rep = curl_exec($ch);
            }
        }
    } catch (Throwable $t) {
    } catch (Exception $e) {
    }
}
function lfb_deactivate()
{
    global $wpdb;
    global $jal_db_version;

    try {
        $table_name = $wpdb->prefix . "lfb_settings";
        $settings = $wpdb->get_results("SELECT * FROM $table_name WHERE id=1 LIMIT 1");
        $rep = false;
        if (count($settings) > 0) {
            $settings = $settings[0];
            if ($settings->purchaseCode != "") {
                $url = 'https://loopus.tech/updateEP/update.php?unregisterEPLicense=' . $settings->purchaseCode;
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $rep = curl_exec($ch);
            }
        }
    } catch (Throwable $t) {
    } catch (Exception $e) {
    }
}
/**
 * Uninstallation.
 * @access  public
 * @since   1.0.0
 * @return  void
 */
function lfb_uninstall()
{
    global $wpdb;
    global $jal_db_version;

    try {
        $table_name = $wpdb->prefix . "lfb_settings";
        $settings = $wpdb->get_results("SELECT * FROM $table_name WHERE id=1 LIMIT 1");
        $rep = false;
        if (count($settings) > 0) {
            $settings = $settings[0];
            if ($settings->purchaseCode != "") {

                $curl = new Wp_Http_Curl();
                $result = $curl->request('https://loopus.tech/updateEP/update.php?unregisterEPLicense=' . $settings->purchaseCode, array('method' => 'GET'));
            }
        }
    } catch (Throwable $t) {
    } catch (Exception $e) {
    }
    delete_option('lfb_version');
    delete_option('wpecf_version');
    $table_name = $wpdb->prefix . "lfb_steps";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_items";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_links";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_settings";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_forms";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_fields";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_logs";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_coupons";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_redirConditions";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_layeredImages";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_calendars";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_calendarEvents";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_calendarReminders";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_calendarCategories";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_customers";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . "lfb_variables";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
}

function update_customized_versions(){

    $current_installed_ver = get_option("wpecf_version");

    //changes based on ( Sep 22, 2019 commit)
    //commented plugin  Version:90.672
    if($current_installed_ver == '90.672'){
    	update_option("wpecf_version", '9.672');
    }

    //changes based on ( Aug 16, 2022 commit)
    //commented plugin  Version: 91.00
    if($current_installed_ver == '91.00' || $current_installed_ver == '91'){
    	update_option("wpecf_version", '9.728');
    }
}

lfb_init_ep_form();
