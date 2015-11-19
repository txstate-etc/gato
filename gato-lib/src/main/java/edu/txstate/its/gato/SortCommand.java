package edu.txstate.its.gato;

import info.magnolia.cms.beans.config.ContentRepository;
import info.magnolia.cms.core.Content;
import info.magnolia.cms.core.HierarchyManager;
import info.magnolia.cms.core.ItemType;
import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
// import info.magnolia.module.admininterface.commands.BaseRepositoryCommand;
import java.util.Iterator;
import java.util.Vector;
import javax.jcr.RepositoryException;

public class SortCommand extends GatoBaseSchedulerCommand {
  
  private boolean canSort(Content rootNode) {
    Vector paths = new Vector();
    String duplicates = "";

    Iterator childNodesIterator = rootNode.getChildren(ItemType.CONTENT).iterator();
    while (childNodesIterator.hasNext()) {
      Content site = (Content) childNodesIterator.next();
      String siteName = site.getName();
      if ( paths.contains( siteName ) ) {
        duplicates = duplicates + " " + siteName;
      } else {
        paths.add( siteName );
      }
    }

    if ( duplicates.equals("") ) {
      return true;
    } else {
      log.error("Can't sort because there are multiple nodes named: " + duplicates );
      return false;
    }

  }

  public boolean execute(Context context) {
    log.info("SortCommand called. But it doesn't work, so we're not doing anything...");
    // log.info("SortCommand called. Getting Hierarchy Manager...");

    // HierarchyManager hm = MgnlContext.getHierarchyManager(this.getRepository());

    // if (hm == null) {
    //   log.error("Couldn't get Hiererchy Manager for repository: " + this.getRepository());
    //   return false;
    // }

    // log.debug("Getting root node...");
    // Content rootNode;
    // try {
    //   rootNode = hm.getContent(this.getPath());
    // } catch (RepositoryException ex) {
    //   log.error("Couldn't get node: " + this.getPath());
    //   return false;
    // }

    // if (canSort(rootNode)) {
    //   log.debug("Sorting nodes");

    //   boolean isSorted = false;
    //   int outer = 0;

    //   while (!isSorted) {
    //     log.debug("outer " + outer++);
    //     Iterator childNodesIterator = rootNode.getChildren(ItemType.CONTENT).iterator();

    //     isSorted = true;
    //     Content previousSite = null;
    //     int inner = 0;

    //     while (childNodesIterator.hasNext()) {
    //       log.debug("inner " + inner++);
    //       Content site = (Content) childNodesIterator.next();
    //       log.debug("site " + site.getTitle());
    //       if ((previousSite != null) && (site.getTitle().compareToIgnoreCase(previousSite.getTitle()) < 0)) {
    //         try {
    //           log.debug("Moving " + site.getTitle() + " before " + previousSite.getTitle());
    //           rootNode.orderBefore(site.getName(), previousSite.getName());
    //           rootNode.save();
    //           isSorted = false;
    //         } catch (RepositoryException ex) {
    //           ex.printStackTrace();
    //         }
    //       }
    //       previousSite = site;
    //     }

    //   }

    // }

    log.info("SortCommand completed.");
    return true;
  }
}
