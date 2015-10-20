package edu.txstate.its.gato.vaadin.client;

import edu.txstate.its.gato.vaadin.server.HiddenField;
import edu.txstate.its.gato.vaadin.shared.HiddenFieldState;
import edu.txstate.its.gato.vaadin.shared.ValueChangeServerRpc;

import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.Hidden;

import com.vaadin.client.communication.StateChangeEvent;
import com.vaadin.client.ui.AbstractFieldConnector;
import com.vaadin.shared.ui.Connect;
import com.vaadin.shared.ui.Connect.LoadStyle;

@Connect(value = HiddenField.class, loadStyle = LoadStyle.EAGER)
public class HiddenFieldConnector extends AbstractFieldConnector {

  public HiddenFieldConnector() {
    addChangeHandler(getWidget().getElement());
  }

  @Override
  public HiddenFieldState getState() {
    return (HiddenFieldState) super.getState();
  }

  @Override
  public void onStateChanged(StateChangeEvent stateChageEvent) {
    super.onStateChanged(stateChageEvent);
    getWidget().setValue(getState().value);
  }

  @Override
  public Hidden getWidget() {
    return (Hidden) super.getWidget();
  }

  public native void addChangeHandler(Element el) /*-{
    var that = this;
    el.onchange = $entry(function() {
      that.@edu.txstate.its.gato.vaadin.client.HiddenFieldConnector::onChange()();
    });
  }-*/;

  public void onChange() {
    ValueChangeServerRpc changeRpc = getRpcProxy(ValueChangeServerRpc.class);
    changeRpc.change(getWidget().getValue());
  }
}
