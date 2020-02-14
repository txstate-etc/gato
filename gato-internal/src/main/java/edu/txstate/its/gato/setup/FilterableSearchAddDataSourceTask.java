package edu.txstate.its.gato.setup;

import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FilterableSearchAddDataSourceTask extends GatoBaseUpgradeTask{
  private static final Logger log = LoggerFactory.getLogger(FilterableSearchAddDataSourceTask.class);

  public FilterableSearchAddDataSourceTask() {
    super("FilterableSearchAddDataSourceTask", "Add datasource:manual property to all existing Filterable Search Directory content types");
  }
  
  @Override
  protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
      log.info("Running FilterableSearchAddDataSourceTask");

      Session websiteSession = installContext.getJCRSession(RepositoryConstants.WEBSITE);
      visitByTemplate(websiteSession, "gato-area-filterable-search:components/directory", new NodeVisitor() {
        public void visit(Node n) throws RepositoryException {
          if (n.hasNode("listitems")) {
            Node listItemsNode = n.getNode("listitems");
            NodeIterator iter = listItemsNode.getNodes();
            while(iter.hasNext()) {
              Node item = iter.nextNode();
              if (!item.hasProperty("datasource")) {
                PropertyUtil.setProperty(item, "datasource", "manual");
              }
            }
          }
        }
      });
  }
}