edu_txstate_its_gato_vaadin_GatoJsComponent = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = './../.resources/' + this.getState().definition.file;

  if (this.getState().definition.initFunction) {
    var initFunction = this.getState().definition.initFunction;
    var definition = this.getState().definition;
    var node = this.getState().node;
    var el = this.getElement();
    script.onload = function() {
      eval(initFunction + "(definition, node, el)");
    }
  }

  document.body.appendChild(script);
}
