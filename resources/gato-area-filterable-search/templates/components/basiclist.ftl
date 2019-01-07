[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
<div class="filterable-search">
  <div id="filter-modal">
    [@cms.area name="filtergroups" /]
  </div>
  [@cms.area name="listitems"/]
</div>
