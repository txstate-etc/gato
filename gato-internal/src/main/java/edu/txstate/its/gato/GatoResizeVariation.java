package edu.txstate.its.gato;

import edu.txstate.its.gato.GatoUtils;

import info.magnolia.cms.beans.runtime.FileProperties;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.site.SiteManager;
import info.magnolia.templating.imaging.variation.SimpleResizeVariation;

import java.net.URI;
import java.net.URISyntaxException;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Gato version of SimpleResizeVariation that creates a link to our image-handler server
 * instead of the magnolia imaging module.
 */
public class GatoResizeVariation extends SimpleResizeVariation {
  protected final GatoUtils gf;
  private static final Logger log = LoggerFactory.getLogger(GatoResizeVariation.class);
  
  @Inject
  public GatoResizeVariation(SiteManager siteManager, GatoUtils gf) {
    super(siteManager);
    this.gf = gf;
  }
    
  @Override
  public String createLink(Property binaryProperty) {
    String fileName = null;

    try {
      final String workspaceName = binaryProperty.getSession().getWorkspace().getName();
      final Node parent = binaryProperty.getParent();
      final String path = parent.getPath();
      final String extension = PropertyUtil.getString(parent, FileProperties.EXTENSION);
      final long width = getWidth();
      final long height = getHeight();

      fileName = PropertyUtil.getString(parent, FileProperties.PROPERTY_FILENAME);

      if (StringUtils.isNotEmpty(extension)) {
        fileName += "." + extension;
      }
      fileName = new URI(null, null, fileName, null).toASCIIString();

      String mgnlpath = gf.absoluteUrl(MgnlContext.getContextPath() + "/" + workspaceName + path + "/" + fileName).replaceAll("^\\w{3,15}://", "");
          
      String returl = gf.getImageHandlerBase()+gf.getCacheStr(parent)+"/imagehandler/scaler/"+mgnlpath+"?mode=fit";
      if (width > 0) returl += "&amp;width="+width;
      if (height > 0) returl += "&amp;height="+height;
      return returl;
    } catch (RepositoryException e) {
      log.warn("Could not create link for property [{}].", binaryProperty, e);
    } catch (URISyntaxException e) {
      log.warn("Could not create link for image due to illegal property file name [{}].", fileName, e);
    }

    return null;
  }
}