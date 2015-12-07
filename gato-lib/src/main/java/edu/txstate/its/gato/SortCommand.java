package edu.txstate.its.gato;

import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import java.util.Iterator;
import java.util.Vector;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

public class SortCommand extends GatoBaseSchedulerCommand {
  
  private boolean canSort(Node rootNode) throws RepositoryException {
    Vector paths = new Vector();
    String duplicates = "";

    Iterator childNodesIterator = NodeUtil.getNodes(rootNode, NodeTypes.Content.NAME).iterator();
    while (childNodesIterator.hasNext()) {
      Node site = (Node) childNodesIterator.next();
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

  public boolean doExecute(Context context) {
    log.info("SortCommand called. Getting JCR Session...");

    try {
      Session session = MgnlContext.getJCRSession(this.getRepository());

      log.debug("Getting root node...");
      Node rootNode = session.getNode(this.getPath());

      if (canSort(rootNode)) {
        log.debug("Sorting nodes");

        boolean isSorted = false;

        while (!isSorted) {
          isSorted = true;
          Node previousSite = null;

          Iterator childNodesIterator = NodeUtil.getNodes(rootNode, NodeTypes.Page.NAME).iterator();
          while (childNodesIterator.hasNext()) {
            Node site = (Node) childNodesIterator.next();
            String title = PropertyUtil.getString(site, "title");
            String prevTitle = PropertyUtil.getString(previousSite, "title");
            if ((previousSite != null) && (title.compareToIgnoreCase(prevTitle) < 0)) {
              log.debug("Moving " + title + " before " + prevTitle);
              rootNode.orderBefore(site.getName(), previousSite.getName());
              rootNode.save();
              isSorted = false;
            }
            previousSite = site;
          }

        }

      }

      log.info("SortCommand completed.");
      return true;

    } catch (RepositoryException e) {
      log.error("SortCommand failed for repository: {}", this.getRepository(), e);
      return false;
    }
  }
}
