package edu.txstate.its.gato.vaadin;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.AbstractCustomMultiField;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.transformer.TransformedProperty;
import info.magnolia.ui.form.field.transformer.Transformer;
import info.magnolia.ui.form.field.transformer.multi.MultiTransformer;

import java.util.Iterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.Property;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.Button.ClickListener;
import com.vaadin.ui.Component;
import com.vaadin.v7.ui.Field;
import com.vaadin.v7.ui.HorizontalLayout;
import com.vaadin.ui.NativeButton;
import com.vaadin.v7.ui.VerticalLayout;

/**
 * The is an orderable version of magnolia's multi field. Most of this code comes from info.magnolia.ui.form.field.MultiField.
 */
public class OrderableMultiField extends AbstractCustomMultiField<OrderableMultiFieldDefinition, OrderablePropertysetItem> {

  private static final Logger log = LoggerFactory.getLogger(OrderableMultiField.class);

  protected final ConfiguredFieldDefinition fieldDefinition;

  protected final Button addButton = new NativeButton();
  protected String buttonCaptionAdd;
  protected String buttonCaptionRemove;

  public OrderableMultiField(OrderableMultiFieldDefinition definition, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, Item relatedFieldItem, I18NAuthoringSupport i18nAuthoringSupport) {
    super(definition, fieldFactoryFactory, componentProvider, relatedFieldItem, i18nAuthoringSupport);
    this.fieldDefinition = definition.getField();
    // Only propagate read only if the parent definition is read only
    if (definition.isReadOnly()) {
      fieldDefinition.setReadOnly(true);
    }
  }

  @Override
  protected Component initContent() {
    // Init root layout
    addStyleName("linkfield");
    root = new VerticalLayout();
    root.setSpacing(true);
    root.setWidth(100, Unit.PERCENTAGE);
    root.setHeight(-1, Unit.PIXELS);

    // Init addButton
    addButton.setCaption(buttonCaptionAdd);
    addButton.addStyleName("magnoliabutton");
    addButton.addClickListener(new Button.ClickListener() {
      @Override
      public void buttonClick(ClickEvent event) {

        int newPropertyId = -1;
        Property<?> property = null;

        Transformer<?> transformer = ((TransformedProperty<?>) getPropertyDataSource()).getTransformer();
        OrderablePropertysetItem item = (OrderablePropertysetItem) getPropertyDataSource().getValue();

        if (transformer instanceof MultiTransformer) {
          // create property and find its propertyId
          property = ((MultiTransformer) transformer).createProperty();
          newPropertyId = findPropertyId(item, property);
        } else {
          // get next propertyId based on property count
          newPropertyId = item.getItemPropertyIds().size();
        }

        if (newPropertyId == -1) {
          log.warn("Could not resolve new propertyId; cannot add new multifield entry to item '{}'.", item);
          return;
        }

        root.addComponent(createEntryComponent(newPropertyId, property), root.getComponentCount() - 1);
      };
    });

    // Initialize Existing field
    initFields();

    return root;
  }
  /**
   * Initialize the MultiField. <br>
   * Create as many configured Field as we have related values already stored.
   */
  @Override
  protected void initFields(OrderablePropertysetItem newValue) {
    root.removeAllComponents();
    Iterator<?> it = newValue.getItemPropertyIds().iterator();
    while (it.hasNext()) {
      Object propertyId = it.next();
      Property<?> property = newValue.getItemProperty(propertyId);
      root.addComponent(createEntryComponent(propertyId, property));
    }
    if (!this.definition.isReadOnly()) {
      root.addComponent(addButton);
    }
  }

