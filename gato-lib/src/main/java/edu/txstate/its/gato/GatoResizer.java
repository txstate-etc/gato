package edu.txstate.its.gato;

import info.magnolia.dam.api.Asset;

import javax.inject.Inject;

/**
 * Class for constructing links that send images through a resize process.
 *
 * This one is for the Texas State imagehandler server.
 */
public abstract class GatoResizer {
  protected final GatoUtils gf;
  protected long width = 0;
  protected long height = 0;
  protected long cropleft = 0;
  protected long cropright = 0;
  protected long croptop = 0;
  protected long cropbottom = 0;
  protected boolean upscale = false;
  protected boolean zoom = false;
    
  @Inject
  public GatoResizer(GatoUtils gf) {
    this.gf = gf;
  }
  
  public String createLink(Asset asset) {
    try {
      // default, don't resize, just send back a straight link
      return asset.getLink();
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }
  
  public void setCrop(long left, long right, long top, long bottom) {
  	this.cropleft = left;
  	this.cropright = right;
  	this.croptop = top;
  	this.cropbottom = bottom;
  }
  
  public void setWidth(long width) {
  	this.width = width;
  }
  
  public void setHeight(long height) {
  	this.height = height;
  }
  
  public void setUpscale(boolean upscale) {
  	this.upscale = upscale;
  }
  
  public void setZoom(boolean zoom) {
  	this.zoom = zoom;
  }
}