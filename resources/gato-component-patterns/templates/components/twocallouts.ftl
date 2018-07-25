[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
<div cms:edit="bar"></div>
<div class="mobilefirst-pattern">
  <div class="callout pattern-content ${content.colorLeft!color1} ${content.alignContent!'text-center'}">
    [@callout content.calloutLeft content.titleLeft content.textLeft content.buttonsLeft/]
  </div>
  <div class="callout pattern-content ${content.colorRight!color2} ${content.alignContent!'text-center'}">
    [@callout content.calloutRight content.titleRight content.textRight content.buttonsRight/]
  </div>
</div>
