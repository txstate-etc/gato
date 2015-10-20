package edu.txstate.its.gato.vaadin;

import com.vaadin.shared.ui.JavaScriptComponentState;
import javax.jcr.Node;

public class GatoJsState extends JavaScriptComponentState {
    public GatoJsIncludeDefinition definition;
    public String initFunction;
    public String nodePath;
    public String pageTemplate;
}
