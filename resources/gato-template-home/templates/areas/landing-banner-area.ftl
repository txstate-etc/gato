[#include "/gato-template/templates/includes/component.ftl"]
[#assign hasImage = component?has_content && component.image?has_content /]

<div class="banner-section ${hasImage?then('', 'noimage')}">
  <div class="banner">
    [#if component??]
        [@cms.component content=component /]
    [#else]
    <div class="banner-image tall">
      <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/default_banner.jpg" alt=""  width="2000" height="1333">
    </div>
    [/#if]
    [#if cmsfn.isEditMode()]
    <div class="addBannerImage">
      <div cms:add="box"></div>
    </div>
    [/#if]
  </div>
</div>
