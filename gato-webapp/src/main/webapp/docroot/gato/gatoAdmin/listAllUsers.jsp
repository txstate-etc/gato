<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:c="urn:jsptld:http://java.sun.com/jsp/jstl/core">

	<jsp:directive.page contentType="text/html; charset=UTF-8"
		session="false" />
	<jsp:output doctype-root-element="html"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />

	<html>
	<head>
	
	<title>List Users and Roles Groups assigned</title>
	<style type="text/css">
		div.itemName { background-color: #AFCAAF; margin-top: 10px; padding: 3px; font-weight: bold; }
		a { text-decoration:none; }
		a:hover { text-decoration:underline; }
	</style>
	<script type="text/javascript" src="/.resources/gato-lib/js/prototype.js">
	<jsp:text />
    </script>  
 	<script src="/.resources/gato-lib/js/scriptaculous/scriptaculous.js"
		type="text/javascript">
	<jsp:text />
	</script>
	<script type="text/javascript" src="expandCollapse.js">
	<jsp:text />
    </script>  
	
	</head>
	<body>
	
	<jsp:directive.page import="info.magnolia.cms.security.GroupManager" />
	<jsp:directive.page import="info.magnolia.cms.security.Group" />	
	<jsp:directive.page import="info.magnolia.cms.security.MgnlUserManager" />
	<jsp:directive.page import="info.magnolia.cms.security.UserManager" />
	<jsp:directive.page import="info.magnolia.cms.security.User" />
	<jsp:directive.page import="info.magnolia.cms.security.Role" />
	<jsp:directive.page import="info.magnolia.cms.security.Security" />
	
	<jsp:directive.page import="java.util.Iterator" />
	<jsp:directive.page import="java.lang.String" />
	<jsp:directive.page import="java.lang.StringBuffer" />
	
	<jsp:declaration>
		<![CDATA[
		StringBuffer htmlBody = new StringBuffer();
	    int userCount = 0;

		public void processUser( User user, HttpServletResponse response ) throws Exception {
            
            int subCount = 0;
            String userName = user.getName();
			Iterator roles = user.getRoles().iterator();

            // get roles that directly assigned to each user
 		    htmlBody.append("<li><div class=\"itemName\"><a name=\"this\" href=\"#this\">" +  userName + "</a></div><div style=\"display: none;\" class=\"detail\"><ul> <li>Roles: <ul>");
 		    
			while ( roles.hasNext() ) {
			    subCount++;
				String roleName = (String)roles.next();
				htmlBody.append("<li><span style=\"color:green\">Role name:</span>  "+ roleName + "</li>");	
			}
			htmlBody.append("</ul></li>");
            //roles assinged through groups
            
            Iterator groups = user.getGroups().iterator();
            boolean flagHasGroups = false; 
            if (groups.hasNext()){
               flagHasGroups = true;
               htmlBody.append("<li> Groups: <ul>");
            }
            
            while ( groups.hasNext() ) {
               String groupName = (String)groups.next();
               htmlBody.append("<li>" + groupName + "<ul>");
               GroupManager groupManager = Security.getGroupManager();
               Group group = groupManager.getGroup(groupName);
               Iterator rolesGroup = group.getRoles().iterator();
 
               while (rolesGroup.hasNext()){
                     Iterator rolesCompare = user.getRoles().iterator();
                     String roleNameAssignedToGroup = (String)rolesGroup.next();
                     htmlBody.append("<li> <span style=\"color:green\">Role name:</span>  "+ roleNameAssignedToGroup + "</li>");
                     boolean flagRepeated = false;
                     while (rolesCompare.hasNext()){
                            String roleNameAssignedToUser = (String)rolesCompare.next();
                            if(roleNameAssignedToGroup.equals(roleNameAssignedToUser)) {
                                         flagRepeated = true;        
                                         break; 
                             }
                     }             
                     if( !flagRepeated )
                         subCount++;
               }   
               htmlBody.append("</ul></li>");
           }

           if (flagHasGroups)
               htmlBody.append("</ul></li>");
               
           htmlBody.append("</ul></div></li> User <B><I>" + userName + "</B></I> has <span style=\"color:green\">" + subCount + "</span> roles assigned. ");
		}
	   
		]]>
	</jsp:declaration>

	<jsp:scriptlet>
		<![CDATA[
		htmlBody.setLength(0);
		htmlBody.append("Back to <a href=\"../gatoAdmin.html\">Gato Admin Info page.</a>");
		htmlBody.append("<h1>User List with Roles/Groups Assigned to </h1>" );	
	    htmlBody.append("Repeated roles assigned through groups won't be counted.<br>" );	
		
		//get users
		UserManager userManager = Security.getSecuritySupport().getUserManager("admin");

		Iterator users = userManager.getAllUsers().iterator();
		userCount = userManager.getAllUsers().size();
        htmlBody.append("<div><a id=\"expandAll\" href=\"#\"> Expand</a> | <a id=\"collapseAll\" href=\"#\">Collapse</a> </div>");
		htmlBody.append("There are <span style=\"color:#006635;font-weight:bold\">total " + userCount + " users </span>in Gato.");
		htmlBody.append("<ul>");
		while ( users.hasNext() ) {
		    User user = (User)users.next();
			processUser( user, response );
		}
		htmlBody.append("</ul>");
		out.print(htmlBody);

		]]>
	</jsp:scriptlet>
	</body>
	</html>

</jsp:root>
