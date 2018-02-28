package edu.txstate.its.gato.setup;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateCardLayoutFiltersTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateCardLayoutFiltersTask.class);

  public UpdateCardLayoutFiltersTask() {
    super("Update Card Layout Filters", "Convert card layout filters over to having a node be the array parent.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s, "gato-component-cards:components/layouts/grid", n -> {
      Node page = NodeUtil.getNearestAncestorOfType(n, NodeTypes.Page.NAME);
      if (n.hasProperty("filterlist")) {
        List<String> filters = parseCommas(PropertyUtil.getString(n, "filterlist", ""));
        n.getProperty("filterlist").remove();
        Node filterlist = NodeUtil.createPath(n, "filterlist", NodeTypes.Area.NAME);
        int idx = 0;
        Map<String,String> filtermap = new HashMap<String,String>();
        for (String filter : filters) {
          Node f = filterlist.addNode(String.valueOf(idx++), NodeTypes.ContentNode.NAME);
          String id = UUID.randomUUID().toString();
          PropertyUtil.setProperty(f, "id", id);
          PropertyUtil.setProperty(f, "name", filter);
          filtermap.put(filter.toLowerCase(), id);
        }

        if (n.hasNode("cards")) {
          for (Node card : NodeUtil.getNodes(n.getNode("cards"), NodeTypes.Component.NAME)) {
            if (card.hasProperty("tags")) {
              List<String> cardfilters = parseCommas(PropertyUtil.getString(card, "tags", ""));
              card.getProperty("tags").remove();
              Node cardfilterlist = NodeUtil.createPath(card, "tags", NodeTypes.Area.NAME);
              for (int i = 0; i < cardfilters.size(); i++) {
                String filter = StringUtils.strip(cardfilters.get(i).toLowerCase());
                PropertyUtil.setProperty(cardfilterlist, String.valueOf(i), filtermap.get(filter));
              }
            }
            if (card.hasProperty("color")) {
              if (NodeTypes.Renderable.getTemplate(page).startsWith("gato-template-txstate2015:")) {
                String color = PropertyUtil.getString(card, "color", "color1");
                if (color.equals("color4")) {
                  color = "color3";
                } else if (color.equals("color5")) {
                  color = "color3";
                } else if (color.equals("color7")) {
                  color = "color2";
                }
                PropertyUtil.setProperty(card, "color", color);
              }
            }
          }
        }
        n.save();
      }
    });
  }

  protected List<String> parseCommas (String csvalues) {
    List<String> ret = new ArrayList<String>();
    String[] vals = csvalues.split("\\s*,\\s*");
    for (int i = 0; i < vals.length; i++) {
      ret.add(StringUtils.strip(vals[i]));
    }
    return ret;
  }
}
