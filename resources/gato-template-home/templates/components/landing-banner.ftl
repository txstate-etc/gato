[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 2.8]
  [#assign aspectclass = 'wide']
[/#if]
[#assign src = gf.getImgDefault(content.image)]
[#assign srcset = gf.getSrcSet(content.image)]
[#assign mobilesrc = gf.getImgDefault(content.mobileImage)]
[#assign mobilesrcset = gf.getSrcSet(content.mobileImage)]
[#assign size = content.size!]

<div class="banner-image ${aspectclass} ${size}">

  <img class="desktop" src="${src}" alt="" srcset="${srcset}" sizes="100vw" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">
  <img class="mobile" src="${mobilesrc}" alt="" srcset="${mobilesrcset}" sizes="100vw" width="${gf.getImgWidth(content.mobileImage)?c}" height="${gf.getImgHeight(content.mobileImage)?c}">


  [#if cmsfn.isEditMode()]
  <div cms:edit="bar" class="editBanner"></div>
  [/#if]
</div>
