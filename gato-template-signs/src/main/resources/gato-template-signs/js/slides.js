window.requestAnimationFrame = (
	window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame		 || 
	window.oRequestAnimationFrame			 || 
	window.msRequestAnimationFrame		 || 
	function(callback, element) {
		return window.setTimeout(function() { callback(+new Date()); }, 1000 / 60);
	});
window.cancelAnimationFrame = (
	window.cancelAnimationFrame || 
	window.webkitCancelAnimationFrame || 
	window.mozCancelAnimationFrame		|| 
	window.oCancelAnimationFrame			|| 
	window.msCancelAnimationFrame			|| 
	function(timer) {
		return window.clearTimeout(timer);
	});

var digital_signage = {
	adminmode: function () {
		return $(document.body).hasClassName('admin');
	},
	publicmode: function () {
		return !digital_signage.adminmode();
	},
	check_changes: function () {		
		if (digital_signage.adminmode() || !digital_signage.lastmodurl || !digital_signage.lastmodsignature) return;
		new Ajax.Request(digital_signage.lastmodurl, {
			onSuccess: function(r) {
				var data = r.responseJSON;
				if (data.signature != digital_signage.lastmodsignature) location.reload(true);
			},
			onFailure: function(r) {
				console.log(r);
			}
		});
		setTimeout(digital_signage.check_changes, 30*1000);
	},
	check_visible: function (e) {
		do {
			if (e.getStyle && e.getStyle('display') == 'none') return false;
		} while (e.up && (e = e.up()));
		return true;
	},
	admin_adjust: function (show) {
		if (!digital_signage.adminmode()) return;
		// h is the number of pixels that we predict to be consumed by the edit bars
		// of parent slideshows
		var h = show.ancestors().grep(new Selector('.sign-show')).length * 23;
		
		// we will make sure our edit bar is below them
		var t = show.positionedOffset().top;
		
		var newt = h > t ? h - t : 0;
		show.down('.mgnlEditorBar').setStyle({top: newt+'px'});
		show.down('.slides-admin').setStyle({top: (newt+23)+'px'});
	},
	content_adjust: function (itm) {
		var iw = itm.original_width || itm.getWidth();
		var ih = itm.original_height || itm.getHeight();
		if (iw == 0 || ih == 0) return;
		itm.original_width = iw;
		itm.original_height = ih;
		var pw = itm.up('.sign-content').getWidth();
		var ph = itm.up('.sign-content').getHeight();
		var nw = 0;
		var nh = 0;
		
		var clip = itm.hasClassName('clip');
		if (!clip && iw/ih > pw/ph || iw/ih < pw/ph && clip) {
			nw = pw;
			nh = ih*(pw/iw);
			ol = 0;
			oh = (ph - nh)/2;
		} else {
			nh = ph;
			nw = iw*(ph/ih);
			ol = (pw - nw)/2;
			oh = 0;
		}
		
		itm.setStyle({width: nw+'px', height: nh+'px', marginLeft: ol+'px', marginTop: oh+'px'});
	},
	img_adjust: function (itm) {
		digital_signage.content_adjust(itm.down('img'));
	},
	video_adjust: function (itm) {
		var vlnk = itm.down('.txst-video-link');
		var vcont = itm.down('.txst-video-container');
		digital_signage.content_adjust(vlnk);
		
		// resize any flash objects or iframes
		var obj = vlnk.down('object,iframe');
		if (obj) obj.setStyle({width: vlnk.getWidth()+'px', height: vlnk.getHeight()+'px'});
		
		// reposition the play button
		var img = vlnk.down('img');
		if (img) {
			img.setStyle({width: '10%', height: 'auto'});
			img.setStyle({left: ((vlnk.getWidth()-img.getWidth())/2)+'px', top: ((vlnk.getHeight()-img.getHeight())/2)+'px'});
		}
		
		// resize the splash image
		if (!vcont.getStyle('background-image').match(/video-background\.png/))
			vcont.setStyle({backgroundSize: vlnk.getWidth()+'px '+vlnk.getHeight()+'px'});
		
		// autoplay, but defer 10ms so that the page can finish resizing
		if (digital_signage.publicmode()) setTimeout(function () { click_generic_player(vlnk, vcont.id, video_opts[vcont.id]) }, 10);
	},
	video_unload: function (itm) {
		unload_generic_player(itm.down('.txst-video-link'));
	},
	text_adjust: function (itm) {
		var fdiv = itm.down('div');
		var h = itm.getContentHeight();
		var w = itm.getContentWidth();
		fdiv.setStyle({fontSize: '6px'});
		for (var fs = 6; fdiv.getHeight() < h && fdiv.getWidth() <= w && fs < 1000; fs++) {
			fdiv.setStyle({fontSize: fs+'px'});
		}
		fdiv.setStyle({fontSize: (fs-2)+'px'});
		fdiv.setStyle({marginTop: (h-fdiv.getHeight())/2+'px'});
	},
	marquee_adjust: function (itm) {
		digital_signage.text_adjust(itm);
		itm.innerdiv = itm.down('div');
		itm.framewidth = itm.getWidth();
		itm.innerw = itm.innerdiv.getWidth();
		itm.offsetpertime = ((itm.innerdiv.getHeight()/itm.framewidth)*4 + 2)/35;
		digital_signage.marquee_scroll(itm);
	},
	marquee_scroll: function (itm) {
		if (itm.timer) window.cancelAnimationFrame(itm.timer);
		if (!digital_signage.check_visible(itm)) return itm.last_time = null;
		if (!itm.marquee_left) itm.marquee_left = 0;
		if (itm.marquee_left < -itm.innerw) itm.marquee_left = itm.framewidth;
		var now = new Date();
		var dt = now - (itm.last_time || new Date());
		itm.marquee_left -= itm.offsetpertime*dt;
		itm.innerdiv.setStyle({left: Math.round(itm.marquee_left)+'px'});
		itm.timer = window.requestAnimationFrame(function() { digital_signage.marquee_scroll(itm); });
		itm.last_time = now;
	},
	iframe_adjust: function (itm) {
		var cw = itm.title;
		if (cw > 0) {
			var w = itm.getWidth();
			var ratio = w/cw;
			var scale = 'scale('+ratio+')';
			itm.down('iframe').setStyle({
				MozTransform: scale,
				WebkitTransform: scale,
				OTransform: scale,
				MSTransform: scale,
				transform: scale,
				width: (100/ratio)+'%',
				height: (100/ratio)+'%'
			});
		}
	},
	toggle_slides: function (show) {
		var slideadmin = show.down('.slides-admin');
		if (slideadmin.visible()) digital_signage.hide_slideadmin(show);
		else digital_signage.show_slideadmin(show);
	},
	show_slideadmin: function (show) {
		var slideadmin = show.down('.slides-admin')
		show.setStyle({zIndex: 1});
		if (slideadmin.visible()) return;
		slideadmin.show();
		show.down('.mgnlEditorBarButtons > .mgnlEditorButton').innerHTML = 'Hide Edit Bars';
		show.select('.sign-show').each(digital_signage.hide_slideadmin);
		digital_signage.hide_schedule();
		show.down('.mgnlEditorBar.component').setStyle({opacity: 1});
		digital_signage.update_cookie();
	},
	hide_slideadmin: function (show) {
		var slideadmin = show.down('.slides-admin');
		show.setStyle({zIndex: 0});
		if (!slideadmin.visible()) return;
		slideadmin.hide();
		show.down('.mgnlEditorBarButtons > .mgnlEditorButton').innerHTML = 'Show Edit Bars';
		show.down('.mgnlEditorBar.component').setStyle({opacity: 0.5});
		digital_signage.update_cookie();
	},
	toggle_schedule: function () {
		if ($$('.topcontent')[0].visible()) digital_signage.hide_schedule();
		else digital_signage.show_schedule();
	},
	show_schedule: function () {
		var bars = $$('.topcontent')[0];
		if (bars.visible()) return;
		bars.show();
		$$('.sign-show').each(digital_signage.hide_slideadmin);
		$$('.mgnlEditorMainbar button').each( function (btn) {
			if (btn.innerHTML.match(/(show|hide)/i)) btn.innerHTML = "Hide Top-Level";
		});
	},
	hide_schedule: function (skip_show) {
		var bars = $$('.topcontent')[0];
		if (!bars.visible()) return;
		bars.hide();
		if (!skip_show) $$('.sign-frame > .sign-show').each(digital_signage.show_slideadmin);
		$$('.mgnlEditorMainbar button').each( function (btn) {
			if (btn.innerHTML.match(/(show|hide)/i)) btn.innerHTML = "Show Top-Level";
		});
	},
	// function for activating slide content - adjust sizes, start videos, set rotation 
	// going on slideshows, etc
	load_slide: function (slide) {
		// make sure what's showing has been properly sized and videos
		// start playing, etc
		digital_signage.resize_within(slide);
		// make sure the rotation on descendent slideshows is running
		slide.select('.sign-show').each( function (show) {
			if (show.timer) clearTimeout(show.timer);
			if (show.curr) show.timer = setTimeout(function() { digital_signage.rotate_slide(show) }, show.curr.rotate_delay);
		});
	},
	// function for deactivating slide content - unload videos, halt slideshow rotation, etc
	unload_slide: function (slide) {
		slide.select('.sign-video').each(digital_signage.video_unload);
		slide.select('.sign-show').each( function (show) {
			if (show.timer) clearTimeout(show.timer);
		});
	},
	show_slide: function (show, idx, skip_anim) {
		var slides = show.childElements().grep(new Selector('.sign-slide'));
		if (slides.length == 0) return;
		if (!idx || idx >= slides.length) idx = 0;
		if (!show.curridx) show.curridx = 0;
		var curr = show.curr = slides[show.curridx];
		var next = slides[idx];
		
		// activate the correct edit bar
		if (digital_signage.adminmode()) {
			var bars = show.down('.slides-admin').childElements().grep(new Selector('.contentbars'));
			if (bars && bars.length > 0) {
				bars.each(function (itm) { itm.removeClassName('selected'); });
				bars[idx].addClassName('selected');
			}
		}
		
		// we call show_slide on page load in order to load slides that are indicated
		// by the state cookie.  we can recognize that kind of call because it uses
		// skip_anim.  In this case, we need to do an initial load of the slide
		if (show.curridx == idx && skip_anim) digital_signage.load_slide(next);

		// last minute sanity check - if this is the initial page load then our slide
		// may already be active, in which case we can stop
		if (show.curridx == idx) return;
		
		// choose an animation style at random among the options that are deemed acceptable
		// for this show
		var styles = show.slide_styles.split(',');
		var style = styles[Math.floor(Math.random()*styles.length)];
		
		var duration = 0.4;
		var after_setup = function () {
			next.addClassName('selected');
			digital_signage.load_slide(next);
			next.setStyle({zIndex: 2});
		};
		var after_finish = function () {
			curr.removeClassName('selected'); 
			digital_signage.unload_slide(curr);
			next.setStyle({zIndex: 1});
		};
		if (skip_anim) {
			after_setup();
			after_finish();
		} else if (style == 'slide') {
			new Effect.Parallel([
				new Effect.Morph(next, { style: 'left: 0%', sync: true }),
				new Effect.Morph(curr, { style: 'left: -100%', sync: true })
			],{
				duration: duration,
				queue: 'end',
				beforeSetup: function () {
					next.setStyle({opacity: 1, left: '100%'});
				},
				afterSetup: after_setup,
				afterFinish: after_finish
			});
		} else { // fade
			new Effect.Parallel([
				new Effect.Morph(next, { style: 'opacity: 1', sync: true }),
				new Effect.Morph(curr, { style: 'opacity: 0', sync: true })
			],{
				duration: duration,
				queue: 'end',
				beforeSetup: function () {
					next.setStyle({opacity: 0, left: '0%'});
				},
				afterSetup: after_setup,
				afterFinish: after_finish
			});
		}
		
		show.curridx = idx;
		show.curr = next;
		digital_signage.update_cookie();
	},
	rotate_slide: function (show) {
		if (digital_signage.adminmode()) return;
		clearTimeout(show.timer);
		if (!show.curridx) show.curridx = 0;
		digital_signage.show_slide(show, show.curridx+1);
		show.timer = setTimeout(function() { digital_signage.rotate_slide(show) }, show.curr.rotate_delay);
	},
	update_cookie: function () {
		var show_hash = {};
		var admin_hash = {};
		$$('.sign-show').each(function(itm) {
			show_hash[itm.id] = itm.curridx || 0;
			if (digital_signage.adminmode()) admin_hash[itm.id] = itm.down('.slides-admin').visible();
		});
		deleteCookie('digital_signage_shown');
		createCookie('digital_signage_shown', Object.toJSON(show_hash));
		if (digital_signage.adminmode()) {
			deleteCookie('digital_signage_admin');
			createCookie('digital_signage_admin', Object.toJSON(admin_hash));
		}
	},
	load_state: function() {
		var shown = readCookie('digital_signage_shown');
		try {
			var show_hash = shown.evalJSON(true);
		} catch (e) {
			var show_hash = {};
		}
		var admin = readCookie('digital_signage_admin');
		try {
			var admin_hash = admin.evalJSON(true);
		} catch (e) {
			var admin_hash = {};
		}
		
		// initial resize step so that our stage is properly sized
		digital_signage.resize_frame();

		// load the slide for each slideshow based on what was in the cookie
		var showedadmin = false;
		$$('.sign-show').each(function(itm) {
			digital_signage.show_slide(itm, show_hash[itm.id], true);
			if (digital_signage.adminmode()) {
				if (admin_hash[itm.id]) { digital_signage.show_slideadmin(itm); showedadmin = true; }
				else digital_signage.hide_slideadmin(itm);
			}
			if (digital_signage.check_visible(itm)) {
				if (itm.timer) clearTimeout(itm.timer);
				if (itm.curr) itm.timer = setTimeout(function() { digital_signage.rotate_slide(itm) }, itm.curr.rotate_delay);
			}
		});
				
		// admin-side stuff to help hide excess bars on slideshows
		if (digital_signage.adminmode()) {
			if (showedadmin) digital_signage.hide_schedule(true);
			else if ($$('.sign-show').length > 0) digital_signage.hide_schedule();
			else digital_signage.show_schedule();
		}
	},
	resize_elements: function (itm) {
		// images need to be scaled to their parent but only until they hit an edge
		itm.childElements().grep(new Selector('.sign-image')).each(digital_signage.img_adjust);
		// marquees need to be scaled to their parent
		itm.childElements().grep(new Selector('.sign-marquee')).each(digital_signage.marquee_adjust);
		// text areas need to be scaled to their parent
		itm.childElements().grep(new Selector('.sign-text')).each(digital_signage.text_adjust);
		// videos need to be scaled and started playing
		itm.childElements().grep(new Selector('.sign-video')).each(digital_signage.video_adjust);
		// iframes need to be zoomed to fit
		itm.childElements().grep(new Selector('.sign-iframe')).each(digital_signage.iframe_adjust);
	},
	// resize all the elements within a slide, itm should be
	// a slide or the page frame, which sort of acts like a slide
	resize_within: function(itm) {
		// empty or uninitialized slideshows might have this called with itm == undefined
		if (!itm) return;
		// resize elements inside this slide
		digital_signage.resize_elements(itm);
		// trigger the resize on any shows in this slide
		itm.childElements().grep(new Selector('.sign-show')).each( function (show) {
			digital_signage.admin_adjust(show);
			digital_signage.resize_within(show.curr);
		});
	},
	resize_frame: function(e) {
		// set the page frame to fit within the browser window
		var frame = $$('.sign-frame')[0];
		var iw = frame.original_width || frame.getWidth();
		var ih = frame.original_height || frame.getHeight();
		if (iw == 0 || ih == 0) return;
		frame.original_width = iw;
		frame.original_height = ih;
		var pw = window.innerWidth;
		var ph = window.innerHeight-frame.cumulativeOffset().top;
		var nw = 0;
		var nh = 0;
		
		if (iw/ih > pw/ph) {
			nw = pw;
			nh = ih*(pw/iw);
		} else {
			nh = ph;
			nw = iw*(ph/ih);
		}
		frame.setStyle({width: nw+'px', height: nh+'px'});
		// get background content resized
		digital_signage.resize_elements(frame);
	},
	resize: function(e) {
		digital_signage.resize_frame();
		digital_signage.resize_within($$('.sign-frame')[0]);
	},
	editbars: function () {
		if (digital_signage.publicmode()) return;
		gatoedit.addGenericToMainbar('Show Top-Level', digital_signage.toggle_schedule);
		$$('.sign-show').each( function (show) {
			var editbar = show.down('.mgnlEditorBar.component');
			show.slideidx = 0;
			show.parenteditbar = editbar;
			show.maineditbar = editbar.clone(false);
			show.maineditbar.appendChild(editbar.down('.mgnlEditorBarButtons').clone(false));
			show.insert({top: show.maineditbar});
			gatoedit.addGenericToEditbar(show.maineditbar, 'Show Edit Bars', function () { digital_signage.toggle_slides(show); });
			gatoedit.addGenericToEditbar(show.parenteditbar, 'View', function () {
				if (show.up('.sign-show')) digital_signage.hide_slideadmin(show.up('.sign-show'));
				else digital_signage.hide_schedule(true);
				digital_signage.show_slideadmin(show);
			});
		});
		$$('.sign-show, .sign-content').each( function (itm) {
			var parent = itm.up('.sign-slide');
			var container = parent ? parent.down('.contentbars') : $$('.topcontent')[0];
			var editbar = itm.match('.sign-show') ? itm.parenteditbar : itm.down('.mgnlEditorBar.component');
			container.appendChild(editbar);
		});

		// put the base newbar where it goes
		$$('.topcontent')[0].appendChild($$('.sign-frame')[0].down('>.mgnlEditorPlaceholder.component'));

		$$('.sign-slide').each( function (slide) {
			var show = slide.up('.sign-show');
			var container = show.down('.slides-admin');
			var editbar = slide.down('.mgnlEditorBar.component');
			var contentbars = slide.down('.contentbars');
			var newbar = slide.down('>.mgnlEditorPlaceholder.component');
			newbar.down('.mgnlEditorBarLabel').innerHTML = "New Content";
			contentbars.appendChild(newbar);
			container.appendChild(editbar);
			container.appendChild(contentbars);
			var j = show.slideidx;
			gatoedit.addGenericToEditbar(editbar, 'Show', function () { digital_signage.show_slide(show,j) });
			show.slideidx++;
		});
		
		$$('.sign-show').each( function(show) {
			var container = show.down('.slides-admin');
			var newbar = show.down('>.mgnlEditorPlaceholder.component');
			newbar.down('.mgnlEditorBarLabel').innerHTML = "New Slide(s)";
			gatoedit.addGenericToEditbar(newbar, 'Zip Upload', function() {
				mgnlOpenDialog(show.getAttribute('data-handle'),'slides','','sign-zip-upload','website');
			});
			container.appendChild(newbar);
		});
	}
}

Event.observe(window, 'load', digital_signage.load_state);
Event.observe(window, 'load', digital_signage.check_changes);
Event.observe(window, 'resize', digital_signage.resize);
gatoedit.ready(digital_signage.editbars);