package edu.txstate.its.gato.componentselect;

import info.magnolia.ui.form.field.definition.SelectFieldDefinition;

//Set sortOptions to false so it won't sort the templates alphabetically
public class GatoTemplateSelectorDefinition extends SelectFieldDefinition {

    public GatoTemplateSelectorDefinition(){
        setSortOptions(false);
    }
}