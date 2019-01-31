<div class="gato-section-full full-width filterable-search-intro [#if component?has_content]${(component.showBackgroundColor!false)?then(' has-background','')}[/#if]">
  <div class="gato-section-centered">
    <div class="gato-section eq-parent">
    [#if component?has_content]
    [@cms.component content=component /]
    [#else]
      [#if cmsfn.isEditMode()]
        <div class="filterable-search-intro-add" cms:add="box"></div>
      [/#if]
    [/#if]
    </div>
  </div>
</div>
