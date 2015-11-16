package edu.txstate.its.gato.setup;

import info.magnolia.cms.core.Path;
import info.magnolia.dam.app.setup.migration.MoveFileContentToDamMigrationTask;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.module.InstallContext;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.PropertyUtil;
import javax.jcr.Node;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

import java.util.Arrays;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.core.NodeImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MoveFileToDamTask extends MoveFileContentToDamMigrationTask {
  private static final Logger log = LoggerFactory.getLogger(MoveFileToDamTask.class);
  protected String folderName;
  public MoveFileToDamTask(String propertyName, String folderName) {
    super("DAM Migration - "+propertyName, "Move binary files from the website tree to the DAM.",
      RepositoryConstants.WEBSITE, Arrays.asList("/"), "", propertyName);
    this.folderName = folderName;
  }

  @Override
  protected String createQuery(String path) {
    return super.createQuery("");
  }

  @Override
  protected String copyToDam(Node dataNodeResource) throws RepositoryException {
    // figure out where to put our asset
    Node page = dataNodeResource;
    while (!page.getPrimaryNodeType().isNodeType(NodeTypes.Page.NAME)) {
      page = page.getParent();
    }
    String[] path = page.getPath().split("/", 3);
    String damPath = "/"+path[1]+"/migrated_files/"+this.folderName+"/"+(path.length > 2 ? path[2] : "");
    if (dataNodeResource.getPath().contains("/gato-banners/"))
      damPath = "/banner-images/"+path[1];
    Node damParent = NodeUtil.createPath(this.damSession.getRootNode(), damPath, NodeTypes.Folder.NAME);

    // find the filename we will use and ensure it's unique in our parent folder
    String fileName = PropertyUtil.getString(dataNodeResource, AssetNodeTypes.AssetResource.FILENAME);
    fileName = Path.getValidatedLabel(fileName);
    fileName = Path.getUniqueLabel(damParent, fileName);

    // Create an AssetNode
    Node assetNode;
    try {
      assetNode = damSession.getNodeByIdentifier(dataNodeResource.getIdentifier());
    } catch (Exception e) {
      assetNode = ((NodeImpl)NodeUtil.unwrap(damParent)).addNodeWithUuid(fileName, AssetNodeTypes.Asset.NAME, dataNodeResource.getIdentifier());
      updateAssetProperty(assetNode, dataNodeResource);
      Node assetNodeResource = assetNode.addNode(AssetNodeTypes.AssetResource.RESOURCE_NAME, AssetNodeTypes.AssetResource.NAME);
      updateResourceProperty(assetNodeResource, dataNodeResource);
      this.damSession.save();
    }

    return assetNode.getIdentifier();
  }

  // I don't understand why these methods were private
  protected void updateAssetProperty(Node assetNode, Node dataNodeResource) throws RepositoryException {
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
      assetNode.setProperty(AssetNodeTypes.Asset.TYPE, dataNodeResource.getProperty(AssetNodeTypes.AssetResource.EXTENSION).getString());
    }
    NodeTypes.LastModified.update(assetNode);
  }

  // Updated this method to normalize file extensions a bit - also it was a little broken
  // since the DAM expects the filename property to include the extension
  protected void updateResourceProperty(Node assetNodeResource, Node dataNodeResource) throws RepositoryException {
    String extension = "";
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
      extension = dataNodeResource.getProperty(AssetNodeTypes.AssetResource.EXTENSION).getString().toLowerCase();
      if (extension.equals("jpeg")) extension = "jpg";
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.EXTENSION, extension);
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.FILENAME)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.FILENAME,
        dataNodeResource.getProperty(AssetNodeTypes.AssetResource.FILENAME).getString()+
        (!StringUtils.isBlank(extension) ? "."+extension : ""));
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.HEIGHT)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.HEIGHT, Long.parseLong(dataNodeResource.getProperty(AssetNodeTypes.AssetResource.HEIGHT).getString()));
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.WIDTH)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.WIDTH, Long.parseLong(dataNodeResource.getProperty(AssetNodeTypes.AssetResource.WIDTH).getString()));
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.SIZE)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.SIZE, Long.parseLong(dataNodeResource.getProperty(AssetNodeTypes.AssetResource.SIZE).getString()));
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.DATA)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.DATA, dataNodeResource.getProperty(AssetNodeTypes.AssetResource.DATA).getBinary());
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.MIMETYPE)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.MIMETYPE, dataNodeResource.getProperty(AssetNodeTypes.AssetResource.MIMETYPE).getString());
    }
  }
}
