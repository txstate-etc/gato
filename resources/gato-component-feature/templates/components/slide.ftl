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
      <img src="${gf.getImgDefault(content.image, left, right, top, bottom, ctx.aspectratio)}" srcset="${gf.getSrcSet(content.image, left, right, top, bottom, ctx.aspectratio)}" class="bg" alt="${content.alttext!}">
    </div>
    [#if content.title?has_content || content.subtext?has_content]
    <div class="caption">
      [#if content.title?has_content]<h3>${content.title}</h3>[/#if]
      <p>${content.subtext!}</p>
    </div>
    [/#if]

    [#if content.link?has_content]
      </a>
    [/#if]
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]
