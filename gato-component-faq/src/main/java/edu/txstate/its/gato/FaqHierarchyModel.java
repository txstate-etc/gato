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

    private FaqNode createFaqNode(Node node) throws RepositoryException {
        FaqNode faqNode = new FaqNode();
        faqNode.nodetype = PropertyUtil.getString(node, "nodetype");

        if ("group".equals(faqNode.nodetype)) {
            faqNode.title = PropertyUtil.getString(node, "title", "");
            if (StringUtils.isEmpty(faqNode.title)) { faqNode.title = "--No Text Entered--"; }

            for (Node c : NodeUtil.getNodes(node, NodeTypes.Area.NAME)) {
                faqNode.children.add(createFaqNode(c));
            }
        }
        else {
            faqNode.question = PropertyUtil.getString(node, "question", "");
            faqNode.answer = PropertyUtil.getString(node, "answer", "");
            if (StringUtils.isEmpty(faqNode.question)) { faqNode.question = "--No Text Entered--"; }

            try {
                faqNode.answer = LinkUtil.convertLinksFromUUIDPattern(faqNode.answer);
            }
            catch (LinkException e) {
                e.printStackTrace();
            }
        }

        return faqNode;
    }

    public List<FaqNode> getNodes() {
        List<FaqNode> nodes = new ArrayList<FaqNode>();

        try {
            Node tree = content.getNode("faqTree");
            tree = NodeUtil.deepUnwrap(tree, HTMLEscapingNodeWrapper.class);

            for (Node node : NodeUtil.getNodes(tree, NodeTypes.Area.NAME)) {
                nodes.add(createFaqNode(node));
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

        return nodes;
    }

    public class FaqNode {
        @Getter public String nodetype;
        @Getter public String question;
        @Getter public String answer;
        @Getter public String title;
        @Getter public List<FaqNode> children = new ArrayList<FaqNode>();
    }
}
