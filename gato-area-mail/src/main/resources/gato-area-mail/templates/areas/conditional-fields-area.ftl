<div class="conditional-questions">
  [#list components as component]
    ${ctx.request.setAttribute("safeTitle", model.getSafeTitle(cmsfn.asJCRNode(component).identifier))}
    [@cms.component content=component /]
  [/#list]
  [#if cmsfn.isEditMode()]
    <div class="mail_add" cms:add="box"></div>
  [/#if]
</div>
