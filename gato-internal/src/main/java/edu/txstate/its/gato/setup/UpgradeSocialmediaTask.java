package edu.txstate.its.gato.setup;

import java.util.Arrays;
import java.util.List;

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

public class UpgradeSocialmediaTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(UpgradeSocialmediaTask.class);

  public UpgradeSocialmediaTask() {
    super("Update socialmedia", "Update socialmedia nodes on all pages.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {

    Session session=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    String areaname="socialmedia";

    visitPages(session, page -> {

        if (page.hasNode(areaname)) {
          log.warn("Processing socialmedia upgrade node opertion on : "+page.getName());

          Node socialmediaArea = page.getNode(areaname);
          if (socialmediaArea.hasNode("importSocialLink")) {
            Node importSocialLinkNode = socialmediaArea.getNode("importSocialLink");
            if (importSocialLinkNode.hasNode("sociallinks")) {
              Node sociallinksNode = importSocialLinkNode.getNode("sociallinks");
              if (!sociallinksNode.hasNodes()) {
                importSocialLinkNode.remove();
              }
            }
            return;
          }

          Node socialComponent = NodeUtil.createPath(socialmediaArea, "importSocialLink", NodeTypes.Component.NAME);
          socialComponent.setProperty("mgnl:template", "gato-template:components/sociallink");
          Node newSocialNode = NodeUtil.createPath(socialComponent, "sociallinks", NodeTypes.ContentNode.NAME);

          NodeIterator nodeiter = socialmediaArea.getNodes();
          while (nodeiter.hasNext()) {
            Node oldSocialItem = nodeiter.nextNode();
            if (oldSocialItem.getName()!="importSocialLink") {
              Node socialItem = NodeUtil.createPath(newSocialNode, oldSocialItem.getName(), NodeTypes.ContentNode.NAME);
              PropertyIterator iter = oldSocialItem.getProperties();
              while (iter.hasNext()){
                Property p = iter.nextProperty();
                if (!p.getName().startsWith("jcr:") && !p.getName().startsWith("mgnl:"))
                  socialItem.setProperty(p.getName(),p.getValue());
              }
              log.warn("deleting deleting node  "+NodeUtil.getName(oldSocialItem)+" from area "+ socialmediaArea.getName());
              oldSocialItem.remove();
            }
          }
      }
    });
  }
}
