package edu.txstate.its.gato.setup;

import info.magnolia.context.MgnlContext;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import java.nio.file.Path;
import java.nio.file.Paths;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;

public class LinkMigrationLogic {
  public LinkMigrationLogic() throws Exception {

  }

  public Node convertPathToDamNode(Path dmspath) {
    Session damSession = null;
    try {
      damSession = MgnlContext.getJCRSession("dam");
    } catch (Exception e) {
      return null;
    }

    Node damItem = null;
    try {
      damItem = damSession.getNode(stripExtension(dmspath.toString()));
    } catch (Exception e) {
      try {
        damItem = damSession.getNode(dmspath.getParent().toString());
      } catch (Exception e2) {
        // no match, give up
      }
    }
    try {
      if (!NodeUtil.isNodeType(damItem, AssetNodeTypes.Asset.NAME)) damItem = null;
    } catch (Exception e) {
      damItem = null;
    }
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

  public String urlForAssetNode(Node damItem) {
    try {
      return "jcr:"+damItem.getIdentifier();
    } catch (Exception e) {
      return null;
    }
  }

  public String stripExtension(String url) {
    return url.replaceAll("\\.[^\\.]+$", "");
  }
}
