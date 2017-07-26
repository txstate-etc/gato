package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpgradeTsusLogoTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(UpgradeTsusLogoTask.class);
  private String oldRefNode;
  private String newChildNode;
  private String newGrandChidNode;
  private String templatePath;

  public UpgradeTsusLogoTask(String _oldRefNode,String _newChildNode,String _newGrandChidNode,String _templatePath) {
    super("Update TSUS logos and socialmedia line", "Update tsus logo and socialmedia from old format to 2017 format.");
    this.oldRefNode=_oldRefNode;
    this.newChildNode=_newChildNode;
    this.newGrandChidNode=_newGrandChidNode;
    this.templatePath=_templatePath;
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s,"gato-template-tsus:pages/home",page->{
      Node area=page.getNode(oldRefNode);
      if (area.hasNode(newChildNode)) return;

      Node componentNode = NodeUtil.createPath(area,newChildNode, NodeTypes.Component.NAME);
      componentNode.setProperty("mgnl:template", templatePath);
      Node imageItemNode = NodeUtil.createPath(componentNode,newGrandChidNode, NodeTypes.ContentNode.NAME);
      NodeIterator nodeiter = area.getNodes();
      while (nodeiter.hasNext()) {
        Node oldLogoItem = nodeiter.nextNode();
        if (oldLogoItem.getName()!=newChildNode) {
          Node logo = NodeUtil.createPath(imageItemNode, oldLogoItem.getName(), NodeTypes.ContentNode.NAME);
          PropertyIterator iter = oldLogoItem.getProperties();
          while (iter.hasNext()){
            Property p = iter.nextProperty();
            if (!p.getName().startsWith("jcr:") && !p.getName().startsWith("mgnl:"))
              logo.setProperty(p.getName(),p.getValue());
          }
          oldLogoItem.remove();
        }
      }
    });
  }
}
