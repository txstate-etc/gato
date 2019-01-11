<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="filterable-search-container [#if cmsfn.isEditMode()]filters-open[/#if]">
    <div class="search-container mobile">
      <label for="mobile-search-field" class="visuallyhidden">Search List Items</label>
      <input id="mobile-search-field" type="search" class="fs-search" placeholder="Search"/>
      <button><i class="fa fa-search" aria-hidden="true"><span class="visuallyhidden">Start Search</span></i></button>
    </div>
      [#if component?has_content]
          [@cms.component content=component /]
      [/#if]
    </div>
  </div>
</div>
