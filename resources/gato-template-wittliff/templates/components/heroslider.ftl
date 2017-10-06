<div class="gato-heroslider ${content.defaultTimer!''}">
  [#if cmsfn.isEditMode()]<div cms:edit class="slider-admin"></div>[/#if]
  [@cms.area name="slides" contextAttributes={"aspect":2.2} /]
  <a class="back" href=""><i class="fa fa-angle-left"></i><span class="visuallyhidden">Previous Slide</span></a>
  <a class="forward" href=""><i class="fa fa-angle-right"></i><span class="visuallyhidden">Next Slide</span></a>
</div>
