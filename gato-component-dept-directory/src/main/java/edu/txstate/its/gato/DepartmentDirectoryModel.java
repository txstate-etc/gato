package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Vector;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import com.google.gson.*;

import org.apache.commons.io.IOUtils;

public class DepartmentDirectoryModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {


    public DepartmentDirectoryModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
        super(content, definition, parent);
    }

    //Retrieve Faculty and/or Staff for a particular
    //department.  Used in the department directory component.
    public Vector getPeople(String department){
        Vector result = new Vector();
        try {
          String url = "https://secure.its.txstate.edu/iphone/people/json.pl?n=500&q=";
          url += URLEncoder.encode("department contains \"" + department + "\"", "UTF-8");
          String json = IOUtils.toString(new URL(url).openStream());
          JsonObject resultsObj = new JsonParser().parse(json).getAsJsonObject();
          JsonArray peopleArray = resultsObj.get("results").getAsJsonArray();
          for (JsonElement elem : peopleArray) {
            JsonObject departmentObj = elem.getAsJsonObject();
            Map entry = new HashMap();
            for (Entry<String, JsonElement> e : departmentObj.entrySet()) {
              entry.put(e.getKey(), e.getValue().getAsString());
            }
            result.add(entry);
          }
          Collections.sort(result, new Comparator<Map>(){
            @Override
            public int compare(Map a, Map b) {
              String lastnameA = (String) a.get("lastname");
              String lastnameB = (String) b.get("lastname");
              return lastnameA.compareTo(lastnameB);
            }
          });
        } catch(Exception e) {
          e.printStackTrace();
        }
        return result;
    }
}