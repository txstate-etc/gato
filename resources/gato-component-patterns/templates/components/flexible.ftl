[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection hasBackground=content.showBackgroundColor!false]
  [#if cmsfn.isEditMode()]<div class="properties-edit" cms:edit></div>[/#if]
  <div class="mobilefirst-pattern flexible-pattern">
    <div class="flexible">
    [@cms.area name="flex-top"/]
    [@cms.area name="flex-bottom"/]
    </div>
  </div>
[/@prebuiltsection]