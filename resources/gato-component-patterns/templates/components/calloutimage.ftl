[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
<div cms:edit="bar"></div>
<div class="mobilefirst-pattern ${content.imageAlignment!'image-right'}">
  [#if content.imageAlignment == 'image-left']
    <div class="pattern-image">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
  <div class="pattern-content callout arrow ${content.color!color1} ${content.alignContent!'text-center'}">
    [@callout content.callout content.title content.text content.buttons/]
  </div>
  [#if content.imageAlignment == 'image-right']
    <div class="pattern-image">
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
</div>