  /**
   * Create a single element.<br>
   * This single element is composed of:<br>
   * - a configured field <br>
   * - a remove Button<br>
   */
  protected Component createEntryComponent(Object propertyId, Property<?> property) {

    HorizontalLayout layout = new HorizontalLayout();
    layout.setWidth(100, Unit.PERCENTAGE);
    layout.setHeight(-1, Unit.PIXELS);

    Field<?> field = createLocalField(fieldDefinition, property, true); // creates property datasource if given property is null
    layout.addComponent(field);

    // bind the field's property to the item
    if (property == null) {
      property = field.getPropertyDataSource();
      ((OrderablePropertysetItem) getPropertyDataSource().getValue()).addItemProperty(propertyId, property);
    }
    final Property<?> propertyReference = property;
    // set layout to full width
    layout.setWidth(100, Unit.PERCENTAGE);

    // distribute space in favour of field over delete button
    layout.setExpandRatio(field, 1);
    if (definition.isReadOnly()) {
      return layout;
    }

    Button upButton = new Button();
    upButton.setHtmlContentAllowed(true);
    upButton.setCaption("<span class=\"icon-up\"></span>");
    upButton.addStyleName("inline");
    upButton.addClickListener(event -> {
      int index = root.getComponentIndex(layout);
      if (index == 0) return;
      root.removeComponent(layout);
      root.addComponent(layout, index - 1);

      getValue().movePropertyId(propertyId, index - 1);
      getPropertyDataSource().setValue(getValue());
      upButton.focus();
    });

    Button downButton = new Button();
    downButton.setHtmlContentAllowed(true);
    downButton.setCaption("<span class=\"icon-down\"></span>");
    downButton.addStyleName("inline");
    downButton.addClickListener(event -> {
      int index = root.getComponentIndex(layout);
      if (index == getValue().getItemPropertyIds().size() - 1) return;
      root.removeComponent(layout);
      root.addComponent(layout, index + 1);

      getValue().movePropertyId(propertyId, index + 1);
      getPropertyDataSource().setValue(getValue());
      downButton.focus();
    });

    // Delete Button
    Button deleteButton = new Button();
    deleteButton.setHtmlContentAllowed(true);
    deleteButton.setCaption("<span class=\"" + "icon-trash" + "\"></span>");
    deleteButton.addStyleName("inline");
    deleteButton.setDescription(buttonCaptionRemove);
    deleteButton.addClickListener(new ClickListener() {

      @Override
      public void buttonClick(ClickEvent event) {
        Component layout = event.getComponent().getParent();
        root.removeComponent(layout);
        Transformer<?> transformer = ((TransformedProperty<?>) getPropertyDataSource()).getTransformer();

        // get propertyId to delete, this might have changed since initialization above (see #removeValueProperty)
        Object propertyId = findPropertyId(getValue(), propertyReference);

        if (transformer instanceof MultiTransformer) {
          ((MultiTransformer) transformer).removeProperty(propertyId);
        } else {
          if (propertyId != null && propertyId.getClass().isAssignableFrom(Integer.class)) {
            removeValueProperty((Integer) propertyId);
          } else {
            log.error("Property id {} is not an integer and as such property can't be removed", propertyId);
          }
          getPropertyDataSource().setValue(getValue());
        }
      }
    });

    layout.addComponent(upButton);
    layout.addComponent(downButton);
    layout.addComponent(deleteButton);
    layout.setExpandRatio(deleteButton, 0);

    // make sure button stays aligned with the field and not with the optional field label when used
    layout.setComponentAlignment(deleteButton, Alignment.BOTTOM_RIGHT);

    return layout;
  }

  @Override
  public Class<? extends OrderablePropertysetItem> getType() {
    return OrderablePropertysetItem.class;
  }

  /**
   * Caption section.
   */
  public void setButtonCaptionAdd(String buttonCaptionAdd) {
    this.buttonCaptionAdd = buttonCaptionAdd;
  }

  public void setButtonCaptionRemove(String buttonCaptionRemove) {
    this.buttonCaptionRemove = buttonCaptionRemove;
  }

  /**
   * Ensure that id of the {@link PropertysetItem} stay coherent.<br>
   * Assume that we have 3 values 0:a, 1:b, 2:c, and 1 is removed <br>
   * If we just remove 1, the {@link PropertysetItem} will contain 0:a, 2:c, .<br>
   * But we should have : 0:a, 1:c, .
   */
  private void removeValueProperty(int fromIndex) {
    getValue().removeItemProperty(fromIndex);
    int toIndex = fromIndex;
    int valuesSize = getValue().getItemPropertyIds().size();
    if (fromIndex == valuesSize) {
      return;
    }
    while (fromIndex < valuesSize) {
      toIndex = fromIndex;
      fromIndex +=1;
      getValue().addItemProperty(toIndex, getValue().getItemProperty(fromIndex));
      getValue().removeItemProperty(fromIndex);
    }
  }
}
