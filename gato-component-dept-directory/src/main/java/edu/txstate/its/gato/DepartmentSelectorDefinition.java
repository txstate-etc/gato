package edu.txstate.its.gato;

import info.magnolia.ui.form.field.definition.SelectFieldDefinition;

/**
 * DepartmentSelectorDefinition.
 */
public class DepartmentSelectorDefinition extends SelectFieldDefinition {

    public DepartmentSelectorDefinition() {
        //filteringMode = 2 means that the user can type something in the
        //select box and it will show options that start with the the text
        //the user typed.  Might want to change it to 1 (contains)
        setFilteringMode(2);
    }
}