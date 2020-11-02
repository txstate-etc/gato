[#list components as component]
  [#assign conditions=gf.propertyValues(component.conditions)![]]
  <div class="dependent-question" data-conditions="${conditions?join(",")}">
    [@cms.component content=component contextAttributes={"safeTitle":ctx.formModel.getSafeTitle(cmsfn.asJCRNode(component).identifier)}/]
    [#if cmsfn.isEditMode()]
      [#if conditions?size == 0]
        <div class="conditionalert">
          <i class="fa fa-exclamation-circle"></i>
          <span>No conditions have been selected for this dependent question. It will not appear on your form.</span>
        </div>
      [#else]
        <div class="txst-khan-notice inactivealert">
          This field is hidden based on your current answer.
        </div>
      [/#if]
    [/#if]
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="dependentquestion-add" cms:add="box"></div>
[/#if]
