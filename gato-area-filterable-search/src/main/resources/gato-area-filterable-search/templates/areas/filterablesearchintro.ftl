[#if component?has_content]
<div class="gato-section-full full-width filterable-search-intro [#if component?has_content]${(component.showBackgroundColor!false)?then(' has-background','')}[/#if]">
  <div class="gato-section-centered">
    <div class="gato-section eq-parent">
    [@cms.component content=component /]
    </div>
  </div>
</div>
[/#if]
[#if cmsfn.isEditMode()]
  <div class="filterable-search-intro-add" cms:add="box"></div>
[/#if]
