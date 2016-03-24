[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 10)?string('feature_add','feature_max')}" cms:add="bar"></div>
  </div>
[/#if]
<div class="slides">
  [#assign aspectratio = 16.0/9.0]
  
  [#list components as slide]
    [#assign colorClass = ctx.colorClass /]
    [#if !colorClass?matches("color[1-7]")]
      [#assign colorClass = "color${(slide_index % 7)+1}" /]
    [/#if]
    [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", ""), "colorClass": colorClass, "aspectratio": aspectratio} editable=false /]
  [/#list]
</div>
