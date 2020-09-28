[#if cmsfn.isEditMode()]
<div class="fs-item-list" cms:edit="bar"></div>
[/#if]
[#if content.listitems??]
  [#assign listsize = cmsfn.children(content.listitems)?size]
  [#assign imageCount = 0]
  [#list cmsfn.children(content.listitems) as item]
    [#if item.includeImage?? && item.includeImage == "hasImage"]
      [#assign imageCount = imageCount + 1]
    [/#if]
  [/#list]
  [#if imageCount > (listsize/2)]
    [#assign view="grid-view"]
  [#else]
    [#assign view="list-view"]
    [#if imageCount > 0]
      [#assign showGrid = true]
      [#assign indent = "indent"]
    [/#if]
  [/#if]
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
<div class="filterable-search basic-list ${view!} ${indent!}">
  [@cms.area name="filtergroups" contextAttributes={"description": ctx.description!""}/]
  [@cms.area name="listitems" contextAttributes={"itemLabelClass": "item", "alphabetize": content.alphabetize!"alphaheaders", "alphaBy" : def.parameters.alphaBy!""}/]
</div>
