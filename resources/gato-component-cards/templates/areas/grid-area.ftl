[#if ctx.enablefiltering]
	<ul class="grid-filter" role="tablist">
		[#if ctx.includeallfilter]
			<li><a href="#" role="tab">All</a></li>
		[/#if]
		[#list ctx.filterlist?split(",") as tab]
			<li><a href="#" role="tab">${tab?trim}</a></li>
		[/#list]
	</ul>
[/#if]
[#list components as component]
    [@cms.component content=component contextAttributes={"cardsperrow":ctx.cardsperrow!"gato-card-md"}/]
[/#list]
[#if cmsfn.isEditMode()]
    <div class="grid-item grid-card-add ${ctx.cardsperrow!}" cms:add="box"></div>
[/#if]
