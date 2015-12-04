package edu.txstate.its.gato;

import info.magnolia.cms.core.Content;
import info.magnolia.cms.util.ContentUtil;
import info.magnolia.context.Context;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.activation.commands.ActivationCommand;

import javax.jcr.Node;
import javax.jcr.InvalidItemStateException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClusterableActivationCommand extends ActivationCommand {
  private static final Logger log = LoggerFactory.getLogger(ClusterableActivationCommand.class);
	@Override
	public boolean execute(Context ctx) throws Exception {
	  Node node = getJCRNode(ctx);
		if (!node.hasProperty("gato_activated_on_creation")) {
		  try {
		    PropertyUtil.setProperty(node, "gato_activated_on_creation", Boolean.TRUE);
		    node.getSession().save();

        // now that I know I'm the one doing the work, I need to make sure all
        // ancestors are activated to be 100% sure this activation takes
        for (int i = 1; i < node.getDepth(); i++) {
          Content c = ContentUtil.asContent((Node)node.getAncestor(i));
          try {
            getSyndicator().activate(c.getParent().getHandle(), c, getOrderingInfo(c));
          } catch (Exception e) {
            log.error("aborting activation command, unable to automatically activate ancestor at path "+c.getHandle());
            e.printStackTrace();
            return false;
          }
        }

        return super.execute(ctx);
		  } catch (InvalidItemStateException e) {
		    // another instance in the cluster beat us to it, we're cool with that
		  }
		}
		return true;
	}
}
