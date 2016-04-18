package edu.txstate.its.gato;

import info.magnolia.ui.framework.action.ConfirmationActionDefinition;

public class GatoConfirmDeleteActionDefinition extends ConfirmationActionDefinition {
  public GatoConfirmDeleteActionDefinition() {
    setImplementationClass(GatoConfirmDeleteAction.class);
  }
}
