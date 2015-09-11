package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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
 *         file: gato-example/js/test.js
 *         initFunction: foo
 *         scripts: [gato-lib/js/prototype.js, gato-lib/js/modal.js]
 *         styles: [gato-example/css/test.css]
 *         loadScriptsInOrder: false
 *
 * Example gato-example/js/test.js:
 *
 * function foo(definition, node, el) {
 *   do something!
 * }
 *
 */
public class GatoJsIncludeDefinition extends ConfiguredFieldDefinition {

    // The javascript file to include for this field. Path should be relative to magnolia resources
    // root. This means you can use <module-name>/js/script.js.
    @Getter @Setter private String file;

    // Function to be called after script is loaded. Should be of the form init(def, node, el).
    @Getter @Setter private String initFunction;

    // An array of javascript files to be loaded before the init function is called. Paths of scripts
    // should be relative to magnolia resources root.
    @Getter @Setter private List<String> scripts = new ArrayList<String>();

    // An array of css files to be loaded. Paths of files should be relative to magnolia resources root.
    @Getter @Setter private List<String> styles = new ArrayList<String>();

    // If set to true, dependencies will be guaranteed to load in the order they're specified in the array.
    @Getter @Setter private boolean loadScriptsInOrder = false;
}
