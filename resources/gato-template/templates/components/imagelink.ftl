<a  href="${gf.filterUrl(content.link)}" class="gato-imagelink">
  <img  src="${gf.getImgDefault(content.image, ctx.maxwidth!'100vw')}" sizes="${ctx.maxwidth!'100vw'}" srcset="${gf.getSrcSet(content.image)}" alt="${content.imageAlt}" title="${content.imageAlt}" />
  [#if (content.rollover)?has_content]
    [#assign rolloverImage = content.rollover]
  [#else]
    [#assign rolloverImage = content.image]
  [/#if]
  <img  src="${gf.getImgDefault(rolloverImage, ctx.maxwidth!'100vw')}" sizes="${ctx.maxwidth!'100vw'}" srcset="${gf.getSrcSet(rolloverImage)}" alt="${content.imageAlt}" title="${content.imageAlt}" class="rollover" />
</a>
