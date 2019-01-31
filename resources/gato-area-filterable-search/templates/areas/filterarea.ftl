<div class="filter-container" id="filter-container">
  <div class="search-container">
    <label for="search-field" class="visuallyhidden">Search ${ctx.description?has_content?then(ctx.description, "List Items")}</label>
    <input id="search-field" type="search" class="fs-search" placeholder="Search ${ctx.description?has_content?then(ctx.description, "")}" autocomplete="off"/>
    <button class="btn-clear-search-field"><i class="fa fa-times" aria-hidden="true"></i><span class="visuallyhidden">Clear Search Text</span></button>
    <button class="btn-search-list-items"><i class="fa fa-search"></i><span class="visuallyhidden">Start Search</span></button>
  </div>
  <div class="filter-groups">
    <div class="mobile-close-modal">
      <button class="btn-close-modal">
        <i class="fa fa-close" aria-hidden="true" aria-label="Close Filters"></i>
        <span>CLOSE</span>
      </button>
    </div>
    <span class="filter-by">Filter by:</span>
    <ul class= "filter-group-list">
    [#list components as component]
      <li>[@cms.component content=component /]</li>
    [/#list]
    [#if cmsfn.isEditMode()]
    <li><div class="filter-group-add" cms:add="bar"></div></li>
    [/#if]
    </ul>
    <div class="reset-and-resultcount">
      <button class="btn-clear-filters fs-button"><i class="fa fa-refresh" aria-hidden="true"></i>Reset</button>
      <div id="mobile-result-count">14 of 101 results</div>
    </div>
    <div class="apply-filters-spacer"></div>
    <div class="apply-filters">
      <button class="btn-apply-filters">Apply Filters</button>
    </div>
  </div>
</div>
