[#list components as content]
  [#-- why do we want to do this? --]
  [#if content_index != 0]
    [@cms.component content=content/]
  [/#if]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="link_add" cms:add="box"></div>
[/#if]