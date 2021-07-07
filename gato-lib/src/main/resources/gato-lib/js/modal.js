function modal(content) {
	var mymodal = this;
	mymodal.opacity = 0.85;
	mymodal.content = content;
	mymodal.contentparent = content.parent();

	// let's make sure the modal content isn't shown when we're not modal

	ensureReady(function () {
		mymodal.originalDisplayStyle = mymodal.content.css('display')
		mymodal.content.css('display', 'none')
		mymodal.init()
	});
}

modal.prototype.init = function() {
	if (!jQuery('#modal_outer').length) {
		// OUTER DIV
		modal.outerdiv = jQuery('<div id="modal_outer" role="dialog">')
		modal.outerdiv.css({ "display":"none", "position":"absolute", "width":"100%", "height":"100%", "margin":"0", "padding":"0", "top":"0", "left":"0", "z-index":"65536" })
		jQuery('body').append(modal.outerdiv)

		// BACKGROUND DIV
		modal.bgdiv = jQuery('<div>')
		modal.bgdiv.css('opacity', this.opacity)
		modal.bgdiv.css({ "backgroundColor":"#000000", "position":"absolute", "zIndex":"-1", "width":"100%", "height":"100%", "margin":"0", "padding":"0", "top":"0", "left":"0" })
		modal.bgdiv.on('click', function(e) {
			modal.currentmodal.hide()
			e.stopPropagation()
		})
		modal.outerdiv.append(modal.bgdiv)
		
		// Trap focus in modal. If this element is reached via tabbing, move focus to the last tabbable element in the modal
		modal.prefocus = jQuery('<div tabindex="0">')
		modal.prefocus.on('focus', function(e) {
			jQuery(modal.innerdiv).find(':tabbable').last().focus()
		})
		modal.outerdiv.append(modal.prefocus)
		
		// CONTENT DIV
		modal.innerdiv = jQuery('<div>')
		modal.innerdiv.css({ "position":"relative", "margin":"30px auto", "backgroundColor":"white", "box-shadow":"0px 0px 50px black", "float":"none" })
		modal.outerdiv.append(modal.innerdiv)
		
		// Trap focus in modal. If this element is reached via tabbing, move focus to the first tabbable element in the modal
		modal.postfocus = jQuery('<div tabindex="0">')
		modal.postfocus.on('focus', function(e) {
			jQuery(modal.innerdiv).find(':tabbable').first().focus();
		})
		modal.outerdiv.append(modal.postfocus)
		
		// when the window is resized we're going to have to make sure the document body
		// is tall enough to accomodate our content.  Otherwise it will get cut off.
		jQuery(window).on('resize', function(e) {
			if (modal.currentmodal) modal.currentmodal.resize()
		})
	}
	
	if (readCookie("modal_reload") == this.reloadid()) this.show();
}

modal.prototype.show = function() {
	if (modal.currentmodal) modal.currentmodal.hide(true);

	// set aria-disabled="true" on everything in the page that is not
	// inside our modal
	jQuery('body').children().each(function() {
		var itm = jQuery(this)
		if (!itm.is('#modal_outer')) {
			itm.data('modal_disabled', true)
			itm.data('save_aria_disable', itm.attr('aria-disabled'))
			itm.attr('aria-disabled', true)
		}
	})
	
	modal.outerdiv.css('display', 'block')
	this.content.css('display', this.originalDisplayStyle)
	this.content.css('float', 'none')
	modal.innerdiv.append(this.content)
	this.resize()
	window.scrollTo(0, 0);
	this.savefocus = document.activeElement;
	jQuery(this.content).find(':tabbable').first().focus();
	modal.currentmodal = this;
	createCookie("modal_reload", this.reloadid());
}

modal.prototype.hide = function(cleanup) {
	this.content.css('display', 'none')
	this.contentparent.append(this.content)
	if (!cleanup) {
		modal.outerdiv.css('display', 'none')
		jQuery('body').css('height', 'auto')
		jQuery(this.savefocus).focus()
		// undo what we did to aria-disabled on show()
		jQuery('body').children().each(function() {
			var itm = jQuery(this)
			if (!itm.is('#modal_outer')) {
				if (itm.data('modal_disabled')) itm.attr('aria-disabled', item.data('save_aria_disable'))
				itm.data('modal_disabled', false)
			}
		})
	}
	deleteCookie("modal_reload");
}

modal.prototype.toggle = function() {
	if (modal.shown() && this == modal.currentmodal) modal.currentmodal.hide();
	else this.show();
};

modal.box = function() {
	return modal.innerdiv;
};

modal.shown = function() {
	return modal.outerdiv.css('display') == 'block'
};

modal.prototype.resize = function() {
	if (!modal.shown()) return
	var navh = modal.innerdiv.height() + cssDim(modal.innerdiv.css('margin-top'))
	var doch = getDocHeight();
	modal.outerdiv.css('height', Math.max(navh, doch)+'px')
	if (navh > doch) jQuery('body').css('height', navh + 'px')
	if (this.content.css('width')) {
		modal.innerdiv.css('width', this.content.css('width'))
	}
};

modal.prototype.reloadid = function() {
	if (this.content.attr('id') != "") return '#'+this.content.attr('id');
	return '.'+this.contentparent.attr('class').split(' ').join('.') + ' ' + '.'+this.content.attr('class').split(' ').join('.');
};

jQuery(window).on('keydown', function(e) {
	// escape key dismisses modal
	if (modal.currentmodal && e.keyCode == 27) modal.currentmodal.hide()
})

/**** MAGNOLIA-SPECIFIC ROUTINES ****/
modal.prototype.addToMainbar = function(title) {
	var mymodal = this;
	ensureReady(function() {
		if (!jQuery('#modalbar').length) {
			var modalbar = jQuery('<div aria-label="Modal activation buttons" id="modalbar">')
			modalbar.css({ "position":"absolute", "top":"0px", "left":"0px", "overflow":"hidden", "z-index":"70000" })
			jQuery('body').append(modalbar)
		}
		var btn = jQuery('<button>' + title + '</button>')
		jQuery('#modalbar').append(btn)
		btn.on('click', function() {
			mymodal.toggle()
		})
	});
};
