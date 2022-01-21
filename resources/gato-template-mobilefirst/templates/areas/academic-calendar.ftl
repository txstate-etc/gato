<div class="gato-section-full">
  <div class="gato-section-centered">
    [#attempt ]
    [#assign eventList = model.items]
    <div class="academic-calendar-container">
      [#assign currentSemester = model.guessCurrentSemester()]
      [#assign defaultPartOfTerm = "Main Parts of Term"]
      <div id="currentSemester" data-semester="${currentSemester}"></div>
      <div id="calendarTimestamp" data-time="${.now?iso_utc}"></div>
      <div id="defaultPartOfTerm" data-term="${defaultPartOfTerm}"></div>
      [#if eventList?size > 0]
        <div id="calendarActionUrl" data-url="${eventList[0].calendarUrl?keep_before_last('/')}"></div>
        <div id="calendarSubscribeUrl" data-url="${eventList[0].calendarUrl?keep_before_last('/actions')}"></div>
      [/#if]
      <div id="calendarUrl" data-url=""></div>
      <div class="ac-filters">
        <div class="filter-row top eq-parent">
          <div class="ac-filter audience">
            <label id="lbl-audience">Audience</label>
            <div id="select-audience" tabindex="0" class="ac-dropdown multiple" aria-labelledby="lbl-audience" role="button" aria-haspopup="listbox" aria-expanded="false" aria-owns="audience-menu" aria-describedby="audience-info">
              <div class="input">
                <div class="text">Select a few...</div>
                <ul class="selected-items" role="listbox" aria-label="Selected Audiences">
                </ul>
                <div class="actions">
                  <button class="remove-all-filters" tabindex="-1">
                    <i class="fa fa-close" aria-hidden="true"></i>
                    <span class="visuallyhidden">Remove all audience filters</span>
                  </button>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
              </div>
              <ul id="audience-menu" class="menu" role="listbox">
              </ul>
              <div id="audience-info" class="info visuallyhidden">
                <span class="count">0 items selected</span>
                <span>&nbsp;use up and down arrows to browse choices, left and right to hilite previous choices, backspace to delete choices</span>
              </div>
            </div>
          </div>
          <div class="ac-filter">
            <label id="lbl-semester">Semester</label>
            <div id="select-semester" class="ac-dropdown" tabindex="0" aria-labelledby="lbl-semester" role="button" aria-haspopup="listbox" aria-expanded="false" aria-owns="semester-menu">
              <div class="input">
                <div class="text">Choose...</div>
                <i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              <ul id="semester-menu" class="menu" role="listbox">
              </ul>
            </div>
          </div>
          <div class="ac-filter">
            <label id="lbl-partofterm">Part of Term</label>
            <div id="select-partofterm" class="ac-dropdown" tabindex="0" aria-labelledby="lbl-partofterm" role="button" aria-haspopup="listbox" aria-expanded="false" aria-owns="pot-menu">
              <div class="input">
                <div class="text">Choose...</div>
                <i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              <ul id="pot-menu" class="menu" role="listbox">
              </ul>
            </div>
          </div>
          <div class="filter-actions eq-parent">
            <div class="mobile-showing-message">
              <span class="showing">Showing:</span>
              <span class="currentview">${currentSemester} Semester, ${defaultPartOfTerm}</span>
            </div>
            <button id="btn-toggle-more-filters" class="btn-ac" aria-haspopup="true" aria-expanded="false" aria-owns="more-filters">
              <i class="fa fa-filter" aria-hidden="true"></i>
              <span><span class="visuallyhidden">Show</span>More filters</span>
              <i class="arrow fa" aria-hidden="true"></i>
            </button>
            <button id="btn-more-filters-mobile" class="btn-ac" aria-haspopup="dialog">
              <i class="fa fa-filter" aria-label="Show More Filters"></i>
              <span aria-hidden="true">Filters</span>
            </button>
            <button id="btn-reset-filters" class="btn-ac">Reset All</button>
            <button id="btn-go" class="btn-ac">Go</button>
          </div>
        </div>
        <div class="filter-row bottom">
          <div class="ac-filter date">
            <label for="ac-startdate">Start Date</label>
            <input type="date" id="ac-startdate"/>
          </div>
          <div class="ac-filter date">
            <label for="ac-enddate">End Date</label>
            <input type="date" id="ac-enddate"/>
          </div>
          <div class="ac-filter category">
            <label id="lbl-category">Category</label>
            <div id="select-category" class="ac-dropdown multiple" tabindex="0" aria-labelledby="lbl-category" role="button" aria-haspopup="listbox" aria-expanded="false" aria-owns="category-menu" aria-describedby="category-info">
              <div class="input">
                <div class="text">Select a few...</div>
                <ul class="selected-items" role="listbox" aria-label="Selected Categories">
                </ul>
                <div class="actions">
                  <button class="remove-all-filters" tabindex="-1">
                    <i class="fa fa-close" aria-hidden=true></i>
                    <span class="visuallyhidden">Remove all category filters</span>
                  </button>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
              </div>
              <ul id="category-menu" class="menu" role="listbox">
              </ul>
              <div id="category-info" class="info visuallyhidden">
                <span class="count">0 items selected</span>
                <span>&nbsp;use up and down arrows to browse choices, left and right to hilite previous choices, backspace to delete choices</span>
              </div>
            </div>
          </div>
          <div class="filter-actions">
            <div class="subscribe-container">
              <button id="btn-subscribe" class="btn-ac" aria-describedby="subscribe-tooltip">
                <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                Subscribe
              </button>
              <span id="subscribe-tooltip" class="tooltip">Save <strong>all filtered</strong> events to your calendar, including any changes made.</span>
              <div id="subscribe-help" tabindex="0" role="button">
                <i class="fa fa-question-circle" aria-hidden="true"></i>
                <span class="visuallyhidden">More information about subscribing</span>
              </div>
            </div>
            <div id="select-download-print" class="ac-dropdown" tabindex="0" aria-label="Download and Print menu" role="button" aria-haspopup="listbox" aria-expanded="false" aria-owns="download-print-menu">
              <div class="input">
                <div class="text">Download and Print</div>
                <i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              <ul id="download-print-menu" class="menu" role="listbox">
                <li role="option" tabindex="-1"><a href="#" aria-label="printable version opens in a new tab or window">Printable Version</a></li>
                <li role="option" tabindex="-1"><a href="#">Download CSV</a></li>
              </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="events-flex-container">
          <table class="event-table">
            <thead>
              <tr>
                <th class="date-header">Date</th>
                <th class="event-header">Event</th>
              </tr>
            </thead>
            <tbody>
            [#assign thisyear = .now?date?string["yyyy"]]
            [#list eventList as item]
              [#assign hasEndTitle = !gf.isEmptyString(item.getEndingTitle())]
              [#assign isOneDay = (item.startDate?string['yyyy-MM-dd'] == item.endDate?string['yyyy-MM-dd'])]
              [#assign start = item.startDate]
              [#assign end = item.endDate]
              [#if item.allDay]
                [#if isOneDay]
                  [#-- adjust end date for trumba all day issue --]
                  [#if item.endDate?time?string['HH:mm'] == "00:00"]
                    [#assign end = model.fixAllDayEventEndDate(end)]
                  [/#if]
                  [#if hasEndTitle && item.title == item.getEndingTitle()]
                    [#if item.startDate?time?string['HH:mm'] == "00:00"]
                      [#assign start = model.fixAllDayEventEndDate(start)]
                    [/#if]
                  [/#if]
                [#else]
                  [#if hasEndTitle]
                    [#if item.title == item.getEndingTitle()]
                      [#-- This is an ending event --]
                      [#if item.endDate?time?string['HH:mm'] == "00:00"]
                        <!-- not working. start is wrong-->
                        [#assign start = model.fixAllDayEventEndDate(start)]
                        [#assign end = model.fixAllDayEventEndDate(end)]
                      [/#if]
                    [#else]
                      [#-- This is a starting event --]
                      [#assign end = start]
                    [/#if]
                  [#else]
                    [#-- adjust end date for trumba all day issue --]
                    [#if item.endDate?time?string['HH:mm'] == "00:00"]
                      [#assign end = model.fixAllDayEventEndDate(end)]
                    [/#if]
                  [/#if]
                [/#if]
              [#else]
                [#if !isOneDay]
                  [#if hasEndTitle]
                    [#assign end = start]
                  [/#if]
                [/#if]
              [/#if]
              <tr class="row ${(item.applicableTerm?contains(currentSemester) && item.partsOfTerm?seq_contains(defaultPartOfTerm))?then('', 'row-hidden')}" aria-hidden="${(item.applicableTerm?contains(currentSemester) && item.partsOfTerm?seq_contains(defaultPartOfTerm))?then('false', 'true')}">
                <td>
                  <div class="date-column">
                    <span class="event-cbx" data-value="${item.recurrenceId}" tabindex="0" role="checkbox" aria-checked="false" aria-label="Select event: ${item.title}"></span>
                    <div class="date">
                      <span>${start?string["MMMM d"]}${model.dateSuffix(start)}</span>
                      [#assign year=start?string["EEEE, yyyy"]]
                      <div class="eventyear">${year}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="event-data"
                      data-audiences="${item.audiences?join(';')}"
                      data-semester="${item.applicableTerm}"
                      data-partsofterm="${item.partsOfTerm?join(';')}"
                      data-categories="${item.filterCategories?join(';')}"
                      data-startdate="${start?string['yyyy-MM-dd']}"
                      data-enddate="${end?string('yyyy-MM-dd')}"></div>
                  <div class="event-details" style="display: flex; flex-direction: column;">
                    [#if !gf.isEmptyString(item.link)]
                      <a class="event-link" href="${item.link}" target="_blank" title="open in new tab or window">
                    [/#if]
                    <div class="event-title">${item.title}</div>
                    [#if !gf.isEmptyString(item.link)]
                      </a>
                    [/#if]
                    [#if item.description?has_content]
                      <div class="event-description">${item.description}</div>
                    [/#if]
                </div>
                </td>
              </tr>
            [/#list]
            </tbody>
          </table>
          <div class="manage-events-container">
            <div id="select-manage-events" class="ac-dropdown" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-owns="manage-events-menu" aria-describedby="manage-tooltip">
              <div class="input">
                <div class="text">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                  Manage Events
                </div>
              </div>
              <ul id="manage-events-menu" class="menu" role="listbox">
                <li role="option" tabindex="-1" data-action="atmc">Add to my Calendar</li>
                <li role="option" tabindex="-1" data-action="myevents">My Events</li>
                <li role="option" tabindex="-1" data-action="remindemail">Email Reminder</li>
                <li role="option" tabindex="-1" data-action="notify">Email me Event Updates</li>
                <li role="option" tabindex="-1" data-action="forward">Email to Friends</li>
              </ul>
            </div>
            <div id="manage-help" tabindex="0">
              <i class="fa fa-question-circle" aria-label="More information about managing events"></i>
            </div>
            <span id="manage-tooltip" class="tooltip">Save <strong>selected</strong> events to your calendar.</span>
          </div>
        </div>
        <div class="empty-message">
          <h2>No Results Found</h2>
          <p>Please refine your filters and try again.</p>
        </div>
        <div id="mobile-manage-events">
          <div class="flex-container">
            <button id="btn-mobile-manage-events" class="btn-ac" aria-describedby="manage-tooltip">
              <i class="fa fa-calendar" aria-hidden="true"></i>
              Manage Events
            </button>
          </div>
        </div>
      </div>
    [#recover]
      <!--  ACADEMIC-CALENDAR-ERROR-33N2SXV1UAXJU3K -->
    [/#attempt]
  </div>
</div>

