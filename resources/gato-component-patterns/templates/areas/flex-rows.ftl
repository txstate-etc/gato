<div class="flex-row">
[#list components as component ]
  [#if cmsfn.metaData(component, "mgnl:template") == "gato-template:components/richeditor"]
    [#assign flexGrow = 'flex-grow: 2']
  [#else]
    [#assign flexGrow = 'flex-grow: 1']
  [/#if]
  <div class="content-item" style="${flexGrow}">
    [@cms.component content=component contextAttributes={"colorClass": ctx.colorClass}/]
  </div>
[/#list]
</div>

[#if cmsfn.isEditMode()]
  <li class="add content-item" cms:add="box"></li>
[/#if]