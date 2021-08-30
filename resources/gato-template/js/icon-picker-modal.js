function initIconPicker(def, node, el, tmpl) {

  var selectedIcon;
  var selectedPrefix;
  var initialIcon;
  var initialPrefix;
  var iconHash = {};

  //if there is an icon saved already, return its name
  //if not, return the default graduation cap icon
  function getSelectedIcon(){
    var val = selectedIcon || $('input[type=hidden].icon').val();
    return (val ? val : "fa-graduation-cap");
  }

  function getSelectedPrefix() {
    var val = selectedPrefix || $('input[type=hidden].prefix').val();
    return (val ? val : "fas")
  }

  function updatePreview(icon, prefix){
    $('.preview-icon').removeClass(function(index,css){
      return (css.match(/(^|\s)fa\S+/g) || []).join(' ');
    }).addClass(prefix).addClass(icon);
    $('.preview-name').text(icon);
  }

  function save(){
    var selected = $('.icon-picker-item[aria-checked=true]').attr('id');
    var selector = '#' + selected
    var prefix = $(selector).attr('data-prefix')
    $('input[type=hidden].icon').val(selected).change();
    $('input[type=hidden].prefix').val(prefix).change();
    selectedIcon = selected;
    selectedPrefix = prefix
    updatePreview(selectedIcon, selectedPrefix);
  }

  var modalhtml = "";
  modalhtml += '<div id="icon-modal" title="Select Icon">' +
                 '<div tabindex="0" class="focusstart sr-only"></div>' +
                 '<div class="icon-modal-content">' +
                   '<button id="btnCloseIconModal"><i class="fa fa-close" aria-hidden="true"></i><span class="sr-only">Close Dialog</span></button>' +
                   '<div class="filters">' +
                    '<div class="search-wrapper">' +
                      '<input id="search_for" placeholder="Search Icons"/>' +
                      '<label for="search_for" class="fa fa-search" rel="tooltip" title="search"></label>' +
                    '</div>' +
                    '<select class="icon-category" aria-label="Select Category"><option value="all">All</option></select>' +
                    '<span class="visuallyhidden category-text" aria-live="polite">Showing all icons</span>' +
                   '</div>' +
                   '<fieldset tabindex="0">' +
                     '<legend class="sr-only">Icons</legend>' +
                     '<div class="icon-picker-items" role="radiogroup"></div>' +
                   '</fieldset>' +
                   '<div id="no-icons">No Icons Found</div>' +
                   '<div class="icon-actions">' +
                     '<button class="btnIconAction" id="btnCancel">CANCEL</button>' +
                     '<button class="btnIconAction" id="btnSave">SAVE CHANGES</button>' +
                  '</div>' +
                '</div>' +
                '<div tabindex="0" class="focusend sr-only"></div>' +
              '</div>';
  var html = '<span class="preview-icon"></span>' +
             '<button role="button" id="btnSelectIcon">SELECT NEW ICON</button>';
  $(el).append(html);
  $(el).closest('.dialog-content').append(modalhtml);
  $('#icon-modal').hide();

  selectedIcon = getSelectedIcon();
  selectedPrefix = getSelectedPrefix();
  initialIcon = selectedIcon;
  initialPrefix = selectedPrefix;

  updatePreview(selectedIcon, selectedPrefix);

  //open the dialog when the Select Icon button is clicked
  $( "#btnSelectIcon" ).on( "click", function() {
    openModal();
  });

  $('#btnCloseIconModal, #btnCancel').click(function() {
    reset();
    closeModal();
  })

  $('#btnSave').click(function() {
    save();
    closeModal();
  })

  $( "#icon-modal").on('keydown', function(e) {
    e.stopPropagation();
    if (e.key === 'Escape' || e.key ==='Esc') {
      closeModal();
    }
  })

  $('fieldset').on('focus', function() {
    if ($('.icon-picker-item:not(.hidden)[TabIndex*="0"]').length == 0) {
      var firstVisible = $('.icon-picker-item:not(.hidden)').first().index()
      focusIcon(firstVisible)
    }
  })

  $(".icon-picker-items").keydown(function(e) {
    var target = $(e.target).closest('.icon-picker-item');
    var index = target.index();
    if (e.keyCode == 39 || e.keyCode == 40) {
      e.preventDefault();
      if (index == $(".icon-picker-item").length - 1) {
        focusIcon($('.icon-picker-item:not(.hidden)').first().index())
      }
      else {
        var nextIndex = index + 1
        while ($('.icon-picker-item').eq(nextIndex).hasClass('hidden')) {
          if (nextIndex == $(".icon-picker-item").length - 1 ) {
            nextIndex = $('.icon-picker-item:not(.hidden)').first().index();
            break;
          }
          nextIndex = nextIndex + 1
        }
        focusIcon(nextIndex);
      }
    }
    if (e.keyCode == 37 || e.keyCode == 38) {
      e.preventDefault();
      if (index == 0) {
        focusIcon($('.icon-picker-item:not(.hidden)').last().index())
      }
      else {
        var nextIndex = index - 1
        while($('.icon-picker-item').eq(nextIndex).hasClass('hidden')) {
          if (nextIndex == 0) {
            nextIndex = $('.icon-picker-item:not(.hidden)').last().index();
            break;
          }
          nextIndex = nextIndex - 1
        }
        focusIcon(nextIndex)
      }
    }
  })

  $(".icon-picker-items").click(function(e) {
    var target = $(e.target).closest('.icon-picker-item');
    var index = target.index();
    focusIcon(index);
  })

  //trap focus in modal
  $('.icon-modal-content').focusout(function (e) {
    var tabbable = $('.icon-modal-content').find(':tabbable');
    var first = tabbable.first();
    var last = tabbable.last();
    var targ = $(e.relatedTarget);
    if (targ.is('.focusstart')) {
      last.focus();
    } else if (targ.is('.focusend')) {
      first.focus();
    }
  })

  var focusIcon = function(index) {
    var element = $('.icon-picker-item').eq(index);
    $('.icon-picker-item').each(function() {
      $(this).attr('tabindex', -1).attr('aria-checked', false);
    })
    element.attr('aria-checked', true).attr('tabindex', 0);
    element.focus();
  }

  var openModal = function() {
    $('#icon-modal').show();
    for (var i=0; i < icons.length; i++) {
      iconHash[icons[i].class] = icons[i]
    }
    createIconGrid(icons);
    loadCategories();
    $('#no-icons').hide();
    $('#btnCloseIconModal').focus();
  }


  var reset = function() {
    $('#' + initialIcon).off('change').on('change', function(event) {
       $('.icon-picker-item').each(function() {
         $(this).attr('tabindex', -1).attr('aria-checked', false);
       })
       $('#' + initialIcon).attr('tabindex', 0).attr('aria-checked', true);
       updatePreview($(this).val(),$('#' + initialIcon).attr('data-prefix'));
       save();
    });
  }

  var closeModal = function() {
    $('#search_for').val('');
    $('#icon-modal').hide();
    $('#btnSelectIcon').focus();
  }


  function createInput(objIcon) {
    var isSelected = (objIcon.class == selectedIcon)
    var tabindex = isSelected ? 0 : -1
    var ariaChecked = isSelected
    var prefix = (objIcon.free.indexOf('brands') > -1) ? 'fab' : 'fas'
    return '<div id="' + objIcon.class + '" class="icon-picker-item" role="radio" aria-checked="'+ ariaChecked +'" tabindex="'+ tabindex +'" data-prefix="'+ prefix +'">' +
              '<i class="'+ prefix + ' ' + objIcon.class + '" aria-hidden="true"></i>' +
              '<span class="sr-only">' + objIcon.label + '</span>' +
           '</div>'
  }

  var createIconGrid = function(iconList) {
    var html = "";
    for (var i=0; i< iconList.length; i++) {
      html += createInput(iconList[i]);
    }
    $('.icon-picker-items .icon-picker-item').remove();
    $('.icon-picker-items').append(html);
  }

  var loadCategories = function() {
    for (var i=0; i < categoryData.length; i++) {
      var category = categoryData[i]
      $('.icon-category').append('<option value="'+ category.key +'">' + category.label + '</option>')
    }
    $('.icon-category').val('all')
  }

  $('.icon-category').on('change', function(e) {
    var sel = $(this).val()
    $('.icon-picker-item').removeClass('hidden')
    if (sel != 'all') {
      var cat = $.grep(categoryData, function(e){ return e.key == sel })[0]
      var filteredIcons = icons.filter(function (item) {
        return cat.icons.indexOf(item.class) > -1
      }).map(function(r) { return r.class })
      $('.icon-picker-item').each(function() {
        if (!filteredIcons.includes($(this).attr('id'))) {
          $(this).addClass('hidden')
        }
      })
      $('.category-text').text("Showing " + $('.icon-picker-item:not(.hidden)').length + " " + sel +   " icons")
    } else {
      $('.category-text').text("Showing all icons")
    }
  })

  //narrow down the displayed icons as the user types
  $('#search_for').on("keyup", function(){
      var searchVal = $(this).val();
      function isSearchResult(objIcon) {
        if (objIcon.class.indexOf(searchVal) > -1) return true
        var searchTerms = objIcon.search.terms
        for (var term of searchTerms) {
          if (term.indexOf(searchVal) > -1) return true
        }
      }
      var filteredIcons = icons.filter(isSearchResult).map(function(r) { return r.class })
      $('.icon-picker-item').removeClass('hidden')
      $('.icon-picker-item').each(function() {
        if (!filteredIcons.includes($(this).attr('id'))) {
          $(this).addClass('hidden')
        }
      })
      // if no icons match the search term, display a message
      if ($('.icon-picker-item.hidden').length == $('.icon-picker-item').length) {
        $('#no-icons').show();
      } else {
        $('#no-icons').hide();
      }
  });
}
