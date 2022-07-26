[#macro breadcrumbs hidetxstate isMobile]
[#assign mobileBreadcrumbs = isMobile?string('mobile_breadcrumbs', '')]
<p class="breadcrumbs ${mobileBreadcrumbs}">
	[#if !hidetxstate]
		<a href="https://www.txst.edu">Texas State</a>
	[/#if]
	[#-- need to check for missing parent org here --]
	[#assign parentUrl = (ctx.getAttribute('homePageContent').parentOrganization.url)!]
	[#if parentUrl?length gt 0]
		<span class="separator">
			<i class="fa fa-angle-right"></i>
		</span>
		[#-- is it possible for them to set the parent org. url but not the name? --]
		<a href="${parentUrl}">${ctx.getAttribute('homePageContent').parentOrganization.parent_name!"Parent Organization"}</a>
	[/#if]
	[#list cmsfn.ancestors(content, "mgnl:page") as ancestor ]
		<span class="separator">
			<i class="fa fa-angle-right"></i>
		</span>
		<a href="${cmsfn.link(ancestor)}">${ancestor.title!}</a>
	[/#list]
	<span class="separator">
		<i class="fa fa-angle-right"></i>
	</span>
	${content.title}
</p>
[/#macro]
