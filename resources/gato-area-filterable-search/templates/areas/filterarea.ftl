<div class="filter-container" id="filter-container">
  <div class="search-container">
    <label for="search-field" class="visuallyhidden">Search List Items</label>
    <input id="search-field" type="search" class="fs-search" placeholder="Search"/>
    <button><i class="fa fa-search"></i></button>
  </div>
  <div class="filter-groups">
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
</div>
