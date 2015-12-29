[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#list components as component]
    <div class="gato-section eq-parent">
        [@cms.component content=component /]
    </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="mainContent_add" cms:add="box"></div>
[/#if]
