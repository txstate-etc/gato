[#include "/gato-template/templates/includes/commonmacros.ftl"]

[#assign decodedContent = cmsfn.decode(content)]
[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 16.0/9.0]
  [#assign aspectclass = 'wide']
[/#if]

<div class="gato-herobanner">
  <div class="herobanner-image ${aspectclass}">
    <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
  </div>
  [#if (content.title)?has_content]
  <div class="herobanner-title">
    <h1>${content.title}</h1>
  </div>
  [/#if]
  [#if (decodedContent.text)?has_content]
    <div class="herobanner-text">${gf.processRichText(decodedContent.text)}</div>
  [/#if]
</div>
