var createInput = function(id) {
    return '<label for="'+id+'" title="'+id+'" class="icon-picker-item">'+
      '<input type="radio" name="iconselect" class="iconselect" value="'+id+'" id="'+id+'"/>'+
      '<div><span class="fa ' + id +'"></span></div>'+
    '</label>'; 
};

function initIconPicker(def, node, el, tmpl) {

    var initialIcon;

    //update the preview in the icon picker AND in the main dialog
    function updatePreview(icon){
        $('.preview-icon').removeClass(function(index,css){
            return (css.match(/(^|\s)fa\S+/g) || []).join(' ');
        }).addClass('fa').addClass(icon);
        $('.preview-name').text(icon);
    }

    //Save the icon selection
    function save(){
        var selected = $('input[type=radio][name=iconselect]:checked').val();
        $('input[type=hidden].icon').val(selected).change();
        dialog.dialog("close");
    }

    var createIconGrid = function(iconList){
        var iconsHtml = "";
        for (var i = 0; i < iconList.length; i++) {
            iconsHtml += createInput(iconList[i]);
        }
        $('.icon-picker-items .icon-picker-item').remove();
        $('.icon-picker-items').append(iconsHtml);
        attachIconClickHandlers();
        $('#no-icons').hide();
    };

    function attachIconClickHandlers(){
        $('input[type=radio][name=iconselect]').off('change').on('change', function(event) {
           $(this).prop("checked", true);
           updatePreview($(this).val());
        });
    }

    //on opening the icon picker dialog
    function onOpen(){
        //get the current value, if there is one
        var val = initialIcon || $('input[type=hidden].icon').val();
        if(val){
            $('input[type=radio][name=iconselect][value='+val+']').prop('checked', true);
        }
        else{
            $('input[type=radio][name=iconselect][value=fa-paw]').prop('checked', true);
        }
        createIconGrid(icons);
    }

    function initializeDialog(){
        dialog = $( "#icon-modal" ).dialog({
            modal: true,
            autoOpen: false,
            width: 450,
            height: 400,
            maxHeight:450,
            buttons: [
                {
                    text: "Cancel",
                    "class": "btnCancelIcon",
                    click: function() { 
                        updatePreview(initialIcon);
                        $('#search_for').val('');
                        dialog.dialog( "close" );
                    }
                },
                {
                    text: "Select Icon",
                    "class": "btnSaveIcon",
                    click: save
                }
            ],
            open: onOpen,
            close: function(event, ui){
                dialog.dialog("destroy").hide();
            }
        });
        return dialog;
    }

    var html = "";
    html += '<div id="icon-modal" title="Select Icon">';
    html += '<input id="search_for" placeholder="Search Icons"/>';
    html += '<div id="no-icons">No Icons Found</div>';
    html += '   <div class="icon-picker-items">';

    html += '</div>';
    html += '<div class="preview">';
    html += '<span class="preview-icon"></span>';
    html += '<div class="preview-name"></div>';
    html += '</div>';//close preview
    html += '</div>';//close icon-modal
    html += '<span class="preview-icon"></span>';
    html += '<button id="btnSelectIcon">Select New Icon</button>';
    $(el).append(html);

    var initialIcon = $('input[type=hidden].icon').val();
    if(initialIcon){
        updatePreview(initialIcon);
    }
    else{
        updatePreview("fa-paw");
    }

    var dialog = initializeDialog();

    //open the dialog when the Select Icon button is clicked
    $( "#btnSelectIcon" ).button().on( "click", function() {
      if(!($('#icon-modal').hasClass("ui-dialog-content"))){
        dialog = initializeDialog();
      }  
      dialog.dialog( "open" );
    });

    $('#search_for').on("keyup", function(){
        var searchVal = $(this).val();
        function isSubstring(iconName){
            return iconName.indexOf(searchVal) > -1;
        }
        var filteredIcons = icons.filter(isSubstring);
        createIconGrid(filteredIcons);
        if(filteredIcons.length < 1){
            $('#no-icons').show();
        }
        else{
            $('#no-icons').hide();
        }
    });
}