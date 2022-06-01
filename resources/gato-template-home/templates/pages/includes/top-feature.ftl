[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/home-hero', 'gatoapps'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1750.0/600.0]
[#assign mobileaspectratio = 4.0/3.0]

[#assign count = 0]
<div id="home-hero" class="home-hero ${cmsfn.isEditMode()?then(' admin','')}">
    [@headline true true/]
    <div class="hero">
      <figure class="hero-figure">
        [#list slides as component]
          [#if component.mobileImage?has_content]
            [#assign mobileImage = component.mobileImage]
          [#else]
            [#assign mobileImage = component.image]
          [/#if]
          [#assign preview = '']
          [#if cmsfn.isAuthorInstance()]
            [#if component.preview!false]
              [#assign preview = 'preview']
            [/#if]
          [/#if]
          [#if isEnabled(component) || preview == 'preview']
            [#assign count++]
            <div class="hero-image-container ${preview}">
            [#if component.video?has_content]
              <div id="videostatus" class="visuallyhidden" aria-live="polite"></div>
              <video autoplay muted loop class="hero-video">
                <source src="${gf.filterUrl(component.video)}">
              </video>
              <button class="btnPauseVideo">
                <i class="fa fa-pause" aria-hidden="true"></i>
                <span class="visuallyhidden">Pause Background Video</span>
              </button>
              <div class="hero-image desktop reduced-motion" style="background-image: url(${gf.getImgDefault(component.image)})"></div>
            [#else]
              <div class="hero-image desktop" style="background-image: url(${gf.getImgDefault(component.image)})"></div>
            [/#if]
              <div class="hero-image mobile" style="background-image: url(${gf.getImgDefault(mobileImage)})"></div>
              [#if component.alttext?has_content]
                <span class="visuallyhidden">${component.alttext}</span>
              [/#if]
            </div>
            [#assign showTitle = true]
            [#if component.showTitle?? && component.showTitle == false]
              [#assign showTitle = false]
            [/#if]
            <div class="${showTitle?then('', 'hideTitle')}">
              <figcaption class="${preview}">
                <div class="caption-wrap ${component.overlayPosition!''}" id="${gf.uuidToHtmlId(component.@id)}">
                  [#if component.title?has_content]
                    <p class="hero-headline ${component.color!}" style="max-width: ${component.titleWidth!}">
                          ${component.title}
                    </p>
                  [/#if]
                </div>
                <div class="button-wrap ${component.overlayPosition!''}">
                  [#if component.buttons?has_content]
                  [#list cmsfn.children(component.buttons) as button]
                  <div class="mf-button-container">
                    [#if button.isVideo!false]
                      [#assign oembed = gf.oEmbedAutodiscover(button.link)!]
                      <div class="button solid ${button.color} feature-play-button video-button">
                        <a href="${button.link}" aria-label="Play Video"
                          data-embed="${gf.jsonGetString(oembed, 'html')?html}"
                          data-embedwidth="${gf.jsonGetString(oembed, 'width')}"
                          data-embedheight="${gf.jsonGetString(oembed, 'height')}"
                        >
                          ${button.text}
                          <span class="play" aria-hidden="true"></span>
                        </a>
                      </div>
                    [#else]
                      <a class="button solid ${button.color} link" href="${gf.filterUrl(button.link)}">${button.text}</a>
                    [/#if]
                  </div>
                  [/#list]
                  [/#if]
                </div>
              </figcaption>
            </div>
          [/#if]
          [#if count == 10]
            [#break]
          [/#if]
        [/#list]
      </figure>
    </div>
  [@cms.area name="bannerAnnouncement"/]
</div>
