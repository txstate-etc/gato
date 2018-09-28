[#assign depth = ctx.depth]
[#list components as component]
    [@cms.component content=component contextAttributes={"depth": depth}/]
[/#list]
[#if cmsfn.isEditMode()]
  <div class="faq_add" cms:add="bar"></div>
[/#if]
