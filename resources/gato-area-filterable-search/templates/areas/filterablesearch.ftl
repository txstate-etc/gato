<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="filterable-search-container [#if cmsfn.isEditMode()]filters-open[/#if]">
    <div class="search-container mobile">
      <label for="mobile-search-field" class="visuallyhidden">Search ${component.description!"List Items"}</label>
      <input id="mobile-search-field" type="search" class="fs-search" placeholder="Search ${component.description!""}"/>
      <button class="btn-search-list-items"><i class="fa fa-search" aria-hidden="true"></i><span class="visuallyhidden">Start Search</span></button>
    </div>
      [#if component?has_content]
          [@cms.component content=component contextAttributes={"description": component.description!""}/]
      [/#if]
    </div>
  </div>
</div>
