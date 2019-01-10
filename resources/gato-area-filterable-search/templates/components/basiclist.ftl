[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
<div class="filterable-search">
  [@cms.area name="filtergroups" /]
  [@cms.area name="listitems"/]
</div>
