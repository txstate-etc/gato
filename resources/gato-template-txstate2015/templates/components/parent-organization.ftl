[#if content.parent_name?has_content]
  <a class="parent_org" href="${gf.filterUrl(content.url!'#')}">${content.parent_name}</a>
[/#if]
