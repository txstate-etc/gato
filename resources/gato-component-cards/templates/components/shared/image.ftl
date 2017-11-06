[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign indexclass='']
[#if (ctx.cardindex!0) % 2 == 1][#assign indexclass = indexclass + ' halves-edge'][/#if]
[#if (ctx.cardindex!0) % 3 == 2][#assign indexclass = indexclass + ' thirds-edge'][/#if]
[#if (ctx.cardindex!0) % 4 == 3][#assign indexclass = indexclass + ' fourths-edge'][/#if]
<div class="gato-card gato-card-image eq-parent ${ctx.cardsize!} ${content.color!'color1'}${indexclass}" data-tags="${content.tags!''}">
  [#if content.link?has_content]
    <a class="gato-card-image-link" href="${gf.filterUrl(content.link!)}">
  [/#if]

  <figure>
    [#if (ctx.aspect!0) > 0]
      [#assign aspectclass = 'tall']
      [#if gf.getImgAspectRatio(content.image) > ctx.aspect]
        [#assign aspectclass = 'wide']
      [/#if]
      [#assign padbottom = 100/ctx.aspect]
    [/#if]
    <div class="crop-container ${aspectclass!}" style="padding-bottom: ${padbottom!0}%;">
      <img src="${gf.getImgDefault(content.image, ctx.sizes)}" sizes="${ctx.sizes}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}"/>
    </div>
    [#if content.title?has_content]
      <figcaption>
        [@h2 class="title"]${content.title}[/@h2]
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
