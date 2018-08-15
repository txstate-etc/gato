[#if cmsfn.isEditMode()]<div cms:edit></div>[/#if]
[#if content.title?has_content]
  <h2 class="image-gallery-title">${content.title}</h2>
[/#if]
[@cms.area name="images"/]
[#include "/gato-lib/templates/includes/pswpmodal.ftl"]
