[#if cmsfn.isEditMode()]
  <div class="dependentquestion-add" cms:add="box"></div>
[/#if]
[#list components as component]
  [#assign conditions=gf.propertyValues(component.conditions)![]]
  <div class="dependent-question" data-conditions="${conditions?join(",")}">
    [@cms.component content=component contextAttributes={"safeTitle":ctx.formModel.getSafeTitle(cmsfn.asJCRNode(component).identifier)}/]
  </div>
[/#list]
