
function initColorPicker(def, node, el, tmpl) {
  var createInput = function(id, text) {
    return '<label for="'+id+'" class="colorsel '+id+'">'+
      '<input type="radio" name="colorsel" class="colorsel" value="'+id+'" id="'+id+'"/>'+
      '<span>' + (text ? text : '') + '</span>'+
    '</label>'; 
  };
  
  // Create field to select 'Alternating' colors, unless this component only supports a single color.
  if (!$('.single-color').length) {
    $(el).append(createInput("alternating", 'Alternating'));
  }

  // Create fields for the 7 colors defined in the template's css.
  var html = '';
  for (var i = 0; i < 7; i++) {
    html += createInput('color'+(i+1));
  };
  $(el).append(html);
  
  // Register the change event on the radio buttons to update the hidden field,
  // which will ultimately update the JCR.
  $('input[type=radio][name=colorsel]').change(function() {
    $('input[type=hidden].color').val($(this).val()).change();
  });
  
  // Get the initial value out of the hidden field and check the associated radio button.
  var val = $('input[type=hidden].color').val();
  if (val) {
    $('input[type=radio][name=colorsel][value='+val+']').prop('checked', true);
  }
}
