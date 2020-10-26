[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern">
    <div class="callout pattern-content single ${content.color!color1} text-center">
      [@callout content.callout content.title content.text content.buttons content.callouthasbackground!false/]
    </div>
  </div>
[/@prebuiltsection]
