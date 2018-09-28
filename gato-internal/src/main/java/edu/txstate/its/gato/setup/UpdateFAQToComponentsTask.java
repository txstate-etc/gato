package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateFAQToComponentsTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateFAQToComponentsTask.class);

  public UpdateFAQToComponentsTask() {
    super("Update FAQ to Components", "Update FAQ to use nested Question and Group components.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException {
    Session session= ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(session, "gato-component-faq:components/faq-hierarchy", n -> {
      if (n.hasNode("faqTree")) {
        Node faqTree = n.getNode("faqTree");
        for (Node node : NodeUtil.getNodes(faqTree)) {
          convertFAQAreaToComponent(node);
        }
      }
    });
  }

  private void convertFAQAreaToComponent(Node node) throws RepositoryException{
    String nodeType = PropertyUtil.getString(node, "nodetype");
    if (null != nodeType) {
      if (nodeType.equals("faq")) {
        node.setPrimaryType(NodeTypes.Component.NAME);
        PropertyUtil.setProperty(node, "mgnl:template", "gato-component-faq:components/question");
      }
      else if (nodeType.equals("group")) {
        node.setPrimaryType(NodeTypes.Component.NAME);
        PropertyUtil.setProperty(node, "mgnl:template", "gato-component-faq:components/faqgroup");
        Node areaNode = NodeUtil.createPath(node, "faqgroup", NodeTypes.Area.NAME);
        String title = PropertyUtil.getString(node, "title");
        PropertyUtil.setProperty(areaNode, "title", title);
        for (Node childNode : NodeUtil.getNodes(node)) {
          if (!NodeUtil.getName(childNode).equals("faqgroup")) {
            NodeUtil.moveNode(childNode, areaNode);
            convertFAQAreaToComponent(childNode);
          }
        }
      }
    }
  }

}
