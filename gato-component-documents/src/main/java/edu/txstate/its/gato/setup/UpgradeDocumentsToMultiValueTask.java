package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.Session;
import javax.jcr.Node;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * Task to upgrade Gato from Magnolia 4.5 to Magnolia 5.4.
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public class UpgradeDocumentsToMultiValueTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpgradeDocumentsToMultiValueTask.class);

  public UpgradeDocumentsToMultiValueTask() {
    super("Upgrade Documents Component", "Transition the gato document component over to multivalue so that users can choose more than one file to be displayed.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(hm, "gato-component-documents:components/documents", this::convertToMulti);
  }

  private void convertToMulti(Node n) throws RepositoryException {
    if (!n.hasNode("docs") && n.hasProperty("link")) {
      Node docs = n.addNode("docs", NodeTypes.ContentNode.NAME);
      PropertyUtil.setProperty(docs, "0", PropertyUtil.getString(n, "link"));
      n.getProperty("link").remove();
    }
  }
}
