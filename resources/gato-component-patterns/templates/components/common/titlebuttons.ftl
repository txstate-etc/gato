<div class="centered">
  <div class="title">${content.title}</div>
  [#if content.text?has_content]<div class="text">${content.text}</div>[/#if]
  [#if content.buttons?has_content]
  <div class="buttons">
    <ul>
    [#list cmsfn.children(content.buttons) as lnk]
      <li>
        <a class="button" href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
      </li>
    [/#list]
    </ul>
  </div>
  [/#if]
</div>