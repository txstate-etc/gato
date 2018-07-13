
function initColorPicker(def, node, el, tmpl) {

  var createInput = function(id, text) {
    return '<label for="'+id+'" class="colorsel '+id+'">'+
      '<input type="radio" name="colorsel" class="colorsel" value="'+id+'" id="'+id+'"/>'+
      '<span>' + (text ? text : '') + '</span>'+
    '</label>';
  };

  // Pull in the template's colors.css file if it exists
  if (!tmpl) {
    tmpl = 'gato-template-txstate2015';
  }
  tmpl = tmpl.replace(/:.+/, '');
  var cssfile = "./../.resources/"+tmpl+"/css/color-picker.scss";
  $('head').append('<link rel="stylesheet" type="text/css" href="'+cssfile+'">');

  var configfile = "./../.resources/"+tmpl+"/js/color-picker-config.js";
  if (!fileExists(configfile)) {
    configfile = "./../.resources/"+"gato-template-txstate2015"+"/js/color-picker-config.js";
  }

  var fieldName = "color";
  if (def.parameters.fieldName) {
    fieldName = def.parameters.fieldName;
  }
  $.getJSON(configfile, function(data, status, xhr){
    var colorConfig = data;
    if (def.parameters.contentType) {
      colorConfig = colorConfig[def.parameters.contentType];
    }
    var availableColors = colorConfig.colors;

    // Create field to select 'Alternating' colors, unless this component only supports a single color.
    if (!colorConfig.singleColor) {
      //TODO: This won't work the way Charles wrote it anymore.  Need to build it in JS?
      $(el).append(createInput("alternating", 'Alternating'));
    }

    // Create fields for the specified colors
    var html = '';
    for (var i = 0; i < availableColors.length; i++) {
      html += createInput(availableColors[i]);
    }

    $(el).append(html);

    // Register the change event on the radio buttons to update the hidden field,
    // which will ultimately update the JCR.
    $('input[type=radio][name=colorsel]').change(function() {
      $('input[type=hidden].' + fieldName).val($(this).val()).change();
    });

    // Get the initial value out of the hidden field and check the associated radio button.
    var val = $('input[type=hidden].' + fieldName).val();
    //if val has been set and either all colors are available or it is one of the available colors
    if (val && availableColors.indexOf(val) > -1) {
      $('input[type=radio][name=colorsel][value='+val+']').prop('checked', true);
    } else {
      // auto-select the first choice.
      $('input[type=radio][name=colorsel]').first().prop('checked', true);
      var firstVal = $('input[type=radio][name=colorsel]').first().val();
      $('input[type=hidden].' + fieldName).val(firstVal).change();
    }
  })
  .fail(function(){
    $(el).append("<div>No Color Configuration File Found</div>");
  })
}

function fileExists(urlToFile)
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}
