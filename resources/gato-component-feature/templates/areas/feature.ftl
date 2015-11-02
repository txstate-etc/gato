[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div cms:add="bar"></div>
  </div>
[/#if]
<div class="gato-feature-slides">
  [#list components as slide]
    [#assign colorClass = ctx.colorClass /]
    [#if !colorClass?matches("color[1-7]")]
      [#assign colorClass = "color${slide_index+1}" /]
    [/#if]
    [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", ""), "colorClass": colorClass} editable=false /]
  [/#list]
</div>
