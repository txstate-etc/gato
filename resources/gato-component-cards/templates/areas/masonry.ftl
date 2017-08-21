<div class="section-masonry">
  <div class="masonry-sizer"></div>
  <div class="masonry-gutter"></div>
  [#list components as component]
    [#assign cardsize = component.cardsize!'small']
    [#if cardsize=='small']
      [#assign sizes="400px"]
    [#else]
      [#assign sizes="800px"]
    [/#if]
    [@cms.component content=component contextAttributes={"cardsize":cardsize, "sizes":sizes}/]
  [/#list]
  [#if cmsfn.isEditMode()]
    <div class="gato-card gato-card-add small" cms:add="box"></div>
  [/#if]
</div>
