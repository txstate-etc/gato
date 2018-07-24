[#include "/gato-template/templates/includes/component.ftl"]
[#assign mypage = cmsfn.page(content)]
[#assign inheritancelist = [mypage]+cmsfn.ancestors(mypage)?reverse]

[#list inheritancelist as page]
  [#assign himg = gf.singleComponent(page, 'subpage-banner')!]
  [#if himg?has_content]
    [#if himg?has_content && (himg.visible=='hidden' || (himg.visible=='shown' && himg.image?has_content))]
      [#break]
    [/#if]
  [#else]
    [#-- TODO: I'm not sure if the designers want to inherit the banner from the home page --]
    [#assign himg = gf.singleComponent(page, 'home-banner')!]
  [/#if]
[/#list]

[#assign defaultSrc = gf.getImgDefault(himg.image)]

<div class="banner-section">
  <div class="banner">
  [#if cmsfn.isEditMode()]
  <div class="addBannerImage" cms:add="box" style="padding-top: 6rem;">
    [#if component?has_content]
      [@cms.component content=component /]
    [/#if]
  </div>
  [/#if]
  [#if himg?has_content && himg.visible?? && himg.visible == 'shown' && defaultSrc?has_content]
    [#assign hasImage = true]
    [#assign srcset = gf.getSrcSet(content.image)]
    <div class="banner-image interior tall">
      <img src="${defaultSrc}" alt="${content.alttext!}" srcset="${srcset}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">
    </div>
  [#else]
    [#assign hasImage = false]
  [/#if]
  </div>
</div>

<div class="site-title ${hasImage?then('', 'no-image')}">
  <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
</div>
