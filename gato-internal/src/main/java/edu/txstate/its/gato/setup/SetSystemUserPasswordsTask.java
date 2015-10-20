package edu.txstate.its.gato.setup;

import info.magnolia.module.InstallContext;

import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;
import info.magnolia.module.delta.TaskExecutionException;

import info.magnolia.cms.security.SecuritySupport;
import info.magnolia.cms.security.Realm;
import info.magnolia.cms.security.UserManager;
import info.magnolia.cms.security.User;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.objectfactory.Components;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

/**
 *
 * Task to upgrade certain configuration variables to be compatible with Magnolia 4.5
 *
 * @author Nick Wing
 * @version $Revision: $ ($Author: $)
 */
public class SetSystemUserPasswordsTask extends info.magnolia.module.delta.AbstractRepositoryTask {

	public SetSystemUserPasswordsTask(String name, String description) {
		super(name, description);
	}

	protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    UserManager userManager = SecuritySupport.Factory.getInstance().getUserManager(Realm.REALM_SYSTEM.getName());

		MagnoliaConfigurationProperties mcp = Components.getSingleton(MagnoliaConfigurationProperties.class);
		List<String> users = Arrays.asList("superuser", "its-cms-backup", "its-cms-testperms5");
		Iterator u = users.iterator();
		while (u.hasNext()) {
			User user = userManager.getUser((String)u.next());
		  String pwprop = "users.system."+user.getName()+".password";
		  if (mcp.hasProperty(pwprop))
  			userManager.changePassword(user, mcp.getProperty(pwprop));
  		else
  			userManager.changePassword(user, UUID.randomUUID().toString());
		}
	}
}
