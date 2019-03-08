package edu.txstate.its.gato;

import info.magnolia.event.EventBus;
import info.magnolia.i18nsystem.SimpleTranslator;
import info.magnolia.pages.app.editor.ComponentContentClipboard;
import info.magnolia.ui.api.action.ActionExecutionException;
import info.magnolia.ui.api.app.SubAppEventBus;
import info.magnolia.ui.api.context.UiContext;
import info.magnolia.ui.api.event.ContentChangedEvent;
import info.magnolia.ui.contentapp.browser.action.PasteContentAction;
import info.magnolia.ui.framework.ContentClipboardException;
import info.magnolia.ui.vaadin.gwt.client.shared.AbstractElement;
import info.magnolia.ui.vaadin.gwt.client.shared.AreaElement;
import info.magnolia.ui.vaadin.integration.jcr.JcrItemAdapter;
import info.magnolia.ui.vaadin.overlay.MessageStyleTypeEnum;

import javax.jcr.Node;

import java.util.List;
import info.magnolia.jcr.util.NodeUtil;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;



/**
 * Pastes one or more referenced components available in the clipboard to a user selected target area.
 */
public class GatoPasteComponentAction extends PasteContentAction {
    @Inject
    public GatoPasteComponentAction(GatoPasteComponentActionDefinition definition, JcrItemAdapter destination,
                                @Named(SubAppEventBus.NAME) EventBus eventBus, UiContext uiContext, ComponentContentClipboard componentContentClipboard, SimpleTranslator i18n) {
        super(definition, destination, componentContentClipboard, uiContext, eventBus, i18n);
    }

    @Override
    public void execute() throws ActionExecutionException {
        try {
            Node node = (Node)getDestination().getJcrItem();
            String destinationPath = getDestination().getJcrItem().getPath();
            Node parent = node.getParent();

            if(NodeUtil.isNodeType(node, "mgnl:component")) {
                destinationPath = parent.getPath();
            }                        
            List<AbstractElement> pastedItems = getContentClipboard().paste(new AreaElement(getDestination().getWorkspace(), destinationPath, null, null));

            getUiContext().openNotification(MessageStyleTypeEnum.INFO, true, getI18n().translate("actions.pasteComponent.success", pastedItems.size()));
            getEventBus().fireEvent(new ContentChangedEvent(getDestination().getItemId()));
        } catch (RepositoryException | ContentClipboardException e) {
            throw new ActionExecutionException(getI18n().translate("actions.pasteComponent.failure"));
        }        
    }
}