[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#list components as component]
  [@cms.component content=component contextAttributes={"hasThereBeenSectionWithTitleBefore": hasThereBeenSectionWithTitleBefore(components, component?counter)!false}/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="mobilefirst_component_add" cms:add="box"></div>
[/#if]
