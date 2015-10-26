[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div cms:add="bar"></div>
  </div>
[/#if]
[#list components as slide]
  [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", ""), "colorClass": "color"+(slide_index+1)} editable=false /]
[/#list]
<a href="#" class="fa fa-chevron-circle-left navleft" aria-label="Previous Slide"></a>
<a href="#" class="fa fa-chevron-circle-right navright" aria-label="Next Slide"></a>
<ul class="pages">
  [#list components as slide]
    <li class="${(slide_index == 0)?string('active', '')}"><a href="#" data-feature-index="${slide_index}" title="${slide.title!}" aria-label="Go to slide ${slide_index + 1}"></a></li>
  [/#list]
</ul>
