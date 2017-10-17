package edu.txstate.its.gato.setup;

import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RssCardShowTimeTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(RssCardShowTimeTask.class);

  public RssCardShowTimeTask() {
    super("Update RSS Cards", "Update RSS Cards to use the new data format for optionally showing published time.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session session=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(session, "gato-component-cards:components/grid/rss", card -> {
      String showdates = PropertyUtil.getString(card, "showDates", "false");
      if ("false".equals(showdates)) {
        PropertyUtil.setProperty(card, "showDates", "none");
      } else if ("true".equals(showdates)) {
        PropertyUtil.setProperty(card, "showDates", "time");
      }
    });
  }
}
