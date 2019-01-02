<div class="filter-container" id="filter-container">
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
  </div>
  <div class="apply-filters">
    <button class="btn-apply-filters">Apply Filters</button>
  </div>
</div>
