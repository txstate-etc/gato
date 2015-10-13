package edu.txstate.its.gato.vaadin;

import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import com.vaadin.data.Item;
import com.vaadin.data.util.PropertysetItem;
import com.vaadin.ui.Field;

import edu.txstate.its.gato.GatoUtils;

import javax.jcr.Node;

/**
 * Creates and initializes a composite field for selecting a thumbnail for an image.
 */
public class ThumbnailSelectorFieldFactory<D extends FieldDefinition> extends AbstractFieldFactory<ThumbnailSelectorFieldDefinition, Object> {

  private GatoUtils gf;
  private DamTemplatingFunctions damTemplatingFunctions;

  public ThumbnailSelectorFieldFactory(ThumbnailSelectorFieldDefinition definition, Item relatedFieldItem, GatoUtils gf, DamTemplatingFunctions damTemplatingFunctions) {
    super(definition, relatedFieldItem);
    this.gf = gf;
    this.damTemplatingFunctions = damTemplatingFunctions;
  }

  @Override
  protected Field<Object> createFieldComponent() {
    Node node = ((JcrNodeAdapter)item).getJcrItem();
    return new ThumbnailSelectorField(node, gf, damTemplatingFunctions);
  }

}
