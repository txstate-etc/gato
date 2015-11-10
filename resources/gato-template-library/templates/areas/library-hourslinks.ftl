[#list components as component]
    [#if component_index > 0]
        |
    [/#if]
    [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="link_add" cms:add="box"></div>
[/#if]