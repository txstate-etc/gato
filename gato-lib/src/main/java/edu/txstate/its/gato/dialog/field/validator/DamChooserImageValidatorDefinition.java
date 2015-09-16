package edu.txstate.its.gato.dialog.field.validator;

import info.magnolia.ui.form.validator.definition.ConfiguredFieldValidatorDefinition;

public class DamChooserImageValidatorDefinition extends ConfiguredFieldValidatorDefinition {

  public DamChooserImageValidatorDefinition() {
    setFactoryClass(DamChooserImageValidatorFactory.class);
  }

}
