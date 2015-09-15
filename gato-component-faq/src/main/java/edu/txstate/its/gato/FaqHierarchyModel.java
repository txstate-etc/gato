package edu.txstate.its.gato;

import info.magnolia.jcr.util.ContentMap;
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

import org.apache.commons.lang.StringUtils;

public class FaqHierarchyModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {
 
    public FaqHierarchyModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
        super(content, definition, parent);
    }

    private String processTreeNode(Node node, StringBuffer out, int depth) throws RepositoryException {
        int indent = 20 * depth;

        if ("group".equals(PropertyUtil.getString(node, "nodetype"))) {
            String groupTitle = PropertyUtil.getString(node, "title", "");
            if (StringUtils.isEmpty(groupTitle)) groupTitle = "--No Text Entered--";

            out.append("<h2 class=\"txst-faq-group-title\" style=\"margin-left:" + indent + 
                     "px\"><a href=\"#\">" + groupTitle + "</a></h2>\n");

            out.append("<div class=\"txst-faq-group\">\n");

            for (Node c : NodeUtil.getNodes(node, NodeTypes.Component.NAME)) {
                processTreeNode(c, out, depth + 1);
            }

            out.append("</div>\n");

            return groupTitle;
        }
        else {
            out.append("<div class=\"txst-faqitem\" style=\"margin-left:" + indent + "px\">\n");

            String question = PropertyUtil.getString(node, "question", "");
            String answer = PropertyUtil.getString(node, "answer", "");
            if (StringUtils.isEmpty(question)) question = "--No Text Entered--";

            //convert links from uuid format
            try {
                answer = LinkUtil.convertLinksFromUUIDPattern(answer);
            }
            catch (LinkException e) {
                //Failed to parse links
            }

            out.append("<h2 class=\"txst-faqitem-question\"><a href=\"#\">" + question + "</a></h2>\n");

            out.append("<div class=\"txst-faqitem-answer\">" + answer + "</div>\n");

            out.append("</div>\n");

            return question;
        }
    }

    public String getHtml() {
        StringBuffer stringBuffer = new StringBuffer();

        try {
            Node tree = content.getNode("faqTree");
            tree = NodeUtil.deepUnwrap(tree, HTMLEscapingNodeWrapper.class);
            
            String title = "";

            for (Node c : NodeUtil.getNodes(tree, NodeTypes.Area.NAME)) {
              String ret = processTreeNode(c, stringBuffer, 0);
              if (StringUtils.isEmpty(title)) {
                title = ret;
              }
            }
        } catch (PathNotFoundException e) {
            e.printStackTrace();
            return e.getMessage();
        } catch (RepositoryException e) {
            e.printStackTrace();
            return e.getMessage();
        }

        return stringBuffer.toString();
    }
}
