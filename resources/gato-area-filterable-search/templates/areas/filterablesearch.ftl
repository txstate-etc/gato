<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="filterable-search-container [#if cmsfn.isEditMode()]filters-open[/#if]">
      [#if component?has_content]
          [@cms.component content=component /]
      [/#if]
    </div>
  </div>
</div>
