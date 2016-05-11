package edu.txstate.its.gato;

import java.util.List;
import java.util.ArrayList;
import org.apache.commons.lang3.StringUtils;

import javax.inject.Inject;

public final class JsUtil {
  private final GatoUtils gf;

  @Inject
  public JsUtil(GatoUtils gatoUtils) {
    this.gf = gatoUtils;
  }

  public boolean isValidInclude(String url) {
    return url.endsWith(".js");
  }

  public List<String> getIncludes(Object includes) {
    List<String> data = (List) gf.orderedPropertyValues(includes);
    List<String> ret = new ArrayList<String>();
    for (String urlorkey : data) {
      if (!StringUtils.isBlank(urlorkey)) {
        String url = gf.filterUrl(urlorkey);
        if (isValidInclude(url)) {
          ret.add(url);
        }
      }
    }
    return ret;
  }
}
