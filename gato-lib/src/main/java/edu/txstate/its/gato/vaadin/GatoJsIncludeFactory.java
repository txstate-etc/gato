package edu.txstate.its.gato.vaadin;

import com.vaadin.data.Item;
import com.vaadin.data.util.PropertysetItem;
import com.vaadin.ui.Field;

import javax.inject.Inject;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.factory.CompositeFieldFactory;

public class GatoJsIncludeFactory<D extends GatoJsIncludeDefinition> extends CompositeFieldFactory<GatoJsIncludeDefinition> {

  private FieldFactoryFactory fieldFactoryFactory;
  private ComponentProvider componentProvider;
  private final I18NAuthoringSupport i18nAuthoringSupport;

  @Inject
  public GatoJsIncludeFactory(D definition, Item relatedFieldItem, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, I18NAuthoringSupport i18nAuthoringSupport) {
    super(definition, relatedFieldItem, fieldFactoryFactory, componentProvider, i18nAuthoringSupport);
    this.fieldFactoryFactory = fieldFactoryFactory;
    this.componentProvider = componentProvider;
    this.i18nAuthoringSupport = i18nAuthoringSupport;
  }

  @Override
  protected Field<PropertysetItem> createFieldComponent() {
      GatoJsInclude field = new GatoJsInclude(definition, fieldFactoryFactory, componentProvider, item, i18nAuthoringSupport);
      return field;
  }
}
