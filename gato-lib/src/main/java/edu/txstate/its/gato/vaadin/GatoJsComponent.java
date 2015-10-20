package edu.txstate.its.gato.vaadin;

import com.vaadin.annotations.JavaScript;
import com.vaadin.ui.AbstractJavaScriptComponent;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@JavaScript({"vaadin://js/gato-js-include.js"})
public class GatoJsComponent extends AbstractJavaScriptComponent {
    public GatoJsComponent(GatoJsIncludeDefinition def, Node node) {
        getState().definition = def;
        try {
            getState().nodePath = node.getPath();

            Node pageNode = NodeUtil.getNearestAncestorOfType(node, "mgnl:page");
            getState().pageTemplate = PropertyUtil.getString(pageNode, "mgnl:template");
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected GatoJsState getState() {
        return (GatoJsState) super.getState();
    }


}
