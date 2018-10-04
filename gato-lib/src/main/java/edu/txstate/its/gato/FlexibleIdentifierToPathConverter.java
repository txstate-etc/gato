package edu.txstate.its.gato;

import info.magnolia.ui.form.field.converter.BaseIdentifierToPathConverter;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;

import com.vaadin.v7.data.util.converter.Converter.ConversionException;

/**
 * Like Magnolia's BaseIdentifierToPathConverter, but does not return null
 * when the path doesn't match something, just leaves it alone.
 * This way users can use the same field to enter internal and external links
 */
public class FlexibleIdentifierToPathConverter extends BaseIdentifierToPathConverter {
  protected final Pattern UUID_PATTERN = Pattern.compile("([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})(#[-\\w]+)?");
  protected final Pattern HASH_PATTERN = Pattern.compile("(.*?)(#[-\\w]+)");
  @Override
  public String convertToModel(String path, Class<? extends String> targetType, Locale locale) throws ConversionException {
    String ret = null;
    try {
      Matcher m = HASH_PATTERN.matcher(path);
      String pre = path;
      String hash = "";
      if (m.matches()) {
        pre = m.group(1);
        hash = m.group(2);
      }
      String sup = super.convertToModel(pre, targetType, locale);
      if (StringUtils.isBlank(sup))
        if (!StringUtils.isBlank(pre)) ret = pre+hash;
        else ret = null;
      else ret = sup+hash;
    } catch (Exception e) {
      // if it does not convert, just return it as is
    }
    if (ret == null && !StringUtils.isBlank(path)) return path;
    return ret;
  }

  @Override
  public String convertToPresentation(String uuid, Class<? extends String> targetType, Locale locale) throws ConversionException {
    if (StringUtils.isBlank(uuid)) return StringUtils.EMPTY;
    Matcher m = UUID_PATTERN.matcher(uuid);
    if (m.matches()) {
      String uid = m.group(1);
      String hash = m.group(2);
      if (hash == null) hash = "";
      String sup = super.convertToPresentation(uid, targetType, locale);
      if (StringUtils.isBlank(sup)) return hash;
      else return sup+hash;
    } else {
      return uuid;
    }
  }
}
