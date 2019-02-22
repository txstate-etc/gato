[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#list components as component]
  [#if !gf.isEmptyLink(component.link)]
    <li>[@cms.component content=component /]</li>
  [/#if]
[/#list]
[@ifneedsnewbar components def]
	<li class="listItems_add" cms:add="bar"></li>
[/@ifneedsnewbar]
