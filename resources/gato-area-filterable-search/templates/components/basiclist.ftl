[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#include "/gato-area-filterable-search/templates/includes/viewsettings.ftl"]
<div class="filterable-search" [#if content.includeAlpha]data-enabled-alphabet-filters="${gf.getEnabledAlphabetFilters(content.listitems, "title")}"[/#if]>
  <div id="filter-modal">
    [@cms.area name="filtergroups" /]
  </div>
  [@cms.area name="listitems" contextAttributes={"includeAlphabetFilters":content.includeAlpha}/]
</div>
