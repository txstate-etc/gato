
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page">

<jsp:directive.page contentType="text/xml; charset=UTF-8" session="false"/>
<jsp:directive.page import="info.magnolia.importexport.DataTransporter" />
<jsp:directive.page import="info.magnolia.cms.beans.config.ContentRepository" />
<jsp:directive.page import="info.magnolia.context.MgnlContext" />
<jsp:directive.page import="javax.jcr.Session" />
<jsp:directive.page import="org.apache.commons.lang.StringUtils" />
<jsp:directive.page import="java.util.Arrays" />

<jsp:declaration><![CDATA[
	public String fileFromPath (String path, String repo) throws Exception {
		String pathName = StringUtils.replace(path, DataTransporter.SLASH, DataTransporter.DOT);
		pathName = DataTransporter.encodePath(pathName, DataTransporter.DOT, DataTransporter.UTF8);
		if (DataTransporter.DOT.equals(pathName)) {
				// root node
				pathName = StringUtils.EMPTY;
		}
		return repo+pathName+".xml";
	}
]]></jsp:declaration>

<jsp:scriptlet><![CDATA[
	String path = request.getParameter("path");
	if (StringUtils.isEmpty(path)) path = "/";
	if (!StringUtils.startsWith(path, "/")) path = "/"+path;

	String repo = request.getParameter("repo");
	if (StringUtils.isEmpty(repo)) repo = ContentRepository.WEBSITE;

	String[] workspaces = {"config", "dam", "gatoapps", "usergroups", "userroles", "users", "website"};
	if (Arrays.asList(workspaces).contains(repo)) {
		Session hm=MgnlContext.getJCRSession( repo );
		response.setContentType("text/xml");
		response.setHeader("Content-Disposition", "attachment; filename=\""+fileFromPath(path, repo)+"\"");
		hm.exportSystemView(path, response.getOutputStream(), false, false);
	} else {
		out.println("Unknown repo ... export failed!");
		out.flush();
	}
]]></jsp:scriptlet>
</jsp:root>
