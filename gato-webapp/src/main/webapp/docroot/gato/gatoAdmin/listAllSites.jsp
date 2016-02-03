<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:c="urn:jsptld:http://java.sun.com/jsp/jstl/core">

	<jsp:directive.page contentType="text/html; charset=UTF-8"
		session="false" />
	<jsp:output doctype-root-element="html"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />

	<html>
	<head>
	<title>List Sites</title>
	</head>
	<body>
	
	
	<jsp:directive.page import="java.util.Iterator" />
	<jsp:directive.page import="java.lang.String" />
	<jsp:directive.page import="java.lang.StringBuffer" />
	
	<jsp:directive.page import="info.magnolia.cms.core.Content" />
	<jsp:directive.page
		import="info.magnolia.cms.beans.config.ContentRepository" />
	<jsp:directive.page import="info.magnolia.cms.core.HierarchyManager" />
	<jsp:directive.page import="info.magnolia.context.MgnlContext" />
	<jsp:directive.page import="info.magnolia.cms.core.ItemType" />
	<jsp:directive.page import="javax.jcr.PathNotFoundException" />
	
	<jsp:declaration>
		<![CDATA[
		StringBuffer htmlBody = new StringBuffer();
	
	   	public void processSites( Content c, HttpServletResponse response){
		   try {
		        int counter = 0;
		        Iterator sites = c.getChildren(ItemType.CONTENT).iterator();
		        htmlBody.append("There are <span style=\"color:#FF8C1A;font-weight:bold;\"> total " + c.getChildren(ItemType.CONTENT).size() + " sites </span> in Gato.");
             	while (sites.hasNext()) {
                	 Content site = (Content) sites.next();
                 	 try {
                         String siteName = site.getName();
                         String siteTitle = site.getTitle();
                         //alternative background 
                         if ( counter%2== 0 ) 
 						    htmlBody.append("<tr style=\"background:#FFFFE5 \">");
 						 else 
 						    htmlBody.append("<tr style=\"background:#CCCCFF \">");
 						 
 						 htmlBody.append("<td width=40%>"+siteName+"</td>");
						 htmlBody.append("<td width=60%>"+siteTitle+"</td></tr>");
                         counter++;
                     } 
                     catch (Exception re) {
                         System.out.println("Failed to get site name/title" + site.getName());
                     }
               }
               
               c.save();
               response.flushBuffer();
               System.out.println("Successfully parse site repository");
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
		
		htmlBody.append("<h1>Sites List with SiteName and SiteTitle </h1>" );	
 		htmlBody.append("<table style=\"margin-left:auto;margin-right:auto;width:80%\"><tr><th width=\"40%\">SiteName</th><th width=\"60%\">SiteTitle</th></tr>" );	
        //get roles
        HierarchyManager hm = MgnlContext.getSystemContext().getHierarchyManager(ContentRepository.WEBSITE);
		Content rootNode = hm.getContent("/");
        processSites( rootNode, response);
        htmlBody.append("</table>" );
        out.print(htmlBody);	

		]]>
	</jsp:scriptlet>
	</body>
	</html>

</jsp:root>
