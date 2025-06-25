(function ($) {
    "use strict";
var lfb_tld_hoveredElement;

jQuery(document).ready(function(){
    
    $('#lfb_form').on('lfb_tld_unSelectElement', lfb_tld_unSelectElement);
     $('#lfb_form').on('lfb_tld_updateSelector', lfb_tld_updateSelector);
     $('#lfb_form').on('lfb_tld_unSelectElement', lfb_tld_unSelectElement);
     $('#lfb_form').on('lfb_tld_unSelectElement', lfb_tld_unSelectElement);
    
    setTimeout(function(){        
         jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('mouseover',lfb_tld_hoverElement);
         jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('mouseout',lfb_tld_mouseOutElement);
        jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('click',lfb_tld_selectElement).attr('data-tldinit','true');
        jQuery(document).ajaxComplete(function() {            
            jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('mouseover',lfb_tld_hoverElement);
            jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('mouseout',lfb_tld_mouseOutElement);
            jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('click',lfb_tld_selectElement).attr('data-tldinit','true');
        });
    },1000);
    setInterval(function(){
    if(!$('#lfb_form').is('.lfb_tldSelection')){
         jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('mouseover',lfb_tld_hoverElement);
         jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('mouseout',lfb_tld_mouseOutElement);
        jQuery('#lfb_bootstraped.lfb_bootstraped').find('*:not([data-tldinit="true"])').on('click',lfb_tld_selectElement).attr('data-tldinit','true');
    }
    },5000);
    if(lfb_tld_isIframe()){
        jQuery('#lfb_form').addClass('lfb_tld_preview');
    }
    
        setTimeout(function () {
                        $(window).trigger('resize');
                    }, 500);
});
function lfb_tld_getStyleSrc(formID){
    var rep = '';
     jQuery.each(lfb_forms, function () {
        var form = this;
        if(form.formID == formID){
            rep = form.formStylesSrc;
        }
    });
    return rep;
}
function lfb_tld_mouseOutElement(e){
    if($('#lfb_form').is('.lfb_tldSelection')){
        var self = this;
        if(jQuery(this).is(lfb_tld_hoveredElement)){
           jQuery(self).removeClass('lfb_tld_selectedElement');
           lfb_tld_hoveredElement = null;
        }
    }
}
function lfb_tld_hoverElement(e){
    if($('#lfb_form').is('.lfb_tldSelection')){
        var self = this;
       var hasChildrenHovered = false;
       if (jQuery(self).children().length > 0){
          jQuery(self).children().each(function(){
              if(lfb_tld_isHovered(this)){
                  hasChildrenHovered = true;
              }
          });
       } 
       if(!hasChildrenHovered){
           jQuery(self).addClass('lfb_tld_selectedElement');
            lfb_tld_hoveredElement = jQuery(self);
           jQuery('.lfb_tld_selectedElement').not(jQuery(self)).removeClass('lfb_tld_selectedElement');
       }
    }
}
function lfb_tld_selectElement(e){
    if($('#lfb_form').is('.lfb_tldSelection')){
        e.preventDefault();
        var self = this;
        if(lfb_tld_hoveredElement != null){
            lfb_tld_hoveredElement.addClass('lfb_tld_hasShadow');                          
            if(lfb_tld_hoveredElement.css('box-shadow')=='none'){
                lfb_tld_hoveredElement.removeClass('lfb_tld_hasShadow');                                
            }
            window.parent.jQuery('#lfb_form').trigger('lfb_tld_itemSelected',[lfb_tld_hoveredElement[0]]);
        }
    }
}
function lfb_tld_unSelectElement(){
    jQuery('#lfb_tld_selector').fadeOut();
     jQuery('.lfb_tld_selectedElement').removeClass('lfb_tld_selectedElement');
     jQuery('.lfb_tld_hasShadow').removeClass('lfb_tld_hasShadow');
}

function lfb_tld_getPath(el) {
    var path = '';
    if (jQuery(el).length > 0 && typeof (jQuery(el).prop('tagName')) != "undefined") {
        if (!jQuery(el).attr('id')) {
            
            var target =  '>' + jQuery(el).prop('tagName') + ':nth-child(' + (jQuery(el).index() + 1) + ')';
            if(jQuery(el).is('.lfb_genSlide')){
                    target = '> [data-stepid="'+jQuery(el).attr('data-stepid')+'"]';
                } else if(jQuery(el).is('[data-itemid]')){
                    target = '> [data-itemid="'+jQuery(el).attr('data-itemid')+'"]';                    
                }
            path = target + path;
            path = lfb_tld_getPath(jQuery(el).parent()) + path;
           
        } else {
            path += '#' + jQuery(el).attr('id');
        }
    }
    if(path.indexOf('>') == 0){
        path = path.substr(1,path.length);
    }
    return path;
}
function lfb_tld_isHovered(element){
    return jQuery(lfb_tld_getPath(element) + ":hover").length > 0;
}
function lfb_tld_isIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
function lfb_tld_isAnyParentFixed($el, rep) {
    if (!rep) {
        var rep = false;
    }
    try {
        if ($el.parent().length > 0 && $el.parent().css('position') == "fixed") {
            rep = true;
        }
    } catch (e) {

    }

    if (!rep && $el.parent().length > 0) {
        rep = lfb_tld_isAnyParentFixed($el.parent(), rep);
    }
    return rep;
}

function lfb_tld_updateSelector(){
    if(jQuery('.lfb_tld_selectedElement').length==0){
        jQuery('#lfb_tld_selector').hide();
    }
}
})(jQuery);