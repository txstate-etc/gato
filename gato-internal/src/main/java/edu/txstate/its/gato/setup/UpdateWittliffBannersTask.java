package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateWittliffBannersTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateWittliffBannersTask.class);

  public UpdateWittliffBannersTask() {
    super("Update Wittliff Exhibition Banners", "Add slider functionality to Wittliff event banners.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s, "gato-template-wittliff:components/exhibition",
      n -> { createSlider(n, "gato-template-wittliff:components/eventslider/exhibition"); });
    visitByTemplate(s, "gato-template-wittliff:components/eventbanner",
      n -> { createSlider(n, "gato-template-wittliff:components/eventslider/event"); });
    visitByTemplate(s, "gato-template-wittliff:components/newsbanner",
      n -> { createSlider(n, "gato-template-wittliff:components/eventslider/news"); });
  }

  protected void createSlider(Node n, String newtemplate) throws RepositoryException, ItemNotFoundException {
    Node parent = n.getParent();
    Node componentNode = NodeUtil.createPath(parent, "imported_"+n.getName(), NodeTypes.Component.NAME);
    NodeUtil.orderBefore(componentNode, n.getName());
    NodeTypes.Renderable.set(componentNode, "gato-template-wittliff:components/eventslider/slider");
    Node slides = NodeUtil.createPath(componentNode, "slides", NodeTypes.ContentNode.NAME);
    NodeUtil.moveNode(n, slides);
    NodeTypes.Renderable.set(n, newtemplate);
    parent.save();
  }
}
