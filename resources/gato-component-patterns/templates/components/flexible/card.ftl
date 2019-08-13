[#assign oembed = gf.oEmbedCached(content, content.videourl)]
[#switch ctx.orientation]
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
    [#assign aspectratio = 2.21]
    [#break]

  [#case "full"]
    [#assign left = (content.fullcropleft!0.0)?number]
    [#assign right = (content.fullcropright!0.0)?number]
    [#assign top = (content.fullcroptop!0.0)?number]
    [#assign bottom = (content.fullcropbottom!0.0)?number]  
    [#assign aspectratio = 3.37]
    [#break]

  [#default]
    [#assign left = (content.imagecropleft!0.0)?number]
    [#assign right = (content.imagecropright!0.0)?number]
    [#assign top = (content.imagecroptop!0.0)?number]
    [#assign bottom = (content.imagecropbottom!0.0)?number]  
    [#assign aspectratio = 1]

  [/#switch]

[#if gf.isEmptyString(content.imageAlt)]
  [#assign altText = ""]
[#else]
  [#assign altText = content.imageAlt]
[/#if]
[#if content.image?has_content]
  [#assign cardImage = gf.getImgDefault(content.image, left, right, top, bottom, aspectratio)]
  [#assign cardImageMobile = gf.getImgDefault(content.image, (content.fullcropleft!0.0)?number, (content.fullcropright!0.0)?number, (content.fullcroptop!0.0)?number, (content.fullcropbottom!0.0)?number, 1.777)]
[#elseif gf.jsonGetString(oembed, 'thumbnail_url')?has_content]
  [#assign cardImage = gf.getImg(gf.jsonGetString(oembed, 'thumbnail_url'), 1280, 720, true, false, 0, 0, 0, 0)]
[#else]
  [#assign cardImage = gf.getImg(gf.resourcePath() + "/gato-component-cards/images/video-default.png")]
[/#if]


<div class="item desktop ${content.image?has_content?string('mobile-image', 'no-mobile-image')}">
  <a href="${gf.filterUrl(content.link)}">
    <div class="card ${content.videourl?has_content?string('gato-card-video','gato-card-image')} ${gf.jsonGetString(oembed, 'provider_name')?lower_case}" style='background-image: url("${cardImage}")'>

      [#if content.videourl?has_content]
        <a href="${content.videourl}" class="feature-play-button"
        data-embed="${gf.jsonGetString(oembed, 'html')?html}">
          <i class="fa fa-play" aria-hidden="true"></i>
          <span class="visuallyhidden">Play Video</span>
        </a>
      [/#if]      
    </div>
    [#if content.textStyle == "caption" && content.caption?has_content]
    <div class="caption">
      <p>${content.caption!''}</p>
    </div>
    [/#if]    
    [#if content.textStyle == "overlay" && content.callout?has_content]
    <div class="overlay ${content.color!}"></div>
    <div class="callout ${content.color!}">
      <div class="title">${content.calloutTitle!}</div>
      <p>${content.callout!}</p>
    </div>
    [/#if]
  </a>
</div>

[#if cardImageMobile?has_content]
<div class="mobile">
  <a href="${gf.filterUrl(content.link)}">
    <div class="item card ${content.videourl?has_content?string('gato-card-video','gato-card-image')} ${gf.jsonGetString(oembed, 'provider_name')?lower_case} ${ctx.orientation!}" style='background-image: url("${cardImageMobile}")'>
      [#if content.videourl?has_content]
        <a href="${content.videourl}" class="feature-play-button"
        data-embed="${gf.jsonGetString(oembed, 'html')?html}">
          <i class="fa fa-play" aria-hidden="true"></i>
          <span class="visuallyhidden">Play Video</span>
        </a>
      [/#if]      
    </div>
    [#if content.textStyle == "caption" && content.caption?has_content]
    <div class="caption">
      <p>${content.caption!''}</p>
    </div>
    [/#if]    
    [#if content.textStyle == "overlay" && content.callout?has_content]
    <div class="overlay ${content.color!}"></div>
    <div class="callout ${content.color!}">
      <div class="title">${content.calloutTitle!}</div>
      <p>${content.callout!}</p>
    </div>
    [/#if]    
  </a>
</div>
[/#if]