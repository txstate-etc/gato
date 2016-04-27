package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.Value;

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
public class ConvertSelectionOptionsToChildNodeOperatorTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(ConvertSelectionOptionsToChildNodeOperatorTask.class);

  public ConvertSelectionOptionsToChildNodeOperatorTask() {
    super("Upgrade Documents Component", "Transition the mail form selection component over to child node plus multiple properties instead of a single multiple-value property.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(hm, "gato-area-mail:components/formselection", this::convertToProperties);
  }

  private void convertToProperties(Node n) throws RepositoryException {
    if (!n.hasNode("options") && n.hasProperty("options") && n.getProperty("options").isMultiple()) {
      Value[] vals = n.getProperty("options").getValues();
      n.getProperty("options").remove();
      Node options = n.addNode("options", NodeTypes.ContentNode.NAME);
      for (int i = 0; i < vals.length; i++) {
        options.setProperty(Integer.toString(i), vals[i]);
      }
    }
  }
}
