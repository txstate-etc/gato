[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern">
    <div class="pattern-content single arrow title-type text-center importantdates">
      <div class="centered content-flex">
        <div class="left-col">
          <h2 class="title">${content.title}</h2>
          [#if content.link?has_content]
          <div class="links">
            <ul>
              <li>
              [#include "/gato-template/templates/components/link.ftl"]
              </li>
            </ul>
          </div>
          [/#if]
        </div>
        [#if content.input == "events"]
          [#if content.events?has_content]
          <div class="events">
              [#list cmsfn.children(content.events) as event]
                <div class="event">
                [#assign eventTitle = (event.title?length > 50)?then(event.title?substring(0, 50)+"...", event.title)]
                  <div class="date">
                  <!--Get day of the month-->
                      <div class="day">${event.date?string["d"]}</div> 
                      <div class="month">${event.date?string["MMM"]?upper_case}</div>
                    </div>
                  <div class="links">
                    <ul>
                      <li>
                        [#if !gf.isEmptyString(event.link)]
                          <a href="${gf.filterUrl(event.link)}">${eventTitle}</a>
                        [#else]
                          ${eventTitle}
                        [/#if]
                      </li>
                    </ul>
                  </div>
                </div>
              [/#list]
            </div>
          [/#if]
        [#elseif content.input == "calendarId"]
          <div class="events">
              [#list model.items as event]
                <div class="event">
                  [#assign eventTitle = (event.title?length > 50)?then(event.title?substring(0, 50)+"...", event.title)]
                  [#assign startDate = event.startDate]
                  [#assign endDate = event.endDate]
                  [#assign allDay = event.allDay!false]
                  [#if allDay && event.endDate?time?string['HH:mm'] == "00:00" ]
                    [#assign endDate = model.fixAllDayEventEndDate(event.endDate)]
                  [/#if]
                  [#if startDate?date?string == endDate?date?string]
                    <div class="date">
                      <div class="day">${startDate?string["d"]}</div> 
                      <div class="month">${startDate?string["MMM"]?upper_case}</div>
                    </div>
                  [#else]
                    <div class="date-span">
                      <div class="date">
                        <div class="day">${startDate?string["d"]}</div> 
                        <div class="month">${startDate?string["MMM"]?upper_case}</div>
                      </div>
                      <span class="dash"> - </span>
                      <div class="date">
                        <div class="day">${endDate?string["d"]}</div> 
                        <div class="month">${endDate?string["MMM"]?upper_case}</div>
                      </div>
                    </div>
                  [/#if]
                  <div class="links">
                    <ul>
                      <li>
                      [#if !gf.isEmptyString(event.link)]
                        <a href="${gf.filterUrl(event.link)}">${eventTitle}</a>
                      [#else]
                        ${eventTitle}
                      [/#if]
                      </li>
                    </ul>
                  </div>
                </div>
                [#if event?counter == 3]
                  [#break]
                [/#if]
              [/#list]
            </div>        
        [/#if]  
        </div>
      </div>
  </div>
[/@prebuiltsection]