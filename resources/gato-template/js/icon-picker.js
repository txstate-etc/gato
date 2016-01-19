var createInput = function(id) {
    return '<label for="'+id+'" class="icon-picker-item">'+
      '<input type="radio" name="iconselect" class="iconselect" value="'+id+'" id="'+id+'"/>'+
      '<span class="fa ' + id +'"></span>'+
    '</label>'; 
  };


function initIconPicker(def, node, el, tmpl) {
    var html = '<span id="preview-icon"></span>';
    html += '<button id="icon-select-button">Select Icon</button>';
    html += "<div class=\"icon-picker-items\">";
    for (var i = 0; i < icons.length; i++) {
        html += createInput(icons[i]);
    }
   
    $(el).append(html);

    $('.icon-picker-items').hide();

    $('#icon-select-button').click(function(){
        //$('.icon-picker-items').show();
        $('.icon-picker-items').toggle();
    });

    $('input[type=radio][name=iconselect]').change(function() {
        $('input[type=hidden].icon').val($(this).val()).change();
        $('.icon-picker-item').removeClass('icon-picker-selected');
        $(this).closest('.icon-picker-item').addClass('icon-picker-selected');
        $('.icon-picker-items').hide();
        $('#preview-icon').removeClass();
        $('#preview-icon').addClass('fa ' + $(this).val());
    });

    var val = $('input[type=hidden].icon').val();
    if (val) {
        $('input[type=radio][name=iconselect][value='+val+']').prop('checked', true);
        $('input[type=radio][name=iconselect][value='+val+']').closest('.icon-picker-item').addClass('icon-picker-selected');
        $('#preview-icon').addClass('fa ' + val);
    } else {
        // auto-select the first choice. 
        $('input[type=radio][name=iconselect]').first().prop('checked', true);
        var firstVal = $('input[type=radio][name=iconselect]').first().val();
        $('input[type=hidden].icon').val(firstVal).change();
    }
}
