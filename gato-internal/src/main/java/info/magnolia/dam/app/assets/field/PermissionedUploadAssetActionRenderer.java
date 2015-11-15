/**
 * This file Copyright (c) 2010-2015 Magnolia International
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
import info.magnolia.dam.app.ui.field.upload.AssetUploadReceiver;
import info.magnolia.event.EventBus;
import info.magnolia.i18nsystem.SimpleTranslator;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.ui.api.action.ActionDefinition;
import info.magnolia.ui.api.context.UiContext;
import info.magnolia.ui.api.event.ChooseDialogEventBus;
import info.magnolia.ui.api.overlay.OverlayCloser;
import info.magnolia.ui.api.overlay.OverlayLayer.ModalityLevel;
import info.magnolia.ui.api.view.View;
import info.magnolia.ui.dialog.actionarea.ActionListener;
import info.magnolia.ui.dialog.actionarea.renderer.ActionRenderer;
import info.magnolia.ui.form.field.upload.UploadReceiver;
import info.magnolia.ui.form.field.upload.basic.BasicUploadProgressIndicator;
import info.magnolia.ui.framework.overlay.ViewAdapter;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeItemId;
import info.magnolia.ui.workbench.event.SelectionChangedEvent;

import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;

import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.CssLayout;
import com.vaadin.ui.NativeButton;
import com.vaadin.ui.UI;
import com.vaadin.ui.Upload;
import com.vaadin.ui.Upload.FailedEvent;
import com.vaadin.ui.Upload.FailedListener;
import com.vaadin.ui.Upload.FinishedEvent;
import com.vaadin.ui.Upload.FinishedListener;
import com.vaadin.ui.Upload.ProgressListener;
import com.vaadin.ui.Upload.StartedEvent;
import com.vaadin.ui.Upload.StartedListener;
import com.vaadin.ui.Upload.SucceededEvent;
import com.vaadin.ui.Upload.SucceededListener;

/**
 * Renders and upload instead of a mere button.
 */
public class PermissionedUploadAssetActionRenderer implements ActionRenderer {

    private UiContext layer;

    private Upload upload;

    private UploadReceiver receiver;

    private ProgressPopup progressIndicator;

    private OverlayCloser progressIndicatorCloseHandle;

    private final SimpleTranslator i18n;

    /**
     * @deprecated since version 5.2.2, more detailed c-tor should be used
     * in order to handle upload button availability properly.
     */
    @Deprecated
    public PermissionedUploadAssetActionRenderer(UiContext layer, SimpleTranslator i18n) {
        this.layer = layer;
        this.i18n = i18n;
        receiver = Components.newInstance(AssetUploadReceiver.class, i18n);
    }

    @Inject
    public PermissionedUploadAssetActionRenderer(UiContext layer, SimpleTranslator i18n, @Named(ChooseDialogEventBus.NAME)EventBus eventBus) {
        this.layer = layer;
        this.i18n = i18n;
        receiver = Components.newInstance(AssetUploadReceiver.class, i18n);
        eventBus.addHandler(SelectionChangedEvent.class, new SelectionChangedEvent.Handler() {
            @Override
            public void onSelectionChanged(SelectionChangedEvent event) {
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
                    upload.setEnabled(uploadAllowed);
                } catch (RepositoryException e) {
                    upload.setEnabled(false);
                }
            }
        });
    }

    @Override
    public View start(final ActionDefinition action, final ActionListener listener) {
        this.upload = new Upload(action.getLabel(), receiver) {
            @Override
            public void setCaption(String caption) {
                setButtonCaption(caption);
            }
        };

        this.upload.addStartedListener(new StartedListener() {
            @Override
            public void uploadStarted(StartedEvent event) {
                UI.getCurrent().setPollInterval(1000);
                progressIndicator = new ProgressPopup(upload, i18n);
                progressIndicatorCloseHandle = layer.openOverlay(new ViewAdapter(progressIndicator), ModalityLevel.NON_MODAL);
                progressIndicator.progressIndicator.setProgress(0);
                progressIndicator.progressIndicator.setVisible(true);
            }
        });

        this.upload.addFinishedListener(new FinishedListener() {
            @Override
            public void uploadFinished(FinishedEvent event) {
                UI.getCurrent().setPollInterval(-1);
                progressIndicatorCloseHandle.close();
            }
        });

        this.upload.addProgressListener(new ProgressListener() {
            @Override
            public void updateProgress(long readBytes, long contentLength) {
                progressIndicator.progressIndicator.refreshLayout(readBytes, contentLength, receiver.getFileName());
            }
        });


        this.upload.addFailedListener(new FailedListener() {
            @Override
            public void uploadFailed(FailedEvent event) {
                progressIndicatorCloseHandle.close();
            }
        });

        this.upload.addSucceededListener(new SucceededListener() {
            @Override
            public void uploadSucceeded(SucceededEvent event) {
                listener.onActionFired(action.getName(), upload.getReceiver());
            }
        });

        this.upload.setImmediate(true);
        return new ViewAdapter(upload);
    }


    private static class ProgressPopup extends CssLayout {

        public BasicUploadProgressIndicator progressIndicator;

        private ProgressPopup(final Upload upload, final SimpleTranslator i18n) {

            addStyleName("direct-upload-progress-indicator");
            addStyleName("upload-image-field");
            CssLayout indicatorWrapper = new CssLayout();
            indicatorWrapper.addStyleName("in-progress");
            addComponent(indicatorWrapper);
            String inProgressCaption = "field.upload.basic.uploading.file";
            String inProgressRatioCaption = "field.upload.basic.uploaded.file";
            this.progressIndicator = new BasicUploadProgressIndicator(inProgressCaption, inProgressRatioCaption, i18n);
            indicatorWrapper.addComponent(progressIndicator);
            Button cancelButton = new NativeButton(null, new Button.ClickListener() {
                @Override
                public void buttonClick(ClickEvent event) {
                    if (upload.isUploading()) {
                        upload.interruptUpload();
                    }
                }
            });
            cancelButton.addStyleName("cancel");
            indicatorWrapper.addComponent(cancelButton);
        }
    }
}
