function togglewebtools() {
	if (!togglewebtools.shown) {
		showwebtools();
	}	else {
		hidewebtools();
	}
}
function showwebtools() {
	$('txst-banner-webtools-menuitems').setStyle({display: 'block'});
	togglewebtools.shown = 1;
}
function hidewebtools() {
	$('txst-banner-webtools-menuitems').setStyle({display: 'none'});
	togglewebtools.shown = 0;
}


// Drop-down button for webtools
Event.observe(window, 'load', function() {
	Event.observe('txst-banner-webtools-dropdown', 'click', function(event) {
		this.blur();
		togglewebtools();
		Event.stop(event);
	});
	
	// let's set a timeout to close the web tools after a couple seconds, but
	// not if they're hovering over it
	$('txst-banner-webtools-dropdown').onmouseout = $('txst-banner-webtools-menuitems').onmouseout = function() { 
		hidewebtools.timer = setTimeout("hidewebtools()", 2000); 
	}
	$('txst-banner-webtools-dropdown').onmouseover = $('txst-banner-webtools-menuitems').onmouseover = function() { 
		clearTimeout(hidewebtools.timer); 
	}
		
	// alternate action for submitting the form, since IE6 barfs on the transparent PNG magnifying glass
	$$('.txst-banner-webtools-searchbg')[0].observe('click', function (event) {
		event.stop();
		this.up('form').submit();
	});
});
