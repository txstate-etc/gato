package edu.txstate.its.gato;

import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.module.ModuleRegistry;
import info.magnolia.objectfactory.Components;

public class TweetStreamerCommand extends GatoBaseSchedulerCommand {
  MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);

  public boolean doExecute(Context context) {
    if (!shouldExecute()) return true;
    if ("true".equals(mcp.getProperty("twitter.disabled"))) return true;

    log.info("TweetStreamerCommand called.");

    boolean success = true;
    
    GatoTwitter module = (GatoTwitter) ModuleRegistry.Factory.getInstance().getModuleInstance(GatoTwitter.MODULE_GATO_TWITTER);

    if (module.isActive()) {
      log.info("GatoTwitter is active. Starting Twitter stream...");
      final TweetStreamer tweetStreamer = module.getTweetStreamer();

      try {
        // FIXME: return boolean value from startStream()
        // But Caller doesn't look at it, so no biggie.
        MgnlContext.doInSystemContext(new MgnlContext.VoidOp() {
          @Override
          public void doExec() {
            tweetStreamer.startStream();
          }
        }, true);

      } catch (Exception e) {
        log.error("Failed to start Twitter stream", e);
        return false;      
      }
    }

    log.info("TweetStreamerCommand completed.");

    return success;
  }

}
