package edu.txstate.its.gato.vaadin;

import com.vaadin.data.Item;
import com.vaadin.ui.Field;

import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;

public class GatoJsIncludeFactory<D extends FieldDefinition> extends AbstractFieldFactory<GatoJsIncludeDefinition, Object> {

    public GatoJsIncludeFactory(GatoJsIncludeDefinition definition, Item relatedFieldItem) {
        super(definition, relatedFieldItem);
    }

    @Override
    protected Field<Object> createFieldComponent() {
        GatoJsInclude field = new GatoJsInclude(definition, item);
        return field;
    }
}
