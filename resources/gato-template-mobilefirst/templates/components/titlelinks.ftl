<div class="titlelinks arrow">
  [#if content.title?has_content]<div class="title">${content.title}</div>[/#if]
  [#if content.subtitle?has_content]<div class="subtitle">${content.subtitle}</div>[/#if]
  <div class="links">
    <ul>
    [#list cmsfn.children(content.links) as lnk]
      <li>
        <a href="${gf.filterUrl(lnk.link)}">${lnk.text}</a>
      </li>
    [/#list]
    </ul>
  </div>
</div>
