[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if cmsfn.isEditMode()]<div cms:edit></div>[/#if]
[#if !gf.isEmptyString(content.title)]
  [@h2]<span id="${gf.uuidToHtmlId(content.@id)}-title">${content.title}</span>[/@h2]
[#else]
  <span class="visuallyhidden" id="${gf.uuidToHtmlId(content.@id)}-title">Image Gallery</span>
[/#if]
[#if content.caption?has_content]
  <p>${content.caption}</p>
[/#if]
[@cms.area name="images" contextAttributes={"galleryId": gf.uuidToHtmlId(content.@id) + "-title"}/]
[#include "/gato-lib/templates/includes/pswpmodal.ftl"]
