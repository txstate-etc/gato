<div class="icontextmulti">
[#list components as component ]
  <div class="icontext-container">
    [@cms.component content=component contextAttributes={"colorClass": ctx.colorClass}/]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="addIcon" cms:add="box"></div>
[/#if]
</div>
