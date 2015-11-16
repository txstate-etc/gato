[#assign decodedContent = cmsfn.decode(content)]
<div class="gato-textimage eq-parent">
  [#-- if there is a title, put it here --]
  [#if (content.title)?has_content]
    <h2 class="gato-textimage-title">
      ${content.title}
    </h2>
  [/#if]
  [#if content.imageFloat == 'bottom']${gf.processRichText(decodedContent.text)}[/#if]
  [#if (content.image)?has_content]
    [#assign fullwidth = (content.imageFloat == 'top' || content.imageFloat == 'bottom')]
    [#assign defaultmaxwidth = fullwidth?string('100vw', '400px')]
    [#assign cols = fullwidth?string('eq-mn-1-1','eq-mn-1-1 eq-md-1-2 eq-lg-1-3')]

    [#assign width = gf.getImgWidth(content.image)+'px']
    [#assign sizes = gf.lesserwidth(ctx.maxwidth!'100vw', (content.imageWidth!0)?c+'px', width, defaultmaxwidth)]
    <div class="gato-textimage-imageblock ${content.imageFloat} ${cols} ${content.imageCaption?has_content?string('hascaption', '')}" style="max-width: ${sizes};">
      <img src="${gf.getImgDefault(content.image, sizes)}" sizes="${sizes}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
      [#if (content.imageCaption)?has_content]
        <div class="gato-textimage-caption">${decodedContent.imageCaption}</div>
      [/#if]
    </div>
  [/#if]
  [#if content.imageFloat != 'bottom']${gf.processRichText(decodedContent.text)}[/#if]
</div>
