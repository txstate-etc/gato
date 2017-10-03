[#if !(ctx.barsonly!false)]
  [#assign aspectclass = 'tall']
  [#if gf.getImgAspectRatio(content.image) > ctx.aspect]
    [#assign aspectclass = 'wide']
  [/#if]
  [#assign src = gf.getImgDefault(content.image)]
  [#assign srcset = gf.getSrcSet(content.image)]
  <div class="slide ${ctx.slideactive!''} ${aspectclass}" data-src="${src}" data-srcset="${srcset}">
    [#if ctx.slideactive?has_content]
      <img src="${src}" alt="${content.alttext!}" srcset="${srcset}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">
    [#else]
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="${content.alttext!}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">
    [/#if]
    [#if content.videourl?has_content]
      <a href="${content.videourl}" class="feature-play-button"
      data-embed="${gf.jsonGetString(gf.oEmbedCached(content, content.videourl), 'html')?html}">
        <i class="fa fa-play" aria-hidden="true"></i>
        <span class="visuallyhidden">Play Video</span>
      </a>
    [/#if]
  </div>
[/#if]
