package edu.txstate.its.gato.dialog.field.validator;

import info.magnolia.dam.api.Asset;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;

import com.google.common.net.MediaType;
import com.vaadin.data.validator.AbstractStringValidator;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DamChooserImageValidator extends AbstractStringValidator {
  private static final Logger log = LoggerFactory.getLogger(DamChooserImageValidator.class);

  protected final DamTemplatingFunctions damTemplatingFunctions;
  private List<MediaType> supportedMediaTypes;
  
  public DamChooserImageValidator(String errorMessage, DamTemplatingFunctions damTemplatingFunctions) {
    super(errorMessage);
    this.damTemplatingFunctions = damTemplatingFunctions;

    supportedMediaTypes = new ArrayList<MediaType>();
    supportedMediaTypes.add(MediaType.parse("image/*"));
  }

  @Override
  protected boolean isValidValue(String value) {
    if (StringUtils.isBlank(value)) {
      return true;
    }
    
    Asset asset = damTemplatingFunctions.getAsset(value);
    if (asset == null) {
      return false;
    }

    MediaType mediaType = null;
    try {
      mediaType = MediaType.parse(asset.getMimeType());
    } catch (Exception e) {
      log.debug("asset ({}) mime type not parseable. ", value, e);
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
