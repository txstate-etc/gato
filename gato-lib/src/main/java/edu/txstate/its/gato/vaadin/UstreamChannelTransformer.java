package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.transformer.basic.BasicTransformer;

import java.util.regex.Matcher;

import com.vaadin.data.Item;
import com.vaadin.data.Property;

import edu.txstate.its.gato.UstreamUtils;

public class UstreamChannelTransformer extends BasicTransformer<String> {

  public UstreamChannelTransformer(Item relatedFormItem, ConfiguredFieldDefinition definition, Class<String> type) {
    super(relatedFormItem, definition, type);
  }

  @Override
  public void writeToItem(String value) {
    Property<String> p = getOrCreateProperty(type);

    Matcher matcher = UstreamUtils.CHANNEL_PATTERN.matcher(value);
    if (matcher.find()) {
      p.setValue(UstreamUtils.getChannelId(matcher.group(1)));
    } else {
      p.setValue("");
    }
  }
}
