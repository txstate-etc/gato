[#include "/gato-template/templates/includes/commonmacros.ftl"]

[#assign decodedContent = cmsfn.decode(content)]
[#assign defaultmaxwidth = '100vw']
[#assign width = gf.getImgWidth(content.image)?c+'px']
[#assign sizes = gf.lesserwidth(ctx.maxwidth!'100vw', (content.imageWidth!0)?c+'px', width, defaultmaxwidth)]

<div class="gato-herobanner">
  <div class="herobanner-image">
    <img src="${gf.getImgDefault(content.image, sizes)}" sizes="${sizes}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
    [#if (decodedContent.title)?has_content]
    <div class="herobanner-title">
      <h2>${decodedContent.title}</h2>
    </div>
    [/#if]
  </div>
  [#if (decodedContent.text)?has_content]
    <div class="herobanner-text">${gf.processRichText(decodedContent.text)}</div>
  [/#if]
</div>
