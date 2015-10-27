
function initColorPicker(def, node, el, tmpl) {
  //console.log("color-picker: template name is " + tmpl);

  var createFields = function(el, colors) {
    $(el).append(createInput("alternating", '<span>Alternating</span>'));
    
    $(el).append($.map(colors, createField).join(''));
    $('input[type=radio][name=colorsel]').change(function() {
      $('input[type=hidden].color').val($(this).val()).change();
    });
  };

  var createField = function(color) {
    var inner = '<span style="background: '+color.bg+'; color: '+color.text+';">'+color.name+'</span>';
    return createInput(color.id, inner);
  };

  var createInput = function(id, inner) {
    return '<label for="'+id+'" class="colorsel '+id+'">'+
      '<input type="radio" name="colorsel" class="colorsel" value="'+id+'" id="'+id+'"/>'+
      inner +
    '</label>'; 
  };

  var colors = [
    {
      "id": "color1",
      "name": "Maroon",
      "bg": "#501214",
      "text": "#FFFFFF"
    },
    {
      "id": "color2",
      "name": "Gold",
      "bg": "#6A5638",
      "text": "#FFFFFF"
    },
    {
      "id": "color3",
      "name": "Charcoal",
      "bg": "#363534",
      "text": "#FFFFFF"
    },
    {
      "id": "color4",
      "name": "Blue",
      "bg": "#005481",
      "text": "#FFFFFF"
    },
    {
      "id": "color5",
      "name": "River",
      "bg": "#8BAEA1",
      "text": "#222"
    },
    {
      "id": "color6",
      "name": "Sandstone",
      "bg": "#E8E3DB",
      "text": "#222"
    },
    {
      "id": "color7",
      "name": "Old Gold",
      "bg": "#DEB407",
      "text": "#222"
    }
  ];


  createFields(el, colors);
  
  // get current selected value and select the associated radio button.
  var val = $('input[type=hidden].color').val();
  if (val) {
    $('input[type=radio][name=colorsel][value='+val+']').prop('checked', true);
  }

}



