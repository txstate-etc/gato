[#include "/gato-template/templates/includes/commonmacros.ftl"]

[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 2.2]
  [#assign aspectclass = 'wide']
[/#if]

<div class="gato-herobanner">
  <div class="herobanner-image ${aspectclass}">
    <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}" />
    [#if (content.title)?has_content]
    <div class="herobanner-title">
      <h1 id="maincontent">${content.title}</h1>
    </div>
    [/#if]
  </div>
  [#if content.text?has_content]
    <div class="herobanner-text">${cmsfn.decode(content).text}</div>
  [/#if]
</div>
