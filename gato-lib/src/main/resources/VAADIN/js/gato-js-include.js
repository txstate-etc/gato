var MGNL_RESOURCES_PATH = './../.resources/'
var loadedGatoJsScripts = new Set();

edu_txstate_its_gato_vaadin_GatoJsComponent = function() {
  var definition = this.getState().definition;
  var node = this.getState().nodePath;
  var el = this.getElement();

  var callInit = function() {
    if (definition.initFunction) {
      window[definition.initFunction](definition, node, el);
    }
  }

  var onLoad = function() {
    if (definition.loadDepsInOrder) {
      loadDepsInOrder(definition.dependencies, callInit);
    } else {
      loadDeps(definition.dependencies, callInit);
    }
  }

  loadGatoJsScript(this.getState().definition.file, onLoad);
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
 * Load dependencies and call a function after all dependencies have
 * finished loading.
 */
function loadDeps(scripts, callback) {
  var count = scripts.length;
  if (count == 0) {
    callback();
    return;
  }

  for (var i = 0; i < scripts.length; i++) {
    loadGatoJsScript(scripts[i], function() {
      count--;
      if (count == 0) {
        callback();
      }
    });
  }
}

/**
 * Load dependencies from an array in order by loading the next script in the array
 * in the onload callback of the previous script.
 */
function loadDepsInOrder(scripts, callback) {
  if (scripts.length == 0) {
    callback();
    return;
  }

  loadGatoJsScript(scripts.shift(), function() {
    loadDepsInOrder(scripts, callback);
  });
}
