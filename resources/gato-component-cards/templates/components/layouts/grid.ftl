[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel editclass='section-grid-edit' ; headerlevel]
[#if content.enablefiltering!false]
	<ul class="gato-card-filter" role="tablist">
		[#if content.includeallfilter!false]
			<li role="presentation"><a href="#" role="tab">All</a></li>
		[/#if]
		[#list cmsfn.children(content.filterlist) as filter]
			<li role="presentation"><a href="#" role="tab">${filter.name?trim}</a></li>
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
<div id="${gf.uuidToHtmlId(content.@id)}" class="section-grid ${cardsize} ${((content.aspect!0) > 0)?string('forcegrid','')}">
  [#if (content.aspect!0) <= 0]
  <div class="masonry-sizer"></div>
  <div class="masonry-gutter"></div>
  [/#if]
  [@cms.area name="cards" contextAttributes={"cardsize":cardsize, "sizes":sizes, "aspect":content.aspect!0, "headerlevel":headerlevel}/]
</div>
[/@sectionLabel]
