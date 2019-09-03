[#assign src = gf.getImgDefault(content.image)]
[#assign srcset = gf.getSrcSet(content.image)]
[#assign imageWidth = gf.getImgWidth(content.image)]
[#assign imageHeight = gf.getImgHeight(content.image)]
[#if content.mobileImage?has_content]
  [#assign mobilesrc = gf.getImgDefault(content.mobileImage)]
  [#assign mobilesrcset = gf.getSrcSet(content.mobileImage)]
  [#assign imageWidth = gf.getImgWidth(content.mobileImage)]
  [#assign imageHeight = gf.getImgHeight(content.mobileImage)]
[#else]
  [#assign mobilesrc = src]
  [#assign mobilesrcset = srcset]
[/#if]
[#assign size = content.size!]

<div class="banner-image desktop-banner-image ${size}">
  <img class="desktop" src="${src}" alt="" srcset="${srcset}" sizes="100vw" width="${imageWidth?c}" height="${imageHeight?c}">
  [#if cmsfn.isEditMode()]
  <div cms:edit="bar" class="editBanner"></div>
  [/#if]
</div>
<div class="banner-image mobile-banner-image ${size}">
  <img class="mobile" src="${mobilesrc}" alt="" srcset="${mobilesrcset}" sizes="100vw" width="${imageWidth?c}" height="${imageHeight?c}">
</div>
