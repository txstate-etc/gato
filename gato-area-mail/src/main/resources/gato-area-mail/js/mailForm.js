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
  if(type == 'maxlength') return val.length <= this.elem.maxchars;
  return true;
};

txstValidate.prototype.getErrorMsg = function() {
  var val = this.elem.value;
  var type = this.type;
  if (type == 'date') {
    var msg = 'must be a valid date';
    if (this.fromDate && this.toDate) {
      msg += ' between ' + this.fromDate.format('MMM D, YYYY') + ' and ' + this.toDate.format('MMM D, YYYY');
    } else if (this.fromDate) {
      msg += ' on or after ' + this.fromDate.format('MMM D, YYYY');
    } else if (this.toDate) {
      msg += ' on or before ' + this.toDate.format('MMM D, YYYY');
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
  if (type == 'maxlength') return 'must be ' + this.elem.maxchars + ' characters or less';
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
  this.icon.setAttribute('aria-hidden', 'true');
  this.icon.addClassName('txst-form-pass');
  if (this.curMessage) {
    this.icon.innerHTML = this.curMessage;
  } else {
    this.icon.innerHTML = '&nbsp;';
  }
  this.elem.setAttribute('aria-invalid', 'false');
  if (this.elem.getAttribute('data-help')) {
    this.elem.setAttribute('aria-describedby', this.elem.getAttribute('data-help'));
  } else {
    this.elem.removeAttribute('aria-describedby');
  }
  
  this.spinner.stop();
  this.isSpinning = false;
};

txstValidate.prototype.showFailed = function() {
  this.icon.removeClassName('txst-form-prog');
  this.icon.removeClassName('txst-form-pass');
  this.icon.addClassName('txst-form-fail');
  this.icon.setAttribute('aria-hidden', 'false');
  this.icon.innerHTML = this.getErrorMsg();
  this.elem.setAttribute('aria-invalid', 'true');
  var describedby = this.elem.getAttribute('data-aria-describedby');
  if (this.elem.getAttribute('data-help')) {
    describedby = describedby + " " + this.elem.getAttribute('data-help')
  }
  this.elem.setAttribute('aria-describedby', describedby);

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
    if (mydate) ipt.value = mydate.format('YYYY-MM-DD');
  }
  if (type == 'phone' && ipt.value) {
    var phone = ipt.value.replace(/\D/g, '');
    ipt.value = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
  }
  if (type != 'file') ipt.value = ipt.value.strip();
};

txstValidate.prototype.focus = function() {
  this.elem.focus();
  this.elem.scrollTo();
  var oset = document.viewport.getScrollOffsets();
  window.scrollTo((oset[0] > 50 ? oset[0] - 50 : 0), (oset[1] > 50 ? oset[1] - 50 : 0));
  var background = this.elem.getStyle("backgroundColor");
  //the highlight breaks if the endcolor is transparent
  if(background == "transparent") background = "#ffffff";
  var target = this.elem;
  jQuery(target).velocity({backgroundColor: rgb2hex(background)}, {
    begin: function() {
      target.setStyle({backgroundColor: '#ff5555'});
    },
    duration: 1500
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

  if (this.type == "netid" && !inputToCheck.match(/^\s*([a-z]{2}\d{2,5}|[a-z]{3}\d+|[a-z]_[a-z]\d+)\s*$/i)) {
    return false;
  }

  if (this.type == "anumber" && !inputToCheck.match(/A\d{8}$/i)) {
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

  if (!dateobj) return false;

  // it is a valid date, but is it in range?
  if (this.fromDate && dateobj.isBefore(this.fromDate)) {
    return false;
  }
  if (this.toDate && dateobj.isAfter(this.toDate)) {
    return false;
  }

  return true;
};

txstValidate.prototype.parse = function(datestr) {
  var trythese = ['YYYY-MM-DD', 'MM-DD-YYYY', 'MMM DD YYYY'];

  var dateobj = moment(datestr, trythese);
  if (dateobj.isValid()) {
    return dateobj;
  }

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
    var ipt = itm.up('.formelement').down('input,textarea');
    while (ipt.type == 'hidden') ipt = ipt.next('input,textarea');
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
    //The only validation available on a type 'none' field is maxlength
    if (itm.hasClassName('txst-form-none')) type = 'maxlength';
    if (!type) return;
    var vld = new txstValidate(type, ipt, itm);
    var myform = itm.up().up('form');
    if (myform.txstValidate == null) myform.txstValidate = [];
    myform.txstValidate.push(vld);
    if (ipt.value) vld.registerChange(true);
    if (type == 'date') {
      var subtitle;
      var fmt = 'MMM&#160;D,&#160;YYYY';
      if (vld.fromDate && vld.toDate) {
        subtitle = 'between ' + vld.fromDate.format(fmt) + ' and ' + vld.toDate.format(fmt);
      } else if (vld.fromDate) {
        subtitle = 'on or after ' + vld.fromDate.format(fmt);
      } else if (vld.toDate) {
        subtitle = 'on or before ' + vld.toDate.format(fmt);
      }
      if (subtitle) {
        ipt.insert({
          before: "<span class='txst-form-text-subtitle'>Please enter a date " + subtitle + ".</span>"
        });
      }

      if (txstValidate.isDateSupported()) {
        ipt.type = "date";
      } else {
        var rangeLow = [1900,0,1];
        var rangeHigh = [2100,0,1];
        if (vld.fromDate) {
          rangeLow = vld.fromDate.toArray();
        }
        if (vld.toDate) {
          rangeHigh = vld.toDate.toArray();
        }
        var dateOpts = {
          format: "yyyy-mm-dd",
          min: rangeLow,
          max: rangeHigh,
          selectYears: 200,
          selectMonths: true,
          onClose: function() { vld.registerChange(); }
        };
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

  $$('.formelement .selectiongroup .txst-form-selectiongroup').each(function(group) {
    group.on('change', '.txst-form-selection-item', function(event) {
      var target = event.target;
      if (group.hasClassName('radio-type')) {
        group.select('.txst-form-selection-item.selected').each(function(item) {
          item.removeClassName('selected')
        })
      }
      if (group.hasClassName('checkbox-type') && target.up('.txst-form-selection-item').hasClassName('selected')) {
        target.up('.txst-form-selection-item').removeClassName('selected')
      } else {
        target.up('.txst-form-selection-item').addClassName('selected')
      }
    })
  })
  $$('.formelement .selectiongroup .txst-form-selectiongroup.checkbox-type .txst-form-selection-label-cont').each(function(item) {
    item.on('click', function(event) {
      var target = event.target
      var input = target.up('.txst-form-selection-item').down('input')
      input.click()
    })
  })
  $$('.formelement .selectiongroup .txst-form-selection-item input').each(function(item) {
    item.on('focus', function(event) {
      var target = event.target
      target.up('.txst-form-selection-item').addClassName('focused')
    })
  })
  $$('.formelement .selectiongroup .txst-form-selection-item input').each(function(item) {
    item.on('blur', function(event) {
      var target = event.target
      target.up('.txst-form-selection-item').removeClassName('focused')
    })
  })
});

// form; check for mandatory fields
function checkMandatories(theForm, alertText) {
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
        var target,background;
        if (type === "select-one" || type == "checkbox" || type == "radio") {
          if (!mgnlField[0]) {
            target = $(mgnlField).up().up();
          }
          else {
            target = $(mgnlField[0]).up().up();
          }
          background = "#FFFFFF";
          target.scrollTo();
        }
        else {
          // type is input or textarea or file
          mgnlField.focus();
          mgnlField.scrollTo();
          var oset = document.viewport.getScrollOffsets();
          window.scrollTo((oset[0] > 50 ? oset[0] - 50 : 0), (oset[1] > 50 ? oset[1] - 50 : 0));
          target = mgnlField;
          if(type == "file")
            background = '#ffffff';
          else
            background = jQuery(target).css("backgroundColor");
        }
        try {
          jQuery(target).velocity({backgroundColor: rgb2hex(background)}, {
            begin: function() {
              target.setStyle({backgroundColor: '#ff0000'});
            },
            duration: 2500
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
  if (ok) {
    injectDummies();
    return true;
  }
  else return false;
}

//http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
function rgb2hex(rgb) {
   if (  rgb.search("rgb") == -1 ) {
        return rgb;
   } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
             return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
   }
}

function form_fixcolumns() {
  $$('.txst-form-selectiongroup').each(function(selectiongroup){
    var availableInnerWidth = selectiongroup.getWidth();

    var maxItemOuterWidth = 0;
    selectiongroup.select('.txst-form-selection-item').each(function(item){
      // Setting the element to inline briefly lets me get the width of what is inside, rather than the space it could fill up in the parent
      item.setStyle({display:'inline', width: 'auto'});
      var itemOuterWidth = item.getWidth();
      item.setStyle({display:'block'});
      if ( maxItemOuterWidth < itemOuterWidth ) {
        maxItemOuterWidth = itemOuterWidth;
      }
    });

    var numberOfColumns = 1;
    if ( (maxItemOuterWidth+10)*3 < availableInnerWidth ) {
      var numberOfColumns = 3;
    } else if ( (maxItemOuterWidth+10)*2 < availableInnerWidth ) {
      var numberOfColumns = 2;
    }

    selectiongroup.select('.txst-form-selection-item').each(function(item){
      item.setStyle({
        width: parseInt((availableInnerWidth-(numberOfColumns*10))/numberOfColumns, 10) + "px",
        float: 'left',
        marginTop: '10px'
      });
    });

    selectiongroup.insert({bottom: new Element("div",{style:"clear:both"})});
  });
}

Event.observe(document,'dom:loaded', form_fixcolumns);
Event.observe(window,orientationChangeEventName, form_fixcolumns);

//update character counter for fields that have a maximum length defined
Event.observe(document, 'dom:loaded', function(){
  $$('textarea.limited, input.limited').invoke('observe', 'keyup', function(){
    var length = this.value.length;
    var charcounterdiv = $(this).previous('.charcounter');
    var maxlength = charcounterdiv.down('.maxchars').textContent;
    charcounterdiv.down('.charsentered').textContent = length;
    if(length > maxlength){
      charcounterdiv.setStyle({color: '#b30e1b', fontWeight: 'bold'});
    }
    else{
      charcounterdiv.setStyle({color: '#222', fontWeight: 'normal'});
    }
  });
});

//make links in the mail template open in new tab or window
jQuery(document).ready(function($){
  $('.txst-form a').not('.txstate-khan-notice a').attr('target', '_blank');
});


function injectDummies() {
  var numSelectionGroups = document.getElementsByClassName("txst-form-selectiongroup").length;

  for (var i=0;i<numSelectionGroups;i++) {
    var element = document.getElementsByClassName("txst-form-selectiongroup")[i];
    var conditional = element.up('.dependent-question')
    if (conditional && !conditional.hasClassName('active')) continue;
    var name = element.id;
    var id = element.id + "-dummy-item";
    var type = element.children[0].type
    var dummyInput = document.createElement('input');
    dummyInput.setAttribute('name', name);
    dummyInput.setAttribute('id', id);
    dummyInput.setAttribute('type', type);
    dummyInput.setAttribute('style', 'display:none');
    dummyInput.setAttribute('aria-hidden', 'true');
    dummyInput.setAttribute('aria-label', 'hidden');
    dummyInput.setAttribute('title', 'hidden');
    dummyInput.setAttribute('value', '');
    dummyInput.setAttribute('checked', 'checked');
    element.appendChild(dummyInput);

  }
}

function enableSubmitButton() {
  if (!document.getElementById("btnsubmit").classList.contains("edit"))
    document.getElementById("btnsubmit").disabled = false;
}
function disableSubmitButton() {
  document.getElementById("btnsubmit").disabled = true;
}
function onRecaptchaLoad() {
  document.getElementById('g-recaptcha-response').setAttribute('aria-hidden', true);
  document.getElementById('g-recaptcha-response').setAttribute('aria-label', 'recaptcha response');
}

