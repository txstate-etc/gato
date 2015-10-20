package edu.txstate.its.gato.vaadin;

import com.vaadin.data.Item;
import com.vaadin.ui.Component;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.CompositeField;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.jcr.Node;

/**
 * Custom Vaadin field for loading a javascript file that creates the UI for a field.
 * @see GatoJsIncludeDefinition for configuration options. 
 */
public class GatoJsInclude extends CompositeField {

    public GatoJsInclude(GatoJsIncludeDefinition definition, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, Item relatedFieldItem, I18NAuthoringSupport i18nAuthoringSupport) {
        super(definition, fieldFactoryFactory, componentProvider, relatedFieldItem, i18nAuthoringSupport);
    }

    @Override
    protected Component initContent() {
        super.initContent();
        Node node = null;
        if (relatedFieldItem instanceof JcrNodeAdapter) {
            node = ((JcrNodeAdapter)relatedFieldItem).getJcrItem();
        }

        GatoJsIncludeDefinition serializableDef = new GatoJsIncludeDefinition((GatoJsIncludeDefinition)definition);
        GatoJsComponent component = new GatoJsComponent(serializableDef, node);

        root.addComponent(component);
        return root;
    }
}
