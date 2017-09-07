<div class="gato-card gato-card-video eq-parent ${ctx.cardsize} ${content.color!'color1'}" data-tags="${content.tags!''}">
  <figure>
    <div class="gato-card-video-splash">
      [#if content.image?has_content]
        <img src="${gf.getImgDefault(content.image)}" sizes="${ctx.sizes}"
          alt="${content.alttext!}" srcset="${gf.getSrcSet(content.image)}" />
      [#else]
        <img src="${gf.resourcePath()}/gato-component-cards/images/video-default.png" class="default"
          alt="${content.alttext!}" />
      [/#if]
    </div>

    [#if content.title?has_content]
      <figcaption><h3>${content.title}</h3></figcaption>
    [/#if]
  </figure>
  <a href="${content.videourl}" class="feature-play-button"
  data-embed="${gf.jsonGetString(gf.oEmbedCached(content, content.videourl), 'html')?html}">
    <i class="fa fa-play" aria-hidden="true"></i>
    <span class="visuallyhidden">Play Video</span>
  </a>
</div>
