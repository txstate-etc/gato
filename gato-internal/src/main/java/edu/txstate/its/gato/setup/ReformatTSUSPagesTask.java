package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.PropertyUtil;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import javax.jcr.RepositoryException;
import info.magnolia.module.delta.TaskExecutionException;

import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/******************************************************************************************************************
*
* For pages with a right side bar, create a one-third / two-thirds section
* Put the content from the original main content area in the two-thirds section
* Put the right side bar content in the one-third section
* If the first section of the main content area has more than one column, put the right side bar content below it
*
******************************************************************************************************************/

public class ReformatTSUSPagesTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(ReformatTSUSPagesTask.class);

  public ReformatTSUSPagesTask() {
    super("Reformat TSUS Pages", "Move right sidebar content into a column layout.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {

    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s,"gato-template-tsus:pages/standard",page->{
      if (page.hasNode("rightbar") && page.hasNode("contentParagraph")) {
        //get right sidebar content
        Node rightbar = page.getNode("rightbar");
        NodeIterator iterRightBarComponents = rightbar.getNodes();
        if (iterRightBarComponents.getSize() < 1) return;

        Node contentParagraph = page.getNode("contentParagraph");
        NodeIterator iterSections = contentParagraph.getNodes();
        boolean noSections = false;
        if (iterSections.getSize() < 1) noSections = true;

        Node firstSection = null;
        while (iterSections.hasNext()) {
          Node section = iterSections.nextNode();
          if (NodeUtil.isFirstSibling(section)) {
            firstSection = section;
          }
        }

        //check if it has more than one column OR it has no sections at all
        if (noSections || firstSection.getNodes().getSize() > 1 ) {
          //add right bar content to bottom of page
          Node newSection = NodeUtil.createPath(contentParagraph, "rightbarsection", NodeTypes.Component.NAME);
          PropertyUtil.setProperty(newSection, "mgnl:template", "gato-template:components/rows/full");
          Node column = NodeUtil.createPath(newSection, "column1", NodeTypes.Area.NAME);
          while (iterRightBarComponents.hasNext()) {
            Node component = iterRightBarComponents.nextNode();
            NodeUtil.moveNode(component, column );
          }
        }
        else {
          //create a one-third/two-thirds section
          Node newSection = NodeUtil.createPath(contentParagraph, "rightbarsection", NodeTypes.Component.NAME);
          NodeUtil.orderFirst(newSection);
          PropertyUtil.setProperty(newSection, "mgnl:template", "gato-template:components/rows/onethirdtwothirds");
          Node smallColumn = NodeUtil.createPath(newSection, "column1", NodeTypes.Area.NAME);
          //move right bar content into small column
          while (iterRightBarComponents.hasNext()) {
            Node component = iterRightBarComponents.nextNode();
            NodeUtil.moveNode(component, smallColumn );
          }
          //move first section of main content into large column
          Node firstSectionContentColumn = firstSection.getNodes().nextNode();
          NodeUtil.renameNode(firstSectionContentColumn, "column2");
          NodeUtil.moveNode(firstSectionContentColumn, newSection);
          //remove old first section
          firstSection.remove();
        }
        //remove old empty nodes
        page.getNode("rightbar").remove();
      }
      else {
        return;
      }
    });
  }
}