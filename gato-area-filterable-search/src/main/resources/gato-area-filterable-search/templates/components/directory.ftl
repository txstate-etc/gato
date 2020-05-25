[#if cmsfn.isEditMode()]
<div class="fs-people-list" cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
[#assign view="list-view"]
[#if content.view! == "grid" || (content.view! == "both" && content.both == "grid")]
  [#assign view="grid-view"]
[/#if]

[#if content.listitems??]
[#assign people = model.getPeople(cmsfn.children(content.listitems))]
[/#if]

<div class="filterable-search directory ${view}">
  [@cms.area name="filtergroups" /]
  [@cms.area name="listitems" contextAttributes={"itemLabelClass": "person", "alphabetize": content.alphabetize!"alphaheaders", "alphaBy" : def.parameters.alphaBy!"", "showbiography":content.showbiography!false,"showresearch":content.showresearch!false,"showteaching":content.showteaching!false }/]
</div>
