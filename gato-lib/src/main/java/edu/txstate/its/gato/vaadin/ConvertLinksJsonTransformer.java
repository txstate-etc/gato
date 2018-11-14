package edu.txstate.its.gato.vaadin;

import info.magnolia.link.LinkException;
import info.magnolia.link.LinkUtil;
import info.magnolia.rest.service.node.v1.RepositoryNode;
import info.magnolia.rest.service.node.v1.RepositoryProperty;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
import info.magnolia.ui.form.field.definition.ConfiguredFieldDefinition;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import com.vaadin.v7.data.Item;

/**
 * Json Transformer that converts image links to/from absolute/uuid format for rich editor.
 */
public class ConvertLinksJsonTransformer extends JsonTransformer {
  @Inject
  public ConvertLinksJsonTransformer(Item relatedFormItem, ConfiguredFieldDefinition def, Class<String> type, I18NAuthoringSupport i18N) {
    super(relatedFormItem, def, type, i18N);
  }

  protected static final Pattern IMAGE_PATTERN = Pattern.compile(
            "(<img " + // start <img
                    "[^>]*" +  // some attributes
                    "src[ ]*=[ ]*\")" + // start src
                    "([^\"]*)" + // the link
                    "(\"" + // ending "
                    "[^>]*" + // any attributes
                    ">)");

  @Override
  protected RepositoryNode convertJcrNodeToRepoNode(Node node) throws RepositoryException {
    RepositoryNode repoNode = super.convertJcrNodeToRepoNode(node);
    convertUUIDInNode(repoNode);
    return repoNode;
  }

  public void convertUUIDInNode(RepositoryNode node) {
    for (RepositoryProperty p : node.getProperties()) {
      if (p.getType().equals("String")) {
        for (int i = 0; i < p.getValues().size(); i++) {
          try {
            Matcher matcher = IMAGE_PATTERN.matcher(p.getValues().get(i));
            while (matcher.find()) {
              p.getValues().set(i, p.getValues().get(i).replace(matcher.group(), LinkUtil.convertLinksFromUUIDPattern(matcher.group())));
            }
          } catch(LinkException e) {
            e.printStackTrace();
          }
        }
      }
    }
    
    if (node.getNodes() == null) { return; }
    for (RepositoryNode n : node.getNodes()) {
      convertUUIDInNode(n);
    }
  }

  @Override
  protected RepositoryNode convertJsonToRepoNode(String json) {
    RepositoryNode repoNode = super.convertJsonToRepoNode(json);
    convertLinksInNode(repoNode);
    return repoNode;
  }

  public void convertLinksInNode(RepositoryNode node) {
    for (RepositoryProperty p : node.getProperties()) {
      if (p.getType().equals("String")) {
        for (int i = 0; i < p.getValues().size(); i++) {
          p.getValues().set(i, LinkUtil.convertAbsoluteLinksToUUIDs(p.getValues().get(i)));
        }
      }
    }

    if (node.getNodes() == null) { return; }
    for (RepositoryNode n : node.getNodes()) {
      convertLinksInNode(n);
    }
  }
}
