<div class="section-masonry ${cmsfn.isEditMode()?string('edit', '')}">
  <div class="masonry-sizer"></div>
  [#list components as component]
    [#assign cardsize = content.cardsize!'small']
    [#if ctx.cardsize=='small']
      [#assign sizes="400px"]
    [#else]
      [#assign sizes="800px"]
    [/#if]
    [@cms.component content=component contextAttributes={"cardsize":cardsize, "sizes":sizes}/]
  [/#list]
  [#if cmsfn.isEditMode()]
    <div class="gato-card gato-card-add medium" cms:add="box"></div>
  [/#if]
</div>
