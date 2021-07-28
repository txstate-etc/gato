[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern">
    [#if !gf.isEmptyString(content.anchorLeft)]
      <div id=${content.anchorLeft}></div>
    [/#if]
    <div class="callout pattern-content ${content.colorLeft!color1} ${content.alignContent!'text-center'}">
      [@callout content.calloutLeft content.titleLeft content.textLeft content.buttonsLeft content.callouthasbackground!false/]
    </div>
    [#if !gf.isEmptyString(content.anchorRight)]
      <div id=${content.anchorRight}></div>
    [/#if]
    <div class="callout pattern-content ${content.colorRight!color2} ${content.alignContent!'text-center'}">
      [@callout content.calloutRight content.titleRight content.textRight content.buttonsRight content.callouthasbackground!false/]
    </div>
  </div>
[/@prebuiltsection]