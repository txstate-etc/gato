/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.txstate.its.gato;

import info.magnolia.cms.core.version.VersionManager;
import info.magnolia.context.Context;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import java.util.Calendar;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.version.Version;
import javax.jcr.LoginException;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author seanmctex
 */
public class VersionChangedPagesCommand extends GatoBaseSchedulerCommand {
  private static final Logger log = LoggerFactory.getLogger(VersionChangedPagesCommand.class);
  private VersionManager vm;

  public boolean doExecute(Context context) throws LoginException, RepositoryException {
    log.info("VersionChangedPagesCommand called. Getting JCR Session...");
    Session s = context.getJCRSession(this.getRepository());
    if (s == null) {
      log.error("Couldn't get JCR Session for repository: " + this.getRepository());
      return false;
    }

    log.info("Getting VersionManager...");
    vm = VersionManager.getInstance();

    log.debug("Getting root node...");
    Node rootNode;
    try {
      rootNode = s.getNode(this.getPath());
    } catch (RepositoryException ex) {
      log.error("Couldn't get node: " + this.getPath());
      return false;
    }

    log.debug("Versioning nodes");
    versionChangedPages(rootNode);

    log.info("VersionChangedPagesCommand completed.");
    return true;
  }

  private void versionChangedPages(Node page) throws RepositoryException {
    for (Node subpage : NodeUtil.getNodes(page, NodeTypes.Page.NAME)) {
      log.debug("Visiting page: " + subpage.getPath());

      try {
        Calendar versiondate = null;
        if (vm.getAllVersions(subpage) != null) {
          Version baseVersion = vm.getBaseVersion(subpage);
          versiondate = baseVersion.getCreated();
        }
        Calendar lastmod = NodeTypes.LastModified.getLastModified(subpage);
        log.debug("Page date: " + lastmod.toString());
        if (versiondate != null) log.debug("Base version date: " + versiondate.toString());
        else log.debug("Base version date: no base version existed");
        if (versiondate == null || lastmod.after(versiondate)) {
          log.debug("I NEED BACKUP!");
          Version newVersion = vm.addVersion(subpage);
        }
      } catch (Exception e) {
        log.error("Unable to add a version for this page.", e);
      }
      versionChangedPages(subpage);
    }
  }
}
