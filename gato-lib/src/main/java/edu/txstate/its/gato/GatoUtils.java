/**
 *
 * Texas State "Gato" EL utilities
 */

package edu.txstate.its.gato;

import info.magnolia.cms.beans.config.MIMEMapping;
import info.magnolia.cms.core.MgnlNodeType;
import info.magnolia.context.MgnlContext;
import info.magnolia.context.SystemContext;
import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.metadata.MagnoliaAssetMetadata;
import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.ContentMap;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.link.LinkUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.context.RenderingContext;
import info.magnolia.rendering.engine.RenderingEngine;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.templating.functions.TemplatingFunctions;

import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServletRequest;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyType;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.ValueFormatException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.codec.digest.DigestUtils;

import org.apache.jackrabbit.JcrConstants;

public final class GatoUtils {
  private final TemplatingFunctions tf;
  private final DamTemplatingFunctions damfn;
  private final SimpleDateFormat timeformat;
  private final MagnoliaConfigurationProperties mcp;
  private final SystemContext sc;

  @Inject
  public GatoUtils(TemplatingFunctions templatingFunctions, DamTemplatingFunctions damTemplatingFunctions, MagnoliaConfigurationProperties magConfigProps, SystemContext syscon) {
    tf = templatingFunctions;
    damfn = damTemplatingFunctions;
    mcp = magConfigProps;
    sc = syscon;
    timeformat = new SimpleDateFormat("HH:mm");
  }

