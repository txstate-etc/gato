[#if !(ctx.barsonly!false)]
  <div data-feature-link="${gf.filterUrl(content.link!'#')}" class="slide ${ctx.slideactive!''}">
    <img src="${gf.getImgDefault(content.image)}" srcset="${gf.getSrcSet(content.image)}" class="bg" alt="${content.alttext!}">
    <div class="caption">
      [#if content.title?has_content]<h3>${content.title}</h3>[/#if]
      <p>${content.subtext!}</p>
    </div>
  </div>
[/#if]
