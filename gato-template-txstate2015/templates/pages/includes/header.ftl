[#assign homePageContent = ctx.getAttribute("homePageContent")]
[#assign homeLink = cmsfn.link(homePageContent)]
[#assign paramEditable = true]
[#if homePageContent.header_image??]
	[#if cmsfn.link(content) == homeLink ]
		[#-- primary page with header image--]
		[#assign headerClass = "header_with_image"]
	[#else]
		[#-- secondary page with header image--]
		[#assign headerClass = "header_with_image_secondary"]
		[#assign paramEditable = false]
	[/#if]
[#else]
	[#--  page with no header image--]
	[#assign headerClass = "header_no_image"]
	[#if cmsfn.link(content) != homeLink ]
		[#assign paramEditable = false]
	[/#if]
[/#if]


<div class="${headerClass}">
	[@cms.area name="headerImage" editable=paramEditable /]
	[@cms.area name="parentOrganization" editable=paramEditable /]
</div>

