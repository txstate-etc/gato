[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div cms:add="bar"></div>
  </div>
[/#if]
[#list components as slide]
  [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", "")} editable=false /]
[/#list]
<i class="fa fa-chevron-circle-left navleft" aria-hidden="true"></i>
<i class="fa fa-chevron-circle-right navright" aria-hidden="true"></i>
