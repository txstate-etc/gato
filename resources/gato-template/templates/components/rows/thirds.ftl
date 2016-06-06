[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel]
  <div class="layout-column thirds eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column1))?string('',' blank')}">
    [@cms.area name="column1"/]
  </div><div class="layout-column thirds eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column2))?string('',' blank')}">
    [@cms.area name="column2"/]
  </div><div class="layout-column thirds eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column3))?string('',' blank')}">
    [@cms.area name="column3"/]
  </div>
[/@sectionLabel]
