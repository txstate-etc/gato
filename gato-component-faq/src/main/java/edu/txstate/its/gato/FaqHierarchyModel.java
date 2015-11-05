package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.wrapper.HTMLEscapingNodeWrapper;
import info.magnolia.link.LinkUtil;
import info.magnolia.link.LinkException;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

import org.apache.commons.lang.StringUtils;

public class FaqHierarchyModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {
 
    public FaqHierarchyModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
        super(content, definition, parent);
    }

    public List<FaqItem> getNodes() {
        List<FaqItem> nodes = new ArrayList<FaqItem>();

        try {
            Node tree = content.getNode("faqTree");
            tree = NodeUtil.deepUnwrap(tree, HTMLEscapingNodeWrapper.class);

            for (Node node : NodeUtil.getNodes(tree, NodeTypes.Area.NAME)) {
                nodes.add(new FaqItem(node));
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

        return nodes;
    }
}
