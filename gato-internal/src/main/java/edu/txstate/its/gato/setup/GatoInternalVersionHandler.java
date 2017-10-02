package edu.txstate.its.gato.setup;

import edu.txstate.its.gato.GatoLib;

import info.magnolia.cms.security.Permission;
import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.delta.AddPermissionTask;
import info.magnolia.module.delta.BootstrapSingleModuleResource;
import info.magnolia.module.delta.ChangeNodeTypeTask;
import info.magnolia.module.delta.CreateNodeTask;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.FindAndChangeTemplateIdTask;
import info.magnolia.module.delta.IsAuthorInstanceDelegateTask;
import info.magnolia.module.delta.MoveNodeTask;
import info.magnolia.module.delta.NodeExistsDelegateTask;
import info.magnolia.module.delta.OrderNodeBeforeTask;
import info.magnolia.module.delta.RemoveNodeTask;
import info.magnolia.module.delta.RemovePermissionTask;
import info.magnolia.module.delta.RenameNodeTask;
import info.magnolia.module.delta.SetPropertyTask;
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
    register(DeltaBuilder.update("1.0.1", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.commands.website.activate.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.commands.website.deactivate.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.workbench.contentViews.list.columns.modby.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.homepage.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.tools.apps.gatoappsJcrBrowser.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.gato-lib.apps.gatoappsJcrBrowser.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.gato-internal.rest-client.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.IPConfig.allow-all.xml"))
      .addTask(new IsAuthorInstanceDelegateTask("On Public only", (Task)null, new AddPermissionTask("Give anonymous role readonly access to subnodes in gatoapps workspace", "anonymous", GatoLib.WS_GATOAPPS, "/*", Permission.READ, false)))
      .addTask(new AddPermissionTask("Give editor role access to global-links in gatoapps workspace", "editor", GatoLib.WS_GATOAPPS, "/homepage-data/global-links", Permission.READ, true))
      .addTask(new RemovePermissionTask("Revoke editor role access to global-links in website workspace", "editor", RepositoryConstants.WEBSITE, "/homepage-data/global-links", Permission.READ))
      .addTask(new AddPermissionTask("Give main2012-editor role access to homepage-data in gatoapps workspace", "main2012-editor", GatoLib.WS_GATOAPPS, "/homepage-data", Permission.ALL, true))
      .addTask(new AddPermissionTask("Give main2012-editor role access to global-links in gatoapps workspace", "main2012-editor", GatoLib.WS_GATOAPPS, "/homepage-data/global-links", Permission.ALL, true))
      .addTask(new RemovePermissionTask("Revoke main2012-editor role access to global-links in website workspace", "main2012-editor", RepositoryConstants.WEBSITE, "/homepage-data/global-links", Permission.ALL))
      .addTask(new RemovePermissionTask("Revoke main2012-editor role access to homepage-data in website workspace", "main2012-editor", RepositoryConstants.WEBSITE, "/homepage-data", Permission.ALL))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.2", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.gato-lib.dialogs.addFolder.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.addFolder.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam.config.contentDisposition.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actionbar.sections.pagePreviewActions.groups.activationActions.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.scheduler.config.jobs.sort.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.scheduler.config.jobs.sort-dam.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.scheduler.config.jobs.version.xml"))
      .addTask(new BootstrapSingleModuleResource("gatoapps.homepage-data.global-links.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.csv.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.rss.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.ttf.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.eot.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.woff.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.woff2.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.3", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actionbar.sections.pageActions.groups.addingActions.items.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actionbar.sections.pageDeleteActions.groups.addingActions.items.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.confirmPageDeletion.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actions.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actionbar.sections.pageActions.groups.editingFlow.items.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actionbar.sections.pagePreviewActions.groups.editingFlow.items.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actionbar.sections.areaActions.groups.editingFlow.items.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actionbar.sections.componentActions.groups.editingFlow.items.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actionbar.sections.pageNodeAreaActions.groups.editingFlow.items.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.delete.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.activateRecursive.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.restorePreviousVersion.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.delete.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.activate.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.activateRecursive.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.deleteFolder.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.restorePreviousVersion.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.workbench.contentViews.tree.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.externalPreview.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actionbar.sections.pageActions.groups.editingActions.items.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.dialogs.editPage.form.tabs.tabPage.fields.jcrName.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.5", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.dialogs.createPage.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.cas.config.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.6", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.browser.actions.editFolder.availability.rules.IsNotTopLevelRule.xml"))
      .addTask(new RemoveSitewideAreasFromSubpagesTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.7", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.resources.config.resourceFilter.byType.fonts.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.gato-internal.rest-client.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.js.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.manage.permissions.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.dev.apps.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.tools.apps.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.cas.config.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.2017-tsus-home.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.2017-tsus-standard.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.2017-tsus-form.xml"))
      .addTask(new SetPropertyTask(RepositoryConstants.CONFIG, "/server/filters/logout", "class", "info.magnolia.cms.security.auth.logout.CASLogoutFilter"))
      .addTask(new RemoveNodeTask("Remove Gato Apps tool, JCR Browser covers it fine", "/modules/ui-admincentral/config/appLauncherLayout/groups/tools/apps/gatoappsJcrBrowser"))
      .addTask(new RemoveNodeTask("Remove Gato Apps tool config", "/modules/gato-lib/apps/gatoappsJcrBrowser"))
      .addTask(new RemoveNodeTask("Remove defunct adminInterface config", "/modules/adminInterface"))
      .addTask(new UpgradeTsusLogoTask())
      .addTask(new UpgradeSocialmediaTask())
      .addTask(new SetPropertyTask("Allow mixed case logins", RepositoryConstants.CONFIG, "/modules/cas/config", "caseSensitiveUserNames", Boolean.FALSE))
      .addTask(new UpdateTemplateBeneathPathTask("/testing-wittliff", Arrays.asList("gato-template-wittliff:pages/sidebar", "gato-template-txstate2009:pages/standard"), "gato-template-wittliff:pages/standard"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-framework.fieldTypes.multiField.xml"))
      .addTask(new RemoveNodeTask("Remove Wittliff sidebar template", "/modules/site/config/site/templates/availability/templates/wittliff-sidebar"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.wittliff-home.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.detail.actions.changeComponentTemplate.availability.xml"))
      .addTask(new ReformatTSUSPagesTask())
      //.addTask(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, "gato-template-tsus:pages/home", "gato-template-tsus2017:pages/home"))
      .addTask(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, "gato-template-tsus:pages/standard", "gato-template-tsus2017:pages/standard"))
      .addTask(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, "gato-template-tsus:pages/mail", "gato-template-tsus2017:pages/mail"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.dialogs.newComponent.form.tabs.components.fields.mgnl-position.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.8", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.wittliff-events.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.wittliff-special.xml"))
      .addTasks(installOrUpdateTasks())
    );

  }

  protected List<Task> installOrUpdateTasks() {
    List<Task> tasks = new ArrayList<Task>();
    tasks.add(new UpdateTemplateBeneathPathTask("/wittliff-content-examples", Arrays.asList("gato-template-txstate2015:pages/standard-template"), "gato-template-wittliff:pages/standard"));
    tasks.add(new UpdateTemplateBeneathPathTask("/wittliff-content-examples", Arrays.asList("gato-template-txstate2015:pages/mail-template"), "gato-template-wittliff:pages/mail"));
    tasks.add(new UpdateTemplateBeneathPathTask("/tsus-content-examples", Arrays.asList("gato-template-txstate2015:pages/standard-template"), "gato-template-tsus2017:pages/standard"));
    tasks.add(new UpdateTemplateBeneathPathTask("/tsus-content-examples", Arrays.asList("gato-template-txstate2015:pages/mail-template"), "gato-template-tsus2017:pages/mail"));
    tasks.add(new RandomizeCacheStrTask());
    return tasks;
  }

  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> tasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));

    // install global-data nodes if they don't exist
    tasks.add(new NodeExistsDelegateTask("Global Data", "Create global-data node if it does not exist yet.", RepositoryConstants.WEBSITE, "/global-data", null,
        new CreateNodeTask("","",RepositoryConstants.WEBSITE,"/","global-data",NodeTypes.Component.NAME)
    ));

    // make sure legacy links filter comes before aggregator, aggregator will terminate chain
    tasks.add(new OrderNodeBeforeTask("legacylinks", "Put legacy links filter before aggregator filter in the cms chain.", RepositoryConstants.CONFIG, "/server/filters/cms/legacylinks", "aggregator"));

    // tasks for every update
    tasks.addAll(installOrUpdateTasks());
    return tasks;
  }

}
