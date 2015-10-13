package edu.txstate.its.gato.setup;

import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import info.magnolia.jcr.util.PropertyUtil;

import javax.inject.Inject;
import javax.jcr.Session;
import javax.jcr.Node;

import javax.jcr.RepositoryException;
import info.magnolia.module.delta.TaskExecutionException;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * We used to have some paragraphs that had two properties competing to point at a file,
 * one for the Website tree and one for DMS. After moving all binaries to the DAM, this task
 * will consolidate the link into the property that originally pointed at uploads in the
 * Website tree.
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public class ResolveUploadVsDmsTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(ResolveUploadVsDmsTask.class);
  protected String templateId;
  protected String uploadName;
  protected String dmsName;

  @Inject
  public ResolveUploadVsDmsTask(String templateId, String uploadName, String dmsName) {
    super("Resolve "+uploadName+" vs "+dmsName, "Consolidate the image upload in cases where we used to allow choose from DMS in addition to upload to website tree.");
    this.templateId = templateId;
    this.uploadName = uploadName;
    this.dmsName = dmsName;
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, TaskExecutionException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(hm, templateId, this::resolveNode);
  }

  protected void resolveNode(Node n) throws RepositoryException {
    if (n.hasProperty(uploadName) && !StringUtils.isBlank(PropertyUtil.getString(n, uploadName, ""))) {
      //we have a valid upload, it wins
    } else {
      PropertyUtil.setProperty(n, uploadName, "");
      String dmsId = PropertyUtil.getString(n, dmsName, "");
      if (!StringUtils.isBlank(dmsId)) {
        PropertyUtil.setProperty(n, uploadName, "jcr:"+dmsId);
      }
    }
    if (n.hasProperty(dmsName)) n.getProperty(dmsName).remove();
  }
}
