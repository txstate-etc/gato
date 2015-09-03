[#macro templatecomponent]
	<div class="gato-component">
		[#nested]
	</div>
[/#macro]

[#assign cacheEnvironment = (ctx.request.getHeader("via")!'')?contains("Proxy-HistoryCache")]
[#assign globaldata = cmsfn.contentByPath('/global-data')]
[#assign page = cmsfn.page(content)]
[#assign ancestorstopdown = cmsfn.ancestors(page)]
[#assign ancestorsbottomup = cmsfn.ancestors(page)?reverse]
[#assign isHomePage = !ancestorstopdown?has_content]
[#assign homepage = page]
[#if !isHomePage][#assign homepage = ancestorstopdown?first][/#if]
[#assign thisPagePath = cmsfn.asJCRNode(page).path]
