package edu.txstate.its.gato.setup;

import info.magnolia.context.SystemContext;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.templating.functions.TemplatingFunctions;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.HashMap;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.core.NodeImpl;

@Singleton
public class LinkMigrationLogic {
  private final TemplatingFunctions cmsfn;
  private final SystemContext sc;
  protected Map<String, Session> sessMap;
  protected boolean enableMigration = false;
  @Inject
  public LinkMigrationLogic(TemplatingFunctions tFunc, SystemContext systemContext) throws Exception {
    this.cmsfn = tFunc;
    this.sessMap = new HashMap<String, Session>();
    this.sc = systemContext;
  }

  public void setMigrationEnabled(boolean enabled) {
    this.enableMigration = enabled;
  }

  public Node retrieveDamNodeByUUIDAndPropertyName(String uuid, String propertyName) throws RepositoryException {
    Session mapSession = getMapSession();
    Session damSession = getDamSession();
    String damuuid = "";
    try {
      if (StringUtils.isBlank(propertyName)) {
        // in these cases, the UUID portion of a UUID link points at the resource node itself
        // which I recorded as the uuid of the map workspace version of the node
        damuuid = mapSession.getNodeByIdentifier(uuid).getProperty("damuuid").getString();
      } else {
        // regular case, the uuid should point at the parent of the resource node, for which
        // I created a special storage area
        Node parentMapStorageNode = mapSession.getNodeByIdentifier(uuid);
        damuuid = PropertyUtil.getString(parentMapStorageNode, propertyName, "");
      }
    } catch (Exception e) { }
    if (StringUtils.isBlank(damuuid)) return null;
    return damSession.getNodeByIdentifier(damuuid);
  }

  public Node convertAnyUrlToDamNode(String url) {
    Node damItem = convertUrlToDamNode(url);
    if (damItem == null) damItem = convertWebsiteUrlToDamNode(url);
    return damItem;
  }

  public Node convertUrlToDamNode(String path) {
    Path dmspath = null;
    // let's see if we have a DMS link
    if (path.startsWith("/dms/") || path.startsWith("/dam/")) {
      dmspath = Paths.get(path.substring(4));
    // let's see if we have a gato-docs link
    } else if (path.startsWith("http://gato-docs.its.txstate.edu/")) {
      dmspath = Paths.get(path.substring(32));
    // assume the /dam/ has been stripped off (happens in the damdownloadservlet)
    } else {
      dmspath = Paths.get(path);
    }
    return convertPathToDamNode(dmspath);
  }

  public Node convertWebsitePathToDamNode(Path wspath) {
    Node damItem = checkForMigratedDamNodeWithWsPath(wspath);
    if (damItem == null) {
      Node resourceNode = convertWebsitePathToResourceNode(wspath);
      if (resourceNode != null) {
        try {
          damItem = migrateResourceNodeToDam(resourceNode);
        } catch (Exception e) { }
      }
    }
    return damItem;
  }

  public Node checkForMigratedDamNodeWithWsPath(Path wspath) {
    Session map = getMapSession();
    Node info = convertMapPathToInfoNode(wspath);
    if (info != null) {
      try {
        return getDamSession().getNodeByIdentifier(info.getProperty("damuuid").getString());
      } catch (Exception e) {
        return null;
      }
    }
    return null;
  }

  public Node convertPathToDamNode(Path dmspath) {
    return getNodeWithFuzzyPath(dmspath, getDamSession(), AssetNodeTypes.Asset.NAME);
  }

  public Node convertWebsitePathToResourceNode(Path wspath) {
    return getNodeWithFuzzyPath(wspath, getWsSession(), NodeTypes.Resource.NAME);
  }

  public Node convertMapPathToInfoNode(Path wspath) {
    return getNodeWithFuzzyPath(wspath, getMapSession(), NodeTypes.Content.NAME);
  }

  public Node getNodeWithFuzzyPath(Path p, Session s, String correctNodeType) {
    Node ret = null;
    try {
      ret = s.getNode(stripExtension(p.toString()));
    } catch (Exception e) {
      try {
        ret = s.getNode(p.getParent().toString());
      } catch (Exception e2) {
        // no match, give up
      }
    }
    try {
      if (!NodeUtil.isNodeType(ret, correctNodeType)) ret = null;
    } catch (Exception e) {
      ret = null;
    }
    return ret;
  }

  public Node convertWebsiteUrlToDamNode(String url) {
    return convertWebsitePathToDamNode(Paths.get(url));
  }

  public String itemKeyForAssetNode(Node damItem) {
    try {
      return "jcr:"+damItem.getIdentifier();
    } catch (Exception e) {
      return null;
    }
  }

  protected String getExtension(Node dataNodeResource) {
    String extension = PropertyUtil.getString(dataNodeResource, AssetNodeTypes.AssetResource.EXTENSION, "").toLowerCase();
    if (extension.equals("jpeg")) extension = "jpg";
    return extension;
  }

  public String stripExtension(String url) {
    return url.replaceAll("\\.[^\\.]+$", "");
  }

