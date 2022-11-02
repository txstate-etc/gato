[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if !(ctx.barsonly!false)]
  [#assign active = false]
  [#if ctx.slideactive?has_content && ctx.slideactive == "active"]
    [#assign active = true]
  [/#if]
  [#assign notitle = (!gf.isEmptyString(content.title) || content.subtext?has_content)?string("","no-title")]
  <div id="slidepanel${gf.uuidToHtmlId(content.@id)}" class="slide video-slide ${ctx.slideactive!''} ${ctx.colorClass!} ${notitle}" role="tabpanel" aria-hidden="${active?then("false", "true")}" aria-labelledby="slidetab${gf.uuidToHtmlId(content.@id)}">
    <div class="slide-content">
      [#assign left = (content.imagecropleft!0.0)?number]
      [#assign right = (content.imagecropright!0.0)?number]
      [#assign top = (content.imagecroptop!0.0)?number]
      [#assign bottom = (content.imagecropbottom!0.0)?number]
      <div class="slide-image ${gf.getImgWideOrTall(content.image, 1.78)}">
        <img ${active?then("", "data-")}src="${gf.getImgDefault(content.image, left, right, top, bottom, ctx.aspectratio)}" ${active?then("", "data-")}srcset="${gf.getSrcSet(content.image, left, right, top, bottom, ctx.aspectratio)}" alt="${content.alttext!}">
        [#if content.videourl?has_content]
          [#assign oembed = gf.oEmbedCached(content)!]
          [#if oembed?has_content]
            <div class="feature-play-button centered [#if gf.isEmptyString(content.title) && gf.isEmptyString(content.subtext)] no-caption [/#if]">
              <a href="${content.videourl}" aria-label="Play Video"
              data-embed="${gf.jsonGetString(oembed, 'html')?html}"
              data-embedwidth="${gf.jsonGetString(oembed, 'width')}"
              data-embedheight="${gf.jsonGetString(oembed, 'height')}"
              tabindex="${active?then(0,-1)}"></a>
            </div>
          [/#if]
        [/#if]
      </div>
      [#if !gf.isEmptyString(content.title) || !gf.isEmptyString(content.subtext)]
        <div class="caption">
          [#if !gf.isEmptyString(content.title)]
            [#if content.link?has_content]
              <a href="${gf.filterUrl(content.link!)}" class="slide-link" tabindex="${active?then("0", "-1")}">
            [/#if]
            [@h2 class="title"]${content.title}[/@h2]
            [#if content.link?has_content]
              </a>
            [/#if]
          [/#if]
          [#if !gf.isEmptyString(content.subtext)]
            [#assign tidysubtext = gf.tidyHTML(cmsfn.decode(content).subtext!'')]
            <p data-orig-text="${tidysubtext?html}" data-skip-truncation="${ctx.skiptruncation!'false'}">${tidysubtext}</p>[/#if]
          [#if content.videourl?has_content]
            [#assign oembed = gf.oEmbedCached(content)!]
            <div class="feature-play-button">
              <a href="${content.videourl}" aria-label="Play Video"
                data-embed="${gf.jsonGetString(oembed, 'html')?html}"
                data-embedwidth="${gf.jsonGetString(oembed, 'width')}"
                data-embedheight="${gf.jsonGetString(oembed, 'height')}"
                tabindex="${active?then(0,-1)}"></a>
            </div>
          [/#if]
        </div>
      [/#if]
    </div>
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]
