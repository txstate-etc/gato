[#if content.parent_name?has_content]
  [#if cmsfn.isEditMode()]<div class="parentOrg_edit" cms:edit="bar"></div>[/#if]
  <a class="parent_org" href="${gf.filterUrl(content.url!'#')}">${content.parent_name}</a>
[/#if]
