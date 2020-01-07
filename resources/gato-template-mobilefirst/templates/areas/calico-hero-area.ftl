[#include "/gato-template/templates/includes/component.ftl"]

[#assign isSiteRoot = isHomePage]
[#assign mypage = cmsfn.page(content)]
[#assign inheritancelist = [mypage]+cmsfn.ancestors(mypage)?reverse]

[#list inheritancelist as page]
  [#assign himg = gf.singleComponent(page, 'calico-hero')!]
  [#if himg?has_content]
    [#if himg.visible == "hidden"]
      [#break]
    [/#if]
    [#if himg.visible == "shown" && himg.image?has_content && himg.customize != "inherit"]
      [#break]
    [/#if]
    [#if himg.customize == "image"]
      [#break]
    [/#if]
  [/#if]
[/#list]

[#-- get image size --]
[#assign heroSize = isSiteRoot?then("large", "small")]
[#list inheritancelist as page]
  [#assign hero = gf.singleComponent(page, 'calico-hero')!]
  [#if hero?has_content]
    [#if hero.visible == "hidden"]
      [#break]
    [/#if]
    [#if hero.visible == "shown"]
      [#assign heroSize = hero.size]
      [#break]
    [/#if]
  [/#if]
[/#list]

<div class="banner-section">
  <div class="banner">
  [#if cmsfn.isEditMode()]
  <div class="addBannerImage" cms:add="box" style="padding-top: 6rem;">
    [#if component?has_content]
      [@cms.component content=component /]
    [/#if]
  </div>
  [/#if]
  [#if himg?has_content]
    [#assign noHero = (himg.visible == "hidden" || (himg.visible == "shown" && !himg.image?has_content))?then(true, false)]
    [#if !noHero]
      [#assign defaultSrc = gf.getImgDefault(himg.image)]
      [#assign srcset = gf.getSrcSet(himg.image)]
      <div class="banner-image tall ${heroSize}">
        <img src="${defaultSrc}" alt="" srcset="${srcset!}" sizes="(max-width: 800px) 800px, 120vw"width="${gf.getImgWidth(himg.image)?c}" height="${gf.getImgHeight(himg.image)?c}">
      </div>
    [#else]
      [#if isSiteRoot && himg.visible != "hidden"]
        <div class="banner-image tall ${heroSize}">
          <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/default_banner.jpg" alt=""  width="2000" height="1333">
        </div>
      [/#if]
    [/#if]
  [#else]
    [#if isSiteRoot]
      <div class="banner-image tall ${heroSize}">
        <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/default_banner.jpg" alt=""  width="2000" height="1333">
      </div>
    [/#if]
  [/#if]
  </div>
</div>