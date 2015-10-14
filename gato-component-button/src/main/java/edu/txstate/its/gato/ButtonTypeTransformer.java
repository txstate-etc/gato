package edu.txstate.its.gato;

import info.magnolia.ui.form.field.transformer.composite.SwitchableTransformer;
import info.magnolia.ui.form.field.transformer.composite.CompositeTransformer;
import info.magnolia.ui.form.field.transformer.basic.BasicTransformer;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.vaadin.data.Item;
import com.vaadin.data.util.PropertysetItem;

//Store the button color as "color"
public class ButtonTypeTransformer extends BasicTransformer{

    public ButtonTypeTransformer(Item relatedFormItem, ConfiguredFieldDefinition definition, Class<PropertysetItem> type) {
        super(relatedFormItem, definition, type);
        this.basePropertyName = "color";
    }
}