<div class="global-search">
  <div class="search-container global web" id="search-results">
    <form class="search-form">
      <label for="gato-search-input" class="visuallyhidden">Search Terms</label>
      <input type="text" class="search" name="q" value="" id="gato-search-input"></input>
      <button class="icon magnify"><i class="fa fa-search" aria-label="Start Search" aria-hidden="true"></i><span class="visuallyhidden">Start Search</span></button>
      <button class="icon reset"><i class="fa fa-times" aria-label="Reset Search" aria-hidden="true"></i><span class="visuallyhidden">Reset Search</span></button>
    </form>
    <div class="search-result-columns">
      <div class="search-column-main eq-parent">
        <ul class="search-tabs" role="tablist">
          <li id="search-tab-web" class="search-tab-web" role="tab" tabindex="0">Web</li>
          <li id="search-tab-people" class="search-tab-people" role="tab" tabindex="0">People</li>
        </ul>
        <div class="search-web results-list" role="tabpanel" aria-labelledby="search-tab-web"></div>
        <div class="search-people results-list" role="tabpanel" aria-labelledby="search-tab-people"></div>
      </div>
      <div class="search-column-side">
        <div class="search-side-box search-side-people">
          <h2>People</h2>
          <div class="search-side-results"></div>
        </div>
        [#if cmsfn.isEditMode()]
            <div class="feedback-add" cms:add="box"></div>
          [/#if]
        <div class="search-side-box search-feedback [#if cmsfn.isEditMode()]edit[/#if]">
          <h2>Search Feedback</h2>
          [#if component?has_content]
            <div class="search-feedback-content">
              [@cms.component content=component /]
            </div>
          [/#if]
        </div>
      </div>
    </div>
  </div>
</div>