[#if cmsfn.isEditMode()]
<div class="fs-people-list" cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
<div class="filterable-search">
  [@cms.area name="filtergroups" /]
  [@cms.area name="listitems" contextAttributes={"itemLabelClass": "person", "alphabetize": content.alphabetize!"alphaheaders", "alphaBy" : def.parameters.alphaBy!""}/]
</div>
