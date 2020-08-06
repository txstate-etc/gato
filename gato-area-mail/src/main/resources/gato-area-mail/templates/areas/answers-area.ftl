[#if cmsfn.isEditMode()]
  <div class="answer-add" cms:add="box"></div>
[/#if]
[#list components as component]
  [@cms.component content=component/]
[/#list]
