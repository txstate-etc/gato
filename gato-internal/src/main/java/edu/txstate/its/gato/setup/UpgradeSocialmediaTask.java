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
        Node socialmediaArea = page.getNode(areaname);
        if (socialmediaArea.hasNode("importSocialLink")) {
          Node importSocialLinkNode = socialmediaArea.getNode("importSocialLink");
          if (importSocialLinkNode.hasNode("sociallinks")) {
            Node sociallinksNode = importSocialLinkNode.getNode("sociallinks");
            if (!sociallinksNode.hasNodes()) {
              log.warn("Removing empty socialmedia area at : "+importSocialLinkNode.getPath());
              importSocialLinkNode.remove();
            }
          }
        }
      }
    });
  }
}
