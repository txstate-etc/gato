
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
  var ignorekeys = [9, 16, 17, 18, 20, 27, 33, 34, 36, 37, 38, 39, 40, 45, 91, 92, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145, 224];
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
        this.elem.value = '';
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
  else this.progressTimer = setTimeout(function() {
    this.showPassOrFail();
  }.bind(this), 3000);
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
    var re = new RegExp('\\.(' + this.elem.allowableFileExts.join('|') + ')$', 'i');
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
      msg += ' between ' + this.fromDate.toString('MMM d, yyyy') + ' and ' + this.toDate.toString('MMM d, yyyy');
    } else if (this.fromDate) {
      msg += ' on or after ' + this.fromDate.toString('MMM d, yyyy');
    } else if (this.toDate) {
      msg += ' on or before ' + this.toDate.toString('MMM d, yyyy');
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
  if (type == 'file') return 'allowable extensions: ' + this.elem.allowableFileExts.join(', ');
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

  if (!this.isSpinning) {
    this.spinner.spin();
    this.isSpinning = true;
  }

  this.icon.up('.valid-icon-cont').insert({
    top: this.spinner.el
  });

  //Need to move spinner down if the error message text gets wrapped.
  var valTextHeight = this.icon.getHeight();
  if (valTextHeight > 18) {
    var offset = (valTextHeight - 18) / 2;
    offset += 8;
    this.spinner.el.setStyle({
      marginTop: offset + 'px'
    });
  }
};

txstValidate.prototype.showPassed = function() {
  this.icon.removeClassName('txst-form-fail');
  this.icon.removeClassName('txst-form-prog');
  this.icon.addClassName('txst-form-pass');
  if (this.curMessage) {
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
    ipt.value = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
  }
  if (type != 'file') ipt.value = ipt.value.strip();
};

txstValidate.prototype.focus = function() {
  this.elem.focus();
  var oset = document.viewport.getScrollOffsets();
  window.scrollTo((oset[0] > 50 ? oset[0] - 50 : 0), (oset[1] > 50 ? oset[1] - 50 : 0));
  new Effect.Highlight(this.elem, {
    startcolor: '#ff5555',
    endcolor: '#ffffff',
    duration: 1.5
  });
};

txstValidate.prototype.checkNetIdOrANumber = function(inputToCheck) {
  if (this.asyncTimer) {
    clearTimeout(this.asyncTimer);
    this.asyncTimer = null;
  }

  if (this.curInput == inputToCheck) {
    return this.curPassed;
  }

  this.curInput = '';
  this.curMessage = '';
  this.curPassed = false;

  if (!inputToCheck.match(/^\s*([a-z]{2}\d{2,5}|[a-z]{3}\d+|[a-z]_[a-z]\d+)\s*$/i) && !inputToCheck.match(/A\d{8}$/i)) {
    return false;
  }

  this.asyncTimer = setTimeout(function() {
    this.asyncTimer = null;
    jsonp.request("https://secure.its.txstate.edu/iphone/ldap/query.pl", {
      "netid": inputToCheck.toUpperCase(),
      "anumber": inputToCheck.toUpperCase(),
      "timeout": 6000
    }, function(ret) {
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
      } else if ("true" == ret.get("timeout")) {
        // if the request timed out, assume success.
        this.curPassed = true;
        this.curInput = inputToCheck;
        this.showPassed();
      } else if (this.elem.value == inputToCheck) {
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

txstValidate.prototype.checkDate = function(datestr, dateobj) {
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

txstValidate.prototype.isDate = function(datestr, dateobj) {
  return (
    dateobj &&
    dateobj.getTime() &&
    dateobj.getFullYear() > 1900 &&
    dateobj.getFullYear() < (Date.today().getFullYear() + 100) &&
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

txstValidate.prototype.parse = function(datestr) {
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
        subtitle = 'between ' + vld.fromDate.toString(fmt) + ' and ' + vld.toDate.toString(fmt);
      } else if (vld.fromDate) {
        subtitle = 'on or after ' + vld.fromDate.toString(fmt);
      } else if (vld.toDate) {
        subtitle = 'on or before ' + vld.toDate.toString(fmt);
      }
      if (subtitle) {
        ipt.insert({
          before: "<span class='txst-form-text-subtitle'>Please enter a date " + subtitle + ".</span>"
        });
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
          formElements: {},
          rangeLow: rangeLow,
          rangeHigh: rangeHigh,
          fillGrid: true,
          constrainSelection: false
        };
        dateOpts.formElements[ipt.id] = "%Y-%m-%d";
        datePickerController.createDatePicker(dateOpts);
      }
    }
    itm.up('.formelement').setStyle({
      whiteSpace: 'nowrap'
    });
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

// form; check for mandatory fields
function checkMandatories(formName, alertText) {
  var theForm = document[formName];
  var m = theForm.mgnlMandatory;
  var i = 0;
  var ok = true;
  if (m) {
    if (!m[0]) {
      var tmp = m;
      m = new Object();
      m[0] = tmp;
    }
    while (m[i]) {
      var name = m[i].value;
      var type;
      var mgnlField;
      if (document.all) mgnlField = theForm(name);
      else mgnlField = theForm[name];

      if (mgnlField.type) type = mgnlField.type;
      else if (mgnlField[0] && mgnlField[0].type) type = mgnlField[0].type

      switch (type) {
        case "select-one":
          if (mgnlField.selectedIndex == 0) ok = false;
          break;
        case "checkbox":
        case "radio":
          var obj = new Object();
          if (!mgnlField[0]) obj[0] = mgnlField;
          else obj = mgnlField;
          var okSmall = false;
          var ii = 0;
          while (obj[ii]) {
            isDummy = obj[ii].id.substring(obj[ii].id.length - 11) == "-dummy-item";
            if (obj[ii].checked && !isDummy) {
              okSmall = true;
              break;
            }
            ii++;
          }
          if (!okSmall) ok = false;
          break;
        default:
          if (!mgnlField.value) ok = false;
      }
      if (!ok) {
        alert(alertText);
        var target;
        if (type === "select-one" || type == "checkbox" || type == "radio") {
          target = $(mgnlField[0]).up().up();
        } else {
          // type is input or textarea
          mgnlField.focus();
          target = mgnlField;
        }
        try {
          new Effect.Highlight(target, {
            startcolor: '#ff0000',
            endcolor: '#ffffff',
            duration: 2.5
          });
        } catch (err) {
          // don't sweat it if the highlight didn't work. We still want
          // to be sure form submission is stopped.
        }
        theForm.failedMandatories = true;
        return false;
      }
      i++;
    }
  }
  theForm.failedMandatories = !ok;
  if (ok) return true;
  else return false;
}
