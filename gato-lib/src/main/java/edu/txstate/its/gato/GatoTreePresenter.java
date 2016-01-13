package edu.txstate.its.gato; 

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.vaadin.integration.contentconnector.JcrContentConnector;
import info.magnolia.ui.workbench.tree.TreePresenter;
import info.magnolia.ui.workbench.tree.TreeView;

import javax.inject.Inject;

import com.vaadin.data.Container;

public class GatoTreePresenter extends TreePresenter {
  
  @Inject
  public GatoTreePresenter(TreeView view, ComponentProvider componentProvider) {
    super(view, componentProvider);
  }

  @Override
  protected Container.Hierarchical createContainer() {
    return new GatoHierarchicalJcrContainer(((JcrContentConnector)contentConnector).getContentConnectorDefinition());
  }
}
