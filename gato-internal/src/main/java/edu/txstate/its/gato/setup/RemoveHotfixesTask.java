package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.resourceloader.jcr.JcrResourceOrigin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RemoveHotfixesTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(RemoveHotfixesTask.class);

  public RemoveHotfixesTask() {
    super("Remove hotfixes", "Get rid of all the hotfixes from the previous release.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, TaskExecutionException {
    Session s=ctx.getJCRSession(JcrResourceOrigin.RESOURCES_WORKSPACE);
    Node root = s.getRootNode();
    for (Node r : NodeUtil.getNodes(root)) {
      r.remove();
    }
  }
}
