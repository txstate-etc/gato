package edu.txstate.its.gato.preview;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.ui.api.action.AbstractAction;
import info.magnolia.ui.api.action.ActionExecutionException;
import info.magnolia.ui.api.location.LocationController;
import info.magnolia.ui.vaadin.integration.jcr.AbstractJcrNodeAdapter;

import com.vaadin.ui.UI;
import edu.txstate.its.gato.GatoUtils;
import info.magnolia.link.LinkUtil;
import info.magnolia.context.MgnlContext;
import javax.servlet.http.HttpServletRequest;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import com.google.inject.Inject;


/* Opens a page preview in a new window or tab */


public class PreviewInNewWindowAction extends AbstractAction<PreviewInNewWindowActionDefinition> {

    private final AbstractJcrNodeAdapter nodeItemToPreview;

    private LocationController locationController;

    private GatoUtils gf;

    private UI ui;

    @Inject
    public PreviewInNewWindowAction(PreviewInNewWindowActionDefinition definition, GatoUtils gf, AbstractJcrNodeAdapter nodeItemToPreview, LocationController locationController) {
        super(definition);
        this.locationController = locationController;
        this.nodeItemToPreview = nodeItemToPreview; 
        this.gf = gf;
    }

    @Override
    public void execute() throws ActionExecutionException {
        try {

            Node pageNode = nodeItemToPreview.getJcrItem();

            if (!NodeUtil.isNodeType(pageNode, NodeTypes.Page.NAME)) {
                pageNode = NodeUtil.getNearestAncestorOfType(pageNode, NodeTypes.Page.NAME);
            }
            if (pageNode == null) {
                throw new ActionExecutionException("Not able to resolve page node from " + nodeItemToPreview.getJcrItem().getPath());
            }
            String relativeUrl = LinkUtil.createAbsoluteLink(pageNode);
            HttpServletRequest request = MgnlContext.getWebContext().getRequest();
            String serverpath = request.getScheme()+"://"+gf.serverNameAndPort();
            String url =  serverpath + relativeUrl;
            ui.getCurrent().getPage().open(url, "_blank");

        } catch (RepositoryException e) {
            throw new ActionExecutionException(e);
        }
    }

}