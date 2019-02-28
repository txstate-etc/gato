package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RenameMobileFirstResourcesAreaTask extends GatoBaseUpgradeTask {
    private static final Logger log = LoggerFactory.getLogger(RenameMobileFirstResourcesAreaTask.class);

    public RenameMobileFirstResourcesAreaTask() {
        super("Rename Mobile First Resources Area", "Mobile first template has a resources area in the footer. The JCR label is currently 'resources', which prevents users from making their own page named 'resources' which is a commonly used word.");
    }       

    protected void doExecute(InstallContext ctx) throws RepositoryException {
        Session session = ctx.getJCRSession(RepositoryConstants.WEBSITE);
        NodeIterator nodes = session.getWorkspace().getQueryManager().
            createQuery("SELECT * FROM nt:base WHERE jcr:primaryType = 'mgnl:area' AND jcr:path like '%/resources'", "sql").
            execute().getNodes();
        
        while(nodes.hasNext()) {
            Node node = nodes.nextNode();
            NodeUtil.renameNode(node, "resource-links");
        }
    }
}
