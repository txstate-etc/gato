/**
 * This file Copyright (c) 2013-2017 Magnolia International
 * Ltd.  (http://www.magnolia-cms.com). All rights reserved.
 *
 *
 * This file is dual-licensed under both the Magnolia
 * Network Agreement and the GNU General Public License.
 * You may elect to use one or the other of these licenses.
 *
 * This file is distributed in the hope that it will be
 * useful, but AS-IS and WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE, TITLE, or NONINFRINGEMENT.
 * Redistribution, except as permitted by whichever of the GPL
 * or MNA you select, is prohibited.
 *
 * 1. For the GPL license (GPL), you can redistribute and/or
 * modify this file under the terms of the GNU General
 * Public License, Version 3, as published by the Free Software
 * Foundation.  You should have received a copy of the GNU
 * General Public License, Version 3 along with this program;
 * if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * 2. For the Magnolia Network Agreement (MNA), this file
 * and the accompanying materials are made available under the
 * terms of the MNA which accompanies this distribution, and
 * is available at http://www.magnolia-cms.com/mna.html
 *
 * Any modifications to this file must keep this entire header
 * intact.
 *
 */
package edu.txstate.its.gato.vaadin;

import info.magnolia.cms.i18n.I18nContentSupport;
import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.transformer.TransformedProperty;
import info.magnolia.ui.form.field.transformer.Transformer;
import info.magnolia.ui.form.field.transformer.multi.MultiTransformer;

import info.magnolia.ui.form.field.MultiField;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicates;
import com.google.common.collect.Iterators;
import com.vaadin.data.Item;
import com.vaadin.data.Property;
import com.vaadin.data.util.PropertysetItem;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.Button.ClickListener;
import com.vaadin.ui.Component;
import com.vaadin.ui.Field;
import com.vaadin.ui.HasComponents;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.NativeButton;
import com.vaadin.ui.VerticalLayout;

/**
 * The is a version of magnolia's multi field that starts with one empty field visible to be more user friendly. (Ticket #7865)
 * Most of this code comes from info.magnolia.ui.form.field.MultiField.
 */

public class GatoMultiField extends MultiField {

    private static final Logger log = LoggerFactory.getLogger(GatoMultiField.class);

    private final ConfiguredFieldDefinition fieldDefinition;

    private final Button addButton = new NativeButton();
    private String buttonCaptionAdd;
    private String buttonCaptionRemove;
    private String buttonCaptionMoveUp = "Move Up";
    private String buttonCaptionMoveDown = "Move Down";
    private boolean isOrderable = true;
    private int maxFields;

    public GatoMultiField(MultiValueFieldDefinition definition, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, Item relatedFieldItem, I18NAuthoringSupport i18nAuthoringSupport) {
        super(definition, fieldFactoryFactory, componentProvider, relatedFieldItem, i18nAuthoringSupport);
        this.fieldDefinition = definition.getField();
        // Only propagate read only if the parent definition is read only
        if (definition.isReadOnly()) {
            fieldDefinition.setReadOnly(true);
        }
    }

