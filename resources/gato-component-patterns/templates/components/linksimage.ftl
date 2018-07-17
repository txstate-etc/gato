<div cms:edit="bar"></div>
<div class="mobilefirst-pattern ${content.imageAlignment!'image-right'}">
  [#if content.imageAlignment == 'image-left']
    <div class="pattern-image">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
  <div class="pattern-content arrow links-image ${content.color!color1} ${content.alignContent!'text-center'}">
    <div class="title">${content.title}</div>
    [#if content.text?has_content]<div class="text">${content.text}</div>[/#if]
    [#if content.links?has_content]
    <div class="links">
      <ul>
      [#list cmsfn.children(content.links) as lnk]
        <li>
          <a href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
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
