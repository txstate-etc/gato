package edu.txstate.its.gato;

import info.magnolia.ui.form.field.definition.RichTextFieldDefinition;
import info.magnolia.dam.app.ui.field.factory.AssetsEnabledRichTextFieldFactory;
import info.magnolia.dam.api.AssetProviderRegistry;

import info.magnolia.i18nsystem.SimpleTranslator;
import info.magnolia.link.LinkException;
import info.magnolia.link.LinkUtil;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.ui.api.app.AppController;
import info.magnolia.ui.api.app.ChooseDialogCallback;
import info.magnolia.ui.api.context.UiContext;
import info.magnolia.ui.vaadin.richtext.MagnoliaRichTextField;
import info.magnolia.ui.vaadin.richtext.MagnoliaRichTextFieldConfig;
import info.magnolia.ui.vaadin.integration.jcr.JcrItemId;
import info.magnolia.ui.vaadin.integration.jcr.JcrItemUtil;

import javax.jcr.Node;
import java.lang.ReflectiveOperationException;
import java.lang.reflect.Method;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.vaadin.v7.data.Item;
import com.vaadin.v7.data.util.converter.Converter;
import com.vaadin.server.Sizeable.Unit;
import com.vaadin.v7.ui.Field;
import com.vaadin.ui.UI;

import edu.txstate.its.gato.vaadin.server.FaqTextField;

/**
 * Version of Magnolia's rich editor field for use with faq hierarchy.
 *
 * Unfortunately have to copy a lot of methods from RichTextFieldFactory since Magnolia loves private methods.
 */
public class FaqTextFieldFactory extends AssetsEnabledRichTextFieldFactory {

  private static final String FILE_BROWSER_PLUGIN_CHOOSE_ASSET_EVENT = "chooseAsset";

  private static final Pattern IMAGE_PATTERN = Pattern.compile(
          "(<img " + // start <img
                  "[^>]*" +  // some attributes
                  "src[ ]*=[ ]*\")" + // start src
                  "([^\"]*)" + // the link
                  "(\"" + // ending "
                  "[^>]*" + // any attributes
                  ">)"); // end the tag

  private static final Logger log = LoggerFactory.getLogger(FaqTextFieldFactory.class);

  @Inject
  public FaqTextFieldFactory(RichTextFieldDefinition definition, Item relatedFieldItem, AppController appController, UiContext uiContext, SimpleTranslator i18n, AssetProviderRegistry assetProviderRegistry) {
    super(definition, relatedFieldItem, appController, uiContext, i18n, assetProviderRegistry);
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

    if (definition.isImages() || StringUtils.isNotBlank(definition.getConfigJsFile())) {
      // Hook in plugin listener to trigger assets choose dialog
      richTextEditor.addListener(new MagnoliaRichTextField.PluginListener() {
        @Override
        public void onPluginEvent(String eventName, String value) {
          if (eventName.equals(FILE_BROWSER_PLUGIN_CHOOSE_ASSET_EVENT)) {
            UI.getCurrent().addStyleName("ui-overlapping-ck-editor");

            try {
              Method chooseAsset = getClass().getEnclosingClass().getSuperclass().getDeclaredMethod("chooseAsset");
              chooseAsset.setAccessible(true);
              chooseAsset.invoke(FaqTextFieldFactory.this);
            } catch (ReflectiveOperationException e) {
              e.printStackTrace();
              log.warn("failed to setup file browser for faq rich editor");
            }
          }
        }
      });

      richTextEditor.setConverter(new Converter<String, String>() {
        @Override
        public String convertToModel(String value, Class<? extends String> targetType, Locale locale) throws ConversionException {
          return LinkUtil.convertAbsoluteLinksToUUIDs(value);
        }

        @Override
        public String convertToPresentation(String value, Class<? extends String> targetType, Locale locale) throws ConversionException {
          if (value != null) {
            // transform plain image links (img src attributes) to display images in the editor
            // but do *not* transform link hrefs — magnolialink plugin currently only supports the uuid pattern to keep them editable
            try {
              Matcher matcher = IMAGE_PATTERN.matcher(value);
              while (matcher.find()) {
                value = value.replace(matcher.group(), LinkUtil.convertLinksFromUUIDPattern(matcher.group()));
              }
              return value;
            } catch (LinkException e) {
              return StringUtils.EMPTY;
            }
          }
          return StringUtils.EMPTY;
        }

        @Override
        public Class<String> getModelType() {
          return String.class;
        }

        @Override
        public Class<String> getPresentationType() {
          return String.class;
        }
      });
    }

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
