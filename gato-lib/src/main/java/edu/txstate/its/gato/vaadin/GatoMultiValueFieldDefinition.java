package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;

public class GatoMultiValueFieldDefinition extends MultiValueFieldDefinition {
  private int maxFields;

  public int getMaxFields() {
    return this.maxFields;
  }

  public void setMaxFields(int maxFields) {
    this.maxFields = maxFields;
  }
}
