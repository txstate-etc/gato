<div cms:edit="bar"></div>
<div class="mobilefirst-pattern has-image ${content.imageAlignment!'image-right'}">
  [#if content.imageAlignment == 'image-left']
    <div class="pattern-image ${content.color!color1}">
      <div class="overlay-right"></div>
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
  <div class="pattern-content arrow title-type ${content.color!color1} ${content.alignContent!'text-center'}">
    [#include "/gato-component-patterns/templates/components/common/titlelinks.ftl"]
  </div>
  [#if content.imageAlignment == 'image-right']
    <div class="pattern-image ${content.color!color1}">
      <div class="overlay-left"></div>
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
</div>
