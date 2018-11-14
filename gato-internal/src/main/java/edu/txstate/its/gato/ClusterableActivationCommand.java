package edu.txstate.its.gato;

import info.magnolia.cms.core.version.VersionManager;
import info.magnolia.context.Context;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.objectfactory.Components;
import info.magnolia.publishing.command.PublicationCommand;
import info.magnolia.publishing.operation.SendOperation;
import info.magnolia.publishing.sender.Sender;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.jcr.Node;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClusterableActivationCommand extends PublicationCommand {
  private static final Logger log= LoggerFactory.getLogger(ClusterableActivationCommand.class);

  public ClusterableActivationCommand(VersionManager vm, ComponentProvider cp) {
    super(vm, cp);
  }

  @Override
  public boolean execute(Context ctx) throws Exception {
    MagnoliaConfigurationProperties mcp = Components.getSingleton(MagnoliaConfigurationProperties.class);
    if (!("true".equals(mcp.getProperty("gato.skipscheduler")))) {
      Sender sender = getComponentProvider().newInstance(Sender.class, ctx, getComponentProvider());
      Node toPublish = getJCRNode(ctx);
      for (int i = 1; i <= toPublish.getDepth(); i++) {
        List<Node> ancestor = new ArrayList<>();
        Node a = (Node) toPublish.getAncestor(i);
        ancestor.add(a);
        List<SendOperation.OperationResult> results = sender.publish(ancestor, getRule());
        List<SendOperation.OperationResult> errors = results.stream().filter(result -> !result.isSuccess()).collect(Collectors.toList());
        if (!errors.isEmpty()) {
          log.error("aborting activation command, unable to automatically activate ancestor at path " + a.getPath());
          return false;
        }
      }
    }
    else {
      log.debug("Execute called, but skipscheduler is true. Doing nothing.");
      return true;
    }
    return true;
  }
}
