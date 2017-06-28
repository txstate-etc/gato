[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#assign maxwidth = def.parameters.maxitemwidth!"100vw"]

<ul class="gato-flex-container">
  [#list components as component]
    <li class="gato-flex-item">
      [@cms.component content=component contextAttributes={"maxwidth":maxwidth} /]
    </li>
  [/#list]
  [@ifneedsnewbar components def]
  	<li class="gato-flex-item" cms:add="bar"></li>
  [/@ifneedsnewbar]
</div>
