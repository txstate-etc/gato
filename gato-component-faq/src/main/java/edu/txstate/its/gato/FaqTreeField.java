package edu.txstate.its.gato;

import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.Label;
import com.vaadin.ui.Component;
import com.vaadin.ui.CustomField;
import com.vaadin.ui.Tree;
import com.vaadin.ui.VerticalLayout;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.link.LinkException;
import info.magnolia.link.LinkUtil;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;
import info.magnolia.util.EscapeUtil;

import java.lang.Iterable;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.ValueFormatException;

public class FaqTreeField extends CustomField<Object> {

    private Node root;
    private boolean isNew;

    public FaqTreeField(Node root, boolean isNew) {
        this.root = root;
        this.isNew = isNew;
    }

    private void processTreeNode(Node node, StringBuffer sb) throws RepositoryException {
        String nodetype = node.getProperty("nodetype").getString();
        String id = node.getIdentifier();

        if (nodetype.equals("group")) {
            String title = node.getProperty("title").getString();
            boolean isOpen = node.getProperty("isOpen").getBoolean();
            String expandClass = isOpen ? "faq_tree_open" : "faq_tree_closed";

            if (node.hasProperty("selected") && node.getProperty("selected").getBoolean()) {
                expandClass += " selected_node";
            }

            sb.append("<li class=\"faq_tree_group_node " + expandClass + "\" id=\"" + id + "\">")
              .append("<div class=\"node_drop_div\" id=\"drop-" + id + "\">&#160;</div>")
              .append("<dl id=\"dl-" + id + "\">")
              .append("<span class=\"expander\">&#160;</span>")
              .append("<span class=\"node_icon\">&#160;</span>")
              .append("<dt>" + title + "</dt>")
              .append("<dd class=\"node_data\">")
              .append("<span title=\"group\">" + title + "</span>")
              .append("</dd>")
              .append("<dd class=\"node_actions\">")
              .append("<span class=\"delete_node_action\" title=\"Delete\">&#160;</span>")
              .append("<span class=\"add_group_action\" title=\"Add Group\">&#160;</span>")
              .append("<span class=\"add_faq_action\" title=\"Add Faq\">&#160;</span>")
              .append("</dd>")
              .append("</dl>");            

            if (node.hasNodes()) {
                sb.append("<ul>");

                for (Node n : NodeUtil.getNodes(node)) {
                    processTreeNode(n, sb);
                }

                sb.append("</ul>");
            }

            sb.append("</li>");
        } else {
            String question = node.getProperty("question").getString();

            String answer = node.getProperty("answer").getString();

            answer = EscapeUtil.escapeXss(answer);
            answer = "<input type=\"hidden\" id=\"answer-" + id + "\" value=\"" + answer + "\" />";

            try {
                answer = LinkUtil.convertLinksFromUUIDPattern(answer);
            } catch (LinkException e) {
                // Couldn't convert links, images will be broken in editor
                e.printStackTrace();
            }

            String nodeClass = "";

            if (node.hasProperty("selected") && node.getProperty("selected").getBoolean()) {
                nodeClass = " selected_node";
            }

            sb.append("<li class=\"faq_tree_faq_node" + nodeClass + "\" id=\"" + id + "\">")
              .append("<div class=\"node_drop_div\" id=\"drop-" + id + "\">&#160;</div>")
              .append("<dl id=\"dl-" + id + "\">")
              .append("<span class=\"expander\">&#160;</span>")
              .append("<span class=\"node_icon\">&#160;</span>")
              .append("<dt>" + question + "</dt>")
              .append("<dd class=\"node_data\">")
              .append("<span title=\"question\">" + question + "</span>")
              .append("<span title=\"answer\">" + answer + "</span>")
              .append("</dd>")
              .append("<dd class=\"node_actions\">")
              .append("<span class=\"delete_node_action\" title=\"Delete\">&#160;</span>")
              .append("<span class=\"add_group_action\" title=\"Add Group\">&#160;</span>")
              .append("<span class=\"add_faq_action\" title=\"Add Faq\">&#160;</span>")
              .append("</dd>")
              .append("</dl>")
              .append("</li>");
        }
    }

    private String buildTree() {
      Iterable<Node> nodeIterator;

      try {
          nodeIterator = NodeUtil.getNodes(root.getNode("faqTree"), NodeTypes.Area.NAME);
      } catch (RepositoryException e) {
          e.printStackTrace();
          return "error";
      }

      StringBuffer sb = new StringBuffer();
      sb.append("<ul id=\"faq_tree\">");

      for (Node n : nodeIterator) {
          try {
              processTreeNode(n, sb);
          } catch (RepositoryException e) {
              e.printStackTrace();
          }
      }

      sb.append("</ul>");
      return sb.toString();
    }

    @Override
    protected Component initContent() {
        String treeHtml;
        if (isNew) {
          treeHtml = "<ul id=\"faq_tree\">" +
                       "<li class=\"faq_tree_faq_node selected_node\" id=\"node0\">" +
                         "<div class=\"node_drop_div\" id=\"drop-node0\">&#160;</div>" +
                         "<dl id=\"dl-node0\">" +
                           "<span class=\"expander\">&#160;</span>" +
                           "<span class=\"node_icon\">&#160;</span>" +
                           "<dt>--No Text Entered--</dt>" +
                           "<dd class=\"node_data\">" +
                             "<span title=\"question\"></span>" +
                             "<span title=\"answer\"><input type=\"hidden\" id=\"answer-node0\" value=\"\" /></span>" +
                           "</dd>" +
                           "<dd class=\"node_actions\">" +
                             "<span class=\"delete_node_action\" title=\"Delete\">&#160;</span>" +
                             "<span class=\"add_group_action\" title=\"Add Group\">&#160;</span>" +
                             "<span class=\"add_faq_action\" title=\"Add Faq\">&#160;</span>" +
                           "</dd>" +
                         "</dl>" +
                       "</li>" +
                     "</ul>";
        } else {
          treeHtml = buildTree();
        }

        VerticalLayout layout = new VerticalLayout();

        //layout.addComponent(new FaqTreeJsComponent());
        layout.addComponent(new Label(treeHtml, Label.CONTENT_XHTML));
        return layout;
    }

    @Override
    public Class<? extends Object> getType() {
        // TODO Auto-generated method stub
        return String.class;
    }

}
