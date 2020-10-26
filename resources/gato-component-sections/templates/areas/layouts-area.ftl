[#list components as component]
  <div id="${gf.htmlId(component)}" class="gato-section eq-parent">
    [@cms.component content=component /]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="add-layout" cms:add="box"></div>
[/#if]