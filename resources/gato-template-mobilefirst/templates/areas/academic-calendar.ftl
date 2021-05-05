<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="academic-calendar-container">
      <div class="ac-filters">
        <div class="filters">
          <div class="shown">
            <div class="ac-filter desktop">
              <div id="lbl-audience">Audience</div>
              <div id="select-audience" class="ac-dropdown multiple">
                <div class="dropdown-controls">
                  <ul class="selected-filters">
                    <li id="active-audience-all" class="filter">
                      All
                      <button class="remove-filter"><i class="fa fa-close" aria-label="Remove filter all"></i></button>
                    </li>
                  </ul>
                  <div class="filter-actions">
                    <button class="remove-all-filters"><i class="fa fa-close" aria-label="Remove all audience filters"></i></button>
                    <button class="toggle-dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="audience-menu">
                      <i class="fa fa-caret-down" aria-label="View audience options"></i>
                    </button>
                  </div>
                </div>
                <ul id="audience-menu" class="menu">
                  <li tabindex="-1">
                    <span id="audience-all" class="filter-cbx" tabindex="0" role="checkbox" aria-checked="false" aria-labelledby="lblaudience-all" data-name="All"></span>
                    <div id="lblaudience-all" class="filter-label">All</div>
                  </li>
                  <li tabindex="-1">
                    <span id="audience-student" class="filter-cbx" tabindex="0" role="checkbox" aria-checked="false" aria-labelledby="lblaudience-student" data-name="Student"></span>
                    <div id="lblaudience-student" class="filter-label">Student</div>
                  </li>
                  <li tabindex="-1">
                    <span id="audience-faculty" class="filter-cbx" tabindex="0" role="checkbox" aria-checked="false" aria-labelledby="lblaudience-faculty" data-name="Faculty"></span>
                    <div id="lblaudience-faculty" class="filter-label">Faculty</div>
                  </li>
                  <li tabindex="-1">
                    <span id="audience-staff" class="filter-cbx" tabindex="0" role="checkbox" aria-checked="false" aria-labelledby="lblaudience-faculty" data-name="Staff"></span>
                    <div id="lblaudience-staff" class="filter-label">Staff</div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="ac-filter">
              <label>Semester</label>
              <div id="select-semester" class="ac-dropdown">
                <div class="dropdown-controls">
                  <div class="selected-value">Please Select</div>
                  <div class="filter-actions">
                    <button class="toggle-dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="semester-menu">
                      <i class="fa fa-caret-down" aria-label="View semester options"></i>
                    </button>
                  </div>
                </div>
                <ul id="semester-menu" class="menu">
                </ul>
              </div>
            </div>
            <div class="ac-filter">
              <label>Part of Term</label>
              <div id="select-partofterm" class="ac-dropdown">
                <div class="dropdown-controls">
                  <div class="selected-value">Please Select</div>
                  <div class="filter-actions">
                    <button class="toggle-dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="pot-menu">
                      <i class="fa fa-caret-down" aria-label="View Part of Term options"></i>
                    </button>
                  </div>
                </div>
                <ul id="pot-menu" class="menu">
                </ul>
              </div>
            </div>
          </div>
          <div id="more-filters" class="more">
            <div class="ac-filter">
              <label for="ac-startdate">Start Date</label>
              <input type="date" id="ac-startdate"/>
            </div>
            <div class="ac-filter">
              <label for="ac-enddate">End Date</label>
              <input type="date" id="ac-enddate"/>
            </div>
            <div class="ac-filter">
              <div id="lbl-category">Category</div>
              <div class="ac-dropdown multiple">
                <div class="dropdown-controls">
                  <ul class="selected-filters">
                  </ul>
                  <div class="filter-actions">
                    <button class="remove-all-filters"><i class="fa fa-close" aria-label="Remove all category filters"></i></button>
                    <button class="toggle-dropdown" aria-haspopup="true" aria-expanded="false" aria-control="audience-menu">
                      <i class="fa fa-caret-down" aria-label="View category options"></i>
                    </button>
                  </div>
                </div>
                <ul id="category-menu" class="menu">
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div>
            <button id="btn-toggle-more-filters" class="btn-ac" aria-haspopup="true" aria-expanded="false" aria-controls="more-filters">
              <span>Show more filters</span>
              <i class="fa" aria-hidden="true"></i>
            </button>
            <button id="btn-more-filters-mobile" class="btn-ac">
              <i class="fa fa-filter" aria-label="Show More Filters"></i>
              <span aria-hidden="true">More filters</span>
            </button>
            <button id="btn-reset-filters" class="btn-ac">Reset Filters</button>
            <button id="btn-go" class="btn-ac">Go</button>
          </div>
          <div class="subscribe-download">
            <button id="btn-subscribe" class="btn-ac">
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                Subscribe
            </button>
            <div id="select-download-print" class="ac-dropdown">
              <div class="dropdown-controls">
                <div class="text">Download and Print</div>
                <div class="dp-actions">
                  <button class="toggle-dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="download-print-menu">
                    <i class="fa fa-caret-down" aria-label="View download and print options"></i>
                  </button>
                </div>
              </div>
              <ul id="download-print-menu" class="menu">
                <li tabindex="-1"><a href="#">Printable Version</a></li>
                <li tabindex="-1"><a href="#">Download CSV</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="manage-events-container">
        <button id="btn-manage-events" class="btn-ac" aria-haspopup="true" aria-expanded="false" aria-controls="manage-events-menu">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          Manage Events
        </button>
        <ul id="manage-events-menu">
          <li tabindex="-1" data-action="atmc">Add to my Calendar</li>
          <li tabindex="-1" data-action="myevents">My Events</li>
          <li tabindex="-1" data-action="remindemail">Email Reminder</li>
          <li tabindex="-1" data-action="notify">Email me Event Updates</li>
          <li tabindex="-1" data-action="forward">Email to Friends</li>
        </ul>
      </div>
      <table class="event-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
        [#list model.items as item]
          <tr>
            <td>
              <span class="event-cbx" data-value="${item.recurrenceId}" tabindex="0" role="checkbox" aria-checked="false" aria-label="Select event: ${item.title}"></span>
              [#assign startDate = item.machineStartDate?datetime("yyyy-MM-dd'T'HH:mm:ssZ")]
              ${startDate?string["MMMM d"]}${model.dateSuffix(item.startDate)}
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
    </div>
  </div>
</div>