  public String filterUrl(String url) {
    if (StringUtils.isEmpty(url)) return "";
    if (LinkUtil.isExternalLinkOrAnchor(url)) return url;
    String cpath = MgnlContext.getContextPath();
    boolean wasInWebsite = false;
    Node cont = null;
    try {
      // let's see if url is actually a UUID to something in the website
      // repository
      cont = sc.getJCRSession("website").getNodeByIdentifier(url);
      if (cont != null) wasInWebsite = true;
    } catch (Exception e) {
      // failed attempt, no biggie
    }

    if (wasInWebsite && cont != null) {
      try {
        return cpath+cont.getPath();
      } catch (Exception e) {
        return "";
      }
    }
    if (!StringUtils.isEmpty(cpath) && url.startsWith(cpath)) return url;

    if ( StringUtils.strip(url).matches("[^/]+\\.(com|edu|org|net|gov|us|ca|uk)(/.*?)?") ) return "http://"+StringUtils.strip(url);

    if (LinkUtil.isInternalRelativeLink(url)) {
        //If the url is internal and relative, we need to get the content node for the current
        //page and prepend its handle to the url.
        try {
            Node n = MgnlContext.getAggregationState().getCurrentContent().getJCRNode();

            while (!n.isNodeType(MgnlNodeType.NT_PAGE)) {
                n = n.getParent();
              }

            int firstSlash = url.indexOf('/');

            //Check if the page name is at the start of the url and if it is chop it off.
            if (firstSlash != -1 && url.substring(0, firstSlash).equals(n.getName())) {
                url = url.substring(firstSlash);
            }

            url = n.getPath() + url;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    if (!url.startsWith("/")) return url;
    return cpath+url;
  }

  public String absoluteUrl(String url) {
    String relUrl = filterUrl(url);
    if (relUrl.matches("^(\\w{3,15}:)?//.*")) return relUrl;
    HttpServletRequest request = MgnlContext.getWebContext().getRequest();
    String serverpath = request.getScheme()+"://"+request.getServerName();
    if ((request.getScheme().equals("http") && request.getServerPort() != 80) ||
        (request.getScheme().equals("https") && request.getServerPort() != 443) ||
         !request.getScheme().contains("http"))
      serverpath += ":"+request.getServerPort();
    return serverpath+relUrl;
  }

  public String resourcePath() {
    return MgnlContext.getContextPath()+"/.resources";
  }

  public String filterLinkTitle(String title, String url) {
    if (!StringUtils.isEmpty(title)) return title;
    String furl = filterUrl(url);
    String cpath = MgnlContext.getContextPath();

    if (furl.startsWith(cpath)) {
      String path = furl.substring(furl.indexOf(cpath) + cpath.length());
      try {
        return nodeTitle(sc.getJCRSession("website").getNode(path));
      } catch (Exception e) {
        return path;
      }
    }
    return url;
  }

  public String nodeTitle(Object obj) {
    Node n = toNode(obj);
    if (n == null) return "";
    try {
      String title = n.getProperty("title").getString();
      if (!StringUtils.isEmpty(title)) return title;
    } catch (Exception e) {
      // use name instead
    }
    try {
      String[] words = n.getName().split("\\W+");
      String ret = "";
      for (int i = 0; i < words.length; i++) {
        ret += StringUtils.capitalize(words[i]);
        if (i < words.length - 1) ret += " ";
      }
      return ret;
    } catch (Exception e) {
      return "";
    }
  }

  public boolean isCacheEnvironment() {
    boolean cacheEnvironment = false;
    String viaHeader = MgnlContext.getWebContext().getRequest().getHeader("via");
    if (viaHeader != null) {
      cacheEnvironment = viaHeader.contains("Proxy-HistoryCache");
    }
    return cacheEnvironment;
  }

  public String getImageHandlerBase() {
    String propSuffix = "";
    if (isCacheEnvironment()) propSuffix = ".cache";

    // now we need a centralized variable for the base URL of the image handler scripts
    // this allows us to switch between cache environments based on what type of installation
    // this is - production, testing, or development
    return mcp.getProperty("gato.imagehandlerbaseurl"+propSuffix);
  }

  protected String ensureItemKey(String damuuid) {
    if (!damuuid.matches("^[^:]+:.+")) damuuid = "jcr:"+damuuid;
    return damuuid;
  }

  protected GatoResizer getResizer() throws Exception {
    String resizeClass = sc.getJCRSession(RepositoryConstants.CONFIG)
      .getNode("/modules/gato-lib/imaging/resize").getProperty("class").getString();
    if (mcp.hasProperty("gato.gato-lib.noresize"))
      resizeClass = "edu.txstate.its.gato.GatoResizer";
    GatoResizer srv = (GatoResizer) Components.getComponent(Class.forName(resizeClass));
    return srv;
  }

  public String lesserwidth(String mw1, String mw2) {
    if (maxwidthtolong(mw1) >= maxwidthtolong(mw2)) return mw2;
    return mw1;
  }
  public String lesserwidth(String mw1, String mw2, String mw3) {
    return lesserwidth(mw1, lesserwidth(mw2, mw3));
  }
  public String lesserwidth(String mw1, String mw2, String mw3, String mw4) {
    return lesserwidth(mw1, lesserwidth(mw2, mw3, mw4));
  }
  public long maxwidthtolong(String maxwidth) {
    try {
      long num = Long.parseLong(maxwidth.replaceAll("\\D",""));
      if (maxwidth.toLowerCase().endsWith("vw")) return 30*num;
      if (num == 0) return 10000;
      return num;
    } catch (Exception e) {
      return 10000;
    }
  }
  public long sizestolong(String sizes) {
    try {
      long num = Long.parseLong(sizes.replaceAll("\\D",""));
      if (sizes.toLowerCase().endsWith("vw")) return 10*num;
      if (num == 0) return 1000;
      return num;
    } catch (Exception e) {
      return 1000;
    }
  }

  public long getImgWidth(Object assetOrId) {
    try {
      return toAsset(assetOrId).getMetadata(MagnoliaAssetMetadata.class).getWidth();
    } catch (Exception e) {
      return 0;
    }
  }

  public String getSrcSet(Object assetOrId) {
    return getSrcSet(assetOrId, 0f, 0f, 0f, 0f);
  }

  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom) {
    return getSrcSet(assetOrId, left, right, top, bottom, false);
  }

  public String getSrcSet(Object assetOrId, float aspectratio) {
    return getSrcSet(assetOrId, 0f, 0f, 0f, 0f, aspectratio);
  }

  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom, boolean square) {
    return getSrcSet(assetOrId, left, right, top, bottom, (square ? 1f : -1f));
  }

