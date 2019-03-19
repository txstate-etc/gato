package edu.txstate.its.gato;

import com.vaadin.v7.data.Validator;
import info.magnolia.ui.form.validator.factory.AbstractFieldValidatorFactory;

public class WhitespaceValidatorFactory extends AbstractFieldValidatorFactory<WhitespaceValidatorDefinition> {
    public WhitespaceValidatorFactory(WhitespaceValidatorDefinition definition) {
        super(definition);
    }

    @Override
    public Validator createValidator() {
        return new WhitespaceValidator(definition.getErrorMessage());
    }
}