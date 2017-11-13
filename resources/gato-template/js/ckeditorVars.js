function setCKEditorVars(def, node, el, tmpl) {
  // get the template
  if (!tmpl) {
    tmpl = 'gato-template-txstate2015';
  }
  tmpl = tmpl.replace(/:.+/, '');

  var config = "../../.resources/"+tmpl+"/js/ckeditor-custom-colors.js";
  var result = doesFileExist(config);
  if(!result){
    config = "../../.resources/gato-template-txstate2015/js/ckeditor-custom-colors.js"
  }
  $('head').append('<script src="'+config+'">');
}

function doesFileExist(urlToFile)
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
