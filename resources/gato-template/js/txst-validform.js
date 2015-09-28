//fgnass.github.com/spin.js#v1.2.5
(function(a,b,c){function g(a,c){var d=b.createElement(a||"div"),e;for(e in c)d[e]=c[e];return d}function h(a){for(var b=1,c=arguments.length;b<c;b++)a.appendChild(arguments[b]);return a}function j(a,b,c,d){var g=["opacity",b,~~(a*100),c,d].join("-"),h=.01+c/d*100,j=Math.max(1-(1-a)/b*(100-h),a),k=f.substring(0,f.indexOf("Animation")).toLowerCase(),l=k&&"-"+k+"-"||"";return e[g]||(i.insertRule("@"+l+"keyframes "+g+"{"+"0%{opacity:"+j+"}"+h+"%{opacity:"+a+"}"+(h+.01)+"%{opacity:1}"+(h+b)%100+"%{opacity:"+a+"}"+"100%{opacity:"+j+"}"+"}",0),e[g]=1),g}function k(a,b){var e=a.style,f,g;if(e[b]!==c)return b;b=b.charAt(0).toUpperCase()+b.slice(1);for(g=0;g<d.length;g++){f=d[g]+b;if(e[f]!==c)return f}}function l(a,b){for(var c in b)a.style[k(a,c)||c]=b[c];return a}function m(a){for(var b=1;b<arguments.length;b++){var d=arguments[b];for(var e in d)a[e]===c&&(a[e]=d[e])}return a}function n(a){var b={x:a.offsetLeft,y:a.offsetTop};while(a=a.offsetParent)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}var d=["webkit","Moz","ms","O"],e={},f,i=function(){var a=g("style");return h(b.getElementsByTagName("head")[0],a),a.sheet||a.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto"},p=function q(a){if(!this.spin)return new q(a);this.opts=m(a||{},q.defaults,o)};p.defaults={},m(p.prototype,{spin:function(a){this.stop();var b=this,c=b.opts,d=b.el=l(g(0,{className:c.className}),{position:"relative",zIndex:c.zIndex}),e=c.radius+c.length+c.width,h,i;a&&(a.insertBefore(d,a.firstChild||null),i=n(a),h=n(d),l(d,{left:(c.left=="auto"?i.x-h.x+(a.offsetWidth>>1):c.left+e)+"px",top:(c.top=="auto"?i.y-h.y+(a.offsetHeight>>1):c.top+e)+"px"})),d.setAttribute("aria-role","progressbar"),b.lines(d,b.opts);if(!f){var j=0,k=c.fps,m=k/c.speed,o=(1-c.opacity)/(m*c.trail/100),p=m/c.lines;!function q(){j++;for(var a=c.lines;a;a--){var e=Math.max(1-(j+a*p)%m*o,c.opacity);b.opacity(d,c.lines-a,e,c)}b.timeout=b.el&&setTimeout(q,~~(1e3/k))}()}return b},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=c),this},lines:function(a,b){function e(a,d){return l(g(),{position:"absolute",width:b.length+b.width+"px",height:b.width+"px",background:a,boxShadow:d,transformOrigin:"left",transform:"rotate("+~~(360/b.lines*c+b.rotate)+"deg) translate("+b.radius+"px"+",0)",borderRadius:(b.width>>1)+"px"})}var c=0,d;for(;c<b.lines;c++)d=l(g(),{position:"absolute",top:1+~(b.width/2)+"px",transform:b.hwaccel?"translate3d(0,0,0)":"",opacity:b.opacity,animation:f&&j(b.opacity,b.trail,c,b.lines)+" "+1/b.speed+"s linear infinite"}),b.shadow&&h(d,l(e("#000","0 0 4px #000"),{top:"2px"})),h(a,h(d,e(b.color,"0 0 1px rgba(0,0,0,.1)")));return a},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),!function(){function a(a,b){return g("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',b)}var b=l(g("group"),{behavior:"url(#default#VML)"});!k(b,"transform")&&b.adj?(i.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(b,c){function f(){return l(a("group",{coordsize:e+" "+e,coordorigin:-d+" "+ -d}),{width:e,height:e})}function k(b,e,g){h(i,h(l(f(),{rotation:360/c.lines*b+"deg",left:~~e}),h(l(a("roundrect",{arcsize:1}),{width:d,height:c.width,left:c.radius,top:-c.width>>1,filter:g}),a("fill",{color:c.color,opacity:c.opacity}),a("stroke",{opacity:0}))))}var d=c.length+c.width,e=2*d,g=-(c.width+c.length)*2+"px",i=l(f(),{position:"absolute",top:g,left:g}),j;if(c.shadow)for(j=1;j<=c.lines;j++)k(j,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(j=1;j<=c.lines;j++)k(j);return h(b,i)},p.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}):f=k(b,"animation")}(),a.Spinner=p})(window,document);

function txstValidate(type, elem, icon) {
	// set properties
	this.type = type;
	this.elem = elem;
	this.icon = icon;
	this.fromDate = this.parse(elem.valid_fromDate);
	this.toDate = this.parse(elem.valid_toDate);
    this.isSpinning = false;
    
    var spinnerOptions = {
        lines: 9,
        length: 4,
        width: 2,
        radius: 2,
        rotate: 0,
        color: '#000',
        speed: 1,
        trail: 60,
        shadow: false,
        hwaccel: false,
        className: 'txst-form-spinner',
        zIndex: 2e9,
        top: 'auto',
        left: 'auto'
    };
    
    this.spinner = new Spinner(spinnerOptions);

	// watch for keyup events, but ignore special keys like Control
	// this array MUST be ordered
	var ignorekeys = [9,16,17,18,20,27,33,34,36,37,38,39,40,45,91,92,112,113,114,115,116,117,118,119,120,121,122,123,144,145,224];
	elem.observe('keyup', function(e) {
		if (e.keyCode == 13) this.registerChange(true);
		else if (ignorekeys.binarySearch(e.keyCode) == -1) this.registerChange();
	}.bind(this));
	elem.observe('focus', function(e) {
		this.registerChange(true);
	}.bind(this));
	elem.observe('blur', function(e) {
		this.registerChange(true);
	}.bind(this));
	elem.observe('change', function(e) {
		this.registerChange(true);
	}.bind(this));
	if (this.type == 'file') {
		icon.observe('click', function() {
			if (this.icon.hasClassName('txst-form-fail')) {
				this.elem.value='';
				this.registerChange(true);
			}
		}.bind(this));
	}
};

txstValidate.prototype.registerChange = function(immediate) {
	clearTimeout(this.progressTimer);
	if (!this.elem.value) {
		this.hide();
		return;
	}
	this.showProgress(); 
	passed = this.evaluate();
	
	// Just keep spinning if an asynchronous request is in progress
	if (this.asyncTimer) return;
	
	if (passed) {
		this.showPassed();
		if (immediate) this.clean();
	} else if (immediate) this.showFailed();
	else this.progressTimer = setTimeout(function() { this.showPassOrFail(); }.bind(this), 3000);
};

txstValidate.prototype.showPassOrFail = function() {
	if (this.evaluate()) this.showPassed();
	else this.showFailed();
};

txstValidate.prototype.evaluate = function() {
	var val = this.elem.value;
	
	// this is not a mandatory check, so we'll pass any empty values
	if (!val) return true;
	
	// figure out what we're checking for and check it
	var type = this.type;
	if (type == 'date') {
		return this.checkDate(val);
	}
	if (type == 'keystring') return val.match(/^\s*[a-z][\w\-]*\s*$/i);
	if (type == 'email') return val.match(/^\s*[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\s*$/i);
    if (type == 'txemail') return val.match(/^\s*[a-z0-9._%+-]+@(txstate\.edu|tsus\.edu|tjctc\.org)\s*$/i);
	if (type == 'integer') return val.match(/^\s*-?\d+\s*$/);
	if (type == 'decimal') return val.match(/^\s*-?(\d+|(\d*\.\d+))\s*$/);
	if (type == 'zip') return val.match(/^\s*\d{5}(-\d{4})?\s*$/);
	if (type == 'phone') return val.replace(/\D/g, '').match(/^\d{10}$/);
	if (type == 'netid' || type == 'anumber') return this.checkNetIdOrANumber(val);
	if (type == 'regex') {
		var re = new RegExp(this.elem.valid_regex, 'i');
		return val.strip().match(re);
	}
	if (type == 'file' && this.elem.allowableFileExts.length) {
		var re = new RegExp('\\.('+this.elem.allowableFileExts.join('|')+')$', 'i');
		return val.match(re);
	}
	return true;
};

txstValidate.prototype.getErrorMsg = function() {
	var val = this.elem.value;
	var type = this.type;
	if (type == 'date') {
		var msg = 'must be a valid date';
		if (this.fromDate && this.toDate) {
			msg += ' between '+this.fromDate.toString('MMM d, yyyy')+' and '+this.toDate.toString('MMM d, yyyy');
		} else if (this.fromDate) {
			msg += ' on or after '+this.fromDate.toString('MMM d, yyyy');
		} else if (this.toDate) {
			msg += ' on or before '+this.toDate.toString('MMM d, yyyy');
		}
		return msg;
	}
	if (type == 'keystring') return 'must begin with a letter and cannot have spaces or special characters';
	if (type == 'email') return 'must be a valid e-mail address';
    if (type == 'txemail') return 'must be a valid Texas State e-mail address';
	if (type == 'integer') return 'must be a whole number';
	if (type == 'decimal') return 'must be a number';
	if (type == 'zip') return 'must be a 5 digit zip code';
	if (type == 'phone') return 'must be a 10 digit phone number';
	if (type == 'netid') return 'must be a valid TX State Net ID';
	if (type == 'anumber') return 'must be a valid Student ID';
	if (type == 'regex') {
		if (this.elem.valid_msg) return this.elem.valid_msg;
		else return 'does not appear to be valid';
	}
	if (type == 'file') return 'allowable extensions: '+this.elem.allowableFileExts.join(', ');
	return '';
};

txstValidate.prototype.hide = function() {
	this.icon.removeClassName('txst-form-pass');
	this.icon.removeClassName('txst-form-fail');
	this.icon.removeClassName('txst-form-prog');
	this.icon.innerHTML = '&nbsp;';
    this.spinner.stop();
    this.isSpinning = false;
};

txstValidate.prototype.showProgress = function() {
	this.icon.removeClassName('txst-form-pass');
	this.icon.removeClassName('txst-form-fail');
	this.icon.addClassName('txst-form-prog');
    
    if (!this.isSpinning)
    {
        this.spinner.spin();
        this.isSpinning = true;
    }
    
    this.icon.up('.valid-icon-cont').insert({top: this.spinner.el});
    
    //Need to move spinner down if the error message text gets wrapped.
    var valTextHeight = this.icon.getHeight();
    if (valTextHeight > 18) {
        var offset = (valTextHeight - 18) / 2;
        offset += 8;
        this.spinner.el.setStyle({marginTop: offset + 'px'});
    }
};

txstValidate.prototype.showPassed = function() {
	this.icon.removeClassName('txst-form-fail');
	this.icon.removeClassName('txst-form-prog');
	this.icon.addClassName('txst-form-pass');
	if(this.curMessage) {
		this.icon.innerHTML = this.curMessage;
	} else {
		this.icon.innerHTML = '&nbsp;';
	}
    
    this.spinner.stop();
    this.isSpinning = false;
};

txstValidate.prototype.showFailed = function() {
	this.icon.removeClassName('txst-form-prog');
	this.icon.removeClassName('txst-form-pass');
	this.icon.addClassName('txst-form-fail');
	this.icon.innerHTML = this.getErrorMsg();
    
    this.spinner.stop();
    this.isSpinning = false;
};

// clean up a valid entry by trimming whitespace and
// sometimes converting to a standard format
// this method should NEVER be called on an input that is
// in a failed state
txstValidate.prototype.clean = function() {
	var ipt = this.elem;
	var type = this.type;
	if (type == 'date' && ipt.value) {
		var mydate = this.parse(ipt.value);
		if (mydate) ipt.value = mydate.toString('yyyy-MM-dd');
	}
	if (type == 'phone' && ipt.value) {
		var phone = ipt.value.replace(/\D/g, '');
		ipt.value = phone.substr(0,3)+'-'+phone.substr(3,3)+'-'+phone.substr(6,4);
	}
	if (type != 'file') ipt.value = ipt.value.strip();
};

txstValidate.prototype.focus = function() {
	this.elem.focus();
	var oset = document.viewport.getScrollOffsets();
	window.scrollTo((oset[0] > 50 ? oset[0] - 50 : 0), (oset[1] > 50 ? oset[1]-50 : 0));
	new Effect.Highlight(this.elem, { startcolor: '#ff5555', endcolor: '#ffffff', duration: 1.5 } );
};

txstValidate.prototype.checkNetIdOrANumber = function (inputToCheck) {
	if (this.asyncTimer) { 
		clearTimeout(this.asyncTimer);
		this.asyncTimer = null;
	}

	if(this.curInput == inputToCheck) {
		return this.curPassed;
	}

	this.curInput = '';
	this.curMessage = '';
	this.curPassed = false;

	if(!inputToCheck.match(/^\s*([a-z]{2}\d{2,5}|[a-z]{3}\d+|[a-z]_[a-z]\d+)\s*$/i) && !inputToCheck.match(/A\d{8}$/i)) {
		return false;
	}

	this.asyncTimer = setTimeout(function() {
		this.asyncTimer = null;
		jsonp.request("https://secure.its.txstate.edu/iphone/ldap/query.pl",{"netid":inputToCheck.toUpperCase(), "anumber":inputToCheck.toUpperCase(), "timeout":6000},function(ret){		
		    // return variable is a prototype hash.  http://api.prototypejs.org/language/Hash/
		  if (ret.get("sAMAccountName")) {
		  	this.curPassed = true;

		  	if (this.type == "netid") {
					this.curInput = ret.get("sAMAccountName");
					this.elem.value = ret.get("sAMAccountName");
		  	} else {
					this.curInput = ret.get("txstatePersonID1");
					this.elem.value = ret.get("txstatePersonID1");
		  	}

	    	this.curMessage = ret.get("displayName") + ' (' + this.curInput + ')';
	    	this.showPassed();
			} else if ( "true" == ret.get("timeout") ) {
				// if the request timed out, assume success.
				this.curPassed = true;
				this.curInput = inputToCheck;
				this.showPassed();
		  	} else if ( this.elem.value == inputToCheck ) { 
		    	// netid not found? that's an error		    	
		    	this.curPassed = false;
					this.curInput = inputToCheck;
		    	this.showFailed();
		    } else {
		    	// ignore the error if the text has changed since we sent the request
		    }
		}.bind(this));
	}.bind(this), 1000);

	return this.curPassed;
};

txstValidate.prototype.checkDate = function (datestr, dateobj) {
	datestr = datestr.trim();
	if (!dateobj) dateobj = this.parse(datestr);
	
	if (!this.isDate(datestr, dateobj)) return false;
	
	// it is a valid date, but is it in range?
	if (this.fromDate && this.fromDate > dateobj) {
		return false;
	}
	if (this.toDate && this.toDate < dateobj) {
		return false;
	}
	
	return true;
};

txstValidate.prototype.isDate = function (datestr, dateobj) {
	return (
		dateobj &&
		dateobj.getTime() &&
		dateobj.getFullYear() > 1900 &&
		dateobj.getFullYear() < (Date.today().getFullYear()+100) &&
		!datestr.match(/^\d{1,7}$/) &&
		!datestr.match(/^[a-z]{1,2}$/i) &&
		!datestr.match(/\bdays?\b/i) &&
		!datestr.match(/weeks?/i) &&
		!datestr.match(/month?s?/i) &&
		!datestr.match(/years?/i) &&
		!datestr.match(/^\d+\s*([adnp]|am|pm)\b/i) &&
		!datestr.match(/from/i) &&
		!datestr.match(/ago/i) &&
		!datestr.match(/(\b|\d)+(y|m|t)+(\b|\d)+/i)
	) || false;
};

txstValidate.prototype.parse = function (datestr) {
	var trythese = ['yyyy-MM-dd', 'MM-dd-yyyy'];
	var dateobj;
	try {
		dateobj = Date.parseExact(datestr, trythese);
	} catch (e) {
		dateobj = null;
	}
	
	if (!dateobj) try {
		dateobj = Date.parse(datestr);
	} catch (e) {
		dateobj = null;
	}
	
	if (dateobj && this.isDate(datestr, dateobj)) return dateobj;
	return null;
};

txstValidate.isDateSupported = function isDateSupported() {
	if (txstValidate.dateSupport) {
		return txstValidate.dateSupport;
	}

	txstValidate.dateSupport = false;

	if (detect_touch()) {
		// Taken from Modernizr. If the browser supports
		// date inputs it will allow setting the type to date,
		// and it will not allow setting the value to something
		// that is not a valid date.
		var ipt = document.createElement('input');
		ipt.setAttribute('type', 'date');
		if (ipt.type === 'date') {
			ipt.value = 'not a date';
			if (ipt.value != 'not a date') {
				txstValidate.dateSupport = true;
			}
		}
	}

	return txstValidate.dateSupport;
};

Event.observe(document, 'dom:loaded', function() {
	$$('.txst-form-validicon').each(function(itm) {
		var type = '';
		var ipt = itm.up('.formelement').down('input');
		while (ipt.type == 'hidden') ipt = ipt.next('input');
		if (itm.hasClassName('txst-form-date')) type = 'date';
		if (itm.hasClassName('txst-form-keystring')) type = 'keystring';
		if (itm.hasClassName('txst-form-email')) type = 'email';
		if (itm.hasClassName('txst-form-txemail')) type = 'txemail';
		if (itm.hasClassName('txst-form-integer')) type = 'integer';
		if (itm.hasClassName('txst-form-decimal')) type = 'decimal';
		if (itm.hasClassName('txst-form-zip')) type = 'zip';
		if (itm.hasClassName('txst-form-phone')) type = 'phone';
		if (itm.hasClassName('txst-form-netid')) type = 'netid';
		if (itm.hasClassName('txst-form-anumber')) type = 'anumber';
		if (itm.hasClassName('txst-form-regex')) type = 'regex';
		if (itm.hasClassName('txst-form-file')) type = 'file';
		if (!type) return;
		var vld = new txstValidate(type, ipt, itm);
		var myform = itm.up().up('form');
		if (myform.txstValidate == null) myform.txstValidate = [];
		myform.txstValidate.push(vld);
		if (ipt.value) vld.registerChange(true);
		if (type == 'date') {
			var subtitle;
			var fmt = 'MMM&#160;d,&#160;yyyy';
			if (vld.fromDate && vld.toDate) {
				subtitle = 'between '+vld.fromDate.toString(fmt)+' and '+vld.toDate.toString(fmt);
			} else if (vld.fromDate) {
				subtitle = 'on or after '+vld.fromDate.toString(fmt);
			} else if (vld.toDate) {
				subtitle = 'on or before '+vld.toDate.toString(fmt);
			}  	   
			if (subtitle) {
				ipt.insert({before: "<span class='txst-form-text-subtitle'>Please enter a date "+subtitle+".</span>"});
			}

			if (txstValidate.isDateSupported()) {
				ipt.type = "date";
			} else {
				var rangeLow = "19000101";
				var rangeHigh = "21000101";
				if (vld.fromDate) {
					rangeLow = vld.fromDate.toString('yyyyMMdd');
				}
				if (vld.toDate) {
					rangeHigh = vld.toDate.toString('yyyyMMdd');
				}
				var dateOpts = {
					formElements:{},
					rangeLow:rangeLow,
					rangeHigh:rangeHigh,
					fillGrid:true,
					constrainSelection:false
				};
				dateOpts.formElements[ipt.id] = "%Y-%m-%d";
				datePickerController.createDatePicker(dateOpts);
			}
		}
		itm.up('.formelement').setStyle({whiteSpace: 'nowrap'});
	});
	
	$$('form.txst-form').each(function(form) {
		form.observe('submit', function(e) {
			
			// a bit of coupling with the existing mandatory check on Gato form pages
			if (form.failedMandatories) return;
			
			var passed = true;
			var firstbadfield = null;
			for (var i = 0; i < form.txstValidate.length; i++) {
				var vld = form.txstValidate[i];
				if (!vld.evaluate()) {
					passed = false;
					if (!firstbadfield) firstbadfield = vld;
					if (vld.type == 'file') vld.elem.value = '';
				} else {
					vld.clean();
				}
			}
			if (!passed) {
				e.stop();
				alert('There are still errors in the form.');
				firstbadfield.focus();
			}
		});	
	});
});
