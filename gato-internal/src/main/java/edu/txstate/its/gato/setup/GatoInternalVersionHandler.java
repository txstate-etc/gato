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
import info.magnolia.module.delta.OrderFilterBeforeTask;
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
      .addTask(new UpgradeSocialmediaTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.0.9", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.resources.config.resourceFilter.byType.scss.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.scss.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.resources.config.resourceFilter.byType.cjs.xml"))
      .addTask(new BootstrapSingleModuleResource("config.server.MIMEMapping.cjs.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.emergency.xml"))
      .addTask(new RssCardShowTimeTask())
      .addTask(new SetPropertyTask("Allow mixed case logins", RepositoryConstants.CONFIG, "/modules/cas/config", "caseSensitiveUserNames", Boolean.FALSE))
      .addTask(new UpdateHeroSliderTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.1.0", "")
      .addTasks(installOrUpdateTasks())
      .addTask(new UpdateWittliffBannersTask())
      .addTask(new UpdateCardLayoutFiltersTask())
    );

    register(DeltaBuilder.update("1.1.1", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.trumba.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.mobilefirst-home.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-framework.fieldTypes.multiField.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.dam-app.apps.assets.subApps.detail.editor.form.tabs.asset.fields.resource.xml"))
      .addTask(new BootstrapSingleModuleResource("gatoapps.homepage-data.global-links.mobileFirstFooter.xml"))
      .addTask(new BootstrapSingleModuleResource("gatoapps.homepage-data.global-links.defaultSocial.xml"))
      .addTask(new BootstrapSingleModuleResource("gatoapps.homepage-data.global-links.mobileFirstResources.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.admissions-home.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.mobilefirst-standard.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.admissions-standard.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.mobilefirst-mail.xml"))
      .addTask(new MigrateToTrumbaTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.1.2", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.mobilefirst-standard.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.admissions-standard.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.mobilefirst-mail.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.admissions-mail.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.1.3", "")
      .addTask(new UpdateFAQToComponentsTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.0", "")
      .addTask(new SetPropertyTask("Disable Magnolia default publishing receiver", RepositoryConstants.CONFIG, "/modules/publishing-core/config/receivers/magnoliaPublic8080", "enabled", Boolean.FALSE ))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.mobilefirst-filterablesearch.xml"))
    );

    register(DeltaBuilder.update("1.2.1", "")
      .addTask(new SetPropertyTask("Automatically open the Add Component dialog in wide mode", RepositoryConstants.CONFIG, "/modules/pages/dialogs/newComponent", "wide", Boolean.TRUE ))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.2015-filterablesearch.xml"))
    );

    register(DeltaBuilder.update("1.2.2", "")
      .addTask(new RenameMobileFirstResourcesAreaTask())
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.txst-home.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.txst-landing.xml"))
      .addTask(new AddMobileFirstFooterLinkHeadersTask())
      .addTask(new SetPropertyTask("REVERT - Automatically open the Add Component dialog in wide mode", RepositoryConstants.CONFIG, "/modules/pages/dialogs/newComponent", "wide", Boolean.FALSE ))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.3", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.calico-informational.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.4", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.txst-passthrough.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.calico-sitemap.xml"))
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.5", "")
      .addTask(new BootstrapSingleModuleResource("gatoapps.homepage-data.emergency.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.homepage.apps.emergency.xml"))
      .addTask(new BootstrapSingleModuleResource("gatoapps.homepage-data.home-hero.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.ui-admincentral.config.appLauncherLayout.groups.homepage.apps.home-hero.xml"))
    );

    register(DeltaBuilder.update("1.2.6", "")
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.txst-search.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.calico-sitemap.roles.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.site.config.site.templates.availability.templates.2015-sitemap.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.gato-internal.commands.gato.createSiteMaps.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.scheduler.config.jobs.createSiteMaps.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.confirmDeletion.availability.rules.IsNotSiteMapRule.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.confirmPageDeletion.availability.rules.IsNotSiteMapRule.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.deactivate.availability.rules.IsNotSiteMapRule.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.editPageName.availability.rules.IsNotSiteMapRule.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.editTemplate.availability.rules.IsNotSiteMapRule.xml"))
      .addTask(new BootstrapSingleModuleResource("config.modules.pages.apps.pages.subApps.browser.actions.move.availability.rules.IsNotSiteMapRule.xml"))
    );

    register(DeltaBuilder.update("1.2.7", "")
      .addTask(new UpdateCalicoHerosTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.8", "")
      .addTask(new SetPropertyTask(RepositoryConstants.CONFIG, "/modules/site/config/site/templates/availability", "class", "edu.txstate.its.gato.apputil.CalicoTemplateAvailability"))
      .addTask(new FilterableSearchAddDataSourceTask())
      .addTask(new UpdateCalicoColorsTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.9", "")
      .addTask(new RemoveNodeTask("Remove Homepage Events Tool, Not Used in New Homepage", "/modules/ui-admincentral/config/appLauncherLayout/groups/homepage/apps/events"))
      .addTask(new RemoveNodeTask("Remove Homepage Top Slider Tool, Not Used in New Homepage", "/modules/ui-admincentral/config/appLauncherLayout/groups/homepage/apps/top-slider"))
      .addTask(new RemoveNodeTask("Remove Homepage News Feature Tool, Not Used in New Homepage", "/modules/ui-admincentral/config/appLauncherLayout/groups/homepage/apps/news-feature"))
      .addTask(new RemoveNodeTask("Remove Homepage Research Slider Tool, Not Used in New Homepage", "/modules/ui-admincentral/config/appLauncherLayout/groups/homepage/apps/research-slider"))
      .addTask(new FilterableSearchDirectoryUpdate())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.2.10", "")
      .addTask(new RemoveNodeTask("Remove Old Homepage Events Data", "Remove data for old homepage events tool", "gatoapps", "/homepage-data/events-dates"))
      .addTask(new RemoveNodeTask("Remove Old Homepage Features Data", "Remove data for old homepage news feature, research slider, and top slider", "gatoapps", "/homepage-data/features"))
      .addTask(new UpdateFormSelectionFieldDataTask())
      .addTasks(installOrUpdateTasks())
    );

    register(DeltaBuilder.update("1.3.0", "")
      .addTask(new RemoveCalicoInformationalTemplateTask())
      .addTask(new RemoveNodeTask("Remove Calico Informational Template", "Remove calico informational template from Sites", "config", "/modules/site/config/site/templates/availability/templates/calico-informational"))
      .addTask(new SetPropertyTask(RepositoryConstants.CONFIG, "/modules/pages/apps/pages/subApps/detail/actions/addComponent", "class", "edu.txstate.its.gato.GatoCreateComponentActionDefinition"))
      .addTasks(installOrUpdateTasks())
    );
  }

  protected List<Task> installOrUpdateTasks() {
    List<Task> tasks = new ArrayList<Task>();
    tasks.add(new UpdateTemplateBeneathPathTask("/wittliff-content-examples", Arrays.asList("gato-template-txstate2015:pages/standard-template"), "gato-template-wittliff:pages/standard"));
    tasks.add(new UpdateTemplateBeneathPathTask("/wittliff-content-examples", Arrays.asList("gato-template-txstate2015:pages/mail-template"), "gato-template-wittliff:pages/mail"));
    tasks.add(new UpdateTemplateBeneathPathTask("/tsus-content-examples", Arrays.asList("gato-template-txstate2015:pages/standard-template"), "gato-template-tsus2017:pages/standard"));
    tasks.add(new UpdateTemplateBeneathPathTask("/tsus-content-examples", Arrays.asList("gato-template-txstate2015:pages/mail-template"), "gato-template-tsus2017:pages/mail"));
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/server/filters/servlets/ResourcesServlet", "servletClass", "edu.txstate.its.gato.GatoResourcesServlet"));
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/modules/pages/apps/pages/subApps/detail/actions/pasteComponents/availability/rules/acceptsClipboardContent", "implementationClass", "edu.txstate.its.gato.GatoPasteComponentAvailability"));
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/modules/pages/apps/pages/subApps/detail/actions/pasteComponents/availability/rules/isComponentAddible", "implementationClass", "edu.txstate.its.gato.GatoIsElementAddibleRule"));
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/modules/pages/apps/pages/subApps/detail/actions/pasteComponents", "class", "edu.txstate.its.gato.GatoPasteComponentActionDefinition"));
    tasks.add(new BootstrapSingleModuleResource("config.server.MIMEMapping.scss.xml"));
    tasks.add(new BootstrapSingleModuleResource("config.server.MIMEMapping.cjs.xml"));
    tasks.add(new RandomizeCacheStrTask());
    tasks.add(new RemoveHotfixesTask());
    // make sure legacy links filter comes before aggregator, aggregator will terminate chain
    tasks.add(new OrderNodeBeforeTask("legacylinks", "Put legacy links filter before aggregator filter in the cms chain.", RepositoryConstants.CONFIG, "/server/filters/cms/legacylinks", "aggregator"));
    // must be after aggregator but before rendering
    tasks.add(new OrderNodeBeforeTask("gatoSecurity", "Put our protected pages filter before the rendering filter.", RepositoryConstants.CONFIG, "/server/filters/cms/gatoSecurity", "rendering"));
    return tasks;
  }

  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> tasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));

    // install global-data nodes if they don't exist
    tasks.add(new NodeExistsDelegateTask("Global Data", "Create global-data node if it does not exist yet.", RepositoryConstants.WEBSITE, "/global-data", null,
        new CreateNodeTask("","",RepositoryConstants.WEBSITE,"/","global-data",NodeTypes.Component.NAME)
    ));

    // config tree changes that we don't want to bootstrap
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/server/filters/logout", "class", "info.magnolia.cms.security.auth.logout.CASLogoutFilter"));
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/server/filters/servlets/ResourcesServlet", "servletClass", "edu.txstate.its.gato.GatoResourcesServlet"));
    tasks.add(new SetPropertyTask("Allow mixed case logins", RepositoryConstants.CONFIG, "/modules/cas/config", "caseSensitiveUserNames", Boolean.FALSE));

    // tasks for every update
    tasks.addAll(installOrUpdateTasks());
    return tasks;
  }

}
