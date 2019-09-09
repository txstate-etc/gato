[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/home-hero', 'gatoapps'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1750.0/600.0]
[#assign mobileaspectratio = 4.0/3.0]

[#assign count = 0]
<div id="top-feature" class="feature ${cmsfn.isEditMode()?then(' admin','')}">
    <div class="hero">
      <figure class="feature top-slider" >

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
          [#if isEnabled(component)]
          [#assign count++]
          <div class="image-container ${preview}">
            <div class="slide-image desktop" style="background-image: url(${gf.getImgDefault(component.image)})"></div>
            <div class="slide-image mobile" style="background-image: url(${gf.getImgDefault(mobileImage)})"></div>
            [#if component.alttext?has_content]
              <span class="visuallyhidden">${component.alttext}</span>
            [/#if]
          </div>
          <figcaption class="${preview}">
            <div class="caption-wrap ${component.overlayPosition!''}" id="${gf.uuidToHtmlId(component.@id)}">
              [#if component.title?has_content]
                <p class="feature-headline ${component.color!}" style="max-width: ${component.titleWidth!}">
                      ${component.title}
                </p>
              [/#if]
            </div>
            <div class="button-wrap ${component.overlayPosition!''}">
              [#if component.buttons?has_content]
              [#list cmsfn.children(component.buttons) as button]
              <div class="mf-button-container">
                <a class="button solid ${button.color} ${button.isVideo?then("video", "link")}">${button.text}
                  [#if button.isVideo!false]
                  <p class="feature-play-button">
                    <object>
                      <a href="${button.link}"
                      data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(button.link), 'html')?html}"><span class="visuallyhidden">Play Video</span></a>
                    </object>
                  </p>
                  [/#if]      
                </a>       
              </div>
              [/#list]
              [/#if]
            </div>
          </figcaption>
          [/#if]
          [#if count == 10]
            [#break]
          [/#if]
        [/#list]
      </figure>
    </div>
  [@cms.area name="bannerAnnouncement"/]
</div>
