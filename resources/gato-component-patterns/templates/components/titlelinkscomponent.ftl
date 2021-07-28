[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[#if !gf.isEmptyString(content.anchor)]
  <div id=${content.anchor}></div>
[/#if]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="mobilefirst-pattern">
  <div class="pattern-content single arrow title-type ${content.color!color1} text-center">
    [#include "/gato-component-patterns/templates/components/common/titlelinks.ftl"]
  </div>
  </div>
[/@prebuiltsection]
