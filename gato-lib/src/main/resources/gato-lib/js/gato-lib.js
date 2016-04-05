// determine what event we should look for to detect orientation changes
orientationChangeEventName = ( "onorientationchange" in window ) ? "orientationchange" : "resize";

// add css class to html element for touch screen devices
// NB: This is not 100% reliable, so don't use it on mission critical stuff
// http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
isTouchScreen = "ontouchstart" in window;
document.documentElement.className += isTouchScreen ? " touch" : " no-touch";

// detect iphone or ipod touch
function detect_iphone() {
	return navigator.userAgent.match(/(iPhone|iPod)/i);
}

// detect Apple mobile devices with touch screen interfaces
function detect_apple() {
	return navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
}

// detect devices with touch screen interfaces
// see caveat above
function detect_touch() {
	return isTouchScreen;
}

// detect android
function detect_android() {
	return navigator.userAgent.match(/android/i);
}

// detect mobile
function detect_mobile() {
	return screen && screen.width <= 500;
}

// fire an event on an element in a cross-platform manner
function fireEvent(obj,evt){
	if( document.createEvent ) {
		if (evt == 'click' || evt == 'mouseup' || evt == 'mousedown')
			var evObj = document.createEvent('MouseEvents');
		else
			var evObj = document.createEvent('HTMLEvents');
		evObj.initEvent( evt, false, true );
		obj.dispatchEvent(evObj);
	} else if( document.createEventObject ) {
		obj.fireEvent('on'+evt);
	}
}

// trim polyfill for IE8 and lower
if (!String.prototype.trim) {
  (function() {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, '');
    };
  })();
}

// search a sorted array for value v in log(n) time
// if findNearest is true and v is not found, returns the index at
//   which v should be inserted
// otherwise returns -1 when v is not found
Array.prototype.binarySearch = function(v, findNearest){
	var o = this;
	var h = o.length, l = -1, m;
	while(h - l > 1)
			if(o[m = h + l >> 1] < v) l = m;
			else h = m;
	return o[h] != v ? findNearest ? h : -1 : h;
};

// fast shuffle algorithm
Array.prototype.shuffle = function(){ //v1.0
	for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};

var hostElements = window.location.hostname.split(".");

function createCookie(name,value,domain,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	if (!domain) domain = "." + hostElements[ hostElements.length - 2 ] + "." + hostElements[ hostElements.length - 1 ];
	document.cookie = name+"="+escape(value)+expires+"; path=/;domain=" + domain;
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length,c.length));
	}
	return null;
}

function deleteCookie(name) {
	domain = "." + hostElements[ hostElements.length - 1 ];
	for (var i = 2; i <= hostElements.length; i++) {
		domain = "." + hostElements[ hostElements.length - i ] + domain;
		createCookie(name, '', domain, -1);
	}
}

// Add an abort method to Prototype's Ajax implementation
Ajax.Request.prototype.abort = function() {
	this.transport.onreadystatechange = Prototype.emptyFunction;
	this.transport.abort();
	if (Ajax.activeRequestCount > 0) Ajax.activeRequestCount--;
}

function cssDim(dim) {
	if (dim == "thin") return 1;
	if (dim == "medium") return 3;
	if (dim == "thick") return 5;
	var fl = parseFloat(dim);
	if (isNaN(fl)) fl = 0;
	return Math.round(fl);
}

