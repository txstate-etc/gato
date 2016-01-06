package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.commands.impl.BaseRepositoryCommand;
import info.magnolia.objectfactory.Components;

/**
 * @author nwing
 */
public abstract class GatoBaseSchedulerCommand extends BaseRepositoryCommand {
  protected final MagnoliaConfigurationProperties mcp;

  public GatoBaseSchedulerCommand() {
    super();
    this.mcp = Components.getSingleton(MagnoliaConfigurationProperties.class);
  }

  /**
   * This method returns true unless there is a property in magnolia.properties that
   * says scheduler tasks should be skipped on this installation.
   *
   * This allows us to cluster multiple application servers with a shared database, and have
   * scheduled tasks run only by one application server.
   */
  public boolean shouldExecute() {
    if ("true".equals(mcp.getProperty("gato.skipscheduler"))) return false;
    return true;
  }

  @Override
  public final boolean execute(info.magnolia.context.Context context) throws Exception {
    if (shouldExecute()) {
      return doExecute(context);
    } else {
      log.debug("Execute called, but skipscheduler is true. Doing nothing.");
      return true;
    }
  }

  public abstract boolean doExecute(info.magnolia.context.Context context) throws Exception;

}
