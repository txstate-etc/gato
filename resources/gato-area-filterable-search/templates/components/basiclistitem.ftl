[#assign tags = gf.propertyValues(content.tags![])]
[#if ctx.includeAlphabetFilters]
  [#assign letterFilter = "filter-" + content.title[0]?capitalize ]
  [#assign tags = tags + [letterFilter]]
[/#if]
<div class="listitem" data-tags="${tags?join(",")}">
[#if content.link?has_content]
  <a href="${gf.filterUrl(content.link)}">
[/#if]
<div class="listitem-title">
  ${content.title}
</div>
[#if content.link?has_content]
  </a>
[/#if]
[#if content.description?has_content]
  <div class="listitem-description">
    ${content.description}
  </div>
[/#if]
</div>
