<div class="side_nav ${content.title?has_content?string('nav-with-title','nav-without-title')}">
  [#if cmsfn.isEditMode() && ctx.inheritedfrom?has_content]
    <div class="inheritedalert">Inherited from ${gf.nodeTitle(ctx.inheritedfrom)}</div>
  [/#if]
	[#if content.title?has_content]
		<h3 class="side_nav_header">${content.title}</h3>
	[/#if]
	<ul class="side_nav_list">
		[#-- loop through all the components and display them --]
		[#assign pageContent = cmsfn.page(content) /]
		[#if content.type?contains('auto')]
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
