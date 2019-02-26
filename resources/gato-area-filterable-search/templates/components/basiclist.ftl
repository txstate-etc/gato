[#if cmsfn.isEditMode()]
<div class="fs-item-list" cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
[#assign view="list-view"]
[#if content.view == "grid" || (content.view == "both" && content.both == "grid")]
  [#assign view="grid-view"]
[/#if]
[#assign defaultImgClass = (content.useDefaultImage?then('', 'no-default-img'))]
<div class="filterable-search ${view} ${defaultImgClass}">
  [@cms.area name="filtergroups" contextAttributes={"description": ctx.description!""}/]
  [@cms.area name="listitems" contextAttributes={"itemLabelClass": "item", "alphabetize": content.alphabetize!"alphaheaders", "alphaBy" : def.parameters.alphaBy!""}/]
</div>
