<div class="filter-container" id="filter-container">
  <span class="filter-by">Filter by:</span>
  <ul>
  [#list components as component]
    <li>[@cms.component content=component /]</li>
  [/#list]
  </ul>
  <button class="btn-clear-filters"><i class="fa fa-refresh" aria-hidden="true"></i>Reset</button>
</div>
