[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel ; headerlevel]
  <div class="layout-column halves eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column1))?string('',' blank')}">
    [@cms.area name="column1" contextAttributes={"sizes":"600px", "headerlevel":headerlevel}/]
  </div><div class="layout-column halves eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column2))?string('',' blank')}">
    [@cms.area name="column2" contextAttributes={"sizes":"600px", "headerlevel":headerlevel}/]
  </div>
[/@sectionLabel]
