[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/top-feature', 'website'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1750.0/600.0]


<div id="top-feature">
  <div class="eq-parent">  
    
    <div class="slides">

      [#-- FIXME: check enabled, starttime, and endtime fields --]
      [#list slides as component]

        <div class="slide" style="${(component_index == 0)?string('', 'display: none;')}">
          <figure class="feature top-slider">
            <img src="${gf.getImgDefault(component.image, aspectratio)}" srcset="${gf.getSrcSet(component.image, aspectratio)}" alt="${component.alttext!}">
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

      [/#list]

    </div>

    [#if slides?size > 1]
      <div class="slide-nav">
        <a class="slide-nav-left" href="#"><i class="fa fa-chevron-left"></i></a>
        <a class="slide-nav-right" href="#"><i class="fa fa-chevron-right"></i></a>
      </div>
    [/#if]

  </div>  
  
</div>
