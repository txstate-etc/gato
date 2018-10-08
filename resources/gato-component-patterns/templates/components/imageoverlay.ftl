[#assign textAlign = (content.overlayPosition == "center")?then('text-center', 'text-left')]
[#if cmsfn.isEditMode()]
  <div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern image-overlay">
  <img class="background-image" src="${gf.getImgDefault(content.image)}" srcset="${gf.getSrcSet(content.image)}" />
  <div class="text-overlay pattern-content title-type ${content.color!color1} ${content.overlayPosition!'center'} ${textAlign}">
    <div class="title">${content.title}</div>
    <div class="text">
      ${gf.processRichText(cmsfn.decode(content).text)}
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
