package edu.txstate.its.gato.dialog.field.validator;

import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.ui.form.validator.factory.AbstractFieldValidatorFactory;

import com.vaadin.data.Validator;

public class DamChooserImageValidatorFactory extends AbstractFieldValidatorFactory<DamChooserImageValidatorDefinition> {

  protected final DamTemplatingFunctions damTemplatingFunctions;

  public DamChooserImageValidatorFactory(DamChooserImageValidatorDefinition definition, DamTemplatingFunctions damTemplatingFunctions) {
    super(definition);
  
    this.damTemplatingFunctions = damTemplatingFunctions;
  }

  @Override
  public Validator createValidator() {
    return new DamChooserImageValidator(getI18nErrorMessage(), damTemplatingFunctions);
  }
}
