package edu.txstate.its.gato.vaadin.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.ScriptInjector;

public class GatoWidgetSet implements EntryPoint {
  public void onModuleLoad() {
    ScriptInjector.fromUrl("../VAADIN/js/onload.js").setWindow(ScriptInjector.TOP_WINDOW).inject();
  }
}
