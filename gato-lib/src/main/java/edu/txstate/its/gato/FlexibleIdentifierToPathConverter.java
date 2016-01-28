package edu.txstate.its.gato;

import info.magnolia.ui.form.field.converter.BaseIdentifierToPathConverter;
import java.util.Locale;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;

/**
 * Like Magnolia's BaseIdentifierToPathConverter, but does not return null
 * when the path doesn't match something, just leaves it alone.
 * This way users can use the same field to enter internal and external links
 */
public class FlexibleIdentifierToPathConverter extends BaseIdentifierToPathConverter {
  protected final Pattern UUID_PATTERN = Pattern.compile("[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}");
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
  public String convertToPresentation(String uuid, Class<? extends String> targetType, Locale locale) throws ConversionException {
    if (StringUtils.isBlank(uuid)) return StringUtils.EMPTY;
    if (!UUID_PATTERN.matcher(uuid).matches()) return uuid;
    return super.convertToPresentation(uuid, targetType, locale);
  }
}
