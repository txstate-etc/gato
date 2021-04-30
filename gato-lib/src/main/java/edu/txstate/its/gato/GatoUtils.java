/**
 *
 * Texas State "Gato" EL utilities
 */

package edu.txstate.its.gato;

import com.google.gson.*;
import com.steadystate.css.parser.CSSOMParser;
import com.steadystate.css.parser.SACParserCSS3;

import info.magnolia.cms.beans.config.MIMEMapping;
import info.magnolia.context.MgnlContext;
import info.magnolia.context.SystemContext;
import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.metadata.MagnoliaAssetMetadata;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.ContentMap;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.link.LinkUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.engine.RenderingEngine;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.templating.functions.TemplatingFunctions;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.TimeZone;
import java.util.Iterator;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
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
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.codec.digest.DigestUtils;


import org.codehaus.jackson.JsonNode;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.w3c.css.sac.CSSException;
import org.w3c.css.sac.CSSParseException;
import org.w3c.css.sac.ErrorHandler;
import org.w3c.css.sac.InputSource;
import org.w3c.dom.css.CSSStyleSheet;

public final class GatoUtils {
  private static final Pattern LINK_PATTERN = Pattern.compile("(https?://\\S+)", Pattern.CASE_INSENSITIVE);
  private static final Pattern USER_PATTERN = Pattern.compile("(^|)@(\\w+)");
  private static final Pattern IG_USER_PATTERN = Pattern.compile("(^|)@(\\w(?:[\\w.\\-]){0,28}\\w)(?:\\W|$)");
  private static final Pattern HASHTAG_PATTERN = Pattern.compile("(^|)#(\\w+)");
  private static final Pattern ITEMKEY_PATTERN = Pattern.compile("^([a-z]+):([a-f0-9\\-]+)$");
  private static final Pattern EXTERNAL_LINK_PATTERN = Pattern.compile("^(\\w+:)?//.*$");
  private static final Pattern DACAST_URL_PATTERN = Pattern.compile("https?://.*dacast\\.com.*?(\\d+[_/][a-z][_/]\\d+)");
  private static final Pattern DACAST_SCRIPT_PATTERN = Pattern.compile("id=\"(\\d+[_/][a-z][_/]\\d+)\".*dacast\\.com");
  private static final Pattern JSONP_PATTERN = Pattern.compile("^\\s*\\w+\\((.+?)\\);?\\s*$");
  protected static final Pattern UUID_PATTERN = Pattern.compile("([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})(#[-\\w]+)?");

  private final TemplatingFunctions tf;
  private final DamTemplatingFunctions damfn;
  private final SimpleDateFormat timeformat;
  private final SimpleDateFormat jsonDateFormat;
  private final SimpleDateFormat timeDispFormat;
  private final SimpleDateFormat timeDispFormatNoMinutes;
  private final MagnoliaConfigurationProperties mcp;
  private final SystemContext sc;

  @Inject
  public GatoUtils(TemplatingFunctions templatingFunctions, DamTemplatingFunctions damTemplatingFunctions, MagnoliaConfigurationProperties magConfigProps, SystemContext syscon) {
    tf = templatingFunctions;
    damfn = damTemplatingFunctions;
    mcp = magConfigProps;
    sc = syscon;
    timeformat = new SimpleDateFormat("HH:mm");
    timeDispFormat = new SimpleDateFormat("h:mm a");
    timeDispFormatNoMinutes = new SimpleDateFormat("h a");
    jsonDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    jsonDateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
  }

