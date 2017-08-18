[#assign sizes=ctx.getAttribute("maxCardSize")!'100vw']

<div class="gato-card-image ${content.color!'color1'}">
  [#if content.link?has_content]
    <a href="${gf.filterUrl(content.link!)}">
  [/#if]

  <figure>
    <img src="${gf.getImgDefault(content.image, sizes)}" sizes="${sizes}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" />
    [#if content.title?has_content]
      <figcaption>
        <h3>${content.title}</h3>
        [#if content.subtext?has_content]
          <p>${cmsfn.decode(content).subtext}</p>
        [/#if]
      </figcaption>
    [/#if]
  </figure>

  [#if content.link?has_content]
    </a>
  [/#if]
</div>