// getHeight() and getWidth() are provided by prototype but sometimes are too limited
// let's add some methods that automatically subtract the width of the borders and padding
// getInnerXXXX functions will subtract border width,
// getContentXXXX functions will subtract border width AND padding
// redraw function forces an element to be redrawn, useful for IE when it's being stubborn
Element.addMethods({ getInnerDimensions: function(element) {
	return {
		width: element.getWidth()-cssDim(element.getStyle('border-left-width'))-cssDim(element.getStyle('border-right-width')),
		height: element.getHeight()-cssDim(element.getStyle('border-top-width'))-cssDim(element.getStyle('border-bottom-width'))
	};
}, getInnerHeight: function(element) {
	return element.getInnerDimensions().height;
}, getInnerWidth: function (element) {
	return element.getInnerDimensions().width;
}, getContentDimensions: function(element) {
	var inner = element.getInnerDimensions();
	return {
		width: inner.width-cssDim(element.getStyle('padding-left'))-cssDim(element.getStyle('padding-right')),
		height: inner.height-cssDim(element.getStyle('padding-top'))-cssDim(element.getStyle('padding-bottom'))
	};
}, getContentHeight: function (element) {
	return element.getContentDimensions().height;
}, getContentWidth: function (element) {
	return element.getContentDimensions().width;
}});
function getDocHeight() {
	var ch = oh = ih = sh = 0;
	if (document.body.clientHeight) ch = document.body.clientHeight;
	if (document.documentElement.offsetHeight) oh = document.documentElement.offsetHeight;
	if (window.innerHeight) ih = window.innerHeight;
	if (document.body.parentNode.scrollHeight) sh = document.body.parentNode.scrollHeight;
    return Math.max(ch, oh, ih, sh);
}
function getDocWidth() {
	var cw = ow = iw = sw = 0;
	if (document.body.clientWidth) cw = document.body.clientWidth;
	if (document.documentElement.offsetWidth) ow = document.documentElement.offsetWidth;
	if (window.innerWidth) iw = window.innerWidth;
	if (document.body.parentNode.scrollWidth) sw = document.body.parentNode.scrollWidth;
    return Math.max(cw, ow, iw, sw);
}
function getViewportHeight() {
	var vh = document.viewport.getHeight();
	if (window.innerHeight - vh > 30 || !vh) return window.innerHeight;
	return vh;
}
function getViewportWidth() {
	var vw = document.viewport.getWidth();
	return vw || window.innerWidth;
}
function ie_redraw() {
	var version = parseFloat(navigator.appVersion.split('MSIE')[1]);
	if (version >= 5.5 && version < 9) {
		document.body.style.display = 'none';
		document.body.style.display = 'block';
	}
}

Array.prototype.shuffle = function(){ //v1.0
	for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};

// clear search fields of their default when clicked
document.observe('dom:loaded', function () {
	$$('.txst-banner-search input, input.search-default, .search-box-content input.query').each(function(fld) {
		fld.observe('focus', function (event) {
			if (this.value == this.defaultValue) this.value = '';
			this.addClassName('focused');
		});
		fld.observe('blur', function (event) {
			if (this.value == '') {
				this.value = this.defaultValue;
				this.removeClassName('focused');
			}
		});
	});
});

// let's set a variable on dom:loaded so we know that setting a dom:loaded observer will
// no longer work
var gato_dom_loaded = false;
document.observe('dom:loaded', function() {
	gato_dom_loaded = true;
});

function ensureReady(closure) {
	if (gato_dom_loaded) closure();
	else document.observe('dom:loaded', closure);
}

// Shrinks the font-size of the given element until
// it fits inside its parent.
var fitText = function(item) {
	item = $(item);
	item.origFontSize = parseFloat(item.getStyle('fontSize'));

	var doFit = function() {
		var boxLayout = new Element.Layout(item.up(), true);
		var boxHeight = boxLayout.get('height');
		var boxWidth = boxLayout.get('width');

		while (true) {
			var layout = new Element.Layout(item);
			var height = layout.get('margin-box-height');
			var width = layout.get('margin-box-width');
			if (height >= boxHeight || width >= boxWidth) {
				var fontSize = parseFloat(item.getStyle('fontSize')) - 1;
				if (fontSize >= 8) {
					item.setStyle({ fontSize: fontSize + 'px' });
					continue;
				}
			}
			break;
		}
	};

	doFit();
	Event.observe(window, 'resize', function (e) {
		item.setStyle({ fontSize: item.origFontSize + 'px' });
		doFit();
	});
};

// hooking an observer to window.resize can be dangerous for performance
// depending on browser your function could be called for every pixel between
// the old and new sizes
// this adds a small setTimeout so that your function runs when the resize
// event has settled down
// it also calls your function immediately, because isn't page load really the
// first resize event?
function resizeTimeout(callback) {
	var to;
	var savedWidth = 0;
	var savedHeight = 0;
	var myfunc = function () {
    var vpw = window.innerWidth;
    var vph = window.innerHeight;
    if (vph != savedHeight || vpw != savedWidth) {
      clearTimeout(to);
		  to = setTimeout(callback, 100);
		  savedWidth = vpw;
		  savedHeight = vph;
		}
	};
	jQuery(document).ready(myfunc);
	jQuery(window).load(myfunc);
	jQuery(window).resize(myfunc);
}

