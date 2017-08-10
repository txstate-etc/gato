package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.objectfactory.Components;
import info.magnolia.repository.RepositoryConstants;

import java.util.Arrays;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateTemplateBeneathPathTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateTemplateBeneathPathTask.class);

  protected String path;
  protected String templateId;
  protected List<String> templateIds;

  public UpdateTemplateBeneathPathTask(String path, List<String> templateIds, String templateId) {
    super("Update Template", "Change templates beneath and including path "+path);
    this.path = path;
    this.templateId = templateId;
    this.templateIds = templateIds;
  }

  @Override
  protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
    log.warn("Updating templates beneath "+path+" to "+templateId);
    Session s = installContext.getJCRSession(RepositoryConstants.WEBSITE);

    visitSubPages(s, path, page -> {
      try {
        String oldtemplate = NodeTypes.Renderable.getTemplate(page);
        if (templateIds.contains(oldtemplate)) {
          NodeTypes.Renderable.set(page, templateId);
          log.info("Page {}: template changed from {} to {}", page.getPath(), oldtemplate, templateId);
        }
      } catch (RepositoryException e) {
          log.warn("Could not change template for "+path+".", e);
      }
    });
  }

}
