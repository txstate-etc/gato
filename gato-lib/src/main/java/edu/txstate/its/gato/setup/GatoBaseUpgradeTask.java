package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeTypes;

import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.NodeIterator;

import javax.jcr.AccessDeniedException;
import javax.jcr.RepositoryException;
import javax.jcr.ItemNotFoundException;
import javax.jcr.query.InvalidQueryException;

import org.apache.jackrabbit.commons.predicate.NodeTypePredicate;

/**
 *
 * Provide our nifty little visitByTemplate method to all future upgrade tasks
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public abstract class GatoBaseUpgradeTask extends info.magnolia.module.delta.AbstractRepositoryTask {
			
	public GatoBaseUpgradeTask(String name, String description) {
		super(name, description);
	}
		
	protected void visitByTemplate(Session ws, String componentId, NodeVisitor visitor) throws RepositoryException, InvalidQueryException, ItemNotFoundException, AccessDeniedException {
		NodeIterator nodes = ws.getWorkspace().getQueryManager().
			createQuery("SELECT * FROM [nt:base] WHERE [mgnl:template] = '"+componentId+"'", "JCR-SQL2").
			execute().getNodes();
		while (nodes.hasNext()) {
			Node node = nodes.nextNode();
			visitor.visit(node);
			node.save();
		}
	}
	
	protected void visitSubPages(Session ws, String path, NodeVisitor visitor) throws RepositoryException, InvalidQueryException, ItemNotFoundException, AccessDeniedException {
		NodeUtil.visit(ws.getNode(path), visitor, new NodeTypePredicate("mgnl:page", true));
	}
	
	protected void visitPages(Session ws, NodeVisitor visitor) throws RepositoryException, InvalidQueryException, ItemNotFoundException, AccessDeniedException {
		// apparently NodeUtil.visit visits the given node even if it does not match the predicate
		// so we have to find the pages beneath the root node and call visit on each of them
		for (Node p : NodeUtil.getNodes(ws.getRootNode(), new NodeTypePredicate("mgnl:page", true))) {
			NodeUtil.visit(p, visitor, new NodeTypePredicate("mgnl:page", true));
		}
	}
}
