package edu.txstate.its.gato.setup;

import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.AbstractRepositoryTask;
import info.magnolia.module.delta.TaskExecutionException;

import java.util.Arrays;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Workspace;

import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Lists;

class MoveDmsToDamTask extends AbstractRepositoryTask {
  private static final Logger log = LoggerFactory.getLogger(MoveDmsToDamTask.class);
  private final List<String> originalPathsList;
  private final String targetSubPath;
  private Session damSession;
  private final String dataRepository;
  private Session dataSession;
  private final String originalBinaryName = "document";

  public MoveDmsToDamTask() {
    super("DAM Migration - DMS", "Move binary files from the DMS tree to the DAM.");
    this.dataRepository = "dms";
    this.originalPathsList = Arrays.asList("/");
    this.targetSubPath = "";
  }

  @Override
  public void doExecute(InstallContext ctx) throws TaskExecutionException {
    log.info("Start to move data from '{}' to DAM repository.", dataRepository);
    try {
      // Init
      dataSession = ctx.getJCRSession(dataRepository);
      damSession = ctx.getJCRSession(DamConstants.WORKSPACE);

      for (String path : this.originalPathsList) {
        if (!dataSession.nodeExists(path)) {
          log.warn("Path '{}' does not exist for the repository '{}'. No Data migration will be performed", path, dataRepository);
          continue;
        }
        migrateData(path, this.targetSubPath);
      }

    } catch (Exception e) {
      ctx.error("Unable to perform Migration task " + getName(), e);
      throw new TaskExecutionException(e.getMessage());
    }
    log.info("Successfully moved data to DAM repository: ");
  }

  private void migrateData(String path, String targetSubPath) throws TaskExecutionException {
    String rootDataPath = StringUtils.isNotBlank(targetSubPath) ? targetSubPath + path : path;
    copyNodesFromDataRepositoryToDam(path, targetSubPath);
    convertFoldersToDam(rootDataPath);
    convertContentNodesToDam(rootDataPath);
  }

  /**
   * Copy all nodes from DATA to DAM workspace.
   * Step:
   * Copy from the DATA to DAM workspace in a tmp folder.
   * Merge the TMP folder into the final location.
   */
  protected void copyNodesFromDataRepositoryToDam(String dataPath, String targetSubPath) throws TaskExecutionException {
    log.info("copyNodesFromDataRepositoryToDam("+dataPath+", "+targetSubPath+")");
    try {
      Session dam = this.damSession;
      Session data = this.dataSession;
      for (Node child : NodeUtil.getNodes(data.getRootNode(), NodeTypes.Content.NAME)) {
        String sourcePath = child.getPath();
        String destPath = sourcePath;
        dam.getWorkspace().clone("dms", sourcePath, destPath, true);
        log.info("Following " + "dms" + ":" + sourcePath + " moved to dam:" + destPath);
        dam.save();
      }
    } catch (Exception e) {
      throw new TaskExecutionException("Could not copy nodes from dms to DAM workspace. ", e);
    }
  }

  /**
   * Convert nodes with type=folder to primaryType mgnl:folder.
   */
  private void convertFoldersToDam(String newDAMpath) throws TaskExecutionException {
    try {
      final Node rootDAM = damSession.getNode(newDAMpath);
      NodeUtil.visit(rootDAM, createFolderVisitor());
      damSession.save();

    } catch (RepositoryException e) {
      throw new TaskExecutionException("Could not convert folders to DAM format. ", e);
    }
  }

  /**
   * Convert content nodes to primaryType mgnl:asset.
   */
  private void convertContentNodesToDam(String newDAMpath) throws TaskExecutionException {
    try {
      final Node rootDAM = damSession.getNode(newDAMpath);
      NodeUtil.visit(rootDAM, createDataVisitor());
      damSession.save();
    } catch (RepositoryException e) {
      throw new TaskExecutionException("Could not convert content nodes to DAM format. ", e);
    }
  }

