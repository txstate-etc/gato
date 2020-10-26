[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern">
  <div class="pattern-content single arrow title-type ${content.color!color1} text-center">
    [#include "/gato-component-patterns/templates/components/common/titlebuttons.ftl"]
  </div>
  </div>
[/@prebuiltsection]
