<div cms:edit="bar"></div>
<div class="mobilefirst-pattern ${content.imageAlignment!'image-right'}">
  [#if content.imageAlignment == 'image-left']
    <div class="pattern-image">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
  <div class="pattern-content arrow links-image ${content.color!color1} ${content.alignContent!'text-center'}">
    <div class="centered">
      <div class="title">${content.title}</div>
      [#if content.text?has_content]<div class="text">${content.text}</div>[/#if]
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
  [#if content.imageAlignment == 'image-right']
    <div class="pattern-image">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
</div>
