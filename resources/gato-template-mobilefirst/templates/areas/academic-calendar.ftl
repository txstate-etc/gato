<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="academic-calendar-container">
      <div class="ac-filters">
        <div class="filters">
          <div class="shown">
            <div class="ac-filter">
              <div id="lbl-audience">Audience</div>
              <div class="ac-dropdown">
                <div class="dropdown-controls">
                  <ul class="selected-filters">
                    <li class="filter">
                      All
                      <button class="remove-filter"><i class="fa fa-close" aria-label="Remove filter all"></i></button>
                    </li>
                  </ul>
                  <button class="remove-all-filters"><i class="fa fa-close" aria-label="Remove all audience filters"></i></button>
                  <button class="toggle-dropdown"><i class="fa fa-caret-down" aria-label="View audience options"></i></button>
                </div>
                <ul class="menu">
                  <li>All</li>
                  <li>Student</li>
                  <li>Faculty</li>
                  <li>Staff</li>
                </ul>
              </div>
            </div>
            <div class="ac-filter">
              <label for="ac-semester">Semester</label>
              <select id="ac-semester"></select>
            </div>
            <div class="ac-filter">
              <label for="ac-termpart">Part of Term</label>
              <select id="ac-termpart"></select>
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
              <label for="ac-category">Category</label>
              <select id="ac-category"></select>
            </div>
          </div>
        </div>
        <div class="actions">
          <div>
            <button id="btn-toggle-more-filters" class="btn-ac" aria-haspopup="true" aria-expanded="false" aria-controls="more-filters">
              <span>Show more filters</span>
              <i class="fa" aria-hidden="true"></i>
            </button>
            <button id="btn-reset-filters" class="btn-ac">Reset Filters</button>
            <button id="btn-go" class="btn-ac">Go</button>
          </div>
          <div>
            <button id="btn-subscribe" class="btn-ac">
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                Subscribe
            </button>
            <span>Download and Print <i class="fa fa-caret-down" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
      <button id="btn-manage-events" class="btn-ac">
        <i class="fa fa-calendar" aria-hidden="true"></i>
        Manage Events
      </button>
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
            <td>${item.humanStartDate}</td>
            <td>
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