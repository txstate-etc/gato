package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import java.util.HashMap;

public class MailModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {

  private HashMap<String, String> titleMap = new HashMap<String, String>();

  private HashMap<String, Integer> titleCounts = new HashMap<String, Integer>();

  public MailModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
    super(content, definition, parent);
    
    for (Node component : NodeUtil.getNodes(content, NodeTypes.Component.NAME)) {
      String title = "unnamed";
      if (component.hasProperty("title")) { 
        title = component.getProperty("title").getString(); 
      }

      title = cleanTitle(title);
      if (!titleCounts.containsKey(title)) {
        titleCounts.put(title, 1);
      } else {
        int count = titleCounts.get(title);
        titleCounts.put(title, count + 1);
        title = title + "-" + count;
      }

      titleMap.put(component.getIdentifier(), title);  
    }
  }

  private String cleanTitle(String title) {
    title = title.replaceAll("<([A-Za-z0-9=:/ \"]*)>", "");
    title = title.replaceAll(" ", "-" );
    title = title.replaceAll("^-|-$|[^A-Za-z0-9-]", "");
    title = title.replaceAll("^([0-9])", "num-$1" ); // must start with a letter
    return title.toLowerCase();
  }

  public String getSafeTitle(String nodeId) {
    return titleMap.get(nodeId);
  }
}
