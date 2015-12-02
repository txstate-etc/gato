package edu.txstate.its.gato.setup;

import info.magnolia.dam.app.setup.migration.MoveFCKEditorContentToDamMigrationTask;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.link.Link;
import info.magnolia.link.LinkUtil;
import info.magnolia.link.LinkException;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.module.InstallContext;
import info.magnolia.objectfactory.Components;
import info.magnolia.templating.functions.TemplatingFunctions;

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

import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.core.NodeImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MoveRichEditorToDamTask extends MoveFCKEditorContentToDamMigrationTask {
  private static final Logger log = LoggerFactory.getLogger(MoveRichEditorToDamTask.class);
  protected String templateId;
  protected Map<String, String> copyHistory;
  protected TemplatingFunctions cmsfn;

  public MoveRichEditorToDamTask(String templateId, String propertyName) {
    super("DAM Rich Editor Migration", "Move binary files from rich editor properties in the website tree to the DAM.",
      RepositoryConstants.WEBSITE, Arrays.asList("/"), "", propertyName);
    this.templateId = templateId;
    this.copyHistory = new HashMap<String, String>();
    this.cmsfn = Components.getComponent(TemplatingFunctions.class);
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
  protected void handleUploadReferenceForNode(Node node) throws RepositoryException {
    try {
      if (node.hasProperty(getPropertyValue())) handleTextProperty(node, node.getProperty(getPropertyValue()));
    } catch (Exception e) {
      log.warn("Not able to handle the following node '{}'", NodeUtil.getName(node), e);
    }
  }

  @Override
  protected String copyToDam(Node dataNodeResource) throws RepositoryException {
    // figure out where to put our asset
    Node page = cmsfn.page(dataNodeResource);
    String[] path = page.getPath().split("/", 3);
    String damPath = "/"+path[1]+"/migrated_files/richeditor_uploads/"+(path.length > 2 ? path[2] : "");
    Node damParent = NodeUtil.createPath(this.damSession.getRootNode(), damPath, NodeTypes.Folder.NAME);

    // find the filename we will use and ensure it's unique in our parent folder
    String fileName = PropertyUtil.getString(dataNodeResource, AssetNodeTypes.AssetResource.FILENAME);
    fileName = info.magnolia.cms.core.Path.getValidatedLabel(fileName);
    fileName = info.magnolia.cms.core.Path.getUniqueLabel(damParent, fileName);

    // Create an AssetNode
    Node assetNode = ((NodeImpl)NodeUtil.unwrap(damParent)).addNodeWithUuid(fileName, AssetNodeTypes.Asset.NAME, dataNodeResource.getIdentifier());
    updateAssetProperty(assetNode, dataNodeResource);
    Node assetNodeResource = assetNode.addNode(AssetNodeTypes.AssetResource.RESOURCE_NAME, AssetNodeTypes.AssetResource.NAME);
    updateResourceProperty(assetNodeResource, dataNodeResource);
    this.damSession.save();

    return assetNode.getIdentifier();
  }

  // in magnolia's task this crashed the upgrade when it encountered a broken link
  public final Pattern HREF_PATTERN = Pattern.compile("(href\\s*=\\s*['\"])([^'\"]+)(['\"])");
  public final Pattern SRC_PATTERN = Pattern.compile("(src\\s*=\\s*['\"])([^'\"]+)(['\"])");
  public final Pattern URL_PATTERN = Pattern.compile("(url\\(['\"]?)([^\\)]*)(['\"]?\\))");
  protected void handleTextProperty(Node node, Property property) throws LinkException, RepositoryException {
    String propString = property.getString();
    if (StringUtils.isBlank(propString)) return;
    List<Link> links = collectLinks(propString);
    for (Link link : links) {
      try {
        moveResourceNodeAndHandleLink(node, property, link);
      } catch (Exception e) {
        log.warn(e.toString(), e);
      }
    }

    propString = property.getString();
    //now look for relative links that never got converted to magnolia's {{}} style
    List<Pattern> patterns = Arrays.asList(HREF_PATTERN, SRC_PATTERN, URL_PATTERN);
    for (Pattern p : patterns) {
      StringBuffer result = new StringBuffer();
      Matcher matcher = p.matcher(propString);
      while (matcher.find()) {
        String path = matcher.group(2);
        if (path.startsWith("${")) {
          // these are not the links you're looking for
        } else if (LinkUtil.isInternalRelativeLink(path)) {
          // let's see if we have a path to an image
          Node page = cmsfn.page(node);
          if (page != null) {
            Path filepath = Paths.get(path);
            Path pagepath = Paths.get(page.getPath());

            // first we'll assume that the filename is also the resource node
            // this is how things were saved in CKEditor
            String newLink = convertWebsitePathToDamLink(
              Paths.get(pagepath.getParent().toString() +"/"+ filepath.toString().replaceAll("\\.[^\\.]+$","")),
              node
            );
            // if that didn't work, we'll assume the filename is just there
            // for fluff and strip it off, this is how it worked in FCKEditor
            if (StringUtils.isBlank(newLink))
              newLink = convertWebsitePathToDamLink(
                  Paths.get(pagepath.getParent().toString() +"/"+ filepath.getParent().toString()),
                  node
                );

            if (!StringUtils.isBlank(newLink))
              path = newLink;
          }

        // let's see if we have a DMS link
        } else if (path.startsWith("/dms/")) {
          try {
            Path dmspath = Paths.get(path.substring(4));
            Node damItem = damSession.getNode(dmspath.getParent().toString());
            path = getDamLink(damItem);
          } catch (Exception e) {
            // no match, we tried
          }

        // let's see if we have a gato-docs link
        } else if (path.startsWith("http://gato-docs.its.txstate.edu/")) {
          Path dmspath = Paths.get(path.substring(32).replaceAll("\\.[^\\.]+$", ""));
          Node damItem = null;
          try {
            damItem = damSession.getNode(dmspath.toString());
          } catch (Exception e) {
            try {
              damItem = damSession.getNode(dmspath.getParent().toString());
            } catch (Exception e2) {
              // no match, give up
            }
          }
          if (damItem != null && NodeUtil.isNodeType(damItem, AssetNodeTypes.Asset.NAME))
            path = getDamLink(damItem);
        }

        matcher.appendReplacement(result, "$1" + Matcher.quoteReplacement(path) + "$3");
      }
      matcher.appendTail(result);
      propString = result.toString();
    }
    property.setValue(propString);
  }

  protected String convertWebsitePathToDamLink(Path jcrpath, Node node) {
    try {
      String damuuid = "";
      String historykey = "website:"+jcrpath.getParent().toString()+":"+jcrpath.getFileName().toString();
      if (this.copyHistory.containsKey(historykey)) {
        damuuid = this.copyHistory.get(historykey);
      } else {
        Node dataResourceNode = node.getSession().getNode(jcrpath.toString());
        if (dataResourceNode.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
          damuuid = copyToDam(dataResourceNode);
          this.copyHistory.put(historykey, damuuid);
        }
      }
      if (StringUtils.isBlank(damuuid)) return "";
      return getDamLink(damSession.getNodeByIdentifier(damuuid));
    } catch (Exception e) {
      // didn't work, we tried
    }
    return "";
  }

  protected String getExtension(Node dataNodeResource) {
    String extension = PropertyUtil.getString(dataNodeResource, AssetNodeTypes.AssetResource.EXTENSION, "").toLowerCase();
    if (extension.equals("jpeg")) extension = "jpg";
    return extension;
  }

  // I don't understand why these methods were private
  protected void updateAssetProperty(Node assetNode, Node dataNodeResource) throws RepositoryException {
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
      assetNode.setProperty(AssetNodeTypes.Asset.TYPE, getExtension(dataNodeResource));
    }
    NodeTypes.LastModified.update(assetNode);
  }

  // Updated this method to normalize file extensions a bit - also it was a little broken
  // since the DAM expects the filename property to include the extension
  protected void updateResourceProperty(Node assetNodeResource, Node dataNodeResource) throws RepositoryException {
    String extension = getExtension(dataNodeResource);
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.EXTENSION)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.EXTENSION, extension);
    }
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.FILENAME)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.FILENAME,
        dataNodeResource.getProperty(AssetNodeTypes.AssetResource.FILENAME).getString()+
        (!StringUtils.isBlank(extension) ? "."+extension : ""));
    }
    ImageSize imageSize = null;
    if (dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.HEIGHT)) {
      imageSize = new ImageSize(dataNodeResource,
        PropertyUtil.getLong(dataNodeResource, AssetNodeTypes.AssetResource.WIDTH, 0l),
        PropertyUtil.getLong(dataNodeResource, AssetNodeTypes.AssetResource.HEIGHT, 0l)
      );
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.HEIGHT, imageSize.getHeight());
    }
    if (imageSize != null && dataNodeResource.hasProperty(AssetNodeTypes.AssetResource.WIDTH)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.WIDTH, imageSize.getWidth());
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

  // updated this method to handle the case where two rich editors point at the
  // same file, e.g. after a page copy.
  protected void moveResourceNodeAndHandleLink(Node node, Property property, Link link) throws RepositoryException {
    if (link == null || link.getWorkspace() == null) return;
    if (this.copyHistory.containsKey(link.getUUID()+":"+link.getPropertyName())) {
      String damAssetIdentifier = this.copyHistory.get(link.getUUID()+":"+link.getPropertyName());
      String damAssetPath = damSession.getNodeByIdentifier(damAssetIdentifier).getPath();
      changeLinkInTextContent(property, damAssetIdentifier, link.getUUID(), link.getPath(), link.getPropertyName());
    } else if (this.copyHistory.containsKey(link.getWorkspace()+":"+link.getPath()+":"+link.getPropertyName())) {
      String damAssetIdentifier = this.copyHistory.get(link.getWorkspace()+":"+link.getPath()+":"+link.getPropertyName());
      String damAssetPath = damSession.getNodeByIdentifier(damAssetIdentifier).getPath();
      changeLinkInTextContent(property, damAssetIdentifier, link.getUUID(), link.getPath(), link.getPropertyName());
    } else if (link.getWorkspace().equals("dms")) {
      String damAssetIdentifier = link.getUUID();
      log.warn(property.getPath()+" had a link to DMS object with uuid '"+damAssetIdentifier+"', updated link to reflect move to DAM.");
      changeLinkInTextContent(property, damAssetIdentifier, damAssetIdentifier, link.getPath(), link.getPropertyName());
    } else {
      Node fileNode = node.getSession().getNodeByIdentifier(link.getUUID());
      Node resourceNode;
      if (StringUtils.isBlank(link.getPropertyName())) resourceNode = fileNode;
      else resourceNode = fileNode.getNode(link.getPropertyName());

      if (resourceNode != null && NodeUtil.isNodeType(resourceNode, NodeTypes.Resource.NAME)) {
        // Move resource Node to DAM
        String damAssetIdentifier = copyToDam(resourceNode);
        String fileNodeIdentifier = fileNode.getIdentifier();
        String fileNodePath = fileNode.getPath();
        this.copyHistory.put(fileNodeIdentifier+":"+link.getPropertyName(), damAssetIdentifier);
        this.copyHistory.put(link.getWorkspace()+":"+fileNodePath+":"+link.getPropertyName(), damAssetIdentifier);
        if (damAssetIdentifier != null) {
          String damAssetPath = damSession.getNodeByIdentifier(damAssetIdentifier).getPath();
          log.warn("'{}' resource was moved to DAM repository to the following path '{}' and identifier: '{}'", Arrays.asList(fileNodePath, damAssetPath, damAssetIdentifier).toArray());
          // Change Link into contentText
          changeLinkInTextContent(property, damAssetIdentifier, fileNodeIdentifier, fileNodePath, link.getPropertyName());
        } else {
          log.warn("Could not copy following uploaded data into dam repository: '{}'", fileNodePath);
        }
      } else {
        log.warn("The following file node '{}' has no resource node. No migration performed ", NodeUtil.getPathIfPossible(fileNode));
      }
    }
  }

  protected void changeLinkInTextContent(Property property, String damAssetIdentifier, String originalFileUUID, String originalFileNodePath, String nodeData) throws RepositoryException {
    String text = property.getString();
    String newLinkText = Matcher.quoteReplacement(getDamLink(damSession.getNodeByIdentifier(damAssetIdentifier)));
    text = text.replaceAll(Pattern.quote("${link:{")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("uuid:{"+originalFileUUID+"}")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("nodeData:{"+nodeData+"}")+".*?"+Pattern.quote("}}")+"+", newLinkText);
    text = text.replaceAll(Pattern.quote("${link:{")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("handle:{"+originalFileNodePath+"}")+"([^\\}]\\}|\\}[^\\}]|[^\\}])*?"+Pattern.quote("nodeData:{"+nodeData+"}")+".*?"+Pattern.quote("}}")+"+", newLinkText);
    property.setValue(text);
  }

  protected String getDamLink(Node damNode) throws RepositoryException {
    Link newLink = new Link(damNode);
    return LinkUtil.toPattern(newLink);
  }
}
