<a href="${gf.filterUrl(content.link)}" class="gato-imagelink">
  <img src="${gf.getImgDefault(content.image)}" sizes="${ctx.maxwidth!'100vw'}" srcset="${gf.getSrcSet(content.image)}" alt="${content.imageAlt}" title="${content.imageAlt}" />
  <img src="${gf.getImgDefault(content.rollover)}" sizes="${ctx.maxwidth!'100vw'}" srcset="${gf.getSrcSet(content.rollover)}" alt="${content.imageAlt}" title="${content.imageAlt}" class="rollover" />
</a>
