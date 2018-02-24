package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateCardLayoutFiltersTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateCardLayoutFiltersTask.class);

  public UpdateCardLayoutFiltersTask() {
    super("Update Card Layout Filters", "Convert card layout filters over to having a node be the array parent.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s, "gato-component-cards:components/layouts/grid", n -> { convertToNodeArray(n, "filterlist"); });
    visitByTemplate(s, "gato-component-cards:components/grid/image", n -> { convertToNodeArray(n, "tags"); });
    visitByTemplate(s, "gato-component-cards:components/grid/video", n -> { convertToNodeArray(n, "tags"); });
    visitByTemplate(s, "gato-component-cards:components/grid/rss", n -> { convertToNodeArray(n, "tags"); });
  }

  protected void convertToNodeArray(Node n, String propName) throws RepositoryException, ItemNotFoundException {
    if (n.hasProperty(propName)) {
      String csvalues = PropertyUtil.getString(n, propName, "");
      n.getProperty(propName).remove();
      Node area = NodeUtil.createPath(n, propName, NodeTypes.Area.NAME);
      String[] vals = csvalues.split("\\s*,\\s*");
      for (int i = 0; i < vals.length; i++) {
        PropertyUtil.setProperty(area, String.valueOf(i), StringUtils.strip(vals[i]));
      }
      n.save();
    }
  }
}
