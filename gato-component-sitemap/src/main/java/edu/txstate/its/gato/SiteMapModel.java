package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.link.LinkUtil;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import java.text.Collator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.jackrabbit.commons.predicate.NodeTypePredicate;

public class SiteMapModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {
  
  private List<Node> sortedNodes = new ArrayList<Node>();

  public SiteMapModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
    super(content, definition, parent);

    int startPage = PropertyUtil.getLong(content, "startPage", -1L).intValue();
    int depth = PropertyUtil.getLong(content, "depth", 999L).intValue();
    if (startPage > 0 && PropertyUtil.getBoolean(content, "alphabetical", false)) {
      createSortedTitleList(startPage, depth);
    }
  }

  private void createSortedTitleList(int startPage, int depth) throws RepositoryException {
    Node ancestor = NodeUtil.getNearestAncestorOfType(content, "mgnl:page");
    while (ancestor != null && ancestor.getDepth() != startPage) {
      ancestor = NodeUtil.getNearestAncestorOfType(ancestor, "mgnl:page");
    }

    if (ancestor == null) { return; }

    NodeUtil.visit(ancestor, n -> sortedNodes.add(n), new NodeTypePredicate("mgnl:page", true, startPage + 1, startPage + depth));

    // Magnolia doesn't check the root node against the predicate in NodeUtil.visit, so the title ends up
    // in the sorted title list even though we don't want it to.
    sortedNodes.remove(ancestor);
    sortedNodes.sort((a, b) -> getTitle(a).compareTo(getTitle(b)));
  }

  private String getTitle(Node node) {
    try {
      return PropertyUtil.getString(node, "title", node.getName());
    } catch (RepositoryException e) {
      e.printStackTrace();
      return "";
    }
  }

  public List<Node> getSortedNodes() {
    return sortedNodes;
  }
}
