package edu.txstate.its.gato;

import info.magnolia.dam.api.Asset;
import javax.inject.Inject;

/**
 * Class for constructing links that send images through a resize process.
 *
 * This one is for development boxes that want to deactivate resizing.
 */
public class NullResizer extends GatoResizer {
  @Inject
  public NullResizer(GatoUtils gf) {
    super(gf);
  }

  @Override
  public String createLink(Asset asset) {
    try {
      return asset.getLink();
    } catch (Exception e) {
      e.printStackTrace();
      return "";
    }
  }
}
