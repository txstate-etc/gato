<div class="gato-section-full">
  <div class="gato-section-centered">
  <div style="background-color: #EBC2EB; padding: 2rem">
    [#assign parent = cmsfn.parent(content, "mgnl:page")]
    Pulling dates from ${parent.firstSemesterShown!} to ${parent.lastSemesterShown!}
    <br></br>
    Current semester is ${model.guessCurrentSemester()}
  </div>
    <div class="academic-calendar-container">
      <div id="currentSemester" data-semester="${model.guessCurrentSemester()}"></div>
      [#if model.items?size > 0]
        <div id="calendarActionUrl" data-url="${model.items[0].calendarUrl?keep_before_last('/')}"></div>
      [/#if]
      <div id="calendarUrl" data-url=""></div>
      <div class="ac-filters">
        <div class="filter-row top">
          <div class="filter-group">
            <div class="ac-filter desktop">
              <label id="lbl-audience">Audience</label>
              <div id="select-audience" tabindex="0" class="ac-dropdown multiple" aria-labelledby="lbl-audience" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="audience-menu" aria-describedby="audience-info">
                <div class="input">
                  <div class="text">Select a few...</div>
                  <ul class="selected-items">
                  </ul>
                  <div class="actions">
                    <button class="remove-all-filters"><i class="fa fa-close" aria-label="Remove all audience filters"></i></button>
                    <i class="fa fa-caret-down" aria-hidden="true"></i>
                  </div>
                </div>
                <ul id="audience-menu" class="menu" role="listbox">
                  <li id="select-audience-Students" role="option" tabindex="-1">Students</li>
                  <li id="select-audience-Faculty" role="option" tabindex="-1">Faculty</li>
                  <li id="select-audience-Staff" role="option" tabindex="-1">Staff</li>
                </ul>
                <div id="audience-info" class="info visuallyhidden">
                  <span class="count">0 items selected</span>
                </div>
              </div>
            </div>
            <div class="ac-filter">
              <label id="lbl-semester">Semester</label>
              <div id="select-semester" class="ac-dropdown" tabindex="0" aria-labelledby="lbl-semester" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="semester-menu">
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
              <div id="select-partofterm" class="ac-dropdown" tabindex="0" aria-labelledby="lbl-partofterm" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="pot-menu">
                <div class="input">
                  <div class="text">Choose...</div>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
                <ul id="pot-menu" class="menu" role="listbox">
                </ul>
              </div>
            </div>
          </div>
          <div class="action-group">
            <button id="btn-toggle-more-filters" class="btn-ac" aria-haspopup="true" aria-expanded="false" aria-controls="more-filters">
              <i class="fa fa-filter" aria-label="Show More Filters"></i>
              <span>More filters</span>
              <i class="arrow fa" aria-hidden="true"></i>
            </button>
            <button id="btn-more-filters-mobile" class="btn-ac" aria-haspopup="dialog">
              <i class="fa fa-filter" aria-label="Show More Filters"></i>
              <span aria-hidden="true">More filters</span>
            </button>
            <button id="btn-reset-filters" class="btn-ac">Reset Filters</button>
            <button id="btn-go" class="btn-ac">Go</button>
          </div>
        </div>
        <div class="filter-row bottom">
          <div class="filter-group">
            <div class="ac-filter desktop">
              <label for="ac-startdate">Start Date</label>
              <input type="date" id="ac-startdate"/>
            </div>
            <div class="ac-filter desktop">
              <label for="ac-enddate">End Date</label>
              <input type="date" id="ac-enddate"/>
            </div>
            <div class="ac-filter desktop">
              <label id="lbl-category">Category</label>
              <div id="select-category" class="ac-dropdown multiple" tabindex="0" aria-labelledby="lbl-category" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="category-menu" aria-describedby="category-info">
                <div class="input">
                  <div class="text">Select a few...</div>
                  <ul class="selected-items">
                  </ul>
                  <div class="actions">
                    <button class="remove-all-filters"><i class="fa fa-close" aria-label="Remove all category filters"></i></button>
                    <i class="fa fa-caret-down" aria-hidden="true"></i>
                  </div>
                </div>
                <ul id="category-menu" class="menu" role="listbox">
                </ul>
                <div id="category-info" class="info visuallyhidden">
                  <span class="count">0 items selected</span>
                </div>
              </div>
            </div>
          </div>
          <div class="action-group">
            <div class="subscribe-container">
              <button id="btn-subscribe" class="btn-ac">
                <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                Subscribe
              </button>
              <span id="subscribe-tooltip" class="tooltip">Save <strong>all</strong> events to your calendar, including any changes made.</span>
              <div id="subscribe-help" tabindex="0" role="button">
                <i class="fa fa-question-circle" aria-label="More information about subscribing"></i>
              </div>
            </div>
            <div id="select-download-print" class="ac-dropdown" tabindex="0" aria-label="Download and Print menu" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="download-print-menu">
              <div class="input">
                <div class="text">Download and Print</div>
                <i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              <ul id="download-print-menu" class="menu" role="listbox">
                <li role="option" tabindex="-1"><a href="#">Printable Version</a></li>
                <li role="option" tabindex="-1"><a href="#">Download CSV</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="manage-events-container">
        <div id="select-manage-events" class="ac-dropdown" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-controls="manage-events-menu">
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
        <span id="manage-tooltip" class="tooltip">Save <strong>selected</strong> events to your calendar.</span>
        <div id="manage-help" tabindex="0">
          <i class="fa fa-question-circle" aria-label="More information about managing events"></i>
        </div>
      </div>
      <table class="event-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
        [#assign thisyear = .now?date?string["yyyy"]]
        [#list model.items as item]
          <tr>
            <td>
              <div class="date-column">
                <span class="event-cbx" data-value="${item.recurrenceId}" tabindex="0" role="checkbox" aria-checked="false" aria-label="Select event: ${item.title}"></span>
                <div class="date">
                  [#assign startDate = item.machineStartDate?datetime("yyyy-MM-dd'T'HH:mm:ssZ")]
                  ${startDate?string["MMMM d"]}${model.dateSuffix(item.startDate)}
                  [#assign year=startDate?string["yyyy"]]
                  [#if year != thisyear]
                  <div class="eventyear">${year}</div>
                  [/#if]
                </div>
              </div>
            </td>
            </td>
            <td>
              <div class="event-data"
                   data-semester="${item.applicableTerm}"
                   data-partsofterm="${item.partsOfTerm?join(',')}"
                   data-categories="${item.filterCategories?join(',')}"
                   data-startdate="${item.machineStartDate}"
                   data-enddate="${item.machineEndDate}"></div>
              <div style="display: flex; flex-direction: column;">
                <div class="event-title">${item.title}</div>
                [#if item.description?has_content]
                  <div class="event-description">${item.description}</div>
                [/#if]
            </div>
            </td>
          </tr>
        [/#list]
        </tbody>
      </table>
      <div id="mobile-calendar-modal" role="dialog" aria-modal="true">
        <div class="instructions">Select all that apply</div>
        <div tabindex="0" class="focusstart sr-only"></div>
        <div class="content">
          <div class="invisible-focus" tabindex="-1"></div>
          <div class="filter-label">Audience</div>
          <ul id="mobile-audience" class="mobile-filter-group">
            <li>
              <div class="mobile-filter-cbx" role="checkbox" tabindex="0">Student</div>
            </li>
            <li>
              <div class="mobile-filter-cbx" role="checkbox" tabindex="0">Faculty</div>
            </li>
            <li>
              <div class="mobile-filter-cbx" role="checkbox" tabindex="0">Staff</div>
            </li>
          </ul>
          <div class="divider">
            <div></div>
          </div>
          <div class="filter-label">Category</div>
          <ul id="mobile-category" class="mobile-filter-group">
          </ul>
          <div class="divider">
            <div></div>
          </div>
          <div class="filter-label">Specific Dates</div>
          <div class="mobile-dates">
            <label for="mobile-start-date" class="visuallyhidden">Start Date</label>
            <input id="mobile-start-date" class="mobile-date" type="date" placeholder="Start">
            <label for="mobile-end-date" class="visuallyhidden">End Date</label>
            <input id="mobile-end-date" class="mobile-date" type="date" placeholder="End">
          </div>
          <div class="mobile-subscribe-container">
            <button class="toggle-mobile-subscribe" aria-haspopup="true" aria-expanded="false" aria-controls="mobile-subscribe-panel">
              <span>Subscribe to this filtered calendar</span>
              <i class="fa" aria-hidden="true"></i>
            </button>
            <div id="mobile-subscribe-panel">
              <div class="subscribe-icons">
                <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/academic-calendar/netid.svg" alt="Net ID"/>
                <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/academic-calendar/facebook.svg" alt="Facebook logo"/>
                <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/academic-calendar/gmail.svg" alt="Gmail logo"/>
                <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/academic-calendar/outlook.svg" alt="Outlook logo"/>
              </div>
              <div class="subscribe-description">
                Save this filtered academic calendar to your personal calendar by subscribing.
                This includes any updates made to the calendar in the future automatically.
              </div>
              <button id="btn-mobile-subscribe" class="btn-ac">
                <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                Subscribe
              </button>
            </div>
          </div>
          <div class="mobile-filter-buttons">
            <button id="mobile-filter-reset" class="btn-ac">Reset</button>
            <button id="mobile-filter-go" class="btn-ac">Go</button>
          </div>
        </div>
        <div tabindex="0" class="focusend sr-only"></div>
      </div>
    </div>
  </div>
</div>

