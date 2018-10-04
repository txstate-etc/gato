package edu.txstate.its.gato;

import info.magnolia.dam.app.assets.field.translator.AssetCompositeIdKeyTranslator;
import java.util.Locale;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;

import com.vaadin.v7.data.util.converter.Converter.ConversionException;

/**
 * Like Magnolia's BaseIdentifierToPathConverter, but does not return null
 * when the path doesn't match something, just leaves it alone.
 * This way users can use the same field to enter internal and external links
 */
public class FlexibleAssetCompositeIdKeyTranslator extends AssetCompositeIdKeyTranslator {
  protected final Pattern ITEMKEY_PATTERN = Pattern.compile("^([a-z]+):([a-f0-9\\-]+)$");
  @Override
  public String convertToModel(String path, Class<? extends String> targetType, Locale locale) throws ConversionException {
    String ret = null;
    try {
      ret = super.convertToModel(path, targetType, locale);
    } catch (Exception e) {
      // if it does not convert, just return it as is
    }
    if (ret == null && !StringUtils.isBlank(path)) return path;
    return ret;
  }

  @Override
  public String convertToPresentation(String itemkeyorpath, Class<? extends String> targetType, Locale locale) throws ConversionException {
    if (StringUtils.isBlank(itemkeyorpath)) return StringUtils.EMPTY;
    if (!ITEMKEY_PATTERN.matcher(itemkeyorpath).matches()) return itemkeyorpath;
    return super.convertToPresentation(itemkeyorpath, targetType, locale);
  }
}
