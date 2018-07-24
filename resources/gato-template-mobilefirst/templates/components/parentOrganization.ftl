[#if content.url?has_content]
  <a href="${gf.filterUrl(content.url)}">${content.parent_name!}</a>
[#else]
  ${content.parent_name!}
[/#if]
