package edu.txstate.its.gato.setup;

import info.magnolia.dam.api.ItemKey;
import info.magnolia.dam.app.setup.migration.MoveFileContentToDamMigrationTask;
import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.objectfactory.Components;
import info.magnolia.repository.RepositoryConstants;

import java.util.Arrays;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.jackrabbit.JcrConstants;

class MoveFileToDamTask extends MoveFileContentToDamMigrationTask {
  private static final Logger log = LoggerFactory.getLogger(MoveFileToDamTask.class);
  protected String folderName;
  protected LinkMigrationLogic lmlogic;
  public MoveFileToDamTask(String propertyName, String folderName) {
    super("DAM Migration - "+propertyName, "Move binary files from the website tree to the DAM.",
      RepositoryConstants.WEBSITE, Arrays.asList("/"), "", propertyName);
    this.folderName = folderName;
    this.lmlogic = Components.getSingleton(LinkMigrationLogic.class);
    this.lmlogic.setMigrationEnabled(true);
  }

  @Override
  protected String createQuery(String path) {
    return super.createQuery("");
  }

  @Override
  protected String copyToDam(Node dataNodeResource) throws RepositoryException {
    Node damItem = lmlogic.migrateResourceNodeToDam(dataNodeResource);
    return damItem.getIdentifier();
  }

  @Override
  protected void handleUploadReferenceForNode(Node resourceNode) throws RepositoryException {
    if (resourceNode.hasProperty(JcrConstants.JCR_DATA)) {
      String propName = resourceNode.getName();
      Node parent = resourceNode.getParent();
      String damAssetIdentifier = copyToDam(resourceNode);
      if (damAssetIdentifier != null) {
        damAssetIdentifier = new ItemKey(DamConstants.DEFAULT_JCR_PROVIDER_ID, damAssetIdentifier).asString();
        parent.setProperty(propName, damAssetIdentifier);
        parent.getSession().save();
      }
    }
  }
}
