package edu.txstate.its.gato.vaadin;

import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.transformer.basic.BasicTransformer;
import info.magnolia.ui.vaadin.integration.jcr.DefaultProperty;

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
    Matcher matcher = UstreamUtils.CHANNEL_PATTERN.matcher(value);
    if (!matcher.find()) { return; }

    Property<String> p = getOrCreateProperty(type);
    Property<String> urlP = relatedFormItem.getItemProperty("videoid_url");
    if (urlP == null) {
      urlP = new DefaultProperty<String>(String.class, null);
      relatedFormItem.addItemProperty("videoid_url", urlP);
    }

    // If the url is the same as the one used in the last api request, then just keep the old value
    if (p.getValue() != null && value.equals(urlP.getValue())) { return; }
    String channelId = UstreamUtils.getChannelId(matcher.group(1));
    if (channelId != null) {
      p.setValue(channelId);

      if (channelId.equals("")) {
        urlP.setValue("");
      } else {
        urlP.setValue(value);
      }
    }
  }
}
