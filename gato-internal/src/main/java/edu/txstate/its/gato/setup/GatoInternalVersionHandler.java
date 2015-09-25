package edu.txstate.its.gato.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.delta.BootstrapSingleResource;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.FindAndChangeTemplateIdTask;
import info.magnolia.module.delta.Task;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoInternalVersionHandler extends DefaultModuleVersionHandler {
  public GatoInternalVersionHandler() {
    register(DeltaBuilder.update("1.0.1", "")
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap class definition for doing image resizing on Texas State imagehandlers server", "/mgnl-bootstrap/gato-internal/config.modules.gato-lib.imaging.resize.xml"))
    );
  }
  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> tasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));
    tasks.add(new Gato5MigrationTask("Gato Migrate to 5 task", "Generic update task for all the things we need to do to upgrade to Magnolia 5."));
    tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, 
      "gato:components/texasState/customCssBlock", "gato-component-cssjs:components/customcss"));
    tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, 
      "gato:components/texasState/customjsBlock", "gato-component-cssjs:components/customjs"));
    tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, 
      "gato:components/texasState/texasEditor", "gato-template:components/richeditor"));
    tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, 
      "gato:pages/tsus-2012/tsus-2012-home", "gato-template-tsus:pages/home"));
    tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, 
      "gato:pages/tsus-2012/tsus-2012-mail", "gato-template-tsus:pages/mail"));
    tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, 
      "gato:pages/tsus-2012/tsus-2012-standard", "gato-template-tsus:pages/standard"));
    return tasks;
  }

}
