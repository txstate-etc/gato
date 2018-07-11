<ul class="multilinks">
  <div cms:edit="bar"></div>
  [#if content.links?has_content]
    [#list cmsfn.children(content.links) as link]
      <li><a href="${gf.filterUrl(link.link)}">${link.text}</a></li>
    [/#list]
  [/#if]
</ul>
