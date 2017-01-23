[#if !(ctx.barsonly!false)]
  <div class="slide video-slide ${ctx.slideactive!''} ${ctx.colorClass!}">

    [#assign left = (content.imagecropleft!0.0)?number]
    [#assign right = (content.imagecropright!0.0)?number]
    [#assign top = (content.imagecroptop!0.0)?number]
    [#assign bottom = (content.imagecropbottom!0.0)?number]
    <div class="image">
      <img src="${gf.getImgDefault(content.image, left, right, top, bottom, ctx.aspectratio)}" srcset="${gf.getSrcSet(content.image, left, right, top, bottom, ctx.aspectratio)}" class="bg" alt="${content.alttext!}">
    </div>
    <div class="caption">
      [#if content.title?has_content && content.link?has_content]<a href="${content.link}">[/#if]
      <h3>${content.title}</h3>
      [#if content.link?has_content]</a>[/#if]
      [#if content.videourl?has_content]
        <div class="feature-play-button">
          <a href="${content.videourl}" aria-label="Play Video" 
          data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}"></a>
        </div>
      [/#if]
    </div>
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]