// jQuery already has an 'fx' queue for each jquery object, but it permits
// a lot of bad situations, like event-based animations writing over one another.
//
// This function should make it a bit easier to keep things in order and to queue up
// complex animations involving multiple DOM elements.
//
// qname: a unique string, probably a module name so your widget gets a private queue
// callback: the function that initiates your animation, including any setup
//   must return a promise, probably a jQuery.Deferred object obtained from jQuery.when()
// successcb: optional function to be called on successful addition to the queue
//   queue is limited to 3 so that the user won't be left waiting
//   use this function to update your widget's internal state, this way it remains unchanged
//   when your queue is full and the animation is not actually going to happen
//
// returns a jQuery.Deferred() object so that you can chain commands
// like .done(), .always(), and .fail(), as is typical in jQuery
//
// see gato-component-feature/js/feature.js for example usage
function animQueue(qname, callback, successcb) {
	if (typeof(animQueue.q) == 'undefined') animQueue.q = {};
	if (typeof(animQueue.q[qname]) == 'undefined') animQueue.q[qname] = [];
	var q = animQueue.q[qname];
	var deferred = new jQuery.Deferred();
	deferred.queuecb = callback;
	if (q.length > 2) {
		setTimeout(function () { deferred.reject(); }, 0);
	} else {
		q.push(deferred);
		if (typeof(successcb)=='function') successcb();
		var finish = function() {
			var qdefer = q.shift();
			qdefer.resolve();
			if (q.length > 0) q[0].queuecb().done(finish);
		};
		if (q.length == 1) q[0].queuecb().done(finish);
	}
	return deferred;
}

// provide an accessible jQuery event for clicking a link and then
// calling blur(), we do this a lot to avoid ugly CSS :focus issues,
// but if someone is keyboard navigating we should not blur() as they
// will lose their place in the document
jQuery.fn.blurclick = function (callback) {
  return this.on('keydown click', function (e) {
    if (e.type=='click') this.blur();
    if (e.keyCode == 13 || e.type=='click') {
      e.preventDefault();
      return callback.call(this,e);
    }
  });
}

// requires jquery
//
// provide a function that can wait for an element to appear on the
// page so that it can be modified
//
// parentselector should be something that appears in the raw HTML so
// that we can watch a smaller area for changes.  Just use the smallest
// DOM element possible, or all the way up to 'body' if the target element
// can truly appear anywhere
//
// callback will receive a jQuery object containing the target element
// as a parameter
function waitforselector(parentselector, selector, callback) {
  var sanitycount = 0;
  var parent = jQuery(parentselector);

  // parent must exist at the time of the call so that we can
  // use waitforselector on all pages without fear of creating a javascript error
  if (parent.size() == 0) return;

  if (parent.find(selector).size() > 0) return callback(parent.find(selector));
  if (typeof(MutationObserver) != "undefined") {
    var observer = new MutationObserver(function(mutations, observer) {
      sanitycount++;
      if (parent.find(selector).size() > 0) {
        observer.disconnect();
        return callback(parent.find(selector));
      } else if (sanitycount > 200) {
        observer.disconnect();
      }
    });
    observer.observe(parent.get(0), {childList: true, subtree: true});
  } else {
    var observer = function() {
      sanitycount++;
      if (parent.find(selector).size() > 0) return callback(parent.find(selector));
      else if (sanitycount < 200) setTimeout(observer, 100);
    }
    setTimeout(observer, 100);
  }
}

