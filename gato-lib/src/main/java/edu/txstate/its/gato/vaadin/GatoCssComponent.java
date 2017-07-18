package edu.txstate.its.gato.vaadin;

import com.vaadin.annotations.JavaScript;
import com.vaadin.ui.AbstractJavaScriptComponent;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@JavaScript({"vaadin://js/gato-css-include.js"})
public class GatoCssComponent extends AbstractJavaScriptComponent {
    public GatoCssComponent(GatoCssIncludeDefinition def, Node node) {
        getState().definition = def;
        try {
            Node pageNode = NodeUtil.getNearestAncestorOfType(node, "mgnl:page");
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected GatoCssState getState() {
        return (GatoCssState) super.getState();
    }


}
