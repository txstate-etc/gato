package edu.txstate.its.gato.component.faq;

import info.magnolia.ui.admincentral.dialog.action.SaveDialogActionDefinition;

public class SaveFaqDialogActionDefinition extends SaveDialogActionDefinition {
    public SaveFaqDialogActionDefinition() {
        setImplementationClass(SaveFaqDialogAction.class);
    }
}
