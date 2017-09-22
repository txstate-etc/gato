<div class="gato-card gato-card-image eq-parent ${ctx.cardsize!} ${content.color!'color1'}" data-tags="${content.tags!''}">
  [#if content.link?has_content]
    <a class="gato-card-image-link" href="${gf.filterUrl(content.link!)}">
  [/#if]

  <figure>
    <img src="${gf.getImgDefault(content.image, ctx.sizes)}" sizes="${ctx.sizes}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)}" height="${gf.getImgHeight(content.image)}"/>
    [#if content.title?has_content]
      <figcaption>
        <h3>${content.title}</h3>
        [#if content.subtext?has_content]
          <div class="caption-content">
            ${cmsfn.decode(content).subtext}
          </div>
        [/#if]
      </figcaption>
    [/#if]
  </figure>

  [#if content.link?has_content]
    </a>
  [/#if]
</div>
