<ul class="multilinks">
  [#if cmsfn.isEditMode()]
  <div cms:edit="bar" class="editMultiLinks"></div>
  [/#if]
  [#if content.links?has_content]
    [#list cmsfn.children(content.links) as link]
      <li><a href="${gf.filterUrl(link.link)}">${link.text}</a></li>[#t]
    [/#list]
  [/#if]
</ul>
