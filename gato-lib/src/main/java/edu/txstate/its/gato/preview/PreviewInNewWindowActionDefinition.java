package edu.txstate.its.gato.preview;

import info.magnolia.ui.api.action.AbstractAction;
import info.magnolia.ui.api.action.ConfiguredActionDefinition;

public class PreviewInNewWindowActionDefinition extends ConfiguredActionDefinition {

    public PreviewInNewWindowActionDefinition() {
        setImplementationClass(PreviewInNewWindowAction.class);
    }

}