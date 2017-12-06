<div class="spotlight content-row comp">
  <div class="content-row-content">
    <div class="content-row-column col-solo eq-parent">
      [#assign hlevel = 2]
      [#if content.titleleft?has_content]<h2 class="column-title">${content.titleleft}</h2>[#assign hlevel=3][/#if]
      [@cms.area name="column1" contextAttributes={"sizes":"600px", "headerlevel":hlevel}/]
    </div>
  </div>
</div>
