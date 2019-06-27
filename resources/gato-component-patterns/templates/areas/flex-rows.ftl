<div class="flex-row">
  [#list components as component ]
  <div class="content-item" style="">
    [@cms.component content=component contextAttributes={"colorClass": ctx.colorClass}/]
  </div>
[/#list]
  [#if cmsfn.isEditMode()]
    <li class="add content-item" cms:add="box"></li>
  [/#if]
</div>

