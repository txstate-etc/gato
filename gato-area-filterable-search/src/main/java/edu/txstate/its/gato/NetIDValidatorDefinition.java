package edu.txstate.its.gato;

import info.magnolia.ui.form.validator.definition.ConfiguredFieldValidatorDefinition;

public class NetIDValidatorDefinition extends ConfiguredFieldValidatorDefinition {
  
  public NetIDValidatorDefinition() {
    setFactoryClass(NetIDValidatorFactory.class);
  }
}