[#list components as content]
  [#if content_index != 0] | [/#if]
  [@cms.component content=content/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="link_add" cms:add="box"></div>
[/#if]
