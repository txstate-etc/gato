[#if components?has_content]
  <div class="flex-row gato-section-centered">
  [#list components as component ]
  [#include "/gato-component-patterns/templates/includes/flexible-logic.ftl"]
    <div class="content-item ${type!} ${orientation}" style="${flexGrow!}">
      [@cms.component content=component contextAttributes={"orientation" : orientation}/]
    </div>
  [/#list]
  </div>
[/#if]  

[#if cmsfn.isEditMode()]
  <li class="add" cms:add="box"></li>
[/#if]