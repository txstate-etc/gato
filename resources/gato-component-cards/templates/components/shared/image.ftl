[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign indexclass='']
[#if (ctx.cardindex!0) % 2 == 1][#assign indexclass = indexclass + ' halves-edge'][/#if]
[#if (ctx.cardindex!0) % 3 == 2][#assign indexclass = indexclass + ' thirds-edge'][/#if]
[#if (ctx.cardindex!0) % 4 == 3][#assign indexclass = indexclass + ' fourths-edge'][/#if]
[#assign oembed = gf.oEmbedCached(content, content.videourl)]
<div class="gato-card ${content.videourl?has_content?string('gato-card-video','gato-card-image')} ${gf.jsonGetString(oembed, 'provider_name')?lower_case} eq-parent ${ctx.cardsize!} ${content.color!'color1'}${indexclass}" data-tags="${gf.toJSON(gf.getTags(content))?html}">
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
      [#assign imagear = 16.0/9.0]
      [#if content.image?has_content][#assign imagear = gf.getImgAspectRatio(content.image)][/#if]
      [#if imagear > ar]
        [#assign aspectclass = 'wide']
      [/#if]
      [#assign padbottom = 100/ar]
    [/#if]
    <div class="crop-container ${aspectclass!} ${croppingclass!}" style="padding-bottom: ${padbottom!0}%;">
      [#if content.image?has_content]
        <img src="${gf.getImgDefault(content.image)}" sizes="${ctx.sizes}"
          alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}"
          width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}"/>
      [#elseif gf.jsonGetString(oembed, 'thumbnail_url')?has_content]
        <img src="${gf.getImg(gf.jsonGetString(oembed, 'thumbnail_url'), 1280, 720, true, false, 0, 0, 0, 0)}" alt="${content.alttext!}" class="oembed_image"/>
      [#else]
        <img src="${gf.resourcePath()}/gato-component-cards/images/video-default.png" class="default"
          alt="${content.alttext!}" width="1920" height="1080"/>
      [/#if]
      [#if content.videourl?has_content]
        <a href="${content.videourl}" class="feature-play-button"
        data-embed="${gf.jsonGetString(oembed, 'html')?html}">
          <i class="fa fa-play" aria-hidden="true"></i>
          <span class="visuallyhidden">Play Video</span>
        </a>
      [/#if]
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
