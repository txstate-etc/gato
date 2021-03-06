[#macro addimages banner isInherited]
  [#if gf.hasChildren(banner.banners)]
    [#list cmsfn.children(banner.banners) as img]
      [#if ((img.inherit!false) || !isInherited) && damfn.getAssetLink(img.image)?has_content]
        [#assign banners = banners + [img]]
      [/#if]
    [/#list]
  [/#if]
[/#macro]

[#macro dispimage image]
  <img src="${gf.getImgDefault(image.image, ctx.aspectratio!(550.0/160.0))}" srcset="${gf.getSrcSet(image.image, ctx.aspectratio!(550.0/160.0))}" alt="${image.imageAlt!}">
[/#macro]

[#if cmsfn.isEditMode()]<div class="gato-banners-admin" cms:edit></div>[/#if]
[#include "/gato-template/templates/includes/component.ftl"]
[@bannerSettings content=content areaname='gato-banners'/]
[#if showBannerArea]
  [#assign banners = []]
  [@addimages banner=content isInherited=false/]
  [#if !(content.reset!false)]
    [#list (cmsfn.ancestors(cmsfn.page(content))![])?reverse as ancestor]
      [#assign banner = gf.singleComponent(ancestor, 'gato-banners')!]
      [@addimages banner=banner isInherited=true/]
      [#if banner.reset!false][#break][/#if]
    [/#list]
  [/#if]
  [#if banners?size > 0]
    [#assign image = banners[gf.random(0, banners?size-1)]]
    <div class="gato-banner-image">
      [#if image.imageLink?has_content]
        <a href="${gf.filterUrl(image.imageLink)}">
          [@dispimage image/]
        </a>
      [#else]
        [@dispimage image/]
      [/#if]
    </div>
  [/#if]
[/#if]
