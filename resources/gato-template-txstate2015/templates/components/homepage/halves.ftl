<div id="spotlight" class="content-row comp two-col">
  <div class="content-row-content">
    <div class="content-row-column col-left eq-parent">
      [#assign hlevel = 2]
      [#if content.titleleft?has_content]<h2 class="column-title">${content.titleleft}</h2>[#assign hlevel=3][/#if]
      [@cms.area name="column1" contextAttributes={"sizes":"600px", "headerlevel":hlevel}/]
    </div><div class="content-row-column col-right eq-parent">
      [#assign hlevel = 2]
      [#if content.titleright?has_content]<h2 class="column-title">${content.titleright}</h2>[#assign hlevel=3][/#if]
      [@cms.area name="column2" contextAttributes={"sizes":"600px", "headerlevel":hlevel}/]
    </div>
  </div>
</div>
