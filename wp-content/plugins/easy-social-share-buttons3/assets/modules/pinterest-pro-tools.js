document.addEventListener("DOMContentLoaded",function(){
	if (typeof (essbPinAdvancedDisable) != "undefined") {
		if (!essbPinAdvancedDisable["min_width"] && !essbPinAdvancedDisable["min_height"] && !essbPinAdvancedDisable["hideon"] && essbPinAdvancedDisable["files"].length == 0) return;
		
		if (essbPinAdvancedDisable["hideon"]) {
			document.querySelectorAll(essbPinAdvancedDisable["hideon"]).forEach(image => {
				image.setAttribute("nopin", "nopin");
				image.setAttribute("data-pin-nopin", "true");
				image.classList.add("no_pin");
				image.classList.add("essb_no_pin");
				image.setAttribute("data-pin-no-hover", "true");
			});
		}
		
		if (Number(essbPinAdvancedDisable["min_height"] || 0) > 0 || Number(essbPinAdvancedDisable["min_width"] || 0) > 0) {
			document.querySelectorAll("img").forEach(image => {
				if (image.outerWidth() < Number(essbPinImages.min_width || 0) || image.outerHeight() < Number(essbPinImages.min_height || 0)) {
					image.setAttribute("nopin", "nopin");
					image.setAttribute("data-pin-nopin", "true");
					image.classList.add("no_pin");
					image.classList.add("essb_no_pin");
					image.setAttribute("data-pin-no-hover", "true");					
				}
			});
		}
		
		if (essbPinAdvancedDisable["files"].length > 0) {
			document.querySelectorAll("img").forEach(image => {
				let imagePath = (image.getAttribute('src') || '').toLowerCase(),
					disablePin = false;
				
				for (let filePart of essbPinAdvancedDisable["files"]) {
					if (imagePath.indexOf(filePart.toLowerCase()) > -1) {
						disablePin = true;
						break;
					}
				}
				
				if (disablePin) {
					image.setAttribute("nopin", "nopin");
					image.setAttribute("data-pin-nopin", "true");
					image.classList.add("no_pin");
					image.classList.add("essb_no_pin");
					image.setAttribute("data-pin-no-hover", "true");
				}
			});
		}
	}	
});

document.addEventListener("DOMContentLoaded",function(){
	let relativePath = "", defaultTrigger = false;
	
	if (document.querySelector(".essb-pinterest-pro-content-marker")) {
		relativePath = ".essb-pinterest-pro-content-marker";
		defaultTrigger = true;
	}
	else if (document.querySelector(".post img")) relativePath = ".post img";
	else relativePath = ".single-post img";
	
	document.querySelectorAll(relativePath).forEach(element => {
		if (defaultTrigger) {
			element.parentNode.querySelectorAll("img").forEach(image => {
				let existDescription = image.getAttribute("data-pin-description") || "";
				if (existDescription == '') image.setAttribute("data-pin-description", "$pinterest_description");
			});
		}
		else {
			let existDescription = element.getAttribute("data-pin-description") || "";
			if (existDescription == '') element.setAttribute("data-pin-description", "$pinterest_description");
		}
	});
});

document.addEventListener("DOMContentLoaded",function(){
	document.querySelectorAll('img:not(.essb-pinterest-hidden-image)').forEach(image => {
		image.setAttribute('nopin', 'nopin');
		image.setAttribute('data-pin-nopin', 'true');
		image.classList.add('no_pin');
		image.classList.add("essb_no_pin");
		image.setAttribute('data-pin-no-hover', 'true');		
	});	
	
	document.querySelectorAll('.essb-pinterest-hidden-image').forEach(image => {
		image.setAttribute('data-pin-me-only', 'true');
	});
});