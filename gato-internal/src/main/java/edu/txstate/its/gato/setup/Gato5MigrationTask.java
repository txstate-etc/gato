package edu.txstate.its.gato.setup;

import info.magnolia.repository.RepositoryConstants;
import info.magnolia.module.InstallContext;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeVisitor;

import javax.jcr.Session;
import javax.jcr.Node;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

/**
 *
 * Task to upgrade Gato from Magnolia 4.5 to Magnolia 5.4.
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public class Gato5MigrationTask extends GatoBaseUpgradeTask {
  public Gato5MigrationTask(String name, String description) {
    super(name, description);
  }
  
  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    
    visitPages(hm, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {

      }
    });
  }  
}
