package edu.txstate.its.gato;

import info.magnolia.config.registry.DefinitionProvider;
import info.magnolia.config.registry.Registry;
import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
import info.magnolia.event.EventBus;
import info.magnolia.i18nsystem.SimpleTranslator;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.ui.api.action.AbstractAction;
import info.magnolia.ui.api.action.ActionExecutionException;
import info.magnolia.ui.api.app.SubAppContext;
import info.magnolia.ui.api.app.SubAppEventBus;
import info.magnolia.ui.api.event.ContentChangedEvent;
import info.magnolia.ui.dialog.formdialog.FormDialogPresenter;
import info.magnolia.ui.dialog.formdialog.FormDialogPresenterFactory;
import info.magnolia.ui.form.EditorCallback;
import info.magnolia.ui.vaadin.gwt.client.shared.AreaElement;
import info.magnolia.ui.vaadin.integration.jcr.JcrNewNodeAdapter;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;
import info.magnolia.ui.vaadin.integration.jcr.ModelConstants;

import java.util.HashMap;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.v7.data.Property;
import com.vaadin.v7.data.util.ObjectProperty;

public class GatoCreateComponentAction extends AbstractAction<GatoCreateComponentActionDefinition> {

  private static final Logger log = LoggerFactory.getLogger(GatoCreateComponentAction.class);

  protected static final String NEW_COMPONENT_DIALOG = "pages:newComponent";
  protected static final String NEW_COMPONENT_POSITION = "mgnl-position";
  protected static final String COMPONENT_POSITION_TOP = "top";
  protected static final String COMPONENT_POSITION_BOTTOM = "bottom";

  private HashMap megasections = new HashMap();

  private final AreaElement area;
  private final EventBus eventBus;
  private final TemplateDefinitionRegistry templateDefinitionRegistry;
  private final SubAppContext subAppContext;
  private final FormDialogPresenterFactory formDialogPresenterFactory;
  private final Context ctx;

  protected String newComponentPosition = COMPONENT_POSITION_BOTTOM;

  @Inject 
  public GatoCreateComponentAction(GatoCreateComponentActionDefinition definition, AreaElement area, @Named(SubAppEventBus.NAME) EventBus eventBus, TemplateDefinitionRegistry templateDefinitionRegistry,
                                SubAppContext subAppContext, FormDialogPresenterFactory formDialogPresenterFactory, Context ctx) {
      super(definition);
      this.area = area;
      this.eventBus = eventBus;
      this.templateDefinitionRegistry = templateDefinitionRegistry;
      this.subAppContext = subAppContext;
      this.formDialogPresenterFactory = formDialogPresenterFactory;
      this.ctx = ctx;

      //gato-template (2015, Wittliff, TSUS)
      megasections.put("gato-component-sections:components/full-section", "gato-template:components/rows/full");
      megasections.put("gato-component-sections:components/halves-section", "gato-template:components/rows/halves");
      megasections.put("gato-component-sections:components/onethirdtwothirds-section", "gato-template:components/rows/onethirdtwothirds");
      megasections.put("gato-component-sections:components/twothirdsonethird-section", "gato-template:components/rows/twothirdsonethird");
      megasections.put("gato-component-sections:components/thirds-section", "gato-template:components/rows/thirds");
      megasections.put("gato-component-sections:components/quarters-section", "gato-template:components/rows/quarters");                             
      
      //calico-feature, home page, admissions home
      megasections.put("gato-template-mobilefirst:components/sections-home/full-section", "gato-template-mobilefirst:components/rows-home/full");
      megasections.put("gato-template-mobilefirst:components/sections-home/halves-section", "gato-template-mobilefirst:components/rows-home/halves");
      megasections.put("gato-template-mobilefirst:components/sections-home/onethirdtwothirds-section", "gato-template-mobilefirst:components/rows-home/onethirdtwothirds");
      megasections.put("gato-template-mobilefirst:components/sections-home/twothirdsonethird-section", "gato-template-mobilefirst:components/rows-home/twothirdsonethird");
      megasections.put("gato-template-mobilefirst:components/sections-home/thirds-section", "gato-template-mobilefirst:components/rows-home/thirds");
      megasections.put("gato-template-mobilefirst:components/sections-home/quarters-section", "gato-template-mobilefirst:components/rows-home/quarters");

      //calico
      megasections.put("gato-template-mobilefirst:components/sections-interior/full-section", "gato-template-mobilefirst:components/rows-interior/full");
      megasections.put("gato-template-mobilefirst:components/sections-interior/halves-section", "gato-template-mobilefirst:components/rows-interior/halves");
      megasections.put("gato-template-mobilefirst:components/sections-interior/onethirdtwothirds-section", "gato-template-mobilefirst:components/rows-interior/onethirdtwothirds");
      megasections.put("gato-template-mobilefirst:components/sections-interior/twothirdsonethird-section", "gato-template-mobilefirst:components/rows-interior/twothirdsonethird");
      megasections.put("gato-template-mobilefirst:components/sections-interior/thirds-section", "gato-template-mobilefirst:components/rows-interior/thirds");
      megasections.put("gato-template-mobilefirst:components/sections-interior/quarters-section", "gato-template-mobilefirst:components/rows-interior/quarters");

      //card layouts
      megasections.put("gato-component-sections:components/collage-section", "gato-component-cards:components/layouts/masonry");
      megasections.put("gato-component-sections:components/mosaic-section", "gato-component-cards:components/layouts/grid");
  }

