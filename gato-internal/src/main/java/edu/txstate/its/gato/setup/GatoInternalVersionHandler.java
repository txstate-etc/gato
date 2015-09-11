package edu.txstate.its.gato.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.delta.DeltaBuilder;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoInternalVersionHandler extends DefaultModuleVersionHandler {
  public GatoInternalVersionHandler() {
    register(DeltaBuilder.update("1.0.1", "")
      .addTask(new Gato5MigrationTask("Gato Migrate to 5 task", "Generic update task for all the things we need to do to upgrade to Magnolia 5."))
    );
  }
}
