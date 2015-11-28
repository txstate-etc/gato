[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/research-feature', 'website'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 16.0/9.0]

<div id="spotlight" class="content-row comp two-col">
    <div class="content-row-content">
    
      <div class="eq-parent">
    
        <div class="eq-mn-1-1 eq-ml-1-2">
          
          <div class="col-left research">
            <h2>Research</h2>
          
            <div class="research-slider-wrap">
              <div class="slides">

                [#-- FIXME: check enabled, starttime, and endtime fields --]
                [#list slides as component]

                  <div class="slide" style="${(component_index == 0)?string('', 'display: none;')}">
                    <figure class="feature research-slider">
                      
                      <div class="feature-img-wrap">
                      
                        <img src="${gf.getImgDefault(component.image, aspectratio)}" srcset="${gf.getSrcSet(component.image, aspectratio)}" alt="${component.alttext!}">
                      
                        [#if component.videourl?has_content]
                          <p class="feature-play-button">
                            <a href="${component.videourl}" aria-label="Play Video"></a>
                          </p>
                        [/#if]
                      
                      </div>
                      
                      <figcaption>

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

                          <p class="feature-text">${component.subtext!}</p>

                      </figcaption>
                    </figure>
                  </div>

                [/#list]
              
              </div>
              
              [#if slides?size > 1]
                <div class="slide-nav">
                  <a class="slide-nav-left" href="#nowhere"><i class="fa fa-chevron-left"></i></a>[#--
                  --]<a class="slide-nav-right" href="#nowhere"><i class="fa fa-chevron-right"></i></a>
                </div>
                <p class="slide-nav-dots">
                  <a class="active-dot" href="#nowhere"><i class="fa fa-circle"></i></a>
                  <a href="#nowhere"><i class="fa fa-circle"></i></a>
                  <a href="#nowhere"><i class="fa fa-circle"></i></a>
                </p>
              [/#if]
            
            </div>
          </div>
          
        </div>
      
        <div class="eq-mn-1-1 eq-ml-1-2">
          <div class="col-right pride">
            <h2>Pride</h2>
            
            <div class="bab">
              <figure>
                <img alt="demo" src="http://edelstone.github.io/gato-homepage/images/bab-1.jpg">
                <figcaption>
                  <a href="http://www.txstate.edu/be-a-bobcat">Be a Bobcat</a>
                </figcaption>
              </figure>
            </div> 
            
            <div class="rs">
              <figure>
                <img alt="demo" src="http://edelstone.github.io/gato-homepage/images/rs-1.jpg">
                <figcaption>
                  <a href="http://www.txstate.edu/rising-stars">Rising Stars</a>
                </figcaption>
              </figure>
            </div>
                
          </div>
        </div>
      
      </div>
  </div>
</div>