  @Override
  public void execute() throws ActionExecutionException {
      String workspace = area.getWorkspace();
      String path = area.getPath();

      try {
          Session session = ctx.getJCRSession(workspace);
          if (path == null || !session.itemExists(path)) {
              path = "/";
          }

          if (StringUtils.isNotBlank(area.getAvailableComponents())) {
              Node areaNode = session.getNode(path);

              // set the nodeName as item property, otherwise JcrNewNodeAdapter#applyChanges doesn't guarantee uniqueness of the node name
              final JcrNodeAdapter item = new JcrNewNodeAdapter(areaNode, NodeTypes.Component.NAME) {
                  @Override
                  public Node applyChanges() throws RepositoryException {
                      Node node = super.applyChanges();
                      // reorder upon applyChanges, as this will be done right before session save
                      if (COMPONENT_POSITION_TOP.equals(newComponentPosition)) {
                          NodeUtil.orderFirst(node);
                      }
                      return node;
                  }
              };
              item.addItemProperty(ModelConstants.JCR_NAME, new ObjectProperty<>("0", String.class));

              // perform custom chaining of dialogs
              final FormDialogPresenter formDialogPresenter = formDialogPresenterFactory.createFormDialogPresenter(NEW_COMPONENT_DIALOG);
              final EditorCallback callback = createTemplateSelectedCallback(item, formDialogPresenter);
              // open dialog if there is more then one component, otherwise skip component chooser

              if (area.getAvailableComponents().split(",").length > 1) {
                  formDialogPresenter.start(item, NEW_COMPONENT_DIALOG, subAppContext, callback);
              } else {
                  item.addItemProperty(NodeTypes.Renderable.TEMPLATE, new ObjectProperty<>(area.getAvailableComponents(), String.class));
                  callback.onSuccess(getDefinition().getName());
              }
          } else {
              log.warn("No available components defined for {} area.", area.getPath());
          }
      } catch (RepositoryException e) {
          throw new ActionExecutionException(e);
      }
  }

  protected TemplateSelected createTemplateSelectedCallback(JcrNodeAdapter item, FormDialogPresenter formDialogPresenter) {
      return new TemplateSelected(item, formDialogPresenter);
  }

  private class TemplateSelected implements EditorCallback {

      private final JcrNodeAdapter item;
      private final FormDialogPresenter formDialogPresenter;

      public TemplateSelected(JcrNodeAdapter item, FormDialogPresenter formDialogPresenter) {
          this.item = item;
          this.formDialogPresenter = formDialogPresenter;
      }

      @Override
      public void onSuccess(String actionName) {
          // template
          String templateId = String.valueOf(item.getItemProperty(NodeTypes.Renderable.TEMPLATE).getValue());
          TemplateDefinition templateDefinition = null;
          try {
              DefinitionProvider<TemplateDefinition> templateProvider = templateDefinitionRegistry.getProvider(templateId);
              if (templateProvider.isValid()) {
                  templateDefinition = templateProvider.get();
              }
          } catch (Registry.NoSuchDefinitionException e) {
              log.error("Could not find template definition provider for id {}", templateId, e);
          }

          // position
          Property positionProperty = item.getItemProperty(NEW_COMPONENT_POSITION);
          newComponentPosition = positionProperty != null ? (String) positionProperty.getValue() : COMPONENT_POSITION_BOTTOM;
          item.removeItemProperty(NEW_COMPONENT_POSITION);

          // open dialog
          if (templateDefinition != null) {
              String dialogId = templateDefinition.getDialog();
              if (StringUtils.isNotEmpty(dialogId)) {
                  final FormDialogPresenter nextDialogPresenter = formDialogPresenterFactory.createFormDialogPresenter(dialogId);
                  nextDialogPresenter.start(item, dialogId, subAppContext, new ComponentSaved(item, nextDialogPresenter));
              } else {
                  // if there is no dialog defined for the component, persist the node as is and reload.
                  try {
                      final Node node = item.applyChanges();
                      node.getSession().save();
                  } catch (RepositoryException e) {
                      log.error("Exception caught: {}", e.getMessage(), e);
                  }
                  eventBus.fireEvent(new ContentChangedEvent(item.getItemId()));
              }
          }

          if (formDialogPresenter != null) {
              formDialogPresenter.closeDialog();
          }
      }

      @Override
      public void onCancel() {
          formDialogPresenter.closeDialog();
      }
  }

  private class ComponentSaved implements EditorCallback {

      private final JcrNodeAdapter item;
      private final FormDialogPresenter dialogPresenter;

      public ComponentSaved(JcrNodeAdapter item, FormDialogPresenter dialogPresenter) {
          this.item = item;
          this.dialogPresenter = dialogPresenter;
      }

      @Override
      public void onSuccess(String actionName) {
          String componentId = String.valueOf(item.getItemProperty(NodeTypes.Renderable.TEMPLATE).getValue());
          if (megasections.containsKey(componentId)) {
            try {
              Node megasectionNode = item.getJcrItem();
              Node layoutsAreaNode = NodeUtil.createPath(megasectionNode, "layouts", NodeTypes.Area.NAME);
              Node layout = NodeUtil.createPath(layoutsAreaNode, "0", NodeTypes.Component.NAME);
              PropertyUtil.setProperty(layout, "mgnl:template", megasections.get(componentId));
              Node updatedNode = item.applyChanges();
              updatedNode.getSession().save();
            } catch(Exception e) {
              e.printStackTrace();
            }
          }
          dialogPresenter.closeDialog();
          eventBus.fireEvent(new ContentChangedEvent(item.getItemId()));
      }

      @Override
      public void onCancel() {
          dialogPresenter.closeDialog();
      }
  }

}