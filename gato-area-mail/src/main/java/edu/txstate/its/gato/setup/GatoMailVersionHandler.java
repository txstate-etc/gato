package edu.txstate.its.gato.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.delta.DeltaBuilder;

import java.util.Arrays;

/**
 * This class is optional and lets you manage the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 *
 * @see info.magnolia.module.DefaultModuleVersionHandler
 * @see info.magnolia.module.ModuleVersionHandler
 * @see info.magnolia.module.delta.Task
 */
public class GatoMailVersionHandler extends DefaultModuleVersionHandler {
  public GatoMailVersionHandler() {
    register(DeltaBuilder.update("1.0.3", "")
      .addTask(new MoveButtonTextToFormPropertiesTask())
      .addTask(new UpdateTextFieldTask())
      .addTask(new ConvertSelectionOptionsToChildNodeOperatorTask())
      .addTask(new WipeVersionsTask("gato-area-mail:components/formproperties"))
    );
  }
}
