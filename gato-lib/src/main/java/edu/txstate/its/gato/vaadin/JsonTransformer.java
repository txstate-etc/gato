package edu.txstate.its.gato.vaadin;

import info.magnolia.rest.service.node.v1.RepositoryMarshaller;
import info.magnolia.rest.service.node.v1.RepositoryNode;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;
import info.magnolia.ui.form.field.transformer.Transformer;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import java.util.Locale;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import com.vaadin.data.Item;

public class JsonTransformer implements Transformer<String> {
  protected ConfiguredFieldDefinition definition;
  protected Item item;
  protected I18NAuthoringSupport i18NAuthoringSupport;

  protected RepositoryMarshaller marshaller = new RepositoryMarshaller();
  protected Gson gson = new Gson();

  @Inject
  public JsonTransformer(Item relatedFormItem, ConfiguredFieldDefinition def, Class<String> type, I18NAuthoringSupport i18N) {
    definition = def;
    item = relatedFormItem;
    i18NAuthoringSupport = i18N;
  }

  public String readFromItem() {
    Node parent = ((JcrNodeAdapter)item).getJcrItem();
    RepositoryNode repoNode;

    try {
      if (!parent.hasNode(definition.getName())) {
        repoNode = new RepositoryNode();
        repoNode.setName(definition.getName());
        repoNode.setType("mgnl:area");
        repoNode.setPath(parent.getPath() + "/" + definition.getName());
      } else {
        Node node = parent.getNode(definition.getName());
        repoNode = marshaller.marshallNode(node, 999, null, false);
      }
      return gson.toJson(repoNode);
    } catch (RepositoryException e) {
      e.printStackTrace();
      return "";
    }
  }

  public void writeToItem(String newValue) {
    JcrNodeAdapter adapter = (JcrNodeAdapter) item;
    Node jcrNode = adapter.getJcrItem();

    try {
      RepositoryNode newNode = gson.fromJson(newValue, RepositoryNode.class);
      if (newNode != null) {
        adapter.addChild(new JsonNodeAdapter(jcrNode, newNode, definition.getName()));
      }
    } catch (JsonSyntaxException e) {
      // TODO: how to return an error? maybe this is done in save action?
      e.printStackTrace();
    }
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
