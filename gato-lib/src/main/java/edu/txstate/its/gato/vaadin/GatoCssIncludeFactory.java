package edu.txstate.its.gato.vaadin;

import com.vaadin.data.Item;
import com.vaadin.data.util.PropertysetItem;
import com.vaadin.ui.Field;

import javax.inject.Inject;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.factory.CompositeFieldFactory;

public class GatoCssIncludeFactory<D extends GatoCssIncludeDefinition> extends CompositeFieldFactory<GatoCssIncludeDefinition> {

  private FieldFactoryFactory fieldFactoryFactory;
  private ComponentProvider componentProvider;
  private final I18NAuthoringSupport i18nAuthoringSupport;

  @Inject
  public GatoCssIncludeFactory(D definition, Item relatedFieldItem, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, I18NAuthoringSupport i18nAuthoringSupport) {
    super(definition, relatedFieldItem, fieldFactoryFactory, componentProvider, i18nAuthoringSupport);
    this.fieldFactoryFactory = fieldFactoryFactory;
    this.componentProvider = componentProvider;
    this.i18nAuthoringSupport = i18nAuthoringSupport;
  }

  @Override
  protected Field<PropertysetItem> createFieldComponent() {
      GatoCssInclude field = new GatoCssInclude(definition, fieldFactoryFactory, componentProvider, item, i18nAuthoringSupport);
      return field;
  }
}
