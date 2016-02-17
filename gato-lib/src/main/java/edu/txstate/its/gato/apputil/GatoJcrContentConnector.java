package edu.txstate.its.gato.apputil; 

import info.magnolia.cms.core.version.VersionManager;
import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.vaadin.integration.contentconnector.JcrContentConnector;
import info.magnolia.ui.vaadin.integration.contentconnector.JcrContentConnectorDefinition;
import info.magnolia.ui.vaadin.integration.jcr.JcrItemId;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

public class GatoJcrContentConnector extends JcrContentConnector {

    @Inject
    public GatoJcrContentConnector(final VersionManager versionManager, JcrContentConnectorDefinition definition, ComponentProvider componentProvider) {
        super(versionManager, definition, componentProvider);
    }

    @Override
    public JcrItemId getItemIdByUrlFragment(String urlFragment) {
        // cj32: Overriding this method to handle the case when urlFragment is already an absolute path.
        // I created MGNLUI-3780 to report this issue.
        // Unfortunately, this solution won't work in all cases. If the root path is '/foo' and 
        // urlFragment is '/foo/bar', the absolute path could be '/foo/bar' or '/foo/foo/bar'.
        String rootPath = getContentConnectorDefinition().getRootPath();
        if (!"/".equals(rootPath) && urlFragment.startsWith(rootPath)) {
            urlFragment = StringUtils.removeStart(urlFragment, rootPath);
        }
        return super.getItemIdByUrlFragment(urlFragment);
    }

}
