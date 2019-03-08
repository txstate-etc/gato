package edu.txstate.its.gato;

import info.magnolia.ui.contentapp.browser.action.PasteContentActionDefinition;

/**
 * Definition for the paste component action.
 */
public class GatoPasteComponentActionDefinition extends PasteContentActionDefinition {

    public GatoPasteComponentActionDefinition() {
        setImplementationClass(GatoPasteComponentAction.class);
    }
}