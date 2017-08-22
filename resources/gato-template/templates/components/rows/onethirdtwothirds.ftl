[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel]
  <div class="layout-column onethird eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column1))?string('',' blank')}">
    [@cms.area name="column1" contextAttributes={"sizes":"600px"}/]
  </div><div class="layout-column twothirds eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column2))?string('',' blank')}">
    [@cms.area name="column2" contextAttributes={"sizes":"800px"}/]
  </div>
[/@sectionLabel]
