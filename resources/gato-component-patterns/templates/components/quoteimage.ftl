<div cms:edit="bar"></div>
<div class="mobilefirst-pattern ${content.imageAlignment!'image-right'}">
  <div class="pattern-image with-quotation">
    <img src="${gf.getImgDefault(content.image)}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" />
  </div>
  <div class="pattern-content quotation ${content.color!color1}">
    <div class="quotation-text">
      ${content.quotation}
    </div>
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
          <a class="button" href="${gf.filterUrl(button.link)}">${button.text!}</a>
        </li>
        [/#list]
      </ul>
    </div>
    [/#if]
  </div>
</div>
