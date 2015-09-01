package edu.txstate.its.gato.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.Delta;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.Task;
import info.magnolia.rendering.module.setup.InstallRendererContextAttributeTask;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoCssJsVersionHandler extends DefaultModuleVersionHandler {
  public GatoCssJsVersionHandler() {
  }
  
  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> extraInstallTasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));
    extraInstallTasks.addAll(getFunctionsInstallerTask());
    return extraInstallTasks;
  }

  private List<Task> getFunctionsInstallerTask() {
    List<Task> tasks = new ArrayList<Task>();
    return tasks;
  }
}
