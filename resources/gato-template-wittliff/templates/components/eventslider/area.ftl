[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 4)?string('feature_add','feature_max')}" cms:add="bar"></div>
  </div>
[/#if]
<div class="eventslider-slides">
  [#list components as slide]
    [@cms.component content=slide editable=false contextAttributes={"isFirst":slide?is_first}/]
  [/#list]
  [#if components?size > 1]
    <a class="arrow left" href="#"><i class="fa fa-angle-left" aria-hidden="true"></i><span class="visuallyhidden">Previous Slide</span></a>
    <a class="arrow right" href="#"><i class="fa fa-angle-right" aria-hidden="true"></i><span class="visuallyhidden">Next Slide</span></a>
  [/#if]
</div>
