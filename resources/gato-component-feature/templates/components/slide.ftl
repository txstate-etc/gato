[#if !(ctx.barsonly!false)]
  <div class="slide ${ctx.slideactive!''} ${ctx.colorClass!}">
    [#if content.link?has_content]
      <a href="${gf.filterUrl(content.link!)}">
    [/#if]
    [#assign left = (content.imagecropleft!0.0)?number]
    [#assign right = (content.imagecropright!0.0)?number]
    [#assign top = (content.imagecroptop!0.0)?number]
    [#assign bottom = (content.imagecropbottom!0.0)?number]
    <div class="image">
      <img data-lazy="${gf.getImgDefault(content.image, left, right, top, bottom, ctx.aspectratio)}" data-srcset="${gf.getSrcSet(content.image, left, right, top, bottom, ctx.aspectratio)}" class="bg" alt="${content.alttext!}">
      <button class="btnPauseSlider"><i class="fa" aria-hidden="true"></i><span class="visuallyhidden">Pause</span></button>
    </div>
    [#if !gf.isEmptyString(content.title) || !gf.isEmptyString(content.subtext)]
    [#assign tidysubtext = gf.tidyHTML(cmsfn.decode(content).subtext!'')]
    <div class="caption">
      [#if content.title?has_content]<h3>${content.title}</h3>[/#if]
      [#if content.subtext?has_content]<p data-orig-text="${tidysubtext?html}" data-skip-truncation="${ctx.skiptruncation!'false'}">${tidysubtext}</p>[/#if]
    </div>
    [/#if]

    [#if content.link?has_content]
      </a>
    [/#if]
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]
