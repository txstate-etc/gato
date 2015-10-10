package edu.txstate.its.gato.setup;

import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeVisitor;

import javax.jcr.Node;
import javax.jcr.Property;

import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MoveFaqToDamTask extends MoveRichEditorToDamTask {
  private static final Logger log = LoggerFactory.getLogger(MoveFaqToDamTask.class);

  public MoveFaqToDamTask() {
    super("gato:components/texasState/texas-faq-hierarchy", "answer");
  }

  @Override
  protected void handleUploadReferenceForNode(Node node) throws RepositoryException {
    if (!node.hasNode("faqTree")) return;
    NodeUtil.visit(node.getNode("faqTree"), new NodeVisitor() {
      public void visit(Node n) throws RepositoryException {
        if (n.hasProperty("answer")) {
          try {
            handleTextProperty(n, n.getProperty("answer"));
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      }
    });
  }
}
