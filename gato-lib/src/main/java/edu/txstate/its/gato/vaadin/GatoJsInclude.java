package edu.txstate.its.gato.vaadin;

import com.vaadin.data.Item;
import com.vaadin.server.ClientConnector.AttachEvent;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.Component;
import com.vaadin.ui.CustomField;
import com.vaadin.ui.Label;

import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.jcr.Node;

/**
 * Custom Vaadin field for loading a javascript file that creates the UI for a field.
 * @see GatoJsIncludeDefinition for configuration options. 
 */
public class GatoJsInclude extends CustomField<Object> {

    private GatoJsIncludeDefinition definition;
    private Item fieldItem;

    public GatoJsInclude(GatoJsIncludeDefinition def, Item item) {
        definition = def;
        fieldItem = item;
    }

    @Override
    protected Component initContent() {

        Node node = null;
        if (fieldItem instanceof JcrNodeAdapter) {
            node = ((JcrNodeAdapter)fieldItem).getJcrItem();
        }
        GatoJsComponent component = new GatoJsComponent(definition, node);
        return component;
    }

    @Override
    public Class<? extends Object> getType() {
        return Object.class;
    }
}