    @Override
    protected Component initContent() {
        // Init root layout
        addStyleName("linkfield");
        root = new VerticalLayout();
        root.setSpacing(true);
        root.setWidth(100, Unit.PERCENTAGE);
        root.setHeight(-1, Unit.PIXELS);

        // Init addButton
        addButton.setCaption(buttonCaptionAdd);
        addButton.addStyleName("magnoliabutton");
        addButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(ClickEvent event) {
                if (maxFields > 0 && root.getComponentCount() == maxFields) {
                  addButton.setEnabled(false);
                }
                root.addComponent(createNewOption(), root.getComponentCount() - 1);
            }
        });

        // Initialize Existing field
        initFields();

        int componentCount = root.getComponentCount();
        //The add button is a component
        if (componentCount == 1) {
            root.addComponent(createNewOption(), root.getComponentCount() - 1);
        }

        if (maxFields > 0 && root.getComponentCount() == maxFields + 1) {
          addButton.setEnabled(false);
        }

        return root;
    }

    private Component createNewOption() {
        int newPropertyId;
        Property<?> property = null;

        Transformer<?> transformer = ((TransformedProperty<?>) getPropertyDataSource()).getTransformer();
        PropertysetItem item = (PropertysetItem) getPropertyDataSource().getValue();

        if (transformer instanceof MultiTransformer) {
            // create property and find its propertyId
            property = ((MultiTransformer) transformer).createProperty();
            newPropertyId = findPropertyId(item, property);
        } else {
            // get next propertyId based on property count
            newPropertyId = item.getItemPropertyIds().size();
        }

        if (newPropertyId == -1) {
            log.warn("Could not resolve new propertyId; cannot add new multifield entry to item '{}'.", item);
            return null;
        }

        return createEntryComponent(newPropertyId, property);
    }

    /**
     * Initialize the MultiField. <br>
     * Create as many configured Field as we have related values already stored.
     */
    @Override
    protected void initFields(PropertysetItem newValue) {
        root.removeAllComponents();
        for (Object propertyId : newValue.getItemPropertyIds()) {
            Property<?> property = newValue.getItemProperty(propertyId);
            root.addComponent(createEntryComponent(propertyId, property));
        }
        if (!this.definition.isReadOnly()) {
            root.addComponent(addButton);
        }
    }

    /**
     * Create a single element.<br>
     * This single element is composed of:<br>
     * - a configured field <br>
     * - a remove Button<br>
     */
    private Component createEntryComponent(Object propertyId, Property<?> property) {
        final HorizontalLayout layout = new HorizontalLayout();
        layout.setWidth(100, Unit.PERCENTAGE);
        layout.setHeight(-1, Unit.PIXELS);

        final Field<?> field = createLocalField(fieldDefinition, property, true); // creates property datasource if given property is null
        layout.addComponent(field);

        // bind the field's property to the item
        if (property == null) {
            property = field.getPropertyDataSource();
            ((PropertysetItem) getPropertyDataSource().getValue()).addItemProperty(propertyId, property);
        }
        final Property<?> propertyReference = property;
        // set layout to full width
        layout.setWidth(100, Unit.PERCENTAGE);

        // distribute space in favour of field over delete button
        layout.setExpandRatio(field, 1);
        if (definition.isReadOnly()) {
            return layout;
        }

        if (isOrderable()) {
            // move up Button
            final Button moveUpButton = new Button();
            moveUpButton.setHtmlContentAllowed(true);
            moveUpButton.setCaption("<span class=\"" + "icon-arrow2_n" + "\"></span>");
            moveUpButton.addStyleName("inline");
            moveUpButton.setDescription(buttonCaptionMoveUp);
            moveUpButton.addClickListener(new Button.ClickListener() {

                @Override
                public void buttonClick(Button.ClickEvent event) {
                    onMove(layout, propertyReference, true);
                    moveUpButton.focus();
                }
            });

            // move down Button
            final Button moveDownButton = new Button();
            moveDownButton.setHtmlContentAllowed(true);
            moveDownButton.setCaption("<span class=\"" + "icon-arrow2_s" + "\"></span>");
            moveDownButton.addStyleName("inline");
            moveDownButton.setDescription(buttonCaptionMoveDown);
            moveDownButton.addClickListener(new Button.ClickListener() {

                @Override
                public void buttonClick(Button.ClickEvent event) {
                    onMove(layout, propertyReference, false);
                    moveDownButton.focus();
                }
            });
            layout.addComponents(moveUpButton, moveDownButton);
            // make sure button stays aligned with the field and not with the optional field label when used
            layout.setComponentAlignment(moveUpButton, Alignment.BOTTOM_RIGHT);
            layout.setComponentAlignment(moveDownButton, Alignment.BOTTOM_RIGHT);
        }

        // Delete Button
        Button deleteButton = new Button();
        deleteButton.setHtmlContentAllowed(true);
        deleteButton.setCaption("<span class=\"" + "icon-trash" + "\"></span>");
        deleteButton.addStyleName("inline");
        deleteButton.setDescription(buttonCaptionRemove);
        deleteButton.addClickListener(new ClickListener() {

            @Override
            public void buttonClick(ClickEvent event) {
                onDelete(layout, propertyReference);
                if (maxFields > 0 && root.getComponentCount() < maxFields + 1) {
                  addButton.setEnabled(true);
                }
            }
        });
        layout.addComponents(deleteButton);
        layout.setComponentAlignment(deleteButton, Alignment.BOTTOM_RIGHT);

        return layout;
    }

    /**
     * Caption section.
     */
    public void setButtonCaptionAdd(String buttonCaptionAdd) {
        this.buttonCaptionAdd = buttonCaptionAdd;
    }

    public void setButtonCaptionRemove(String buttonCaptionRemove) {
        this.buttonCaptionRemove = buttonCaptionRemove;
    }

    /**
    * Maximum number of fields that can be added
    */
    public void setMaxFields(int maxFields) {
      this.maxFields = maxFields;
    }
    /**
     * Ensure that id of the {@link PropertysetItem} stay coherent.<br>
     * Assume that we have 3 values 0:a, 1:b, 2:c, and 1 is removed <br>
     * If we just remove 1, the {@link PropertysetItem} will contain 0:a, 2:c, .<br>
     * But we should have : 0:a, 1:c, .
     */
    private void removeValueProperty(int fromIndex) {
        getValue().removeItemProperty(fromIndex);
        int valuesSize = getValue().getItemPropertyIds().size();
        if (fromIndex == valuesSize) {
            return;
        }
        while (fromIndex < valuesSize) {
            int toIndex = fromIndex;
            fromIndex +=1;
            getValue().addItemProperty(toIndex, getValue().getItemProperty(fromIndex));
            getValue().removeItemProperty(fromIndex);
        }
    }

    /**
     * Switches two properties. We have to clone the original {@link PropertysetItem} to re-arrange the ordering.
     */
    private void switchItemProperties(Object firstPropertyId, Object secondPropertyId) {
        Property propertyFirst = getValue().getItemProperty(firstPropertyId);
        Property propertySecond = getValue().getItemProperty(secondPropertyId);

        try {
            PropertysetItem storedValues = (PropertysetItem) getValue().clone();
            if (storedValues != null) {
                for (Object propertyId : storedValues.getItemPropertyIds()) {
                    getValue().removeItemProperty(propertyId);
                    if (propertyId == firstPropertyId) {
                        getValue().addItemProperty(firstPropertyId, propertySecond);
                    } else if (propertyId == secondPropertyId) {
                        getValue().addItemProperty(secondPropertyId, propertyFirst);
                    } else {
                        getValue().addItemProperty(propertyId, storedValues.getItemProperty(propertyId));
                    }
                }
                getPropertyDataSource().setValue(getValue());
            }
        } catch (CloneNotSupportedException e) {
            log.error("Unable to switch properties on MultiField. Unable to clone PropertysetItem.", e);
        }

    }

    private void onDelete(Component layout, Property<?> propertyReference) {
        root.removeComponent(layout);
        Transformer<?> transformer = ((TransformedProperty<?>) getPropertyDataSource()).getTransformer();

        // get propertyId to delete, this might have changed since initialization above (see #removeValueProperty)
        Object propertyId = findPropertyId(getValue(), propertyReference);

        if (transformer instanceof MultiTransformer) {
            ((MultiTransformer) transformer).removeProperty(propertyId);
        } else {
            if (propertyId.getClass().isAssignableFrom(Integer.class)) {
                removeValueProperty((Integer) propertyId);
            } else {
                log.error("Property id {} is not an integer and as such property can't be removed", propertyId);
            }
            getPropertyDataSource().setValue(getValue());
        }
    }

    /**
     * Takes care of moving a field up or down. Tries hard not to assume much about the layout, so we're iterating over parents
     * and component types to make sure we're dealing with Fields.
     */
    private void onMove(Component layout, Property<?> propertyReference, boolean moveUp) {
        int currentPosition = root.getComponentIndex(layout);
        int switchPosition = currentPosition + (moveUp ? -1 : 1);

        Field[] fields = Iterators.toArray(Iterators.filter(Iterators.transform(root.iterator(), new Function<Component, Field>() {
            @Override
            public Field apply(Component input) {
                if (input instanceof HasComponents) {
                    Optional<Component> field = Iterators.tryFind(((HasComponents) input).iterator(), Predicates.instanceOf(Field.class));
                    if (field.isPresent()) {
                        return (Field) field.get();
                    }
                }
                return null;
            }
        }), Predicates.notNull()), Field.class);

        if (moveUp && currentPosition != 0 || (!moveUp && currentPosition != fields.length - 1)) {
            Field switchField = fields[switchPosition];
            Object currentPropertyId = GatoMultiField.this.findPropertyId(getValue(), propertyReference);
            Object switchPropertyId = GatoMultiField.this.findPropertyId(getValue(), switchField.getPropertyDataSource());

            root.replaceComponent(root.getComponent(currentPosition), root.getComponent(switchPosition));
            switchItemProperties(currentPropertyId, switchPropertyId);
        }
    }

}
