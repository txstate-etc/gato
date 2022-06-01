[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 2.2]
  [#assign aspectclass = 'wide']
[/#if]
[#assign src = gf.getImgDefault(content.image)]
[#assign srcset = gf.getSrcSet(content.image)]
<div class="hero-slide ${aspectclass}">
  <img src="${src}" alt="${content.alttext!}" srcset="${srcset}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">
  [#if content.videourl?has_content]
    [#assign oembed = gf.oEmbedCached(content)!]
    <a href="${content.videourl}" class="feature-play-button"
      data-embed="${gf.jsonGetString(gf.oEmbedCached(content), 'html')?html}"
      data-embedwidth="${gf.jsonGetString(oembed, 'width')}"
      data-embedheight="${gf.jsonGetString(oembed, 'height')}"
    >
      <i class="fa fa-play" aria-hidden="true"></i>
      <span class="visuallyhidden">Play Video</span>
    </a>
  [/#if]
</div>
