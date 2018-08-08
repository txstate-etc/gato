[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#if cmsfn.isEditMode() && components?size > 0]
  <div class="gato-editor-notice">Using this site's resource links. Delete the Link(s) below and the Texas State default resource links will appear.</div>
[/#if]
[#list components as component]
  <li>[@cms.component content=component /]</li>
[/#list]
[@ifneedsnewbar components def]
	<li class="listItems_add" cms:add="bar"></li>
[/@ifneedsnewbar]
