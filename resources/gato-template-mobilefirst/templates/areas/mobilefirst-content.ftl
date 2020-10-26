[#list components as component]
    [@cms.component content=component contextAttributes={"hideSidebar":true}/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="mobilefirst_component_add" cms:add="box"></div>
[/#if]
