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