[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
<div class="filterable-search">
  [@cms.area name="filtergroups" contextAttributes={"description": ctx.description!""}/]
  [@cms.area name="listitems" contextAttributes={"alphabetize": content.alphabetize!"alphaheaders", "alphaBy" : def.parameters.alphaBy!""}/]
</div>
