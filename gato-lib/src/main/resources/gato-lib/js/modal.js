function modal(content) {
	var mymodal = this;
	mymodal.opacity = 0.85;
	mymodal.content = content;
	mymodal.contentparent = content.parentNode;

	// let's make sure the modal content isn't shown when we're not modal

	ensureReady(function () {
		mymodal.originalDisplayStyle = mymodal.content.getStyle('display');
		mymodal.content.setStyle({display: 'none'});
		mymodal.init()
	});
}

modal.prototype.init = function() {
	if (!$('modal_outer')) {
		// OUTER DIV
		modal.outerdiv = $(document.createElement('div'));
		modal.outerdiv.id = 'modal_outer';
		modal.outerdiv.setAttribute('role', 'dialog')
		modal.outerdiv.setStyle({
			display: 'none',
			position: 'absolute',
			width: '100%',
			height: '100%',
			margin: 0,
			padding: 0,
			top: 0,
			left: 0,
			zIndex: 65536
		});
		document.body.appendChild(modal.outerdiv);

		// BACKGROUND DIV
		modal.bgdiv = $(document.createElement('div'));
		modal.bgdiv.setStyle({
			opacity: this.opacity,
			backgroundColor: '#000000',
			position: 'absolute',
			zIndex: -1,
			width: '100%',
			height: '100%',
			margin: 0,
			padding: 0,
			top: 0,
			left: 0
		});
		modal.bgdiv.observe('click', function(e) {
			modal.currentmodal.hide();
			e.stop();
		});
		modal.outerdiv.appendChild(modal.bgdiv);

		modal.prefocus = $(document.createElement('div'));
		modal.prefocus.setAttribute('tabindex', '0');
		modal.prefocus.observe('focus', function (e) {
			jQuery(modal.innerdiv).find(':tabbable').last().focus();
		})
		modal.outerdiv.appendChild(modal.prefocus)

		// CONTENT DIV
		modal.innerdiv = $(document.createElement('div'));
		modal.innerdiv.setStyle({
			position: 'relative',
			top: 30,
			margin: '30px auto',
			backgroundColor: 'white',
			filter: 'progid:DXImageTransform.Microsoft.Shadow(color="#000000", Direction=180, Strength=50);'
		});
		modal.innerdiv.style['webkitBoxShadow'] = '0px 0px 50px black';
		modal.innerdiv.style['MozBoxShadow'] = '0px 0px 50px black';
		modal.innerdiv.style['boxShadow'] = '0px 0px 50px black';

		this.content.setStyle({cssFloat: 'none'});

		modal.outerdiv.appendChild(modal.innerdiv);

		modal.postfocus = $(document.createElement('div'));
		modal.postfocus.setAttribute('tabindex', '0');
		modal.postfocus.observe('focus', function (e) {
			jQuery(modal.innerdiv).find(':tabbable').first().focus();
		})
		modal.outerdiv.appendChild(modal.postfocus)

		// when the window is resized we're going to have to make sure the document body
		// is tall enough to accomodate our content.  Otherwise it will get cut off.
		Event.observe(window, 'resize', function (e) {
			if (modal.currentmodal) modal.currentmodal.resize();
		});
	}
	if (readCookie("modal_reload") == this.reloadid()) this.show();
}

modal.prototype.show = function() {
	if (modal.currentmodal) modal.currentmodal.hide(true);

	// set aria-disabled="true" on everything in the page that is not
	// inside our modal
	$(document.body).childElements().each( function (itm) {
		if (itm != modal.outerdiv && itm.readAttribute) {
			itm.modal_disabled = true;
			itm.save_aria_disable = itm.readAttribute('aria-disabled');
			itm.writeAttribute('aria-disabled', 'true');
		}
	});

	modal.outerdiv.setStyle({display: 'block'});
	this.content.setStyle({display: this.originalDisplayStyle, cssFloat: 'none'});
	modal.innerdiv.appendChild(this.content);
	this.resize();
	window.scrollTo(0, 0);
	jQuery(this.content).find(':tabbable').first().focus();
	modal.currentmodal = this;
	createCookie("modal_reload", this.reloadid());
};

modal.prototype.hide = function(cleanup) {
	this.content.setStyle({display: 'none'});
	this.contentparent.appendChild(this.content);
	if (!cleanup) {
		modal.outerdiv.setStyle({display: 'none'});
		document.body.setStyle({height: 'auto'});

		// undo what we did to aria-disabled on show()
		$(document.body).childElements().each( function (itm) {
			if (itm != modal.outerdiv) {
				if (itm.modal_disabled) itm.writeAttribute('aria-disabled', itm.save_aria_disable);
				itm.modal_disabled = false;
			}
		});
	}
	deleteCookie("modal_reload");
};

modal.prototype.toggle = function() {
	if (modal.shown() && this == modal.currentmodal) modal.currentmodal.hide();
	else this.show();
};

modal.box = function() {
	return modal.innerdiv;
};

modal.shown = function() {
	return (modal.outerdiv.getStyle('display') == 'block');
};

modal.prototype.resize = function() {
	if (!modal.shown()) return;
	var navh = modal.innerdiv.getHeight() + cssDim(modal.innerdiv.getStyle('margin-top'));
	var doch = getDocHeight();
	modal.outerdiv.setStyle({height: Math.max(navh, doch)+'px'});
	if (navh > doch) document.body.setStyle({height: navh+'px'});
	if (this.content.getStyle('width')) {
		modal.innerdiv.setStyle({width: this.content.getWidth()+'px'});
	}
};

modal.prototype.reloadid = function() {
	if (this.content.id != "") return '#'+this.content.id;
	return '.'+this.contentparent.className.split(' ').join('.') + ' ' + '.'+this.content.className.split(' ').join('.');
};

Event.observe(window, 'keydown', function (e) {
	// escape key dismisses modal
	if (modal.currentmodal && e.keyCode == 27) modal.currentmodal.hide();
});

/**** MAGNOLIA-SPECIFIC ROUTINES ****/
modal.prototype.addToMainbar = function(title) {
	var mymodal = this;
	ensureReady(function() {
		if (!$('modalbar')) {
			var modalbar = $(document.createElement('div'));
			modalbar.writeAttribute({ 'aria-label': 'Modal activation buttons' });
			modalbar.id = 'modalbar';
			modalbar.setStyle({ position: 'absolute', top: '0px', left: '0px', overflow: 'hidden', zIndex: 70000 });
			$(document.body).appendChild(modalbar);
		}
		var btn = $(document.createElement('button'));
		btn.innerHTML = title;
		$('modalbar').appendChild(btn);
		btn.observe('click', function() { mymodal.toggle(); });
	});
};
