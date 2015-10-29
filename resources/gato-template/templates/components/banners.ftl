[#macro addimages banner]
  [#list cmsfn.children(banner.banners, 'mgnl:component') as img]
    [#if img.inherit && damfn.getAssetLink(img.image)?has_content]
      [#assign banners = banners + [img]]
    [/#if]
  [/#list]
[/#macro]

[#assign banners = []]
[@addimages content /]
[#if !content.reset]
  [#list ancestorsbottomup! as ancestor]
    [#assign banner = gf.singleComponent(ancestor, 'gato-banners')!]
    [@addimages banner /]
    [#if banner.reset!false][#break][/#if]
  [/#list]
[/#if]
[#assign image = banners[gf.random(0, banners?size-1)]]
<div class="gato-banner-image">
  <a href="${gf.filterUrl(image.imageLink)}">
    <img src="${gf.getImgDefault(image.image)}" srcset="${gf.getSrcSet(image.image)}" alt="${image.imageAlt}">
  </a>
</div>
