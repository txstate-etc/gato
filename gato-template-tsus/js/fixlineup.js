document.observe('dom:loaded', function () {
	var down = $$('.txst-contentarea')[0];
	while (down && (down = down.down())) {
		down.setStyle({marginTop: '0px', paddingTop: '0px'});
	}
	var down = $$('.txst-form')[0];
	while (down && (down = down.down())) {
		down.setStyle({marginTop: '0px', paddingTop: '0px'});
	}
	down = $$('.gato-navcolumn')[0];
	while (down && (down = down.down())) {
		down.setStyle({marginTop: '0px', paddingTop: '0px'});
	}
	down = $$('.tsus-rightcolumn')[0];
	while (down && (down = down.down())) {
		down.setStyle({marginTop: '0px', paddingTop: '0px'});
	}
	// fix for page title to make sure it never wraps
	var pt = $$('.tsus-page-title')[0];
	while (pt.getHeight() > cssDim(pt.getStyle('line-height')) + 2) {
		pt.setStyle({fontSize: (cssDim(pt.getStyle('font-size'))-1)+'px'});
	}
});