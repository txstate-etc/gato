[#if content.videourl?has_content]
  <div class="gato-card-video ${content.color!'color1'}">
    <a href="${content.videourl}" class="feature-play-button"
    data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}">
      <i class="fa fa-play" aria-hidden="true"></i>
      <span class="visuallyhidden">Play Video</span>
    </a>
    <figure class="gato-card-video-splash">
      [#if content.thumbnail?has_content]
        <img src="${gf.getImgDefault(content.image)}"
          alt="${alttext}" srcset="${gf.getSrcSet(content.image)}" />
      [/#if]

      [#if content.title?has_content]
        <figcaption>${content.title}</figcaption>
      [/#if]
    </figure>
  </div>
[/#if]
