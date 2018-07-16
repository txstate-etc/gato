package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;

public class GatoMultiValueFieldDefinition extends MultiValueFieldDefinition {
  private int maxFields;
  private int minFields;

  public int getMaxFields() {
    return this.maxFields;
  }

  public void setMaxFields(int maxFields) {
    this.maxFields = maxFields;
  }

  public int getMinFields() {
    return this.minFields;
  }

  public void setMinFields(int minFields) {
    this.minFields = minFields;
  }
}
