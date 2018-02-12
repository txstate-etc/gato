[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 10)?string('feature_add','feature_max')}" cms:add="bar"></div>
  </div>
[/#if]
<div class="slides">
  <div class="arrow-container"></div>
  [#list components as slide]
    [@cms.component content=slide editable=false /]
  [/#list]
</div>
