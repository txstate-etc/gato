package edu.txstate.its.gato.apputil; 

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.ui.workbench.tree.drop.BaseDropConstraint;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.data.Item;

public class GatoDropConstraint extends BaseDropConstraint {
  private static final Logger log = LoggerFactory.getLogger(GatoDropConstraint.class);

  private static final String folderTyoe = NodeTypes.Content.NAME;
  private static final String nodeType = NodeTypes.Component.NAME;

  public GatoDropConstraint() {
    super(nodeType);
  }

  @Override
  public boolean allowedAsChild(Item sourceItem, Item targetItem) {
    if (!super.allowedAsChild(sourceItem, targetItem)) {
      return false;
    }

    try {
      JcrNodeAdapter source = (JcrNodeAdapter) sourceItem;
      JcrNodeAdapter target = (JcrNodeAdapter) targetItem;
      String sourceNodeType = source.applyChanges().getPrimaryNodeType().getName();
      String targetNodeType = target.applyChanges().getPrimaryNodeType().getName();

      // If source is a folder and target of nodeType, return false
      if (folderTyoe.equals(sourceNodeType) && nodeType.equals(targetNodeType)) {
          log.debug("Could not move a Folder under a node type '{}'", targetNodeType);
          return false;
      }
      // If source is a folder and target is a folder, return false
      if (folderTyoe.equals(sourceNodeType) && folderTyoe.equals(targetNodeType)) {
          log.debug("Could not move a Folder under a Folder");
          return false;
      }

    } catch (RepositoryException e) {
      log.warn("Could not check if child is allowed. ", e);
    }
    return true;
  }
}
