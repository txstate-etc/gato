function initIconPicker(def, node, el, tmpl) {
  
  var selectedIcon;

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
    var selected = $('input[type=radio][name=iconselect]:checked').val();
    $('input[type=hidden].icon').val(selected).change();
    selectedIcon = selected;
    closeModal();
  }
  
  var modalhtml = "";
  modalhtml += '<div id="icon-modal" title="Select Icon">';
  modalhtml += '<div tabindex="0" class="focusstart sr-only"></div>';
  modalhtml += '<div class="icon-modal-content">'
  modalhtml += '<button id="btnCloseIconModal"><i class="fa fa-close" aria-hidden="true"></i><span class="sr-only">Close Dialog</span></button>';
  modalhtml += '<div class="search-wrapper">';
  modalhtml += '<input id="search_for" placeholder="Search Icons"/>';
  modalhtml += '<label for="search_for" class="fa fa-search" rel="tooltip" title="search"></label>';
  modalhtml += '</div>';
  modalhtml += '<fieldset>';
  modalhtml += '<legend class="sr-only">Icons</legend>';
  modalhtml += '   <div class="icon-picker-items"></div>';
  modalhtml += '</fieldset>';
  modalhtml += '<div id="no-icons">No Icons Found</div>';
  modalhtml += '</div>';
  modalhtml += '<div tabindex="0" class="focusend sr-only"></div>';
  modalhtml += '</div>';
  var html = '<span class="preview-icon"></span>';
  html += '<button id="btnSelectIcon">SELECT NEW ICON</button>';
  $(el).append(html);
  $(el).closest('.dialog-content').append(modalhtml);
  $('#icon-modal').hide();
  
  selectedIcon = getSelectedIcon();
  updatePreview(selectedIcon);
  
  //open the dialog when the Select Icon button is clicked
  $( "#btnSelectIcon" ).on( "click", function() {
    openModal();
  });
  
  $('#btnCloseIconModal').click(function() {
    closeModal();
  })
  
  $( "#icon-modal").on('keydown', function(e) {
    e.stopPropagation();
    if (e.key === 'Escape' || e.key ==='Esc') {
      closeModal();
    }
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

  var openModal = function() {
    $('#icon-modal').show();
    createIconGrid(icons);
    //show the current icon as selected
    $('input[type=radio][name=iconselect][value='+ getSelectedIcon() +']').prop('checked', true);
    
    $('#no-icons').hide();
    $('#btnCloseIconModal').focus();
  }

  var closeModal = function() {
    $('#search_for').val('');
    $('#icon-modal').hide();
    $('#btnSelectIcon').focus();
  }
  
  function attachIconEventHandlers(){
    $('input[type=radio][name=iconselect]').off('change').on('change', function(event) {
       $(this).prop("checked", true);
       updatePreview($(this).val());
       save();

    });
  }
  
  function createInput(id) {
    return '<label for="'+id+'" title="'+id+'" class="icon-picker-item">'+
      '<input type="radio" name="iconselect" class="iconselect" value="'+id+'" id="'+id+'"/>'+
      '<div><span class="fa fa-fw ' + id +'"></span><span class="sr-only">' + id.substring(3) + '</span></div>'+
    '</label>';
  }
  
  var createIconGrid = function(iconList) {
    var html = "";
    for (var i=0; i< iconList.length; i++) {
      html += createInput(iconList[i]);
    }
    $('.icon-picker-items .icon-picker-item').remove();
    $('.icon-picker-items').append(html);
    attachIconEventHandlers();
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
      }
  });

}


