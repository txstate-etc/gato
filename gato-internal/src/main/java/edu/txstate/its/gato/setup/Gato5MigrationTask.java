package edu.txstate.its.gato.setup;

import info.magnolia.repository.RepositoryConstants;
import info.magnolia.module.InstallContext;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;

import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyType;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

/**
 *
 * Task to upgrade Gato from Magnolia 4.5 to Magnolia 5.4.
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public class Gato5MigrationTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(Gato5MigrationTask.class);

  public Gato5MigrationTask(String name, String description) {
    super(name, description);
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitPages(hm, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        if (NodeTypes.Renderable.getTemplate(n).equals("gato-template-tsus:pages/home")) {
          if (n.hasNode("tsusmenulinks")) NodeUtil.renameNode(n.getNode("tsusmenulinks"), "menulinks");
          if (n.hasNode("tsusnewsletter")) NodeUtil.renameNode(n.getNode("tsusnewsletter"), "newsletter");
          if (n.hasNode("tsusfooterlinks1")) NodeUtil.renameNode(n.getNode("tsusfooterlinks1"), "footerlinks1");
          if (n.hasNode("tsusfooterlinks2")) NodeUtil.renameNode(n.getNode("tsusfooterlinks2"), "footerlinks2");
          if (n.hasNode("socialmedia")) {
            for (Node sm : NodeUtil.getNodes(n.getNode("socialmedia"))) {
              PropertyUtil.setProperty(sm, "icononly", true);
            }
          }
        }
        if (n.hasNode("footer")) convertNodeToAreaAndComponent(n.getNode("footer"), "gato-template:components/misctext");
        if (n.hasNode("siteinfo")) convertNodeToAreaAndComponent(n.getNode("siteinfo"), "gato-template:components/misctext");
      }
    });

    //convert collegeLink to parentOrganization
    visitPages(hm, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        String parentName = "", parentUrl = "";
        Node componentNode;
        //if there is a collegeLink node
        if(n.hasNode("collegeLink")){
          Node collegeLinkNode = n.getNode("collegeLink");
          //get the parent name and url
          if(collegeLinkNode.hasProperty("name")) parentName = collegeLinkNode.getProperty("name").getString();
          if(collegeLinkNode.hasProperty("url")) parentUrl = collegeLinkNode.getProperty("url").getString();
          //create a parentOrganization area node
          Node parentOrgNode = n.addNode("parentOrganization", "mgnl:area");
          //don't want to add a component if it has no content
          if(parentName.length() + parentUrl.length() > 0){
            //add a component node to the parentOrganization
            componentNode = parentOrgNode.addNode("0", "mgnl:component");
            //set the template for the component node
            NodeTypes.Renderable.set(componentNode, "gato-template-txstate2015:components/parent-organization");
            //add parent_name and url properties if necessary
            if(collegeLinkNode.hasProperty("name")) PropertyUtil.setProperty(componentNode, "parent_name", parentName);
            if(collegeLinkNode.hasProperty("url")) PropertyUtil.setProperty(componentNode, "url", parentUrl);
          }
          //remove the collegeLink node
          collegeLinkNode.remove();
        }
      }
    });

    //make sure all hideInNav types are boolean, not string
    visitPages(hm, new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        Property propHideInNav = PropertyUtil.getPropertyOrNull(n, "hideInNav");
        //if the page has a hideInNav property
        if(propHideInNav != null){
          //check if the property has type String
          if(propHideInNav.getType() == PropertyType.STRING){
            boolean hideInNav = Boolean.parseBoolean(propHideInNav.getString());
            //remove the String property
            propHideInNav.remove();
            //add the property back with a boolean
            PropertyUtil.setProperty(n, "hideInNav", hideInNav);
          }
        }

      }
    });

    visitByTemplate(hm, "gato:components/texasState/customCssBlock", this::convertInheritToBool);
    visitByTemplate(hm, "gato:components/texasState/customjsBlock", this::convertInheritToBool);
    visitByTemplate(hm, "gato:components/texasState/imageGallery", this::updateImageGallery);
    visitByTemplate(hm, "gato:components/texasState/siteMap", this::updateSiteMapComponent);
    visitByTemplate(hm, "gato:components/texasState/subPages", this::updateSubPagesComponent);
    visitByTemplate(hm, "gato:components/texasState/texas-form-edit", this::updateFormEditComponent);
    visitByTemplate(hm, "gato:components/texasState/texas-form-selection", this::updateSelectionComponent);
    visitByTemplate(hm, "gato:pages/main-2009/khan-mail", this::updateMailArea);
    visitByTemplate(hm, "gato:components/texasState/texasDownload", this::updateDownloadComponent);
  }

  private void updateDownloadComponent(Node n) throws RepositoryException{
    if(n.hasProperty("document")){
      String itemKey = PropertyUtil.getString(n, "document");
      PropertyUtil.renameProperty(n.getProperty("document"), "link");
      String id = itemKey.replace("jcr:", "");
      Node documentNode = NodeUtil.getNodeByIdentifier("dam", id);
      PropertyUtil.setProperty(n, "link", documentNode.getPath());
    }
  }

  private void convertInheritToBool(Node n) throws RepositoryException {
    if (n.hasProperty("inherit")) {
      String val = PropertyUtil.getString(n, "inherit", "0");
      PropertyUtil.setProperty(n, "inherit", "1".equals(val) || "true".equals(val));
    }
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
}
