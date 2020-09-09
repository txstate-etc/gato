[#list components as component]
  [#assign conditions=gf.propertyValues(component.conditions)![]]
  <div class="dependent-question" data-conditions="${conditions?join(",")}">
    [@cms.component content=component contextAttributes={"safeTitle":ctx.formModel.getSafeTitle(cmsfn.asJCRNode(component).identifier)}/]
    [#if conditions?size == 0]
      <div class="txst-khan-notice conditionalert">
        No conditions have been selected for this dependent question. It will not appear on your form.
      </div>
    [/#if]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="dependentquestion-add" cms:add="box"></div>
[/#if]
