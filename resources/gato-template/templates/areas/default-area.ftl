[#list components as component]
    [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="${ctx.getAttribute('bar_class')}" cms:add="box"></div>
[/#if]