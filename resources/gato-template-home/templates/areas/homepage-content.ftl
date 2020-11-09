[#list components as component]
  [#assign hasBackgroundClass = (component.showBackgroundColor!false)?string(' has-background', '')]
    [@cms.component content=component contextAttributes={"hideSidebar":true, "hasBackground":hasBackgroundClass}/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="mobilefirst_component_add" cms:add="box"></div>
[/#if]
