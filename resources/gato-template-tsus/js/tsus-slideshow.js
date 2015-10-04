function tsus_slideshow(box, opts) {
	this.timer = opts.timer*1000;
	this.box = box;
	this.slides = box.select('.slide');
	this.pages = box.select('.pages li');
	this.pagebox = box.select('.pages')[0];
	this.count = this.slides.length;
	this.current = 0;
	this.timeout = setTimeout(this.next.bind(this), this.timer);
	var show = this;
	this.pages.each( function (itm) {
		if (itm.hasClassName('prev')) {
			itm.down('a').observe('click', function(e) {
				show.prev();
				e.stop();
			});
		} else if (itm.hasClassName('next')) {
			itm.down('a').observe('click', function(e) {
				show.next();
				e.stop();
			});
		} else {
			itm.down('a').tooltip = itm.down('a').title;
			itm.down('a').title = '';
			itm.down('a').observe('click', function(e) {
				show.activate(parseInt(this.id.replace(/page/, ''), 10));
				e.stop();
			});
			itm.down('a').observe('mouseover', function(e) {
				show.tooltip(this, this.tooltip);
			});
			itm.down('a').observe('mouseout', function(e) {
				show.hidetooltip();
			});
		}
	});

	gatoedit.ready(function() {
		show.initeditbars();
	});
}

tsus_slideshow.prototype.activate = function(index) {
	if (index == this.current) return;
	clearTimeout(this.timeout);
	if (this.effect) this.effect.cancel();

	var c = this.slides[this.current];
	var s = this.slides[index];
	var p = this.pages[index+1];
	this.pages.each(function (itm) { itm.removeClassName('active'); });
	this.slides.each(function (itm) { if (itm != c) itm.removeClassName('active'); });

	c.setStyle({opacity: 1, zIndex: 0});
	s.setStyle({opacity: 0, zIndex: 1});
	s.addClassName('active');
	p.addClassName('active');

	this.effect = new Effect.Morph(s, { style: 'opacity: 1', duration: 0.5,
		afterFinish: function () {
			c.removeClassName('active');
			c.setStyle({zIndex: 'auto'});
			s.setStyle({zIndex: 'auto'});
		}
	});
	this.current = index;
	this.timeout = setTimeout(this.next.bind(this), this.timer);
};

tsus_slideshow.prototype.next = function() {
	var next = (this.current == this.count - 1 ? 0 : this.current + 1);
	this.activate(next);
};

tsus_slideshow.prototype.prev = function() {
	var prev = (this.current == 0 ? this.count - 1 : this.current - 1);
	this.activate(prev);
};

tsus_slideshow.prototype.tooltip = function(lnk, tip) {
	if (!tip || tip.length == 0) return;
	if (!this.tipdiv) {
		this.tipdiv = $(document.createElement('div'));
		this.tipdiv.addClassName('tooltip');
		this.box.appendChild(this.tipdiv);
		
		var span = $(document.createElement('span'));
		this.tipdiv.appendChild(span);
	}
	this.tipdiv.down('span').innerHTML = tip;
	var obj = lnk;
	var tipleft = 0;
	var tiptop = 0;
	while (obj && !obj.hasClassName('gato-slideshow')) {
		tipleft += obj.positionedOffset().left;
		tiptop += obj.positionedOffset().top;
		obj = obj.getOffsetParent();
	}
	this.tipdiv.setStyle({
		display: 'block',
		left: tipleft + 'px',
		top: (tiptop - this.tipdiv.getHeight() - 2) + 'px'
	});		
};

tsus_slideshow.prototype.hidetooltip = function () {
	if (this.tipdiv) this.tipdiv.setStyle({display: 'none'});
};

tsus_slideshow.prototype.initeditbars = function () {
	var container = $(this.box);
	var top = 0;
	var zindex = 1;
	var width = 'auto';
	var cnt = 0;

	container.select('.slides-admin .mgnlEditor.mgnlEditorBar.component').each(function(itm) {
		cnt += 1;
		top += itm.getHeight();
		itm.setStyle({top: top+'px'});
		var title = itm.next('.slide').down('h4');
		if (title && title.innerHTML) {
			title = title.innerHTML;
		} else {
			title = "Slide " + cnt;
		}
		itm.down('.mgnlEditorBarLabel').innerHTML = title;

		zindex = itm.getStyle('z-index');
		width = itm.getStyle('width');
	});

	var newBar = container.down('.mgnlEditorPlaceholder.component');
	top += newBar.getHeight();
	newBar.setStyle({
		'position': 'absolute',
		'z-index': zindex,
		'top': top+'px'
	});
	// FIXME: setStyle() ignores !important ???
	var style = newBar.readAttribute('style');
	newBar.writeAttribute('style', style + ' width: ' + width + ' !important;');
	newBar.down('.mgnlEditorPlaceholderElements').setStyle({display: 'none'});
};
