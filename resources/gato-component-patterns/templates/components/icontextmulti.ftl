[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection hasBackground=content.showBackgroundColor!false]
[#if cmsfn.isEditMode()]
<div class="properties-edit" cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern">
  <div class="pattern-content icontext-pattern single text-center">
    [@cms.area name="iconList" contextAttributes={"colorClass":content.color!}/]
  </div>
</div>
[/@prebuiltsection]