package edu.txstate.its.gato.vaadin;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import info.magnolia.ui.form.field.transformer.Transformer;

import javax.inject.Inject;

import com.vaadin.v7.data.Item;
//import com.vaadin.v7.data.util.PropertysetItem;
import com.vaadin.v7.ui.Field;

public class OrderableMultiFieldFactory extends AbstractFieldFactory<OrderableMultiFieldDefinition, OrderablePropertysetItem> {

  private FieldFactoryFactory fieldFactoryFactory;
  private ComponentProvider componentProvider;
  private I18NAuthoringSupport i18nAuthoringSupport;

  @Inject
  public OrderableMultiFieldFactory(OrderableMultiFieldDefinition definition, Item relatedFieldItem, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, I18NAuthoringSupport i18nAuthoringSupport) {
    super(definition, relatedFieldItem);
    this.fieldFactoryFactory = fieldFactoryFactory;
    this.componentProvider = componentProvider;
    this.i18nAuthoringSupport = i18nAuthoringSupport;
  }
  
  @Override
  protected Field<OrderablePropertysetItem> createFieldComponent() {
    // FIXME change i18n setting : MGNLUI-1548
    definition.setI18nBasename(getMessages().getBasename());

    OrderableMultiField field = new OrderableMultiField(definition, fieldFactoryFactory, componentProvider, item, i18nAuthoringSupport);
    // Set Caption
    field.setButtonCaptionAdd(getMessage(definition.getButtonSelectAddLabel()));
    field.setButtonCaptionRemove(getMessage(definition.getButtonSelectRemoveLabel()));

    return field;
  }

  /**
   * Create a new Instance of {@link Transformer}.
   */
  @Override
  protected Transformer<?> initializeTransformer(Class<? extends Transformer<?>> transformerClass) {
    Transformer<?> transformer = this.componentProvider.newInstance(transformerClass, item, definition, OrderablePropertysetItem.class);
    transformer.setLocale(getLocale());
    return transformer;
  }
}
