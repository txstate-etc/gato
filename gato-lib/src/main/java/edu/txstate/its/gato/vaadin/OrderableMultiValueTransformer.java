package edu.txstate.its.gato.vaadin;

import info.magnolia.objectfactory.Components;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.transformer.basic.BasicTransformer;
import info.magnolia.ui.vaadin.integration.jcr.DefaultProperty;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import javax.inject.Inject;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.Property;

/**
 * MultiValueTransformer for use with OrderableMultiValueField.
 */

public class OrderableMultiValueTransformer extends BasicTransformer<OrderablePropertysetItem> {
    @Inject
    public OrderableMultiValueTransformer(Item relatedFormItem, ConfiguredFieldDefinition definition, Class<OrderablePropertysetItem> type, I18NAuthoringSupport i18NAuthoringSupport) {
        super(relatedFormItem, definition, type, i18NAuthoringSupport);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public void writeToItem(OrderablePropertysetItem newValue) {
        Property<List> property = getOrCreateProperty(List.class);

        List<Object> propertyValue = null;
        if (newValue != null && !newValue.getItemPropertyIds().isEmpty()) {
            propertyValue = new LinkedList<Object>();
            Iterator<?> it = newValue.getItemPropertyIds().iterator();
            while (it.hasNext()) {
                propertyValue.add(newValue.getItemProperty(it.next()).getValue());
            }
        }
        property.setValue(propertyValue);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public OrderablePropertysetItem readFromItem() {
        OrderablePropertysetItem newValues = new OrderablePropertysetItem();
        Property<List> property = getOrCreateProperty(List.class);
        if (property.getValue() != null) {
            List<?> values = property.getValue();
            int position = 0;
            for (Object o : values) {
                newValues.addItemProperty(position, new DefaultProperty(o));
                position += 1;
            }
        }

        return newValues;
    }

}
