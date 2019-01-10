<div class="filter-container" id="filter-container">
  <div class="search-container">
    <label for="search-field" class="visuallyhidden">Search List Items</label>
    <input id="search-field" type="search" class="fs-search" placeholder="Search"/>
    <button><i class="fa fa-search"></i></button>
  </div>
  <div class="filter-groups">
    <div class="mobile-close-modal">
      <button class="btn-close-modal">
        <i class="fa fa-close" aria-hidden="true" aria-label="Close Filters"></i>
        <span>CLOSE</span>
      </button>
    </div>
    <span class="filter-by">Filter by:</span>
    <ul>
    [#list components as component]
      <li>[@cms.component content=component /]</li>
    [/#list]
    [#if cmsfn.isEditMode()]
    <li><div cms:add="bar"></div></li>
    [/#if]
    </ul>
    <button class="btn-clear-filters fs-button"><i class="fa fa-refresh" aria-hidden="true"></i>Reset</button>
    <div class="apply-filters-spacer"></div>
    <div class="apply-filters">
      <button class="btn-apply-filters">Apply Filters</button>
    </div>
  </div>
</div>
