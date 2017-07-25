package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpgradeTsusLogoTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(UpgradeTsusLogoTask.class);

  public UpgradeTsusLogoTask() {
    super("update tsus logo", "update tsus logo from old format to 2017 format.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s,"gato-template-tsus:pages/home",n->{
      Node area=n.getNode("tsuslogos");
      if (area.hasNode("imported")) return;

      Node componentNode = area.addNode("imported", NodeTypes.Component.NAME);
      Node institutionalLogoNode = componentNode.addNode("institutionallogos", NodeTypes.ContentNode.NAME);
      for (Node oldLogoItem : NodeUtil.collectAllChildren(area)) {
        if (oldLogoItem.getName()!="imported"){
          Node logo = componentNode.addNode(oldLogoItem.getName(), NodeTypes.ContentNode.NAME);
          PropertyIterator oldLogoProperty = oldLogoItem.getProperties();
          while (oldLogoProperty.hasNext()){
             Property p = oldLogoProperty.nextProperty();
             String nodeName = p.getName();
             String nodeValue = p.getString();
             logo.setProperty(nodeName,nodeValue);
          }
          oldLogoItem.remove();
        }
      }
    });
  }
}
