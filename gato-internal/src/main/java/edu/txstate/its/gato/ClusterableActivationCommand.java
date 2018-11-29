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

  protected final ComponentProvider cp;
  public ClusterableActivationCommand(VersionManager vm, ComponentProvider cp) {
    super(vm, cp);
    this.cp = cp;
  }

  @Override
  public boolean execute(Context ctx) throws Exception {
    MagnoliaConfigurationProperties mcp = Components.getSingleton(MagnoliaConfigurationProperties.class);
    if (!("true".equals(mcp.getProperty("gato.skipscheduler")))) {
      Sender sender = getComponentProvider().newInstance(Sender.class, ctx, this.cp);
      Node toPublish = getJCRNode(ctx);
      List<Node> publishList = new ArrayList<Node>();
      for (int i = 1; i <= toPublish.getDepth(); i++) {
        Node a = (Node) toPublish.getAncestor(i);
        publishList.add(a);
      }
      publishList.add(toPublish);

      List<SendOperation.OperationResult> results = sender.publish(publishList, getRule());
      List<SendOperation.OperationResult> errors = results.stream().filter(result -> !result.isSuccess()).collect(Collectors.toList());
      if (!errors.isEmpty()) {
        errors.forEach(result -> {
          log.error("Receiver: {}, error: {}", result.getReceiverName(), result.getException().getMessage(), result.getException());
        });
        return false;
      }
    }
    else {
      log.debug("Execute called, but skipscheduler is true. Doing nothing.");
      return true;
    }
    return true;
  }
}
