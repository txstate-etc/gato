[#if content.enablefiltering!false]
	<ul class="gato-card-filter" role="tablist">
		[#if content.includeallfilter!false]
			<li role="presentation"><a href="#" role="tab">All</a></li>
		[/#if]
		[#list (content.filterlist!"")?split(",") as tab]
			<li role="presentation"><a href="#" role="tab">${tab?trim}</a></li>
		[/#list]
	</ul>
[/#if]
[#assign cardsize = content.cardsize!'medium']
[#if cardsize=='small']
  [#assign sizes="400px"]
[#elseif cardsize=='medium']
  [#assign sizes="600px"]
[#else]
  [#assign sizes="800px"]
[/#if]
<div id="${gf.uuidToHtmlId(content.@id)}" class="section-grid ${cardsize}">
  <div class="masonry-sizer"></div>
  <div class="masonry-gutter"></div>
  [@cms.area name="cards" contextAttributes={"cardsize":cardsize, "sizes":sizes}/]
</div>
