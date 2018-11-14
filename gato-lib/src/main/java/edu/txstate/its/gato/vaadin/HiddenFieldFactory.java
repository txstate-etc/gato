package edu.txstate.its.gato.vaadin;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.ui.Field;

import edu.txstate.its.gato.vaadin.server.HiddenField;

import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;

public class HiddenFieldFactory<D extends FieldDefinition> extends AbstractFieldFactory<HiddenFieldDefinition, String> {

    public HiddenFieldFactory(HiddenFieldDefinition definition, Item relatedFieldItem) {
        super(definition, relatedFieldItem);
    }

    @Override
    protected Field<String> createFieldComponent() {
        HiddenField field = new HiddenField();
        return field;
    }
}
