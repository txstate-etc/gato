package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.transformer.multi.MultiValueTransformer;

/**
 * Definition used to configure a generic multi field.
 */
public class OrderableMultiFieldDefinition extends ConfiguredFieldDefinition {

  private String buttonSelectAddLabel = "buttons.add";
  private String buttonSelectRemoveLabel = "buttons.delete";
  private ConfiguredFieldDefinition field;

  /**
   * Set default {@link info.magnolia.ui.form.field.transformer.Transformer}.
   */
  public OrderableMultiFieldDefinition() {
    setTransformerClass(OrderableMultiValueTransformer.class);
  }

  /**
   * @return i18n property used to configure the Add Button Label.
   */
  public String getButtonSelectAddLabel() {
    return buttonSelectAddLabel;
  }

  /**
   * @return i18n property used to configure the Remove Button Label.
   */
  public String getButtonSelectRemoveLabel() {
    return buttonSelectRemoveLabel;
  }

  /**
   * @return Generic field that may be used and display as multi field.
   */
  public ConfiguredFieldDefinition getField() {
    return field;
  }

  public void setButtonSelectAddLabel(String buttonSelectAddLabel) {
    this.buttonSelectAddLabel = buttonSelectAddLabel;
  }

  public void setButtonSelectRemoveLabel(String buttonSelectRemoveLabel) {
    this.buttonSelectRemoveLabel = buttonSelectRemoveLabel;
  }

  public void setField(ConfiguredFieldDefinition field) {
    this.field = field;
  }

}
