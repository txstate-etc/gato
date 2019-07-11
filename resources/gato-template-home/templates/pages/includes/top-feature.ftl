[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/top-feature', 'gatoapps'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1750.0/600.0]


<div id="top-feature" class="feature">
    <div class="slides">
      <div class="hero color1">
        <figure class="feature top-slider" >

          [#list slides as component]
            [#if component.mobileImage?has_content]
              [#assign mobileImage = component.mobileImage]
            [#else]           
              [#assign mobileImage = component.image]
            [/#if]
            [#if isEnabled(component)]
                  <div class="image-container">
                    <img class="slide-image desktop" src="${gf.getImgDefault(component.image, aspectratio)}" srcset="${gf.getSrcSet(component.image, aspectratio, 80)}" alt="${component.alttext!}">
                    <img class="slide-image mobile" src="${gf.getImgDefault(mobileImage, aspectratio)}" srcset="${gf.getSrcSet(component.mobileImage, aspectratio, 80)}" alt="${component.alttext!}">
                  </div>
                  <figcaption>
                    <div class="caption-wrap ${component.overlayPosition!''}" id="${gf.uuidToHtmlId(component.@id)}">

                      [#if component.title?has_content]
                        <p class="feature-headline">

                          [#assign link = component.link!component.videourl!]
                          [#if link?has_content]
                            <a href="${gf.filterUrl(link)}">
                          [/#if]
                              ${component.title}
                          [#if link?has_content]
                            </a>
                          [/#if]

                        </p>
                      [/#if]

                      [#if component.videourl?has_content]
                        <p class="feature-play-button">
                          <a href="${component.videourl}"
                          data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(component.videourl), 'html')?html}"><span class="visuallyhidden">Play Video</span></a>
                        </p>
                      [/#if]

                    </div>
                  </figcaption>
            [/#if]
          [/#list]
        </figure>
      </div>
    </div>

    <div class="slide-nav-wrap">
      <div class="slide-nav"></div>
    </div>

</div>