  // note: "right" means distance from left at which to crop, expressed as a
  // ratio of the total width
  // same for bottom
  // for example, left = .25, right = .75 means cut 25% off each side
  // counterintuitive, may need refactored at some point
  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom, float aspectratio) {
    Asset asset = toAsset(assetOrId);
    if (asset == null) return "";
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(0);
      srv.setUpscale(true);
      srv.setCrop(left, right, top, bottom);
      srv.setZoom(aspectratio > 0);

      long width = getImgWidth(asset);
      if (right - left > 0.001) width = Math.round(width*(right - left));
      ArrayList<Long> widths = new ArrayList<Long>();
      do {
        widths.add(new Long(width));
        width = width / 2;
      } while (width > 100);
      StringBuffer ret = new StringBuffer();
      int i = 1;
      for (Long wLong : widths) {
        long w = wLong.longValue();
        srv.setWidth(w);
        if (aspectratio > 0) srv.setHeight(Math.round(w/aspectratio));
        ret.append(srv.createLink(asset)+" "+w+"w");
        if (i++ < widths.size()) ret.append(", ");
      }
      return ret.toString();
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }

  protected final String SIZES_DEFAULT = "1000px";
  public String getImgDefault(Object assetOrId) {
    return getImgDefault(assetOrId, SIZES_DEFAULT);
  }

  public String getImgDefault(Object assetOrId, String sizes) {
    return getImgDefault(assetOrId, 0f, 0f, 0f, 0f, sizes, false);
  }

  public String getImgDefault(Object assetOrId, float aspectratio) {
    return getImgDefault(assetOrId, 0f, 0f, 0f, 0f, SIZES_DEFAULT, aspectratio);
  }

  public String getImgDefault(Object assetOrId, float left, float right, float top, float bottom) {
    return getImgDefault(assetOrId, left, right, top, bottom, SIZES_DEFAULT);
  }

  public String getImgDefault(Object assetOrId, float left, float right, float top, float bottom, boolean square) {
    return getImgDefault(assetOrId, left, right, top, bottom, SIZES_DEFAULT, square);
  }

  public String getImgDefault(Object assetOrId, float left, float right, float top, float bottom, String sizes) {
    return getImgDefault(assetOrId, left, right, top, bottom, sizes, false);
  }

  public String getImgDefault(Object assetOrId, float left, float right, float top, float bottom, String sizes, boolean square) {
    return getImgDefault(assetOrId, left, right, top, bottom, sizes, (square ? 1f : -1f));
  }

  public String getImgDefault(Object assetOrId, float left, float right, float top, float bottom, String sizes, float aspectratio) {
    Asset asset = toAsset(assetOrId);
    if (asset == null) return "";
    try {
      long width = getImgWidth(asset);
      if (right - left > 0.001) width = Math.round(width*(right-left));
      long minwidth = sizestolong(sizes);
      while (width/2 > minwidth) {
        width = width / 2;
      };

      GatoResizer srv = getResizer();
      srv.setHeight(0);
      srv.setWidth(width);
      srv.setUpscale(true);
      srv.setCrop(left, right, top, bottom);
      srv.setZoom(aspectratio > 0);
      if (aspectratio > 0) srv.setHeight(Math.round(width/aspectratio));
      return srv.createLink(asset);
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }

  public String getImg(Object assetOrId, int width, int height, boolean zoom, boolean upscale, float left, float right, float top, float bottom) {
    Asset asset = toAsset(assetOrId);
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(height);
      srv.setWidth(width);
      srv.setZoom(zoom);
      srv.setUpscale(upscale);
      srv.setCrop(left, right, top, bottom);
      return srv.createLink(asset);
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }

  public String getCacheStr(String cacheidentifier) {
    // we don't need to do anything if we're not in the production environment
    // since our only goal here is to add a string to the URL that represents
    // the last-modified date (for caching purposes)
    if (!isCacheEnvironment() || StringUtils.isBlank(cacheidentifier)) return "";
    try {
      return "/cache"+md5(cacheidentifier);
    } catch (Exception e) {
      return "";
    }
  }

  public String getCacheStr(Calendar lastMod) {
    if (lastMod == null) return "";
    return getCacheStr(lastMod.getTime().toString());
  }

  public String getCacheStr(Node n) throws Exception {
    return getCacheStr(NodeTypes.LastModified.getLastModified(n));
  }

  public String getCacheStr(Property p) throws Exception {
    return getCacheStr(p.getParent());
  }

  public String getCacheStr(Asset a) {
    return getCacheStr(a.getLastModified());
  }

  public String md5(String str) {
    return DigestUtils.md5Hex(str);
  }

  public String uniqueId(ContentMap c) throws Exception {
    return md5(c.getJCRNode().getIdentifier());
  }

  // processRichText is a method for finding img tags in html and converting
  // them to responsive images with srcset and sizes attributes
  protected String captureMatch(String s, Pattern p) {
    Matcher m = p.matcher(s);
    if (m.find()) {
      return m.group(1);
    } else {
      return "";
    }
  }
  public final Pattern IMAGE_TAG_PATTERN = Pattern.compile("(<img[^>]*src[ ]*=[ ]*\")([^\"]*)(\"[^>]*>)");
  public final Pattern WIDTH_ATTR_PATTERN = Pattern.compile("width[ ]*=[ ]*\"([0-9]+)[^\"]*\"");
  public final Pattern SRCSET_ATTR_PATTERN = Pattern.compile("srcset[ ]*=[ ]*\"([^\"]*)\"");
  public final Pattern ASSET_KEY_PATTERN = Pattern.compile("/([a-z]+:[a-f0-9\\-]+)/");
  public String processRichText(String str) {
    if (StringUtils.isBlank(str)) return "";
    StringBuffer result = new StringBuffer();
    Matcher matcher = IMAGE_TAG_PATTERN.matcher(str);
    while (matcher.find()) {
      String imageTag = matcher.group();
      String existingSrc = matcher.group(2);
      String existingSrcSet = captureMatch(imageTag, SRCSET_ATTR_PATTERN);
      String newSrc = existingSrc;
      if (StringUtils.isBlank(existingSrcSet)) {
        String assetKey = captureMatch(imageTag, ASSET_KEY_PATTERN);

        Asset image = damfn.getAsset(assetKey);
        if (image != null) {
          newSrc = getImgDefault(image);
          if (StringUtils.isBlank(existingSrcSet)) newSrc += "\" srcset=\""+getSrcSet(image);
        }

        long width = 0;
        try {
          width = Long.parseLong(captureMatch(imageTag, WIDTH_ATTR_PATTERN));
        } catch (Exception e) {
          width = getImgWidth(image);
          if (width > 0) newSrc += "\" width=\""+width;
        }
        if (width > 0) newSrc += "\" sizes=\""+width+"px";
      }
      matcher.appendReplacement(result, "$1" + newSrc + "$3");
    }
    matcher.appendTail(result);
    return result.toString();
  }

  public String convertLinksToAbsolute(String str) {
    if (StringUtils.isBlank(str)) return "";
    String cpath = MgnlContext.getContextPath();
    Pattern p = Pattern.compile("=\"(/"+Pattern.quote(cpath)+"[^\"]*)\"");
    Matcher m = p.matcher(str);
    StringBuffer result = new StringBuffer();
    while (m.find()) {
      m.appendReplacement(result, "=\""+Matcher.quoteReplacement(absoluteUrl(m.group(1)))+"\"");
    }
    m.appendTail(result);
    return result.toString();
  }

  public String getMimeType(String ext) {
    String ret = MIMEMapping.getMIMEType(ext);
    if (StringUtils.isBlank(ret)) ret = "application/octet-stream";
    return ret;
  }

  // dump an object to string
  public String dump(Object o, int callCount) {
    callCount++;
    StringBuffer tabs = new StringBuffer();
    for (int k = 0; k < callCount; k++) {
        tabs.append("&nbsp;&nbsp;&nbsp;&nbsp;");
    }
    StringBuffer buffer = new StringBuffer();
    Class oClass = o.getClass();
    if (oClass.isArray()) {
        buffer.append("<br/>\n");
        buffer.append(tabs.toString());
        buffer.append("[");
        for (int i = 0; i < Array.getLength(o); i++) {
            if (i < 0)
                buffer.append(",");
            Object value = Array.get(o, i);
            if (value.getClass().isPrimitive() ||
                    value.getClass() == java.lang.Long.class ||
                    value.getClass() == java.lang.String.class ||
                    value.getClass() == java.lang.Integer.class ||
                    value.getClass() == java.lang.Boolean.class
                    ) {
                buffer.append(value);
            } else {
                buffer.append(dump(value, callCount));
            }
        }
        buffer.append(tabs.toString());
        buffer.append("]<br/>\n");
    } else {
        buffer.append("<br/>\n");
        buffer.append(tabs.toString());
        buffer.append("{<br/>\n");
        while (oClass != null) {
            Field[] fields = oClass.getDeclaredFields();
            for (int i = 0; i < fields.length; i++) {
                buffer.append(tabs.toString());
                fields[i].setAccessible(true);
                buffer.append(fields[i].getName());
                buffer.append("=");
                try {
                    Object value = fields[i].get(o);
                    if (value != null) {
                        if (value.getClass().isPrimitive() ||
                                value.getClass() == java.lang.Long.class ||
                                value.getClass() == java.lang.String.class ||
                                value.getClass() == java.lang.Integer.class ||
                                value.getClass() == java.lang.Boolean.class
                                ) {
                            buffer.append(value);
                        } else {
                            if (callCount < 2) buffer.append(dump(value, callCount));
                        }
                    }
                } catch (IllegalAccessException e) {
                    buffer.append(e.getMessage());
                }
                buffer.append("<br/>\n");
            }
            oClass = oClass.getSuperclass();
        }
        buffer.append(tabs.toString());
        buffer.append("}<br/>\n");
    }
    return buffer.toString();
  }

  public Calendar getCreationDate(ContentMap content) {
    try {
      return NodeTypes.Created.getCreated(content.getJCRNode());
    } catch (Exception e) {
      return null;
    }
  }

  public Calendar getLastActionDate(ContentMap content) {
    try {
      return NodeTypes.Activatable.getLastActivated(content.getJCRNode());
    } catch (Exception e) {
      return getCreationDate(content);
    }
  }

  public Calendar getModificationDate(ContentMap content) {
    try {
      return NodeTypes.LastModified.getLastModified(content.getJCRNode());
    } catch (Exception e) {
      return getCreationDate(content);
    }
  }

  public String getOriginalAuthor(ContentMap content) {
    try {
      return NodeTypes.Created.getCreatedBy(content.getJCRNode());
    } catch (Exception e) {
      return "";
    }
  }

  public String getLastAuthor(ContentMap content) {
    try {
      return NodeTypes.LastModified.getLastModifiedBy(content.getJCRNode());
    } catch (Exception e) {
      return getOriginalAuthor(content);
    }
  }

  public Date incrementDate(Date d) {
    Calendar c = Calendar.getInstance();
    c.setTime(d);
    c.add(Calendar.DAY_OF_MONTH, 1);
    return c.getTime();
  }

  public Date setTime(Date d, String tstr) {
    Calendar o = Calendar.getInstance();
    o.setTime(d);
    if (tstr.length() != 5) tstr = "00:00";
    Calendar c = Calendar.getInstance();
    try {
      c.setTime(timeformat.parse(tstr));
    } catch (java.text.ParseException e) {
      c.set(Calendar.HOUR, 0);
      c.set(Calendar.MINUTE, 0);
    }
    c.set(o.get(Calendar.YEAR), o.get(Calendar.MONTH), o.get(Calendar.DAY_OF_MONTH));
    return c.getTime();
  }

  public Node toNode(Object obj) {
    Node n = null;
    try {
      if (obj instanceof ContentMap) n = ((ContentMap)obj).getJCRNode();
      else if (obj instanceof Node) n = (Node)obj;
      else if (obj instanceof String) n = Components.getComponent(RenderingEngine.class).getRenderingContext().getCurrentContent().getNode((String)obj);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return n;
  }
  public Asset toAsset(Object obj) {
    Asset a = null;
    try {
      if (obj instanceof Asset) a = (Asset) obj;
      else if (obj instanceof String) a = damfn.getAsset(ensureItemKey((String)obj));
    } catch (Exception e) {
      e.printStackTrace();
    }
    return a;
  }

  public Collection<String> propertyValues(Object obj) {
    Node n = toNode(obj);
    List ret = new ArrayList<String>();
    try {
      Iterator iter = n.getProperties();
      while (iter.hasNext()) {
        Property p = (Property)iter.next();
        if (!p.getName().startsWith("jcr:") && !p.getName().startsWith("mgnl:")) ret.add(p.getString());
      }
      Collections.sort(ret);
    } catch (Exception e) {
      // ignore and return empty collection
    }
    return ret;
  }

  public Collection<String> propertyKeys(Object obj) {
    Node n = toNode(obj);
    List ret = new ArrayList<String>();
    try {
      Iterator iter = n.getProperties();
      while (iter.hasNext()) {
        Property p = (Property)iter.next();
        if (!p.getName().startsWith("jcr:")) ret.add(p.getName());
      }
    } catch (Exception e) {
      // ignore and return empty collection
    }
    return ret;
  }

  public ContentMap getOrCreateArea(Object parent, String childName) {
    return getOrCreateNode(parent, childName, "mgnl:area");
  }

  public ContentMap getOrCreateNode(Object parent, String childName, String type) {
    Node n = toNode(parent);
    ContentMap child = null;
    try {
      if (n.hasNode(childName)) child = tf.asContentMap(n.getNode(childName));
      else {
        Session scs = sc.getJCRSession(n.getSession().getWorkspace().getName());
        Node scchild = scs.getNodeByIdentifier(n.getIdentifier()).addNode(childName, type);
        scs.save();
        child = tf.asContentMap(n.getNode(childName));
        n.save();
      }
    } catch (Exception e) {
      try {
        System.out.println("getOrCreateNode page: "+n.getPath());
        System.out.println("getOrCreateNode user: "+MgnlContext.getUser().getName());
      } catch (Exception se) {  }
      e.printStackTrace();
    }
    return child;
  }

  public String getConfigProperty(String propertyName) {
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    return mcp.getProperty(propertyName);
  }

  public List<String> getEquivalentExtensions(String ext) {
    GatoMIMEMapping mimeMapping = Components.getComponent(GatoMIMEMapping.class);
    return mimeMapping.getEquivalents(ext);
  }

  public ContentMap singleComponent(Object page, String areaName) throws Exception {
    Node p = toNode(page);
    if (p.hasNode(areaName)) {
      Node area = p.getNode(areaName);
      for (Node comp : NodeUtil.getNodes(area, NodeTypes.Component.NAME)) {
        return tf.asContentMap(comp);
      }
    }
    return null;
  }

  public List<ContentMap> searchComponents(ContentMap parent, List<String> templateIds) throws Exception {
    return searchComponents(parent, templateIds, "");
  }
  public List<ContentMap> searchComponents(ContentMap parent, List<String> templateIds, String orderBy) throws Exception {
    List<ContentMap> ret = new ArrayList<ContentMap>();
    String templateQuery = "SELECT node.* FROM [mgnl:component] as node WHERE ";
    templateQuery += "ISDESCENDANTNODE(node, '"+parent.getJCRNode().getPath()+"') and ";
    templateQuery += "([mgnl:template]=\""+String.join("\" or [mgnl:template] = \"", templateIds)+"\")";
    if (!StringUtils.isBlank(orderBy)) templateQuery += " ORDER BY "+orderBy;
		NodeIterator nodes = MgnlContext.getJCRSession(RepositoryConstants.WEBSITE).getWorkspace().getQueryManager().
			createQuery(templateQuery, "JCR-SQL2").
			execute().getNodes();
		while (nodes.hasNext()) {
			ret.add(tf.asContentMap(nodes.nextNode()));
		}
		return ret;
  }
  public void visitComponents(Node parent, NodeVisitor v) throws Exception {
    for (Node n : NodeUtil.getNodes(parent)) {
      if (NodeUtil.isNodeType(n,NodeTypes.Component.NAME)) v.visit(n);
      if (!NodeUtil.isNodeType(n,NodeTypes.Page.NAME)) visitComponents(n, v);
    }
  }
  public List<ContentMap> searchComponentsOnPageOrderByModDate(ContentMap page, List<String> templateIds) throws Exception {
    List<ContentMap> ret = new ArrayList<ContentMap>();
    Map<String, Boolean> map = new HashMap<String, Boolean>();
    for (String tid : templateIds)
      map.put(tid, Boolean.TRUE);
    visitComponents(page.getJCRNode(), (n) -> {
      if (map.containsKey(NodeTypes.Renderable.getTemplate(n)))
        ret.add(tf.asContentMap(n));
    });
    Collections.sort(ret, new Comparator<ContentMap>(){
      public int compare(ContentMap c1, ContentMap c2){
        return getModificationDate(c1).compareTo(getModificationDate(c2));
      }
    });
    return ret;
  }

  protected final Random rand = new Random();
  public int random(int min, int max) {
    return rand.nextInt((max - min) + 1) + min;
  }

  public boolean hasNavChildren(Object page) throws Exception {
    Node n = toNode(page);
    boolean haschildren = false;
    for (Node sp : NodeUtil.getNodes(n, NodeTypes.Page.NAME)) {
      if (!PropertyUtil.getBoolean(sp, "hideInNav", false))
        haschildren = true;
    }
    return haschildren;
  }
  public boolean hasComponents(Object area) throws Exception {
    Node n = toNode(area);
    for (Node sp : NodeUtil.getNodes(n, NodeTypes.Component.NAME)) {
        return true;
    }
    return false;
  }
  public boolean hasChildren(Object node) throws Exception {
    Node n = toNode(node);
    for (Node sp : NodeUtil.getNodes(n)) {
        return true;
    }
    return false;
  }
}
