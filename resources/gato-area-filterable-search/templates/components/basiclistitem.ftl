[#assign tags = gf.propertyValues(content.tags![])]
<div class="listitem" data-tags="${tags?join(",")}" data-keywords="[#if content.keywords?has_content]${content.keywords?join(',')}[/#if]">
[#if content.link?has_content]
  <a href="${gf.filterUrl(content.link)}">
[/#if]
<div class="listitem-title" data-searchable="true" data-alpha="true">
  ${content.title}
</div>
[#if content.link?has_content]
  </a>
[/#if]
[#if content.description?has_content]
  <div class="listitem-description" data-searchable="true">
    ${cmsfn.decode(content).description}
  </div>
[/#if]
</div>
