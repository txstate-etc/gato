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
  
  private List<String> sortedTitles = new ArrayList<String>();
  private Map<String, String> urlMap = new HashMap<String, String>();

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

    NodeUtil.visit(ancestor, this::addNodeToTitles, new NodeTypePredicate("mgnl:page", true, startPage + 1, startPage + depth));

    // Magnolia doesn't check the root node against the predicate in NodeUtil.visit, so the title ends up
    // in the sorted title list even though we don't want it to.
    sortedTitles.remove(getNodeTitle(ancestor));
    sortedTitles.sort(Collator.getInstance());
  }

  private void addNodeToTitles(Node node) throws RepositoryException {
    String nodeTitle = getNodeTitle(node);
    sortedTitles.add(nodeTitle);
    urlMap.put(nodeTitle, LinkUtil.createLink(node));
  }

  private String getNodeTitle(Node node) throws RepositoryException {
    return PropertyUtil.getString(node, "title", node.getName());
  }

  public List<String> getSortedTitles() {
    return sortedTitles;
  }

  public String getUrl(String title) {
    return urlMap.get(title);
  }
}
