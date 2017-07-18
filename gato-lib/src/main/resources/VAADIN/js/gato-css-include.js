var MGNL_RESOURCES_PATH = './../.resources/';
var loadedGatoJsScripts = new Set();

edu_txstate_its_gato_vaadin_GatoCssComponent = function() {
  var definition = this.getState().definition;
  var node = this.getState().nodePath;
  var el = this.getElement();
  var template = this.getState().pageTemplate;

  definition.styles.forEach(function(styleName) {
    loadGatoCssStyle(styleName);
  });

}

function loadGatoCssStyle(styleName) {
  if (loadedGatoJsScripts.has(styleName)) {
    return;
  }

  var style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.href = MGNL_RESOURCES_PATH + styleName;
  style.onload = function() { loadedGatoJsScripts.add(styleName); }
  document.getElementsByTagName("head")[0].appendChild(style);
}

