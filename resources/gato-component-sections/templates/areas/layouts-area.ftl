[#list components as component]
  [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="add-layout" cms:add="box"></div>
[/#if]