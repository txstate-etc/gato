
function initColorPicker(def, node, el, tmpl) {
  var COLOR_COUNT = 7;

  var createInput = function(id, text) {
    return '<label for="'+id+'" class="colorsel '+id+'">'+
      '<input type="radio" name="colorsel" class="colorsel" value="'+id+'" id="'+id+'"/>'+
      '<span>' + (text ? text : '') + '</span>'+
    '</label>'; 
  };
  
  // Pull in the template's colors.css file if it exists
  tmpl = tmpl.replace(/:.+/, '');
  var cssfile = "./../.resources/"+tmpl+"/css/color-picker.compiled.css";
  $('head').append('<link rel="stylesheet" type="text/css" href="'+cssfile+'">');

  // Create field to select 'Alternating' colors, unless this component only supports a single color.
  if (!$('.single-color').length) {
    $(el).append(createInput("alternating", 'Alternating'));
  }
  
  var $root = $(el).closest('.v-customcomponent');
  var classes = [];
  for (var i = 1; i <= COLOR_COUNT; i++) {
    classes.push(".color"+i);
  }

  // if no color classes are set, show all of them
  var showAll = !$root.is(classes.join(", "));

  // Create fields for the 7 colors defined in the template's css.
  var html = '';
  for (var i = 1; i <= COLOR_COUNT; i++) {
    var id = 'color'+(i);
    if (showAll || $root.is('.'+id)) {
      html += createInput(id);
    }
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
  } else {
    // auto-select the first choice. 
    $('input[type=radio][name=colorsel]').first().prop('checked', true);
  }
}
