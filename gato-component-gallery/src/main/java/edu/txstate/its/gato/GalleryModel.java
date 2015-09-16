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

  private final DamTemplatingFunctions damTemplatingFunctions;
  private final List<MediaType> supportedMediaTypes;
  private final List<GalleryImage> images;

  @Inject
  public GalleryModel(Node content, RD definition, RenderingModel<?> parent, DamTemplatingFunctions damTemplatingFunctions) {
    super(content, definition, parent);

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
    if (addSingleAsset(itemKey, list)) {
      return;
    }

    addFolderAssets(itemKey, list);
  }

  private boolean addSingleAsset(String itemKey, List<GalleryImage> list) {
    Asset asset = damTemplatingFunctions.getAsset(itemKey);
    if (isValid(asset)) {
        list.add(new GalleryImage(asset));
    }

    return asset != null;
  }

  private boolean addFolderAssets(String itemKey, List<GalleryImage> list) {
    Folder folder = damTemplatingFunctions.getFolder(itemKey);
    if (folder == null) {
      return false;
    }

    AssetQuery query = new AssetQuery.Builder()
      .fromFolder(folder)
      .withMediaType(supportedMediaTypes.toArray(new MediaType[]{}))
      .build();

    Iterator<Item> items = Collections.emptyIterator();
    try {
      items = folder.getAssetProvider().list(query);
    } catch (Exception e) {
      log.warn("Exception occurred for the following query '{}'", query.toString(), e);
    }

    while (items.hasNext()){
      Item item = items.next();
      if (item.isAsset()) {
        list.add(new GalleryImage((Asset)item));
      }
    }

    return true;
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
