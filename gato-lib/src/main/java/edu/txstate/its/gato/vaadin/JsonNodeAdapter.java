package edu.txstate.its.gato.vaadin;

import info.magnolia.rest.service.node.v1.RepositoryMarshaller;
import info.magnolia.rest.service.node.v1.RepositoryNode;
import info.magnolia.ui.vaadin.integration.jcr.JcrNewNodeAdapter;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

/**
 * JcrNodeAdapter for use with JsonTransformer.
 */
public class JsonNodeAdapter extends JcrNodeAdapter {

  protected RepositoryNode newNode;
  protected RepositoryMarshaller marshaller = new RepositoryMarshaller();

  public JsonNodeAdapter(Node parentNode, RepositoryNode newNode, String nodeName) {
    super(parentNode);
    this.newNode = newNode;
    setNodeName(nodeName);
  }

  @Override
  public Node applyChanges() throws RepositoryException {
    Node parent = getJcrItem();

    if (getParent() instanceof JcrNewNodeAdapter) {
      parent = parent.getNode(getParent().getNodeName());
    }

    if (parent.hasNode(getNodeName())) {
      parent.getNode(getNodeName()).remove();
    }

    newNode.setName(getNodeName());
    return createNode(parent, newNode);
  }

  protected Node createNode(Node parent, RepositoryNode repoNode) throws RepositoryException {
    Node node = parent.addNode(repoNode.getName(), repoNode.getType());
    if (repoNode.getProperties() != null) {
      marshaller.unmarshallProperties(node, repoNode.getProperties());
    }

    if (repoNode.getNodes() != null) {
      for (RepositoryNode n : repoNode.getNodes()) {
        createNode(node, n);
      }
    }

    return node;
  }
}
