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
public class TxStateResizer extends GatoResizer {
  @Inject
  public TxStateResizer(GatoUtils gf) {
    super(gf);
  }

  @Override
  public String createLink(Asset asset) { // really need to pass an asset
    try {

      String mgnlpath = gf.absoluteUrl(asset.getLink()).replaceAll("^\\w{3,15}://", "");
      String mode = "fit";
      if (zoom) mode = "crop";
      
      String returl = gf.getImageHandlerBase()+gf.getCacheStr(asset)+"/imagehandler/scaler/"+mgnlpath+"?mode="+(zoom ? "crop" : "fit");
      if (width > 0) returl += "&amp;width="+width;
      if (height > 0) returl += "&amp;height="+height;
      if (croptop > 0) returl += "&amp;croptop="+croptop;
      if (cropbottom > 0) returl += "&amp;cropbottom="+cropbottom;
      if (cropleft > 0) returl += "&amp;cropleft="+cropleft;
      if (cropright > 0) returl += "&amp;cropright="+cropright;
      if (!upscale) returl += "&amp;nogrow=1";
      return returl;
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }
}