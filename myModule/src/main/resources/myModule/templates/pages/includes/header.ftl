<!--
   * Primary page with header image :  header_3 
   * Primary page without header image header_4 
   * Secondary page with header image  header_2 
   * Secondary page without header image  need to define

   editable: image, parent organization, Department or office name (title)

   parent organization is collegeLink -> name  There is also a url for the parent organization.

   Is parent organization required now?
-->


[#assign homeLink = cmsfn.link(ctx.getAttribute("homePageContent"))]
[#if content.header_image??]
	[#assign headerImg = damfn.getAsset("jcr", content.header_image)!]
	[#assign imgStyle = "style=\"background-image: url('${headerImg.getLink()}');\""]
	[#if cmsfn.link(content) == homeLink ]
		[#-- primary page with header image--]
		[#assign headerClass = "header_with_image"]
		[#assign imgClass = "bg_image"]
	[#else]
		[#-- secondary page with header image--]
		[#assign headerClass = "header_with_image_secondary"]
		[#assign imgClass = "bg_image_secondary"]
	[/#if]
[#else]
	[#--  page with no header image--]
	[#assign headerClass = "header_no_image"]
	[#assign imgStyle = ""]
	[#assign imgClass = "bg_image_none"]
[/#if]


<div class="${headerClass}">

	<div class="bg_container">

		<div class="${imgClass}" id="headerImage" ${imgStyle}></div>
		
		<div class="overlay">
		 
			<div class="bg_overlay"></div>
			
		</div>
		
	</div>

	<div class="title">
	
		<div class="header_bg"></div>
		<div class="dept_name">
			[@cms.area name="parentOrganization"/]
			<h1><a href="${cmsfn.link(ctx.getAttribute('homePageContent'))}">${ctx.getAttribute('homePageContent').title}</a></h1>
		</div>
		
	</div>
	
</div>

