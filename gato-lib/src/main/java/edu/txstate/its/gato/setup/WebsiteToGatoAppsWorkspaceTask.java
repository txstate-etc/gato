package edu.txstate.its.gato.setup;

import edu.txstate.its.gato.GatoLib;

import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebsiteToGatoAppsWorkspaceTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(WebsiteToGatoAppsWorkspaceTask.class);
  
  private String path;

  public WebsiteToGatoAppsWorkspaceTask(String path) {
    super("WebsiteToGatoAppsWorkspaceTask", "Migrate '"+path+"' to the " + GatoLib.WS_GATOAPPS + " workspace");
    this.path = path;
  }

  @Override
  protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
    log.info("Running WebsiteToGatoAppsWorkspaceTask");
    
    Session gato = installContext.getJCRSession(GatoLib.WS_GATOAPPS);
    gato.getWorkspace().clone(RepositoryConstants.WEBSITE, path, path, true);
    log.info("Following " + RepositoryConstants.WEBSITE + ":" + path + " moved to " + GatoLib.WS_GATOAPPS + ":" + path);
    gato.save();
  }

}
