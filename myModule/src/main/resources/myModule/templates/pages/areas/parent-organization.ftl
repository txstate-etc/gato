[#assign homePageContent = ctx.getAttribute('homePageContent')]
[#if homePageContent.parentOrganization??]
	[#assign parent_url = homePageContent.parentOrganization.url!"#"]
	[#assign parent_org = homePageContent.parentOrganization.parent_name!""]

	[#if parent_org?length gt 0]
	<p class="parent_org">
	        <a href="${parent_url}">${parent_org}</a>
	</p>
	[/#if]
[/#if]