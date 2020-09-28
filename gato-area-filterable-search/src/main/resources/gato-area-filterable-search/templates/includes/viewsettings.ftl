<div class="controls">
  <button class="btn-toggle-filters" aria-haspopup="true" aria-expanded="false" aria-controls="filter-container" aria-label="Search Filters">
    <i class="fa" aria-hidden="true"></i>
    <span class="label"></span>
    <span class="filter-count"></span>
  </button>
  [#assign defaultView = view!'list-view']
  [#assign showBothViews = false]
  [#if (defaultView == 'list-view' && showGrid!false) || (defaultView == 'grid-view' && showList!false)]
    [#assign showBothViews = true]
  [/#if]
  
  [#if showBothViews]
    <div class="toggle-view">
      <button class="btn-list-view fs-button" [#if defaultView == "list-view"]disabled="disabled"[/#if] aria-label="Switch to List View">
        <i class="fa fa-list" aria-hidden="true"></i>List View
      </button>
      <button class="btn-grid-view fs-button" [#if defaultView == "grid-view"]disabled="disabled"[/#if] aria-label="Switch to Grid View">
        <i class="fa fa-th" aria-hidden="true"></i>Grid View
      </button>
    </div>
  [/#if]
</div>
