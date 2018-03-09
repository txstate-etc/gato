[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel editclass='section-grid-edit' ; headerlevel]
[#assign cardsize = content.cardsize!'medium']
[#if cardsize=='small']
  [#assign sizes="400px"]
[#elseif cardsize=='medium']
  [#assign sizes="600px"]
[#else]
  [#assign sizes="800px"]
[/#if]
[#if content.enablefiltering!false]
  [#assign tabcount = 0]
  [#if content.filterlist?has_content][#assign tabcount = cmsfn.children(content.filterlist)?size][/#if]
  [#if content.includeallfilter!false][#assign tabcount = tabcount + 1][/#if]
  [#assign maxw = ' style="max-width: ${100.0 / tabcount}%"']
	<ul class="gato-card-filter ${cardsize} ${content.color!'color1'}" role="tablist">
		[#if content.includeallfilter!false]
			<li role="presentation"${maxw}><a href="#" role="tab">All</a></li>
		[/#if]
		[#if content.filterlist?has_content]
      [#list cmsfn.children(content.filterlist) as filter]
        <li role="presentation"${maxw}><a href="#" role="tab">${filter.name?trim}</a></li>
      [/#list]
		[/#if]
	</ul>
[/#if]
<div id="${gf.uuidToHtmlId(content.@id)}" class="section-grid ${cardsize} ${((content.aspect!0) > 0)?string('forcegrid','')}">
  [#if (content.aspect!0) <= 0]
  <div class="masonry-sizer"></div>
  <div class="masonry-gutter"></div>
  [/#if]
  [@cms.area name="cards" contextAttributes={"cardsize":cardsize, "sizes":sizes, "aspect":content.aspect!0, "headerlevel":headerlevel}/]
</div>
[/@sectionLabel]
