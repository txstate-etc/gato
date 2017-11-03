[#include "/gato-template/templates/includes/section.ftl"]
[@sectionLabel ; headerlevel]
  <div class="layout-column full eq-parent${(cmsfn.isEditMode() || gf.hasComponents(content.column1))?string('',' blank')}">
    [@cms.area name="column1" contextAttributes={"sizes":"1200px", "headerlevel":headerlevel}/]
  </div>
[/@sectionLabel]
