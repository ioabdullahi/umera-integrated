(function() {
	function initializeEvents() {
		if (document.querySelector('.essb-pinterest-follow-box-header__close')) {
			document.querySelector('.essb-pinterest-follow-box-header__close').onclick = function(e) {
				e.preventDefault();
				
				document.querySelector('.essb-pinterest-follow-box-container').classList.remove('active');
			}
		}
	}	
	
	setTimeout(initializeEvents, 10);
})();

window.essbDisplayPinterestFollowBox = essbDisplayPinterestFollowBox = function () {
	let timeoutTrigger = document.querySelector('.essb-pinterest-follow-box-container').getAttribute('data-timeout') || '';
	
	if (timeoutTrigger != '-1') {
		if (essb && (typeof essb.getCookie != 'undefined') && essb.getCookie('pinterest_follow_box')) return;
	}
	
	timeoutTrigger = timeoutTrigger != '' ? Number(timeoutTrigger) : 30;
	if (isNaN(timeoutTrigger)) timeoutTrigger = 30;
	
	document.querySelector('.essb-pinterest-follow-box-container').classList.add('active');
	
	if (timeoutTrigger != '-1') {
		essb.setCookie('pinterest_follow_box', "yes", timeoutTrigger);
	}
}