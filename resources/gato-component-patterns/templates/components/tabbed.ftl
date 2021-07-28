[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[#if !gf.isEmptyString(content.anchor)]
    <div id=${content.anchor}></div>
[/#if]
[@prebuiltsection]
  [#assign mobileImage = getMobileImage(content.image, content.mobileImage!)]
  [#if cmsfn.isEditMode()]<div class="properties-edit" cms:edit></div>[/#if]
    [@cms.area name="tabs" contextAttributes={"overlayPosition": content.overlayPosition, "overlayColor": content.color, "desktopImage": content.image, "mobileImage": mobileImage}/]
[/@prebuiltsection]