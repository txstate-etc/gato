package edu.txstate.its.gato.setup;

import info.magnolia.cms.core.Path;
import info.magnolia.dam.app.setup.migration.MoveFCKEditorContentToDamMigrationTask;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.link.Link;
import info.magnolia.link.LinkException;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.module.InstallContext;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.PropertyUtil;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.PropertyType;
import javax.jcr.Session;
import javax.jcr.query.QueryResult;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MoveRichEditorToDamTask extends MoveFCKEditorContentToDamMigrationTask {
  private static final Logger log = LoggerFactory.getLogger(MoveRichEditorToDamTask.class);
  protected String templateId;
  protected Map<String, String> copyHistory;

  public MoveRichEditorToDamTask(String templateId, String propertyName) {
    super("DAM Rich Editor Migration", "Move binary files from rich editor properties in the website tree to the DAM.",
      RepositoryConstants.WEBSITE, Arrays.asList("/"), "", propertyName);
    this.templateId = templateId;
    this.copyHistory = new HashMap<String, String>();
  }

  // the property name query they were using didn't work at all so I'm overriding
  // this method from the abstract class to use the template id query from
  // GatoBaseUpgradeTask
  @Override
  protected QueryResult executeQuery(String statement, Session session) {
    try {
      return session.getWorkspace().getQueryManager().
        createQuery("SELECT * FROM [nt:base] WHERE [mgnl:template] = '"+this.templateId+"'", "JCR-SQL2").
        execute();
    } catch (RepositoryException e) {
      log.error("Not able to execute the following query '{}' against the following session '{}'. Exception '{}'", Arrays.asList(statement, session.getWorkspace().getName(), e.getMessage()), e);
      return null;
    }
  }

  @Override
  protected String copyToDam(Node dataNodeResource) throws RepositoryException {
    // figure out where to put our asset
    Node page = dataNodeResource;
    while (!page.getPrimaryNodeType().isNodeType(NodeTypes.Page.NAME)) {
      page = page.getParent();
    }
    String[] path = page.getPath().split("/", 3);
    String damPath = "/"+path[1]+"/migrated_files/richeditor_uploads/"+(path.length > 2 ? path[2] : "");
    Node damParent = NodeUtil.createPath(this.damSession.getRootNode(), damPath, NodeTypes.Folder.NAME);

    // find the filename we will use and ensure it's unique in our parent folder
    String fileName = PropertyUtil.getString(dataNodeResource, AssetNodeTypes.AssetResource.FILENAME);
    fileName = Path.getValidatedLabel(fileName);
    fileName = Path.getUniqueLabel(damParent, fileName);

    // Create an AssetNode
    Node assetNode = damParent.addNode(fileName, AssetNodeTypes.Asset.NAME);
    updateAssetProperty(assetNode, dataNodeResource);
    Node assetNodeResource = assetNode.addNode(AssetNodeTypes.AssetResource.RESOURCE_NAME, AssetNodeTypes.AssetResource.NAME);
    updateResourceProperty(assetNodeResource, dataNodeResource);
    this.damSession.save();

    return assetNode.getIdentifier();
  }

  // in magnolia's task this crashed the upgrade when it encountered a broken link
  protected void handleTextProperty(Node node, Property property) throws LinkException, RepositoryException {
    List<Link> links = collectLinks(property.getString());
    for (Link link : links) {
      try {
        moveResourceNodeAndHandleLink(node, property, link);
      } catch (Exception e) {
        log.warn("No binary linked to the following link '{}'. Please check the property text value '{}'", link.getUUID(), property.getPath());
      }
    }
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

  // I don't understand why these methods were private
  protected void updateAssetProperty(Node assetNode, Node dataNodeResource) throws RepositoryException {
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
      assetNode.setProperty(AssetNodeTypes.Asset.TYPE, dataNodeResource.getProperty(AssetNodeTypes.AssetResource.EXTENSION).getString());
    }
  }

  // updated this method to handle the case where two rich editors point at the
  // same file, e.g. after a page copy.
  protected void moveResourceNodeAndHandleLink(Node node, Property property, Link link) throws RepositoryException {
    if (this.copyHistory.containsKey(link.getUUID())) {
      String damAssetIdentifier = this.copyHistory.get(link.getUUID());
      String damAssetPath = damSession.getNodeByIdentifier(damAssetIdentifier).getPath();
      changeLinkInTextContent(property, damAssetIdentifier, link.getUUID(), damAssetPath, link.getPath());
    } else {
      Node fileNode = node.getSession().getNodeByIdentifier(link.getUUID());
      if (StringUtils.isBlank(link.getPropertyName()) || !fileNode.hasNode(link.getPropertyName())) {
        log.debug("{} is not a bynary link. Nothing will be done.", link.getPath());
        return;
      }
      Node resourceNode = fileNode.getNode(link.getPropertyName());

      if (NodeUtil.isNodeType(resourceNode, NodeTypes.Resource.NAME)) {
        // Move resource Node to DAM
        String damAssetIdentifier = copyToDam(resourceNode);
        this.copyHistory.put(link.getUUID(), damAssetIdentifier);
        String originalFileNodePath = fileNode.getPath();
        String originalFileNodeIdentifier = fileNode.getIdentifier();
        if (damAssetIdentifier != null) {
          fileNode.remove();
          String damAssetPath = damSession.getNodeByIdentifier(damAssetIdentifier).getPath();
          // FIXME MAGNOLIA-5381 Remove the following commented line of code.
          // damAssetIdentifier = DamIdParser.createCompositeId(PathAwareAssetProvider.PROVIDER_ID, damAssetIdentifier);
          log.info("'{}' resource was moved to DAM repository to the following path '{}' and identifier: '{}'", Arrays.asList(originalFileNodePath, damAssetPath, damAssetIdentifier).toArray());
          // Change Link into contentText
          changeLinkInTextContent(property, damAssetIdentifier, originalFileNodeIdentifier, damAssetPath, originalFileNodePath);
        } else {
          log.warn("Could not copy following uploaded data into dam repository: '{}'", node.getPath());
        }
      } else {
        log.warn("The following file node '{}' has no resource node. No migration performed ", NodeUtil.getPathIfPossible(fileNode));
      }
    }
  }

  private void changeLinkInTextContent(Property property, String damAssetIdentifier, String originalFileNodeIdentifier, String damAssetPath, String originalFileNodePath) throws RepositoryException {
    String text = property.getString();
    String fromIdentifier = ":{uuid:{" + originalFileNodeIdentifier + "},repository:{website},";
    String toIdentifier = ":{uuid:{" + damAssetIdentifier + "},repository:{dam},";
    log.info("Replace '{}' by '{}' in the following property '{}'", Arrays.asList(fromIdentifier, toIdentifier, property.getPath()).toArray());
    text = StringUtils.replace(text, fromIdentifier, toIdentifier);
    String fromPath = "},handle:{" + originalFileNodePath + "},nodeData:{document}";
    String toPath = "},handle:{" + damAssetPath + "},nodeData:{" + NodeTypes.Resource.NAME + "}";
    text = StringUtils.replace(text, fromPath, toPath);
    log.info("Replace '{}' by '{}' in the following property '{}'", Arrays.asList(fromPath, toPath, property.getPath()).toArray());
    property.setValue(text);
  }
}
