function initIconPicker(def, node, el, tmpl) {

    var selectedIcon;

    //if there is an icon saved already, return its name
    //if not, return the default paw icon
    function getSelectedIcon(){
        var val = selectedIcon || $('input[type=hidden].icon').val();
        return (val ? val : "fa-paw");
    }

    //update the preview in the icon/text dialog
    function updatePreview(icon){
        $('.preview-icon').removeClass(function(index,css){
            return (css.match(/(^|\s)fa\S+/g) || []).join(' ');
        }).addClass('fa').addClass(icon);
        $('.preview-name').text(icon);
    }

    //create the jQuery dialog
    function initializeDialog(){
        $('#icon-modal').show();
        dialog = $( "#icon-modal" ).dialog({
            modal: true,
            autoOpen: false,
            width: 450,
            height: 400,
            maxHeight:450,
            open: onOpen,
            closeOnEscape: false,
            close: function(event, ui){
                $('#search_for').val('');
                dialog.dialog("destroy").hide();
            }
        });
        return dialog;
    }

    function createInput(id) {
        return '<label for="'+id+'" title="'+id+'" class="icon-picker-item">'+
          '<input type="radio" name="iconselect" class="iconselect" value="'+id+'" id="'+id+'"/>'+
          '<div><span class="fa ' + id +'"></span></div>'+
        '</label>'; 
    }

    //save the icon selection when an icon is clicked
    //update the preview in the picker when the user hovers over an icon
    function attachIconEventHandlers(){
        $('input[type=radio][name=iconselect]').off('change').on('change', function(event) {
           $(this).prop("checked", true);
           updatePreview($(this).val());
           save();

        });
        $('.icon-picker-item').hover(function(){
            var name = $(this).find('input').val();
            setPickerPreview(name);
        });
    }

    function createIconGrid(iconList){
        var iconsHtml = "";
        for (var i = 0; i < iconList.length; i++) {
            iconsHtml += createInput(iconList[i]);
        }
        $('.icon-picker-items .icon-picker-item').remove();
        $('.icon-picker-items').append(iconsHtml);
        attachIconEventHandlers();
        $('#no-icons').hide();
    }

    //The preview in the picker, not the one in the icon/text dialog
    function setPickerPreview(icon){
        $('.hover-icon').removeClass(function(index,css){
            return (css.match(/(^|\s)fa\S+/g) || []).join(' ');
        }).addClass('fa').addClass(icon);
        $('.hover-icon-name').text(icon);
    }

    function onCancel(){
        $('#search_for').val('');
        $('#icon-modal').dialog('close');
    }

    //called when the icon-picker opens
    function onOpen(){
        createIconGrid(icons);
        //show the current icon as selected
        $('input[type=radio][name=iconselect][value='+ getSelectedIcon() +']').prop('checked', true);
      
        //build the preview at the bottom of the icon picker
        var previewHTML = '<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">';
        previewHTML += '<div class="preview">';
        previewHTML += '<span class="hover-icon"></span>';
        previewHTML += '<div class="hover-icon-name"></div>';
        previewHTML += '</div>';
        $('#icon-modal').after(previewHTML);
        setPickerPreview(getSelectedIcon());

        //get rid of the default close button and use a font awesome one instead
        $('.ui-dialog-titlebar-close').hide().after('<div id="close-icon-picker"><i class="fa fa-close"></i></div>');

        $('#close-icon-picker').click(onCancel);
        //close dialog if they click off of it
        $('.ui-widget-overlay').bind('click',function(){
            onCancel();
        });
        $('.ui-dialog-titlebar, #search_for, .ui-dialog-buttonpane').hover(function(){
            setPickerPreview(getSelectedIcon());
        });
    }

    //Save the icon selection in the hidden field
    function save(){
        var selected = $('input[type=radio][name=iconselect]:checked').val();
        $('input[type=hidden].icon').val(selected).change();
        selectedIcon = selected;
        dialog.dialog("close");
    }

    var html = "";
    html += '<div id="icon-modal" title="Select Icon">';
    html += '<div class="search-wrapper">';
    html += '<input id="search_for" placeholder="Search Icons"/>';
    html += '<label for="search_for" class="fa fa-search" rel="tooltip" title="search"></label>';
    html += '</div>';
    html += '   <div class="icon-picker-items">';

    html += '</div>';
    html += '<div id="no-icons">No Icons Found</div>';
    html += '</div>';
    html += '<span class="preview-icon"></span>';
    html += '<button id="btnSelectIcon">Select New Icon</button>';
    $(el).append(html);
    $('#icon-modal').hide();

    //if there is an icon saved already, display it in the preview
    //if not, display the default icon
    selectedIcon = getSelectedIcon();
    updatePreview(selectedIcon);

    var dialog;

    //open the dialog when the Select Icon button is clicked
    $( "#btnSelectIcon" ).button().on( "click", function() {
      dialog = initializeDialog();
      dialog.dialog("open");
    });

    //narrow down the displayed icons as the user types
    $('#search_for').on("keyup", function(){
        var searchVal = $(this).val();
        function isSubstring(iconName){
            return iconName.indexOf(searchVal) > -1;
        }
        var filteredIcons = icons.filter(isSubstring);
        createIconGrid(filteredIcons);
        //if no icons match the search term, display a message
        //and hide the preview
        if(filteredIcons.length < 1){
            $('#no-icons').show();
            $('.preview').css('visibility', 'hidden');
        }
        else{
            $('#no-icons').hide();
            setPickerPreview(getSelectedIcon());
            $('.preview').css('visibility', 'visible');
        }
    });
}