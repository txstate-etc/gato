package edu.txstate.its.gato.vaadin.shared;

import com.vaadin.shared.communication.ServerRpc;

public interface ValueChangeServerRpc extends ServerRpc {
  public void change(String value);
}
