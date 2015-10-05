<div class="side_nav">
	[#-- TODO: handle the case where there isn't a title --]
	[#-- TODO: Michael is finding out if they need to collapse --]
	[#if content.title?has_content]
		<h3 class="side_nav_header">${content.title}</h3>
	[/#if]
	<ul class="side_nav_list">
		[#-- loop through all the components and display them --]
		[#assign pageContent = cmsfn.page(content) /]
		[#if content.type == 'auto']
			[#list cmsfn.children(pageContent, "mgnl:page") as subpage]
				[#if !(subpage.hideInNav!false)]
					<li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a>
				[/#if]
			[/#list]
		[#else]
			[@cms.area name="links"/]
		[/#if]
	</ul>
</div>
