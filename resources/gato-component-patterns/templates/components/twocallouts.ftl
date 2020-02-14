[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern">
  <div class="callout pattern-content ${content.colorLeft!color1} ${content.alignContent!'text-center'}">
    [@callout content.calloutLeft content.titleLeft content.textLeft content.buttonsLeft content.callouthasbackground!false/]
  </div>
  <div class="callout pattern-content ${content.colorRight!color2} ${content.alignContent!'text-center'}">
    [@callout content.calloutRight content.titleRight content.textRight content.buttonsRight content.callouthasbackground!false/]
  </div>
</div>
