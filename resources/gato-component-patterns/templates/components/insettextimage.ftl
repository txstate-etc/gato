[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="textImagePatternWrapper ${(content.hasBackground!false)?then('background', '')}">
    <div class="mobilefirst-pattern insettextimage ${content.imageAlignment!'image-right'}">
      <div class="pattern-image">
        <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" sizes="(max-width: 50em) 1000px, 50vw"/>
      </div>
      <div class="pattern-content title-type">
        <div class="inset ${content.color!color1}">
          <h2 class="title">${content.title}</h2>
          [#if content.text?has_content]<div class="text">${gf.processRichText(cmsfn.decode(content).text)}</div>[/#if]
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
      </div>
    </div>
  </div>
[/@prebuiltsection]
