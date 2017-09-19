[#if !(ctx.barsonly!false)]
  [#assign aspectclass = 'tall']
  [#if gf.getImgAspectRatio(content.image) > ctx.aspect]
    [#assign aspectclass = 'wide']
  [/#if]
  [#assign src = gf.getImgDefault(content.image)]
  [#assign srcset = gf.getSrcSet(content.image)]
  <div class="slide ${ctx.slideactive!''} ${aspectclass}" data-src="${src}" data-srcset="${srcset}">
    [#if ctx.slideactive?has_content]
      <img src="${src}" alt="${content.alttext!}" srcset="${srcset}">
    [#else]
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="${content.alttext!}">
    [/#if]
  </div>
[/#if]
