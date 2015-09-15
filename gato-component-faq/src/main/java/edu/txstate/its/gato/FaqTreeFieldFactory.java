package edu.txstate.its.gato;

import com.vaadin.data.Item;
import com.vaadin.ui.Field;
import com.vaadin.ui.Tree;
import com.vaadin.ui.Label;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.jcr.Node;
import java.util.LinkedList;
import java.util.Queue;

public class FaqTreeFieldFactory<D extends FieldDefinition> extends AbstractFieldFactory<FaqTreeFieldDefinition, Object> {

    public FaqTreeFieldFactory(FaqTreeFieldDefinition definition, Item relatedFieldItem) {
        super(definition, relatedFieldItem);
    }

    @Override
    protected Field<Object> createFieldComponent() {
        boolean isNew = ((JcrNodeAdapter)item).isNew();
        Node node = ((JcrNodeAdapter)item).getJcrItem();
        FaqTreeField field = new FaqTreeField(node, isNew);
        return field;
    }

}
