// require jQuery
(function () {

var filterhtml = function (name, id, value) {
  if (!id) id = Math.random().toString(16).substring(2);
  return '<div class="gato-filter">'+
    '<input type="text" maxlength="'+window.initfilterlist.maxcharacterlimit+'" name="'+name+'_filtername" id="'+name+'_filtername" value="'+(value||'')+'"><span class="charcount">('+(value||'').length+'/'+window.initfilterlist.maxcharacterlimit+')</span>'+
    '<input type="hidden" name="'+name+'_filterid" value="'+id+'">'+
    '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_n"></span></span></span></div>'+
    '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_s"></span></span></span></div>'+
    '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-trash"></span></span></span></div>'+
    '</div>';
}

window.initfilterlist = function (def, path, parentdiv, templateId) {
  var maxfilters = def.limit || 5;
  window.initfilterlist.maxcharacterlimit = def.characterlimit || 20;
  var mynode = new jcrnode("website", path);
  parentdiv = $(parentdiv);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.filterlist');
  var startval = hidden.val();
  var groupnode = new jcrnode("website", path+'/filterlist', jQuery.parseJSON(startval));

  html = '<div class="gato-filterlist">';
  $.each(groupnode.getChildren(), function (idx, node) {
    html += filterhtml(node.name, node.prophash.id, node.prophash.name);
  });
  if (!groupnode.getChildren().length) {
    html += filterhtml(0);
  }
  html += '</div>';
  html += '<div class="gato-filterlist-alert max"></div>';
  html += '<div class="gato-filterlist-alert dupes"></div>';
  html += '<button id="filteradd">Add Filter</button>';

  var inputchanged = function () {
    var nh = groupnode.getChildren().reduce(function (acc, curr) { acc[curr.prophash.id] = curr; return acc; }, {});
    groupnode.clearNodes();
    groupnode.clearProperties();
    var namehash = {};
    var hasdupe = false;
    parentdiv.find('.gato-filter').each(function (idx) {
      var $filter = $(this);
      var $nameinput = $filter.find('input[type="text"]');
      var $idinput = $filter.find('input[type="hidden"]');
      $filter.find('.charcount').text('('+$nameinput.val().length+'/'+window.initfilterlist.maxcharacterlimit+')');
      if ($nameinput.val().length) {
        var n = nh[$idinput.val()];
        if (typeof(n) == 'undefined') {
          n = groupnode.addNode(idx, 'mgnl:contentNode');
        } else {
          n.name = idx;
          groupnode.addChild(n);
        }
        n.setProperty('id', $idinput.val());
        n.setProperty('name', $nameinput.val());
        if (namehash[$nameinput.val()]) hasdupe = true;
        namehash[$nameinput.val()] = true;
      }
    });
    if (hasdupe) {
      parentdiv.find('.gato-filterlist-alert.dupes').html('You have two filters with the same name. This will produce unexpected behavior.');
    } else {
      parentdiv.find('.gato-filterlist-alert.dupes').html('');
    }
    hidden.val(groupnode.json()).change();
  };

  var inputadded = function () {
    var num = parentdiv.find('.gato-filter').length;
    if (num > maxfilters - 2) {
      parentdiv.find('.gato-filterlist-alert.max').html('You have added the maximum number of filters.');
      parentdiv.find('#filteradd').prop('disabled', true);
    } else {
      parentdiv.find('.gato-filterlist-alert.max').html('');
      parentdiv.find('#filteradd').prop('disabled', false);
    }
  }

  var movedown = function ($filter) {
    var $next = $filter.next('.gato-filter');
    if ($next.length) $filter.insertAfter($next);
    inputchanged();
  }

  var moveup = function ($filter) {
    var $next = $filter.prev('.gato-filter');
    if ($next.length) $filter.insertBefore($next);
    inputchanged();
  }

  var trash = function ($filter) {
    $filter.remove();
    inputchanged();
  }

  var addhandlers = function ($filter) {
    $filter.find('input[type="text"]').on('change keyup', inputchanged);
    $filter.find('.icon-arrow2_s').click(function () {
      movedown($(this).closest('.gato-filter'));
    });
    $filter.find('.icon-arrow2_n').click(function () {
      moveup($(this).closest('.gato-filter'));
    });
    $filter.find('.icon-trash').click(function () {
      trash($(this).closest('.gato-filter'));
    });
  };

  parentdiv.append(html);
  addhandlers($('.gato-filterlist'));
  parentdiv.find('#filteradd').click(function() {
    var num = parentdiv.find('.gato-filter').length;
    if (num < maxfilters) {
      $filter = $(filterhtml(groupnode.getChildren().length));
      $filter.appendTo(parentdiv.find('.gato-filterlist'));
      addhandlers($filter);
      $filter.find('input[type="text"]').focus();
    }
    inputadded();
  });
  inputchanged();
  inputadded();
}

})();
