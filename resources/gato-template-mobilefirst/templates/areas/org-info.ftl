[#include "/gato-template/templates/includes/component.ftl"]

[#assign imgClass = (!(ctx.isHome || ctx.hasImage))?then('no-image', '')]

<div class="organization-info ${imgClass}">
  [#if component?has_content]
  <div class="parent-org">
    [@cms.component content=component /]
  </div>
  [/#if]
  [#if cmsfn.isEditMode()]
    <div class="addParentOrg" cms:add="box"></div>
  [/#if]
  <div class="department-title">
   <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
  </div>
</div>
