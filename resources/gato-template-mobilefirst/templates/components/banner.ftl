[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 3.3]
  [#assign aspectclass = 'wide']
[/#if]
[#assign src = gf.getImgDefault(content.image)]
[#assign srcset = gf.getSrcSet(content.image)]

<div class="banner-image ${aspectclass}">
  <img src="${src}" alt="${content.alttext!}" srcset="${srcset}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">
</div>
