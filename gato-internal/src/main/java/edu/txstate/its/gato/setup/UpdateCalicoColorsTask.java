package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.apache.commons.lang3.ArrayUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateCalicoColorsTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateCalicoColorsTask.class);

  public static final String[] TEMPLATE_IDS_CALICO = {
    "gato-template-mobilefirst:pages/standard", 
    "gato-template-mobilefirst:pages/home",
    "gato-template-mobilefirst:pages/informational"
  };

  public UpdateCalicoColorsTask() {
    super("Update Calico Colors", "Fix color properties for content types in calico templates to prepare for additional colors");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {

    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitByTemplate(s,"gato-component-patterns:components/titlebuttons",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/titlelinks",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/buttonsimage",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/linksimage",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/twocolcta",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/insettextimage",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/imageoverlay",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/callout",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/calloutimage",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/twocallouts",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-patterns:components/quoteimage",n->{fixColors(n);});
    
    visitByTemplate(s,"gato-template-mobilefirst:components/button",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-feature:components/feature",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-cards:components/regular/image",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-cards:components/regular/video",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-cards:components/layouts/grid",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-cards:components/grid/image",n->{fixColors(n);});
    visitByTemplate(s,"gato-component-cards:components/grid/video",n->{fixColors(n);});

    //white updated from color 5 to color 8
    visitByTemplate(s,"gato-component-patterns:components/insettextimage", n-> {
      Node page = NodeUtil.getNearestAncestorOfType(n, "mgnl:page");
      if (!ArrayUtils.contains(TEMPLATE_IDS_CALICO, PropertyUtil.getString(page, "mgnl:template", ""))) return;
      if (n.hasProperty("color") && PropertyUtil.getString(n, "color","").equals("color5")) {
        PropertyUtil.setProperty(n, "color", "color8");
      }
    });
  }

  //sandstone updated from color 4 to color 6
  private void fixColors(Node n) throws RepositoryException {
    try {
      Node page = NodeUtil.getNearestAncestorOfType(n, "mgnl:page");
      if (!ArrayUtils.contains(TEMPLATE_IDS_CALICO, PropertyUtil.getString(page, "mgnl:template", ""))) return;
      if (n.hasProperty("color") && PropertyUtil.getString(n, "color","").equals("color4")) {
        PropertyUtil.setProperty(n, "color", "color6");
      }
      if (n.hasProperty("colorLeft") && PropertyUtil.getString(n, "colorLeft","").equals("color4")) {
        PropertyUtil.setProperty(n, "colorLeft", "color6");
      }
      if (n.hasProperty("colorRight") && PropertyUtil.getString(n, "colorRight","").equals("color4")) {
        PropertyUtil.setProperty(n, "colorRight", "color6");
      }
    } catch(Exception e) {
      e.printStackTrace();
    }
  }
}
