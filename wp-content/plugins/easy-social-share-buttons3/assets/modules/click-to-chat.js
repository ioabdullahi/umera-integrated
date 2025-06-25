
(function() {
	if (document.querySelector('.essb-c2c-b')) {
		document.querySelector('.essb-c2c-b').onclick = function(e) {
			e.preventDefault();
			let mode = this.getAttribute('data-mode') || '';
			
			if (document.querySelector('.essb-c2c-w[data-mode="'+mode+'"]')) {
				document.querySelector('.essb-c2c-w[data-mode="'+mode+'"]').classList.toggle('active');
			}
			
		}
	}
	
	document.querySelectorAll('.essb-c2c-w-header-close').forEach(element => {
		element.onclick = function(e) {
			e.preventDefault();
			
			let mode = this.getAttribute('data-mode') || '';
			
			if (document.querySelector('.essb-c2c-w[data-mode="'+mode+'"]')) {
				document.querySelector('.essb-c2c-w[data-mode="'+mode+'"]').classList.toggle('active');
			}
		}
	});
	
	document.querySelectorAll('.essb-c2c-o').forEach(element => {
		element.onclick = function(e) {
			e.preventDefault();
			
			let app = this.getAttribute('data-app') || '',
				customText = this.getAttribute('data-text') || '',
				callNumber = this.getAttribute('data-number') || '',
				isMobile = false,
				cmd = '';
			
			if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent) ) {
				isMobile = true;
			}
			
			if (app == 'whatsapp') {
				cmd = 'https://api.whatsapp.com/send?phone='+callNumber+'&text=' + customText;
			}
			if (app == 'viber') {
				cmd = 'viber://chat?number='+callNumber+'&text=' + customText;
			}
			if (app == 'email') {
				cmd = 'mailto:'+callNumber+(customText != '' ? '&body=' + customText : '');
			}
			if (app == 'phone') {
				cmd = 'tel:'+callNumber;
			}
			if (app == 'messenger') {
				cmd = callNumber;
			}
			if (app == 'telegram') {
				cmd = callNumber;
			}
			
			if (isMobile) window.location.href = cmd;
			else {
				window.open(cmd, '_blank');
			}
			
		}
	});
})();