[#list components as component]
  [@cms.component content=component contextAttributes={"scale":ctx.scale, "formModel": ctx.formModel}/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="likertquestion-add" cms:add="box"></div>
[/#if]