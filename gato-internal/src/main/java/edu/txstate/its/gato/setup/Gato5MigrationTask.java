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

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

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
          if (n.hasNode("socialmedia")) {
          	for (Node sm : NodeUtil.getNodes(n.getNode("socialmedia"))) {
          		PropertyUtil.setProperty(sm, "icononly", true);
          	}
          }
        }
      }
    });

    visitByTemplate(hm, "gato:components/texasState/siteMap", this::updateSiteMapComponent);
    visitByTemplate(hm, "gato:components/texasState/subPages", this::updateSubPagesComponent);
    visitByTemplate(hm, "gato:components/texasState/texas-form-selection", this::updateSelectionComponent);
    visitByTemplate(hm, "gato:pages/main-2009/khan-mail", this::renameMailArea);
  }

  private void updateSiteMapComponent(Node n) throws RepositoryException {
    Long startLevel = PropertyUtil.getLong(n, "startLevel", 1L);
    Long endLevel = PropertyUtil.getLong(n, "endLevel", 999L);
    if (startLevel < 1) { startLevel = 1L; }
    if (endLevel < 1) { endLevel = 1L; }

    Property startLevelProp = PropertyUtil.getPropertyOrNull(n, "startLevel");
    Property endLevelProp = PropertyUtil.getPropertyOrNull(n, "endLevel");
    if (startLevelProp != null) { startLevelProp.remove(); }
    if (endLevelProp != null) { endLevelProp.remove(); }

    n.setProperty("startPage", startLevel);
    n.setProperty("depth", endLevel - startLevel + 1);
  }

  private void updateSubPagesComponent(Node n) throws RepositoryException {
    Long levels = PropertyUtil.getLong(n, "levels", 1L);
    if (levels < 1) { levels = 1L; }

    Property levelsProp = PropertyUtil.getPropertyOrNull(n, "levels");
    if (levelsProp != null) { levelsProp.remove(); }

    n.setProperty("startPage", NodeUtil.getNearestAncestorOfType(n, "mgnl:page").getDepth());
    n.setProperty("depth", levels);
  }

  private void updateSelectionComponent(Node n) throws RepositoryException {
    String values = PropertyUtil.getString(n, "values", "");
    Property valuesProp = PropertyUtil.getPropertyOrNull(n, "values");
    valuesProp.remove();

    n.setProperty("options", convertToMultiValue(values, "\\R"));
  }

  private void renameMailArea(Node n) throws RepositoryException {
    if (n.hasNode("contentParagraph")) {
      NodeUtil.renameNode(n.getNode("contentParagraph"), "mail");
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
