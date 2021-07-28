[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[#if !gf.isEmptyString(content.anchor)]
  <div id=${content.anchor}></div>
[/#if]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
    <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  [#assign textAlign = (content.overlayPosition == "center")?then('text-center', 'text-left')]
  <div class="mobilefirst-pattern image-overlay" style='background-image: linear-gradient(180deg, rgba(43,46,52, 0.4), rgba(43,46,52, 0.4)), url("${gf.getImgDefault(content.image)}")'>
    <div class="overlay-block title-type pattern-content ${content.color!color1} ${content.overlayPosition!'center'} ${textAlign}">
      <h2 class="title">${content.title}</h2>
      <div class="text">
        ${gf.processRichTextLevel(cmsfn.decode(content).text, 3)}
      </div>
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
[/@prebuiltsection]
