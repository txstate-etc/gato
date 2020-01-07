package edu.txstate.its.gato.setup;

//visit all pages with a calico template: feature, variable, informational, mail, sitemap, filterable search, global search
//for feature, look at home-banner content node. With image, looks like:
//      cn type area: home-banner
//        cn type component: 0
//          p type string: image
//          p type string: visible
//needs to look like:
//      cn type area: calico-hero
//        cn type component: 0
//          p type string: customize -> image
//          p type string: image -> (Leave it)
//          p type string: size -> large
//          p type string: visible -> shown


import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.ValueFormatException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateCalicoHerosTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateCalicoHerosTask.class);

  public UpdateCalicoHerosTask() {
    super("Update Calico Template Hero Images", "Update hero banners on all Calico pages");
  }
  
  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    //Calico Feature, previously mobilefirst home
    visitByTemplate(s,"gato-template-mobilefirst:pages/home",page->{updateHomeBannerArea(page);});
    visitByTemplate(s,"gato-template-admissions:pages/home",page->{updateHomeBannerArea(page);});
    
    visitByTemplate(s, "gato-template-mobilefirst:pages/standard", page-> {updateSubpageBannerArea(page);}); //variable
    visitByTemplate(s, "gato-template-mobilefirst:pages/informational", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-mobilefirst:pages/mail", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-mobilefirst:pages/sitemap", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-mobilefirst:pages/filterablesearch", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-mobilefirst:pages/passthrough", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-mobilefirst:pages/search", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-admissions:pages/standard", page-> {updateSubpageBannerArea(page);});
    visitByTemplate(s, "gato-template-admissions:pages/mail", page-> {updateSubpageBannerArea(page);});
  }
  
  protected void updateHomeBannerArea(Node page) throws RepositoryException, ValueFormatException {
    if (page.hasNode("home-banner")) {
      Node homeBannerArea = page.getNode("home-banner");
      if (homeBannerArea.hasNodes()) {
        Node bannerComponent = homeBannerArea.getNodes().nextNode();
        bannerComponent.setProperty("customize", "image");
        bannerComponent.setProperty("size", "large");
        bannerComponent.setProperty("mgnl:template", "gato-template-mobilefirst:components/calico-hero");
      }
      NodeUtil.renameNode(homeBannerArea, "calico-hero");
      homeBannerArea.save();
    }
  }
  
  protected void updateSubpageBannerArea(Node page) throws RepositoryException, ValueFormatException{
    if (page.hasNode("subpage-banner")) {
      Node subpageBannerArea = page.getNode("subpage-banner");
      if (subpageBannerArea.hasNodes()) {
        Node bannerComponent = subpageBannerArea.getNodes().nextNode();
        bannerComponent.setProperty("mgnl:template", "gato-template-mobilefirst:components/calico-hero");
        String visibility = PropertyUtil.getString(bannerComponent, "visible", "");
        if (visibility.equals("inherit")) {
          bannerComponent.setProperty("visible", "shown");
          bannerComponent.setProperty("customize", "inherit");
          bannerComponent.setProperty("size", "small");
        }
        else if (visibility.equals("shown")) {
          bannerComponent.setProperty("customize", "image");
          bannerComponent.setProperty("size", "small");
        }
      }
      else {
        //set size to small because all subpage templates had small banners initially
        Node bannerComponent = NodeUtil.createPath(subpageBannerArea, "0", NodeTypes.Component.NAME);
        bannerComponent.setProperty("mgnl:template", "gato-template-mobilefirst:components/calico-hero");
        bannerComponent.setProperty("size", "small");
        bannerComponent.setProperty("customize", "inherit");
        bannerComponent.setProperty("visible", "shown");
      }
      NodeUtil.renameNode(subpageBannerArea, "calico-hero");
      subpageBannerArea.save();
    }
  }
}