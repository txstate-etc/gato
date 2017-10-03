[#if component??]
    [@cms.component content=component /]
[/#if]
[#if cmsfn.isEditMode()]
<div class="addHeroSlider">
  <div cms:add="box"></div>
</div>
[/#if]