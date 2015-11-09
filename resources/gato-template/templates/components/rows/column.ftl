[#list components as component]
    [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="column_add" cms:add="box"></div>
[/#if]