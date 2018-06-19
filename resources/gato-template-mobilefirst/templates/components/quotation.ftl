<div class="quotation">
  [#if content.quotation?has_content]
  <div class="quotation-text">
    ${content.quotation}
  </div>
  [/#if]
  [#if content.source?has_content]
  <div class="quotation-source">
    <div class="source-name">${content.source}</div>
    <div class="source-title">${content.sourceTitle!}</div>
  </div>
  [/#if]
  [#if content.buttons?has_content]
  <div class="buttons">
    [#list cmsfn.children(content.buttons) as button]
    <div class="button-wrapper">
      <a class="fullwidth-button" href="${gf.filterUrl(button.link)}">${button.text}</a>
    </div>
    [/#list]
  </div>
  [/#if]
</div>
