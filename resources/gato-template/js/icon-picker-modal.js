function initIconPicker(def, node, el, tmpl) {
  
  var selectedIcon;
  var initialIcon;

  //if there is an icon saved already, return its name
  //if not, return the default graduation cap icon
  function getSelectedIcon(){
    var val = selectedIcon || $('input[type=hidden].icon').val();
    return (val ? val : "fa-graduation-cap");
  }
  
  function updatePreview(icon){
    $('.preview-icon').removeClass(function(index,css){
      return (css.match(/(^|\s)fa\S+/g) || []).join(' ');
    }).addClass('fa').addClass(icon);
    $('.preview-name').text(icon);
  }
  
  function save(){
    var selected = $('.icon-picker-item[aria-checked=true]').attr('id');
    $('input[type=hidden].icon').val(selected).change();
    selectedIcon = selected;
    updatePreview(selected);
  }
  
  var modalhtml = "";
  modalhtml += '<div id="icon-modal" title="Select Icon">' +
                 '<div tabindex="0" class="focusstart sr-only"></div>' +
                 '<div class="icon-modal-content">' +
                   '<button id="btnCloseIconModal"><i class="fa fa-close" aria-hidden="true"></i><span class="sr-only">Close Dialog</span></button>' +
                   '<div class="search-wrapper">' +
                     '<input id="search_for" placeholder="Search Icons"/>' +
                     '<label for="search_for" class="fa fa-search" rel="tooltip" title="search"></label>' +
                   '</div>' +
                   '<fieldset>' +
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
             '<button id="btnSelectIcon">SELECT NEW ICON</button>';
  $(el).append(html);
  $(el).closest('.dialog-content').append(modalhtml);
  $('#icon-modal').hide();
  
  selectedIcon = getSelectedIcon();
  initialIcon = selectedIcon;
  updatePreview(selectedIcon);
  
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
  
  $(".icon-picker-items").keydown(function(e) {
    var target = $(e.target).closest('.icon-picker-item');
    var index = target.index();
    if (e.keyCode == 39 || e.keyCode == 40) {
      e.preventDefault();
      if (index == $(".icon-picker-item").length - 1) {
        focusIcon(0);
      }
      else {
        focusIcon(index + 1);
      }
    }
    if (e.keyCode == 37 || e.keyCode == 38) {
      e.preventDefault();
      if (index == 0) {
        focusIcon($(".icon-picker-item").length - 1);
      }
      else {
        focusIcon(index - 1);
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
    createIconGrid(icons);
    $('#no-icons').hide();
    $('#btnCloseIconModal').focus();
  }
  
  var reset = function() {
    $('#' + initialIcon).off('change').on('change', function(event) {
       $('.icon-picker-item').each(function() {
         $(this).attr('tabindex', -1).attr('aria-checked', false);
       })
       $('#' + initialIcon).attr('tabindex', 0).attr('aria-checked', true);
       updatePreview($(this).val());
       save();
    });
  }

  var closeModal = function() {
    $('#search_for').val('');
    $('#icon-modal').hide();
    $('#btnSelectIcon').focus();
  }
  
  function createInput(id) {
    var tabindex = (id == selectedIcon) ? 0 : -1;
    var ariaChecked = (id == selectedIcon) ? true : false;
    return '<div id="' + id + '" class="icon-picker-item" role="radio" aria-checked="'+ ariaChecked +'" tabindex="'+ tabindex +'">' +
              '<i class="fa fa-w '+ id +'" aria-hidden="true"></i>' +
              '<span class="sr-only">' + id.substring(3) + '</span>' +
           '</div>';
  }
  
  var createIconGrid = function(iconList) {
    var html = "";
    for (var i=0; i< iconList.length; i++) {
      html += createInput(iconList[i]);
    }
    $('.icon-picker-items .icon-picker-item').remove();
    $('.icon-picker-items').append(html);
  }
  
  //narrow down the displayed icons as the user types
  $('#search_for').on("keyup", function(){
      var searchVal = $(this).val();
      function isSubstring(iconName){
        return iconName.indexOf(searchVal) > -1;
      }
      var filteredIcons = icons.filter(isSubstring);
      createIconGrid(filteredIcons);
      //if no icons match the search term, display a message
      if(filteredIcons.length < 1){
        $('#no-icons').show();
      }
      else{
        $('#no-icons').hide();
        var focusOn = 0;
        if (filteredIcons.includes(selectedIcon)) {
          focusOn = $('#' + selectedIcon).parent().index();
        }
        var element = $('.icon-picker-items label').eq(focusOn);
        element.find('input').prop('checked', true);
        $('.icon-picker-item div').each(function() {
          $(this).attr('tabindex', -1);
        })
        element.find('div').attr('tabindex', 0);
      }
  });

}
