package edu.txstate.its.gato.setup;

import info.magnolia.cms.core.version.VersionManager;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.objectfactory.Components;
import info.magnolia.repository.RepositoryConstants;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WipeVersionsTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(WipeVersionsTask.class);

  private List<String> templateIds;

  public WipeVersionsTask(List<String> templateIds, String description) {
    super("WipeVersionsTask", description);
    this.templateIds = templateIds;
  }
  public WipeVersionsTask(String templateId) {
    this(Arrays.asList(templateId), "Eliminate all version information for pages related to templateId: "+templateId);
  }
  public WipeVersionsTask(List<String> templateIds) {
    this(templateIds, "Eliminate all version information for pages based on multiple templateIds");
  }

  @Override
  protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
    log.info("Running WipeVersionsTask");

    HashSet<Node> pages = new HashSet();
    Session s = installContext.getJCRSession(RepositoryConstants.WEBSITE);
    for (String templateId : templateIds) {
      visitByTemplate(s, templateId, new NodeVisitor() {
        public void visit(Node n) throws RepositoryException {
          pages.add(NodeUtil.getNearestAncestorOfType(n, NodeTypes.Page.NAME));
        }
      });
    }

    VersionManager vm = Components.getComponent(VersionManager.class);
    for (Node p : pages) {
      vm.removeVersionHistory(p);
      p.save();
    }
  }

}
