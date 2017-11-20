<div id="spotlight" class="content-row comp three-col">
  <div class="content-row-content">
    <div class="content-row-column eq-parent">
      [#if content.titleleft?has_content]<h2 class="column-title">${content.titleleft}</h2>[/#if]
      [@cms.area name="column1" contextAttributes={"sizes":"400px", "headerlevel":2}/]
    </div><div class="content-row-column eq-parent">
      [#if content.titlemiddle?has_content]<h2 class="column-title">${content.titlemiddle}</h2>[/#if]
      [@cms.area name="column2" contextAttributes={"sizes":"400px", "headerlevel":2}/]
    </div><div class="content-row-column eq-parent">
      [#if content.titleright?has_content]<h2 class="column-title">${content.titleright}</h2>[/#if]
      [@cms.area name="column3" contextAttributes={"sizes":"400px", "headerlevel":2}/]
    </div>
  </div>
</div>
