<div class="titlebutton arrow">
  [#if content.title?has_content]<div class="title">${content.title}</div>[/#if]
  [#if content.subtitle?has_content]<div class="subtitle">${content.subtitle}</div>[/#if]
  <div class="buttons">
    [#list cmsfn.children(content.buttons) as button]
    <div class="button-wrapper">
      <a class="fullwidth-button" href="${gf.filterUrl(button.link)}">${button.text}</a>
    </div>
    [/#list]
  </div>
</div>
