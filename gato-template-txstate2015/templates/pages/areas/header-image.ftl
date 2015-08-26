[#include "/gato-template/templates/includes/head.ftl"]
[#assign homePageContent = cmsfn.contentByPath(homepage)]
[#assign homeLink = cmsfn.link(homepage)]

[#assign imgStyle = ""]
[#assign imgClass = "bg_image_none"]
[#if homePageContent.header_image??]
	[#assign headerImg = damfn.getAsset("jcr", homePageContent.header_image)!]
	[#assign imgStyle = "style=\"background-image: url('${headerImg.getLink()}');\""]

	[#if cmsfn.link(content) == homeLink ]
		[#-- primary page with header image--]
		[#assign imgClass = "bg_image"]
	[#else]
		[#-- secondary page with header image--] 
		[#assign imgClass = "bg_image_secondary"]
	[/#if]
[/#if]

<div class="bg_container">
		
	<div class="${imgClass}" id="headerImage" ${imgStyle}></div>

	<div class="overlay">
 
		<div class="bg_overlay"></div>
	 
	</div>
		
</div>