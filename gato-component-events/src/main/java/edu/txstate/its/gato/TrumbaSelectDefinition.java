package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.objectfactory.Components;
import info.magnolia.ui.form.field.definition.SelectFieldDefinition;
import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;

import com.google.gson.*;

import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.io.IOUtils;

public class TrumbaSelectDefinition extends SelectFieldDefinition {
  public List<SelectFieldOptionDefinition> getOptions() {
    List<SelectFieldOptionDefinition> ret = null;
    try {
      MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
      if (mcp.hasProperty("trumba.bridge.basepath")) {
        String url = mcp.getProperty("trumba.bridge.basepath")+"/calendars";
        String json = IOUtils.toString(new URL(url).openStream());
        JsonArray cals = new JsonParser().parse(json).getAsJsonArray();
        ret = optionsFromTrumba(cals, "");
      }
    } catch (Exception e) {
      ret = new ArrayList<SelectFieldOptionDefinition>();
      e.printStackTrace();
    }
    return ret;
  }

  protected List<SelectFieldOptionDefinition> optionsFromTrumba(JsonArray calendars, String prefix) {
    List<SelectFieldOptionDefinition> ret = new ArrayList<SelectFieldOptionDefinition>();
    int length = calendars.size();
    for (JsonElement calendar : calendars) {
      JsonObject cal = calendar.getAsJsonObject();
      String prefix_to_use;
      if (cal.get("published").getAsBoolean()) {
        SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
        String label = prefix;
        if (prefix.length() > 0) label += " ";
        label += cal.get("name").getAsString();
        option.setLabel(label);
        option.setValue(cal.get("id").getAsString());

        ret.add(option);
        prefix_to_use = prefix+"--";
      } else {
        prefix_to_use = prefix+" "+cal.get("name").getAsString()+" >";
      }
      ret.addAll(optionsFromTrumba(cal.get("calendars").getAsJsonArray(), prefix_to_use));
    }
    return ret;
  }
}
