package edu.txstate.its.gato;

import info.magnolia.ui.framework.action.MarkNodeAsDeletedActionDefinition;
import info.magnolia.ui.framework.action.MarkNodeAsDeletedAction;


//When you delete a page in Magnolia, a banner shows up on the bottom of the page telling
//you when the aciton has completed.  This banner needs to be manually dismissed, which users
//found annoying.  Setting notifyUser=false gets rid of this banner.  The user still receives
//an alert that the delete was successful but the alert goes away on its own.
public class DeleteWithoutBannerActionDefinition extends MarkNodeAsDeletedActionDefinition{
    public DeleteWithoutBannerActionDefinition() {
        setImplementationClass(MarkNodeAsDeletedAction.class);
        setNotifyUser(false);
    }
}