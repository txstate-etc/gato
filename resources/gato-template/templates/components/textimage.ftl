[#include "/gato-template/templates/includes/commonmacros.ftl"]

[#assign decodedContent = cmsfn.decode(content)]
[#assign float = content.imageFloat!'left']
[#assign headerlevel = ctx.headerlevel!2+1]
[#assign setFirstHeader = true]
<div class="gato-textimage eq-parent">
  [#-- if there is a title, put it here --]
  [#if (decodedContent.title)?has_content]
    [@h2 class="gato-textimage-title"]
      ${decodedContent.title}
    [/@h2]
  [/#if]
  [#if !decodedContent.text?has_content]
    [#assign float = 'top']
  [/#if]
  [#if float == 'bottom']${gf.processRichTextLevel(decodedContent.text, headerlevel, setFirstHeader)}[/#if]
  [#if (content.image)?has_content]
    [#assign fullwidth = (float == 'top' || float == 'bottom')]
    [#assign defaultmaxwidth = fullwidth?string('100vw', '400px')]

    [#assign width = gf.getImgWidth(content.image)?c+'px']
    [#assign sizes = gf.lesserwidth(ctx.maxwidth!'100vw', (content.imageWidth!0)?c+'px', width, defaultmaxwidth)]
    <div class="gato-textimage-imageblock ${float} ${content.imageCaption?has_content?string('hascaption', '')}" style="max-width: ${sizes};">
      [@linkifdefined href=content.imageLink]
        <img src="${gf.getImgDefault(content.image, sizes)}" sizes="${sizes}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
      [/@linkifdefined]
      [#if (content.imageCaption)?has_content]
        <div class="gato-textimage-caption">${decodedContent.imageCaption}</div>
    </div>
  [/#if]
      [/#if]
  [#if float != 'bottom']${gf.processRichTextLevel(decodedContent.text, headerlevel, setFirstHeader)}[/#if]
</div>
