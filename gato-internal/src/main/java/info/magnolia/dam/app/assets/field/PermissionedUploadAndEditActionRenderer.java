/**
 * This file Copyright (c) 2014-2015 Magnolia International
 * Ltd.  (http://www.magnolia-cms.com). All rights reserved.
 *
 *
 * This file is dual-licensed under both the Magnolia
 * Network Agreement and the GNU General Public License.
 * You may elect to use one or the other of these licenses.
 *
 * This file is distributed in the hope that it will be
 * useful, but AS-IS and WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE, TITLE, or NONINFRINGEMENT.
 * Redistribution, except as permitted by whichever of the GPL
 * or MNA you select, is prohibited.
 *
 * 1. For the GPL license (GPL), you can redistribute and/or
 * modify this file under the terms of the GNU General
 * Public License, Version 3, as published by the Free Software
 * Foundation.  You should have received a copy of the GNU
 * General Public License, Version 3 along with this program;
 * if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * 2. For the Magnolia Network Agreement (MNA), this file
 * and the accompanying materials are made available under the
 * terms of the MNA which accompanies this distribution, and
 * is available at http://www.magnolia-cms.com/mna.html
 *
 * Any modifications to this file must keep this entire header
 * intact.
 *
 */
package info.magnolia.dam.app.assets.field;

import info.magnolia.context.MgnlContext;
import info.magnolia.event.EventBus;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.ui.api.action.ActionDefinition;
import info.magnolia.ui.api.event.ChooseDialogEventBus;
import info.magnolia.ui.api.view.View;
import info.magnolia.ui.dialog.actionarea.ActionListener;
import info.magnolia.ui.dialog.actionarea.renderer.DefaultEditorActionRenderer;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeItemId;
import info.magnolia.ui.workbench.event.SelectionChangedEvent;

import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;

import com.vaadin.ui.Button;

/**
 * Extension of the default renderer to work around lack of availability checking for choose-dialog actions.
 * — in particular, to listen to SelectionChangedEvents, ChooseDialogPresenter should first be relocated to ui-contentapp.
 */
public class PermissionedUploadAndEditActionRenderer extends DefaultEditorActionRenderer {

    private final EventBus chooseDialogEventBus;

    @Inject
    public PermissionedUploadAndEditActionRenderer(@Named(ChooseDialogEventBus.NAME) EventBus chooseDialogEventBus) {
        this.chooseDialogEventBus = chooseDialogEventBus;
    }

    @Override
    public View start(ActionDefinition definition, ActionListener listener) {
        View view = super.start(definition, listener);
        final Button button = (Button) view.asVaadinComponent();
        // don't disable on click or action may be wrongly unavailable
        button.setDisableOnClick(false);

        chooseDialogEventBus.addHandler(SelectionChangedEvent.class, new SelectionChangedEvent.Handler() {

            @Override
            public void onSelectionChanged(SelectionChangedEvent event) {
                // inner availability logic here mirrors the one in UpladAssetActionRenderer (in use for DirectUploadAction)
                Set<Object> itemIds = event.getItemIds();
                if (itemIds == null || itemIds.isEmpty()) {
                    return;
                }
                try {
                    JcrNodeItemId nodeItemId = (JcrNodeItemId) itemIds.iterator().next();
                    javax.jcr.Node node = MgnlContext.getJCRSession(nodeItemId.getWorkspace()).getNodeByIdentifier(nodeItemId.getUuid());
                    boolean uploadAllowed = itemIds.size() == 1;
                    if (uploadAllowed) {
                        uploadAllowed &= NodeUtil.isNodeType(node, NodeTypes.Folder.NAME) || NodeUtil.getAncestors(node).isEmpty();
                    }
                    if (uploadAllowed) uploadAllowed &= node.getSession().hasPermission(node.getPath(),"add_node");
                    button.setEnabled(uploadAllowed);
                } catch (RepositoryException e) {
                    button.setEnabled(false);
                }
            }
        });
        return view;
    }

}
