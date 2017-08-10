package edu.txstate.its.gato.setup;

import java.util.UUID;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RandomizeCacheStrTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(RandomizeCacheStrTask.class);

  public RandomizeCacheStrTask() {
    super("Randomize Cache String", "Randomize our cache buster string for resources.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.CONFIG);
    Node gatointernal = s.getNode("/modules/gato-internal");
    gatointernal.setProperty("cachebuster", UUID.randomUUID().toString());
  }
}
