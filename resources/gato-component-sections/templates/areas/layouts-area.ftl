[#list components as component]
  <div id="${gf.htmlId(component)}">
    [@cms.component content=component /]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="add-layout" cms:add="box"></div>
[/#if]