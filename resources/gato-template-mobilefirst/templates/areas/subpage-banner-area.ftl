[#include "/gato-template/templates/includes/component.ftl"]
[#import "/gato-template-mobilefirst/templates/includes/headerImageLogic.ftl" as headerLogic]

<div class="banner-section">
  <div class="banner">
  [#if cmsfn.isEditMode()]
  <div class="addBannerImage" cms:add="box" style="padding-top: 6rem;">
    [#if component?has_content]
      [@cms.component content=component /]
    [/#if]
  </div>
  [/#if]
  [#if headerLogic.hasImage]
    [#assign himg = headerLogic.himg]
    <div class="banner-image interior tall">
      <img src="${headerLogic.defaultSrc}" alt="${himg.alttext!}" srcset="${headerLogic.srcset!}" width="${gf.getImgWidth(himg.image)?c}" height="${gf.getImgHeight(himg.image)?c}">
    </div>
  [/#if]
  </div>
</div>

<div class="site-title ${headerLogic.hasImage?then('', 'no-image')}">
  <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
</div>
