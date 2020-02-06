package edu.txstate.its.gato;

import info.magnolia.ui.form.validator.factory.AbstractFieldValidatorFactory;
import javax.inject.Inject;
import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.Validator;

public class NetIDValidatorFactory extends AbstractFieldValidatorFactory<NetIDValidatorDefinition> {

  private Item item;
  private GatoUtils gf;
  @Inject
  public NetIDValidatorFactory(NetIDValidatorDefinition definition, GatoUtils gf) {
    super(definition);
    this.item = item;
    this.gf = gf;
  }

  @Override
  public Validator createValidator() {
    return new NetIDValidator(item, getI18nErrorMessage(), gf);
  }
}