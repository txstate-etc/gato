<ul class="gato-gallery txst-gallery">
  [#list components as component ]
    <li class="gato-gallery-image txst-gallery-image">
      [@cms.component content=component contextAttributes={"imgIndex": component?index + 1, "galleryId": ctx.galleryId}/]
    </li>
  [/#list]
  [#if cmsfn.isEditMode()]
    <li class="add gato-gallery-image txst-gallery-image" cms:add="box"></li>
  [/#if]
</ul>
