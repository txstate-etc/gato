[#if ctx.enablefiltering]
	<ul class="grid-filter" role="tablist">
		[#if ctx.includeallfilter]
			<li role="presentation"><a href="#" role="tab">All</a></li>
		[/#if]
		[#list ctx.filterlist?split(",") as tab]
			<li role="presentation"><a href="#" role="tab">${tab?trim}</a></li>
		[/#list]
	</ul>
[/#if]
[#list components as component]
  [#if ctx.cardsize=='small']
    [#assign sizes="400px"]
  [#elseif ctx.cardsize=='medium']
    [#assign sizes="600px"]
  [#else]
    [#assign sizes="800px"]
  [/#if]
  [@cms.component content=component contextAttributes={"cardsize":ctx.cardsize, "sizes":sizes}/]
[/#list]
[#if cmsfn.isEditMode()]
    <div class="gato-card gato-card-add ${ctx.cardsize}" cms:add="box"></div>
[/#if]
