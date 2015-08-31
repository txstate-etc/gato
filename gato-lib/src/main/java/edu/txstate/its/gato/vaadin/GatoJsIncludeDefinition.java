package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;

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
 *
 * Example gato-example/js/test.js:
 *
 * function foo(definition, node, el) {
 *   do something!
 * }
 *
 */
public class GatoJsIncludeDefinition extends ConfiguredFieldDefinition {

    private String file;
    private String initFunction;

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
}
