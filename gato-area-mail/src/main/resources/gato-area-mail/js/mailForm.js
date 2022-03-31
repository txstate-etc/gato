function txstValidate(types, elem, icon) {
  // set properties
  this.types = types;
  this.errorType = ''
  this.elem = elem;
  this.icon = icon;
  this.fromDate = this.parse(elem.data('valid_fromdate'));
  this.toDate = this.parse(elem.data('valid_todate'));
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
  elem.on('keyup', function(e) {
    if (e.keyCode == 13) this.registerChange(true);
    else if (ignorekeys.binarySearch(e.keyCode) == -1) this.registerChange();
  }.bind(this));
  elem.on('focus', function(e) {
    this.registerChange(true);
  }.bind(this));
  elem.on('blur', function(e) {
    this.registerChange(true);
  }.bind(this));
  elem.on('change', function(e) {
    this.registerChange(true);
  }.bind(this));
  if (this.types.indexOf('file') > -1) {
    icon.on('click', function() {
      if (this.icon.hasClass('txst-form-fail')) {
        this.elem.val('')
        this.registerChange(true);
      }
    }.bind(this));
  }
};

txstValidate.prototype.registerChange = function(immediate) {
  clearTimeout(this.progressTimer);
  if (!this.elem.val().length) {
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
  var val = this.elem.val();

  // this is not a mandatory check, so we'll pass any empty values
  if (!val) return true;

  // figure out what we're checking for and check it
  var types = this.types;
  this.errorType = ''
  for (var i = 0; i < types.length; i++) {
    var type = types[i]
    if ((type == 'date' && !this.checkDate(val)) ||
        (type == 'keystring' && !val.match(/^\s*[a-z][\w\-]*\s*$/i)) ||
        (type == 'email' && !val.match(/^\s*[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\s*$/i)) ||
        (type == 'txemail' && !val.match(/^\s*[a-z0-9._%+-]+@(txstate\.edu|tsus\.edu|tjctc\.org)\s*$/i)) ||
        (type == 'integer' && !val.match(/^\s*-?\d+\s*$/)) ||
        (type == 'decimal' && !val.match(/^\s*-?(\d+|(\d*\.\d+))\s*$/)) ||
        (type == 'zip' && !val.match(/^\s*\d{5}(-\d{4})?\s*$/)) ||
        (type == 'phone' && !val.replace(/\D/g, '').match(/^\d{10}$/))||
        ((type == 'netid' || type == 'anumber') && !this.checkNetIdOrANumber(val, type)) ||
        (type == 'maxlength' && val.length > this.elem.data('maxchars'))) {
          this.errorType = type
          break
        }
    if (type == 'regex') {
      var re = new RegExp(this.elem.data('valid_regex'), 'i');
      if(!val.trim().match(re)) {
        this.errorType = type
        break
      }
    }
    if (type == 'file' && this.elem.data('allowable_file_exts').length && this.elem.data('allowable_file_exts').replaceAll(',', '').length > 0) {
      var re = new RegExp('\\.(' + this.elem.data('allowable_file_exts').replaceAll(',', '|') + ')$', 'i');
      if (!val.match(re)) {
        this.errorType = type
        break
      }
    }
  }
  return this.errorType.length == 0;
};

txstValidate.prototype.getErrorMsg = function() {
  var val = this.elem.val();
  var type = this.errorType
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
  if (type == 'maxlength') return 'must be ' + this.elem.data('maxchars') + ' characters or less';
  if (type == 'regex') {
    if (this.elem.data('valid_msg')) return this.elem.data('valid_msg');
    else return 'does not appear to be valid';
  }
  if (type == 'file') return 'allowable extensions: ' + this.elem.data('allowable_file_exts')
  return '';
};

txstValidate.prototype.hide = function() {
  this.icon.removeClass('txst-form-pass');
  this.icon.removeClass('txst-form-fail');
  this.icon.removeClass('txst-form-prog');
  this.icon.text('&nbsp;');
  this.spinner.stop();
  this.isSpinning = false;
};

txstValidate.prototype.showProgress = function() {
  this.icon.removeClass('txst-form-pass');
  this.icon.removeClass('txst-form-fail');
  this.icon.addClass('txst-form-prog');

  if (!this.isSpinning) {
    this.spinner.spin();
    this.isSpinning = true;
  }

  this.icon.closest('.valid-icon-cont').append(this.spinner.el)

  //Need to move spinner down if the error message text gets wrapped.
  var valTextHeight = this.icon.height();
  if (valTextHeight > 18) {
    var offset = (valTextHeight - 18) / 2;
    offset += 8;
    this.icon.closest('.valid-icon-cont .txst-form-spinner').css('margin-top', offset + 'px')
  }
};

txstValidate.prototype.showPassed = function() {
  this.icon.removeClass('txst-form-fail');
  this.icon.removeClass('txst-form-prog');
  this.icon.attr('aria-hidden', 'true');
  this.icon.addClass('txst-form-pass');
  if (this.curMessage) {
    this.icon.text(this.curMessage);
  } else {
    this.icon.text('')
  }
  this.elem.attr('aria-invalid', 'false');
  if (this.elem.attr('data-help')) {
    this.elem.attr('aria-describedby', this.elem.attr('data-help'));
  } else {
    this.elem.removeAttr('aria-describedby');
  }

  this.spinner.stop();
  this.isSpinning = false;
};

txstValidate.prototype.showFailed = function() {
  this.icon.removeClass('txst-form-prog');
  this.icon.removeClass('txst-form-pass');
  this.icon.addClass('txst-form-fail');
  this.icon.attr('aria-hidden', 'false');
  this.icon.text(this.getErrorMsg());
  this.elem.attr('aria-invalid', 'true');
  var describedby = this.elem.attr('data-aria-describedby');
  if (this.elem.attr('data-help')) {
    describedby = describedby + " " + this.elem.attr('data-help')
  }
  this.elem.attr('aria-describedby', describedby);

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
  if (type == 'date' && ipt.val().length) {
    var mydate = this.parse(ipt.val());
    if (mydate) ipt.val(mydate.format('YYYY-MM-DD'));
  }
  if (type == 'phone' && ipt.val().length) {
    var phone = ipt.val().replace(/\D/g, '');
    ipt.val(phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4))
  }
  if (type != 'file') ipt.val(ipt.val().trim());
};

txstValidate.prototype.focus = function() {
  this.elem.focus();
  this.elem.get(0).scrollTo();
  var oset = document.viewport.getScrollOffsets();
  window.scrollTo((oset[0] > 50 ? oset[0] - 50 : 0), (oset[1] > 50 ? oset[1] - 50 : 0));
  var background = this.elem.css("backgroundColor");
  //the highlight breaks if the endcolor is transparent
  if(background == "transparent") background = "#ffffff";
  var target = this.elem;
  jQuery(target).velocity({backgroundColor: rgb2hex(background)}, {
    begin: function() {
      target.css({'backgroundColor': '#ff5555'});
    },
    duration: 1500
  });
};

txstValidate.prototype.checkNetIdOrANumber = function(inputToCheck, which) {

  if (this.asyncTimer) {
    clearTimeout(this.asyncTimer);
    this.asyncTimer = null;
  }

  if (which == "netid" && !inputToCheck.match(/^\s*([a-z]{2}\d{2,5}|[a-z]{3}\d+|[a-z]_[a-z]\d+)\s*$/i)) {
    return false;
  }

  if (which == "anumber" && !inputToCheck.match(/A\d{8}$/i)) {
    return false;
  }

  return true

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


jQuery(document).ready(function($) {
  $('.txst-form-validicon').each(function() {
    var itm = $(this)
    var types = []
    var inputs = itm.closest('.formelement').find('input,textarea')
    var ipt;
    for (var i=0; i< inputs.length; i++) {
      ipt = $(inputs[i])
      if (ipt.attr('type') != 'hidden') break;
    }
    if (itm.hasClass('txst-form-date')) types.push('date')
    if (itm.hasClass('txst-form-keystring')) types.push('keystring')
    if (itm.hasClass('txst-form-email')) types.push('email')
    if (itm.hasClass('txst-form-txemail')) types.push('txemail')
    if (itm.hasClass('txst-form-integer')) types.push('integer')
    if (itm.hasClass('txst-form-decimal')) types.push('decimal')
    if (itm.hasClass('txst-form-zip')) types.push('zip')
    if (itm.hasClass('txst-form-phone')) types.push('phone')
    if (itm.hasClass('txst-form-netid')) types.push('netid')
    if (itm.hasClass('txst-form-anumber')) types.push('anumber')
    if (itm.hasClass('txst-form-regex')) types.push('regex')
    if (itm.hasClass('txst-form-file')) types.push('file')
    if (itm.hasClass('txst-form-none')) types.push('none') // not sure I need this
    if (itm.hasClass('limited')) {
      types.push('maxlength')
    }
    if (!types.length) return
    var vld = new txstValidate(types, ipt, itm)
    var myform = itm.closest('form')
    if (myform.data('txstValidate') == null)
      myform.data('txstValidate', [])
    myform.data('txstValidate').push(vld);
    if (ipt.val()) vld.registerChange(true);
    if (types.indexOf('date') > -1) {
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
        $("<span class='txst-form-text-subtitle'>Please enter a date " + subtitle + ".</span>").insertBefore(ipt)
      }
    }
  });

  $('form.txst-form').each(function() {
    var form = $(this)

    form.on('submit', function(e) {
      // a bit of coupling with the existing mandatory check on Gato form pages
      if (form.prop('failedMandatories')) return;

      var passed = true;
      var firstbadfield = null;
      var formvalidate = form.data('txstValidate')
      for (var i=0; i < formvalidate.length; i++) {
        var vld = formvalidate[i]
        if (!vld.evaluate()) {
          passed = false;
          if (!firstbadfield) firstbadfield = vld;
          if (vld.type == 'file') vld.elem.value = '';
        } else {
          vld.clean();
        }
      }
      if (!passed) {
        e.preventDefault();
        alert('There are still errors in the form.');
        firstbadfield.focus();
      }
    })
  })

  $('.formelement .selectiongroup .txst-form-selectiongroup').each(function() {
    var group = $(this)
    group.on('change', '.txst-form-selection-item', function(e) {
      var target = e.target;
      if (group.hasClass('radio-type')) {
        group.find('.txst-form-selection-item.selected').each(function() {
          $(this).removeClass('selected')
        })
        $(target).closest('.txst-form-selection-item').addClass('selected')
      } else {
        if (group.hasClass('checkbox-type') && $(target).closest('.txst-form-selection-item').hasClass('selected')) {
          $(target).closest('.txst-form-selection-item').removeClass('selected')
        } else {
          $(target).closest('.txst-form-selection-item').addClass('selected')
        }
      }
    })
  })

  $('.formelement .selectiongroup .txst-form-selection-item input').each(function() {
    $(this).on('focus', function(e) {
      var target = $(e.target)
      target.closest('.txst-form-selection-item').addClass('focused')
    })
  })

  $('.formelement .selectiongroup .txst-form-selection-item input').each(function() {
    $(this).on('blur', function(e) {
      var target = $(e.target)
      target.closest('.txst-form-selection-item').removeClass('focused')
    })
  })

  $('.formelement .selectiongroup .txst-form-selection-item').each(function() {
    var elem = $(this)
    elem.on('click', function(e) {
      var target = $(e.target)
      if (target.is('input') || target.is('label')) return
      elem.find('input').trigger('click')
    })
  })

  $('.formelement select.txst-select').each(function() {
    var selectfield = $(this)
    selectfield.on('change', function(e) {
      var helpfieldid = '#' + selectfield.attr('id') + '-option-help'
      if (selectfield.prop('selectedIndex') > 0) {
        var options = selectfield.find('option')
        var helptext = options.get(selectfield.prop('selectedIndex')).getAttribute('data-help')
        $(helpfieldid).text(helptext)
      } else {
        $(helpfieldid).text('')
      }
    })
  })

  //make links in the mail template open in new tab or window
  $('.txst-form a').not('.txstate-khan-notice a').attr('target', '_blank');

  //update character counter for fields that have a maximum length defined
  $('textarea.limited, input.limited').on('keyup', function() {
    var length = this.value.length;
    var charcounterdiv = $(this).prev('.charcounter');
    var maxlength = charcounterdiv.find('.maxchars').text();
    charcounterdiv.find('.charsentered').text(length);
    if (length > maxlength) {
      charcounterdiv.css('color', '#b30e1b').css('font-weight', 'bold');
    } else {
      charcounterdiv.css('color', '#222').css('font-weight', 'normal');
    }
  });

  $('.formelement.likert .likert-table .likert-option').on('click', function(e) {
    var name = $(this).find('input').attr('name')
    $('input[name="' + name + '"]').parent().removeClass('selected')
    $(this).addClass('selected')
    var target = $(e.target)
    if (target.is('input') || target.is('label')) return
    $(this).find('input').trigger('click')
  })
});

// form; check for mandatory fields
function checkMandatories(theForm, alertText) {
  //var m = theForm.mgnlMandatory;
  var m = jQuery(theForm).find('[name=mgnlMandatory]')
  var i = 0;
  var ok = true;
  if (m.length > 0) {
    m.each(function() {
      var name = jQuery(this).val()
      var type, mgnlField;
      mgnlField = jQuery(theForm).find('#' + name)
      if (mgnlField.prop('type')) type = mgnlField.prop('type')
      else if (mgnlField.hasClass('likert-question')) {
        type = 'likert'
      }
      else if (mgnlField.find('input').length > 0 && mgnlField.find('input').first().prop('type')) {
        type = mgnlField.find('input').first().prop('type')
      }
      switch(type) {
        case "select-one":
          if (mgnlField.prop('selectedIndex') == 0) ok = false;
          break;
        case "checkbox":
        case "radio":
          var okSmall = false;
          mgnlField.find('input').each(function() {
            if (jQuery(this).prop('checked')) {
              okSmall = true
              return false
            }
          })
          if (!okSmall) ok = false;
          break;
        case "likert":
          var okSmall = false;
          jQuery('input[name="' + name + '"]').each(function() {
            if (jQuery(this).prop('checked')) {
              okSmall = true
              return false
            }
          })
          if (!okSmall) ok = false
          break;
        default:
          if (!mgnlField.val()) ok = false;
      }
      if (!ok) {
        alert(alertText)
        var target, background = "#FFFFFF";
        if (type === "select-one") {
          target = mgnlField.closest('.formelement')
        } else if (type == "checkbox" || type == "radio") {
          target = mgnlField
        } else {
          // type is input or textarea or file
          target = mgnlField
          mgnlField.focus();
        }
        if (target) {
          var oset = window.stickynavheight || 40
          jQuery('html').velocity('scroll', {
            duration: 200,
            offset: (target.closest('.formelement').offset().top - oset) + 'px',
          })
        }
        try {
          target.velocity({backgroundColor: rgb2hex(background)}, {
            begin: function() {
              target.css('background-color','#ff0000')
            },
            complete: function() {
              target.css('background-color', '')
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
    })
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
  jQuery('.txst-form-selectiongroup').each(function() {
    var selectiongroup = jQuery(this)
    var availableInnerWidth = selectiongroup.width()

    var maxItemOuterWidth = 0;
    selectiongroup.find('.txst-form-selection-item').each(function() {
      var item = jQuery(this)
      // Setting the element to inline briefly lets me get the width of what is inside, rather than the space it could fill up in the parent
      item.css('display', 'inline').css('width', 'auto')
      var itemOuterWidth = item.width();
      item.css('display', 'block')
      if(maxItemOuterWidth < itemOuterWidth) {
        maxItemOuterWidth = itemOuterWidth
      }
    })

    var numberOfColumns = 1;
    if ( (maxItemOuterWidth+10)*3 < availableInnerWidth) {
      numberOfColumns = 3;
    } else if ( (maxItemOuterWidth+10) * 2 < availableInnerWidth ) {
      numberOfColumns = 2;
    }

    selectiongroup.find('.txst-form-selection-item').each(function() {
      var item = jQuery(this)
      var width = parseInt((availableInnerWidth-(numberOfColumns*10))/numberOfColumns, 10) + "px"
      item.css({ 'width': width, 'float': 'left', 'marginTop': '10px' })
    })

    selectiongroup.append('<div style="clear:both"></div>')
  })

}

function injectDummies() {
  jQuery('.txst-form-selectiongroup').each(function() {
    var selectionGroup = jQuery(this)
    var conditional = selectionGroup.closest('.dependent-question')
    if (conditional.length && !conditional.hasClassName('active')) return false
    var name = selectionGroup.attr('id')
    var type = selectionGroup.find('input').attr('type')
    if (jQuery('input[name="' + name + '"]:checked').length < 1) {
      var dummyInput = createDummyInput(name, type)
      selectionGroup.append(dummyInput)
    }
  })
  jQuery('.likert-question').each(function() {
    var name = jQuery(this).attr('id')
    if (jQuery('input[name="' + name + '"]:checked').length < 1) {
      var dummyInput = createDummyInput(name, 'radio')
      jQuery(this).append(dummyInput)
    }
  })
}

function createDummyInput(name, type) {
  var id = name + "-dummy-item"
  var dummyInput = jQuery('<input>')
  dummyInput.attr('name', name)
  dummyInput.attr('id', id)
  dummyInput.prop('type', type)
  dummyInput.css('display', 'none')
  dummyInput.attr('aria-hidden', true)
  dummyInput.attr('aria-label', 'hidden')
  dummyInput.attr('title', 'hidden')
  dummyInput.val('')
  dummyInput.prop('checked', true)
  return dummyInput
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

