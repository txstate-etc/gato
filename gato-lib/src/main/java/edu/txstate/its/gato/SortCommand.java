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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SortCommand extends GatoBaseSchedulerCommand {
  public static Logger log = LoggerFactory.getLogger(SortCommand.class);

  public String nameWithIndex(Node n) throws Exception {
    if (n.getIndex() == 1) return n.getName();
    return n.getName()+"["+n.getIndex()+"]";
  }

  public boolean doExecute(Context context) {
    log.info("SortCommand called. Getting JCR Session for repository {} ...", this.getRepository());

    try {
      Session session = MgnlContext.getJCRSession(this.getRepository());

      log.debug("Getting root node...");
      Node rootNode = session.getNode(this.getPath());

      boolean isSorted = false;

      while (!isSorted) {
        isSorted = true;
        Node previousSite = null;

        Iterator childNodesIterator = NodeUtil.getNodes(rootNode).iterator();
        while (childNodesIterator.hasNext()) {
          Node site = (Node) childNodesIterator.next();
          if (previousSite != null) {
            String siteName = nameWithIndex(site);
            String prevName = nameWithIndex(previousSite);
            if (siteName.compareToIgnoreCase(prevName) < 0) {
              log.info("Moving " + siteName + " before " + prevName);
              rootNode.orderBefore(siteName, prevName);
              rootNode.save();
              isSorted = false;
            }
          }
          previousSite = site;
        }
      }

      log.info("SortCommand completed for repository {}.", this.getRepository());
      return true;

    } catch (Exception e) {
      log.error("SortCommand failed for repository: {}", this.getRepository(), e);
      return false;
    }
  }
}
