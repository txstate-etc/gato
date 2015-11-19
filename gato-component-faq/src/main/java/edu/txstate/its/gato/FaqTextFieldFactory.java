package edu.txstate.its.gato;

import info.magnolia.ui.form.field.definition.RichTextFieldDefinition;
import info.magnolia.ui.form.field.factory.RichTextFieldFactory;

import info.magnolia.i18nsystem.SimpleTranslator;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.ui.api.app.AppController;
import info.magnolia.ui.api.app.ChooseDialogCallback;
import info.magnolia.ui.api.context.UiContext;
import info.magnolia.ui.vaadin.richtext.MagnoliaRichTextField;
import info.magnolia.ui.vaadin.richtext.MagnoliaRichTextFieldConfig;
import info.magnolia.ui.vaadin.integration.jcr.JcrItemId;
import info.magnolia.ui.vaadin.integration.jcr.JcrItemUtil;

import javax.jcr.Node;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.vaadin.data.Item;
import com.vaadin.server.Sizeable.Unit;
import com.vaadin.ui.Field;

import edu.txstate.its.gato.vaadin.server.FaqTextField;

/**
 * Version of Magnolia's rich editor field for use with faq hierarchy.
 *
 * Unfortunately have to copy a lot of methods from RichTextFieldFactory since Magnolia loves private methods.
 */
public class FaqTextFieldFactory extends RichTextFieldFactory {

  private static final Logger log = LoggerFactory.getLogger(FaqTextFieldFactory.class);

  @Inject
  public FaqTextFieldFactory(RichTextFieldDefinition definition, Item relatedFieldItem, AppController appController, UiContext uiContext, SimpleTranslator i18n) {
    super(definition, relatedFieldItem, appController, uiContext, i18n);
  }

  @Override
  protected Field<String> createFieldComponent() {

    MagnoliaRichTextFieldConfig config = initializeCKEditorConfig();
    richTextEditor = new FaqTextField(config);
    if (definition.getHeight() > 0) {
      richTextEditor.setHeight(definition.getHeight(), Unit.PIXELS);
    }

    richTextEditor.addListener(new MagnoliaRichTextField.PluginListener() {
      @Override
      public void onPluginEvent(String eventName, String value) {
        if (eventName.equals(EVENT_GET_MAGNOLIA_LINK)) {
          try {
            Gson gson = new Gson();
            PluginData pluginData = gson.fromJson(value, PluginData.class);
            openLinkDialog(pluginData.path, pluginData.workspace);
          } catch (Exception e) {
            log.error("openLinkDialog failed", e);
            richTextEditor.firePluginEvent(EVENT_CANCEL_LINK, i18n.translate("ui-form.richtexteditorexception.opentargetappfailure"));
          }
        }
      }
    });

    return richTextEditor;
  }

  private String mapWorkSpaceToApp(String workspace) {
        if (workspace.equalsIgnoreCase("dam")) {
            return "assets";
        } else if (workspace.equalsIgnoreCase(RepositoryConstants.WEBSITE)) {
            return "pages";
        }

        return "";
    }

    private void openLinkDialog(String path, String workspace) {
      appController.openChooseDialog(mapWorkSpaceToApp(workspace), uiContext, null, new ChooseDialogCallback() {
        @Override
        public void onItemChosen(String actionName, Object chosenValue) {
          if (!(chosenValue instanceof JcrItemId)) {
            richTextEditor.firePluginEvent(EVENT_CANCEL_LINK);
            return;
          }
          try {
            javax.jcr.Item jcrItem = JcrItemUtil.getJcrItem((JcrItemId) chosenValue);
            if (!jcrItem.isNode()) {
              return;
            }
            final Node selected = (Node) jcrItem;
            Gson gson = new Gson();
            MagnoliaLink mlink = new MagnoliaLink();
            mlink.identifier = selected.getIdentifier();
            mlink.repository = selected.getSession().getWorkspace().getName();
            mlink.path = selected.getPath();
            if (selected.hasProperty("title")) {
              mlink.caption = selected.getProperty("title").getString();
            } else {
              mlink.caption = selected.getName();
            }

            richTextEditor.firePluginEvent(EVENT_SEND_MAGNOLIA_LINK, gson.toJson(mlink));
          } catch (Exception e) {
            String error = i18n.translate("ui-form.richtexteditorexception.cannotaccessselecteditem");
            log.error(error, e);
            richTextEditor.firePluginEvent(EVENT_CANCEL_LINK, error);
          }
        }

        @Override
        public void onCancel() {
          richTextEditor.firePluginEvent(EVENT_CANCEL_LINK);
        }
    });
  }

  /**
   * Link info wrapper.
   */
  protected static class MagnoliaLink {

    public String identifier;

    public String repository;

    public String path;

    public String caption;

  }

  /**
   * Plugin data wrapper.
   */
  protected static class PluginData {
    public String workspace;
    public String path;
  }
}
