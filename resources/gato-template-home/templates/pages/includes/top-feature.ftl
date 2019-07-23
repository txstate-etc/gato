[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/top-feature', 'gatoapps'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1750.0/600.0]
[#assign mobileaspectratio = 4.0/3.0]

[#assign count = 0]
<div id="top-feature" class="feature">
    <div class="hero">
      <figure class="feature top-slider" >

        [#list slides as component]
          [#if component.mobileImage?has_content]
            [#assign mobileImage = component.mobileImage]
          [#else]           
            [#assign mobileImage = component.image]
          [/#if]
          [#if cmsfn.isEditMode() || cmsfn.isPreviewMode()]
            [#if component.preview!false]
              [#assign preview = 'preview']
            [#else]
              [#assign preview = '']
            [/#if]
          [/#if]            
          [#if isEnabled(component)]
          [#assign count++]
          <div class="image-container ${preview}">
            <div class="slide-image desktop" style="background-image: url(${gf.getImgDefault(component.image)})"></div>
            <div class="slide-image mobile" style="background-image: url(${gf.getImgDefault(mobileImage)})"></div>
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
                <a class="button solid ${button.color} ${gf.isVideoOrLink(button.link)}">${button.text}</a>
                [#if gf.isVideoOrLink(button.link) == "video"]
                <p class="feature-play-button">
                  <a href="${button.link}"
                  data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(button.link), 'html')?html}"><span class="visuallyhidden">Play Video</span></a>
                </p>
                [/#if]             
              </div>
              [/#list]
              [/#if]
            </div>
          </figcaption>
          [/#if]
          [#if count == 10]
            <h2>${count}</h2>
            [#break]
          [/#if]
        [/#list]
      </figure>
    </div>
  [@cms.area name="bannerAnnouncement"/]
</div>
