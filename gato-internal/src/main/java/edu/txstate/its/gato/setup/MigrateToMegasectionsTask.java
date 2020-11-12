package edu.txstate.its.gato.setup;

import java.util.HashMap;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
  Wrap column layouts in megasections. 
*/

public class MigrateToMegasectionsTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(MigrateToMegasectionsTask.class);

  private HashMap layoutsToSections = new HashMap();

  public MigrateToMegasectionsTask() {
    super("Add Megasections", "Wrap existing column layouts in megasection components");

    //gato-template (2015, Wittliff, TSUS)
    layoutsToSections.put("gato-template:components/rows/full", "gato-component-sections:components/full-section");
    layoutsToSections.put("gato-template:components/rows/halves", "gato-component-sections:components/halves-section");
    layoutsToSections.put("gato-template:components/rows/onethirdtwothirds", "gato-component-sections:components/onethirdtwothirds-section");
    layoutsToSections.put("gato-template:components/rows/twothirdsonethird", "gato-component-sections:components/twothirdsonethird-section");
    layoutsToSections.put("gato-template:components/rows/thirds", "gato-component-sections:components/thirds-section");
    layoutsToSections.put("gato-template:components/rows/quarters", "gato-component-sections:components/quarters-section");                             
    
    //calico-feature, home page, admissions home
    layoutsToSections.put("gato-template-mobilefirst:components/rows-home/full", "gato-template-mobilefirst:components/sections-home/full-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-home/halves", "gato-template-mobilefirst:components/sections-home/halves-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-home/onethirdtwothirds", "gato-template-mobilefirst:components/sections-home/onethirdtwothirds-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-home/twothirdsonethird", "gato-template-mobilefirst:components/sections-home/twothirdsonethird-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-home/thirds", "gato-template-mobilefirst:components/sections-home/thirds-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-home/quarters", "gato-template-mobilefirst:components/sections-home/quarters-section");

    //calico
    layoutsToSections.put("gato-template-mobilefirst:components/rows-interior/full", "gato-template-mobilefirst:components/sections-interior/full-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-interior/halves", "gato-template-mobilefirst:components/sections-interior/halves-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-interior/onethirdtwothirds", "gato-template-mobilefirst:components/sections-interior/onethirdtwothirds-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-interior/twothirdsonethird", "gato-template-mobilefirst:components/sections-interior/twothirdsonethird-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-interior/thirds", "gato-template-mobilefirst:components/sections-interior/thirds-section");
    layoutsToSections.put("gato-template-mobilefirst:components/rows-interior/quarters", "gato-template-mobilefirst:components/sections-interior/quarters-section");

    //card layouts
    layoutsToSections.put("gato-component-cards:components/layouts/masonry", "gato-component-sections:components/collage-section");
    layoutsToSections.put("gato-component-cards:components/layouts/grid", "gato-component-sections:components/mosaic-section");
  }

  protected void wrapLayoutsInSections(Node page, String areaName) throws RepositoryException, PathNotFoundException {
    if (page.hasNode(areaName)) {
      Node layoutsArea = page.getNode(areaName);
      NodeIterator iterLayouts = layoutsArea.getNodes();
      Node currentMegasection = null;
      boolean firstLayout = true;
      while (iterLayouts.hasNext()) {
        Node layout = iterLayouts.nextNode();
        String layoutTemplateId = NodeTypes.Renderable.getTemplate(layout);
        if (null != layoutTemplateId) {
          if (layoutsToSections.containsKey(layoutTemplateId)) {
            boolean attachSection = PropertyUtil.getBoolean(layout, "attachSection", false);
            if (null != currentMegasection && attachSection && !firstLayout) {
              //add this layout to currentMegasection
              Node megasectionLayouts;
              if (currentMegasection.hasNode("layouts")) {
                megasectionLayouts = currentMegasection.getNode("layouts");
              } else {
                megasectionLayouts = NodeUtil.createPath(currentMegasection, "layouts", "mgnl:area");
              }
              NodeUtil.moveNode(layout, megasectionLayouts);
              //if the first layout in this megasection has a title, move it to the megasection title
              NodeIterator iterMSLayouts = megasectionLayouts.getNodes();
              if (iterMSLayouts.hasNext()) {
                Node firstMSLayout = iterMSLayouts.nextNode();
                String firstLayoutTitle = PropertyUtil.getString(firstMSLayout, "title", null);
                if (null != firstLayoutTitle) {
                  PropertyUtil.setProperty(currentMegasection, "title", firstLayoutTitle);
                  PropertyUtil.setProperty(firstMSLayout, "title", null);
                }
                String firstLayoutText = PropertyUtil.getString(firstMSLayout, "text", null);
                if (null != firstLayoutText) {
                  PropertyUtil.setProperty(currentMegasection, "text", firstLayoutText);
                  PropertyUtil.setProperty(firstMSLayout, "text", null);
                }
              }
            } else {
              //make a new megasection, update curentMegasection
              String layoutName = layout.getName();
              Node megasection = NodeUtil.createPath(layoutsArea, "temp" + layoutName, "mgnl:component");
              Node megasectionLayouts = NodeUtil.createPath(megasection, "layouts", "mgnl:area");
              NodeUtil.moveNodeAfter(megasection, layout);
              PropertyUtil.setProperty(megasection, "mgnl:template", layoutsToSections.get(layoutTemplateId));
              NodeUtil.moveNode(layout, megasectionLayouts);
              NodeUtil.renameNode(megasection, layoutName);
              currentMegasection = megasection;
            }
            firstLayout = false;
          } else {
            firstLayout = true;
          }
        } else {
          log.warn("MigrateToMegasections: template ID for layout " + layout.getPath() + " is null.");
        }
      }
      //If a megasection has only one layout and that layout has a background color,
      //then copy the background color to the section.
      //Don’t do this if the layout has a title or introduction text.
      NodeIterator iterMSections = layoutsArea.getNodes();
      while (iterMSections.hasNext()) {
        Node msection = iterMSections.nextNode();
        String msectionTemplateId = NodeTypes.Renderable.getTemplate(msection);
        if (StringUtils.contains(msectionTemplateId, "gato-component-section")
          || StringUtils.contains(msectionTemplateId, "sections-home")
          || StringUtils.contains(msectionTemplateId, "sections-interior")) {

          if (msection.hasNode("layouts")) {
            Node msectionLayouts = msection.getNode("layouts");
            if (msectionLayouts.getNodes().getSize() == 1) {
              Node singleLayout = msectionLayouts.getNodes().nextNode();
              boolean hasBackground = PropertyUtil.getBoolean(singleLayout, "showBackgroundColor", false);
              if (hasBackground) {
                String singleLayoutTitle = PropertyUtil.getString(singleLayout, "title", "");
                String singleLayoutText = PropertyUtil.getString(singleLayout, "text", "");
                if (StringUtils.isEmpty(singleLayoutTitle) && StringUtils.isEmpty(singleLayoutText)) {
                  PropertyUtil.setProperty(msection, "showBackgroundColor", true);
                }
              }
            }
          }
        }
      }
    }
    else {
      log.warn("MigrateToMegasections: Page " + page.getPath() + " has no " + areaName + " area.");
    }
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException {
    Session session = ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitPages(session, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        String templateId = NodeTypes.Renderable.getTemplate(n);
        if (null != templateId) {
          if (StringUtils.contains(templateId, "mail") || StringUtils.contains(templateId, "redirect")) {
            return;
          }
          try {
            if (templateId.equals("gato-template-txstate2015:pages/standard-template")
                || templateId.equals("gato-template-tsus2017:pages/home")
                || templateId.equals("gato-template-tsus2017:pages/standard")
                || templateId.equals("gato-template-wittliff:pages/standard")
                || templateId.equals("gato-template-wittliff:pages/special")
                || templateId.equals("gato-template-blank:pages/blank")
                || templateId.equals("gato-template-mobilefirst:pages/standard")
                || templateId.equals("gato-template-admissions:pages/standard")) {
              //2015, wittliff, tsus, calico, admissions contentParagraph area
              wrapLayoutsInSections(n, "contentParagraph");
              n.getSession().save();
            } else if (templateId.equals("gato-template-mobilefirst:pages/home")
                || templateId.equals("gato-template-admissions:pages/home")) {
              //mobilefirst template mobileFirstContent area
              wrapLayoutsInSections(n, "mobileFirstContent");
              n.getSession().save();
            } else if (templateId.equals("gato-template-home:pages/landing")) {
              //texas state home landing page, landingcontent area
              wrapLayoutsInSections(n, "landingcontent");
              n.getSession().save();
            } else if (templateId.equals("gato-template-home:pages/home")) {
              //texas state home page, homecontent area
              wrapLayoutsInSections(n, "homecontent");
              n.getSession().save();
            } else {
              //This template has no layouts or we are not adding megasections
              log.warn("MigrateToMegasections: No Layout Changes for page " + n.getPath() + " with template id " + templateId + ".");
            }
          } catch (Exception e) {
            log.warn("MigrateToMegasections: failed to add megasections to page " + n.getPath());
            e.printStackTrace();
          }
        } else {
          log.warn("MigrateToMegasections: template id is null for page " + n.getPath() + ".");
        }
      }
    });
  }
}
