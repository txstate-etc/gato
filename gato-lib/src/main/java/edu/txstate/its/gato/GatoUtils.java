/**
 *
 * Texas State "Gato" EL utilities
 */

package edu.txstate.its.gato;

import info.magnolia.cms.core.MgnlNodeType;
import info.magnolia.context.MgnlContext;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.dam.api.Asset;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.ContentMap;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
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
import java.util.Date;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServletRequest;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyType;
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
  
  @Inject
  public GatoUtils(TemplatingFunctions templatingFunctions, DamTemplatingFunctions damTemplatingFunctions) {
    tf = templatingFunctions;
    damfn = damTemplatingFunctions;
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
      cont = MgnlContext.getJCRSession("website").getNodeByIdentifier(url);
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
    if (relUrl.matches("^\\w{3,15}://.*")) return relUrl;
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
        return nodeTitle(MgnlContext.getJCRSession("website").getNode(path));
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
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
  
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
    String resizeClass = MgnlContext.getJCRSession(RepositoryConstants.CONFIG)
      .getNode("/modules/gato-lib/imaging/resize").getProperty("class").getString();
    GatoResizer srv = (GatoResizer) Components.getComponent(Class.forName(resizeClass));
    return srv;
  }
  
  public String getSrcSet(String damuuid) throws Exception {
    // let's see if the string we were given is already an ItemKey
    return getSrcSet(damfn.getAsset(ensureItemKey(damuuid)));
  }
  
  public String getSrcSet(ContentMap c, String propertyName) throws Exception {
    return getSrcSet(c.getJCRNode(), propertyName);
  }
  
  public String getSrcSet(Node n, String propertyName) throws Exception {
    return getSrcSet(n.getProperty(propertyName).getString());
  }
  
  public String getSrcSet(Asset asset) {
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(0);
      srv.setUpscale(true);
        
      StringBuffer ret = new StringBuffer();
      long[] widths = {100,200,400,800,1200,1600,2400};
      for (long width : widths) {
        srv.setWidth(width);
        ret.append(srv.createLink(asset)+" "+width+"w");
        if (width != widths[widths.length-1]) ret.append(", ");
      }
      return ret.toString();
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }
  
  public String getImgDefault(String damuuid) {
    return getImgDefault(damfn.getAsset(ensureItemKey(damuuid)));
  }
  
  public String getImgDefault(Asset asset) {
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(0);
      srv.setWidth(800);
      srv.setUpscale(false);
      return srv.createLink(asset);
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }

  public String getImgSquare(String damuuid) {
    return getImgSquare(damfn.getAsset(ensureItemKey(damuuid)));
  }
  
  public String getImgSquare(Asset asset) {
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(800);
      srv.setWidth(800);
      srv.setZoom(true);
      srv.setUpscale(false);
      return srv.createLink(asset);
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }

  public String getCacheStr(Calendar lastMod) {
    // we don't need to do anything if we're not in the production environment
    // since our only goal here is to add a string to the URL that represents
    // the last-modified date (for caching purposes)
    if (!isCacheEnvironment()) return "";
    try {
      return "/cache"+md5(lastMod.getTime().toString());
    } catch (Exception e) {
      return "";
    }
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
  
/* TODO update this to send rich editor images to image handler   
 * and maybe figure out what else it's trying to do 
  public static final Pattern IMAGE_TAG_PATTERN = Pattern.compile(
      "(<img[^>]*src[ ]*=[ ]*\")([^\"]*)(\"[^>]*>)");   
  public static final Pattern WIDTH_ATTR_PATTERN = Pattern.compile("(width[ ]*=[ ]*\")([0-9]+)([^\"]*\")");
  public static final Pattern HEIGHT_ATTR_PATTERN = Pattern.compile("(height[ ]*=[ ]*\")([0-9]+)([^\"]*\")");
  public static String convertImageTags(String str) {
    StringBuffer result = new StringBuffer();
    Matcher matcher = IMAGE_TAG_PATTERN.matcher(str);
    while (matcher.find()) {
      String rawUrl = matcher.group(2);
      String src = filterUrl(rawUrl);
      
      Matcher widthMatcher = WIDTH_ATTR_PATTERN.matcher(matcher.group());
      if (!widthMatcher.find()) {
        matcher.appendReplacement(result, matcher.group());
        continue;
      }

      int width = Integer.parseInt(widthMatcher.group(2));
      
      Matcher heightMatcher = HEIGHT_ATTR_PATTERN.matcher(matcher.group());
      if (!heightMatcher.find()) {
        matcher.appendReplacement(result, matcher.group());
        continue;
      }

      int height = Integer.parseInt(heightMatcher.group(2));
      
      //Check to see if the image actually needs to be resized
      String srcMinusContext = rawUrl.substring(MgnlContext.getContextPath().length());
      srcMinusContext = srcMinusContext.substring(0, srcMinusContext.lastIndexOf('/'));
      
      NodeData imageData = null;
      boolean doResize = false;
      String cacheStr = "";
      
      try {
        imageData = MgnlContext.getHierarchyManager("website").getNodeData(srcMinusContext);
        try {
          // rich editor file storage does not get its modification date updated,
          // so we need to take it back one further just to be on the safe side
          Content p = imageData.getParent();
          Content gp = p.getParent();
          
          if (gp.getMetaData().getModificationDate().after(p.getMetaData().getModificationDate()))
            cacheStr = getCacheStr(gp);
          else
            cacheStr = getCacheStr(p);              
        } catch (Exception e) {
          // maybe the image didn't have a grandparent
          cacheStr = getCacheStr(imageData.getParent());              
        }
      } catch (Exception e) {}
      
      try {
        if (imageData == null) {
          srcMinusContext = srcMinusContext.substring("/dms".length());
          imageData = MgnlContext.getHierarchyManager("dms").getContent(srcMinusContext).getNodeData("document");
          cacheStr = getCacheStr(imageData.getParent());
        }
      
        if (imageData != null) {
          int origWidth = Integer.parseInt(imageData.getAttribute("width"));
      
          if (origWidth != width) {
            doResize = true;
          }
        }
      } catch (Exception e) {}
      
      String newSrc = src;
      
      if (doResize) {
        newSrc = imageHandlerCache(src, width, height, "fit", "false", 0, 0, 0, 0, cacheStr);
      
        newSrc = StringUtils.replace(newSrc, "\\", "\\\\");
        newSrc = StringUtils.replace(newSrc, "$", "\\$");
      }
      matcher.appendReplacement(result, "$1" + newSrc + "$3");
    }
    matcher.appendTail(result);
    return result.toString();
  }
*/
  
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

  public Collection<String> propertyValues(Object obj) {
    Node n = toNode(obj);
    List ret = new ArrayList<String>();
    try {
      Iterator iter = n.getProperties();
      while (iter.hasNext()) {
        Property p = (Property)iter.next();
        if (!p.getName().startsWith("jcr:")) ret.add(p.getString());
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
        child = tf.asContentMap(n.addNode(childName, type));
        n.save();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return child;
  }

  public String cleanFormElementTitle(String title) {
    if (StringUtils.isEmpty(title)) {
      return "unnamed";
    }

    title = title.replaceAll("<([A-Za-z0-9=:/ \"]*)>", "" );
    title = title.replaceAll(" ", "-" );
    title = title.replaceAll("^-|-$|[^A-Za-z0-9-]", "");
    title = title.replaceAll("^([0-9])", "num-$1" ); // must start with a letter
    return title.toLowerCase();
  }
}
