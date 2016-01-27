var createInput = function(id) {
    return '<label for="'+id+'" title="'+id+'" class="icon-picker-item">'+
      '<input type="radio" name="iconselect" class="iconselect" value="'+id+'" id="'+id+'"/>'+
      '<span class="fa ' + id +'"></span>'+
    '</label>'; 
};

function initIconPicker(def, node, el, tmpl) {

    var initialIcon;

    //update the preview in the icon picker AND in the main dialog
    function updatePreview(icon){
        console.log('updating preview');
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

    //there is something going wrong in here.
    //added the "off('change')" to make sure the event handler is only added once
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
        attachIconClickHandlers();
    }

    var html = "";
    html += '<div id="icon-modal" title="Select Icon">';
    html += '   <div class="icon-picker-items">';
    for (var i = 0; i < icons.length; i++) {
        html += createInput(icons[i]);
    }
    html += '</div>';
    html += '<div class="preview">';
    html += '<span class="preview-icon"></span>';
    html += '<div class="preview-name"></div>';
    html += '</div>';//close preview
    html += '</div>';//close icon-modal
    html += '<span class="preview-icon"></span>';
    html += '<button id="btnSelectIcon">Select Icon</button>';
    $(el).append(html);

    var initialIcon = $('input[type=hidden].icon').val();
    if(initialIcon){
        updatePreview(initialIcon);
    }

    var dialog = $( "#icon-modal" ).dialog({
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
            dialog.dialog("destroy").remove();
        }
    });

    //open the dialog when the Select Icon button is clicked
    $( "#btnSelectIcon" ).button().on( "click", function() {
      dialog.dialog( "open" );
    });
}