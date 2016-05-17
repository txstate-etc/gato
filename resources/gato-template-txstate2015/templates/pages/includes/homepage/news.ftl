[#assign slides = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/features/news-feature', 'gatoapps'))]
[#assign slides = cmsfn.children(slides, "mgnl:component")]
[#assign aspectratio = 1080.0/400.0]
[#assign news = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/news-links', 'gatoapps'))]
[#assign news = cmsfn.children(news, "mgnl:component")]
[#assign events = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/events-dates/events', 'gatoapps'))]
[#assign events = gf.nonDeletedChildren(events, "mgnl:component")]
[#assign dates = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/events-dates/dates', 'gatoapps'))]
[#assign dates = cmsfn.children(dates, "mgnl:component")]

[#macro eventTime h m a]
  [#local m = (m?number)!0]
  [#if m == 0]
    ${h} ${a}
  [#else /]
    ${h}:${m?string['00']} ${a}
  [/#if]
[/#macro]

[#macro eventList list showTime]
  <ul>
    [#local count = 0]
    [#list list?sort_by('startdate') as component]
      [#if count gte 3][#break /][/#if]
      [#if isEnabled(component) && gf.inFuture(component.startdate, component.enddate)]
        [#local count = count + 1]
        <li class="event">
          <p class="event-title">
            <a href="${gf.filterUrl(component.link)}">${component.title}</a>
          </p>
          <p class="event-date">
            <a href="${gf.filterUrl(component.link)}">
              
            [#if !component.enddate?has_content || '${component.enddate?date}' == '${component.startdate?date}']
              <span class="month">${component.startdate?string['MMM']}</span>
              <span class="day">${component.startdate?string['d']}</span>
            [#else /]
              [#assign startPeriod = (component.startdate?string['MMM'] == "May")?string("",".")]  
              <span class="range-start">${component.startdate?string['MMM${startPeriod} d']}</span>
              <span class="range-to">to</span>
              [#assign endPeriod = (component.enddate?string['MMM'] == "May")?string("",".")]
              <span class="range-end">${component.enddate?string['MMM${endPeriod} d']}</span>
            [/#if]

            </a>
          </p>

          [#if showTime]
            <p class="event-time">
              [@eventTime component.starttimehour!'8'
                component.starttimeminute!'00'
                component.starttimeampm!'a.m.' /] – 
              [@eventTime component.endtimehour!'5' 
                component.endtimeminute!'00' 
                component.endtimeampm!'p.m.' /]
            </p>
          [/#if]
        </li>
        [/#if]
    [/#list]
  </ul>
[/#macro]

<div id="news" class="content-row main two-col">
  <div class="content-row-content">
    
    <div class="content-row-column">
      <div class="col-left news">
        
        <h2>News</h2>
        
        <div class="news-slider-wrap">
          <div class="slides">

            [#assign count = 0]
            [#list slides as component]
              [#if count gte 1][#break /][/#if]
              [#if isEnabled(component)]
                [#assign count = count + 1]

                <figure id="news-feature" class="feature">
                  
                  [#if component.link?has_content]
                    <a class="image-link" href="${component.link}">
                  [/#if]
                      <img src="${gf.getImgDefault(component.image, aspectratio)}" srcset="${gf.getSrcSet(component.image, aspectratio)}" alt="${component.alttext!}">
                  [#if component.link?has_content]
                    </a>
                  [/#if]
                  
                  <figcaption>
                  
                    [#if component.supertext?has_content]
                      <p class="feature-date">${component.supertext}</p>
                    [/#if]
                                        
                    [#if component.title?has_content]
                      <p class="feature-headline">

                        [#if component.link?has_content]
                          <a href="${gf.filterUrl(component.link)}">
                        [/#if]
                            ${component.title}
                        [#if component.link?has_content]
                          </a>
                        [/#if]
                        
                      </p>
                    [/#if]

                  </figcaption>
                </figure>

              [/#if]
            [/#list]
            
          </div>
        </div>

        <div id="news-links">
          [#assign count = 0]
          [#list news as component]
            [#if count gte 3][#break /][/#if]
            [#if isEnabled(component)]
              [#assign count = count + 1]
              <p><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.title, component.link)}</a></p>
            [/#if]
          [/#list]
        </div>

        <div id="news-jump">
            
          <div class="solo-bailout">
            <p>
              <a id="news-service" href="/news-archive" class="solo-bailout-button">
                News Archive<i class="button-chevron fa fa-chevron-right"></i>
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
    
    <div class="content-row-column events-wrap">
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
              [@eventList events true /]

              <a class="more-events" href="http://events.txstate.edu/">
                More Events<i class="button-chevron fa fa-chevron-right"></i>
              </a>
            </div>
                
            <div id="tabpanel-dates" aria-labelledby="tab-dates" role="tabpanel" aria-hidden="true" style="display:none;">
              [@eventList dates false /]
                
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
