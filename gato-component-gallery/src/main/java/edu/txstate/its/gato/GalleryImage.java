package edu.txstate.its.gato;

import info.magnolia.dam.api.Asset;

public class GalleryImage {
  private Asset asset;

  public GalleryImage(Asset asset) {
    this.asset = asset;
  }

  public String getUrl() {
    return asset.getLink();
  }

  public String getLargeUrl() {
    return asset.getLink();
  }

  public String getThumbUrl() {
    return asset.getLink();
  }

  public String getCaption() {
    return asset.getCaption();
  }

  public String getAlt() {
    return asset.getTitle();
  }

  public String getRel() {
    return "";
  }

}
