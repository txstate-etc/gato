[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#include "/gato-template-rss/templates/includes/lib.ftl"]

[#assign decodedContent = cmsfn.decode(content)]
[#assign float = content.imageFloat!'left']
[#if !decodedContent.text?has_content]
  [#assign float = 'top']
[/#if]
[@rssitem node=content link=content.imageLink!]
<div style="min-width: 400px; padding: 10px">
  [#if float == 'bottom']${gf.processRichText(decodedContent.text)}[/#if]
  [#if (content.image)?has_content]
    [#assign fullwidth = (float == 'top' || float == 'bottom')]
    [#assign width = gf.getImgWidth(content.image)?c+'px']
    [#assign sizes = gf.lesserwidth((content.imageWidth!0)?c+'px', width)]
    [#assign style = 'width:'+sizes+';']
    [#if fullwidth]
      [#assign style = style+'max-width:100%;']
    [#else]
      [#assign style = style+'margin:10px;float:'+float+';max-width:50%;']
    [/#if]
    [#if content.imageCaption?has_content]
      [#assign style = style+'min-width:100px;']
    [/#if]
    <div style="${style}">
      <img src="${gf.getImgDefault(content.image, sizes)}"
        srcset="${gf.getSrcSet(content.image)}"
        sizes="${sizes}"
        alt="${content.imageAlt!}"
        style="width: 100%"
      />
      [#if (content.imageCaption)?has_content]
        <div style="background-color:#333333;color:#ffffff;">${decodedContent.imageCaption}</div>
      [/#if]
    </div>
  [/#if]
  [#if float != 'bottom']${gf.processRichText(decodedContent.text)}[/#if]
</div>
[/@rssitem]
