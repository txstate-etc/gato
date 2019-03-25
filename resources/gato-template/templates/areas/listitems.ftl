[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#list components as component]
  [#assign content][@cms.component content=component /][/#assign]
  [#if !cmsfn.isEditMode() && component?parent == "links"]
    [#--Filter out empty links--]
    [#if !gf.isEmptyString(component.link)]
      <li>${content}</li>
    [/#if]  
  [#else]
    <li>${content}</li>
  [/#if]

[/#list]
[@ifneedsnewbar components def]
	<li class="listItems_add" cms:add="bar"></li>
[/@ifneedsnewbar]
