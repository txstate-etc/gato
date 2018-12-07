<div class="filter-container" id="filter-container">
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
