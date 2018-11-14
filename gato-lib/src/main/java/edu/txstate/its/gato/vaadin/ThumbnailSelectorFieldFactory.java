package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.util.PropertysetItem;
import com.vaadin.v7.ui.Field;

import edu.txstate.its.gato.GatoUtils;

import javax.jcr.Node;

/**
 * Creates and initializes a composite field for selecting a thumbnail for an image.
 */
public class ThumbnailSelectorFieldFactory<D extends FieldDefinition> extends AbstractFieldFactory<ThumbnailSelectorFieldDefinition, Object> {

  private GatoUtils gf;

  public ThumbnailSelectorFieldFactory(ThumbnailSelectorFieldDefinition definition, Item relatedFieldItem, GatoUtils gf) {
    super(definition, relatedFieldItem);
    this.gf = gf;
  }

  @Override
  protected Field<Object> createFieldComponent() {
    Node node = ((JcrNodeAdapter)item).getJcrItem();
    String controlName = definition.getControlName();
    return new ThumbnailSelectorField(node, gf, controlName);
  }

}
