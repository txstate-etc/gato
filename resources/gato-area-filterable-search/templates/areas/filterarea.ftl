<div class="filter-container" id="filter-container">
  FILTER CONTAINER
  <ul>
  [#list components as component]
    <li>[@cms.component content=component /]</li>
  [/#list]
  </ul>
</div>
