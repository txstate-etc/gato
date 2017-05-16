package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.CompositeFieldDefinition;
import info.magnolia.ui.form.field.transformer.composite.DelegatingCompositeFieldTransformer;

import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Definition for the GatoJSInclude field.
 *
 * file - The path to the javascript file that will be used to create the field.
 * The path should start with the module name, e.g. gato-faq/js/test.js.
 * The context will be prepended at runtime.
 *
 * initFunction (optional) - The name of a function that will be called after the
 * script has been loaded. The function will be passed the definition, the jcr node,
 * and the element that has been created for this field.
 *
 * Example yaml config:
 *
 * form:
 *   tabs:
 *    - name: tabExample
 *     label: JS Include Example
 *     fields:
 *       - name: jsInclude
 *         class: edu.txstate.its.gato.vaadin.GatoJsIncludeDefinition
 *         label: JS Include
 *         initFunction: foo
 *         scripts: [gato-lib/js/prototype.js, gato-lib/js/modal.js, gato-example/js/test.js]
 *         styles: [gato-example/css/test.css]
 *         loadScriptsInOrder: false
 *         parameters:
 *           key1: value1
 *           key2: value2
 *
 * Example gato-example/js/test.js:
 *
 * function foo(definition, node, el) {
 *   do something!
 * }
 *
 */
public class GatoJsIncludeDefinition extends CompositeFieldDefinition {

  public GatoJsIncludeDefinition() {
    setTransformerClass(DelegatingCompositeFieldTransformer.class);
  }

  public GatoJsIncludeDefinition(GatoJsIncludeDefinition def) {
    setTransformerClass(null);
    setInitFunction(def.getInitFunction());
    setScripts(def.getScripts());
    setStyles(def.getStyles());
    setLoadScriptsInOrder(def.isLoadScriptsInOrder());
    setParameters(def.getParameters());
  }

  // Function to be called after script is loaded. Should be of the form init(def, node, el).
  @Getter @Setter private String initFunction;

  // An array of javascript files to be loaded. Paths of scripts should be relative to magnolia resources root.
  @Getter @Setter private List<String> scripts = new ArrayList<String>();

  // An array of css files to be loaded. Paths of files should be relative to magnolia resources root.
  @Getter @Setter private List<String> styles = new ArrayList<String>();

  // An object containing key/value pairs of parameters to be used by the JS field
  @Getter @Setter private Map<String, Object> parameters = new HashMap<String,Object>();

  public void setScriptsStr(String scripts) {
    this.scripts = Arrays.asList(scripts.split(","));
  }

  // If set to true, scripts will be guaranteed to load in the order they're specified in the array.
  // Note, with either option, all scripts will be loaded before the init function is called.
  @Getter @Setter private boolean loadScriptsInOrder = false;
}
