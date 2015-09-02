package edu.txstate.its.gato.vaadin;

import com.vaadin.annotations.JavaScript;
import com.vaadin.ui.AbstractJavaScriptComponent;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@JavaScript({"vaadin://js/gato-js-include.js"})
public class GatoJsComponent extends AbstractJavaScriptComponent {
    public GatoJsComponent(GatoJsIncludeDefinition def, Node node) {
        getState().definition = def;
        try {
            getState().nodePath = node.getPath();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected GatoJsState getState() {
        return (GatoJsState) super.getState();
    }


}
