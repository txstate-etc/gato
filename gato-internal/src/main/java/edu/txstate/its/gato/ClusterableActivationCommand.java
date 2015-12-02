package edu.txstate.its.gato;

import info.magnolia.context.Context;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.activation.commands.ActivationCommand;

import javax.jcr.Node;
import javax.jcr.InvalidItemStateException;

public class ClusterableActivationCommand extends ActivationCommand {
	@Override
	public boolean execute(Context ctx) throws Exception {
	  Node node = getJCRNode(ctx);
		if (!node.hasProperty("gato_activated_on_creation")) {
		  try {
		    PropertyUtil.setProperty(node, "gato_activated_on_creation", Boolean.TRUE);
		    node.getSession().save();
        return super.execute(ctx);
		  } catch (InvalidItemStateException e) {
		    // another instance in the cluster beat us to it, we're cool with that
		  }
		}
		return true;
	}
}
