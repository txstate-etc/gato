/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.txstate.its.gato;

import info.magnolia.cms.core.Content;
import info.magnolia.cms.core.HierarchyManager;
import info.magnolia.cms.core.ItemType;
import info.magnolia.cms.core.version.ContentVersion;
import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
// import info.magnolia.module.admininterface.commands.BaseRepositoryCommand;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.jcr.RepositoryException;
import javax.jcr.UnsupportedRepositoryOperationException;

/**
 *
 * @author seanmctex
 */
public class VersionChangedPagesCommand extends GatoBaseSchedulerCommand {

    public boolean doExecute(Context context) {
        log.info("VersionChangedPagesCommand called. Getting Hierarchy Manager...");

        HierarchyManager hm = MgnlContext.getHierarchyManager(this.getRepository());
        if (hm == null) {
            log.error("Couldn't get Hiererchy Manager for repository: " + this.getRepository());
            return false;
        }

        log.debug("Getting root node...");
        Content rootNode;
        try {
            rootNode = hm.getContent(this.getPath());
        } catch (RepositoryException ex) {
            log.error("Couldn't get node: " + this.getPath());
            return false;
        }


        log.debug("Versioning nodes");
        versionChangedPages(rootNode);

        log.info("VersionChangedPagesCommand completed.");

        return true;
    }

    private void versionChangedPages(Content c) {
        Iterator childNodesIterator = c.getChildren(ItemType.CONTENT).iterator();
        while (childNodesIterator.hasNext()) {
            Content page = (Content) childNodesIterator.next();
            log.debug("Visiting page: " + page.getHandle());
            try {
                ContentVersion baseVersion = page.getBaseVersion();
                log.debug("Page date: " + page.getMetaData().getModificationDate().toString());
                log.debug("Base version date: " + baseVersion.getMetaData().getModificationDate().toString());
                if (page.getMetaData().getModificationDate().after(baseVersion.getMetaData().getModificationDate())) {
                    log.debug("I NEED BACKUP!");
                    versionPage(page);
                }
            } catch (UnsupportedRepositoryOperationException ex) {
                Logger.getLogger(VersionChangedPagesCommand.class.getName()).log(Level.SEVERE, null, ex);
            } catch (RepositoryException ex) {
                log.debug("Page has no stored version. Creating one now.");
                versionPage(page);
            }
            versionChangedPages(page);
        }

    }

    private void versionPage(Content page) {
        try {
            log.info("Versioning page: " + page.getHandle() );
            page.addVersion();
        } catch (Exception ex1) {
            Logger.getLogger(VersionChangedPagesCommand.class.getName()).log(Level.SEVERE, null, ex1);
        }
    }
}
