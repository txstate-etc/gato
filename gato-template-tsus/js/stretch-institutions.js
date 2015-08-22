var tsus_institution_over = function (e) {
	this.orig_src = this.src;
	if (this.alternate_src && this.alternate_src.length > 0) this.src = this.alternate_src;
}
var tsus_institution_out = function (e) {
	this.src = this.orig_src;
}
Event.observe(window, 'load', function () {
	var logos = $$('.tsus-institution-logos li');
	var total = 0;
	var count = 0;
	for (var i = 0; i < logos.length; i++) {
		var itm = logos[i];
		var img = itm.select('img')[0];
		total += img ? img.getWidth() : 90;
		count++;
	}
	var twidth = $$('.tsus-institution-logos')[0].getContentWidth();
	var padding = Math.floor((twidth - total)/((count-1)*2));
	for (var i = 0; i < logos.length; i++) {
		var itm = logos[i];
		var img = itm.select('img')[0];
		var iwidth = img ? img.getWidth() : 90;
		var iheight = img ? img.getHeight() : 90;
		var padTop = ((itm.getHeight()-iheight)/2);
		
		itm.setStyle({
			paddingLeft: (i == 0 ? 0 : padding)+'px',
			paddingRight: (i == logos.length-1 ? 0 : padding)+'px',
			paddingTop: padTop+'px',
			width: iwidth+'px',
			height: (itm.getHeight() - padTop)+'px'
		});
		if (img) {
			img.observe('mouseover', tsus_institution_over);
			img.observe('mouseout', tsus_institution_out);
		}
	}
});