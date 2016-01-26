<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:cmsfn="http://magnolia-cms.com/taglib/templating-components/cmsfn"
	xmlns:c="urn:jsptld:http://java.sun.com/jsp/jstl/core"
	xmlns:fmt="http://java.sun.com/jsp/jstl/fmt"
	xmlns:gf="urn:jsptld:gatoutils">
<jsp:directive.page contentType="text/html; charset=utf-8" />
<jsp:scriptlet><![CDATA[
	request.setAttribute("daysofweek", new java.util.HashMap<java.lang.String, java.lang.String>());
]]></jsp:scriptlet>
<c:set target="${daysofweek}" property="1" value="Mo"/>
<c:set target="${daysofweek}" property="2" value="Tu"/>
<c:set target="${daysofweek}" property="3" value="We"/>
<c:set target="${daysofweek}" property="4" value="Th"/>
<c:set target="${daysofweek}" property="5" value="Fr"/>
<c:set target="${daysofweek}" property="6" value="Sa"/>
<c:set target="${daysofweek}" property="7" value="Su"/>
<jsp:useBean id="now" class="java.util.Date"/>

<c:set var="target" value="${cmsfn:asContentMap(cmsfn:contentByIdentifier(content.sign,'website'))}"/>
<fmt:parseDate var="starttime" value="${content.starttime}" pattern="HH:mm"/>
<fmt:parseDate var="endtime" value="${content.endtime}" pattern="HH:mm"/>
<c:set var="schedentryindex" value="${empty schedentryindex ? 0 : schedentryindex+1}" scope="request"/>
<c:set var="oldentry" value="${not empty content.enddt and content.enddt.time lt now}"/>
<div class="schedule-entry schedule-event${schedentryindex}${oldentry ? ' schedule-entry-old' : ''}">
	<div class="target-sign">
		<c:choose>
			<c:when test="${empty target}">
				<span class="warning">Targeted sign has been deleted!</span>
			</c:when>
			<c:when test="${not gf:isDigitalSign(target)}">
				<span class="warning">Targeted page is not a sign!</span>
			</c:when>
			<c:otherwise>
				<!-- onclick="return true;" disables magnolia's script that prevents following links -->
				<a target="_blank" href="${gf:filterUrl(target['@path'])}" onclick="return true;">${gf:title(target)}</a>
			</c:otherwise>
		</c:choose>
	</div>
	<div class="schedule-volume">Volume: ${content.volume}%</div>
	<div class="schedule-dates">
		<c:if test="${not oldentry}">
			<c:if test="${not empty content.startdt}">
				<fmt:formatDate value="${content.startdt.time}" pattern="MMM d, yyyy"/>
			</c:if>
			<c:if test="${empty content.startdt}">
				Now
			</c:if>
			-
		</c:if>
		<c:if test="${not empty content.enddt}">
			<c:if test="${oldentry}">
				Ended
			</c:if>
			<fmt:formatDate value="${content.enddt.time}" pattern="MMM d, yyyy"/>
		</c:if>
		<c:if test="${empty content.enddt}">
			Forever
		</c:if>
	</div>
	<div class="schedule-backlight">Backlight: ${content.backlight}%</div>
	<div class="schedule-days">
		<c:forEach var="wday" items="${gf:propertyValues(content.wdays)}" varStatus="status">
			${daysofweek[wday]}${status.last ? '' : ','}
		</c:forEach>
	</div>
	<div class="schedule-times"><fmt:formatDate type="time" value="${starttime}" pattern="h:mma"/>-<fmt:formatDate type="time" value="${endtime}" pattern="h:mma"/></div>
</div>

</jsp:root>
