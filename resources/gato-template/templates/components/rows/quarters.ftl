[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel ; headerlevel]
  <div class="layout-column quarters eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column1))?string('',' blank')}">
    [@cms.area name="column1" contextAttributes={"sizes":"600px", "headerlevel":headerlevel}/]
  </div><div class="layout-column quarters eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column2))?string('',' blank')}">
    [@cms.area name="column2" contextAttributes={"sizes":"600px", "headerlevel":headerlevel}/]
  </div><div class="layout-column quarters eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column3))?string('',' blank')}">
    [@cms.area name="column3" contextAttributes={"sizes":"600px", "headerlevel":headerlevel}/]
  </div><div class="layout-column quarters eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column4))?string('',' blank')}">
    [@cms.area name="column4" contextAttributes={"sizes":"600px", "headerlevel":headerlevel}/]
  </div>
[/@sectionLabel]
