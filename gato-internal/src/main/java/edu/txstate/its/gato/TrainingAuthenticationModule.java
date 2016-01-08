package edu.txstate.its.gato;

import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import info.magnolia.repository.RepositoryConstants;
import info.magnolia.cms.security.Permission;
import info.magnolia.cms.security.Role;
import info.magnolia.cms.security.RoleManager;
import info.magnolia.cms.security.MgnlUserManager;
import info.magnolia.cms.security.UserManager;
import info.magnolia.cms.security.User;
import info.magnolia.cms.security.Security;
import info.magnolia.context.MgnlContext;   
import info.magnolia.context.MgnlContext.VoidOp;
import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.jaas.sp.ldap.ADAuthenticationModule;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.objectfactory.Components;
import javax.jcr.Session;   

import java.io.StringWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;
import java.util.HashMap;
    
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

public class TrainingAuthenticationModule extends ADAuthenticationModule {
    private static final Logger log = LoggerFactory.getLogger(TrainingAuthenticationModule.class);

    private static final String BASE_SITE = "training-site";

    protected void initUser() throws LoginException {
        final String siteName = name + "-" + BASE_SITE;
        final String sourcePath = "/" + BASE_SITE;
        final String sitePath = "/" + siteName;

        MgnlContext.doInSystemContext(new VoidOp() {
            @Override
            public void doExec() {
                try {
                    User user = createUser();
                    String userTitle = user.getProperty("title");
                    log.debug("userTitle: " + userTitle);

                    createSite(siteName, sitePath, sourcePath, userTitle);
                    createDam(siteName, sitePath, sourcePath, userTitle);
                    Role role = createRole(siteName, sitePath, userTitle);
                    updateUserRole(user, siteName);
                } catch (Exception e) {
                    log.error("Failed to create training user!", e);
                }
            }
        });

        super.initUser();
    }

    private User createUser() throws java.io.IOException, java.net.MalformedURLException, javax.jcr.RepositoryException {
        UserManager userManager = Security.getSecuritySupport().getUserManager("admin");
        User user = userManager.getUser ( name );
        if ( user == null ) {
            log.debug( "User doesn't exist. Adding user " + name );

            String fullName = null;
            String email = null;
            try {
                // Call peoplesearch to get the person's real name and email
                URL url = new URL("https://secure.its.txstate.edu/iphone/ldap/query.pl?netid=" + name);
                URLConnection urlConnection = url.openConnection();

                // set up basic auth
                MagnoliaConfigurationProperties mcp = Components.getSingleton(MagnoliaConfigurationProperties.class);
                String authorizedUserPassword = mcp.getProperty("gato.ldapuser") + ":" + mcp.getProperty("gato.ldappassword");
                String encodedAuthorizedUserPassword = new String(Base64.getEncoder().encode(authorizedUserPassword.getBytes()));
                urlConnection.setRequestProperty("Authorization", "Basic " + encodedAuthorizedUserPassword );

                JsonNode userRecord = new ObjectMapper().readTree(urlConnection.getInputStream());

                if (userRecord.get("givenName") != null) {
                    fullName = userRecord.get("givenName").asText();
                }
                if (userRecord.get("sn") !=  null) {
                    if (fullName != null) {
                        fullName += " ";
                    }
                    fullName += userRecord.get("sn").asText();
                }

                if (userRecord.get("mail") != null) {
                    email = userRecord.get("mail").asText();
                }

                log.debug( "Got name: " + fullName );
            } catch (Exception e) {
                log.error("Failed to fetch user info from LDAP!", e);
            }

            user = userManager.createUser( name, "" );
            if (fullName != null) {
                user = userManager.setProperty( user, "title", fullName );
            }
            if (email != null) {
                user = userManager.setProperty( user, "email", email );
            }
            user = userManager.addRole( user, "editor" );
            log.debug( "User created." );
        } else {
            log.debug( "User already exists." );
        }
        return user;
    }

    private void createSite(String siteName, String sitePath, String sourcePath, String userTitle) throws javax.jcr.RepositoryException {
        Session ws = MgnlContext.getJCRSession(RepositoryConstants.WEBSITE);
        if (ws.nodeExists(sitePath)) {
            log.debug("Site already exists: " + siteName);
        } else {
            log.debug("About to copy site from " + sourcePath + " to " + sitePath);
            ws.getWorkspace().copy(sourcePath, sitePath);
            ws.getNode(sitePath).setProperty("title", userTitle + " Training Site");
            ws.save();
            log.debug("Site created: " + siteName);
        }
    }

    private void createDam(String siteName, String sitePath, String sourcePath, String userTitle) throws javax.jcr.RepositoryException {
        Session dam = MgnlContext.getJCRSession(DamConstants.WORKSPACE);
        if (dam.nodeExists(sitePath)) {
            log.debug("DAM already exists: " + siteName);
        } else {
            dam.getWorkspace().copy(sourcePath, sitePath);
            dam.getNode(sitePath).setProperty("title", userTitle + " Training Site");
            dam.save();
            log.debug("DAM created: " + siteName);
        }   
    }

    private Role createRole(String siteName, String sitePath, String userTitle) throws javax.jcr.RepositoryException, Exception {
        RoleManager roleManager = Security.getSecuritySupport().getRoleManager();
        Role role = roleManager.getRole(siteName);
        if (role != null) {
            log.debug("Role already exists: " + siteName);                    
        } else {
            role = roleManager.createRole(siteName);
            // There's no API for setting the title, so we have to go to the JCR
            Session userroles = MgnlContext.getJCRSession(RepositoryConstants.USER_ROLES);
            userroles.getNode(sitePath).setProperty("title", userTitle + " Training Site Editor");
            userroles.save();
            log.debug("Role created: " + siteName);
        }

        long permission = Permission.ALL;
        String pathIncludingSubNodes = sitePath + "/*";
        roleManager.addPermission(role, RepositoryConstants.WEBSITE, sitePath, permission); 
        roleManager.addPermission(role, RepositoryConstants.WEBSITE, pathIncludingSubNodes, permission);
        roleManager.addPermission(role, DamConstants.WORKSPACE, sitePath, permission); 
        roleManager.addPermission(role, DamConstants.WORKSPACE, pathIncludingSubNodes, permission); 

        return role;
    }

    private User updateUserRole(User user, String roleName) {
        UserManager userManager = Security.getSecuritySupport().getUserManager("admin");
        user = userManager.addRole(user, roleName);
        return user;
    }
}
