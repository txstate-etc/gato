package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;

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
 *         dependencies: [gato-lib/js/prototype.js, gato-lib/js/modal.js]
 *         loadDepsInOrder: false
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
    private String file;
    private String initFunction;

    // An array of javascript files to be loaded before the init function is called. Paths of scripts
    // should be relative to magnolia resources root.
    private List<String> dependencies = new ArrayList<String>();

    // If set to true, dependencies will be guaranteed to load in the order they're specified in the array.
    private boolean loadDepsInOrder = false;

    public String getFile() {
        return file;
    }

    public void setFile(String f) {
        file = f;
    }

    public String getInitFunction() {
        return initFunction;
    }

    public void setInitFunction(String init) {
        initFunction = init;
    }

    public void setDependencies(List<String> list) {
        dependencies = list;
    }

    public List<String> getDependencies() {
        return dependencies;
    }

    public boolean getLoadDepsInOrder() {
        return loadDepsInOrder;
    }

    public void setLoadDepsInOrder(boolean b) {
        loadDepsInOrder = b;
    }
}
