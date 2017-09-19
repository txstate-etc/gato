[#if !(ctx.barsonly!false)]
  [#assign aspectclass = 'tall']
  [#if gf.getImgAspectRatio(content.image) > ctx.aspect]
    [#assign aspectclass = 'wide']
  [/#if]
  <div class="slide ${ctx.slideactive!''} ${aspectclass}">
    <img src="${gf.getImgDefault(content.image)}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}"/>
  </div>
[/#if]
