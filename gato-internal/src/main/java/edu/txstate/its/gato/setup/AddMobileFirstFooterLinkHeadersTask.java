package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AddMobileFirstFooterLinkHeadersTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(AddMobileFirstFooterLinkHeadersTask.class);

  public AddMobileFirstFooterLinkHeadersTask() {
    super("Add Mobile First Footer Link Headers", "Add areas for editable headers, including default values");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException {
    Session session= ctx.getJCRSession(RepositoryConstants.WEBSITE);
    //only the home versions of these templates should be top level pages,
    //but checking them all just to be safe
    visitByTemplate(session,"gato-template-mobilefirst:pages/home", this::addLinksHeaderNode);
    visitByTemplate(session,"gato-template-mobilefirst:pages/standard", this::addLinksHeaderNode);
    visitByTemplate(session,"gato-template-mobilefirst:pages/mail", this::addLinksHeaderNode);
    visitByTemplate(session,"gato-template-admissions:pages/home", this::addLinksHeaderNode);
    visitByTemplate(session,"gato-template-admissions:pages/standard", this::addLinksHeaderNode);
    visitByTemplate(session,"gato-template-admissions:pages/mail", this::addLinksHeaderNode);
  }

  private void addLinksHeaderNode(Node page) throws RepositoryException {
    if (page.getDepth() == 1 && !page.hasNode("right-footer-links-header")) {
      Node areaNode = NodeUtil.createPath(page, "right-footer-links-header", NodeTypes.Area.NAME);
      Node componentNode = NodeUtil.createPath(areaNode, "linksheader", NodeTypes.Component.NAME);
      PropertyUtil.setProperty(componentNode, "text", "Connect");
      PropertyUtil.setProperty(componentNode, "mgnl:template", "gato-template-mobilefirst:components/footerlinksheader");
    }
  }
}
