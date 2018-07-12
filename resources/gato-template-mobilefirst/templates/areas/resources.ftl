[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#if cmsfn.isEditMode() && components?size > 0]
  <div class="gato-editor-notice">Using custom resource links. Edit them to your liking or delete them to use Texas State's default resource links.</div>
[/#if]
[#list components as component]
  <li>[@cms.component content=component /]</li>
[/#list]
[@ifneedsnewbar components def]
	<li class="listItems_add" cms:add="bar"></li>
[/@ifneedsnewbar]
