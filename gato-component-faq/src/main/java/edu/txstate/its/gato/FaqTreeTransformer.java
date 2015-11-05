package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.wrapper.HTMLEscapingNodeWrapper;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.transformer.Transformer;
import info.magnolia.ui.vaadin.integration.jcr.JcrNewNodeAdapter;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import com.google.gson.Gson;

import com.vaadin.data.util.ObjectProperty;
import com.vaadin.data.Item;

public class FaqTreeTransformer implements Transformer<String> {

  protected ConfiguredFieldDefinition definition;
  protected Item item;
  protected I18NAuthoringSupport i18NAuthoringSupport;

  @Inject
  public FaqTreeTransformer(Item relatedFormItem, ConfiguredFieldDefinition def, Class<String> type, I18NAuthoringSupport i18N) {
    definition = def;
    item = relatedFormItem;
    i18NAuthoringSupport = i18N;
  }

  public void writeToItem(String newValue) {
    Gson gson = new Gson();
    FaqItem[] faqs = gson.fromJson(newValue, FaqItem[].class);
    JcrNodeAdapter adapter = (JcrNodeAdapter) item;
    Node nodeItem = ((JcrNodeAdapter)item).getJcrItem();

    try {
      JcrNodeAdapter root;
      if (nodeItem.hasNode(definition.getName())) {
        root = new JcrNodeAdapter(nodeItem.getNode(definition.getName()));
      } else {
        root = new JcrNewNodeAdapter(nodeItem, "mgnl:area", definition.getName());
      }

      adapter.addChild(root);

      for (FaqItem faq : faqs) {
        writeFaqItemToAdapter(root, faq);
      }
    } catch (RepositoryException e) {
      e.printStackTrace();
    }
  }

  protected void writeFaqItemToAdapter(JcrNodeAdapter adapter, FaqItem faq) throws RepositoryException {
    Node node = adapter.getJcrItem();

    JcrNodeAdapter child = createChildAdapter(adapter, node, faq);
    adapter.addChild(child);

    if (faq.nodetype != null) { child.addItemProperty("nodetype", new ObjectProperty(faq.nodetype)); }
    if (faq.question != null) { child.addItemProperty("question", new ObjectProperty(faq.question)); }
    if (faq.answer != null) { child.addItemProperty("answer", new ObjectProperty(faq.answer)); }
    if (faq.title != null) { child.addItemProperty("title", new ObjectProperty(faq.title)); }

    for (FaqItem f : faq.children) {
      writeFaqItemToAdapter(child, f);
    }
  }

  protected JcrNodeAdapter createChildAdapter(JcrNodeAdapter parent, Node parentNode, FaqItem faqItem) throws RepositoryException {
    if ((parent instanceof JcrNewNodeAdapter) || !parentNode.hasNode(faqItem.id)) {
      return new JcrNewNodeAdapter(parentNode, "mgnl:area", faqItem.id);
    }

    return new JcrNodeAdapter(parentNode.getNode(faqItem.id));
  }

  public String readFromItem() {
    List<FaqItem> nodes = new ArrayList<FaqItem>();

    try {
      Node nodeItem = ((JcrNodeAdapter)item).getJcrItem();
      Node root = nodeItem.getNode(definition.getName());
      root = NodeUtil.deepUnwrap(root, HTMLEscapingNodeWrapper.class);

      for (Node node : NodeUtil.getNodes(root, NodeTypes.Area.NAME)) {
        nodes.add(new FaqItem(node));
      }
    } catch (RepositoryException e) {
      e.printStackTrace();
    } 

    Gson gson = new Gson();
    return gson.toJson(nodes);
  }

  public boolean hasI18NSupport() { return false; }
  public Class<String> getType() { return String.class; }

  protected boolean isReadOnly;
  public boolean isReadOnly() { return isReadOnly; }
  public void setReadOnly(boolean isReadOnly) { this.isReadOnly = isReadOnly; }

  protected Locale locale;
  public Locale getLocale() { return locale; }
  public void setLocale(Locale locale) { this.locale = locale; }

  public String getBasePropertyName() {
    return definition.getName();
  }

  public void setI18NPropertyName(String i18n) {}
}
