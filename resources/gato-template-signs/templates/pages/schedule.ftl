<jsp:root version="1.2" xmlns:jsp="http://java.sun.com/JSP/Page"
  xmlns:cms="http://magnolia-cms.com/taglib/templating-components/cms"
	xmlns:cmsfn="http://magnolia-cms.com/taglib/templating-components/cmsfn"
  xmlns:c="urn:jsptld:http://java.sun.com/jsp/jstl/core"
	xmlns:fmt="http://java.sun.com/jsp/jstl/fmt"
	xmlns:gf="urn:jsptld:gatoutils">
<jsp:directive.page contentType="text/html; charset=UTF-8" session="false" />
<c:import url="/templates/gato/includes/init.jsp"/>
<c:set var="currentrule" value="${gf:getRuleForSchedule(content)}"/>
<c:set var="target" value="${empty currentrule ? '' : cmsfn:asContentMap(cmsfn:contentByIdentifier(currentrule.sign,'website'))}"/>

<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
<c:choose>
	<c:when test="${cmsfn:isEditMode()}">
		<head>
			<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
			<cms:init />
			<c:import url="/templates/gato/includes/title.jsp">
				<c:param name="escapetitle" value="${true}"/>
			</c:import>
			<script src="${assetsUrl}/js-concatenator.jsp?path=common/js/jquery2.js,signs/js/moment.min.js,signs/js/fullcalendar.js,signs/js/schedule.js" type="text/javascript"><jsp:text /></script>
			<link type="text/css" rel="stylesheet" href="${assetsUrl}/css_concatenator.jsp?path=signs/css/schedule.css" />
			<script type="text/javascript"><c:import url="/templates/gato/signs/schedule-events.jsp"/></script>
		</head>

		<body class="admin">
			<div class="schedule-entries">
				<cms:area name="schedule-entries"/>
			</div>
			<div class="schedule-calendar"><jsp:text/></div>
		</body>
	</c:when>
	<c:when test="${empty currentrule or not gf:isDigitalSign(target)}">
		<head>
			<c:import url="../main-2009/includes/head-common.jsp">
				<c:param name="escapetitle" value="${true}" />
				<c:param name="csspath" value="signs/css/meta.css" />
				<c:param name="jspath" value="signs/js/slides.js,common/js/modal.js,common/js/customjs-modal.js,common/js/swfobject/swfobject.js,paragraphs/js/streaming.js" />
			</c:import>
			<script type="text/javascript">
				digital_signage.lastmodurl = "${gf:filterUrl(cmsfn:page(content)['@path'])}.lmod";
				digital_signage.lastmodsignature = "signoff";
			</script>
		</head>
		<body class="public">
			<div class="sign-frame" style="width: 1920px; height: 1080px;"><jsp:text/></div>
		</body>
	</c:when>
	<c:otherwise>
		<head>
			<c:import url="../main-2009/includes/head-common.jsp">
				<c:param name="escapetitle" value="${true}" />
				<c:param name="csspath" value="signs/css/meta.css" />
				<c:param name="jspath" value="signs/js/slides.js,common/js/modal.js,common/js/customjs-modal.js,common/js/swfobject/swfobject.js,paragraphs/js/streaming.js" />
			</c:import>
			<script type="text/javascript">
				digital_signage.lastmodurl = "${gf:filterUrl(cmsfn:page(content)['@path'])}.lmod";
				digital_signage.lastmodsignature = "${currentrule.sign}${cmsfn:metaData(target, 'lastmodified')}";
			</script>
		</head>

		<body class="public">
			<c:set var="signstyles" scope="request" value=""/>
			<c:if test="${not empty target.styles}">
				<c:forEach items="${gf:propertyValues(target.styles)}" var="style">
					<c:set var="signstyles" scope="request" value="${signstyles}${empty signstyles ? '' : ','}${style}"/>
				</c:forEach>
			</c:if>
			<c:set var="signstyles" value="${empty signstyles ? 'fade,slide' : signstyles}" scope="request"/>
			<c:set var="sign_aspect_ratio" value="${target.ar}" scope="request"/>
			<div class="sign-frame" style="width: 1920px; height: ${sign_aspect_ratio gt 0.0 ? 1920/sign_aspect_ratio : 1080}px;">
				<c:forEach items="${cmsfn:children(target.contentParagraph, 'mgnl:component')}" var="component">
					<cms:component content="${component}"/>
				</c:forEach>
			</div>
		</body>
	</c:otherwise>
</c:choose>
</html>
</jsp:root>
