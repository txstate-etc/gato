package edu.txstate.its.gato;

import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.metadata.MagnoliaAssetMetadata;

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

  public String getSizeAttr() {
    MagnoliaAssetMetadata metadata = (MagnoliaAssetMetadata)asset.getMetadata(MagnoliaAssetMetadata.class);
    return "" + metadata.getWidth() + "x" + metadata.getHeight();
  }

}
