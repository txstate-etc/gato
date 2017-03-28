package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * For a time we had misconfigured our 2015 template areas and created empty nodes for
 * them in a lot of pages, but independently on edit and public. It causes a lot of
 * activation errors that we're hoping to resolve by cleaning them up.
 */
public class RemoveSitewideAreasFromSubpagesTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(RemoveSitewideAreasFromSubpagesTask.class);

  public RemoveSitewideAreasFromSubpagesTask() {
    super("Remove Sitewide Areas", "Get rid of empty area nodes left around by previous mistakes.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    List<String> areanames = Arrays.asList(
      "parentOrganization",
      "superUser",
      "siteinfo",
      "footerLinks",
      "socialmedia",
      "gatoHours"
    );

    visitPages(s, n -> {
      // root pages should keep these areas, they are sitewide
      if (n.getDepth() == 0) {
        log.info("processing "+n.getName()+"...");
        return;
      }

      for (String areaname : areanames) {
        if (n.hasNode(areaname)) {
          Node area = n.getNode(areaname);
          if (!area.hasNodes()) {
            log.info("deleting an empty area at "+area.getPath());
            area.remove();
          }
        }
      }
    });
  }
}