// specialized version of waitforselector especially for changing labels
// on magnolia edit bars
function magnolialabelchange(parentselector, selector, newlabel) {
  waitforselector(parentselector, selector, function (ele) {
    ele.find('.mgnlEditorBarLabel').html(newlabel).attr('title',newlabel);
  });
}
function titledlabelchange(parentselector, prefix) {
  prefix = prefix || '';
  waitforselector(parentselector, '.mgnlEditor.component', function (jqobj) {
    jqobj.each(function (index, ele) {
      ele = jQuery(ele);
      ele.find('.mgnlEditorBarLabel').html(prefix+ele.parents(parentselector).attr('data-title'));
    });
  });
}
// jQuery plugin method for creating an accessible
// hover menu
// usage: $('a.linktohoverover').hovermenu('.thingtohideandshow');
// first element MUST be a link so that it is eligible for tabs
// during keyboard control
jQuery.fn.hovermenu = function (submenu) {
  var parent = this;
  var items = jQuery(submenu);
  var timeout;
  var shown = false;
  var show = function () {
    clearTimeout(timeout);
    items.show();
    shown = true;
  };
  var hide = function () {
    if (!shown) {
      return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(function () { items.hide(); shown = false; }, 200);
  };
  items.find('a').add(parent).on('mouseenter focus', show).on('mouseleave blur', hide);

  jQuery(document).on('touchend', function (e) {
    if (parent.is(e.target)) {
      e.preventDefault();
      shown ? hide() : show();
    } else {
      hide();
    }
  });
}

// to be used on a jQuery object containing a single image
// if image is already loaded (cached, usually), then callback executed immediately
// otherwise executed on jquery load event
// if you just use the load event cached images will never trigger your code
jQuery.fn.afterload = function (callback) {
  if (this.prop('complete')) callback();
  else this.load(callback);
}

function observePrint(beforePrint, afterPrint) {
  if ('onbeforeprint' in window) {
    // IE and Firefox fire before/after events
    jQuery(window).on('beforeprint', beforePrint);
    jQuery(window).on('afterprint', afterPrint);
  } else if ('matchMedia' in window) {
    // Chrome, Firefox, and IE 10 support mediaMatch listeners
    window.matchMedia('print').addListener(function(media) {
      if (media.matches) {
        beforePrint();
      } else {
        // Fires immediately, so wait for the first mouse movement
        jQuery(document).one('mouseover', afterPrint);
      }
    });
  }
}

// these are cross-browser resolving variables that can be used for
// high performing animations
var animationframe = window.requestAnimationFrame ||
                     window.webkitRequestAnimationFrame ||
                     window.mozRequestAnimationFrame ||
                     window.msRequestAnimationFrame ||
                     window.oRequestAnimationFrame ||
                     function(callback){ window.setTimeout(callback, 1000/20) };
var cssTransform = (function(){
    var prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' ')
      , el = document.createElement('div')
      , cssTransform
      , i = 0
    while( cssTransform === undefined ){
        cssTransform = el.style[prefixes[i]] != undefined ? prefixes[i] : undefined
        i++
        if (i >= prefixes.length) {
          cssTransform = function() {  }
          break;
        }
     }
     return cssTransform
 })();

/*
	cutoffs:
	a few seconds ago
	1 - 59 Minutes Ago
	1 - 6 Hours Ago
	Today at 9:37 A.M.
	Yesterday at 11:23 P.M.
	October 31
 */
function relativeTime(time) {
	t = moment(time);
  if (t.isAfter(moment().subtract(360, 'minutes'))) { // < 6h ago
    return t.fromNow();
  } else {
    return t.calendar(null, {
      sameDay : '[Today at] LT',
      lastDay : '[Yesterday at] LT',
      sameElse : 'MMMM D'
    });
  }
}

jQuery(function($) {
  $('.timestamp.relative').each(function() {
    // replace timestamps with relative time
    $(this).text(relativeTime($(this).data("timestamp")));
  });
});

//Setting the role to 'navigation' on the menu bar links enables
//the links.  They open in the current tab, not in a new tab.
jQuery(function($) {
   $('body.admin .ddmenu-menubar a, body.admin .office_name a').each(function(){
     $(this).attr('role', 'navigation');
   });
});

jQuery(function($){
    $('.column_paragraph table:not(.gato-table)').each(function(){
        //wrap rich editor tables in a div to make them scroll when they are too wide
        //don't wrap nested tables
        if($(this).parents('table').length == 0)
            $(this).wrap('<div class="rich-editor-table" />');
        //if the rich editor table has a width style, remove it and set a width class instead
        //auto-width for width:auto; and full-width for width:100%
        var width = $(this).css('width');
        $(this).css('width', '');
        if(parseInt(width) > 500)
            $(this).addClass('full-width');
        else
            $(this).addClass('auto-width');
    });
});
