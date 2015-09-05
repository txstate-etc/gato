[#assign pageid = cmsfn.page(content).@id]
[#list components as component]
	[#assign owner = cmsfn.page(component)]
	[#if pageid != owner.@id]
		<div class="inherited">Inherited from parent page: ${gf.nodeTitle(owner)}</div>
	[/#if]
	<div class="gato-custom-block">
	  [@cms.component content=component /]
	</div>
[/#list]
