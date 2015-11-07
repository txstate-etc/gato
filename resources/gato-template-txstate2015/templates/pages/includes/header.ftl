[@bannerSettings content=content areaname='headerImage'/]
[#if showBannerArea]
	[#if isHomePage ]
		[#-- primary page with header image--]
		[#assign headerClass = "header_with_image"]
	[#else]
		[#-- secondary page with header image--]
		[#assign headerClass = "header_with_image_secondary"]
	[/#if]
[#else]
	[#--  page with no header image--]
	[#assign headerClass = "header_no_image"]
[/#if]

<div class="${headerClass}">
	[@cms.area name="headerImage" /]
	<div class="title">
    <div class="header_bg"></div>
    <div class="dept_name">
        [@cms.area name="parentOrganization" content=gf.getOrCreateArea(homepage, 'parentOrganization') editable=isHomePage  /]
        <h1 class="office_name"><a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a></h1>
    </div>
  </div>
</div>
