package edu.txstate.its.gato.apputil; 

import info.magnolia.ui.workbench.tree.TreePresenterDefinition;

public class GatoTreePresenterDefinition extends TreePresenterDefinition {

  public GatoTreePresenterDefinition() {
    super();
    setImplementationClass(GatoTreePresenter.class);
  }
}
