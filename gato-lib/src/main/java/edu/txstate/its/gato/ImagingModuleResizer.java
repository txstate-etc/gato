package edu.txstate.its.gato;

import info.magnolia.cms.beans.runtime.FileProperties;
import info.magnolia.context.MgnlContext;
import info.magnolia.dam.api.Asset;
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
  public String createLink(Asset asset) {
    try {
      // todo: send this through the imaging module resizer
      return asset.getLink();
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }
}