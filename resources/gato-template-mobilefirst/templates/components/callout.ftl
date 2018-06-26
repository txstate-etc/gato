<div class="callout fw-content arrow">
  [#if content.callout?has_content]
  <div class="stat">${content.callout}</div>
  [/#if]
  [#if content.title?has_content]<div class="title">${content.title}</div>[/#if]
  [#if content.subtitle?has_content]<div class="subtitle">${content.subtitle}</div>[/#if]
  [#if content.buttons?has_content]
  <div class="buttons">
    <ul>
      [#list cmsfn.children(content.buttons) as button]
      <li>
        <a class="fullwidth-button" href="${gf.filterUrl(button.link)}">${button.text!}</a>
      </li>
      [/#list]
    </ul>
  </div>
  [/#if]
</div>