  public String filterUrl(String url) {
    if (StringUtils.isEmpty(url)) return "";
    if (EXTERNAL_LINK_PATTERN.matcher(url).matches()) return url;
    String cpath = MgnlContext.getContextPath();
    if (!StringUtils.isEmpty(cpath) && url.startsWith(cpath)) return url;
    if (url.startsWith("mailto:")) return url;

    // is it a domain without http? let's fix that for them
    if ( StringUtils.strip(url).matches("[^/]+\\.(com|edu|org|net|gov|us|ca|uk)(/.*?)?") ) return "http://"+StringUtils.strip(url);

    // let's see if it's an id for something in the website tree
    String websiteLink="";
    try{
      Matcher m = UUID_PATTERN.matcher(url);
      if (m.matches()) {
        String uid = m.group(1);
        String hash = m.group(2);
        if (hash == null) hash = "";
        String sup = tf.link(RepositoryConstants.WEBSITE, uid);
        if (!StringUtils.isBlank(sup)) websiteLink = sup+hash;
      }
    } catch(Exception e) {
      // we expect this to throw sometimes, it's no big deal
    }
    if (!StringUtils.isBlank(websiteLink)) return websiteLink;

    // let's see if it's an item key for something in DAM
    if (ITEMKEY_PATTERN.matcher(url).matches()) {
      String assetLink = damUrl(url);
      if (!StringUtils.isBlank(assetLink)) return assetLink;
    }

    if (LinkUtil.isInternalRelativeLink(url)) {
        //If the url is internal and relative, we need to get the content node for the current
        //page and prepend its handle to the url.
        try {
            Node n = MgnlContext.getAggregationState().getCurrentContentNode();

            while (!n.isNodeType(NodeTypes.Page.NAME)) {
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

  public Boolean isEmptyString(String string) {
    return StringUtils.isBlank(string);
  }

  public String serverNameAndPort() {
    HttpServletRequest request = MgnlContext.getWebContext().getRequest();
    String serverbase = request.getServerName();
    if ((request.getScheme().equals("http") && request.getServerPort() != 80) ||
        (request.getScheme().equals("https") && request.getServerPort() != 443) ||
         !request.getScheme().contains("http"))
      serverbase += ":"+request.getServerPort();
    return serverbase;
  }

  public String absoluteUrl(String url) {
    String relUrl = filterUrl(url);
    if (relUrl.matches("^(\\w{3,15}:)?//.*")) return relUrl;
    String serverpath = "//"+serverNameAndPort();
    return serverpath+relUrl;
  }

  public String rawAssetFileName(Object assetOrId) {
    Asset asset = toAsset(assetOrId);
    if (asset == null) return "";
    return StringEscapeUtils.unescapeHtml4(asset.getFileName());
  }

  public String damUrlShared(Asset asset) {
    try {
      return "/"+asset.getItemKey().asString()+"/"+StringEscapeUtils.escapeHtml4(URLEncoder.encode(rawAssetFileName(asset), "UTF-8"));
    } catch (Exception e) {
      return "";
    }
  }

  public String damUrl(Object assetOrId) {
    Asset asset = toAsset(assetOrId);
    if (asset == null) return "";
    return damPath()+damUrlShared(asset);
  }

  public String absoluteDamUrl(Object assetOrId) {
    Asset asset = toAsset(assetOrId);
    if (asset == null) return "";
    return absoluteUrl(damPath())+damUrlShared(asset);
  }

  public String resourcePath() {
    String propKey = "gato.assetsbaseurl";
    if (isCacheEnvironment()) propKey += ".cache";
    if (mcp.hasProperty(propKey))
      return filterUrl(mcp.getProperty(propKey))+getCacheStr();
    return MgnlContext.getContextPath()+"/.resources"+getCacheStr();
  }

  public String peopleSearchJwtPath() {
    String propKey = "gato.peoplesearch.url";
    if (mcp.hasProperty(propKey))
      return mcp.getProperty(propKey);
    return "";
  }

  public String damPath() {
    String propKey = "gato.dmsbaseurl";
    if (isCacheEnvironment()) propKey += ".cache";
    if (mcp.hasProperty(propKey))
      return filterUrl(mcp.getProperty(propKey));
    return MgnlContext.getContextPath()+"/dam";
  }

  public String filterLinkTitle(String title, String url) {
    if (!StringUtils.isBlank(title)) return title;
    if (StringUtils.isBlank(url)) return "";
    String furl = filterUrl(url);
    String cpath = MgnlContext.getContextPath();

    if (furl.startsWith(cpath)) {
      String path = stripExtension(furl.substring(furl.indexOf(cpath) + cpath.length()));
      try {
        return nodeTitle(sc.getJCRSession(RepositoryConstants.WEBSITE).getNode(path));
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
      if (!StringUtils.isBlank(title)) {
        title = title.replaceAll("<br/?>", "");
        return title;
      }
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
    if (mcp.getBooleanProperty("gato.gato-lib.noresize"))
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

  public long getImgHeight(Object assetOrId) {
    try {
      return toAsset(assetOrId).getMetadata(MagnoliaAssetMetadata.class).getHeight();
    } catch (Exception e) {
      return 0;
    }
  }

  public float getImgAspectRatio(Object assetOrId) {
    try {
      MagnoliaAssetMetadata md = toAsset(assetOrId).getMetadata(MagnoliaAssetMetadata.class);
      if (md.getHeight() == 0) return 1f;
      return (float)md.getWidth() / md.getHeight();
    } catch (Exception e) {
      e.printStackTrace();
      return 1f;
    }
  }

  public String getImgWideOrTall(float imgwidth, float imgheight, float containerwidth, float containerheight) {
    return getImgWideOrTall(imgwidth, imgheight, containerwidth / containerheight);
  }
  public String getImgWideOrTall(float imgwidth, float imgheight, float containerar) {
    float imgar = imgwidth / imgheight;
    if (imgar > containerar) return "wide";
    return "tall";
  }
  public String getImgWideOrTall(Object assetOrId, float containerar) {
    if (getImgAspectRatio(assetOrId) > containerar) return "wide";
    return "tall";
  }

  public String getSrcSet(Object assetOrId) {
    return getSrcSet(assetOrId, 0f, 0f, 0f, 0f);
  }

  public String getSrcSetWithQuality(Object assetOrId, int quality) {
    return getSrcSet(assetOrId, -1f, quality);
  }

  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom) {
    return getSrcSet(assetOrId, left, right, top, bottom, false);
  }

  public String getSrcSet(Object assetOrId, float aspectratio) {
    return getSrcSet(assetOrId, 0f, 0f, 0f, 0f, aspectratio);
  }

  public String getSrcSet(Object assetOrId, float aspectratio, int quality) {
    return getSrcSet(assetOrId, 0f, 0f, 0f, 0f, aspectratio, quality);
  }

  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom, boolean square) {
    return getSrcSet(assetOrId, left, right, top, bottom, (square ? 1f : -1f));
  }

  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom, float aspectratio) {
    return getSrcSet(assetOrId, left, right, top, bottom, aspectratio, 0);
  }

  // note: "right" means distance from left at which to crop, expressed as a
  // ratio of the total width
  // same for bottom
  // for example, left = .25, right = .75 means cut 25% off each side
  // counterintuitive, may need refactored at some point
  public String getSrcSet(Object assetOrId, float left, float right, float top, float bottom, float aspectratio, int quality) {
    Asset asset = toAsset(assetOrId);
    if (asset == null) return "";
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(0);
      srv.setUpscale(true);
      srv.setCrop(left, right, top, bottom);
      srv.setZoom(aspectratio > 0);
      srv.setQuality(quality);

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

  public String getImgDefault(Object assetOrId, float left, float right, float top, float bottom, float aspectratio) {
    return getImgDefault(assetOrId, left, right, top, bottom, SIZES_DEFAULT, aspectratio);
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

  public String getImg(Object assetOrIdOrUrl, int width, int height, boolean zoom, boolean upscale, float left, float right, float top, float bottom) {
    String url = null;
    Asset asset = null;
    if (assetOrIdOrUrl instanceof String && ((String)assetOrIdOrUrl).matches("^(\\w{3,15}:)?//.*")) {
      url = ((String)assetOrIdOrUrl);
    } else {
      asset = toAsset(assetOrIdOrUrl);
    }
    if (asset == null && url == null) return "";
    try {
      GatoResizer srv = getResizer();
      srv.setHeight(height);
      srv.setWidth(width);
      srv.setZoom(zoom);
      srv.setUpscale(upscale);
      srv.setCrop(left, right, top, bottom);
      if (url != null) {
        return srv.createLink(url);
      }
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

  public String getCacheStr() {
    String cacheidentifier = "";
    try {
      cacheidentifier = sc.getJCRSession(RepositoryConstants.CONFIG).getProperty("/modules/gato-internal/cachebuster").getString();
    } catch (Exception e) {
      // empty cacheidentifier is fine
    }
    return getCacheStr(cacheidentifier);
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
  public final Pattern DATA_URI_REPAIR_PATTERN = Pattern.compile("/(jpeg|png);base64,(.*)");
  public String richTextFindAndReplaceImages(String str) {
    if (StringUtils.isBlank(str)) return "";
    StringBuffer result = new StringBuffer();
    Matcher matcher = IMAGE_TAG_PATTERN.matcher(str);
    while (matcher.find()) {
      String imageTag = matcher.group();
      String existingSrc = matcher.group(2);
      String existingSrcSet = captureMatch(imageTag, SRCSET_ATTR_PATTERN);
      String newSrc = existingSrc;
      if (!existingSrc.startsWith("data:")) {
        if (existingSrc.length() > 1000) {
          Matcher repairmatcher = DATA_URI_REPAIR_PATTERN.matcher(existingSrc);
          if (repairmatcher.find()) {
            newSrc = "data:image/"+repairmatcher.group(1)+";base64,"+repairmatcher.group(2);
          } else {
            newSrc = "";
          }
        } else if (StringUtils.isBlank(existingSrcSet) && !existingSrc.endsWith(".svg")) {
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
      }
      matcher.appendReplacement(result, "$1" + newSrc + "$3");
    }
    matcher.appendTail(result);
    return result.toString();
  }

  public String richTextAdjustHeaders(String rawhtml, long headerlevel) {
    if (StringUtils.isBlank(rawhtml)) return "";
    Elements body = Jsoup.parse("<!DOCTYPE html><html><head></head><body>"+rawhtml+"</body></html>").select("body");
    long offset = headerlevel-2;
    Elements h2 = body.select("h2");
    Elements h3 = body.select("h3");
    Elements h4 = body.select("h4");
    Elements h5 = body.select("h5");
    Elements h6 = body.select("h6");
    h2.tagName("h"+Long.toString(Math.min(6, 2+offset)));
    h3.tagName("h"+Long.toString(Math.min(6, 3+offset)));
    h4.tagName("h"+Long.toString(Math.min(6, 4+offset)));
    h5.tagName("h"+Long.toString(Math.min(6, 5+offset)));
    h6.tagName("h"+Long.toString(Math.min(6, 6+offset)));

    return body.html();
  }

  public void updateTag(Element h, long level) {
    level = Math.min(6, level);
    h.tagName("h"+Long.toString(level));
  }

  public void addHeaderClass(Element h, long level, long difference) {
    h.addClass("h"+Long.toString(level-difference)+"styles");
  }

  public String fixHeaders(String rawhtml, long highestLevel) {
    Elements body = Jsoup.parse("<!DOCTYPE html><html><head></head><body>"+rawhtml+"</body></html>").select("body");
    Elements allHeaders = body.first().select("h1,h2,h3,h4,h5,h6");

    processHeaders(true, highestLevel, highestLevel-1, 0, allHeaders, highestLevel);
    return body.html();
  }

  public int processHeaders (Boolean isRoot, long currentLevel, long parentLevel, int headerIndex, Elements allHeaders, long highestLevel) {
    while (headerIndex < allHeaders.size()) {
      Element h = allHeaders.get(headerIndex);
      int headerLevel = Integer.parseInt(h.tagName().substring(h.tagName().length()-1));
      long difference = highestLevel-3;
      if (headerLevel > parentLevel) {
        updateTag(h, currentLevel);
        addHeaderClass(h, currentLevel, difference);
        headerIndex = processHeaders(false, currentLevel + 1, headerLevel, headerIndex + 1, allHeaders, highestLevel);
      }
      else if (isRoot) {
        updateTag(h, highestLevel);
        addHeaderClass(h, currentLevel, difference);
        headerIndex = processHeaders(false, highestLevel + 1, headerLevel, headerIndex + 1, allHeaders, highestLevel);
      }
      else if (headerLevel == parentLevel) {
        updateTag(h, currentLevel - 1);
        addHeaderClass(h, currentLevel-1, difference);
        headerIndex++;
      }
      else {
        break;
      }
    }
    return headerIndex;
  }

  public String richTextRemoveEmptyHeaders(String rawhtml) {
    if (StringUtils.isBlank(rawhtml)) return "";
    Elements body = Jsoup.parse("<!DOCTYPE html><html><head></head><body>"+rawhtml+"</body></html>").select("body");
    //Jsoup will only find the first empty header at any given level in a rich editor
    //looping makes sure that they are all found
    //**Update: body.first().select will find all, not just the first */
    Elements headers = body.first().select("h1,h2,h3,h4,h5,h6");
    for (Element header : headers) {
      //trim won't remove &nbsp; and that's what CKEditor puts in the empty headers
      String text = header.text().replace('\u00A0', ' ').trim();
      if (text.length() < 1) {
        header.remove();
      }
    }
    return body.html();
  }

  public final Pattern JUSTIFIED_STYLE_PATTERN = Pattern.compile("text-align:justify", Pattern.CASE_INSENSITIVE);
  public String richTextRemoveJustifiedText(String rawhtml) {
    if (StringUtils.isBlank(rawhtml)) return "";
    Matcher matcher = JUSTIFIED_STYLE_PATTERN.matcher(rawhtml);
    return matcher.replaceAll("text-align:left");
  }

  public String processRichTextLevel(Object str, long headerlevel) {
    if (str == null) return "";
    String rawhtml = (String)str;
    rawhtml = richTextFindAndReplaceImages(rawhtml);
    rawhtml = richTextRemoveEmptyHeaders(rawhtml);
    rawhtml = richTextRemoveJustifiedText(rawhtml);
    if (headerlevel > 0) {rawhtml = fixHeaders(rawhtml, headerlevel);}
    return rawhtml;
  }

  public String processRichText(Object str) {
    if (str == null) return "";
    String rawhtml = (String)str;
    return processRichTextLevel(rawhtml, 2);
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

  //The inheritProperty method from templating functions doesn't work here anymore.  Magnolia 5 does not
  //allow a property to be set to null so it is set to "inherit" if the user chooses to inherit the
  //currency from the parent page.  inheritProperty considers that to be a valid value and will not
  //continue searching the ancestors for a numeric currency value.
  public String getInheritedCurrency(ContentMap content) throws RepositoryException, ValueFormatException{
    //get the currency property for this page
    Property currency = PropertyUtil.getPropertyOrNull(content.getJCRNode(), "currency");
    if(currency == null || currency.getString().equals("inherit")){
      //this page does not have a specific currency set
      if(tf.ancestors(content).isEmpty()){
        //this is the home page so there are no parents to check for a currency
        return null;
      }
      else{
        //check if the parent page has a currency value
        return getInheritedCurrency(tf.parent(content));
      }
    }
    else{
      //this page has a currency set so return it
      return currency.getString();
    }
  }

  //the user can specify how many days their content can be unmodified
  //before they are notified that it needs updating.  Find and return that
  //number of days or return 365 if they have not selected anything.
  public int getStaleTimer(ContentMap content){
    int inheritedCurrency = 365;
    try{
      String currency = getInheritedCurrency(content);
      if(currency != null){
        inheritedCurrency = Integer.parseInt(currency);
      }
    }
    catch(Exception e){
      e.printStackTrace();
      return inheritedCurrency;
    }
    return inheritedCurrency;
  }

  //A page is stale if it has not been updated within
  //the number of days specified by currency
  public boolean isStale(ContentMap content, int currency){
    boolean stale = false;
    try{
      Calendar modificationDate = getModificationDate(content);
      Calendar expirationDate = Calendar.getInstance();
      if(currency > 0){
        expirationDate.add(Calendar.DAY_OF_MONTH, -currency);
      }
      else{
        expirationDate.add(Calendar.YEAR, -1);
      }
      Calendar lastActivationDate = getLastActionDate(content);

      if(lastActivationDate != null){
        if(lastActivationDate.before(modificationDate)){
          stale = modificationDate.before(expirationDate);
        }
        else{
          stale =  lastActivationDate.before(expirationDate);
        }
      }
      return stale;
    }
    catch(Exception e){
      e.printStackTrace();
      return false;
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

  public String formatTime(Date d) {
    Calendar c = Calendar.getInstance();
    c.setTime(d);
    String ret = "";
    if (c.get(Calendar.MINUTE) == 0) {
      if (c.get(Calendar.HOUR_OF_DAY) == 0) ret = "Midnight";
      else if (c.get(Calendar.HOUR_OF_DAY) == 12) ret = "Noon";
      else ret = timeDispFormatNoMinutes.format(d);
    } else {
      ret = timeDispFormat.format(d);
    }
    return ret.replaceAll("AM$", "a.m.").replaceAll("PM$", "p.m.");
  }

  public Node toNode(Object obj) {
    if (obj == null) return null;
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
    List ret = (List) orderedPropertyValues(obj);
    Collections.sort(ret);
    return ret;
  }

  public Collection<String> orderedPropertyValues(Object obj) {
    Node n = toNode(obj);
    List ret = new ArrayList<String>();
    List<Property> props = new ArrayList<Property>();
    try {
      Iterator iter = n.getProperties();
      while (iter.hasNext()) {
        Property p = (Property)iter.next();
        if (!p.getName().startsWith("jcr:") && !p.getName().startsWith("mgnl:")) props.add(p);
      }
      Collections.sort(props, new Comparator<Property>(){
        public int compare(Property a, Property b) {
          try {
            return Integer.valueOf(a.getName()).compareTo(Integer.valueOf(b.getName()));
          } catch (Exception e) {
            return 0;
          }
        }
      });
      for (Property p : props) {
        ret.add(p.getString());
      }
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

  public Collection<String> getTags(Object obj) {
    Collection<String> ret = new ArrayList<String>();
    try {
      Node n = NodeUtil.unwrap(toNode(obj));
      if (n.getParent().getParent().hasNode("filterlist")) {
        Node filterlist = n.getParent().getParent().getNode("filterlist");
        Map<String,String> filterhash = new HashMap<String,String>();
        for (Node filter : NodeUtil.getNodes(filterlist)) {
          filterhash.put(PropertyUtil.getString(filter, "id"), PropertyUtil.getString(filter, "name"));
        }
        if (n.hasNode("tags")) {
          for (String filterid : orderedPropertyValues(n.getNode("tags"))) {
            if (filterhash.containsKey(filterid))
              ret.add(StringUtils.strip(filterhash.get(filterid)));
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return ret;
  }

  public int printStuff(String stuff) {
    System.out.println("PRINTING STUFF");
    System.out.println(stuff);
    return 1;
  }

  public ContentMap getOrCreateArea(Object parent, String childName) {
    return getOrCreateNode(parent, childName, "mgnl:area");
  }

  public ContentMap getOrCreateNode(Object parent, String childName, String type) {
    Node n = toNode(parent);
    ContentMap child = null;
    try {
      if (!n.hasNode(childName)) {
        Session scs = sc.getJCRSession(n.getSession().getWorkspace().getName());
        Node scchild = scs.getNodeByIdentifier(n.getIdentifier()).addNode(childName, type);
        scs.save();
      }
      child = tf.asContentMap(n.getNode(childName));
    } catch (Exception e) {
      try {
        System.out.println("getOrCreateNode page: "+n.getPath());
        System.out.println("getOrCreateNode user: "+MgnlContext.getUser().getName());
      } catch (Exception se) {  }
      e.printStackTrace();
    }
    return child;
  }

  public Node nodeInSystemContext(Node node) throws Exception {
    if (node == null) return null;
    Session scs = sc.getJCRSession(node.getSession().getWorkspace().getName());
    return scs.getNodeByIdentifier(node.getIdentifier());
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
  public List<ContentMap> searchComponentsOnPageInJcrOrder(ContentMap page, List<String> templateIds) throws Exception {
    List<ContentMap> ret = new ArrayList<ContentMap>();
    Map<String, Boolean> map = new HashMap<String, Boolean>();
    for (String tid : templateIds)
      map.put(tid, Boolean.TRUE);
    visitComponents(page.getJCRNode(), (n) -> {
      if (map.containsKey(NodeTypes.Renderable.getTemplate(n)))
        ret.add(tf.asContentMap(n));
    });
    return ret;
  }
  public List<ContentMap> searchComponentsOnPageOrderByModDate(ContentMap page, List<String> templateIds) throws Exception {
    List<ContentMap> ret = searchComponentsOnPageInJcrOrder(page, templateIds);
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
    if (area == null) return false;
    Node n = toNode(area);
    for (Node sp : NodeUtil.getNodes(n, NodeTypes.Component.NAME)) {
        return true;
    }
    return false;
  }
  public boolean hasChildren(Object node) throws Exception {
    if (node == null) return false;
    Node n = toNode(node);
    for (Node sp : NodeUtil.getNodes(n)) {
        return true;
    }
    return false;
  }

  public boolean areaHasChildrenIncludingInheritance(Object node) throws Exception {
    if (node == null) return false;
    //no need to check for inherited children if this page has children of its own
    if (hasChildren(node)) return true;
    Node n = toNode(node);
    String areaName = NodeUtil.getName(n);
    Node page = NodeUtil.getNearestAncestorOfType(n, NodeTypes.Page.NAME);
    List<Node> ancestors =  tf.ancestors(page, NodeTypes.Page.NAME);
    //for each ancestor page, starting with the parent
    ListIterator lit = ancestors.listIterator(ancestors.size());
    while (lit.hasPrevious()) {
      Node p = (Node) lit.previous();
      //check if ancestor page has a node corresponding to the one we are checking
      if (p.hasNode(areaName)) {
        Node area = p.getNode(areaName);
        List<Node> children = tf.children(area);
        Iterator iter = children.iterator();
        //if that node has children, see if inherit == true
        while (iter.hasNext()) {
          Node child = (Node) iter.next();
          if (PropertyUtil.getBoolean(child, "inherit", false)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public List<Node> nonDeletedChildren(Node content, String nodeTypeName) throws RepositoryException {
    return content == null ? null : NodeUtil.asList(NodeUtil.getNodes(content, new NonDeletedNodeTypePredicate(nodeTypeName)));
  }

  public List<ContentMap> nonDeletedChildren(ContentMap content, String nodeTypeName) throws RepositoryException {
    return content == null ? null : tf.asContentMapList(nonDeletedChildren(content.getJCRNode(), nodeTypeName));
  }

  public boolean isCardSection(Object node) {
    if (node == null) return false;
    Node n = toNode(node);
    List<String> cardSections = Arrays.asList(
      "gato-component-cards:components/layouts/masonry",
      "gato-component-cards:components/layouts/grid");
    try {
      String t = NodeTypes.Renderable.getTemplate(n);
      return cardSections.contains(t);
    } catch (Exception e) {
      return false;
    }
  }

  public boolean isPattern(Object node) {
    if (node == null) return false;
    Node n = toNode(node);
    try {
      String template = NodeTypes.Renderable.getTemplate(n);
      return (!StringUtils.isEmpty(template) && ((template.indexOf("gato-component-patterns") > -1) || (template.indexOf("gato-template-home") > -1)));
    } catch (Exception e) {
      return false;
    }

  }

  public boolean isAttached(Object node) {
    if (node == null) return false;
    Node n = toNode(node);
    try {
      return n.getProperty("attachSection").getBoolean();
    } catch (Exception e) {
      return false;
    }
  }

  public String replaceExtension(String url, String newextension) {
    return url.replaceAll("\\.[^/\\.]+$", "."+newextension);
  }

  public String stripExtension(String url) {
    return url.replaceAll("\\.[^/\\.]+$", "");
  }

  public boolean inFuture(Date start, Date end) {
    Date today = new Date();
    if (end != null) {
      return DateUtils.truncatedCompareTo(end, today, Calendar.DAY_OF_MONTH) >= 0;
    } else if (start != null) {
      return DateUtils.truncatedCompareTo(start, today, Calendar.DAY_OF_MONTH) >= 0;
    }
    return true;
  }

  public String linkifyTweet(String text) {
    if (text != null) {
      text = LINK_PATTERN.matcher(text).replaceAll("<a href=\"$1\">$1</a>");
      text = USER_PATTERN.matcher(text).replaceAll("<a href=\"//twitter.com/$2\">$0</a>");
      text = HASHTAG_PATTERN.matcher(text).replaceAll("<a href=\"//twitter.com/search?q=%23$2\">$0</a>");
    }
    return text;
  }

  public String linkifyInstagram(String text) {
    if (text != null) {
      text = IG_USER_PATTERN.matcher(text).replaceAll("<a href=\"//instagram.com/$2\">$0</a>");
      text = HASHTAG_PATTERN.matcher(text).replaceAll("<a href=\"//instagram.com/explore/tags/$2/\">$0</a>");
    }
    return text;
  }

  public String linkify(String text) {
    if (text != null) {
      text = LINK_PATTERN.matcher(text).replaceAll("<a href=\"$1\">$1</a>");
    }
    return text;
  }

  public String textToHtmlWithMaxLines(String text, int maxlines, int charsperline) {
    if (StringUtils.isBlank(text)) return "";
    text = StringUtils.strip(text);
    StringBuilder ret = new StringBuilder();
    String[] lines = text.split("\\r?\\n");
    int linecount = 0;
    int chars = 0;
    for (String line : lines) {
      String[] words = line.split("\\s+");
      for (String word : words) {
        if (StringUtils.isBlank(word)) continue;
        String wordret = word+" ";
        if (LINK_PATTERN.matcher(word).matches()) {
          String longword = word;
          if (word.length() > charsperline) word = word.substring(0, charsperline-5)+"...";
          wordret = "<a href=\""+longword+"\">"+word+"</a> ";
        }
        if (word.length() + chars > charsperline) {
          linecount += 1;
          if (linecount >= maxlines) break;
          chars = Math.max(0, word.length() - charsperline + 1);
        } else {
          chars += 1 + word.length();
        }
        ret.append(wordret);
      }
      linecount += 1;
      chars = 0;
      ret.append("<br>");
      if (linecount >= maxlines) break;
    }
    return ret.toString().replaceAll("(<br>)+$"," ")+"...";
  }

  // freemarker seems to suck at dates. let's try to parse them in Java
  public Date parseJsonDate(String datestr) {
    try {
      return jsonDateFormat.parse(datestr);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  public String httpGetContent(String link) {
    String output = "";
    HttpURLConnection c = null;
    HashMap<String, Integer> visited = new HashMap<String, Integer>();

    while (true) {
      try {
        int times = visited.compute(link, (key, count) -> count == null ? 1 : count + 1);
        if (times > 3) throw new Exception("Stuck in redirect loop");
        URL myurl = new URL(link);
        c = (HttpURLConnection) myurl.openConnection();
        c.setConnectTimeout(5000);
        c.setInstanceFollowRedirects(false);
        if (c.getResponseCode() >= 200 && c.getResponseCode() <= 299) {
          BufferedReader in = new BufferedReader(new InputStreamReader(c.getInputStream()));
          String inputLine;
          while ((inputLine = in.readLine()) != null)
              output += inputLine.trim() + "\n";
          in.close();
          break;
        } else if (c.getResponseCode() == HttpURLConnection.HTTP_MOVED_PERM || c.getResponseCode() == HttpURLConnection.HTTP_MOVED_TEMP) {
          String location = java.net.URLDecoder.decode(c.getHeaderField("Location"), "UTF-8");
          URL next     = new URL(myurl, location);  // Deal with relative URLs
          link     = next.toExternalForm();
        } else if (c.getResponseCode() == 403 && link.startsWith("http:")) {
          link = link.replaceFirst("^http:", "https:");
        }
      } catch (Exception e) {
        e.printStackTrace();
        output = "";
        break;
      } finally {
        try {
          c.disconnect();
        } catch (Exception e) {

        }
      }
    }
    return output;
  }

  public String httpGetContentWithParameters(String url) {
    if (MgnlContext.getParameters().isEmpty()) {
      return httpGetContent(url);
    }
    else {
      String parameters = "";
      for (String key : MgnlContext.getParameters().keySet()) {
        if (key.toCharArray()[0] == 'q') {
          parameters = key + "=" + "&" + parameters;
        }
        else {
          parameters += key + "=" + URLEncoder.encode(MgnlContext.getParameters().get(key)) + "&";
        }
      }
      parameters = "?" + parameters;
      System.out.println("Requesting HTML from: " + url + parameters);
      return httpGetContent(url + parameters);
    }
  }

  public JsonObject parseJSON(String json) {
    Matcher m = JSONP_PATTERN.matcher(json);
    if (m.find()) json = m.group(1);
    try {
      JsonObject ret = new JsonParser().parse(json).getAsJsonObject();
      return ret;
    } catch (Exception e) {
      return null;
    }
  }

  public String toJSON(Object obj) {
    return new Gson().toJson(obj);
  }

  public Object restClientNodeToFreemarker(JsonNode node) {
    if (node.isObject()) {
      Map<String,Object> ret = new HashMap<String,Object>();
      Iterator<String> iter = node.getFieldNames();
      while (iter.hasNext()) {
        String next = iter.next();
        ret.put(next, restClientNodeToFreemarker(node.get(next)));
      }
      return ret;
    } else if (node.isArray()) {
      List<Object> ret = new ArrayList<Object>();
      Iterator<JsonNode> iter = node.getElements();
      while (iter.hasNext()) {
        JsonNode next = iter.next();
        ret.add(restClientNodeToFreemarker(next));
      }
      return ret;
    } else if (node.isNull()) {
      return "";
    } else if (node.isBoolean()) {
      return node.asBoolean();
    } else if (node.isIntegralNumber()) {
      return node.asLong();
    } else if (node.isNumber()) {
      return node.asDouble();
    } else {
      return node.asText();
    }
  }

  public String tidyHTML(String rawhtml) {
    if (StringUtils.isBlank(rawhtml)) return "";
    return Jsoup.parse("<!DOCTYPE html><html><head></head><body>"+rawhtml+"</body></html>").body().html();
  }

  public static class SilencingErrorHandler implements ErrorHandler {
    public void warning(CSSParseException exception) throws CSSException {
    }
    public void error(CSSParseException exception) throws CSSException {
    }
    public void fatalError(CSSParseException exception) throws CSSException {
    }
  }
  protected final ErrorHandler csserrorhandler = new SilencingErrorHandler();

  public String tidyCSS(String rawcss) {
    if (StringUtils.isBlank(rawcss)) return "";
    rawcss = Arrays.stream(rawcss.split(System.lineSeparator()))
      .map(line -> {
          if (!line.contains("imagehandler/scaler/gato-edit.its.txstate.edu")) return line;
          else {
            System.out.println("Detected gato-edit link. Replacing with gato-docs: " + line);
            String image = line.split("jcr:")[1];
            String imageJCRId = image.split("/")[0];
            String queryParams = "";
            if (image.indexOf('?') > -1) {
              queryParams = "?" + image.split("\\?")[1].split("\\)")[0];
            }
            String getLinkInCurrentEnvironment = getImgDefault("jcr:" + imageJCRId).split("\\?")[0] + queryParams;
            String linkUsingEnvironment = line.replaceFirst("\\burl.*\\w+\\)", "url(" + getLinkInCurrentEnvironment + ")");
            return linkUsingEnvironment;
          }
        })
      .collect(Collectors.joining());
    StringBuilder ret = new StringBuilder(rawcss.length());
    try {
      InputSource source = new InputSource(new StringReader(rawcss));
      CSSOMParser cssparser = new CSSOMParser(new SACParserCSS3());
      cssparser.setErrorHandler(csserrorhandler);
      CSSStyleSheet sheet = cssparser.parseStyleSheet(source, null, null);
      for (int i = 0; i < sheet.getCssRules().getLength(); i++) {
        ret.append(sheet.getCssRules().item(i).getCssText()+"\n");
      }
    } catch (Exception e) {
    }
    return ret.toString();
  }

  public JsonObject oEmbedCached(Object node) {
    try {
      Node n = toNode(node);
      if (n == null) return new JsonObject();
      n = NodeUtil.unwrap(n);
      String url = PropertyUtil.getString(n, "videourl", "").trim();
      if (StringUtils.isBlank(url)) return new JsonObject();
      String json = getDaCastEmbedJson(url);
      if (!StringUtils.isBlank(json)) return parseJSON(json);
      String embed = PropertyUtil.getString(n, "embed");
      Calendar saved = PropertyUtil.getDate(n, "embedsaved", Calendar.getInstance());
      Calendar cutoffdate = Calendar.getInstance();
      cutoffdate.add(Calendar.MONTH, -2);
      String savedurl = PropertyUtil.getString(n, "embedsavedurl", "");
      if (StringUtils.isBlank(embed) || "null".equals(embed) || saved.before(cutoffdate) || !savedurl.equals(url)) {
        embed = (new GsonBuilder()).create().toJson(oEmbedAutodiscover(url));
        if (!StringUtils.isBlank(embed) && !"null".equals(embed)) {
          Node sn = nodeInSystemContext(n);
          sn.setProperty("embed", embed);
          sn.setProperty("embedsaved", Calendar.getInstance());
          sn.setProperty("embedsavedurl", url);
          sn.save();
        }
      }
      return parseJSON(embed);
    } catch (Exception e) {
      e.printStackTrace();
      return new JsonObject();
    }
  }

  public String isVideoOrLink(String url) {
    if (url.contains("vimeo")) return "video";
    else return "link";
  }

  public String getDaCastEmbedJson(String url) {
    String daCastId = "";
    Matcher d = DACAST_URL_PATTERN.matcher(url);
    if (d.find()) {
      daCastId = d.group(1);
    }
    Matcher s = DACAST_SCRIPT_PATTERN.matcher(url);
    if (s.find()) {
      daCastId = s.group(1);
    }
    daCastId = daCastId.replaceAll("_", "/");
    if (StringUtils.isBlank(daCastId)) return "";
    return "{\"title\":\"Video Stream\",\"html\":\"<iframe allowfullscreen=\\\"\\\" frameborder=\\\"0\\\" mozallowfullscreen=\\\"\\\" msallowfullscreen=\\\"\\\" oallowfullscreen=\\\"\\\" scrolling=\\\"no\\\" src=\\\"//iframe.dacast.com/b/"+daCastId+"\\\" webkitallowfullscreen=\\\"\\\" style=\\\"width: 100%; height: 100%\\\"></iframe>\"}";
  }

  public JsonObject oEmbedAutodiscover(String url) {
    if (StringUtils.isBlank(url)) return null;
    try {
      String oEmbedUrl = Jsoup.connect(url).followRedirects(true).get().select("link[type=\"application/json+oembed\"]").attr("href");
      String finalUrl = new URL(new URL(url), oEmbedUrl).toString();
      String oEmbedJson = httpGetContent(finalUrl);
      if (StringUtils.isBlank(oEmbedJson)) return null;
      return parseJSON(oEmbedJson);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  public int jsonGetInteger(JsonObject obj, String key) {
    if (obj == null || StringUtils.isBlank(key) || !obj.has(key)) return 0;
    return obj.getAsJsonPrimitive(key).getAsInt();
  }

  public String jsonGetString(JsonObject obj, String key) {
    if (obj == null || StringUtils.isBlank(key) || !obj.has(key)) return "";
    return obj.getAsJsonPrimitive(key).getAsString();
  }

  public boolean jsonGetBoolean(JsonObject obj, String key) {
    if (obj == null || StringUtils.isBlank(key) || !obj.has(key)) return false;
    boolean ret = obj.getAsJsonPrimitive(key).getAsBoolean();
    return ret;
  }

  public String uuidToHtmlId(String uuid) {
    String ret = uuid.substring(0,8);
    if (ret.matches("^[^a-zA-Z].*")) ret = "f"+ret;
    return ret;
  }

  public String htmlId(Object content) {
    Node n = toNode(content);
    String id = "";
    try {
      id = n.getIdentifier();
    } catch (Exception e) {
      return "";
    }
    return uuidToHtmlId(id);
  }

  public int getTemplateColorCount(String templateId) {
    //get the color configuration file
    String template = templateId.substring(0, templateId.indexOf(':'));
    String path =  getConfigProperty("magnolia.resources.dir") + "/" + template + "/js/color-picker-config.js";
    try {
      InputStream inputStream = new FileInputStream(path);
      BufferedReader buffer = new BufferedReader(new InputStreamReader(inputStream));
      String line = buffer.readLine();
      StringBuilder sb = new StringBuilder();
      while(line != null){
         sb.append(line).append("\n");
         line = buffer.readLine();
      }
      String json = sb.toString();
      JsonObject colorConfig = parseJSON(json);
      JsonObject defaultConfig = colorConfig.getAsJsonObject("default");
      JsonArray colorList = defaultConfig.getAsJsonArray("colors");
      return colorList.size();
    }
    catch(Exception e) {
      e.printStackTrace();
      return 7;
    }
  }

  //alphabetizeBy can be one property or a comma separated list of properties
  public List<ContentMap> sortFilterableSearchItems(List<ContentMap> listItems, String alphabetizeBy) {
    List<ContentMap> modifiableList = new ArrayList<ContentMap>(listItems);
    String[] fields = alphabetizeBy.split(",");
    modifiableList.sort(new Comparator<ContentMap>() {
      public int compare(ContentMap a, ContentMap b) {
        try {
          Node nodeA = a.getJCRNode();
          Node nodeB = b.getJCRNode();
          String aSortBy = "";
          String bSortBy = "";
          for (int i=0; i<fields.length; i++) {
            aSortBy += PropertyUtil.getString(nodeA, fields[i], "");
            bSortBy += PropertyUtil.getString(nodeB, fields[i], "");
          }
          return aSortBy.compareToIgnoreCase(bSortBy);
        } catch(Exception e) {
          e.printStackTrace();
        }
        return 0;
      }
    });
    return modifiableList;
  }

  public boolean isUUID(String input) {
    return UUID_PATTERN.matcher(input).matches();
  }

  public String truncateText(String text, int limit, String terminator) {
    int initialLength = text.length();
    if (initialLength < limit) return text;
    if (!StringUtils.isEmpty(text)) {
      int end = limit;
      while(end < text.length() && text.charAt(end) != ' ') {
        end++;
      }
      text = text.substring(0,end);
    }
    return (text.length() < initialLength) ? text + terminator : text;
  }
}
