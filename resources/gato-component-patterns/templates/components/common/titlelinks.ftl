<div class="centered">
  <div class="title">${content.title}</div>
  [#if content.text?has_content]<div class="text">${content.text}</div>[/#if]
  [#if content.links?has_content]
  <div class="links">
    <ul>
    [#list cmsfn.children(content.links) as lnk]
      <li>
        <a href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
      </li>
    [/#list]
    </ul>
  </div>
  [/#if]
</div>
