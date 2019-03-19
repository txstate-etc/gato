package edu.txstate.its.gato;

import info.magnolia.ui.form.validator.definition.ConfiguredFieldValidatorDefinition;
/*
Currently unused, but a good example of what a custom dialog validator looks like. 
An example usage of the validator in a dialog looks like this: 
          validators:
            - name: whitespace
              class: edu.txstate.its.gato.WhitespaceValidatorDefinition
              errorMessage: This field is required
              factoryClass: edu.txstate.its.gato.WhitespaceValidatorFactory         
            
*/
public class WhitespaceValidatorDefinition extends ConfiguredFieldValidatorDefinition {
    
    public WhitespaceValidatorDefinition() {
        setFactoryClass(WhitespaceValidatorFactory.class);
    }
}