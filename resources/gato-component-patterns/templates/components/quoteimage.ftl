[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#assign hasBorder = content.border!false]
  [#if cmsfn.isEditMode()]
  <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern has-image ${content.imageAlignment!'image-right'} ${hasBorder?then('border', '')}">
    <div class="pattern-image with-quotation">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" sizes="(max-width: 50em) 1000px, 50vw"/>
    </div>
    <div class="pattern-content quotation ${content.color!color1}">
      <div class="centered">
        <div class="quotation-text">
          <div class="quote-icon"><i class="fa fa-quote-left" aria-hidden="true"></i><span class="visuallyhidden">quotation</span></div>
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
  </div>
[/@prebuiltsection]
