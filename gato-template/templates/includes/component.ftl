[#macro templatecomponent]
	<div class="gato-component">
		[#nested]
	</div>
[/#macro]

[#assign page = cmsfn.page(content)]
[#assign ancestorstopdown = cmsfn.ancestors(page)]
[#assign ancestorsbottomup = cmsfn.ancestors(page)?reverse]
[#assign isHomePage = !ancestorstopdown?has_content]
[#assign homepage = page]
[#if !isHomePage][#assign homepage = ancestorstopdown?first][/#if]
