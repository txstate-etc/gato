package edu.txstate.its.gato;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.validator.AbstractStringValidator;
import com.vaadin.data.validator.AbstractValidator;
import org.apache.commons.lang3.StringUtils;


public class WhitespaceValidator extends AbstractStringValidator {

    public WhitespaceValidator(String errorMessage) {
        super(errorMessage);
    }

    @Override
    protected boolean isValidValue(String value) {
        return value != null && !StringUtils.isBlank(value);
    }
}