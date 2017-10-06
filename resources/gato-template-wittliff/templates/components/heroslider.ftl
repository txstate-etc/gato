<div class="gato-heroslider ${content.defaultTimer!''}">
  [#if cmsfn.isEditMode()]<div cms:edit class="slider-admin"></div>[/#if]
  [@cms.area name="slides" contextAttributes={"aspect":2.2} /]
</div>
