//Make the mobile link visible
document.observe('dom:loaded', function() {
	if (detect_mobile()) $$('.full-site-link')[0].setStyle({display: 'block'});
});
