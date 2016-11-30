<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
        xmlns:c="urn:jsptld:http://java.sun.com/jsp/jstl/core">

        <jsp:directive.page contentType="text/plain; charset=UTF-8"
                session="false" />

        <jsp:directive.page import="info.magnolia.context.MgnlContext" />
        <jsp:directive.page import="info.magnolia.cms.util.DumperUtil" />
        <jsp:directive.page import="javax.jcr.Session" />
        <jsp:directive.page import="javax.jcr.Node" />
        <jsp:directive.page import="javax.servlet.ServletResponse" />

        <jsp:scriptlet>
        <![CDATA[

        String path = request.getParameter( "path" );
        String uuid = request.getParameter( "uuid" );
        String repositoryName = request.getParameter( "repository" );
        String depth = request.getParameter( "depth" );

        Session ws = MgnlContext.getJCRSession(repositoryName);
        Node node;
        if (uuid != null) {
                node = ws.getNodeByIdentifier(uuid);
        } else {
                node = ws.getNode(path);
        }
	int depthAsInt = Integer.parseInt( depth );

        DumperUtil.dump(node, depthAsInt, response.getWriter());

        ]]>
	</jsp:scriptlet>

</jsp:root>
