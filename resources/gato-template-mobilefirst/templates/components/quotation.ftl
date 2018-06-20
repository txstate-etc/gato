<div class="quotation fw-content">
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
    <ul>
      [#list cmsfn.children(content.buttons) as button]
      <li>
        <a class="fullwidth-button" href="${gf.filterUrl(button.link)}">${button.text}</a>
      </li>
      [/#list]
    </ul>
  </div>
  [/#if]
</div>
