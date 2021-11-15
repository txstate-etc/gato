package edu.txstate.its.gato;

import info.magnolia.ui.workbench.column.AbstractColumnFormatter;
import javax.inject.Inject;
import javax.jcr.Item;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import info.magnolia.dam.jcr.AssetNodeTypes;
import info.magnolia.jcr.util.PropertyUtil;
import org.apache.commons.io.FileUtils;

import com.vaadin.v7.ui.Table;

public class AssetSizeColumnFormatter extends AbstractColumnFormatter<AssetSizeColumnDefinition> {

  private static final Logger log = LoggerFactory.getLogger(AssetSizeColumnFormatter.class);

  @Inject
  public AssetSizeColumnFormatter(AssetSizeColumnDefinition definition) {
      super(definition);
  }

  @Override
  public Object generateCell(Table source, Object itemId, Object columnId) {
    final Item jcrItem = getJcrItem(source, itemId);
    try {
      if (jcrItem != null && jcrItem.isNode() && ((Node) jcrItem).getPrimaryNodeType().getName().equals(AssetNodeTypes.Asset.NAME)) {
        Long size = PropertyUtil.getLong(((Node) jcrItem).getNode(AssetNodeTypes.AssetResource.RESOURCE_NAME), AssetNodeTypes.AssetResource.SIZE);
        return FileUtils.byteCountToDisplaySize(size);
      }
    } catch (RepositoryException e) {
      log.warn("Unable to get the file size for column", e);
    }
    return "";
  }
}
