package edu.txstate.its.gato;

import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.metadata.MagnoliaAssetMetadata;

public class GalleryImage {
  private final Asset asset;
  private final GatoUtils gf;

  public GalleryImage(Asset asset, GatoUtils gf) {
    this.asset = asset;
    this.gf = gf;
  }

  public String getUrl() {
    return asset.getLink();
  }

  public String getLargeUrl() {
    return gf.getImgDefault(asset);
  }

  public String getThumbUrl() {
    return gf.getImgSquare(asset, 0f, 0f, 0f, 0f); //FIXME: need crop values.
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
