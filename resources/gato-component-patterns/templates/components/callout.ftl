[#include "/gato-component-patterns/templates/components/common/callout.ftl"]
<div cms:edit="bar"></div>
<div class="mobilefirst-pattern">
  <div class="callout pattern-content single ${content.color!color1} text-center">
    [@callout content.callout content.title content.text content.buttons/]
  </div>
</div>
