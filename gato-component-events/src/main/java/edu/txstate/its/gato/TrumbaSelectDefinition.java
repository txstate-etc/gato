package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.objectfactory.Components;
import info.magnolia.ui.form.field.definition.SelectFieldDefinition;
import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.select.Elements;

public class TrumbaSelectDefinition extends SelectFieldDefinition {
  public List<SelectFieldOptionDefinition> getOptions() {
    List<SelectFieldOptionDefinition> ret = null;
    try {
      MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
      if (mcp.hasProperty("trumba.user")) {
        String auth = mcp.getProperty("trumba.user")+":"+mcp.getProperty("trumba.pass");
        String b64 = new String(Base64.getEncoder().encode(auth.getBytes()));
        Elements response = Jsoup.connect(mcp.getProperty("trumba.basepath")+"/service/calendars.asmx/GetCalendarList")
          .header("Authorization", "Basic "+b64)
          .get()
          .select("Response");

        ret = optionsFromTrumbaResponse(response, "");
      }
    } catch (Exception e) {
      ret = new ArrayList<SelectFieldOptionDefinition>();
      e.printStackTrace();
    }
    return ret;
  }

  protected List<SelectFieldOptionDefinition> optionsFromTrumbaResponse(Elements response, String prefix) {
    List<SelectFieldOptionDefinition> ret = new ArrayList<SelectFieldOptionDefinition>();
    Elements calendars = response.select("> Calendar");
    int length = calendars.size();
    for (int i = 0; i < length; i++) {
      Elements calendar = calendars.eq(i);

      SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
      String label = prefix;
      if (prefix.length() > 0) label += " ";
      label += calendar.attr("Name");
      option.setLabel(label);
      option.setValue(calendar.attr("ID"));

      ret.add(option);
      ret.addAll(optionsFromTrumbaResponse(calendar, prefix+"--"));
    }
    return ret;
  }
}
