[#list components as component]
  <div class="column_paragraph">
    [@cms.component content=component /]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="column_add" cms:add="box"></div>
[/#if]
