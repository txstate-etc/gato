package edu.txstate.its.gato;

import info.magnolia.cms.beans.runtime.FileProperties;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.PropertyUtil;

import java.net.URI;
import javax.inject.Inject;

import javax.jcr.Node;
import javax.jcr.Property;

import org.apache.commons.lang3.StringUtils;

/**
 * Class for constructing links that send images through a resize process.
 *
 * This one is for the Texas State imagehandler server.
 */
public class ImagingModuleResizer extends GatoResizer {
  @Inject
  public ImagingModuleResizer(GatoUtils gf) {
    super(gf);
  }

  @Override
  public String createLink(Property binaryProperty) {
    String fileName = null;

    try {
      final String workspaceName = binaryProperty.getSession().getWorkspace().getName();
      final Node parent = binaryProperty.getParent();
      final String path = parent.getPath();
      final String extension = PropertyUtil.getString(parent, FileProperties.EXTENSION);

      fileName = PropertyUtil.getString(parent, FileProperties.PROPERTY_FILENAME);

      if (StringUtils.isNotEmpty(extension)) {
        fileName += "." + extension;
      }
      fileName = new URI(null, null, fileName, null).toASCIIString();

      String mgnlpath = gf.absoluteUrl(MgnlContext.getContextPath() + "/" + workspaceName + path + "/" + fileName);
      
      // todo: send this through the imaging module resizer
      return mgnlpath;
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }
}