  public Session getSession(String workspace) {
    try {
      if (!sessMap.containsKey(workspace) || !sessMap.get(workspace).isLive()) {
        sessMap.put(workspace, sc.getJCRSession(workspace));
      }
      return sessMap.get(workspace);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  public Session getDamSession() {
    return getSession("dam");
  }

  public Session getWsSession() {
    return getSession("website");
  }

  public Session getMapSession() {
    return getSession("gatolegacylinkmap");
  }

  public Node migrateResourceNodeToDam(Node resourceNode) throws RepositoryException {
    if (!enableMigration) return null;
    Session damSession = getDamSession();
    Session mapSession = getMapSession();

    // figure out how to organize
    Node component = resourceNode;
    while (component.getDepth() > 0 && !NodeUtil.isNodeType(component, NodeTypes.Component.NAME))
      component = component.getParent();
    String subfolder = "images";
    boolean bannermode = false;
    if (component.getDepth() > 0) {
      String t = NodeTypes.Renderable.getTemplate(component);
      if (t.endsWith("texasEditor") || t.endsWith("richeditor"))
        subfolder = "richeditor_uploads";
      else if (t.endsWith("banner"))
        bannermode = true;
      else if (resourceNode.getName().equals("document") || resourceNode.getName().equals("file"))
        subfolder = "documents";
    }

    // figure out the page path
    Node page = cmsfn.page(resourceNode);
    String[] path = page.getPath().split("/", 3);

    // create the final parent path for our file
    String damPath = "/"+path[1]+"/migrated_files/"+subfolder+"/"+(path.length > 2 ? path[2] : "");
    if (bannermode) damPath = "/banner-images/"+path[1];
    Node damParent = NodeUtil.createPath(damSession.getRootNode(), damPath, NodeTypes.Folder.NAME);

    // find the filename we will use and ensure it's unique in our parent folder
    String fileName = PropertyUtil.getString(resourceNode, AssetNodeTypes.AssetResource.FILENAME);
    fileName = info.magnolia.cms.core.Path.getValidatedLabel(fileName);
    fileName = info.magnolia.cms.core.Path.getUniqueLabel(damParent, fileName);

    // Create an AssetNode
    Node assetNode = ((NodeImpl)NodeUtil.unwrap(damParent)).addNodeWithUuid(fileName, AssetNodeTypes.Asset.NAME, resourceNode.getIdentifier());
    Node assetNodeResource = assetNode.addNode(AssetNodeTypes.AssetResource.RESOURCE_NAME, AssetNodeTypes.AssetResource.NAME);
    NodeTypes.LastModified.update(assetNode);

    String extension = getExtension(resourceNode);
    assetNode.setProperty(AssetNodeTypes.Asset.TYPE, extension);
    assetNodeResource.setProperty(AssetNodeTypes.AssetResource.EXTENSION, extension);

    if (resourceNode.hasProperty(AssetNodeTypes.AssetResource.FILENAME)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.FILENAME,
        resourceNode.getProperty(AssetNodeTypes.AssetResource.FILENAME).getString()+
        (!StringUtils.isBlank(extension) ? "."+extension : ""));
    }
    ImageSize imageSize = null;
    if (resourceNode.hasProperty(AssetNodeTypes.AssetResource.HEIGHT)) {
      imageSize = new ImageSize(resourceNode,
        PropertyUtil.getLong(resourceNode, AssetNodeTypes.AssetResource.WIDTH, 0l),
        PropertyUtil.getLong(resourceNode, AssetNodeTypes.AssetResource.HEIGHT, 0l)
      );
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.HEIGHT, imageSize.getHeight());
    }
    if (imageSize != null && resourceNode.hasProperty(AssetNodeTypes.AssetResource.WIDTH)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.WIDTH, imageSize.getWidth());
    }
    if (resourceNode.hasProperty(AssetNodeTypes.AssetResource.SIZE)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.SIZE, Long.parseLong(resourceNode.getProperty(AssetNodeTypes.AssetResource.SIZE).getString()));
    }
    if (resourceNode.hasProperty(AssetNodeTypes.AssetResource.DATA)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.DATA, resourceNode.getProperty(AssetNodeTypes.AssetResource.DATA).getBinary());
    }
    if (resourceNode.hasProperty(AssetNodeTypes.AssetResource.MIMETYPE)) {
      assetNodeResource.setProperty(AssetNodeTypes.AssetResource.MIMETYPE, resourceNode.getProperty(AssetNodeTypes.AssetResource.MIMETYPE).getString());
    }
    damSession.save();

    String mapParentPath = Paths.get(resourceNode.getPath()).getParent().toString();
    Node mapParent = NodeUtil.createPath(mapSession.getRootNode(), mapParentPath, NodeTypes.Folder.NAME);
    Node mapNode = ((NodeImpl)NodeUtil.unwrap(mapParent)).addNodeWithUuid(resourceNode.getName(), NodeTypes.Content.NAME, resourceNode.getIdentifier());
    PropertyUtil.setProperty(mapNode, "damuuid", assetNode.getIdentifier());

    Node parentMapNode = null;
    try {
      parentMapNode = mapSession.getNodeByIdentifier(resourceNode.getParent().getIdentifier());
    } catch (ItemNotFoundException e) {
      Node uuidMapNodes = NodeUtil.createPath(mapSession.getRootNode(), "/uuidmapnodes", NodeTypes.Folder.NAME);
      parentMapNode = ((NodeImpl)NodeUtil.unwrap(uuidMapNodes)).addNodeWithUuid(info.magnolia.cms.core.Path.getUniqueLabel(uuidMapNodes, "0"), NodeTypes.Content.NAME, resourceNode.getParent().getIdentifier());
    }
    if (parentMapNode != null)
      PropertyUtil.setProperty(parentMapNode, resourceNode.getName(), assetNode.getIdentifier());

    mapSession.save();
    resourceNode.remove();
    resourceNode.getSession().save();

    return assetNode;
  }
}
