package edu.txstate.its.gato;

import info.magnolia.cms.util.ObservationUtil;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import org.apache.jackrabbit.commons.predicate.NodeTypePredicate;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.HashSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatoMIMEMapping {
  private static final Logger log = LoggerFactory.getLogger(GatoMIMEMapping.class);
  protected static String MIME_CONFIG_PATH = "/server/MIMEMapping";

  protected HashMap<String, HashSet<String>> mimeToExt = new HashMap<String, HashSet<String>>();
  protected HashMap<String, String> extToMime = new HashMap<String, String>();

  protected boolean needsReload = true;

  public GatoMIMEMapping() {
    loadMimeConfig();
    ObservationUtil.registerChangeListener("config", MIME_CONFIG_PATH, e -> needsReload = true);
  }

  protected void loadMimeConfig() {
    mimeToExt.clear();
    extToMime.clear();

    try {
      Node mime = MgnlContext.getJCRSession("config").getNode(MIME_CONFIG_PATH);
      NodeUtil.visit(mime, this::addNodeToMap, new NodeTypePredicate(NodeTypes.ContentNode.NAME, true));
      log.info("Successfully loaded mime types");
      needsReload = false;
    } catch (RepositoryException e) {
      log.warn("Failed to load mime config from " + MIME_CONFIG_PATH);
      e.printStackTrace();
    }
  }

  protected void addNodeToMap(Node n) throws RepositoryException {
    if (!n.hasProperty("mime-type")) { return; }

    String mime = n.getProperty("mime-type").getString();
    String ext = n.hasProperty("extension") ? PropertyUtil.getString(n, "extension") : n.getName();
    extToMime.put(ext, mime);

    if (!mimeToExt.containsKey(mime)) {
      mimeToExt.put(mime, new HashSet<String>());
    }
    mimeToExt.get(mime).add(ext);
  }

  public List<String> getEquivalents(String ext) {
    if (needsReload) { loadMimeConfig(); }
    ext = ext.trim();
    String mime = extToMime.get(ext);
    if (mime != null && mimeToExt.containsKey(mime)) {
      return new ArrayList<String>(mimeToExt.get(mime));
    }

    ArrayList<String> ret = new ArrayList<String>();
    ret.add(ext);
    return ret;
  }
}
