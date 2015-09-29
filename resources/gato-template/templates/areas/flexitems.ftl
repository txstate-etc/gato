[#assign maxwidth = def.parameters.maxitemwidth!"100vw"]

<ul class="gato-flex-container">
  [#list components as component]
    <li class="gato-flex-item">
      [@cms.component content=component contextAttributes={"maxwidth":maxwidth} /]
    </li>
  [/#list]
  [#if (def.maxComponents!100) > components?size && (def.type == "list" || (def.type="single" && components?size == 0)) && cmsfn.isEditMode()]
  	<li class="gato-flex-item" cms:add="bar"></li>
  [/#if]
</div>
