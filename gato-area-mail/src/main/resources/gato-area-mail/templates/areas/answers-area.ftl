[#list components as component]
  [@cms.component content=component/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="answer-add" cms:add="box"></div>
[/#if]
