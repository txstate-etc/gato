<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:c="urn:jsptld:http://java.sun.com/jsp/jstl/core">

	<jsp:directive.page contentType="text/html; charset=UTF-8"
		session="false" />
	<jsp:output doctype-root-element="html"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />

	<jsp:directive.page import="info.magnolia.cms.security.GroupManager" />
	<jsp:directive.page import="info.magnolia.cms.security.Group" />	
	<jsp:directive.page import="info.magnolia.cms.security.MgnlUserManager" />
	<jsp:directive.page import="info.magnolia.cms.security.UserManager" />
	<jsp:directive.page import="info.magnolia.cms.security.User" />
	<jsp:directive.page import="info.magnolia.cms.security.Role" />
	<jsp:directive.page import="info.magnolia.cms.security.Security" />
	
	<jsp:directive.page import="java.util.Iterator" />
	<jsp:directive.page import="java.util.TreeSet" />
	<jsp:directive.page import="java.util.TreeMap" />
	<jsp:directive.page import="java.lang.String" />
	<jsp:directive.page import="java.lang.StringBuffer" />
	
	<jsp:directive.page import="info.magnolia.cms.core.Content" />
	<jsp:directive.page
		import="info.magnolia.cms.beans.config.ContentRepository" />
	<jsp:directive.page import="info.magnolia.cms.core.HierarchyManager" />
	<jsp:directive.page import="info.magnolia.context.MgnlContext" />
	<jsp:directive.page import="info.magnolia.cms.core.NodeData" />
	<jsp:directive.page import="info.magnolia.cms.core.ItemType" />
	<jsp:directive.page import="javax.jcr.PathNotFoundException" />
	<jsp:directive.page import="javax.jcr.RepositoryException" />
	
	<html>
	<head>
	
	<title>List Roles and Users</title>
	<style type="text/css">
		div.itemName { background-color: #cccccc; margin-top: 10px; padding: 3px; font-weight: bold; }
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
	
	<jsp:declaration>
		<![CDATA[
		
		StringBuffer htmlBody = new StringBuffer();
	
	    public void dataStore( TreeMap results, String key, String value) throws Exception {
	    
	    	if ( results.containsKey( key ) ) {
					TreeSet valueSets = (TreeSet)results.get( key );
					valueSets.add( value );
				}
		    else {
					TreeSet valueSets = new TreeSet();
					valueSets.add( value );
					results.put( key, valueSets ); 
				} 
        }

		public void processUser( User user, TreeMap results ) throws Exception {

            String userName = user.getName();
			Iterator roles = user.getRoles().iterator();
             // get roles that directly assigned to each user
			while ( roles.hasNext() ) {
				String roleName = (String)roles.next();
	            dataStore(results, roleName, userName);
			}
            //users assinged roles indirectly through groups
            Iterator groups = user.getGroups().iterator();
            while ( groups.hasNext() ) {
               String groupName = (String)groups.next();
               
               GroupManager groupManager = Security.getGroupManager();
               Group group = groupManager.getGroup(groupName);
               Iterator rolesGroup = group.getRoles().iterator();
               while (rolesGroup.hasNext()){
                    String roleNameAssignedToGroup = (String)rolesGroup.next();
                    //only push roles not directly signed to user to results
                     boolean flagRepeated = false;
                     while (roles.hasNext()){
                            String roleNameAssignedToUser = (String)roles.next();
                            if(roleNameAssignedToGroup.equals(roleNameAssignedToUser)) {
                             //role double assigned to user directly and also indirectly through group
                                         flagRepeated = true;        
                                         break; 
                             }
                     }                          
                     if (!flagRepeated) //roles only directly assigned to user
                         //put into list of users for this role map
                         dataStore(results, roleNameAssignedToGroup, userName);
               }   
           }
		}
		
		public void processGroup( Group group, TreeMap results) throws Exception {
			Iterator roles = group.getRoles().iterator();
             // get roles that directly assigned to each user
			 while ( roles.hasNext() ) {
				String roleName = (String)roles.next();
                String groupName = (String)group.getName();
	            dataStore(results, roleName, groupName);
			}
	    }   

	    public void printResults( TreeMap results, HttpServletResponse response, String itemType, String roleName ) throws Exception {

              if ((TreeSet)results.get( roleName) != null) {
				 TreeSet roleAssignees = (TreeSet)results.get( roleName );
				 Iterator assignees = roleAssignees.iterator();

                 htmlBody.append("<li>" + itemType + "s:<ul>");
				 int subCounter = 0;
				 while ( assignees.hasNext() ) {
				    subCounter++;
					String assignee = (String)assignees.next();
					htmlBody.append("<li class=\"assignee\">" + assignee + "</li>" );
				 }
				 htmlBody.append("</ul></li>");
				 if(subCounter == 1)
				    htmlBody.append("Role <B><I>"+ roleName + "</I></B>:<span style=\"color:blue\"> " + subCounter + " " + itemType + " </span> assigned.</br>" );					
                 else
                 	htmlBody.append("Role <B><I>"+ roleName + "</I></B>:<span style=\"color:blue\"> " + subCounter + " " + itemType +"s </span> assigned.</br>" );
              }
		}
	

	   	public void processRoles( Content c, HttpServletResponse response,TreeMap resultsUsers,TreeMap resultsGroups )  {	
		   try {
		        int counter = 0;
		        Iterator roles = c.getChildren(ItemType.ROLE).iterator();
		        counter = c.getChildren(ItemType.ROLE).size();
		        htmlBody.append("There are <span style=\"color:blue;font-weight:bold\">total " + counter + " roles</span> in Gato.");
         		htmlBody.append("<ul>");
             	while (roles.hasNext()) {
                	 Content role = (Content) roles.next();
                 	 try {
                         String roleName = role.getName();
 				         htmlBody.append("<li><div class=\"itemName\"><a name=\"this\" href=\"#this\">" +  roleName + "</a></div><div style=\"display: none;\" class=\"detail\"><ul>");
 				         printResults( resultsUsers, response, "User", roleName );
 				         printResults( resultsGroups, response, "Group", roleName );
 				         htmlBody.append("</ul></div></li>");
                         TreeSet users = (TreeSet) resultsUsers.get(roleName);
                         htmlBody.append("Role <B><I>" + roleName + "</B></I> has <span style=\"color:blue\">" + users.size() + " users</span> assigned.");
                     } 
                     catch (Exception re) {
                         System.out.println("Failed to get role name " + role.getName());
                     }
               }
               htmlBody.append("</ul>");
               c.save();

               response.flushBuffer();
               System.out.println("Successfully parse role repository");
           } 
           catch (PathNotFoundException pe) {
               pe.printStackTrace();
           }  
           catch (Throwable t) {
               t.printStackTrace();
           }

		}
	   
		]]>
	</jsp:declaration>

	<jsp:scriptlet>
		<![CDATA[
		
		htmlBody.setLength(0);
		htmlBody.append("Back to <a href=\"../gatoAdmin.html\">Gato Admin Info page.</a>");
		
		//get groups
		GroupManager groupManager = Security.getGroupManager();
		TreeMap resultsGroups = new TreeMap();

		Iterator groups = groupManager.getAllGroups().iterator();
		while ( groups.hasNext() ) {
			Group group = (Group)groups.next();
			processGroup( group, resultsGroups );
		}		
		
		//get users
		UserManager userManager = Security.getSecuritySupport().getUserManager("admin");
		TreeMap resultsUsers = new TreeMap();

		Iterator users = userManager.getAllUsers().iterator();
		while ( users.hasNext() ) {
			User user = (User)users.next();
			processUser( user, resultsUsers );
		}
			
		htmlBody.append("<h1>Roles List with Users/Groups Assigned to </h1>" );	
		htmlBody.append("<div><a id=\"expandAll\" href=\"#\"> Expand</a> | <a id=\"collapseAll\" href=\"#\">Collapse</a> </div>");
        //get roles
        HierarchyManager hm = MgnlContext.getSystemContext().getHierarchyManager(ContentRepository.USER_ROLES);
		Content rootNode = hm.getContent("/");
        processRoles( rootNode, response,resultsUsers,resultsGroups);
        out.print(htmlBody);
		]]>
	</jsp:scriptlet>
	</body>
	</html>

</jsp:root>
