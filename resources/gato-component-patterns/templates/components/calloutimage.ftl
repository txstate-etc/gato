[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern has-image ${content.imageAlignment!'image-right'}">
  [#if content.imageAlignment == 'image-left']
    <div class="pattern-image ${content.color!color1}">
      <div class="overlay-right"></div>
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
  <div class="pattern-content callout arrow ${content.color!color1} ${content.alignContent!'text-center'}">
    [@callout content.callout content.title content.text content.buttons/]
  </div>
  [#if content.imageAlignment == 'image-right']
    <div class="pattern-image ${content.color!color1}">
      <div class="overlay-left"></div>
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    </div>
  [/#if]
</div>
