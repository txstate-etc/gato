package edu.txstate.its.gato;

import info.magnolia.context.Context;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import javax.jcr.Node;
import javax.jcr.Session;
import org.apache.commons.lang3.ArrayUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CreateSiteMapCommand extends GatoBaseSchedulerCommand {
  public static Logger log = LoggerFactory.getLogger(SortCommand.class);
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
          }
          else if(ArrayUtils.contains(TEMPLATE_IDS_2015, pageTemplate)) {
            log.info("Creating a sitemap for " + siteRoot.getName());
            Node siteMapNode = NodeUtil.createPath(siteRoot, "sitemap", NodeTypes.Page.NAME);
            PropertyUtil.setProperty(siteMapNode, "mgnl:template", "gato-template-txstate2015:pages/sitemap");
            PropertyUtil.setProperty(siteMapNode, "title", "Site Map");
            PropertyUtil.setProperty(siteMapNode, "hideInNav", true);
            PropertyUtil.setProperty(siteMapNode, "hideSidebar", true);
            siteRoot.save();
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
}