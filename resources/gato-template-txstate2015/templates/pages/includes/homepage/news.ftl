[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/news-feature', 'website'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1080.0/400.0]

<div id="news" class="content-row main two-col">
  <div class="content-row-content">
    <div class="eq-parent">
    
      <div class="eq-mn-1-1 eq-ml-1-2">
        <div class="col-left news">
          
          <h2>News</h2>
          
          <div class="news-slider-wrap">
            <div class="slides">
  
              [#-- FIXME: check enabled, starttime, and endtime fields --]
              [#list slides as component]

                <figure id="news-feature" class="feature">
                  
                  [#if component.link?has_content]
                    <a class="image-link" href="${component.link}">
                  [/#if]
                      <img src="${gf.getImgDefault(component.image, aspectratio)}" srcset="${gf.getSrcSet(component.image, aspectratio)}" alt="${component.alttext!}">
                  [#if component.link?has_content]
                    </a>
                  [/#if]
                  
                  <figcaption>
                  
                    <p class="feature-date">Sept. 15, 2015</p>
                                        
                    [#if component.title?has_content]
                      <p class="feature-headline">

                        [#if component.link?has_content]
                          <a href="${component.link}">
                        [/#if]
                            ${component.title}
                        [#if component.link?has_content]
                          </a>
                        [/#if]
                        
                      </p>
                    [/#if]

                  </figcaption>
                </figure>

              [/#list]
              
            </div>
          </div>

          <div id="news-links">
            <p><a href="#nowhere">School of Music announces schedule of events for September</a></p>
            <p><a href="#nowhere">In Brief: Ainslie lecture to cover two decades of work in conflicted cities</a></p>
            <p><a href="#nowhere">Texas State hosts 2015 Black and Latino Playwrights Conference</a></p>
          </div>

          <div id="news-jump">
              
            <div class="solo-bailout">
              <p>
                <a id="news-service" href="http://www.txstate.edu/news" class="solo-bailout-button">
                  Official News Service<i class="button-chevron fa fa-chevron-right"></i>
                </a>
              </p>
            </div>
    
            <div class="solo-bailout">
              <p>
                <a id="ustar" href="http://star.txstate.edu">
                  University Star<i class="button-chevron fa fa-chevron-right"></i>
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
      
      <div class="eq-mn-1-1 eq-ml-1-2 events-wrap">
        <div class="col-right events">
        
          <div id="tabs" >
              
            <ul role="tablist">
              <li role="presentation">
                <h2>
                  <a href="#tabpanel-events" role="tab" aria-controls="tabpanel-events" aria-selected="true" tabindex="0" id="tab-events">Events</a>
                </h2>
              </li>
              <li role="presentation">
                <h2>
                  <a href="#tabpanel-dates" role="tab" aria-controls="tabpanel-dates" aria-selected="false" tabindex="-1" id="tab-dates">Important Dates</a>
                </h2>
              </li>
            </ul>

            <div class="tab-contents">

              <div id="tabpanel-events" aria-labelledby="tab-events" role="tabpanel" aria-hidden="false">
                <ul>
                  <li class="event">
                    <p class="event-title"><a href="#nowhere">Robert Rodriguez Lecture</a></p>
                    <p class="event-date">
                      <a href="#nowhere">
                        <span class="month">Sept</span>
                        <span class="day">14</span>
                      </a>
                    </p>
                    <p class="event-time">7 p.m. – 9 p.m.</p>
                  </li>
                  <li class="event">
                    <p class="event-title"><a href="#nowhere">Campus Blood Drive</a></p>
                    <p class="event-date">
                      <a href="#nowhere">
                        <span class="range-start">Oct. 18</span>
                        <span class="range-to">to</span>
                        <span class="range-end">Nov. 2</span>
                      </a>
                    </p>
                    <p class="event-time">9 a.m. – 5 p.m.</p>
                  </li>
                  <li class="event">
                    <p class="event-title"><a href="#nowhere">Free Movie: Undeclared</a></p>
                    <p class="event-date">
                      <a href="#nowhere">
                        <span class="month">Oct</span>
                        <span class="day">30</span>
                      </a>
                    </p>
                    <p class="event-time">8 p.m. – 10 p.m.</p>
                  </li>
                </ul>

                <a class="more-events" href="http://events.txstate.edu/">
                  More Events<i class="button-chevron fa fa-chevron-right"></i>
                </a>
              </div>
                  
              <div id="tabpanel-dates" aria-labelledby="tab-dates" role="tabpanel" aria-hidden="true" style="display:none;">
                <ul>
                  <li class="event">
                    <p class="event-title"><a href="#nowhere">Tuition Due</a></p>
                    <p class="event-date">
                      <a href="#nowhere">
                        <span class="month">Oct</span>
                        <span class="day">10</span>
                      </a>
                    </p>
                  </li>
                  <li class="event">
                    <p class="event-title"><a href="#nowhere">Last Day to Drop Full Term Class</a></p>
                    <p class="event-date">
                      <a href="#nowhere">
                        <span class="month">Oct</span>
                        <span class="day">25</span>
                      </a>
                    </p>
                  </li>
                  <li class="event">
                    <p class="event-title"><a href="#nowhere">Thanksgiving Break Begins</a></p>
                    <p class="event-date">
                      <a href="#nowhere">
                        <span class="month">Nov</span>
                        <span class="day">25</span>
                      </a>
                    </p>
                  </li>
                </ul>
                  
                <a class="more-events more-imp-dates" 
                  href="http://www.registrar.txstate.edu/persistent-links/academic-calendar">
                  More Important Dates<i class="button-chevron fa fa-chevron-right"></i>
                </a>
              </div>

              <div class="cal-jumps">
                <h3>Jump to a calendar</h3>
                <ul>
                  <li><a href="http://www.registrar.txstate.edu/persistent-links/academic-calendar.html">Academic</a></li>
                  <li><a href="http://www.txstatebobcats.com/calendar.aspx?vtype=list">Athletics</a></li>
                  <li><a href="http://events.txstate.edu/">Events</a></li>
                </ul>
              </div>
                
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  </div>
</div>
