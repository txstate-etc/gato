var MGNL_RESOURCES_PATH = './../.resources/'
var loadedGatoJsScripts = new Set();

edu_txstate_its_gato_vaadin_GatoJsComponent = function() {
  var definition = this.getState().definition;
  var node = this.getState().nodePath;
  var el = this.getElement();
  var template = this.getState().pageTemplate;

  var callInit = function() {
    if (definition.initFunction) {
      window[definition.initFunction](definition, node, el, template);
    }
  }

  definition.styles.forEach(function(styleName) {
    loadGatoJsStyle(styleName);
  });

  if (definition.loadScriptsInOrder) {
    loadScriptsInOrder(definition.scripts, callInit);
  } else {
    loadScripts(definition.scripts, callInit);
  }
}

function loadGatoJsStyle(styleName) {
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

function loadGatoJsScript(scriptName, callback) {
  if (loadedGatoJsScripts.has(scriptName)) {
    callback();
    return;
  }

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = MGNL_RESOURCES_PATH + scriptName;
  script.onload = function() {
    loadedGatoJsScripts.add(scriptName);
    callback();
  };
  document.getElementsByTagName("head")[0].appendChild(script);
}

/**
 * Load scripts and call a function after all scripts have
 * finished loading.
 */
function loadScripts(scripts, callback) {
  var count = scripts.length;
  if (count == 0) {
    callback();
    return;
  }

  scripts.forEach(function(scriptName) {
    loadGatoJsScript(scriptName, function() {
      if (--count == 0) {
        callback();
      }
    });
  });
}

/**
 * Load scripts from an array in order by loading the next script in the array
 * in the onload callback of the previous script.
 */
function loadScriptsInOrder(scripts, callback) {
  if (scripts.length == 0) {
    callback();
    return;
  }

  loadGatoJsScript(scripts.shift(), function() {
    loadScriptsInOrder(scripts, callback);
  });
}
