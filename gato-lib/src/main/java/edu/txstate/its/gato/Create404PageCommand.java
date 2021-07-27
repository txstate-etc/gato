package edu.txstate.its.gato;

import info.magnolia.cms.util.Rule;
import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.publishing.operation.SendOperation;
import info.magnolia.publishing.sender.Sender;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Create404PageCommand extends GatoBaseSchedulerCommand {
  public static Logger log = LoggerFactory.getLogger(Create404PageCommand.class);

  private ComponentProvider cp;

  @Inject
  public Create404PageCommand(ComponentProvider cp) {
    this.cp = cp;
  }

  public boolean doExecute(Context context) {
    try {
      Session session = MgnlContext.getJCRSession(this.getRepository());
      Node rootNode = session.getNode(this.getPath());


      for (Node siteRoot : NodeUtil.getNodes(rootNode, NodeTypes.Page.NAME)) {
        boolean isPublished = PropertyUtil.getBoolean(siteRoot,"mgnl:activationStatus", false);
        if (isPublished) {
          String pageTemplate = NodeTypes.Renderable.getTemplate(siteRoot);
          if (!siteRoot.hasNode("404")) {
            if (pageTemplate.contains("gato-template-mobilefirst") || pageTemplate.contains("gato-template-admissions") || pageTemplate.contains("gato-template-txstate2015")) {
              log.info("Creating a 404 page for " + siteRoot.getName());
              Node notFoundNode = NodeUtil.createPath(siteRoot, "404", NodeTypes.Page.NAME);
              PropertyUtil.setProperty(notFoundNode, "title", "Page Not Found");
              PropertyUtil.setProperty(notFoundNode, "hideInNav", true);
              Node mainContent = NodeUtil.createPath(notFoundNode, "contentParagraph", NodeTypes.Area.NAME);
              Node megasection = NodeUtil.createPath(mainContent, "generated", NodeTypes.Component.NAME);
              Node layouts = NodeUtil.createPath(megasection, "layouts", NodeTypes.Area.NAME);
              Node layout = NodeUtil.createPath(layouts, "0", NodeTypes.Component.NAME);
              Node column = NodeUtil.createPath(layout, "column1", NodeTypes.Area.NAME);
              Node richeditor = NodeUtil.createPath(column, "0", NodeTypes.Component.NAME);
              PropertyUtil.setProperty(richeditor, "mgnl:template", "gato-template:components/richeditor");
              PropertyUtil.setProperty(richeditor, "content", "<p>Unfortunately, the page you are looking for has moved or no longer exists. We are sorry for the inconvenience. Please use the navigation menu or search to find the information you need.</p>");
              if (pageTemplate.contains("gato-template-mobilefirst") || pageTemplate.contains("gato-template-admissions")) {
                PropertyUtil.setProperty(notFoundNode, "mgnl:template", "gato-template-mobilefirst:pages/standard");
                PropertyUtil.setProperty(megasection, "mgnl:template", "gato-template-mobilefirst:components/sections-interior/full-section");
                PropertyUtil.setProperty(layout, "mgnl:template", "gato-template-mobilefirst:components/rows-interior/full");
              } else {
                PropertyUtil.setProperty(notFoundNode, "mgnl:template", "gato-template-txstate2015:pages/standard-template");
                PropertyUtil.setProperty(megasection, "mgnl:template", "gato-component-sections:components/full-section");
                PropertyUtil.setProperty(layout, "mgnl:template", "gato-template:components/rows/full");
              }

              siteRoot.save();
              publish404Page(context, notFoundNode);
            }
          }
        }
      }
    } catch(Exception e) {
      log.error("Create404PageCommand failed for repository: {}", this.getRepository(), e);
      return false;
    }
    return true;
  }

  private void publish404Page(Context context, Node notFoundPageNode) {
    Sender sender = this.cp.newInstance(Sender.class, context , this.cp);
    List<Node> publishList = new ArrayList<Node>();
    publishList.add(notFoundPageNode);
    List<SendOperation.OperationResult> results = sender.publish(publishList, getRule());
    List<SendOperation.OperationResult> errors = results.stream().filter(result -> !result.isSuccess()).collect(Collectors.toList());
    if (!errors.isEmpty()) {
      errors.forEach(result -> {
        log.error("Receiver: {}, error: {}", result.getReceiverName(), result.getException().getMessage(), result.getException());
      });
    }
  }

  protected Rule getRule() {
    Rule rule = new Rule();
    rule.addAllowType("mgnl:page");
    return rule;
  }

}