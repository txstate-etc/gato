[#macro addimages banner]
  [#if banner.banners??]
    [#list cmsfn.children(banner.banners, 'mgnl:component') as img]
      [#if img.inherit && damfn.getAssetLink(img.image)?has_content]
        [#assign banners = banners + [img]]
      [/#if]
    [/#list]
  [/#if]
[/#macro]

[#macro dispimage image]
  <img src="${gf.getImgDefault(image.image)}" srcset="${gf.getSrcSet(image.image)}" alt="${image.imageAlt}">
[/#macro]

[#include "/gato-template/templates/includes/banner-settings.ftl"]
[#if showBannerArea]
  [#assign banners = []]
  [@addimages content /]
  [#if !content.reset]
    [#list (cmsfn.ancestors(cmsfn.page(content))![])?reverse as ancestor]
      [#assign banner = gf.singleComponent(ancestor, 'gato-banners')!]
      [@addimages banner /]
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
