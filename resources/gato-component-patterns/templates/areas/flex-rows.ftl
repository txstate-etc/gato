[#list components as component ]
<div class="content-item" style="">
  [@cms.component content=component contextAttributes={"colorClass": ctx.colorClass}/]
</div>
[/#list]
[#if cmsfn.isEditMode()]
  <div cms:add="box"></div>
[/#if]