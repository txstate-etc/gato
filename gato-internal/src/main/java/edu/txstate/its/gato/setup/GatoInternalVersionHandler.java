package edu.txstate.its.gato.setup;

import info.magnolia.dam.app.setup.migration.MoveFileContentToDamMigrationTask;
import info.magnolia.dam.app.setup.migration.MoveDataWorkspaceToDamMigrationTask;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.delta.BootstrapSingleResource;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.FindAndChangeTemplateIdTask;
import info.magnolia.module.delta.RemoveNodeTask;
import info.magnolia.module.delta.Task;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoInternalVersionHandler extends DefaultModuleVersionHandler {
  public GatoInternalVersionHandler() {
    register(DeltaBuilder.update("1.0", "")
      .addTask(new BootstrapSingleResource("Bootstrap", "Bootstrap class definition for doing image resizing on Texas State imagehandlers server", "/mgnl-bootstrap/gato-internal/config.modules.gato-lib.imaging.resize.xml"))
    );
  }
  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> tasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));

    // move binary data from the website tree to the DAM
    tasks.add(new MoveFileContentToDamMigrationTask("Website DAM Migration - Image", "Move binary files from the website tree to the DAM.", RepositoryConstants.WEBSITE,
      Arrays.asList("/tsus", "/testing-site-destroyer"), "", "image"));
    tasks.add(new MoveFileContentToDamMigrationTask("Website DAM Migration - Rollover", "Move binary files from the website tree to the DAM.", RepositoryConstants.WEBSITE,
      Arrays.asList("/tsus"), "", "rollover"));
    tasks.add(new MoveFileContentToDamMigrationTask("Website DAM Migration - Icon", "Move binary files from the website tree to the DAM.", RepositoryConstants.WEBSITE,
      Arrays.asList("/tsus", "/testing-site-destroyer"), "", "icon"));
    tasks.add(new MoveFileContentToDamMigrationTask("Website DAM Migration - BGImage", "Move binary files from the website tree to the DAM.", RepositoryConstants.WEBSITE,
      Arrays.asList("/tsus"), "", "bgimage"));
    tasks.add(new MoveFileContentToDamMigrationTask("Website DAM Migration- Document", "Move binary files from the website tree to the DAM.", RepositoryConstants.WEBSITE,
      Arrays.asList("/testing-site-destroyer"), "", "document"));

    //migrate testing-site documents from dms to dam
    tasks.add(new MoveDataWorkspaceToDamMigrationTask("Migrate DMS content to DAM", "Migrate DMS to DAM", Arrays.asList("/testing-site"), null, "dms" ));

    // list of templateIds that need to be changed {"oldtemplateid, newtemplateid"}
    String[][] templateNamePairs = {
      //component templateIds
      {"gato:components/texasState/customCssBlock",         "gato-component-cssjs:components/customcss"},
      {"gato:components/texasState/customjsBlock",          "gato-component-cssjs:components/customjs"},
      {"gato:components/texasState/department-directory",   "gato-component-dept-directory:components/departmentdirectory"},
      {"gato:components/texasState/texas-faq-hierarchy",    "gato-component-faq:components/faq-hierarchy"},
      {"gato:components/texasState/siteMap",                "gato-component-sitemap:components/sitemap"},
      {"gato:components/texasState/subPages",               "gato-component-sitemap:components/sitemap"},
      {"gato:components/texasState/imageGallery",           "gato-component-gallery:components/gallery"},
      {"gato:components/texasState/imageGalleryCell",       "gato-component-gallery:components/image"},
      {"gato:components/texasState/texas-dms",              "gato-component-documents:components/documents"},
      {"gato:components/texasState/texasDownload",          "gato-component-documents:components/documents"},
      {"gato:components/texasState/texasEditor",            "gato-template:components/richeditor"},
      {"gato:components/texasState/texasTextImage",         "gato-template:components/textimage"},
      {"gato:components/texasState/texasLink",              "gato-template:components/link"},
      {"gato:components/texasState/texas-misc-text",        "gato-template:components/misctext"},
      {"gato:components/texasState/social-media-link",      "gato-template:components/sociallink"},
      {"gato:components/texasState/image-link",             "gato-template:components/imagelink"},
      {"gato:components/texasState/texas-form-edit",        "gato-template:components/formedit"},
      {"gato:components/texasState/texas-form-file",        "gato-template:components/formfile"},
      {"gato:components/texasState/texas-form-selection",   "gato-template:components/formselection"},
      {"gato:components/texasState/texas-form-submit",      "gato-template:components/formsubmit"},
      {"gato:components/texasState/texas-slideshow",        "gato-template-tsus:components/slideshow"},
      {"gato:components/texasState/texas-slideshow-slide",  "gato-template-tsus:components/slide"},
      {"gato:components/texasState/navBlock",								"gato-template:components/sidenav"},
      {"gato:components/tsus/tsus-institution-logo",        "gato-template:components/imagelink"},

      // page templateIds
      {"gato:pages/tsus-2012/tsus-2012-home",               "gato-template-tsus:pages/home"},
      {"gato:pages/tsus-2012/tsus-2012-mail",               "gato-template-tsus:pages/mail"},
      {"gato:pages/tsus-2012/tsus-2012-standard",           "gato-template-tsus:pages/standard"},
      {"gato:pages/main-2009/khan-standard",                "gato-template-txstate2015:pages/standard-template"},
      {"gato:pages/main-2009/khan-mail",                    "gato-template-txstate2015:pages/mail-template"}
    };

    for (String[] namePair : templateNamePairs) {
      tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, namePair[0], namePair[1]));
    }

    // additional tasks in our catch all migration to 5 task
    tasks.add(new Gato5MigrationTask("Gato Migrate to 5 task", "Generic update task for all the things we need to do to upgrade to Magnolia 5."));

    // remove a deprecated servlet filter that was disrupting loading of resources
    tasks.add(new RemoveNodeTask("Remove ClasspathSpool filter", "/server/filters/servlets/ClasspathSpoolServlet"));
    // remove the config node for our defunct gato module
    tasks.add(new RemoveNodeTask("Remove old Gato module config", "/modules/gato"));
    // remove the config node for the old 4.5 migration module
    tasks.add(new RemoveNodeTask("Remove old 4.5 migration config", "/modules/magnolia-4-5-migration"));
    return tasks;
  }

}
