package edu.txstate.its.gato.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.BootstrapSingleResource;
import info.magnolia.module.delta.Delta;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.Task;
import info.magnolia.module.delta.SetupModuleRepositoriesTask;
import info.magnolia.module.delta.SetPropertyTask;
import info.magnolia.rendering.module.setup.InstallRendererContextAttributeTask;
import info.magnolia.repository.RepositoryConstants;

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
    register(DeltaBuilder.update("1.0.1", "")
      .addTask(new SetupModuleRepositoriesTask())
      .addTask(new WebsiteToGatoAppsWorkspaceTask("/homepage-data"))
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap IsNotTopLevelRule into Rename Page action", "/mgnl-bootstrap/gato-lib/config.modules.pages.apps.pages.subApps.browser.actions.editPageName.availability.rules.IsNotTopLevelRule.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.2", "")
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap IsNotTopLevelRule into Delete Page action", "/mgnl-bootstrap/gato-lib/config.modules.pages.apps.pages.subApps.browser.actions.confirmDeletion.availability.rules.IsNotTopLevelRule.xml"))
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap IsNotTopLevelRule into Delete Page action", "/mgnl-bootstrap/gato-lib/config.modules.pages.apps.pages.subApps.browser.actions.confirmDeletion.availability.rules.IsNotTopLevelRule.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.3", "")
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap External Preview action into Pages detail subapp actions", "/mgnl-bootstrap/gato-lib/config.modules.pages.apps.pages.subApps.detail.actions.externalPreview.xml"))
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap External Preview action into ActionBar", "/mgnl-bootstrap/gato-lib/config.modules.pages.apps.pages.subApps.detail.actionbar.sections.pageActions.groups.editingFlow.items.externalPreview.xml"))
      .addTasks(installOrUpdateTasks())
    );
  }

  protected List<Task> installOrUpdateTasks() {
    List<Task> tasks = new ArrayList<Task>();
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/modules/pages/apps/pages/subApps/browser/workbench", "dropConstraintClass", "edu.txstate.its.gato.apputil.GatoPageDropConstraint"));
    return tasks;
  }

  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> extraInstallTasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));
    extraInstallTasks.addAll(getFunctionsInstallerTask());
		extraInstallTasks.add(new BootstrapSingleResource("Bootstrap", "Bootstrap default class definition for doing image resizing", "/mgnl-bootstrap/gato-lib/config.modules.gato-lib.imaging.resize.xml"));
    extraInstallTasks.addAll(installOrUpdateTasks());
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
