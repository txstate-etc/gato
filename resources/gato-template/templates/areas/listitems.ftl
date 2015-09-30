[#list components as component]
  <li>[@cms.component content=component /]</li>
[/#list]
[#if (def.maxComponents!100) > components?size && (def.type == "list" || (def.type="single" && components?size == 0)) && cmsfn.isEditMode()]
	<li class="gato-flex-item" cms:add="bar"></li>
[/#if]