  private NodeVisitor createFolderVisitor() {
    NodeVisitor folderVisitor = new NodeVisitor() {
      @Override
      public void visit(Node node) throws RepositoryException {
        if (isNodeDmsFolder(node)) {
          if (node.hasProperty(AssetNodeTypes.Asset.TYPE)) {
            node.getProperty(AssetNodeTypes.Asset.TYPE).remove();
          }
          node.setPrimaryType(NodeTypes.Folder.NAME);
          log.debug("Node primary Type set to NT_FOLDER for dam: " + node.getPath());
        }
      }
    };

    return folderVisitor;
  }

  private NodeVisitor createDataVisitor() {
    NodeVisitor dataVisitor = new NodeVisitor() {
      @Override
      public void visit(Node node) throws RepositoryException {
        if (isNodeDmsContent(node)) {
          log.debug("Handle Node path " + node.getPath());
          node.setPrimaryType(AssetNodeTypes.Asset.NAME);
          log.debug("Handle Node path " + node.getPath() + " primary type set to " + AssetNodeTypes.Asset.NAME);
          log.debug("Change primary type to '" + AssetNodeTypes.Asset.NAME + "' for : " + node.getPath());

          if (node.hasNode(originalBinaryName)) {
            Node nodeDocument = node.getNode(originalBinaryName);
            node.getSession().move(nodeDocument.getPath(), nodeDocument.getParent().getPath() + "/" + JcrConstants.JCR_CONTENT);
            log.debug("Handle Node path " + nodeDocument.getPath() + " renamed to type jcr:content");
            log.debug("Rename content node to : " + nodeDocument.getPath());
            String extension = "";
            if (nodeDocument.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
              extension = nodeDocument.getProperty(AssetNodeTypes.AssetResource.EXTENSION).getString().toLowerCase();
              if (extension.equals("jpeg")) extension = "jpg";
              nodeDocument.setProperty(AssetNodeTypes.AssetResource.EXTENSION, extension);
            }
            if (nodeDocument.hasProperty(AssetNodeTypes.AssetResource.FILENAME)) {
              nodeDocument.setProperty(AssetNodeTypes.AssetResource.FILENAME,
                nodeDocument.getProperty(AssetNodeTypes.AssetResource.FILENAME).getString()+
                (!StringUtils.isBlank(extension) ? "."+extension : ""));
            }
            if (nodeDocument.hasProperty(AssetNodeTypes.AssetResource.HEIGHT)) {
              nodeDocument.setProperty(AssetNodeTypes.AssetResource.HEIGHT, Long.parseLong(nodeDocument.getProperty(AssetNodeTypes.AssetResource.HEIGHT).getString()));
            }
            if (nodeDocument.hasProperty(AssetNodeTypes.AssetResource.WIDTH)) {
              nodeDocument.setProperty(AssetNodeTypes.AssetResource.WIDTH, Long.parseLong(nodeDocument.getProperty(AssetNodeTypes.AssetResource.WIDTH).getString()));
            }
            if (nodeDocument.hasProperty(AssetNodeTypes.AssetResource.SIZE)) {
              nodeDocument.setProperty(AssetNodeTypes.AssetResource.SIZE, Long.parseLong(nodeDocument.getProperty(AssetNodeTypes.AssetResource.SIZE).getString()));
            }
          }
        }
      }
    };

    return dataVisitor;
  }

  /**
   * Check if the folder is already a DMS folder.
   */
  private boolean isNodeDmsFolder(Node node) throws RepositoryException {
    if (!NodeUtil.isNodeType(node, NodeTypes.Folder.NAME)) {
      if (node.hasProperty("type")) {
        Property type = node.getProperty("type");
        String typeString = type.getString();

        if ("folder".equals(typeString)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if the node is already a DMS Content Node.
   */
  private boolean isNodeDmsContent(Node node) throws RepositoryException {
    if (NodeUtil.isNodeType(node, NodeTypes.ContentNode.NAME)) {
      String id = node.getName();

      if (!"description_files".equals(id)) {
        return true;
      }
    }
    return false;
  }
}
