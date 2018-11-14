package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.ui.form.field.factory.SelectFieldFactory;
import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import com.vaadin.v7.data.Item;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.LinkedList;

public class SiteMapSelectFieldFactory<D extends SiteMapSelectFieldDefinition> extends SelectFieldFactory<D> {
  public SiteMapSelectFieldFactory(D definition, Item relatedFieldItem) {
    super(definition, relatedFieldItem);

    // Populate options list with all pages that are ancestors of the current item
    LinkedList<SelectFieldOptionDefinition> options = new LinkedList<SelectFieldOptionDefinition>();
    Node node = ((JcrNodeAdapter)relatedFieldItem).getJcrItem();

    try {
      Node ancestor = NodeUtil.getNearestAncestorOfType(node, "mgnl:page");
      boolean first = true;

      while (ancestor != null) {
        SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
        
        if (first) {
          option.setLabel(ancestor.getName() + " (current page)");
          option.setSelected(true);
          first = false;
        } else {
          option.setLabel(ancestor.getName());
        }

        option.setValue(String.valueOf(ancestor.getDepth()));
        options.addFirst(option);
        ancestor = NodeUtil.getNearestAncestorOfType(ancestor, "mgnl:page");
      }
    } catch (RepositoryException e) {
      e.printStackTrace();
    }

    definition.setOptions(options);
  }
}
