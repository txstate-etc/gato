package edu.txstate.its.gato.vaadin.server;

import edu.txstate.its.gato.vaadin.shared.HiddenFieldState;
import edu.txstate.its.gato.vaadin.shared.ValueChangeServerRpc;

import com.vaadin.ui.AbstractField;

public class HiddenField extends AbstractField<String> {

  private ValueChangeServerRpc changeRpc = v -> setValue(v, true);

  public HiddenField() {
    registerRpc(changeRpc);
  }

  @Override
  public String getCaption() {
    return null;
  }

  @Override
  public void setCaption(String caption) {}

  @Override
  protected HiddenFieldState getState() {
    return (HiddenFieldState) super.getState();
  }

  @Override
  protected HiddenFieldState getState(boolean markAsDirty) {
    return (HiddenFieldState) super.getState(markAsDirty);
  }

  @Override
  public void beforeClientResponse(boolean initial) {
    super.beforeClientResponse(initial);
    getState().value = getValue() == null ? "" : getValue();
  }

  public Class<String> getType() {
    return String.class;
  }
}
