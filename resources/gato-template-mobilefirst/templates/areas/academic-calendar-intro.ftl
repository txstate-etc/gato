[#if component?has_content]
  <div class="gato-section-full full-width">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [@cms.component content=component/]
      </div>
    </div>
  </div>
[/#if]
[#if cmsfn.isEditMode()]
  <div cms:add="box"></div>
[/#if]