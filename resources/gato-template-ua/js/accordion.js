var accordion = function (params) {
	var acc = this;
	acc.headers = [];
	if (!params.containerclass) params.containerid = 'accordion_container';
	if (!params.toggleclass) params.toggleclass = 'accordion_toggle';
	if (!params.activeclass) params.activeclass = 'accordion_active';
	if (!params.contentclass) params.contentclass = 'accordion_content';
	if (!params.realcontent) params.realcontent = 'accordion_realcontent';
	if (!params.speed) params.speed = 0.5;

	// let's do some math to find out the width we're working with
	params.fullwidth = $(params.containerid).getContentWidth();
	params.togglewidth = 0;

	var lastitm = 0;
	var count = 0;
	$(params.containerid).select('.'+params.toggleclass).each(function(itm) {
		itm.observe('click', function(e) {
			if (!itm.hasClassName(params.activeclass)) acc.expand(itm);
			else {
				var nxt = itm.next('.'+params.toggleclass);
				if (!nxt) nxt = itm.previous('.'+params.toggleclass);
				if (nxt) acc.expand(nxt);
			}
			itm.down('img').blur();
			e.stop();
		});
		acc.headers.push(itm);
		count++;
		params.togglewidth += itm.getWidth();
	});
	params.contentwidth = params.fullwidth - params.togglewidth - 1;
	this.params = params;

	acc.headers.each(function(header) {
		var real = header.next('.'+params.contentclass).down('.'+params.realcontent);
		real.setStyle({width: params.contentwidth-(real.getWidth()-real.getContentWidth())+'px'});
	});

	acc.expand(acc.headers[count-1], true);
};

accordion.prototype.collapse = function(header, skipanim) {
	if (!header.hasClassName(this.params.activeclass)) return;

	var content = header.next('.'+this.params.contentclass);
	header.removeClassName(this.params.activeclass);
	if (skipanim) {
		content.setStyle({width: '0px'});
	} else {
		this.doanimation(content, { style: 'width: 0px' });
	}
};

accordion.prototype.expand = function(header, skipanim) {
	if (header.hasClassName(this.params.activeclass)) return;
	var content = header.next('.'+this.params.contentclass);

	if (skipanim) {
		this.headers.each(function(itm) { this.collapse(itm, true); }.bind(this));
		content.setStyle({width: this.params.contentwidth+'px'});
	} else {
		this.beginparallel();
		this.doanimation(content, { style: 'width: '+this.params.contentwidth+'px' });
		this.headers.each(function(itm) { this.collapse(itm); }.bind(this));
		this.executeparallel();
	}
	header.addClassName(this.params.activeclass);
};

accordion.prototype.beginparallel = function () {
	this.parallels = [];
	this.animateparallel = true;
};

accordion.prototype.doanimation = function (elem, opts) {
	if (this.animateparallel) {
		opts.sync = true;
		this.parallels.push( new Effect.Morph(elem, opts) );
	} else {
		opts.duration = this.params.speed;
		opts.queue = 'end';
		new Effect.Morph(elem, opts);
	}
};

accordion.prototype.executeparallel = function () {
	this.animateparallel = false;
	if (this.parallels.length) {
		new Effect.Parallel(this.parallels, { duration: this.params.speed, queue: 'end' });
	}
};
