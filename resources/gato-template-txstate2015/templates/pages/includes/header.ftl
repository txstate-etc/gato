[#assign homePageContent = cmsfn.contentByPath(homepage)]
[#assign homeLink = cmsfn.link(homepage)]

[#--check if the page has a header image--]
[#assign hasHeaderImage = false]
[#list cmsfn.children(gf.getOrCreateArea(page, 'headerImage')) as component]
	[#if component.image??]
		[#assign hasHeaderImage = true]
	[/#if]
[/#list]

[#if hasHeaderImage]
	[#if isHomePage ] 
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
	[@cms.area name="headerImage" /]
	<div class="title">
    <div class="header_bg"></div>
    <div class="dept_name">
        [@cms.area name="parentOrganization" content=gf.getOrCreateArea(homepage, 'parentOrganization') editable=isHomePage  /]
        <h1 class="office_name"><a href="${homeLink}">${gf.nodeTitle(homePageContent)}</a></h1>
    </div>
</div>




	
</div>

