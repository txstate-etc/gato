[#if cmsfn.isEditMode()]
  <div cms:edit="bar"></div>
[/#if]
[#assign textAlign = (content.overlayPosition == "center")?then('text-center', 'text-left')]
<div class="mobilefirst-pattern image-overlay" style='background-image: url("${gf.getImgDefault(content.image)}")'>
  <div class="overlay-block title-type pattern-content ${content.color!color1} ${content.overlayPosition!'center'} ${textAlign}">
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
