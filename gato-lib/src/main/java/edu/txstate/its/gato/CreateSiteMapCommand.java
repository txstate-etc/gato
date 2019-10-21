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
import org.apache.commons.lang3.ArrayUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CreateSiteMapCommand extends GatoBaseSchedulerCommand {
  public static Logger log = LoggerFactory.getLogger(CreateSiteMapCommand.class);
  public static final String[] TEMPLATE_IDS_CALICO = {"gato-template-mobilefirst:pages/standard", 
                                                      "gato-template-mobilefirst:pages/home",
                                                      "gato-template-mobilefirst:pages/mail",
                                                      "gato-template-mobilefirst:pages/filterablesearch",
                                                      "gato-template-mobilefirst:pages/informational",
                                                      "gato-template-admissions:pages/home",
                                                      "gato-template-admissions:pages/standard",
                                                      "gato-template-admissions:pages/mail"};
  
  public static final String[] TEMPLATE_IDS_2015 = {"gato-template-txstate2015:pages/mail-template",
                                                    "gato-template-txstate2015:pages/standard-template",
                                                    "gato-template-txstate2015:pages/filterablesearch"};

  private ComponentProvider cp;

  @Inject
  public CreateSiteMapCommand(ComponentProvider cp) {
    this.cp = cp;
  }
  
  public boolean doExecute(Context context) {
    try {
      Session session = MgnlContext.getJCRSession(this.getRepository());
      Node rootNode = session.getNode(this.getPath());
      for (Node siteRoot : NodeUtil.getNodes(rootNode, NodeTypes.Page.NAME)) {
        int numSubpages = NodeUtil.asList(NodeUtil.getNodes(siteRoot, NodeTypes.Page.NAME)).size();
        String pageTemplate = NodeTypes.Renderable.getTemplate(siteRoot);
        if (numSubpages > 0 && !siteRoot.hasNode("sitemap")) {
          if (ArrayUtils.contains(TEMPLATE_IDS_CALICO, pageTemplate)) {
            log.info("Creating a sitemap for " + siteRoot.getName());
            Node siteMapNode = NodeUtil.createPath(siteRoot, "sitemap", NodeTypes.Page.NAME);
            PropertyUtil.setProperty(siteMapNode, "mgnl:template", "gato-template-mobilefirst:pages/sitemap");
            PropertyUtil.setProperty(siteMapNode, "title", "Site Map");
            PropertyUtil.setProperty(siteMapNode, "hideInNav", true);
            PropertyUtil.setProperty(siteMapNode, "addTitleSeparator", true);
            siteRoot.save();
            publishSiteMap(context, siteMapNode);
          }
          else if(ArrayUtils.contains(TEMPLATE_IDS_2015, pageTemplate)) {
            log.info("Creating a sitemap for " + siteRoot.getName());
            Node siteMapNode = NodeUtil.createPath(siteRoot, "sitemap", NodeTypes.Page.NAME);
            PropertyUtil.setProperty(siteMapNode, "mgnl:template", "gato-template-txstate2015:pages/sitemap");
            PropertyUtil.setProperty(siteMapNode, "title", "Site Map");
            PropertyUtil.setProperty(siteMapNode, "hideInNav", true);
            PropertyUtil.setProperty(siteMapNode, "hideSidebar", true);
            siteRoot.save();
            publishSiteMap(context, siteMapNode);
          }
        }
      }
    }
    catch(Exception e) {
      log.error("CreateSiteMapCommand failed for repository: {}", this.getRepository(), e);
      return false;
    }
    return true;
  }

  private void publishSiteMap(Context context, Node siteMapNode) {
    Sender sender = this.cp.newInstance(Sender.class, context , this.cp);
    List<Node> publishList = new ArrayList<Node>();
    publishList.add(siteMapNode);
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