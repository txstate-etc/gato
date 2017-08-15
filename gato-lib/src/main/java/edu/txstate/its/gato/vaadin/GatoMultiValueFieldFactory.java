package edu.txstate.its.gato.vaadin;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import info.magnolia.ui.form.field.transformer.multi.DelegatingMultiValueFieldTransformer;
import com.vaadin.data.util.PropertysetItem;

import javax.inject.Inject;

import com.vaadin.data.Item;
import com.vaadin.ui.Field;

public class GatoMultiValueFieldFactory extends AbstractFieldFactory<MultiValueFieldDefinition, PropertysetItem> {

  private FieldFactoryFactory fieldFactoryFactory;
  private ComponentProvider componentProvider;
  private I18NAuthoringSupport i18nAuthoringSupport;

  @Inject
  public GatoMultiValueFieldFactory(MultiValueFieldDefinition definition, Item relatedFieldItem, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, I18NAuthoringSupport i18nAuthoringSupport) {
    super(definition, relatedFieldItem);
    this.fieldFactoryFactory = fieldFactoryFactory;
    this.componentProvider = componentProvider;
    this.i18nAuthoringSupport = i18nAuthoringSupport;
  }
  
  @Override
  protected Field<PropertysetItem> createFieldComponent() {
    // FIXME change i18n setting : MGNLUI-1548
    definition.setI18nBasename(getMessages().getBasename());

    GatoMultiField field = new GatoMultiField(definition, fieldFactoryFactory, componentProvider, item, i18nAuthoringSupport);
    // Set Caption
    field.setButtonCaptionAdd(getMessage(definition.getButtonSelectAddLabel()));
    field.setButtonCaptionRemove(getMessage(definition.getButtonSelectRemoveLabel()));
    boolean isUnOrderable = DelegatingMultiValueFieldTransformer.class.isAssignableFrom(definition.getTransformerClass());
    field.setOrderable(!isUnOrderable);

    return field;
  }

}
