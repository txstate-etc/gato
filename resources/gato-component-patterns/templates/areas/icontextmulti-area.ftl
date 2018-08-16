<div class="icontextmulti">
[#list components as component ]
  <div>
    [@cms.component content=component /]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="addIcon" cms:add="box"></div>
[/#if]
</div>
