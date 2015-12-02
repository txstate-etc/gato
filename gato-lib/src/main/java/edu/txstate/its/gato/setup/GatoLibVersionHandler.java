package edu.txstate.its.gato.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.BootstrapSingleResource;
import info.magnolia.module.delta.Delta;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.Task;
import info.magnolia.rendering.module.setup.InstallRendererContextAttributeTask;

import java.util.ArrayList;
import java.util.List;

import edu.txstate.its.gato.GatoUtils;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoLibVersionHandler extends DefaultModuleVersionHandler {
  public GatoLibVersionHandler() {
  }

  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> extraInstallTasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));
    extraInstallTasks.addAll(getFunctionsInstallerTask());
		extraInstallTasks.add(new BootstrapSingleResource("Bootstrap", "Bootstrap default class definition for doing image resizing", "/mgnl-bootstrap/gato-lib/config.modules.gato-lib.imaging.resize.xml"));
    return extraInstallTasks;
  }

  private List<Task> getFunctionsInstallerTask() {
    List<Task> tasks = new ArrayList<Task>();
    tasks.add(new InstallRendererContextAttributeTask("rendering", "freemarker", "gf", GatoUtils.class.getName()));
    tasks.add(new InstallRendererContextAttributeTask("site", "site", "gf", GatoUtils.class.getName()));
    tasks.add(new InstallRendererContextAttributeTask("site", "site", "restfn", "info.magnolia.resteasy.client.functions.RestTemplatingFunctions"));
    return tasks;
  }
}
