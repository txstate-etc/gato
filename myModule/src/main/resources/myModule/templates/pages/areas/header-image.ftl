[#assign homeLink = cmsfn.link(ctx.getAttribute("homePageContent"))]
[#assign imgStyle = ""]
[#assign imgClass = "bg_image_none"]
[#if content.header_image??]
	[#assign headerImg = damfn.getAsset("jcr", content.header_image)!]
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