package edu.txstate.its.gato;

import info.magnolia.pages.app.action.CreateComponentActionDefinition;

public class GatoCreateComponentActionDefinition extends CreateComponentActionDefinition {

    public GatoCreateComponentActionDefinition() {
      setImplementationClass(GatoCreateComponentAction.class);
    }
}