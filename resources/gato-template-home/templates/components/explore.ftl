[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if cmsfn.isEditMode()]<div cms:edit></div>[/#if]
[#if content.title?has_content]
<div class="explore">
  <div class="explore-bar">
    [@h2 class="explore-title"]${content.title}[/@h2]
  </div>
</div>
[/#if]
[#if content.caption?has_content]
  <p>${content.caption}</p>
[/#if]
<div class="explore-flex">
[@cms.area name="exploreLeft"/]
[@cms.area name="exploreRight"/]
</div>
[#include "/gato-lib/templates/includes/pswpmodal.ftl"]
