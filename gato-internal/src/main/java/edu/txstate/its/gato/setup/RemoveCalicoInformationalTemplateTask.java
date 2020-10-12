package edu.txstate.its.gato.setup;

/*
  Consolidate the Calico Informational and Calico Variable templates.
*/

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;

import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RemoveCalicoInformationalTemplateTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(RemoveCalicoInformationalTemplateTask.class);
  
  public RemoveCalicoInformationalTemplateTask() {
    super("Consolidate Calico Variable and Informational templates", "New template name is Calico");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException {
    Session session =ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitPages(session, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        String templateId = NodeTypes.Renderable.getTemplate(n);
        if (templateId.equals("gato-template-mobilefirst:pages/informational")) {
          if (n.hasNode("calicoInformational")) {
            Node contentNode = n.getNode("calicoInformational");
            NodeIterator children = contentNode.getNodes();
            while (children.hasNext()) {
              Node node = children.nextNode();
              String sectionTemplateId = NodeTypes.Renderable.getTemplate(node);
              if (StringUtils.indexOf(sectionTemplateId, "rows-informational") > -1) {
                sectionTemplateId = StringUtils.replace(sectionTemplateId, "rows-informational", "rows-interior");
                NodeTypes.Renderable.set(node, sectionTemplateId);
              }
            }
            if (n.hasNode("contentParagraph")) {
              n.getNode("contentParagraph").remove();
            }
            NodeUtil.renameNode(contentNode, "contentParagraph");
          }
          NodeTypes.Renderable.set(n, "gato-template-mobilefirst:pages/standard");
        }
        n.getSession().save();
      }
    });
    session.save();
  }


}