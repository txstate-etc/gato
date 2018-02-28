[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign indexclass='']
[#if (ctx.cardindex!0) % 2 == 1][#assign indexclass = indexclass + ' halves-edge'][/#if]
[#if (ctx.cardindex!0) % 3 == 2][#assign indexclass = indexclass + ' thirds-edge'][/#if]
[#if (ctx.cardindex!0) % 4 == 3][#assign indexclass = indexclass + ' fourths-edge'][/#if]
<div class="gato-card gato-card-image eq-parent ${ctx.cardsize!} ${content.color!'color1'}${indexclass}" data-tags="${gf.toJSON(gf.getTags(content))?html}">
  [#if content.link?has_content]
    <a class="gato-card-image-link" href="${gf.filterUrl(content.link!)}">
  [/#if]

  <figure>
    [#assign ar = ctx.aspect!0]
    [#if ar == 0 && (content.aspect!0) > 0]
      [#assign ar = content.aspect]
    [/#if]
    [#if ar > 0]
      [#assign croppingclass = 'cropped']
      [#assign aspectclass = 'tall']
      [#if gf.getImgAspectRatio(content.image) > ar]
        [#assign aspectclass = 'wide']
      [/#if]
      [#assign padbottom = 100/ar]
    [/#if]
    <div class="crop-container ${aspectclass!} ${croppingclass!}" style="padding-bottom: ${padbottom!0}%;">
      <img src="${gf.getImgDefault(content.image, ctx.sizes)}" sizes="${ctx.sizes}" alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}"/>
    </div>
    [#if content.title?has_content || content.subtext?has_content]
      <figcaption>
        [#if content.title?has_content]
          [@h2 class="title"]${content.title}[/@h2]
        [/#if]
        [#if content.subtext?has_content]
          <p class="caption-content">
            ${cmsfn.decode(content).subtext}
          </p>
        [/#if]
      </figcaption>
    [/#if]
  </figure>

  [#if content.link?has_content]
    </a>
  [/#if]
</div>
