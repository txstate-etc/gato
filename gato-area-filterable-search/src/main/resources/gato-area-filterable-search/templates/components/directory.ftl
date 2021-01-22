[#if cmsfn.isEditMode()]
<div class="fs-people-list" cms:edit="bar"></div>
[/#if]
[#assign viewOption = content.defaultView!'grid']
[#if viewOption = 'list']
  [#assign view = 'list-view']
  [#assign showGrid = true]
[#else]
  [#assign view = 'grid-view']
  [#assign showList = true]
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]

[#if content.listitems??]
[#assign people = model.getPeople(cmsfn.children(content.listitems))]
[/#if]

<div class="filterable-search directory ${view}">
  [@cms.area name="filtergroups" /]
  [@cms.area name="listitems" contextAttributes={"itemLabelClass": "person", "alphabetize": content.alphabetize!"alphaheaders", "alphaBy" : def.parameters.alphaBy!"", "showbiography":content.showbiography!false,"showresearch":content.showresearch!false,"showteaching":content.showteaching!false }/]
</div>
