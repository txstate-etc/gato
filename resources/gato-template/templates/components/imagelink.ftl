[#if gf.hasChildren(content.institutionallogos)]
  <ul class="gato-flex-container">
  [#list cmsfn.children(content.institutionallogos) as logos]
    <li>
    <a href="${gf.filterUrl(logos.link)}" class="gato-imagelink">
      <img src="${gf.getImgDefault(logos.image, ctx.maxwidth!'100vw')}" sizes="${ctx.maxwidth!'100vw'}" srcset="${gf.getSrcSet(logos.image)}" alt="${logos.imageAlt}" title="${logos.imageAlt}" />
      [#if (logos.rollover)?has_content]
        [#assign rolloverImage = logos.rollover]
      [#else]
        [#assign rolloverImage = logos.image]
      [/#if]
      <img src="${gf.getImgDefault(rolloverImage, ctx.maxwidth!'100vw')}" sizes="${ctx.maxwidth!'100vw'}" srcset="${gf.getSrcSet(rolloverImage)}" alt="${logos.imageAlt}" title="${logos.imageAlt}" class="rollover" />
    </a>

    </li>
  [/#list]
  <ul>
[/#if]
