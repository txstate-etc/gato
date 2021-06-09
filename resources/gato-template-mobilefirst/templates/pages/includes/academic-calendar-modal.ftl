<div id="mobile-calendar-modal" role="dialog" aria-modal="true">
        <div class="instructions">Select all that apply</div>
        <div tabindex="0" class="focusstart sr-only"></div>
        <div class="content">
          <div class="invisible-focus" tabindex="-1"></div>
          <div id="lbl-mobile-audience" class="filter-label">Audience</div>
          <ul id="mobile-audience" class="mobile-filter-group" role="group" aria-labelledby="lbl-mobile-audience" data-filter="audience">
            <li>
              <div class="mobile-filter-cbx" role="checkbox" tabindex="0">Students</div>
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
          <div class="mobile-semester-partofterm-container">
            <div class="mobile-semester">
              <div id="lbl-mobile-semester" class="filter-label">Semester</div>
               <div id="mobile-select-semester" class="ac-dropdown" tabindex="0" aria-labelledby="lbl-mobile-semester" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="mobile-semester-menu">
                <div class="input">
                  <div class="text">Choose...</div>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
                <ul id="mobile-semester-menu" class="menu" role="listbox">
                </ul>
              </div>
            </div>
            <div class="mobile-partofterm">
              <div id="lbl-mobile-partofterm" class="filter-label">Part of Term</div>
              <div id="mobile-select-partofterm" class="ac-dropdown" tabindex="0" aria-labelledby="lbl-mobile-partofterm" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="mobile-partofterm-menu">
                <div class="input">
                  <div class="text">Choose...</div>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
                <ul id="mobile-partofterm-menu" class="menu" role="listbox">
                  <li>Test</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="divider">
            <div></div>
          </div>
          <div id="lbl-mobile-category" class="filter-label">Category</div>
          <ul id="mobile-category" class="mobile-filter-group" role="group" aria-labelledby="lbl-mobile-category" data-filter="category">
          </ul>
          <div class="divider">
            <div></div>
          </div>
          <div class="filter-label">Specific Dates</div>
          <div class="mobile-dates">
            <label for="mobile-startdate" class="visuallyhidden">Start Date</label>
            <input id="mobile-startdate" class="mobile-date" type="date" placeholder="Start">
            <label for="mobile-enddate" class="visuallyhidden">End Date</label>
            <input id="mobile-enddate" class="mobile-date" type="date" placeholder="End">
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
            <button id="mobile-filter-cancel" class="btn-ac">Cancel</button>
            <button id="mobile-filter-reset" class="btn-ac">Reset</button>
            <button id="mobile-filter-go" class="btn-ac">Go</button>
          </div>
        </div>
        <div tabindex="0" class="focusend sr-only"></div>
      </div>