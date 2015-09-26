package edu.txstate.its.gato;

import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.AssetQuery;
import info.magnolia.dam.api.Folder;
import info.magnolia.dam.api.Item;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;

import com.google.common.net.MediaType;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.Value;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GalleryModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
  private static final Logger log = LoggerFactory.getLogger(GalleryModel.class);

  private final GatoUtils gf;
  private final DamTemplatingFunctions damTemplatingFunctions;
  private final List<MediaType> supportedMediaTypes;
  private final List<GalleryImage> images;

  @Inject
  public GalleryModel(Node content, RD definition, RenderingModel<?> parent, GatoUtils gf, DamTemplatingFunctions damTemplatingFunctions) {
    super(content, definition, parent);

    this.gf = gf;
    this.damTemplatingFunctions = damTemplatingFunctions;
    this.supportedMediaTypes = new ArrayList<MediaType>();
    supportedMediaTypes.add(MediaType.parse("image/*"));

    this.images = buildImageList();
  }

  public List<GalleryImage> getImages() {
    return images;
  }

  private List<GalleryImage> buildImageList() {
    List<GalleryImage> list = new ArrayList<GalleryImage>();
    Value[] values = getPropertyValues();
    for (Value value : values) {
      String itemKey = PropertyUtil.getValueString(value);
      addAssetsForItemKey(itemKey, list);
    }
    return list;
  }

  private Value[] getPropertyValues() {
    Property property = PropertyUtil.getPropertyOrNull(content, "images");
    if (property != null) {
      try {
        return property.getValues();
      } catch (Exception e) {
        log.error("Failed to get images property values for node", e);
      }
    }
    return new Value[]{};
  }

  private void addAssetsForItemKey(String itemKey, List<GalleryImage> list) {
    log.debug("addAssetsForItemKey: {}", itemKey);
    if (addSingleAsset(itemKey, list)) {
      return;
    }

    addFolderAssets(itemKey, list);
  }

  private boolean addSingleAsset(String itemKey, List<GalleryImage> list) {
    Asset asset = damTemplatingFunctions.getAsset(itemKey);
    if (isValid(asset)) {
      log.debug("addSingleAsset: {} - {}", itemKey, asset.getName());
      addAssetToList(asset, list);
    }

    return asset != null;
  }

  private boolean addFolderAssets(String itemKey, List<GalleryImage> list) {
    Folder folder = damTemplatingFunctions.getFolder(itemKey);
    if (folder == null) {
      return false;
    }
    
    log.debug("addFolderAssets: {} - {}", itemKey, folder.getName());

    addFolderChildren(folder, list);

    return true;
  }

  private void addFolderChildren(Folder folder, List<GalleryImage> list) {
    Iterator<Item> items = folder.getChildren();
    while (items.hasNext()) {
      Item item = items.next();
      if (item.isAsset()) {
        Asset asset = (Asset)item;
        if (isValid(asset)) {
          log.debug("    adding item: {}", asset.getFileName());
          addAssetToList(asset, list);
        }
      } else {
        log.debug("    adding folder: {}", item.getName());
        addFolderChildren((Folder)item, list);
      }
    }
  }

  private void addAssetToList(Asset asset, List<GalleryImage> list) {
    list.add(new GalleryImage(asset, gf));
  }

  private boolean isValid(Asset asset) {
    if (asset == null) {
      return false;
    }

    MediaType mediaType = null;
    try {
      mediaType = MediaType.parse(asset.getMimeType());
    } catch (Exception e) {
      log.debug("asset ({}) mime type not parseable. ", asset.getPath(), e);
    }

    if (mediaType == null) {
      return false;
    }
    
    for (MediaType configuredMediaType : getSupportedMediaTypes()) {
      if (mediaType.is(configuredMediaType)) {
        return true;
      }
    }

    return false;
  }

  public List<MediaType> getSupportedMediaTypes() {
    return supportedMediaTypes;
  }
}
