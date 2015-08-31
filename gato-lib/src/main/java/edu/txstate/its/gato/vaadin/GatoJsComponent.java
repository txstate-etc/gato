package edu.txstate.its.gato.vaadin;

import com.vaadin.annotations.JavaScript;
import com.vaadin.ui.AbstractJavaScriptComponent;

import javax.jcr.Node;

@JavaScript({"vaadin://js/gato-js-include.js"})
public class GatoJsComponent extends AbstractJavaScriptComponent {
    public GatoJsComponent(GatoJsIncludeDefinition def, Node node) {
        getState().definition = def;
        getState().node = node;
    }

    @Override
    protected GatoJsState getState() {
        return (GatoJsState) super.getState();
    }


}
