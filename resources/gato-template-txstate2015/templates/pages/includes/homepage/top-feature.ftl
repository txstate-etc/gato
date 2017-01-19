[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/top-feature', 'gatoapps'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1750.0/600.0]


<div id="top-feature" class="feature">

    <div class="slides">

      [#list slides as component]
        [#if isEnabled(component)]
          <div class="slide ${component.color!''}">
            <figure class="feature top-slider" >
              <img class="slide-image" src="${gf.getImgDefault(component.image, aspectratio)}" srcset="${gf.getSrcSet(component.image, aspectratio)}" alt="${component.alttext!}">
              <figcaption>
                <div class="caption-wrap">

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
                      <a href="${component.videourl}" aria-label="Play Video"></a>
                    </p>
                  [/#if]

                </div>
              </figcaption>
            </figure>
          </div>
        [/#if]
      [/#list]

    </div>

    <div class="slide-nav-wrap">
      <div class="slide-nav"></div>
    </div>

</div>
