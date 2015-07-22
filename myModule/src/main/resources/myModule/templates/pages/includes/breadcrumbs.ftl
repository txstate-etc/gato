[#-- 
	The breadcrumbs jsp file takes a parameter "hidetxstate" which determines
	whether or not Texas State appears in the breadcrumbs.  Freemarker includes don't
	seem to take parameters.  If we need to have this functionality, we will have
	to set a variable before calling the breadcrumbs import.
--]

<div class="row trail clearfix">
	<div class="column two-thirds flow-opposite">
		<p class="breadcrumbs">
			[#-- assume this variable is set in the calling template --]
			[#if !hidetxstate]
				<a href="#nowhere">Texas State</a>
			[/#if]
			[#assign parentUrl = homePageContent.parent_org_url!]
			[#if parentUrl?length gt 0]
				<span class="separator">
					<i class="fa fa-angle-right"></i>
				</span>
				[#-- is it possible for them to set the parent org. url but not the name? --]
				<a href="${parentUrl}">${homePageContent.parent_organization!"Parent Organization"}</a>
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
	</div>
</div> <!-- end breadcrumbs -->