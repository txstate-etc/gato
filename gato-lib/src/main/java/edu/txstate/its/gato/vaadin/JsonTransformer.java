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

import com.vaadin.v7.data.Item;

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
        repoNode = convertJcrNodeToRepoNode(node);
      }
      String json = gson.toJson(repoNode);

      // Some unicode code points don't make it into the hidden field value properly and cause a JSON
      // parse error. In particular, unassigned code points cause this problem. The permanent solution
      // is to rework the js include to use the vaadin RPC interface to pass the value, similar to how the
      // ckeditor plugin works. For now, just replace these characters with the replacement character.
      StringBuilder validJson = new StringBuilder(json.length());
      json.codePoints().forEach(c -> {
        
        // There's a bug with the HiddenField where U+FFFD (replacement character) gets encoded as \ u0000fffd.
        // This causes JSON parsers to break on \ u0000 since \ u escape expects a 16-bit hex value.
        if (c == 0xFFFD) {
          validJson.append("\\uFFFD");
          return;
        }

        switch(Character.getType(c)) {
          case Character.CONTROL:
          case Character.FORMAT:
          // Valid surrogate pairs are passed as a single code point, this only applies to lone surrogates
          case Character.SURROGATE:
          case Character.UNASSIGNED:
            // Strip these characters
            break;
          default:
            validJson.append(Character.toChars(c));
            break;
        }
      });

      return validJson.toString();
    } catch (RepositoryException e) {
      e.printStackTrace();
      return "";
    }
  }

  protected RepositoryNode convertJcrNodeToRepoNode(Node node) throws RepositoryException {
    return marshaller.marshallNode(node, 999, null, false);
  }

  public void writeToItem(String newValue) {
    JcrNodeAdapter adapter = (JcrNodeAdapter) item;
    Node jcrNode = adapter.getJcrItem();

    try {
      RepositoryNode newNode = convertJsonToRepoNode(newValue);
      if (newNode != null) {
        adapter.addChild(new JsonNodeAdapter(jcrNode, newNode, definition.getName()));
      }
    } catch (JsonSyntaxException e) {
      // TODO: how to return an error? maybe this is done in save action?
      e.printStackTrace();
    }
  }

  protected RepositoryNode convertJsonToRepoNode(String json) {
    return gson.fromJson(json, RepositoryNode.class);
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
