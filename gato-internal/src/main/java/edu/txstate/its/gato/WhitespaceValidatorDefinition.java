package edu.txstate.its.gato;

import info.magnolia.ui.form.validator.definition.ConfiguredFieldValidatorDefinition;

public class WhitespaceValidatorDefinition extends ConfiguredFieldValidatorDefinition {
    
    public WhitespaceValidatorDefinition() {
        setFactoryClass(WhitespaceValidatorFactory.class);
    }
}