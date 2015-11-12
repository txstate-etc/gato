package edu.txstate.its.gato.setup;

import info.magnolia.cms.security.Permission;
import info.magnolia.cms.security.Role;
import info.magnolia.cms.security.RoleManager;
import info.magnolia.cms.security.SecuritySupport;
import info.magnolia.cms.security.auth.ACL;
import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.metadata.MagnoliaAssetMetadata;
import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.objectfactory.Components;
import info.magnolia.repository.RepositoryConstants;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Deque;
import java.util.Iterator;
import java.util.Map;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyType;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * Task to upgrade Gato from Magnolia 4.5 to Magnolia 5.4.
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public class Gato5MigrationTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(Gato5MigrationTask.class);
  protected final DamTemplatingFunctions damfn;

  public Gato5MigrationTask(String name, String description) {
    super(name, description);
    damfn = Components.getSingleton(DamTemplatingFunctions.class);
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    log.info("custom css and js changes");
    visitByTemplate(hm, "gato:components/texasState/customCssBlock", this::convertInheritToBool);
    visitByTemplate(hm, "gato:components/texasState/customjsBlock", this::convertInheritToBool);
    log.info("sidebar navigation changes");
    visitByTemplate(hm, "gato:components/texasState/navBlock", this::updateNavBlock);
    log.info("image gallery changes");
    visitByTemplate(hm, "gato:components/texasState/imageGallery", this::updateImageGallery);
    log.info("site map paragraph changes");
    visitByTemplate(hm, "gato:components/texasState/siteMap", this::updateSiteMapComponent);
    log.info("sub pages paragraph changes");
    visitByTemplate(hm, "gato:components/texasState/subPages", this::updateSubPagesComponent);
    log.info("mail template paragraph changes");
    visitByTemplate(hm, "gato:components/texasState/texas-form-edit", this::updateFormEditComponent);
    visitByTemplate(hm, "gato:components/texasState/texas-form-file", this::updateFormFileComponent);
    visitByTemplate(hm, "gato:components/texasState/texas-form-selection", this::updateSelectionComponent);
    visitByTemplate(hm, "gato:pages/main-2009/khan-mail", this::updateMailArea);
    visitByTemplate(hm, "gato:pages/ua-2011/ua-2011-mail", this::updateMailArea);
    visitByTemplate(hm, "gato:pages/wittliff/wittliff-mail", this::updateMailArea);
    visitByTemplate(hm, "gato:pages/tsus-2012/tsus-2012-mail", this::updateMailArea);
    log.info("download paragraph changes");
    visitByTemplate(hm, "gato:components/texasState/texasDownload", this::updateDownloadComponent);
    visitByTemplate(hm, "gato:components/texasState/texasLink", this::convertNewWindowToBool);
    visitByTemplate(hm, "gato:components/texasState/texasEditor", this::migrateToTopAndBottom);
    hm.save();
    log.info("delete old files uploaded to rich editor paragraphs");
    visitByTemplate(hm, "gato:components/texasState/texasEditor", this::deleteContentFiles);
    log.info("delete old files uploaded to text and image paragraphs");
    visitByTemplate(hm, "gato:components/texasState/texasTextImage", this::deleteTextFiles);
    log.info("update node types in faq hierarchy");
    visitByTemplate(hm, "gato:components/texasState/texas-faq-hierarchy", this::updateFaqNodeTypes);

    log.info("starting page level changes");
    visitPages(hm, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        String templateId = NodeTypes.Renderable.getTemplate(n);
        if (templateId.equals("gato:pages/tsus-2012/tsus-2012-home")) {
          if (n.hasNode("tsusmenulinks")) NodeUtil.renameNode(n.getNode("tsusmenulinks"), "menulinks");
          if (n.hasNode("tsusnewsletter")) NodeUtil.renameNode(n.getNode("tsusnewsletter"), "newsletter");
          if (n.hasNode("tsusfooterlinks1")) NodeUtil.renameNode(n.getNode("tsusfooterlinks1"), "footerlinks1");
          if (n.hasNode("tsusfooterlinks2")) NodeUtil.renameNode(n.getNode("tsusfooterlinks2"), "footerlinks2");
          if (n.hasNode("socialmedia")) {
            for (Node sm : NodeUtil.getNodes(n.getNode("socialmedia"), NodeTypes.Component.NAME)) {
              PropertyUtil.setProperty(sm, "icononly", true);
            }
          }
        }

        if(templateId.equals("gato:pages/library-2012/library-2012-home")){
          if(n.hasNode("mobile-title")) convertNodeToAreaAndComponent(n.getNode("mobile-title"), "gato-template:components/misctext");
          if(n.hasNode("mobile-hours-link")) convertNodeToAreaAndComponent(n.getNode("mobile-hours-link"), "gato-template:components/link");
          if (n.hasNode("socialmedia")) {
            for (Node sm : NodeUtil.getNodes(n.getNode("socialmedia"), NodeTypes.Component.NAME)) {
              PropertyUtil.setProperty(sm, "icononly", true);
            }
          }
          if(n.hasNode("searchbox-data")){
            for(Node desc: NodeUtil.getNodes(n.getNode("searchbox-data"))){
              //rename node
              String newName = desc.getName() + "-description";
              NodeUtil.renameNode(desc, newName);
              //move node to parent ?
              NodeUtil.moveNode(desc, n);
              //make it an area with a component
              convertNodeToAreaAndComponent(desc, "gato-template:components/richeditor");
            }
          }
          if(n.hasNode("searchbox-chatlink")) convertNodeToAreaAndComponent(n.getNode("searchbox-chatlink"), "gato-template:components/richeditor");
        }
        String p = n.getPath();
        if (p.startsWith("/alkek-library")
          || p.startsWith("/rrhec-library")
          || p.startsWith("/division-of-information-technology")
          || p.startsWith("/instructional-technologies-support")
          || p.startsWith("/gato/")
          || p.equals("/gato")
          || p.startsWith("/tracsfacts")
          || p.startsWith("/testing-site-destroyer")) {
          if (templateId.equals("gato:pages/main-2009/khan-standard")) {
            NodeTypes.Renderable.set(n, "gato-template-txstate2015:pages/standard-template");
          } else if (templateId.equals("gato:pages/main-2009/khan-mail")) {
            NodeTypes.Renderable.set(n, "gato-template-txstate2015:pages/mail-template");
          }
        }

        boolean isMailTemplate = templateId.endsWith("mail") || templateId.endsWith("mail-template");
        if (n.hasNode("contentParagraph") && !isMailTemplate) moveBodyContentToSingleColumnContainer(n.getNode("contentParagraph"));
        if (n.hasProperty("background-image")) {
          String bgimage = n.getProperty("background-image").getString();
          String newbgimage = bgimage.replace("/wittliff/images/", "");
          PropertyUtil.setProperty(n, "background-image", newbgimage);
        }
        if (n.hasNode("footer")) convertNodeToAreaAndComponent(n.getNode("footer"), "gato-template:components/misctext");
        if (n.hasNode("siteinfo")) convertNodeToAreaAndComponent(n.getNode("siteinfo"), "gato-template:components/misctext");
        if (n.hasNode("collegeLink")) {
          Node cl = n.getNode("collegeLink");
          if (cl.hasProperty("name")) PropertyUtil.renameProperty(cl.getProperty("name"), "parent_name");
          NodeUtil.renameNode(cl, "parentOrganization");
          convertNodeToAreaAndComponent(cl, "gato-template-txstate2015:components/parent-organization");
        }
        convertPropertyToBool(n, "hideInNav");
        convertPropertyToBool(n, "hideSidebar");
        moveBanners(n);
      }
    });
    hm.save();
    log.info("finished page level changes");

    // config changes
    log.info("make changes to the config tree");
    Session cfg = ctx.getJCRSession(RepositoryConstants.CONFIG);
    Node newredirnode = cfg.getNode("/modules/ui-admincentral/virtualURIMapping/default");
    String newvalue = "redirect:/.magnolia/admincentral#app:pages:;/:treeview:";
    try {
      Node oldredirnode = cfg.getNode("/modules/adminInterface/virtualURIMapping/default");
      if (PropertyUtil.getString(oldredirnode, "toURI", "").contains("GATO-PUBLIC-DEFAULT")) {
        newvalue = "redirect:/GATO-PUBLIC-DEFAULT.html";
      }
    } catch (Exception e) { }
    PropertyUtil.setProperty(newredirnode, "toURI", "redirect:/.magnolia/admincentral#app:pages:;/:treeview:");

    // permission changes
    log.info("change all existing roles to convert their DMS permissions to DAM permissions");
    Session roles = ctx.getJCRSession(RepositoryConstants.USER_ROLES);
    SecuritySupport ss = Components.getComponent(SecuritySupport.class);
    RoleManager rm = ss.getRoleManager();
    for (Node roleNode : NodeUtil.getNodes(roles.getRootNode(), NodeTypes.Role.NAME)) {
      Role role = rm.getRole(roleNode.getName());
      Map<String, ACL> acls = rm.getACLs(role.getName());
      if (acls.containsKey("dms")) {
        ACL acl = acls.get("dms");
        for (Permission perm : acl.getList()) {
          rm.addPermission(role, "dam", perm.getPattern().getPatternString(), perm.getPermissions());
        }
      }
    }
  }

  private void convertPropertyToBool(Node n, String propName) throws RepositoryException {
    if (n.hasProperty(propName)) {
      String val = PropertyUtil.getString(n, propName, "0");
      PropertyUtil.setProperty(n, propName, "1".equals(val) || "true".equals(val));
    }
  }

  private void updateDownloadComponent(Node n) throws RepositoryException {
    if(n.hasProperty("document")){
      String itemKey = PropertyUtil.getString(n, "document");
      PropertyUtil.renameProperty(n.getProperty("document"), "link");
      String id = itemKey.replace("jcr:", "");
      Node documentNode = NodeUtil.getNodeByIdentifier("dam", id);
      PropertyUtil.setProperty(n, "link", documentNode.getPath());
    }
  }

  private void convertInheritToBool(Node n) throws RepositoryException {
    convertPropertyToBool(n, "inherit");
  }

  private void convertNewWindowToBool(Node n) throws RepositoryException{
    convertPropertyToBool(n, "newWindow");
  }

  private void updateImageGallery(Node n) throws RepositoryException {
    if (n.hasNode("subPar")) NodeUtil.renameNode(n.getNode("subPar"), "images");
  }

  private void updateSiteMapComponent(Node n) throws RepositoryException {
    Long startLevel = PropertyUtil.getLong(n, "startLevel", 1L);
    Long endLevel = PropertyUtil.getLong(n, "endLevel", 999L);
    if (startLevel < 1) { startLevel = 1L; }
    if (endLevel < 1) { endLevel = 1L; }

    if (n.hasProperty("startLevel")) { n.getProperty("startLevel").remove(); }
    if (n.hasProperty("endLevel")) { n.getProperty("endLevel").remove(); }

    n.setProperty("startPage", startLevel);
    n.setProperty("depth", endLevel - startLevel + 1);
  }

  private void updateSubPagesComponent(Node n) throws RepositoryException {
    Long levels = PropertyUtil.getLong(n, "levels", 1L);
    if (levels < 1) { levels = 1L; }

    if (n.hasProperty("levels")) { n.getProperty("levels").remove(); }

    n.setProperty("startPage", NodeUtil.getNearestAncestorOfType(n, "mgnl:page").getDepth());
    n.setProperty("depth", levels);
  }

  private void updateSelectionComponent(Node n) throws RepositoryException {
    String values = PropertyUtil.getString(n, "values", "");
    if (n.hasProperty("values")) { n.getProperty("values").remove(); }

    n.setProperty("options", convertToMultiValue(values, "\\R"));
  }

  private void updateFormFileComponent(Node n) throws RepositoryException {
    String fileTypes = PropertyUtil.getString(n, "extension", "");
    if (n.hasProperty("extension")) { n.getProperty("extension").remove(); }

    n.setProperty("extension", convertToMultiValue(fileTypes, ","));
  }

  private void updateFormEditComponent(Node n) throws RepositoryException {
    if (n.hasProperty("rows")) {
      Property rowsProp = n.getProperty("rows");
      long rows = rowsProp.getLong();

      String lines = "single";
      if (rows == 4) { lines = "small"; }
      if (rows == 10) { lines = "large"; }

      n.setProperty("lines", lines);
      rowsProp.remove();
    }

    if (n.hasProperty("valid_fromDate")) { convertStringToDate(n.getProperty("valid_fromDate"), "datefrom"); }
    if (n.hasProperty("valid_toDate")) { convertStringToDate(n.getProperty("valid_toDate"), "dateto"); }

    if (n.hasProperty("valid_type")) { PropertyUtil.renameProperty(n.getProperty("valid_type"), "dataType"); }
    if (n.hasProperty("valid_regex")) { PropertyUtil.renameProperty(n.getProperty("valid_regex"), "regexregex"); }
    if (n.hasProperty("valid_msg")) { PropertyUtil.renameProperty(n.getProperty("valid_msg"), "regexerror"); }
  }

  private void updateNavBlock(Node n) throws RepositoryException {
    convertInheritToBool(n);
    if (n.hasProperty("sort")) {
      PropertyUtil.renameProperty(n.getProperty("sort"), "position");
      if (PropertyUtil.getString(n, "position", "").equals("bot"))
        PropertyUtil.setProperty(n, "position", "bottom");
    }
  }

  private void updateMailArea(Node n) throws RepositoryException {
    if (!n.hasNode("contentParagraph")) { return; }

    Node mail = n.getNode("contentParagraph");

    // Move properties on the template to the area since they're now configured with an area dialog
    moveProperty("copySender", n, mail);
    moveProperty("subject", n, mail);
    moveProperty("redirect", n, mail);

    if (n.hasProperty("to")) {
      Property to = n.getProperty("to");
      String addresses = to.getString();
      mail.setProperty("to", convertToMultiValue(addresses, "\\R"));
      to.remove();
    }

    NodeUtil.renameNode(mail, "mail");
  }

  private void updateFaqNodeTypes(Node node) throws RepositoryException {
    if (!node.hasNode("faqTree")) { return; }

    Node faqTree = node.getNode("faqTree");
    for (Node n : NodeUtil.getNodes(faqTree)) {
      convertComponentNodesToArea(n);
    }
  }

  private void convertComponentNodesToArea(Node node) throws RepositoryException {
    if (node.getPrimaryNodeType().getName().equals(NodeTypes.Component.NAME)) {
      node.setPrimaryType(NodeTypes.Area.NAME);
    }

    for (Node n : NodeUtil.getNodes(node)) {
      convertComponentNodesToArea(n);
    }
  }

  private void moveProperty(String propertyName, Node from, Node to) throws RepositoryException {
    if (from.hasProperty(propertyName)) {
      Property fromProp = from.getProperty(propertyName);
      to.setProperty(propertyName, fromProp.getValue());
      fromProp.remove();
    }
  }

  private void convertNodeToAreaAndComponent(Node n, String type) throws RepositoryException {
    convertNodeToAreaAndComponent(n, type, n.getName());
  }

  private void convertNodeToAreaAndComponent(Node n, String type, String name) throws RepositoryException {
    Node area = n.getParent().addNode("tempconversionnode", "mgnl:area");
    NodeUtil.moveNode(n, area);
    NodeUtil.renameNode(area, name);
    n.setPrimaryType(NodeTypes.Component.NAME);
    NodeTypes.Renderable.set(n, type);
  }

  private void convertStringToDate(Property p, String newName) throws RepositoryException {
    SimpleDateFormat isoLocalDate = new SimpleDateFormat("yyy-MM-dd");
    Calendar cal = Calendar.getInstance();

    try {
      cal.setTime(isoLocalDate.parse(p.getString()));
      Node n = p.getParent();
      p.remove();
      n.setProperty(newName, cal);
    } catch (ParseException e) {
      // Property wasn't a date string. Keep the property since removing it would result in loss of data.
      log.warn("Failed to parse property as yyyy-MM-dd date: " + p.getPath());
    }
  }

  protected void deleteContentFiles(Node n) throws RepositoryException {
    if (n.hasNode("content_files")) n.getNode("content_files").remove();
  }
  protected void deleteTextFiles(Node n) throws RepositoryException {
    if (n.hasNode("text_files")) n.getNode("text_files").remove();
  }

  protected void migrateToTopAndBottom(Node n) throws RepositoryException {
    String damkey = PropertyUtil.getString(n, "image", "");
    if (!"".equals(damkey)) {
      try {
        Asset img = damfn.getAsset(damkey);
        long width = img.getMetadata(MagnoliaAssetMetadata.class).getWidth();
        long statedwidth = PropertyUtil.getLong(n, "imageWidth", Long.valueOf(0));
        if (statedwidth < width && statedwidth > 0) width = statedwidth;
        if (width > 600) {
          log.info("changing textimage at "+n.getPath()+" to imageFloat=top");
          PropertyUtil.setProperty(n, "imageFloat", "top");
        }
      } catch (Exception e) {
        log.error("migrateToTopAndBottom: could not get textimage asset");
        e.printStackTrace();
      }
    }
  }

  /**
   * Converts a list represented as a string with a separator to a String array
   * suitable for use in a multi-value JCR property. Empty strings and strings
   * that only contain whitespace will be removed from the list.
   */
  private String[] convertToMultiValue(String list, String separator) {
    String[] values = list.split(separator);

    ArrayList<String> newValues = new ArrayList<String>();
    for (String value : values) {
      value = value.trim();
      if (!"".equals(value)) { newValues.add(value); }
    }

    return newValues.toArray(new String[0]);
  }

  protected void moveBanners(Node n) throws RepositoryException {
    if (n.hasNode("gato-banners")) {
      Node gbanners = n.getNode("gato-banners");
      if (gbanners.hasNodes()) {
        Iterable<Node> images = NodeUtil.getNodes(gbanners, NodeTypes.Component.NAME);
        Node newcomponent = gbanners.addNode("imported", NodeTypes.Component.NAME);
        NodeTypes.Renderable.set(newcomponent, "gato-template:components/banners");
        Node imagesparent = newcomponent.addNode("banners", NodeTypes.Area.NAME);
        Node savefirstimage = null;
        for (Node image : images) {
          if (savefirstimage == null) savefirstimage = image;
          NodeUtil.moveNode(image, imagesparent);
          convertPropertyToBool(image, "inherit");
        }
        if (n.hasNode("gato-banner-settings")) {
          Node gbsettings = n.getNode("gato-banner-settings");
          PropertyUtil.setProperty(newcomponent, "visible", gbsettings.getProperty("visible").getString());
          PropertyUtil.setProperty(newcomponent, "reset", gbsettings.getProperty("reset").getBoolean());

          // import one banner to the headerImage area for the 2015 template
          if (savefirstimage != null) {
            Node headerImage = n.addNode("headerImage", NodeTypes.Area.NAME);
            Node hicomp = headerImage.addNode("imported", NodeTypes.Component.NAME);
            NodeTypes.Renderable.set(hicomp, "gato-template-txstate2015:components/header-image");
            PropertyUtil.setProperty(hicomp, "visible", PropertyUtil.getString(gbsettings, "visible", "inherit"));
            PropertyUtil.setProperty(hicomp, "shown", savefirstimage.getProperty("image").getString());
          }
        }
      }
    }
    if (n.hasNode("gato-banner-settings")) n.getNode("gato-banner-settings").remove();
  }

  protected void moveBodyContentToSingleColumnContainer(Node cp) throws RepositoryException {
    Iterable<Node> existingComponents = NodeUtil.getNodes(cp, NodeTypes.Component.NAME);
    Node row = cp.addNode("importrow", NodeTypes.Component.NAME);
    NodeTypes.Renderable.set(row, "gato-template:components/rows/full");
    Node rowarea = row.addNode("column1", NodeTypes.Area.NAME);
    for (Node comp : existingComponents) NodeUtil.moveNode(comp, rowarea);
  }
}
