<div class="calendar-data-error">
  <h2 class="error-title">Error: 500 - INTERNAL SERVER </h2>
  <p class="error-description">Having trouble connecting to the data source. The following calendar is cached and may not be completely accurate</p>
</div>
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