<!-- let's see if we should be displaying a banner -->
<c:set var="showBannerVal" value="${content['gato-banner-settings'].visible}" />
<c:set var="animateBanner" value="${content['gato-banner-settings'].animate}" scope="request" />
<c:set var="animateBannerInterval" value="${content['gato-banner-settings'].interval}" scope="request" />

<c:forEach items="${ancestors}" var="ancestor" >
	<c:if test="${showBannerVal=='inherit' or empty showBannerVal}">
		<c:set var="showBannerVal" value="${ancestor['gato-banner-settings'].visible}" />
	</c:if>
	<c:if test="${animateBanner=='inherit' or empty animateBanner}">
		<c:set var="animateBanner" value="${ancestor['gato-banner-settings'].animate}" scope="request" />
		<c:set var="animateBannerInterval" value="${ancestor['gato-banner-settings'].interval}" scope="request" />
	</c:if>
</c:forEach>

<c:set var="showBannerArea" value="${true}" scope="request"/>
<c:if test="${showBannerVal!='shown'}">
	<c:set var="showBannerArea" value="${false}" scope="request"/>
</c:if>

<c:if test="${animateBanner=='inherit' or empty animateBanner}">
	<c:set var="animateBanner" value="static" scope="request"/>
</c:if>

<div class="gato-banner-settings">
	[@cms.area name="gato-banner-settings" /]
</div>
