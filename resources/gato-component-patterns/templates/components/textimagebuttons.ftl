
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern textImageCTA ${content.imageAlignment!'image-right'} ${(content.hasBackground!false)?then('background', '')}">
[#if content.imageAlignment == 'image-left']
  <div class="pattern-image">
    <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
  </div>
[/#if]
<div class="pattern-content title-type">
  <div class="title">${content.title}</div>
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
  [#if content.imageAlignment == 'image-right']
    <div class="pattern-image">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
</div>
