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
 * Definition for the GatoCssInclude field.
 *
 * Example yaml config:
 *
 * form:
 *   tabs:
 *    - name: tabExample
 *     label: CSS Include Example
 *     fields:
 *       - name: cssInclude
 *         class: edu.txstate.its.gato.vaadin.GatoCssIncludeDefinition
 *         label: ""
 *         styles: [gato-example/css/test.css]
 *
 */

public class GatoCssIncludeDefinition extends CompositeFieldDefinition {

  public GatoCssIncludeDefinition() {
    setTransformerClass(DelegatingCompositeFieldTransformer.class);
  }

  public GatoCssIncludeDefinition(GatoCssIncludeDefinition def) {
    setTransformerClass(null);
    setStyles(def.getStyles());
  }

  // An array of css files to be loaded. Paths of files should be relative to magnolia resources root.
  @Getter @Setter private List<String> styles = new ArrayList<String>();

}
