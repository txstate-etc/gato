[#assign oembed = gf.oEmbedCached(content, content.videourl)]
[#switch content.orientation]
  [#case "normal"]
    [#assign left = (content.squarecropleft!0.0)?number]
    [#assign right = (content.squarecropright!0.0)?number]
    [#assign top = (content.squarecroptop!0.0)?number]
    [#assign bottom = (content.squarecropbottom!0.0)?number]
    [#assign aspectratio = 1]
    [#break]

  [#case "wide"]
    [#assign left = (content.widecropleft!0.0)?number]
    [#assign right = (content.widecropright!0.0)?number]
    [#assign top = (content.widecroptop!0.0)?number]
    [#assign bottom = (content.widecropbottom!0.0)?number]
    [#assign aspectratio = 2]
    [#break]

  [#case "tall"]
    [#assign left = (content.tallcropleft!0.0)?number]
    [#assign right = (content.tallcropright!0.0)?number]
    [#assign top = (content.tallcroptop!0.0)?number]
    [#assign bottom = (content.tallcropbottom!0.0)?number]  
    [#assign aspectratio = 0.5]
    [#break]

  [#default]
    [#assign left = (content.imagecropleft!0.0)?number]
    [#assign right = (content.imagecropright!0.0)?number]
    [#assign top = (content.imagecroptop!0.0)?number]
    [#assign bottom = (content.imagecropbottom!0.0)?number]  
    [#assign aspectratio = 1]

  [/#switch]

<!--Check for whitespace in alt text-->
[#if gf.isEmptyString(content.imageAlt)]
  [#assign altText = ""]
  [#else]
  [#assign altText = content.imageAlt]
[/#if]
[#if content.image?has_content]
  [#assign cardImage = gf.getImgDefault(content.image, left, right, top, bottom, aspectratio)]
[#elseif gf.jsonGetString(oembed, 'thumbnail_url')?has_content]
  [#assign cardImage = gf.getImg(gf.jsonGetString(oembed, 'thumbnail_url'), 1280, 720, true, false, 0, 0, 0, 0)]
[#else]
  [#assign cardImage = gf.getImage(gf.resourcePath() + "/gato-component-cards/images/video-default.png")]
[/#if]
<a href="${gf.filterUrl(content.link)}">
  <div class="card ${content.videourl?has_content?string('gato-card-video','gato-card-image')} ${gf.jsonGetString(oembed, 'provider_name')?lower_case}" style='background-image: url("${cardImage}")'>
    [#if content.caption?has_content]
    <div class="caption">
      <p>${content.caption!''}</p>
    </div>
    [/#if]
    [#if content.videourl?has_content]
      <a href="${content.videourl}" class="feature-play-button"
      data-embed="${gf.jsonGetString(oembed, 'html')?html}">
        <i class="fa fa-play" aria-hidden="true"></i>
        <span class="visuallyhidden">Play Video</span>
      </a>
    [/#if]      
  </div>
</a>