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
  [#list 1..components?size as idx]
    <li class="${(idx == 1)?string('active', '')}"><a href="#" data-feature-index="${idx - 1}" title="${slide.title!}" aria-label="Go to slide ${idx}"></a></li>
  [/#list]
</ul>
