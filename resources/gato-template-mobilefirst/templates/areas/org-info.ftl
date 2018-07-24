[#include "/gato-template/templates/includes/component.ftl"]

[#assign imgClass = (!(ctx.isHome || ctx.hasImage))?then('no-image', '')]

<div class="organization-info ${ctx.isHome?then('arrow', '')} ${imgClass}">
  [#if component?has_content]
  <div class="parent-org">
    [@cms.component content=component /]
  </div>
  [/#if]
  <div class="department-title">
   <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
  </div>
</div>
