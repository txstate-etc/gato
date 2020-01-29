<div class="gato-section-full">
[#if cmsfn.isEditMode()]
  <div class="filterable-search-add" cms:add="box"></div>
[/#if]
  <div class="gato-section-centered">
    <div class="filterable-search-container [#if cmsfn.isEditMode()]filters-open[/#if]">
    <div class="search-container mobile">
      <label for="mobile-search-field" class="visuallyhidden">Search [#if component?has_content]${component.description!"List Items"}[/#if]</label>
      <input id="mobile-search-field" type="search" class="fs-search" placeholder="Search [#if component?has_content]${component.description!""}[/#if]"/>
      <button class="btn-clear-search-field"><i class="fa fa-times" aria-hidden="true"></i><span class="visuallyhidden">Clear Search Text</span></button>
      <button class="btn-search-list-items"><i class="fa fa-search" aria-hidden="true"></i><span class="visuallyhidden">Start Search</span></button>
    </div>
      [#if component?has_content]
          [@cms.component content=component contextAttributes={"description": component.description!""}/]
      [/#if]
    </div>
  </div>
</div>
