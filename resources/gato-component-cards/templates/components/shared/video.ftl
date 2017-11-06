[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign oembed = gf.oEmbedCached(content, content.videourl)]
<div class="gato-card gato-card-video eq-parent ${gf.jsonGetString(oembed, 'provider_name')?lower_case} ${ctx.cardsize} ${content.color!'color1'}" data-tags="${content.tags!''}">
  <figure>
    <div class="gato-card-video-splash">
      [#if content.image?has_content]
        <img src="${gf.getImgDefault(content.image)}" sizes="${ctx.sizes}"
          alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" />
      [#elseif gf.jsonGetString(oembed, 'thumbnail_url')?has_content]
        <img src="${gf.jsonGetString(oembed, 'thumbnail_url')}"
          alt="${content.alttext!}" />
      [#else]
        <img src="${gf.resourcePath()}/gato-component-cards/images/video-default.png" class="default"
          alt="${content.alttext!}" />
      [/#if]
    </div>

    [#if content.title?has_content]
      <figcaption>[@h2]${content.title}[/@h2]</figcaption>
    [/#if]
  </figure>
  <a href="${content.videourl}" class="feature-play-button"
  data-embed="${gf.jsonGetString(oembed, 'html')?html}">
    <i class="fa fa-play" aria-hidden="true"></i>
    <span class="visuallyhidden">Play Video</span>
  </a>
</div>
