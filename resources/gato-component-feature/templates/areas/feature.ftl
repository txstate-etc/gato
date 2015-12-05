[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 10)?string('feature_add','feature_max')}" cms:add="bar"></div>
  </div>
[/#if]
<div class="slides">
  [#assign ratios = [] /]
  [#list components as slide]
    [#assign r = gf.getImgAspectRatio(slide.image) /]
    [#assign ratios = ratios + [r] /]
  [/#list]

  [#if ratios?size == 0 || ctx.iam2009tmpl!false]
    [#assign aspectratio = 16.0/9.0]
  [#else]
    [#assign aspectratio = (ratios?sort)[ratios?size / 2]]
  [/#if]

  [#list components as slide]
    [#assign colorClass = ctx.colorClass /]
    [#if !colorClass?matches("color[1-7]")]
      [#assign colorClass = "color${(slide_index % 7)+1}" /]
    [/#if]
    [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", ""), "colorClass": colorClass, "aspectratio": aspectratio} editable=false /]
  [/#list]
</div>
